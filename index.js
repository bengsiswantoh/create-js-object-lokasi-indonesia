const fs = require("fs");
const { parse, write } = require("fast-csv");

const provinces = {};

const provincesData = {
  source: "../api-wilayah-indonesia/data/provinces.csv",
  name: "provinces",
  variable: provinces,
  output: "provinces.js",
};

const regencies = {};
const districts = {};
const villages = {};

const data = [
  {
    source: "../api-wilayah-indonesia/data/regencies.csv",
    name: "cities",
    variable: regencies,
    output: "cities.js",
  },
  {
    source: "../api-wilayah-indonesia/data/districts.csv",
    name: "districts",
    variable: districts,
    output: "districts.js",
  },
  {
    source: "../api-wilayah-indonesia/data/villages.csv",
    name: "subdistricts",
    variable: villages,
    output: "subdistricts.js",
  },
];

const writeFile = (filename, constName, content) => {
  var content = `export const ${constName} = ${JSON.stringify(content)}`;
  fs.writeFileSync(filename, content);
};

const createProvinces = () => {
  if (fs.existsSync(provincesData.output)) {
    fs.unlinkSync(provincesData.output);
  }

  fs.createReadStream(provincesData.source)
    .pipe(parse())
    .on("data", (row) => {
      const id = row[0];
      const name = row[1];

      if (!provincesData.variable["ALL"]) {
        provincesData.variable["ALL"] = [];
      }

      provincesData.variable["ALL"].push({ id, name });
    })
    .on("end", (rowCount) => {
      writeFile(
        provincesData.output,
        provincesData.name,
        provincesData.variable
      );
    });
};

const createOthers = () => {
  for (const item of data) {
    if (fs.existsSync(item.output)) {
      fs.unlinkSync(item.output);
    }

    fs.createReadStream(item.source)
      .pipe(parse())
      .on("data", (row) => {
        const id = row[0];
        const parentId = row[1];
        const name = row[2];

        if (!item.variable["ALL"]) {
          item.variable["ALL"] = [];
        }
        if (!item.variable[parentId]) {
          item.variable[parentId] = [];
        }

        item.variable["ALL"].push({ id, parentId, name });
        item.variable[parentId].push({ id, name });
      })
      .on("end", (rowCount) => {
        writeFile(item.output, item.name, item.variable);
      });
  }
};

createProvinces();
createOthers();
