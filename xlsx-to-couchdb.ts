#! /usr/bin/env node

import { readFile, utils, WorkBook } from "xlsx";
import { request } from "http";
import { Command } from "commander";
import { Subscription } from "rxjs/Subscription";
import { beautifulJSON } from "./beautifulJSON";
import { postJSON } from "./uploadJSON2CouchDB";

// using commander.js argument parsing
const command = new Command();
command
  .version("0.1.0")
  .option("-f, --file [pathname]", "mandantory - The Excel xlsx file to use")
  .option(
    "-d, --database [CoudbDB database name]",
    "mandantory - The name of the CouchDB database"
  )
  .parse(process.argv);
// check that the two mandantory arguments are provided
if (!command.file || !command.database) {
  command.help();
}
// assign them to string constants
const xlsxFile = command.file;
const couchdbName = command.database;
// use old school try..catch error handling
try {
  // use xlsx library to read the xlsx file to an object
  const workbook = readFile(xlsxFile);
  // loop through the worksheets in the xlsx workbook
  workbook.SheetNames.forEach(sheetName => {
    // use xlsx library utils to convert worksheet to JSON
    const jsonOutput = utils.sheet_to_json(workbook.Sheets[sheetName]);
    // tell the user whats happening
    console.log(
      "converting sheet %s in workbook %s to JSON...",
      sheetName,
      xlsxFile
    );
    // show user the JSON created from the xlsx
    console.log(beautifulJSON(jsonOutput));
    // more user noticiation
    console.log("uploading %s as JSON to %s...", sheetName, couchdbName);
    // call the function from the module to post the JSON to the _bulk_docs API
    postJSON(jsonOutput, couchdbName).subscribe(x => {
      // send the output of the observable to the console
      // this will either be the output of Apache CouchDB
      // if it is up or the nodeJS http library if not
      console.log(beautifulJSON(x));
    });
  });
} catch (error) {
  // the obvious error is the user providing a filename that
  // doesn't exist
  if (error.code === "ENOENT") {
    console.log(
      "The supplied filename %s must point to a valid xlsx file",
      xlsxFile
    );
    process.exit();
  }
}
