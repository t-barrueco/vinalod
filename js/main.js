/*
*    CORDIS DATA EXPLORATION
*    main.js
*    
*    created by EuriTrends
*/

dataset1 = [];
dataset2 = [];
tableDataset1 = [];
tableDataset1_allrec = [];
tableDataset2 = [];
tableDataset2_allrec = [];

attrSort1 = [];
attrSort2 = [];
radio1_value = "";
radio2_value = "";
radio_value = "";
checkfilters1_values = [];
checkfilters2_values = [];
checkfilters_values = [];


sortFlag1 = false;
sortFlag2 = false;

datasetlist = [];
dataset_code = "";
dataset1_code = "";
dataset1_name = "";
dataset1_title = "";
dataset2_code = "";
dataset2_name = "";
dataset2_title = "";

fileName1 = "";
fileName2 = "";

chart = "";
showDetails1 = false;
showDetails2 = false;

n_show = 500;  // change the nr of records to see in the tables

// for table1 next and previous 500 rec
n_min1 = 0;
n_max1 = n_show;
n_rec1 = 0;

// for table2 next and previous 500 rec
n_min2 = 0;
n_max2 = n_show;
n_rec2 = 0;

// separation space
// locale = d3.formatLocale({
//   decimal: ".",
//   thousands: " ",
//   grouping: [3]
// });


locale = d3.formatLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3]
});

///// READ text from ABOUT file and display it when about button is clicked
// d3.text("txt/about.txt").then(function (d) {
//   $("#about").text(d);
// });

///// READ timestamp from datasource_timestamp.txt and display it in the footer of the tables
d3.text("txt/datasource_timestamp.txt").then(function (d) {
  d3.selectAll(".timestamp").text(d);
})



// var rawFile = new XMLHttpRequest();
// rawFile.open("GET", "context.txt", false);
// rawFile.onreadystatechange = function () {
//   if (rawFile.readyState === 4) {
//     if (rawFile.status === 200 || rawFile.status == 0) {
//       var allText = rawFile.responseText;
//       $("#context").text(allText);
//     }
//   }
// }
// rawFile.send(null);


Promise.all([
  d3.csv("data/data_description-h2020projects.csv"),
  d3.csv("data/data_description-h2020organizations.csv"),
  d3.csv("data/data_description-h2020reports.csv"),
  d3.csv("data/data_description-h2020reports_EN.csv"),
  d3.csv("data/data_description-h2020deliverables.csv"),
  d3.csv("data/data_description-ref_H2020programmes.csv"),
  d3.csv("data/data_description-ref_H2020programmes_EN.csv"),
  d3.csv("data/data_description-ref_H2020topics.csv"),
  d3.csv("data/data_description-ref_organizationActivityType.csv"),
  d3.csv("data/data_description-ref_projectFundingSchemeCategory.csv"),
  d3.csv("data/data_description-ref_sicCode.csv"),
  d3.csv("data/data_description-ref_sicCode_EN.csv"),
  d3.csv("data/data_description-ref_countries.csv"),
  d3.csv("data/data_description-ref_countries_EN.csv")
]).then(function (files) {

  var proj = files[0];
  var org = files[1];
  var reps = files[2];
  var reps_en = files[3];
  var deliv = files[4];
  var progs = files[5];
  var progs_en = files[6];
  var topics = files[7];
  var activtype = files[8];
  var funding = files[9];
  var sicode = files[10];
  var sicode_en = files[11];
  var ctry = files[12];
  var ctry_en = files[13];

  datasetlist = [
    { id: 1, code: "proj", name: "cordis-h2020projects.csv", dataset: proj, title: "H2020 Projects" },
    { id: 2, code: "org", name: "cordis-h2020organizations.csv", dataset: org, title: "H2020 Organisations" },
    { id: 3, code: "reps", name: "cordis-h2020reports.csv", dataset: reps, title: "H2020 Reports" },
    { id: 4, code: "reps_en", name: "cordis-h2020reports_en.csv", dataset: reps_en, title: "H2020 Reports - English only" },
    { id: 5, code: "deliv", name: "cordis-h2020deliverables.csv", dataset: deliv, title: "H2020 Deliverables" },
    { id: 6, code: "progs", name: "cordisref-H2020programmes.csv", dataset: progs, title: "H2020 Programmes" },
    { id: 7, code: "progs_en", name: "cordisref-H2020programmes_en.csv", dataset: progs_en, title: "H2020 Programmes - English only" },
    { id: 8, code: "topics", name: "cordisref-H2020topics.csv", dataset: topics, title: "H2020 Topics" },
    { id: 9, code: "activtype", name: "cordisref-organizationActivityType.csv", dataset: activtype, title: "H2020 Organisations Activity Types" },
    { id: 10, code: "funding", name: "cordisref-projectFundingSchemeCategory.csv", dataset: funding, title: "H2020 Funding Schemes" },
    { id: 11, code: "sicode", name: "cordisref-sicCode.csv", dataset: sicode, title: "H2020 Subject of Research" },
    { id: 12, code: "sicode_en", name: "cordisref-sicCode_en.csv", dataset: sicode_en, title: "H2020 Subject of Research - English only" },
    { id: 13, code: "ctry", name: "cordisref-countries.csv", dataset: ctry, title: "H2020 Countries" },
    { id: 14, code: "ctry_en", name: "cordisref-countries_en.csv", dataset: ctry_en, title: "H2020 Countries - English only" }];


  ////////////////// INITIALISE PAGE ////////////////////////////////////

  proj = cleanData("proj");
  org = cleanData("org");
  reps = cleanData("reps");
  reps_en = cleanData("reps_en");
  deliv = cleanData("deliv");
  progs = cleanData("progs");
  progs_en = cleanData("progs_en");
  topics = cleanData("topics");
  activtype = cleanData("activtype");
  funding = cleanData("funding");
  sicode = cleanData("sicode");
  sicode_en = cleanData("sicode_en");
  ctry = cleanData("ctry");
  ctry_en = cleanData("ctry_en");

  datasetlist = datasetlist.map(d => { if (d.code == "proj") { d.dataset = proj; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "org") { d.dataset = org; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "reps") { d.dataset = reps; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "reps_en") { d.dataset = reps_en; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "deliv") { d.dataset = deliv; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "progs") { d.dataset = progs; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "progs_en") { d.dataset = progs_en; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "topics") { d.dataset = topics; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "activtype") { d.dataset = activtype; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "funding") { d.dataset = funding; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "sicode") { d.dataset = sicode; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "sicode_en") { d.dataset = sicode_en; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "ctry") { d.dataset = ctry; }; return d; });
  datasetlist = datasetlist.map(d => { if (d.code == "ctry_en") { d.dataset = ctry_en; }; return d; });

  function Comparator(a, b) {
    if (a[0].frame < b[0].frame) return -1;
    if (a[0].frame > b[0].frame) return 1;
    return 0;
  };

  $(document).ready(function () {

    // INITIALISE PAGE
    dataset1 = proj;
    dataset1_code = "proj";
    chart = "chart1";
    dataset1_name = datasetlist.filter(d => d.code == "proj")[0].name;
    radarChart1 = new RadialBarsChart("#radarChart1", "chart1", dataset1_name);
    radarChart1.wrangleData();
    var totalMax1 = d3.max(proj, d => d.count);
    $('#dataset1_totrec').text(locale.format(",.0f")(totalMax1) + " records");
    $('#dataset1_totrec1').text(locale.format(",.0f")(totalMax1) + " total nr of records");
    $('#openDataset1').text(dataset1_name);
    $('#openDataset1').addClass('active');
    $('#tab1').addClass('active');
    // $('#openDataset1').addClass('text-white');
    // $('#openDataset2').addClass('text-secondary');
    dataset1Dropdown_ini(datasetlist);

    dataset2 = org;
    dataset2_code = "org";
    chart = "chart2";
    dataset2_name = datasetlist.filter(d => d.code == "org")[0].name;
    radarChart2 = new RadialBarsChart("#radarChart2", "chart2", dataset2_name);
    var totalMax2 = d3.max(org, d => d.count);
    $('#dataset2_totrec').text(locale.format(",.0f")(totalMax2) + " records");
    $('#dataset2_totrec1').text(locale.format(",.0f")(totalMax2) + " total nr of records");
    $('#openDataset2').text(dataset2_name);
    radarChart2.wrangleData();
    dataset2Dropdown_ini(datasetlist);

    $('#remove_details1').hide();
    $('#remove_details2').hide();

    $('#row_button1').hide();
    $('#row_button2').hide();


    // display tables in tab1 and 2
    sortFlag1 = false;
    sortFlag2 = false;
    readDataset1(dataset1_name, dataset1_code);
    readDataset2(dataset2_name, dataset2_code);
    // end display table1


    /////////////////////////////////////////////////
  });   /// END DOCUMENT READY

  ///// DROPDOWN ON CHANGE /////////////////////////

  $("#dataset1").change(function () {

    dataset1_code = $("#dataset1 option:selected").val()
    dataset1_title = $("#dataset1 option:selected").text()

    //console.log(dataset1_code);
    //console.log(dataset1_name);
    var darray = datasetlist.filter(d => d.code == dataset1_code);
    dataset1 = darray[0].dataset;
    dataset1_name = darray[0].name;

    var totalMax1 = d3.max(dataset1, d => d.count);
    $('#dataset1_totrec').text(locale.format(",.0f")(totalMax1) + " records");
    $('#dataset1_totrec1').text(locale.format(",.0f")(totalMax1) + " total nr of records");
    $('#openDataset1').text(dataset1_name);

    // change active pane
    $('#openDataset2').removeClass('active');
    // $('#openDataset2').removeClass('text-white');
    // $('#openDataset2').addClass('text-secondary');
    $('#openDataset1').addClass('active');
    // $('#openDataset1').addClass('text-white');
    $('#tab2').removeClass('active');
    $('#tab1').addClass('active');

    chart = "chart1";
    d3.selectAll('#chart1').remove();
    radarChart1.initVis();
    radarChart1.wrangleData();
    // $(".details1").remove();

    // reset radio and check btns
    $('#nulls1').prop('checked', false);
    $('#duplicates1').prop('checked', false);

    // display table1 in tab1
    sortFlag1 = false;
    readDataset1(dataset1_name, dataset1_code);


    return dataset1_code, dataset1_name, dataset1;
  });

  $("#dataset2").change(function () {

    dataset2_code = $("#dataset2 option:selected").val()
    dataset2_title = $("#dataset2 option:selected").text()

    var darray = datasetlist.filter(d => d.code == dataset2_code);
    dataset2 = darray[0].dataset;
    dataset2_name = darray[0].name;

    var totalMax2 = d3.max(dataset2, d => d.count);
    $('#dataset2_totrec').text(locale.format(",.0f")(totalMax2) + " records");
    $('#dataset2_totrec1').text(locale.format(",.0f")(totalMax2) + " total nr of records");
    $('#openDataset2').text(dataset2_name);

    //change active pane
    $('#openDataset1').removeClass('active');
    // $('#openDataset1').removeClass('text-white');
    // $('#openDataset1').addClass('text-secondary');
    $('#openDataset2').addClass('active');
    // $('#openDataset2').addClass('text-white');
    $('#tab1').removeClass('active');
    $('#tab2').addClass('active');

    chart = "chart2";
    d3.selectAll('#chart2').remove();
    radarChart2.initVis();
    radarChart2.wrangleData();
    // $(".details2").remove()

    // reset radio and check btns
    $('#nulls2').prop('checked', false);
    $('#duplicates2').prop('checked', false);

    // display table2 in tab2
    sortFlag2 = false;
    readDataset2(dataset2_name);

    return dataset2_code, dataset2_name, dataset2;
  });

  ///// REMOVE  DETAILS /////////////////////////

  $("#remove_details1")
    .on("click", function () {
      $(".details1").remove();
      $(this).hide();
      $('#row_button1').hide();
      showDetails1 = false;
    });

  $("#remove_details2")
    .on("click", function () {
      $(".details2").remove();
      $(this).hide();
      $('#row_button2').hide();
      showDetails2 = false;
    });



  ////// ALL RECORDS BUTTON 1 ////////////////////////
  $("#allRecButton1").on("click", function () {

    $('#nulls1').prop('checked', false);
    $('#duplicates1').prop('checked', false);
    $("#checkfilters1 input:checked").prop('checked', false);
    $('label[for="nulls1"]').prop("style", "font-weight:normal;");
    $('label[for="duplicates1"]').prop("style", "font-weight:normal;");
    $('#checkfilters1 label').prop("style", "font-weight:normal;");


    $('#text_filters11').text(" records");
    $('#text_filters12').text("");
    $('#text_filters13').text("");

    checkfilters1_values = [];
    radio1_checked = "";
    radio1_value = "";
    tableDataset1 = tableDataset1_allrec;

    sortFlag1 = false;
    displayDataset1(tableDataset1, tableDataset1_code);

  });

  ////// ALL RECORDS BUTTON 2 ////////////////////////
  $("#allRecButton2").on("click", function () {

    $('#nulls2').prop('checked', false);
    $('#duplicates2').prop('checked', false);
    $("#checkfilters2 input:checked").prop('checked', false);
    $('label[for="nulls2"]').prop("style", "font-weight:normal; ");
    $('label[for="duplicates2"]').prop("style", "font-weight:normal; ");
    $('#checkfilters2 label').prop("style", "font-weight:normal; ");

    $('#text_filters21').text(" records");
    $('#text_filters22').text("");
    $('#text_filters23').text("");

    checkfilters2_values = [];
    radio2_checked = "";
    radio2_value = "";
    tableDataset2 = tableDataset2_allrec;

    sortFlag2 = false;
    displayDataset2(tableDataset2, tableDataset2_code);

  });

  ////// TABLE 1 BUTTONS NEXT and PREVIOUS ///////////////////////////////////
  $("#next_table1").on("click", function () {
    $('#previous_table1').show();
    $('#previous_table1').html(n_min1 + "-" + n_max1 + " " + "&#9665");


    if (n_rec1 <= (n_max1 + n_show)) {
      n_min1 = n_max1 + 1;
      n_max1 = n_rec1;
      table1(tableDataset1, tableDataset1_code, n_min1, n_max1);
      $('#next_table1').hide();
      // $('#next_table1').html(n_min+"-"+n_max);
    } else {
      n_min1 = n_max1 + 1;
      n_max1 = n_max1 + n_show;
      table1(tableDataset1, tableDataset1_code, n_min1, n_max1);
      if (n_rec1 <= (n_max1 + n_show)) {
        n_min1 = n_max1 + 1;
        n_max1 = n_rec1;
        $('#next_table1').html("&#9655" + " " + n_min1 + "-" + n_max1);
        n_min1 = n_min1 - n_show;
        n_max1 = n_min1 + n_show - 1;
      } else {
        n_min1 = n_max1 + 1;
        n_max1 = n_max1 + n_show;
        $('#next_table1').html("&#9655" + " " + n_min1 + "-" + n_max1);
        n_min1 = n_min1 - n_show;
        n_max1 = n_max1 - n_show;
      }
    };

  });

  $("#previous_table1").on("click", function () {
    if (n_max1 == n_rec1) { $('#next_table1').show(); };
    $('#next_table1').html(n_min1 + "-" + n_max1);

    if (n_min1 == (n_show + 1)) {
      $('#previous_table1').hide();
      n_min1 = 1;
      n_max1 = n_min1 + (n_show - 1);
      table1(tableDataset1, tableDataset1_code, n_min1, n_max1);
    } else {
      n_min1 = n_min1 - n_show;
      n_max1 = n_min1 + (n_show - 1);
      table1(tableDataset1, tableDataset1_code, n_min1, n_max1);
      $('#previous_table1').html((n_min1 - n_show) + "-" + (n_max1 - n_show) + " " + "&#9665");
    }
  });


  ////// TABLE 2 BUTTONS NEXT and PREVIOUS ///////////////////////////////////
  $("#next_table2").on("click", function () {
    $('#previous_table2').show();
    $('#previous_table2').html(n_min2 + "-" + n_max2 + " " + "&#9665");


    if (n_rec2 <= (n_max2 + n_show)) {
      n_min2 = n_max2 + 1;
      n_max2 = n_rec2;
      table2(tableDataset2, tableDataset2_code, n_min2, n_max2);
      $('#next_table2').hide();
      // $('#next_table2').html(n_min+"-"+n_max);
    } else {
      n_min2 = n_max2 + 1;
      n_max2 = n_max2 + n_show;
      table2(tableDataset2, tableDataset2_code, n_min2, n_max2);
      if (n_rec2 <= (n_max2 + n_show)) {
        n_min2 = n_max2 + 1;
        n_max2 = n_rec2;
        $('#next_table2').html("&#9655" + " " + n_min2 + "-" + n_max2);
        n_min2 = n_min2 - n_show;
        n_max2 = n_min2 + n_show - 1;
      } else {
        n_min2 = n_max2 + 1;
        n_max2 = n_max2 + n_show;
        $('#next_table2').html("&#9655" + " " + n_min2 + "-" + n_max2);
        n_min2 = n_min2 - n_show;
        n_max2 = n_max2 - n_show;
      }
    };

  });

  $("#previous_table2").on("click", function () {
    if (n_max2 == n_rec2) { $('#next_table2').show(); };
    $('#next_table2').html(n_min2 + "-" + n_max2);

    if (n_min2 == (n_show + 1)) {
      $('#previous_table2').hide();
      n_min2 = 1;
      n_max2 = n_min2 + (n_show - 1);
      table2(tableDataset2, tableDataset2_code, n_min2, n_max2);
    } else {
      n_min2 = n_min2 - n_show;
      n_max2 = n_min2 + (n_show - 1);
      table2(tableDataset2, tableDataset2_code, n_min2, n_max2);
      $('#previous_table2').html((n_min2 - n_show) + "-" + (n_max2 - n_show) + " " + "&#9665");
    }
  });



  ////// APPLY FILTER BUTTON 1 ////////////////////////
  $("#filterButton1").on("click", function () {

    // $('label[for="nulls1"]').prop("style", "font-weight:normal; ");
    // $('label[for="duplicates1"]').prop("style", "font-weight:normal; ");
    // $('#checkfilters1 label').prop("style", "font-weight:normal; ");

    $('#text_filters11').text(" records");
    $('#text_filters12').text("");
    $('#text_filters13').text("");

    tableDataset1 = tableDataset1_allrec;
    checkfilters1_values = [];
    var result1 = [];

    // get values of radio box 
    nulls1_checked = $("#nulls1").prop("checked");
    nulls1_value = $("#nulls1").attr("value");
    duplicates1_checked = $("#duplicates1").prop("checked");
    duplicates1_value = $("#duplicates1").attr("value");

    if (nulls1_checked == true) {
      radio1_checked = nulls1_checked;
      radio1_value = nulls1_value;
      // $('label[for="nulls1"]').prop("style", "font-weight:bold; ");
      // $('label[for="duplicates1"]').prop("style", "font-weight:normal; ");
    } else if (duplicates1_checked == true) {
      radio1_checked = duplicates1_checked;
      radio1_value = duplicates1_value;
      // $('label[for="nulls1"]').prop("style", "font-weight:normal; ");
      // $('label[for="duplicates1"]').prop("style", "font-weight:bold; ");
    } else {
      radio1_checked = "";
      radio1_value = "";
      alert("Please select what kind of records to show: NULLS or DUPLICATES!");
      return;
    };

    // get values of check box 
    checkfilters1_values = [];

    var i = 0;
    var j = 0;
    $('#checkfilters1 input[type=checkbox]').each(function () {
      if (this.checked == true) {
        $('label[for=\"1' + i + '"]').prop("style", "font-weight:bold; ");
        checkfilters1_values[j] = {
          indx: i,
          attr: $(this).val()
        }
        j += 1;
      };
      i += 1;
    });

    if (checkfilters1_values.length == 0) {
      alert("Please select at least one ATTRIBUTE");
      tableDataset1 = tableDataset1_allrec;
      displayDataset1(tableDataset1_allrec, tableDataset1_code);
      return;
    }

    sortFlag1 = true;

    // filter the table
    if (radio1_value == "nulls") {
      // console.log("NULLS");
      tableDataset1 = tableDataset1_allrec;
      checkfilters1_values.forEach(e => {
        tableDataset1 = tableDataset1.filter(d => Object.values(d)[e.indx].toString() == "");
      });
    } else if (radio1_value == "duplicates") {
      // console.log("DUPLICATES");
      tableDataset1 = tableDataset1_allrec;

      // filtered_nulls1 = tableDataset1.length;
      // we first eliminate null values as they are not taken into account on duplicates
      // checkfilters1_values.forEach(e => {
      //   tableDataset1 = tableDataset1.filter(d => Object.values(d)[e.indx].toString() != "");
      // });

      // check if there are values in the resulting dataset 
      filtered_nulls1 = tableDataset1.length;

      if (filtered_nulls1 == 0) {
        tableDataset1 = tableDataset1_allrec;
        displayDataset1(tableDataset1_allrec, tableDataset1_code);
        $('#text_filters12').text("NO DUPLICATES found based on selected attributes");
        $('#text_filters13').text("");
        sortFlag1 = false;
        return;

      } else {
        // we create a new column that concatenates values from selected attributes 
        tableDataset1.forEach(d => {
          // console.log(d);
          var txt = "";
          checkfilters1_values.forEach(e => {
            txt += Object.values(d)[e.indx].toString();
          });
          d.newcol = txt;
        });


        // check for values that have duplicates and put them in an array
        const object = {};

        tableDataset1.forEach(function (d) {
          if (!object[d.newcol]) {
            object[d.newcol] = 0;
          }
          object[d.newcol] += 1;
        })
        for (var x in object) {
          if (object[x] >= 2) {
            result1.push(x);
          }
        }

        // we filter the duplicates 
        tableDataset1 = tableDataset1.filter(d => result1.includes(d.newcol));
        tableDataset1.forEach(d => {
          delete d.newcol
        });

        // the resulting dataset with duplicated rows according to the attributes selected
        // console.log(tableDataset1);
      };
    } else {
      tableDataset1 = tableDataset1_allrec;
    };

    console.log(tableDataset1.length);
    if (tableDataset1.length != 0) {

      displayDataset1(tableDataset1, tableDataset1_code);
      if (radio1_value == "duplicates" && result1.length != 0) {
        $('#text_filters1').text(locale.format(",.0f")(tableDataset1.length));
        $('#text_filters11').text(" records found and ");
        $('#text_filters12').text(locale.format(",.0f")(result1.length));
        $('#text_filters13').text(" unique combinations with DUPLICATES based on selected attributes");
      } else {
        $('#text_filters1').text(locale.format(",.0f")(tableDataset1.length));
        $('#text_filters11').text(" records with NULL values in all selected attributes");
        $('#text_filters12').text("");
        $('#text_filters13').text("");
      }
    } else {
      tableDataset1 = tableDataset1_allrec;
      displayDataset1(tableDataset1_allrec, tableDataset1_code);
      (radio1_value == "nulls") ? $('#text_filters13').text("NO NULLS") : $('#text_filters13').text("NO DUPLICATES");
      $('#text_filters12').text("");
      // $('#text_filters13').text("");
      sortFlag1 = false;
    };

  });


  ////// APPLY FILTER BUTTON 2 ////////////////////////
  $("#filterButton2").on("click", function () {

    // $('label[for="nulls2"]').prop("style", "font-weight:normal; ");
    // $('label[for="duplicates2"]').prop("style", "font-weight:normal; ");
    // $('#checkfilters2 label').prop("style", "font-weight:normal; ");

    $('#text_filters21').text(" records");
    $('#text_filters22').text("");
    $('#text_filters23').text("");

    tableDataset2 = tableDataset2_allrec;
    checkfilters2_values = [];
    var result2 = [];

    // get values of radio box 
    nulls2_checked = $("#nulls2").prop("checked");
    nulls2_value = $("#nulls2").attr("value");
    duplicates2_checked = $("#duplicates2").prop("checked");
    duplicates2_value = $("#duplicates2").attr("value");

    if (nulls2_checked == true) {
      radio2_checked = nulls2_checked;
      radio2_value = nulls2_value;
      // $('label[for="nulls2"]').prop("style", "font-weight:bold; ");
      // $('label[for="duplicates2"]').prop("style", "font-weight:normal; ");
    } else if (duplicates2_checked == true) {
      radio2_checked = duplicates2_checked;
      radio2_value = duplicates2_value;
      // $('label[for="nulls2"]').prop("style", "font-weight:normal; ");
      // $('label[for="duplicates2"]').prop("style", "font-weight:bold; ");
    } else {
      radio2_checked = "";
      radio2_value = "";
      alert("Please select what kind of records to show: NULLS or DUPLICATES!");
      return;
    };

    var i = 0;
    var j = 0;
    $('#checkfilters2 input[type=checkbox]').each(function () {
      if (this.checked == true) {
        $('label[for=\"2' + i + '"]').prop("style", "font-weight:bold; ");
        checkfilters2_values[j] = {
          indx: i,
          attr: $(this).val()
        }
        j += 1;
      };
      i += 1;
    });

    if (checkfilters2_values.length == 0) {
      alert("Please select at least one ATTRIBUTE");
      tableDataset2 = tableDataset2_allrec;
      displayDataset2(tableDataset2_allrec, tableDataset2_code);
      return;
    }

    sortFlag2 = true;

    // filter the table
    if (radio2_value == "nulls") {
      console.log("NULLS");
      tableDataset2 = tableDataset2_allrec;
      checkfilters2_values.forEach(e => {
        tableDataset2 = tableDataset2.filter(d => Object.values(d)[e.indx].toString() == "");
      });
    } else if (radio2_value == "duplicates") {

      tableDataset2 = tableDataset2_allrec;

      // filtered_nulls2 = tableDataset2.length;
      // we first eliminate null values as they are not taken into account on duplicates
      // checkfilters2_values.forEach(e => {
      //   tableDataset2 = tableDataset2.filter(d => Object.values(d)[e.indx].toString() != "");
      // });

      // check if there are values in the resulting dataset 
      filtered_nulls2 = tableDataset2.length;

      if (filtered_nulls2 == 0) {
        tableDataset2 = tableDataset2_allrec;
        displayDataset2(tableDataset2_allrec, tableDataset2_code);
        $('#text_filters22').text("NO DUPLICATES found based on selected attributes");
        $('#text_filters23').text("");
        sortFlag2 = false;
        return;

      } else {

        // we create a new column that concatenates values from selected attributes 
        tableDataset2.forEach(d => {
          // console.log(d);
          var txt = "";
          checkfilters2_values.forEach(e => {
            txt += Object.values(d)[e.indx].toString();
          });
          d.newcol = txt;
        });

        // we check for values that have duplicates and put them in an array
        const object = {};

        tableDataset2.forEach(function (d) {
          if (!object[d.newcol]) {
            object[d.newcol] = 0;
          }
          object[d.newcol] += 1;
        })
        for (var x in object) {
          if (object[x] >= 2) {
            result2.push(x);
          }
        }

        // we filter the duplicates 
        tableDataset2 = tableDataset2.filter(d => result2.includes(d.newcol));
        tableDataset2.forEach(d => {
          delete d.newcol
        });

        // the resulting dataset with duplicated rows according to the attributes selected
        // console.log(tableDataset1);
      };

    } else {
      tableDataset2 = tableDataset2_allrec;
    };


    if (tableDataset2.length != 0) {
      displayDataset2(tableDataset2, tableDataset2_code);
      if (radio2_value == "duplicates" && result2.length != 0) {
        $('#text_filters2').text(locale.format(",.0f")(tableDataset2.length));
        $('#text_filters21').text(" records found and ");
        $('#text_filters22').text(locale.format(",.0f")(result2.length));
        $('#text_filters23').text(" unique combinations with DUPLICATES based on selected attributes");
      } else {
        $('#text_filters2').text(locale.format(",.0f")(tableDataset2.length));
        $('#text_filters21').text(" records with NULL values in all selected attributes");
        $('#text_filters22').text("");
        $('#text_filters23').text("");
      }
    } else {
      tableDataset2 = tableDataset2_allrec;
      displayDataset2(tableDataset2_allrec, tableDataset2_code);
      (radio2_value == "nulls") ? $('#text_filters23').text("NO NULLS") : $('#text_filters23').text("NO DUPLICATES");
      $('#text_filters22').text("");
      // $('#text_filters23').text("");
      sortFlag2 = false;
    };

  });

  ////////////////////////////////////


  ///// DOWNLOAD CHARTS and TABLES DATA //////////////////////

  $("#download-selection-btn1").on("click", function () {
    // fileName1 = $("#dataset1 option:selected").text();

    var dataname = $("#dataset1 option:selected").val();
    var darray = datasetlist.filter(d => d.code == dataname);
    download_data = darray[0].dataset;
    fileName1 = darray[0].name;
    download(download_data, 'stats_' + fileName1, 'text/csv;encoding:utf-8');
  });

  $("#download-selection-btn2").on("click", function () {
    // fileName2 = $("#dataset2 option:selected").text();

    var dataname = $("#dataset2 option:selected").val();
    var darray = datasetlist.filter(d => d.code == dataname);
    download_data = darray[0].dataset;
    fileName2 = darray[0].name;
    download(download_data, 'stats_' + fileName2, 'text/csv;encoding:utf-8');
  });

  $("#download-meta-btn1").on("click", function () {
    alert("download metadata code to be completed");
    // download(metadata, 'metadata.csv', 'text/csv;encoding:utf-8');
  });
  $("#download-meta-btn2").on("click", function () {
    alert("download metadata code to be completed");
    // download(metadata, 'metadata.csv', 'text/csv;encoding:utf-8');
  });


  $("#download-table-btn1").on("click", function () {

    var dataname = $("#dataset1 option:selected").val();
    var darray = datasetlist.filter(d => d.code == dataname);
    download_data = tableDataset1;
    fileName1 = darray[0].name;
    fileName1 = fileName1.toString().slice(0, -4) + ((radio1_value != "") ? ("_" + radio1_value) : "");

    if (checkfilters1_values.length > 0) {
      checkfilters1_values.forEach(e => {
        fileName1 += "_" + e.attr;
      });
    };

    fileName1 = fileName1 + ".csv"

    console.log(fileName1)

    download(download_data, fileName1, 'text/csv;encoding:utf-8');
  });


  $("#download-table-btn2").on("click", function () {

    var dataname = $("#dataset2 option:selected").val();
    var darray = datasetlist.filter(d => d.code == dataname);
    download_data = tableDataset2;
    fileName2 = darray[0].name;
    fileName2 = fileName2.toString().slice(0, -4) + ((radio2_value != "") ? ("_" + radio2_value) : "");


    if (checkfilters2_values.length > 0) {
      checkfilters2_values.forEach(e => {
        fileName2 += "_" + e.attr;
      });
    };

    fileName2 = fileName2 + ".csv"

    console.log(fileName2)

    download(download_data, fileName2, 'text/csv;encoding:utf-8');
  });


  ////// SOCIAL MEDIA BUTTONS ///////////////////////////////////
  // moved to socialmedia.js


  // FUNCTIONS //////////////////////////
  function cleanData(dataset_code) {

    var darray = datasetlist.filter(d => d.code == dataset_code);
    var dataset = darray[0].dataset;

    var cleanDataset = dataset.map(function (d) {
      d.count = +d.count
      d.uniques = +d.uniques

      if (isFloat(d.minValue) == true) {

        d.minValue = +d.minValue
        // d.minValue = locale.format(",.2f")(d.minValue)
      }

      if (isFloat(d.maxValue) == true) {
        console.log("maxValue is a number");
        console.log(d.maxValue);
        d.maxValue = +d.maxValue;
        console.log(d.maxValue);
        // d.maxValue = locale.form?at(",.2f")(d.maxValue)
      }

      return d;
    });

    var totalMax = d3.max(cleanDataset, d => d.count);

    cleanDataset.forEach(d => {
      d.countpercentage = d.count / totalMax;
    });

    return cleanDataset;

  };

  function isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }

  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  /// read datasets
  function readDataset1(dataset_name, dataset_code) {

    // open dataset with d3
    d3.csv("data/datasets/" + dataset_name).then(function (data) {

      tableDataset1_allrec = data;
      tableDataset1 = data;
      tableDataset1_code = dataset_code;

      displayDataset1(tableDataset1, tableDataset1_code);

    });
  };

  function displayDataset1(dataset, dataset_code) {

    n_rec1 = dataset.length;
    n_min1 = 1;
    n_max1 = n_show;

    attrSort1 = Object.keys(dataset[0]);
    attrSort1 = attrSort1.map(d => d = "none");
    attrSort1[0] = "asc";


    dataset.sort(function (a, b) {
      var x = Object.values(a)[0];
      var y = Object.values(b)[0];
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    // display checkboxes and table
    if (sortFlag1 == false) {
      filter1_ini(dataset);
      // $('label[for="nulls1"]').prop("style", "font-weight:normal; ");
      // $('label[for="duplicates1"]').prop("style", "font-weight:normal; ");
      // $('#checkfilters1 label').prop("style", "font-weight:normal; ");
    };


    $('#text_filters1').text(locale.format(",.0f")(dataset.length));
    $('#text_filters11').text(" records");
    $('#text_filters12').text("");
    $('#text_filters13').text("");

    table1(dataset, dataset_code, n_min1, n_max1);

    $('#previous_table1').hide();
    if (n_rec1 <= n_show) {
      $('#next_table1').hide();
    } else if (n_rec1 <= n_show * 2) {
      $('#next_table1').show();
      $('#next_table1').html("&#9655" + " " + (n_show + 1) + "-" + n_rec1);
    } else {
      $('#next_table1').show();
      $('#next_table1').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
      // //console.log(n_rec1);
    };

  };

  function readDataset2(dataset_name, dataset_code) {

    // open dataset with d3
    d3.csv("data/datasets/" + dataset_name).then(function (data) {

      tableDataset2_allrec = data;
      tableDataset2 = data;
      tableDataset2_code = dataset_code;

      displayDataset2(tableDataset2, tableDataset2_code);
    });
  };

  function displayDataset2(dataset, dataset_code) {
    n_rec2 = dataset.length;
    n_min2 = 1;
    n_max2 = n_show;

    attrSort2 = Object.keys(dataset[0]);
    attrSort2 = attrSort2.map(d => d = "none");
    attrSort2[0] = "asc";

    dataset.sort(function (a, b) {
      var x = Object.values(a)[0];
      var y = Object.values(b)[0];
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    // display checkboxes and table
    if (sortFlag2 == false) {
      filter2_ini(dataset);
      // $('label[for="nulls2"]').prop("style", "font-weight:normal; ");
      // $('label[for="duplicates2"]').prop("style", "font-weight:normal; ");
      // $('#checkfilters2 label').prop("style", "font-weight:normal; ");
    };

    $('#text_filters2').text(locale.format(",.0f")(dataset.length));
    $('#text_filters21').text(" records");
    $('#text_filters22').text("");
    $('#text_filters23').text("");

    table2(dataset, dataset_code, n_min2, n_max2);

    $('#previous_table2').hide();
    if (n_rec2 <= n_show) {
      $('#next_table2').hide();
    } else if (n_rec2 <= n_show * 2) {
      $('#next_table2').show();
      $('#next_table2').html("&#9655" + " " + (n_show + 1) + "-" + n_rec2);
    } else {
      $('#next_table2').show();
      $('#next_table2').html("&#9655" + " " + (n_show + 1) + "-" + n_show * 2);
      // //console.log(n_rec2);
    };

  };


}).catch(function (err) {
  // handle error here
});


