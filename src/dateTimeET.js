const dateNowFormattedET = function(){
	let timeNow = new Date();
	const monthNamesET = ["jaanuar", "veebruar", "mÃ¤rts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const timeNowFormattedET = function(){
	let timeNow = new Date();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

const weekDayNowET = function(){
	let timeNow = new Date();
	const weekdayNamesEt = ["pÃ¼hapÃ¤ev", "esmaspÃ¤ev", "teisipÃ¤ev", "kolmapÃ¤ev", "neljapÃ¤ev", "reede", "laupÃ¤ev"];
	return weekdayNamesEt[timeNow.getDay()];
}

const partOfDay = function(){
	let dayPart = "suvaline aeg";
	let hourNow = new Date().getHours();
	if(hourNow <= 6){
		dayPart = "varahommik";
	} else if (hourNow < 12){
		dayPart = "hommik";
	} else if (hourNow == 12){
		dayPart = "keskpÃ¤ev";
	}
	return dayPart;
}

//ekspordin kÃµik vajaliku
module.exports = {fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, weekDay: weekDayNowET, partOfDay: partOfDay};