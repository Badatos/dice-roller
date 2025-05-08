
const loader = document.getElementById("loader");

const parser = new PublicGoogleSheetsParser(
  "1tC10OMJe0BOzZauCmqLxL7-D9KlWT13vswGDBJWySLc",
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

  text_found.textContent +=  " de classe " + minClass;
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

function modal_item(item, event, item_type="acquis") {
  event.preventDefault();
  const selectedDatas = liste_origine.filter((o) => o.Nom === item.dataset["name"]);
  selectedDatas[0].width = "col-sm-12";
  display_items(selectedDatas, "items-list", item_type);
  itemModal.show();
}
