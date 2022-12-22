// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tiny Filter WS Content configuration.
 *
 * @module      tiny_filterws/commands
 * @copyright   2022 Dani Palou <dani@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getPredefinedFilters} from './options';
import Selectors from './selectors';

import {
    get_strings as getStrings,
} from 'core/str';
import Modal from 'tiny_filterws/modal';
import ModalEvents from 'core/modal_events';
import ModalFactory from 'core/modal_factory';

let openingSelection = null;
let helpStrings = null;

export const handleAction = (editor) => {
    openingSelection = {
        selection: editor.selection,
        bookmark: editor.selection.getBookmark(),
    };

    displayDialogue(editor);
};

/**
 * Get the template context for the dialogue.
 *
 * @param {Editor} editor
 * @param {object} data
 * @returns {object} Promise resolved with the context data.
 */
const getTemplateContext = async (editor, data) => {
    const predefinedFilters = getPredefinedFilters(editor).map((filter, index) => {
        filter.index = index;

        return filter;
    });

    Array.from(Object.entries(await getHelpStrings())).forEach(([key, text]) => {
        data[`${key.toLowerCase()}helpicon`] = {text};
    });

    return Object.assign({}, {
        elementid: editor.id,
        haspredefinedfilters: predefinedFilters && predefinedFilters.length > 0,
        predefinedfilters: predefinedFilters,
    }, data);
};

/**
 * Get help strings.
 *
 * @returns {object} Object with the help strings.
 */
const getHelpStrings = async () => {
    if (!helpStrings) {
        const [filterUserAgent, origin] = await getStrings([
            'filteruseragent_help',
            'origin_help',
        ].map((key) => ({
            key,
            component: 'tiny_filterws',
        })));

        helpStrings = {filterUserAgent, origin};
    }

    return helpStrings;
};

const displayDialogue = async(editor, data = {}) => {
    const modal = await ModalFactory.create({
        type: Modal.TYPE,
        templateContext: await getTemplateContext(editor, data),
    });
    modal.show();

    const $root = modal.getRoot();
    const root = $root[0];
    $root.on(ModalEvents.save, (event, modal) => {
        handleDialogueSubmission(editor, modal);
    });

    root.addEventListener('click', (e) => {
        const applyPredefinedButton = e.target.closest(Selectors.applyPredefined);
        if (!applyPredefinedButton) {
            return;
        }

        const predefinedFilters = getPredefinedFilters(editor);
        const predefinedInput = root.querySelector(Selectors.inputPredefined);
        const predefinedFilter = predefinedFilters[Number(predefinedInput && predefinedInput.value)];
        if (!predefinedFilter) {
            // eslint-disable-next-line no-console
            console.warn('Predefined filter not found', predefinedInput && predefinedInput.value);

            return;
        }

        const inputOrigin = root.querySelector(Selectors.inputOrigin);
        if (inputOrigin) {
            inputOrigin.value = predefinedFilter.origin;
        }
        const inputUserAgent = root.querySelector(Selectors.inputUserAgent);
        if (inputUserAgent) {
            inputUserAgent.value = predefinedFilter.useragent;
        }
    });
};

const handleDialogueSubmission = async(editor, modal) => {
    const root = modal.getRoot()[0];
    const inputOrigin = root.querySelector(Selectors.inputOrigin);
    const inputUserAgent = root.querySelector(Selectors.inputUserAgent);
    const origin = (inputOrigin && inputOrigin.value) || 'any';
    const userAgent = (inputUserAgent && inputUserAgent.value) || '';
    const openingTag = '{fws ' + origin + (userAgent ? (' ua="' + userAgent + '"') : '') + '}';
    const content = openingSelection.selection.getContent().replace(/([^\\])\n/g, '$1');

    editor.selection.moveToBookmark(openingSelection.bookmark);
    editor.execCommand('mceInsertContent', false, openingTag + content + '{fws}');
    editor.selection.moveToBookmark(openingSelection.bookmark);
};
