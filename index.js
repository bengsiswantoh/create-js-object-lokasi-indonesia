const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://surabaya.go.id/id/page/0/8166/kecamatan";
const city = "surabaya";

const dataFilename = "data.json";
let rawData = fs.readFileSync(dataFilename);
let dataFile = JSON.parse(rawData);

const main = async () => {
  const { data } = await axios({
    method: "get",
    url,
  });
  // console.log(data);

  if (!dataFile[city]) {
    dataFile[city] = {};
  }

  let selector = cheerio.load(data);
  const first_row = selector("div.row:first");

  selector = cheerio.load(first_row.html());
  const items = selector("li > a");

  // selector = cheerio.load(first_row);
  // const items = selector("li");

  items.each(function (index, e) {
    const districtElement = selector(this);
    const district = districtElement.text().toLowerCase();

    const subCityElement = districtElement.parent().parent().parent();
    const subCity = subCityElement.text().split("\n")[0].toLowerCase();

    dataFile[city][district] = subCity;
    console.log(`add ${district} = ${subCity}`);
  });

  fs.writeFileSync(dataFilename, JSON.stringify(dataFile));
};

main();
