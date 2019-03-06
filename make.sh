#! /bin/bash
cat src/js/gform.js src/js/types.js src/js/conditions.js src/js/validate.js > bin/gform.js 
minify src/js/gform.js src/js/types.js src/js/conditions.js src/js/validate.js > bin/gform.min.js 
minify src/js/gform.js src/js/types.js src/js/conditions.js src/js/validate.js > docs/assets/js/gform.min.js
sass src/scss/gform.scss > docs/assets/css/gform.css 