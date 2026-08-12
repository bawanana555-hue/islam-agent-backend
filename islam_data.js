// islam_data.js 

export const islamData = { 

agentMetaData: { 

nom: "Islam Agent Épistémique", 

version: "1.0.0", 

domaine: "Épistémologie, Usul al-Fiqh, Sciences du Hadith, Histoire des idées" 

}, 

matriceEpistemique: { 

sourcesPrimaire: [ 

{ 

nom: "Le Coran (Al-Qur'an)", 

nature: "Révélation directe (Wahy Matluw)", 

statut: "Source suprême et immuable" 

}, 

{ 

nom: "La Sunnah", 

nature: "Propos, actes et approbations du Prophète (Wahy Ghayr Matluw)", 

statut: "Explication et application du Coran" 

} 

], 

sourcesSecondaires: [ 

{ nom: "Al-Ijma'", description: "Consensus des savants mujtahidines d'une même époque." }, 

{ nom: "Al-Qiyas", description: "Raisonnement par analogie juridique basée sur une cause commune ('Illah)." }, 

{ nom: "Al-Istihsan", description: "Préférence juridique basée sur l'équité ou l'intérêt général." }, 

{ nom: "Al-Maslahah al-Mursalah", description: "Prise en compte de l'intérêt général non spécifié par un texte." } 

], 

outilsCritiques: [ 

{ concept: "Ilm al-Jarh wa al-Ta'dil", role: "Critique de la fiabilité des rapporteurs de hadiths." }, 

{ concept: "Asbab al-Nuzul", role: "Contexte historique de révélation des versets." }, 

{ concept: "Maqasid al-Shari'ah", role: "Objectifs supérieurs de la Législation islamique (vie, raison, foi, honneur, biens)." } 

] 

}, 

reglesReponse: [ 

"Toujours citer la méthodologie d'analyse employée.", 

"Différencier la source scripturaire (Coran/Hadith) de l'interprétation humaine (Fiqh).", 

"Mentionner la pluralité des écoles (Hanafi, Maliki, Shafi'i, Hanbali) lors des divergences éthiques ou juridiques.", 

"Refuser les jugements dogmatiques sans preuves épistémiques." 

] 

}; 

// Fonction de recherche textuelle dans la base de données locale 

export function chercherDansBase(requete) { 

const terme = requete.toLowerCase(); 

const resultats = []; 

islamData.matriceEpistemique.sourcesSecondaires.forEach(item => { 

if (item.nom.toLowerCase().includes(terme) || item.description.toLowerCase().includes(terme)) { 

resultats.push(item); 

} 

}); 

islamData.matriceEpistemique.outilsCritiques.forEach(item => { 

if (item.concept.toLowerCase().includes(terme) || item.role.toLowerCase().includes(terme)) { 

resultats.push(item); 

} 

}); 

return resultats; 

}

