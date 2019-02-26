#! /bin/bash
cat src/js/gform.js src/js/gform.types.js src/js/gform.conditions.js src/js/gform.validate.js > bin/gform.js 
minify src/js/gform.js src/js/gform.types.js src/js/gform.conditions.js src/js/gform.validate.js > bin/gform.min.js 
minify src/js/gform.js src/js/gform.types.js src/js/gform.conditions.js src/js/gform.validate.js > docs/assets/js/gform.min.js
sass src/scss/gform.scss > docs/assets/css/gform.css 