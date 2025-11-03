
const mysql =require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../vp2025config");


//database connection
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc page for adding photos to gallery
//@route GET /galleryphotoupload
//@access public

const photouploadPage = (req,res)=>{
	res.render("galleryphotoupload");
};



const photouploadPagePost = async (req,res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName = "vp_" + Date.now() + ".jpg";
		console.log(fileName);
		
		await fs.rename(req.file.path, req.file.destination + fileName);
		
		//loon normaalsuuruse 800x600
		await sharp(req.file.destination + fileName ).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		
		//loon thumbnail
		await sharp(req.file.destination + fileName ).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO ririVP (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
		//kuna kasutajakontosid veel ei ole siis määrame userid = 1
		const userId = 1;
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		
		console.log("Salvestati kirje " + result.insertId);
		
		res.render("galleryphotoupload");
		
	}
	catch(err) {
		console.log(err);
		res.render("galleryphotoupload");
	}
	finally{
		if(conn){
			await conn.end();
			console.log("connection closed");
		}
	}
};

module.exports = {
	photouploadPage,
	photouploadPagePost
};