#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = require("xlsx");
var commander_1 = require("commander");
var beautifulJSON_1 = require("./beautifulJSON");
var uploadJSON2CouchDB_1 = require("./uploadJSON2CouchDB");
// using commander.js argument parsing
var command = new commander_1.Command();
command
    .version("0.1.0")
    .option("-f, --file <pathname>", "required - The Excel .xlsx / .xls or Open Office .ods file to use")
    .option("-d, --database <CoudbDB database name>", "required - The name of the CouchDB database")
    .option("-p, --port [port]", "optional - CouchDB server port", 5984)
    .option("-h, --hostname [hostname]", "optional - CouchDB web server hostname", "127.0.0.1")
    .parse(process.argv);
// check that the two mandantory arguments are provided
if (!command.file || !command.database) {
    command.help();
}
// assign user port or default depending on input
var port1 = command.port ? parseInt(command.port) : 5984;
var port = (-1 < port1 && port1 < 65536) ? port1 : 5984;
// assign hostname to user inpunt if done correctly
// otherwise use default local server
var hostname = command.hostname || "127.0.0.1";
// assign them to string constants
var xlsxFile = command.file;
var couchdbName = command.database;
// use old school try..catch error handling
try {
    // use xlsx library to read the xlsx file to an object
    var workbook_1 = xlsx_1.readFile(xlsxFile);
    // loop through the worksheets in the xlsx workbook
    workbook_1.SheetNames.forEach(function (sheetName) {
        // use xlsx library utils to convert worksheet to JSON
        var jsonOutput = xlsx_1.utils.sheet_to_json(workbook_1.Sheets[sheetName]);
        // tell the user whats happening
        console.log("converting sheet %s in workbook %s to JSON...", sheetName, xlsxFile);
        // show user the JSON created from the xlsx
        console.log(beautifulJSON_1.beautifulJSON(jsonOutput));
        // more user noticiation
        console.log("uploading %s as JSON to %s on server at %s:%s...", sheetName, couchdbName, hostname, port.toString());
        // call the function from the module to post the JSON to the _bulk_docs API
        uploadJSON2CouchDB_1.postJSON(jsonOutput, couchdbName, hostname, port).subscribe(function (x) {
            // send the output of the observable to the console
            // this will either be the output of Apache CouchDB
            // if it is up or the nodeJS http library if not
            console.log(beautifulJSON_1.beautifulJSON(x));
        });
    });
}
catch (error) {
    // the obvious error is the user providing a filename that
    // doesn't exist
    if (error.code === "ENOENT") {
        console.log("The supplied filename %s must point to a valid xlsx file", xlsxFile);
        process.exit();
    }
}
