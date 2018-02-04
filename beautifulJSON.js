"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var colorize = require("json-colorizer");
var chalk = __importStar(require("chalk"));
exports.beautifulJSON = function (jsonStringOrObject) {
    var colorOptions = {
        colors: {
            BRACE: chalk.default.yellow,
            BRACKET: chalk.default.green,
            STRING_KEY: chalk.default.cyan,
            STRING_LITERAL: chalk.default.grey,
            COLON: chalk.default.white,
            COMMA: chalk.default.white,
            NUMBER_LITERAL: chalk.default.magenta,
            BOOLEAN_LITERAL: chalk.default.green,
            NULL_LITERAL: chalk.default.blue
        }
    };
    var json = {};
    switch (typeof jsonStringOrObject) {
        case "string":
            json = JSON.parse(jsonStringOrObject);
            break;
        default:
            json = jsonStringOrObject;
            break;
    }
    return colorize(JSON.stringify(json, null, 2), colorOptions);
};
