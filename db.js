'use strict';

// ============================================================
// CONNEXION MONGODB ATLAS
// ============================================================
// Remplace <username>, <password> et <cluster> par tes valeurs
// récupérées sur le tableau de bord Atlas > Connect > Drivers
// ============================================================

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI
  || 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/islamique?retryWrites=true&w=majority';

let connecte = false;

async function connecter() {
  if (connecte) return;
  try {
    await mongoose.connect(MONGO_URI);
    connecte = true;
    console.log('✅ Connecté à MongoDB Atlas');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  }
}

async function deconnecter() {
  if (!connecte) return;
  await mongoose.disconnect();
  connecte = false;
  console.log('🔌 Déconnecté de MongoDB Atlas');
}

module.exports = { connecter, deconnecter };
