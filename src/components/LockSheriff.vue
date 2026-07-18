<template>
  <div>
    <div class="flex">
      <div
        class="flex pl-2.5 pr-3 py-1 text-cyan-600 bg-cyan-50 border-2 border-cyan-600 rounded-md font-semibold"
      >
        <div>
          Welcome to LockSheriff™, the page where you can check if your locks are valid and if they are not, you can fix them. <br />
        </div>
      </div>
    </div>

    <div class="flex mt-4 gap-8 items-center">
      <div class="flex gap-2 items-center">
        <span class="pl-3">Scan status: </span>
        <span class="font-bold">{{ currentState }}</span>
      </div>
    </div>

    <div class="flex mt-4 gap-8 items-center">
        <div class="flex gap-2 items-center">
          <button
            :disabled="currentState == ScanStates[1]"
            class="button-base button-green"
            @click="policeLocks"
          >
            Scan
          </button>
          <button
            class="button-base button-red"
            @click="exit"
          >
            Exit LockSheriff™
          </button>
        </div>
    </div>

    <div class="mt-5">
      <div class="pl-3 font-semibold text-xl">
        Errors
      </div>
      <div class="mt-3" style="white-space: pre-line">
        {{ errorLines }}
      </div>
      <button
        v-if="moreToLoad"
        class="button-base button-blue"
        @click="loadMore"
      >
        Load next 50 lines
      </button>
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

const emit = defineEmits<{
  (event: "exit"): void;
}>();

enum ScanStates {
  "Not run",
  "Scanning...",
  "Finished"
}

const store = useStore();
const configStore = useConfigStore();

const errorLines = ref("Not run")
const moreToLoad = ref(false)
const moreCursor = ref(-1)

const currentState = ref(ScanStates[0])

let errorStrings: String[] = [];

const policeLocks = async () =>
{
  currentState.value = ScanStates[1];
  errorStrings = await invokes.treePoliceLocks(configStore.board);
  currentState.value = ScanStates[2];

  errorLines.value = ""

  if (errorStrings.length == 0)
  {
    errorLines.value = "Congratulations! No conflicts found.";
    moreToLoad.value = false;
  }
  else if (errorStrings.length <= 50)
  {
    for (const str of errorStrings)
    {
      errorLines.value += str + "\n";
    }

    moreToLoad.value = false;
  }
  else
  {
    for (let i = 0; i < 50; i++)
    {
      errorLines.value += errorStrings[i] + "\n";
    }

    moreToLoad.value = true;
    moreCursor.value = 50;
  }
}

const loadMore = () =>
{
  if (moreCursor.value + 50 >= errorStrings.length)
  {
    moreToLoad.value = false;

    for (let i = moreCursor.value; i < errorStrings.length; i++)
    {
      errorLines.value += errorStrings[i] + "\n";
    }
  }
  else
  {
    for (let i = moreCursor.value; i < moreCursor.value + 50; i++)
    {
      errorLines.value += errorStrings[i] + "\n";
    }

    moreCursor.value += 50;
  }

}

const exit = () =>
{
  emit("exit");

  errorLines.value = "Not run"
  moreToLoad.value = false
  moreCursor.value = -1

  currentState.value = ScanStates[0]

  errorStrings = [];
}


</script>
