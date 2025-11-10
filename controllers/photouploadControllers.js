
const mysql =require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../vp2025config");
const watermarkFile = "./public/images/vp_logo_small.png";

//database connection
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc home page for uploading gallery photos
//@route GET /galleryphotupload
//@access public

const photouploadPage = (req, res)=>{
	res.render("galleryphotoupload");
}
//@desc page for adding photos to gallery
//@route GET /galleryphotoupload
//@access public

const photouploadPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName = "vp_" + Date.now() + ".jpg";
		console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName);
		//kontrollin, kas vesimÃ¤rgi fail on olemas
		const watermarkSettings = [{
            input: watermarkFile,
            gravity: "southeast"
        }];
		if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
             console.log("Vesimärgi faili ei leitud!");
             // TÃ¼hjendame seaded, et vesimÃ¤rki ei proovitaks lisada
             watermarkSettings.length = 0; 
        }
		console.log("Muudan suurust: 800X600");
		//loon normaalmÃµÃµdus foto (800X600)
		//await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		 let normalImageProcessor = await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90});
        console.log("Lisan vesimärgi" + watermarkSettings.length);    
        if (watermarkSettings.length > 0) {
            normalImageProcessor = await normalImageProcessor.composite(watermarkSettings);
        }
		await normalImageProcessor.toFile("./public/gallery/normal/" + fileName);
		//loon thumbnail pildi 100X100
		await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO galleryphotos_ta (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
		//kuna kasutajakontosid veel ei ole, siis mÃ¤Ã¤rame userid = 1
		const userId = 1;
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log("Salvestati kirje: " + result.insertId);
		res.render("galleryphotoupload");
	}
	catch(err) {
		console.log(err);
		res.render("galleryphotoupload");
	}
	finally {
		if(conn){
		await conn.end();
			console.log("Andmebaasiühendus on suletud!");
	  }
	}
};


module.exports = {
	photouploadPage,
	photouploadPagePost
};