// server-mcp.js 
import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
import { GoogleGenAI } from '@google/genai'; 
import { createClient } from '@supabase/supabase-js';

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 3000;

// Configuration des middlewares
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public'));

// Vérification des variables d'environnement
if (!process.env.GEMINI_API_KEY) {
    console.error("ERREUR : GEMINI_API_KEY non définie");
    process.exit(1);
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("ERREUR : Variables Supabase manquantes");
    process.exit(1);
}

// Initialisation des clients
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Métadonnées de l'agent
const AGENT_META = {
    nom: "Islam Agent Épistémique",
    version: "1.0.0",
    description: "Assistant IA spécialisé dans l'analyse épistémique de la pensée islamique"
};

// Règles de réponse
const REGLES_REPONSE = [
    "Citer les sources authentiques du corpus islamique (Coran, Hadiths, consensus des savants)",
    "Distinguer clairement entre les faits établis et les interprétations théologiques",
    "Maintenir un ton neutre et académique, éviter les jugements de valeur",
    "Reconnaître les limites de votre connaissance lorsque vous n'êtes pas certain"
];

// Construction du prompt système
function construirePromptSysteme(contexteLocal = "") {
    return `Vous êtes "${AGENT_META.nom}", un assistant IA spécialisé.

=== RÈGLES DE CONDUITE ===
${REGLES_REPONSE.map(r => `- ${r}`).join('\n')}

${contexteLocal ? `=== DONNÉES CONTEXTUELLES ===\n${contexteLocal}` : ''}

Consignes de rédaction :
- Répondez en Markdown clair avec titres et listes
- Adoptez un ton académique, neutre et rigoureux
- Structurez votre réponse en introduction, développement et conclusion`;
}

// Fonction pour récupérer les données contextuelles depuis Supabase
async function chercherContexteSupabase(question) {
    try {
        // Recherche dans la table islam_knowledge
        const { data, error } = await supabase
            .from('islam_knowledge')
            .select('*')
            .or(`titre.ilike.%${question}%,contenu.ilike.%${question}%,mots_cles.cs.{${question.split(' ').join(',')}}`)
            .limit(5);

        if (error) {
            console.error("Erreur Supabase :", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Erreur de recherche :", error);
        return [];
    }
}

// Route principale
app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ 
                succes: false, 
                error: "La question est requise" 
            });
        }

        // Récupération du contexte depuis Supabase
        const contexteLocal = await chercherContexteSupabase(question);
        const contexteStr = contexteLocal.length > 0 
            ? JSON.stringify(contexteLocal, null, 2) 
            : "Aucun élément spécifique trouvé";

        // Préparation du prompt
        const systemInstruction = construirePromptSysteme(contexteStr);

        // Appel à Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash-lite',
            contents: question,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2,
                maxOutputTokens: 2048
            }
        });

        // Sauvegarde de l'interaction dans Supabase
        await supabase
            .from('interactions')
            .insert({
                question: question,
                reponse: response.text,
                contexte_utilise: contexteLocal,
                date_interaction: new Date().toISOString()
            });

        return res.json({
            succes: true,
            agent: AGENT_META.nom,
            reponse: response.text,
            donneesContextuellesUtilisees: contexteLocal
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({
            succes: false,
            error: "Erreur lors du traitement",
            details: error.message
        });
    }
});

// Route pour ajouter des connaissances
app.post('/api/knowledge', async (req, res) => {
    try {
        const { titre, contenu, mots_cles, source, categorie } = req.body;

        if (!titre || !contenu) {
            return res.status(400).json({ 
                succes: false, 
                error: "Titre et contenu requis" 
            });
        }

        const { data, error } = await supabase
            .from('islam_knowledge')
            .insert({
                titre,
                contenu,
                mots_cles: mots_cles || [],
                source: source || 'user_input',
                categorie: categorie || 'general',
                date_creation: new Date().toISOString()
            })
            .select();

        if (error) throw error;

        return res.json({
            succes: true,
            message: "Connaissance ajoutée avec succès",
            data: data
        });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({
            succes: false,
            error: "Erreur lors de l'ajout",
            details: error.message
        });
    }
});

// Route pour récupérer les interactions
app.get('/api/interactions', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('interactions')
            .select('*')
            .order('date_interaction', { ascending: false })
            .limit(20);

        if (error) throw error;

        return res.json({
            succes: true,
            interactions: data
        });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({
            succes: false,
            error: "Erreur de récupération",
            details: error.message
        });
    }
});

// Démarrage
app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🤖 ${AGENT_META.nom} est actif !`);
    console.log(`🚀 Serveur sur : http://localhost:${PORT}`);
    console.log(`📊 Supabase connecté : ${process.env.SUPABASE_URL}`);
    console.log(`================================================`);
});
