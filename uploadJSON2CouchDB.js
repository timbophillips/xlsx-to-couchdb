"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var Subject_1 = require("rxjs/Subject");
// options set for the http post
// couchdb on default port at localhost
var _postOptions = {
    // hostname: "127.0.0.1",
    // port: 5984,
    path: "",
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};
// RxJS Subject for pushing new data to
var _stream = new Subject_1.Subject();
// the fucntion called by the importing
// module. This returns an observable
// that fires with each return of data
// from the server
exports.postJSON = function (json, couchdbName, hostname, port) {
    // if none provided use the default port and local server
    _postOptions.port = port || 5984;
    _postOptions.hostname = hostname || '127.0.0.1';
    // calls the internal function
    // to make the http post request
    _postJSON(json, couchdbName);
    // return the observable to the calling code
    return _stream.asObservable();
};
// this is the function that really
// just does an old school NodeJS
// http request to post the JSON to
// the CouchDB _bulk_docs API
function _postJSON(json, couchdbName) {
    // add the path in to the post options
    // based on the database name
    _postOptions.path = "/" + couchdbName + "/_bulk_docs";
    // make the request
    var req = http_1.request(_postOptions, function (httpResult) {
        // set utf8 encoding
        httpResult.setEncoding("utf8");
        // callback to push data to Observable (via Subject)
        httpResult.on("data", function (httpResultbody) {
            // it comes out as type string | buffer
            // so cast it to a string for TS happiness
            _stream.next(httpResultbody);
        });
    });
    // write data to request body
    // note the addition of docs: to the JSON string to
    // make it compatible with couchDB bulk_docs upload
    req.write('{"docs": ' + JSON.stringify(json) + "}", "utf8");
    // close connection
    req.end();
    // error handling
    req.on("error", function (e) {
        _stream.next(JSON.stringify(e));
    });
}
