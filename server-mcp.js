// server-mcp.js 

import express from 'express'; 

import cors from 'cors'; 

import dotenv from 'dotenv'; 

import { GoogleGenAI } from '@google/genai'; 

import { islamData, chercherDansBase } from './islam_data.js'; 

dotenv.config(); 

const app = express(); const PORT = process.env.PORT || 3000;

// Configuration des middlewares app.use(cors()); app.use(express.json()); app.use(express.static('public')); // Pour servir l'interface HTML/JS

// Vérification de la clé d'API if (!process.env.GEMINI_API_KEY) { console.error("ERREUR CRITIQUE : La variable GEMINI_API_KEY n'est pas définie dans le fichier .env"); process.exit(1); }

// Initialisation du client Google GenAI const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Construction des instructions système function construirePromptSysteme(contexteLocal = "") { return ` Vous êtes "${islamData.agentMetaData.nom}", un assistant IA spécialisé dans l'analyse épistémique et scientifique de la pensée islamique.

=== CADRE ÉPISTÉMIQUE ET RÈGLES DE CONDUITE === ${islamData.reglesReponse.map(r => - ${r}).join('\n')}

=== BASE DE DONNÉES DE RÉFÉRENCE === ${JSON.stringify(islamData.matriceEpistemique, null, 2)}

{contexteLocal ? `=== DONNÉES CONTEXTUELLES LOCALE RETROUVÉES ===\n{contexteLocal}` : ''}

Consignes de rédaction :

Répondez en Markdown clair avec des titres et des listes.

Gardez un ton académique, neutre et rigoureux. `; }

// Route API principale : Interrogation de l'agent app.post('/api/chat', async (req, res) => { try { const { question } = req.body;

if (!question) { return res.status(400).json({ error: "La question est requise." }); }

// 1. Recherche contextuelle dans la base locale const elementsLocaux = chercherDansBase(question); const contexteLocal = elementsLocaux.length > 0 ? JSON.stringify(elementsLocaux, null, 2) : "Aucun élément spécifique trouvé dans le dictionnaire local.";

// 2. Préparation du prompt et des options Gemini const systemInstruction = construirePromptSysteme(contexteLocal);

// 3. Appel au modèle Gemini 1.5 Flash Lite const response = await ai.models.generateContent({ model: 'gemini-1.5-flash-lite', contents: question, config: { systemInstruction: systemInstruction, temperature: 0.2, // Faible température pour éviter les hallucinations maxOutputTokens: 2048 } });

// 4. Envoi de la réponse au client return res.json({ succes: true, agent: islamData.agentMetaData.nom, reponse: response.text, donneesContextuellesUtilisees: elementsLocaux });

} catch (error) { console.error("Erreur du serveur d'IA :", error); return res.status(500).json({ succes: false, error: "Une erreur est survenue lors du traitement de la requête.", details: error.message }); } });

// Lancement du serveur HTTP app.listen(PORT, () => { console.log(====================================================); console.log(🤖 ${islamData.agentMetaData.nom} est actif !); console.log(🚀 Serveur démarré sur : http://localhost:${PORT}); console.log(====================================================); });

