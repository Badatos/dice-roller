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
  const romanHash = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
  };
  return romanHash[romanString];
}

/**
 * Masque les éléments qui ne correspondent pas à la recherche.
 */
function search_filter() {
	let string = document.getElementById("search").value.toLowerCase();
  if (string.length > 2) {
    document.querySelectorAll('.item').forEach(function(elem) {
      let item = elem.innerText.toLowerCase();
      if (!(item.includes(string)))
        elem.classList.add("d-none");
      else
        elem.classList.remove("d-none");
    });
  }
}
