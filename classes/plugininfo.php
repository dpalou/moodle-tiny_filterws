<?php
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

namespace tiny_filterws;

use context;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_menuitems;
use editor_tiny\plugin_with_configuration;

/**
 * Tiny Filter WS plugin for Moodle.
 *
 * @package    tiny_filterws
 * @copyright  2022 Dani Palou <dani@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugininfo extends plugin implements
    plugin_with_buttons,
    plugin_with_menuitems,
    plugin_with_configuration {

    public static function get_available_buttons(): array {
        return [
            'tiny_filterws/filterws',
        ];
    }

    public static function get_available_menuitems(): array {
        return [
            'tiny_filterws/filterws',
        ];
    }

    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): array {
        // List of predefined filters.
        $predefined = [];
        $predefinedstr = get_config('tiny_filterws', 'predefined');

        if ($predefinedstr) {
            $entries = preg_split('/\r\n|\r|\n/', $predefinedstr);

            foreach ($entries as $entry) {
                $fields = explode('|', $entry);

                if (count($fields) < 2) {
                    continue;
                }

                $predefined[] = [
                    'name' => $fields[0],
                    'origin' => $fields[1],
                    'useragent' => $fields[2]
                ];
            }
        }

        return [
            'predefinedfilters' => $predefined,
        ];
    }
}
