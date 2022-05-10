/*
*    VINALOD
*    functions.js
*    
*    created by Teresa Barrueco
*/

//Transform data from hierarchy in Config File to an array
// format : [parent,child,grandchild...]

function get_hierarchy(hierarchy){
  var hierarchy_arr=[]
  hierarchy_arr=[hierarchy[0]["parent"]]
  hierarchy.forEach(function(d){
    hierarchy_arr.push(d["child"])
  })

  return hierarchy_arr
}

//Get classes and text from Config File to show for every class
// format: {"className":textClass,"className2":textClass2}
function getClassesShow(classes){
  var tmp={}
  classes.forEach(function(c){
    tmp[c["class"]]=c["text"]
  })
  return tmp
}

//Get properties for classes in the Config File
// format: {"className":[property1,property2...],"className2":[property1,property2...]}
function get_properties(properties){
  var temp={}
  properties.forEach(function(d){
    if(temp[d["class"]]){
      temp[d["class"]].push(d["property"])
    }else{
      temp[d["class"]]=[d["property"]]
    }
  })
  return temp
}

//Get full names for properties
// format: {"property":property_name,"property2":property_name...}
function get_property_names(properties){
  var temp={}
  properties.forEach(function(d){
        temp[d["property"]]=d["property_name"]
      })
      return temp

}
// Generate random string for ids
function genRandomString(){
  var s=Math.random().toString(36).substr(2, 11);
  if (s.match(/^\d/)) {
   s="_"+s
  }
  return s; 
}

//Get tooltip from Config File
// format: [{"property":....,"tooltip_text"},{"property2":....,"tooltip_text"}]
function getTooltip(option_text){
  var selClass=configFile.filter(function(d){
    return d.option_text==option_text
  })
  if(selClass[0]!=undefined){
    return selClass[0]["tooltip"]
  }else{
    return ""
  } 
}

// changeBasicGraph is the function called when changing option in flyout menu
// of basic mode menu
  
function changeBasicGraph(option){

  //remove filter, legend and graph
  d3.selectAll(".classFilter").remove()
  //d3.select("#legend").selectAll("li").remove()
  d3.selectAll(".graph").remove()                                                                      

  
  //reset global variables
  propertiesFilterHist=[]
  execQueries=[]
  filtersInGraph=[]
  classesFilterList=[]
  filtersList=[]

  if(networkGraph){
    networkGraph = undefined;
    //colorScale=[]
    //console.log("pasa por aquí")
    legend.deleteAllColors()
    legend=undefined
    ////////console.log(legend)
    //console.log(nodesClassesCorrespondence)
    //console.log(nodesClassesShow)
    nodesClassesCorrespondence={}
    nodesClassesShow=[]

  }
  //graphHistory=[]

  //hide flyout menu
  $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
  $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  
  //get option selected for searching in Config File
  option=$(option).find( "#optionMain" ).text().trim()

  let pos = configFile.map(function (e) {
    return e.option;
  }).indexOf(option);

  showBasicGraph()

  //build and show graph
  //////////console.log("antes de build")
  //////////console.log(pos)
  buildBasicGraph(pos)
  //////////console.log("despues de ...")
}
//Remove all elements from screen and show graph area
function showBasicGraph(){
  //landing-text
  //landing-img
  //networkGraph
  $("#graph-area").removeClass("hidden")
  $("#form-container").addClass("hidden")
  $("#landing-img").addClass("hidden")
  $("#landing-text").addClass("hidden")
}

//Show options from the Config File in menu
/* function getMenuItems(items,node,pageX,pageY,origin){
  var menuItems=[],element,position
  
  //if click on Navigation panel then origin=table
  if (origin=="table"){
    for (var i = 0; i < items.length; i++) {
      //add all items to menu in table. Get options text and line in config file
      //and add it to the table
      menuItems.push({"option":items[i]["option"],"position":items[i]["position"]})
    }
    //function that add menu items to table
    ////////////////console.log("antes de add...")
    addMenuToTable(node,menuItems)
  }else{
    //if click on bubble in graph, fill menu to show on screen next to bubble
    //and add action to build basic graph in case the option in the menu is clicked
    for (var i = 0; i < items.length; i++) {
      position=items[i]["position"]
      element={
        title: items[i]["option"],
        action: (data,d) => {
          
          for (var i = 0; i < configFile.length; i++) {
                if(configFile[i]["option"] == d.title){
                  position=i
                }
              }
          if(node.menuOption!=undefined){
            if(node.menuOption.split(";")[0]==d.title){
              networkGraph.expandLevelBranch(node)          
              networkGraph.data=flatten(networkGraph.treeData).flatData
              networkGraph.initializeSimulation();
              networkGraph.dataJoinGraph()
              networkGraph.enterGraph()
              
              networkGraph.initializeSimulation();
              networkGraph.dataJoinGraph()
              networkGraph.exitGraph()
            }else{
              buildBasicGraph(position,node,d.title)
            }
          }else{
            buildBasicGraph(position,node,d.title)
          }
        }
      }
      menuItems.push(element)
    }
    //Send menuItems to menuFactory which will draw the menu in the graph
    networkGraph.menuFactory(100,0, menuItems, node,"dblClick",250)
  }
} */
/* var dcx = (window.innerWidth/2-d.x*zoom.scale());
	var dcy = (window.innerHeight/2-d.y*zoom.scale());
	zoom.translate([dcx,dcy]);
	 g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
 */
//Show options when right clicking
async function getMenuItemsContextMenu(node,origin,pageX,pageY){
  var Items;
  //if right click on table get all options in a format for table
  if(origin=="table"){
    Items=[{
      option: 'Download data',
      position: 1,
      action:"downloadData(node)"
    },{
      option: 'Download SPARQL query',
      position: 2,
      action:"downloadQuery()"
    }]
    //if type of graph is Free Graph add option to check if there are links to Basic Graph
    if(node.class=="free"){
      Items.push({
        option: 'Check Basic Graph',
        position: 3,
        action:"checkBasicGraph(node)"
      })
    }
  }else{
    //if right click on bubble get all options in a format for bubble
    Items = [
      {
        title: 'Download data',
        position:1,
        action: (d) => {
          // TODO: add any action you want to perform
          downloadData(d)
        }
      },
      {
        title: 'Download SPARQL query',
        position:2,
        action: (d) => {
          // TODO: add any action you want to perform
          downloadQuery()
        }
      }]
    //if type of graph=Free show one more option that connect Free Graph with Basic Graph
    if(node.class=="free"){
      Items.push({
        title: 'Check Basic Graph',
        position: 3,
        action: (d) => {
          // TODO: add any action you want to perform
          checkBasicGraph(d)
        }
      })
    }
  }

    //add a different menu if clicking from table or bubble
    if(origin=="table"){
      addContextMenuToTable(node,Items)
    }else{

      ////////////console.log("-------------------------")
      ////////////console.log("pageX: "+pageX)
      ////////////console.log("pageY: "+pageY)
      ////////////console.log(pageX-200)
      ////////////console.log(pageY-200)
      ////////////console.log("zoomScale: "+networkGraph.zoomScale)
      if(pageY-200<0){
        ////////////console.log("pageY menos")
        pageY=pageY+100
      }else{
        pageY=pageY-100
      }
      if(pageX-200<150){
        ////////////console.log("pageX menos")
        pageX=pageX+150
      }else{
        //pageX=pageX-200
      }
      ////////////console.log("pageX after: "+pageX)
      ////////////console.log("pageY after: "+ pageY)
      ////////////console.log(d3.select("#networkGraph").node())
      ////////////console.log(d3.select("#networkGraph").node().getBoundingClientRect().width)
      //pageX - width / 2, pageY - height / 1.5
      networkGraph.menuFactory(pageX, pageY , Items, node,"contextMenu",250);
    }  
}
//execute sparql query
function runSparlqQuery(settings){
  /* return new Promise((resolve, reject) => {
    $.ajax(settings).then  (function( _data ) {
      results = _data.results.bindings;
      resolve(results)
    })
  }) */
  //console.log(settings)
  return new Promise((resolve, reject) => {
    $.ajax(settings).then  (function( _data ) {
      //////console.log(_data.results)
      //results = _data;
      resolve(_data.results.bindings)
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR.status)
      reject(jqXHR.status)
      });
    })
}
//run Ask Sparql Query
function runAskSparlqQuery(url,sparqlQuery){
  var prefixes="",settings
  var queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  
  if (url=="https://query.wikidata.org/sparql"){
    settings = { url: queryUrl, async: true       }; 
  }else{
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  }

  return new Promise((resolve, reject) => {
  $.ajax(settings).then  (function( _data ) {
    results = _data.boolean;
    resolve(results)
  })
  .fail(function(jqXHR, textStatus, errorThrown){
    reject(jqXHR.status)
    });
  })

}


function replaceParametersQuery(node,sparqlQuery){
var j=2,result;
while(sparqlQuery.indexOf("PARAMETER"+(j).toString())!=-1){
  var regex = new RegExp('(?<='+escapeRegExp("FILTER(?")+').*(?='+"=<PARAMETER2"+')')
  result=regex.exec(sparqlQuery)[0]

  j+=1
}
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
}

function fromSelectToAskQuery(query){
  var mySubString;
  if(query.toLowerCase().indexOf("where")!=-1){
    mySubString = query.substring(
      query.toLowerCase().indexOf("select"), 
      query.toLowerCase().indexOf("where") - 1 
    );
    query=query.replace(mySubString,"ASK")
    if(query.toLowerCase().indexOf("select")!=-1){
      mySubString = query.substring(
        query.toLowerCase().indexOf("select"), 
        query.toLowerCase().lastIndexOf("where") + 5 
      );
      query=query.replace(mySubString,"")
    }
  }else{
    mySubString = query.substring(
      query.toLowerCase().indexOf("select"), 
      query.toLowerCase().indexOf("{") - 1 
    );
    query=query.replace(mySubString,"ASK")
  }
  
  if(query.toLowerCase().lastIndexOf("group by")!=-1){
    mySubString = query.substring(
      query.toLowerCase().lastIndexOf("group by"), 
      query.length - 1 
    );
    query=query.replace(mySubString,"")
  }

  if(query.toLowerCase().lastIndexOf("order by")!=-1){
    mySubString = query.substring(
      query.toLowerCase().lastIndexOf("order by"), 
      query.length 
    );
    query=query.replace(mySubString,"")
  }

  if(query.toLowerCase().lastIndexOf("limit")!=-1){
    mySubString = query.substring(
      query.toLowerCase().lastIndexOf("limit"), 
      query.length 
    );
    query=query.replace(mySubString,"")
  }
  query=query.replaceAll("parameter","PARAMETER")
  return query
}

 //function that return node in the treeMap if founded
 function findNodeTreemap(nodeId,treeData){
   var founded=treeData.filter(function(item) {
     return item.id == nodeId
   })
   return founded
 }

//Tooltip added to the network graph if hover over bubble
//This is the toolip for Basic Graph
function getTooltipText(d){
  //////console.log(d)
  if(d.class=="menuOption"){
    text= `<div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-2 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Node values
        </h3>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            ` + d.value + `
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Degree
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            ` + d.number + `
            </dd>
          </div>
        </dl>
      </div>
    </div>`;
    return text;
  }else{
    //////console.log("no menu option")
    var text = `
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-2 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Node values
        </h3>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            ` + d.value + `
            </dd>
          </div>
          <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Class
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            ` + nodesClassesCorrespondence[d.class] + `
            </dd>
          </div>`
          ////////console.log(d)
          if(d["tooltip"]){
            Object.keys(d["tooltip"]).forEach(function(k){
              text=text + `
              <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">` + d["tooltip"][k] + `</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">`+ d[k] + `</dd>
              </div>`
            })      
          }

          text=text + `<div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Degree
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            ` + d.number + `
            </dd>
          </div>
        </dl>
      </div>
    </div>`;
    //////console.log(text)
    return text;
  } 
}
//This is the tooltip for the menu options
function getTooltipMenu(d){
  var text= `<div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="border-t border-gray-200 py-3 px-2">
          ` + d + `
          </div>
        </div>`;
  return text;
}
// Add to legend

function differenceArrays(a1, a2) {
  var result = [];
  for (var i = 0; i < a1.length; i++) {
    if (a2.indexOf(a1[i]) === -1) {
      result.push(a1[i]);
    }
  }
  return result;
}
//function to autocomplete in search field
function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
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
        //if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          b.setAttribute("class", "cursor-pointer");
          b.innerHTML = arr[i].toUpperCase().substr(0,arr[i].toUpperCase().indexOf(val.toUpperCase()));
          b.innerHTML += "<strong>" + arr[i].toUpperCase().substr(arr[i].toUpperCase().indexOf(val.toUpperCase()), val.length) + "</strong>";
          b.innerHTML += arr[i].toUpperCase().substr(arr[i].toUpperCase().indexOf(val.toUpperCase())+val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              autocompleteValSelected(this)
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
      if(elmnt){
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }else{
        x[i].parentNode.removeChild(x[i]);
      }     
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
//function used in autocomplete to close list shown
function closeAllLists(elmnt) {
  /*close all autocomplete lists in the document,
  except the one passed as an argument:*/
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if(elmnt){
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }else{
      x[i].parentNode.removeChild(x[i]);
    }     
  }
}
//function used in autocomplete to add value selected to the navigation panel.
function autocompleteValSelected(el){
  if(el.parentNode.getAttribute("id")=="node-searchautocomplete-list"){
    navigation.valueSelected()
  }
}
//function that get a key of an object from value
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
function getCommentOption(option){
  return configFile.filter(d=>d.option==option)[0]["option_text"]
}
function get_node_from_element(id){
  return d3.select("#"+id).data()[0]
}

function get_configRows_class(classNode){
  var configRows=[]
  for(var i = 0; i < configFile.length; i++) {
    if(configFile[i]["class"]==classNode){
      configRows.push({"position":i,"option":configFile[i]["option"],"optionText":configFile[i]["option_text"]})
    }
  }
  return configRows
}

//get image for bubble. If no image in images file, get question mark.
function bubbleImage(node){
  var icon=[],propertyUri;
  //////////console.log(node)
  
  if((node[node["class"]+"_image"]!=undefined)&&(node[node["class"]+"_image"]!="")){
    return node[node["class"]+"_image"];
  }else{
    propertyUri=propertyUriImage(node)
    //////////console.log(propertyUri)
    if(propertyUri){
      //////////console.log(node)
      //////////console.log(node[propertyUri])
      //////////console.log(filesIcons)
      icon=filesIcons.filter(function(d){
        return d.ID==node[propertyUri];
      })
      ////////////console.log(icon)
    }else{
      if(node[node["class"]+"_uri"]){
        icon=filesIcons.filter(function(d){
          return d.ID==node[node["class"]+"_uri"];
        })
      }
      if(icon.length==0){
        icon=filesIcons.filter(function(d){
          return d.ID==nodesClassesCorrespondence[node["class"]];
        })
      }
    }
    
    if(icon.length>0){
      return icon[0]["FILE"]
    }else{
      return "images/question_mark.svg";
    }
  }
  
}
function propertyUriImage(node){
  var propertyUri=false;
  if(configFile[node["configRowNumber"]]){
    //////////console.log(configFile[node["configRowNumber"]]["properties"])
    configFile[node["configRowNumber"]]["properties"].filter(d=>d.class==node["class"]).forEach(function(p){
      if(p.property.endsWith("_uri")){
        property=p.property.replace("_uri","")
        //////////console.log(property)
        //if(configFile[node["configRowNumber"]]["properties"].filter(d=>(d.class==node["class"])&&(d.property==property))){
        if(node["class"]!=property){
          //////////console.log(property)
          //////////console.log(p.property)
          propertyUri= p.property
        }
      }
    })
  }
  return propertyUri
}

//function for transition from bubble image to text in bubbles when zoom in and zoom out
function textImageZoom(zoomScale){
  if(zoomScale>1.5){
    d3.selectAll(".nodeCircleImage")
    .transition()
    .attr('opacity', function(d) {
                return 0;
              })
    //}
    d3.selectAll(".nodeCircleText")
    .transition()
    .attr('opacity', function(d) {
                return 1;
              })
  }else{
    d3.selectAll(".nodeCircleImage")
    .transition()
    .attr('opacity', function(d) {
                return 1;
              })
    d3.selectAll(".nodeCircleText")
    .transition()
    .attr('opacity', function(d) {

                return 0;
              })
  }
}
//select tab from navigation panel. Show children or show detail for node
function selectTab(element,otherText){
  var otherEl;
  var elements = element.querySelectorAll('span');
  elements[1].classList.remove("bg-transparent")
  elements[1].classList.add("bg-blue-500")
  otherEl=document.getElementById(otherText)
  otherEl.classList.remove("text-gray-900")
  otherEl.classList.add("text-gray-500")
  elements = otherEl.querySelectorAll('span');
  elements[1].classList.add("bg-transparent")
  elements[1].classList.remove("bg-blue-500")
  element.classList.remove("text-gray-500")
  element.classList.add("text-gray-900")

  if(otherText=="detailsLink"){
    navigation.contentTable()
  }else{
    navigation.showDetails()
  }
  
}

//Save detail properties in node. When click on detail tab, the detail will shown
//based on structure
function getDetail(detail,nodeClass){
  var detailNode="";

  if(detail!=undefined){
    if(detail!=""){
      for (let k of detail) {
        if(k["class"]==nodeClass){
          detailNode=k["details"]
          break
        }
      }
    }
  }
  return detailNode;
}

//change networkgraph type of visualization
//with this function we have unique bubbles per value and all links will point to
//the same bubble
function nestedNodes(el){
  if(el.classList.contains("bg-gray-200")){
    el.classList.remove("bg-gray-200")
    el.classList.add("bg-blue-600")
    const span=el.querySelector("span")
    span.classList.remove("translate-x-0")
    span.classList.add("translate-x-5")
    
    networkGraph.data=treeDataNestedNodes().flatData
    networkGraph.initializeSimulation();
    networkGraph.dataJoinGraph()
    networkGraph.enterGraph()
    networkGraph.initializeSimulation();
    networkGraph.dataJoinGraph()
    networkGraph.exitGraph()
  }else{
    el.classList.remove("bg-blue-600")
    el.classList.add("bg-gray-200")
    const span=el.querySelector("span")
    span.classList.remove("translate-x-5")
    span.classList.add("translate-x-0")

    networkGraph.data=flatten_v2(networkGraph.treeData).flatData
    networkGraph.initializeSimulation();
    networkGraph.dataJoinGraph()
    networkGraph.enterGraph()
    networkGraph.initializeSimulation();
    networkGraph.dataJoinGraph()
    networkGraph.exitGraph()
  }  
}
function highlightLinkedNodes(node){
  deselectNodes()
  ////////////console.log(selectTargetNodes(node))
  ////////////console.log(selectSourceNodes(node))
}
function highlightTargetNodes(node){
  let data=selectTargetNodes(node)
  deselectNodesAndLinks()
  ////////////console.log(data.links)
  highlightLinks(data.links)
  highlightNodes(data.nodes)
}
function selectTargetNodes(node){
  ////////////console.log(node)
  var targetNodes=[],targetLinks=[]
  ////////////console.log(networkGraph.data.links)
  let targets=networkGraph.data.links.filter(function(item) {
    return item.source.id == node.id
  })
  ////////////console.log(targets[0])
  targetNodes.push(targets[0].source.id)
  targets.forEach(function (d){
    targetLinks.push(d.id)
    targetNodes.push(d.target.id)
  })
  return {nodes:targetNodes,links:targetLinks};
}
function selectSourceNodes(node){
  var sourceNodes=[],sourceLinks=[]

  let sources=networkGraph.data.links.filter(function(item) {
    return item.target.id == node.id
  })
  sources.forEach(function (d){
    sourceLinks.push(d.id)
    sourceNodes.push(d.target.id)
  })
  return {nodes:sourceNodes,links:sourceLinks};
}
function highlightLinks(links){
  ////////////console.log(links)
  const even = d3.selectAll(".link").filter(function(d){
    return links.includes(d.id)
    //////////////console.log(d.id)
    //////////////console.log(links)
  });
  ////////////console.log(even)
  even.style("stroke", "black")
  .style("fill","black")
  //.style("stroke-width", "2px")
}
function highlightNodes(nodes){
  const even = d3.selectAll(".circleBasic").filter(function(d){
    return nodes.includes(d.id)
    //////////////console.log(d.id)
    //////////////console.log(links)
  });
  ////////////console.log(even)
  even.attr("stroke", "black")
  .attr("stroke-width", "3px")
}
function deselectNodesAndLinks(){
  d3.selectAll(".circleBasic")
  .attr("stroke", "gray")
  .attr("stroke-width", "1px")

  d3.selectAll(".link")
  .style("stroke", "gray")
  .style("fill","gray")
}
function showSpinMessage(message){
  var fn = function(){
    d3.select("#spin").style("display","none")
    document.getElementById("sparql-timeout").style.display="inline-block"
  };
  d3.select("#spin-message")
  .text(message)
  d3.select("#spin").style("display","inline-flex")
  interval = setInterval(fn, 8000);
  return interval
}
function hideSpinMessage(interval){
  d3.select("#sparql-timeout").style("display","none")
  d3.select("#spin").style("display","none")
  clearInterval(interval)
}