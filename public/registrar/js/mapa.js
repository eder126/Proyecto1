
var provincias = document.getElementById("provincias"),
	cantones = document.getElementById("cantones"),
	distritos = document.getElementById("distritos");
datos(
	"https://ubicaciones.paginasweb.cr/provincias.json",
	function (data) {
		provincias.innerHTML = popular(data);
	}
);


function datos(url, callback) {
	fetch(url, {
		method: "GET",
		headers: {
			"Accept": "application/json"
		}
	}).then(
		function (response) {
			if (response.status != 200) {
				console.log("Ocurrió un error con el servicio: " + response.status);
				error("Error", "Favor intentar luego", true, false);
			} else {
				return response.json();
			}
		}
	).then(data => {
		callback(data);
	}).catch(function (error) {
		console.log(error);
		error("Error", "Favor intentar luego", true, false);
	});
}


function getCantones() {
	let idProvincia = provincias.selectedIndex;
	map.setZoom(9);
	codeAddress("Costa Rica, " + provincias.options[provincias.selectedIndex].innerText);
	datos(
		"https://ubicaciones.paginasweb.cr/provincia/" + idProvincia + "/cantones.json",
		function (data) {
			cantones.innerHTML = popular(data);
			cantones.classList.remove("ocultar");
		}
	);
}

function getDistritos() {
	let idProvincia = provincias.selectedIndex,
	  	idCanton = cantones.selectedIndex;
	map.setZoom(12);
	codeAddress("Costa Rica, " + provincias.options[provincias.selectedIndex].innerText + ", " + cantones.options[
		cantones.selectedIndex].innerText);

	datos(
		"https://ubicaciones.paginasweb.cr/provincia/" + idProvincia + "/canton/" + idCanton + "/distritos.json",
		function (data) {
			distritos.innerHTML = popular(data);
			distritos.classList.remove("ocultar");
		}
	);
}

function distritoSeleccionado() {
	map.setZoom(15);
	codeAddress("Costa Rica, " + provincias.options[provincias.selectedIndex].innerText + ", " + cantones.options[
		cantones.selectedIndex].innerText + ", " + distritos.options[distritos.selectedIndex].innerText);
}

//var query = "Costa Rica, "+jQuery('#provincias option:selected').text()+","+jQuery('#cantones option:selected').text()+","+jQuery('#distritos option:selected').text();
//view-source:https://programando.paginasweb.cr/ejemplos/ubicaciones/


function popular(array) {
	var html = "<option default value=''>Seleccione una opción</option>";
	for (key in array) {
		html += "<option value='" + key + "'>" + array[key] + "</option>";
	}
	return html;
}

var map;
var geocoder;
var marker;
var crLat = 9.6301892;
var crLng = -84.2541843;

function initMap() {
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById("map"), {
		center: {
			lat: crLat,
			lng: crLng
		},
		zoom: 7,
		mapTypeId: google.maps.MapTypeId.HYBRID
	});
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		position: {
			lat: crLat,
			lng: crLng
		}
	});
	google.maps.event.addListener(marker, "dragend", function () {
		onMakerMove(marker);
	});
}

function codeAddress(address) {
	geocoder.geocode({
		"address": address
	}, function (results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			marker.setPosition(results[0].geometry.location);
			onMakerMove(marker);
		} else {
			console.debug("No pudimos obtener la dirección porque: " + status);
		}
	});
}

function onMakerMove(marker) {
	document.getElementById("coordenadas").value = marker.getPosition().toString().replace("(", "").replace(")", "");
}

function coordenadasCambio() {
	let coords = document.getElementById("coordenadas").value.split(", "),
		lat = Number(coords[0]),
		lng = Number(coords[1]);


	document.getElementsByClassName("direccion")[0].innerText = document.getElementById("coordenadas").value;
	console.log(lat, lng);

	marker.setPosition({
		lat: lat,
		lng: lng
	});
	map.setCenter({
		lat: lat,
		lng: lng
	});
}

function aceptarMapa() {
	document.getElementById("caja").classList.remove("overlay");
	document.getElementById("mapaModal").classList.add("ocultar");
}

function mostrarMapaModal(){
	document.getElementById("caja").classList.add("overlay");
	document.getElementById("mapaModal").classList.remove("ocultar");
	
	window.scrollTo(0, 0);
}