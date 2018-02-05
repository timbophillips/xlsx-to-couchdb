# xlsx-to-couchdb
NodeJs command line app for simple upload of Excel or Open Office spreadsheet to a CouchDB or PouchDB database. Ideally suited to simple spreadsheets with row 1 as keys and each subsequent row as a document of values.

https://github.com/timbophillips/xlsx-to-couchdb

Thanks to the xlsx npm module it supports a wide range of spreadsheet and spreadsheet-like formats (https://www.npmjs.com/package/xlsx#file-formats)

## to use

### download using npm
```
npm install -g xlsx-to-couchdb
xlsx-to-couchdb --file [xlsx pathname] --database [CoudbDB database name]
```

### or download from github
```
git clone https://github.com/timbophillips/xlsx-to-couchdb.git
cd xlsx-to-couchdb
npm install
node ./xlsx-to-couchdb.js --file [xlsx pathname] --database [CoudbDB database name]
```

### more options
```

  Usage: xlsx-to-couchdb [options]


  Options:

    -V, --version                           output the version number
    -f, --file <pathname>                   required - The Excel .xlsx / .xls or Open Office .ods file to use
    -d, --database <CoudbDB database name>  required - The name of the CouchDB database
    -p, --port [port]                       optional - CouchDB server port (default: 5984)
    -h, --hostname [hostname]               optional - CouchDB web server hostname (default: 127.0.0.1)
    -h, --help                              output usage information
```