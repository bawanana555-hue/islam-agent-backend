const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

// ✨ AUCUNE DÉPENDANCE EXTERNE REQUISE - Utilise Node.js natif uniquement!

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Créer dossiers
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ========== BASE DE DONNÉES JSON ==========
class SimpleDB {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = this.load();
    }

    load() {
        try {
            if (fs.existsSync(this.filePath)) {
                return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
            }
        } catch (e) {
            console.log('⚠️ Erreur lecture BD:', e.message);
        }
        return {
            quran: [],
            hadiths: [],
            tafsirs: [],
            sessions: [],
            media: []
        };
    }

    save() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
        } catch (e) {
            console.error('❌ Erreur sauvegarde:', e.message);
        }
    }

    // Recherche
    search(query) {
        const q = query.toLowerCase();
        const results = {
            coran: [],
            hadiths: [],
            tafsirs: [],
            media: []
        };

        // Coran
        this.data.quran.forEach(v => {
            if (v.traduction.toLowerCase().includes(q) || (v.arabic && v.arabic.toLowerCase().includes(q))) {
                results.coran.push({
                    type: 'coran',
                    ref: `Sourate ${v.sourate}:${v.verset}`,
                    text: v.traduction,
                    arabic: v.arabic || ''
                });
            }
        });

        // Hadiths
        this.data.hadiths.forEach(h => {
            if (h.text.toLowerCase().includes(q) || (h.keywords && h.keywords.toLowerCase().includes(q))) {
                results.hadiths.push({
                    type: 'hadith',
                    id: h.id,
                    text: h.text.substring(0, 300) + '...',
                    source: h.source,
                    category: h.category
                });
            }
        });

        // Tafsirs
        this.data.tafsirs.forEach(t => {
            if (t.interpretation.toLowerCase().includes(q)) {
                results.tafsirs.push({
                    type: 'tafsir',
                    id: t.id,
                    sourate: t.sourate,
                    text: t.interpretation.substring(0, 300) + '...',
                    author: t.author
                });
            }
        });

        return results;
    }

    // Ajouter hadith
    addHadith(text, source, category) {
        const id = Date.now().toString();
        this.data.hadiths.push({ id, text, source, category, keywords: '', createdAt: new Date() });
        this.save();
        return id;
    }

    // Sauvegarder session
    saveSession(sessionId, context, theme) {
        const existing = this.data.sessions.findIndex(s => s.sessionId === sessionId);
        const session = { sessionId, context, theme, updatedAt: new Date() };
        if (existing >= 0) {
            this.data.sessions[existing] = session;
        } else {
            this.data.sessions.push(session);
        }
        this.save();
    }

    // Obtenir session
    getSession(sessionId) {
        return this.data.sessions.find(s => s.sessionId === sessionId);
    }

    // Récupérer verset
    getVerse(sourate, verset) {
        return this.data.quran.find(v => v.sourate === parseInt(sourate) && v.verset === parseInt(verset));
    }

    // Récupérer hadith
    getHadith(id) {
        return this.data.hadiths.find(h => h.id === id);
    }

    // Récupérer tafsirs
    getTafsirs(sourate) {
        return this.data.tafsirs.filter(t => t.sourate === parseInt(sourate));
    }

    // Stats
    getStats() {
        return {
            quran_verses: this.data.quran.length,
            hadiths: this.data.hadiths.length,
            tafsirs: this.data.tafsirs.length,
            user_sessions: this.data.sessions.length
        };
    }
}

// Initialiser DB
const db = new SimpleDB(DB_FILE);

// Charger données initiales
function loadInitialData() {
    if (db.data.quran.length > 0) {
        console.log('✅ Données déjà chargées');
        return;
    }

    // Charger Coran
    try {
        const quranPath = path.join(DATA_DIR, 'quran_fr.json');
        if (fs.existsSync(quranPath)) {
            const quranData = JSON.parse(fs.readFileSync(quranPath, 'utf-8'));
            let count = 0;

            for (const [sourate, versets] of Object.entries(quranData.versets || {})) {
                for (const v of versets) {
                    db.data.quran.push({
                        sourate: parseInt(sourate),
                        verset: v.id,
                        traduction: v.traduction,
                        transliteration: v.transliteration || '',
                        arabic: v.arabic || ''
                    });
                    count++;
                }
            }

            console.log(`✅ ${count} versets du Coran chargés`);
        }
    } catch (e) {
        console.log('⚠️ Erreur Coran:', e.message);
    }

    // Charger Islam Data
    try {
        const islamPath = path.join(__dirname, 'islam_data.js');
        if (fs.existsSync(islamPath)) {
            delete require.cache[require.resolve(islamPath)];
            const islamData = require(islamPath);

            if (Array.isArray(islamData.hadiths)) {
                islamData.hadiths.forEach((h, idx) => {
                    db.data.hadiths.push({
                        id: 'hadith_' + idx,
                        text: h.text || h.contenu || '',
                        source: h.source || 'Hadith',
                        category: h.category || 'Général',
                        keywords: h.keywords || ''
                    });
                });
                console.log(`✅ ${islamData.hadiths.length} hadiths chargés`);
            }

            if (typeof islamData.tafsirs === 'object') {
                Object.entries(islamData.tafsirs).forEach(([sourate, contenu], idx) => {
                    db.data.tafsirs.push({
                        id: 'tafsir_' + idx,
                        sourate: parseInt(sourate),
                        interpretation: typeof contenu === 'string' ? contenu : JSON.stringify(contenu),
                        author: contenu.author || 'Anonyme',
                        source: contenu.source || 'Islam Data'
                    });
                });
                console.log(`✅ ${Object.keys(islamData.tafsirs).length} tafsirs chargés`);
            }
        }
    } catch (e) {
        console.log('⚠️ Erreur Islam Data:', e.message);
    }

    db.save();
}

// ========== SERVEUR HTTP ==========
const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Routes
    if (pathname === '/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    }

    else if (pathname === '/db-info' && req.method === 'GET') {
        const stats = db.getStats();
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'connected',
            database: 'JSON-based',
            statistics: stats
        }));
    }

    else if (pathname === '/mcp' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { tool, params } = JSON.parse(body);

                if (tool === 'search_local') {
                    const results = db.search(params.query || '');
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true, results }));
                }

                else if (tool === 'get_quran_verse') {
                    const verse = db.getVerse(params.sourate, params.verset);
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: !!verse, data: verse }));
                }

                else if (tool === 'get_hadith') {
                    const hadith = db.getHadith(params.id);
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: !!hadith, data: hadith }));
                }

                else if (tool === 'get_tafsir') {
                    const tafsirs = db.getTafsirs(params.sourate);
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true, data: tafsirs }));
                }

                else if (tool === 'add_hadith') {
                    const id = db.addHadith(params.text, params.source, params.category);
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true, id }));
                }

                else if (tool === 'save_session') {
                    db.saveSession(params.session_id, params.user_context, params.theme);
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true }));
                }

                else if (tool === 'get_session') {
                    const session = db.getSession(params.session_id);
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: !!session, data: session }));
                }

                else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: 'Outil non reconnu' }));
                }
            } catch (e) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: e.message }));
            }
        });
    }

    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Route non trouvée' }));
    }
});

// Démarrer
loadInitialData();

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🕌 Serveur Islam-Agent lancé sur http://0.0.0.0:${PORT}`);
    console.log(`✅ Mode: JSON-based (AUCUNE dépendance complexe)`);
    console.log(`📊 Données stockées: ${DB_FILE}`);
    console.log(`🔍 Santé: http://localhost:${PORT}/health`);
    console.log(`📈 Stats: http://localhost:${PORT}/db-info`);
    console.log(`\n✨ Prêt pour votre agent IA!\n`);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Fermeture...');
    server.close();
    process.exit(0);
});
