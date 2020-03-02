"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");


async function validate(payload) {
  const schema = Joi.object({
    userId: Joi.string()
  });

  Joi.assert(payload, schema);
}


async function getConcursosOrganizador(req, res, next) {


  const { userId } = req.claims;
  try {
    const payload = {
      userId
    };
    await validate(payload);
  } catch (e) {
    return res.status(400).send(e);
  }
  const users_idusers = userId;
  const todayDate = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT *
      FROM concursos
      WHERE
      users_idusers = ?
      AND fechaVencimiento > ?
      AND deleted_at IS NULL
      ORDER BY fechaVencimiento DESC`;

    const [rows] = await connection.execute(sqlQuery, [
      users_idusers,
      todayDate
    ]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).send();
    }

    const concursos = rows.map(concurso => {
      return {
        ...concurso
      };
    });

    return res.send(concursos);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getConcursosOrganizador;
