var dataTable,dataTableBefore,termsSearch=[],dataTableSector=0,selectedCategory="all",firstLevel = [],
idTitleBigram=[],dataProjects,titles=[],title_terms=[],dataBeforeWord,dataIdProjectCat,termSelected,dataTableBeforeCountry,diameter

var word_entries

// for table buttons next and previous records
n_show = 100; // the nr of records to see in the table
n_min = 1;
n_max = n_show;
n_rec = 0;

newDataFlag = true;
sortFlag = false;

sortRcn = "dsc";
sortId = "dsc";
sortAcronym = "dsc";
sortTitle = "dsc";
sortSdate = "dsc";
sortEdate = "dsc";
sortUrl = "dsc";
sortTCost = "dsc";
sortEC = "dsc";
sortCtry = "dsc";

$('.has-clear input[type="text"]').on('input propertychange', function() {
  var $this = $(this);
  var visible = Boolean($this.val());
  $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
}).trigger('propertychange');

$('.form-control-clear').click(function() {
  $(this).siblings('input[type="text"]').val('')
    .trigger('propertychange').focus();
});

Promise.all([
  d3.json("../data/circle_packing/dashboard_circle_packed_euroSciVoc_unique.json"),
  d3.csv("../data/circle_packing/dashboard_circle_packing_countries_projects_org.csv"),
  d3.csv("../data/circle_packing/euroscivoc_parent_child_new.csv"),
  d3.tsv("../data/text_dashboards.txt"),
  d3.csv("../data/circle_packing/euroscivoc_id_title_bigrams.csv"),
  d3.tsv("../data/circle_packing/ids_categories_projects.tsv"),
  d3.tsv("../data/circle_packing/titles.csv"),
]).then(function (data) {

  root = data[0]
  // get first level categories
  root.children.forEach(function (d) {
    firstLevel.push(d.name);
  })

  // getting correspondence between projects, organisations and countries
  dataMap = data[1]
  dataMap.map(function(d){
    d.titlesString=d.titlesString.split("|");
    d.catsString=d.catsString.split("|");
  })
  //getting parent-child categories correspondence
  categoriesParentChild=data[2]

  //getting dinamic text for titles in html
  var textTitles=data[3]
  textTitles = textTitles
      .filter(function (d) { return d.DASHBOARD_CODE === "D1.1"; })
  textTitles.forEach(function(d){
    d3.select("#"+d.SECTION_CODE).html(d.SECTION_CONTENT)
  })


  //getting file with correspondence between projectID, titles and terms
  idTermTitle=data[4]
  ////console.log(idTermTitle)
  var temp=idTermTitle.filter(function (d) { return d.title === "prime numbers"; })

  result_idTitle = d3.nest()
    .key(function (d) {
      return d.title;
    })
    .key(function (d) {
      return d.term;
    })
    .entries(idTermTitle);

  //getting correspondece between title and terms for wordcloud and only titles for search box
  result_idTitle.forEach(function(d){
    d.values.forEach(function(v){
      title_terms.push({"title":d.key,"term":v.key})
    })
  })
  
   //getting file with projects and all fields from projects and the categories for that project
  dataIdProjectCat=data[5]

  dataIdProjectCat.map(function(d){
    d.titlesString=d.titlesString.split("|");
    d.catsString=d.catsString.split("|");
  })
  var terms=data[6]
  terms.forEach(function(d){
    termsSearch.push(d.term)
  })

  temp=dataIdProjectCat.filter(function(d){return d.titlesString.includes("commerce");})

  temp=dataIdProjectCat.filter(function(d){return d.titlesString.indexOf('commerce')!=-1;})

  dataIdProjectCat.map(function (d) {
    d.id = id = String(d.id)
    d.ecMaxContribution=+(d.ecMaxContribution.replace(",","."))
    d.totalCost=+(d.totalCost.replace(",","."))
  })

  dataTable=dataIdProjectCat

  $('#previous_table').hide();
  $("#next_table").hide(); 
  dataTable=table_proj(dataTable);  

  var dataInitMap=select_organisations_category("all")
  maporg = new mapOrg("map-chart", dataInitMap["count"],dataInitMap["projects"]);

  circlepack = new circlePack("circle_packed",root);
  
  ////// TABLE NEXT and PREVIOUS ///////////////////////////////////
  $("#next_table").on("click", function () {
    
    newDataFlag = false;
    $('#previous_table').show();
    $('#previous_table').html(n_min + "-" + n_max + " " + "&#9665");
    ////////////////////////////////console.log(dataTable)

    if (n_rec <= (n_max + n_show)) {
      n_min = n_max + 1;
      n_max = n_rec;
      
      dataTable=table_proj(dataTable);
      $('#next_table').hide();
    } else {
      n_min = n_max + 1;
      n_max = n_max + n_show;
      dataTable=table_proj(dataTable);
      if (n_rec <= (n_max + n_show)) {
        n_min = n_max + 1;
        n_max = n_rec;
        $('#next_table').html("&#9655" + " " + n_min + "-" + n_max);
        n_min = n_min - n_show;
        n_max = n_min + n_show - 1;
      } else {
        n_min = n_max + 1;
        n_max = n_max + n_show;
        $('#next_table').html("&#9655" + " " + n_min + "-" + n_max);
        n_min = n_min - n_show;
        n_max = n_max - n_show;
      }
    };
    newDataFlag = true;
  });

  $("#previous_table").on("click", function () {
    
    newDataFlag = false;
    if (n_max == n_rec) { $('#next_table').show(); };
    $('#next_table').html("&#9655" + " " + n_min + "-" + n_max);

    if (n_min == (n_show + 1)) {
      $('#previous_table').hide();
      n_min = 1;
      n_max = n_min + (n_show - 1);
      dataTable=table_proj(dataTable);
    } else {
      n_min = n_min - n_show;
      n_max = n_min + (n_show - 1);
      dataTable=table_proj(dataTable);
      $('#previous_table').html((n_min - n_show) + "-" + (n_max - n_show) + " " + "&#9665");
    }
    newDataFlag = true;
  });

   $("#download-table-btn").on("click", function(){
     var dataTableSelection=[]

     dataTable.forEach(function(d){
       dataTableSelection.push({"id":d.id,"rcn":d.rcn,"acronym":d.acronym,"title":d.title,
        "totalCost":d.totalCost,"ecMaxContribution":d.ecMaxContribution,"startDate":d.startDate,"endDate":d.endDate})
      })
    download(dataTableSelection, 'projects.csv', 'text/csv;encoding:utf-8');
  });  

 // call selectBubble when clicking on search button
  $("#searchButton")
  .on("click", function(){
      d3.selectAll(".textBubble").remove()
      termSelected=undefined 
      circlepack.selectBubble(d3.select("#"+get_id_circle(document.getElementById('termSearch').value)).data()[0],false)
      document.getElementById('termSearch').value = ''
  });

});

function selectBubble(d){
  categories_filtered=filter_categories(categoriesParentChild,d.data.name)
  if (d.data.name == "root") {
    selectedCategory="all"
    table_proj(dataProjects)

    //select organisations for filling the map
    dataMapOrg=select_organisations_category("all")
    maporg.data = dataMapOrg["count"]
    maporg.dataProjects = dataMapOrg["projects"]
  } else {
    selectedCategory=d.data.name
    dataMapOrg=select_organisations_category(d.data.name)
    maporg.data = dataMapOrg["count"]
    maporg.dataProjects = dataMapOrg["projects"]

    dataTable = select_projects_category(d.data.name)
    dataTable=table_proj(dataTable); // MODIFICATIONS
  }
      maporg.drawMap()

      if (focus !== "root") {
        d3.selectAll('foreignObject').remove()
      }
      if (focus !== d) {
        d3.select(".hiddenArcWrapper").remove()
        zoom(d)
        if (d3.event!==null){
          d3.event.stopPropagation();
        }
        d3.select("#wordcloud").remove()
        if (focus.data.children) {
          if ((focus.data.children.length == 0)) {
            runWordcloud("#groupCircles", d.data.name)
          } else {
            d3.select("#wordcloud").remove()
          }
        } else {
          runWordcloud("#groupCircles", d.data.name)
        }
      }
}

function get_id_circle(d) {
  var name
  if (d.data !== undefined) {
    name = d.data.name
  } else if (d.name!=undefined){
    name = d.name
  }else{
    name=d
  }

  idsCircles = []

  var t = name.split(" ")
  t.forEach(function (v) {
    idsCircles.push(v.replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .replace("%", ""));
  })

  idsCircles = idsCircles.join("_")
  if (isNaN(parseInt(idsCircles.charAt(0)))) {
    return idsCircles;
  }
  else {
    return "N" + idsCircles;
  }
}

function runCreateWordcloud() {
  wordsDrawn = true

  var r = $.Deferred();

  var counter = 0;
  while (!wordsDrawn & counter < 10) {
    drawWords();
    counter = counter + 1;
  };

  setTimeout(function () {
    r.resolve();
  }, 100);
  return r;
};


function join(lookupTable, mainTable, lookupKey, mainKey, select) {
  var prueba=false
  var l = lookupTable.length,
    m = mainTable.length,
    lookupIndex = [],
    output = [];
  for (var i = 0; i < l; i++) { // loop through l items
    var row = lookupTable[i];
    lookupIndex[row[lookupKey]] = row; // create an index for lookup table
  }
  for (var j = 0; j < m; j++) { // loop through m items
    var y = mainTable[j];

    var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
    if (x !== undefined) {
      output.push(select(y, x)); // select only the columns you need
    }

  }

  return output;
};

function filter_categories(categories,categorySelected) {
  var result=[],childFiltered,//children=[]

  categories=categories.filter(function(d){
    if(d.parent==categorySelected){
      return d
    }
  })

  children=categories.map(d=>d.child)
  children.forEach(function (d) {
    childFiltered=idTermTitle.filter(v=>v.title==d)
    result.push(childFiltered);
  })
  
  result=result.flat()

  return result 
}

function get_data_table(categories) {
  var result = join(categories, dataProjects, "id", "id", function (project, category) {

    return {
      rcn: project.rcn,
      id: project.id,
      acronym: project.acronym,
      title: project.title,
      startDate: project.startDate,
      endDate: project.endDate,
      projectUrl: project.projectUrl,
      totalCost: project.totalCost,
      ecMaxContribution: project.ecMaxContribution,
      coordinatorCountry: project.coordinatorCountry
    };
  });
   return result
}

 
function removewithfilter(arr) { 
  let outputArray = Array.from(new Set(arr)) 

  return outputArray; 
} 
function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

function update_map_table(d,title,word) {
  var result_count=[],
  idsWords=[]
  var terms_title_selected = idTermTitle
  .filter(function (v) { return ((v.term === d.key)&(v.title === get_name_euroscivoc(title))); })

  terms_title_selected.forEach(function(d){
    idsWords.push(d.id)
  })

  if (termSelected==d.key){
    d3.selectAll("#wordcloud text").style("opacity", "1")
    dataTable=dataTableBefore
    termSelected=undefined
    dataTableBeforeCountry=undefined
    maporg.centerMap(maporg.centered,null)
    dataMapOrg=select_organisations_category(title)
   }else{

    if (termSelected!=undefined){
      console.log(dataTableBefore)
      console.log(dataTableBeforeCountry)
      dataTable=dataTableBefore
      maporg.centerMap(maporg.centered,null)
    }else{
      console.log(dataTable)
      if (maporg.countrySelected!=true){
        dataTableBefore=dataTable
      }else{
        dataTable=dataTableBefore
        maporg.centerMap(maporg.centered,null)
      }
    }
    console.log(dataTableBefore)
    console.log(dataTableBeforeCountry)
    dataTable=dataTable.filter(function(d){return idsWords.includes(d.id);})
    console.log(dataTable)

    termSelected=d.key
    d3.selectAll("#wordcloud text").style("opacity", "0.2")
    d3.select(word).style("opacity", "1")

    maporg.countrySelected=false
    maporg.codeCountrySelected="none"

    
    var tempsel=dataMap.filter(function(d){return idsWords.includes(d.id);})

      var i = 0
      result_count_temp = d3.nest()
      .key(function (d) {
        return d.country_code;
      })
      .key(function (d) {
        return d.countryName;
      })
      .key(function (d) {
        return d.orgID;
      })
      .rollup(function (v) {
        return v.length;
      })
      .entries(tempsel);

    result_count_temp.forEach(function(d){
      result_count.push({"key":d["key"],"value":d.values[0].values.length,"countryName":d.values[0].key})
    })

    dataMapOrg={"projects":tempsel,"count":result_count}
   }

   maporg.data = dataMapOrg["count"]
   maporg.dataProjects=dataMapOrg["projects"]

   d3.event.stopPropagation();

   maporg.drawMap()

   dataTable=table_proj(dataTable);  
   dataTableBeforeCountry=dataTable
   d3.event.stopPropagation();
   d3.selectAll("path").style("stroke", "grey")
   .style("opacity",1)

}

function autocomplete(inp, arr) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          b.innerHTML = arr[i].substr(0,arr[i].indexOf(val));
          b.innerHTML += "<strong>" + arr[i].substr(arr[i].indexOf(val), val.length) + "</strong>";
          b.innerHTML += arr[i].substr(arr[i].indexOf(val)+val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
function get_name_euroscivoc(name){
  var n = name.indexOf("others")
  if (n!=-1){
    var res = name.substring(0, n-1);
    return res
  }else{
    return name
  }
  
}
function select_projects_category(category){
  var temp
  var isLeaf=d3.select("#"+ get_id_circle(category)).classed("node--leaf")
  category=category.replace(" general","")
  temp=dataIdProjectCat.filter(function(d){return d.titlesString.includes("commerce");})
  if(isLeaf==true){
    temp=dataIdProjectCat.filter(function(d){return d.titlesString.indexOf(category)!=-1;})
  }else{
    temp=dataIdProjectCat.filter(function(d){return d.catsString.indexOf(category)!=-1;})
  }
  return temp
}
function select_organisations_category(category){
  var countries=[]
  var temp
  if(category=="all"){
    temp=dataMap
  }else{
    var isLeaf=d3.select("#"+ get_id_circle(category)).classed("node--leaf")
    category=category.replace(" general","")
    if(isLeaf==true){
      temp=dataMap.filter(function(d){return d.titlesString.indexOf(category)!=-1;})
    }else{
      temp=dataMap.filter(function(d){return d.catsString.indexOf(category)!=-1;})
    }
  }

  result_count = d3.nest()
    .key(function (d) {
      return d.country_code;
    })
    .key(function (d) {
      return d.countryName;
    })
    .key(function (d) {
      return d.orgID;
    })
    .rollup(function(ids) {
      return ids.length; 
    })
    .entries(temp);

  result_count.forEach(function(d){
    countries.push({"key":d["key"],"value":d.values[0].values.length,"countryName":d.values[0].key})
  })
   return {"projects":temp,"count":countries}
}
function filter_table_country(country){

  var resultUnique=[]
  var dataProjectsCountry=maporg.dataProjects.filter(d=>d.country_code==country)
 
   if (dataTableBefore!=undefined){
     dataTable=dataTableBefore
   }
     var result = join(dataTable, dataProjectsCountry, "id", "id", function (country, row) {
     
     return {
       rcn: row.rcn,
       id: row.id,
       acronym: row.acronym,
       title: row.title,
       startDate: row.startDate,
       endDate: row.endDate,
       projectUrl: row.projectUrl,
       totalCost: row.totalCost,
       ecMaxContribution: row.ecMaxContribution,
       coordinatorCountry: row.coordinatorCountry
     };
   });
   const object = {};
 
   result.forEach(function (d) {
     if (!object[d.id]) {
       object[d.id]={"rcn":d.rcn,"acronym":d.acronym,"title":d.title,"startDate": d.startDate,"endDate": d.endDate,
       "projectUrl": d.projectUrl,"totalCost": d.totalCost,"ecMaxContribution": d.ecMaxContribution,"id":d.id}
     }
   })
 
   for (var x in object) {
       resultUnique.push(object[x]);
   //  }
   }
   $('#previous_table').hide(); // MODIFICATIONS
   $("#next_table").hide(); // MODIFICATIONS

   dataTableBefore=dataTable
   dataTable=resultUnique
   table_proj(resultUnique);  // MODIFICATIONS
 
 }
 function zoom(d) {
  var focus0 = focus; focus = d;

  var transition = d3.transition()
    .duration(750)
    .tween("zoom", function (d) {

      var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);

      return function (t) { zoomTo(i(t)); };
    })
    .each(function () { ++n; })
    .on("end", function () {
      if (!--n) {
        text_inside_circles(focus, diameter);
      }
    });

  if (focus.data.name == "root") {

    transition.select("#groupCircles").selectAll("text")
      .style("fill-opacity", 0)

    d3.selectAll(".title text")
    .style("fill-opacity", 1)
    .style("display", "block")
    d3.selectAll(".label").select("text")
    .style("display", "block")
    .style("fill-opacity", 1)
  }
}
autocomplete(document.getElementById("termSearch"), termsSearch);

//  TOOLTIP FUNCTIONS

var mainTooltip = d3.select("body")
    .append("div")
      .style("opacity", 0)
      .style('font-size', '12px')
      .attr("class", "mainTooltip")

var showTooltip = function(d,graph,i,j) {
    var x=d3.event.pageX
    var y=d3.event.pageY
    mainTooltip
      .style("opacity", 1)
      .html(textTooltip(d,graph))
      .style("left", function(){
        var x=d3.event.pageX
        return (x+i) + "px";
      })
      .style("top",function(){
        return (y+i) + "px";
      }) 
  }
  var moveTooltip = function(d,i,j) {
    var x=d3.event.pageX
    var y=d3.event.pageY
    mainTooltip
    .style("left", function(){
      var x=d3.event.pageX
      return (x+i) + "px";
    })
    .style("top",function(){
      return (y+j) + "px";
    }) 
  }
  var hideTooltip = function(d) {
    mainTooltip
      .style("opacity", 0)
  }
  var textTooltip=function (d,graph) {
    var text;
    switch (graph) {
    case "circle_packing":

      if (d.data.name=="root"){
        text = `
              <table style="margin-left: 2.5px">
                  <tr><td>Category: </td><td style="text-align: right"><span style='color:#1f77b4'> all categories </span></td></tr>
                  <tr><td>Occurrences: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.data["size"] + `</span></td></tr>
              </table>
              <hr>
          Click on category to zoom in and zoom out`;
      }else{
        text = `
              <table style="margin-left: 2.5px">
                  <tr><td>Category: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.data["name"] + `</span></td></tr>
                  <tr><td>Occurrences: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.data["size"] + `</span></td></tr>
              </table>
              <hr>
          Click on category to zoom in and zoom out`;
      }

        break;
    case "map":
        text = `
            <table style="margin-left: 2.5px">
                <tr><td>Country: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.properties.countryName + `</span></td></tr>
                <tr><td>Organisations: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.properties.ocurrences + `</span></td></tr>
           </table>
           <hr>
           Click on country to zoom in and select projects for that country.
           <br>
           Click again to zoom out`;

      break;
    }
    return text;
  }