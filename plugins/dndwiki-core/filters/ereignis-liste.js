/*\
title: ereignisliste
type: application/javascript
module-type: filteroperator

Filter operator for sorting

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.ereignisliste = function(source,operator) {
   var library = require("$:/plugins/dndwiki-core/macros/library");
   var result = prepare_results(source);
   var out = [];

   // sortiere Liste nach Datum
   result.sort(function(a, b) {
      var year = library.comparePropertyNumber(a.year, b.year);

      if (year === 0) {
         var month = library.comparePropertyNumber(a.month, b.month);

         if (month === 0) {
            var day = library.comparePropertyNumber(a.day, b.day);

            if (day === 0) {
               return a.order - b.order;
            } else {
                return day;
            }
         } else {
             return month;
         }
      } else {
          return year;
      }
   });

   // umgekehren für Tabellenberechnung
   if (operator.prefix !== "!") {
      result.reverse();
   }

   var lastresult = result[0];
   var yearmerge = 1;
   var monthmerge = 1;
   var daymerge = 1;
   var titlemerge = 1;
   var titleflag;

   for (var i = 0; i < result.length; ++i) {
      var entry = result[i + 1];
      var line = "<tr style=\"height: 1em\">";
      var same = false;
      var monattag = library.getMonatTag(lastresult.month, lastresult.day);

      // Jahr
      if (entry && entry.year === lastresult.year) {
         same = true;
         yearmerge++;
      } else {
         line += "<td align=\"right\" rowspan=\"" + yearmerge + "\">" + lastresult.year + "</td>";
         yearmerge = 1;
      }
      
      // Monat
      if (same && entry.month === lastresult.month && (entry.day <= 30 || entry.day === lastresult.day)) {
         monthmerge++;
      } else if (lastresult.month) {
         line += "<td align=\"center\" rowspan=\"" + monthmerge + "\">" + monattag[0] + "</td>";
         same = false;
         monthmerge = 1;
      } else {
         line += "<td rowspan=\"" + monthmerge + "\"></td>";
         same = false;
         monthmerge = 1;
      }
      
      // Tag
      if (same && entry.day === lastresult.day) {
         daymerge++;
      } else if (monattag[1]) {
         line += "<td rowspan=\"" + daymerge + "\">" + monattag[1] + "</td>";
         daymerge = 1;
      } else {
         line += "<td rowspan=\"" + daymerge + "\"></td>";
         daymerge = 1;
      }
      
      if (entry && entry.title === lastresult.title) {
         if (titlemerge === 1) {
            titleflag = lastresult.flag;
         }

         titlemerge++;
      } else {
         line += "<td rowspan=\"" + titlemerge + "\">";
      
         if (lastresult.tt) {
            line += "__[[" + lastresult.title + "]]__";
         } else {
            line += "[[" + lastresult.title + "]]";
         }
      
         if (titleflag) {
            if (titleflag === lastresult.flag) {
               line += " //" + titleflag + "//";
            } else if (titleflag === "(Start)" && lastresult.flag !== "(Ende)") {
               line += " //" + titleflag + "//";
            } else if (titleflag !== "(Start)" && lastresult.flag === "(Ende)") {
               line += " //" + lastresult.flag + "//";
            }
         } else if (lastresult.flag) {
            line += " //" + lastresult.flag + "//";
         }
      
         line += "</td>";
         titlemerge = 1;
         titleflag = null;
      }

      line += "</tr>";
      
      out.push(line);
      lastresult = entry;
   }

   // zurückkehren
   out.reverse();

   return out;
};

// Numerischer Schluessel JJJJMMTT; fehlender Monat/Tag zaehlt als 0
var datumSchluessel = function(date) {
   return (parseInt(date[0], 10) || 0) * 10000 + (parseInt(date[1], 10) || 0) * 100 + (parseInt(date[2], 10) || 0);
};

var prepare_results = function (source) {
   var results = [];
   source(function(tiddler,title) {
      if (tiddler) {
         var hastag = tiddler.hasTag("Abenteuer");
         if (tiddler.fields.datum) {
            // Zeitpunkte durch "." getrennt; leere Teile werden uebersprungen (Punkt am Ende =
            // offenes Ende: der letzte echte Zeitpunkt bleibt dann "(Fortsetzung)")
            var dates = tiddler.fields.datum.split(".");
            var flag = dates.length > 1 ? "(Start)" : null;
            var prev = 0;

            for (var i = 0; i < dates.length; ++i) {
               if (dates[i]) {
                  var date = dates[i].split("-");
                  var key = datumSchluessel(date);

                  if (i === 0) {
                     prev = key;
                  }

                  if (flag && (i === (dates.length - 1))) {
                     flag = "(Ende)";
                  }

                  // Reihenfolge am selben Tag: Folgezeitpunkte (negativ, abhaengig vom Abstand zum
                  // vorigen Zeitpunkt) vor ersten Zeitpunkten (1); mehrere erste Zeitpunkte bleiben
                  // in Eingabereihenfolge
                  results.push({title: tiddler.fields.title, year: date[0], month: date[1], day: date[2], order: (key === prev ? 1 : -1 / (key - prev)), flag: flag, tt: hastag});

                  flag = "(Fortsetzung)";
                  prev = key;
               }
            }
         } else {
            results.push({title: tiddler.fields.title, year: "????", month: null, day: null, order: 0, flag: null, tt: hastag});
         }
      }
   });
   return results;
};

})();
