const fs = require("fs");
const { parse, write } = require("fast-csv");

const provinces = [];
const regencies = [];
const districts = [];
const villages = [];

const provincesData = {
  source: "../api-wilayah-indonesia/data/provinces.csv",
  name: "provinces",
  variable: provinces,
  output: "provinces.js",
};

// const data = [
//   {
//     source: "../api-wilayah-indonesia/data/regencies.csv",
//     name: "cities",
//     variable: regencies,
//     output: "cities.js",
//   },
//   {
//     source: "../api-wilayah-indonesia/data/districts.csv",
//     name: "districts",
//     variable: districts,
//     output: "districts.js",
//   },
//   {
//     source: "../api-wilayah-indonesia/data/villages.csv",
//     name: "subdistricts",
//     variable: villages,
//     output: "subdistricts.js",
//   },
// ];

const data = [
  {
    source: "../api-wilayah-indonesia/data/regencies.csv",
    name: "cities",
    variable: regencies,
    output: "cities.js",
  },
];

const writeFile = (filename, content) => {
  var content = `export const provinces = ${JSON.stringify(provinces)}`;
  fs.writeFileSync(filename, content);
};

fs.createReadStream(provincesData.source)
  .pipe(parse())
  .on("data", (row) => {
    const id = row[0];
    const name = row[1];
    provincesData.variable.push({ id, name });

    var content = `export const ${provincesData.name} = ${JSON.stringify(
      provincesData.variable
    )}`;
    writeFile(provincesData.output, content);
  });

for (const item of data) {
  fs.createReadStream(item.source)
    .pipe(parse())
    .on("data", (row) => {
      const id = row[0];
      const parent = row[1];
      const name = row[2];

      if (!item.variable[parent]) {
        item.variable[parent] = [];
      }
      if (!item.variable["ALL"]) {
        item.variable["ALL"] = [];
      }

      item.variable[parent].push({ id, name });
      item.variable["ALL"].push({ id, parent, name });

      var content = `export const ${item.name} = ${JSON.stringify(
        item.variable
      )}`;
      writeFile(item.output, content);
    });
}
