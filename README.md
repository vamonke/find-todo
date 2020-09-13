# FIND-TODO

This is a tool to search for TODOs in a directory

## Installation

find-todos is a node module available via npm. You can install it using

`npm install --g find-todo`

## Usage

Tool can be run in the terminal or in code, with 2 optional arguments: directory path and search key.

directoryPath: Directory to search in. Default: Current terminal directory

searchKey: Key word to search for. Default: "TODO"

### In terminal

`node find-todo <directoryPath> <searchKey>`

Default directory_path: Current terminal directory

Default search_key: "TODO"

Example:
```console
$ node find-todo ./sample
Searching for files with keyword TODO in ./sample
./sample/somedir/anotherdir/anotherfile.js - 1
   3: // TODO: ???

./sample/somefile.js - 3
   1: // TODO TODO TODO

Found 4 result(s) in 2 file(s)
```

### In code

`todoSearch(directoryPath, searchKey)`

```javascript
var todoSearch = require("todo-search");

await todoSearch("./sample");
// returns
{
    "totalCount": 4,
    "files": {
        "./sample/somedir/anotherdir/anotherfile.js": {
            "lines": {
                "3": "// TODO: ???"
            },
            "keywordCount": 1
        },
        "./sample/somefile.js": {
            "lines": {
                "1": "// TODO TODO TODO"
            },
            "keywordCount": 3
        }
    },
    "searchKey": "TODO"
}
```
