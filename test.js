const findTodo = require("./index");

const testDataResults = {
  file1: {
    path: "./sample/somefile.js",
  },
  file2: {
    path: "./sample/somedir/anotherdir/anotherfile.js",
    count: 1,
    lineNo: "3",
    line: "// TODO: ???",
  },
  file3: {
    path: "./sample/somedir/someotherfile.js",
    count: 1,
    lineNo: "1",
    line: "// Refactor",
  }
};

test("includes total number of keywords and filenames", async () => {
  const results = await findTodo("./sample");
  expect(results.totalCount).toEqual(4);

  const file1Path = testDataResults.file1.path;
  const file2Path = testDataResults.file2.path;
  
  expect(results).toHaveProperty("files");
  expect(results.files).toHaveProperty([file1Path]);
  expect(results.files).toHaveProperty([file2Path]);
});

test("includes number of keywords, line number and line for each file", async () => {
  const results = await findTodo("./sample/somedir");
  const {  path, count, lineNo, line } = testDataResults.file2;
  const file = results.files[path];
  expect(file.keywordCount).toEqual(count);
  expect(file.lines[lineNo]).toEqual(line);
});

test("allows searching with another keyword", async () => {
  const results = await findTodo("./sample", "refactor");
  const {  path, count, lineNo, line } = testDataResults.file3;
  const file = results.files[path];
  expect(file.keywordCount).toEqual(count);
  expect(file.lines[lineNo]).toEqual(line);
});
