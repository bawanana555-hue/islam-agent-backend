// ============================================================
// server-mcp.js
// ISLAM AGENT ÉPISTÉMIQUE
// Serveur Node.js natif — compatible Termux / Android
// Aucune dépendance externe obligatoire
// ============================================================

'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const BASE_DIR = __dirname;
const DATA_FILE = path.join(BASE_DIR, 'islam_data.js');

// ============================================================
// CHARGEMENT DES DONNÉES LOCALES
// ============================================================

let islamData = null;

function chargerIslamData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.warn('⚠️ islam_data.js introuvable.');
            return null;
        }

        // Tentative 1 : module CommonJS
        try {
            delete require.cache[require.resolve(DATA_FILE)];

            const moduleData = require(DATA_FILE);

            if (moduleData && typeof moduleData === 'object') {
                islamData = moduleData;
                console.log('✅ islam_data.js chargé comme module Node.js.');
                return islamData;
            }
        } catch (err) {
            console.warn(
                '⚠️ islam_data.js n’est pas un module CommonJS classique.'
            );
        }

        console.warn(
            '⚠️ Les données existent mais leur format d’export doit être vérifié.'
        );

        return null;

    } catch (error) {
        console.error('❌ Erreur chargement islam_data.js :', error.message);
        return null;
    }
}

chargerIslamData();

// ============================================================
// OUTILS
// ============================================================

function envoyerJSON(res, statusCode, data) {
    const body = JSON.stringify(data, null, 2);

    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache'
    });

    res.end(body);
}

function envoyerTexte(res, statusCode, texte) {
    res.writeHead(statusCode, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    });

    res.end(texte);
}

function lireBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();

            // Protection simple contre les requêtes excessivement grandes
            if (body.length > 1024 * 1024) {
                req.destroy();
                reject(new Error('Requête trop volumineuse.'));
            }
        });

        req.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('JSON invalide.'));
            }
        });

        req.on('error', reject);
    });
}

function normaliserTexte(texte) {
    return String(texte || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// ============================================================
// RECHERCHE GÉNÉRIQUE
// ============================================================

function rechercherDansDonnees(question, type, maxResults = 5) {

    const recherche = normaliserTexte(question);

    if (!recherche) {
        return [];
    }

    if (!islamData) {
        return [];
    }

    const resultats = [];

    function parcourir(obj, chemin = '') {

        if (resultats.length >= maxResults) {
            return;
        }

        if (obj === null || obj === undefined) {
            return;
        }

        if (typeof obj === 'string') {

            const texte = normaliserTexte(obj);

            if (texte.includes(recherche)) {
                resultats.push({
                    type: type || 'document',
                    texte: obj,
                    chemin: chemin
                });
            }

            return;
        }

        if (Array.isArray(obj)) {

            for (let i = 0; i < obj.length; i++) {

                if (resultats.length >= maxResults) {
                    break;
                }

                parcourir(obj[i], chemin + '[' + i + ']');
            }

            return;
        }

        if (typeof obj === 'object') {

            const texteObjet = normaliserTexte(
                Object.values(obj)
                    .filter(v => typeof v === 'string')
                    .join(' ')
            );

            if (texteObjet.includes(recherche)) {

                resultats.push({
                    type: type || 'document',
                    ...obj
                });

                return;
            }

            for (const cle of Object.keys(obj)) {

                if (resultats.length >= maxResults) {
                    break;
                }

                parcourir(
                    obj[cle],
                    chemin ? chemin + '.' + cle : cle
                );
            }
        }
    }

    parcourir(islamData);

    return resultats.slice(0, maxResults);
}

// ============================================================
// ROUTES MCP
// ============================================================

async function traiterMCP(body) {

    const tool = body.tool;
    const params = body.params || {};

    const question = params.query || params.question || '';

    const maxResults = Number(params.max_results) || 5;

    switch (tool) {

        case 'search_quran': {

            const results = rechercherDansDonnees(
                question,
                'verset',
                maxResults
            );

            return {
                succes: true,
                tool: tool,
                count: results.length,
                results: results
            };
        }

        case 'search_hadiths': {

            const results = rechercherDansDonnees(
                question,
                'hadith',
                maxResults
            );

            return {
                succes: true,
                tool: tool,
                count: results.length,
                results: results
            };
        }

        case 'search_tafsir': {

            const results = rechercherDansDonnees(
                question,
                'tafsir',
                maxResults
            );

            return {
                succes: true,
                tool: tool,
                count: results.length,
                results: results
            };
        }

        default:

            return {
                succes: false,
                error: 'Outil MCP inconnu.',
                tool: tool,
                outilsDisponibles: [
                    'search_quran',
                    'search_hadiths',
                    'search_tafsir'
                ]
            };
    }
}

// ============================================================
// SERVEUR HTTP
// ============================================================

const server = http.createServer(async (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // --------------------------------------------------------
    // CORS / OPTIONS
    // --------------------------------------------------------

    if (req.method === 'OPTIONS') {

        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });

        res.end();
        return;
    }

    // --------------------------------------------------------
    // GET /health
    // --------------------------------------------------------

    if (pathname === '/health' && req.method === 'GET') {

        envoyerJSON(res, 200, {
            succes: true,
            status: 'ok',
            serveur: 'Islam Agent Épistémique',
            version: '1.0.0',
            node: process.version,
            islamData: !!islamData,
            port: PORT
        });

        return;
    }

    // --------------------------------------------------------
    // GET /api/health
    // --------------------------------------------------------

    if (pathname === '/api/health' && req.method === 'GET') {

        envoyerJSON(res, 200, {
            succes: true,
            status: 'ok',
            serveur: 'Islam Agent Épistémique',
            islamData: !!islamData
        });

        return;
    }

    // --------------------------------------------------------
    // POST /mcp
    // --------------------------------------------------------

    if (pathname === '/mcp' && req.method === 'POST') {

        try {

            const body = await lireBody(req);

            const resultat = await traiterMCP(body);

            envoyerJSON(
                res,
                resultat.succes === false ? 400 : 200,
                resultat
            );

        } catch (error) {

            console.error('❌ Erreur MCP :', error.message);

            envoyerJSON(res, 400, {
                succes: false,
                error: error.message
            });
        }

        return;
    }

    // --------------------------------------------------------
    // GET /api/search
    // --------------------------------------------------------

    if (pathname === '/api/search' && req.method === 'GET') {

        const recherche = query.q || '';

        if (!recherche) {

            envoyerJSON(res, 400, {
                succes: false,
                error: 'Paramètre q requis.'
            });

            return;
        }

        const results = rechercherDansDonnees(
            recherche,
            'document',
            10
        );

        envoyerJSON(res, 200, {
            succes: true,
            query: recherche,
            count: results.length,
            results: results
        });

        return;
    }

    // --------------------------------------------------------
    // GET /api/sourates
    // --------------------------------------------------------

    if (pathname === '/api/sourates' && req.method === 'GET') {

        const sourates =
            islamData?.SOURATES ||
            islamData?.sourates ||
            islamData?.SURATES ||
            [];

        envoyerJSON(res, 200, {
            succes: true,
            count: Array.isArray(sourates) ? sourates.length : 0,
            sourates: sourates
        });

        return;
    }

    // --------------------------------------------------------
    // GET /api/sourate?id=1
    // --------------------------------------------------------

    if (pathname === '/api/sourate' && req.method === 'GET') {

        const id = String(query.id || '');

        const sourates =
            islamData?.SOURATES ||
            islamData?.sourates ||
            islamData?.SURATES ||
            [];

        let sourate = null;

        if (Array.isArray(sourates)) {

            sourate = sourates.find(
                s => String(s.id || s.sourate_id || s.numero) === id
            );

        } else if (sourates && typeof sourates === 'object') {

            sourate = sourates[id] || null;
        }

        envoyerJSON(res, 200, {
            succes: true,
            sourate: sourate
        });

        return;
    }

    // --------------------------------------------------------
    // GET /api/versets
    // --------------------------------------------------------

    if (pathname === '/api/versets' && req.method === 'GET') {

        const versets =
            islamData?.VERSETS ||
            islamData?.versets ||
            [];

        envoyerJSON(res, 200, {
            succes: true,
            versets: versets
        });

        return;
    }

    // --------------------------------------------------------
    // GET /api/hadiths
    // --------------------------------------------------------

    if (pathname === '/api/hadiths' && req.method === 'GET') {

        const hadiths =
            islamData?.HADITHS ||
            islamData?.hadiths ||
            [];

        envoyerJSON(res, 200, {
            succes: true,
            hadiths: hadiths
        });

        return;
    }

    // --------------------------------------------------------
    // GET /api/tafsir
    // --------------------------------------------------------

    if (pathname === '/api/tafsir' && req.method === 'GET') {

        const tafsir =
            islamData?.TAFSIR ||
            islamData?.tafsir ||
            [];

        envoyerJSON(res, 200, {
            succes: true,
            tafsir: tafsir
        });

        return;
    }

    // --------------------------------------------------------
    // PAGE RACINE
    // --------------------------------------------------------

    if (pathname === '/' && req.method === 'GET') {

        envoyerJSON(res, 200, {
            succes: true,
            agent: 'Islam Agent Épistémique',
            version: '1.0.0',
            message: 'Serveur Node.js opérationnel.',
            endpoints: [
                'GET /health',
                'GET /api/health',
                'POST /mcp',
                'GET /api/search?q=...',
                'GET /api/sourates',
                'GET /api/sourate?id=1',
                'GET /api/versets',
                'GET /api/hadiths',
                'GET /api/tafsir'
            ]
        });

        return;
    }

    // --------------------------------------------------------
    // ROUTE INCONNUE
    // --------------------------------------------------------

    envoyerJSON(res, 404, {
        succes: false,
        error: 'Route introuvable.',
        route: pathname
    });
});

// ============================================================
// ERREURS SERVEUR
// ============================================================

server.on('error', error => {

    if (error.code === 'EADDRINUSE') {

        console.error('');
        console.error('❌ ERREUR : le port ' + PORT + ' est déjà utilisé.');
        console.error('👉 Arrêtez l’ancien serveur puis relancez.');
        console.error('');

    } else {

        console.error('❌ Erreur serveur :', error);
    }
});

// ============================================================
// DÉMARRAGE
// ============================================================

server.listen(PORT, HOST, () => {

    console.log('');
    console.log('============================================================');
    console.log('🤖 ISLAM AGENT ÉPISTÉMIQUE');
    console.log('============================================================');
    console.log('✅ Serveur Node.js démarré');
    console.log('🚀 Port       : ' + PORT);
    console.log('🌐 Adresse    : http://127.0.0.1:' + PORT);
    console.log('📡 MCP        : http://127.0.0.1:' + PORT + '/mcp');
    console.log('❤️  Health     : http://127.0.0.1:' + PORT + '/health');
    console.log('📚 Données    : ' + (islamData ? 'CHARGÉES' : 'NON CHARGÉES'));
    console.log('============================================================');
    console.log('');
});
