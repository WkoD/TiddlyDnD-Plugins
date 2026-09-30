/*\
title: library
type: application/javascript
module-type: library
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.getTageFuerMonat = function(year, month, direction) {
   var months = [31, 30, 30, 31, 30, 30, 31, 30, 31, 30, 31, 30];
   var index;
   
   if (direction > 0) {
      index = month - 1;
   } else {
      index = month - 2;
      
      if (index < 0) {
         index = months.length - 1;
      }
   }
   
   var days = months[index];
   
   // Schieldmeet
   if ((year % 4 == 0) && (index == 6)) {
      days += 1;
   }
   
   return days;
};

// Zerlegt "JJJJ-MM-TT" (optional mit weiteren Teilen, z. B. Uhrzeit "JJJJ-MM-TT-10:00")
// in Zahlen; der Rest bleibt als Text erhalten. Ungueltig -> null.
exports.parseDatum = function(text) {
   var parts = (text || "").split("-");
   if (parts.length < 3) {
      return null;
   }
   var result = {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
      rest: parts.slice(3).join("-")
   };
   if (isNaN(result.year) || isNaN(result.month) || isNaN(result.day)) {
      return null;
   }
   return result;
};

// Laufende Tagesnummer seit Jahr 0: 365 Tage je Jahr, dazu Shieldmeet in jedem durch 4
// teilbaren Jahr (wie getTageFuerMonat). Feiertage zaehlen als Tag 31, Shieldmeet als Tag 32
// des vorangehenden Monats.
exports.getTagNummer = function(year, month, day) {
   var nummer = year * 365 + Math.ceil(year / 4);
   for (var m = 1; m < month; ++m) {
      nummer += exports.getTageFuerMonat(year, m, 1);
   }
   return nummer + day;
};

// Umkehrung von getTagNummer: Tagesnummer -> {year, month, day}.
exports.getDatumAusNummer = function(nummer) {
   var year = Math.floor(nummer / 365.25);
   while (exports.getTagNummer(year, 1, 1) > nummer) {
      year--;
   }
   while (exports.getTagNummer(year + 1, 1, 1) <= nummer) {
      year++;
   }
   var day = nummer - exports.getTagNummer(year, 1, 0);
   var month = 1;
   while (month < 12 && day > exports.getTageFuerMonat(year, month, 1)) {
      day -= exports.getTageFuerMonat(year, month, 1);
      month++;
   }
   return {year: year, month: month, day: day};
};

// Tage von `von` bis `bis` (negativ, wenn `bis` davor liegt); ungueltiges Datum -> null.
exports.getTageZwischen = function(von, bis) {
   var a = exports.parseDatum(von);
   var b = exports.parseDatum(bis);
   if (!a || !b) {
      return null;
   }
   return exports.getTagNummer(b.year, b.month, b.day) - exports.getTagNummer(a.year, a.month, a.day);
};

exports.getMonatTag = function(monat, tag) {
   var result = [];

   // Monat setzen
   if (tag == 31) {
      // Feiertag
      switch (monat) {
         case "01": result.push("Midwinter (01/02)"); break;
         case "04": result.push("Greengrass (04/05)"); break;
         case "07": result.push("Midsummer (07/08)"); break;
         case "09": result.push("Highharvestide (09/10)"); break;
         case "11": result.push("Feast of the Moon (11/12)"); break;
         default: result.push("????"); break;
      } 

   } else if (tag == 32) {
      // Schaltjahr
      result.push("Shieldmeet (07/08)");
   } else {
      // Monat setzen
      switch (monat) {
         case "01": result.push("Hammer (01)"); break;
         case "02": result.push("Alturiak (02)"); break;
         case "03": result.push("Ches (03)"); break;
         case "04" :result.push("Tarsakh (04)"); break;
         case "05": result.push("Mirtul (05)"); break;
         case "06": result.push("Kythorn (06)"); break;
         case "07": result.push("Flamerule (07)"); break;
         case "08": result.push("Eleasis (08)"); break;
         case "09": result.push("Eleint (09)"); break;
         case "10": result.push("Marpenoth (10)"); break;
         case "11": result.push("Uktar (11)"); break;
         case "12": result.push("Nightal (12)"); break;
         default: result.push("????"); break;
      }

      // Tag setzen
      if (!!tag) {
         result.push(tag);
      }
   }
   
   return result;
};

exports.comparePropertyNumber = function(a, b) {
  return (a || b) ? (!a ? -1 : !b ? 1 : a.toString().localeCompare(b, undefined, {numeric: true, sensitivity: 'base'})) : 0;
};

})();