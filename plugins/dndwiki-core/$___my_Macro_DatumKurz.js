/*\
title: datumkurz
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "datumkurz";

exports.params = [
   { name: "datum" }
];

/*
Run the macro
*/
exports.run = function(datum) {
   var dates = datum.split(".");
   var date = dates[0].split("-");
   var result;

   var ret = "<td align=\"right\">";

   ret += date[0] + "</td><td align=\"center\">";

   if (date.length > 1) {
      result = require("$:/_my/Macro/Library").getMonatTag(date[1], date[2]);
   }

   if (result) {
      ret += result[0];
   }

   ret += "</td><td align=\"right\">";

   if (result && result.length > 1) {
      ret += result[1];
   } 

   return ret + "</td>";
};

})();