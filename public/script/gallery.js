window.onload = function(){
	//käin lehe läbi ja teen listi ja teen listi kõigist thumbs klassiga pisipiltidest
	let allThumbs = document.querySelector("#gallery").querySelectorAll(".thumbs");
	//määran kõigile funktsioooni, mis käivitatakse hiireklikiga
	for (let i = 0; i < allThumbs.length; i ++){
		allThumbs[i].addEventListener("click", openModal);	
	}
	document.querySelector("#modalClose").addEventListener("click", closeModal);
}

function openModal(e){
	document.querySelector("#modalImage").src = "/gallery/normal/" + e.target.dataset.filename;
	document.querySelector("#modalCaption").innerHTML = e.target.alt;
	document.querySelector("#modal").showModal();
	
}
function closeModal(){
	document.querySelector("#modal").close();
	document.querySelector("#modalImage").src = "/gallery/empty.png";
	document.querySelector("#modalCaption").innerHTML = "galeriipilt";
}