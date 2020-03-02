"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getConcursos(req, res, next) {



try {
const connection = await mysqlPool.getConnection();
const sqlQuery = `SELECT * FROM concursos`;

const [rows] = await connection.execute(sqlQuery);
connection.release();


const concursos = rows.map(concurso => {
  return {
    ...concurso,
    created_At: undefined,
    updated_At: undefined,
    deleted_At: undefined
    
  };
});

return res.status(200).send(concursos);
} catch (e) {
console.error(e);
return res.status(500).send();
}
}

module.exports = getConcursos;
