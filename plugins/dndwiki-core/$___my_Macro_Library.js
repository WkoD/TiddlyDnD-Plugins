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