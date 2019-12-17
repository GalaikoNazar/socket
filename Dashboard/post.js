const express = require("express");
const app = express();
var path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
let router = require('./dashboard')
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.rout.post("/dashboard/upload", (req, res) => {
  res.send("/dashboard");
  console.log("===>", req.body);
});


