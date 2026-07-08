/*\
title: datumrechner
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "datumrechner";

exports.params = [
   { name: "datum" },
   { name: "tage" }
];

/*
Run the macro
*/
exports.run = function(datum, tage) {
   var date = datum.split("-");
   var days = parseInt(tage);
   var result = "";

   if (date.length !== 3) {
      return "0";
   }
   
   var year = parseInt(date[0]);
   var month = parseInt(date[1]);
   var day = parseInt(date[2]);
   
   var remaining = parseInt(tage);
   
   while (remaining != 0) {
      // brechne Tage für aktuellen Monat
      var monthdays = require("$:/_my/Macro/Library").getTageFuerMonat(year, month, remaining);

      // prüfe auf Monatsüberschlag
      if ((day + remaining) > monthdays) {
         remaining -= monthdays;
         month++;
      } else if ((day + remaining) < 1) {
         remaining += monthdays;
         month--;
      } else {
         day += remaining;
         remaining = 0;
      }
      
      // aktualisiere Monat und Jahr
      if (month > 12) {
         month = 1;
         year++;
      } else if (month < 1) {
         month = 12;
         year--;
      }
   }
   
   result += year.toString();
   result += "-";
   result += month > 9 ? month.toString() : "0" + month.toString();
   result += "-";
   result += day > 9 ? day.toString() : "0" + day.toString();
   
   return result;
};

})();