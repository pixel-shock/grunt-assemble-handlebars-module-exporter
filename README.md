# grunt-assemble-handlebars-module-exporter

> A grunt plugin that extracts modules from html markup based on regular expressions

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

In Future:
```shell
npm install grunt-assemble-handlebars-module-exporter --save-dev
```

Currently:
Add the follwing line to your ```package.json```
```json
"grunt-assemble-handlebars-module-exporter": "git+https://github.com/pixel-shock/grunt-assemble-handlebars-module-exporter.git#v0.1.0"
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-assemble-handlebars-module-exporter');
```

## The "assemble-handlebars-module-exporter" task

### Overview
In your project's Gruntfile, add a section named `assemble-handlebars-module-exporter` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	'assemble-handlebars-module-exporter': {
			// Target-specific file lists and/or options go here.
			'your_target': {
				// Setting up your options
				'options': {
					// Take a look into the "defaults.js" file within the package
				}
			}
		}
	}
});
```

### Options

#### options.moduleStartRegex
**Type:** `RegEx`<br>
**Default value:** `/(<!--\s?START\s?(.*?.hbs)\s+(AS?\s?(.*?))?\s?(WITH?\s?(.*?))?-->)/gm`

A RegEx which is used to find the modules within the HTML code.

#### options.moduleEndSubstitutions
**Type:** `Array`<br>
**Default value:**

```
[ {
	'replace': 'START',
	'with': 'END'
} ]
```

An Array which defines the replacements in the "start" regex to build the "end" regex.

#### Example

```html
<!-- START b-branding.hbs WITH b-branding.css -->
```

will be converted to

```html
<!-- END b-branding.hbs -->
```


#### options.moduleSrc
**Type:** `String`<br>
**Default value:** `resources/templates/`

A String which defines the source directory for the modules (`.hbs` files for example).

#### options.moduleExportExtension
**Type:** `String`<br>
**Default value:** `.html`

A String which defines the export extension of the modules.

#### options.dependingFilesBasePath
**Type:** `String`<br>
**Default value:** `_output`

A String which defines the output directory of assemble. The Task searches the depending files in this directory.

#### options.dependingFilesSrc
**Type:** `Array`<br>
**Default value:**

```
[
	'js',
	'css',
	'img'
]
```

An Array which defines the directories within the `dependingFilesBasePath` which should be scanned for depending files.

#### options.baseDependencies
**Type:** `Object`<br>
**Default value:**

```
files: {
	'always': [
		'_output/fonts/**/*.*'
	],
	'byFileType': [
		'_output/js/config.js',
		'_output/js/app/jquery-extend.js',
		'_output/js/lib/jquery.js',
		'_output/js/lib/modernizr.js',
		'_output/css/base-styles.css',
		'_output/css/vendor.css'
	]
}
```
An Object which defines the base dependencies for each module.

`always` means that these files are always copied to the output folder of the module.

`byFileType` means that these files are copied if the file extensions dependencies in the module matching the base dependency.

### Comments in your modules

Take a look in the repository. I've included some sublime snippet files. Feel free to use them!

#### basic
```html
<!-- START b-footer.hbs -->
<div id="site-info" class="b-footer">
	<ul>
		{{#each items}}
			<li>{{#if link}}<a href="{{ link }}" title="{{ title }}">{{/if}}{{{ title }}}{{#if link}}</a>{{/if}}</li>
		{{/each}}
	</ul>
</div>
<!-- END b-footer.hbs -->
```

#### with `AS` option
```html
<!-- START b-footer.hbs AS b-footer-with-new-name -->
<div id="site-info" class="b-footer">
	<ul>
		{{#each items}}
			<li>{{#if link}}<a href="{{ link }}" title="{{ title }}">{{/if}}{{{ title }}}{{#if link}}</a>{{/if}}</li>
		{{/each}}
	</ul>
</div>
<!-- END b-footer.hbs -->
```


#### with `WITH` option
<!-- START b-footer.hbs WITH footer.css,footer.js,footer-logo.png -->
<div id="site-info" class="b-footer">
	<ul>
		{{#each items}}
			<li>{{#if link}}<a href="{{ link }}" title="{{ title }}">{{/if}}{{{ title }}}{{#if link}}</a>{{/if}}</li>
		{{/each}}
	</ul>
</div>
<!-- END b-footer.hbs -->
```



#### with `AS` and `WITH` option
```html
<!-- START b-footer.hbs AS b-footer-with-new-name WITH footer.css,footer.js,footer-logo.png -->
<div id="site-info" class="b-footer">
	<ul>
		{{#each items}}
			<li>{{#if link}}<a href="{{ link }}" title="{{ title }}">{{/if}}{{{ title }}}{{#if link}}</a>{{/if}}</li>
		{{/each}}
	</ul>
</div>
<!-- END b-footer.hbs -->
```
