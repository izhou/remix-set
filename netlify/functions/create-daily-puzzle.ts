import { schedule } from "@netlify/functions";
import { choosePuzzleCards } from "~/utils/game";
import { db } from "~/utils/db.server";

const createDailyPuzzle = async () => {
  let cards = JSON.stringify(choosePuzzleCards());
  // Return in yyyy-mm-dd
  let date = new Date();
  let formattedDate = date.toISOString().slice(0, 10);

  await db.dailyPuzzle.create({
    data: {
      cards,
      date: formattedDate,
    },
  });

  return {
    statusCode: 200,
    body: `Puzzle for ${date.toISOString()} created.`,
  };
};

export const handler = schedule("0 7 * * *", createDailyPuzzle);
