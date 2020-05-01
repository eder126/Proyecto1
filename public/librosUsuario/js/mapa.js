var sucursalesArr = [];

fetch(document.location.href+"/sucursales", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
	}
}).then(function (response) {
	if (response.status != 200) {
		console.log("Ocurrió un error con el servicio: " + response.status);
		error("Error", "Favor intentar luego", true, false);
	} else {
		return response.json();
	}
}).then(function (json) {
	json.sucursales.forEach((item, i) => {
		sucursalesArr.push(item);
		let nuevo = document.createElement("option");
		nuevo.value = item.id;
		nuevo.innerText = item.nombre;
		document.getElementById("sucursales").appendChild(nuevo);
	});
});


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
		draggable: false,
		animation: google.maps.Animation.DROP,
		position: {
			lat: crLat,
			lng: crLng
		}
	});
}

function mostrar(valor) {
	let val = sucursalesArr[valor],
		lat = Number(val.lat),
		lng = Number(val.long);
	document.getElementsByName("sucursalId")[0].value = Number(val.id);
	map.setCenter({
		lat: lat,
		lng: lng
	});
	map.zoom = 20;
	marker.setPosition({
		lat: lat,
		lng: lng
	});
}
