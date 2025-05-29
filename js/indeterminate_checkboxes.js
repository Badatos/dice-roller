/**
 * Indeterminate Checkboxes - Vanilla JS
 */


/**
 * Event for Checkbox change
 * @param {*} param0
 * @returns
 */
function onCheckBoxChange({ target }) {

	if (target.type !== 'checkbox' && target.type !== 'select-multiple') {
		return;
	}

	updateChildren(target);
	updateParents(target);

}

/**
 * Update all checkbox children of <el>
 * @param {*} el
 */
function updateChildren(el) {

	const { checked } = el;

	getChildren(el).forEach(child => {
		child.checked = checked;
		child.selected = checked;
		child.indeterminate = false;
	});

}

/**
 * Update all parents checkboxes
 * @param {*} parent
 */
function updateParents(target) {

	parent = getParent(target);
	if (parent) {
		let children = getChildren(parent);
		let checked = false;
		if (target.type == 'select-multiple') {
			checked = [...children].filter(child => child.selected).length;
		} else {
			checked = [...children].filter(child => child.checked).length;
		}
		parent.checked = checked === children.length;
		parent.indeterminate = checked && !parent.checked;
	}
}

/**
 * Get all checkbox children
 * @param {*} el
 * @returns
 */
function getChildren(el) {
	let fieldset = el.closest('fieldset');
	let checkboxes = fieldset.querySelector('.checkboxes');
	// Inutile si on est dans un .checkboxes.
	if (checkboxes && !checkboxes.contains(el)) {
		return checkboxes.querySelectorAll('input[type="checkbox"]');
	}
	let selectM = fieldset.querySelector('select');
	if (selectM && !selectM.contains(el)) {
		return selectM.querySelectorAll('option');
	}
	return [];
}

/**
 * Get checbox parent of <el>
 * @param {*} el
 * @returns
 */
function getParent(el) {
	// Closest parcours l'element et ses parents.
	let fieldset = el.closest('fieldset');

	if (el.closest('.checkboxes')) {
		return fieldset.querySelector('.check-all');
	}

	if (el.type == 'select-multiple') {
		return fieldset.querySelector('input[type="checkbox"]');
	}
	return false;
}

addEventListener('change', onCheckBoxChange);
