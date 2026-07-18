<template>
  <table class="shadow-md">
    <tr v-for="row in 13" :key="row" class="h-2.5">
      <td
        v-for="col in 13"
        :key="col"
        class="relative w-2.5 border-[0.5px] border-black"
      >
        <div
          :class="
            'absolute w-full h-full left-0 top-0 ' +
            (row === col ? 'bg-neutral-700' : 'bg-neutral-800')
          "
        >
          <div
            class="absolute w-full h-full left-0 top-0 bg-bottom bg-no-repeat"
            :style="{
              'background-image': styleParser(row, col)[0],
              'background-size': styleParser(row, col)[1]
            }"
          ></div>
        </div>
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { useStore } from "../store";


const yellow500 = "#eab308";
const green500 = "#22c55e";
const red500 = "#ef4444";

const colorPack: string[] = [] 

colorPack[1] = green500
colorPack[0] = yellow500
colorPack[-1] = red500


const props = defineProps<{ player: number }>();
const store = useStore();

const cellValue = (row: number, col: number) => {
  const cellIndex = (row - 1) * 13 + (col - 1);
  return store.ranges[props.player][cellIndex];
};

const cellLimit = (row: number, col: number) => {
  const cellIndex = (row - 1) * 13 + (col - 1);
  return store.currentLimitRange[cellIndex];
};

const styleParserNodelock = (row: number, col: number) => {
  const weight = cellValue(row, col);
  const limit = cellLimit(row, col);

  if (limit != 1) 
  {
    // finger painting support section
    
    if (weight == 0)
      if (col == row)
        return ["linear-gradient(#270067 0% 100%)", "100% 100%"];
      else
        return ["linear-gradient(#270047 0% 100%)", "100% 100%"];
    else
      if (col == row)
        return ["linear-gradient(#270067 0% " + (100 - weight) + "%, " + colorPack[limit] + " " + (100 - weight) + "% 100%)", "100% 100%"];
      else
        return ["linear-gradient(#270047 0% " + (100 - weight) + "%, " + colorPack[limit] + " " + (100 - weight) + "% 100%)", "100% 100%"];
  }
  else
    return ["linear-gradient(" + colorPack[limit] + " 0% 100%)", "100% " + weight + "%"];
}

const styleParserNormal = (row: number, col: number) => {
  const weight = cellValue(row, col);
  return ["linear-gradient(" + colorPack[0] + " 0% 100%)", "100% " + weight + "%"];
}

let styleParser: (row: number, col: number) => string[];

if (props.player === 2) {
  styleParser = styleParserNodelock;
} else {
  styleParser = styleParserNormal;
}

</script>
