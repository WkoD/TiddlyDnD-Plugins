/*\
title: taglink
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "taglink";

exports.params = [
   { name: "title" },
   { name: "tag" },
   { name: "style" }
];

/*
Run the macro
*/
exports.run = function(title, tag, style) {
   var tiddler = this.wiki.getTiddler(title);

   if (tiddler && tiddler.hasTag(tag)) {
	  if (style) {
		 return style + "[[" + title + "]]" + style;
	  } else {
         return "__[[" + title + "]]__";
	  }
   } else {
      return "[[" + title + "]]";
   }
};

})();