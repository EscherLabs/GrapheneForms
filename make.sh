#! /bin/bash
cat src/js/gform.js src/js/types.js src/js/conditions.js src/js/validate.js > bin/gform.js
minify src/js/gform.js src/js/types.js src/js/conditions.js src/js/validate.js > bin/gform.engine.min.js 
minify bin/gform.engine.min.js src/js/themes/default.js > bin/default/gform.min.js 
minify bin/gform.engine.min.js src/js/themes/bootstrap.js > bin/bootstrap/gform_bootstrap.min.js 
minify src/js/themes/default.js > bin/default/default.theme.min.js
minify src/js/themes/bootstrap.js > bin/bootstrap/bootstrap.theme.min.js
cat bin/gform.js src/js/themes/bootstrap.js > bin/bootstrap/gform_bootstrap.js 

# minify bin/gform.engine.min.js src/js/themes/bulma.js > bin/gform_bulma.min.js 
# minify bin/gform.engine.min.js src/js/themes/skeleton.js> bin/gform_skeleton.min.js 
# minify bin/gform.engine.min.js src/js/themes/milligram.js > bin/gform_milligram.min.js
# cp src/js/themes/* bin/
cp src/js/themes/bootstrap.js bin/bootstrap/
cp src/js/themes/default.js bin/default/
cp bin/* docs/assets/js/
cp bin/default/* docs/assets/js/
cp bin/bootstrap/* docs/assets/js/

sass src/scss/gform.scss > docs/assets/css/gform.css 
minify docs/assets/css/gform.css > docs/assets/css/gform.min.css 

node ../charge/charge.js src/_docs/
node ../charge/charge.js src/_examples/