<template>
  <div v-if="store.isTreeSetup">
    <div v-if="!inEditor">
      <div
          class="flex pl-2.5 pr-3 py-1 text-cyan-600 bg-cyan-50 border-2 border-cyan-600 rounded-md font-semibold"
        >
        <InformationCircleIcon class="inline w-5 h-5 mt-[0.1875rem] mr-1.5" />
        <div>
          Note, that only locking some hands will result in solver adapting the strategy for the unlocked hands, which can lead to unexpected results. <br />
          If some hand is only locked on some frequency without compensation in other lines, the hand will still be fully locked, and the spare frequency will be delegated to the most passive available line.
        </div>
      </div>

      <div class="flex mt-4 gap-8 items-center">

        <Tippy
              class="inline-block cursor-help text-gray-600"
              max-width="500px"
              trigger="mouseenter click"
              placement="bottom"
              :delay="[200, 0]"
              :interactive="true"
            >
          <QuestionMarkCircleIcon class="inline w-5 h-5" />
          <div class="inline-block ml-0.5 text-sm underline">
            Who are these node guys and why do we want to lock them?
          </div>
          <template #content>
            <div class="px-1 py-0.5 text-justify">
              <div>
                Node locking is a technique used to freeze player's actions on certain nodes. This can be useful for various purposes, such as analyzing specific lines or testing the impact of certain decisions. By locking a node, you can prevent the solver from changing the action on that node during the solving process.
              </div>
            </div>
          </template>
        </Tippy>

        <Tippy
              class="inline-block cursor-help text-gray-600"
              max-width="500px"
              trigger="mouseenter click"
              placement="bottom"
              :delay="[200, 0]"
              :interactive="true"
            >
          <QuestionMarkCircleIcon class="inline w-5 h-5" />
          <div class="inline-block ml-0.5 text-sm underline">
            Important note
          </div>
          <template #content>
            <div class="px-1 py-0.5 text-justify">
              <div>
                DP:FE nodelocking is not a standard nodelocking, that locks an entire node. Instead, it locks specific hands on a node. The standard nodelocking is still achievable by locking all the hands on a node.
              </div>
            </div>
          </template>
        </Tippy>
      
      </div>
      
      <!-- Error -->

      <div v-if="isTreeError">
        Error: Failed to build tree (loaded broken tree?)
      </div>

      <!-- Navigation -->

      <div
        v-if="!isTreeError"
        ref="navDiv"
        class="flex h-[10.5rem] gap-1 p-1 overflow-x-auto whitespace-nowrap snug"
      >
        <div
          v-for="spot in spots"
          :key="spot.index"
          :class="
            'flex flex-col h-full px-1 py-0.5 justify-start ' +
            'rounded-lg shadow-md border-[3px] transition group ' +
            (spot.type === 'chance'
              ? 'hover:border-red-600 '
              : 'hover:border-blue-600 ') +
            (spot.index === selectedSpotIndex
              ? 'border-blue-600 cursor-default'
              : 'border-gray-400 cursor-pointer')
          "
          @click="comboSelect(spot.index, false, false, true)"
        >
          <!-- Root or Chance -->
          <template v-if="spot.type === 'root' || spot.type === 'chance'">
            <div
              class="px-1.5 pt-1 pb-0.5 font-semibold group-hover:opacity-100 opacity-70"
            >
              {{ spot.player.toUpperCase() }}
            </div>
            <div
              class="flex flex-col flex-grow px-3 items-center justify-evenly font-semibold"
            >
              <div class="group-hover:opacity-100 opacity-70">
                <div>Pot {{ spot.pot }}</div>
                <div>Stack {{ spot.stack }}</div>
              </div>
            </div>
          </template>

          <!-- Player -->
          <template v-if="spot.type === 'player'">
            <div
              :class="
                'px-1.5 py-1 font-semibold group-hover:opacity-100 ' +
                (spot.index === selectedSpotIndex ? '' : 'opacity-70')
              "
            >
              {{ spot.player.toUpperCase() }}
            </div>
            <div class="flex-grow overflow-y-auto">
              <button
                v-for="action of spot.actions"
                :key="action.index"
                :class="
                  'flex w-full px-1.5 rounded-md transition-colors hover:bg-blue-100 ' +
                  (action.isSelected ? 'bg-blue-100 ' : '')
                "
                @click.stop="play(spot.index, action.index)"
              >
                <span class="inline-block relative w-4 mr-0.5">
                  <span v-if="action.isSelected">
                    <CheckIcon class="absolute top-[0.1875rem] -left-0.5 w-4 h-4" />
                  </span>
                </span>
                <span
                  :class="
                    'pr-0.5 font-semibold group-hover:opacity-100 ' +
                    (action.isSelected || spot.index === selectedSpotIndex
                      ? ''
                      : 'opacity-70')
                  "
                >
                  {{ action.name }}
                  {{ action.amount === "0" ? "" : action.amount }}
                </span>
              </button>
              <div
                v-if="spot.actions.length === 0"
                :class="
                  'flex w-full px-1.5 font-semibold group-hover:opacity-100 ' +
                  (spot.index === selectedSpotIndex ? '' : 'opacity-70')
                "
              >
                (No actions)
              </div>
            </div>
          </template>

          <!-- Terminal -->
          <template v-else-if="spot.type === 'terminal'">
            <div
              :class="
                'px-1.5 pt-1 pb-0.5 font-semibold group-hover:opacity-100 ' +
                (spot.index === selectedSpotIndex ? '' : 'opacity-70')
              "
            >
              {{ spot.player.toUpperCase() }}
            </div>
            <div
              :class="
                'flex flex-col flex-grow items-center justify-evenly font-semibold group-hover:opacity-100 ' +
                (spot.index === selectedSpotIndex ? '' : 'opacity-70')
              "
            >
              <div v-if="spot.equityOop === 0 || spot.equityOop === 1" class="px-3">
                {{ ["IP", "OOP"][spot.equityOop] }} Wins
              </div>
              <div class="px-3">Pot {{ spot.pot }}</div>
            </div>
          </template>
        </div>
      </div>

      <!-- Invalid lines error -->

      <div
        v-if="!isTreeError && invalidLinesArray.length > 0"
        class="flex mt-4 font-semibold text-red-500"
      >
        <div class="underline">
          Invalid Terminal{{ invalidLinesArray.length > 1 ? "s" : "" }}:
        </div>
        <div class="ml-2">
          <div v-for="invalidLine in invalidLinesArray" :key="invalidLine">
            {{ invalidLine }}
          </div>
        </div>
      </div>

      <div v-if="!isTreeError" class="flex mx-6 my-6 justify-center">
        <hr class="border-gray-400 w-full" />
      </div>

      <!-- Edit -->

      <div v-if="!isTreeError" class="flex gap-3">
        <button
          class="button-base button-blue"
          :disabled="
            isSelectedTerminal ||
            isAfterAllin ||
            betAmount < minAmount ||
            betAmount > maxAmount ||
            betAmount % 1 !== 0 ||
            existingAmounts.includes(betAmount)
          "
          @click="addBetAction"
        >
          Add Bet Action
        </button>

        <button
          class="button-base button-red"
          :disabled="selectedSpotIndex === 1"
          @click="removeSelectedNode"
        >
          Remove Selected Node
        </button>

        <div class="pl-3">
          Bet amount:
          <input
            v-model="betAmount"
            type="number"
            :class="
              'w-24 ml-2 px-2 py-1 rounded-lg text-sm text-center ' +
              (betAmount < minAmount || betAmount > maxAmount || betAmount % 1 !== 0
                ? 'input-error'
                : '')
            "
            :min="minAmount"
            :max="maxAmount"
            @keydown.enter="addBetAction"
          />
          <span v-if="!isSelectedTerminal && !isAfterAllin" class="ml-2">
            ({{ (amountRate * 100).toFixed(1) }}% of the pot)
          </span>
        </div>
      </div>

      <div class="flex mx-6 my-6 justify-center">
        <hr class="border-gray-400 w-full" />
      </div>
      
      <!-- Locks -->

      <div v-if="selectedSpotIndex != 1 && !isTreeError" class="flex gap-8">
        <div class="flex-col w-1/6">
          <div class="text-[1.0625rem] text-semibold">Range locking</div>
          <RangeMiniViewer
            class="w-44 h-44 mt-2 cursor-pointer"
            :player="2"
                @click="editRange()"
          />
          <input
            v-model="rangeText"
            type="text"
            :class="
              'w-44 mt-3 px-2 py-1 rounded-lg text-sm ' +
              (isRangeTextError ? ' input-error' : '')
            "
            @focus="($event.target as HTMLInputElement).select()"
            @change="onRangeTextChange()"
          />
          <div class="mt-2 text-center">
            {{ numCombos.toFixed(1) }} combos ({{
                  numCombos >= 0.9995 * ((52 * 51) / 2)
                    ? "100"
                    : ((numCombos * 100) / ((52 * 51) / 2)).toFixed(1)
                }}%)
          </div>
          <div class="flex mt-3 w-full justify-center gap-3">
            <button class="button-base button-blue" @click="pushRange">
              Push range
            </button>
          </div>
        </div>
        
        <div class="flex-col flex w-3/4">
          <div class="flex gap-8">
            <div class="text-[1.0625rem] text-semibold">Rule locking</div>
            <Tippy
                class="inline-block cursor-help text-gray-600"
                max-width="500px"
                trigger="mouseenter click"
                placement="bottom"
                :delay="[200, 0]"
                :interactive="true"
              >
            <QuestionMarkCircleIcon class="inline w-5 h-5" />
            <div class="inline-block ml-0.5 text-sm underline">
              HUH?!
            </div>
            <template #content>
              <div class="px-1 py-0.5 text-justify">
                <div>
                  Rule locking allows to lock hands that falls into specific criteria, such as "all suited connectors", "straigths", "all hands containing Ace" etc. <br />
                  This can be used to simplify input or to lock specific lines depending on the board configuration, which can not be achieved by non-conditional hand locking. <br />
                  Standard node locking takes precedence over rule locking, so if a hand is locked by standard node locking, it will be retain original action even if it does fall into the criteria of the rule locking.
                </div>
              </div>
            </template>
            </Tippy>
          </div>

          <div class="flex">
            <div class="flex-row w-1/6 font-semibold text-center">
              Criterium group
            </div>
            <div class="flex-row w-1/6 font-semibold text-center">
              Criterium
            </div>
            <div class="flex-row w-1/6 font-semibold text-center">
              Specification
            </div>
            <div class="flex-row w-1/6 font-semibold text-center">
              Percent
            </div>
            <div class="flex-row w-1/6 font-semibold text-center">
              Limit
            </div>
            <div class="flex-row w-1/6 text-center">
              
              <span class="font-semibold">Priority</span>
              
              <Tippy
              class="inline-block cursor-help text-gray-600"
              max-width="500px"
              trigger="mouseenter click"
              placement="bottom"
              :delay="[200, 0]"
              :interactive="true"
                  >
                <QuestionMarkCircleIcon class="inline w-5 h-5" />
                <template #content>
                  <div class="px-1 py-0.5 text-justify">
                    <div>
                      Priority sets up the order of application of the rules. Rules with lower priority will be applied first, and then overridden by rules with higher priority. <br />
                      Range locking has priority 0, so any rule with priority less than 0 will be applied before range locking, and any rule with priority greater than 0 will override range locking. <br />
                      Setting multiple rules with the same priority is equivalent to an "and" condition, meaning that only hands that satisfy the criteria of all of the rules with the same priority will be locked.
                    </div>
                  </div>
                </template>
              </Tippy>
            </div>
          </div> 

          <div class="flex">
            <div class="flex-row w-1/6">
              <select v-model.number="currentGroup" 
              class="w-full mt-1 px-2 py-1 rounded-lg text-sm"
              @change="onGroupChange">
                <option :value="0">Hand group</option>
                <option :value="1">Made hands (strict)</option>
                <option :value="2">Made hands (or better)</option>
                <option :value="3">Draws</option>
                <option :value="4">Board state</option>
              </select>
            </div>
            <div class="flex-row w-1/6">
              <select 
              v-model.number="currentCriterium" 
              class="w-full mt-1 px-2 py-1 rounded-lg text-sm"
              @change="onCriteriumChange">
                <option v-if="currentGroup === 0" :value="0">Any hand</option>
                <option v-if="currentGroup === 0" :value="1">Pocket pair</option>
                <option v-if="currentGroup === 0" :value="2">Suited</option>
                <option v-if="currentGroup === 0" :value="3">Offsuit</option>

                <option v-if="currentGroup === 1 || currentGroup === 2" :value="0">High card</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="1">One pair</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="2">Two pair</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="3">Trip</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="4">Set</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="5">Straight</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="6">Flush</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="7">Full house</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="8">Quads</option>
                <option v-if="currentGroup === 1 || currentGroup === 2" :value="9">Straight flush</option>

                <option v-if="currentGroup === 3" :value="0">Overcards</option>
                <option v-if="currentGroup === 3" :value="1">Gutshot</option>
                <option v-if="currentGroup === 3" :value="2">Open-ended straight draw</option>
                <option v-if="currentGroup === 3" :value="3">Flush draw</option>
                

                <option v-if="currentGroup === 4" :value="0">Dry board</option>
                <hr v-if="currentGroup === 4">
                <option v-if="currentGroup === 4" :value="11">Paired board</option>
                <option v-if="currentGroup === 4" :value="12">Trip board</option>
                <option v-if="currentGroup === 4" :value="13">Quad board</option>
                <hr v-if="currentGroup === 4">
                <option v-if="currentGroup === 4" :value="21">Flush draw</option>
                <option v-if="currentGroup === 4" :value="22">Flush present</option>
                <option v-if="currentGroup === 4" :value="24">4 card flush</option>
                <hr v-if="currentGroup === 4">
                <option v-if="currentGroup === 4" :value="31">Connected board</option>
                <option v-if="currentGroup === 4" :value="32">Straight board</option>
                <option v-if="currentGroup === 4" :value="33">4 card straight gapped</option>
                <option v-if="currentGroup === 4" :value="34">4 card straight</option>
              </select>
            </div>
            <div class="flex-row w-1/6">
              <!-- oh boy this is going to be one hell of a ride -->
              <select 
              v-model.number="currentSpecification" 
              :disabled="!(currentGroup === 0 || ((currentGroup === 1 || currentGroup === 2) && (currentCriterium === 0 || currentCriterium === 1 || currentCriterium === 4 || currentCriterium === 5 || currentCriterium === 6)) || currentGroup === 3 || currentGroup === 4)" 
              class="w-full mt-1 px-2 py-1 rounded-lg text-sm">
                <option v-if="currentGroup === 0" :value="0">Any rank</option>
                <option v-if="currentGroup === 0" :value="12">Ace-high</option>
                <option v-if="currentGroup === 0" :value="11">King-high</option>
                <option v-if="currentGroup === 0" :value="10">Queen-high</option>
                <option v-if="currentGroup === 0" :value="9">Jack-high</option>
                <option v-if="currentGroup === 0" :value="8">T-high</option>
                <option v-if="currentGroup === 0" :value="7">9-high</option>
                <option v-if="currentGroup === 0" :value="6">8-high</option>
                <option v-if="currentGroup === 0" :value="5">7-high</option>
                <option v-if="currentGroup === 0" :value="4">6-high</option>
                <option v-if="currentGroup === 0" :value="3">5-high</option>
                <option v-if="currentGroup === 0" :value="2">4-high</option>
                <option v-if="currentGroup === 0" :value="1">3-high</option>

                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 0" :value="0">Any rank</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 0" :value="1">Top high</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 0" :value="2">Second high</option>

                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 1" :value="0">Any</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 1" :value="1">Overpair</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 1" :value="2">Top pair</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 1" :value="3">Middle pair</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 1" :value="4">Bottom pair</option>

                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 4" :value="0">Any</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 4" :value="1">Top set</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 4" :value="2">Middle set</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && currentCriterium === 4" :value="3">Bottom set</option>
                
                <option v-if="(currentGroup === 1 || currentGroup === 2) && (currentCriterium === 5 || currentCriterium === 6)" :value="0">Any</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && (currentCriterium === 5 || currentCriterium === 6)" :value="1">Nut</option>
                <option v-if="(currentGroup === 1 || currentGroup === 2) && (currentCriterium === 5 || currentCriterium === 6)" :value="2">Second nut</option>

                <option v-if="(currentGroup === 3)" :value="0">One / both</option>
                <option v-if="(currentGroup === 3)" :value="1">One hole</option>
                <option v-if="(currentGroup === 3)" :value="2">Both holes</option>
                
                <option v-if="(currentGroup === 4)" :value="0">If true</option>
                <option v-if="(currentGroup === 4)" :value="1">If false</option>
              </select>
            </div>

            <div class="flex-row w-1/6">
              <input
                v-model="currentPercentage"
                type="number"
                min="0"
                max="100"
                class="w-full mt-1 px-2 py-1 rounded-lg text-sm text-center"
              />
            </div>

            <div class="flex-row w-1/6">
              <select v-model="currentLimitation" class="w-full mt-1 px-2 py-1 rounded-lg text-sm">
                <option :value="-1">This or less</option>
                <option :value="0">Strict</option>
                <option :value="1">This or more</option>
              </select>
            </div>

            <div class="flex-row w-1/6">
              <input
                v-model="currentPriority"
                type="number"
                class="w-full mt-1 px-2 py-1 rounded-lg text-sm text-center"
              />
            </div>
          </div>
          
          <div class="flex w-full justify-center mt-2">
            <button class="button-base button-blue" @click="pushRules">
              Push rules
            </button>
          </div>

          <div
            v-if="
              store.currentRules !== null
            "
          >
            <div class="flex">
              <div class="flex flex-col">
                <div
                  v-for="(rule) in store.currentRules"
                  class="flex items-center"
                >
                  <!--button class="mr-2" @click="deleteAddedLine(index)">
                    <TrashIcon class="w-5 h-5 text-gray-600" />
                  </button-->

                  <span>{{ ruleToText(rule) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        Select a lock to node first.
      </div>

      <div class="flex mx-6 my-6 justify-center">
        <hr class="border-gray-400 w-full" />
      </div>

      <!-- Save/Cancel -->

      <div class="flex my-6 gap-3">
        <button
          class="button-base button-blue"
          :disabled="isTreeError || invalidLinesArray.length > 0"
          @click="saveEdit"
        >
          Save Edit
        </button>

        <button class="button-base button-red" @click="cancelEdit">
          Cancel Edit
        </button>
      </div>

      <!-- Lines -->

      <div
        v-if="
          !isTreeError &&
          (addedLinesArray.length > 0 || removedLinesArray.length > 0)
        "
      >
        <div v-if="addedLinesArray.length > 0" class="flex">
          <div class="font-semibold underline w-[7.75rem]">
            Added line{{ addedLinesArray.length > 1 ? "s" : "" }}:
          </div>
          <div class="flex flex-col">
            <div
              v-for="(addedLine, index) in addedLinesArray"
              :key="addedLine"
              class="flex items-center"
            >
              <button class="mr-2" @click="deleteAddedLine(index)">
                <TrashIcon class="w-5 h-5 text-gray-600" />
              </button>
              <span>{{ addedLine }}</span>
            </div>
          </div>
        </div>

        <div v-if="removedLinesArray.length > 0" class="flex mt-2">
          <div class="font-semibold underline w-[7.75rem]">
            Removed line{{ removedLinesArray.length > 1 ? "s" : "" }}:
          </div>
          <div class="flex flex-col">
            <div
              v-for="(removedLine, index) in removedLinesArray"
              :key="removedLine"
              class="flex items-center"
            >
              <button class="mr-2" @click="deleteRemovedLine(index)">
                <TrashIcon class="w-5 h-5 text-gray-600" />
              </button>
              <span>{{ removedLine }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RangeEditor
      v-else
      :player="2"
      :default-text="rangeTextCopy"
      @save="saveRangeEdit"
      @cancel="cancelRangeEdit"
    />
  </div>
  <div v-else>
    Erm, akshually to edit tree you need to first set it up in the Tree Configuration tab. Go do that and then come back here!
  </div>
</template>


<script setup lang="ts">

import { computed, nextTick, onMounted, ref } from "vue";
import { useStore, useConfigStore } from "../store";
import { convertBetString, readableLineString, trimRegex, rangeRegex, cardText } from "../utils";
import { Spot, SpotRoot, SpotChance, SpotPlayer } from "../result-types";
import * as invokes from "../invokes";
import { RuleLock } from "../invokes";

const store = useStore();

import { CheckIcon } from "@heroicons/vue/20/solid";
import { TrashIcon } from "@heroicons/vue/24/outline";

import RangeEditor from "./RangeEditor.vue";
import RangeMiniViewer from "./RangeMiniViewer.vue";

import { Tippy } from "vue-tippy";
import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/20/solid";

const emit = defineEmits<{
  (event: "save", addedLines: string, removedLines: string): void;
  (event: "cancel"): void;
}>();

const navDiv = ref(null as HTMLDivElement | null);

const config = useConfigStore();
let isLocked = false;

const boardLength = config.expectedBoardLength;

const isTreeError = ref(false);

const rootSpot: SpotRoot = {
  type: "root",
  index: 0,
  player: boardLength === 3 ? "flop" : boardLength === 4 ? "turn" : "river",
  selectedIndex: -1,
  board: config.board,
  pot: config.startingPot,
  stack: config.effectiveStack,
};

const spots = ref<Spot[]>([rootSpot]);
const selectedSpotIndex = ref(-1);

const isSelectedTerminal = computed(() => {
  if (isLocked || selectedSpotIndex.value === -1) return false;
  const selectedSpot = spots.value[selectedSpotIndex.value];
  return selectedSpot.type === "terminal";
});

const betAmount = ref(0);
const totalBetAmount = ref([0, 0]);
const prevBetAmount = ref(0);

const isAfterAllin = computed(() => {
  const maxTotalBetAmount = Math.max(...totalBetAmount.value);
  return maxTotalBetAmount === config.effectiveStack;
});

const maxAmount = computed(() => {
  if (isSelectedTerminal.value) return 0;
  const maxTotalBetAmount = Math.max(...totalBetAmount.value);
  return config.effectiveStack - (maxTotalBetAmount - prevBetAmount.value);
});

const minAmount = computed(() => {
  const betMinus = config.effectiveStack - maxAmount.value;
  const min = Math.min(...totalBetAmount.value) - betMinus;
  const max = Math.max(...totalBetAmount.value) - betMinus;
  return Math.min(Math.max(2 * max - min, 1), maxAmount.value);
});

const amountRate = computed(() => {
  const pot = config.startingPot + 2 * Math.max(...totalBetAmount.value);
  const amount = betAmount.value - prevBetAmount.value;
  return amount / pot;
});

const existingAmounts = computed(() => {
  if (isLocked || selectedSpotIndex.value === -1) return [];
  const ret: number[] = [];
  const spot = spots.value[selectedSpotIndex.value] as SpotPlayer;
  for (const action of spot.actions) {
    if (action.amount !== "0") {
      ret.push(Number(action.amount));
    }
  }
  return ret;
});

const addedLines = ref("");
const removedLines = ref("");
const invalidLines = ref("");

const addedLinesArray = computed(() =>
  addedLines.value === ""
    ? []
    : addedLines.value.split(",").map(readableLineString)
);

const removedLinesArray = computed(() =>
  removedLines.value === ""
    ? []
    : removedLines.value.split(",").map(readableLineString)
);

const invalidLinesArray = computed(() =>
  invalidLines.value === ""
    ? []
    : invalidLines.value.split(",").map(readableLineString)
);

const encodeLine = (spotIndex: number) => {
  const ret: string[] = [];
  for (let i = 1; i < spotIndex; ++i) {
    const spot = spots.value[i];
    if (spot.type === "player") {
      const action = spot.actions[spot.selectedIndex];
      if (action.name === "Fold") {
        ret.push("F");
      } else if (action.name === "Check") {
        ret.push("X");
      } else if (action.name === "Call") {
        ret.push("C");
      } else if (action.name === "Bet") {
        ret.push("B" + action.amount);
      } else if (action.name === "Raise") {
        ret.push("R" + action.amount);
      } else if (action.name === "Allin") {
        ret.push("A" + action.amount);
      }
    }
  }
  return ret;
};

const comboSelect = async (
  spotIndex: number,
  needSplice: boolean,
  needRebuild: boolean,
  needAmountUpdate: boolean
) => {
  await selectSpot(spotIndex, needSplice, needRebuild, needAmountUpdate);
  
  if (spotIndex != 0 && spotIndex != 1)
  {
    await updateActions();
    await updateRules();
  }
}

const selectSpot = async (
  spotIndex: number,
  needSplice: boolean,
  needRebuild: boolean,
  needAmountUpdate: boolean
) => {
  console.log(spotIndex)

  if (!needSplice && !needRebuild && spotIndex === selectedSpotIndex.value) {
    return;
  }

  if (spotIndex === 0) {
    await selectSpot(1, true, false, selectedSpotIndex.value !== 1);
    return;
  }

  if (!needSplice && spots.value[spotIndex]?.type === "chance") {
    await selectSpot(spotIndex + 1, false, false, true);
    return;
  }

  isLocked = true;

  if (needRebuild) {
    const selectedSpotIndexTmp = selectedSpotIndex.value;
    const line = encodeLine(spots.value.length - 1);
    spots.value = [rootSpot];

    selectedSpotIndex.value = 1;
    totalBetAmount.value = [0, 0];

    await invokes.treeBackToRoot();
    await pushResultsPlayer();

    for (let i = 0; i < line.length; ++i) {
      const index = await invokes.treePlay(line[i]);
      if (index === -1) {
        needAmountUpdate = true;
        break;
      }

      const spot = spots.value[selectedSpotIndex.value] as SpotPlayer;
      const action = spot.actions[index];
      spot.selectedIndex = index;
      action.isSelected = true;

      ++selectedSpotIndex.value;
      totalBetAmount.value = await invokes.treeTotalBetAmount();

      if (await invokes.treeIsTerminalNode()) {
        pushResultsTerminal();
      } else if (await invokes.treeIsChanceNode()) {
        await pushResultsChance();
        ++selectedSpotIndex.value;
      } else {
        await pushResultsPlayer();
      }
    }

    if (selectedSpotIndexTmp < selectedSpotIndex.value) {
      selectedSpotIndex.value = selectedSpotIndexTmp;
    }
  } else {
    selectedSpotIndex.value = spotIndex;
  }

  const line = encodeLine(selectedSpotIndex.value);
  await invokes.treeApplyHistory(line);
  totalBetAmount.value = await invokes.treeTotalBetAmount();

  if (needSplice) {
    spots.value.splice(selectedSpotIndex.value);
    if (await invokes.treeIsTerminalNode()) {
      pushResultsTerminal();
    } else if (await invokes.treeIsChanceNode()) {
      await pushResultsChance();
      ++selectedSpotIndex.value;
    } else {
      await pushResultsPlayer();
    }
  }

  const prev = spots.value[selectedSpotIndex.value - 1];
  if (prev.type === "player") {
    prevBetAmount.value = Number(prev.actions[prev.selectedIndex].amount);
  } else {
    prevBetAmount.value = 0;
  }

  if (needAmountUpdate) {
    betAmount.value = minAmount.value;
  }

  isLocked = false;
  autoScrollNav();

};

const autoScrollNav = async () => {
  await nextTick();
  if (navDiv.value) {
    const selectedChild = navDiv.value.children[selectedSpotIndex.value];
    if (selectedChild) {
      selectedChild.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }
};

const pushResultsTerminal = () => {
  const prevSpot = spots.value[selectedSpotIndex.value - 1] as SpotPlayer;
  const prevAction = prevSpot.actions[prevSpot.selectedIndex];

  let equityOop = -1;
  if (prevAction.name === "Fold") {
    equityOop = prevSpot.player === "oop" ? 0 : 1;
  }

  spots.value.push({
    type: "terminal",
    index: selectedSpotIndex.value,
    player: "end",
    selectedIndex: -1,
    prevPlayer: prevSpot.player,
    equityOop,
    pot: config.startingPot + totalBetAmount.value[0] + totalBetAmount.value[1],
  });
};

const pushResultsChance = async () => {
  type SpotTurn = SpotRoot | SpotChance;
  const prevSpot = spots.value[selectedSpotIndex.value - 1] as SpotPlayer;
  const turnSpot = spots.value.find((spot) => spot.player === "turn") as
    | SpotTurn
    | undefined;

  const nextActions = await invokes.treeActions();

  spots.value.push(
    {
      type: "chance",
      index: selectedSpotIndex.value,
      player: turnSpot ? "river" : "turn",
      selectedIndex: -1,
      prevPlayer: prevSpot.player,
      cards: Array.from({ length: 52 }, (_, i) => ({
        card: i,
        isSelected: false,
        isDead: true,
      })),
      pot: config.startingPot + 2 * totalBetAmount.value[0],
      stack: config.effectiveStack - totalBetAmount.value[0],
    },
    {
      type: "player",
      index: selectedSpotIndex.value + 1,
      player: "oop",
      selectedIndex: -1,
      actions: nextActions.map((action, i) => {
        const [name, amount] = action.split(":");
        return {
          index: i,
          name,
          amount,
          rate: -1,
          isSelected: false,
          color: "#000",
        };
      }),
    }
  );
};

const pushResultsPlayer = async () => {
  const prevSpot = spots.value[selectedSpotIndex.value - 1];
  const player = prevSpot.player === "oop" ? "ip" : "oop";

  const actions = await invokes.treeActions();

  spots.value.push({
    type: "player",
    index: selectedSpotIndex.value,
    player,
    selectedIndex: -1,
    actions: actions.map((action, i) => {
      const [name, amount] = action.split(":");
      return {
        index: i,
        name,
        amount,
        isSelected: false,
        color: "#000",
      };
    }),
  });
};

const play = async (spotIndex: number, actionIndex: number) => {
  const spot = spots.value[spotIndex] as SpotPlayer;

  if (spot.selectedIndex !== -1) {
    spot.actions[spot.selectedIndex].isSelected = false;
  }
  spot.actions[actionIndex].isSelected = true;
  spot.selectedIndex = actionIndex;

  await comboSelect(spotIndex + 1, true, false, true);
};

const addBetAction = async () => {
  const isRaise = totalBetAmount.value[0] !== totalBetAmount.value[1];
  await invokes.treeAddBetAction(betAmount.value, isRaise);
  await comboSelect(selectedSpotIndex.value, false, true, false);
  addedLines.value = await invokes.treeAddedLines();
  removedLines.value = await invokes.treeRemovedLines();
  invalidLines.value = await invokes.treeInvalidTerminals();
};

const removeSelectedNode = async () => {
  await invokes.treeRemoveCurrentNode();
  let prevIndex = selectedSpotIndex.value - 1;
  if (spots.value[prevIndex].type === "chance") --prevIndex;
  await comboSelect(prevIndex, false, true, true);
  addedLines.value = await invokes.treeAddedLines();
  removedLines.value = await invokes.treeRemovedLines();
  invalidLines.value = await invokes.treeInvalidTerminals();
};

const saveEdit = () => {
  emit("save", addedLines.value, removedLines.value);
};

const cancelEdit = () => {
  emit("cancel");
};

const deleteAddedLine = async (index: number) => {
  const addedLinesArray = addedLines.value.split(",");
  const line = addedLinesArray[index];

  await invokes.treeDeleteAddedLine(line);
  await comboSelect(selectedSpotIndex.value, false, true, false);

  addedLines.value = await invokes.treeAddedLines();
  removedLines.value = await invokes.treeRemovedLines();
  invalidLines.value = await invokes.treeInvalidTerminals();
};

const deleteRemovedLine = async (index: number) => {
  const removedLinesArray = removedLines.value.split(",");
  const line = removedLinesArray[index];

  await invokes.treeDeleteRemovedLine(line);
  await comboSelect(selectedSpotIndex.value, false, true, false);

  addedLines.value = await invokes.treeAddedLines();
  removedLines.value = await invokes.treeRemovedLines();
  invalidLines.value = await invokes.treeInvalidTerminals();
};

onMounted(async () => {
  isTreeError.value = !(await invokes.treeNew(
    boardLength,
    config.startingPot,
    config.effectiveStack,
    config.donkOption,
    convertBetString(config.oopFlopBet),
    convertBetString(config.oopFlopRaise),
    convertBetString(config.oopTurnBet),
    convertBetString(config.oopTurnRaise),
    config.donkOption ? convertBetString(config.oopTurnDonk) : "",
    convertBetString(config.oopRiverBet),
    convertBetString(config.oopRiverRaise),
    config.donkOption ? convertBetString(config.oopRiverDonk) : "",
    convertBetString(config.ipFlopBet),
    convertBetString(config.ipFlopRaise),
    convertBetString(config.ipTurnBet),
    convertBetString(config.ipTurnRaise),
    convertBetString(config.ipRiverBet),
    convertBetString(config.ipRiverRaise),
    config.addAllInThreshold / 100,
    config.forceAllInThreshold / 100,
    config.mergingThreshold / 100,
    config.addedLines,
    config.removedLines
  ));

  addedLines.value = await invokes.treeAddedLines();
  removedLines.value = await invokes.treeRemovedLines();
  invalidLines.value = await invokes.treeInvalidTerminals();

  await selectSpot(0, true, false, true);
});



// silly range editing stuff



const inEditor = ref(false);
const rangeText = ref("");
const isRangeTextError = ref(false);
const numCombos = ref(0);
const rangeTextCopy = ref("");

const onUpdate = async (player: number) => {
  const weights = await invokes.rangeGetWeights(player + 2);
  for (let i = 0; i < 13 * 13; ++i) {
    store.ranges[2][i] = weights[i] * 100;
  }
  isRangeTextError.value = false;
};

const onUpdateLocal = async (player: number) => {
  rangeText.value = await invokes.rangeToString(2);
  numCombos.value = await invokes.rangeNumCombos(2);
};

const editRange = async () => {
  rangeTextCopy.value = await invokes.rangeToString(2);
  store.headers["node-locking"].push(`Action range`);
  inEditor.value = true;
};

const onRangeTextChange = async () => {
  const trimmed = rangeText.value.replace(trimRegex, "$1").trim();
  const ranges = trimmed.split(",");

  if (ranges[ranges.length - 1] === "") {
    ranges.pop();
  }

  for (const range of ranges) {
    if (!rangeRegex.test(range)) {
      isRangeTextError.value = true;
      return;
    }
  }

  const errorString = await invokes.rangeFromString(2, trimmed);

  if (errorString) {
    isRangeTextError.value = true;
  } else {
    await onUpdate(2);
    await onUpdateLocal(2);
  }
};


const pushRange = async () => {
  invokes.treePushRangeLock(store.ranges[2], store.currentLimitRange);
};

const pushRules = async () => {

  if (store.currentRules === null)
    store.currentRules = []

  store.currentRules.push({
    ruleType: [
      currentGroup.value,
      currentCriterium.value,
      currentSpecification.value
    ],
    percentage: currentPercentage.value,
    limitation: currentLimitation.value,
    priority: currentPriority.value
  })

  console.log(store.currentRules)
  
  await invokes.treePushRuleLock(store.currentRules);

  await updateRules();

  console.log(store.currentRules)
};

const updateRules = async () => {
  store.currentRules = await invokes.treePullRuleLock();
}

const ruleToText = (
  rule: RuleLock
) => {
  const [group, criterium, specification] = rule.ruleType;
  const percentage = rule.percentage;
  const limitation = rule.limitation;
  const priority = rule.priority;

  let text = "";

  if (group === 0) {
    text += "Hand group > ";

    if (criterium === 0) {
      text += "Any hand > ";
    } else if (criterium === 1) {
      text += "A-high > ";
    } else if (criterium === 2) {
      text += "Suited > ";
    } else if (criterium === 3) {
      text += "Offsuit > ";
    } else {
      text += "??? >"
    }


    if (specification === 0) {
      text += "Any rank";
    } else if (specification === 12) {
      text += "A-high";
    } else if (specification === 11) {
      text += "K-high";
    } else if (specification === 10) {
      text += "Q-high";
    } else if (specification === 9) {
      text += "J-high";
    } else if (specification === 8) {
      text += "T-high";
    } else if (specification === 7) {
      text += "9-high";
    } else if (specification === 6) {
      text += "8-high";
    } else if (specification === 5) {
      text += "7-high";
    } else if (specification === 4) {
      text += "6-high";
    } else if (specification === 3) {
      text += "5-high";
    } else if (specification === 2) {
      text += "4-high";
    } else if (specification === 1) {
      text += "3-high";
    } else {
      text += "???"
    }
  }

  else if (group === 1 || group === 2) {
    if(group === 2)
      text += "Made hand (or better) > ";
    else
      text += "Made hand (strict) > ";
  
    if (criterium === 0) {
      text += "High card > ";
  
      if (specification === 0) {
        text += "Any rank";
      } else if (specification === 1) {
        text += "Top high";
      } else if (specification === 2) {
        text += "Second high";
      } else {
        text += "???"
      }
    } else if (criterium === 1) {
      text += "One pair > ";

      if (specification === 0) {
        text += "Any";
      } else if (specification === 1) {
        text += "Overpair";
      } else if (specification === 2) {
        text += "Top pair";
      } else if (specification === 3) {
        text += "Middle pair";
      } else if (specification === 4) {
        text += "Bottom pair";
      } else {
        text += "???"
      }
    } else if (criterium === 2) {
      text += "Two pair";
    } else if (criterium === 3) {
      text += "Trip";
    } else if (criterium === 4) {
      text += "Set > ";

      if (specification === 0) {
        text += "Any";
      } else if (specification === 1) {
        text += "Top set";
      } else if (specification === 2) {
        text += "Middle set";
      } else if (specification === 3) {
        text += "Bottom set";
      } else {
        text += "???"
      }
    } else if (criterium === 5) {
      text += "Straight > ";

      if (specification === 0) {
        text += "Any";
      } else if (specification === 1) {
        text += "Nut";
      } else if (specification === 2) {
        text += "Second nut";
      } else {
        text += "???"
      }
    } else if (criterium === 6) {
      text += "Flush > ";

      if (specification === 0) {
        text += "Any";
      } else if (specification === 1) {
        text += "Nut";
      } else if (specification === 2) {
        text += "Second nut";
      } else {
        text += "???"
      }
    } else if (criterium === 7) {
      text += "Full house";
    } else if (criterium === 8) {
      text += "Quads";
    } else if (criterium === 9) {
      text += "Straight flush";
    } else {
      text += "???"
    }
  }

  else if (group === 3) {
    text += "Draw > ";

    if (criterium === 0) {
      text += "Overcards > ";
    } else if (criterium === 1) {
      text += "Backdoor flush draw > ";
    } else if (criterium === 2) {
      text += "Gutshot > ";
    } else if (criterium === 2) {
      text += "Open-ended straight draw > ";
    } else if (criterium === 3) {
      text += "Flush draw > ";
    } else {
      text += "???"
    }
    
    if (specification === 0) {
      text += "One / both";
    } else if (criterium === 1) {
      text += "One hole";
    } else if (criterium === 2) {
      text += "Both holes";
    } else {
      text += "???"
    }
  }
  
  else if (group === 4) {
    text += "Board texture > ";

    if (criterium === 0) {
      text += "Dry board > ";
    } else if (criterium === 11) {
      text += "Paired board > ";
    } else if (criterium === 12) {
      text += "Trip board > ";
    } else if (criterium === 13) {
      text += "Quad board > ";
    } else if (criterium === 21) {
      text += "Flush draw > ";
    } else if (criterium === 22) {
      text += "Flush present > ";
    } else if (criterium === 24) {
      text += "4 card flush > ";
    } else if (criterium === 31) {
      text += "Connected board > ";
    } else if (criterium === 32) {
      text += "Straight board > ";
    } else if (criterium === 33) {
      text += "4 card straight gapped > ";
    } else if (criterium === 34) {
      text += "4 card straight > ";
    } else {
      text += "??? > "
    }

    if (specification === 0) {
      text += "If true";
    } else if (criterium === 1) {
      text += "If false";
    } else {
      text += "???"
    }
  } else {
    text += "???"
  }

  text += ` - ${percentage}%`;

  if (limitation === -1) {
    text += " or less";
  } else if (limitation === 1) {
    text += " or more";
  }

  text += ` (priority ${priority})`;

  return text;
}

const updateActions = async () => {
  let tuple = await invokes.treePullRangeLock();

  if(tuple[0] === null)
    store.ranges[2] = Array.from({ length: 13 * 13 }, () => 0)
  else
    store.ranges[2] = tuple[0];

  if(tuple[1] === null)
    store.currentLimitRange = Array.from({ length: 13 * 13 }, () => 1)
  else
    store.currentLimitRange = tuple[1];
};


const saveRangeEdit = async () => {
  isRangeTextError.value = false;
  await onUpdateLocal(2);
  store.headers["node-locking"].pop();
  inEditor.value = false;
};

const cancelRangeEdit = async () => {
  rangeText.value = rangeTextCopy.value;
  await invokes.rangeFromString(2, rangeTextCopy.value);
  await onUpdate(2);
  store.headers["node-locking"].pop();
  inEditor.value = false;
};


// rules rulez

const currentGroup = ref(0);
const currentCriterium = ref(0);
const currentSpecification = ref(0);
const currentPercentage = ref(100);
const currentLimitation = ref(0);
const currentPriority = ref(0);

const onGroupChange = () => {
  console.log(currentGroup)
  currentCriterium.value = 0;
  currentSpecification.value = 0;
};

const onCriteriumChange = () => {
  currentSpecification.value = 0;
};


</script>
