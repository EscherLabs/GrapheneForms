#! /bin/bash
cat src/js/gform.js src/js/types.js src/js/conditions.js src/js/validate.js > bin/gform.js
minify src/js/gform.js src/js/types.js src/js/conditions.js src/js/validate.js > bin/gform.engine.min.js 
minify bin/gform.engine.min.js src/js/themes/default.js > bin/gform.min.js 
minify bin/gform.engine.min.js src/js/themes/bootstrap.js > bin/gform_bootstrap.min.js 
minify bin/gform.engine.min.js src/js/themes/bulma.js > bin/gform_bulma.min.js 
minify bin/gform.engine.min.js > bin/gform_skeleton.min.js 
minify bin/gform.engine.min.js src/js/themes/milligram.js > bin/gform_milligram.min.js
minify src/js/themes/default.js > bin/default.theme.min.js
cp src/js/themes/* bin/

cp bin/* docs/assets/js/
sass src/scss/gform.scss > docs/assets/css/gform.css 