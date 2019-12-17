const express = require("express");
var path = require("path");
let os = require("os");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let userFace;

//
// редагування картинки https://prnt.sc/punzpf
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "uploads");
  },
  filename: (req, file, cb) =>{
    let time = Date.now();
      cb(null, `${time}-${file.originalname}`);
      userFace = `${time}-${file.originalname}`;
  }
});
router.use(express.static(__dirname));



router.get("/dashboard", (req, res) => {
  res.sendFile("dashboard.html", {
    root: path.join(__dirname, "../publick/")
  });
});

router.use(multer({ storage: storageConfig }).single("filedata"));

router.post("/dashboard/upload",  (req, res, next) => {
  console.log("===>", req.body);
  console.log('===>files',userFace);
  res.redirect("/dashboard");
});

module.exports = { rout: router };
