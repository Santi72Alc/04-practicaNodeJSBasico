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
  console.log('Conectado a MongoDB en', mongoose.connection.name);
});


/**
 * Variables generales del servidor y BD
 */
const myServer = process.env.DB_HOST || 'localhost';
const myPort = process.env.DB_PORT || 27017;
const myBD = process.env.DB_NAME || 'shop';
const myUri = `mongodb://${myServer}:${myPort}/${myBD}`;

// conectar
mongoose.connect(myUri, { useNewUrlParser: true });

// exportar la conexión (opcional)
module.exports = conn;
