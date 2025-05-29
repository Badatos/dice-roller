/*
 *
 *   File:   utils.js
 *
 *   Desc:
 */

'use strict';

/**
 * Masque les éléments qui ne correspondent pas à la recherche.
 */
async function search_filter(target="liste-elements") {
	let string = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll('tr.item').forEach(function(elem) {
    let item = elem.innerText.toLowerCase();
    if (string.length > 2 && !(item.includes(string)))
      elem.classList.add("d-none");
    else
      elem.classList.remove("d-none");
  });
  await new Promise(r => setTimeout(r, 200));
  loader.classList.add("d-none");
  document.getElementById(target).classList.remove("d-none");
}

/**
 * Genere une liste d'éléments au format "carte"
 * @param {*} elem  élément cliqué
 * @param {*} event évenement déclenché
 */
async function generate(elem, event, item_type="acquis") {
  //Ne s'active que si l'onglet "cartes" n'est pas déja sélectionné
  if (!card_tab.classList.contains("active")) {
    loader.classList.remove("d-none");
    table_elements.classList.add("d-none");
    card_tab.classList.add("active");
    card_tab.setAttribute('aria-current', "page");
    table_tab.classList.remove("active");
    table_tab.removeAttribute('aria-current');
    card_tab.scrollIntoView();

    if (filteredData[0] == "VIDE") {
      // Si aucun filtre, on prend la liste complète.
      filteredData = liste_origine;
    }

    const selectedItems = [];
    document.getElementsByName('select_item').forEach(function(chk) {
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
    nodes[i].removeAttribute('aria-sort')
  }
}

// Function to test: at least one item of selected is included in itemlist
function hasAnySelectedList(selected, itemlist) {
  if (!Array.isArray(selected) || !Array.isArray(itemlist)) return false;
  itemlist = itemlist.map(v => v.toLowerCase());
  return selected.some(cls => itemlist.includes(cls.toLowerCase()));
}
