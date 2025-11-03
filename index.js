const express = require("express");
const fs = require("fs");
//pÃ¤ringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
const mysql =require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
//kÃ¤ivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
//mÃ¤Ã¤ran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//mÃ¤Ã¤ran Ã¼he pÃ¤ris kataloogi avalikult kÃ¤ttesaadavaks
app.use(express.static("public"));
//parsime pÃ¤ringu URL-i, lipp false, kui ainult tekst ja ..... true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: true}));



app.get("/", (req, res)=>{
	//res.send("Express.js lÃ¤ks kÃ¤ima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.weekDay();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vÃ¤ljastame veebilehe, liuhtsalt vanasÃµnu pole Ã¼htegi
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]});
		}
		else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vÃ¤ljastame veebilehe, liuhtsalt vanasÃµnu pole ühtegi
			res.render("genericlist", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("genericlist", {heading: "registreeritud külastused", listData: correctListData});
		}
	});
});

//eesti filmi marsuudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/Eestifilm", eestifilmRouter);

//galerii fotode üleslaadimine
const photoupRouter = require("./routes/photoupRoutes");
app.use("/galleryphotoupload", photoupRouter);

app.listen(5110);