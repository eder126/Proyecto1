const app = require("express"),
	path = require("path"),
	middleware = require("../middleware"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", middleware.esAdmin, (req, res) => {
	res.sendFile(`${folder}/buscarSucursalAdmin/index.html`);
});

module.exports = router;