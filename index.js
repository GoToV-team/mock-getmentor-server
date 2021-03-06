import { faker } from "@faker-js/faker";
import express from "express";
import morgan from "morgan";

let range = (len) => {
  let res = [];
  for (let i = 1; i <= len; i++) res.push(i);
  return res;
};

let randomInt = (min, max) => Math.ceil(Math.random(max - min) + min);
let randomRange = (min, max) => range(randomInt(min, max));
let belongRandom = (arr) => arr[randomInt(0, arr.length)];

let generateUser = (id) => {
  return {
    id,
    name: faker.name.firstName(),
    about: faker.lorem.lines(2),
    avatar: faker.image.avatar(),
    skills: randomRange(1, 5).map(() => faker.word.noun()),
    isMentor: Math.random() > 0.7,
  };
};

let tasks = [];

let generateTask = () => {
  let id = tasks.length;
  tasks.push({
    id,
    name: faker.lorem.words(3),
    about: faker.lorem.lines(2),
    isDone: Math.random() > 0.5,
  });
  return tasks[id];
};

let generatePlan = (id) => {
  return {
    id,
    title: faker.lorem.words(4),
    description: faker.lorem.lines(2),
    progress: Math.round(Math.random() * 100),
    skills: randomRange(1, 10).map(() => faker.lorem.words(1)),
    tasks: randomRange(2, 10).map(generateTask),
    mentor: belongRandom(users),
    menti: belongRandom(users),
  };
};

let users = range(100).map(generateUser);
let plans = range(1000).map(generatePlan);

const app = express();
app.use(morgan("dev"));

app.get("/api/v1/skills", (req, res) => {
  res.send(randomRange(100, 500).map(() => faker.lorem.words(1)));
});
app.get("/api/v1/search", (req, res) => {
  res.send(users.filter((u) => u.isMentor));
});
app.get("/api/v1/plans", (req, res) => {
  res.send(plans);
});
app.get("/api/v1/plan/:id", (req, res) => {
  res.send(
    Object.assign({}, plans[parseInt(req.params.id)], { isMentor: undefined })
  );
});

app.get("/api/v1/task/:id", (req, res) => {
  res.send(
    Object.assign({}, tasks[parseInt(req.params.id)], {
      about: faker.lorem.paragraphs(10),
    })
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
