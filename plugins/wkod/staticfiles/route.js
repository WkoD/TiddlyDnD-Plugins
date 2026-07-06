/*\
title: $:/plugins/wkod/staticfiles/route
type: application/javascript
module-type: route
\*/
"use strict";

exports.method = "GET";

exports.path = /^\/((?:images|data)\/.+)$/;

exports.handler = function(request,response,state) {
	var path = require("path"),
		fs = require("fs"),
		suppliedFilename = $tw.utils.decodeURIComponentSafe(state.params[0]),
		baseFilename = path.resolve(state.boot.wikiPath),
		filename = path.resolve(baseFilename,suppliedFilename),
		extension = path.extname(filename);
	// Sicherstellen, dass die Datei innerhalb des Wiki-Ordners liegt
	if(path.relative(baseFilename,filename).indexOf("..") !== 0) {
		fs.readFile(filename,function(err,content) {
			var status,type = "text/plain";
			if(err) {
				status = 404;
				content = "File '" + suppliedFilename + "' not found";
			} else {
				status = 200;
				type = ($tw.config.fileExtensionInfo[extension] ? $tw.config.fileExtensionInfo[extension].type : "application/octet-stream");
			}
			state.sendResponse(status,{"Content-Type": type},content);
		});
	} else {
		state.sendResponse(404,{"Content-Type": "text/plain"},"File '" + suppliedFilename + "' not found");
	}
};
