export class Drill
{
    OOPname: string;
    IPname: string;

    OOPhand: number[];
    IPhand: number[];

    flopCards: number[];

    startingPot: number;
    startingStacks: number;

    hero: string;

    coreBranch: DrillBranch | null;

    constructor(
        OOP: string, IP: string,

        hero: string,

        startingPot: number,
        startingStacks: number,

        OOPhand: number[], IPhand: number[],
        flopCards: number[])
    {
        this.OOPname = OOP;
        this.IPname = IP;

        this.hero = hero;

        this.startingPot = startingPot;
        this.startingStacks = startingStacks;

        this.OOPhand = OOPhand;
        this.IPhand = IPhand;

        this.flopCards = flopCards;

        this.coreBranch = null;
    }
}

export class SequenceAction
{
    flag: number;

    /*

    0 - Fold

    1 - Check
    2 - Call

    3 - Bet / Raise

    4 - Jam

    10 - Turn card
    11 - River card


    */

    data: number;

    constructor(flag: number, data: number)
    {
        this.flag = flag;
        this.data = data;
    }
}

export class DrillBranch
{
    sequence: SequenceAction[];

    actions: DrillBranchAction[];

    hint: string;
    endFlag: number;

    /*

    endFlags:
    0 - no endflag
    1 - game end
    2 - non-existent line

    */


    constructor()
    {
        this.sequence = [];

        this.actions = [];

        this.hint = "";
        this.endFlag = 0;
    }
}

export class DrillBranchAction
{
    flag: number;
    data: number;

    color: string;

    percentage: number;
    eV: number;

    branch: DrillBranch;

    constructor(
        flag: number, data: number, 
        color: string, 
        percentage: number, eV: number,
        branch: DrillBranch)
    {
        this.flag = flag;
        this.data = data;

        this.color = color;

        this.percentage = percentage;
        this.eV = eV;

        this.branch = branch;
    }
}

export class DrillPack
{
    name: string;
    comment: string;

    drills: Drill[];

    constructor(name: string, comment: string)
    {
        this.name = name;
        this.comment = comment;

        this.drills = [];
    }
}

export const generateRandomExclusive = (floor: number, ceiling: number) =>
{
    let random: number;

    if (ceiling < floor)
        throw new Error("Thou fool! The ceiling can not be lower than the floor!")

    random = Math.random();

    random *= (ceiling - floor);
    random += floor;

    random = Math.floor(random)

    return random;
}

export const generateRandomBool = () =>
{
    return Math.random() > 0.5;
}

export const generateRandomCard = () =>
{
    let cardSuit = generateRandomExclusive(0, 4);
    let cardRank = generateRandomExclusive(0, 13);

    let card = cardSuit + (cardRank << 2)

    return card
}

export const pickRandom = (arr: any[]) =>
{
    const randomIndex = generateRandomExclusive(0, arr.length);

    return arr[randomIndex];
}

export function sleep() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}