const mongoose = require("mongoose"),
	carrito = require("./models/carrito"),
	sucursal = require("./models/sucursal"),
	inventario = require("./models/inventario"),
	libro = require("./models/libro"),
	promocion = require("./models/promocion"),
	usuario = require("./models/usuario");



var revisarLibros = function (libros) {
	var arregloADevolver = [];
	return new Promise(function (resolve, reject) {
		libros.forEach((libroActual, index, arr) => {
			inventario.findOne({
				id: Number(libroActual.sucursal),
				isbn: Number(libroActual.isbn)
			}, (err, encontrado) => {
				if (encontrado) {

					sucursal.findOne({
						id: Number(libroActual.sucursal)
					}, (err, encontradaSucursalDeCompra) => {

						let quiereEnvio = false;
						if (libroActual.envio) {
							quiereEnvio = true;
						}

						promocion.findOne({
							sucursal: Number(libroActual.sucursal),
							isbn: Number(libroActual.isbn)
						}, (err, promoEncontrada) => {
							if (err) reject([]);
							let precio = 0;
							if (promoEncontrada && new Date(promoEncontrada.fechaFin) > new Date()) {
								console.log(promoEncontrada.rebaja, promoEncontrada.tipoDescuento);
								if (promoEncontrada.tipoDescuento) {
									precio = Number(encontrado.precio - promoEncontrada.rebaja);
								} else {
									let descuento = Number((100 - Number(promoEncontrada.rebaja)) / 100);
									console.log(descuento);
									precio = Number(encontrado.precio * descuento);
								}
							} else {
								precio = encontrado.precio;
							}
							if (encontrado.cantidad >= libroActual.cantidad) {
								arregloADevolver.push({
									isbn: libroActual.isbn,
									nombre: encontrado.nombre,
									sucursal: libroActual.sucursal,
									precio: precio,
									cantidad: libroActual.cantidad,
									envio: Number(encontradaSucursalDeCompra.costoEnvio),
									quiereEnvio: quiereEnvio,
									formato: encontrado.formato
								});
	
								console.log(arregloADevolver.length, arr.length);
								if (arregloADevolver.length == arr.length) resolve(arregloADevolver);
							} else {
								reject({
									encontrado: false,
									alerta: {
										btnCancelar: false,
										btnAceptar: true,
										mensaje: "La sucursal " + encontradaSucursalDeCompra.nombre + " solo tiene " + encontrado.cantidad + " del libro " + encontrado.nombre,
										titulo: "Error"
									}
								});
							}
						});

						


					});


				} else {
					reject({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "No se encontro ese libro en la sucursal.",
							titulo: "Error"
						}
					});
				}
			});
		});
	});
};


var agregarVentas = function (libro) {




};


var compraFunc = function (compraActual, impuesto, req) {
	return new Promise(function (resolve, reject) {
		let finalizadas = [];
		compraActual.forEach((compraActual, index, arr) => {


			sucursal.findOne({
				id: Number(compraActual.sucursal)
			}, (err, encontradaSucursalDeCompra) => {
				if (encontradaSucursalDeCompra) {
					let pagado = compraActual.conEnvio ? Number(((compraActual.precio * compraActual.cantidad) * ((impuesto.impuestoVentas / 100) + 1)) + compraActual.envio) : Number((compraActual.precio * compraActual.cantidad) * ((impuesto.impuestoVentas / 100) + 1));
					encontradaSucursalDeCompra.ventas.push({
						isbn: Number(compraActual.isbn),
						usuarioId: Number(req.user.usuarioId),
						fecha: new Date(),
						cantidad: compraActual.cantidad,
						envio: Number(compraActual.envio),
						conEnvio: compraActual.quiereEnvio,
						pagado: Number(pagado)
					});

					encontradaSucursalDeCompra.save(function (err) {
						if (!err) {

							usuario.findOne({
								usuarioId: Number(req.user.usuarioId)
							}, "compras libros", (err, usuarioEncontrado) => {
								if (usuarioEncontrado) {
									var compraObj = {
										isbn: Number(compraActual.isbn),
										fecha: new Date(),
										cantidad: compraActual.cantidad,
										envio: Number(compraActual.envio),
										conEnvio: compraActual.quiereEnvio,
										pagado: Number((compraActual.precio * compraActual.cantidad) * ((impuesto.impuestoVentas / 100) + 1)),
										formato: compraActual.formato
									};
									usuarioEncontrado.compras.push(compraObj);

									usuarioEncontrado.libros.push({
										isbn: Number(compraActual.isbn),
										cantidad: compraActual.cantidad
									});
									inventario.findOne({
										id: compraActual.sucursal,
										isbn: compraActual.isbn
									}, (err, encontradoInventario) => {
										if (err) {
											console.log(err);
											reject({
												encontrado: false,
												alerta: {
													btnCancelar: false,
													btnAceptar: true,
													mensaje: "Error en la base de datos, favor intentar luego.",
													titulo: "Error"
												}
											});
										}
										if (encontradoInventario) {
											encontradoInventario.cantidad -= compraActual.cantidad;
											encontradoInventario.save(err => {
												if (err) {
													console.log(err);
													reject({
														encontrado: false,
														alerta: {
															btnCancelar: false,
															btnAceptar: true,
															mensaje: "Error en la base de datos, favor intentar luego.",
															titulo: "Error"
														}
													});
												}
												usuarioEncontrado.save(function (err) {
													console.log("ACA3");
													if (!err) {
														libro.findOne({
															ISBN: Number(compraActual.isbn)
														}, (err, libroParaActualizarVentas) => {
															if (err) {
																console.log(err);
																reject({
																	encontrado: false,
																	alerta: {
																		btnCancelar: false,
																		btnAceptar: true,
																		mensaje: "Error en la base de datos, favor intentar luego.",
																		titulo: "Error"
																	}
																});
															}
															if (libroParaActualizarVentas) {
																libroParaActualizarVentas.ventas += compraActual.cantidad;
																libroParaActualizarVentas.save((err) => {
																	if (err) {
																		console.log(err);
																		reject({
																			encontrado: false,
																			alerta: {
																				btnCancelar: false,
																				btnAceptar: true,
																				mensaje: "Error en la base de datos, favor intentar luego.",
																				titulo: "Error"
																			}
																		});
																	} else {
																		finalizadas.push(compraObj);
																		console.log(finalizadas.length , arr.length);
																		if (finalizadas.length == arr.length) {
																			carrito.findOne({
																				usuarioId: req.user.usuarioId
																			}, (err, carritoEncontrado) => {
																				console.log("EL CARRITO", carritoEncontrado);
																				if (err) {
																					console.log(err);
																					reject({
																						encontrado: false,
																						alerta: {
																							btnCancelar: false,
																							btnAceptar: true,
																							mensaje: "Error en la base de datos, favor intentar luego.",
																							titulo: "Error"
																						}
																					});
																				} else {
																					if (carritoEncontrado) {


																						carritoEncontrado.libros = [];
																						carritoEncontrado.save(err => {
																							if (err) {
																								console.log(err);
																								reject({
																									encontrado: false,
																									alerta: {
																										btnCancelar: false,
																										btnAceptar: true,
																										mensaje: "Error en la base de datos, favor intentar luego.",
																										titulo: "Error"
																									}
																								});
																							} else {
																								console.log("ACAAAA KKEGi");
																								resolve({
																									finalizadas: finalizadas,
																									mensaje: {
																										completado: true,
																										alerta: {
																											btnCancelar: false,
																											btnAceptar: true,
																											mensaje: "¡Gracias por su compra!",
																											titulo: `<i class="fas fa-check" style="color: #009688;"></i>`
																										}
																									}
																								});
																							}
																						});




																					} else {
																						reject({
																							encontrado: false,
																							alerta: {
																								btnCancelar: false,
																								btnAceptar: true,
																								mensaje: "No se ha encontrado tu carrito en la base de datos, favor intentar luego.",
																								titulo: "Error"
																							}
																						});
																					}
																				}
																			});
																		}
																	}
																});
															} else {
																reject({
																	encontrado: false,
																	alerta: {
																		btnCancelar: false,
																		btnAceptar: true,
																		mensaje: "Error en la base de datos, favor intentar luego.",
																		titulo: "Error"
																	}
																});
															}
														});
													} else {
														reject({
															encontrado: false,
															alerta: {
																btnCancelar: false,
																btnAceptar: true,
																mensaje: "No se pudo asignar el libro al usuario. Favor contactar a soporte.",
																titulo: "Error"
															}
														});
													}
												});
											});
										} else {
											reject({
												encontrado: false,
												alerta: {
													btnCancelar: false,
													btnAceptar: true,
													mensaje: "No se encontro el inventario.",
													titulo: "Error"
												}
											});
										}
									});

								} else {
									reject({
										encontrado: false,
										alerta: {
											btnCancelar: false,
											btnAceptar: true,
											mensaje: "No se pudo encontrar al usuario.",
											titulo: "Error"
										}
									});
								}
							});
						} else {
							console.log(err);
							reject({
								encontrado: false,
								alerta: {
									btnCancelar: false,
									btnAceptar: true,
									mensaje: "No se pudo guardar un dato",
									titulo: "Error"
								}
							});
						}
					});
				} else {
					reject({
						encontrado: false,
						alerta: {
							btnCancelar: false,
							btnAceptar: true,
							mensaje: "La sucursal no tiene el libro " + compraActual.nombre,
							titulo: "Error"
						}
					});
				}
			});


		});
	});
};


module.exports = {
	revisarLibros: revisarLibros,
	agregarVentas: agregarVentas,
	compraFunc: compraFunc
};