/*
*    CORDIS data exploration
*    filters.js
*    
*    created by EuriTrends
*/

function filter1_ini(dataset) {

  var columns = Object.keys(dataset[0]);

  $(document).ready(function () {

    // remove previous divs
    $("#checkfilters1 div").remove();

    // add new div
    var row = "";
    i=1;
    columns.forEach(e => {
      var ind = columns.indexOf(e);
      row += "<div class=\"col-12 col-xs-6 col-sm-4 col-md-3 col-lg-2 form-check form-check-inline small float-left\"><input class=\"form-check-input\" type=\"checkbox\" id=\"1" + ind + "\" value=\"" + e + "\" onclick=\"text_bold1(" + ind + ")\"><label id=\"label_1" + ind + "\" class=\"form-check-label\" for=\"1" + ind + "\">  " + e  + "</label></div>"
      if(i == 4) {
        $("#checkfilters1").append(row);
        i = 1;
        row = "";
      } else {
      i = i + 1;
      }
    });
    // $("#checkfilters1").append(row);
  });

  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    })
  });
};


function filter2_ini(dataset) {

  var columns = Object.keys(dataset[0]);

  $(document).ready(function () {

    // remove previous divs
    $("#checkfilters2 div").remove();

    // add new div
    var row = "";
    i=1;
    columns.forEach(e => {
      var ind = columns.indexOf(e);
      row += "<div class=\"col-12 col-xs-6 col-sm-4 col-md-3 col-lg-2 form-check form-check-inline small float-left\"><input class=\"form-check-input\" type=\"checkbox\" id=\"2" + ind + "\" value=\"" + e + "\" onclick=\"text_bold2(" + ind + ")\"><label id=\"label_2" + ind + "\" class=\"form-check-label float-left\" for=\"2" + ind + "\">  " + e  + "</label></div>"
      if(i == 4) {
        $("#checkfilters2").append(row);
        i = 1;
        row = "";
      } else {
      i = i + 1;
      }
    });
    // $("#checkfilters2").append(row);
  });

  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    })
  });
};


function text_bold1(i){
  var checkBox = document.getElementById("1" + i);
  if (checkBox.checked == true) {
    $("#label_1" + i).prop("style", "font-weight:bold;");
  } else {
    $("#label_1" + i).prop("style", "font-weight:normal;");
  }

};

function text_bold2(i){
  var checkBox = document.getElementById("2" + i);
  if (checkBox.checked == true) {
    $("#label_2" + i).prop("style", "font-weight:bold;");
  } else {
    $("#label_2" + i).prop("style", "font-weight:normal;");
  }

};

function radio_bold1(){
  var radio_nulls = document.getElementById("nulls1");
  var duplicate_nulls = document.getElementById("duplicates1");
  if (radio_nulls.checked == true) {
    $("#label_nulls1").prop("style", "font-weight:bold;");
    $("#label_duplicates1").prop("style", "font-weight:normal;");
  } else if (duplicate_nulls.checked == true) {
    $("#label_nulls1").prop("style", "font-weight:normal;");
    $("#label_duplicates1").prop("style", "font-weight:bold;");
  }

};

function radio_bold2(){
  var radio_nulls = document.getElementById("nulls2");
  var duplicate_nulls = document.getElementById("duplicates2");
  if (radio_nulls.checked == true) {
    $("#label_nulls2").prop("style", "font-weight:bold;");
    $("#label_duplicates2").prop("style", "font-weight:normal;");
  } else if (duplicate_nulls.checked == true) {
    $("#label_nulls2").prop("style", "font-weight:normal;");
    $("#label_duplicates2").prop("style", "font-weight:bold;");
  }

};




