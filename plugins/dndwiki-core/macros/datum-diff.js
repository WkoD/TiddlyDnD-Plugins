/*\
title: datumdiff
type: application/javascript
module-type: macro
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "datumdiff";

exports.params = [
   { name: "von" },
   { name: "bis" }
];

/*
Run the macro: Tage zwischen zwei Daten im Kalender von Harptos (leer bei ungueltigem Datum)
*/
exports.run = function(von, bis) {
   var tage = require("$:/plugins/dndwiki-core/macros/library").getTageZwischen(von, bis);

   return tage === null ? "" : tage.toString();
};

})();
