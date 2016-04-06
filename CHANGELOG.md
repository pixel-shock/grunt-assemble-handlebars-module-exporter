# CHANGELOG

## v0.2.8 - 2016-04-06
* **fixed** Slash / Backslash problem between unix/win systems
* *added** grunt-contrib-clean to cleanup the `tests/fixtures` directory

## v0.2.7 - 2016-03-11
* **improved** performance for searching depending files
* **removed** option `dependingFilesSrc` and replaced it with `dependingFilesSearchPaths`
	* you can now use `glob` patterns for the search paths
* **optimized** the tests

## v0.2.6 - 2016-03-11
* **removed** `findup-sync` to find modules and depending files ... now using `glob`

## v0.2.5 - 2016-03-10
* **added** `grunt-tasks` & `Gruntfile.js` to `.npmignore`

## v0.2.4 - 2016-03-10
* **added** `.npmignore` file to exclude the unnecessary stuff

## v0.2.3 - 2016-03-10
* **added** tests
* **added** [veams](http://www.veams.org/) as test-base
* **fixed** path resolve issues for depending files
* **removed** deletion of the export directory ... please use `grunt-contrib-clean` or an other tool to clean that directory
* **added** travis-ci for tests

## v0.2.2 - 2016-03-10
* **removed** `grunt.file.setBase` statements due to grunt plugin guidelines

## v0.2.1 - 2016-03-09
* **improved** performance ... removed duplicates of found regex

## v0.2.0 - 2016-03-09
* **switched** to `glob` to include the `baseDependencies` instead of search through the whole project
	* **Please take a look at the changed defaults!**

## v0.1.0 - 2016-03-08
* **added** CHANGELOG
* **changed** README
* **changed** naming from ```_``` to ```-```
	* please change your grunt task config<br>**from** ```assemble_handlebars_module_exporter``` **to** ```assemble-handlebars-module-exporter```
* **renamed** "sublime-snippets" to "snippets" and created subfolder "sublime-text-3"
	* **PLEASE FEEL FREE TO CREATE SNIPPETS FOR OTHER EDITORS & CREATE A PULL REQUEST**


## v0.1.0 - 2016-03-08
* initial release
