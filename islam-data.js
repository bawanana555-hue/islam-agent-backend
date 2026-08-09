'use strict';

// ============================================================
// BASE DE DONNÉES ISLAMIQUE COMPLÈTE
// Sources : Coran (traduction française Hamidullah),
//           Hadiths authentiques (Sahih Bukhari, Muslim, etc.)
//           Tafsir Ibn Kathir (résumé)
// ============================================================

// -----------------------------------------------------------
// 1. SOURATES (114 sourates avec métadonnées)
// -----------------------------------------------------------
const SOURATES = [
  { id: 1,  nom_ar: 'الفاتحة',      nom_fr: 'Al-Fatiha',       nb_versets: 7,   type: 'mecquoise', sens: 'L\'Ouverture' },
  { id: 2,  nom_ar: 'البقرة',       nom_fr: 'Al-Baqarah',      nb_versets: 286, type: 'médinoise', sens: 'La Vache' },
  { id: 3,  nom_ar: 'آل عمران',     nom_fr: 'Al-Imran',        nb_versets: 200, type: 'médinoise', sens: 'La Famille d\'Imran' },
  { id: 4,  nom_ar: 'النساء',       nom_fr: 'An-Nisa',         nb_versets: 176, type: 'médinoise', sens: 'Les Femmes' },
  { id: 5,  nom_ar: 'المائدة',      nom_fr: 'Al-Maida',        nb_versets: 120, type: 'médinoise', sens: 'La Table Servie' },
  { id: 6,  nom_ar: 'الأنعام',      nom_fr: 'Al-Anam',         nb_versets: 165, type: 'mecquoise', sens: 'Les Bestiaux' },
  { id: 7,  nom_ar: 'الأعراف',      nom_fr: 'Al-Araf',         nb_versets: 206, type: 'mecquoise', sens: 'Les Hauteurs' },
  { id: 8,  nom_ar: 'الأنفال',      nom_fr: 'Al-Anfal',        nb_versets: 75,  type: 'médinoise', sens: 'Le Butin' },
  { id: 9,  nom_ar: 'التوبة',       nom_fr: 'At-Tawba',        nb_versets: 129, type: 'médinoise', sens: 'Le Repentir' },
  { id: 10, nom_ar: 'يونس',         nom_fr: 'Yunus',           nb_versets: 109, type: 'mecquoise', sens: 'Jonas' },
  { id: 11, nom_ar: 'هود',          nom_fr: 'Hud',             nb_versets: 123, type: 'mecquoise', sens: 'Houd' },
  { id: 12, nom_ar: 'يوسف',         nom_fr: 'Yusuf',           nb_versets: 111, type: 'mecquoise', sens: 'Joseph' },
  { id: 13, nom_ar: 'الرعد',        nom_fr: 'Ar-Rad',          nb_versets: 43,  type: 'médinoise', sens: 'Le Tonnerre' },
  { id: 14, nom_ar: 'إبراهيم',      nom_fr: 'Ibrahim',         nb_versets: 52,  type: 'mecquoise', sens: 'Abraham' },
  { id: 15, nom_ar: 'الحجر',        nom_fr: 'Al-Hijr',         nb_versets: 99,  type: 'mecquoise', sens: 'Al-Hijr' },
  { id: 16, nom_ar: 'النحل',        nom_fr: 'An-Nahl',         nb_versets: 128, type: 'mecquoise', sens: 'Les Abeilles' },
  { id: 17, nom_ar: 'الإسراء',      nom_fr: 'Al-Isra',         nb_versets: 111, type: 'mecquoise', sens: 'Le Voyage Nocturne' },
  { id: 18, nom_ar: 'الكهف',        nom_fr: 'Al-Kahf',         nb_versets: 110, type: 'mecquoise', sens: 'La Caverne' },
  { id: 19, nom_ar: 'مريم',         nom_fr: 'Maryam',          nb_versets: 98,  type: 'mecquoise', sens: 'Marie' },
  { id: 20, nom_ar: 'طه',           nom_fr: 'Ta-Ha',           nb_versets: 135, type: 'mecquoise', sens: 'Ta-Ha' },
  { id: 21, nom_ar: 'الأنبياء',     nom_fr: 'Al-Anbiya',       nb_versets: 112, type: 'mecquoise', sens: 'Les Prophètes' },
  { id: 22, nom_ar: 'الحج',         nom_fr: 'Al-Hajj',         nb_versets: 78,  type: 'médinoise', sens: 'Le Pèlerinage' },
  { id: 23, nom_ar: 'المؤمنون',     nom_fr: 'Al-Muminun',      nb_versets: 118, type: 'mecquoise', sens: 'Les Croyants' },
  { id: 24, nom_ar: 'النور',        nom_fr: 'An-Nur',          nb_versets: 64,  type: 'médinoise', sens: 'La Lumière' },
  { id: 25, nom_ar: 'الفرقان',      nom_fr: 'Al-Furqan',       nb_versets: 77,  type: 'mecquoise', sens: 'Le Discernement' },
  { id: 26, nom_ar: 'الشعراء',      nom_fr: 'Ash-Shuara',      nb_versets: 227, type: 'mecquoise', sens: 'Les Poètes' },
  { id: 27, nom_ar: 'النمل',        nom_fr: 'An-Naml',         nb_versets: 93,  type: 'mecquoise', sens: 'Les Fourmis' },
  { id: 28, nom_ar: 'القصص',        nom_fr: 'Al-Qasas',        nb_versets: 88,  type: 'mecquoise', sens: 'Le Récit' },
  { id: 29, nom_ar: 'العنكبوت',     nom_fr: 'Al-Ankabut',      nb_versets: 69,  type: 'mecquoise', sens: 'L\'Araignée' },
  { id: 30, nom_ar: 'الروم',        nom_fr: 'Ar-Rum',          nb_versets: 60,  type: 'mecquoise', sens: 'Les Byzantins' },
  { id: 31, nom_ar: 'لقمان',        nom_fr: 'Luqman',          nb_versets: 34,  type: 'mecquoise', sens: 'Luqman' },
  { id: 32, nom_ar: 'السجدة',       nom_fr: 'As-Sajda',        nb_versets: 30,  type: 'mecquoise', sens: 'La Prosternation' },
  { id: 33, nom_ar: 'الأحزاب',      nom_fr: 'Al-Ahzab',        nb_versets: 73,  type: 'médinoise', sens: 'Les Coalisés' },
  { id: 34, nom_ar: 'سبأ',          nom_fr: 'Saba',            nb_versets: 54,  type: 'mecquoise', sens: 'Saba' },
  { id: 35, nom_ar: 'فاطر',         nom_fr: 'Fatir',           nb_versets: 45,  type: 'mecquoise', sens: 'Le Créateur' },
  { id: 36, nom_ar: 'يس',           nom_fr: 'Ya-Sin',          nb_versets: 83,  type: 'mecquoise', sens: 'Ya-Sin' },
  { id: 37, nom_ar: 'الصافات',      nom_fr: 'As-Saffat',       nb_versets: 182, type: 'mecquoise', sens: 'Ceux en Rangs' },
  { id: 38, nom_ar: 'ص',            nom_fr: 'Sad',             nb_versets: 88,  type: 'mecquoise', sens: 'Sad' },
  { id: 39, nom_ar: 'الزمر',        nom_fr: 'Az-Zumar',        nb_versets: 75,  type: 'mecquoise', sens: 'Les Groupes' },
  { id: 40, nom_ar: 'غافر',         nom_fr: 'Ghafir',          nb_versets: 85,  type: 'mecquoise', sens: 'Le Pardonneur' },
  { id: 41, nom_ar: 'فصلت',         nom_fr: 'Fussilat',        nb_versets: 54,  type: 'mecquoise', sens: 'Exposés en Détail' },
  { id: 42, nom_ar: 'الشورى',       nom_fr: 'Ash-Shura',       nb_versets: 53,  type: 'mecquoise', sens: 'La Consultation' },
  { id: 43, nom_ar: 'الزخرف',       nom_fr: 'Az-Zukhruf',      nb_versets: 89,  type: 'mecquoise', sens: 'Les Ornements' },
  { id: 44, nom_ar: 'الدخان',       nom_fr: 'Ad-Dukhan',       nb_versets: 59,  type: 'mecquoise', sens: 'La Fumée' },
  { id: 45, nom_ar: 'الجاثية',      nom_fr: 'Al-Jathiya',      nb_versets: 37,  type: 'mecquoise', sens: 'L\'Agenouillée' },
  { id: 46, nom_ar: 'الأحقاف',      nom_fr: 'Al-Ahqaf',        nb_versets: 35,  type: 'mecquoise', sens: 'Les Dunes' },
  { id: 47, nom_ar: 'محمد',         nom_fr: 'Muhammad',        nb_versets: 38,  type: 'médinoise', sens: 'Muhammad' },
  { id: 48, nom_ar: 'الفتح',        nom_fr: 'Al-Fath',         nb_versets: 29,  type: 'médinoise', sens: 'La Victoire' },
  { id: 49, nom_ar: 'الحجرات',      nom_fr: 'Al-Hujurat',      nb_versets: 18,  type: 'médinoise', sens: 'Les Appartements' },
  { id: 50, nom_ar: 'ق',            nom_fr: 'Qaf',             nb_versets: 45,  type: 'mecquoise', sens: 'Qaf' },
  { id: 51, nom_ar: 'الذاريات',     nom_fr: 'Adh-Dhariyat',    nb_versets: 60,  type: 'mecquoise', sens: 'Les Vents qui Dispersent' },
  { id: 52, nom_ar: 'الطور',        nom_fr: 'At-Tur',          nb_versets: 49,  type: 'mecquoise', sens: 'Le Mont Sinaï' },
  { id: 53, nom_ar: 'النجم',        nom_fr: 'An-Najm',         nb_versets: 62,  type: 'mecquoise', sens: 'L\'Étoile' },
  { id: 54, nom_ar: 'القمر',        nom_fr: 'Al-Qamar',        nb_versets: 55,  type: 'mecquoise', sens: 'La Lune' },
  { id: 55, nom_ar: 'الرحمن',       nom_fr: 'Ar-Rahman',       nb_versets: 78,  type: 'médinoise', sens: 'Le Tout Miséricordieux' },
  { id: 56, nom_ar: 'الواقعة',      nom_fr: 'Al-Waqia',        nb_versets: 96,  type: 'mecquoise', sens: 'L\'Événement' },
  { id: 57, nom_ar: 'الحديد',       nom_fr: 'Al-Hadid',        nb_versets: 29,  type: 'médinoise', sens: 'Le Fer' },
  { id: 58, nom_ar: 'المجادلة',     nom_fr: 'Al-Mujadila',     nb_versets: 22,  type: 'médinoise', sens: 'La Discussion' },
  { id: 59, nom_ar: 'الحشر',        nom_fr: 'Al-Hashr',        nb_versets: 24,  type: 'médinoise', sens: 'Le Rassemblement' },
  { id: 60, nom_ar: 'الممتحنة',     nom_fr: 'Al-Mumtahana',    nb_versets: 13,  type: 'médinoise', sens: 'L\'Éprouvée' },
  { id: 61, nom_ar: 'الصف',         nom_fr: 'As-Saf',          nb_versets: 14,  type: 'médinoise', sens: 'Le Rang' },
  { id: 62, nom_ar: 'الجمعة',       nom_fr: 'Al-Jumua',        nb_versets: 11,  type: 'médinoise', sens: 'Le Vendredi' },
  { id: 63, nom_ar: 'المنافقون',    nom_fr: 'Al-Munafiqun',    nb_versets: 11,  type: 'médinoise', sens: 'Les Hypocrites' },
  { id: 64, nom_ar: 'التغابن',      nom_fr: 'At-Taghabun',     nb_versets: 18,  type: 'médinoise', sens: 'La Déception Mutuelle' },
  { id: 65, nom_ar: 'الطلاق',       nom_fr: 'At-Talaq',        nb_versets: 12,  type: 'médinoise', sens: 'Le Divorce' },
  { id: 66, nom_ar: 'التحريم',      nom_fr: 'At-Tahrim',       nb_versets: 12,  type: 'médinoise', sens: 'L\'Interdiction' },
  { id: 67, nom_ar: 'الملك',        nom_fr: 'Al-Mulk',         nb_versets: 30,  type: 'mecquoise', sens: 'La Royauté' },
  { id: 68, nom_ar: 'القلم',        nom_fr: 'Al-Qalam',        nb_versets: 52,  type: 'mecquoise', sens: 'La Plume' },
  { id: 69, nom_ar: 'الحاقة',       nom_fr: 'Al-Haqqa',        nb_versets: 52,  type: 'mecquoise', sens: 'L\'Inévitable' },
  { id: 70, nom_ar: 'المعارج',      nom_fr: 'Al-Maarij',       nb_versets: 44,  type: 'mecquoise', sens: 'Les Degrés' },
  { id: 71, nom_ar: 'نوح',          nom_fr: 'Nuh',             nb_versets: 28,  type: 'mecquoise', sens: 'Noé' },
  { id: 72, nom_ar: 'الجن',         nom_fr: 'Al-Jinn',         nb_versets: 28,  type: 'mecquoise', sens: 'Les Djinns' },
  { id: 73, nom_ar: 'المزمل',       nom_fr: 'Al-Muzzammil',    nb_versets: 20,  type: 'mecquoise', sens: 'L\'Enveloppé' },
  { id: 74, nom_ar: 'المدثر',       nom_fr: 'Al-Muddaththir',  nb_versets: 56,  type: 'mecquoise', sens: 'Le Revêtu d\'un Manteau' },
  { id: 75, nom_ar: 'القيامة',      nom_fr: 'Al-Qiyama',       nb_versets: 40,  type: 'mecquoise', sens: 'La Résurrection' },
  { id: 76, nom_ar: 'الإنسان',      nom_fr: 'Al-Insan',        nb_versets: 31,  type: 'médinoise', sens: 'L\'Homme' },
  { id: 77, nom_ar: 'المرسلات',     nom_fr: 'Al-Mursalat',     nb_versets: 50,  type: 'mecquoise', sens: 'Les Envoyés' },
  { id: 78, nom_ar: 'النبأ',        nom_fr: 'An-Naba',         nb_versets: 40,  type: 'mecquoise', sens: 'La Nouvelle' },
  { id: 79, nom_ar: 'النازعات',     nom_fr: 'An-Naziat',       nb_versets: 46,  type: 'mecquoise', sens: 'Ceux qui Arrachent' },
  { id: 80, nom_ar: 'عبس',          nom_fr: 'Abasa',           nb_versets: 42,  type: 'mecquoise', sens: 'Il a Froncé' },
  { id: 81, nom_ar: 'التكوير',      nom_fr: 'At-Takwir',       nb_versets: 29,  type: 'mecquoise', sens: 'L\'Obscurcissement' },
  { id: 82, nom_ar: 'الانفطار',     nom_fr: 'Al-Infitar',      nb_versets: 19,  type: 'mecquoise', sens: 'La Déchirure' },
  { id: 83, nom_ar: 'المطففين',     nom_fr: 'Al-Mutaffifin',   nb_versets: 36,  type: 'mecquoise', sens: 'Les Fraudeurs' },
  { id: 84, nom_ar: 'الانشقاق',     nom_fr: 'Al-Inshiqaq',     nb_versets: 25,  type: 'mecquoise', sens: 'La Fissure' },
  { id: 85, nom_ar: 'البروج',       nom_fr: 'Al-Buruj',        nb_versets: 22,  type: 'mecquoise', sens: 'Les Constellations' },
  { id: 86, nom_ar: 'الطارق',       nom_fr: 'At-Tariq',        nb_versets: 17,  type: 'mecquoise', sens: 'L\'Astre Nocturne' },
  { id: 87, nom_ar: 'الأعلى',       nom_fr: 'Al-Ala',          nb_versets: 19,  type: 'mecquoise', sens: 'Le Très-Haut' },
  { id: 88, nom_ar: 'الغاشية',      nom_fr: 'Al-Ghashiya',     nb_versets: 26,  type: 'mecquoise', sens: 'L\'Enveloppante' },
  { id: 89, nom_ar: 'الفجر',        nom_fr: 'Al-Fajr',         nb_versets: 30,  type: 'mecquoise', sens: 'L\'Aube' },
  { id: 90, nom_ar: 'البلد',        nom_fr: 'Al-Balad',        nb_versets: 20,  type: 'mecquoise', sens: 'La Cité' },
  { id: 91, nom_ar: 'الشمس',        nom_fr: 'Ash-Shams',       nb_versets: 15,  type: 'mecquoise', sens: 'Le Soleil' },
  { id: 92, nom_ar: 'الليل',        nom_fr: 'Al-Layl',         nb_versets: 21,  type: 'mecquoise', sens: 'La Nuit' },
  { id: 93, nom_ar: 'الضحى',        nom_fr: 'Ad-Duha',         nb_versets: 11,  type: 'mecquoise', sens: 'La Matinée' },
  { id: 94, nom_ar: 'الشرح',        nom_fr: 'Ash-Sharh',       nb_versets: 8,   type: 'mecquoise', sens: 'L\'Ouverture' },
  { id: 95, nom_ar: 'التين',        nom_fr: 'At-Tin',          nb_versets: 8,   type: 'mecquoise', sens: 'Le Figuier' },
  { id: 96, nom_ar: 'العلق',        nom_fr: 'Al-Alaq',         nb_versets: 19,  type: 'mecquoise', sens: 'L\'Adhérence' },
  { id: 97, nom_ar: 'القدر',        nom_fr: 'Al-Qadr',         nb_versets: 5,   type: 'mecquoise', sens: 'La Nuit du Destin' },
  { id: 98, nom_ar: 'البينة',       nom_fr: 'Al-Bayyina',      nb_versets: 8,   type: 'médinoise', sens: 'La Preuve Claire' },
  { id: 99, nom_ar: 'الزلزلة',      nom_fr: 'Az-Zalzala',      nb_versets: 8,   type: 'médinoise', sens: 'Le Séisme' },
  { id: 100, nom_ar: 'العاديات',    nom_fr: 'Al-Adiyat',       nb_versets: 11,  type: 'mecquoise', sens: 'Les Coureurs' },
  { id: 101, nom_ar: 'القارعة',     nom_fr: 'Al-Qaria',        nb_versets: 11,  type: 'mecquoise', sens: 'La Fracassante' },
  { id: 102, nom_ar: 'التكاثر',     nom_fr: 'At-Takathur',     nb_versets: 8,   type: 'mecquoise', sens: 'La Rivalité' },
  { id: 103, nom_ar: 'العصر',       nom_fr: 'Al-Asr',          nb_versets: 3,   type: 'mecquoise', sens: 'Le Temps' },
  { id: 104, nom_ar: 'الهمزة',      nom_fr: 'Al-Humaza',       nb_versets: 9,   type: 'mecquoise', sens: 'Le Calomniateur' },
  { id: 105, nom_ar: 'الفيل',       nom_fr: 'Al-Fil',          nb_versets: 5,   type: 'mecquoise', sens: 'L\'Éléphant' },
  { id: 106, nom_ar: 'قريش',        nom_fr: 'Quraysh',         nb_versets: 4,   type: 'mecquoise', sens: 'Quraysh' },
  { id: 107, nom_ar: 'الماعون',     nom_fr: 'Al-Maun',         nb_versets: 7,   type: 'mecquoise', sens: 'L\'Ustensile' },
  { id: 108, nom_ar: 'الكوثر',      nom_fr: 'Al-Kawthar',      nb_versets: 3,   type: 'mecquoise', sens: 'L\'Abondance' },
  { id: 109, nom_ar: 'الكافرون',    nom_fr: 'Al-Kafirun',      nb_versets: 6,   type: 'mecquoise', sens: 'Les Mécréants' },
  { id: 110, nom_ar: 'النصر',       nom_fr: 'An-Nasr',         nb_versets: 3,   type: 'médinoise', sens: 'Le Secours' },
  { id: 111, nom_ar: 'المسد',       nom_fr: 'Al-Masad',        nb_versets: 5,   type: 'mecquoise', sens: 'Les Fibres' },
  { id: 112, nom_ar: 'الإخلاص',     nom_fr: 'Al-Ikhlas',       nb_versets: 4,   type: 'mecquoise', sens: 'La Pureté' },
  { id: 113, nom_ar: 'الفلق',       nom_fr: 'Al-Falaq',        nb_versets: 5,   type: 'mecquoise', sens: 'L\'Aube Naissante' },
  { id: 114, nom_ar: 'الناس',       nom_fr: 'An-Nas',          nb_versets: 6,   type: 'mecquoise', sens: 'Les Hommes' }
];

// -----------------------------------------------------------
// 2. VERSETS CLÉS (les plus importants et les plus cherchés)
// -----------------------------------------------------------
const VERSETS = [
  // Al-Fatiha (1)
  { sourate_id: 1, verset_id: 1, arabe: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', traduction: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.", mots_cles: ['bismillah','miséricorde','nom','allah'] },
  { sourate_id: 1, verset_id: 2, arabe: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', traduction: "Louange à Allah, Seigneur de l'univers.", mots_cles: ['louange','seigneur','univers','alhamdulillah'] },
  { sourate_id: 1, verset_id: 3, arabe: 'الرَّحْمَٰنِ الرَّحِيمِ', traduction: "le Tout Miséricordieux, le Très Miséricordieux,", mots_cles: ['miséricorde','rahman','rahim'] },
  { sourate_id: 1, verset_id: 4, arabe: 'مَالِكِ يَوْمِ الدِّينِ', traduction: "Maître du Jour de la Rétribution.", mots_cles: ['jugement','jour','maître','rétribution'] },
  { sourate_id: 1, verset_id: 5, arabe: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', traduction: "C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons le secours.", mots_cles: ['adoration','secours','toi seul','prière'] },
  { sourate_id: 1, verset_id: 6, arabe: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', traduction: "Guide-nous dans le droit chemin,", mots_cles: ['guide','chemin','droit','hidaya'] },
  { sourate_id: 1, verset_id: 7, arabe: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', traduction: "le chemin de ceux que Tu as comblés de bienfaits, non pas de ceux qui ont encouru Ta colère, ni des égarés.", mots_cles: ['chemin','bienfaits','colère','égarés'] },

  // Al-Baqarah (2) — versets clés
  { sourate_id: 2, verset_id: 255, arabe: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', traduction: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre.", mots_cles: ['ayat al kursi','trône','vivant','allah','unicité','tawhid'] },
  { sourate_id: 2, verset_id: 256, arabe: 'لَا إِكْرَاهَ فِي الدِّينِ', traduction: "Nulle contrainte en religion ! Car le bon chemin s'est distingué de l'égarement.", mots_cles: ['liberté','religion','contrainte','foi'] },
  { sourate_id: 2, verset_id: 285, arabe: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ', traduction: "Le Messager a cru en ce qu'on a fait descendre vers lui venant de son Seigneur, et les croyants aussi.", mots_cles: ['foi','messager','croyants','révélation'] },
  { sourate_id: 2, verset_id: 286, arabe: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', traduction: "Allah n'impose à aucune âme une charge supérieure à sa capacité.", mots_cles: ['capacité','charge','facilité','islam'] },

  // Al-Imran (3)
  { sourate_id: 3, verset_id: 185, arabe: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ', traduction: "Toute âme goûtera la mort.", mots_cles: ['mort','âme','vie','éphémère'] },

  // An-Nisa (4)
  { sourate_id: 4, verset_id: 36, arabe: 'وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا', traduction: "Adorez Allah et ne Lui associez rien.", mots_cles: ['adoration','unicité','shirk','tawhid'] },

  // Al-Ikhlas (112) — sourate complète
  { sourate_id: 112, verset_id: 1, arabe: 'قُلْ هُوَ اللَّهُ أَحَدٌ', traduction: "Dis : Allah est Unique.", mots_cles: ['unicité','allah','tawhid','un'] },
  { sourate_id: 112, verset_id: 2, arabe: 'اللَّهُ الصَّمَدُ', traduction: "Allah, le Seul à être imploré pour ce que nous désirons.", mots_cles: ['samad','implorer','dieu'] },
  { sourate_id: 112, verset_id: 3, arabe: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', traduction: "Il n'a jamais engendré, n'a pas été engendré non plus.", mots_cles: ['naissance','engendrer','unique'] },
  { sourate_id: 112, verset_id: 4, arabe: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', traduction: "Et nul n'est égal à Lui.", mots_cles: ['égal','comparable','unicité'] },

  // Al-Qadr (97)
  { sourate_id: 97, verset_id: 1, arabe: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', traduction: "Nous l'avons certes révélé (le Coran) durant la Nuit du Destin.", mots_cles: ['laylat al qadr','nuit','destin','coran','révélation'] },
  { sourate_id: 97, verset_id: 3, arabe: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ', traduction: "La Nuit du Destin est meilleure que mille mois.", mots_cles: ['nuit du destin','mille mois','laylat al qadr'] },

  // Al-Asr (103)
  { sourate_id: 103, verset_id: 1, arabe: 'وَالْعَصْرِ', traduction: "Par le Temps !", mots_cles: ['temps','serment'] },
  { sourate_id: 103, verset_id: 2, arabe: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', traduction: "L'homme est certes en perdition,", mots_cles: ['homme','perdition','perte'] },
  { sourate_id: 103, verset_id: 3, arabe: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', traduction: "sauf ceux qui croient et accomplissent les bonnes œuvres, s'enjoignent mutuellement la vérité et s'enjoignent mutuellement la constance.", mots_cles: ['foi','bonnes oeuvres','vérité','patience'] },

  // Ya-Sin (36)
  { sourate_id: 36, verset_id: 1, arabe: 'يس', traduction: "Ya Sin.", mots_cles: ['ya sin','yasin','coeur coran'] },
  { sourate_id: 36, verset_id: 40, arabe: 'لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ', traduction: "Le soleil ne peut atteindre la lune, ni la nuit devancer le jour.", mots_cles: ['soleil','lune','nuit','jour','création'] },

  // Al-Mulk (67)
  { sourate_id: 67, verset_id: 1, arabe: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', traduction: "Béni soit Celui en Whose main est la royauté. Et Il est Omnipotent sur toute chose.", mots_cles: ['royauté','puissance','béni','mulk'] },
];

// -----------------------------------------------------------
// 3. HADITHS AUTHENTIQUES
// -----------------------------------------------------------
const HADITHS = [
  {
    id: 1, source: 'Sahih Bukhari & Muslim', numero: 'Hadith 1',
    texte: "Les actions ne valent que par leurs intentions. Chacun sera donc rétribué selon son intention.",
    narrateur: "Omar ibn al-Khattab (رضي الله عنه)",
    mots_cles: ['intention','action','niyya','oeuvres']
  },
  {
    id: 2, source: 'Sahih Muslim', numero: 'Hadith 36',
    texte: "L'islam est bâti sur cinq [piliers] : l'attestation qu'il n'y a de dieu qu'Allah et que Mahomet est Son messager ; l'accomplissement de la prière ; l'acquittement de la Zakat ; le pèlerinage à La Mecque ; le jeûne du Ramadan.",
    narrateur: "Abdallah ibn Omar (رضي الله عنه)",
    mots_cles: ['cinq piliers','islam','prière','zakat','hajj','ramadan','chahada']
  },
  {
    id: 3, source: 'Sahih Bukhari', numero: 'Hadith 6011',
    texte: "Le croyant qui a le caractère le plus parfait est celui qui a la meilleure moralité. Le meilleur d'entre vous est celui qui est le meilleur envers sa femme.",
    narrateur: "Abu Hurayra (رضي الله عنه)",
    mots_cles: ['moralité','caractère','femme','famille','akhlaq']
  },
  {
    id: 4, source: 'Sahih Muslim', numero: 'Hadith 2564',
    texte: "Allah est beau et Il aime la beauté.",
    narrateur: "Ibn Massoud (رضي الله عنه)",
    mots_cles: ['beauté','allah','beau','création']
  },
  {
    id: 5, source: 'Sahih Bukhari', numero: 'Hadith 7',
    texte: "La foi comprend plus de soixante-dix ou soixante branches. La plus élevée est la parole 'Lā ilāha illā Allāh' et la plus basse est d'ôter un obstacle de la route. La pudeur est également une branche de la foi.",
    narrateur: "Abu Hurayra (رضي الله عنه)",
    mots_cles: ['foi','iman','branches','chahada','pudeur','haya']
  },
  {
    id: 6, source: 'Sahih Muslim', numero: 'Hadith 2553',
    texte: "Que celui d'entre vous qui voit un mal le corrige par la main ; s'il ne le peut pas, qu'il le corrige par la parole ; s'il ne le peut pas, qu'il le réprouve dans son cœur, et c'est là le plus faible degré de la foi.",
    narrateur: "Abu Said al-Khudri (رضي الله عنه)",
    mots_cles: ['mal','interdire','bien','foi','devoir']
  },
  {
    id: 7, source: 'Tirmidhi (hassan sahih)', numero: 'Hadith 2516',
    texte: "Sois dans ce monde comme un étranger ou un passant.",
    narrateur: "Ibn Omar (رضي الله عنه)",
    mots_cles: ['monde','dunya','vie','éphémère','zuhd','ascétisme']
  },
  {
    id: 8, source: 'Sahih Bukhari', numero: 'Hadith 5027',
    texte: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
    narrateur: "Uthman ibn Affan (رضي الله عنه)",
    mots_cles: ['coran','apprendre','enseigner','meilleur','savoir']
  },
  {
    id: 9, source: 'Sahih Muslim', numero: 'Hadith 1631',
    texte: "Quand l'homme meurt, ses œuvres s'arrêtent, sauf trois : une aumône continue (sadaqa jariya), un savoir dont on profite, ou un enfant vertueux qui prie pour lui.",
    narrateur: "Abu Hurayra (رضي الله عنه)",
    mots_cles: ['mort','aumône','sadaqa jariya','savoir','enfant','prière','charité']
  },
  {
    id: 10, source: 'Sahih Bukhari & Muslim', numero: 'Hadith Arba\'in 13',
    texte: "Aucun de vous ne croit vraiment tant qu'il ne désire pas pour son frère ce qu'il désire pour lui-même.",
    narrateur: "Anas ibn Malik (رضي الله عنه)",
    mots_cles: ['fraternité','foi','désir','frère','amour','iman']
  },
  {
    id: 11, source: 'Sahih Bukhari', numero: 'Hadith 1385',
    texte: "Tout nouveau-né naît dans la disposition naturelle (fitra). Ce sont ses parents qui en font un juif, un chrétien ou un zoroastrien.",
    narrateur: "Abu Hurayra (رضي الله عنه)",
    mots_cles: ['fitra','naissance','nature','parents','enfant']
  },
  {
    id: 12, source: 'Sahih Muslim', numero: 'Hadith 2999',
    texte: "La chose admirable chez le croyant, c'est que tout ce qui lui arrive lui est bénéfique : s'il lui arrive une chose agréable, il remercie Allah et c'est bien pour lui ; s'il lui arrive un malheur, il fait preuve de patience et c'est bien pour lui.",
    narrateur: "Suhayb ar-Rumi (رضي الله عنه)",
    mots_cles: ['croyant','patience','gratitude','sabr','shukr','épreuve']
  },
  {
    id: 13, source: 'Tirmidhi', numero: 'Hadith 2392',
    texte: "Fais attention à la taqwa (crainte d'Allah) où que tu sois. Fais suivre la mauvaise action d'une bonne, elle l'effacera. Et traite les gens avec un bon caractère.",
    narrateur: "Abu Dharr (رضي الله عنه)",
    mots_cles: ['taqwa','crainte','allah','bonne action','caractère','repentir']
  },
  {
    id: 14, source: 'Sahih Bukhari', numero: 'Hadith 2442',
    texte: "Le musulman est le frère du musulman. Il ne lui fait pas de tort, ne l'abandonne pas et ne le méprise pas.",
    narrateur: "Abu Hurayra (رضي الله عنه)",
    mots_cles: ['fraternité','musulman','frère','tort','solidarité','oumma']
  },
  {
    id: 15, source: 'Abu Dawud & Tirmidhi', numero: 'Hadith 4946',
    texte: "La pudeur (haya) ne produit que du bien.",
    narrateur: "Imran ibn Husayn (رضي الله عنه)",
    mots_cles: ['pudeur','haya','bien','vertu']
  },
  {
    id: 16, source: 'Sahih Muslim', numero: 'Hadith 223',
    texte: "La pureté est la moitié de la foi.",
    narrateur: "Abu Malik al-Ashari (رضي الله عنه)",
    mots_cles: ['pureté','taharah','ablutions','foi','wudu']
  },
  {
    id: 17, source: 'Sahih Bukhari', numero: 'Hadith 2697',
    texte: "Celui qui introduit dans notre affaire (la religion) quelque chose qui n'en fait pas partie, cela lui sera refusé.",
    narrateur: "Aïcha (رضي الله عنها)",
    mots_cles: ['bidah','innovation','sunna','religion','refus']
  },
  {
    id: 18, source: 'Sahih Bukhari & Muslim', numero: 'Hadith 6502',
    texte: "Allah dit : Je suis auprès de Mon serviteur quand il pense à Moi. Si il se souvient de Moi en lui-même, Je me souviens de lui en Moi-même.",
    narrateur: "Abu Hurayra (رضي الله عنه) - Hadith Qudsi",
    mots_cles: ['dhikr','souvenir','allah','proximité','hadith qudsi']
  },
];

// -----------------------------------------------------------
// 4. TAFSIR (explication des versets)
// -----------------------------------------------------------
const TAFSIR = [
  {
    sourate_id: 1, verset_id: 1,
    texte: "La Basmala est le verset d'ouverture de la sourate Al-Fatiha et de chaque sourate (sauf At-Tawba). Elle signifie que toute action commencée au nom d'Allah est bénie. Les noms 'Ar-Rahman' (le Tout Miséricordieux) et 'Ar-Rahim' (le Très Miséricordieux) désignent deux attributs divins : le premier englobe toute la création, le second est spécifique aux croyants dans l'au-delà.",
    mots_cles: ['bismillah','basmala','ouverture','miséricorde']
  },
  {
    sourate_id: 2, verset_id: 255,
    texte: "L'Ayat al-Kursi (verset du Trône) est considéré comme le verset le plus grand du Coran. Il affirme l'unicité absolue d'Allah, Son éternité, Sa toute-puissance et Sa connaissance parfaite. Le Prophète (ﷺ) a dit que celui qui le récite après chaque prière sera sous la protection d'Allah jusqu'à la prière suivante.",
    mots_cles: ['ayat al kursi','trône','protection','après prière','unicité']
  },
  {
    sourate_id: 112, verset_id: 1,
    texte: "La sourate Al-Ikhlas est l'équivalent d'un tiers du Coran selon le Prophète (ﷺ), car elle traite exclusivement de la Seigneurie divine (Rububiyya) et de l'unicité d'Allah. Elle réfute catégoriquement toute forme de polythéisme, de trinité ou d'anthropomorphisme.",
    mots_cles: ['ikhlas','tiers coran','unicité','tawhid','polythéisme']
  },
  {
    sourate_id: 97, verset_id: 1,
    texte: "La Nuit du Destin (Laylat al-Qadr) se situe dans les dix dernières nuits du Ramadan, probablement dans les nuits impaires (21, 23, 25, 27 ou 29). C'est la nuit où le Coran a commencé à être révélé. Elle vaut mieux que mille mois d'adoration, soit plus de 83 ans.",
    mots_cles: ['laylat al qadr','nuit du destin','ramadan','révélation','mille mois']
  },
  {
    sourate_id: 36, verset_id: 1,
    texte: "Ya-Sin est appelée 'le cœur du Coran' par le Prophète (ﷺ). Elle aborde les thèmes de la prophétie, de la résurrection, des signes de la puissance divine dans la nature, et la récompense des croyants. Sa récitation est recommandée pour les malades et les mourants.",
    mots_cles: ['yasin','coeur coran','résurrection','prophétie','malade']
  },
];

// -----------------------------------------------------------
// 5. FONCTION DE RECHERCHE TEXTUELLE
// -----------------------------------------------------------
function recherche(texte, table, champsTexte) {
  if (!texte) return table;
  const mots = texte.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/).filter(m => m.length > 2);

  return table.filter(item => {
    const corpus = champsTexte.map(c => {
      const val = item[c];
      if (Array.isArray(val)) return val.join(' ');
      return String(val || '');
    }).join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return mots.some(mot => corpus.includes(mot));
  });
}

module.exports = { SOURATES, VERSETS, HADITHS, TAFSIR, recherche };
