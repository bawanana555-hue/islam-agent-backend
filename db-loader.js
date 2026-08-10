// ============================================================
// db-loader.js : charge les données depuis Google Sheets
// et les expose dans window.islamData pour votre agent existant.
// ============================================================

// --- CONFIGURATION (à modifier avec vos vrais identifiants) ---
const API_KEY = 'VOTRE_CLE_API';           // Clé API Google Sheets
const SPREADSHEET_ID = 'VOTRE_ID_FEUILLE'; // ID de votre Google Sheet

// --- Fonction pour lire une feuille et retourner un tableau d'objets ---
async function getSheetData(sheetName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    const rows = data.values;
    if (!rows || rows.length === 0) return [];
    const headers = rows[0];
    // On transforme chaque ligne en objet avec les en-têtes comme clés
    return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = (row[i] !== undefined) ? row[i] : '';
        });
        return obj;
    });
}

// --- Chargement principal : récupère toutes les feuilles nécessaires ---
async function loadDatabase() {
    try {
        console.log('🔄 Chargement des données depuis Google Sheets...');
        const [sourates, versets, hadiths, tafsirs] = await Promise.all([
            getSheetData('sourates'),
            getSheetData('versets'),
            getSheetData('hadiths'),
            getSheetData('tafsir')
        ]);

        // Construire la structure attendue par votre agent (similaire à islam_data.js)
        window.islamData = {
            sourates,      // tableau d'objets : { id, nom_ar, nom_fr, nb_versets, type, sens }
            versets,       // tableau d'objets : { sourate_id, verset_id, arabe, traduction, mots_cles }
            hadiths,       // tableau d'objets : { id, source, numero, texte, narrateur, mots_cles }
            tafsirs        // tableau d'objets : { sourate_id, verset_id, texte, mots_cles }
        };

        console.log(`✅ Données chargées : ${sourates.length} sourates, ${versets.length} versets, ${hadiths.length} hadiths, ${tafsirs.length} tafsirs.`);
        
        // Optionnel : déclencher un événement pour signaler que les données sont prêtes
        document.dispatchEvent(new Event('islamDataReady'));
        
        return window.islamData;
    } catch (error) {
        console.error('❌ Erreur de chargement depuis Google Sheets :', error.message);
        // Fallback : tenter de charger le fichier local islam_data.js si présent
        try {
            // Si vous avez toujours le fichier local, on peut le charger en secours
            // Mais cela nécessite de l'avoir en variable globale.
            // Ici on peut simplement afficher une erreur et laisser l'agent gérer.
        } catch (e) {}
        return null;
    }
}

// --- Lancement du chargement dès que la page est prête ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDatabase);
} else {
    loadDatabase();
}
