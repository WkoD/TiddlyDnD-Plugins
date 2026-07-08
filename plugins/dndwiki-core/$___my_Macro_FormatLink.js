/*\
title: formatlink
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "formatlink";

exports.params = [
   { name: "title" },
   { name: "defaulttitle" },
   { name: "style" }
];

/*
Run the macro
*/
exports.run = function(title, defaulttitle, style) {
   var result = "";

   var titles = title.split(",");
   
   if (titles) {
      for (var i = 0; i < titles.length; ++i) {
		  
		 if (i > 0) {
		    if ((i + 1) === titles.length) {
			   result += " und ";
			} else {
			   result += ", ";
			}
		 }
		 
		 var entry = titles[i].split("/");
		 
		 for (var j = 0; j < entry.length; ++j) {
			 
			if (j > 0) {
			   result += " (";
			}
		  
            var tiddler = this.wiki.getTiddler(entry[j]);

            if (tiddler) {
               result += "[[" + entry[j] + "]]";
            } else {
               result += entry[j];
            }
			
			if (j > 0) {
			   result += ")";
			}
		 }
	  }
   } else {
      result = defaulttitle;
   }

   if (style) {
      return style + result + style;
   } else {
      return result;
   }
};

})();