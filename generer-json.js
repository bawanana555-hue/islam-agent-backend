'use strict';

// ============================================================
// GÉNÉRATEUR DE FICHIERS JSON — À lancer UNE SEULE FOIS
// Commande : node generer-json.js
// Crée le dossier data/ avec les 4 fichiers JSON
// ============================================================

const fs   = require('fs');
const path = require('path');
const { SOURATES, VERSETS, HADITHS, TAFSIR } = require('./islam_data');

const DOSSIER = path.join(__dirname, 'data');

// Crée le dossier data/ s'il n'existe pas
if (!fs.existsSync(DOSSIER)) {
  fs.mkdirSync(DOSSIER);
  console.log('📁 Dossier data/ créé');
}

// Écrit chaque collection dans un fichier JSON
const fichiers = [
  { nom: 'sourates.json', donnees: SOURATES },
  { nom: 'versets.json',  donnees: VERSETS  },
  { nom: 'hadiths.json',  donnees: HADITHS  },
  { nom: 'tafsir.json',   donnees: TAFSIR   },
];

console.log('\n🚀 Génération des fichiers JSON...\n');

fichiers.forEach(({ nom, donnees }) => {
  const chemin = path.join(DOSSIER, nom);
  fs.writeFileSync(chemin, JSON.stringify(donnees, null, 2), 'utf8');
  console.log(`   ✅ ${nom} — ${donnees.length} entrées`);
});

console.log('\n🎉 Terminé ! Tes fichiers sont dans le dossier data/\n');
