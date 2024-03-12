require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const  URL  = require('./models/urlModel')
const shortid = require('shortid');
const validUrl = require('valid-url');

const uri = process.env.MONGO_URI
mongoose.connect(uri)

const connection = mongoose.connection
connection.on('error',console.error.bind(console,'connection error:'))
connection.once("open",() => {
  console.log("MongoDB database connection established succesfully")
})

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors());
app.use(express.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async function (req, res) {
  const url = req.body.url;
  const urlCode = shortid.generate();

  httpRegex = /^(http|https)(:\/\/)/;
  
  if (!httpRegex.test(url)) {
    return res.json({ error: 'invalid url' })}


    try {
      let findOne = await URL.findOne({
        original_url: url
      });
      if (findOne) {
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        });
      } else {
        findOne = new URL({
          original_url: url,
          short_url: urlCode,
        });
        await findOne.save();
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server error");
    }
  
});


app.get('/api/shorturl/:short_url?', async function(req, res) {
  try {
    const urlParams = await URL.findOne({
      short_url: req.params.short_url
    })

    if(urlParams){
      return res.redirect(urlParams.original_url)
    } else {
      return res.status(404).json("No URL found")
    }
  } catch (err) {
    console.log(err)
    res.status(500).json("Server error")
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
