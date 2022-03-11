#! /bin/bash
cat src/js/gform.js src/js/types.js src/js/utils.js src/js/iterations.js src/js/init.js src/js/conditions.js src/js/validate.js > bin/gform.js
cat src/js/gform.js src/js/types.js src/js/utils.js src/js/iterations.js src/js/init.js src/js/conditions.js src/js/validate.js > bin/gform.engine.min.js 
cat bin/gform.engine.min.js src/js/themes/default.js > bin/default/gform.min.js 
cat bin/gform.engine.min.js src/js/themes/bootstrap.js src/js/types/combobox.js > bin/bootstrap/gform_bootstrap.min.js 
cat src/js/themes/default.js > bin/default/default.theme.min.js
cat bin/gform.js src/js/themes/bootstrap.js src/js/types/combobox.js > bin/bootstrap/gform_bootstrap.js 
cat src/js/themes/bootstrap.js src/js/types/combobox.js > bin/bootstrap/bootstrap.theme.min.js
cat bin/gform.js  src/js/themes/default.js > bin/default/gform_default.js
cat bin/gform.engine.min.js src/js/themes/tailwind.js > bin/tailwind/gform_tailwind.min.js 
# minify bin/gform.engine.min.js src/js/themes/bulma.js > bin/gform_bulma.min.js 
# minify bin/gform.engine.min.js src/js/themes/skeleton.js> bin/gform_skeleton.min.js 
# minify bin/gform.engine.min.js src/js/themes/milligram.js > bin/gform_milligram.min.js




# cp src/js/themes/* bin/
cp src/js/themes/bootstrap.js bin/bootstrap/
cp src/js/types/combobox.js bin/bootstrap/
cp src/js/themes/default.js bin/default/
cp src/js/themes/tailwind.js bin/tailwind/
cp bin/* docs/assets/js/
cp src/js/types/combobox.js docs/assets/js/

cp bin/default/* docs/assets/js/
cp bin/bootstrap/* docs/assets/js/
cp bin/tailwind/* docs/assets/js/
cp bin/default/gform_default.js docs/assets/js/gform_default.js
cp bin/default/gform.min.js docs/assets/js/gform.min.js


sass src/scss/gform.scss > docs/assets/css/gform.css 
cat docs/assets/css/gform.css > docs/assets/css/gform.min.css 

node ../charge/charge.js src/_docs/
node ../charge/charge.js src/_examples/