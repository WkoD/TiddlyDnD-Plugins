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
   // Verstorben/zerstoert: Punkt im datum-Feld (vgl. dnd.tot in functions.tid)
   var dead = !!(tiddler && tiddler.fields.datum && tiddler.fields.datum.indexOf(".") !== -1);

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