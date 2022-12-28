/*
*    VINALOD
*    functions.js
*    
*    AUTOCOMPLETE https://www.w3schools.com/howto/howto_js_autocomplete.asp
*    created by Teresa Barrueco
*/
function setMenuOption(node,option){
  if((configFile.file.filter(d=>d.option==option).length==0)||(configFile.file.filter(d=>d.option==option)[0]["type"]=="TREE")){
    if(node.menuOption){
      node.menuOption+=";"+option
    }else{
      node.menuOption=option
    }
  }
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
function showMessageForNoGraphs(){
  $("#no-graphs-message").show()
  component=$("#no-graphs-message")[0]
  runAutoInit(component)
  //console.log(ECL.autoInit())
}
//Show options when right clicking
async function getMenuItemsContextMenu(node,origin,pageX,pageY){
  var Items;
  //if right click on table get all options in a format for table
  if(origin=="table"){
    Items=[{
      option: 'Download data',
      position: 1,
      action:"downloadData()"
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
          downloadData()
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
        pageY=pageY+100
      }else{
        pageY=pageY-100
      }
      if(pageX-200<150){
        pageX=pageX+150
      }else{
        //pageX=pageX-200
      }
      networkGraph.menuFactory(pageX, pageY , Items, node,"contextMenu",250);
    }  
}

//execute sparql query
async function runSparlqQuery(url,query,type){
  var settings;
  //////////console.log(query)
  showSpinMessage()
  var p = new Promise(function(resolve, reject){
    let prefixes="";
    let queryUrl = url + "?query=" + prefixes +  encodeURIComponent( query )+ "&format=json";
    if(url.includes("wikidata")){
      settings = { url: queryUrl, async: true       }; 
    }else{
      settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    }
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
    hideSpinMessage()
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
function autocomplete(inp, arr,numParentNodes) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value,node=this;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      for(i=0;i<numParentNodes;i++){
        node=node.parentNode
      }
      node.appendChild(a)
      //this.parentNode.appendChild(a);
      console.log(arr)
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
        //if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          b.setAttribute("class", "cursor-pointer");
/*           b.innerHTML = arr[i].toUpperCase().substr(0,arr[i].toUpperCase().indexOf(val.toUpperCase()));
          b.innerHTML += "<strong>" + arr[i].toUpperCase().substr(arr[i].toUpperCase().indexOf(val.toUpperCase()), val.length) + "</strong>";
          b.innerHTML += arr[i].toUpperCase().substr(arr[i].toUpperCase().indexOf(val.toUpperCase())+val.length); */
          b.innerHTML = arr[i].substr(0,arr[i].indexOf(val));
          b.innerHTML += "<strong>" + arr[i].substr(arr[i].indexOf(val), val.length) + "</strong>";
          b.innerHTML += arr[i].substr(arr[i].indexOf(val)+val.length);
          /*insert a input field that will hold the current array item's value:*/
          ////////////////console.log(arr[i])
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
          a.appendChild(document.createElement("hr"))
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
    navigationPanel.valueSelected()
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
    d3.selectAll(".nodeCircleMnemo")
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

    d3.selectAll(".nodeCircleMnemo")
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
  //interval = setInterval(fn, 8000);
  //return interval
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
  showGraphArea()
  hideExpertForm()
/*   $("#landing-img").addClass("hidden")
  hideLandingText() */
}
function collectionOptionsVisible(){
  $("#collections-div").removeClass("hidden")
}
function collectionOptionsNotVisible(){
  $("#collections-div").addClass("hidden")
}
function openNavigationPanel(){
  $("#myModal").removeClass("translate-x-full")
  $("#myModal").addClass("translate-x-0")
  //ECL.autoInit();
}
function closeNavigationPanel(){
  $("#myModal").addClass("translate-x-full")
  $("#myModal").removeClass("translate-x-0")
}

function removeColorsFromLegend(){
  d3.selectAll("#legend li").remove()
}
/* function showLandingText(){
  $("#landing-text").removeClass("hidden")
}
function hideLandingText(){
  $("#landing-text").addClass("hidden")
} */
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
  return query
}
function changeDateFormat(date){
  let prevFormat=new Date(date)
  return (prevFormat.getDate()+"-"+(prevFormat.getMonth()+1)+"-"+prevFormat.getFullYear())
}

function formatDate(str){
  //////console.log(str)
  const [day, month, year] = str.split('-');
/*   //////////console.log(day)
  //////////console.log(month)
  //////////console.log(year) */
  const date = new Date(+year, +month - 1, +day);
  ////////////console.log(date)
  return new Date(date)
}

function formatDateComp(str){
  //////console.log(str)
  return formatDate(str).getTime()
}
function formatDateShow(str){
  let day=("0" + formatDate(str).getDate()).slice(-2)
  let month=("0" + (formatDate(str).getMonth() + 1)).slice(-2)
  return day+"-"+month+"-"+formatDate(str).getFullYear()
}

function ECLdestroy(component){
  //let eclComponent=window.ECL.components.filter(d=>d.element==component)
  let index=window.ECL.components.findIndex(d=>d.element==component)
  let eclComponent=window.ECL.components[index]
  ////console.log(index)
  ////console.log(eclComponent)
  ////console.log(eclComponent.length)
  ////console.log(window.ECL.components)
  if(index!=-1){
    //console.log("entra")
    eclComponent.destroy()
    window.ECL.components.splice(index, 1);
  }
  ////console.log(window.ECL.components)
}
function ECLupdate(component){
  let eclComponent=window.ECL.components.filter(d=>d.element==component)
  if(eclComponent.length>0){
    ////////console.log(Object.getOwnPropertyNames(eclComponent[0]))
    ////////console.log(eclComponent[0].format)
    ////////console.log(eclComponent[0].element)
    //$('#my-datepicker').datepicker('update');
    ////////console.log(Object.getOwnPropertyNames(eclComponent[0].picker.update()))
    eclComponent[0].update()
  }
}
function dateValidFormat(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return dateStr;
  }

  const date = new Date(dateStr);
  //console.log(dateStr)
  //console.log(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
}

function addOptionsSelect(selectField,valuesFilter,multiple){
  if((valuesFilter.length>1)&&(!multiple)){
    valuesFilter.unshift("All")
  }
  ////////console.log(selectField)
  addHtmlOptionsSelect(selectField,valuesFilter,multiple)
}
function addHtmlOptionsSelect(selectField,values,multiple){
  ////////console.log(selectField)
  for (let i = 0; i < values.length; i++) {
    var option = document.createElement("option");
    option.value = values[i];
    option.text = values[i].charAt(0).toUpperCase() + values[i].slice(1);
    selectField.appendChild(option);
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

function getNavPanelVisibility(){
  if($( "#myModal" ).hasClass( "translate-x-0" )){
    return true;
  }else{
    return false;
  }
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

function showSearchNavContent(){
  $("#search-nav-content").show()
}
function hideSearchNavContent(){
  $("#search-nav-content").hide()
}
function showExpertForm(){
  $("#form-container").show()
}
function hideExpertForm(){
  $("#form-container").hide()
}
function showNavDetails(){
  ////console.log("entra en NavDetails")
  $("#dvDetails").show()
  ////console.log(ECL.autoInit())
}
function hideNavDetails(){
  $("#dvDetails").hide()
}
function emptyNavDetails(){
  $("#dvDetails").empty()
}
function showNavContentTablePagination(){
  $("#div-pagination").show()
}
function hideNavContentTablePagination(){
  $("#div-pagination").hide()
}
function removeGraph(){
  $(".graph").remove() 
}
function removePreviousFilters(){
  $("#accordion-filters").empty()
}
function getNodeFromTableRow(element){
  const parent = element.parentElement.closest('tr');
  const node=get_node_from_element(parent.id.replace("_row",""))
  return node;
}
function replaceParmtrsQuery(query,parameters,node){
  var query;
  if(node!=undefined){
      if((parameters!="")&&(parameters!=null)){
          for (let i = 0; i < parameters.length; ++i) { 
              query=query.replaceAll("PARAMETER"+(i+2).toString(), node[parameters[i]["property"]]);
          } 
      }
      query=query.replaceAll("PARAMETER", node[node["class"]+"_uri"]);    
  }
  return query
}
function findAncestorWithClass(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}
function runAutoInit(component){
  if(component){
    //////console.log(component.getAttribute("id"))
    //////console.log(eclComponents.filter(e=>e.element.id==component.getAttribute("id")))
    //eclComponents.filter(e=>e.element.id==component.getAttribute("id"))[0].destroy()
    ECLdestroy(component)
  }
  let autoInit=ECL.autoInit()
  //console.log(autoInit)
  
  ////console.log(window.ECL.components)
}

function hideElements(){
  //$("#filters").addClass("hidden")
/*   $("#filters").hide()
 */
  filtersNotVisible()
  removePreviousFilters()
/*   d3.selectAll(".classFilter").remove()
  $("#filters .ecl-accordion__item").remove()
 */
  hideExpertForm()
  removeGraph()
  //$("#networkGraph-svg").remove()  

  closeNavigationPanel()
  deleteTooltip()
/*   $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
  $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1") */

  //landingPageNotVisible()
  hidePageCollection()
  showGraphArea()
  //document.getElementById("filters").classList.add("hidden")
}
/* function landingPageNotVisible(){
  $('#landing-page'). hide();
} */

//change tab in main menu
function changeTab(tab){ 
  $("#main-tabs .ecl-tabs__link--active").removeClass("ecl-tabs__link--active")
  $("#content-main-tabs .content-item").addClass("hidden")
  tab.classList.add("ecl-tabs__link--active");
  tab.setAttribute("aria-selected", "true")
  $("#content-main-tabs #"+tab.id.replace("-tab","-content")).removeClass("hidden")
}
function showPageCollection(){
  $('#dataviz-collection').show();
}
function hidePageCollection(){
  $('#dataviz-collection').hide();
}
function showGraphArea(){
  $('#graph-area').removeClass("hidden")
}
function removeOptionsCollections(){
  $('#dataviz-collection article').remove()
}
function hideGraphArea(){
  $('#graph-area').addClass("hidden")
}
function filtersVisible(){
  $("#filters").fadeIn( "slow")
/*   $("#filters").fadeIn( "slow", function() {
    //this.removeClass("hidden");
    this.classList.remove("hidden")
  }); */
}

function filtersNotVisible(){
  $("#filters").fadeOut( "slow")
  //$("#filters").addClass("hidden").fadeToggle("slow");
  /* if(!$("#filters").hasClass( "hidden")){
    $("#filters").fadeToggle( "slow", function() {
      this.addClass("hidden");
    });
  } */
/*   $("#filters").fadeOut( "slow", function() {
    ////console.log(this)
    //this.addClass("hidden");
    this.classList.add("hidden")
  }); */
}
function getFilters(){
  if(networkGraph.filterClassesObjects.length!=0){
    //$("#filters").removeClass("hidden")
    filtersVisible()
  }else{
    //$("#filters").addClass("hidden")
    filtersNotVisible()
  }
}
function fitSizeModal(node){
  var classText;
  let modal=document.getElementById("modal-content").parentNode
  //console.log(document.getElementById("modal-content"))
  //console.log(modal)
  if(node.class=="more_results"){
    let index=linkedDataGraph.treeData.findIndex((element) => element.children.some((subElement) => subElement.id === node.id))
    classText=linkedDataGraph.treeData[index]["class"]
  }else{
    classText=node.class
  }
  if(classText=="free"){
    modal.classList.remove("max-w-md")
    modal.classList.add("max-w-4xl")
  }else{
    modal.classList.add("max-w-md")
    modal.classList.remove("max-w-4xl")
  }
}
function positionFullText(p){
  if(p=="s"){
    return "Subject"
  }else if(p=="o"){
    return "Object"
  }
}

function getTooltipNode(tooltip,nodeClass){
  var tooltipNode={}
  if((tooltip!="")&&(tooltip!="None")){
    tooltip.forEach(function(k){
      if(k["property"].split("_")[0]==nodeClass){
        tooltipNode[k["property"]]=k["tooltip_text"]
      }
    })
  }
  return tooltipNode
}