const mysql =require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

//database connection
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};
//@desc home page for estonian film section
//@route GET /Eestifilm
//@access public

const eestifilm = (req,res)=>{
	res.render("eestifilm");
};

//@desc page for people involved in estonian film industry
//@route GET /Eestifilm/filmiinimesed
//@access public


const inimesed = async (req,res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("connection!!");
		const [rows,fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
		
	}
	catch{
		console.log("error:" + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally{
		if(conn){
			await conn.end();
			console.log("connection closed")
		}
	}
};

//@desc page for adding people to film estonian industry database
//@route GET /Eestifilm/filmiinimesed_add
//@access public

const inimesed_Add = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};

//app.post("/Eestifilm/inimesed_Add", async (req, res)=>{
//@desc page for adding people to estonian film industry database
//@route POST /Eestifilm/filmiinimesed_add
//@access public

const inimesedAddPost = async (req,res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput >= new Date()){
		res.render("filmiinimesed_add", {notice: "osa andmeid puudu või ebakorrektsed"});
	}
	else {
		try{
			conn = await mysql.createConnection(dbConf);
			console.log("connection!!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput , req.body.lastNameInput , req.body.bornInput , req.body.deceasedInput , deceasedDate]);
			console.log("input saved," + result.insertId);
			res.render("filmiinimesed_add", {notice: "data saved"});
		}
		catch{
			console.log("error:" + err);
			res.render("filmiinimesed_add", {notice: "salvestamine ebaõnnestus" + err});
			
		}
		finally{
			if(conn){
				await conn.end();
				console.log("connection closed")
			}
		}
	}
};

module.exports = {
	eestifilm,
	inimesed,
	inimesed_Add,
	inimesedAddPost
};
