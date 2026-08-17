// db-loader.js — charge islam_data.js local avec fallback robuste (Promise)
(function () {
    'use strict';

    // Évite les doublons si le script est inclus plusieurs fois
    if (window.__islamDataLoader) return;
    window.__islamDataLoader = true;

    // Retourne une Promesse : plus simple pour les consommateurs
    function loadIslamData() {
        return new Promise(function (resolve, reject) {
            // 1) Déjà chargé ?
            if (typeof window.islamData !== 'undefined' && window.islamData) {
                console.log('✅ Données locales chargées depuis islam_data.js');
                resolve(window.islamData);
                return;
            }

            // 2) Chargement automatique (fallback)
            console.warn('⚠️ islamData non trouvé, tentative de chargement...');
            var script = document.createElement('script');
            script.src = 'islam_data.js';
            script.async = true;

            script.onload = function () {
                if (typeof window.islamData !== 'undefined' && window.islamData) {
                    console.log('✅ Données chargées après tentative');
                    resolve(window.islamData);
                } else {
                    reject(new Error('islam_data.js chargé mais islamData absent'));
                }
            };
            script.onerror = function () {
                reject(new Error('islam_data.js introuvable'));
            };

            document.head.appendChild(script);
        });
    }

    // Expose pour consommation externe
    window.loadIslamData = loadIslamData;

    // Déclenche l'événement pour compatibilité avec le code existant
    loadIslamData()
        .then(function () {
            document.dispatchEvent(new Event('islamDataReady'));
        })
        .catch(function (err) {
            console.error('❌', err.message);
            document.dispatchEvent(new Event('islamDataError'));
        });
})();
