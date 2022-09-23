import { Prisma, PuzzleGameHistory } from "@prisma/client";
import { db } from "~/utils/db.server";

// Moving over from deprecated db DailyPuzzle collection to PuzzleGame collection
export let createPuzzleGameHistoryCollection = async function () {
  createPuzzleGameHistoryCollection = async () => {};
  const dailyPuzzleHistories = await db.dailyPuzzleHistory.findMany();
  let puzzleGameHistories: Array<PuzzleGameHistory> = [];

  dailyPuzzleHistories.forEach((dailyPuzzleHistory) => {
    puzzleGameHistories.push({
      id: dailyPuzzleHistory.id,
      userId: dailyPuzzleHistory.userId,
      puzzleDate: dailyPuzzleHistory.puzzleDate,
      stringifiedSetIndexes: dailyPuzzleHistory.foundSets,
      createdAt: dailyPuzzleHistory.createdAt,
      updatedAt: dailyPuzzleHistory.updatedAt,
    });
  });

  await db.puzzleGameHistory.createMany({ data: puzzleGameHistories });
};

createPuzzleGameHistoryCollection();
