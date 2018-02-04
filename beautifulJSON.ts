const colorize = require("json-colorizer");
import * as chalk from "chalk";

export const beautifulJSON = function(json: object): string {
  const colorOptions = {
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
  return colorize(JSON.stringify(json, null, 2), colorOptions);
};
