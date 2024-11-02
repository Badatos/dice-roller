/**
    SHAAN RPG Dice Roller scripts
**/

// Nombre d'itérations avant de stopper les dés
var roll_count = 10;

// Dossier des images
const img_url = "img/";

// Valeurs de thrines obtenues
var esprit, ame, corps, necrose;

// Blocs d'alertes
const symbiose = document.getElementById("symbiose");
const symbiose_necro = document.getElementById("symbiose-necro");
const symbiose_necro_trans = document.getElementById("symbiose-necro-trans");
const symbiose_trans = document.getElementById("symbiose-trans");
const bonus = document.getElementById("bonus");
const exp = document.getElementById("exp");
const limbes = document.getElementById("limbes");
const perte_bloc = document.getElementById("perte");
const critical_necrosis = document.getElementById("critical-necrosis");
const necrosis_help = document.getElementById("necrosis-help");

// Dés
const de_esprit = document.getElementById("de_esprit");
const img_esprit = de_esprit.querySelector("img");

const de_ame = document.getElementById("de_ame");
const img_ame = de_ame.querySelector("img");
const txt_ame = document.getElementById("de_trihn_2");

const de_corps = document.getElementById("de_corps");
const img_corps = de_corps.querySelector("img");

const de_necrose = document.getElementById("de_necrose");
const img_necrose = de_necrose.querySelector("img");
const txt_necrose = document.getElementById("de_trihn_4");

// Perte
const num_perte = document.getElementById("num_perte");

/**
 * Lance les dés pour un test de domaine.
 */
function domain_test() {
    reset_blocs();
    de_esprit.classList.remove("d-none");
    de_corps.classList.remove("d-none");
    txt_necrose.textContent = "Perte";
    txt_ame.textContent = "Âme";
    random_domain();
}

/**
 * Prépare les dés et lance un test de nécrose.
 */
function necrosis_test() {
    reset_blocs();
    de_esprit.classList.add("d-none");
    de_corps.classList.add("d-none");
    txt_necrose.textContent = "Nécrose";
    txt_ame.textContent = "Perte";
    random_necrosis();
}

/**
 * Réinitialise les blocs d'infos, et lance les dés pour un test de domaine.
 */
function reset_blocs() {
    symbiose.classList.add("d-none");
    symbiose_necro.classList.add("d-none");
    symbiose_necro_trans.classList.add("d-none");
    symbiose_trans.classList.add("d-none");
    bonus.classList.add("d-none");
    exp.classList.add("d-none");
    limbes.classList.add("d-none");
    critical_necrosis.classList.add("d-none");
    necrosis_help.classList.add("d-none");
    // perte_bloc.classList.add("d-none");
}

/**
 * Effectue $roll_count générations aléatoire successives espacées de 100ms
 * (pour donner un effet visuel aux lancement des dés)
 * Puis affiche les alertes éventuelles.
 */
function random_domain() {

    roll_domain();

    roll_count--;

    if (roll_count > 0) window.setTimeout(random_domain, 100);
    else {
        roll_count = 10;
        if (esprit == 0 && ame == 0 && corps == 0 && necrose == 0) {
            symbiose_necro_trans.classList.remove("d-none");
            exp.classList.remove("d-none");
        } else {
            if (esprit == ame && ame == corps && ame == necrose) {
                symbiose_trans.classList.remove("d-none");
                exp.classList.remove("d-none");
            } else {
                if ((necrose == ame && necrose == corps) ||
                    (necrose == ame && necrose == esprit) ||
                    (necrose == esprit && necrose == corps)||
                    (esprit == 0 && ame == 0 && corps == 0)) {
                    symbiose_necro.classList.remove("d-none");
                    exp.classList.remove("d-none");
                } else {
                    if (esprit == ame && ame == corps) {
                        symbiose.classList.remove("d-none");
                        exp.classList.remove("d-none");
                    } else {
                        if (esprit == 9 || ame == 9 || corps == 9) {
                            bonus.classList.remove("d-none");
                        }
                        if (esprit == 0 || ame == 0 || corps == 0) {
                            limbes.classList.remove("d-none");
                        }
                    }
                }
            }
        }
        // Calcul des pertes
        if (necrose == 0) {
            perte = 3;
        } else if (necrose > 5) {
            perte = 2;
        } else {
            perte = 1;
        }
        num_perte.textContent = perte;
        perte_bloc.classList.remove("d-none");
    }
}

/**
 * Effectue un test de nécrose
 */
function random_necrosis() {

    roll_necrosis();

    roll_count--;

    if (roll_count > 0) window.setTimeout(random_necrosis, 100);
    else {
        roll_count = 10;
        if (necrose == 0) {
            critical_necrosis.classList.remove("d-none");
        } else {
            necrosis_help.classList.remove("d-none");
        }
        // Calcul des pertes
        if (ame == 0) {
            perte = 3;
        } else if (ame > 5) {
            perte = 2;
        } else {
            perte = 1;
        }
        num_perte.textContent = perte;
        perte_bloc.classList.remove("d-none");
    }
}

/**
 * Génére une combinaison aléatoire des 4 dés de Shaan.
 */
function roll_domain() {
    esprit = roll_dice(img_esprit, "d10/d10_jaune_");
    ame = roll_dice(img_ame, "d10/d10_bleu_");
    corps = roll_dice(img_corps, "d10/d10_rouge_");
    necrose = roll_dice(img_necrose, "d10/d10_noir_");
}

/**
 * Génére une combinaison aléatoire des dés bleu et noir.
 */
function roll_necrosis() {
    ame = roll_dice(img_ame, "d10/d10_bleu_");
    necrose = roll_dice(img_necrose, "d10/d10_noir_");
}

/**
 * Relance le dé noir
 */
function reroll_black() {
    necrosis_help.classList.add("d-none");
    necrose = roll_dice(img_necrose, "d10/d10_noir_");
    roll_count--;

    if (roll_count > 0) window.setTimeout(reroll_black, 100);
    else {
        roll_count = 10;
        if (necrose == 0) {
            critical_necrosis.classList.remove("d-none");
        }
    }
}

/**
 * Lance un dé.
 */
function roll_dice(img, color) {
    value = Math.floor(Math.random() * 10);
    img.src = img_url + color + value + ".png";
    img.className = "score_" + value;
    img.alt = necrose;
    return value;
}

