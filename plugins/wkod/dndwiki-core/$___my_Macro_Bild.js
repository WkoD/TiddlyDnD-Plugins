/*\
title: bild
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "bild";

exports.params = [
   { name: "title" },
   { name: "parent" }
];

/*
Run the macro
*/
exports.run = function(title, parent) {
   var tiddler = this.wiki.getTiddler(title);
   var ptiddler = this.wiki.getTiddler(parent);

   var ret = "";

   if (tiddler && tiddler.fields.bild) {
      var images = tiddler.fields.bild.split(",");

      for (var i = 0; i < images.length; ++i) {
         ret += buildPath(tiddler, ptiddler, images[i]);
      }
   }

   return ret;
};

function buildPath(tiddler, ptiddler, name) {

   var ret ="[img[images/";

   if (tiddler.hasTag("Ereignis")) {
      ret += "Ereignis/";
   } else if (tiddler.hasTag("Artefakt") || tiddler.hasTag("Buch") || tiddler.hasTag("Gegenstand") || tiddler.hasTag("Material")) {
      ret += "Gegenstand/";
   } else if (tiddler.hasTag("Karte")) {
      ret += "Karte/";
   } else if (tiddler.hasTag("Organisation")) {
      ret += "Organisation/";
   } else if (tiddler.hasTag("Ort")) {
      ret += "Ort/";
   } else if (tiddler.hasTag("Person") || tiddler.hasTag("Gott")) {
      ret += "Person/";
   } else if (tiddler.hasTag("Spieler")) {
      ret += "Spieler/";
   } else if (ptiddler) {
      return buildPath(ptiddler, null, name);
   } else {
	  return "";
   }

   return ret + name + "]]";
};

})();