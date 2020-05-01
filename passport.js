const passport = require("passport"),
	mongoose = require("mongoose"),
	LocalStrategy = require("passport-local").Strategy,
	session = require("express-session"),
	usuario = require("./models/usuario"),
	MongoStore = require("connect-mongo")(session),
	sessionStore = new MongoStore({
		mongooseConnection: mongoose.connection
	});

module.exports = function (app) {

	passport.use(new LocalStrategy({
		usernameField: "email",
		passwordField: "clave",
		session: false
	},
	function (email, clave, done) {
		console.log(email, clave);
		usuario.findOne({
			email: email
		}).select("+clave").exec(function (err, user) {
			if (err) {
				console.log("error");
				return done(err);
			}
			if (!user || user.bloqueado) {
				console.log("no encontrado");
				return done(null, false);
			}
			if (user.clave != clave) {
				console.log("Clave diferente");
				return done(null, false);
			}
			if(user && user.rol == 1 && user.aceptado == false){
				console.log("Librería aún no aceptada");
				return done(null, false);
			}
			console.log("loggeadisimo");
			delete user.clave;
			return done(null, user);
		});
	}
	));


	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		done(null, user);
	});

	app.use(session({
		secret: "keyboard cat",
		name: "U_SESSION",
		resave: true,
		saveUninitialized: true,
		store: sessionStore
	}));


	app.use(passport.initialize());
	app.use(passport.session());

	return "Cargado satisfactoriamente passport.js local";
};
