'use strict';

// ============================================================
// DATASTORE LOCAL — Lecture des fichiers JSON locaux
// Remplace MongoDB Atlas — aucune connexion internet requise
// ============================================================

const fs   = require('fs');
const path = require('path');

const DOSSIER = path.join(__dirname, 'data');

// -----------------------------------------------------------
// CHARGEMENT EN MÉMOIRE (une seule fois au démarrage)
// -----------------------------------------------------------
function charger(fichier) {
  const chemin = path.join(DOSSIER, fichier);
  if (!fs.existsSync(chemin)) {
    console.error(`❌ Fichier introuvable : ${chemin}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(chemin, 'utf8'));
}

const SOURATES = charger('sourates.json');
const VERSETS  = charger('versets.json');
const HADITHS  = charger('hadiths.json');
const TAFSIR   = charger('tafsir.json');

console.log(`✅ Données chargées : ${SOURATES.length} sourates | ${VERSETS.length} versets | ${HADITHS.length} hadiths | ${TAFSIR.length} tafsirs`);

// -----------------------------------------------------------
// SOURATES
// -----------------------------------------------------------

/** Toutes les sourates */
function getSourates() {
  return SOURATES.slice().sort((a, b) => a.id - b.id);
}

/** Une sourate par son numéro (1–114) */
function getSourate(numero) {
  return SOURATES.find(s => s.id === Number(numero)) || null;
}

// -----------------------------------------------------------
// VERSETS
// -----------------------------------------------------------

/** Tous les versets d'une sourate */
function getVersets(sourate_id) {
  return VERSETS
    .filter(v => v.sourate_id === Number(sourate_id))
    .sort((a, b) => a.verset_id - b.verset_id);
}

/** Un verset précis */
function getVerset(sourate_id, verset_id) {
  return VERSETS.find(
    v => v.sourate_id === Number(sourate_id) && v.verset_id === Number(verset_id)
  ) || null;
}

// -----------------------------------------------------------
// HADITHS
// -----------------------------------------------------------

/** Tous les hadiths */
function getHadiths() {
  return HADITHS.slice().sort((a, b) => a.id - b.id);
}

/** Un hadith par son id */
function getHadith(id) {
  return HADITHS.find(h => h.id === Number(id)) || null;
}

// -----------------------------------------------------------
// TAFSIR
// -----------------------------------------------------------

/** Tafsir d'un verset précis */
function getTafsir(sourate_id, verset_id) {
  return TAFSIR.find(
    t => t.sourate_id === Number(sourate_id) && t.verset_id === Number(verset_id)
  ) || null;
}

// -----------------------------------------------------------
// RECHERCHE TEXTUELLE
// -----------------------------------------------------------

/** Recherche par mot-clé dans versets, hadiths et tafsirs */
function rechercherMotCle(texte) {
  if (!texte) return { versets: [], hadiths: [], tafsirs: [] };

  const mot = texte.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const correspondance = (valeur) => {
    if (!valeur) return false;
    const cible = String(valeur).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return cible.includes(mot);
  };

  const chercherDans = (tableau, champs) =>
    tableau.filter(item =>
      champs.some(champ => {
        const val = item[champ];
        if (Array.isArray(val)) return val.some(correspondance);
        return correspondance(val);
      })
    );

  return {
    versets: chercherDans(VERSETS, ['traduction', 'mots_cles', 'arabe']),
    hadiths: chercherDans(HADITHS, ['texte', 'mots_cles', 'narrateur']),
    tafsirs: chercherDans(TAFSIR,  ['texte', 'mots_cles'])
  };
}

// -----------------------------------------------------------
// EXPORT
// -----------------------------------------------------------
module.exports = {
  getSourates, getSourate,
  getVersets,  getVerset,
  getHadiths,  getHadith,
  getTafsir,
  rechercherMotCle
};
