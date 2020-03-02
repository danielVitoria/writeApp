"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    idconcursos: Joi.string()
  });

  Joi.assert(payload, schema);
}

async function addGanadorToConcurso(req, res, next) {
  const concursoData = { ...req.body };
  const { idconcursos } = req.params;
  const { userId } = req.claims;

  try {
    await validate({ idconcursos });
  } catch (e) {
    return res.status(400).send(e);
  }
  
  const users_idusers = userId;
 
  console.log(idconcursos);
  const { ganador, segundo, tercero } = concursoData;

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const sqlQuery = `UPDATE concursos
      SET ganador = ?,
      segundo = ?,
      tercero = ?
      WHERE idconcursos = ?
        
        AND users_idusers = ?
        AND deleted_at IS NULL`;

    
    const [deletedStatus] = await connection.execute(sqlQuery, [
      ganador,
      segundo,
      tercero,
      idconcursos,
      users_idusers
    ]);
    connection.release();

    if (deletedStatus.changedRows === 0) {
      return res.status(404).send();
    }

    return res.status(204).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }

    return res.status(500).send(e.message);
  }
}

module.exports = addGanadorToConcurso;
