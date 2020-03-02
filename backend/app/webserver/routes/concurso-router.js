"use strict";

const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();

const checkAccountSession = require("../controllers/account/check-account-session");
const checkEscritorRol = require("../controllers/account/check-escritor-rol");
const checkOrganizadorRol = require("../controllers/account/check-organizador-rol");

const addGanadoresToConcurso = require("../controllers/concurso/add-ganadores-concurso");
const addParticipanteToConcurso = require("../controllers/concurso/add-participante-concurso");
const addRatingToConcurso = require("../controllers/concurso/add-rating-concurso");
const createConcurso = require("../controllers/concurso/create-concurso");
const deleteConcurso = require("../controllers/concurso/delete-concurso");
const deleteParticipanteToConcurso = require("../controllers/concurso/delete-participante-concurso");
const getConcursantesConcurso = require("../controllers/concurso/get-concursantes-concurso");
const getConcurso = require("../controllers/concurso/get-concurso");
const getConcursos = require("../controllers/concurso/get-concursos");
const getConcursosByCategoria = require("../controllers/concurso/get-concursos-by-categoria");
const getConcursosParticipante = require("../controllers/concurso/get-concursos-participante");
const getConcursosOrganizador = require("../controllers/concurso/get-concursos-organizador");
const getConcursosOrganizadorVencidos = require("../controllers/concurso/get-concursosVencidos-organizador");
const searchConcursos = require("../controllers/concurso/search-controller");
const uploadDoc = require("../controllers/concurso/upload-doc");

router.get(
  "/participante/concursos",
  checkAccountSession,
  checkEscritorRol,
  getConcursosParticipante
);
router.put(
  "/concursos/rating/:idconcursos",
  checkAccountSession,
  checkEscritorRol,
  addRatingToConcurso
);
router.put(
  "/concursos/ganador/:idconcursos",
  checkAccountSession,
  checkOrganizadorRol,
  addGanadoresToConcurso
);
router.post(
  "/concursos",
  checkAccountSession,
  checkOrganizadorRol,
  createConcurso
);

router.get("/concursos/search", searchConcursos);

router.get("/concursos", getConcursos);
router.get("/concursos/:categoria", getConcursosByCategoria);
router.get("/concursos/:idconcursos", getConcurso);
router.delete(
  "/concursos/:idconcursos",
  checkAccountSession,
  checkOrganizadorRol,
  deleteConcurso
);

router.get(
  "/organizador/concursos",
  checkAccountSession,
  checkOrganizadorRol,
  getConcursosOrganizador
);
router.get(
  "/organizadorVencidos/concursos",
  checkAccountSession,
  checkOrganizadorRol,
  getConcursosOrganizadorVencidos
);
router.post(
  "/concursos/:idconcursos",
  checkAccountSession,
  checkEscritorRol,
  addParticipanteToConcurso
);
router.put(
  "/concursos/:idconcursos",
  checkAccountSession,
  checkEscritorRol,
  deleteParticipanteToConcurso
);
router.get(
  "/concursos/:idconcursos/concursantes",
  checkAccountSession,
  checkOrganizadorRol,
  getConcursantesConcurso
);
router.post(
  "/concursos/:idconcursos/obra",
  checkAccountSession,
  checkEscritorRol,
  upload.single("document"),
  uploadDoc
);

module.exports = router;
