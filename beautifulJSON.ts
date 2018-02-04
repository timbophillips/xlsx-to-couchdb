export const beautifulJSON = function(json: object): string {
  const colorize = require("json-colorizer");
  const jsonPretty = JSON.stringify(json, null, 2);
  const jsonPrettyColor = colorize(jsonPretty);
  return jsonPrettyColor;
};
