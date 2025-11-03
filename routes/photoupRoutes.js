const express = require("express");

const multer = require("multer");

const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});


//conrollerid
const {
	photouploadPage,
	photouploadPagePost} = require("../controllers/photouploadControllers");

router.route("/").get(photouploadPage);

router.route("/").post(uploader.single("photoInput"), photouploadPagePost);



module.exports = router;
