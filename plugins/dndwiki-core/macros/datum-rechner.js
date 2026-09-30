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
   var library = require("$:/plugins/dndwiki-core/macros/library");
   var date = library.parseDatum(datum);
   var result = "";

   // Ungueltiges Datum -> leer (der Kalender-Rechner zeigt dann nichts statt "0")
   if (!date) {
      return "";
   }

   // Ueber die laufende Tagesnummer rechnen: Feiertage und Shieldmeet zaehlen automatisch
   // richtig mit, in beide Richtungen (die fruehere Monatsschleife landete rueckwaerts vom
   // Shieldmeet im Folgemonat)
   var neu = library.getDatumAusNummer(library.getTagNummer(date.year, date.month, date.day) + (parseInt(tage, 10) || 0));
   var year = neu.year;
   var month = neu.month;
   var day = neu.day;

   result += year.toString();
   result += "-";
   result += month > 9 ? month.toString() : "0" + month.toString();
   result += "-";
   result += day > 9 ? day.toString() : "0" + day.toString();

   // Uhrzeit o. Ae. unveraendert wieder anhaengen
   if (date.rest) {
      result += "-" + date.rest;
   }

   return result;
};

})();