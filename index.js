const fs = require("fs");
const readline = require("readline");
require("colors");

const constants = {
  DEFAULT_KEYWORD: "TODO",
  NODE_MODULES_DIR: "node_modules",
  LINE_NO_LENGTH: 4,
};

let params = {
  isCLI: !module.parent
};

const setParams = (path, keyword) => {
  const searchKey = keyword || process.argv[3] || constants.DEFAULT_KEYWORD;
  const regex = new RegExp(searchKey, "gi");
  const searchDirectory = process.argv[2] || path || __dirname;
  const initialResult = { totalCount: 0, files: {}, searchKey };
  const exclusions = [__filename, constants.NODE_MODULES_DIR];

  Object.assign(params,
    {
      searchKey,
      regex,
      searchDirectory,
      initialResult,
      exclusions,
    }
  );

  return params;
};

const pushResult = (results, path, lineNo, line) => {
  let file = results.files[path];
  if (file) {
    file.lines[lineNo] = line;
  } else {
    file = { lines: { [lineNo]: line } };
    results.files[path] = file;
  }
};

const readFile = async (path, results) => {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(path),
    console: false,
  });

  let keywordCount = 0;
  let lineNo = 1;

  // Read line by line
  for await (const line of readInterface) {
    const inLineCount = (line.match(params.regex) || []).length;
    if (inLineCount > 0) {
      keywordCount += inLineCount;
      pushResult(results, path, lineNo, line);
    }
    lineNo++;
  }

  if (keywordCount > 0) {
    results.files[path].keywordCount = keywordCount;
    results.totalCount += keywordCount;
  }

  return results;
};

const readDir = async (path, results) => {
  const contents = fs.readdirSync(path);
  for (const content of contents) {
    const subpath = path + "/" + content;
    await searchForKeyword(subpath, results);
  }
  return results;
};

const isExcluded = (path) => {
  return params.exclusions.some((exclusion) => path.includes(exclusion));
};

const searchForKeyword = async (path, results) => {
  if (isExcluded(path)) return results;
  const stats = fs.statSync(path);
  const reader = stats.isFile() ? readFile : readDir;
  return reader(path, results);
};

const findTodo = async (path, keyword) => {
  const { isCLI, searchKey, searchDirectory, initialResult } = setParams(path, keyword);
  if (isCLI) printSearchMessage(searchKey, searchDirectory);
  return searchForKeyword(searchDirectory, initialResult);
};

// Print helpers
const printSearchMessage = (searchKey, searchDirectory) => {
  const msg = `Searching for files with keyword ${searchKey.yellow} in ${searchDirectory}`;
  console.log(msg);
};

const replacer = match => match.bgYellow.black;

const printLine = (lineNo, line) => {
  const lineYellow = line.replace(params.regex, replacer);
  const lineNoGrey = (lineNo.padStart(constants.LINE_NO_LENGTH, " ") + ":").gray;
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

if (params.isCLI) findTodo().then(printResults);

module.exports = findTodo;
