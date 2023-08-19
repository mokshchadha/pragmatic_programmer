const fs = require("fs");
const readline = require("readline");

async function main() {
  const logger = fs.createWriteStream("snake_case.js", { flags: "a" });
  const readStream = fs.createReadStream("camelCase.js");
  const lineReader = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  lineReader.on("line", (line) => {
    const snakeCaseLine = convertCamelCaseToSnakeCase(line);
    console.log(snakeCaseLine);
    logger.write(snakeCaseLine + "\n");
  });

  lineReader.on("close", () => {
    logger.close();
    console.log("finished");
  });
}

main();

//====================

function convertCamelCaseToSnakeCase(line) {
  const splits = line.split(" ");
  const snakeCases = splits.map((e) => camelToSnake(e));
  return snakeCases.join(" ");
}

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, function (letter) {
    return "_" + letter.toLowerCase();
  });
}
