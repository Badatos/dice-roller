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

