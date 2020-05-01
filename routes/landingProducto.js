const app = require("express"),
	path = require("path"),
	router = app.Router();

const folder = path.join(__dirname, "../public");

router.get("/", (req, res) => {
	res.sendFile(`${folder}/landingProducto/index.html`);
});

module.exports = router;