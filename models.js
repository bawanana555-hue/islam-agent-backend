'use strict';

// ============================================================
// MODÈLES MONGOOSE — 4 collections
// Sourates | Versets | Hadiths | Tafsir
// ============================================================

const { Schema, model } = require('mongoose');

// -----------------------------------------------------------
// 1. SOURATES
// -----------------------------------------------------------
const sourateSchema = new Schema({
  id:         { type: Number, required: true, unique: true },
  nom_ar:     { type: String, required: true },
  nom_fr:     { type: String, required: true },
  nb_versets: { type: Number, required: true },
  type:       { type: String, enum: ['mecquoise', 'médinoise'] },
  sens:       { type: String }
}, { collection: 'sourates', versionKey: false });

// -----------------------------------------------------------
// 2. VERSETS
// -----------------------------------------------------------
const versetSchema = new Schema({
  sourate_id: { type: Number, required: true },
  verset_id:  { type: Number, required: true },
  arabe:      { type: String, required: true },
  traduction: { type: String, required: true },
  mots_cles:  [String]
}, { collection: 'versets', versionKey: false });

// Index composé pour retrouver un verset par sourate + numéro
versetSchema.index({ sourate_id: 1, verset_id: 1 }, { unique: true });

// -----------------------------------------------------------
// 3. HADITHS
// -----------------------------------------------------------
const hadithSchema = new Schema({
  id:         { type: Number, required: true, unique: true },
  source:     { type: String },
  numero:     { type: String },
  texte:      { type: String, required: true },
  narrateur:  { type: String },
  mots_cles:  [String]
}, { collection: 'hadiths', versionKey: false });

// -----------------------------------------------------------
// 4. TAFSIR
// -----------------------------------------------------------
const tafsirSchema = new Schema({
  sourate_id: { type: Number, required: true },
  verset_id:  { type: Number, required: true },
  texte:      { type: String, required: true },
  mots_cles:  [String]
}, { collection: 'tafsir', versionKey: false });

tafsirSchema.index({ sourate_id: 1, verset_id: 1 }, { unique: true });

// -----------------------------------------------------------
// EXPORT DES MODÈLES
// -----------------------------------------------------------
const Sourate = model('Sourate', sourateSchema);
const Verset  = model('Verset',  versetSchema);
const Hadith  = model('Hadith',  hadithSchema);
const Tafsir  = model('Tafsir',  tafsirSchema);

module.exports = { Sourate, Verset, Hadith, Tafsir };
