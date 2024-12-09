/**
    SHAAN RPG Dice Roller scripts
**/

// Nombre d’itérations avant de stopper les dés
var roll_count = 10;

// Dossier des images
const img_url = "../img/";

// Valeurs de thrines obtenues
var thrin_values = { 'jaune': 0, 'bleu': 0, 'rouge': 0, 'noir': 0 }

// Boutons d'action
const domain_btn = document.getElementById("domain-btn");

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
const de_esprit = document.getElementById("de-esprit");
const de_ame = document.getElementById("de-ame");
const de_corps = document.getElementById("de-corps");
const txt_corps = document.getElementById("de_trihn_3");
const de_perte = document.getElementById("de-perte-bleu");
const de_necrose = document.getElementById("de-necrose");
const de_failure = document.getElementById("de-failure");
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
    de_ame.classList.remove("d-none");
    txt_necrose.textContent = "Perte";
    random_domain();
}

/**
 * Prépare les dés et lance un test de nécrose.
 */
function necrosis_test() {
    reset_blocs();
    de_esprit.classList.add("d-none");
    de_corps.classList.add("d-none");
    de_ame.classList.add("d-none");
    de_perte.classList.remove("d-none");
    txt_necrose.textContent = "Nécrose";
    random_necrosis();
}

/**
 * Prépare les dés et pioche un échec personnel.
 */
function random_failure() {
    reset_blocs();
    de_esprit.classList.add("d-none");
    de_ame.classList.add("d-none");
    de_corps.classList.add("d-none");
    de_necrose.classList.add("d-none");
    perte_bloc.classList.add("d-none");
    de_failure.classList.remove("d-none");
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
    de_perte.classList.add("d-none");
    de_failure.classList.add("d-none");
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
        let esprit = thrin_values["jaune"];
        let ame = thrin_values["bleu"];
        let corps = thrin_values["rouge"];
        let necrose = thrin_values["noir"];
        roll_count = 10;
        // Symbiose nécrotique transcendantale
        if (esprit === 0 && ame === 0 && corps === 0 && necrose === 0) {
            symbiose_necro_trans.classList.remove("d-none");
            exp.classList.remove("d-none");
        } else {
            // Symbiose transcendantale
            if (esprit === ame && ame === corps && ame === necrose) {
                symbiose_trans.classList.remove("d-none");
                exp.classList.remove("d-none");
            } else {
                // Symbiose nécrotique
                if ((necrose === ame && necrose === corps) ||
                    (necrose === ame && necrose === esprit) ||
                    (necrose === esprit && necrose === corps) ||
                    (esprit === 0 && ame === 0 && corps === 0)) {
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

    let bleu = roll_dice(de_perte, "bleu");
    let necrose = roll_dice(de_necrose,"noir");

    roll_count--;

    if (roll_count > 0) window.setTimeout(random_necrosis, 100);
    else {
        roll_count = 10;
        if (necrose == 0) {
            critical_necrosis.classList.remove("d-none");
        } else {
            necrosis_help.classList.remove("d-none");
            failure_help.classList.remove("d-none");
        }

        // Calcul des pertes
        if (bleu == 0) {
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
    if (thrin_values["jaune"] >= 0) {
        roll_dice(de_esprit, "jaune");
    }
    if (thrin_values["bleu"] >= 0) {
        roll_dice(de_ame, "bleu");
    }
    if (thrin_values["rouge"] >= 0) {
        roll_dice(de_corps, "rouge");
    }
    roll_dice(de_necrose, "noir");
}

/**
 * Relance le dé noir
 */
function reroll_black() {
    necrosis_help.classList.add("d-none");
    necrose = roll_dice(de_necrose, "noir");
    roll_count--;

    if (roll_count > 0) window.setTimeout(reroll_black, 100);
    else {
        roll_count = 10;
        if (necrose == 0) {
            critical_necrosis.classList.remove("d-none");
            failure_help.classList.add("d-none");
        }
    }
}

/**
 * Lance le dé rouge pour déterminer un échec personnel
 */
function roll_failure() {
    failure = roll_dice(de_failure, "rouge");
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
                " <strong>succès bonus</strong> pour briser cet échec.";                break;
            case 9:
                title = "Dommage collatéral";
                msg = "Vous mettez en danger les autres personnages qui perdent"+
                " 1 point dans leur énergie la plus faible."+
                " Vos alliés perdent également 1 point de fidelité.";
                break;
            case 0:
                title = "Objet mythique endommagé";
                msg = "L’un de vos objets mythiques a subi des dégâts,"+
                " il faut y consacrer un <strong>succès bonus</strong> pour le rendre"+
                " à nouveau utilisable.";
                break;
            default:
                title = `Erreur`;
                msg = `Il n’y a pas d’échec défini pour le chiffre ${failure}.`;
        }
        generic_help.classList.remove("d-none");
        generic_title.textContent = `(${failure}) ${title}`;
        msg += "<hr><p>Tout échec personnel vous fait gagner 1px</p>";
        generic_desc.innerHTML = msg;
    }
}

/**
 * Lance un dé.
 */
function roll_dice(container, color) {
    let img = container.querySelector("img");
    value = Math.floor(Math.random() * 10);
    img.src = img_url + "d10/d10_" + color + "_" + value + ".png";
    img.className = "score-" + value;
    img.alt = "" + value + " au dé " + color;
    thrin_values[color] = value;
    img.title = "" + thrin_values[color] + " au dé " + color;
    return value;
}

/** Listen for toggle event on each colored dice */
document.querySelectorAll(".des>input").forEach((input) => {
    input.addEventListener('change', (event) => {
        let parent = event.target.parentNode;
        let color = parent.dataset.color;
        let checked = event.target.checked;
        if (!checked) {
            thrin_values[color] = -1;
        } else if (thrin_values[color] === -1) {
            thrin_values[color] = 0;
        }
        parent.classList.toggle("disabled");
        parent.querySelector(".disabled_txt").innerHTML = checked ? "&nbsp;" : "(désactivé)";
        // TODO: si aucun dé actif, désactiver le test de domaine.
        if (thrin_values["jaune"] + thrin_values["bleu"] + thrin_values["rouge"] < -2) {
            domain_btn.classList.add("disabled");
            domain_btn.title = "Il faut au moins une énergie pour faire un test de domaine.";
        } else {
            domain_btn.classList.remove("disabled");
            domain_btn.title = "Faire un test de domaine en lancant tous les dés.";
        }
    });
});

// TODO : retirer un dé. ==> seule la symbiose nécro reste possible
// retirer 2 dés : plus de symbiose
