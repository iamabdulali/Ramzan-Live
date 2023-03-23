const express = require('express');
const app = express();
const fs = require('fs');
const { promisify } = require('util');
const { parse } = require('node-xlsx');

const readFile = promisify(fs.readFile);

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

app.get('/filter', async (req, res) => {
  const surahNo = req.query.surahNo;
  const ayahStart = req.query.ayahStart;
  const ayahEnd = req.query.ayahEnd;
  const juzNo = req.query.juzNo;

  const workbook = await readFile('Dataset-Verse-by-Verse.xlsx');
  const worksheet = parse(workbook)[0].data;

  let filteredData;
  if (juzNo) {
    filteredData = worksheet.filter(row => {
      const rowJuzNo = row[1];
      return rowJuzNo == juzNo;
    });
  } else {
    filteredData = worksheet.filter(row => {
      const rowSurahNo = row[4];
      const rowAyahNo = row[10];
      return rowSurahNo == surahNo && rowAyahNo >= ayahStart && rowAyahNo <= ayahEnd;
    });
  }

  res.send(filteredData);
});


app.listen(3000, () => console.log('Server started on port 3000'));
