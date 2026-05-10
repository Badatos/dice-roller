/**
 * Magie des Schèmes - Schaan Renaissance
 */

// Liste des Schemes élémentaires
const schemes_elementaires = {
  "Moi": { "desc": "Désigne le magicien qui lance le sort" },
  "Lui": { "desc": "Ne prend en compte que les espèces dites intelligentes (anthéens et créatures élémentaires)" },
  "Eau": { "desc": "Correspond a tous les types de liquides" },
  "Terre": { "desc": "Regroupe tout ce qui est terre meuble, sable, pierre, argile ou métal" },
  "Animal": { "desc": "Inclut insectes, oiseaux, reptiles, poissons, mammifères, mollusques, amibes..." },
  "Végétal": { "desc": "Prend en compte les plantes, graines, arbres, fleurs, fruits, légumes" },
  "Air": { "desc": "Représente tous les gaz ou assimilés" },
  "Feu": { "desc": "Rassemble les brasiers, la lave, les flammes et les éclairs" },
  "Objet": { "desc": "Tout ce qui est manufacturé tel que les armes, meubles, outils, ordinateurs et véhicules" },
  "Limbes": { "desc": "Englobe les anti-Âmes et les nécrosiens" }
};

// Liste des Schemes d’action
const actions = {
  "": { "cles": [""] },
  "contrôle": {
    "cles": ["de"],
    "img": "https://raw.githubusercontent.com/vdhilly/shaanrenaissance/refs/heads/main/icons/schemes/scheme-controle.png",
    "effet": {
      "de": `Le Magicien contrôle un autre Élément Cible.
Il oblige la cible à obéir à un ordre composé de **Score mots**.
L’ordre doit être formulé à l’impératif.

Le Trihn ciblé détermine le type d’Action que pourra
faire la cible contrôlée : si le Magicien contrôle le
**Corps**, son ordre devra impliquer des Actions de
**RITUELS, SURVIE et COMBAT**, un **Esprit** contrôlé
fera des Actions de **TECHNIQUE, SAVOIR et SOCIAL**,
et une **Âme** contrôlée touchera les Domaines
d’**ARTS, SHAAN, MAGIE** et **NÉCROSE**.

Quelques ordres simples qui facilitent la vie :

- *Fuis-moi* (Corps).
- *Oublie-nous* (Esprit).
- *N’attaque pas* (Esprit).
- *Parle-nous* (Esprit).
- *Aie peur de nous* (Âme).
- *Dors* (Âme).
- *Calme-toi* (Âme).
- Etc.

Restriction : L’ordre doit correspondre aux aptitudes
  de L’Élément : un oiseau peut voler, picorer, pondre,
  dormir, fuir ; mais il ne pourra pas parler ou nager,
  à moins qu’il soit spécialement dressé pour la
  circonstance. L’ordre ne doit pas non plus être en
  contradiction directe avec la morale de sa victime:
  un marchand ne donnera jamais sa caisse et un
  shaaniste ne pourra jamais tuer un innocent.

> On remarque très facilement quelqu’un
de « contrôlé » à son visage pâle,
son corps froid, son regard vide et sa démarche d’automate.
Une cible contrôlée ne puisera jamais dans ses Trihns pour
réussir une Action, sauf si sa vie en dépend.
`}
  },
  "déplacement": {
    "cles": ["comme", "sur", "dans"],
    "effet": {
      "tous": `**Si la Cible est le sujet (avant l’Action)**,
elle peut ainsi voyager à **Score km/h** sous toutes les formes
et dans tous les Éléments, à condition d’en préciser
la nature. Pour se déplacer, on indique les propriétés
de l’Élément que l’on utilise pour se déplacer ou
l’Élément du milieu dans lequel on se déplace.

> Exemple : *Moi Déplacement dans Air* permet de
voler, *sur Eau* permet de marcher sur l’eau, etc.

**Si la Cible est le médian (après l’Action)**, le
Déplacement peut faire office d’attaque.
Ces Sorts n’affectent jamais réellement la victime.
C’est cette dernière qui s’inflige les dommages par suggestion
du Magicien, jusqu’à la crise cardiaque ou la rupture d’anévrisme.
Une attaque provoque des blessures si le **Score** est
supérieur à la Défense de la cible.
Selon le Schème de **Durée** utilisé, les pertes de Trihns
liées à l’attaque seront étalées dans le temps.

> Exemple : *Terre Déplacement Dans Lui (Corps,
Âme ou Esprit)* permet de faire croire à la cible
qu’elle se fait écraser par un rocher.

Il est aussi possible de créer un Sort qui permet de
faire voler des engins magiques, avec l’algorithme :

> *Moi et Lui Déplacement dans Objet sur Air*

Il faut obligatoirement définir les cibles du
Déplacement, car dès l’instant que quelqu’un est
concerné, il peut être amené à bloquer tous les
autres s’il résiste au Sort, dans le cas d’un tapis
volant par exemple.
`}
  },
  "non-perception": {
    "cles": ["de"],
    "effet": {
      "de": `
La Non-perception est utilisée pour les protections
et les intrusions. Dès l’instant où l’on ignore un
Élément, on en est protégé. C’est ainsi que la peau
ne sera pas brûlée si le Corps ne perçoit pas le Feu.
Il en va ainsi pour chaque Trihn. En règle générale,
c’est le Corps qui est sollicité pour se protéger de
l’asphyxie, des chocs, de la faim et de toutes les
fonctions internes du Corps.
Mais l’Esprit et l’Âme peuvent également être protégés
des attaques mentales et nécrotiques.
La Protection peut prendre
la forme d’une armure de **Score/3 à ajouter à la
Défense du Trihn ainsi protégé**.

Exemples:
- *Moi (Esprit) Non-perception de Lui* confère un
Bonus de +Score/3 en Défense d’Esprit si Lui tente
une attaque d’Esprit sur Moi.
- *Animal (Corps) Non-perception de Feu* donne
un Bonus en Défense de Corps à un ou plusieurs
animaux contre les dégâts de Jeu (incendie, lave).
On peut aussi se protéger contre le vent (Air) ou
les armes (Objet).

Pour se rendre invisible, *Lui (Corps) Non-perception de Moi*
fera que *Lui* aura un Malus de Score/3
pour me percevoir physiquement (Tests de SURVIE + Vigilance).
Cibler son Âme lui infligera un
Malus pour me percevoir magiquement (SHAAN + Intuition ou MAGIE + Voile)
et cibler l’Esprit donnera un Malus pour me percevoir mentalement
(SOCIAL+ Psychologie).
`}
  },
  "mutation": {
    "cles": ["en"],
    "effet": {
      "en": `
La Mutation permet de modifier les capacités de la cible.
Elle conserve sa forme et ses aptitudes
pour les autres protagonistes, mais est elle-même
tellement convaincue de sa transformation que
ses capacités sont modifiées en fonction de la
symbolique de l’Élément médian et de la volonté
du Magicien. La cible peut bénéficier d’un **Bonus
de Score/3** ou subir un **Malus de Score/3** pour
certaines actions.

> Exemple : *Lui Mutation en Végétal* pour paralyser la cible et lui donner un malus pour bouger.
`,
      "median": {
        "Objet": "Bonus en construction ou en combat",
        "Végétal": "Bonus en savoir ou Malus en survie",
        "Air": "Bonus en discrétion ou en initiative",
        "Lui": "Bonus en psychologie ou en déguisement",
        "Terre": "Bonus en discrétion ou Malus en combat",
        "Moi": "Bonus en survie ou déguisement",
        "Animal": "Bonus au combat ou intimidation",
        "Eau": "Bonus en survie ou Malus en combat",
        "Feu": "Bonus en initiative ou en combat",
        "Limbes": "Malus en social ou en shaan",
      }
    }
  },
  "perception": {
    "cles": ["comme", "de", "en"],
    "effet": {
      "comme": `Permet de percevoir à la manière de la cible.`,
      "de": `
Permet d’activer les sens de la cible pour
détecter un Élément particulier.

> Exemple : *Moi Perception de Animal* pour trouver
une proie à la chasse.

Il est également possible de créer des illusions en
faisant croire à l’existence d’un rocher (Terre), d’une
arme (Objet), d’une forêt (Végétal), etc.

> Exemple : *Lui Perception de Végétal et Animal*
pour le plonger dans une jungle imaginaire.

Ces illusions sont bien réelles pour les cibles et
peuvent même avoir un caractère utilitaire en
transformant un Élément en un autre grâce aux clés
**de** et **en**. Tel est le pouvoir de la suggestion.

Exemple : *Moi et Lui et Animal Perception de Air
en Végétal* pour faire passer sa roulotte sur un
pont imaginaire au dessus d’une crevasse.`,
      "en": `Pour provoquer une gêne, on peut utiliser la clé **en**.
(Exemple : *Lui Perception en Feu* (ébloui). )`
    }

  },
}

// Liste des Schemes adjectifs
const schemes_adjectifs = {
  "Fréquence": [
    "1 fois par Jour",
    "1 fois par Situation",
    "1 fois tous les 2 Tours",
    "1 fois par Tour"
  ],
  "Portée": [
    "Contact",
    "Interaction",
    "Distance",
    "Horizon"
  ],
  "Cible": [
    "1 cible",
    "2 cibles",
    "MAGIE/2 cibles",
    "MAGIE cibles"
  ],
  "Durée": [
    "1 Tour",
    "MAGIE/3 Tours",
    "1 Heure",
    "1 Jour"
  ]
}

// Traductions Nomoï des Schèmes
const traductions = {
  "Objet": "Gurh",
  "Végétal": "Goth",
  "Air": "Gulh",
  "Lui": "Gath",
  "Terre": "Golh",
  "Moi": "Galh",
  "Animal": "Gorh",
  "Eau": "Garh",
  "Feu": "Guth",
  "Limbes": "Garg",
  "contrôle": "vankh",
  "déplacement": "vukh",
  "non-perception": "vakh",
  "perception": "vokh",
  "mutation": "vekh",
  "dans": "mous",
  "sur": "mes",
  "comme": "mas",
  "de": "mus",
  "en": "mos",
  "et": "mons",
  "1 cible": "nomh",
  "2 cibles": "namh",
  "MAGIE/2 cibles": "noumh",
  "MAGIE cibles": "niamh",
  "1 fois par Jour": "lokh",
  "1 fois par Situation": "lakh",
  "1 fois tous les 2 Tours": "loukh",
  "1 fois par Tour": "liakh",
  "Contact": "zonh",
  "Interaction": "zanh",
  "Distance": "zoumh",
  "Horizon": "zianh",
  "1 Tour": "dorh",
  "MAGIE/3 Tours": "darh",
  "1 Heure": "dourh",
  "1 Jour": "diarh"
}

const list_shemes = document.getElementById("list-shemes");
const input_lien = document.getElementById("lien");

document.addEventListener("DOMContentLoaded", function () {
  // On commence par remplir les selcteurs avec les schemes nécessaires
  fill_select(document.getElementById("sujet"), schemes_elementaires);
  fill_select(document.getElementById("median"), schemes_elementaires);

  const scheme_generator = document.getElementById("scheme-generator");
  scheme_generator.addEventListener("change", formToData);

  document.getElementById("preselect").addEventListener("change", change_preselect);
});

// Réinisialise les valeurs de tous les champs personalisés
function reset_fields(data) {
  input_lien.value = "";
  let fields = ["sujet", "verbe", "median", "frequence", "portee", "cible", "duree", "trihn"];
  fields.forEach((field) => {
    if (data !== undefined && data[field] !== undefined) {
      document.getElementById(field).value = data[field];
    } else {
      document.getElementById(field).value = "";
    }
  });
}

// Place tous les élements du formulaire dans un dictionaire pour en faire un rendu
function formToData() {
  let formData = new FormData(this);
  let data = {};
  data["verbe"] = formData.get("verbe");
  data["sujet"] = formData.get("sujet");
  data["median"] = formData.get("median");
  data["frequence"] = Number(formData.get("frequence"));
  data["portée"] = Number(formData.get("portee"));
  data["cibles"] = Number(formData.get("cible"));
  data["duree"] = Number(formData.get("duree"));
  data["trihn"] = formData.get("trihn");

  refreshPhrase(data);
}

// Met à jour la phrase contruite à partir des schèmes selectionnés.
function refreshPhrase(data) {

  let used_schemes_id = new Set();
  let used_schemes_title = new Set();
  list_shemes.innerText = "";

  data["Traduction"] = [];
  data["Nom"] = [];
  // Todo : En cas de contrôle, le sujet ne peut être que "Moi"
  // Et la cible ne peut être que Lui, Animal, Végétal, ou Limbes
  // En cas de (Non-)perception et mutation, le sujet est la cible.

  if (data["sujet"] !== undefined && data["sujet"] !== "") {
    used_schemes_id.add(`scheme-${removeAccents(data["sujet"]).toLowerCase()}`);
    used_schemes_title.add(data["sujet"]);
    data["Nom"].push(data["sujet"]);
    data["Traduction"].push(traductions[data["sujet"]]);
  }

  if (data["cible"] === "Sujet" && data["trihn"] !== "") {
    data["Nom"].push(`(${data["trihn"]})`);
  }

  if (data["verbe"] !== undefined && data["verbe"] !== "") {
    used_schemes_id.add(`scheme-${removeAccents(data["verbe"]).toLowerCase()}`);
    used_schemes_title.add(data["verbe"]);
    data["Nom"].push(data["verbe"]);
    data["Traduction"].push(traductions[data["verbe"]]);
    refresh_select(input_lien, actions[data["verbe"]]["cles"], data["lien"].toLowerCase());
  }

  if (input_lien.value != "") {
    used_schemes_id.add(`scheme-${removeAccents(input_lien.value).toLowerCase()}`);
    used_schemes_title.add(input_lien.value);
    data["Nom"].push(input_lien.value);
    data["Traduction"].push(traductions[input_lien.value]);
  }

  data["Activation"] = "1 Action";
  data["Score"] = "MAGIE + Puissance du Trihn consumé - Malus d’évocation s’il y a lieu.";

  if (data["median"] !== undefined && data["median"] !== "") {
    used_schemes_id.add(`scheme-${removeAccents(data["median"]).toLowerCase()}`);
    used_schemes_title.add(data["median"]);
    data["Nom"].push(data["median"]);
    data["Traduction"].push(traductions[data["median"]]);
  }

  // Propriétés
  data["dom_color"] = "red";
  data["dom_type"] = "type";
  data["Source"] = "L’arbre qui cache la forêt (page 44)";
  data["Domaine"] = "Sortilège";
  data["Rang"] = "";
  data["Résumé"] = "Sortilège personnalisé.";
  data["Type"] = "Magie des schèmes";

  // Adjectifs
  let nb_majeurs = 0;
  if (data["frequence"] > 1) {
    nb_majeurs++;
  }
  used_schemes_id.add(`frequence${data["frequence"] + 1}`);
  used_schemes_title.add(data["frequence"]);
  data["frequence"] = schemes_adjectifs["Fréquence"][data["frequence"]];

  if (data["portée"] !== "") {
    if (data["portée"] > 1) {
      nb_majeurs++;
    }
    data["portée"] = schemes_adjectifs["Portée"][data["portée"]];
    used_schemes_id.add(`${removeAccents(data["portée"]).toLowerCase()}`);
    used_schemes_title.add(data["portée"]);
  }

  if (data["cibles"] > 1) {
    nb_majeurs++;
  }
  data["Nombre de cibles"] = schemes_adjectifs["Cible"][data["cibles"]];
  used_schemes_id.add(`cibles${data["cibles"] + 1}`);
  used_schemes_title.add(data["Nombre de cibles"]);

  if (data["duree"] > 1) {
    nb_majeurs++;
  }
  used_schemes_id.add(`duree${data["duree"] + 1}`);
  used_schemes_title.add(data["duree"]);
  data["duree"] = schemes_adjectifs["Durée"][data["duree"]];

  if (data["verbe"] !== undefined && data["verbe"] !== "") {
    let sub_effect = input_lien.value;
    if (data["verbe"] == "déplacement") {
      sub_effect = "tous";
    }
    if (data["effet"] == "") {
      data["Effet"] = actions[data["verbe"]]["effet"][sub_effect];
      if (actions[data["verbe"]]["effet"]["median"] && data["median"]) {
        data["Effet"] += `\nIndication d’effets en fonction de l’élément **${data["median"]}** :\n`;
        data["Effet"] += `\n**${actions[data["verbe"]]["effet"]["median"][data["median"]]}**\n`;
      }
    } else {
      data["Effet"] = data["effet"];
    }
  }

  let total_cost = 1;
  if (nb_majeurs > 3) {
    total_cost += 6;
  } else if (nb_majeurs == 3) {
    total_cost += 4;
  } else if (nb_majeurs == 2) {
    total_cost += 2;
  }

  let trihn_cible = "";
  if (data["trihn"] === "") {
    trihn_cible = "";
  } else {
    if (data["cible"] !== "Sujet" && data["trihn"] !== "") {
      data["Nom"].push(`(${data["trihn"]})`);
    }
    if (data["trihn"] === "Corps") {
      trihn_cible = `de Corps}`;
    } else {
      trihn_cible = `d’${data["trihn"]}`;
    }
  }

  data["Coût"] = `<strong>${total_cost}</strong> point(s) de Trihn d’âme,
        ainsi que 1 Trihn <strong>${trihn_cible}</strong> préalablement invoqué.`;

  if (data["Nom"].length > 2) {
    data["Nom"] = data["Nom"].join(" ");
    data["Traduction"] = data["Traduction"].join(" ");

    fill_card(data);

    used_schemes_title = [...used_schemes_title];
    let index = 0;
    used_schemes_id.forEach((schemeid) => {
      let sheme_item = document.createElement("span");
      sheme_item.className = "";
      let sheme_img = document.createElement("img");
      sheme_img.alt = used_schemes_title[index];
      sheme_img.className = "sheme-img";
      sheme_img.src = `https://raw.githubusercontent.com/vdhilly/shaanrenaissance/refs/heads/main/icons/schemes/${schemeid}.png`;
      sheme_item.appendChild(sheme_img);
      list_shemes.appendChild(sheme_item);
      index++;
    });
  }
}

// Transforme la préselection en données à afficher.
function change_preselect() {
  data = domStringMapToDict(this.selectedOptions[0].dataset);
  if (data["portée"] === undefined) {
    data["portée"] = 1;
  }
  data["sujet"] = data["sujets"];
  data["verbe"] = data["action"].toLowerCase();
  reset_fields(data);
  refreshPhrase(data);
}

// Remplit la carte de sort à partir des éléments fournis
function fill_card(data) {
  fetch("../../templates/pouvoir.mustache")
    .then((response) => response.text())
    .then((template) => {
      const carte_pouvoir = document.getElementById("carte-pouvoir");
      const temp = document.createElement("template");
      temp.innerHTML = Mustache.render(template, data).trim();
      const new_card = temp.content.firstChild;
      new_card.id = "carte-pouvoir";

      // Change this to div.childNodes to support multiple top-level nodes.
      carte_pouvoir.replaceWith(new_card);
      const p_desc = document.getElementById("p-desc");
      p_desc.innerHTML =
        marked.parse(p_desc.innerHTML);
    });
}

// Remplit les sortilèges prédéfinis à partir des donnée de la gSheet
// const precode = document.getElementById("code");
function display_items(sheet_data, target = "preselect", modele = "pouvoir_option") {
  const liste_elements = document.getElementById(target);
  sheet_data = groupBy(sheet_data, "Type");
  fetch("../../templates/" + modele + ".mustache")
    .then((response) => response.text())
    .then((template) => {
      // precode.textContent += JSON.stringify(sheet_data, null, 2) + "\n";
      let renderedHTML = `<option selected value="">Choisis un Sortilège</option>`;
      for (const [type, items] of Object.entries(sheet_data)) {
        renderedHTML += `<optgroup label="${type}s">`;
        items.forEach(row => {
          renderedHTML += Mustache.render(template, row);
          // loader.classList.add("d-none");
        });
        renderedHTML += `</optgroup>`;
      }
      liste_elements.innerHTML = renderedHTML;
    });
}


