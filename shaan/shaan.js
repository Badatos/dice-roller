/**
    SHAAN RPG Dice Roller scripts
**/

// Nombre d’itérations avant de stopper les dés
var roll_count = 10;

// Dossier des images
const img_url = "img/";

// Valeurs de thrines obtenues
var esprit, ame, corps, necrose;

// Blocs d’alertes
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
const failure_help = document.getElementById("failure-help");
const failure_btn = document.getElementById("failure-btn");
const generic_help = document.getElementById("generic-help");
const generic_title = document.getElementById("generic-title");
const generic_desc = document.getElementById("generic-desc");

// Dés
const de_esprit = document.getElementById("de_esprit");
const img_esprit = de_esprit.querySelector("img");

const de_ame = document.getElementById("de_ame");
const img_ame = de_ame.querySelector("img");
const txt_ame = document.getElementById("de_trihn_2");

const de_corps = document.getElementById("de_corps");
const img_corps = de_corps.querySelector("img");
const txt_corps = document.getElementById("de_trihn_3");

const de_necrose = document.getElementById("de_necrose");
const img_necrose = de_necrose.querySelector("img");
const txt_necrose = document.getElementById("de_trihn_4");

// Perte
const num_perte = document.getElementById("num_perte");

/**
 * Prépare les dés et lance un test de domaine.
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
 * Prépare les dés et pioche un échec personnel.
 */
function random_failure() {
    reset_blocs();
    de_esprit.classList.add("d-none");
    de_ame.classList.add("d-none");
    de_necrose.classList.add("d-none");
    de_corps.classList.remove("d-none");
    perte_bloc.classList.add("d-none");
    txt_corps.textContent = "Dé d’échec";
    roll_failure();
}

/**
 * Réinitialise les blocs d’infos.
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
    failure_help.classList.add("d-none");
    failure_btn.classList.remove("d-none");
    generic_help.classList.add("d-none");
    de_ame.classList.remove("d-none");
    de_necrose.classList.remove("d-none");
    txt_corps.textContent = "Corps";
    // perte_bloc.classList.add("d-none");
}

/**
 * Effectue $roll_count tests de domaine successifs, espacées de 100ms
 * (pour donner un effet visuel aux lancement des dés)
 * Puis affiche les alertes éventuelles.
 */
function random_domain() {

    roll_domain();

    roll_count--;

    if (roll_count > 0) window.setTimeout(random_domain, 100);
    else {
        roll_count = 10;
        // Symbiose nécrotique transcendantale
        if (esprit == 0 && ame == 0 && corps == 0 && necrose == 0) {
            symbiose_necro_trans.classList.remove("d-none");
            exp.classList.remove("d-none");
        } else {
            // Symbiose transcendantale
            if (esprit == ame && ame == corps && ame == necrose) {
                symbiose_trans.classList.remove("d-none");
                exp.classList.remove("d-none");
            } else {
                // Symbiose nécrotique
                if ((necrose == ame && necrose == corps) ||
                    (necrose == ame && necrose == esprit) ||
                    (necrose == esprit && necrose == corps) ||
                    (esprit == 0 && ame == 0 && corps == 0)) {
                    symbiose_necro.classList.remove("d-none");
                    exp.classList.remove("d-none");
                } else {
                    // Symbiose
                    if (esprit == ame && ame == corps) {
                        symbiose.classList.remove("d-none");
                        exp.classList.remove("d-none");
                    } else {
                        // Succès critique
                        if (esprit == 9 || ame == 9 || corps == 9) {
                            bonus.classList.remove("d-none");
                        }
                        // Echec critique
                        if (esprit == 0 || ame == 0 || corps == 0) {
                            limbes.classList.remove("d-none");
                        }
                        failure_help.classList.remove("d-none");
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
 * Effectue $roll_count tests de nécrose successifs, espacées de 100ms
 * (pour donner un effet visuel aux lancement des dés)
 * Puis affiche les alertes éventuelles.
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
    esprit = roll_dice(img_esprit, "jaune");
    ame = roll_dice(img_ame, "bleu");
    corps = roll_dice(img_corps, "rouge");
    necrose = roll_dice(img_necrose, "noir");
}

/**
 * Génére une combinaison aléatoire des dés bleu et noir.
 */
function roll_necrosis() {
    ame = roll_dice(img_ame, "bleu");
    necrose = roll_dice(img_necrose, "noir");
}

/**
 * Relance le dé noir
 */
function reroll_black() {
    necrosis_help.classList.add("d-none");
    necrose = roll_dice(img_necrose, "noir");
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
 * Lance le dé rouge pour déterminer un échec personnel
 */
function roll_failure() {
    failure = roll_dice(img_corps, "rouge");
    roll_count--;

    if (roll_count > 0) window.setTimeout(roll_failure, 100);
    else {
        roll_count = 10;
        switch (failure) {
            case 1:
                title = "Coup de fatigue";
                msg = "-1 point de Corps";
                break;
            case 2:
                title = "Confusion";
                msg = "-1 point d’Esprit";
                break;
            case 3:
                title = "Choc émotionnel";
                msg = "-1 point d’Âme";
                break;
            case 4:
                title = "Blessure grave";
                msg = "Vous avez reçu un sérieux coup qui vous fait perdre"+
                " 2 points de Corps";
                break;
            case 5:
                title = "Amnésie temporaire";
                msg = "Cet échec vous provoque des troubles de mémoire qui vous"+
                " font perdre 2 points d’Esprit.";
                break;
            case 6:
                title = "Crise d’angoisse";
                msg = "Plongé dans une torpeur profonde, vous perdez 2 points d’Âme.";
                break;
            case 7:
                title = "Perte de confiance";
                msg = "Vous commencez à douter de vos compétences et subissez"+
                " un <strong>malus de -2 à toutes vos actions</strong> jusqu’au prochain test réussi.";
                break;
            case 8:
                title = "Perte de repères";
                msg = "Vous ne pouvez plus utiliser la vocation principale"+
                " utilisée à cet acte tant que vous n’utilisez pas un"+
                " <strong>bonus narratif</strong> pour briser cet échec.";
                break;
            case 9:
                title = "Dommage collatéral";
                msg = "Vous mettez en danger les autres personnages qui perdent"+
                " 1 point dans leur énergie la plus faible."+
                " Vos alliés perdent également 1 point de fidelité.";
                break;
            case 0:
                title = "Objet mythique endommagé";
                msg = "L’un de vos objets mythiques a subi des dégâts,"+
                " il faut y consacrer un <strong>bonus narratif</strong> pour le rendre"+
                " à nouveau utilisable.";
                break;
            default:
                title = `Erreur`;
                msg = `Il n’y a pas d’échec défini pour le chiffre ${failure}.`;
        }
        generic_help.classList.remove("d-none");
        generic_title.textContent = `(${failure}) ${title}`;
        generic_desc.textContent = msg;
    }
}

/**
 * Lance un dé.
 */
function roll_dice(img, color) {
    value = Math.floor(Math.random() * 10);
    img.src = img_url + "d10/d10_" + color + "_" + value + ".png";
    img.className = "score_" + value;
    img.alt = "" + value + " au dé " + color;
    return value;
}

