// ============================================================
// SERVEUR MCP "ANDROID-TERMUX" — Islam Agent Épistémique
// ============================================================
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- CONFIGURATION DES CHEMINS ---
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');
const VAULT_DIR = path.join(DATA_DIR, 'media_vault'); // Dossier pour vos audios/vidéos/textes

// Création automatique des dossiers
[DATA_DIR, VAULT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- CHARGEMENT DES DONNÉES JSON (CORAN/HADITHS) ---
let quranData = null;
const quranPath = path.join(DATA_DIR, 'quran_fr.json');
if (fs.existsSync(quranPath)) {
    quranData = JSON.parse(fs.readFileSync(quranPath, 'utf-8'));
    console.log('✅ Coran chargé');
}

// --- MOTEUR DE RECHERCHE UNIFIÉ ---
function searchEverything(query) {
    const q = query.toLowerCase();
    let results = [];

    // 1. Recherche dans les fichiers locaux (Audio, Vidéo, PDF transcrits)
    if (fs.existsSync(VAULT_DIR)) {
        const files = fs.readdirSync(VAULT_DIR);
        files.forEach(file => {
            const content = fs.readFileSync(path.join(VAULT_DIR, file), 'utf-8');
            if (content.toLowerCase().includes(q)) {
                results.push({
                    type: 'media_local',
                    source: file,
                    content: content.substring(0, 500) + '...' // Extrait
                });
            }
        });
    }

    // 2. Recherche dans le Coran (si chargé)
    if (quranData && quranData.versets) {
        for (const [sId, versets] of Object.entries(quranData.versets)) {
            versets.forEach(v => {
                if (v.traduction.toLowerCase().includes(q)) {
                    results.push({
                        type: 'coran',
                        ref: `Sourate ${sId}, Verset ${v.id}`,
                        texte: v.traduction
                    });
                }
            });
        }
    }

    return results;
}

// --- ROUTES API ---

// Recherche Globale (Le mode que votre agent utilisera)
app.post('/mcp', (req, res) => {
    const { tool, params } = req.body;
    
    if (tool === 'search_local') {
        const results = searchEverything(params.query || '');
        return res.json({ count: results.length, results: results });
    }

    // Route pour ajouter du contenu (Ex: Texte d'une vidéo YouTube ou Audio)
    if (tool === 'add_knowledge') {
        const { title, content } = params;
        const fileName = `${Date.now()}_${title.replace(/[^a-z0-9]/gi, '_')}.txt`;
        fs.writeFileSync(path.join(VAULT_DIR, fileName), content);
        return res.json({ status: 'success', message: 'Connaissance ajoutée' });
    }

    res.status(404).json({ error: 'Outil non reconnu' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    =============================================
    🕌 SERVEUR ISLAM-AGENT ACTIF (MODE TERMUX)
    =============================================
    Port : ${PORT}
    Dossier de connaissances : ${VAULT_DIR}
    =============================================
    `);
});
