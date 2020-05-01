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
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.HYBRID
	});
	fetch("/mostrarMapa/sucursales", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
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
	)
		.then(function (json) {
			json.sucursales.forEach((item) => {
				new google.maps.Marker({
					map: map,
					title: item.nombre,
					draggable: false,
					animation: google.maps.Animation.DROP,
					position: {
						lat: Number(item.lat),
						lng: Number(item.long)
					}
				});
			});
	
	
		});
}