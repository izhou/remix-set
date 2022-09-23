import {
  PuzzleGame,
  CardFills,
  CardColors,
  CardShapes,
  CardData,
  CardNumbers,
} from "@prisma/client";
import { db } from "~/utils/db.server";

enum OldCardNumbers {
  One = 1,
  Two,
  Three,
}

enum OldCardShapes {
  Squiggle = "squiggle",
  Oval = "oval",
  Diamond = "diamond",
}

enum OldCardFills {
  Solid = "solid",
  Empty = "empty",
  Striped = "striped",
}

enum OldCardColors {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

interface OldCardData {
  number: OldCardNumbers;
  shape: OldCardShapes;
  fill: OldCardFills;
  color: OldCardColors;
}

const numberMap = {
  1: CardNumbers.One,
  2: CardNumbers.Two,
  3: CardNumbers.Three,
};

const shapeMap = {
  squiggle: CardShapes.Squiggle,
  oval: CardShapes.Oval,
  diamond: CardShapes.Diamond,
};

const fillMap = {
  solid: CardFills.Solid,
  empty: CardFills.Empty,
  striped: CardFills.Striped,
};

const colorMap = {
  red: CardColors.Red,
  green: CardColors.Green,
  blue: CardColors.Blue,
};

// Moving over from deprecated db DailyPuzzle collection to PuzzleGame collection
export let createPuzzleGameCollection = async function () {
  createPuzzleGameCollection = async () => {};
  const dailyPuzzles = await db.dailyPuzzle.findMany();
  let puzzleGames: Array<PuzzleGame> = [];

  dailyPuzzles.forEach((dailyPuzzle) => {
    const untypedCards = JSON.parse(dailyPuzzle.cards);
    let cards: Array<CardData>;
    cards = untypedCards.map((untypedCard: OldCardData): CardData => {
      return {
        number: numberMap[untypedCard.number],
        shape: shapeMap[untypedCard.shape],
        fill: fillMap[untypedCard.fill],
        color: colorMap[untypedCard.color],
      };
    });

    puzzleGames.push({
      id: dailyPuzzle.id,
      createdAt: dailyPuzzle.createdAt,
      date: dailyPuzzle.date,
      cards,
    });
  });

  await db.puzzleGame.createMany({ data: puzzleGames });
};

createPuzzleGameCollection();
