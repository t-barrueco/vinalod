/*
*    VINALOD
*    functions.js
*    
*    created by Teresa Barrueco
*/

//
async function dblclickTrTable(row) {
  var indexRows=1;
  ////////console.log(row)
  var element=document.getElementById(row.getAttribute("id").replace("_a","").replace("_tr",""));
  ////////console.log(element)

  //row2=$('#myModal #'+ row.getAttribute("id"))[0];
  

  //////////console.log(row.getAttribute("id"))
  //////////console.log(document.getElementById(row.getAttribute("id").replace("_a","_image")))
  indexRows=await networkGraph.wrangleData(document.getElementById(row.getAttribute("id").replace("_a","")),"table");

  //throw new Error("Something went badly wrong!");
  ////////console.log(indexRows)
  if (indexRows.length<2){
    ////////console.log("entra")
    unclickBubble()
    clickBubble(element,networkGraph.data)
    d3.select("#"+row.getAttribute("id"))
    .attr("stroke", "yellow")
    .attr("stroke-width", "6px");
  }
  //else if (indexRows==1){
  //  labelsClick(document.getElementById(row.getAttribute("id").replace("_a","")))
  //}
}
async function dblclickNavTable(row) {
  //var indexRows=1;
  ////////console.log(row)
  var element=document.getElementById(row.getAttribute("id").replace("_a",""));
  ////////console.log(element)
  clickBubble(element,networkGraph.data)
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
  //row2=$('#myModal #'+ row.getAttribute("id"))[0];
  

  //////////console.log(row.getAttribute("id"))
  //////////console.log(document.getElementById(row.getAttribute("id").replace("_a","_image")))
  //indexRows=await networkGraph.wrangleData(document.getElementById(row.getAttribute("id").replace("_a","")),"table");

  //throw new Error("Something went badly wrong!");
  /* ////////console.log(indexRows)
  if (indexRows.length<2){
    ////////console.log("entra")
    unclickBubble()
    clickBubble(element,networkGraph.data)
    d3.select("#"+row.getAttribute("id"))
    .attr("stroke", "yellow")
    .attr("stroke-width", "6px");
  } */
  //else if (indexRows==1){
  //  labelsClick(document.getElementById(row.getAttribute("id").replace("_a","")))
  //}
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
  var nodeData,sources2
  nodesSelSources=[]
  nodesSelTarget=[]
  //////////console.log(element)
  d3.selectAll(".nodeCircle")
  .style("opacity", 0.1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");

  d3.selectAll(".link")
  .style("opacity", 0.1)
  .style("stroke", "#aaaaaa")
  .style("stroke-width", "1px");

  ////////console.log(d3.select("#"+element.getAttribute("id")))
  ////////console.log(element.getAttribute("id"))
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
      //////////////console.log(sources2)
    }
  }
  
  sources=sources.reverse();
  
  //////////////console.log(sources)
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
    //////////////console.log(t)
  });

  nodesSelSources.push({"class":nodeData.class,"id":nodeData.id,"value":nodeData.value})

  ////////console.log(nodesSelSources)
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

  ////////console.log(targets)
  ////////////console.log(nodesSelTarget)
  
  d3.select("#"+element.id)
  .style("opacity", 1)
  .attr("stroke", "black")
  .attr("stroke-width", "3px");
  //////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.select("#"+element.id+"_image"))
  d3.select("#"+element.id+"_g")
  .style("opacity", 1)


  labelsClick(element)
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
  //////////////////////console.log(hierarchy)
  hierarchy_arr=[hierarchy[0]["parent"]]
  hierarchy.forEach(function(d){
    hierarchy_arr.push(d["child"])
  })
  //hierarchy = hierarchy.split("-");

  return hierarchy_arr
}
function getClassesShow(classes){
  var tmp={}
  //classes = classes.split(";");
  ////////////////////////console.log(classes)
  classes.forEach(function(c){
    //temp.push({"class":c.split("-")[0],"classShow":c.split("-")[1]})
    //tmp[c.split("-")[0]]=c.split("-")[1]
    tmp[c["class"]]=c["text"]
  })
  return tmp
}
function get_properties(properties){
  var temp={}
  //properties = properties.split(";");
  properties.forEach(function(d){
/*     if(temp[d.split("-")[0]]){
      temp[d.split("-")[0]].push(d.split("-")[1])
    }else{
      temp[d.split("-")[0]]=[d.split("-")[1]]
    } */
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
       // }
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
  //////////////////////////////////////////////////////////////////////////console.log(configClass)
  var selClass=configClass.filter(function(d){
    return d.class==elClass
  })
  return selClass
}
function getTooltip(elClass,option_text){
  ////////////////////////////////////////////console.log(configFile)
  ////////////////////////////////////////////console.log(elClass)
  var selClass=configFile.filter(function(d){
    ////////////////////////console.log(d)
    return d.option_text==option_text
  })
  ////////////////////console.log(selClass[0])
  if(selClass[0]!=undefined){
    return selClass[0]["tooltip"]
  }else{
    return ""
  } 
}
function fillDropDown(dataConfig){
  var select = document.getElementById("options_basic"); 
  ////////////////console.log(dataConfig)
  for(var i = 0; i < dataConfig.length; i++) {
    if((!dataConfig[i]["query"].includes("PARAMETER"))&(dataConfig[i]["type"]=="TREE")){
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
  //////////////////////////////////////////console.log(d3.select("#legend").selectAll("li"))
  d3.selectAll(".classFilter").remove()
  d3.select("#legend").selectAll("li").remove()
  d3.selectAll(".graph").remove()
  propertiesFilterHist=[]
  execQueries=[]
  filtersInGraph=[]
  var selectedValue = $("#options_basic").val();
  graphHistory=[]
  buildBasicGraph(selectedValue)
}

function labelsClick(element){
  var nodeData,cell,row,nodesTable,li,div,div2,div3,div4,a,span,span2,svg,path,el1,el2,span3,span4,img,colorCircle;

  //////////console.log(element)
  nodeData=d3.select("#"+element.getAttribute("id")).data()[0]

  d3.select("#navTable").select("nav").remove()

  var navTable = document.getElementById("navTable");
  var nav=document.createElement("nav")
  nav.setAttribute("aria-label", "Progress");
  var ol=document.createElement("ol")
  ol.setAttribute("role", "list");

  for (var i = 0; i < nodesSelSources.length-1; i++) {
  //for (var i = nodesSel.length; i <= 0; i--) {
    li=document.createElement("li")
    li.setAttribute("class", "relative pb-10");
    div=document.createElement("div")
    div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
    div.setAttribute("aria-hidden", "true");
    a=document.createElement("a")
    a.setAttribute("href", "#");
    a.setAttribute("class", "relative flex items-start group");
    a.id=nodesSelSources[i]["id"]+"_a"
    
    //a.setAttribute("id",nodesSelSources[i]["id"])
    span=document.createElement("span")
    span.setAttribute("class","h-9 flex items-center")
    
    span2=document.createElement("span")
    //////////////console.log(nodesSel)
    //////////////console.log(nodesSel.slice(-1)[0]["class"])
    colorCircle=colorCorrespondence[colorScale(nodesClassesCorrespondence[nodesSelSources[i]["class"]])]
    //////////////console.log(colorCircle.split("-"))
    span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))

    img=document.createElement("img")

    img.setAttribute("src","../images/check.svg")
    //img.setAttribute("src",bubbleImage(d3.select("#"+element.getAttribute("id")).data()[0]))
    img.setAttribute('width','40px')
    img.setAttribute('height','40px')

    el1=navTable.appendChild(nav).appendChild(ol).appendChild(li)
    el1.appendChild(div)
    el2=el1.appendChild(a)
    //el2.appendChild(span).appendChild(span2).appendChild(svg).appendChild(path)
    el2.appendChild(span).appendChild(span2).appendChild(img)
    span3=document.createElement("span")
    span3.setAttribute("class","ml-4 min-w-0 flex flex-col")
    span4=document.createElement("span")
    span4.setAttribute("class","text-xs font-semibold tracking-wide uppercase")
    span4.innerHTML = nodesSelSources[i]["value"]
    img=document.createElement("img")
    //nodesSel[i]
    //////////////console.log(bubbleImage(d3.select("#"+nodesSel[i]["id"]).data()[0]))
    //////////////console.log(d3.select("#"+nodesSel[i]["id"]).data()[0])
    img.setAttribute("src",bubbleImage(d3.select("#"+nodesSelSources[i]["id"]).data()[0]))
    //img.setAttribute("src",bubbleImage(d3.select("#"+element.getAttribute("id")).data()[0]))
    img.setAttribute('width','40px')
    img.setAttribute('height','40px')
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
    //el3.appendChild(span5)
    el3.appendChild(img)


  }

  li=document.createElement("li")
  li.setAttribute("class", "relative pb-10");

  a=document.createElement("a")
  a.setAttribute("href", "#");
  a.setAttribute("class", "relative flex items-start group");
  a.id=nodesSelSources[i]["id"]+"_a"
  span=document.createElement("span")
  span.setAttribute("class","h-9 flex items-center")
  span2=document.createElement("span")

  colorCircle=colorCorrespondence[colorScale(nodesClassesCorrespondence[nodesSelSources[i]["class"]])]
  span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))

  img=document.createElement("img")

  img.setAttribute("src","../images/location.svg")
  img.setAttribute('width','40px')
  img.setAttribute('height','40px')

  el1=navTable.appendChild(nav).appendChild(ol).appendChild(li)
  el2=el1.appendChild(a)
  el2.appendChild(span).appendChild(span2).appendChild(img)
  span3=document.createElement("span")
  span3.setAttribute("class","ml-4 min-w-0 flex flex-col")
  span4=document.createElement("span")
  span4.setAttribute("class","text-xs font-semibold tracking-wide uppercase")
  span4.innerHTML = nodesSelSources[i]["value"]
  img=document.createElement("img")

  img.setAttribute("src",bubbleImage(d3.select("#"+nodesSelSources[i]["id"]).data()[0]))
  img.setAttribute('width','40px')
  img.setAttribute('height','40px')
  el3=el2.appendChild(span3)
  el3.appendChild(span4)
  //el3.appendChild(span5)
  el3.appendChild(img)
  //}
  //cell.innerHTML = '<img src='+bubbleImage(d3.select("#"+nodesTable[i]["id"]).data()[0])+' width="40" height="40">';

  modal=document.getElementById("myModal")
  modal.style.display = "block";
  $('#myModal').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal").draggable()

  d3.selectAll("#navTable a").on("dblclick",function(){ 
    //////////console.log(this.parentNode)
    dblclickNavTable(this)
    //dblclickTrTable(this)
  })
  //.on("mouseover",////////console.log("mouseover a navTable"))
  .on("click",function(){  
    clickTrTable(this)
  })
  .on('contextmenu',function(){  
    var menuItems=[]
    //////////////////////////////////////////////////////////////console.log("entra")
    ////////////////////////////////////////////////////////////////console.log(d)
    //////////////////////////////////////////////////////////////console.log(this)
    //d3.event.preventDefault();
    //networkGraph.menuFactory(d3.event.pageX-200, d3.event.pageY-200 , networkGraph.menuItems, d,"contextMenu");
    //createContextMenu(d, vis.menuItems, 100, 100, vis.g);
    d3.event.preventDefault();
    var node=d3.select("#"+this.getAttribute("id")).data()[0]
    getMenuItemsContextMenu(node,"table")

  });
  

  d3.selectAll(".modal-content table").remove()
  if (nodesSelTarget.length>0){

    var table = document.createElement("table");
    table.className="min-w-full divide-y divide-gray-200"
  
    var thead=document.createElement("thead")
    thead.className="bg-gray-50"
    var tr=document.createElement("tr")
    var th=document.createElement("th")
    th.setAttribute("scope","col")
    th.setAttribute("class","px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider")
    //th.innerHTML="Child nodes for "+nodeData["class"]+" "+nodeData["value"]
    th.innerHTML=nodeData["value"]
    thead.appendChild(tr).appendChild(th)
    var tbody=document.createElement("tbody")
    tbody.className="bg-white divide-y divide-gray-200"
    //////////////console.log(nodesSel)
  
    //if(element.getAttribute("root")=="1"){
    nodesTable=nodesSelTarget;
    //}else{
    //  nodesTable=nodesSelTarget.slice(0, -1);
    //}
  
    ////////////console.log(nodes.nodesSelTarget)
    for (var i = 0; i < nodesTable.length; i++) {
      
      row = tbody.insertRow(-1);
      //row.style.backgroundColor = colorScale(nodesClassesCorrespondence[nodesTable[i]["class"]]); 
      row.id=nodesTable[i]["id"]
      cell = row.insertCell(-1);
      cell.className="px-6 py-4 whitespace-nowrap"
      div=document.createElement("div")
      div.className="flex items-center"
      div2=document.createElement("div")
      div2.className="flex-shrink-0 w-10 h-10"
      img=document.createElement("img")
      img.className="w-10 h-10 rounded-full bg-"+colorCorrespondence[colorScale(nodesClassesCorrespondence[nodesTable[i]["class"]])]
      img.setAttribute("src",bubbleImage(d3.select("#"+nodesTable[i]["id"]).data()[0]))
      div3=document.createElement("div")
      div3.className="ml-4"
      div4=document.createElement("div")
      div4.className="text-sm font-medium text-gray-900"
      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      //a.id=nodesSelSources[i]["id"]
      span=document.createElement("span")
      newText = document.createTextNode(nodesTable[i]["value"]);
      div4.appendChild(a).appendChild(span).appendChild(newText);
      //div4.innerHTML = nodesTable[i]["value"];
      el1=cell.appendChild(div)
      el1.appendChild(div2).appendChild(img)
      el1.appendChild(div3).appendChild(div4)
  
    }
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
  
    div=document.createElement("div")    
    div.className="flex flex-col"
    div2=document.createElement("div")    
    div2.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
    div3=document.createElement("div")    
    div3.className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"
    var fullTable=dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(table)
    fullTable.appendChild(thead)
    fullTable.appendChild(tbody);
    d3.selectAll(".modal-content tr").on("dblclick",function(){  
      dblclickTrTable(this)
    })
    //.on("mouseover",function(){////////console.log("mouseover a Table")})
    .on("click",function(){  
      clickTrTable(this)
    })
    .on('contextmenu',function(){  
      var menuItems=[]

      d3.event.preventDefault();
      var node=d3.select("#"+this.getAttribute("id")).data()[0]
      //////////////console.log(node)
      getMenuItemsContextMenu(node,"table")

    });
  
  }


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
  var indexRows=[],className,query="";
  className=node["class"]

  for (var i = 0; i < configFile.length; i++) {

    if(configFile[i]["class"]==nodesClassesCorrespondence[className]){

      query=configFile[i]["query"]
      indexRows.push({"position":i,"option":configFile[i]["option"],"optionText":configFile[i]["option_text"]})
    }
  }

  if(query!=""){
    indexRows=await checkAskResults(indexRows,node)
  }
  ////////////////console.log(indexRows)
  if(indexRows.length>1){
    getMenuItems(indexRows,node,pageX,pageY,origin)
  }else if (indexRows.length==1){
    await buildBasicGraph(indexRows[0]["position"],node)
    //////////////////////////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
  }
  return indexRows
}
function getMenuItems(items,node,pageX,pageY,origin){
  var menuItems=[],element,position
  ////////////////console.log("getMenuItems")
  if (origin=="table"){
    //////////////////////////////////////////////////////////////////////console.log(origin)
    for (var i = 0; i < items.length; i++) {
      ////////////////////////////////////////////////////////////////////////console.log(items[i]["position"])
      ////////////////////////////////////////////////////////////////////////console.log(items[i]["option"])
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
                if(configFile[i]["option"] == d.title){
                  position=i
                }
              }
          buildBasicGraph(position,node)
        }
      }
      menuItems.push(element)
    }
    //////////////////console.log(menuItems)
    networkGraph.menuFactory(pageX-200 ,pageY-200, menuItems, node,"dblClick")
  }
  
}
function addMenuToTable(node,menuItems){
  var newText,newCell,element,newRow,span
  d3.selectAll(".menu-table").remove()
  //////////////////////////////////////////////////////////console.log(menuItems)
  //////////////////////////////////////////////////////////console.log(node)
  var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex;
  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

/*   <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td> */
  for (var i = 0; i < menuItems.length; i++) {
      newRow = tbodyRef.insertRow(rowIndex+i);
      //newRow.style.backgroundColor="white"
      newRow.id="menu-table-"+menuItems[i]["position"]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();
      newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
      // Append a text node to the cell
      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      //a.id=nodesSelSources[i]["id"]
      span=document.createElement("span")
      span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
      newText = document.createTextNode(menuItems[i]["option"]);
      newCell.appendChild(a).appendChild(span).appendChild(newText);

      /* newCell = newRow.insertCell();
      newCell.innerHTML = '<img src="images/right-arrow-button.svg" width="40" height="40">'; */
      d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("click",function(){        
        clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
      })
  }
}
async function clickMenuTable(position,node){
  var element=document.getElementById(node["id"])
  ////////////////////////////////////////////////////////////////console.log("entra en clickMenuTable")
  await buildBasicGraph(position,node)
  ////////////////////////////////////////////////////////////////console.log(networkGraph.data)
  unclickBubble()
  clickBubble(element,networkGraph.data)
}
function addContextMenuToTable(node,menuItems){
  var newText,newCell,element,id
  d3.selectAll(".menu-table").remove()
  ////////////console.log(node)
  ////////////////////////////////////////////////////////console.log(menuItems)
  var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex;
  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

  for (var i = 0; i < menuItems.length; i++) {
      var newRow = tbodyRef.insertRow(rowIndex+i);
      //newRow.style.backgroundColor="white"
      newRow.id="menu-table-"+menuItems[i]["position"]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();
      newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
      // Append a text node to the cell
      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      //a.id=nodesSelSources[i]["id"]
      span=document.createElement("span")
      span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
      newText = document.createTextNode(menuItems[i]["option"]);
      newCell.appendChild(a).appendChild(span).appendChild(newText);

/*       newText = document.createTextNode(menuItems[i]["option"]);
      newCell.appendChild(newText);
      newCell = newRow.insertCell();
      newCell.innerHTML = '<img src="images/right-arrow-button.svg" width="40" height="40">'; */
      d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("dblclick",function(){ 
        ////////////////////////////////////////////////////////console.log(this)       
        id=this.getAttribute("id").replace("menu-table-","")
        action=menuItems.filter(function(d){
          return (d.position==id)
        })[0]["action"]
        //////////////////console.log(action)
        eval(action)
        //clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
      })
  }
}
async function getMenuItemsContextMenu(node,origin,pageX,pageY){
  var options,indexRows=[],Items,actionFunction;
  ////////console.log(node)
  ////////console.log(origin)
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
      //return Items
      networkGraph.menuItems=Items
      networkGraph.menuFactory(pageX-200, pageY-200 , Items, node,"contextMenu");
      //d3.event.preventDefault();
    }  
    //////////////////////////////////////////////////////////console.log(Items)
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
  //////////////////////////////////////////////////////////console.log(url)
  ////////////////////////////////////////////////////////////console.log(sparqlQuery)
  var queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  
  if (url=="https://query.wikidata.org/sparql"){
    settings = { url: queryUrl, async: true       }; 
  }else{
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  }
  
  //////////////////////////////////////////////////console.log(settings)
  return new Promise((resolve, reject) => {
  $.ajax(settings).then  (function( _data ) {
    results = _data.boolean;
    //////////////////////////////////////////////////////////console.log(results)
    resolve(results)
  })
})
}
async function checkAskResults(indexRows,node){
  var sparqlQuery,resultIndexRows=[],parameters,singleIndexRow
  ////////////////console.log(indexRows)
  ////////////////console.log(node)
  //////////////////////////////////////////////////////////////////////////////////////console.log(node)
  for (var i = 0; i < indexRows.length; i++) {
    //////////////////////////////////////////////////////////////console.log(configFile[indexRows[i]["position"]])
    sparqlQuery=fromSelectToAskQuery(configFile[indexRows[i]["position"]]["query"])
    singleIndexRow=indexRows[i]
    ////////////////////////////////////////////////console.log(sparqlQuery)
    //////////////////////////////////////////////////////////////////////////////////////console.log(singleIndexRow["position"])
    parameters=configFile[singleIndexRow["position"]]["parameters"]
    //////////////////////////////////////////////////////////////////////////////////////console.log(parameters)
    if(node["class"]!=undefined){
      //////////////////////////////////////////////////////////////////////////console.log(node)
      if(parameters!=""){
        //////////////////////console.log(parameters)
        parameters=get_parameters(parameters)
        //////////////////////console.log(parameters)
        for (j = 0; j < parameters.length; ++j) { 
          //////////////////////////////////////////console.log(node)
          //////////////////////////////////////////console.log(node[parameters[j]])
          sparqlQuery=sparqlQuery.replace("PARAMETER"+(j+2).toString(), node[parameters[j]]);
        }  
        if(node["class"]=="corporateBody"){
          //////////////////////////////////////////////////////////////////////////console.log("node class corporateBody")
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
      //////////////////////////////////////////////////////////////////////////////////////console.log(indexRows[i])
    }else{
      sparqlQuery=sparqlQuery.replace(node,"PARAMETER"); 
    }
    //////////////////////////////////////////////////////////////////////////////////////console.log(singleIndexRow)
    ////////////////console.log(sparqlQuery)
    results = await runAskSparlqQuery(configFile[singleIndexRow["position"]]["endpoint_url"],sparqlQuery)
    ////////////////console.log(results)
    if(results==true){
      //////////////////////////////////////////////////////////////////////////////////////console.log(singleIndexRow["position"])
      //////////////////////////////////////////////////////////////////////////////////////console.log(singleIndexRow)
      resultIndexRows.push(singleIndexRow)
    }
  }
  ////////////////////////////////////////////////console.log(resultIndexRows)
  return resultIndexRows
}
function fromSelectToAskQuery(query){
  var mySubString = query.substring(
    query.toLowerCase().lastIndexOf("select"), 
    query.toLowerCase().lastIndexOf("where") - 1 
  );
  //////////////////////////////////////////////////console.log(mySubString)
  query=query.replace(mySubString,"ASK")
  if(query.toLowerCase().lastIndexOf("group by")!=-1){
    mySubString = query.substring(
      query.toLowerCase().lastIndexOf("group by"), 
      query.length - 1 
    );
    query=query.replace(mySubString,"")
  }
  //////////////////////////////////////////////////console.log(query)

  if(query.toLowerCase().lastIndexOf("order by")!=-1){
    mySubString = query.substring(
      query.toLowerCase().lastIndexOf("order by"), 
      query.length 
    );
    query=query.replace(mySubString,"")
  }
  ////////////////////////////////////////////////////console.log(mySubString)
  ////////////////////////////////////////////////////console.log(query)
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
      return "images/question_mark.svg";
    }
  }
  
}
function zoom() {
  networkGraph.g
  //.attr("transform", d3.event.transform+"scale("+zoomScale+")")
  .attr("transform", "translate("+zoomX+","+zoomY+")"+d3.event.transform+"scale(" + zoomScale + ")")
}


 function findNodeTreemap(nodeId,treeData){
   ////////////////////////////////////////////////////////////////////////////////////console.log(node)
   var founded=treeData.filter(function(item) {
     ////////////////////////////////////////////////////////////////////////////////////console.log(item.id)
     ////////////////////////////////////////////////////////////////////////////////////console.log(nodeId)
     return item.id == nodeId
   })
   return founded
 }

function findNodeTreemap(nodeId,treeData){
  ////////////////////////////////////////////////////////////////////////////////////console.log(node)
  var founded=treeData.filter(function(item) {
    ////////////////////////////////////////////////////////////////////////////////////console.log(item.id)
    ////////////////////////////////////////////////////////////////////////////////////console.log(nodeId)
    return item.id == nodeId
  })
  return founded
}
function getTooltipText(d){
  ////////////////////console.log(d)
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
  ////////////////////////////console.log(colorScale.range())
  ////////////////////////////console.log(colorScale.domain())
  ////////////////////////////////console.log(networkGraph.colorScale.domain())
  ////////////////////////////////console.log(networkGraph.colorScale.domain())

  if ((addOne)&(dif.length>0)){
    //appendLi()
    ////////////////////////////console.log("primero if")
    appendLi(colorScale.domain().length-1,dif[0])
  }else if(!addOne){
    ////////////////////////////console.log("segundo if")
    for (var i = 0; i < colorScale.domain().length; i++) {
      //////////////////////////////////////////console.log(colorCorrespondence[colorScale.range()[i]])
      appendLi(i,colorScale.domain()[i])
    } 
  }

  //////////////////////////////////////////console.log(d3.select("#legend"))
  
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
  ////////////////////////////console.log(textLi)
  ////////////////////////////console.log(i)
  ////////////////////////////console.log(colorScale.range())
  ////////////////////////////console.log(colorScale.range()[i])
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
      //////////////////////////////////////console.log(a)
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
  ////////////////////////////////////console.log(newNode)
  ////////////////////////////////////console.log(existingNode)
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}