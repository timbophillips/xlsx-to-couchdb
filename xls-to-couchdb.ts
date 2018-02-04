import { readFile, utils, WorkBook } from "xlsx";
import { argv } from "yargs";
import { request } from "http";
import { render } from "prettyjson";
import { Command } from "commander";
import { beautifulJSON } from "./beautifulJSON";

const command = new Command();
const defaultFile = "Book1.xls";
const defaultCouchDB = "xlsxupload";
command
  .version("0.1.0")
  .option("-f, --file [pathname]", "The Excel xlsx file to use", defaultFile)
  .option(
    "-d, --database [CoudbDB database name]",
    "The name of the CouchDB database",
    defaultCouchDB
  )
  .parse(process.argv);
const xlsxFile = command.file;
const couchdbName = command.database;

// tell user what we are using
console.log(
  "the excel file is %s and the couchdb name is %s",
  xlsxFile,
  couchdbName
);

// use xlsx library to read the xlsx file to an object
try {
  const workbook = readFile(xlsxFile);

  // options set for the http post
  // couchdb on default port at localhost
  const postOptions = {
    hostname: "127.0.0.1",
    port: 5984,
    path: "/" + couchdbName + "/_bulk_docs",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  };

  // loop through the worksheets in the xlsx workbook
  workbook.SheetNames.forEach(sheetName => {
    // use xlsx library utils to convert worksheet to JSON
    const jsonOutput = utils.sheet_to_json(workbook.Sheets[sheetName]);

    // tell the user whats happening
    console.log(
      "sheet %s in workbook %s converted to JSON:",
      sheetName,
      xlsxFile
    );
    console.log(beautifulJSON(jsonOutput));
    console.log("uploading %s as JSON to %s", sheetName, couchdbName);

    // old school nodeJS http post (with prettyjson library)
    const req = request(postOptions, res => {
      console.log("Status: " + res.statusCode);
      console.log("Headers: " + render(res.headers));
      res.setEncoding("utf8");
      res.on("data", body => {
        console.log("Body: " + render(JSON.parse(body as string)));
      });
    });
    req.on("error", e => {
      console.log("problem with request: " + e.message);
    });
    // write data to request body
    // note the addition of docs: to the JSON string to
    // make it compatible with couchDB bulk_docs upload
    req.write('{"docs": ' + JSON.stringify(jsonOutput) + "}");
    req.end();
  });
} catch (error) {
  if (error.code === "ENOENT") {
    console.log(
      "The supplied filename %s must point to a valid xlsx file",
      xlsxFile
    );
    process.exit();
  }
}
