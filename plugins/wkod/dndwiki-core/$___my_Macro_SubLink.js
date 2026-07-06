/*\
title: sublink
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "sublink";

exports.params = [
   { name: "title"},
   { name: "sub" },
   { name: "style" }
];

/*
Run the macro
*/
exports.run = function(title, sub, style) {
   var tiddler = this.wiki.getTiddler(title + "/" + sub);
   var ret = "";

   if (tiddler) {
	  if (style) {
		 ret += style;
	  }
	  
	  ret += "[[" + sub + "|" + tiddler.fields.title + "]]";
	  
	  if (style) {
		 ret += style;
	  }
   }
   
   return ret;
};

})();