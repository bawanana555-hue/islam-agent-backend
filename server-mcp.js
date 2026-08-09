const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- CONFIGURATION DES RÉPERTOIRES ---
const DATA_DIR = path.join(__dirname, 'data');
const VAULT_DIR = path.join(DATA_DIR, 'media_vault');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(VAULT_DIR)) fs.mkdirSync(VAULT_DIR, { recursive: true });

// --- CHARGEMENT DES BASES ---

let quranData = null;
try {
    const quranPath = path.join(DATA_DIR, 'quran_fr.json');
    if (fs.existsSync(quranPath)) {
        quranData = JSON.parse(fs.readFileSync(quranPath, 'utf-8'));
        console.log('✅ Coran chargé');
    }
} catch (e) { console.log('⚠️ Erreur Coran :', e.message); }

let islamData = null;
try {
    const islamPath = path.join(DATA_DIR, 'islam_data.js');
    if (fs.existsSync(islamPath)) {
        delete require.cache[require.resolve(islamPath)];
        islamData = require(islamPath);
        console.log('✅ Islam Data chargé (hadiths + tafsirs)');
    } else {
        console.log('⚠️ islam_data.js introuvable');
    }
} catch (e) { console.log('⚠️ Erreur islam_data.js :', e.message); }

// --- MOTEUR DE RECHERCHE ---
function searchLocal(query) {
    const q = query.toLowerCase();
    const results = [];

    // 1. Médias
    try {
        const files = fs.readdirSync(VAULT_DIR);
        files.forEach(file => {
            const content = fs.readFileSync(path.join(VAULT_DIR, file), 'utf-8');
            if (content.toLowerCase().includes(q)) {
                results.push({ type: 'media', source: file, text: content.substring(0, 300) + '...' });
            }
        });
    } catch (e) {}

    // 2. Coran
    if (quranData && quranData.versets) {
        Object.entries(quranData.versets).forEach(([sId, versets]) => {
            versets.forEach(v => {
                if (v.traduction.toLowerCase().includes(q)) {
                    results.push({ type: 'coran', ref: `Sourate ${sId}:${v.id}`, text: v.traduction });
                }
            });
        });
    }

    // 3. Islam Data (nouvelle version adaptée)
    if (islamData) {
        // Hadiths
        if (Array.isArray(islamData.hadiths)) {
            islamData.hadiths.forEach((item, idx) => {
                const str = JSON.stringify(item).toLowerCase();
                if (str.includes(q)) {
                    results.push({
                        type: 'hadith',
                        index: idx,
                        text: item.text || item.contenu || JSON.stringify(item).substring(0, 300),
                        source: item.source || 'Hadith'
                    });
                }
            });
        }

        // Tafsirs
        if (typeof islamData.tafsirs === 'object' && islamData.tafsirs !== null) {
            Object.entries(islamData.tafsirs).forEach(([sourate, contenu]) => {
                const str = JSON.stringify(contenu).toLowerCase();
                if (str.includes(q)) {
                    results.push({
                        type: 'tafsir',
                        sourate: sourate,
                        text: typeof contenu === 'string' ? contenu : JSON.stringify(contenu).substring(0, 300)
                    });
                }
            });
        }
    }

    return results;
}

// --- ROUTES ---
app.post('/mcp', (req, res) => {
    const { tool, params } = req.body;
    if (tool === 'search_local') {
        return res.json({ results: searchLocal(params.query || '') });
    }
    res.status(404).json({ error: 'Outil non reconnu' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🕌 Serveur Islam-Agent lancé sur le port ${PORT}`);
});
