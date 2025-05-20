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
