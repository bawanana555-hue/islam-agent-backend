// db-loader.js — charge islam_data.js local avec fallback
document.addEventListener('DOMContentLoaded', function() {
    function loadIslamData() {
        if (typeof islamData !== 'undefined') {
            window.islamData = islamData;
            console.log('✅ Données locales chargées depuis islam_data.js');
            document.dispatchEvent(new Event('islamDataReady'));
            return true;
        }
        
        // Tentative de chargement automatique si absent
        console.warn('⚠️ islamData non trouvé, tentative de chargement...');
        const script = document.createElement('script');
        script.src = 'islam_data.js';
        script.onload = function() {
            if (typeof islamData !== 'undefined') {
                window.islamData = islamData;
                console.log('✅ Données chargées après tentative');
                document.dispatchEvent(new Event('islamDataReady'));
            } else {
                console.error('❌ Échec du chargement de islam_data.js');
                document.dispatchEvent(new Event('islamDataError'));
            }
        };
        script.onerror = function() {
            console.error('❌ islam_data.js introuvable');
            document.dispatchEvent(new Event('islamDataError'));
        };
        document.head.appendChild(script);
        return false;
    }
    
    loadIslamData();
});
