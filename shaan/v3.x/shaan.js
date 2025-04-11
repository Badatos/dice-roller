/**
    SHAAN RPG Dice Roller scripts
**/

// Nombre d’itérations avant de stopper les dés
var roll_count = 10;

// Dossier des images
const img_url = "../img/";

// Valeurs de thrines obtenues
var thrin_values = { "jaune": 0, "bleu": 0, "rouge": 0, "noir": 0 }

// Boutons d’action
const domain_btn = document.getElementById("domain-btn");

// Blocs d’alertes
const symbiose = document.getElementById("symbiose");
const symbiose_necro = document.getElementById("symbiose-necro");
const symbiose_necro_trans = document.getElementById("symbiose-necro-trans");
const symbiose_trans = document.getElementById("symbiose-trans");
const bonus = document.getElementById("bonus");
const pending_bonus = document.getElementById("pending-bonus");
const exp = document.getElementById("exp");
const limbes = document.getElementById("limbes");
const perte_bloc = document.getElementById("perte");
const crane_perte = document.getElementById("crane-perte");
const critical_necrosis = document.getElementById("critical-necrosis");
const necrosis_help = document.getElementById("necrosis-help");
const success_help = document.getElementById("success-help");
const succes_plus = document.getElementById("succes-plus");
const failure_help = document.getElementById("failure-help");
const pending_failure = document.getElementById("pending-failure");
const failure_btn = document.getElementById("failure-btn");
const generic_help = document.getElementById("generic-help");
const generic_title = document.getElementById("generic-title");
const generic_desc = document.getElementById("generic-desc");
const bloc_action = document.getElementById("bloc-action");

// Dés
const de_action = document.getElementById("de-action");
const de_esprit = document.getElementById("de-esprit");
const de_ame = document.getElementById("de-ame");
const de_corps = document.getElementById("de-corps");
const txt_corps = document.getElementById("de_trihn_3");
const de_perte = document.getElementById("de-perte-bleu");
const de_necrose = document.getElementById("de-necrose");
const de_failure = document.getElementById("de-failure");
const txt_necrose = document.getElementById("de_trihn_4");

// Résultats
const results_title = document.getElementById("results-title");
const table_score = document.getElementById("table-score");
const action_result = document.getElementById("action-result");
const domain_level = document.getElementById("domain-level");
const vocation_bonus = document.getElementById("vocation-bonus");
const total_score = document.getElementById("total-score");
const total_succes = document.getElementById("total-succes");
const difficulte = document.getElementById("difficulte");

// Perte
const num_perte = document.getElementById("num-perte");
const num_succes = document.getElementById("num-succes");

// Puiser
const draws = {
    "jaune": document.getElementById("draw-jaune"),
    "bleu": document.getElementById("draw-bleu"),
    "rouge": document.getElementById("draw-rouge")
};
const draw_block = document.getElementById("draw-block");
const no_draw = document.getElementById("no-draw");
const draw_dice = document.getElementById("draw-dice");

/**
 * Prépare les dés et lance un test de domaine.
 */
function domain_test() {
    reset_blocs();
    table_score.querySelector("thead").className = "table-success";
    de_esprit.classList.remove("d-none");
    de_corps.classList.remove("d-none");
    de_ame.classList.remove("d-none");
    txt_necrose.textContent = "Perte";
    random_domain();
    results_title.classList.remove("d-none");
}

/**
 * Prépare les dés et lance un test de nécrose.
 */
function necrosis_test() {
    reset_blocs();
    table_score.querySelector("thead").className = "table-dark";
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
    pending_bonus.classList.add("d-none");
    exp.classList.add("d-none");
    limbes.classList.add("d-none");
    critical_necrosis.classList.add("d-none");
    necrosis_help.classList.add("d-none");
    success_help.classList.add("d-none");
    succes_plus.classList.add("d-none");
    failure_help.classList.add("d-none");
    results_title.classList.add("d-none");
    pending_failure.classList.add("d-none");
    failure_btn.classList.remove("d-none");
    generic_help.classList.add("d-none");
    de_ame.classList.remove("d-none");
    de_necrose.classList.remove("d-none");
    de_perte.classList.add("d-none");
    de_failure.classList.add("d-none");
    crane_perte.classList.add("d-none");
    total_succes.className = "";
}

/**
 * Effectue $roll_count tests de domaine successifs, espacées de 100ms
 * (pour donner un effet visuel aux lancement des dés)
 * Puis affiche les alertes éventuelles.
 */
function random_domain() {

    roll_domain();
    let has_lost = true;
    roll_count--;

    if (roll_count > 0) window.setTimeout(random_domain, 100);
    else {
        // thrin_values["jaune"] = 9;
        let esprit = thrin_values["jaune"];
        let ame = thrin_values["bleu"];
        let corps = thrin_values["rouge"];
        // esprit = ame = corps = 9;

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
                    if (esprit === ame && ame === corps) {
                        symbiose.classList.remove("d-none");
                        if(esprit === 9) {
                            num_succes.textContent = 6;
                        } else {
                            num_succes.textContent = 5;
                        }
                        exp.classList.remove("d-none");
                        has_lost = false;
                    } else {
                        calcul_score(de_action.value);
                    }
                }
            }
        }

        // Calcul des pertes
        if (necrose == 0) {
            crane_perte.classList.remove("d-none");
        }
        if(has_lost === true && de_action.value !== ""){
            const action_value = thrin_values[de_action.value];
            if (necrose > action_value) {
                perte = 1;
            } else if (necrose < action_value) {
                perte = 2;
            } else {
                perte = 0;
            }
            num_perte.textContent = perte;
            perte_bloc.classList.remove("d-none");
        }
    }
}

function puiser() {
    calcul_score(de_action.value, thrin_values[draw_dice.value]);
}

function luck() {
    necrosis_help.classList.add("d-none");
    calcul_score("noir", thrin_values["bleu"]);
}

function calcul_score(action_color, de_bonus = 0) {

    if(action_color !== "") {
        let action_val = thrin_values[action_color];
        console.log(action_val);
        // Echec
        if (action_val === 0 ) {
            limbes.classList.remove("d-none");
        }

        action_result.innerText = action_val;
        action_result.className = action_color;

        let score = action_val + Number(domain_level.value) + Number(vocation_bonus.value);
        // console.log("score = "+action_val+"+" + domain_level.value + "+" + vocation_bonus.value + "=" + score);

        if(de_bonus > 0) {
            total_score.innerText = score + "+ " + de_bonus + " = " + Number(score + de_bonus);
            score = score + de_bonus;
        } else {
            total_score.innerText = score;
        }
        // Calcul du nombre de succès.
        if (score > 39) {
            succes = 6;
        } else if (score > 34) {
            succes = 5;
        } else if (score > 29) {
            succes = 4;
        } else if (score > 24) {
            succes = 3;
        } else if (score > 19) {
            succes = 2;
        } else if (score > 14) {
            succes = 1;
        } else {
            succes = 0;
        }
        if (succes > 0 && thrin_values["noir"] === 0) {
            total_succes.innerText = succes + "-1 = " + Number(succes - 1);
            succes = succes -1;
        } else {
            total_succes.innerText = succes;
        }

        // Succès critique
        if (action_val === 9 || de_bonus === 9) {
            bonus.classList.remove("d-none");
            total_succes.innerText = succes + "+1 = " + Number(succes + 1);
            succes++;
        }

        if(succes >= difficulte.value) {
            total_succes.className = "bg-success text-white";
            success_help.classList.remove("d-none");
            pending_failure.classList.add("d-none");
            failure_help.classList.add("d-none");
            if(succes > difficulte.value) {
                succes_plus.querySelector("h2>span").innerText = Number(succes - difficulte.value);
                succes_plus.classList.remove("d-none");
            }
        } else {
            total_succes.className = "bg-warning";
            if(de_bonus == 0 && action_color == "noir") {
                necrosis_help.classList.remove("d-none");
            } else {
                pending_failure.classList.remove("d-none");
            }
            failure_help.classList.remove("d-none");

            if (de_bonus == 0) {
                let nb_disabled = 0;
                for (const color in thrin_values) {
                    if (color !== "noir") {
                        draws[color].className = "";
                        if (color==action_color || thrin_values[color] < 1) {
                            draws[color].disabled = true;
                            draws[color].classList.add("d-none");
                            nb_disabled++;
                        } else {
                            // Succes possible
                            if (thrin_values[color] == 9) {
                                pending_bonus.classList.remove("d-none");
                                draws[color].className = "bg-success text-white";
                            }
                            draws[color].disabled = false;
                            draws[color].classList.remove("d-none");
                        }
                    }
                }
                if (nb_disabled > 2) {
                    no_draw.classList.remove("d-none");
                    draw_block.classList.add("d-none");
                } else {
                    no_draw.classList.add("d-none");
                    draw_block.classList.remove("d-none");
                }
            } else {
                // Déja puisé
                no_draw.classList.remove("d-none");
                draw_block.classList.add("d-none");
            }
        }
        table_score.scrollIntoView();
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
        }

        // Calcul des pertes
        if (bleu == 0) {
            perte = 3;
        } else if (bleu > 5) {
            perte = 2;
        } else {
            perte = 1;
        }
        num_perte.textContent = perte;
        perte_bloc.classList.remove("d-none");
        calcul_score("noir");
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
    input.addEventListener("change", (event) => {
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
        document.getElementById("action-"+color).disabled = !checked;
        if (de_action.value === color) {
            de_action.value = "";
        }
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

// Désactive le bouton domain-btn si le de d’action n’a pas de valeur
de_action.addEventListener("change", () => {
    if (de_action.value === "") {
        domain_btn.classList.add("disabled");
        domain_btn.title = "Veuillez sélectionner une énergie pour effectuer un test de domaine.";
    } else {
        domain_btn.classList.remove("disabled");
        domain_btn.title = "Faire un test de domaine en lançant tous les dés.";
    }
});

/*domain_level.addEventListener("change", () => {
    calcul_score();
});
vocation_bonus.addEventListener("change", () => {
    calcul_score();
});
de_action.addEventListener("change", () => {
    calcul_score();
});*/

// TODO : retirer un dé. ==> seule la symbiose nécro reste possible
// retirer 2 dés : plus de symbiose
