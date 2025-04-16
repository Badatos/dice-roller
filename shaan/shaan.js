/* Shaan template Scripts */

window.onscroll = function() {scrollFunction()};

/**
 * Handles the scroll event to toggle the "small"
 *  class on the header element
 * based on the vertical scroll position of the page.
 */
function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("header").classList.add("small");
  } else {
    document.getElementById("header").classList.remove("small");
  }
}
