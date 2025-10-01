import exp from "constants";

export enum handCategory {
    highCard,
    onePair,
    twoPair,
    threeOfAKind,
    straight,
    flush,
    fullHouse,
    fourOfAKind,
    straightFlush
};

const suitBitMask = 3;
const rankShift = 2;

/**
 * Simple five-card hand sorter.
 * Sorts cards in ascending order. Sorts suits.
 * 
 * @param cardPack 
 * @returns {number[]}
 */
const orderify = (cardPack: number[]) => {
    let unsorted = [...cardPack];

    let sorted = unsorted.sort((a, b) => a - b);

    return sorted;
}

/**
 * Checks for a flush in a five-card hand array.
 * 
 * Returns true if flush, false if no flush.
 * 
 * @param cardPack 
 * @returns {Boolean}
 */
const checkFlush = (cardPack: number[]) => {

    let suitFirst = cardPack[0] & suitBitMask;

    for (let i = 1; i < 5; i++)
    {
        if ((cardPack[i] & suitBitMask) != suitFirst)
            return false;
    }

    return true;
}

/**
 * Checks for a straight in a five-card hand array.
 * Requires a sorted card array (use "orderify").
 * 
 * Returns the highest card id if straight, and 0 if no straight (2 can't be the highest number so it's alright for conditional checking).
 * 
 * @param cardPack 
 * @returns {number}
 */
const checkStraight = (cardPack: number[]) => {

    // normal straight detector

    let wheelChecker = true;

    if( // ace and two detected
        (cardPack[4] >>> rankShift == 12) 
        && 
        (cardPack[0] >>> rankShift == 0)
    ) 
        for (let i = 0; i < 3; i++)
        {
            if((cardPack[i+1] >>> rankShift) - (cardPack[i] >>> rankShift) != 1)
            {
                wheelChecker = false;
                break;
            }
        }
    else
        wheelChecker = false;


    // giving the wheel data if wheeled

    if (wheelChecker)
        return 5;


    for (let i = 0; i < 4; i++)
    {
        if((cardPack[i+1] >>> rankShift) - (cardPack[i] >>> rankShift) != 1)
        {
            return 0;
        }
    }

    return cardPack[4] >>> rankShift;
}

/**
 * Checks for a repeat based hand identificator.
 * Requires a sorted card array (use "orderify").
 * 
 * Returns an array of arrays.
 * 
 * The first array:
 * [0, -1, -1] - no pairs
 * 
 * [1, rank, -1] - one pair
 * [2, rank, -1] - three of a kind
 * [3, rank, -1] - four of a kind
 * 
 * [4, rankLow, rankHigh] - two pair
 * 
 * [5, rankPair, rankThree] - full house
 * 
 * The second array contains kickers in descending order.
 * 
 * @param cardPack 
 * @returns {number[][]}
 */
const checkRepeats = (cardPack: number[]) => {
    let repeat0 = -1;
    let repeat1 = -1;

    let type = 0;

    let kickerData: number[] = [];

    for (let i = 0; i < 4; i++)
    {
        if((cardPack[i] >>> rankShift) == (cardPack[i+1] >>> rankShift))
        {
            // detecting one pair
            if (type == 0)
            {
                type = 1;
                repeat0 = cardPack[i] >>> rankShift;
            }

            // IF PAIR ALREADY ESTABLISHED
            else if (type == 1)
            {
                // detecting three of a kind
                if(cardPack[i] >>> rankShift == repeat0)
                {
                    type = 2;
                }

                // detecting two pair
                else
                {
                    type = 4;
                    repeat1 = cardPack[i] >>> rankShift;
                }
            }

            // IF A TRIP IS ALREADY ESTABLISHED
            else if (type == 2)
            {
                // detecting quads
                if(cardPack[i] >>> rankShift == repeat0)
                {
                    type = 3;
                    break;
                }

                // detecting boat
                else
                {
                    type = 5;

                    repeat1 = repeat0;
                    repeat0 = cardPack[i] >>> rankShift;
                }
            }

            // IF TWO PAIR ALREADY ESTABLISHED
            else if (type == 4)
            {
                type = 5;

                repeat1 = cardPack[i] >>> rankShift;
            }


        }
        else
        {
            if((cardPack[i] >>> rankShift) != repeat0 && (cardPack[i] >>> rankShift) != repeat1)
            {
                kickerData.unshift(cardPack[i] >>> rankShift);
            }
        }
    }

    return [[type, repeat0, repeat1], kickerData];
}

/**
 * Evaluates a five-cards hand.
 * 
 * Returns an array, where the first number is the hand class, and the next five values are compariables:
 * a set of values to be compared in the future if two hand ranks are identical, sorted descendingly by importance.
 * 
 * @param cardPack 
 * @returns {number[]}
 */
export const evaluate = (cardPack: number[]) => {
    let cardPackSorted = orderify(cardPack);

    let repeatData = checkRepeats(cardPackSorted);
    
    let repeatValue = repeatData[0];
    let kickers = repeatData[1];


    let returnData: number[] = [-1,   -1, -1, -1, -1, -1];

    if (repeatValue[0] == 0) // no repeating cards detected
    {
        let isFlush = checkFlush(cardPackSorted);

        let straightData = checkStraight(cardPackSorted);
        
        // straight flush (impossible)
        if (isFlush && straightData) 
        {
            returnData[0] = handCategory.straightFlush;
            returnData[1] = straightData;
        }

        // flush
        else if (isFlush) 
        {
            returnData[0] = handCategory.flush;

            returnData[1] = cardPack[4];
            returnData[2] = cardPack[3];
            returnData[3] = cardPack[2];
            returnData[4] = cardPack[1];
            returnData[5] = cardPack[0];
        }

        // straight
        else if (straightData) 
        {
            returnData[0] = handCategory.straight;
            returnData[1] = straightData;
        }

        // high card
        else
        {
            returnData[0] = handCategory.highCard;

            returnData[1] = cardPack[4];
            returnData[2] = cardPack[3];
            returnData[3] = cardPack[2];
            returnData[4] = cardPack[1];
            returnData[5] = cardPack[0];
        }

    }
    else // repeats found
    {
        switch (repeatValue[0])
        {
            case 1:
                returnData[0] = handCategory.onePair;

                returnData[1] = repeatValue[1];

                returnData[2] = kickers[0];
                returnData[3] = kickers[1];
                returnData[4] = kickers[2];

                break;
            
            case 2:
                returnData[0] = handCategory.threeOfAKind;

                returnData[1] = repeatValue[1];

                returnData[2] = kickers[0];
                returnData[3] = kickers[1];

                break;
            
            case 3:
                returnData[0] = handCategory.fourOfAKind;

                returnData[1] = repeatValue[1];

                returnData[2] = kickers[0];

                break;
            
            case 4:
                returnData[0] = handCategory.twoPair;

                returnData[1] = repeatValue[2];
                returnData[2] = repeatValue[1];

                returnData[3] = kickers[0];

                break;
            
            case 5:
                returnData[0] = handCategory.fullHouse;

                returnData[1] = repeatValue[2];
                returnData[2] = repeatValue[1];

                break;
            
            default:
                throw new Error("Unknown repeat ranking");


        }
    }

    if (returnData[0] == -1)
        throw new Error("Something went wrong in the hand evaluation function.");
    else
        return returnData;
}

/**
 * Picks the best five-card hand from a six-card set.
 * 
 * Returns the value similar to the result of the "evaluate" function for the best hand.
 * 
 * @param cardPack 
 * @returns {number[]}
 */
export const evaluateSix = (sixCardPack: number[]) => {
    let resultDataArray: number[][] = [];

    for (let cardVoid = 0; cardVoid < 6; cardVoid ++)
    {
        let fiveCardPack: number[] = [];

        for (let i = 0; i < 6; i++)
        {
            if (i != cardVoid)
                fiveCardPack.push(sixCardPack[i]);
        }

        resultDataArray.push(evaluate(fiveCardPack));
    }

    let rankedSorted = resultDataArray.sort((a, b) => rankedSorter(a, b));

    return rankedSorted[0];
}


/**
 * Picks the best five-card hand from a seven-card set.
 * 
 * Returns the value similar to the result of the "evaluate" function for the best hand.
 * 
 * @param cardPack 
 * @returns {number[]}
 */
export const evaluateSeven = (sevenCardPack: number[]) => {
    let resultDataArray: number[][] = [];

    let cardVoid1 = 0;
    let cardVoid2 = 1;

    while (true)
    {
        let fiveCardPack: number[] = [];

        for (let i = 0; i < 7; i++)
        {
            if (i != cardVoid1 && i != cardVoid2)
                fiveCardPack.push(sevenCardPack[i]);
        }

        resultDataArray.push(evaluate(fiveCardPack));

        if (cardVoid1 == cardVoid2 - 1)
        {
            if (cardVoid2 == 6)
                break;
            else
            {
                cardVoid1 = 0;
                cardVoid2++;
            }
        }
        else
            cardVoid1++;
            
    }

    let rankedSorted = resultDataArray.sort((a, b) => rankedSorter(a, b));

    return rankedSorted[0];
}

/**
 * Returns 1 if handDataA is lower than handDataB,
 * Returns -1 if handDataA is higher than handDataB
 * Returns 0 if they are equal.
 * 
 * @returns {number}
 */
const rankedSorter = (handDataA: number[], handDataB: number[]) => {
    for (let i = 0; i < 6; i++)
    {
        if(handDataA[i] > handDataB[i])
            return -1;
        else if(handDataA[i] < handDataB[i])
            return 1;
    }

    return 0;
}

/**
 * Implies that the given board+cards combo only has one pair.
 * 
 * Returns 0 if the pair is a board pair
 * 
 * Returns 1 if the pair is a weak pair
 * Returns 2 if the pair is a second pair
 * Returns 3 if the pair is a top pair
 * 
 * Returns 4 if the pair is an overpair
 * 
 * @returns {number}
 */
export const pairClassifier = (board: number[], cards: number[]) => {
    let boardSorted = orderify([...board]);

    if (cards[0] >>> rankShift == cards[1] >>> rankShift) // pocket pair
    {
        let pocketRank = cards[0] >>> rankShift;

        if (pocketRank > (boardSorted[board.length - 1] >>> rankShift))         // overpair
            return 4;
        else if (pocketRank > (boardSorted[board.length - 2] >>> rankShift))    // second pocket pair
            return 2;
        else                                                            // weak pocket pair
            return 1;
    }
    else
    {
        for (let i = 0; i < board.length-1; i++) // board pair detector
        {
            if (boardSorted[i] >>> rankShift == boardSorted[i+1] >>> rankShift)
                return 0;
        }

        let cardRank = [cards[0] >>> rankShift, cards[1] >>> rankShift];

        if (
            cardRank[0] == (boardSorted[board.length - 1] >>> rankShift)
            ||
            cardRank[1] == (boardSorted[board.length - 1] >>> rankShift)
        )

            return 3;

        else if (
            cardRank[0] == (boardSorted[board.length - 2] >>> rankShift)
            ||
            cardRank[1] == (boardSorted[board.length - 2] >>> rankShift)
        )

            return 2;

        else

            return 1;


    }

    return 0;
}

/**
 * Implies that the given board+cards is a high card.
 * 
 * Returns 0 if air.
 * 
 * Returns 1 if ace high.
 * Returns 2 if king high.
 * 
 * @returns {number}
 */
export const highCardClassifier = (board: number[], cards: number[]) => {
    let allCards = [...board];
    allCards.push(...cards);

    let cardsSorted = orderify(allCards);

    let topCardRank = cardsSorted[allCards.length - 1] >>> rankShift;

    if (topCardRank == 12)
        return 2;
    else if (topCardRank == 11)
        return 1;
    else
        return 0;

}


/**
 * Checks for a straight draw in a card array.
 * Requires a sorted card array (use "orderify").
 * 
 * Returns:
 * 2 if OESD / DGSD.
 * 1 if gutshot.
 * 0 if none.
 * 
 * @param cardPack 
 * @returns {number}
 */
const checkStraightDraws = (cardPack: number[]) => {
    
    // OESD detector
    let sequence = 0;

    for (let i = 0; i < cardPack.length-1; i++)
    {
        let card1rank = cardPack[i] >>> rankShift;
        let card2rank = cardPack[i+1] >>> rankShift;

        if (i == 0 && card1rank == 0 && (cardPack[cardPack.length-1] >>> rankShift) == 12)
            sequence = 1;

        if (card2rank - card1rank == 1)
            sequence++;
        else if (card2rank - card1rank == 0)
            continue;
        else
            sequence = 0;

        if (sequence == 3)
            if (card2rank == 12 || card2rank == 3)
                return 1;
            else
                return 2;
    }

    // DGSD detector
    let jump = 0;
    let repeats = 0;

    for (let i = 0; i < cardPack.length-1; i++)
    {
        let card1rank = cardPack[i] >>> rankShift;
        let card2rank = cardPack[i+1] >>> rankShift;

        if (i == 0 && card1rank == 1 && (cardPack[cardPack.length-1] >>> rankShift) == 12)
            jump = 1;
        
        if(card2rank - card1rank == 2)
        {
            if(jump == 1 && repeats == 2)
                return 2;
            else
            {
                jump = 1;
                repeats = 0;
            }
        }
        else if(card2rank - card1rank == 1)
        {
            if(jump == 1)
                repeats++;
        }
        else
        {
            jump = 0;
            repeats = 0;
        }
    }

    // Gutshot detector
    let gutshotJump = 0;
    let gutshotRepeats1 = 0;
    let gutshotRepeats2 = 0;

    for (let i = 0; i < cardPack.length-1; i++)
    {
        let card1rank = cardPack[i] >>> rankShift;
        let card2rank = cardPack[i+1] >>> rankShift;

        if (i == 0 && card1rank == 0 && (cardPack[cardPack.length-1] >>> rankShift) == 12)
            gutshotRepeats1 = 1;
        else if (i == 0 && card1rank == 1 && (cardPack[cardPack.length-1] >>> rankShift) == 12)
            gutshotJump = 1;
        
        if(card2rank - card1rank == 2)
        {
            if(gutshotJump == 1)
            {
                gutshotRepeats1 = gutshotRepeats2;
                gutshotRepeats2 = 0;
            }
            else
            {
                gutshotJump = 1;
            }
        }
        else if(card2rank - card1rank == 1)
        {
            if(gutshotJump == 1)
                gutshotRepeats2++;
            else
                gutshotRepeats1++;
        }
        else
        {
            gutshotJump = 0;
            gutshotRepeats1 = 0;
            gutshotRepeats2 = 0;
        }

        if(gutshotRepeats1 + gutshotRepeats2 == 2 && gutshotJump == 1)
            return 1;
    }

    return 0;
}


/**
 * Checks for a flush draw in a card array.
 * 
 * Returns:
 * 2 if a flush draw.
 * 1 if a backdoor flush draw.
 * 0 if none.
 * 
 * @param cardPack 
 * @returns {number}
 */
const checkFlushDraws = (cardPack: number[]) => {
    let suits = [0, 0, 0, 0];

    for (let i = 0; i < cardPack.length; i++)
    {
        let suit = cardPack[i] & suitBitMask;

        suits[suit]++;
    }

    if(suits[0] == 4 || suits[1] == 4 || suits[2] == 4 || suits[3] == 4 )
        return 2;
    else if(suits[0] == 3 || suits[1] == 3 || suits[2] == 3 || suits[3] == 3 )
        return 1;
    else 
        return 0;
}

/**
 * Checks if overcards.
 * 
 * Returns:
 * true if overcards.
 * false if none.
 * 
 * @returns {boolean}
 */
const checkOvercards = (board: number[], hand: number[]) => {
    let boardSorted = orderify(board);

    if ((hand[0] >>> rankShift) == (hand[1] >>> rankShift))
        return false;

    if ((hand[0] >>> rankShift) > (boardSorted[board.length-1] >>> rankShift) && (hand[1] >>> rankShift) > (boardSorted[board.length-1] >>> rankShift))
        return true;
    else
        return false;
}

export const checkDraws = (board: number[], hand: number[], rank: number) => {
    
    let cardPackUnordered = [...board];
    cardPackUnordered.push(...hand);

    let cardPack = orderify(cardPackUnordered);

    let isOvercards: boolean;
    let straightDraw: number;
    let flushDraw: number;

    if (rank < handCategory.straight)
        isOvercards = checkOvercards(board, hand);
    else
        isOvercards = false;


    if (rank < handCategory.straight)
        straightDraw = checkStraightDraws(cardPack)
    else
        straightDraw = 0;

    if (rank < handCategory.flush)
    {
        flushDraw = checkFlushDraws(cardPack);

        if (board.length > 3 && flushDraw == 1)
            flushDraw = 0;
    }
    else
    {
        flushDraw = 0;
    }

    return [isOvercards, straightDraw, flushDraw]
    
}