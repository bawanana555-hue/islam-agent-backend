'use strict';

// ============================================================
// FONCTIONS DE LECTURE — À utiliser dans ton agent
// Remplace les appels directs à SOURATES, VERSETS, etc.
// ============================================================

const { connecter }                      = require('./db');
const { Sourate, Verset, Hadith, Tafsir } = require('./models');

// Connexion automatique au premier appel
let pret = false;
async function init() {
  if (!pret) { await connecter(); pret = true; }
}

// -----------------------------------------------------------
// SOURATES
// -----------------------------------------------------------

/** Toutes les sourates */
async function getSourates() {
  await init();
  return Sourate.find({}).sort({ id: 1 }).lean();
}

/** Une sourate par son numéro (1–114) */
async function getSourate(numero) {
  await init();
  return Sourate.findOne({ id: numero }).lean();
}

// -----------------------------------------------------------
// VERSETS
// -----------------------------------------------------------

/** Tous les versets d'une sourate */
async function getVersets(sourate_id) {
  await init();
  return Verset.find({ sourate_id }).sort({ verset_id: 1 }).lean();
}

/** Un verset précis */
async function getVerset(sourate_id, verset_id) {
  await init();
  return Verset.findOne({ sourate_id, verset_id }).lean();
}

// -----------------------------------------------------------
// HADITHS
// -----------------------------------------------------------

/** Tous les hadiths */
async function getHadiths() {
  await init();
  return Hadith.find({}).sort({ id: 1 }).lean();
}

/** Un hadith par son id */
async function getHadith(id) {
  await init();
  return Hadith.findOne({ id }).lean();
}

// -----------------------------------------------------------
// TAFSIR
// -----------------------------------------------------------

/** Tafsir d'un verset précis */
async function getTafsir(sourate_id, verset_id) {
  await init();
  return Tafsir.findOne({ sourate_id, verset_id }).lean();
}

// -----------------------------------------------------------
// RECHERCHE TEXTUELLE (remplace ta fonction recherche())
// -----------------------------------------------------------

/** Recherche dans les versets, hadiths ou tafsirs par mot-clé */
async function rechercherMotCle(texte) {
  await init();
  const regex = new RegExp(texte, 'i');
  const filtre = { $or: [{ mots_cles: regex }, { traduction: regex }, { texte: regex }] };

  const [versets, hadiths, tafsirs] = await Promise.all([
    Verset.find({ $or: [{ mots_cles: regex }, { traduction: regex }] }).lean(),
    Hadith.find(filtre).lean(),
    Tafsir.find(filtre).lean()
  ]);

  return { versets, hadiths, tafsirs };
}

module.exports = {
  getSourates, getSourate,
  getVersets,  getVerset,
  getHadiths,  getHadith,
  getTafsir,
  rechercherMotCle
};
