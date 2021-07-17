/*
*    CORDIS data exploration
*    functions.js
*    
*    created by EuriTrends
*/


///////////////////// color function  /////////////////////////////////

function attributeTypeColor(attrType) {
  switch (attrType) {
    case "identifier":
      return "#ca5100"; // ff800f 
    case "cross-reference":
      return "#ca5100"; // ffff00 
    case "info":
      return "#ffbb7a"; // light-teal  5EA8C1   grey-plum 4d626b
    default:
      break;
  }
};

// 377eb8
// 76b7b2

// 28a745
// 4ac065 light green
// a3f266


// function selectedDataset1(name) {
//   switch (name) {
//     case "proj":
//       return "#ffff00"; // bbbb00 dark yellow 
//     case "org":
//       return "#ffff00"; // yellow
//     case "orgtype":
//       return "#5EA8C1"; // light-teal
//     default:
//       break;
//   }
// };







///////////////////// functions from other dashboards  //////////////////

function blobColor(framework) {
  switch (framework) {
    case "H2020":
      return "#22A7F0";
    case "FP7":
      return "#ff7f50";
    case "FP6":
      return "#94e65e"; // green
    default:
      break;
  }
};


function isOdd(num) { return num % 2;};


// SORTING FUNCTION YEAR
function sortYear(a, b) {
  if (a[0].year < b[0].year) return -1;
  if (a[0].year > b[0].year) return 1;
  return 0;
};


// SUM OF ELEMENTS OF AN ARRAY FUNCTION
function sumOfArray(sum, value, index, array) {
  return sum + value;
};

// BOOTSTRAP COLORS

// Colors
// $blue:    #007bff !default; // primary
// $indigo:  #6610f2 !default;
// $purple:  #6f42c1 !default;
// $pink:    #e83e8c !default;
// $red:     #dc3545 !default; // danger
// $orange:  #fd7e14 !default;
// $yellow:  #ffc107 !default; // warning
// $green:   #28a745 !default; // success
// $teal:    #20c997 !default;
// $cyan:    #17a2b8 !default; // info

// // Grays
// $white:    #fff !default;
// $gray-100: #f8f9fa !default; // light
// $gray-200: #e9ecef !default;
// $gray-300: #dee2e6 !default;
// $gray-400: #ced4da !default;
// $gray-500: #adb5bd !default;
// $gray-600: #868e96 !default; // secondary
// $gray-700: #495057 !default;
// $gray-800: #343a40 !default; // dark
// $gray-900: #212529 !default;
// $black:    #000 !default;


// pastel colors
// return "#ccebc5";
// return "#cccccc";
// return "#ffffcc";
// return "#b3cde3";
// return "#fddaec";

// Pastel1
// ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]
// Pastel2
// ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]
