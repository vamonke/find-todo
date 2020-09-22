# find-todos

Search for TODOs in a directory

## Installation

find-todos is a node module available via npm. To install:

Run `npm install find-todos`

## Usage

### 1. Add the following script to your package.json scripts

```"find-todos": "find-todos <directoryPath> <searchKey>"```

Parameters (optional):

`directoryPath`: Directory to search in. Default: Project root directory

`searchKey`: Key word to search for. Default: "TODO"

### 2. Run command

`npm run find-todos`

Example:
```console
$ npm run find-todos
Searching for files with keyword TODO in ./sample
./sample/somedir/anotherdir/anotherfile.js - 1
   3: // TODO: ???

./sample/somefile.js - 3
   1: // TODO TODO TODO

Found 4 result(s) in 2 file(s)
```

---

[npm package](https://www.npmjs.com/package/find-todos)
