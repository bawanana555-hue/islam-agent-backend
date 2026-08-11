// db-loader.js — charge islam_data.js local
document.addEventListener('DOMContentLoaded', function() {
    if (typeof islamData !== 'undefined') {
        window.islamData = islamData;
        console.log('✅ Données locales chargées depuis islam_data.js');
        document.dispatchEvent(new Event('islamDataReady'));
    } else {
        console.error('❌ islam_data.js introuvable ou mal chargé');
    }
});
