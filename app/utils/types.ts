import { CardData } from "@prisma/client";
export type Set = [CardData, CardData, CardData];
export type SetIndex = [number, number, number];

export function unstringifySetIndex(stringifiedSetIndex: string): SetIndex {
  let setIndex = JSON.parse(stringifiedSetIndex);

  if (Array.isArray(setIndex) && setIndex.length == 3) {
    return [setIndex[0], setIndex[1], setIndex[2]];
  }

  throw new Error("Error - set index is not expected format");
}
