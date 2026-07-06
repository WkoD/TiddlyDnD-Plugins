/*\
title: datumlang
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "datumlang";

exports.params = [
   { name: "datum" },
   { name: "yearonly" }
];

/*
Run the macro
*/
exports.run = function(datum, yearonly) {
   var dates = datum.split(".");
   
   var dateStart = dates[0].split("-");
   var dateEnd = dates[dates.length - 1].split("-");
   var resultStart;
   var resultEnd;

   // Jahr setzen
   var ret = "//";

   if (!dateStart[0]) {
      ret += "????";
   } else {
      ret += dateStart[0];
   }
   
   if (dates.length > 1) { 
      if (!dateEnd[0]) {
         ret += " -  ????";
      } else if (dateStart[0] != dateEnd[0]) {
         ret += " - " + dateEnd[0];
      }
   }
   
   ret += " DR//<br>";
   
if (!yearonly) {
   // Monat und Tag setzen
   if (dateStart.length > 1) {
      ret += "//";
   
      resultStart = require("$:/_my/Macro/Library").getMonatTag(dateStart[1], dateStart[2]);

      if (resultStart[1]) {
         ret += resultStart[1] + ". ";
      }

      ret += resultStart[0];
	  
	  if (dateStart[3]) {
		 ret += " " + dateStart[3] + " Uhr";
	  }

      if (dates.length > 1) {
         var retEnd = "";
         resultEnd = require("$:/_my/Macro/Library").getMonatTag(dateEnd[1], dateEnd[2]);

         if (resultEnd[1] && (resultEnd[0] !== resultStart[0] || resultEnd[1] !== resultStart[1])) {
            retEnd += resultEnd[1] + ". ";
         }

         if (retEnd || resultEnd[0] !== resultStart[0]) {
            retEnd += resultEnd[0];
		 }
		  
		 if (dateEnd[3] && (retEnd || dateEnd[3] !== dateStart[3])) {
	        retEnd += " " + dateEnd[3] + " Uhr";
		 }
		 
		 if (retEnd) {
	        ret += " - " + retEnd;
		 }
      }
      
      ret += "//";
   }
}

   return ret;
};

})();