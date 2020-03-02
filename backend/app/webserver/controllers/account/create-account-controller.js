'use strict';

const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');
const sendgridMail = require('@sendgrid/mail');
const uuidV4 = require('uuid/v4');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWelcomeEmail(email) {
  const [username, ] = email.split('@');
  const msg = {
    to: email,
    from: 'writingg@yopmail.com',
    subject: 'Bienvenido a Writingg :)',
    text: `Bienvenido ${username} a Writingg, la plataforma de concursos literarios donde escritores y organizadores conectan.`,
    html: `<strong>Bienvenido ${username} a Writingg, la plataforma de concursos literarios donde escritores y organizadores conectan.</strong>`,
  };

  const data = await sendgridMail.send(msg);
  console.log(data);

  return data;
}

async function validateSchema(payload) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    nombre: Joi.string().required(),
    dni: Joi.string().required(),
    rol: Joi.string().required(),
  });

  Joi.assert(payload, schema);
}

async function createAccount(req, res, next) {
  const accountData = { ...req.body };
  try {
    await validateSchema(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

 
  const now = new Date();
  const created_at = now.toISOString().replace('T', ' ').substring(0, 19);
  const userId = uuidV4();
  const securePassword = await bcrypt.hash(accountData.password, 10);

  let connection;
  try {
    connection = await mysqlPool.getConnection(); // 1
    await connection.query('INSERT INTO users SET ?', { // 2
      idusers: userId,
      nombre: accountData.nombre,
      email: accountData.email,
      password: securePassword,
      dni: accountData.dni,
      rol: accountData.rol,
      created_at
    });
    connection.release();

    res.status(201).send();

   
    try {
      await sendWelcomeEmail(accountData.email);
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).send();
    }

    return res.status(500).send();
  }
}

module.exports = createAccount;
