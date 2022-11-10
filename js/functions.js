/*
*    VINALOD
*    functions.js
*    
*    created by Teresa Barrueco
*/
function setMenuOption(node,option){
  //setMenuOption(data,d.title)
  if((configFile.file.filter(d=>d.option==option).length==0)||(configFile.file.filter(d=>d.option==option)[0]["type"]=="TREE")){
    if(node.menuOption){
      node.menuOption+=";"+option
    }else{
      node.menuOption=option
    }
  }
  ////console.log(node)
}
function get_unique_values_arrays(arr1,arr2){
  arr1=arr1.concat(arr2)
  return [...new Set(arr1)];
}

// Generate random string for ids
function genRandomString(){
  var s=Math.random().toString(36).substr(2, 11);
  if (s.match(/^\d/)) {
   s="_"+s
  }
  return s; 
}

//Show options when right clicking
async function getMenuItemsContextMenu(node,origin,pageX,pageY){
  var Items;
  //////////////console.log("entra")
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
      if(pageY-200<0){
        //////////////////////////////////////////////////////console.log("pageY menos")
        pageY=pageY+100
      }else{
        pageY=pageY-100
      }
      if(pageX-200<150){
        //////////////////////////////////////////////////////console.log("pageX menos")
        pageX=pageX+150
      }else{
        //pageX=pageX-200
      }
      networkGraph.menuFactory(pageX, pageY , Items, node,"contextMenu",250);
    }  
}

//execute sparql query
async function runSparlqQuery(url,query,type){
  ////////////console.log(query)
  var settings;
  console.log(url)
  console.log(query)
  //console.log(configRow)
  ////////console.log(type)
  var p = new Promise(function(resolve, reject){
    let prefixes="";
    let queryUrl = url + "?query=" + prefixes +  encodeURIComponent( query )+ "&format=json";
    console.log(url)
    console.log(typeof(url))
    if(url.includes("wikidata")){
      settings = { url: queryUrl, async: true       }; 
    }else{
      settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    }
    //
    settings["success"] =function (_data) {
      if(type=="query"){
        resolve(_data.results.bindings)
      }else if(type=="askquery"){
        resolve(_data.boolean)
      }
    }
    $.ajax(settings)
  })
  return await p.then(async function(_data){
    return _data
  })
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
            ` + d.className + `
            </dd>
          </div>`
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
    return text;
  } 
}

function getTooltipTextFreeGraph(d) {
  var menuOptions, sparqlEndpoint = "", position = "",text;
  if (d.type == "menuOption") {
    menuOptions = d.value.split(",")
    text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-2 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Option values
          </h3>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              URI
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + d.uri + `
              </dd>
            </div>
            <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              Sparql Endpoint
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + menuOptions[0] + `
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              Position
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + menuOptions[1] + `
              </dd>
            </div>
          </dl>
        </div>
      </div>`;
  } else if (typeof (d) == "string") {
    text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
          ` + d + `
          </h3>
        </div>
        </div>`;
  } else {
    if (d.menuOption != undefined) {
      if (d.menuOption.split(";").length == 1) {
        sparqlEndpoint = d.menuOption.split(",")[0]
        position = d.menuOption.split(",")[1]
      } else {
        sparqlEndpoint = "several"
      }
    }
    if (d.property) {
      text = `
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
                  Property
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ` + d.property + `
                </dd>
              </div>
              <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Name
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ` + d.value + `
                </dd>
              </div>
            </dl>
          </div>
        </div>`;
    }else if (d.target) {
      if(d.target.property){
        text = `
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
                  Property
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ` + d.target.property + `
                </dd>
              </div>
            </dl>
          </div>
        </div>`;
      }
  }else {
      text = `<div class="bg-white shadow overflow-hidden sm:rounded-lg">
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
              </dl>
            </div>
          </div>`;
      getOptionChosen()
    }
    function getOptionChosen() {
      if (d.menuOption != undefined) {
        if (sparqlEndpoint != "several") {
          text = text + `
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-2 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Option chosen
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Sparlq Endpoint
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + sparqlEndpoint + `
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Position
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + position + `
                  </dd>
                </div>
              </dl>
            </div>
          </div>`
        } else {
          text = text + `
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
              Several options displayed in graph. Click on each option to see results values
              </h3>
            </div>
            </div>`
        }
      }
    }
  }

  return text;
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
function getCommentOption(option){
  return configFile.file.filter(d=>d.option==option)[0]["option_text"]
}
function get_node_from_element(id){
  return d3.select("#"+id).data()[0]
}

//get image for bubble. If no image in images file, get question mark.
function bubbleImage(node){
  var icon=[],propertyUri;
  if((node[node["class"]+"_image"]!=undefined)&&(node[node["class"]+"_image"]!="")){
    return node[node["class"]+"_image"];
  }else{
    propertyUri=propertyUriImage(node)
    if(propertyUri){
      icon=filesIcons.filter(function(d){
        return d.ID==node[propertyUri];
      })
    }else{
      if(node[node["class"]+"_uri"]){
        icon=filesIcons.filter(function(d){
          return d.ID==node[node["class"]+"_uri"];
        })
      }
      if(icon.length==0){
        icon=filesIcons.filter(function(d){
          return d.ID==node["className"];
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
  if(configFile.file[node["configRowNumber"]]){
    configFile.file[node["configRowNumber"]]["properties"].filter(d=>d.class==node["class"]).forEach(function(p){
      if(p.property.endsWith("_uri")){
        property=p.property.replace("_uri","")
        if(node["class"]!=property){
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
  element.classList.add("ecl-tabs__link--active")

  if(element.getAttribute("id")=="detailsLink"){
    document.getElementById("childNodesLink").classList.remove("ecl-tabs__link--active")
    navigationPanel.showDetails()
  }else{
    document.getElementById("detailsLink").classList.remove("ecl-tabs__link--active")
    navigationPanel.contentTable()
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
}
function highlightTargetNodes(node){
  let dataHighlight=selectTargetNodes(node)
  deselectNodesAndLinks()
  highlightLinks(dataHighlight.links)
  highlightNodes(dataHighlight.nodes)
}
function selectTargetNodes(node){
  var targetNodes=[],targetLinks=[]
  let targets=networkGraph.data.links.filter(function(item) {
    return item.source.id == node.id
  })
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
  const even = d3.selectAll(".link").filter(function(d){
    return links.includes(d.id)
  });
  even.style("stroke", "black")
  .style("fill","black")
}
function highlightNodes(nodes){
  const even = d3.selectAll(".circleBasic").filter(function(d){
    return nodes.includes(d.id)
  });
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
function deleteTooltip(){
  $('.tooltip').empty();
  d3.select(".tooltip").transition()		
  .duration(200)		
  .style("opacity", 0)
}
function addTooltip(htmlData){
  var x = d3.event.pageX
  var y = d3.event.pageY 

  document.getElementsByClassName("tooltip")[0].insertAdjacentHTML('afterbegin', htmlData);
  d3.select(".tooltip").transition()		
  .duration(200)		
  .style("opacity", 1)
  .style("top",y+50)
  .style("left",x+50)
}
function showBasicGraph(){
  $("#graph-area").removeClass("hidden")
  $("#form-container").addClass("hidden")
  $("#landing-img").addClass("hidden")
  $("#landing-text").addClass("hidden")
}
function fromSelectToAskQuery(query){
  var mySubString;
  //////////console.log(query)
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
  //query=query.replaceAll("parameter","PARAMETER")
  ////////////////////console.log(query)
  return query
}
function changeDateFormat(date){
  //////////////////////console.log(date)
  let prevFormat=new Date(date)
  //////////////////////console.log(prevFormat)
  //////////////////////console.log(prevFormat.getMonth())
  //////////////////////console.log(prevFormat.getDate()+"-"+(prevFormat.getMonth()+1)+"-"+prevFormat.getFullYear())
  return (prevFormat.getDate()+"-"+(prevFormat.getMonth()+1)+"-"+prevFormat.getFullYear())
}

function formatDate(str){
  //////////console.log(str)
  const [day, month, year] = str.split('-');
  const date = new Date(+year, +month - 1, +day);
  ////////////console.log(date); 
  return new Date(date)
}
function dateValidFormat(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return dateStr;
  }

  const date = new Date(dateStr);

  ////////////console.log(date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear())

  return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
}
/* function formatDateTime(str){
  let date=new Date(str)
  ////////////////////console.log(date.getDate())
  ////////////////////console.log(date.getMonth())
  ////////////////////console.log(date.getFullYear())
  const [day, month, year] = str.split('-');
  //const date = new Date(+year, +month - 1, +day);
  //////////////////////console.log(date); 
  return date
} */
/* function relatedFilters(filterEl){
  var values,relNodes,filter;
  ////////////console.log(filterEl)
  ////////////console.log(networkGraph.filterClassesObjects)
  networkGraph.filterClassesObjects.forEach(function (d){
    if(d.filters.filter(f=>f.id==filterEl.id)){
      filter=d.filters.filter(f=>f.id==filterEl.id)[0]
    }
  })
  ////////////console.log(filter)
  var selectobject = document.getElementById("mySelect");
  for (var i=0; i<selectobject.length; i++) {
      if (selectobject.options[i].value == 'A')
          selectobject.remove(i);
  }
  //////////////console.log(filterEl.name.split("_")[0])
  //////////////console.log(networkGraph.filterClassesObjects.filter(d=>d.name==filterEl.name.split("_")[0]))
  //const filter=networkGraph.filters.filter(d=>d.property==filterEl.id)[0]
  const relFilters=networkGraph.filters.filter(d=>d.parent==filterEl.id)
  //////////////////console.log(filter)
  //////////////////console.log(filterEl.options[filterEl.selectedIndex].text)
  ////////////////console.log(networkGraph.allData)
  ////////////////console.log(networkGraph.data)
  ////////////console.log(filter)
  relNodes=networkGraph.allData["nodes"].filter(d=>d.class==filter.class).filter(v=>v[filter.property]==filterEl.options[filterEl.selectedIndex].text)
  relFilters.forEach(function(fi){
    //////////////////console.log(fi)
    if(filterEl.options[filterEl.selectedIndex].text!="All"){
      values=[...new Set(relNodes.map(d=>d[fi.property].toLowerCase()))]
    }else{
      //////////////////console.log(fi)
      values=fi.filterObject.values
      //////////////////console.log(values)
    }
    $(("#accordion-filters #"+fi.property)).empty();
    var select = document.querySelector("#accordion-filters #"+fi.property);
    //////////////////console.log(select)
    addOptionsSelect(select,values,false)

    ////////////////////console.log(selectobject.options.remove)

    for (var i=0; i<selectobject.options.length; i++) {
        //////////////////console.log(values)
        //////////////////console.log(selectobject.options[i].value)
        if (!values.includes(selectobject.options[i].value)){
          selectobject.remove(i);
          i--;
        }     
    }
  })
} */
/* function checkRelatedFilters(filterEl){
  let classNode=filterEl.parentNode.parentNode.parentNode

  let field=filterEl.id.replace(classNode.id.replace("filters",""),"")
  let selectedValues = Array.from(filterEl.selectedOptions)
        .map(option => option.value) 
  
  let relatedFilters=networkGraph.filters.filter(f=>((f.class.replaceAll(":","_").replaceAll(".","_").replaceAll("/","_")+"_filters"==classNode.id)&&(f.field!=field)))
  ////////////////console.log(relatedFilters)
  relatedFilters.forEach(function(r){
    //////////////console.log(r)
  })
}
function checkRelatedFilters(filterEl){
  let classNode=filterEl.parentNode.parentNode.parentNode

  let field=filterEl.id.replace(classNode.id.replace("filters",""),"")
  let selectedValues = Array.from(filterEl.selectedOptions)
        .map(option => option.value) 
  
  let relatedFilters=networkGraph.filters.filter(f=>((f.class.replaceAll(":","_").replaceAll(".","_").replaceAll("/","_")+"_filters"==classNode.id)&&(f.field!=field)))
  ////////////////console.log(relatedFilters)
  relatedFilters.forEach(function(r){
    //////////////console.log(r)
    //////////////console.log($("#"+r.id))
  })
} */

function addOptionsSelect(selectField,valuesFilter,multiple){
  //////////console.log(selectField)
  //////////console.log(valuesFilter)
  //////////////console.log(multiple)
  if(valuesFilter.length>1){
    valuesFilter.unshift("All")
  }
  addHtmlOptionsSelect(selectField,valuesFilter,multiple)
}
function addHtmlOptionsSelect(selectField,valuesFilter,multiple){
  //////////console.log(selectField)
  for (let i = 0; i < valuesFilter.length; i++) {
    var option = document.createElement("option");
    option.value = valuesFilter[i];
    option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
    ////////////////////console.log(option)
    selectField.appendChild(option);
    //////////////console.log(multiple)
    if(multiple){
      option.selected = true; 
    }
  }
}
function getModalHeader(){
  return document.getElementById("modal-header2")
}
function getModalContent(){
  return document.getElementById("modal-content2")
}

function modalVisibilityOn(){
  if($("#modal-content2 #modalGraph")){
    $("#modal-content2 #modalGraph").remove()
  }
  if($("#modal-content2 iframe")){
    $("#modal-content2 iframe").remove()
  }
  $("#myModal2").removeClass("translate-x-full")
  $("#myModal2").addClass("translate-x-0")
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
function showNavContentTable(){
  $("#dvTable").show()
}
function hideNavContentTable(){
  $("#dvTable").hide()
}
function showNavContentTablePagination(){
  $("#div-pagination").show()
}
function hideNavContentTablePagination(){
  $("#div-pagination").hide()
}
function getNodeFromTableRow(element){
  const parent = element.parentElement.closest('tr');
  const node=get_node_from_element(parent.id.replace("_row",""))
  return node;
}
function replaceParmtrsQuery(query,parameters,node){
  var query;
  //////console.log(query)
  //////console.log(node)
  //////console.log(parameters)
  if(node!=undefined){
      if((parameters!="")&&(parameters!=null)){
          ////////////////console.log(cr.rowFields.parameters)
          ////////////////console.log(cr.node)
          ////////////////console.log(cr.rowFields.askquery)
          for (let i = 0; i < parameters.length; ++i) { 
              query=query.replaceAll("PARAMETER"+(i+2).toString(), node[parameters[i]["property"]]);
              ////////////////console.log(cr.rowFields.parameters[i])
              ////////////////console.log(cr.node[cr.rowFields.parameters[i]["property"]])
          } 
          ////////////////console.log(cr.rowFields.askquery) 
      }
      //////////console.log(query)
      query=query.replaceAll("PARAMETER", node[node["class"]+"_uri"]);    
  }
  return query
}