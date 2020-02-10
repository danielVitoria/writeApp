"use strict";

const express = require("express");

const checkAccountSession = require("../controllers/account/check-account-session");
const createConcurso = require("../controllers/concurso/create-concurso");
const deleteConcurso = require("../controllers/concurso/delete-concurso");
const getConcursos = require("../controllers/concurso/get-concursos");
const getConcurso = require("../controllers/concurso/get-concurso");

const router = express.Router();

router.post("/concursos", checkAccountSession, createConcurso);
router.get("/concursos", getConcursos);
router.get("/concursos/:idconcursos", getConcurso);
router.delete("/concursos/:idconcursos", checkAccountSession, deleteConcurso);

module.exports = router;