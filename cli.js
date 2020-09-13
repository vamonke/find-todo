#!/usr/bin/env node

const findTodo = require("./index");
require("colors");

const LINE_NO_LENGTH = 4;
const DEFAULT_KEYWORD = "TODO";
const replacer = match => match.bgYellow.black;
let regex;

const printSearchMessage = (searchDirectory, searchKey) => {
  const msg = `Searching for files with keyword ${searchKey.yellow} in ${searchDirectory}`;
  console.log(msg);
};

const printLine = (lineNo, line) => {
  const lineYellow = line.replace(regex, replacer);
  const lineNoGrey = (lineNo.padStart(LINE_NO_LENGTH, " ") + ":").gray;
  console.log(`${lineNoGrey} ${lineYellow}`);
};

const printFile = (fileName, fileResults) => {
  const { keywordCount, lines } = fileResults;
  console.log(`${fileName.cyan} - ${String(keywordCount).yellow}`);
  for (lineNo in lines) {
    const line = lines[lineNo];
    printLine(lineNo, line);
  }
};

const printResults = (results) => {
  const { totalCount, files } = results;
  const filesCount = Object.keys(files).length;

  for (fileName in files) {
    printFile(fileName, files[fileName]);
    console.log();
  }

  console.log(`Found ${totalCount} result(s) in ${filesCount} file(s)`);
};

const cli = () => {
  const searchDirectory = process.argv[2] || process.cwd();
  const searchKey = process.argv[3] || DEFAULT_KEYWORD;
  regex = new RegExp(searchKey, "gi");

  printSearchMessage(searchDirectory, searchKey);
  findTodo(searchDirectory, searchKey).then(printResults);
};

cli();
