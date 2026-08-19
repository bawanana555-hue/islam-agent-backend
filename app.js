// app.js - Orchestrateur de l'application

// 1. Enregistrement du Service Worker pour la PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker enregistré !', reg.scope))
            .catch(err => console.error('Échec Service Worker :', err));
    });
}

// 2. Initialisation de la base locale au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    initDatabase();
});

/**
 * Fonction principale à appeler dans votre index.html lors du clic sur "Envoyer"
 * @param {string} userQuery - La question saisie par l'étudiant
 * @param {string} mode - 'local', 'online', ou 'hybrid'
 */
async function handleUserQuery(userQuery, mode = 'local') {
    if (!userQuery.trim()) return;

    if (mode === 'local' || !navigator.onLine) {
        console.log("Traitement en Mode Local (Hors-ligne)...");
        return await processLocalRAGQuery(userQuery);
    } 
    else if (mode === 'online') {
        console.log("Traitement en Mode En Ligne...");
        // Remplacez cette partie par votre appel API serveur en ligne existant
        return await fetchOnlineAPI(userQuery); 
    }
    else if (mode === 'hybrid') {
        // En mode hybride : cherche en local, et si pas assez précis, bascule sur l'API si connecté
        let localResponse = await processLocalRAGQuery(userQuery);
        if (navigator.onLine && localResponse.includes("Aucune information")) {
             return await fetchOnlineAPI(userQuery);
        }
        return localResponse;
    }
}

// Exemple de fonction factice pour le mode en ligne
async function fetchOnlineAPI(query) {
    // Insérez ici la logique de votre API distante actuelle
    return "Réponse générée par l'IA en ligne...";
}
