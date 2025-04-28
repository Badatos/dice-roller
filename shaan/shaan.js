/* Shaan template Scripts */

window.onscroll = function() {scrollFunction()};

/**
 * Handles the scroll event to toggle the "small"
 *  class on the header element
 * based on the vertical scroll position of the page.
 */
function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    document.getElementById("header").classList.add("small");
  } else {
    document.getElementById("header").classList.remove("small");
  }
}

function romanNumber(romanString) {
  if(romanString === "0") {
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
 * Masque les éléments qui ne correspondent pas à la recherche.
 */
async function search_filter() {
	let string = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll('.item').forEach(function(elem) {
    let item = elem.innerText.toLowerCase();
    if (string.length > 2 && !(item.includes(string)))
      elem.classList.add("d-none");
    else
      elem.classList.remove("d-none");
  });
  await new Promise(r => setTimeout(r, 200));
  loader.classList.add("d-none");
  liste_elements.classList.remove("d-none");
}


/**
 * Genere une liste d'éléments au format "carte"
 * @param {*} elem  élément cliqué
 * @param {*} event évenement déclenché
 */
async function generate(elem, event) {
  //Ne s'active que si l'onglet "cartes" n'est pas déja sélectionné
  if (!card_tab.classList.contains("active")) {
    //console.log(select_item);
    loader.classList.remove("d-none");
    table_elements.classList.add("d-none");
    card_tab.classList.add("active");
    card_tab.setAttribute('aria-current', "page");
    table_tab.classList.remove("active");
    table_tab.removeAttribute('aria-current');
    card_tab.scrollIntoView();
    if (filteredData[0] == "VIDE") {
      filteredData = liste_origine;
    }
    display_acquis(filteredData, card_elements, "acquis");
    await new Promise(r => setTimeout(r, 200));
    loader.classList.add("d-none");
    card_elements.classList.remove("d-none");
  }
}
