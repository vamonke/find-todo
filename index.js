const fs = require("fs");
const readline = require("readline");
require("colors");

const DEFAULT_KEYWORD = "TODO";
const exclusions = [
  "node_modules",
  "package-lock.json",
  "package.json"
];
let regex;

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
    const inLineCount = (line.match(regex) || []).length;
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
  return exclusions.some((exclusion) => path.includes(exclusion));
};

const searchForKeyword = async (path, results) => {
  if (isExcluded(path)) return results;
  const stats = fs.statSync(path);
  const reader = stats.isFile() ? readFile : readDir;
  return reader(path, results);
};

const findTodo = async (searchDirectory, keyword) => {
  if (!searchDirectory) return {};

  const searchKey = keyword || DEFAULT_KEYWORD;
  const initialResult = { totalCount: 0, files: {}, searchKey };
  regex = new RegExp(searchKey, "gi");

  return searchForKeyword(searchDirectory, initialResult);
};

module.exports = findTodo;
