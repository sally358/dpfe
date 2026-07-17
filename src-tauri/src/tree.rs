use postflop_solver::*;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

#[inline]
fn action_to_string(action: Action) -> String {
    match action {
        Action::Fold => "Fold:0".to_string(),
        Action::Check => "Check:0".to_string(),
        Action::Call => "Call:0".to_string(),
        Action::Bet(amount) => format!("Bet:{amount}"),
        Action::Raise(amount) => format!("Raise:{amount}"),
        Action::AllIn(amount) => format!("Allin:{amount}"),
        _ => unreachable!(),
    }
}

#[inline]
fn encode_action(action: Action) -> String {
    match action {
        Action::Fold => "F".to_string(),
        Action::Check => "X".to_string(),
        Action::Call => "C".to_string(),
        Action::Bet(amount) => format!("B{amount}"),
        Action::Raise(amount) => format!("R{amount}"),
        Action::AllIn(amount) => format!("A{amount}"),
        _ => unreachable!(),
    }
}

fn encode_line(line: &[Action]) -> String {
    let mut flag = 0;
    let mut encoded = String::new();

    if line.is_empty() {
        return "(Root)".to_string();
    }

    for &action in line {
        if !encoded.is_empty() {
            let delimiter = if flag == 2 { "|" } else { "-" };
            flag = if flag == 2 { 0 } else { flag };
            encoded.push_str(delimiter);
        }
        match action {
            Action::Check => flag += 1,
            Action::Call => flag = 2,
            _ => flag = 0,
        }
        encoded.push_str(&encode_action(action));
    }

    encoded
}

#[inline]
fn decode_action(action: &str) -> Action {
    match action {
        "F" => Action::Fold,
        "X" => Action::Check,
        "C" => Action::Call,
        _ => {
            let mut chars = action.chars();
            let first_char = chars.next().unwrap();
            let amount = chars.as_str().parse().unwrap();
            match first_char {
                'B' => Action::Bet(amount),
                'R' => Action::Raise(amount),
                'A' => Action::AllIn(amount),
                _ => unreachable!(),
            }
        }
    }
}

pub fn default_action_tree() -> ActionTree {
    let tree_config = TreeConfig {
        starting_pot: 1,
        effective_stack: 1,
        ..Default::default()
    };
    ActionTree::new(tree_config).unwrap()
}

#[tauri::command]
pub fn tree_new(
    tree_state: tauri::State<Mutex<ActionTree>>,
    board_len: i32,
    starting_pot: i32,
    effective_stack: i32,
    donk_option: bool,
    oop_flop_bet: String,
    oop_flop_raise: String,
    oop_turn_bet: String,
    oop_turn_raise: String,
    oop_turn_donk: String,
    oop_river_bet: String,
    oop_river_raise: String,
    oop_river_donk: String,
    ip_flop_bet: String,
    ip_flop_raise: String,
    ip_turn_bet: String,
    ip_turn_raise: String,
    ip_river_bet: String,
    ip_river_raise: String,
    add_allin_threshold: f64,
    force_allin_threshold: f64,
    merging_threshold: f64,
    added_lines: String,
    removed_lines: String,
) -> bool {
    let initial_state = match board_len {
        len if len <= 3 => BoardState::Flop,
        4 => BoardState::Turn,
        5 => BoardState::River,
        _ => panic!("Invalid board length"),
    };

    let config = TreeConfig {
        initial_state,
        starting_pot,
        effective_stack,

        is_icm: false,
        icm_stack_oop: 0,
        icm_stack_ip: 0,
        icm_payouts: vec![],
        icm_stacks: vec![],

        rake_rate: 0.0,
        rake_cap: 0.0,
        flop_bet_sizes: [
            BetSizeOptions::try_from((oop_flop_bet.as_str(), oop_flop_raise.as_str())).unwrap(),
            BetSizeOptions::try_from((ip_flop_bet.as_str(), ip_flop_raise.as_str())).unwrap(),
        ],
        turn_bet_sizes: [
            BetSizeOptions::try_from((oop_turn_bet.as_str(), oop_turn_raise.as_str())).unwrap(),
            BetSizeOptions::try_from((ip_turn_bet.as_str(), ip_turn_raise.as_str())).unwrap(),
        ],
        river_bet_sizes: [
            BetSizeOptions::try_from((oop_river_bet.as_str(), oop_river_raise.as_str())).unwrap(),
            BetSizeOptions::try_from((ip_river_bet.as_str(), ip_river_raise.as_str())).unwrap(),
        ],
        turn_donk_sizes: match donk_option {
            false => None,
            true => DonkSizeOptions::try_from(oop_turn_donk.as_str()).ok(),
        },
        river_donk_sizes: match donk_option {
            false => None,
            true => DonkSizeOptions::try_from(oop_river_donk.as_str()).ok(),
        },
        add_allin_threshold,
        force_allin_threshold,
        merging_threshold,
    };

    let mut tree = ActionTree::new(config).unwrap();

    if !added_lines.is_empty() {
        for line in added_lines.split(',') {
            let line = line
                .split(&['-', '|'][..])
                .map(decode_action)
                .collect::<Vec<_>>();
            if tree.add_line(&line).is_err() {
                return false;
            }
        }
    }

    if !removed_lines.is_empty() {
        for line in removed_lines.split(',') {
            let line = line
                .split(&['-', '|'][..])
                .map(decode_action)
                .collect::<Vec<_>>();
            if tree.remove_line(&line).is_err() {
                return false;
            }
        }
    }

    *tree_state.lock().unwrap() = tree;
    true
}

#[tauri::command]
pub fn tree_added_lines(tree_state: tauri::State<Mutex<ActionTree>>) -> String {
    let tree = tree_state.lock().unwrap();
    tree.added_lines()
        .iter()
        .map(|l| encode_line(l))
        .collect::<Vec<_>>()
        .join(",")
}

#[tauri::command]
pub fn tree_removed_lines(tree_state: tauri::State<Mutex<ActionTree>>) -> String {
    let tree = tree_state.lock().unwrap();
    tree.removed_lines()
        .iter()
        .map(|l| encode_line(l))
        .collect::<Vec<_>>()
        .join(",")
}

#[tauri::command]
pub fn tree_invalid_terminals(tree_state: tauri::State<Mutex<ActionTree>>) -> String {
    let tree = tree_state.lock().unwrap();
    tree.invalid_terminals()
        .iter()
        .map(|l| encode_line(l))
        .collect::<Vec<_>>()
        .join(",")
}

#[tauri::command]
pub fn tree_actions(tree_state: tauri::State<Mutex<ActionTree>>) -> Vec<String> {
    let tree = tree_state.lock().unwrap();
    tree.available_actions()
        .unpackage_all()
        .iter()
        .cloned()
        .map(action_to_string)
        .collect()
}

#[tauri::command]
pub fn tree_is_terminal_node(tree_state: tauri::State<Mutex<ActionTree>>) -> bool {
    let tree = tree_state.lock().unwrap();
    tree.is_terminal_node()
}

#[tauri::command]
pub fn tree_is_chance_node(tree_state: tauri::State<Mutex<ActionTree>>) -> bool {
    let tree = tree_state.lock().unwrap();
    tree.is_chance_node()
}

#[tauri::command]
pub fn tree_back_to_root(tree_state: tauri::State<Mutex<ActionTree>>) {
    let mut tree = tree_state.lock().unwrap();
    tree.back_to_root();
}

#[tauri::command]
pub fn tree_apply_history(tree_state: tauri::State<Mutex<ActionTree>>, line: Vec<String>) {
    let mut tree = tree_state.lock().unwrap();
    let line = line
        .iter()
        .map(|l| decode_action(l.as_str()))
        .collect::<Vec<_>>();
    tree.apply_history(&line).unwrap();
}

#[tauri::command]
pub fn tree_play(tree_state: tauri::State<Mutex<ActionTree>>, action: String) -> i32 {
    let mut tree = tree_state.lock().unwrap();
    let action = decode_action(&action);
    let available_actions = tree.available_actions().unpackage_all();
    if let Some(index) = available_actions.iter().position(|&a| a == action) {
        tree.play(action).unwrap();
        index as i32
    } else {
        -1
    }
}

#[tauri::command]
pub fn tree_total_bet_amount(tree_state: tauri::State<Mutex<ActionTree>>) -> [i32; 2] {
    let tree = tree_state.lock().unwrap();
    tree.total_bet_amount()
}

#[tauri::command]
pub fn tree_add_bet_action(
    tree_state: tauri::State<Mutex<ActionTree>>,
    amount: i32,
    is_raise: bool,
) {
    let mut tree = tree_state.lock().unwrap();
    let action = match is_raise {
        false => Action::Bet(amount),
        true => Action::Raise(amount),
    };
    tree.add_action(action).unwrap();
}

#[tauri::command]
pub fn tree_remove_current_node(tree_state: tauri::State<Mutex<ActionTree>>) {
    let mut tree = tree_state.lock().unwrap();
    tree.remove_current_node().unwrap();
}

#[tauri::command]
pub fn tree_delete_added_line(tree_state: tauri::State<Mutex<ActionTree>>, line: String) {
    let mut tree = tree_state.lock().unwrap();
    let line = line
        .split(&['-', '|'][..])
        .map(decode_action)
        .collect::<Vec<_>>();
    tree.remove_line(&line).unwrap();
}

#[tauri::command]
pub fn tree_delete_removed_line(tree_state: tauri::State<Mutex<ActionTree>>, line: String) {
    let mut tree = tree_state.lock().unwrap();
    let line = line
        .split(&['-', '|'][..])
        .map(decode_action)
        .collect::<Vec<_>>();
    tree.add_line(&line).unwrap();
}

#[tauri::command]
pub fn tree_push_range_lock(tree_state: tauri::State<Mutex<ActionTree>>, lock_range: Vec<f32>, lock_limit: Vec<i8>) 
{
    let mut tree = tree_state.lock().unwrap();
    let lock_range_normalized: Vec<f32> = lock_range.iter().map(|x| x / 100.0).collect();
    tree.push_range_lock_on_current_node(lock_range_normalized, lock_limit).unwrap();
}

#[tauri::command]
pub fn tree_pull_range_lock(tree_state: tauri::State<Mutex<ActionTree>>) ->  (Option<Vec<f32>>, Option<Vec<i8>>)
{
    let tree = tree_state.lock().unwrap();
    let lock_range_abnormal = tree.pull_range_lock_from_current_node();

    if lock_range_abnormal.0.is_some()
    {
        let lock_range = lock_range_abnormal.0.unwrap();
        let lock_range_percented: Vec<f32> = lock_range.iter().map(|x| x * 100.0).collect();
        return (Some(lock_range_percented), lock_range_abnormal.1);
    }
    else
    {
        return (None, None);
    }
}

#[tauri::command]
pub fn tree_extract_nodelocks(tree_state: tauri::State<Mutex<ActionTree>>) ->  (Vec<(Vec<String>, Vec<f32>, Vec<i8>)>, Vec<(Vec<String>, Vec<RuleLockAssPain>)>) 
{
    let range_locks_unparsed: Vec<(Vec<Action>, Vec<f32>, Vec<i8>)>;
    let rule_locks_unparsed: Vec<(Vec<Action>, Vec<RuleLock>)>;

    let tree = tree_state.lock().unwrap();
    (range_locks_unparsed, rule_locks_unparsed) = tree.extract_all_locks();

    let range_locks = range_locks_unparsed.into_iter().map(|(actions, ranges, limits)| {
        let action_strings = actions.into_iter().map(encode_action).collect();
        let ranges_percented = ranges.into_iter().map(|x| x * 100.0).collect();
        (action_strings, ranges_percented, limits)
    }).collect();
    let rule_locks = rule_locks_unparsed.into_iter().map(|(actions, locks)| {
        let action_strings = actions.into_iter().map(encode_action).collect();
        let ass_locks = locks.iter().map(ass_painify).collect();
        (action_strings, ass_locks)
    }).collect();

    (range_locks, rule_locks)
}


#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RuleLockAssPain
{
    rule_type: (u8, u8, u8),
    percentage: f32,
    limitation: i8,
    priority: i32,
}

impl RuleLockAssPain
{
    pub fn normalize(&self) -> RuleLock
    {
        RuleLock { rule_type: self.rule_type, percentage: self.percentage / 100.0, limitation: self.limitation, priority: self.priority }
    }
}

// transforms normal RuleLock to TypeScript-integrated structurally identical RuleLockAssPain, as normal RuleLock apparently can't be integrated
pub fn ass_painify(rule_lock: &RuleLock) -> RuleLockAssPain
{
    RuleLockAssPain { rule_type: rule_lock.rule_type, percentage: rule_lock.percentage * 100.0, limitation: rule_lock.limitation, priority: rule_lock.priority }
}


#[tauri::command]
pub fn tree_push_rule_lock(tree_state: tauri::State<Mutex<ActionTree>>, rules: Option<Vec<RuleLockAssPain>>) 
{
    let mut tree = tree_state.lock().unwrap();

    let normal: Option<Vec<RuleLock>>;


    if rules.is_some()
    {
        normal = Some(rules.unwrap().iter().map(RuleLockAssPain::normalize).collect());
    }
    else
    {
        normal = None;
    }
    
    tree.push_rule_lock_on_current_node(normal).unwrap();
}


#[tauri::command]
pub fn tree_pull_rule_lock(tree_state: tauri::State<Mutex<ActionTree>>) ->  Option<Vec<RuleLockAssPain>>
{
    let tree = tree_state.lock().unwrap();
    let lock_rules = tree.pull_rule_lock_from_current_node();

    if lock_rules.is_some()
    {
        return Some(lock_rules.unwrap().iter().map(|a| ass_painify(a)).collect());
    }
    else
    {
        println!("NONE!!!");
        return None;
    }
    
}


#[tauri::command]
pub fn tree_push_all(
    tree_state: tauri::State<Mutex<ActionTree>>,
    locking_ranges_unparsed: Vec<(Vec<String>, Vec<f32>, Vec<i8>)>,
    locking_rules_unparsed: Vec<(Vec<String>, Vec<RuleLockAssPain>)>
) {
    let tree = tree_state.lock().unwrap();

    for (line_strs, rrange, lrange) in locking_ranges_unparsed {
        let mut line_vec = Vec::new() as Vec<Action>;

        for line_str in line_strs {
            println!("decoding range rule line: {line_str}");
            line_vec.push(
                decode_action(&line_str)
            );
        }

        let range_parsed = rrange.iter().map(|&r| r / 100.0).collect();

        match tree.push_range_lock_recursive(&line_vec, range_parsed, lrange, 0, None) {
            Err(e) => println!("Something's fishy with locking ranges: {e}"),
            Ok(_) => (),
        };
    }

    for (line_strs, rule_locks) in locking_rules_unparsed {
        let mut line_vec = Vec::new() as Vec<Action>;

        for line_str in line_strs {
            println!("decoding locking rule line: {line_str}");
            line_vec.push(
                decode_action(&line_str)
            );
        }

        let ass_rule_locks = rule_locks.iter().map(|rl| rl.normalize()).collect();

        match tree.push_rule_lock_recursive(&line_vec, Some(ass_rule_locks), 0, None) {
            Err(e) => println!("Yikes, you locking range just friggin died: {e}"),
            Ok(_) => (),
        }
    }
}
