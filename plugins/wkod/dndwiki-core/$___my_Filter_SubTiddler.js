/*\
title: subtiddler
type: application/javascript
module-type: filteroperator

Filter operator for finding tiddlers with specific subtiddlers.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.subtiddler = function(source,operator,options) {
   var results = [];
   var subname = (operator.operand || "Notiz");
   
   source(function(tiddler,title) {
      if(tiddler) {
	     var subtiddler = options.wiki.getTiddler(title + "/" + subname);
		 if (subtiddler) {
		    results.push(title);
		 }
	  }
   });
   
   return results;
};

})();
