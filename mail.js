const nodemailer = require("nodemailer"),
	sendinBlue = require("nodemailer-sendinblue-transport");

// async..await is not allowed in global scope, must use a wrapper
function main(emisor, sujeto, titulo, mensaje, mHtml) {
console.log("enviado");
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport(sendinBlue({
		apiKey: "Nx2ETVbwLzQ1qgUk"
	}));

	transporter.sendMail({
		from: "'Kamil de Libros.cr 👻' <ksaumaz@ucenfotec.ac.cr>", // sender address
		to: sujeto, // list of receivers
		subject: titulo, // Subject line
		text: mensaje, // plain text body
		html: mHtml // html body
	}).then((info) => {
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	});
}

module.exports = main;