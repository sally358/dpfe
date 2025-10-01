<template>
  <div
    v-if="!store.isSolverFinished"
    class="flex w-full max-w-screen-xl mx-auto px-4 py-6 items-center"
  >
    <span
      v-if="store.isSolverRunning || store.isFinalizing"
      class="spinner inline-block mr-3"
    ></span>
    {{
      !store.hasSolverRun
        ? "Solver has not run."
        : store.isSolverRunning
        ? "Solver running..."
        : store.isFinalizing
        ? "Finalizing..."
        : store.isSolverError
        ? "Solver error."
        : "Solver paused."
    }}
  </div>

  <div v-else>
    <div>
      Drill name:
      <input
        v-model="drillName"
        type="text"
        class="w-64 ml-2 px-2 py-1 rounded-lg text-sm"
      />
    </div>

    <div>
      Comment:
      <textarea
        v-model="drillComment"
        class="w-64 ml-2 mb-4 px-2 py-1 rounded-lg text-sm"
      >
      </textarea>
    </div>

    <div>
      OOP name:
      <input
        v-model="OOPname"
        type="text"
        class="w-20 ml-2 px-2 py-1 rounded-lg text-sm text-center"
      />
    </div>

    <div>
      IP name:
      <input
        v-model="IPname"
        type="text"
        class="w-20 ml-2 px-2 py-1 rounded-lg text-sm text-center"
      />
    </div>

    <div>
      Drill number:
      <input
        v-model="drillNumber"
        type="number"
        class="w-20 ml-2 px-2 py-1 rounded-lg text-sm text-center"
      />
    </div>

    <button
      class="ml-3 button-base button-blue"
      @click="createDrills"
    >
      Create drills
    </button>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watchPostEffect } from "vue";

import { useStore, useSavedConfigStore } from "../store";
import * as invokes from "../invokes";

let drillName: string = "";
let drillComment: string = "";

let OOPname: string = "OOP";
let IPname: string = "IP";

let drillNumber: number = 4;

import {
  Results,
  ChanceReports,
  Spot,
  SpotChance,
  SpotPlayer,
  DisplayMode,
  DisplayOptions,
  HoverContent,
} from "../result-types";

import {
  Drill,
  DrillPack,
  DrillBranch,
  DrillBranchAction,
  SequenceAction,

  generateRandomBool,
  generateRandomExclusive,
  generateRandomCard,
  pickRandom,

  sleep
} from "../drill-master";

import {
  unPair,
  cardText,
  colorString
} from "../utils";

const store = useStore();
const config = useSavedConfigStore();


// COLOR STUFF



const foldColor = { red: 0x3b, green: 0x82, blue: 0xf6 }; // blue-500
const checkColor = { red: 0x22, green: 0xc5, blue: 0x5e }; // green-500
const callColor = { red: 0x22, green: 0xc5, blue: 0x5e }; // green-500

const betColorGradient = [
  { red: 0xf5, green: 0x9e, blue: 0x0b }, // amber-500
  { red: 0xf9, green: 0x73, blue: 0x16 }, // orange-500
  { red: 0xef, green: 0x44, blue: 0x44 }, // red-500
  { red: 0xec, green: 0x48, blue: 0x99 }, // pink-500
  { red: 0xd9, green: 0x46, blue: 0xef }, // fuchsia-500
  { red: 0xa8, green: 0x55, blue: 0xf7 }, // purple-500
  { red: 0x8b, green: 0x5c, blue: 0xf6 }, // violet-500
];

const actionColor = (
  name: string,
  index: number,
  numActions: number,
  numBetActions: number
) => {
  if (name === "Fold") return colorString(foldColor);
  if (name === "Check") return colorString(checkColor);
  if (name === "Call") return colorString(callColor);

  if (numBetActions === 1) return colorString(betColorGradient[0]);
  if (index === numActions - 1) {
    const denom = numBetActions === 2 ? 2 : 1;
    return colorString(betColorGradient[(betColorGradient.length - 1) / denom]);
  }

  const betIndex = index - (numActions - numBetActions);
  const colorRate = betIndex / (numBetActions - 1);

  const gradientRate = colorRate * (betColorGradient.length - 1);
  const gradientIndex = Math.floor(gradientRate);
  const r = gradientRate - gradientIndex;

  const color1 = betColorGradient[gradientIndex];
  const color2 = betColorGradient[gradientIndex + 1];

  const retColor = { red: 0, green: 0, blue: 0 };
  for (const primary of ["red", "green", "blue"] as const) {
    const primary1 = color1[primary];
    const primary2 = color2[primary];
    retColor[primary] = Math.round(primary1 * (1 - r) + primary2 * r);
  }

  return colorString(retColor);
};



// END COLOR STUFF


const createDrills = async () =>
{
  const drillPack = new DrillPack(drillName, drillComment);

  const cardsResult: number[][] = await invokes.gamePrivateCards();

  const flop: number[] = [...config.board];
  const startingPot: number = config.startingPot;
  const startingStacks: number = config.effectiveStack;


  for (let i = 0; i < drillNumber; i++)
  {
    invokes.gameApplyHistory([]);

    const isOOPHero = generateRandomBool();

    const hero = isOOPHero ? "oop" : "ip";
    const villain = isOOPHero ? "ip" : "oop";

    const deadCards = [...flop]

    const OOPhandPaired = pickRandom(cardsResult[0])
    const OOPhand = unPair(OOPhandPaired)

    deadCards.push(...OOPhand)

    let IPhandPaired: number;
    let IPhand: number[];

    do
    {
      IPhandPaired = pickRandom(cardsResult[1])
      IPhand = unPair(IPhandPaired)
    }
    while (deadCards.includes(IPhand[0]) || deadCards.includes(IPhand[1]))

    deadCards.push(...IPhand)

    const OOPhandID = cardsResult[0].indexOf(OOPhandPaired)
    const IPhandID = cardsResult[1].indexOf(IPhandPaired)

    let turnCard;
    let riverCard;

    do
      turnCard = generateRandomCard()
    while (deadCards.includes(turnCard))

    deadCards.push(turnCard)

    do
      riverCard = generateRandomCard()
    while (deadCards.includes(riverCard))

    deadCards.push(riverCard)

    const branchQueue = [];
    const actionQueue: number[][] = [];
    const stageQueue: number[] = []
    
    const newDrill = new Drill(
      OOPname, IPname, 
      hero,
      startingPot, startingStacks,
      OOPhand, IPhand,
      flop
    );

    const coreBranch = new DrillBranch();
    
    newDrill.coreBranch = coreBranch;
    
    const baseActionArray: number[] = [];

    branchQueue.push(coreBranch);
    actionQueue.push([]);
    stageQueue.push(0)

    while (branchQueue.length > 0)
    {
      const currentBranch = branchQueue.shift();
      const currentAction = actionQueue.shift();

      let currentStage = stageQueue.shift();

      const sequenceArray: SequenceAction[] = [];

      if(currentAction === undefined)
        throw new Error("THIS IS NEVER GOING TO HAPPEN YOU DAMN TANTRUMSCRIPT! CAN YOU THROW ERRORS IF ITS UNDEFINED ON YOUR OWN?!")
      if(currentBranch === undefined)
        throw new Error("DO YOU SEE THE 'WHILE' CONDITION?! HOW THE HELL IS IT GOING TO BE UNDEFINED?!")
      if(currentStage === undefined)
        throw new Error("I give up.")

      if (currentBranch.endFlag != 0)
        continue
      
      invokes.gameApplyHistory(currentAction);
      let results = await invokes.gameGetResults();

      
      let actions = await invokes.gameActionsAfter([]);


      heroSearcher: while(results.currentPlayer != hero || actions[0] == "chance")
      {
        if(actions[0] == "chance")
        {
          switch (currentStage)
          {
            case 0:
              currentAction.push(turnCard);
              currentBranch.sequence.push(new SequenceAction(10, turnCard));
              currentStage++;
              break;
            
            case 1:
              currentAction.push(riverCard);
              currentBranch.sequence.push(new SequenceAction(11, riverCard));
              currentStage++;
              break;
            
            default:
              throw new Error("Wtf is this chance supposed to mean")

          }
          
        }
        else if(actions[0] == "terminal")
        {
          currentBranch.endFlag = 1;
          break heroSearcher;
        }
        else if(results.currentPlayer == villain)
        {
          let villainStrategy;
          
          // Getting villain strategy
          if(results.currentPlayer == "oop")
            villainStrategy = Array.from(
              { length: results.numActions },
              (_, i) => results.strategy[OOPhandID + i * cardsResult[0].length]
            );
          else
            villainStrategy = Array.from(
              { length: results.numActions },
              (_, i) => results.strategy[IPhandID + i * cardsResult[1].length]
            );
          
          const villainChance = Math.random();
          let currentLevel = 0;
          let currentActionId = 0;

          while (villainChance > currentLevel + villainStrategy[currentActionId])
          {
            currentLevel += villainStrategy[currentActionId];
            currentActionId++;
          }

          currentAction.push(currentActionId)

          const selectedActionData = actions[currentActionId].split(":");

          let newSequenceAction: SequenceAction;

          switch (selectedActionData[0])
          {
            case "Fold":
              newSequenceAction = new SequenceAction(0, 0);
              currentBranch.endFlag = 1;

              currentBranch.sequence.push(newSequenceAction);
              break heroSearcher;

            case "Check":
              newSequenceAction = new SequenceAction(1, 0);
              break;
            
            case "Call":
              newSequenceAction = new SequenceAction(2, 0);
              break;
            
            case "Raise":
            case "Bet":
              newSequenceAction = new SequenceAction(3, parseFloat(selectedActionData[1]));
              break;
            
            case "Allin":
              newSequenceAction = new SequenceAction(4, parseFloat(selectedActionData[1]));
              break;
            
            case "terminal":
              currentBranch.endFlag = 1;
              break heroSearcher;

            default:
              throw new Error("I am the " + selectedActionData[0])
          }

          currentBranch.sequence.push(newSequenceAction);
        }

        invokes.gameApplyHistory(currentAction);
        results = await invokes.gameGetResults();
        actions = await invokes.gameActionsAfter([]);
      }

      if(results.currentPlayer == hero)
      {
        let heroStrategy;

        if(results.currentPlayer == "oop")
          heroStrategy = Array.from(
            { length: results.numActions },
            (_, i) => results.strategy[OOPhandID + i * cardsResult[0].length]
          );
        else
          heroStrategy = Array.from(
            { length: results.numActions },
            (_, i) => results.strategy[IPhandID + i * cardsResult[1].length]
          );
        
        let numBetActions = actions.length;
        if (actions[0].split(":")[1] === "0") --numBetActions;
        if (actions[1]?.split(":")[1] === "0") --numBetActions;
        
        for (let actionId = 0; actionId < actions.length; actionId++)
        {
          const actionData = actions[actionId].split(":");

          const drillBranch = new DrillBranch();

          branchQueue.push(drillBranch);
          actionQueue.push([...currentAction, actionId]);
          stageQueue.push(currentStage);

          const color = actionColor(actionData[0], actionId, results.numActions, numBetActions);
          const ev = results.currentPlayer == "oop" ? results.ev[0][OOPhandID] : results.ev[1][IPhandID];

          let branchAction: DrillBranchAction;

          switch (actionData[0])
          {
            case "Fold":
              branchAction = new DrillBranchAction(
                0, 0,
                color, heroStrategy[actionId], ev,
                drillBranch
              )
              drillBranch.endFlag = 1;
              
              currentBranch.actions.push(branchAction);

              break;

            case "Check":
              branchAction = new DrillBranchAction(
                1, 0,
                color, heroStrategy[actionId], ev,
                drillBranch
              )

              if(results.currentPlayer == "oop" && currentStage == 2)
                drillBranch.endFlag = 1;

              
              currentBranch.actions.push(branchAction);

              break;
            
            case "Call":
              branchAction = new DrillBranchAction(
                2, 0,
                color, heroStrategy[actionId], ev,
                drillBranch
              )

              if(results.currentPlayer == "oop" && currentStage == 2)
                drillBranch.endFlag = 1;

              
              currentBranch.actions.push(branchAction);

              break;
            
            case "Raise":
            case "Bet":
              branchAction = new DrillBranchAction(
                3, parseFloat(actionData[1]),
                color, heroStrategy[actionId], ev,
                drillBranch
              )
              
              
              currentBranch.actions.push(branchAction);
              break;
            
            case "Allin":
              branchAction = new DrillBranchAction(
                4, parseFloat(actionData[1]),
                color, heroStrategy[actionId], ev,
                drillBranch
              )
              
              currentBranch.actions.push(branchAction);
              break;
            
            case "terminal":
              currentBranch.endFlag = 1;
              break;
            
            default:
              throw new Error("No, I am the " + actionData[0])
          }

          if(heroStrategy[actionId] == 0)
            drillBranch.endFlag = 2;
        }
        
      }

    }

    drillPack.drills.push(newDrill)

  }
  
  console.log(drillPack)

  const blob = new Blob([JSON.stringify(drillPack)])
  const link = document.createElement("a");
  link.download = "drillPack.json";
  link.href = window.URL.createObjectURL(blob);
  link.click()
  
}

</script>