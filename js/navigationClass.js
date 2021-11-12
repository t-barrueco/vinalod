navigation = function ( _type) {
    this.type = _type;
    this.init();
  };
   
navigation.prototype.init = function () {
  var navPanel=this;
  navPanel.imageArrowUp="images/arrow-up.svg"
  navPanel.imageArrowDown="images/arrow-down.svg"
  navPanel.node=networkGraph.rootNode
  navPanel.element=document.getElementById(navPanel.node.id)
  navPanel.getNodes()
  navPanel.initModal()
  navPanel.navTableTable()
  navPanel.contentTable()
}

navigation.prototype.getNodes = function (){
  var navPanel=this;
  var nodeData,sources2
  navPanel.targets=networkGraph.data.links.filter(function(item) {
    return item.source.id == navPanel.node.id
  })
  
  navPanel.sources=networkGraph.data.links.filter(function(item) {
    return item.target.id == navPanel.node.id
  })

  if (navPanel.sources.length>0){
    sources2=networkGraph.data.links.filter(function(item) {
      return item.target.id == navPanel.sources[0]["source"]["id"]
    })
    while(sources2.length>0){
      sources2.forEach(function(d){
        navPanel.sources.push(d)
      })
      sources2=networkGraph.data.links.filter(function(item) {
        return item.target.id == sources2[0]["source"]["id"]
      })
    }
  }
  navPanel.sources.push(networkGraph.data.nodes[0])
  
  navPanel.sources=navPanel.sources.reverse();
}

navigation.prototype.selectBubbles = function (){

  var navPanel=this;

  d3.selectAll(".nodeCircle")
  .style("opacity", 0.1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");

  d3.selectAll(".link")
  .style("opacity", 0.1)
  .style("stroke", "#aaaaaa")
  .style("stroke-width", "1px");

  navPanel.sources.forEach(function(t){
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
  
  navPanel.targets.forEach(function(s){
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
  
}
navigation.prototype.initModal = function (){
  var navPanel=this;
  navPanel.modal=document.getElementById("myModal")
  navPanel.modal.style.display = "block";
  $('#myModal').resizable({

  });
  $("#myModal").draggable()
  d3.selectAll(".modal-content table").remove()
}

navigation.prototype.navTableTable = function ()
  {
    var last=false,property=false,first=true,ol=null  
    var navPanel=this;
    navPanel.navTable = document.getElementById("navTable");

    if((navPanel.navTable.querySelector("nav"))){
      navPanel.nav=navPanel.navTable.querySelector("nav")
      navPanel.ol=navPanel.navTable.querySelector("ol")
      if(navPanel.ol!=null){
        navPanel.ol.querySelectorAll("li").forEach(function(li){
          li.remove()
        })
      }else{
        navPanel.ol=document.createElement("ol")
        navPanel.ol.setAttribute("role", "list");
      }
      
    }else{
      navPanel.nav=document.createElement("nav")
      navPanel.nav.setAttribute("aria-label", "Progress");
      navPanel.ol=document.createElement("ol")
      navPanel.ol.setAttribute("role", "list");
    }
    if(navPanel.type=="freeGraph"){
      navPanel.sources.forEach(function (d,i){
        if(i==0){
          navPanel.addElementNav(d,i)
        }else{
          navPanel.addElementNavProp(d,i,true)
          navPanel.addElementNavProp(d,i,false)
        }
      })
    }else{
      navPanel.sources.forEach(function (d,i){
        navPanel.addElementNav(d,i)
      })
    }
    
    navPanel.addEventsNav()

}

navigation.prototype.addElementNav = function (source,i){
  var navPanel=this;
  var li=document.createElement("li")
  li.setAttribute("class", "relative pb-10");
  li.id=source["id"]+"_li"

  if(i<navPanel.sources.length-1){
      div=document.createElement("div")
      div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
      div.setAttribute("aria-hidden", "true");
      li.appendChild(div)
  }

  a=document.createElement("a")
  a.setAttribute("href", "#");
  a.setAttribute("class", "relative flex items-start group");
  a.id=source["id"]+"_a"
  
  span=document.createElement("span")
  span.setAttribute("class","h-9 flex items-center")
  
  span2=document.createElement("span")
  
  if(source["type"]=="uri"){
    colorCircle="green-300"
  }else if(source["type"]=="bnode"){
    colorCircle="yellow-300"
  }else{
    colorCircle="pink-300"
  }

  span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))

  img=document.createElement("img")

  if(i<navPanel.sources.length-1){
    el1=navPanel.ol.appendChild(li)
    el1.appendChild(div)
  }else{
    el1=navPanel.navTable.appendChild(navPanel.nav).appendChild(navPanel.ol).appendChild(li)
  }

  el2=el1.appendChild(a)

  el2.appendChild(span).appendChild(span2)

  span3=document.createElement("span")
  span3.setAttribute("class","ml-4 min-w-0 flex flex-col")
  span4=document.createElement("span")
  span4.setAttribute("class","text-xs font-semibold tracking-wide uppercase")

  span4.innerHTML = source["value"]
  el3=el2.appendChild(span3)
  el3.appendChild(span4)
  
}

navigation.prototype.addElementNavProp = function (source,i,property){
  var li=document.createElement("li")
  var navPanel=this;
  li.setAttribute("class", "relative pb-10");
  li.id=source["target"]["id"]+"_li"

  if((property)|(i<navPanel.sources.length-1)){
      div=document.createElement("div")
      div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
      div.setAttribute("aria-hidden", "true");
      li.appendChild(div)
  }

  a=document.createElement("a")
  a.setAttribute("href", "#");
  if(property){
    a.setAttribute("class", "relative flex items-start group isDisabled");
  }else{
    a.setAttribute("class", "relative flex items-start group");
  }
  
  a.id=source["target"]["id"]+"_a"
  
  span=document.createElement("span")
  span.setAttribute("class","h-9 flex items-center")
  
  span2=document.createElement("span")
  
  if(property){
    colorCircle="gray-300"
  }else{
    if(source["target"]["type"]=="uri"){
      colorCircle="green-300"
    }else if(source["target"]["type"]=="bnode"){
      colorCircle="yellow-300"
    }else{
      colorCircle="pink-300"
    }
  }


  span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))

  img=document.createElement("img")

  if(property){
    if(source["target"]["subject-object"]=="s"){
      img.setAttribute("src",navPanel.imageArrowDown)
    }else{
      img.setAttribute("src",navPanel.imageArrowUp)
    }
    img.setAttribute('width','40px')
    img.setAttribute('height','40px')
  }
  el1=navPanel.ol.appendChild(li)

  if(i<navPanel.sources.length-1){
      el1.appendChild(div)
  }
  
  el2=el1.appendChild(a)
  
  if(property){
    el2.appendChild(span).appendChild(span2).appendChild(img)
  }else{
    el2.appendChild(span).appendChild(span2)
  }
  
  span3=document.createElement("span")
  span3.setAttribute("class","ml-4 min-w-0 flex flex-col")
  span4=document.createElement("span")
  span4.setAttribute("class","text-xs font-semibold tracking-wide uppercase")
  if(property){
    span4.innerHTML= source["value"]
    
    span5=document.createElement("span")
    span5.setAttribute("class","text-xs tracking-wide")
    span5.setAttribute("style","color:indigo;font-weight:bolder")
    span5.innerHTML=  "   Sparql Endpoint(" + url + ")"
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
    el3.appendChild(span5)
  }else{
    span4.innerHTML = source["target"]["value"]
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
  }
  
}

navigation.prototype.addLineElementNav = function (li){
  var navPanel=this;
  var div=document.createElement("div")
  div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
  div.setAttribute("aria-hidden", "true");
  li.appendChild(div)
}

navigation.prototype.addEventsNav = function (){
  var navPanel=this;
  d3.selectAll("#navTable a").on("dblclick",function(){ 
    d3.event.preventDefault();

    dblclickNav(this)
    d3.event.stopPropagation()
  })
  .on("click",function(){  
    clickNav(this)
  })
  .on('contextmenu',function(){  
    var menuItems=[]
    d3.event.preventDefault();
    var node=d3.select("#"+this.getAttribute("id")).data()[0]
  });
}

navigation.prototype.contentTable = function (){
  var navPanel=this;
  navPanel.contentRows=[]
  d3.selectAll(".modal-content table").remove()
  if (navPanel.targets.length>0){

    navPanel.table = document.createElement("table");
    navPanel.table.className="w-full divide-y divide-gray-200 table-auto"
  
    navPanel.thead=document.createElement("thead")
    navPanel.thead.className="bg-gray-50"
    var tr=document.createElement("tr")
    var th=document.createElement("th")
    th.setAttribute("colspan","2")
    th.setAttribute("scope","colgroup")
    th.setAttribute("class","px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider")
    th.innerHTML=navPanel.node["value"]
    navPanel.thead.appendChild(tr).appendChild(th)
    navPanel.tbody=document.createElement("tbody")
    navPanel.tbody.className="bg-white divide-y divide-gray-200"

    
    for (var i = 0; i < navPanel.targets.length; i++) {
      row = navPanel.tbody.insertRow(-1);
      row.id=navPanel.targets[i]["target"]["id"]+"_row"
      navPanel.contentRows.push(row)
      if(navPanel.type=="freeGraph"){
        navPanel.addElementContentTableProp(navPanel.targets[i],i)
      }else{
        navPanel.addElementContentTable(navPanel.targets[i],i)
      }
    }
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
  
    div=document.createElement("div")    
    div.className="flex flex-col"
    div2=document.createElement("div")    
    div2.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
    div3=document.createElement("div")    
    div3.className="overflow-auto border-b border-gray-200 shadow md:overflow-scroll sm:rounded-lg"
    navPanel.fullTable=dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(navPanel.table)
    navPanel.fullTable.appendChild(navPanel.thead)
    navPanel.fullTable.appendChild(navPanel.tbody); 
    
    navPanel.addEventsContentNav()
  }
}

navigation.prototype.addEventsContentNav = function (){
  var navPanel=this,cell;
  navPanel.isDblclick = false;

  navPanel.timeoutTiming = 500;
  d3.selectAll(".modal-content td").on("dblclick",function(){ 
    d3.event.preventDefault();
    navPanel.isDblclick = true;
    clearTimeout(navPanel.dblclickTimeout);
    navPanel.dblclickTimeout = setTimeout(function () {
      navPanel.isDblclick = false;
    }, navPanel.timeoutTiming);
    dblclickCellContent(this)
    return false;
  })
  .on("click",function(){  
    cell=this;
    clearTimeout(navPanel.clickTimeout);
    navPanel.clickTimeout = setTimeout(function () {
      if(!navPanel.isDblclick) {
        // here goes your click codes
        dblclickCellContent(cell)
      }
    }, navPanel.timeoutTiming);
  })
  
}

navigation.prototype.addElementContentTable = function (target,i){
  var navPanel=this;
  cell = row.insertCell(-1);
  cell.className="px-6 py-4 whitespace-nowrap"
  if(!property){
    cell.id=nodesTable[i]["target"]["id"]
  }else{
    cell.id=nodesTable[i]["source"]["id"]+nodesTable[i]["target"]["id"]
  }
  
  div=document.createElement("div")
  if(!property){
    div.className="flex items-center w-full"
  }else{
    div.className="flex items-center w-full property"
    div.setAttribute("url",newForm["url"])
    div.setAttribute("subject-object",newForm["subject-object"])
    div.setAttribute("uri",nodesTable[i]["value"])
  }
  
  div2=document.createElement("div")
  div2.className="flex-shrink-0 w-10 h-10"
  img=document.createElement("img")
  
  if(!property){
      if(nodesTable[i]["target"]["type"]=="uri"){
          img.className="w-10 h-10 bg-green-300 rounded-full"
        }else if(nodesTable[i]["target"]["type"]=="bnode"){
          img.className="w-10 h-10 bg-yellow-300 rounded-full"
        }else{
          img.className="w-10 h-10 bg-pink-300 rounded-full"
      }
      
  }else{
      img.className="w-10 h-10 bg-gray-300 rounded-full"
  }

  div3=document.createElement("div")
  div3.className="relative ml-4"
  div4=document.createElement("div")
  div4.className="relative text-sm font-medium text-gray-900"
  if(!property){
      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      span=document.createElement("span")
      newText = document.createTextNode(nodesTable[i]["target"]["value"]);
      div4.appendChild(a).appendChild(span).appendChild(newText);
  }else{
      span=document.createElement("span")
      newText = document.createTextNode(nodesTable[i]["value"]);
      div4.appendChild(span).appendChild(newText);
  }
      
  el1=cell.appendChild(div)
  el1.appendChild(div2).appendChild(img)
  el1.appendChild(div3).appendChild(div4)
}

navigation.prototype.addElementContentTableProp = function (target,i){
  var navPanel=this;

  insertContent(true)
  insertContent(false)
  
  function insertContent(property){
    cell = row.insertCell(-1);
    cell.className="px-6 py-4 whitespace-nowrap"
    if(!property){
      cell.id=target["target"]["id"]
    }else{
      cell.id=target["source"]["id"]+target["target"]["id"]
    }
    
    div=document.createElement("div")
    if(!property){
      div.className="flex items-center w-full"
    }else{
      div.className="flex items-center w-full property"
      div.setAttribute("url",target["target"]["url"])
      div.setAttribute("subject-object",target["target"]["subject-object"])
      div.setAttribute("uri",target["value"])
    }
    
    div2=document.createElement("div")
    div2.className="flex-shrink-0 w-10 h-10"
    img=document.createElement("img")
    
    if(!property){
        if(target["target"]["type"]=="uri"){
            img.className="w-10 h-10 bg-green-300 rounded-full"
          }else if(target["target"]["type"]=="bnode"){
            img.className="w-10 h-10 bg-yellow-300 rounded-full"
          }else{
            img.className="w-10 h-10 bg-pink-300 rounded-full"
        }
        
    }else{
        img.className="w-10 h-10 bg-gray-300 rounded-full"
    }
  
    div3=document.createElement("div")
    div3.className="relative ml-4"
    div4=document.createElement("div")
    div4.className="relative text-sm font-medium text-gray-900"
    if(!property){
        a=document.createElement("a")
        a.setAttribute("href", "#");
        if((target["target"]["type"]!="bnode")&(target["target"]["type"]!="uri")){
          a.setAttribute("class", "relative flex items-start group isDisabled");
        }else{
          a.setAttribute("class", "relative flex items-start group");
        }
        
        span=document.createElement("span")
        newText = document.createTextNode(target["target"]["value"]);
        div4.appendChild(a).appendChild(span).appendChild(newText);
    }else{
        span=document.createElement("span")
        newText = document.createTextNode(target["value"]);
        div4.appendChild(span).appendChild(newText);
    }
        
    el1=cell.appendChild(div)
    el1.appendChild(div2).appendChild(img)
    el1.appendChild(div3).appendChild(div4)
  }
  }

navigation.prototype.dblclickCellContent = async function (cell) {
  var indexRows=1,bubble;
  if(networkGraph.treeData.filter(d=>d.id==cell.getAttribute("id")).length==0){
    indexRows=await networkGraph.wrangleDataFreeGraph(cell,"table");
    if (indexRows.length<2){
      unclickBubbleFreeGraph()
      bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
      clickBubbleFreeGraph(bubble,networkGraph.data)
      d3.select("#"+row.getAttribute("id"))
      .attr("stroke", "yellow")
      .attr("stroke-width", "6px");
    }
  }else{
    bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
    clickBubbleFreeGraph(bubble,networkGraph.data)
  }

}

navigation.prototype.clickCellContent = async function (cell){
  d3.selectAll(".nodeCircleCircle")
  .style("opacity", 1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}

navigation.prototype.dblclickNav = async function (cell) {
  var navPanel=this,bubble;
  bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","").replace("_li","")))
  unclickBubbleFreeGraph()
  clickBubbleFreeGraph(bubble,networkGraph.data)
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}

navigation.prototype.clickNav = async function (cell){
  d3.selectAll(".nodeCircleCircle")
  .style("opacity", 1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}
navigation.prototype.addMenuToTable = function (node,menuItems){
  var navPanel=this;
  var textTooltip,div,textNode,newText,newCell,element,newRow,span,form,textMenu,property,propertyNode,new_url,new_subjectObject
  d3.selectAll(".menu-table").remove()

  var rowIndex=$('#myModal #'+ (node["id"]+"_row"))[0].rowIndex;

  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

  for (var i = 0; i < menuItems.length; i++) {
      newRow = tbodyRef.insertRow(rowIndex+i);
      newRow.id="menu-table-"+ node.id + "-" + [i]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();
      newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
      newCell.setAttribute("colspan","2")
      newCell.setAttribute("x-data","{ tooltip: false }")

      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      a.setAttribute("x-on:mouseenter","tooltip = true")
      a.setAttribute("x-on:mouseleave","tooltip = false")

      div=document.createElement("div")
      div.setAttribute("x-show","tooltip")
      div.setAttribute("class","z-50 absolute bg-indigo-300 border-graphite border-2 rounded p-4 mt-1")
      if(menuItems[i]["subject-object"]=="s"){
        textTooltip="Find all objects for the URI :" + d3.select("#"+node.id).data()[0].value + " in the SPARQL EndPoint: "+menuItems[i]["url"]
      }else{
        textTooltip="Find all subjects for the URI :" + d3.select("#"+node.id).data()[0].value + " in the SPARQL EndPoint: "+menuItems[i]["url"]
      }
      textNode = document.createTextNode (textTooltip);

      span=document.createElement("span")
      span.className="inline-flex px-2 text-sm font-semibold leading-5 text-gray-800 bg-white rounded-full"
      newText = document.createTextNode("Sparql Endpoint: "+ menuItems[i]["url"]+" Position: " +menuItems[i]["subject-object"]);
      newCell.appendChild(a).appendChild(span).appendChild(newText);
      newCell.appendChild(div).appendChild(textNode)      
  }

  d3.selectAll(".menu-table" ).on("dblclick",function(){ 
    textMenu=this.querySelector("span").innerHTML
    new_url = textMenu.match("Sparql Endpoint: (.*) Position:")[1]; 
    new_subjectObject=textMenu.match("Position: (.*)")[1];
    propertyNode=document.getElementById(node.id+"_row").querySelector(".property")
    url=propertyNode.getAttribute("url")
    subjectObject=propertyNode.getAttribute("subject-object")
    property=document.getElementById(node.id+"_row").querySelector(".property").querySelector("span").innerHTML
    form={"url":url,"uri":d3.select("#"+node.id).data()[0].value,"subjectObject":subjectObject,"property":property,"new_url":new_url,"new_subjectObject":new_subjectObject}
    navPanel.clickMenuTable(form,node)
  })
}
navigation.prototype.clickMenuTable = async function (form,element){
  var propertyEl,bubble;
  var node=d3.select("#"+element["id"]).data()[0]
  var navPanel=this;

  var newForm={"url":form["new_url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["new_subjectObject"]}
  propertyEl=form["property"]

  var form={"url":form["url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["subject-object"]}

  await buildFreeGraph(newForm,"table",element)
  document.getElementById(element.getAttribute("id"))
  bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+element.getAttribute("id"))
  clickBubbleFreeGraph(bubble,networkGraph.data)

}