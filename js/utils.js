/*
 *
 *   File:   utils.js
 *
 *   Desc:
 */

"use strict";

let pending_search = false;

/**
 * Masque les éléments qui ne correspondent pas à la recherche.
 */
async function search_filter(target="liste-elements", delay=0) {
  const search_input = document.getElementById("search");
  const string = search_input.value.toLowerCase();
  if (!pending_search && (string.length > 2 || string.length == 0)) {
    search_input.disabled = true;
    const target_bloc = document.getElementById(target);
    loader.classList.remove("d-none");
    target_bloc.classList.add("d-none");
    pending_search = true;
    let tot = 0;
    bloc_total.innerText = "…";
    document.querySelectorAll(".item").forEach(function(elem) {
      let item = elem.innerText.toLowerCase();
      if (item.includes(string) || string.length == 0) {
        elem.classList.remove("d-none");
        tot++;
      } else {
        elem.classList.add("d-none");
      }
    });
    await new Promise(r => setTimeout(r, delay));
    loader.classList.add("d-none");
    bloc_total.innerText = tot;
    target_bloc.classList.remove("d-none");
    search_input.disabled = false;
    pending_search = false;
  }
}

/**
 * Genere une liste d’éléments au format "carte"
 * @param {*} elem  élément cliqué
 * @param {*} event évenement déclenché
 */
async function generate(elem, event, item_type="acquis") {
  // Ne s’active que si l’onglet "cartes" n’est pas déja sélectionné
  if (!card_tab.classList.contains("active")) {
    loader.classList.remove("d-none");
    table_elements.classList.add("d-none");
    card_tab.classList.add("active");
    card_tab.setAttribute("aria-current", "page");
    table_tab.classList.remove("active");
    table_tab.removeAttribute("aria-current");
    card_tab.scrollIntoView();

    if (filteredData[0] == "VIDE") {
      // Si aucun filtre, on prend la liste complète.
      filteredData = liste_origine;
    }

    const selectedItems = [];
    document.getElementsByName("select_item").forEach(function(chk) {
      if (chk.checked) {
        selectedItems.push(chk.value);
      }
    });

    if (selectedItems.length > 0) {
      // On ne prend que les éléments sélectionnés
      filteredData = filteredData.filter(item => {
        return selectedItems.includes(item["Nom"]);
      });
    }

    display_items(filteredData, "card-elements", item_type);
    await new Promise(r => setTimeout(r, 200));
    loader.classList.add("d-none");
    card_elements.classList.remove("d-none");
  }
}

/**
 * Switch display mode to "table".
 *
 * @param {*} elem  clicked element
 * @param {*} event triggered event
 */
function table_switch(elem, event) {
  if (event) {
    event.preventDefault();
  }
  if (!table_tab.classList.contains("active")) {
    card_elements.classList.add("d-none");
    card_tab.classList.remove("active");
    card_tab.removeAttribute("aria-current");
    table_elements.classList.remove("d-none");
    table_tab.classList.add("active");
    table_tab.setAttribute("aria-current", "page");
  }
}



function romanNumber(romanString) {
  if (romanString === "0") {
    return 0;
  }
  let toInt = parseInt(romanString, 10);
  if (toInt) {
    return toInt;
  } else {
    const romanHash = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
    };
    return romanHash[romanString];
  }
}

/**
 * Remove aria-sort status on all table headings
 */
function reset_sort_status() {
  const tr = document.getElementById("table-head");
  const nodes = tr.cells
  // Reset thead cells
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].removeAttribute("aria-sort")
  }
}

// Function to test: at least one item of selected is included in itemlist
function hasAnySelectedList(selected, itemlist) {
  if (!Array.isArray(selected) || !Array.isArray(itemlist)) return false;
  itemlist = itemlist.map(v => v.toLowerCase());
  return selected.some(cls => itemlist.includes(cls.toLowerCase()));
}

// Remove accents from a JavaScript string
const removeAccents = str =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
