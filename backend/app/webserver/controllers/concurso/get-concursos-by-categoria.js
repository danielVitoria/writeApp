"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getConcursosByCategoria(req, res, next) {
  const { categoria } = req.params;
  
  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT * FROM concursos WHERE categoria = ? ORDER BY created_at ASC`;
    const [rows] = await connection.execute(sqlQuery, [categoria]);
    connection.release();
    
    
    const concursos = rows.map(concurso => {
      return {
        ...concurso
       
      };
    });

    return res.status(200).send(concursos);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getConcursosByCategoria;




