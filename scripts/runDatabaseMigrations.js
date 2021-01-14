import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { query, connectDatabase } from "../database/index";

const fsp = fs.promises;

dotenv.config();

connectDatabase();
const root = "./database/migrations/";

const getFiles = async () => {
  let fileNames = await fsp.readdir(root);
  console.log("FileNames: ", fileNames);
  return fileNames.sort((a, b) => a - b);
};

const runMigrations = async (files) => {
  for (let file of files) {
    const text = fs.readFileSync(
      path.resolve(`${root}${file.toString()}`),
      "utf8"
    );
    try {
      await query(text);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
};

const run = async () => {
  let files = await getFiles();
  await runMigrations(files);
};

run()
  .then(() => {
    console.log("Database setup successfully!");
    return process.exit();
  })
  .catch((err) => {
    console.log("Error creating Database!", err);
    return process.exit();
  });
