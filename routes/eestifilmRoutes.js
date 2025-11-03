const express = require("express");
const router = express.Router();


//conrollerid
const {
	eestifilm,
	inimesed,
	inimesed_Add,
	inimesedAddPost} = require("../controllers/eestifilmControllers");

router.route("/").get(eestifilm);

router.route("/inimesed").get(inimesed);

router.route("/inimesed_add").get(inimesed_Add);

router.route("/filmiinimesed_add").post(inimesedAddPost);

module.exports = router;





