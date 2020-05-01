const express = require("express"),
	app = express(),
	path = require("path"),
	mongoose = require("mongoose"),
	passport = require("./passport")(app),
	bodyParser = require("body-parser"),
	server = require("http").createServer(app);



const folder = path.join(__dirname, "public");
app.use(bodyParser.json()).use(bodyParser.urlencoded({
	extended: true
}));


app.get("\\S+\/$", function (req, res) {
	return res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length));
});

app.use(require("cookie-parser")());


app.use(function (req, res, next) {
	res.locals.user = req.user || undefined;
	next();
});

app.use(function (req, res, next) {
	if(!req.path.includes("/primerLogin") && !req.path.includes("/user") && !req.path.includes("/logout") &&!req.path.includes("/fonts") && req.user && req.user.primerLogin){
		res.redirect("/primerLogin");
	}else{
		next();
	}
});

//const URI = "mongodb+srv://k1000:YYjTML88cKYJmIC8@ogmios-opn0p.mongodb.net/Biblioteca?retryWrites=true&w=majority";
const URI2 = "mongodb://k1000:YYjTML88cKYJmIC8@ogmios-shard-00-00-opn0p.mongodb.net:27017,ogmios-shard-00-01-opn0p.mongodb.net:27017,ogmios-shard-00-02-opn0p.mongodb.net:27017/Biblioteca?ssl=true&replicaSet=Ogmios-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(URI2, {
	useNewUrlParser: true,
	autoIndex: false
}).then(() => {
	return console.log("Conectado con exito a la bd :) ");
}).catch((err) => {
	return console.log("Hubo un error :(", err);
});

// Revisados

app.use("/registrar", require("./routes/registrar"));
app.use("/registrarAdmin", require("./routes/registrarAdmin"));
app.use("/registrarSucursalAdmin", require("./routes/registrarSucursalAdmin"));
app.use("/registrarSucursal", require("./routes/registrarSucursal"));
app.use("/registrarLibro", require("./routes/registrarLibro"));
app.use("/registrarAutor", require("./routes/registrarAutor"));
app.use("/registrarClubDeLectura", require("./routes/registrarClubDeLectura"));

app.use("/buscarCategoria", require("./routes/buscarCategoria"));
app.use("/buscarGenero", require("./routes/buscarGenero"));
app.use("/buscarClub", require("./routes/buscarClub"));

app.use("/buscarAdministrador", require("./routes/buscarAdministrador"));
app.use("/buscarUsuarios", require("./routes/buscarUsuario"));
app.use("/buscarUsuariosBloqueados", require("./routes/buscarBloqueado"));
app.use("/buscarAutor", require("./routes/buscarAutor"));
app.use("/buscarLibros", require("./routes/buscarLibros"));
app.use("/registrarPromocion", require("./routes/registrarPromocion"));
app.use("/registrarPromocionAdmin", require("./routes/registrarPromocionAdmin"));
app.use("/agregarInventario", require("./routes/agregarInventario"));
app.use("/agregarInventarioAdmin", require("./routes/agregarInventarioAdmin"));

app.use("/buscarLibreria", require("./routes/buscarLibreria"));
app.use("/buscarSucursal", require("./routes/buscarSucursal"));

app.use("/perfilUsuario", require("./routes/perfilUsuario"));

app.use("/perfilPersonalUsuario", require("./routes/perfilPersonalUsuario"));
app.use("/perfilLibreriaPersonal", require("./routes/perfilLibreriaPersonal"));
app.use("/perfilLibrerias", require("./routes/perfilLibrerias"));
app.use("/perfilLibreria", require("./routes/perfilLibreria"));
app.use("/perfilSucursal", require("./routes/perfilSucursal"));
app.use("/perfilAutor", require("./routes/perfilAutor"));
app.use("/perfilLibro", require("./routes/perfilLibro"));
app.use("/perfilClub", require("./routes/perfilClub"));

app.use("/mostrarMapa", require("./routes/listarMapa"));

app.use("/impuesto", require("./routes/impuesto"));


app.use("/landingProducto", require("./routes/landingProducto"));
app.use("/landingEquipo", require("./routes/landingEquipo"));

app.use("/registrarMetodoDePago", require("./routes/registrarMetodoDePago"));
app.use("/listarMetodoDePago", require("./routes/listarMetodoDePago"));

app.use("/buscarInventario", require("./routes/buscarInventario"));
app.use("/buscarInventarioS", require("./routes/buscarInventarioS"));
app.use("/buscarPromociones", require("./routes/buscarPromociones"));
app.use("/buscarBitacora", require("./routes/buscarBitacora"));


app.use("/", require("./routes/auth"));
app.use("/", require("./routes/api"));


app.use("/carrito", require("./routes/carrito"));
app.use("/buscarLibrosAdmin", require("./routes/buscarLibrosAdmin"));
app.use("/buscarAutoresAdmin", require("./routes/buscarAutoresAdmin"));
app.use("/buscarUsuariosAdmin", require("./routes/buscarUsuariosAdmin"));
app.use("/editarMetodoDePago", require("./routes/editarMetodoDePago"));
app.use("/editarAutor", require("./routes/editarAutor"));
app.use("/editarLibro", require("./routes/editarLibro"));
app.use("/eliminarUsuario", require("./routes/eliminarUsuario"));
app.use("/ganancias", require("./routes/ganancias"));
app.use("/buscarSucursalAdmin", require("./routes/buscarSucursalAdmin"));
app.use("/buscarSucursalLibreria", require("./routes/buscarSucursalLibreria"));
app.use("/promociones", require("./routes/promociones"));
app.use("/editarSucursal", require("./routes/editarSucursal"));
app.use("/nuevasLibrerias", require("./routes/nuevasLibrerias"));
app.use("/librosPersonales", require("./routes/librosPersonales"));
app.use("/librosUsuario", require("./routes/librosUsuario"));
app.use("/misCompras", require("./routes/misCompras"));
app.use("/primerLogin", require("./routes/primerLogin"));
app.use("/intercambios", require("./routes/intercambios"));
app.use("/chatI", require("./routes/chatI"));
app.use("/chatG", require("./routes/chatG"));

app.use(express.static(folder));


server.listen(process.env.PORT || 8080, function () {
	console.log(`App started in port ${process.env.PORT || 8080}`);
	console.log(passport);
});

process.on("SIGTERM", () => {
	console.info("SIGTERM signal received.");
	mongoose.connection.close();
});