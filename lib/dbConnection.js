'use strict';

// cargar libreria
const mongoose = require('mongoose');
const conn = mongoose.connection;

// gestionar eventos de conexión
conn.on('error', err => {
  console.log('Error de conexión', err);
  process.exit(1);
});

conn.once('open', () => {
  console.log(`Conectado a ${conn.name} en [${conn.host}:${conn.port}] con MongoDB`);
});


/**
 * Variables generales del servidor y BD
 */
const myUser = process.env.DB_USER || '';
const myPassword = process.env.DB_USER_PASSWORD || '';
const strUsuario = (myUser && myPassword) ? `${myUser}:${myPassword}@` : '';
const myServer = process.env.DB_HOST || 'localhost';
const myPort = process.env.DB_PORT || 27017;
const myBD = process.env.DB_NAME || 'shop';
const myUri = `mongodb://${strUsuario}${myServer}:${myPort}/${myBD}`;
console.log("* Cadena DB : ", myUri);

// conectar
mongoose.connect(myUri, {useNewUrlParser: true});

// exportar la conexión (opcional)
module.exports = conn;
