'use strict';

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { SOURATES, VERSETS, HADITHS, TAFSIR, recherche } = require('./data/islam_data');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Sert le fichier HTML principal depuis le dossier courant
// (copier islam_agent_corrige.html ici sous le nom index.html)
app.use(express.static(path.join(__dirname, 'public')));

// ── Santé du serveur ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status : 'ok',
    server : 'Islam MCP Server v1.0',
    data   : {
      sourates : SOURATES.length,
      versets  : VERSETS.length,
      hadiths  : HADITHS.length,
      tafsir   : TAFSIR.length
    },
    uptime : Math.floor(process.uptime()) + 's'
  });
});

// ── Route MCP principale ──────────────────────────────────
// Le client envoie : { tool: "nom_outil", params: { ... } }
app.post('/mcp', (req, res) => {
  const { tool, params = {} } = req.body;

  if (!tool) {
    return res.status(400).json({ error: 'Champ "tool" manquant.' });
  }

  try {
    const resultat = dispatchTool(tool, params);
    return res.json(resultat);
  } catch (err) {
    console.error(`[MCP] Erreur outil "${tool}":`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── Dispatch des outils ───────────────────────────────────
function dispatchTool(tool, params) {
  switch (tool) {

    // -------- Coran --------
    case 'search_quran': {
      const { query = '', max_results = 5 } = params;
      const versets = recherche(query, VERSETS, ['traduction', 'arabe', 'mots_cles']);
      const slice   = versets.slice(0, max_results).map(v => ({
        type        : 'verset',
        sourate_id  : v.sourate_id,
        verset_id   : v.verset_id,
        arabe       : v.arabe,
        traduction  : v.traduction,
        sourate_nom : getSourate(v.sourate_id)?.nom_fr || ''
      }));
      return { count: slice.length, results: slice };
    }

    case 'get_verset': {
      const { sourate, verset } = params;
      const v = VERSETS.find(x => x.sourate_id === Number(sourate) && x.verset_id === Number(verset));
      if (!v) return { count: 0, results: [] };
      return {
        count: 1,
        results: [{
          type       : 'verset',
          sourate_id : v.sourate_id,
          verset_id  : v.verset_id,
          arabe      : v.arabe,
          traduction : v.traduction
        }]
      };
    }

    case 'get_sourate': {
      const { id } = params;
      const s = getSourate(id);
      if (!s) return { count: 0, results: [] };
      const contenu = VERSETS.filter(v => v.sourate_id === Number(id)).map(v => ({
        id          : v.verset_id,
        texte_arabe : v.arabe,
        traduction  : v.traduction
      }));
      return {
        count: 1,
        results: [{
          type               : 'sourate',
          sourate_id         : s.id,
          sourate_name       : s.nom_fr,
          sourate_arabe      : s.nom_ar,
          sourate_traduction : s.sens,
          versets            : s.nb_versets,
          type_revelation    : s.type,
          contenu
        }]
      };
    }

    case 'list_sourates': {
      return {
        count   : SOURATES.length,
        results : SOURATES.map(s => ({
          type        : 'sourate',
          sourate_id  : s.id,
          sourate_name: s.nom_fr,
          nom_arabe   : s.nom_ar,
          sens        : s.sens,
          nb_versets  : s.nb_versets,
          type_rev    : s.type
        }))
      };
    }

    // -------- Hadiths --------
    case 'search_hadiths': {
      const { query = '', max_results = 5 } = params;
      const hadiths = recherche(query, HADITHS, ['texte', 'narrateur', 'source', 'mots_cles']);
      const slice   = hadiths.slice(0, max_results).map(h => ({
        type      : 'hadith',
        id        : h.id,
        source    : h.source,
        numero    : h.numero,
        texte     : h.texte,
        narrateur : h.narrateur
      }));
      return { count: slice.length, results: slice };
    }

    case 'get_hadith': {
      const { id } = params;
      const h = HADITHS.find(x => x.id === Number(id));
      if (!h) return { count: 0, results: [] };
      return { count: 1, results: [{ type: 'hadith', ...h }] };
    }

    case 'list_hadiths': {
      return {
        count   : HADITHS.length,
        results : HADITHS.map(h => ({
          type      : 'hadith',
          id        : h.id,
          source    : h.source,
          texte_bref: h.texte.substring(0, 80) + '...'
        }))
      };
    }

    // -------- Tafsir --------
    case 'search_tafsir': {
      const { query = '', max_results = 3 } = params;
      const tafsirs = recherche(query, TAFSIR, ['texte', 'mots_cles']);
      const slice   = tafsirs.slice(0, max_results).map(t => ({
        type       : 'tafsir',
        sourate_id : t.sourate_id,
        verset     : `${t.sourate_id}:${t.verset_id}`,
        texte      : t.texte
      }));
      return { count: slice.length, results: slice };
    }

    case 'get_tafsir': {
      const { sourate, verset } = params;
      const t = TAFSIR.find(x => x.sourate_id === Number(sourate) && x.verset_id === Number(verset));
      if (!t) return { count: 0, results: [] };
      return { count: 1, results: [{ type: 'tafsir', ...t }] };
    }

    // -------- Outils généraux --------
    case 'list_tools': {
      return {
        tools: [
          { name: 'search_quran',   desc: 'Recherche dans les versets du Coran', params: ['query', 'max_results'] },
          { name: 'get_verset',     desc: 'Récupère un verset précis',           params: ['sourate', 'verset'] },
          { name: 'get_sourate',    desc: 'Récupère une sourate complète',        params: ['id'] },
          { name: 'list_sourates',  desc: 'Liste toutes les 114 sourates',        params: [] },
          { name: 'search_hadiths', desc: 'Recherche dans les hadiths',           params: ['query', 'max_results'] },
          { name: 'get_hadith',     desc: 'Récupère un hadith par ID',            params: ['id'] },
          { name: 'list_hadiths',   desc: 'Liste tous les hadiths',               params: [] },
          { name: 'search_tafsir',  desc: 'Recherche dans le tafsir',             params: ['query', 'max_results'] },
          { name: 'get_tafsir',     desc: 'Tafsir d\'un verset précis',           params: ['sourate', 'verset'] },
        ]
      };
    }

    default:
      throw new Error(`Outil inconnu : "${tool}". Appelez list_tools pour la liste.`);
  }
}

// ── Helper ────────────────────────────────────────────────
function getSourate(id) {
  return SOURATES.find(s => s.id === Number(id)) || null;
}

// ── Démarrage ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🕌  Islam MCP Server — démarré !           ║');
  console.log(`║   📡  http://localhost:${PORT}                   ║`);
  console.log(`║   📚  ${SOURATES.length} sourates | ${VERSETS.length} versets | ${HADITHS.length} hadiths   ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
