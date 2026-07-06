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
   var result = prepare_results(source);
   var out = [];

   // sortiere Liste nach Datum
   result.sort(function(a, b) {
      var year = require("$:/_my/Macro/Library").comparePropertyNumber(a.year, b.year);

      if (year === 0) {
         var month = require("$:/_my/Macro/Library").comparePropertyNumber(a.month, b.month);

         if (month === 0) {
            var day = require("$:/_my/Macro/Library").comparePropertyNumber(a.day, b.day);

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
      var monattag = require("$:/_my/Macro/Library").getMonatTag(lastresult.month, lastresult.day);

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

var prepare_results = function (source) {
   var results = [];
   source(function(tiddler,title) {
      if (tiddler) {
         var hastag = tiddler.hasTag("Abenteuer");
         if (tiddler.fields.datum) {
            var dates = tiddler.fields.datum.split(".");
            var flag = dates.length > 1 ? "(Start)" : null;
			var prev = 0;

            for (var i = 0; i < dates.length; ++i) {
			   if (dates[i]) {
                  var date = dates[i].split("-");
				  
				  if (i === 0) {
				     prev = date[0] * 10000;

                     if (date[1]) {
				        prev = prev + date[1] * 100;
					 }
					 
                     if (date[1]) {
				        prev = prev + date[2];
					 }
				  }
     
				  var order = date[0] * 10000;

                  if (date[1]) {
				     order = order + date[1] * 100;
				  }
					 
                  if (date[1]) {
				     order = order + date[2];
				  }
				  
				  if (flag && (i === (dates.length - 1))) {
                     flag = "(Ende)";
                  }
				  
                  results.push({title: tiddler.fields.title, year: date[0], month: date[1], day: date[2], order: (1 / (prev - order)), flag: flag, tt: hastag});
               
                  flag = "(Fortsetzung)";
				  prev = order;
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
