# docs_gm
> The fantastic documentation generator for GameMaker:Studio and GameMaker Studio 2

-----


[TOC]



## ✅ Features

- Supports both GMS1 and GMS2 projects.
- It's Multiplatform! Windows, OSX and Linux supported.
- Easily customizable template engine.
- OnePage and Multipage documentations.
- Supports a lot of JSDoc tags!


----------


## ☁️ Installation

Install [Node JS from the official website](https://nodejs.org/).
Then open the windows console and install it with the following command:
```bash
npm install -g docs_gm
```
To view the HELP of docs_gm run the program without arguments:
```bash
docs_gm
```

----------


## ❓ How to use it


### First: Document your project
You will need to document your scripts following JSDoc syntax. You can learn more about in the [official JSDoc website](http://usejsdoc.org/)

For example:  In the script `my_script`

```js
/// my_script(coffe_type, cokes_number [, clean_after_work]);
/**
 * This script will do a lot of things. Like make
 * coffe, and bake a cake. It will return the
 * index of the generated breakfast.
 *
 * @param coffe_type {string} The type of coffee
 * you want
 * @param cakes_number {integer} The number of cakes
 * to bake.
 * @param [clean_after_work] {boolean} Specify if the
 * table must be cleaned after the baking process.
 * The default is true.
 *
 * @returns {Cake} The index of the generated
 * breakfast.
 */

if (argument[0] === "latte") {
   // your code here...
   // blah blah blah
   // more code
}
```
docs_gm supports both `/// triple slash comments` and `/** JSDoc single line and multiline comments */`

The following JSDoc tags are supported by gm_docs:

- [`@description`, `@desc`, and inline description (like the above example)](http://usejsdoc.org/tags-description.html)
- [`@param`, `@arg`, `@argument`](http://usejsdoc.org/tags-param.html)
- [`@returns`, `@return`](http://usejsdoc.org/tags-returns.html)
- More tags will be supported in the next updates

### Second: Run gm_docs from the command line

Navigate to the directory you have your GameMaker project. For example, for GameMaker:
```bash
cd C:\Users\YOUR_USER\Documents\GameMaker\Projects\my-project-name
```
or for GameMaker:Studio 2 (windows)
```bash
cd C:\Users\YOUR_USER\Documents\GameMakerStudio2\my-project-name
```
To GENERATE the documentation for the current project run:
```bash
docs_gm generate
```


----------


## 📝Creating custom templates

A custom template is a folder composed by a `template.json`, one or more HTML file with a `*.njk` extension and all the resources files (CSS, Javascript, fonts, images, etc).

Example of a template folder:

- template.json
- index-onepage.njk
- index-multipage.njk
- script-multipage.njk
- css
	- bootstrap.css
	- styles.css
- js
	- main.js

Each ***template*** have multiple ***designs***. Each design is a variation of your template. *For example*, posible designs for one imaginary template are: `onepage-blue`, `onepage-orange`, `multipage-blue` and `multipage-orange`.  

### template.json

The `template.json` file describes your template, and each design that your template supports.
```json
{
    "author": "YOUR NAME",
    "description": "TEMPLATE SHORT DESCRIPTION",
    "web": "YOUR WEB OR GITHUB URL",
    "designs": [
        {
            "name": "onepage",
            "copy": ["css/**/*", "js/**/*"],
            "pages": [
                {"in": "index.njk", "out": "index.html", "feedwith": "scripts"}
            ]
        }
    ]
}
```

#### Template

- `"author"`: **{string}** (required)  Is your name, or the name of the person who made the template.
- `"description"`: **{string}** (required) A short template description.
- `"web"`: (required) {string} Your website URL or github/repo link
- `"designs"`: **{Design[]}** (required)  An array containing all the designs that this template Supports. Be sure to place the default design at the first element of the array.

#### Design

 - `"name"`: **{string}** (required)  The name of the design. (All lower case, no spaces). Examples: `"onepage-blue"`, "`multipage-big-footer`", `"standard"`
 - `"copy"`: **{string}** (optional)  An array of files to copy for this design. The array can be a glob. More info about globs [here](https://github.com/isaacs/node-glob). You can also use [negated globs](https://github.com/sindresorhus/globby). If omited, the default for the `"copy"` will be `["./**/*", "!template.json", "*.njk", "!package.json"]`. (All files and folders will be copied except for template.json, package.json and all files with *.njk extension).
 - `"pages"`: **{Page[]}** (required)  An array with the pages of the documentation that needs to be processed with the template engine.

#### Page

- `"in"`: **{string}** (required)  The name of the input file. This file will be loaded by the template engine. Normally, your template pages will be html files, but with the extension `*.njk`, indicating that are [Nunjucks templates](https://mozilla.github.io/nunjucks/). Examples: `"index.njk"`, `"script.njk"`
- `"out"`: **{string}** (required)  The output filename. This is the name the file will have in the finished documentation. You can also place [Nunjucks tags](https://mozilla.github.io/nunjucks/templating.html) inside the output name to create dynamic names. More info about dynamic names, below. Examples: `"index.html"`, `"{{ page.script.name }}.html"`
- `"feedwith"`: **{string}** (required)  Specify what type of data needs docs_gm to provide or feed to your template page. More info about supported `"feedwith"` types below.


### Template Pages

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

#### DocPage
The DocPage represents a single page of your Documentation.  It has the following properties:

- `project`: **{ DocProject }** The DocProject object representing the GameMaker Project that you are creating the documentation for.
- `script`: **{DocScript}** A DocScript object representing the SINGLE script your must document in the current template page. This is only used in multipage templates. The `script` property is only available when you set the value of `"feedwith": "script"` in your `template.json` file.
- `scripts`: **{DocScript}** An array of DocScript objects representing ALL the scripts script your must document in the current template page. This is only used in singlepage templates. The `script` property is only available when you set the value of `"feedwith": "scripts"` in your `template.json` file.

**NOTE: Only `script` or `scripts` will be available at the same time. This is determined by the value of `"feedwith"` in your `template.json` file.**


#### DocProject

Represents the current GameMaker project that you are documenting. This object has the following properties:

- `name` **{string}** The name of the GameMaker project in a readable format. You can use it for titles, or descriptions inside your documentation.
- `scripts` **{ DocScript[] }** An array of ALL the scripts of the project included in the documentation. **WARNING:** Normally you DON'T want to use this array, since this represents ALL the scripts in your **Project**, not the script or scripts you want to include in your **Page**. You must use the values of DocPage insted.


#### DocScript

Represents a single script of the GameMaker project.

- `name`: **{string}** The name of the script. Example: `"scr_character_jump"`.
- `description`: **{string}** The description of the script.
- `params` **{DocParam[]}** An array of DocParams objects. Representing each parameter or argument of the script.
- `returns` **{DocReturns}** A DocReturns object, representing the returned value of the script.
- `return` (Alias for `returns`)

#### DocParam

Represents a single parameter or argument of a script.

- `name`: **{ string }** The name of the argument.
- `type`: **{ string }** The type of the argument.
- `description` **{string}** The description of the argument
- `optional`: **{{ boolean }}** `true` or `false` depending if the argument is marked as optional, or not.

#### DocReturns

Represents a returned value of a script.

- `type`:  **{string}** The type of the returned value.
- `description`:  **{string}** The description of the returned value


#### Examples

***Coming soon...***
