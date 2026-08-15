// server/migrate-data.js
import { createClient } from '@supabase/supabase-js';
import { islamData } from '../data/islam_data.js'; // Chemin corrigé
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger .env depuis la racine du projet
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function migrerDonnees() {
    console.log('🔄 Début de la migration vers Supabase...');
    
    try {
        // Migration des données épistémiques
        if (islamData.matriceEpistemique) {
            for (const [categorie, donnees] of Object.entries(islamData.matriceEpistemique)) {
                const { error } = await supabase
                    .from('islam_knowledge')
                    .upsert({
                        titre: categorie,
                        contenu: typeof donnees === 'object' ? JSON.stringify(donnees) : donnees,
                        categorie: 'epistemique',
                        source: 'islam_data_original',
                        mots_cles: [categorie, ...Object.keys(donnees)]
                    }, { onConflict: 'titre' });
                
                if (error) {
                    console.error(`❌ Erreur pour ${categorie}:`, error);
                } else {
                    console.log(`✅ Catégorie "${categorie}" migrée`);
                }
            }
        }

        // Migration des règles de réponse
        if (islamData.reglesReponse) {
            const { error } = await supabase
                .from('islam_knowledge')
                .upsert({
                    titre: 'Règles de réponse',
                    contenu: JSON.stringify(islamData.reglesReponse),
                    categorie: 'regles',
                    source: 'islam_data_original',
                    mots_cles: ['regles', 'conduite', 'ethique']
                }, { onConflict: 'titre' });
            
            if (error) {
                console.error('❌ Erreur règles:', error);
            } else {
                console.log('✅ Règles de réponse migrées');
            }
        }

        console.log('🎉 Migration terminée avec succès !');
    } catch (error) {
        console.error('❌ Erreur critique:', error);
    }
}

// Exécution
migrerDonnees();
