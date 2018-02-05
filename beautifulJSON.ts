const colorize = require("json-colorizer");
import * as chalk from "chalk";

export const beautifulJSON = (jsonStringOrObject: object | string): string => {
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

  let json: object = {};

  try {
    switch (typeof jsonStringOrObject) {
      case "string":
        return colorize(
          JSON.stringify(JSON.parse(jsonStringOrObject as string), null, 2),
          colorOptions
        );
      case "object":
        return colorize(
          JSON.stringify(jsonStringOrObject as object, null, 2),
          colorOptions
        );
      default:
        return jsonStringOrObject as string;
    }
  } catch (error) {
    // any problems just send back what was sent in unchanged
    return jsonStringOrObject as string;
  }
};
