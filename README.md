# Proposition audio-texte — lecteur de lecture coranique

## Recommandation

Utiliser **un fichier audio par sourate** et **un fichier JSON par sourate**
contenant les mots et leurs minutages. Le lecteur peut ainsi charger une
sourate à la demande et surligner le mot courant sans découper l'audio.

Le fichier JSON est la source de vérité pour la synchronisation. Un fichier
WebVTT peut être généré ensuite comme solution de secours pour les lecteurs
qui ne comprennent pas le JSON.

## Arborescence proposée

```text
quran-audio-text/
├── manifest.json
├── audio/
│   └── 001.mp3
├── text/
│   └── 001.json
└── captions/
    └── 001.vtt
```

## Convention de synchronisation

- `startMs` et `endMs` sont exprimés en millisecondes.
- Le temps commence à `0` au début du fichier audio.
- Un mot est actif lorsque `startMs <= currentTimeMs < endMs`.
- Le mot actif reçoit la classe CSS `is-active`.
- Les minutages doivent être produits avec **le même audio et le même
  réciteur** que ceux livrés à l'application.
- Les minutages montrés dans les exemples sont volontairement `null` : ils ne
  doivent pas être remplacés par des valeurs estimées.

## Pourquoi ce format

1. **JSON** : précis pour le surlignage mot par mot et facile à exploiter dans
   React ou JavaScript.
2. **MP3** : léger et compatible avec la plupart des appareils.
3. **OGG optionnel** : utile pour certains navigateurs et pour proposer une
   alternative de compression.
4. **WebVTT** : utile pour l'accessibilité et le mode de secours, mais moins
   pratique que le JSON pour styliser chaque mot.

## Règle importante pour le texte arabe

Conserver séparément :

- `textUthmani` : texte affiché à l'apprenant, avec les signes diacritiques ;
- `textPlain` : forme simplifiée destinée à la recherche ou à la comparaison ;
- `words[].text` : forme exacte affichée et alignée ;
- `words[].normalized` : forme normalisée utilisée uniquement pour la recherche.

Le moteur de synchronisation ne doit jamais supprimer les diacritiques du texte
affiché.

## Contrôle qualité conseillé

Pour chaque sourate :

1. générer un premier alignement automatique ;
2. vérifier manuellement les débuts et fins de chaque mot ;
3. vérifier les pauses, les prolongations et les liaisons de récitation ;
4. enregistrer l'offset éventuel dans `manifest.json` ;
5. tester le mode vitesse lente `0.5x` et la reprise après pause.

Une tolérance visuelle de `40` à `80 ms` peut être utilisée pour éviter un
surlignage trop nerveux, sans modifier les minutages originaux.

## Algorithme minimal côté lecteur

```js
const currentTimeMs = audio.currentTime * 1000 + manifest.offsetMs;
const activeWord = words.find(
  (word) => word.startMs <= currentTimeMs && currentTimeMs < word.endMs
);
```

Pour une grande bibliothèque, remplacer `find` par une recherche binaire.
