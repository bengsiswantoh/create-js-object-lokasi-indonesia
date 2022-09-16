const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');

const url = 'https://surabaya.go.id/id/page/0/8166/kecamatan';
const filename = 'surabaya-sub-city';

const writeCsv = async (districtsArr) => {
  const csv = new ObjectsToCsv(districtsArr);
  await csv.toDisk(`${filename}.csv`);
};

const writeJs = (districts) => {
  const content = `export const surabayaSubCities = ${JSON.stringify(
    districts
  )}`;
  fs.writeFileSync(`${filename}.js`, content);
};

const main = async () => {
  const { data } = await axios({
    method: 'get',
    url,
  });

  const districts = {};
  const districtsArr = [];

  let selector = cheerio.load(data);

  const items = selector('li > a');

  items.each((index, e) => {
    const districtElement = selector(e);
    const district = districtElement.text().toUpperCase();
    const subCityElement = districtElement.parent().parent().parent();
    const subCity = subCityElement.text().split('\n')[0].toUpperCase();
    districts[district] = subCity;
    districtsArr.push({ district, subCity });
  });

  writeCsv(districtsArr);
  writeJs();
};

main();
