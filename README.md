TinyMCE button for WebService filter plugin
====================================

This plugin makes it easier to include the WebService filter tags in the content while using the TinyMCE editor. It will add a new button in the TinyMCE toolbar (and also a new option in the Insert menu) to add these tags.

# To Install it manually #

- Unzip the plugin in the moodle .../lib/editor/tiny/plugins/ directory.

# To Use it #

- Once installed, a new button will appear in the toolbar and a new option will appear in the Insert menu of the TinyMCE editor.
- While creating/editing some content using the TinyMCE editor, select the text to filter and click the "WS" button.
- In the new dialog, select the Origin and the User Agent (optional) you want to apply to the filter.
- Click "Insert" and the tags will be added to the content.

# Predefined filters #

The site admin can create some predefined filters that users will be able to apply, that way they don't need to remember the Origin and User Agent to apply. By default, this plugin includes a predefined filter to display some content in the official Moodle app.

To define these predefined filters, go to "Site Administration >> Plugins >> Text editors >> WebService Filter settings >> Predefined filters".
