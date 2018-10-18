#! /bin/bash
minify src/carbon.js src/carbon.events.js src/carbon.conditions.js src/carbon.validate.js src/carbon.skeleton.js > bin/carbon.min.js 
minify src/carbon.js src/carbon.events.js src/carbon.conditions.js src/carbon.validate.js > docs/assets/js/carbon.min.js