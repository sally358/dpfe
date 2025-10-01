<template>
  <div class="w-full h-full flex flex-row">

    <div class="flex w-2/3">

      

      <!-- Made hands section -->

      <div class="flex flex-col w-1/2 border-b border-gray-500">

        <div class="flex flex-col w-full shrink-0 h-12 border-b border-gray-500">
          <div class="flex h-full w-full px-4 items-center text-lg font-semibold">
            Made hands
          </div>
        </div>
        
        <div 
          ref="tableDiv"
          class="flex-grow overflow-y-scroll will-change-scroll w-512">

          <div
          v-if="itemItemSuperTuple.rankItemTuples[handCategory.straightFlush].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Straight flush"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.straightFlush].length"
            />
            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex left-[3.25rem] top-0 h-full"
                  :style="{ width: `90%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.straightFlush]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          

          
          <div
          v-if="itemItemSuperTuple.rankItemTuples[handCategory.fourOfAKind].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Four of a kind"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.fourOfAKind].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.fourOfAKind]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          

          
          <div
          v-if="itemItemSuperTuple.rankItemTuples[handCategory.fullHouse].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Full house"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.fullHouse].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.fullHouse]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          
          <div
          v-if="itemItemSuperTuple.rankItemTuples[handCategory.flush].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Flush"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.flush].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.flush]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>


          
          <div
          v-if="itemItemSuperTuple.rankItemTuples[handCategory.straight].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Straight"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.straight].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex left top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.straight]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div
          v-if="itemItemSuperTuple.rankItemTuples[handCategory.threeOfAKind].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Three of a kind"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.threeOfAKind].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.threeOfAKind]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>


          <div
          v-if="itemItemSuperTuple.rankItemTuples[handCategory.twoPair].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Two Pair"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.twoPair].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.twoPair]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div
          v-if="fullRank.allRanked[handCategory.onePair].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Pair"
              :number="itemItemSuperTuple.rankItemTuples[handCategory.onePair].length"
            />

            <div class="px-4">
              
              <!-- the main chart -->
              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.onePair]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
              <!-- end of the chart -->

              <table class="table-auto">
                <tbody>
                  
                  <tr v-if="itemItemSuperTuple.pairItemTuples[4].length != 0">
                    <td class="px-4"><b>Over</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.pairItemTuples[4].length }}</td>
                    <td class="w-full">

                      <!-- the overpair chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.pairItemTuples[4]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  <tr v-if="itemItemSuperTuple.pairItemTuples[3].length != 0">
                    <td class="px-4"><b>Top</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.pairItemTuples[3].length }}</td>
                    <td class="w-full">

                      <!-- the top pair chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.pairItemTuples[3]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  
                  <tr v-if="itemItemSuperTuple.pairItemTuples[2].length != 0">
                    <td class="px-4"><b>Second</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.pairItemTuples[2].length }}</td>
                    <td class="w-full">

                      <!-- the top pair chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.pairItemTuples[2]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  
                  <tr v-if="itemItemSuperTuple.pairItemTuples[1].length != 0">
                    <td class="px-4"><b>Weak</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.pairItemTuples[1].length }}</td>
                    <td class="w-full">

                      <!-- the weak pair chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.pairItemTuples[1]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  
                  <tr v-if="itemItemSuperTuple.pairItemTuples[0].length != 0">
                    <td class="px-4"><b>Board</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.pairItemTuples[0].length }}</td>
                    <td class="w-full">

                      <!-- the top pair chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.pairItemTuples[0]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                </tbody>
              </table>

            </div>
          </div>

          <div
          v-if="fullRank.allRanked[handCategory.highCard].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <div class="flex flex-col w-full shrink-0 h-12 border-b border-gray-500">
              <div class="flex h-full w-full px-4 items-center text-lg">
                High card ({{ itemItemSuperTuple.rankItemTuples[handCategory.highCard].length }} combos)
              </div>
            </div>
            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.rankItemTuples[handCategory.highCard]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>

              <table class="table-auto">
                <tbody>
                  
                  <tr v-if="itemItemSuperTuple.highItemTuples[2].length != 0">
                    <td class="px-4"><b>Ace</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.highItemTuples[2].length }}</td>
                    <td class="w-full">

                      <!-- the ace high chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.highItemTuples[2]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  <tr v-if="itemItemSuperTuple.highItemTuples[1].length != 0">
                    <td class="px-4"><b>King</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.highItemTuples[1].length }}</td>
                    <td class="w-full">

                      <!-- the king high chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.highItemTuples[1]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  
                  <tr v-if="itemItemSuperTuple.highItemTuples[0].length != 0">
                    <td class="px-4"><b>Air</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.highItemTuples[0].length }}</td>
                    <td class="w-full">

                      <!-- the air chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.highItemTuples[1]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                </tbody>
              </table>

            </div>
          </div>


        </div>

      </div>
    
      <!-- Draws section -->
      <div class="flex flex-col w-1/2 border-b border-gray-500">

        <div class="flex flex-col w-full shrink-0 h-12 border-b border-gray-500">
          <div class="flex h-full w-full px-4 items-center text-lg font-semibold">
            Draws
          </div>
        </div>

        <div 
          ref="tableDiv"
          class="flex-grow overflow-y-scroll will-change-scroll w-512">
          
          <div
          v-if="itemItemSuperTuple.FDItemTuples[0].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Flush draw"
              :number="itemItemSuperTuple.FDItemTuples[0].length"
            />
            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.FDItemTuples[0]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>

            <table class="table-auto">
                <tbody>
                  
                  <tr v-if="itemItemSuperTuple.FDItemTuples[1].length != 0">
                    <td class="px-4"><b>Combo</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.FDItemTuples[1].length }}</td>
                    <td class="w-full">

                      <!-- combo draws -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.FDItemTuples[1]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  <tr v-if="itemItemSuperTuple.FDItemTuples[2].length != 0">
                    <td class="px-4"><b>Pair</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.FDItemTuples[2].length }}</td>
                    <td class="w-full">

                      <!-- the paired flush draw chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.FDItemTuples[2]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  
                  <tr v-if="itemItemSuperTuple.FDItemTuples[3].length != 0">
                    <td class="px-4"><b>Gutshot</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.FDItemTuples[3].length }}</td>
                    <td class="w-full">

                      <!-- the gutshot -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.FDItemTuples[3]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                </tbody>
            </table>
          </div>
          
          <div
          v-if="itemItemSuperTuple.SDItemTuples[0].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="OESD / DGSD"
              :number="itemItemSuperTuple.SDItemTuples[0].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.SDItemTuples[0]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>

            <table class="table-auto">
                <tbody>
                  
                  <tr v-if="itemItemSuperTuple.SDItemTuples[1].length != 0">
                    <td class="px-4"><b>Pair</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.SDItemTuples[1].length }}</td>
                    <td class="w-full">

                      <!-- the paired OESD -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.SDItemTuples[1]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  <tr v-if="itemItemSuperTuple.SDItemTuples[2].length != 0">
                    <td class="px-4"><b>Overcards</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.SDItemTuples[2].length }}</td>
                    <td class="w-full">

                      <!-- the overcards chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.SDItemTuples[2]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                </tbody>
            </table>
          </div>

          <div
          v-if="itemItemSuperTuple.GSItemTuples[0].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Gutshot"
              :number="itemItemSuperTuple.GSItemTuples[0].length"
            />

            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.GSItemTuples[0]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>

            <table class="table-auto">
                <tbody>
                  
                  <tr v-if="itemItemSuperTuple.GSItemTuples[1].length != 0">
                    <td class="px-4"><b>Pair</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.GSItemTuples[1].length }}</td>
                    <td class="w-full">

                      <!-- the paired gutshot -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.GSItemTuples[1]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                  <tr v-if="itemItemSuperTuple.GSItemTuples[2].length != 0">
                    <td class="px-4"><b>Overcards</b></td>
                    <td class="px-4">{{ itemItemSuperTuple.GSItemTuples[2].length }}</td>
                    <td class="w-full">

                      <!-- the overcards chart -->
                      <div class="relative h-16 mx-4 mt-6 mb-8" style="flex: 2">
                        <div
                          class="absolute flex top-0 h-full"
                          :style="{ width: `100%` }"
                          @mouseleave="tableScrollTarget = null"
                        >
                          <div
                            v-for="(item, i) in itemItemSuperTuple.GSItemTuples[2]"
                            :key="i"
                            class="hover:brightness-75"
                            :style="{ flex: item.weight, 'background-image': item.bgImage }"
                            @mouseover="tableScrollTarget = item.cards"
                          ></div>
                        </div>
                      </div>
                      <!-- end of the chart -->
                      
                    </td>
                  </tr>

                </tbody>
            </table>
          </div>

          <div
          v-if="itemItemSuperTuple.BFDItemTuples[0].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Backdoor flush draw"
              :number="itemItemSuperTuple.BFDItemTuples[0].length"
            />
            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.BFDItemTuples[0]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div
          v-if="itemItemSuperTuple.OCItemTuples[0].length != 0"
          class="flex flex-col w-full border-b border-gray-500">

            <block-header 
              label="Overcards"
              :number="itemItemSuperTuple.OCItemTuples[0].length"
            />
            <div class="px-4">
              <!--Hands: {{ rankedArray[handCategory.twoPair].length }}-->

              <div class="relative h-24 mx-4 mt-6 mb-8" style="flex: 2">
                <div
                  class="absolute flex top-0 h-full"
                  :style="{ width: `100%` }"
                  @mouseleave="tableScrollTarget = null"
                >
                  <div
                    v-for="(item, i) in itemItemSuperTuple.OCItemTuples[0]"
                    :key="i"
                    class="hover:brightness-75"
                    :style="{ flex: item.weight, 'background-image': item.bgImage }"
                    @mouseover="tableScrollTarget = item.cards"
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>
          
        
      </div>
      
    </div>

    <ResultTable
      style="flex: 3"
      table-mode="basics"
      :cards="cards"
      :selected-spot="selectedSpot"
      :results="results"
      :display-player="displayPlayer"
      :hover-content="null"
      :scroll-target="tableScrollTarget"
    />

  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { cardText, cardPairOrder, toFixed1, toFixedAdaptive, unPair } from "../utils";

  import 
  { 
    evaluate, evaluateSix, evaluateSeven, handCategory, 
    pairClassifier, highCardClassifier, checkDraws} from "../hand-master";

  import {
    Results,
    Spot,
    SpotChance,
    SpotPlayer,
    DisplayOptions,
  } from "../result-types";

  import {
    Chart,
    ChartData,
    ChartOptions,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Legend,
    Tooltip,
    Point,
    Plugin,
  } from "chart.js";

  import ResultTable from "./ResultTable.vue";
  import { isFunction } from "chart.js/dist/helpers/helpers.core";

  import BlockHeader from "./subcomponents/BreakdownBlockHeader.vue";

  
  const sky500 = "#0ea5e9";
  const lime500 = "#84cc16";
  const xTicks = 10000;

  const props = defineProps<{
    cards: number[][];
    selectedSpot: Spot;
    selectedChance: SpotChance | null;
    currentBoard: number[];
    results: Results;
    totalBetAmount: number[];
    displayOptions: DisplayOptions;
    displayPlayer: "oop" | "ip";
    isCompareMode: boolean;
  }>();

  const tableScrollTarget = ref<number | null>(null);


  const fullRank = computed( () => {

    let fullBreakdown: {
      allRanked: number[][];

      pairBreakdown: number[][];
      highCardBreakdown: number[][];

      flushDrawBreakdown: number[][];
      straightDrawBreakdown: number[][];
      gutshotBreakdown: number[][];

      overcards: number[][];
      backdoorFlushDraw: number[][];
    };

    // The VAR

    let allRanked: number[][] = [
      [], [], [], [], [], [], [], [], [] // the made hands groups (9)
    ];

    let pairBreakdown: number[][] = [[], [], [], [], []]; // board pair, weak pair, second pair, top pair, overpair
    let highCardBreakdown: number[][] = [[], [], []]; // ace high, king high, air

    let flushDrawBreakdown: number[][] = [[], [], [], []]; // flush draw, combo draw, flush draw + pair, flush draw + gutshot
    let straightDrawBreakdown: number[][] = [[], [], []]; // OESD, OESD + pair, OESD + overcards
    let gutshotBreakdown: number[][] = [[], [], []]; // gutshot, gutshot + pair, gutshot + overcards

    let backdoorFlushDraw: number[][] = [[]];
    let overcards: number[][] = [[]];

    // The card pack

    const player = props.displayPlayer;
    
    const playerIndex = player === "oop" ? 0 : 1;

    const hands = props.cards[playerIndex];

    const cardsLength = props.cards[playerIndex].length;

    const board = props.currentBoard;

    const weights = props.results.weights[playerIndex];


    // Cooking the combo arrays

    for (let handId = 0; handId < cardsLength; handId++)
    {
      if(weights[handId] == 0)
        continue;

      let cards = unPair(hands[handId]);

      let cardPack = [];

      cardPack.push(...board);
      cardPack.push(...cards);

      let evaluation = [];

      if (board.length == 3) // flop
        evaluation = evaluate(cardPack);

      else if (board.length == 4) // turn
        evaluation = evaluateSix(cardPack);
      
      else // river
        evaluation = evaluateSeven(cardPack);

      if (board.length < 5)
      {
        let drawData = checkDraws(board, cards, evaluation[0]);

        // flush draw checker
        if (drawData[2] == 2)
        {
          flushDrawBreakdown[0].push(hands[handId])

          if (drawData[1] == 2)
            flushDrawBreakdown[1].push(hands[handId])
          else if (drawData[1] == 1)
            flushDrawBreakdown[3].push(hands[handId])

          if (evaluation[0] == handCategory.onePair)
            flushDrawBreakdown[2].push(hands[handId])

        // backdoor flush draw
        } else if (drawData[2] == 1)
          backdoorFlushDraw[0].push(hands[handId]);

        // OESD + DGSD
        if (drawData[1] == 2)
        {
          straightDrawBreakdown[0].push(hands[handId])

          if (evaluation[0] == handCategory.onePair)
            straightDrawBreakdown[1].push(hands[handId]);

          if (drawData[0])
            straightDrawBreakdown[2].push(hands[handId]);

        } 
        else if (drawData[1] == 1)
        {
          gutshotBreakdown[0].push(hands[handId])

          if (evaluation[0] == handCategory.onePair)
            gutshotBreakdown[1].push(hands[handId]);

          if (drawData[0])
            gutshotBreakdown[2].push(hands[handId]);
        }

        if (drawData[0])
          overcards[0].push(hands[handId]);

      }
      
      if (evaluation[0] == handCategory.onePair)
      {
        let pairType = pairClassifier(board, cards);

        pairBreakdown[pairType].push(hands[handId]);
      }

      if (evaluation[0] == handCategory.highCard)
      {
        let highCardType = highCardClassifier(board, cards);

        highCardBreakdown[highCardType].push(hands[handId]);
      }
      
      
      // pushing into category

      allRanked[evaluation[0]].push(hands[handId]);
    }

    fullBreakdown = {
      allRanked: allRanked,
      pairBreakdown: pairBreakdown,
      highCardBreakdown: highCardBreakdown,

      flushDrawBreakdown: flushDrawBreakdown,
      straightDrawBreakdown: straightDrawBreakdown,
      gutshotBreakdown: gutshotBreakdown,

      backdoorFlushDraw: backdoorFlushDraw,
      overcards: overcards
    }


    return fullBreakdown;
  });

    
const tupleData = computed(() => {
  if (props.results.isEmpty) return null;

  const player = props.displayPlayer;

  const playerIndex = player === "oop" ? 0 : 1;

  const results = props.results;

  const allCards = props.cards[playerIndex];
  const allCardsLength = allCards.length;

  const weights = results.weights[playerIndex];
  const normalizer = results.normalizer[playerIndex];

  let allTuples: {
    rankTuples: number[][][],
    pairTuples: number[][][],
    highTuples: number[][][],
    
    FDTuples: number[][][],
    SDTuples: number[][][],
    GSTuples: number[][][],

    BFDTuples: number[][][],
    OCTuples: number[][][]
  };


  // setting the values for display

  const content = props.displayOptions.contentGraphs;

  let values: number[];

  if (content === "eq") {
    values = results.equity[playerIndex];
  } else if (content === "ev") {
    values = results.ev[playerIndex];
  } else {
    values = results.eqr[playerIndex]
      .map((x) => x ?? Number.NaN)
      .map((x) => (isFinite(x) ? x : Number.NaN));
  }
  

  const generateTuples = (cardArray: number[][]) => {

    let generatedTuples: number[][][] = [];

    for (let level = 0; level < cardArray.length; level++) {

      const cards = cardArray[level];
      const cardsLength = cards.length;

      // creating tuples
      
      let allTuples: number[][];

      allTuples = Array.from({ length: cardsLength }, (_, i) => {
        const handId = allCards.indexOf(cards[i]);

        if (handId === undefined)
          throw new Error("It just won't allow me to continue if I don't throw an error");

        const strategy = Array.from(
          { length: results.numActions },
          (_, j) => results.strategy[handId + j * allCardsLength]
        );
        return [cards[i], normalizer[handId], values[handId], ...strategy];
      });

      const tuples = allTuples.filter(
        (elem, i) => {
          console.log(elem[0]);
          const handId = allCards.indexOf(elem[0]);

          return weights[handId] > 0 // && normalizer[i] > 0
        }
      );

      // sorting tuples

      tuples.sort((a, b) => {
        if (!isNaN(a[2]) && !isNaN(b[2])) {
          return a[2] - b[2] || cardPairOrder(a[0]) - cardPairOrder(b[0]);
        } else if (!isNaN(a[2])) {
          return -1;
        } else if (!isNaN(b[2])) {
          return 1;
        } else {
          return 0;
        }
      });

      generatedTuples.push(tuples);
    }

    return generatedTuples;
  }
  
  // creating tuples

  const rankTuples: number[][][] = generateTuples(fullRank.value.allRanked);

  const pairTuples: number[][][] = generateTuples(fullRank.value.pairBreakdown);
  const highTuples: number[][][] = generateTuples(fullRank.value.highCardBreakdown);

  const FDTuples: number[][][] = generateTuples(fullRank.value.flushDrawBreakdown);
  const SDTuples: number[][][] = generateTuples(fullRank.value.straightDrawBreakdown);
  const GSTuples: number[][][] = generateTuples(fullRank.value.gutshotBreakdown);

  const BFDTuples: number[][][] = generateTuples(fullRank.value.backdoorFlushDraw);
  const OCTuples: number[][][] = generateTuples(fullRank.value.overcards);


  allTuples = {
    rankTuples: rankTuples,
    pairTuples: pairTuples,
    highTuples: highTuples,

    FDTuples: FDTuples,
    SDTuples: SDTuples,
    GSTuples: GSTuples,

    BFDTuples: BFDTuples,
    OCTuples: OCTuples
  }

  return allTuples;
});

/**
 * Returns tuples with items of a strategy diagram
 */
const itemItemSuperTuple = computed(() => {

  if (!tupleData.value) return {
    rankItemTuples: [],
    pairItemTuples: [],
    highItemTuples: [],

    FDItemTuples: [],
    SDItemTuples: [],
    GSItemTuples: [],

    BFDItemTuples: [],
    OCItemTuples: []
  };

  const numActions = props.results.numActions;
  const actionColors = (props.selectedSpot as SpotPlayer).actions.map(
    (a) => a.color
  );

  let itemTupleDatabase: {
    rankItemTuples: any[][],
    pairItemTuples: any[][],
    highItemTuples: any[][],

    FDItemTuples: any[][],
    SDItemTuples: any[][],
    GSItemTuples: any[][],

    BFDItemTuples: any[][],
    OCItemTuples: any[][]
  };

  // item tuple generator
  const generateItemTuples = (dataTuples: number[][][]) => {

    let itemTuples = [];

    for (let i = 0; i < dataTuples.length; i++)
    {
      let newTuple = dataTuples[i].map((tuple) => {

        let bgImage = "linear-gradient(to top";
        let pos = 0;

        for (let i = numActions - 1; i >= 0; --i) {
          const width = tuple[i + 3] * 100;
          const color = actionColors[i];
          bgImage += `, ${color} ${pos}% ${pos + width}%`;
          pos += width;
        }

        bgImage += ")";
        return { cards: tuple[0], weight: tuple[1], bgImage };

      });

      itemTuples.push(newTuple)
    }


    return itemTuples;

  }

  let rankItemTuples = generateItemTuples(tupleData.value.rankTuples);
  let pairItemTuples = generateItemTuples(tupleData.value.pairTuples);
  let highItemTuples = generateItemTuples(tupleData.value.highTuples);

  let FDItemTuples = generateItemTuples(tupleData.value.FDTuples);
  let SDItemTuples = generateItemTuples(tupleData.value.SDTuples);
  let GSItemTuples = generateItemTuples(tupleData.value.GSTuples);

  let BFDItemTuples = generateItemTuples(tupleData.value.BFDTuples);
  let OCItemTuples = generateItemTuples(tupleData.value.OCTuples);

  itemTupleDatabase = {
    rankItemTuples: rankItemTuples,
    pairItemTuples: pairItemTuples,
    highItemTuples: highItemTuples,

    FDItemTuples: FDItemTuples,
    SDItemTuples: SDItemTuples,
    GSItemTuples: GSItemTuples,

    BFDItemTuples: BFDItemTuples,
    OCItemTuples: OCItemTuples
  };

  return itemTupleDatabase;
});


</script>
