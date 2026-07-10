/*\
title: multitag.js
type: application/javascript
module-type: filteroperator

Filter operator for checking for the presence of a tag

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.multitag = function(source,operator,options) {
    var results = [];
	var tags = operator.operand.split(",");

    for (var i = 0; i < tags.length; ++i) {
		// Returns empty results if operator.operand is missing
		var tiddlers = options.wiki.getTiddlersWithTag(tags[i]);
		source(function(tiddler,title) {
			if(tiddlers.indexOf(title) !== -1) {
				results.push(title);
			}
		});
		results = options.wiki.sortByList(results,tags[i]);
    }
    return results;
};

})();