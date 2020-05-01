function send(event) {
	const email = document.getElementById("email"),
		clave = document.getElementById("clave");


	if (email.value != "" && clave.value != "") {
		fetch("/login", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				clave: clave
			})
		}).then(
			function(response) {
				if (response.status != 200) {
					console.log("Ocurrió un error con el servicio: " + response.status);
					error("Error", "Favor intentar luego", true, false);
				} else {
					return response.json();
				}
			}
		)
			.then(function(json) {
			}).catch(function(error) {
				console.log(error);
				error("Error", "Favor intentar luego", true, false);
			});


	} else {
		error("Error", "Favor llenar los campos", true, false);
		event.preventDefault();
		return false;
	}
}


let url = new URL(window.location.href);
let err = url.searchParams.get("err");
if (err) {
	if (err == "usuario") {
		error("Error", "Email o clave incorrecta.", true, false);
	}
}
