/*
*    CORDIS data exploration
*    tables.js
*    
*    created by EuriTrends
*/

function table1(dataset, code, m, n) {

  // console.log("M and N");
  // console.log(m);
  // console.log(n);

  // var format = locale.format(",.2f");

  var data = [];
  var data_sorted = [];
  var i = m;
  var weblink_org = "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/";
  var weblink_proj = "https://cordis.europa.eu/project/id/";
  var weblink_repo = "https://cordis.europa.eu/project/id/";

  data_sorted = dataset;
  var columns = Object.keys(dataset[0]);


  data = data_sorted.slice(m - 1, n);

  $(document).ready(function () {

    // remove previous head and body
    $("#table1 thead tr").remove();
    $("#table1 tbody tr").remove();

    // add new thead
    var hrow = "<tr>"
    hrow += "<th class=\"border sticky-header\">no.</th>";

    // console.log("sortFct");
    columns.forEach(e => {
      var ind = columns.indexOf(e);
      
      var sortFct = "sortTable1(" + ind + ")";
      // console.log(sortFct);

      switch (attrSort1[ind]) {
        case "asc":
          hrow += "<th class=\"border sticky-header\" onclick=\"" + sortFct + "\"  data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to sort\">" + e + " " + "&#9650" + "</th>"
          break;
        case "dsc":
          hrow += "<th class=\"border sticky-header\" onclick=\"" + sortFct +  "\" data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to sort\">" + e + " " + "&#9660" + "</th>"
          break;
        default:
          hrow += "<th class=\"border sticky-header\" onclick=\"" + sortFct +  "\" data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to sort\">" + e + "</th>"
          break;
      }

    });

    hrow = hrow + "</tr>";
    $("#table1 thead").append(hrow);


    // add rows
    $.each(data, function () {
      var row = "<tr";
      switch (code) {
        case "proj":
          row += " onClick=window.open(\"" + weblink_proj + this.id + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project webpage\">";
          break;
        case "org":
          row += " onClick=window.open(\"" + weblink_org + this.id + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the organisation webpage\">";
          break;
        case "reps":
          row += " onClick=window.open(\"" + weblink_repo + this.rcn + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project webpage\">";
          break;
        case "reps_en":
          row += " onClick=window.open(\"" + weblink_repo + this.rcn + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project webpage\">";
          break;
        default:
          row += "><td>"
          break;
      }

      row += i + "</td><td>";
      for (var x in this) {
        cell = this[x].toString();
        if (cell.length > 150) {
          cell = cell.slice(0, 150);
          // console.log(cell);
        }
        row += cell + "</td><td>";
      }
      row = row.slice(0, -4);
      row += "</tr>";
      $("#table1 tbody").append(row);
      i = i+1;
    });
    // end add rows

  });
  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    })
  });

};

function table2(dataset, code, m, n) {

  // var format = locale.format(",.2f");

  var data = [];
  var data_sorted = [];
  var i = m;
  var weblink_org = "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/";
  var weblink_proj = "https://cordis.europa.eu/project/id/";
  var weblink_repo = "https://cordis.europa.eu/project/id/";

  data_sorted = dataset;
  var columns = Object.keys(dataset[0]);


  data = data_sorted.slice(m - 1, n);

  $(document).ready(function () {

    // remove previous head and body
    $("#table2 thead tr").remove();
    $("#table2 tbody tr").remove();

    // add new thead
    var hrow = "<tr>"
    hrow += "<th class=\"border sticky-header\">no.</th>";
    
    columns.forEach(e => {
      var ind = columns.indexOf(e);

      var sortFct = "sortTable2(" + ind + ")";

      switch (attrSort2[ind]) {
        case "asc":
          hrow += "<th class=\"border sticky-header\" onclick=\"" + sortFct + "\"  data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to sort\">" + e + " " + "&#9650" + "</th>"
          break;
        case "dsc":
          hrow += "<th class=\"border sticky-header\" onclick=\"" + sortFct +  "\"  data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to sort\">" + e + " " + "&#9660" + "</th>"
          break;
        default:
          hrow += "<th class=\"border sticky-header\" onclick=\"" + sortFct +  "\"  data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to sort\">" + e + "</th>"
          break;
      }

    });

    hrow = hrow + "</tr>";
    $("#table2 thead").append(hrow);


    // add rows
    $.each(data, function () {
      var row = "<tr";
      switch (code) {
        case "proj":
          row += " onClick=window.open(\"" + weblink_proj + this.id + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project webpage\">";
          break;
        case "org":
          row += " onClick=window.open(\"" + weblink_org + this.id + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the organisation webpage\">";
          break;
        case "reps":
          row += " onClick=window.open(\"" + weblink_repo + this.rcn + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project webpage\">";
          break;
        case "reps_en":
          row += " onClick=window.open(\"" + weblink_repo + this.rcn + "\")><td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project webpage\">";
          break;
        default:
          row += "><td>"
          break;
      }

      row += i + "</td><td>";
      for (var x in this) {
        cell = this[x].toString();
        if (cell.length > 150) {
          cell = cell.slice(0, 150);
          // console.log(cell);
        }
        row += cell + "</td><td>";
      }
      row = row.slice(0, -4);
      row += "</tr>";
      $("#table2 tbody").append(row);
      i = i+1;
    });
    // end add rows

  });
  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    })
  });
};



function sortTable1(indx) {

  var colObj = d3.nest()
    .key(d => Object.values(d)[indx]).entries(tableDataset1);

  if(colObj.length == 1) {
    alert("There is only one value in this column!");
    return;
  };


  n_rec1 = tableDataset1.length;
  n_min1 = 1;
  n_max1 = n_show;

  $('#previous_table1').hide();
  if (n_rec1 <= n_show) {
    $('#next_table1').hide();
  } else if (n_rec1 <= n_show * 2) {
    $('#next_table1').show();
    $('#next_table1').html("&#9655" + " " + (n_show + 1) + "-" + n_rec1);
  } else {
    $('#next_table1').show();
    $('#next_table1').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
    // console.log(n_rec1);
  };


  if (attrSort1[indx] == 'asc') {
    tableDataset1.sort(function (a, b) {
      var x = Object.values(a)[indx];
      var y = Object.values(b)[indx];
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    }).reverse();
    attrSort1 = attrSort1.map(d => d = "none");
    attrSort1[indx] = "dsc";

  } else {
    tableDataset1.sort(function (a, b) {
      var x = Object.values(a)[indx];
      var y = Object.values(b)[indx];
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    attrSort1 = attrSort1.map(d => d = "none");
    attrSort1[indx] = "asc";
  };

  table1(tableDataset1, tableDataset1_code, n_min1, n_max1);

};

function sortTable2(indx) {

  var colObj = d3.nest()
    .key(d => Object.values(d)[indx]).entries(tableDataset2);

  if(colObj.length == 1) {
    alert("There is only one value in this column!");
    return;
  };


  n_rec2 = tableDataset2.length;
  n_min2 = 1;
  n_max2 = n_show;

  $('#previous_table2').hide();
  if (n_rec2 <= n_show) {
    $('#next_table2').hide();
  } else if (n_rec2 <= n_show * 2) {
    $('#next_table2').show();
    $('#next_table2').html("&#9655" + " " + (n_show + 1) + "-" + n_rec2);
  } else {
    $('#next_table2').show();
    $('#next_table2').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
    // console.log(n_rec1);
  };


  if (attrSort2[indx] == 'asc') {
    tableDataset2.sort(function (a, b) {
      var x = Object.values(a)[indx];
      var y = Object.values(b)[indx];
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    }).reverse();
    attrSort2 = attrSort2.map(d => d = "none");
    attrSort2[indx] = "dsc";

  } else {
    tableDataset2.sort(function (a, b) {
      var x = Object.values(a)[indx];
      var y = Object.values(b)[indx];
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    attrSort2 = attrSort2.map(d => d = "none");
    attrSort2[indx] = "asc";
  };


  table2(tableDataset2, tableDataset2_code, n_min2, n_max2);

};




// function sortTable1(indx) {

//   var colObj = d3.nest()
//     .key(d => Object.values(d)[indx]).entries(tableDataset1);

//   if(colObj.length == 1) {
//     alert("There is only one value in this column!");
//     return;
//   };


//   n_rec1 = tableDataset1.length;
//   n_min1 = 1;
//   n_max1 = n_show;

//   $('#previous_table1').hide();
//   if (n_rec1 <= n_show) {
//     $('#next_table1').hide();
//   } else if (n_rec1 <= n_show * 2) {
//     $('#next_table1').show();
//     $('#next_table1').html("&#9655" + " " + (n_show + 1) + "-" + n_rec1);
//   } else {
//     $('#next_table1').show();
//     $('#next_table1').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
//     // console.log(n_rec1);
//   };


//   if (attrSort1[indx] == 'asc') {
//     tableDataset1.sort(function (a, b) {
//       var xValue = Object.values(a)[indx];
//       var yValue = Object.values(b)[indx];
//       var x, y;
//       if (isNaN(xValue)) {
//         x = xValue;
//       } else {
//         x = parseFloat(xValue); 
//       } 

//       if (isNaN(yValue)) {
//         y = yValue;
//       } else {
//         y = parseFloat(yValue); 
//       } 
//       if (x < y) { return -1; }
//       if (x > y) { return 1; }
//       return 0;
//     }).reverse();
//     attrSort1 = attrSort1.map(d => d = "none");
//     attrSort1[indx] = "dsc";

//   } else {
//     tableDataset1.sort(function (a, b) {
//       var xValue = Object.values(a)[indx];
//       var yValue = Object.values(b)[indx];
//       var x, y;
//       if (isNaN(xValue)) {
//         x = xValue;
//       } else {
//         x = parseFloat(xValue); 
//       } 

//       if (isNaN(yValue)) {
//         y = yValue;
//       } else {
//         y = parseFloat(yValue); 
//       } 
//       if (x < y) { return -1; }
//       if (x > y) { return 1; }
//       return 0;
//     });
//     attrSort1 = attrSort1.map(d => d = "none");
//     attrSort1[indx] = "asc";
//   };

//   table1(tableDataset1, tableDataset1_code, n_min1, n_max1);

// };


// function sortTable2(indx) {

//   var colObj = d3.nest()
//     .key(d => Object.values(d)[indx]).entries(tableDataset2);

//   if(colObj.length == 1) {
//     alert("There is only one value in this column!");
//     return;
//   };


//   n_rec2 = tableDataset2.length;
//   n_min2 = 1;
//   n_max2 = n_show;

//   $('#previous_table2').hide();
//   if (n_rec2 <= n_show) {
//     $('#next_table2').hide();
//   } else if (n_rec2 <= n_show * 2) {
//     $('#next_table2').show();
//     $('#next_table2').html("&#9655" + " " + (n_show + 1) + "-" + n_rec2);
//   } else {
//     $('#next_table2').show();
//     $('#next_table2').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
//     // console.log(n_rec1);
//   };


//   if (attrSort2[indx] == 'asc') {
//     tableDataset2.sort(function (a, b) {
//       var xValue = Object.values(a)[indx];
//       var yValue = Object.values(b)[indx];
//       var x, y;
//       if (isNaN(xValue)) {
//         x = xValue;
//       } else {
//         x = parseFloat(xValue); 
//       } 

//       if (isNaN(yValue)) {
//         y = yValue;
//       } else {
//         y = parseFloat(yValue); 
//       } 

//       if (x < y) { return -1; }
//       if (x > y) { return 1; }
//       return 0;
//     }).reverse();
//     attrSort2 = attrSort2.map(d => d = "none");
//     attrSort2[indx] = "dsc";

//   } else {
//     tableDataset2.sort(function (a, b) {
//       var xValue = Object.values(a)[indx];
//       var yValue = Object.values(b)[indx];
//       var x, y;
//       if (isNaN(xValue)) {
//         x = xValue;
//       } else {
//         x = parseFloat(xValue); 
//       } 

//       if (isNaN(yValue)) {
//         // console.log("yValue NaN");
//         // console.log(yValue);
//         y = yValue;
//       } else {
//         y = parseFloat(yValue); 
//       } 
//       if (x < y) { return -1; }
//       if (x > y) { return 1; }
//       return 0;
//     });
//     attrSort2 = attrSort2.map(d => d = "none");
//     attrSort2[indx] = "asc";
//   };


//   table2(tableDataset2, tableDataset2_code, n_min2, n_max2);

// };
