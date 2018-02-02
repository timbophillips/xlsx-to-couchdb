"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = require("xlsx");
var yargs_1 = require("yargs");
var http_1 = require("http");
var prettyjson_1 = require("prettyjson");
// make sure the user has supplied xlsx filename and couchdb
if (yargs_1.argv._.length < 2) {
    console.log('required argumnets: xls_filename couchdb_database_name');
    process.exit();
}
var xlsxFile = yargs_1.argv._[0];
var couchdbName = yargs_1.argv._[1];
// tell user what we are using
console.log("the excel file is %s and the couchdb name is %s", xlsxFile, couchdbName);
// options set for the http post
// couchdb on default port at localhost
var postOptions = {
    hostname: '127.0.0.1',
    port: 5984,
    path: '/' + couchdbName + '/_bulk_docs',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};
// use xlsx library to read the xlsx file to an object
var workbook = xlsx_1.readFile(xlsxFile);
// loop through the worksheets in the xlsx workbook
workbook.SheetNames.forEach(function (sheetName) {
    // use xlsx library utils to convert worksheet to JSON
    var jsonOutput = xlsx_1.utils.sheet_to_json(workbook.Sheets[sheetName]);
    // tell the user whats happening
    console.log('sheet %s in workbook %s converted to JSON:', sheetName, xlsxFile);
    console.log(prettyjson_1.render(jsonOutput));
    console.log('uploading %s as JSON to %s', sheetName, couchdbName);
    // old school nodeJS http post (with prettyjson library)
    var req = http_1.request(postOptions, function (res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + prettyjson_1.render(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body: ' + prettyjson_1.render(JSON.parse(body)));
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    // write data to request body
    // note the addition of docs: to the JSON string to 
    // make it compatible with couchDB bulk_docs upload
    req.write('{"docs": ' + JSON.stringify(jsonOutput) + '}');
    req.end();
});
