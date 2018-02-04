import { request, RequestOptions } from "http";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

// options set for the http post
// couchdb on default port at localhost
let _postOptions: RequestOptions = {
  hostname: "127.0.0.1",
  port: 5984,
  path: "",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};
// RxJS Subject for pushing new data to
let _stream = new Subject<string>();
// the fucntion called by the importing
// module. This returns an observable
// that fires with each return of data
// from the server
export const postJSON = (
  json: object,
  couchdbName: string
): Observable<string> => {
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
function _postJSON(json: object, couchdbName: string) {
  // add the path in to the post options
  // based on the database name
  _postOptions.path = "/" + couchdbName + "/_bulk_docs";
  // make the request
  const req = request(_postOptions, httpResult => {
    // set utf8 encoding
    httpResult.setEncoding("utf8");
    // callback to push data to Observable (via Subject)
    httpResult.on("data", httpResultbody => {
      // it comes out as type string | buffer
      // so cast it to a string for TS happiness
      _stream.next(httpResultbody as string);
    });
  });
  // write data to request body
  // note the addition of docs: to the JSON string to
  // make it compatible with couchDB bulk_docs upload
  req.write('{"docs": ' + JSON.stringify(json) + "}", "utf8");
  // close connection
  req.end();
  // error handling
  req.on("error", e => {
    _stream.next(JSON.stringify(e));
  });
}
