
const CORRESPONDANCES = {
  "Chiffres": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  "Elements": ["Limbes", "Objet", "Végétal", "Air", "Autre", "Terre", "Moi", "Animal", "Eau", "Feu"],
  "Domaines": ["Nécrose", "Technique", "Savoir", "Social", "Arts", "Shaan", "Magie", "Rituels", "Survie", "Combat"],
  "Peuples": ["Cités", "Terres Brûlées", "Marais", "Montagnes", "Hautes Herbes", "Grands Arbres", "Glaces", "Forêts Blanches", "Rivages", "Sables"],
  "Caste": ["Ombre", "Novateur", "Erudit", "Négociant", "Artiste", "Shaaniste", "Magicien", "Elémentaliste", "Voyageur", "Combattant"],
  "Action": ["Altération", "Amélioration", "Défense", "Communication", "Contrôle", "Récupération", "Perception", "Invocation", "Déplacement", "Attaque"],
  "Pouvoir": ["Tourment", "Astuce", "Secret", "Privilège", "Création", "Symbiose", "Sort", "Transe", "Exploit", "Tactique"],
  "Acquis": ["Technologie", "Outil", "Manuscrit", "Richesse", "Relation", "Protection", "Artefact", "Armimale", "Transport", "Armement"],
  "Interaction": ["Nécrosien", "Objet", "Connaissance", "Richesse", "Réputation", "Nature", "Anthéen", "Surnaturel", "Expérience", "Action"],
  "Ville": ["Corruption", "Technologie", "Education", "Commerce", "Arts", "Nature", "Magie", "Religion", "Sciences", "Guerre"],
  "Caractère": ["destructeur", "révolutionnaire", "réfléchi", "sociable", "séducteur", "mystique", "secret", "autoritaire", "utopiste", "impulsif"],
  "Couleur": ["noir", "orange", "vert", "bleu ciel", "violet", "blanc", "argent", "jaune d'or", "bleu marine", "rouge"],
  "Corps": ["ventre", "mains", "tête", "thorax", "pieds", "coeur", "plexus", "jambes", "bras", "bas ventre"],
  "Maison": ["sanitaires", "mobilier", "plantes", "fenêtres", "salon", "sol et murs", "chambre", "animal de cie", "salle d'eau", "cuisine"],
  "Cardinal": ["nord ouest", "sud est", "nord est", "est", "centre", "ouest", "sud ouest", "zénith", "nord", "sud"],
  "Energie": ["hydrocarbures", "électrique", "végétale", "éolienne", "magnétique", "minérale", "trihnique", "animale", "hydrolique", "thermique"],
  "Lignées": ["Humain", "Kelwin", "Ygwan", "Delhion", "Mélodien", "Feling", "Nomoï", "Woon", "Boréal", "Darken"],
};

const loader = document.getElementById("loader");

let gSheetId = "1tC10OMJe0BOzZauCmqLxL7-D9KlWT13vswGDBJWySLc";

const parser = new PublicGoogleSheetsParser(
  gSheetId,
  options
);

const gSheetCache = [];

const bloc_total = document.getElementById("total");
const text_found = document.getElementById("text-found");

const card_tab = document.getElementById("card-tab");
const table_tab = document.getElementById("table-tab");

const card_elements = document.getElementById("card-elements");
const table_elements = document.getElementById("table-elements");

const itemModal = new bootstrap.Modal(document.getElementById("item-modal"));

let liste_origine = [];
var filteredData = ["VIDE"];

let cercle_tpl;
fetch("../../templates/cercle.mustache")
.then((response) => response.text())
.then((template) => {
  cercle_tpl = template;
});


// Ensure user finished typing before search

const search_input = document.getElementById("search");

let typingTimer; //timer identifier

// On keydown, clear the countdown
search_input.addEventListener("keydown", function (event) {  clearTimeout(typingTimer);
  clearTimeout(typingTimer);
});

// On keyup, start the countdown
search_input.addEventListener("keyup", function (event) {
  clearTimeout(typingTimer);
  if (event.key != "Enter") {
    typingTimer = setTimeout(doneTyping, 1500);
  } else {
    doneTyping();
  }
});

function doneTyping(){
  search_filter("liste-elements", delay=1000);
}

document.forms["filtres"].addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  loader.classList.remove("d-none");
  document.getElementById("liste-elements").classList.add("d-none");
  const form = event.target;
  const selectedDomain = Array.from(form.domain.selectedOptions).map(option => option.value.toLowerCase());
  const selectedCat = Array.from(form.categorie.selectedOptions).map(option => option.value.toLowerCase());
  const selectedSource = Array.from(form.source.selectedOptions).map(option => option.value.toLowerCase());
  const minClass = parseInt(form.nivMin.value, 10);
  const maxClass = parseInt(form.nivMax.value, 10);

  const ignoreDomain = selectedDomain.length === 0 || selectedDomain.length === form.domain.options.length;
  const ignoreCat = selectedCat.length === 0 || selectedCat.length === form.categorie.options.length;
  const ignoreSource = selectedSource.length === 0 || selectedSource.length === form.source.options.length;

  filteredData = liste_origine.filter(item => {
    const itemClass = romanNumber(item["Rang"]);
    let itemDomain = item["Domaine"]?item["Domaine"].toLowerCase():"";

    let itemCategorie = item["Catégorie"]?item["Catégorie"].toLowerCase():"";
    itemCategorie = itemCategorie.split(" ")[0];

    let itemSource = item["Source"];

    if (itemSource) {
      // Corrige les apostrophes typographiques
      itemSource = itemSource.replace("'", "’").toLowerCase();
      // Ne prend que la source sans la page
      itemSource = itemSource.split(",")[0];
      // Prend le dernier élément
      //itemSource = itemSource[itemSource.length - 1];
    }

    return (
      (ignoreDomain || selectedDomain.includes(itemDomain)) &&
      (!isNaN(itemClass) && itemClass >= minClass && itemClass <= maxClass) &&
      (ignoreCat || selectedCat.includes(itemCategorie)) &&
      (ignoreSource || selectedSource.includes(itemSource))
    );
  });
  bloc_total.textContent = filteredData.length;
  text_found.textContent = form.dataset["itemtype"] + "(s)";
  if (!ignoreDomain) {
    text_found.textContent += " de " + selectedDomain;
  }
  if (!ignoreCat) {
    text_found.textContent += " de type " + selectedCat;
  }

  text_found.textContent += " de classe " + minClass;
  if (maxClass != minClass) {
    text_found.textContent += " à " + maxClass;
  }

  text_found.textContent += " trouvé(s)";
  if (!ignoreSource) {
    text_found.textContent += " dans " + selectedSource;
  }
  text_found.textContent += ".";

  reset_sort_status();
  display_items(filteredData);
  table_switch(null, null);
});

// Chargement et affichage des données
parser.parse().then(data => {
  liste_origine = correct_initial_data(
    options["sheetName"],
    data
  );
  display_items(data);
  bloc_total.textContent = data.length;
});

/**
 * Affiche un item d'un objet indiqué dans une modale
 * @param {*} item
 * @param {*} event
 * @param {*} item_type
 */
function modal_getitem(item, event, item_type="pouvoir", sheet="Pouvoirs") {
  event.preventDefault();

  const name = item.dataset["name"]?item.dataset["name"]:item.textContent;
  let selectedData = [];

  if (!gSheetCache[sheet]) {
    const tempParser = new PublicGoogleSheetsParser(
      gSheetId,
      { sheetName: sheet, useFormat: false }
    );

    tempParser.parse().then(data => {
      gSheetCache[sheet] = correct_initial_data(sheet, data);
      selectedData = gSheetCache[sheet].filter((o) => o.Nom === name);
      selectedData[0].width = "col-sm-12";
      modal_show(selectedData, item_type);
    });
  } else {
    selectedData = gSheetCache[sheet].filter((o) => o.Nom === name);
    selectedData[0].width = "col-sm-12";
    modal_show(selectedData, item_type);
  }
}

/**
 * Affiche un item de l'objet courant dans une modale
 * @param {*} item
 * @param {*} event
 * @param {*} item_type
 */
function modal_item(item, event, item_type="acquis") {
  event.preventDefault();
  const selectedDatas = liste_origine.filter((o) => o.Nom === item.dataset["name"]);
  if (selectedDatas.length === 0) {
    alert("Impossible de trouver " + item.dataset["name"]);
  } else {
    modal_show(selectedDatas, item_type);
  }
}

/**
 *
 * @param {*} selectedDatas
 * @param {*} item_type
 */
function modal_show(selectedDatas, item_type) {
  selectedDatas[0].width = "col-sm-12";
  display_items(selectedDatas, "items-list", item_type);
  itemModal.show();
}

/**
 * Génere un PNJ basé sur le métier indiqué
 * @param {*} event
 * @param {*} data
 */
async function createPNJfromJob(target, event, data) {
  event.preventDefault();
  const jobData = liste_origine.filter((o) => o.Nom === data["Métier"]);
  data["Spécialisations"] = jobData[0]["Spécialisations"];
  let lignee = randomLignee();
  data["Lignée"] = lignee.name;
  let dom_lignee = CORRESPONDANCES["Domaines"][lignee.id];
  data["Nom"] = await random_PNJ_name(data["Lignée"]);
  data["Domaines"] = {};
  let lvl_min = 4;
  let dom_list = target.dataset["dom_list"];
  let lvl_max = target.dataset["lvl"];
  // console.log(dom_list);
  CORRESPONDANCES["Domaines"].forEach(domaine => {
    if (dom_list.includes(domaine.toLowerCase())) {
      data["Domaines"][domaine] = lvl_max;
    } else {
      if (domaine == dom_lignee) {
        data["Domaines"][domaine] = 5;
      } else {
        data["Domaines"][domaine] = lvl_min;
      }
    }
  });
  calc_trihns(data["Domaines"]);
  modal_show([data], "pnj");
}

/** Remplit les 3 valeurs de Trihns à partir des valeurs de domaines. */
function calc_trihns(domains) {
  let values = [
    domains["Technique"],
    domains["Savoir"],
    domains["Social"]
  ]
  domains["Esprit"] = Math.min(...values) + Math.max(...values);
  values = [
    domains["Arts"],
    domains["Shaan"],
    domains["Magie"]
  ]
  domains["Ame"] = Math.min(...values) + Math.max(...values);
  values = [
    domains["Rituels"],
    domains["Survie"],
    domains["Combat"]
  ]
  domains["Corps"] = Math.min(...values) + Math.max(...values);
}


/**
 * Takes a domain as input and returns a corresponding power type string based on predefined cases,
 * defaulting to "Pouvoir" if no match is found.
 * @param {*} domaine le domaine associé
 * @returns le type de pouvoir associé au domaine
 */
function getPouvoirType(domaine) {
  let ret = "";
  switch (domaine.toLowerCase()) {
    case "technique":
      ret = "Astuce";
      break;
    case "savoir":
      ret = "Secret";
      break;
    case "social":
      ret = "Privilège";
      break;
    case "arts":
      ret = "Création";
      break;
    case "shaan":
      ret = "Symbiose";
      break;
    case "magie":
      ret = "Sort";
      break;
    case "rituels":
      ret = "Transe";
      break;
    case "survie":
      ret = "Exploit";
      break;
    case "combat":
      ret = "Tactique";
      break;
    case "nécrose":
      ret = "Tourment";
      break;
    default:
      ret = "Pouvoir";
  }
  return ret;
}

/**
 * Return the color associated to specified domain.
 * @param {*} domaine
 * @returns color
 */
function getDomainColor(domaine) {
  let ret = "";
  switch (domaine.toLowerCase()) {
    case "technique":
    case "savoir":
    case "social":
      ret = "jaune";
      break;
    case "arts":
    case "shaan":
    case "magie":
      ret = "bleu";
      break;
    case "rituels":
    case "survie":
    case "combat":
      ret = "rouge";
      break;
    case "necrose":
      ret = "gris";
      break;
    default:
      ret = "green";
  }
  return ret;
}

/* Fournit un nom de lignée aléatoire */
function randomLignee(bonus = false) {
  lignees = CORRESPONDANCES["Lignées"];
  if (bonus) {
    lignees += ["Morphes", "Nécrosien", "Indar"]
  }
  let randid = Math.floor(Math.random() * lignees.length);
  return {
    "name": lignees[randid],
    "id": randid
  }
}

/* Fournit un nom de personnage aléatoire lié à sa lignée */
async function random_PNJ_name(lignee, gender = "both") {
  // Charge le tableau des lignées
  const tempParser = new PublicGoogleSheetsParser(
    gSheetId,
    { sheetName: "Lignées", useFormat: false }
  );
  let temp_liste = [];
  await tempParser.parse().then(data => {
    temp_liste = data;
  });
  // Prend la lignée indiquée
  temp_liste = temp_liste.filter((o) => o.Lignée === lignee);
  let name = "NONAME";
  if (temp_liste[0]) {
    let names = temp_liste[0]["Exemples de noms"].split(",");
    // Pioche un nom au hasard
    name = names[Math.floor(Math.random() * names.length)];
  }
  // élimine une éventuelle précision de genre avant le nom
  name = name.split(":");
  return name[name.length - 1];
}

/**
 * Apply calc on first data load, depending on data type.
 * @param {*} type Data type
 * @param {*} data inititial data
 * @returns Modified data
 */
function correct_initial_data(type, data) {
  switch(type) {
    case "Destinée":
      data.forEach(row => {
        row["dom_list"] = row["Domaines"].replace("\
", "").replace("\r", "").replace("\n", "").toLowerCase();
        row["dom_list"] = row["dom_list"].replace(" ", "").split("+");
        // Une destinee epique implique au moins 2 domaines à 10.
        row["lvl"] = 10;
      });
      break;
    case "Lignées":
      data.forEach(row => {
          if (row["Domaine"]) {
            row["dom_type"] = removeAccents(row["Domaine"].toLowerCase().split("\n")[0]);
            row["dom_color"] = getDomainColor(row["dom_type"]);
          }
        });
      break;
    case "Pouvoirs":
      data.forEach(row => {
        row["pow_type"] = getPouvoirType(row.Domaine);
        row["dom_type"] = removeAccents(row.Domaine.toLowerCase());
        row["dom_color"] = getDomainColor(row["dom_type"]);
      });
      break;
    case "Acquis":
      data.forEach(row => {
        row.Nom = row.Nom.trim();

        if (row["Image"]) {
          row["Image"] = row["Image"].split("\n");
        }


        if (
            row["Catégorie"] && (
              row["Catégorie"] == "Protection" ||
              row["Catégorie"].startsWith("Transport")
            )
          ) {
            row["Attributs"] = row["Spécialisation"];
            row["Spécialisation"] = "";
        }

        if (row["Rang"] && row["Rang"] === 0) {
          row["Rang"] = "";
        }
      });
      break;
    case "Animaux":
    case "Peuples":
    case "Villes":
    case "Notables":
      // For group of people and for Cities
      data.forEach(row => {

        if (row["Domaine"]) {
          row["dom_type"] = removeAccents(row.Domaine.toLowerCase());
          row["dom_color"] = getDomainColor(row["dom_type"]);
        }

        // Cercle des domaines
        row["Domaines"] = getCircleValues(row);

        if (row["Population"]) {
          row["Population"] = row["Population"].toLocaleString('fr');
        }
      });
      break;
  }
  return data;
}

/**
 * Compute values for all circle domains, for specified item.
 *
 * @param {*} item
 * @returns
 */
function getCircleValues(item) {
  let c_values = {};
  CORRESPONDANCES["Domaines"].forEach(domaine => {
    if (item[domaine]) {
      c_values[domaine] = item[domaine];
    } else {
      c_values[domaine] = 0;
    }
  });
  calc_trihns(c_values);
  // Cas des nécrosiens
  if (item["Anti-âme"]) {
    c_values["Ame"] = item["Anti-âme"];
  } else if (c_values["Nécrose"] > 10) {
    c_values["Ame"] = -c_values["Ame"]-(c_values["Nécrose"] - 10);
  }
  if (c_values["Corps"] + c_values["Ame"] + c_values["Esprit"] === 0) {
    c_values = null;
  } else {
      if (c_values["Esprit"] == 0) {
        c_values["Esprit"] = "";
      }
      if (c_values["Ame"] == 0) {
        c_values["Ame"] = "";
      }
      if (c_values["Corps"] == 0) {
        c_values["Corps"] = "";
      }
  }
  // Nécrose et Shaan : voir page 232 du manuel d'itinérance
  /*
  A partir de 5 en NÉCROSE, chaqueaugmentation du niveau de
  NÉCROSE fait perdre 1 point de SHAAN (minimum 1).
  A partir de 5 en SHAAN, chaque augmentation du niveau de SHAAN
  fait perdre 1 point de NÉCROSE (minimum 1).

  Un personnage devient nécrosien si son niveau de NÉCROSE devient
  strictement supérieur à 10.
  Chaque augmentation du niveau de NÉCROSE au-delà de 10 fait progresser
  son Anti-Âme de 1 point
  */
  return c_values;
}
