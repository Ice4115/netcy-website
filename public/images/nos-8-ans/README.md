# Photos de /nos-8-ans

Un dossier par année. Les fichiers déjà en place viennent du dossier `photo/`
d'origine (renommés, rien d'autre n'a été modifié).

```
public/images/nos-8-ans/
├── annee-1/  photo-1.jpg   (1908 × 4032, portrait)
│             photo-2.jpg   (640 × 853, portrait)
├── annee-2/  photo-1.jpg   (1776 × 1777, carré)
├── annee-3/  photo-1.jpg   (1080 × 1440, portrait)
├── annee-4/  photo-1.jpg   (4032 × 1960, panoramique)
├── annee-5/  photo-1.jpg   (3648 × 2736, paysage)
├── annee-6/  photo-1.jpg   (900 × 1600, portrait)
├── annee-7/  photo-1.jpg   (720 × 960, portrait)
└── annee-8/  photo-1.jpg   (719 × 1152, portrait)
```

## Ajouter ou remplacer une photo

1. Dépose le fichier dans le dossier de l'année (`annee-3/photo-2.jpg` par exemple).
   Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
2. Déclare-le dans **`src/data/nos-8-ans.ts`**, dans le tableau `photos` de
   l'année concernée :

   ```ts
   {
     src: '/images/nos-8-ans/annee-3/photo-2.jpg',
     alt: 'Décris la scène en une ligne',   // lu par les lecteurs d'écran
     caption: 'Légende facultative',        // affichée sous la photo
     ratio: 'tall',                         // doit correspondre au fichier
     tilt: -2,                              // inclinaison décorative, en degrés
   }
   ```

3. `ratio` doit correspondre au format réel du fichier, sinon la photo sera
   recadrée :

   | valeur      | format      | exemple         |
   | ----------- | ----------- | --------------- |
   | `portrait`  | 9 / 16      | photo de téléphone verticale |
   | `tall`      | 3 / 4       | portrait classique |
   | `square`    | 1 / 1       | carré |
   | `landscape` | 4 / 3       | paysage classique |
   | `pano`      | 2 / 1       | panoramique |

   Si le sujet n'est pas au centre, ajoute `focus: '50% 30%'` (horizontal, vertical).

## Emplacement réservé

Laisse `src: ''` pour afficher un emplacement réservé élégant (rose blanche +
« Photo à venir ») au lieu d'une image : aucune photo d'illustration n'est
inventée à la place des tiennes.

## Poids des fichiers

Les originaux sont conservés tels quels ; Next.js génère à la demande des
variantes AVIF/WebP redimensionnées, donc le visiteur ne télécharge jamais le
fichier de 3 Mo. Si tu veux alléger le dépôt, tu peux réduire les originaux à
~2000 px de côté avant de les déposer : la page n'a pas besoin de plus.
