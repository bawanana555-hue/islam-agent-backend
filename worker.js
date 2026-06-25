// ============================================================
// CLOUDFLARE WORKER - ISLAM AGENT ÉPISTÉMIQUE
// Version 2.0 - Pack complet
// ============================================================

// ============================================================
// 1. BASE DE CONNAISSANCES INTÉGRÉE
// ============================================================
const KNOWLEDGE_BASE = {
  "version": "2.0",
  "description": "Base de connaissances théologiques islamiques - Cloudflare Edition",
  "categories": [
    {
      "nom": "Sciences du Coran ('Ulûm al-Qur'ân)",
      "slug": "ulum-al-quran",
      "icon": "📖",
      "questions": [
        {
          "id": 1,
          "mots_cles": ["ulum", "ulûm", "sciences", "coran", "tafsir", "tafsîr", "exegese", "exégèse", "inimitabilité", "ijaz", "i'jaz", "naskh", "abrogation", "asbab", "revelation"],
          "titre": "Les 'Ulûm al-Qur'ân — Sciences de l'exégèse coranique",
          "reponse": "## Les 'Ulûm al-Qur'ân — La science des sciences 📖\n\n\"Nous avons fait descendre le Coran en langue arabe. Peut-être comprendrez-vous.\" (Coran 12:2)\n\n### Définition\nLes **'Ulûm al-Qur'ân** regroupent toutes les disciplines nécessaires à la compréhension et l'interprétation correcte du Livre d'Allah.\n\n### Les grandes disciplines\n\n**1. Asbâb al-Nuzûl** — Les circonstances de la révélation\nConnaissance du contexte historique dans lequel chaque verset fut révélé.\n\n**2. Al-Nâsikh wal-Mansûkh** — L'abrogation\nAllah dit : \"Tout verset que Nous abrogeons ou que Nous faisons oublier, Nous en apportons un meilleur ou un semblable.\" (Coran 2:106)\n\n**3. Al-Makkî wal-Madanî** — Sourates mecquoises et médinoises\n- **Mecquoises** : Tawhîd, eschatologie, récits prophétiques\n- **Médinoises** : Législation, sociologie islamique, droit\n\n**4. Al-I'jâz al-Qur'ânî** — L'inimitabilité du Coran\n\"Dis : Si les hommes et les djinns s'unissaient pour produire quelque chose de semblable à ce Coran, ils n'y parviendraient pas.\" (Coran 17:88)\n\n### Les grandes œuvres de Tafsîr\n\n| Auteur | Œuvre | Particularité |\n|--------|-------|---------------|\n| **Al-Tabarî** (m. 923) | *Jâmi' al-Bayân* | Référence sur les récits |\n| **Ibn Kathîr** (m. 1373) | *Tafsîr al-Qur'ân al-'Azîm* | Tafsîr bil-Riwâya |\n| **Al-Qurtubî** (m. 1272) | *Al-Jâmi' li Ahkâm al-Qur'ân* | Excellence juridique |\n\n---\n**Question de méthode** : Entre le tafsîr traditionnel (*bil-ma'thûr*) et le tafsîr rationnel (*bil-ra'y*), lequel est le plus approprié pour répondre aux défis du XXIe siècle ?"
        },
        {
          "id": 2,
          "mots_cles": ["abrogation", "naskh", "mansukh", "verset", "coran", "loi"],
          "titre": "Al-Nâsikh wal-Mansûkh — La théorie de l'abrogation",
          "reponse": "## Al-Nâsikh wal-Mansûkh — L'abrogation dans le Coran ⚖️\n\nAllah dit : \"Tout verset que Nous abrogeons ou que Nous faisons oublier, Nous en apportons un meilleur ou un semblable.\" (Coran 2:106)\n\n### Définition\n- **Al-Nâsikh** : Le verset abrogeant (qui vient après)\n- **Al-Mansûkh** : Le verset abrogé (qui est remplacé)\n\n### Types d'abrogation\n1. Abrogation du texte et du jugement\n2. Abrogation du jugement mais conservation du texte\n3. Abrogation du texte mais conservation du jugement\n\n### Exemples célèbres\n- Verset du tribut *(Coran 9:29)* abrogeant la tolérance antérieure\n- Verset du voile *(Coran 24:31)* abrogeant la liberté vestimentaire antérieure"
        }
      ]
    },
    {
      "nom": "Histoires des Prophètes (Qisas al-Anbiyâ')",
      "slug": "qisas-al-anbiya",
      "icon": "🌟",
      "questions": [
        {
          "id": 3,
          "mots_cles": ["prophètes", "anbiya", "qisas", "histoires", "adam", "nuh", "ibrahim", "ismail", "ishaq", "yaqub", "yusuf", "musa", "dawud", "sulayman", "isa", "ayyub", "yunus"],
          "titre": "Les Prophètes en Islam — Qisas al-Anbiyâ'",
          "reponse": "## Les Prophètes en Islam — Guide de l'Humanité 🌟\n\n\"Nous t'avons révélé comme Nous avons révélé à Noé et aux prophètes après lui.\" (Coran 4:163)\n\n### Nombre et nature des prophètes\nL'Islam reconnaît **25 prophètes mentionnés dans le Coran**. Les savants estiment le nombre total à **124 000 prophètes** dont **315 messagers**.\n\n### Les 5 plus grands messagers (Ulu al-'Azm)\n1. **Nûh** (Noé)\n2. **Ibrâhîm** (Abraham)\n3. **Mûsâ** (Moïse)\n4. **'Îsâ** (Jésus)\n5. **Muhammad** (Paix sur eux)\n\n### Référence majeure\nLe livre *\"Qisas al-Anbiyâ'\"* d'**Al-Kisâ'î** et celui d'**Ibn Kathîr** sont les références classiques."
        },
        {
          "id": 4,
          "mots_cles": ["adam", "adam", "premier", "homme", "creation", "crée", "terre"],
          "titre": "Âdam — Le premier prophète et père de l'humanité",
          "reponse": "## Âdam — Le premier homme et prophète 🌍\n\n\"Certes, la création d'Âdam fut comme celle de Jésus : Nous l'avons créé de terre, puis Nous lui avons dit : Sois, et il fut.\" (Coran 3:59)\n\n### Création\nAllah créa Âdam à partir de la terre *(Coran 32:7)*. Il lui insuffla Son Esprit *(Coran 15:29)* et lui apprit les noms *(Coran 2:31)*.\n\n### Les enseignements\n1. **La connaissance** : Apprentissage des noms\n2. **La dignité** : Les anges se prosternèrent\n3. **La responsabilité** : L'homme est vicaire sur terre *(Coran 2:30)*\n4. **Le repentir** : Ayant désobéi, Âdam se repentit et fut pardonné *(Coran 2:37)*"
        }
      ]
    },
    {
      "nom": "Théologie fondamentale (Tawhîd et 'Aqîdah)",
      "slug": "tawhid-aqidah",
      "icon": "☪️",
      "questions": [
        {
          "id": 5,
          "mots_cles": ["tawhid", "unicité", "dieu", "allah", "seigneur", "divinité", "attributs"],
          "titre": "Le Tawhîd — L'unicité d'Allah",
          "reponse": "## Le Tawhîd — Pilier central de la foi ☪️\n\n\"Dis : Il est Allah, Unique. Allah est Celui qui suffit. Il n'a pas engendré et n'a pas été engendré. Et personne n'est égal à Lui.\" (Coran 112)\n\n### Les trois dimensions du Tawhîd\n\n**1. Tawhîd al-Rubûbiyyah** — Unicité de la Seigneurie\nAllah est le seul Créateur, Souverain et Gestionnaire de l'univers.\n\n**2. Tawhîd al-Ulûhiyyah** — Unicité de l'Adoration\nAllah est le seul digne d'être adoré.\n\n**3. Tawhîd al-Asmâ' wa al-Sifât** — Unicité des Noms et Attributs\nAllah possède des Noms et Attributs qui Lui sont propres."
        },
        {
          "id": 6,
          "mots_cles": ["piliers", "foi", "iman", "croyance", "islam", "croyant", "moumin"],
          "titre": "Les six piliers de la foi (Arkan al-Îmân)",
          "reponse": "## Les six piliers de la foi — Arkan al-Îmân 📿\n\nLe Prophète Muhammad (paix sur lui) a dit : \"La foi consiste à croire en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour dernier, et au destin, qu'il soit bon ou mauvais.\" (Hadith rapporté par Muslim)\n\n### 1. La croyance en Allah\nCroire en l'existence d'Allah, Son unicité (*Tawhîd*).\n\n### 2. La croyance en Ses anges\nDes êtres de lumière créés par Allah. Les principaux : **Jibrîl**, **Mîkâ'îl**, **Isrâfîl**.\n\n### 3. La croyance en Ses livres\nLe Coran, la Thora, les Psaumes, l'Évangile.\n\n### 4. La croyance en Ses messagers\nLes 25 prophètes mentionnés dans le Coran.\n\n### 5. La croyance au Jour dernier\nLa résurrection, le jugement, le paradis, l'enfer.\n\n### 6. La croyance au destin (Qadar)"
        }
      ]
    },
    {
      "nom": "Questions générales et introduction",
      "slug": "general",
      "icon": "💡",
      "questions": [
        {
          "id": 7,
          "mots_cles": ["agent", "épistémique", "votre", "qui", "êtes", "présente"],
          "titre": "Présentation de l'Agent Épistémique",
          "reponse": "## Présentation de l'Agent Épistémique 🤖\n\nJe suis **Islam Agent Épistémique**, votre assistant spécialisé dans la théologie islamique.\n\n### Ma mission\n- Vulgariser les valeurs et sciences authentiques du Saint Coran\n- Rendre l'éducation islamique accessible gratuitement\n- Briser les barrières financières\n\n### Mes compétences\n- **Sciences coraniques** (Tafsîr, sciences du Coran)\n- **Histoires des prophètes**\n- **Théologie fondamentale** (Tawhîd, 'Aqîdah)\n\n### Mon fonctionnement\nJe peux répondre même hors ligne grâce à ma base de connaissances intégrée."
        },
        {
          "id": 8,
          "mots_cles": ["salam", "salutation", "bonjour", "bonsoir", "paix"],
          "titre": "Salutation islamique",
          "reponse": "## Assalam alaykum — Que la paix soit sur vous ☪️\n\n\"Et lorsqu'on vous salue, saluez d'une façon meilleure ou rendez la salutation.\" (Coran 4:86)\n\nLa salutation islamique est **\"Assalam alaykum\"** (Que la paix soit sur vous).\n\n### La réponse complète\n**\"Wa alaykum assalam wa rahmatullahi wa barakatuh\"**\n(Et sur vous, la paix, la miséricorde d'Allah et Ses bénédictions).\n\n### Valeur de la salutation\nLe Prophète (paix sur lui) a dit : \"Répandez la salutation entre vous.\" (Hadith authentique)"
        }
      ]
    }
  ]
};

// ============================================================
// 2. FONCTIONS DE RECHERCHE
// ============================================================

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'pour', 'par', 'sur',
      'dans', 'avec', 'sans', 'chez', 'en', 'à', 'au', 'aux'
    ].includes(w));
}

function searchByKeywords(query) {
  if (!KNOWLEDGE_BASE || !KNOWLEDGE_BASE.categories) return null;
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;
  let bestMatch = null;
  let bestScore = 0;
  for (const category of KNOWLEDGE_BASE.categories) {
    if (!category.questions) continue;
    for (const item of category.questions) {
      const keywords = (item.mots_cles || []).map(k => k.toLowerCase());
      let matchCount = 0;
      for (const token of qTokens) {
        if (keywords.some(k => k.includes(token) || token.includes(k))) {
          matchCount++;
        }
      }
      const score = matchCount / Math.max(qTokens.length, 1);
      if (score > bestScore && score > 0.3) {
        bestScore = score;
        bestMatch = item;
      }
    }
  }
  return bestMatch;
}

function computeTF(terms) {
  const tf = {};
  for (const t of terms) tf[t] = (tf[t] || 0) + 1;
  for (const k in tf) tf[k] = tf[k] / terms.length;
  return tf;
}

function computeIDF(documents) {
  const docFreq = {};
  for (const doc of documents) {
    const unique = new Set(doc);
    for (const t of unique) docFreq[t] = (docFreq[t] || 0) + 1;
  }
  const idf = {};
  const N = documents.length;
  for (const t in docFreq) idf[t] = Math.log((N + 1) / (docFreq[t] + 1)) + 1;
  return idf;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (const k in vecA) {
    if (vecB[k]) dot += vecA[k] * vecB[k];
    normA += vecA[k] * vecA[k];
  }
  for (const k in vecB) normB += vecB[k] * vecB[k];
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function searchLocal(query, topK = 3) {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) {
    return ["Je n'ai pas compris votre question. Pouvez-vous reformuler ?"];
  }

  const segments = [];
  const texts = [];

  function extractText(obj, path = '') {
    if (typeof obj === 'string') {
      if (obj.length > 10) {
        segments.push({ text: obj, path });
        texts.push(tokenize(obj));
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => extractText(item, path + `[${i}]`));
      return;
    }
    if (obj && typeof obj === 'object') {
      for (const k in obj) {
        extractText(obj[k], path + '.' + k);
      }
    }
  }
  extractText(KNOWLEDGE_BASE);

  if (texts.length === 0) {
    return ["Aucune donnée textuelle trouvée dans la base."];
  }

  const idf = computeIDF(texts);
  const qTF = computeTF(qTokens);
  const qVec = {};
  for (const t in qTF) qVec[t] = qTF[t] * (idf[t] || 1);

  const scores = [];
  for (let i = 0; i < texts.length; i++) {
    const docTF = computeTF(texts[i]);
    const dVec = {};
    for (const t in docTF) dVec[t] = docTF[t] * (idf[t] || 1);
    const sim = cosineSimilarity(qVec, dVec);
    scores.push({ index: i, score: sim, text: segments[i].text, path: segments[i].path });
  }

  scores.sort((a, b) => b.score - a.score);
  const results = scores.slice(0, topK).filter(s => s.score > 0.05);

  if (results.length === 0) {
    return ["Je n'ai pas trouvé de correspondance pertinente dans ma base. Pouvez-vous préciser votre question ?"];
  }

  return results.map(r => r.text);
}

function searchHybrid(query, topK = 3) {
  const keywordMatch = searchByKeywords(query);
  if (keywordMatch && keywordMatch.reponse && keywordMatch.reponse.length > 20) {
    return [`## ${keywordMatch.titre}\n\n${keywordMatch.reponse}`];
  }
  const results = searchLocal(query, topK);
  if (results && results.length > 0) {
    return results;
  }
  return ["Je n'ai pas trouvé de correspondance dans ma base de connaissances."];
}

// ============================================================
// 3. GÉNÉRATION DE RÉPONSE AVEC IA (SIMULÉE)
// ============================================================

function generateAIResponse(query) {
  // Recherche locale d'abord
  const localResults = searchHybrid(query, 2);
  if (localResults && localResults.length > 0) {
    return localResults.join('\n\n---\n\n');
  }
  
  // Réponse générique avec contexte
  const responses = [
    `## Réflexion sur votre question\n\n"${query}"\n\nCette question mérite une analyse approfondie dans le cadre des sciences islamiques. Je vous invite à consulter les sources authentiques pour une compréhension complète.\n\n📚 *Référence suggérée* : Les 'Ulûm al-Qur'ân d'Ibn Kathîr.`,
    
    `## Perspective islamique\n\nVotre question sur "${query}" touche à des principes fondamentaux de la théologie islamique. Allah dit dans le Coran : *"Et consultez-les à propos des affaires..."* (Coran 3:159)\n\n💡 **Conseil** : La connaissance en Islam se construit par l'étude continue et la consultation des savants.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================================
// 4. GESTION DES REQUÊTES CLOUDFLARE WORKER
// ============================================================

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Gestion CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  // Réponse OPTIONS pour CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Route principale
  if (path === '/' || path === '/chat') {
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'online',
        message: 'Islam Agent Épistémique - Cloudflare Worker',
        version: '2.0',
        endpoints: {
          chat: 'POST /chat',
          health: 'GET /health',
          stats: 'GET /stats'
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const question = body.question || body.query || '';
        const mode = body.mode || 'hybrid';
        const apiKey = body.apiKey || '';

        if (!question || question.trim().length < 2) {
          return new Response(JSON.stringify({
            error: 'Question trop courte ou vide',
            answer: 'Veuillez poser une question claire sur l\'Islam.'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        // Si une API Key est fournie, on pourrait l'utiliser pour un service externe
        // Ici, on utilise la base intégrée
        let answer;
        
        switch (mode) {
          case 'local':
            const localResults = searchHybrid(question, 3);
            answer = localResults.join('\n\n---\n\n');
            break;
          case 'hybrid':
            // Recherche locale + enrichissement
            const hybridResults = searchHybrid(question, 3);
            if (hybridResults && hybridResults.length > 0) {
              answer = hybridResults.join('\n\n---\n\n');
            } else {
              answer = generateAIResponse(question);
            }
            break;
          case 'online':
            // Mode online : réponse enrichie
            answer = generateAIResponse(question);
            break;
          default:
            answer = searchHybrid(question, 3).join('\n\n---\n\n');
        }

        return new Response(JSON.stringify({
          answer: answer,
          mode: mode,
          question: question,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Erreur de traitement',
          message: error.message,
          answer: 'Une erreur est survenue. Veuillez réessayer.'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
  }

  // Route Health
  if (path === '/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: 'online'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  // Route Stats
  if (path === '/stats') {
    const totalQuestions = KNOWLEDGE_BASE.categories.reduce((acc, cat) => {
      return acc + (cat.questions ? cat.questions.length : 0);
    }, 0);
    
    return new Response(JSON.stringify({
      categories: KNOWLEDGE_BASE.categories.length,
      questions: totalQuestions,
      version: KNOWLEDGE_BASE.version
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  // 404
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: 'Endpoint non trouvé'
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
