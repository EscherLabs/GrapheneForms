#! /bin/bash
minify src/gform.js src/gform.types.js src/gform.conditions.js src/gform.validate.js src/gform.skeleton.js > bin/gform.min.js 
minify src/gform.js src/gform.types.js src/gform.conditions.js src/gform.validate.js > docs/assets/js/gform.min.js