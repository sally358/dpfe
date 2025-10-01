<template>
  <div>
    <div class="flex">
      <div
        class="flex pl-2.5 pr-3 py-1 text-cyan-600 bg-cyan-50 border-2 border-cyan-600 rounded-md font-semibold"
      >
        <InformationCircleIcon class="inline w-5 h-5 mt-[0.1875rem] mr-1.5" />
        <div>
          ICM mode can significantly slow down the solver, and it gets exponentially worse the more payout steps you input. Consider using lesser payout steps.<br />
          Due to some mysterious computational issues, ICM solutions tend to get stuck at higher exploitability. Consider manually stopping the solver or rely on the max-iterations parameter.
        </div>
      </div>
    </div>

    <div class="flex mt-4 gap-8 items-center">
      <label class="cursor-pointer">
        <input
          type="checkbox"
          v-model="store.isICMEnabled"
          class="mr-1 align-middle rounded"
        />
        Enable ICM
      </label>

      <div class="flex">
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
            What is ICM?
          </div>
          <template #content>
            <div class="px-1 py-0.5 text-justify">
              <div>
                Indepentent Chip Model (ICM) is a mathematical model used to estimate the equity of 
                players' chip stacks in a poker tournament. It takes into account the payout structure 
                and the remaining players' stacks to determine the value of each player's chips in 
                terms of their expected monetary value.
              </div>
              
              <div class="mt-3">
                This option apparently works but I'm not sure in the slightest if it works correctly.
                If you have any idea how it works or if it works correctly, please open an issue on GitHub.
              </div>
            </div>
          </template>
        </Tippy>
      </div>
    </div>

    <div v-if="store.isICMEnabled" class="mt-6">
      <div class="flex gap-8">
        <div class="flex flex-col w-1/2">
          
          <div class="flex flex-row">
          <span class="font-semibold">Player stacks</span>

          <Tippy
          class="inline-block cursor-help w-32 ml-4 text-gray-600"
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
                  Do not include the stacks of OOP and IP players here. Only include the stacks of
                  other players that are still in the tournament but not in the hand.
                </div>
              </div>
            </template>
          </Tippy>
          </div>

          <textarea 
          class="ml-2 h-64 mt-4 mb-4 px-2 py-1 rounded-lg text-sm"
          v-model="stacksTextarea"
          ></textarea>
          <span class="text-sm text-gray-600">
            (each from a new line, in any order)
          </span>
        </div>

        <div class="flex flex-col w-1/2">
          <div class="flex flex-row">
          <span class="font-semibold">Payout structure</span>

          <Tippy
          class="inline-block cursor-help w-32 ml-4 text-gray-600"
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
                  Do not include the payout steps that were already paid out.
                  If there are any, just substract the highest paid-out step amount from
                  the remaining ones. The next payout that will be paid off immediately
                  after the first player busts is also considered paid out.
                </div>
                <div>
                  If you input a payout structure that is too large (2 steps or more above
                  the number of players not in the pot), a jumpscare will be launched.
                </div>
              </div>
            </template>
          </Tippy>
          </div>

          <textarea 
          class="ml-2 h-64 mt-4 mb-4 px-2 py-1 rounded-lg text-sm"
          v-model="payoutsTextarea"
          ></textarea>
          <span class="text-sm text-gray-600">
            (each from a new line, in <b>descending</b> order, without any additional characters)
          </span>
        </div>
      </div>

      <div class="flex mt-8 gap-3 items-center">
        <span class="pl-3">
          OOP stack size:
          <input
            v-model="stackSizeOOP"
            type="number"
            :class="
              'w-20 ml-1.5 px-2 py-1 rounded-lg text-sm text-center ' +
              (stackSizeOOP < 1 || stackSizeOOP % 1 !== 0
                ? 'input-error'
                : '')
            "
            min="1"
            max="64"
          />
        </span>

        <span class="pl-3">
          IP stack size:
          <input
            v-model="stackSizeIP"
            type="number"
            :class="
              'w-20 ml-1.5 px-2 py-1 rounded-lg text-sm text-center ' +
              (stackSizeIP < 1 || stackSizeIP % 1 !== 0
                ? 'input-error'
                : '')
            "
            min="1"
            max="64"
          />
        </span>

        <Tippy
          class="inline-block cursor-help w-32 ml-4 text-gray-600"
          max-width="500px"
          trigger="mouseenter click"
          placement="top"
          :delay="[200, 0]"
          :interactive="true"
          >
            <QuestionMarkCircleIcon class="inline w-5 h-5" />
            <div class="inline-block ml-0.5 text-sm underline">
              Note
            </div>
            <template #content>
              <div class="px-1 py-0.5 text-justify">
                <div>
                  Do not include the money already put in the pot, just 
                  the stack sizes as they are at the moment from which the solution starts.
                </div>
              </div>
            </template>
          </Tippy>

        <button
          class="button-base button-blue"
          @click="applyICM"
        >
          Apply structure
        </button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore, useConfigStore } from "../store";
import { trimRegex, rangeRegex, cardText } from "../utils";
import * as invokes from "../invokes";

import RangeEditor from "./RangeEditor.vue";
import RangeMiniViewer from "./RangeMiniViewer.vue";
import { Tippy } from "vue-tippy";
import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/20/solid";

const store = useStore();
const configStore = useConfigStore();

let stackSizeOOP = 50;
let stackSizeIP = 50;

let stacksTextarea = "";
let payoutsTextarea = "";

const applyICM = () => {
  let stacks: number[] = [];
  let payouts: number[] = [];

  stacks = stacksTextarea
    .split("\n")
    .map((s) => parseInt(s.trim().replace(trimRegex, "")));
  
  payouts = payoutsTextarea
    .split("\n")
    .map((s) => parseInt(s.trim().replace(trimRegex, "")));

  console.log("Applying ICM with stacks:", stacks, "and payouts:", payouts);

  if(payouts.length >= stacks.length + 2) {
    launchJumpscare();
    return;
  }

  store.icmStacks = stacks;
  store.icmPayouts = payouts; 

  store.icmOOPStack = stackSizeOOP;
  store.icmIPStack = stackSizeIP;

  configStore.rakeCap = 0;
  configStore.rakePercent = 0;

  configStore.effectiveStack = Math.min(stackSizeOOP, stackSizeIP);
};

const launchJumpscare = async () => {
  window.open("https://www.youtube.com/watch?v=r11mz5jvHaU", "_blank")?.focus();
};

</script>
