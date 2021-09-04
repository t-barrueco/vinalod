/*
*    VINALOD
*    functions.js
*    
*    created by Teresa Barrueco
*/

//
async function dblclickTrTable(row) {
  var indexRows=1;
  var element=document.getElementById(row.getAttribute("id"));
  ////////////////////////////////////////////console.log("dblclickTrTable")
  ////////////////////////////////////////////console.log(row)
  //set all nodes in table to stroke black and width 3px
  row2=$('#myModal #'+ row.getAttribute("id"))[0];
  //row2=document.getElementById("myModal").getElementById(row.getAttribute("id"))
  ////////////////////////////////////////////////console.log(row2)
  ////////////////////////////////////////////////console.log(row2.rowIndex)
  
  //set selected node to yellow in graph
  /* for (var i = 0; i < nodesSel.length; i++) {
    d3.select("#"+nodesSel[i]["id"])
    .attr("stroke", "black")
    .attr("stroke-width", "3px");
  } */
  

  //REVIEW dblclick
/*   networkGraph.isDblclick = true;
  clearTimeout(networkGraph.dblclickTimeout);
  networkGraph.dblclickTimeout = setTimeout(function () {
    networkGraph.isDblclick = false;
  }, networkGraph.timeoutTiming); */
  
  //add graph attached to selected node
  indexRows=await networkGraph.wrangleData(document.getElementById(row.getAttribute("id")+"_image"),"table");
  ////////////////////////////////////////////console.log("vuelve a dblclickTrTable")
  ////////////////////////////////////////////console.log(indexRows)
  //throw new Error("Something went badly wrong!");
  if (indexRows.length<2){
    unclickBubble()
    clickBubble(element,networkGraph.data)
    d3.select("#"+row.getAttribute("id"))
    .attr("stroke", "yellow")
    .attr("stroke-width", "6px");
  }
}
function clickTrTable(row) {
  d3.selectAll(".nodeCircleCircle")
  .style("opacity", 1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}

function clickBubble(element,data) {
  var nodeData
  nodesSel=[]
  //////////////////////////////////////////console.log(element)
  //////////////////////////////////////////console.log(data)
  d3.selectAll(".nodeCircle")
  .style("opacity", 0.1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");

  d3.selectAll(".link")
  .style("opacity", 0.1)
  .style("stroke", "#aaaaaa")
  .style("stroke-width", "1px");

  nodeData=d3.select("#"+element.getAttribute("id")).data()[0]
  nodesSel.push({"class":nodeData.class,"id":nodeData.id,"value":nodeData.value})
  var idEl=element.getAttribute("id");
  var targets=data.links.filter(function(item) {
    return item.source.id == idEl
  })
  var sources=data.links.filter(function(item) {
    return item.target.id == idEl
  })
  ////////////////////////////////////////////////////////////////////////////////console.log(targets)
  ////////////////////////////////////////////////////////////////////////////////console.log(sources)

  targets.forEach(function(s){
    nodesSel.push({"class":s.target.class,"id":s.target.id,"value":s.target.value})
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
  sources.forEach(function(t){
    nodesSel.push({"class":t.source.class,"id":t.source.id,"value":t.source.value})
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
  });

  
  d3.select("#"+element.id)
  .style("opacity", 1)
  .attr("stroke", "black")
  .attr("stroke-width", "3px");
  ////////////////////////////////////////////////////////////////////////////////////console.log(d3.select("#"+element.id+"_image"))
  d3.select("#"+element.id+"_g")
  .style("opacity", 1)


  labelsClick(element)
}

function unclickBubble() {
  nodesSel=[]
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
function getHierarchy(hierarchy){
  var temp=[]
  hierarchy = hierarchy.split("-");

  return hierarchy
}
function getClassesShow(classes){
  var temp=[],classesTemp=[],tmp={}
  classes = classes.split(";");
  classes.forEach(function(c){
    temp.push({"class":c.split("-")[0],"classShow":c.split("-")[1]})
    tmp[c.split("-")[0]]=c.split("-")[1]
  })
  return tmp
}
function getProperties(properties){
  var temp={}
  properties = properties.split(";");
  properties.forEach(function(d){
    if(temp[d.split("-")[0]]){
      temp[d.split("-")[0]].push(d.split("-")[1])
    }else{
      temp[d.split("-")[0]]=[d.split("-")[1]]
    }
  })
  properties=temp
  return properties
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
  ////////////////////////////////////////////////////console.log(configClass)
  var selClass=configClass.filter(function(d){
    return d.class==elClass
  })
  return selClass
}
function getTooltip(elClass,option_text){
  //////////////////////console.log(configFile)
  //////////////////////console.log(elClass)
  var selClass=configFile.filter(function(d){
    //console.log(d)
    return d.OPTION_TEXT==option_text
  })
  //console.log(selClass[0])
  if(selClass[0]!=undefined){
    return selClass[0]["TOOLTIP"]
  }else{
    return ""
  } 
}
function fillDropDown(dataConfig){
  var select = document.getElementById("options_basic"); 
  ////////////////////console.log(dataConfig)
  for(var i = 0; i < dataConfig.length; i++) {
    if(!dataConfig[i]["QUERY"].includes("PARAMETER")){
      var opt = dataConfig[i].OPTION_TEXT;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = i;
      select.appendChild(el);
    }
  }
  return select.options[select.selectedIndex].value;
}

function changeBasicGraph(){
  ////////////////////console.log(d3.select("#legend").selectAll("li"))
  d3.selectAll(".classFilter").remove()
  d3.select("#legend").selectAll("li").remove()
  d3.selectAll(".graph").remove()
  execQueries=[]
  var selectedValue = $("#options_basic").val();
  buildBasicGraph(selectedValue)
}

function labelsClick(element){
  var nodeData,cell,row,nodesTable;
  ////////////////////////////////console.log(element)
  ////////////////////////////////console.log(nodesSel)

  nodeData=d3.select("#"+element.getAttribute("id")).data()[0]
  d3.select("#modalHeader").select("img").remove()
  d3.select("#modalHeader").select("span").remove()

  d3.select("#modalHeader")
  .style("background-color",element.style.fill)
  .append("img")
    .attr('src', bubbleImage(d3.select("#"+element.getAttribute("id")).data()[0]))
  .attr('width','40px')
  .attr('height','40px')

  d3.select("#modalHeader")
  .append("span")
  .text(function(){
    return nodeData["value"];
  })
  .style("font-size", "18px")
  .attr("text-anchor", "middle")
  .attr("stroke", "black")
  .attr("stroke-width", "3px");

  if(element.getAttribute("root")=="1"){
    d3.select("#modalHeader2").style("display","hidden")
  }else{
    d3.select("#modalHeader2").select("img").remove()
    d3.select("#modalHeader2").select("span").remove()
    d3.select("#modalHeader2")
    .style("background-color",colorScale(nodesClassesCorrespondence[nodesSel.slice(-1)[0]["class"]]))
    .append("img")
    .attr('src', bubbleImage(d3.select("#"+nodesSel.slice(-1)[0]["id"]).data()[0]))
    .attr('width','40px')
    .attr('height','40px')

    d3.select("#modalHeader2")
    .append("span")
    .text(function(){
      ////////////////////////////////console.log(nodesSel)
      return nodesSel.slice(-1)[0]["value"];
    })
    .style("font-size", "18px")
    .attr("text-anchor", "left")
    .attr("stroke", "black")
    .attr("stroke-width", "3px"); 
/*     d3.select("#modalHeader2")
    .text(function(){
      ////////////////////////////////console.log(nodesSel)
      return nodesSel.slice(-1)[0]["value"];
    })
    .style("font-size", "18px")
    .attr("text-anchor", "middle")
    .attr("stroke", "black")
    .attr("stroke-width", "3px"); */
  }
  //cell.innerHTML = '<img src='+bubbleImage(d3.select("#"+nodesTable[i]["id"]).data()[0])+' width="40" height="40">';

  modal=document.getElementById("myModal")
  modal.style.display = "block";
  $('#myModal').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal").draggable()
  //$("*").draggable();
/*   $("#myModal").draggable({
    handle: ".modal-header"
  }); */

  var columnCount = 4;
  //h-full flex flex-col bg-white shadow-xl overflow-y-scroll
  d3.selectAll(".modal-content table").remove()
  var table = document.createElement("table");

  if(element.getAttribute("root")=="1"){
    nodesTable=nodesSel;
  }else{
    nodesTable=nodesSel.slice(0, -1);
  }

  for (var i = 1; i < nodesTable.length; i++) {
    
    row = table.insertRow(-1);
    row.style.backgroundColor = colorScale(nodesClassesCorrespondence[nodesTable[i]["class"]]); 
    row.id=nodesTable[i]["id"]
    cell = row.insertCell(-1);
    cell.innerHTML = nodesTable[i]["value"];
    cell = row.insertCell(-1);
    cell.innerHTML = '<img src='+bubbleImage(d3.select("#"+nodesTable[i]["id"]).data()[0])+' width="40" height="40">';
  }
  var dvTable = document.getElementById("dvTable");
  dvTable.innerHTML = "";

  dvTable.appendChild(table);
  d3.selectAll(".modal-content tr").on("dblclick",function(){  
    dblclickTrTable(this)
  })
  .on("click",function(){  
    clickTrTable(this)
  })
  .on('contextmenu',function(){  
    var menuItems=[]
    ////////////////////////////////////////console.log("entra")
    //////////////////////////////////////////console.log(d)
    ////////////////////////////////////////console.log(this)
    //d3.event.preventDefault();
    //networkGraph.menuFactory(d3.event.pageX-200, d3.event.pageY-200 , networkGraph.menuItems, d,"contextMenu");
    //createContextMenu(d, vis.menuItems, 100, 100, vis.g);
    d3.event.preventDefault();
    var node=d3.select("#"+this.getAttribute("id")).data()[0]
    getMenuItemsContextMenu(node,"table")
    //menuItems.push({"option":"option1","position":1})
    //menuItems.push({"option":"option1","position":2})
    //menuItems.push({"option":"option1","position":3})
    //addContextMenuToTable(node,menuItems)
  });
  var modal = document.getElementById('modalHeader');
  var modal_width = modal.offsetWidth

  d3.select("table").attr("class", "table table-striped")
                    .style("width",modal_width+"px");

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
async function addGraph(node,pageX,pageY,origin){
  var indexRows=[],className;
  className=node["class"]
  ////////////////////////////////////////////console.log(addGraph)
  for (var i = 0; i < configFile.length; i++) {
    ////////////////////////////////////////////////////////////////console.log(configFile[i])
    
    if(configFile[i]["CLASS"]==nodesClassesCorrespondence[className]){
      ////////////////////////////////////////////////////console.log(configFile[i])
      indexRows.push({"position":i,"option":configFile[i]["OPTION"],"optionText":configFile[i]["OPTION_TEXT"]})
    }
  }
  ////////////////////////////////////////////////////////////////console.log(nodesClassesCorrespondence[className])
  ////////////////////////////console.log(indexRows)
  indexRows=await checkAskResults(indexRows,node)
  ////////////////////////////////////////////////////console.log(indexRows)
  if(indexRows.length>1){
    getMenuItems(indexRows,node,pageX,pageY,origin)
  }else if (indexRows.length==1){
    await buildBasicGraph(indexRows[0]["position"],node)
    ////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
  }
  return indexRows
}
function getMenuItems(items,node,pageX,pageY,origin){
  var menuItems=[],element,position
  ////////////////////////////////////////////console.log("getMenuItems")
  if (origin=="table"){
    ////////////////////////////////////////////////console.log(origin)
    for (var i = 0; i < items.length; i++) {
      //////////////////////////////////////////////////console.log(items[i]["position"])
      //////////////////////////////////////////////////console.log(items[i]["option"])
      menuItems.push({"option":items[i]["option"],"position":items[i]["position"]})
    }
    addMenuToTable(node,menuItems)
  /*  for (var i = 0; i < items.length; i++) {
  } */
  }else{
    for (var i = 0; i < items.length; i++) {
      position=items[i]["position"]
      element={
        title: items[i]["option"],
        action: (d) => {
          for (var i = 0; i < configFile.length; i++) {
                if(configFile[i]["OPTION"] == d.title){
                  position=i
                }
              }
          buildBasicGraph(position,node)
        }
      }
      menuItems.push(element)
    }
    ////////////////////////////////////////////////console.log(menuItems)
    networkGraph.menuFactory(pageX-200 ,pageY-200, menuItems, node,"dblClick")
  }
  
}
function addMenuToTable(node,menuItems){
  var newText,newCell,element
  d3.selectAll(".menu-table").remove()
  ////////////////////////////////////console.log(menuItems)
  ////////////////////////////////////console.log(node)
  var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex+1;
  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

  for (var i = 0; i < menuItems.length; i++) {
      var newRow = tbodyRef.insertRow(rowIndex+i);
      newRow.style.backgroundColor="white"
      newRow.id="menu-table-"+menuItems[i]["position"]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();

      // Append a text node to the cell
      newText = document.createTextNode(menuItems[i]["option"]);
      newCell.appendChild(newText);
      newCell = newRow.insertCell();
      newCell.innerHTML = '<img src="images/right-arrow-button.svg" width="40" height="40">';
      d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("click",function(){        
        clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
      })
  }
}
async function clickMenuTable(position,node){
  var element=document.getElementById(node["id"])
  //////////////////////////////////////////console.log("entra en clickMenuTable")
  await buildBasicGraph(position,node)
  //////////////////////////////////////////console.log(networkGraph.data)
  unclickBubble()
  clickBubble(element,networkGraph.data)
}
function addContextMenuToTable(node,menuItems){
  var newText,newCell,element,id
  d3.selectAll(".menu-table").remove()
  //////////////////////////////////console.log(menuItems)
  var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex+1;
  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

  for (var i = 0; i < menuItems.length; i++) {
      var newRow = tbodyRef.insertRow(rowIndex+i);
      newRow.style.backgroundColor="white"
      newRow.id="menu-table-"+menuItems[i]["position"]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();

      // Append a text node to the cell
      newText = document.createTextNode(menuItems[i]["option"]);
      newCell.appendChild(newText);
      newCell = newRow.insertCell();
      newCell.innerHTML = '<img src="images/right-arrow-button.svg" width="40" height="40">';
      d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("dblclick",function(){ 
        //////////////////////////////////console.log(this)       
        id=this.getAttribute("id").replace("menu-table-","")
        action=menuItems.filter(function(d){
          return (d.position==id)
        })[0]["action"]
        //////////////////////////////////console.log(action)
        eval(action)
        //clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
      })
  }
}
async function getMenuItemsContextMenu(node,origin,pageX,pageY){
  var options,indexRows=[],Items,actionFunction;
  //////////////////////////////////console.log(origin)
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


    for (var i = 0; i < configFile.length; i++) {     

      if((configFile[i]["CLASS"]==nodesClassesCorrespondence[node["class"]])&(configFile[i]["TYPE"]!="TREE")){
        option={
          "position":i,
          "option":configFile[i]["OPTION"]
        }
        //////////////////////////////////console.log(configFile[i]["CLASS"])
        indexRows.push(option)
      }
      
    }
    //////////////////////////////console.log(indexRows)
    indexRows=await checkAskResults(indexRows,node)
    //////////////////////////////////console.log(indexRows)

    for (var i = 0; i < indexRows.length; i++) {
      if(origin=="table"){
        //addMenuToTable(node,Items)
        Items.push({
          "position":indexRows[i]["position"],
          "option":indexRows[i]["option"],
          "action":configFile[indexRows[i]["position"]]["FUNCTION"]+"(node)"
        })
      }else{
        Items.push({
          title: indexRows[i]["option"],
          position:Items.length+1+i,
          action: (data,d) => {
            // TODO: add any action you want to perform
            //downloadQuery()
            ////////////////////////////////console.log(data)
            
            actionFunction=configFile.filter(function(v){
              return v["OPTION"]==d.title
            })[0]["FUNCTION"]+"({"
            //class:"'+data["class"]
            for (const [key, value] of Object.entries(data)) {
              ////////////////////////////////console.log(`${key}: "${value}",`);
              actionFunction=actionFunction+`${key}: "${value}",`
            }
            actionFunction = actionFunction.slice(0, -1);
            actionFunction=actionFunction+"})"
            ////////////////////////////////console.log(actionFunction)
            eval(actionFunction)
/*             eval(configFile.filter(function(v){
              return v["OPTION"]==d.title
            })[0]["FUNCTION"]+"("+data+")") */
            //configFile[indexRows[i]["position"]]["FUNCTION"]
          }
        })
      }
    }
    if(origin=="table"){
      addContextMenuToTable(node,Items)
    }else{
      //return Items
      networkGraph.menuItems=Items
      //////////////////////////////////console.log(networkGraph.menuItems)
      ////////////////////////////////////console.log(d3.event.pageX)
      networkGraph.menuFactory(pageX-200, pageY-200 , Items, node,"contextMenu");
      //d3.event.preventDefault();
    }  
    ////////////////////////////////////console.log(Items)
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
  ////////////////////////////////////console.log(url)
  //////////////////////////////////////console.log(sparqlQuery)
  var queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  
  if (url=="https://query.wikidata.org/sparql"){
    settings = { url: queryUrl, async: true       }; 
  }else{
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  }
  
  ////////////////////////////console.log(settings)
  return new Promise((resolve, reject) => {
  $.ajax(settings).then  (function( _data ) {
    results = _data.boolean;
    ////////////////////////////////////console.log(results)
    resolve(results)
  })
})
}
async function checkAskResults(indexRows,node){
  var sparqlQuery,resultIndexRows=[],parameters,singleIndexRow
  //////////////////////////console.log(indexRows)
  
  ////////////////////////////////////////////////////////////////console.log(node)
  for (var i = 0; i < indexRows.length; i++) {
    ////////////////////////////////////////console.log(configFile[indexRows[i]["position"]])
    sparqlQuery=fromSelectToAskQuery(configFile[indexRows[i]["position"]]["QUERY"])
    singleIndexRow=indexRows[i]
    //////////////////////////console.log(sparqlQuery)
    ////////////////////////////////////////////////////////////////console.log(singleIndexRow["position"])
    parameters=configFile[singleIndexRow["position"]]["PARAMETERS"]
    ////////////////////////////////////////////////////////////////console.log(parameters)
    if(node["class"]!=undefined){
      ////////////////////////////////////////////////////console.log(node)
      if(parameters!=""){
        parameters=parameters.split(";")
        for (j = 0; j < parameters.length; ++j) { 
          ////////////////////console.log(node)
          ////////////////////console.log(node[parameters[j]])
          sparqlQuery=sparqlQuery.replace("PARAMETER"+(j+2).toString(), node[parameters[j]]);
        }  
        if(node["class"]=="corporateBody"){
          ////////////////////////////////////////////////////console.log("node class corporateBody")
          sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]);
        }else{
          sparqlQuery=sparqlQuery.replace("PARAMETER", node["value"]);
        }
      }else{
        if(node[node["class"]+"_uri"]!=undefined){
          sparqlQuery=sparqlQuery.replace("PARAMETER",node[node["class"]+"_uri"]);
        } else{
          sparqlQuery=sparqlQuery.replace("PARAMETER",node[node["class"]+"_code"]);
        }
      }
      ////////////////////////////////////////////////////////////////console.log(indexRows[i])
    }else{
      sparqlQuery=sparqlQuery.replace(node,"PARAMETER"); 
    }
    ////////////////////////////////////////////////////////////////console.log(singleIndexRow)
    //////////////////////////console.log(sparqlQuery)
    results = await runAskSparlqQuery(configFile[singleIndexRow["position"]]["URL"],sparqlQuery)
    ////////////////////////////////////console.log(results)
    if(results==true){
      ////////////////////////////////////////////////////////////////console.log(singleIndexRow["position"])
      ////////////////////////////////////////////////////////////////console.log(singleIndexRow)
      resultIndexRows.push(singleIndexRow)
    }
  }
  //////////////////////////console.log(resultIndexRows)
  return resultIndexRows
}
function fromSelectToAskQuery(query){
  ////////////////////////////console.log(query)
  var mySubString = query.substring(
    query.toLowerCase().lastIndexOf("select"), 
    query.toLowerCase().lastIndexOf("where") - 1 
  );
  ////////////////////////////console.log(mySubString)
  query=query.replace(mySubString,"ASK")
  if(query.toLowerCase().lastIndexOf("group by")!=-1){
    mySubString = query.substring(
      query.toLowerCase().lastIndexOf("group by"), 
      query.length - 1 
    );
    query=query.replace(mySubString,"")
  }
  ////////////////////////////console.log(query)

  if(query.toLowerCase().lastIndexOf("order by")!=-1){
    mySubString = query.substring(
      query.toLowerCase().lastIndexOf("order by"), 
      query.length 
    );
    query=query.replace(mySubString,"")
  }
  //////////////////////////////console.log(mySubString)
  //////////////////////////////console.log(query)
  return query
}
function bubbleImage(node){
  var icon=[];
  if((node[node["class"]+"_image"]!=undefined)&(node[node["class"]+"_image"]!="")){
    return node[node["class"]+"_image"];
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
    if(icon.length>0){
      return icon[0]["FILE"]
    }else{
      return "images/eu_flag.jpeg";
    }
  }
  
}
function zoom() {
  networkGraph.g
  //.attr("transform", d3.event.transform+"scale("+zoomScale+")")
  .attr("transform", "translate("+zoomX+","+zoomY+")"+d3.event.transform+"scale(" + zoomScale + ")")
}


 function findNodeTreemap(nodeId,treeData){
   //////////////////////////////////////////////////////////////console.log(node)
   var founded=treeData.filter(function(item) {
     //////////////////////////////////////////////////////////////console.log(item.id)
     //////////////////////////////////////////////////////////////console.log(nodeId)
     return item.id == nodeId
   })
   return founded
 }

function findNodeTreemap(nodeId,treeData){
  //////////////////////////////////////////////////////////////console.log(node)
  var founded=treeData.filter(function(item) {
    //////////////////////////////////////////////////////////////console.log(item.id)
    //////////////////////////////////////////////////////////////console.log(nodeId)
    return item.id == nodeId
  })
  return founded
}
function getTooltipText(d){
  //////////////////////////console.log(d)
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
function fillLegend(dif,addOne){
  //////console.log(colorScale.range())
  //////console.log(colorScale.domain())
  //////////console.log(networkGraph.colorScale.domain())
  //////////console.log(networkGraph.colorScale.domain())

  if ((addOne)&(dif.length>0)){
    //appendLi()
    //////console.log("primero if")
    appendLi(colorScale.domain().length-1,dif[0])
  }else if(!addOne){
    //////console.log("segundo if")
    for (var i = 0; i < colorScale.domain().length; i++) {
      ////////////////////console.log(colorCorrespondence[colorScale.range()[i]])
      appendLi(i,colorScale.domain()[i])
    } 
  }

  ////////////////////console.log(d3.select("#legend"))
  
/*   <li class="flex col-span-1 rounded-md shadow-sm">
      <div class="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white bg-pink-600 rounded-l-md">
      </div>
      <div class="flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md">
        <div class="flex-1 px-4 py-2 text-sm truncate">
          <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Graph API</a>
        </div>
      </div>
    </li> */
}
function appendLi(i,textLi){
  var li,classLi;
  //////console.log(textLi)
  //////console.log(i)
  //////console.log(colorScale.range())
  //////console.log(colorScale.range()[i])
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
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      ////////////////console.log(a)
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
  //////////////console.log(newNode)
  //////////////console.log(existingNode)
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}