#! /usr/bin/env node

import { readFile, utils, WorkBook } from "xlsx";
import { request } from "http";
import { Command } from "commander";
import { Subscription } from "rxjs/Subscription";
import { beautifulJSON } from "./beautifulJSON";
import { postJSON } from "./uploadJSON2CouchDB";
import { isNumber } from "util";

// using commander.js argument parsing
const command = new Command();
command
  .version("0.1.0")
  .option("-f, --file <pathname>", "required - The Excel .xlsx or Open Office .nods file to use")
  .option(
    "-d, --database <CoudbDB database name>",
    "required - The name of the CouchDB database"
  )
  .option("-p, --port [port]", "optional - CouchDB server port", 5984)
  .option(
    "-h, --hostname [hostname]",
    "optional - CouchDB web server hostname",
    "127.0.0.1"
  )

  .parse(process.argv);
// check that the two mandantory arguments are provided
if (!command.file || !command.database) {
  command.help();
}

// assign user port or default depending on input
const port1: number = command.port ? parseInt(command.port) : 5984;
const port: number = (-1 < port1 && port1 < 65536 ) ? port1 : 5984;

// assign hostname to user inpunt if done correctly
// otherwise use default local server
const hostname: string = command.hostname || "127.0.0.1";

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
    console.log(
      "uploading %s as JSON to %s on server at %s:%s...",
      sheetName,
      couchdbName,
      hostname,
      port.toString()
    );
    // call the function from the module to post the JSON to the _bulk_docs API
    postJSON(jsonOutput, couchdbName, hostname, port).subscribe(x => {
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
