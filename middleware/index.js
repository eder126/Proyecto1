var middlewareObj = {};

middlewareObj.noLoggeado = function (req, res, next) {
	if (req.user) {
		return res.redirect("/");
	}
	return next();
};

middlewareObj.loggeado = function (req, res, next) {
	if (req.user) {
		return next();
	}
	res.redirect("/login");
};

middlewareObj.esAdmin = function (req, res, next) {
	if (req.user && req.user.rol == 2) {
		return next();
	}
	res.redirect("/");
};

middlewareObj.esLibreria = function (req, res, next) {
	if (req.user && req.user.rol == 1) {
		return next();
	}
	res.redirect("/");
};

middlewareObj.esUsuarioRegular = function (req, res, next) {
	if (req.user && req.user.rol == 0) {
		return next();
	}
	res.redirect("/");
};

middlewareObj.esAdminOUsuarioLibreria = function (req, res, next) {
	if (req.user && (req.user.rol == 1 || req.user.rol == 2)) {
		return next();
	}
	res.redirect("/");
};



module.exports = middlewareObj;