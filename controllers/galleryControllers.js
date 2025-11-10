
const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc home page for gallery
//@route GET /photogallery
//@access public

const galleryHome = async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alttext FROM ririVP WHERE privacy >= ? AND deleted IS NULL";
		const privacy = 2;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alttext;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("gallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/"});
	}
	catch(err){
		console.log(err);
		res.render("gallery", {galleryData:[], imagehref: ""});
	}
	finally {
	  if(conn){
	    await conn.end();
	    console.log("Andmebaasiühendus on suletud!");
	  }
	}
};

module.exports = {
	galleryHome
};