import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const action:ActionFunction = async({request}) =>{
  const form = await request.formData();
  const date = form.get("date");

  return redirect(`/daily/${date}`);
}

export const loader: LoaderFunction = async () => {
  // By default, show the most recent puzzle
  let puzzle = await db.dailyPuzzle.findFirst({
    orderBy: { date: 'desc' }
  });

  if (!puzzle) throw Error('no puzzles available');
  return redirect(`/daily/${puzzle.date}`);
  
}

export default function IndexRoute() {
  return (
    <></>
  );
}