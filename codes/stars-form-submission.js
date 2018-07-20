function starry(thi,j){
	thi.classList.add('checked');
	document.getElementById('rate-it').setAttribute('value',j);
	var elems = document.getElementsByClassName("star-b");
	for(var i = 0; i < elems.length; i++) {
		elems[i].disabled = true;
	}
	elems = document.getElementsByClassName("label-on");
	var k= elems.length;
	for(var i = 0; i < k; i++) {
		elems[0].classList.remove("label-on");
	}
}

function handleFormSubmit(event) {  
	event.preventDefault();         			// prevent page reload
	echoDataRecord("rating-form","ratings")
 }
 
function loaded() {
	var form = document.getElementById('rating-form');
	form.addEventListener("submit", handleFormSubmit, false);
};

document.addEventListener('DOMContentLoaded', loaded, false);