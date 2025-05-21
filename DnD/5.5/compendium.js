

const loader = document.getElementById("loader");

let gSheetId = "1l47CJCPfAmXXZi5fb_28_cKH4orMFMtQ1p10QDs3_04";

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
  const selectedSchool = Array.from(form.domain.selectedOptions).map(option => option.value.toLowerCase());
  const selectedSource = Array.from(form.source.selectedOptions).map(option => option.value.toLowerCase());
  const minLvl = parseInt(form.nivMin.value, 10);
  const maxLvl = parseInt(form.nivMax.value, 10);

  const ignoreSchool = selectedSchool.length === 0 || selectedSchool.length === form.domain.options.length;
  const ignoreSource = selectedSource.length === 0 || selectedSource.length === form.source.options.length;

  filteredData = liste_origine.filter(item => {
    const itemLvl = item["Niveau"];
    let itemSchool = item["School"]?item["School"].toLowerCase():"";

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
      (ignoreSchool || selectedSchool.includes(itemSchool)) &&
      (!isNaN(itemLvl) && itemLvl >= minLvl && itemLvl <= maxLvl) &&
      (ignoreSource || selectedSource.includes(itemSource))
    );
  });
  /*bloc_total.textContent = filteredData.length;
  text_found.textContent = form.dataset["itemtype"] + "(s)";
  if (!ignoreSchool) {
    console.log(ignoreSchool);
    text_found.textContent += " des écoles " + selectedSchool;
  }

  text_found.textContent += " de niveau " + minLvl;
  if (maxLvl != minLvl) {
    text_found.textContent += " à " + maxLvl;
  }

  text_found.textContent += " trouvé(s)";
  if (!ignoreSource) {
    text_found.textContent += " dans " + selectedSource;
  }
  text_found.textContent += ".";
  */

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
 * G2nere un PNJ basé sur le métier indiqué
 * @param {*} event
 * @param {*} data
 */
async function createPNJfromJob(event, data) {
  event.preventDefault();
  const jobData = liste_origine.filter((o) => o.Nom === data["Métier"]);
  data["Spécialisations"] = jobData[0]["Spécialisations"];
  data["Lignée"] = randomLignee();
  data["Nom"] = await random_PNJ_name(data["Lignée"]);
  data["Domaines"] = {};
  let niveau = 4;
  CORRESPONDANCES["Domaines"].forEach(domaine => {
    data["Domaines"][domaine] = niveau;
  });
  modal_show([data], "pnj");
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
  return lignees[Math.floor(Math.random() * lignees.length)];
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
