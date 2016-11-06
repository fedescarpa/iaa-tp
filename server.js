const fs = require('fs')
const express = require('express')
const Tesseract = require('tesseract.js')
var bodyParser = require('body-parser');

const app = express();

app.post('/recognize', bodyParser.json({ strict: true }), function (req, res) {
  const data = req.body.base64.replace(/^data:image\/png;base64,/,"");
  Tesseract
    .recognize(new Buffer(data, 'base64'), { tessedit_char_whitelist: '1234567890abcdxABCX' })
    .then(function (result) { 
      res.json({ result: result.text[0] });
    })
    .catch(function (err) { 
      res.json({ error: err });
    });
});

app.use(express.static('docs'));

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
