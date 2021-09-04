/*
*    Organisations by EC Contribution
*    table.js
*
*/

function table_proj(dataset) {

  //console.log(dataset)

  var locale = d3.formatLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3]
  });

  var format = locale.format(",.0f");

  var data = [];
  var data_sorted = [];
  var i = n_min;
  var weblink = "https://cordis.europa.eu/project/id/";



  n_rec = dataset.length;
  //////console.log(dataset)
  $('#text_nr_records').text(n_rec + " PROJECTS");
  data_sorted = dataset;

  ////////console.log("Nr of Rec ===================")
  ////////console.log(n_rec);
  // ////////console.log(data_sorted);


  // if it's a new dataTable or after 
  if ((newDataFlag == true) && (sortFlag == false)) {

    n_min = 1;
    n_max = n_show;


    $('#previous_table').hide();
    if (n_rec <= n_show) {
      ////////console.log("n_rec <= n_show");
      $('#next_table').hide();
    } else if (n_rec <= n_show * 2) {
      ////////console.log("n_rec <= n_show * 2");
      $('#next_table').show();
      $('#next_table').html("&#9655" + " " + (n_show + 1) + "-" + n_rec);
    } else {
      ////////console.log("n_rec > n_show * 2");
      $('#next_table').show();
      $('#next_table').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
    };


    // remove previous head
    $("#table_proj thead tr").remove();
    var hrow = "<tr class=\"text-light\">";
    hrow += "<th id=\"2\" class=\"border sticky-header\">Acronym</th>"
     hrow += "<th id=\"8\" class=\"border sticky-header\">Title</th>"
    hrow += "<th id=\"3\" class=\"border sticky-header text-right\">ecMaxContribution(€)</th>"
    hrow += "<th id=\"4\" class=\"border sticky-header text-right\">totalCost(€)</th>"
    hrow += "<th id=\"6\" class=\"border sticky-header\">startDate</th>"
    hrow += "<th id=\"7\" class=\"border sticky-header\">endDate</th>"
    hrow = hrow + "</tr>";
    // add new thead
    /* var hrow = "<tr class=\"text-light\">";
    hrow += "<th id=\"2\" class=\"border sticky-header\" onclick=\"sortTable(" + 2 + ")\">Acronym</th>"
     hrow += "<th id=\"8\" class=\"border sticky-header\" onclick=\"sortTable(" + 8 + ")\">Title</th>"
    hrow += "<th id=\"3\" class=\"border sticky-header text-right\" onclick=\"sortTable(" + 3 + ")\">ecMaxContribution(€)</th>"
    hrow += "<th id=\"4\" class=\"border sticky-header text-right\" onclick=\"sortTable(" + 4 + ")\">totalCost(€)</th>"
    hrow += "<th id=\"6\" class=\"border sticky-header\" onclick=\"sortTable(" + 6 + ")\">startDate</th>"
    hrow += "<th id=\"7\" class=\"border sticky-header\" onclick=\"sortTable(" + 7 + ")\">endDate</th>"
    hrow = hrow + "</tr>"; */
    $("#table_proj thead").append(hrow);

    //sortRcn = "dsc";
    //sortId = "dsc";
    sortAcronym = "dsc";
    sortTitle = "dsc";
    sortSdate = "dsc";
    sortEdate = "dsc";
    //sortUrl = "dsc";
    sortTCost = "dsc";
    sortEC = "dsc";
    //sortCtry = "dsc";

    //document.getElementById("3").innerHTML = "ecMaxContribution(€)  &#9660";

    data_sorted.sort(function (a, b) {
      var x = a.ecMaxContribution;
      var y = b.ecMaxContribution;
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    }).reverse();
    sortEC = "dsc";

  }

  ////////console.log("n_min - n_max");
  ////////console.log(n_min + " - " + n_max);

  data = data_sorted.slice(n_min - 1, n_max);
////
////
////LOCALE LOCALE LOCALE ECMAXCONTRIBUTION
////
////
  $(document).ready(function () {

    // remove previous body
    $("#table_proj tbody tr").remove();

    $.each(data, function () {
      var row = "<tr value=\"" + this.id + "\"  onClick=window.open(\"" + weblink + this.id + "\") >"
      //row += "<td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project page.\" >" + i + "</td>"
      //row += "<td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project page.\" >" + this.rcn + "</td>"
      //row += "<td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project page.\" >" + this.id + "</td>"
      row += "<td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project page.\" >" + this.acronym + "</td>"
      row += "<td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project page.\" >" + this.title + "</td>"
      row += "<td class=\"text-right\">" + format(this.ecMaxContribution) + "</td>"
      row += "<td class=\"text-right\">" + format(this.totalCost) + "</td>"
      //row += "<td class=\"text-center\">" + this.coordinatorCountry + "</td>"
      row += "<td>" + this.startDate + "</td>"
      row += "<td>" + this.endDate + "</td>"
      //row += "<td data-toggle=\"tooltip\" data-placement=\"auto\" title=\"Click to see the project page.\" >" + this.title + "</td>"
      //row += "<td>" + this.projectUrl + "</td>"
      row += "</tr>";
      i = i + 1;
      $("#table_proj tbody").append(row);

    });

  });
  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    })
  });
  
  return dataset
};


function sortTable(n) {


  sortFlag = true;
  n_min = 1;
  n_max = n_show;
  n_rec = dataTable.length;


  $('#previous_table').hide();
  if (n_rec <= n_show) {
    ////////console.log("n_rec <= n_show");
    $('#next_table').hide();
  } else if (n_rec <= n_show * 2) {
    ////////console.log("n_rec <= n_show * 2");
    $('#next_table').show();
    $('#next_table').html("&#9655" + " " + (n_show + 1) + "-" + n_rec);
  } else {
    ////////console.log("n_rec > n_show * 2");
    $('#next_table').show();
    $('#next_table').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
  };


  switch (n) {
/*     case 0:
      if (sortRcn == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.rcn;
          var y = b.rcn;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("0").innerHTML = "rcn  &#9660";
        sortRcn = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.rcn;
          var y = b.rcn;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("0").innerHTML = "rcn  &#9650";
        sortRcn = "asc";
      };
      break;
    case 1:
      if (sortId == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.id;
          var y = b.id;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("1").innerHTML = "id  &#9660";
        sortId = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.id;
          var y = b.id;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("1").innerHTML = "id  &#9650";
        sortId = "asc";
      };
      break; */
    case 2:
      if (sortAcronym == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.acronym;
          var y = b.acronym;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("2").innerHTML = "acronym  &#9660";
        sortAcronym = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.acronym;
          var y = b.acronym;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("2").innerHTML = "acronym  &#9650";
        sortAcronym = "asc";
      };
      break;
    case 3:
        if (sortTitle == 'asc') {
          dataTable.sort(function (a, b) {
            var x = a.title;
            var y = b.title;
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
          }).reverse();
          table_proj(dataTable);
          thead_text();
          document.getElementById("8").innerHTML = "title  &#9660";
          sortTitle = "dsc";
        } else {
          dataTable.sort(function (a, b) {
            var x = a.title;
            var y = b.title;
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
          });
          table_proj(dataTable);
          thead_text();
          document.getElementById("8").innerHTML = "title  &#9650";
          sortTitle = "asc";
        };
        break;
    case 4:
      if (sortEC == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.ecMaxContribution;
          var y = b.ecMaxContribution;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("3").innerHTML = "ecMaxContribution(€)  &#9660";
        sortEC = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.ecMaxContribution;
          var y = b.ecMaxContribution;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("3").innerHTML = "ecMaxContribution(€)  &#9650";
        sortEC = "asc";
      };
      break;
    case 5:
      if (sortTCost == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.totalCost;
          var y = b.totalCost;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("4").innerHTML = "totalCost(€)  &#9660";
        sortTCost = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.totalCost;
          var y = b.totalCost;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("4").innerHTML = "totalCost(€)  &#9650";
        sortTCost = "asc";
      };
      break;
/*     case 5:
      if (sortCtry == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.coordinatorCountry;
          var y = b.coordinatorCountry;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("5").innerHTML = "coordinatorCountry  &#9660";
        sortCtry = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.coordinatorCountry;
          var y = b.coordinatorCountry;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("5").innerHTML = "coordinatorCountry  &#9650";
        sortCtry = "asc";
      };
      break; */
    case 6:
      if (sortSdate == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.startDate;
          var y = b.startDate;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("6").innerHTML = "startDate  &#9660";
        sortSdate = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.startDate;
          var y = b.startDate;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("6").innerHTML = "startDate  &#9650";
        sortSdate = "asc";
      };
      break;
    case 7:
      if (sortEdate == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.endDate;
          var y = b.endDate;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("7").innerHTML = "endDate  &#9660";
        sortEdate = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.endDate;
          var y = b.endDate;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("7").innerHTML = "endDate  &#9650";
        sortEdate = "asc";
      };
      break;
/*     case 8:
      if (sortTitle == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.title;
          var y = b.title;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("8").innerHTML = "title  &#9660";
        sortTitle = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.title;
          var y = b.title;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("8").innerHTML = "title  &#9650";
        sortTitle = "asc";
      };
      break; */
    /* case 9:
      if (sortUrl == 'asc') {
        dataTable.sort(function (a, b) {
          var x = a.projectUrl;
          var y = b.projectUrl;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        }).reverse();
        table_proj(dataTable);
        thead_text();
        document.getElementById("9").innerHTML = "projectUrl  &#9660";
        sortUrl = "dsc";
      } else {
        dataTable.sort(function (a, b) {
          var x = a.projectUrl;
          var y = b.projectUrl;
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        table_proj(dataTable);
        thead_text();
        document.getElementById("9").innerHTML = "projectUrl  &#9650";
        sortUrl = "asc";
      };
      break; */
  };

  sortFlag = false;

};

function thead_text() {

  /* document.getElementById(0).innerHTML = "rcn";
  document.getElementById(1).innerHTML = "id"; */
  document.getElementById(2).innerHTML = "acronym";
  document.getElementById(3).innerHTML = "title";
  document.getElementById(4).innerHTML = "ecMaxContribution(€)";
  document.getElementById(5).innerHTML = "totalCost(€)";
  //document.getElementById(5).innerHTML = "coordinatorCountry";
  document.getElementById(6).innerHTML = "startDate";
  document.getElementById(7).innerHTML = "endDate";
  //document.getElementById(8).innerHTML = "title";
  //document.getElementById(9).innerHTML = "projectUrl";

  //sortRcn = "dsc";
  //sortId = "dsc";
  sortAcronym = "dsc";
  sortTitle = "dsc";
  sortSdate = "dsc";
  sortEdate = "dsc";
  //sortUrl = "dsc";
  sortTCost = "dsc";
  sortEC = "dsc";
  //sortCtry = "dsc";

};





