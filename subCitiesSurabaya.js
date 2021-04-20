const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://surabaya.go.id/id/page/0/8166/kecamatan";
const filename = "surabaya-districts.js";

const main = async () => {
  const { data } = await axios({
    method: "get",
    url,
  });

  const districts = {};

  let selector = cheerio.load(data);
  const first_row = selector("div.row:first");

  selector = cheerio.load(first_row.html());
  const items = selector("li > a");

  items.each(function (index, e) {
    const districtElement = selector(this);
    const district = districtElement.text().toUpperCase();

    const subCityElement = districtElement.parent().parent().parent();
    const subCity = subCityElement.text().split("\n")[0].toUpperCase();

    districts[district] = subCity;
    console.log(`add ${district} = ${subCity}`);
  });

  var content = `export const surabayaDistricts = ${JSON.stringify(districts)}`;

  fs.writeFileSync(filename, content);
};

main();
