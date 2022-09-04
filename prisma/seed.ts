import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getDailyPuzzles().map((puzzle) => {
      return db.dailyPuzzle.create({ data: puzzle });
    })
  );
}

function getDailyPuzzles() {
  return [{
    date: '2022-09-01',
    cards: '[{ "number": 1, "shape": "oval", "fill": "striped", "color": "red" }, { "number": 1, "shape": "squiggle", "fill": "empty", "color": "blue" }, { "number": 3, "shape": "squiggle", "fill": "solid", "color": "green" }, { "number": 2, "shape": "squiggle", "fill": "solid", "color": "blue" }, { "number": 3, "shape": "diamond", "fill": "solid", "color": "red" }, { "number": 2, "shape": "diamond", "fill": "striped", "color": "green" }, { "number": 3, "shape": "oval", "fill": "solid", "color": "red" }, { "number": 1, "shape": "diamond", "fill": "striped", "color": "blue" }, { "number": 3, "shape": "squiggle", "fill": "striped", "color": "green" }, { "number": 2, "shape": "diamond", "fill": "empty", "color": "green" }, { "number": 3, "shape": "diamond", "fill": "empty", "color": "green" }, { "number": 3, "shape": "squiggle", "fill": "empty", "color": "green" }]'
  },
  {
    date: '2022-09-02',
    cards: '[{"number":1,"shape":"oval","fill":"striped","color":"red"},{"number":2,"shape":"squiggle","fill":"solid","color":"red"},{"number":1,"shape":"oval","fill":"solid","color":"blue"},{"number":3,"shape":"squiggle","fill":"solid","color":"blue"},{"number":2,"shape":"oval","fill":"empty","color":"green"},{"number":1,"shape":"diamond","fill":"striped","color":"green"},{"number":2,"shape":"squiggle","fill":"empty","color":"green"},{"number":3,"shape":"diamond","fill":"solid","color":"blue"},{"number":2,"shape":"oval","fill":"striped","color":"blue"},{"number":2,"shape":"diamond","fill":"solid","color":"blue"},{"number":3,"shape":"squiggle","fill":"striped","color":"red"},{"number":2,"shape":"diamond","fill":"striped","color":"blue"}]'
  },
  {
    date: '2022-09-03',
    cards: '[{"number":2,"shape":"oval","fill":"empty","color":"blue"},{"number":1,"shape":"oval","fill":"striped","color":"green"},{"number":1,"shape":"diamond","fill":"empty","color":"red"},{"number":2,"shape":"oval","fill":"empty","color":"green"},{"number":3,"shape":"oval","fill":"empty","color":"green"},{"number":2,"shape":"oval","fill":"solid","color":"green"},{"number":1,"shape":"oval","fill":"empty","color":"red"},{"number":2,"shape":"squiggle","fill":"empty","color":"green"},{"number":3,"shape":"diamond","fill":"solid","color":"green"},{"number":1,"shape":"squiggle","fill":"striped","color":"blue"},{"number":3,"shape":"diamond","fill":"solid","color":"red"},{"number":3,"shape":"squiggle","fill":"striped","color":"blue"}]'
  }
];
}

seed();