const fs = require("fs");
const readline = require("readline");
let json = {};
let jsonString = "{\n";
let prevLine = "";
const YAML_INDENT = "  ";

async function main() {
  const readStream = fs.createReadStream("test.yaml");

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    try {
      if (line.trim() === "---") {
        return;
      }

      const indent = line.match(/^\s*/)[0].length;
      const [key, value] = line.trim().split(":");

      const formattedKey = JSON.stringify(key.trim());
      const formattedValue = value.trim().startsWith("-")
        ? "[]"
        : JSON.stringify(value.trim());

      jsonString +=
        "  ".repeat(indent) + `${formattedKey}: ${formattedValue},\n`;
    } catch (error) {
      console.error(error);
      console.error(line);
    }
  });

  rl.on("close", () => {
    jsonString += "}";
    console.log(JSON.parse(jsonString));
    console.log("Finished reading the file.");
  });
}

main();
