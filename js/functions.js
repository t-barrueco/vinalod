/*
*    VINALOD
*    functions.js
*    
*    created by Teresa Barrueco
*/

function clickBubble(element,data) {
  var nodeData,sources2
  nodesSelSources=[]
  nodesSelTarget=[]
  console.log("clickBubble")
  d3.selectAll(".nodeCircle")
  .style("opacity", 0.1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");

  d3.selectAll(".link")
  .style("opacity", 0.1)
  .style("stroke", "#aaaaaa")
  .style("stroke-width", "1px");

  nodeData=d3.select("#"+element.getAttribute("id")).data()[0]

  var idEl=element.getAttribute("id");
  var targets=data.links.filter(function(item) {
    return item.source.id == idEl
  })
  var sources=data.links.filter(function(item) {
    return item.target.id == idEl
  })

  if (sources.length>0){
    sources2=data.links.filter(function(item) {
      return item.target.id == sources[0]["source"]["id"]
    })

    while(sources2.length>0){
      sources2.forEach(function(d){
        sources.push(d)
      })
      sources2=data.links.filter(function(item) {
        return item.target.id == sources2[0]["source"]["id"]
      })
    }
  }
  
  sources=sources.reverse();
  
  sources.forEach(function(t){
    nodesSelSources.push({"class":t.source.class,"id":t.source.id,"value":t.source.value})
    d3.select("#"+t.source.id)
    .style("opacity", 1)
    .attr("stroke", "black")
    .attr("stroke-width", "3px");

    d3.select("#"+t.source.id+"_g")
    .style("opacity", 1)

    d3.select("#"+t.source.id+"_"+element.id)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("fill","black")
    .style("stroke-width", "3px");

    d3.select("#"+t.source.id+"_"+t.target.id)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("fill","black")
    .style("stroke-width", "3px");
  });

  nodesSelSources.push({"class":nodeData.class,"id":nodeData.id,"value":nodeData.value})

  targets.forEach(function(s){
    nodesSelTarget.push({"class":s.target.class,"id":s.target.id,"value":s.target.value})
    d3.select("#"+ s.target.id)
    .style("opacity", 1)
    .attr("stroke", "black")
    .attr("stroke-width", "3px");

    d3.select("#"+ s.target.id+"_g")
    .style("opacity", 1)

    d3.select("#"+element.id+"_"+s.target.id)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("fill","black")
    .style("stroke-width", "3px");
  });

  
  d3.select("#"+element.id)
  .style("opacity", 1)
  .attr("stroke", "black")
  .attr("stroke-width", "3px");

  d3.select("#"+element.id+"_g")
  .style("opacity", 1)


  labelsClick(element)
  //if(typeof(navigation)!="object"){
  //navigation = new navigation("basicGraph",nodeData);
  //}else{
  //  navigation.init()
  //}
}

function unclickBubble() {
  nodesSelSources=[]
  nodesSelTarget=[]
  $("#myModal").removeClass("in");
  $("#myModal").hide();
  d3.selectAll(".nodeCircle")
      .style("opacity", 1)
  d3.selectAll(".nodeCircleCircle")
      .style("opacity", 1)
      .attr("stroke", "grey")
      .attr("stroke-width", "1px");
  d3.selectAll(".link")
      .style("opacity", 1)
      .style("stroke", "grey")
      .style("fill","grey")
      .style("stroke-width", "1px");
}

function removeChars(chars){
  var invalid=["~","!","@","$","%","^","&","*","(",")","+","=",",",".","/","'",";",":",'"',"?",">","<","[","]","\\","{","}","|","`","#","]"]
  var pieces;
  invalid.forEach(function(c){
    pieces = chars.split(c);
    chars = pieces.join("");
  })
  chars=chars.replaceAll(" ","_")
  if (chars.match(/^\d/)) {
    chars="_"+chars
  }
  return chars
}
function get_hierarchy(hierarchy){
  var hierarchy_arr=[]
  hierarchy_arr=[hierarchy[0]["parent"]]
  hierarchy.forEach(function(d){
    hierarchy_arr.push(d["child"])
  })

  return hierarchy_arr
}
function getClassesShow(classes){
  var tmp={}

  classes.forEach(function(c){
    tmp[c["class"]]=c["text"]
  })
  return tmp
}
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


function getId(idPrefix){
  idValue+=1
  id=idPrefix+idValue.toString()
  return id
}
function getOptions(configClass,elClass){
  var selClass=configClass.filter(function(d){
    return d.class==elClass
  })
  return selClass
}
function getTooltip(elClass,option_text){
  var selClass=configFile.filter(function(d){
    return d.option_text==option_text
  })
  if(selClass[0]!=undefined){
    return selClass[0]["tooltip"]
  }else{
    return ""
  } 
}
function fillDropDown(dataConfig){
  var select = document.getElementById("options_basic"); 
  for(var i = 0; i < dataConfig.length; i++) {
    if(!dataConfig[i]["query"].includes("PARAMETER")){
      var opt = dataConfig[i].option;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = i;
      select.appendChild(el);
    }
  }
  return select.options[select.selectedIndex].value;
}

function changeBasicGraph(){
  d3.selectAll(".classFilter").remove()
  d3.select("#legend").selectAll("li").remove()
  d3.selectAll(".graph").remove()
  propertiesFilterHist=[]
  execQueries=[]
  filtersInGraph=[]
  classesFilterList=[]
  filtersList=[]
  var selectedValue = $("#options_basic").val();
  graphHistory=[]
  buildBasicGraph(selectedValue)
}

function findConnectedNodes(idEl){
  var targets=allDataModel.links.filter(function(item) {
    return item.source.id == idEl
  })
  var sources=allDataModel.links.filter(function(item) {
    return item.target.id == idEl
  })
  return {"sources":sources,"targets":targets,"id":idEl}
}
function getNodesFromConnected(connectedNodes){
  var selNodes=[connectedNodes.id],selLinks=[],properties=[],connectedNodesProp;
  connectedNodes.sources.forEach(function(d){
    selNodes.push(d.source.id)
    if(d.source.shape==2){
      properties.push(d.source.id)
    }
  })
  connectedNodes.targets.forEach(function(d){
    selNodes.push(d.target.id)
    if(d.target.shape==2){
      properties.push(d.target.id)
    }
  })

  properties.forEach(function(d){
    connectedNodesProp=findConnectedNodes(d)
    selNodes.push(connectedNodesProp.sources[0]["source"]["id"])
    selNodes.push(connectedNodesProp.targets[0]["target"]["id"])
    selLinks.push(connectedNodesProp.sources[0])
    selLinks.push(connectedNodesProp.targets[0])
  })
  selNodes= [...new Set(selNodes)]
  selLinks= [...new Set(selLinks)]
  selNodes=allDataModel.nodes.filter(function(d){
    return selNodes.includes(d.id)
  })
  selLinks=selLinks.concat(connectedNodes.sources.concat(connectedNodes.targets))
  selNodes= [...new Set(selNodes)]
  selLinks= [...new Set(selLinks)]
  return {"nodes":selNodes,"links":selLinks}
}
async function addGraph(node,pageX,pageY,indexRows){
  //var indexRows=[],className,query="";
  //className=node["class"]
/*   for (var i = 0; i < configFile.length; i++) {
    if(configFile[i]["class"]==nodesClassesCorrespondence[className]){
      query=configFile[i]["query"]
      indexRows.push({"position":i,"option":configFile[i]["option"],"optionText":configFile[i]["option_text"]})
    }
  }
  if(query!=""){
    indexRows=await checkAskResults(indexRows,node)
  } */
  //////////////console.log(indexRows)
  //////////////console.log(networkGraph.treeData)
  if(indexRows.length>1){
    getMenuItems(indexRows,node,pageX,pageY,origin)
  }else if (indexRows.length==1){
    //////////////console.log(indexRows[0]["position"])
    //////////////console.log(node)
    //////////////console.log(indexRows[0]["option"])
   // ////////////console.log(networkGraph.treeData)
    //throw new Error("Something went badly wrong!");
    await buildBasicGraph(indexRows[0]["position"],node,indexRows[0]["option"])
  }
  return indexRows
}


function getMenuItems(items,node,pageX,pageY,origin){
  var menuItems=[],element,position
  //////////////console.log("getmenuitems")
  if (origin=="table"){
    for (var i = 0; i < items.length; i++) {
      menuItems.push({"option":items[i]["option"],"position":items[i]["position"]})
    }
    addMenuToTable(node,menuItems)
  }else{
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
          buildBasicGraph(position,node,d.title)
        }
      }
      menuItems.push(element)
    }
    networkGraph.menuFactory(pageX-200 ,pageY-200, menuItems, node,"dblClick",250)
  }
  
}
async function getMenuItemsContextMenu(node,origin,pageX,pageY){
  var options,indexRows=[],Items,actionFunction;
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
      
  }else{
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
  }


    if(origin=="table"){
      addContextMenuToTable(node,Items)
    }else{
      networkGraph.menuItems=Items
      networkGraph.menuFactory(pageX-200, pageY-200 , Items, node,"contextMenu",250);
    }  
}
function runSparlqQuery(settings){
  return new Promise((resolve, reject) => {
  $.ajax(settings).then  (function( _data ) {
    results = _data.results.bindings;
    resolve(results)
  })
})
}
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
  })
}
async function checkAskResults(indexRows,node){
  var sparqlQuery,resultIndexRows=[],parameters,singleIndexRow
  //////////////////console.log(node)
  for (var i = 0; i < indexRows.length; i++) {
    ////////////////console.log(indexRows[i])
    sparqlQuery=fromSelectToAskQuery(configFile[indexRows[i]["position"]]["query"])
    singleIndexRow=indexRows[i]
    parameters=configFile[singleIndexRow["position"]]["parameters"]
    if(node["class"]!=undefined){
      if(parameters!=""){
        parameters=get_parameters(parameters)
        for (j = 0; j < parameters.length; ++j) { 
          sparqlQuery=sparqlQuery.replace("PARAMETER"+(j+2).toString(), node[parameters[j]]);
        }  
          if((node[node["class"]+"_uri"]!=undefined)&(node[node["class"]+"_uri"]!="")){
            sparqlQuery=sparqlQuery.replace("PARAMETER",node[node["class"]+"_uri"]);

          } else{
            sparqlQuery=sparqlQuery.replace("PARAMETER",node["value"]);
          }
      }else{
        if(node[node["class"]+"_uri"]!=undefined){
          sparqlQuery=sparqlQuery.replace("PARAMETER",node[node["class"]+"_uri"]);
        } else{
          sparqlQuery=sparqlQuery.replace("PARAMETER",node[node["value"]+"_code"]);
        }
      }
    }else{
      sparqlQuery=sparqlQuery.replace(node,"PARAMETER"); 
    }
    results = await runAskSparlqQuery(configFile[singleIndexRow["position"]]["endpoint_url"],sparqlQuery)

    if(results==true){
      resultIndexRows.push(singleIndexRow)
    }
  }
  return resultIndexRows
}

function fromSelectToAskQuery(query){
  //////////////////console.log(query)
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
  query=query.replace("parameter","PARAMETER")
  return query
}

function zoom() {
  networkGraph.g
  .attr("transform", "translate("+zoomX+","+zoomY+")"+d3.event.transform+"scale(" + zoomScale + ")")
}


 function findNodeTreemap(nodeId,treeData){
   var founded=treeData.filter(function(item) {
     return item.id == nodeId
   })
   return founded
 }

function findNodeTreemap(nodeId,treeData){
  var founded=treeData.filter(function(item) {
    return item.id == nodeId
  })
  return founded
}
function getTooltipText(d){
  ////////console.log(d)
  if(d.class=="menuOption"){
    var text = `
    <table class="tiptable" style="margin-left: 2.5px">
        <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Name:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.value + `</span></td></tr>
        <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
        </table>`;
    return text;
  }else{
    var text = `
    <table class="tiptable" style="margin-left: 2.5px">
        <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Name:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.value + `</span></td></tr>
        <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Class:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + nodesClassesCorrespondence[d.class] + `</span></td></tr>`
        Object.keys(d["tooltip"]).forEach(function(k){
          text=text + `
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">`+d["tooltip"][k]+`:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d[k] + `</span></td></tr>`
        })      
        text=text+`<tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
        </table>`;
    return text;
  }
  
}
function getTooltipMenu(d){
  var text = `
      <table class="tiptable" style="margin-left: 2.5px">
          <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000"></td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d + `</span></td></tr>`

  return text;
}
function fillLegend(dif,addOne){
  //////console.log(dif)
  //////console.log(colorScale.domain())
  if ((addOne)&(dif.length>0)){
    appendLi(colorScale.domain().length-1,dif[0])
  }else if(!addOne){
    for (var i = 0; i < colorScale.domain().length; i++) {
      appendLi(i,colorScale.domain()[i])
    } 
  }

}
function appendLi(i,textLi){
  var li,classLi;
  classLi="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white rounded-l-md "
  li=d3.select("#legend").append("li")
  .attr("class", "flex col-span-1 rounded-md shadow-sm")
  li.append("div")
  .attr("class", classLi+"bg-"+colorCorrespondence[colorScale.range()[i]])
  li.append("div")
  .attr("class","flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md")
  .append("div")
  .attr("class","flex-1 px-4 py-2 text-sm truncate")
  .append("a")
  .attr("class","font-medium text-gray-900 hover:text-gray-600")
  .append("text")
  .text(textLi);
}
function differenceArrays(a1, a2) {
  var result = [];
  for (var i = 0; i < a1.length; i++) {
    if (a2.indexOf(a1[i]) === -1) {
      result.push(a1[i]);
    }
  }
  return result;
}
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
      a.setAttribute("class", "autocomplete-items text-sm");
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
  ////////////////console.log(configRows)
  return configRows
}