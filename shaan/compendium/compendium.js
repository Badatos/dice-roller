
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

document.getElementById("search").addEventListener("keyup", function (event) {
  loader.classList.remove("d-none");
  document.getElementById("liste-elements").classList.add("d-none");
  search_filter();
});

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
  liste_origine = data;
  display_items(data);
  bloc_total.textContent = data.length;
});

/**
 * Affiche un item d'un objet indiqué dans une modale
 * @param {*} item
 * @param {*} event
 * @param {*} item_type
 */
function modal_getitem(item, event, item_type = "pouvoir", sheet = "Pouvoirs") {
  event.preventDefault();

  const tempParser = new PublicGoogleSheetsParser(
    gSheetId,
    { sheetName: sheet, useFormat: false }
  );
  let temp_liste = [];
  tempParser.parse().then(data => {
    temp_liste = data;
  });
  const selectedData = temp_liste.filter((o) => o.Nom === item.dataset["name"]);
  selectedData[0].width = "col-sm-12";
  modal_show(selectedData, item_type);
}

/**
 * Affiche un item de l'objet courant dans une modale
 * @param {*} item
 * @param {*} event
 * @param {*} item_type
 */
function modal_item(item, event, item_type = "acquis") {
  event.preventDefault();
  const selectedDatas = liste_origine.filter((o) => o.Nom === item.dataset["name"]);
  modal_show(selectedDatas, item_type);
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
  console.log(dom_list);
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
  if(temp_liste[0]){
    let names = temp_liste[0]["Exemples de noms"].split(",");
    // Pioche un nom au hasard
    name = names[Math.floor(Math.random() * names.length)];
  }
  // élimine une éventuelle précision de genre avant le nom
  name = name.split(":");
  return name[name.length - 1];
}
