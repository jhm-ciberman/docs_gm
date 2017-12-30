# 📝Creating custom templates

A custom template is a folder composed by a `template.json`, one or more HTML file with a `*.njk` extension and all the resources files (CSS, Javascript, fonts, images, etc).

Example of a template folder:

- template.json
- index-onepage.njk
- index-multipage.njk
- script-multipage.njk
- css/
  - bootstrap.css
  - styles.css
- js/
  - main.js

Each ***template*** have multiple ***designs***. Each design is a variation of your template. *For example*, posible designs for one imaginary template are: `onepage-blue`, `onepage-orange`, `multipage-blue` and `multipage-orange`.

## template.json

The `template.json` file describes your template, and each design that your template supports.

```json
{
    "author": "YOUR NAME",
    "description": "TEMPLATE SHORT DESCRIPTION",
    "web": "YOUR WEB OR GITHUB URL",
    "defaultDesign": "onepage",
    "designs": {
        "onepage": {
            "displayName": "One Page Awesome",
            "copy": ["css/**/*", "js/**/*"],
            "pages": [
                {"in": "index.njk", "out": "index.html", "feedWith": "scripts"}
            ]
        }
    }
}
```

### Template

- `"author"`: **{string}** (required)  Is your name, or the name of the person who made the template.
- `"description"`: **{string}** (required) A short template description.
- `"web"`: **{string}** (required) Your website URL or github/repo link
- `"defaultDesign"`: **{string}** (required) The default design name for the Template
- `"designs"`: **{DesignMap}** (required)  An object containing all the designs that this template Supports.

### DesignMap

Each key in the design map the name of one different design. Each value is an object with the design data.

### Design

- `"displayName"`: **{string}** (required)  The display name of the design. It can be shown on the screen. Examples: `"My super awesome design"`. Try to avoid using the word "Design" in the name.
- `"copy"`: **{string}** (optional)  An array of files to copy for this design. The array can be a glob. More info about globs [here](https://github.com/isaacs/node-glob). You can also use [negated globs](https://github.com/sindresorhus/globby). If omited, the default for the `"copy"` will be `["**/*", "!template.json", "!*.njk", "!package.json"]`. (All files and folders will be copied except for template.json, package.json and all files with *.njk extension).
- `"pages"`: **{Page[]}** (required)  An array with the pages of the documentation that needs to be processed with the template engine.

### Page

- `"in"`: **{string}** (required)  The name of the input file. This file will be loaded by the template engine. Normally, your template pages will be html files, but with the extension `*.njk`, indicating that are [Nunjucks templates](https://mozilla.github.io/nunjucks/). Examples: `"index.njk"`, `"script.njk"`
- `"out"`: **{string}** (required)  The output filename. This is the name the file will have in the finished documentation. You can also place [Nunjucks tags](https://mozilla.github.io/nunjucks/templating.html) inside the output name to create dynamic names. More info about dynamic names, below. Examples: `"index.html"`, `"{{ page.script.name }}.html"`
- `"feedWith"`: **{string}** (required)  Specify what type of data needs docs_gm to provide or feed to your template page. More info about supported `"feedWith"` types below.

## Template Pages

Each page is a `*.njk` file, that is a simple HTML file that uses Nunjucks templating. You can name your template pages files however you want. If you want autocomplete options for Nunjucks tags in your text editor, you can [download your prefered editor plugin](https://mozilla.github.io/nunjucks/templating.html#syntax-highlighting).

**INFO**: **docs_gm** provides a number of Templates you can inspect to learn about.

You can use any [tag supported by Nunjucks](https://mozilla.github.io/nunjucks/templating.html) inside you HTML:

```html
<h1>Welcome to the {{ page.project.name}} documentation!</h1>
```

docs_gm will allways "feed" your templates with a **DocPage** object, **stored in the `page` variable.**

For example, if you want to show a list with all the scripts names in a OnePage Design to create for example a Table of contents, you can use:

```html
<h1>Table of contents</a>
<ul>
    {% for script in page.scripts %}
        <li>
            <a href="#{{ script.name }}">{{ script.name }}</a>
        </li>
    {% endfor %}
</ul>
```

As you can see, you can iterate over an array to access all the scripts.

### DocPage

The DocPage represents a single page of your Documentation.  It has the following properties:

- `project`: **{ DocProject }** The DocProject object representing the GameMaker Project that you are creating the documentation for.
- `script`: **{DocScript}** A DocScript object representing the SINGLE script your must document in the current template page. This is only used in multipage templates. The `script` property is only available when you set the value of `"feedWith": "script"` in your `template.json` file.
- `scripts`: **{DocScript}** An array of DocScript objects representing ALL the scripts script your must document in the current template page. This is only used in singlepage templates. The `script` property is only available when you set the value of `"feedWith": "scripts"` in your `template.json` file.

**NOTE: Only `script` or `scripts` will be available at the same time. This is determined by the value of `"feedWith"` in your `template.json` file.**

### DocProject

Represents the current GameMaker project that you are documenting. This object has the following properties:

- `name` **{string}** The name of the GameMaker project in a readable format. You can use it for titles, or descriptions inside your documentation.
- `scripts` **{ DocScript[] }** An array of ALL the scripts of the project included in the documentation. **WARNING:** Normally you DON'T want to use this array, since this represents ALL the scripts in your **Project**, not the script or scripts you want to include in your **Page**. You must use the values of DocPage insted.

### DocScript

Represents a single script of the GameMaker project.

- `name`: **{string}** The name of the script. Example: `"scr_character_jump"`.
- `description`: **{string}** The description of the script.
- `params` **{DocParam[]}** An array of DocParams objects. Representing each parameter or argument of the script.
- `returns` **{DocReturns}** A DocReturns object, representing the returned value of the script.
- `return` (Alias for `returns`)
- `examples` **{DocExample[]}** An array of DocExample objects. Representing each usage example code provided for the script.
- `private` **{boolean}** `true` or `false` depending if the script is a private script or not (can be marked with the @private JSDoc or with a script name starting with underscore).
- `undocumented` **{boolean}** `true` if is undocumented script, `false` if not.

### DocParam

Represents a single parameter or argument of a script.

- `name`: **{ string }** The name of the argument.
- `type`: **{ string }** The type of the argument.
- `description` **{string}** The description of the argument
- `optional`: **{ boolean }** `true` or `false` depending if the argument is marked as optional, or not.

### DocReturns

Represents a returned value of a script.

- `type`:  **{string}** The type of the returned value.
- `description`:  **{string}** The description of the returned value

### DocExample

Represents a single script usage Example

- `code`: **{string}** The code for the Example
- `caption`: **{string}** The example caption (not supported for now, wait for a next update)

## Using custom templates

To use a custom template create a folder named templates and place all the custom templates folder inside. Example:

- templates
  - super-template
    - template.json
  - another-custom-template
    - template.json
  - foo-template-name
    - template.json

Then, change in your `docs_gm.json` file, the `templatesFolder` path to point to your `templates` folder. Remember, if you are on Windows, you must escape the backslash `\\`. Example:

```json
    "templatesFolder": "C:\\my\\path\\template\\",
```

Then, you can change the Template name and design name to use your custom template:

```json
    "templateName": "super-template",
    "design": "red-onepage",
```
