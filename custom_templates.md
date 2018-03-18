# 📝Creating custom templates

A custom template is a npm package composed by a `template.json`, one or more HTML file with a `*.njk` extension and all the resources files (CSS, Javascript, fonts, images, etc).

Example of a template folder:

- package.json
- template.json
- src/
  - index.njk
  - folder.njk
  - script.njk
- css/
  - bootstrap.css
  - styles.css
- js/
  - main.js

Each ***template*** have multiple ***designs***. Each design is a variation of your template. *For example*, possible designs for one imaginary template are: `onepage-blue`, `onepage-orange`, `multipage-blue` and `multipage-orange`.

## Creating a package.json file

First, create a folder named `docs_gm-YOURTEMPLATENAME`. For example: if your template name is `red-wave`, then your folder name (and package name) must be `docs_gm-red-wave`. And from the comand line:

```bash
npm init
```

Follow the instructions.

- The `name` of the package must be your folder name. For example: `docs_gm-red-wave`.
- The `main` file must be `template.json`.
- In the `keywords` section, add at least one keyword that is `docs_gm`.
- All the other values can be anything you want.

> When you **FINISH** creating your template following this document, then you can use `npm publish` to publish the template on the npm registry.

> If you want to test your template while you are developing it, use `npm link` to simulate that your package is installed on the system.

Then, create your template.json file:

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
            "index": "src/index.njk",
            "folder": "src/folder.njk",
            "script": "src/script.njk",
        }
    }
}
```

### Template

- `"author"`: **{string}** (required)  Is your name, or the name of the person who made the template.
- `"description"`: **{string}** (required) A short template description.
- `"web"`: **{string}** (required) Your website URL or github/repo link
- `"defaultDesign"`: **{string}** (required) The default design name for the Template. That is the design that `docs_gm` should use if no design is specified.
- `"designs"`: **{ DesignMap }** (required)  An object containing all the designs that this template Supports.

### DesignMap

Each key in the design map the name of one different design. Each value is an object with the design data.
In the above example, the template has only one design named `onepage`.

### Design

- `"displayName"`: **{string}** (required)  The display name of the design. It can be shown on the screen. Examples: `"My super awesome design"`. Try to avoid using the word "Design" in the name.
- `"copy"`: **{string}** (optional)  An array of files to copy for this design. The array can be a glob. More info about globs [here](https://github.com/isaacs/node-glob). You can also use [negated globs](https://github.com/sindresorhus/globby). If omitted, the default for the `"copy"` will be `["**/*", "!template.json", "!*.njk", "!package.json"]`. (All files and folders will be copied except for template.json, package.json and all files with *.njk extension).
- `"pages"`: **{Page[]}** (required)  An array with the pages of the documentation that needs to be processed with the template engine.
- `"index"`: **{string}** (required) The path of the *.njk file that will be used as the index.html file for that design.
- `"folder"`: **{string}** (optional) The path of the *.njk file that will be used, if required, to render the page for a Game Maker folder page.
- `"script"`: **{string}** (optional) The path of the *.njk file that will be used, if required, to render the page for a Game Maker Script page.
- `"resource"`: **{string}** (optional) The path of the *.njk file that will be used, if required, to render the page for a generic Game Maker Resource page. (Not used at the moment)

## Template Pages

Each page is a `*.njk` file, that is a simple HTML file that uses Nunjucks templating. You can name your template pages files however you want. If you want autocomplete options for Nunjucks tags in your text editor, you can [download your preferred editor plugin](https://mozilla.github.io/nunjucks/templating.html#syntax-highlighting).

> **INFO**: **docs_gm** provides a number of Templates you can inspect to learn about.

You can use any [tag supported by Nunjucks](https://mozilla.github.io/nunjucks/templating.html) inside you HTML:

```html
<h1>Welcome to the {{ project.name }} documentation!</h1>
```

Will be rendered as:

```html
<h1>Welcome to the My Awesome Project documentation!</h1>
```

For example, if you want to show a list with all the scripts names in a OnePage Design to create for example a Table of contents, you can use:

```html
<h1>Table of contents</a>
<ul>
    {% for script in project.scripts.all %}
        <li>
            <a href="#{{ script.name }}">{{ script.name }}</a>
        </li>
    {% endfor %}
</ul>
```

As you can see, you can iterate over an array to access all the scripts.

### DocPage

The DocPage represents a single page of your Documentation.  It has the following properties:

- `project`: **{DocProject}** The DocProject object representing the GameMaker Project that you are creating the documentation for. **Its available only when docs_gm is rendering the "index" page defined on your template.json file.**
- `script`: **{DocScript}** A DocScript object representing the SINGLE script your must document in the current template page. You will only use this if you are making a multipage template. **Its available only when docs_gm is rendering the "script" page defined on your template.json file.**
- `folder`: **{DocFolder}** A DocFolder object representing the SINGLE Folder your must document in the current template page. You will only use this if you are making a multipage template. **Its available only when docs_gm is rendering the "folder" page defined on your template.json file.**
- `resource`: **{DocResource}** A DocResource object representing the SINGLE generic game maker resource (not a folder nor a script) that your must document in the current template page. You will only use this if you are making a multipage template. **Its available only when docs_gm is rendering the "resource" page defined on your template.json file.**
- `linkTo(docElement)` **{Function}** This function is available in all the njk files rendered with docs_gm. Check below for more info about `linkTo` function.

### DocProject

Represents the current GameMaker project that you are documenting. This object has the following properties:

- `name`: **{string}** The name of the GameMaker project in a readable format. You can use it for titles, or descriptions inside your documentation.
- `scripts`: **{DocFolder}** The GameMaker "scripts" resource tree folder.

### DocResource

Base type that represents a generic game maker resource (or folder) on the project

- `type`: **{string}** It will the type of resource. If for some reason `docs_gm` have troubles identifying the type of the resource the value will be `"resource"`.
- `name`: **{string}** The name of the resource. Examples: `"spr_wall"`, `"my_super_folder"`, `"scr_walljump"`.
- `parent` **{ DocFolder | null }** The parent folder. For the base folder (for example the base "script" folder), this value is null.

### DocFolder

> DocScript extends DocResource

Represents a single GameMaker folder or subfolder on the resource tree.

- `type`: **{string}** It will be allways the value `"folder"`.
- `name`: **{string}** The name of the folder. Example: `"my_folder_name"`.
- `parent` **{ DocFolder | null }** The parent folder. For the base folder (for example the base "script" folder), this value is null.
- `description`: **{string}** The description of the folder if present. (The default is an empty string `""`). See the `@module` tag for more info about folder descriptions. (Not implemented at the moment)
- `children`: **{DocResource[]}** An array with all the direct children of that folder.
- `all`: **{DocResource[]}** Returns an array that contains ALL the DocResources including NESTED resources recursively. For example. If you have a parent folder with a script1 and a subfolder with script2 and script3, `parentFolder.all` will return `[DocScript (script1), DocScript (script2), DocScript (script3)]`

### DocScript

> DocScript extends DocResource

Represents a single script of the GameMaker project.

- `type`: **{string}** It will be allways the value `"script"`.
- `name`: **{string}** The name of the script. Example: `"scr_character_jump"`.
- `parent` **{ DocFolder }** The parent folder.
- `description`: **{string}** The description of the script.
- `params`: **{DocParam[]}** An array of DocParams objects. Representing each parameter or argument of the script.
- `returns`: **{DocReturns | null}** A DocReturns object, representing the returned value of the script. (or null if the script has no `@returns` documentation)
- `examples`: **{DocExample[]}** An array of DocExample objects. Representing each usage example code provided for the script.
- `private`: **{boolean}** `true` or `false` depending if the script is a private script or not (can be marked with the @private JSDoc or with a script name starting with underscore).
- `undocumented`: **{boolean}** `true` if is undocumented script, `false` if not.
- `function`: **{string}** The function name. Is declared in the documentation with the `@function` tag. Normally, is the same as the `name`.

### DocParam

Represents a single parameter or argument of a script.

- `name`: **{string}** The name of the argument.
- `type`: **{string}** The type of the argument.
- `description`: **{string}** The description of the argument
- `optional`: **{boolean}** `true` or `false` depending if the argument is marked as optional, or not.

### DocReturns

Represents a returned value of a script.

- `type`:  **{string}** The type of the returned value.
- `description`:  **{string}** The description of the returned value

### DocExample

Represents a single script usage Example

- `code`: **{string}** The code for the Example
- `caption`: **{string}** The example caption (not supported for now, wait for a next update)

## LinkTo(docElement) function

This global function is available in any nunjucks template file rendered with `docs_gm`.

You can pass a DocElement object (DocScript, DocFolder or DocProject) and it will generate a relative link to that resource, and will tell docs_gm that you want to render an HTML page for that resource.

For example:

```html
    {# Prints the table of contents #}
    <ul id="table-of-contents">

    {# Loops over each direct child resource on the base "scripts" folder in the project #}

    {% for resource in project.scripts.children %}

        <a href="{{ linkTo(resource) }}"><li>{{ resource.name }}</li></a>

    {% endfor %}

    </ul>
```

When `linkTo(resource)` it will do two things:

- Will generate and return a relative link to the html page for the given resource.
- It will tell the docs_gm system that you want to render another HTML page for that given resource.

The njk file used to render the HTML page for the given resource will be determined by the resource type, (script, folder, project...) and the design configuration on the `template.json` file.

For example if you set:

```json
    "index": "my-index.njk",
    "script": "my-script.njk",
    "folder": "my-folder.njk"
```

And from `my-index.njk` you call `linkTo`:

```html
   <a href="{{ linkTo(project.scripts.children[0]) }}">Link</a>
```

Assuming that the first children in the scripts folder on your project is another folder then a new page will be rendered using the `my-folder.njk` file.

## Using custom templates from NPM (recommended)

If you want to download a custom template made by another, simply find the template you want to use (Must be published as an npm package) and install it globally with:

```bash
npm install --global docs_gm-my-template-name
```

Then you can use `"template": "my-template-name"` from your `docs_gm.json` file, or change it from the console with:

```bash
docs_gm generate --template my-template-name
```

## Using custom templates locally from a folder

To use a custom template from a folder locally, create a folder named templates and place all the custom templates folder inside. Example:

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
