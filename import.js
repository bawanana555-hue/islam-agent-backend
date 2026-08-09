'use strict';

// ============================================================
// SCRIPT D'IMPORT — À LANCER UNE SEULE FOIS
// Commande : node import.js
// ============================================================
// Ce script :
//   1. Se connecte à MongoDB Atlas
//   2. Vide les collections existantes (évite les doublons)
//   3. Importe toutes tes données JS dans Atlas
//   4. Affiche un résumé et se déconnecte
// ============================================================

const { connecter, deconnecter }         = require('./db');
const { Sourate, Verset, Hadith, Tafsir } = require('./models');
const { SOURATES, VERSETS, HADITHS, TAFSIR } = require('./islam_data.js'); // <- ton fichier existant

async function importer() {
  console.log('\n🚀 Démarrage de l\'import...\n');
  await connecter();

  // --- Nettoyage des collections ---
  console.log('🗑️  Nettoyage des collections existantes...');
  await Promise.all([
    Sourate.deleteMany({}),
    Verset.deleteMany({}),
    Hadith.deleteMany({}),
    Tafsir.deleteMany({})
  ]);

  // --- Import des Sourates ---
  console.log(`📖 Import de ${SOURATES.length} sourates...`);
  const sourates = await Sourate.insertMany(SOURATES);
  console.log(`   ✅ ${sourates.length} sourates importées`);

  // --- Import des Versets ---
  console.log(`📝 Import de ${VERSETS.length} versets...`);
  const versets = await Verset.insertMany(VERSETS);
  console.log(`   ✅ ${versets.length} versets importés`);

  // --- Import des Hadiths ---
  console.log(`📜 Import de ${HADITHS.length} hadiths...`);
  const hadiths = await Hadith.insertMany(HADITHS);
  console.log(`   ✅ ${hadiths.length} hadiths importés`);

  // --- Import des Tafsir ---
  console.log(`🔍 Import de ${TAFSIR.length} tafsirs...`);
  const tafsirs = await Tafsir.insertMany(TAFSIR);
  console.log(`   ✅ ${tafsirs.length} tafsirs importés`);

  // --- Résumé ---
  console.log('\n🎉 Import terminé avec succès !');
  console.log('┌─────────────────────────────┐');
  console.log(`│  Sourates : ${String(sourates.length).padEnd(16)} │`);
  console.log(`│  Versets  : ${String(versets.length).padEnd(16)} │`);
  console.log(`│  Hadiths  : ${String(hadiths.length).padEnd(16)} │`);
  console.log(`│  Tafsirs  : ${String(tafsirs.length).padEnd(16)} │`);
  console.log('└─────────────────────────────┘\n');

  await deconnecter();
}

importer().catch(err => {
  console.error('❌ Erreur lors de l\'import :', err.message);
  process.exit(1);
});
