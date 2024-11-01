

var roll_count = 10;
const img_url = "img/";
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
// Dés
var de_esprit = document.querySelector("#de_esprit>img");
var de_ame = document.querySelector("#de_ame>img");
var de_corps = document.querySelector("#de_corps>img");
var de_necrose = document.querySelector("#de_necrose>img");
// Perte
const num_perte = document.getElementById("num_perte");

/**
 * Réinitialise les blocs d'infos, et lance les dés.
 */
function rollDices() {
    symbiose.classList.add("d-none");
    symbiose_necro.classList.add("d-none");
    symbiose_necro_trans.classList.add("d-none");
    symbiose_trans.classList.add("d-none");
    bonus.classList.add("d-none");
    exp.classList.add("d-none");
    limbes.classList.add("d-none");
    // perte_bloc.classList.add("d-none");
    RandomDices();
}

/**
 * Effectue $roll_count générations aléatoire successives espacées de 100ms
 * (pour donner un effet visuel aux lancement des dés)
 * Puis affiche les alertes éventuelles.
 */
function RandomDices() {

    RollDice();

    roll_count--;

    if (roll_count > 0) window.setTimeout(RandomDices, 100);
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
 * Génére une combinaison aléatoire des 4 dés de Shaan.
 */
function RollDice() {
    esprit = Math.floor(Math.random() * 10);
    de_esprit.src = img_url + "d10/d10_jaune_" + esprit + ".png";
    de_esprit.className = "score_" + esprit;
    de_esprit.alt = esprit;

    ame = Math.floor(Math.random() * 10);
    de_ame.src = img_url + "d10/d10_bleu_" + ame + ".png";
    de_ame.className = "score_" + ame;
    de_ame.alt = ame;

    corps = Math.floor(Math.random() * 10);
    de_corps.src = img_url + "d10/d10_rouge_" + corps + ".png";
    de_corps.className = "score_" + corps;
    de_corps.alt = corps;

    necrose = Math.floor(Math.random() * 10);
    de_necrose.src = img_url + "d10/d10_noir_" + necrose + ".png";
    de_necrose.className = "score_" + necrose;
    de_necrose.alt = necrose;
}
