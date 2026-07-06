/*\
title: edgetype
type: application/javascript
module-type: filteroperator

Filter operator for tiddlers linking to given tiddler having specified edge type.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.edgetype = function(source,operator,options) {
   var results = [];
   var type = "\"" + (operator.suffix || "unknown") + "\"";
   
   if (!operator.operand) {
      return results;
   }
   
   var id = "\"" + options.wiki.getTiddler(operator.operand).getFieldString("tmap.id") + "\"";
   
   source(function(tiddler,title) {
	  if(tiddler && tiddler.fields) {
		 var edgefield = tiddler.getFieldString("tmap.edges");
		 
		 if (edgefield) {
			var edges = edgefield.split("},");
			
			for (var i = 0; i < edges.length; ++i) {
			   if (edges[i].indexOf(id) !== -1 && edges[i].indexOf(type) !== -1) {
				  results.push(title);
			   }
			}
		 }
	  }
   });
   
   return results;
};

})();