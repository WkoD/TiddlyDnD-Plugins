/*\
title: totlink
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "totlink";

exports.params = [
   { name: "title" },
   { name: "style" }
];

/*
Run the macro
*/
exports.run = function(title, style) {
   var tiddler = this.wiki.getTiddler(title);
   var dead = false;

   if (tiddler && tiddler.fields.datum) {
	  for (var i = 0; i < tiddler.fields.datum.length; i++) {
		 if (tiddler.fields.datum.charAt(i) === '.') {
			 dead = true;
		 }
	  }
   }
   
   if (dead === true) {
	  if (style) {
		 return style + "[[" + title + "]]" + style;
	  } else {
         return "~~[[" + title + "]]~~";
	  }
   } else {
      return "[[" + title + "]]";
   }
};

})();