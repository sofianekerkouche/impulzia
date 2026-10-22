# Impulzia — V24

Version de travail issue de V22, avec une section Réalisations étendue. L’archive V22 originale n’a pas été modifiée.

## Pages ajoutées
- `realisations/index.html` — portfolio
- `realisations/ecole-maternelle-lila.html` — étude de cas création de site vitrine
- `realisations/le-rubiks-cube.html` — étude de cas refonte et rebranding

Les captures issues du ZIP fourni ont été optimisées en WebP et rangées dans `assets/realisations/`. Les textes ne revendiquent aucun résultat chiffré. Les éléments du rebranding qui n’étaient pas explicitement confirmés ne sont pas détaillés.

## Prévisualisation
Ouvrir `index.html` dans un navigateur. Pour des URLs locales fiables, lancer un serveur statique depuis ce dossier.


## Header et footer communs

Le header et le footer de la page d’accueil sont les références officielles du site. Ils sont conservés comme sources uniques dans `components/header.html` et `components/footer.html`. Pour les modifier, édite uniquement ces deux fichiers puis exécute `python sync-layout.py` depuis le dossier `impulzia` : le script synchronise toutes les pages HTML et adapte les liens internes à leur emplacement. Pour toute nouvelle page HTML, lance ce script après sa création afin qu’elle récupère exactement le même header et footer.


## Pages légales (version de travail)
- `mentions-legales.html`
- `politique-confidentialite.html`

Les deux pages sont liées depuis le pied de page. Certaines informations juridiques et pratiques de traitement restent à confirmer avant publication définitive, notamment l'identité juridique du responsable, les formalités applicables, la conservation des données et les éventuels transferts internationaux via les prestataires.
