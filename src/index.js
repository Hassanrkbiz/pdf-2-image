const express = require('express');
const fs = require('fs')
const app = express();
var path = require('path')
const port = 3009;
var cors = require('cors');
var bodyParser = require('body-parser');
const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'output/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });

const pdfToPng = require('pdf-to-png-converter').pdfToPng;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/extension',upload.single('file'), async (req, res) => {
  var fileF = Object.values(req.file);
  console.log(fileF);

  const pngPage = await pdfToPng(
    fileF[fileF.length -2],
    {
      pagesToProcess: [1],
      viewportScale: 2.0,
      outputFolder: 'output',
    }
  );
  // console.log(pngPage);
  fs.unlinkSync(fileF[fileF.length -2])

  res.send(JSON.stringify({imgURL: pngPage[0].path}));
});

app.post('/api/deleteimg',async (req, res) => {

  // console.log(req.body.url);
  try{
    fs.unlinkSync(req.body.url)
  } catch(err){
    // console.log(err)
  }


  res.send(JSON.stringify({msg: 'Image deleted Successfully'}));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
