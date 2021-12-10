navigationPanel = function ( _type,_node) {
    this.type = _type;
    this.node = _node
    this.init();
  };
   
navigationPanel.prototype.init = function () {
  var navPanel=this;
  navPanel.imageArrowUp="images/arrow-up.svg"
  navPanel.imageArrowDown="images/arrow-down.svg"
  if(networkGraph.rootNode!=undefined){
    navPanel.node=networkGraph.rootNode
  }

  navPanel.element=document.getElementById(navPanel.node.id)
  navPanel.getNodes()
  navPanel.initModal()
  navPanel.navTableTable()
  navPanel.contentTable()
}

navigationPanel.prototype.getNodes = function (){
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

navigationPanel.prototype.selectBubbles = function (){

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
navigationPanel.prototype.initModal = function (){
  var navPanel=this;
  showModal("#myModal")
  $("#myModal").addClass("translate-x-0")
  $("#myModal").removeClass("translate-x-full")
  $('#myModal').resizable({

  });
  $("#myModal").draggable()
  d3.selectAll("#modal-content table").remove()
}

navigationPanel.prototype.navTableTable = function ()
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
          if(d["target"]["type"]!="menuOption"){
            navPanel.addElementNavProp(d,i,true)
            navPanel.addElementNavProp(d,i,false)
          }
        }
      })
    }else{
      navPanel.sources.forEach(function (d,i){
        navPanel.addElementNav(d,i)
      })
    }
    
    navPanel.addEventsNav()

}

navigationPanel.prototype.addElementNav = function (source,i){
  var navPanel=this, last=false, imageSource="images/check.svg",imageSourceLast="images/location.svg"
  if(navPanel.type=="freeGraph"){
    addFreeGraph()
  }else if(navPanel.type=="basicGraph"){
    if(i+1==navPanel.sources.length){
      last=true
      addBasicGraph(last,imageSourceLast)
    }else{
      addBasicGraph(last,imageSource)
    }
    
  }
  function addBasicGraph(last,navImage){
    li=document.createElement("li")
    li.setAttribute("class", "relative pb-10");

    if(!last){
        div=document.createElement("div")
        div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
        div.setAttribute("aria-hidden", "true");
    }

    a=document.createElement("a")
    a.setAttribute("href", "#");
    a.setAttribute("class", "relative flex items-start group");
    a.id=navPanel.sources[i]["id"]+"_a"
    
    span=document.createElement("span")
    span.setAttribute("class","h-9 flex items-center")
    
    span2=document.createElement("span")
    if(navPanel.sources[i]["target"]){
      colorCircle=colorCorrespondence[colorScale(nodesClassesCorrespondence[navPanel.sources[i]["target"]["class"]])]
    }else{
      colorCircle=colorCorrespondence[colorScale(nodesClassesCorrespondence[navPanel.sources[i]["class"]])]
    }    

    span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))

    img=document.createElement("img")
    img.setAttribute("src",navImage)
    img.setAttribute('width','40px')
    img.setAttribute('height','40px')

    el1=navTable.appendChild(navPanel.nav).appendChild(navPanel.ol).appendChild(li)

    if(!last){
        el1.appendChild(div)
    }
    
    el2=el1.appendChild(a)
    el2.appendChild(span).appendChild(span2).appendChild(img)
    span3=document.createElement("span")
    span3.setAttribute("class","ml-4 min-w-0 flex flex-col")
    span4=document.createElement("span")
    span4.setAttribute("class","text-xs font-semibold tracking-wide uppercase")
    if(navPanel.sources[i]["target"]){
      span4.innerHTML = navPanel.sources[i]["target"]["value"]
    }else{
      span4.innerHTML = navPanel.sources[i]["value"]
    }

    img=document.createElement("img")
    if(navPanel.sources[i]["target"]){
      img.setAttribute("src",bubbleImage(d3.select("#"+navPanel.sources[i]["target"]["id"]).data()[0]))
    }else{
      img.setAttribute("src",bubbleImage(d3.select("#"+navPanel.sources[i]["id"]).data()[0]))
    }  
    
    img.setAttribute('width','40px')
    img.setAttribute('height','40px')
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
    el3.appendChild(img)
  }

  function addFreeGraph(){
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
    }else if(source["type"]=="menuOption"){
      colorCircle="blue-300"
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
  

}

navigationPanel.prototype.addElementNavProp = function (source,i,property){
  var li=document.createElement("li")
  var div,a,li,span,span2,el1
  var navPanel=this;
  li.setAttribute("class", "relative pb-10");
  li.id=source["target"]["id"]+"_li"

  //////////////console.log(source)
  //////////////console.log(navPanel.sources.length)
  //////////////console.log(i)
  //////////////console.log(property)
  //////////////console.log(source["target"]["menuOption"])
  //////////////console.log(navPanel.node)
/*   if(source["target"]["type"]!="menuOption"){
    
  } */
/*   if(source["target"]["menuOption"]){
    //////////////console.log("entra en source target menuOption")
    if(property){
      //////////////console.log("entra en property")
      div=document.createElement("div")
      div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
      div.setAttribute("aria-hidden", "true");
      li.appendChild(div)
    }else if((source["target"]["menuOption"].split(";").length<2)&(i<navPanel.sources.length-1)){
      //////////////console.log("entra en el largo")
      //if(i<navPanel.sources.length-1){
        div=document.createElement("div")
        div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
        div.setAttribute("aria-hidden", "true");
        li.appendChild(div)
      }
  }else if((property)|(i<navPanel.sources.length-1)){
    //////////////console.log("el de por descarte")
    div=document.createElement("div")
    div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
    div.setAttribute("aria-hidden", "true");
    li.appendChild(div)
  } */
  //if((property)|((i<navPanel.sources.length-1)&(navPanel.node.type!="menuOption"))){
  if((property)|((i<navPanel.sources.length-1)&(navPanel.node.type!="menuOption"))){
  //if((property)|((i<navPanel.sources.length-1)&(navPanel.node.type!="menuOption"))|(navPanel.node.type=="menuOption")){
    //////////////console.log("el de por descarte")
    div=document.createElement("div")
    div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
    div.setAttribute("aria-hidden", "true");
    li.appendChild(div)
  }

/*   div=document.createElement("div")
  div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
  div.setAttribute("aria-hidden", "true");
  li.appendChild(div) */


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
    }else if(source["target"]["type"]=="menuOption"){
      colorCircle="blue-300"
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

  //////////////console.log(el1)
  if(i<navPanel.sources.length-1){
      //////////////console.log(div)
      if(div!=undefined){
        el1.appendChild(div)
      }
      
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
    span5.setAttribute("style","color:blue;font-weight:bolder")
    ////////////////console.log(source)
    span5.innerHTML=  "   Sparql Endpoint(" + source["target"]["url"] + ")"
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
    el3.appendChild(span5)
  }else{
    span4.innerHTML = source["target"]["value"]
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
  }
  //////////////console.log(el3)
}

/* navigationPanel.prototype.addLineElementNav = function (li){
  var navPanel=this;
  var div=document.createElement("div")
  div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
  div.setAttribute("aria-hidden", "true");
  li.appendChild(div)
} */

navigationPanel.prototype.addEventsNav = function (){
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
navigationPanel.prototype.contentTable = function (){
  var navPanel=this,label;
  var menuOption;
  navPanel.numStart=1
  navPanel.numTot=navPanel.targets.length
  navPanel.numLinesShown=10
  navPanel.numEnd=navPanel.numLinesShown
  navPanel.numCurrent=navPanel.numStart
  navPanel.contentRows=[]
  d3.selectAll("#modal-content table").remove()
  

  if (navPanel.targets.length>0){

    navPanel.table = document.createElement("table");
    navPanel.table.className="w-full divide-y divide-gray-200 table-auto"
  
    navPanel.thead=document.createElement("thead")
    navPanel.thead.className="bg-gray-50"
    var tr=document.createElement("tr")
    var th=document.createElement("th")
    th.setAttribute("colspan","3")
    th.setAttribute("scope","colgroup")
    th.setAttribute("class","px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider")
    if(navPanel.node["type"]=="menuOption"){
      menuOption=navPanel.node["value"].split(",")
      if(navPanel.type=="freeGraph"){
        labelFreeGraph()
      }else if(navPanel.type=="basicGraph"){
        labelBasicGraph()
      }
      
      th.innerHTML=`<div>
        <label for="account-number" class="block text-sm font-medium text-gray-700">` + label + `</label>
        <div class="mt-1 relative rounded-md shadow-sm w-1/2">
          <input type="text" name="nodeSearch" id="node-search" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 py-3 pl-3 sm:text-sm border-gray-300 rounded-md" placeholder="Find node...">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <!-- Heroicon name: solid/question-mark-circle -->
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M21.7071068,20.2928932 C22.0976311,20.6834175 22.0976311,21.3165825 21.7071068,21.7071068 C21.3165825,22.0976311 20.6834175,22.0976311 20.2928932,21.7071068 L16.9056439,18.3198574 C15.5509601,19.3729184 13.8487115,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,13.8487115 19.3729184,15.5509601 18.3198574,16.9056439 L21.7071068,20.2928932 Z M12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 C8.6862915,6 6,8.6862915 6,12 C6,15.3137085 8.6862915,18 12,18 Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        </div>`
    }else{
      menuOption=navPanel.node["menuOption"]
      if(menuOption.split(";").length>1){
        th.innerHTML="Several options displayed in graph. Click on each option to see results values:";
      }else{
        menuOption=menuOption.split(",")
        if(navPanel.type=="freeGraph"){
          labelFreeGraph()
        }else if(navPanel.type=="basicGraph"){
          labelBasicGraph()
        }

        th.innerHTML=`<div>
        <label for="account-number" class="block text-sm font-medium text-gray-700">` + label + `</label>
        <div class="mt-1 relative rounded-md shadow-sm w-1/2 inline-block">
          <input type="text" name="nodeSearch" id="node-search" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 py-3 pl-3 sm:text-sm border-gray-300 rounded-md" placeholder="Find node...">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M21.7071068,20.2928932 C22.0976311,20.6834175 22.0976311,21.3165825 21.7071068,21.7071068 C21.3165825,22.0976311 20.6834175,22.0976311 20.2928932,21.7071068 L16.9056439,18.3198574 C15.5509601,19.3729184 13.8487115,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,13.8487115 19.3729184,15.5509601 18.3198574,16.9056439 L21.7071068,20.2928932 Z M12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 C8.6862915,6 6,8.6862915 6,12 C6,15.3137085 8.6862915,18 12,18 Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
          <button type="button" class="ml-5 py-2 px-3 font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="remove-sel" onclick="removeSelection(this)">
            Remove selection
          </button>
          <button type="button" class="ml-5 py-2 px-3 font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="add-sel-graph" onclick="addSelToGraph(this)">
            Add to graph
          </button>
        </div>`
      }
     
    }
    
    navPanel.thead.appendChild(tr).appendChild(th)
    navPanel.tbody=document.createElement("tbody")
    navPanel.tbody.className="bg-white divide-y divide-gray-200"

    navPanel.showLines(navPanel.numCurrent,true)

    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
  
    div=document.createElement("div")    
    div.className="flex flex-col"
    div2=document.createElement("div")    
    div2.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
    div3=document.createElement("div")    
    div3.className="overflow-auto border-b border-gray-200 shadow md:overflow-scroll sm:rounded-lg"

    navPanel.divPag=document.createElement("div")
    navPanel.divPag.className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
    navPanel.divPag.id="div-pagination"
    navPanel.divPag.innerHTML=`<div class="flex-1 flex justify-between sm:hidden">
        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Previous
        </a>
        <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
        </a>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium" id="numStart">`+ navPanel.numStart +`</span>
            to
            <span class="font-medium" id="numEnd">` + navPanel.numEnd + `</span>
            of
            <span class="font-medium" id="numTot">` + navPanel.numTot + `</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hidden" id="page-first" onClick="showLines('page-first','`+navPanel.type+`')">
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: solid/chevron-double-left -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hidden" id="page-prev" onClick="showLines('page-prev','`+navPanel.type+`')">
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: solid/chevron-left -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </a>
            <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->`
    navPanel.showNumberPages()
    navPanel.divPag.innerHTML +=`<a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" id="page-next" onClick="showLines('page-next','`+navPanel.type+`')">
              <span class="sr-only">Next</span>
              <!-- Heroicon name: solid/chevron-right -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" id="page-last" onClick="showLines('page-last','`+navPanel.type+`')">
            <span class="sr-only">Previous</span>
            <!-- Heroicon name: solid/chevron-double-right -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
          </nav>
        </div>
      </div>`

    navPanel.fullTable=dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(navPanel.table)
    navPanel.fullTable.appendChild(navPanel.thead)
    navPanel.fullTable.appendChild(navPanel.tbody); 
    dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(navPanel.divPag);
    
    navPanel.addEventsContentNav()
  }

  function labelFreeGraph(){
    label=`Sparql Endpoint: ` + menuOption[0]+ ` and Position: ` +menuOption[1]
  }
  function labelBasicGraph(){

    label=menuOption[0]
    if(label=="no options"){
      label=configFile.filter(d=>d.class==navPanel.node.class)[0]["option_text"]
    }
    label=configFile.filter(d=>d.option==label)[0]["option_text"]
  }
}
navigationPanel.prototype.contentTableSearch = function (){
  var navPanel=this;
  var menuOption;
  navPanel.numStart=1

  if (navPanel.targets.length>0){  
    navPanel.numTot=navPanel.targets.length
    navPanel.numLinesShown=10
    navPanel.numEnd=navPanel.numLinesShown
    navPanel.numCurrent=navPanel.numStart
    navPanel.contentRows=[]

    navPanel.showLines(navPanel.numCurrent,false)
    navPanel.divPag=document.createElement("div")
  } 
}
navigationPanel.prototype.paginationNumbers = function (){
  var navPanel=this
 {
    if (navPanel.numCurrent < 1) {
      navPanel.numCurrent = 1;
    } else if (navPanel.numCurrent > navPanel.numPages) {
      navPanel.numCurrent = navPanel.numPages;
    }

    let startPage,endPage;

    if (navPanel.numPages <= navPanel.paginationLimit) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = navPanel.numPages;
    } else {
        // total pages more than max so calculate start and end pages
        let maxPagesBeforeCurrentPage = Math.floor(navPanel.paginationLimit / 2);
        let maxPagesAfterCurrentPage = Math.ceil(navPanel.paginationLimit / 2) - 1;
        if(navPanel.numCurrent + maxPagesAfterCurrentPage >= navPanel.numPages){
          //////////console.log("mayor")
          //////////console.log(navPanel.numCurrent + maxPagesAfterCurrentPage)
        }else{
          //////////console.log("menor")
          //////////console.log(navPanel.numCurrent + maxPagesAfterCurrentPage)
        }
        if (navPanel.numCurrent <= maxPagesBeforeCurrentPage) {
            // current page near the start
            //////////console.log("near start")
            startPage = 1;
            endPage = navPanel.paginationLimit;
        } else if (navPanel.numCurrent + maxPagesAfterCurrentPage >= navPanel.numPages) {
            // current page near the end
            //////////console.log("near end")
            //////////console.log(navPanel.numCurrent)
            //////////console.log(maxPagesAfterCurrentPage)
            //////////console.log(navPanel.numPages)
            startPage = navPanel.numPages - navPanel.paginationLimit + 1;
            endPage = navPanel.numPages;
        } else {
            // current page somewhere in the middle
            //////////console.log("near middle")
            startPage = navPanel.numCurrent - maxPagesBeforeCurrentPage;
            endPage = navPanel.numCurrent + maxPagesAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    let startIndex = ((navPanel.numCurrent - 1) * navPanel.numLinesShown)+1;
    let endIndex = Math.min(startIndex + navPanel.numLinesShown - 1, navPanel.numTot);

    ////////console.log(endPage)
    ////////console.log(startPage)
    
    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        totalItems: navPanel.numTot,
        currentPage: navPanel.numCurrent,
        pageSize: navPanel.numLinesShown,
        totalPages: navPanel.numPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}
}
navigationPanel.prototype.showNumberPages = function (){
  var navPanel=this,textHtml=""

  navPanel.firstPage=1
  ////console.log(navPanel.numTot)
  navPanel.numPages=Math.ceil(navPanel.numTot/navPanel.numLinesShown)
  navPanel.arrNumberPages=[]
  navPanel.paginationLimit=10
  ////////console.log(navPanel)

  navPanel.pages = navPanel.paginationNumbers()
  ////////console.log(navPanel.pages)
  ////////console.log(navPanel.pages.pages.length)

  pagePrev = document.getElementById('page-prev');
      //for (i=1;i<=navPanel.numPages-1;i++) {
  //showNumberPages()
  for (i=0;i<=navPanel.pages.pages.length-1;i++) {
    ////////console.log(navPanel.pages.pages[i])
    if(navPanel.pages.pages[i]==navPanel.numCurrent){
      if(pagePrev==null){
        navPanel.divPag.innerHTML +=`<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page">`+ navPanel.pages.pages[i] + `</a>`
      }else{
        textHtml +=`<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page">`+ navPanel.pages.pages[i] + `</a>`
      } 
    }else{
      if(pagePrev==null){
        navPanel.divPag.innerHTML +=`<a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page" onClick="showLines(this.textContent,'`+navPanel.type+`')">`
        + navPanel.pages.pages[i] + `</a>`
      }else{
        textHtml +=`<a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page" onClick="showLines(this.textContent,'`+navPanel.type+`')">`
        + navPanel.pages.pages[i] + `</a>`
      }
    }
  }
  if(pagePrev!=null){
    pagePrev.insertAdjacentHTML('afterend', textHtml);
  }
  /* ////////console.log(textHtml)
  return textHtml */
}

function showLines(numCurrent,type){
  //console.log(numCurrent)
  if(type=="basicGraph"){
    navigationBasic.showLines(numCurrent,false)
  }else{
    navigationFree.showLines(numCurrent,false)
  } 
}
function removeLinesNavContent(){
  var sel=document.querySelectorAll("#dvTable tbody tr")
  ////console.log(sel)
  if(sel.length>0){
    sel.forEach(
      function(currentValue, currentIndex, listObj) {
        ////////////console.log(currentValue + ', ' + currentIndex + ', ' + this);
        currentValue.remove()
      }
    )
  }
}
navigationPanel.prototype.showLines = function (numCurrent,first,cluster){
  var navPanel=this,linesShown,numPagesElements;
  ////console.log(navPanel.pages)
  if(numCurrent=='page-first'){
    numCurrent=navPanel.firstPage
  }else if (numCurrent=='page-prev'){
    numCurrent=navPanel.numCurrent-1
  }else if (numCurrent=='page-last'){
    numCurrent=navPanel.pages.totalPages
  }else if (numCurrent=='page-next'){
    numCurrent=navPanel.numCurrent+1
  }
  navPanel.numCurrent=parseInt(numCurrent)
  
/*   if(!first){
    navPanel.showNumberPages()
  } */
  
  removeLinesNavContent()

  ////////////console.log(navPanel.numCurrent*navPanel.numLinesShown)
  ////////////console.log(navPanel.numCurrent*navPanel.numLinesShown+navPanel.numLinesShown)
  
  //////console.log(navPanel.numTot)
  //if(navPanel.numCurrent!=1){
  if(!first){
    numPagesElements = document.querySelectorAll('#div-pagination .num-page');
    numPagesElements.forEach(function(el){
      el.remove()
    })
    navPanel.showNumberPages()
    document.getElementById("numStart").textContent=navPanel.pages.startIndex
    document.getElementById("numEnd").textContent=navPanel.pages.endIndex
    document.getElementById("numTot").textContent=navPanel.numTot
    ////////console.log(navPanel)
    ////////console.log(navPanel.firstPage)
    ////////console.log(typeof(navPanel.firstPage))
    ////////console.log(typeof(navPanel.pages.pages[0]))
    if(navPanel.pages.pages.includes(navPanel.firstPage)&(navPanel.pages.pages.includes(navPanel.pages.totalPages))){
      document.getElementById("page-first").classList.add("hidden");
      document.getElementById("page-prev").classList.add("hidden");
      document.getElementById("page-next").classList.add("hidden");
      document.getElementById("page-last").classList.add("hidden"); 
    }else if(navPanel.pages.pages.includes(navPanel.pages.totalPages)){
      document.getElementById("page-first").classList.remove("hidden");
      document.getElementById("page-prev").classList.remove("hidden");
      document.getElementById("page-next").classList.add("hidden");
      document.getElementById("page-last").classList.add("hidden"); 
    }else if(navPanel.pages.pages.includes(navPanel.firstPage)){
      document.getElementById("page-first").classList.add("hidden");
      document.getElementById("page-prev").classList.add("hidden");
      document.getElementById("page-next").classList.remove("hidden");
      document.getElementById("page-last").classList.remove("hidden"); 
    }else{
      document.getElementById("page-first").classList.remove("hidden");
      document.getElementById("page-prev").classList.remove("hidden");
      document.getElementById("page-next").classList.remove("hidden");
      document.getElementById("page-last").classList.remove("hidden");
    }


  }
  ////console.log(navPanel.pages)
  
  if(first){
    linesShown=navPanel.targets.slice(navPanel.firstPage - 1, navPanel.numLinesShown);
  }else{
    linesShown=navPanel.targets.slice(navPanel.pages.startIndex - 1, navPanel.pages.endIndex);
  }
  
  //console.log(linesShown)
  for (var i = 0; i < linesShown.length; i++) {
    row = navPanel.tbody.insertRow(-1);
    row.id=linesShown[i]["target"]["id"]+"_row"
    navPanel.contentRows.push(row)
    if(navPanel.type=="freeGraph"){
      if(cluster){
        navPanel.addElementContentTableProp(linesShown[i],i,cluster)
      }else{
        navPanel.addElementContentTableProp(linesShown[i],i)
      }
      
    }else if(navPanel.type=="basicGraph"){
      navPanel.addElementContentTable(linesShown[i],i)
    }
  }
  //}
}
/* for (var i = 0; i < navPanel.targets.length; i++) {
  row = navPanel.tbody.insertRow(-1);
  row.id=navPanel.targets[i]["target"]["id"]+"_row"
  navPanel.contentRows.push(row)
  if(navPanel.type=="freeGraph"){
    navPanel.addElementContentTableProp(navPanel.targets[i],i)
  }else{
    navPanel.addElementContentTable(navPanel.targets[i],i)
  }
} */

navigationPanel.prototype.addEventsContentNav = function (){
  var navPanel=this,cell,nodeSearchField,node;
  navPanel.isDblclick = false;

  ////////console.log(navPanel.targets)
  navPanel.searchValues=navPanel.targets.map(d=>d.target.value)

  nodeSearchField=document.getElementById("node-search")
  //////console.log(navPanel.searchValues)
  autocomplete(nodeSearchField, navPanel.searchValues);

// Execute a function when the user releases a key on the keyboard
  nodeSearchField.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === 'Enter' ) {
    // Cancel the default action, if needed
    event.preventDefault();
    
    removeLinesNavContent()

    ////console.log(nodeSearchField.value)
    //navPanel.resultsSearch = navPanel.targets.filter(a =>a.target.value.includes(nodeSearchField.value));
    //navPanel.resultsSearch = navPanel.targets.filter(a =>a.target.value.includes(nodeSearchField.value)).map(d=>d.target.value);
    //////console.log(navPanel.resultsSearch)

    //////console.log(navPanel.backupNavPanel)

    //contentRows
    //numPages
    //numTot
    //sources
    
    
    if(navPanel.targetsBackup){
      ////console.log("entra if")
      navPanel.resultsSearch = navPanel.targetsBackup.filter(a =>(a.target.value.includes(nodeSearchField.value)|(a.target.value==nodeSearchField.value)));
    }else{
      ////console.log("entra else")
      navPanel.resultsSearch = navPanel.targets.filter(a =>a.target.value.includes(nodeSearchField.value));
      navPanel.targetsBackup=navPanel.targets
    }
    
    navPanel.targets=navPanel.resultsSearch
    
    ////console.log(navPanel)

    navPanel.contentTableSearch()
    closeAllLists()
    /* navPanel.numStart=1
    //////console.log(navPanel.targets)
    navPanel.numTot=navPanel.targets.length
    navPanel.numLinesShown=10
    navPanel.numEnd=navPanel.numLinesShown
    navPanel.numCurrent=navPanel.numStart
    navPanel.contentRows=[]
    
    if (navPanel.targets.length>0){    
      navPanel.showLines(navPanel.numCurrent,true)
      navPanel.divPag=document.createElement("div")
      navPanel.showNumberPages()    
    }  */
    // Trigger the button element with a click
    //document.getElementById("myBtn").click();
  }
  });

  navPanel.timeoutTiming = 500;
  ////console.log(d3.selectAll("#modal-content"))
  ////console.log(d3.selectAll("#modal-content td"))
  d3.selectAll("#modal-content td").on("dblclick",function(){ 
    console.log("entra")
    d3.event.preventDefault();
    navPanel.isDblclick = true;
    clearTimeout(navPanel.dblclickTimeout);
    navPanel.dblclickTimeout = setTimeout(function () {
      navPanel.isDblclick = false;
    }, navPanel.timeoutTiming);
    ////console.log("pasa por aquí")
    ////console.log(this)
    console.log(navPanel.type)
    if(this.getAttribute("cluster")){
      if(navPanel.type=="basicGraph"){
        dblclickCellContent(node,"basicGraph")
      }else{
        dblclickCellContent(node,"freeGraph")
      }
    }else{
      node=d3.select("#"+this.getAttribute("id")).data()[0]
      console.log(this)
      console.log(node)
      if(node.more_results){
        if(node.more_results.length>0){
          if(navPanel.type=="basicGraph"){
            dblclickCellContent(node,"basicGraph")
          }else{
            dblclickCellContent(node,"freeGraph")
          }
        }else{
          if(navPanel.type=="basicGraph"){
            dblclickCellContent(this,"basicGraph")
          }else{
            dblclickCellContent(this,"freeGraph")
          }
        }
      }else{
        if(navPanel.type=="basicGraph"){
          dblclickCellContent(this,"basicGraph")
        }else{
          dblclickCellContent(this,"freeGraph")
        }
      }
      
    }

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

navigationPanel.prototype.addElementContentTable = function (target,i){
  var navPanel=this;
  //console.log(target)
  if(navPanel.type=="freeGraph"){
    addFreeGraph()
  }else if(navPanel.type=="basicGraph"){
    //console.log("add Content row")
    addBasicGraph()
  }

  
  function addBasicGraph(){
    row = navPanel.tbody.insertRow(-1);
    
    cell = row.insertCell(-1);
    console.log(target)
    cell.className="px-6 py-4 whitespace-nowrap"
    cell.id=target["target"]["id"]
    div=document.createElement("div")
    div.className="flex items-center w-full"
    div2=document.createElement("div")
    div2.className="flex-shrink-0 w-10 h-10"
    img=document.createElement("img")
    img.className="w-10 h-10 rounded-full bg-"+colorCorrespondence[colorScale(nodesClassesCorrespondence[target["target"]["class"]])]
    img.setAttribute("src",bubbleImage(d3.select("#"+target["target"]["id"]).data()[0]))
    div3=document.createElement("div")
    div3.className="relative ml-4"
    div4=document.createElement("div")
    div4.className="relative text-sm font-medium text-gray-900"
    a=document.createElement("a")
    a.setAttribute("href", "#");
    a.setAttribute("class", "relative flex items-start group");
    span=document.createElement("span")
    newText = document.createTextNode(target["target"]["value"]);
    div4.appendChild(a).appendChild(span).appendChild(newText);
    el1=cell.appendChild(div)
    el1.appendChild(div2).appendChild(img)
    el1.appendChild(div3).appendChild(div4)
  }
  function addFreeGraph(){
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
  
  ////////////////console.log(nodesTable[i]["target"]["type"])
  if(!property){
      if(nodesTable[i]["target"]["type"]=="uri"){
          img.className="w-10 h-10 bg-green-300 rounded-full"
        }else if(nodesTable[i]["target"]["type"]=="bnode"){
          img.className="w-10 h-10 bg-yellow-300 rounded-full"
        }else if(nodesTable[i]["target"]["type"]=="menuOption"){
          img.className="w-10 h-10 bg-blue-300 rounded-full"
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
}


navigationPanel.prototype.addElementContentTableProp = function (target,i,cluster){
  var navPanel=this;
  insertCheckBox()
  insertContent(true)
  insertContent(false)
  function insertCheckBox(){
    cell = row.insertCell(-1);
    cell.className="px-6 py-4 whitespace-nowrap"
    //cell.id=target["target"]["id"]+"_check"
    div=document.createElement("div")
    if(cluster){
      div.className="flex items-center h-5"
    }else{
      div.className="flex items-center hidden h-5"
    }
    
    input=document.createElement("input")
    input.id=target["target"]["id"]+"_check"
    input.setAttribute("name","nodeTable")
    input.setAttribute("type","checkbox")
    //input.className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500"
    input.className="form-checkbox"
    cell.appendChild(div).appendChild(input)
/*     <div class="flex items-center h-5">
      <input id="comments" aria-describedby="comments-description" name="comments" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
    </div> */
  }
  function insertContent(property){
    var menuOption;
    cell = row.insertCell(-1);
    cell.className="px-6 py-4 whitespace-nowrap"
    if(cluster){
      cell.setAttribute("cluster",cluster)
    }
    if(!property){
      cell.id=target["target"]["id"]
    }else{
      cell.id=target["source"]["id"]+target["target"]["id"]
    }
    ////console.log(target["source"])
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
    
    ////////////////console.log(target["target"]["type"]=="uri")
    if(!property){
        if(target["target"]["type"]=="uri"){
            img.className="w-10 h-10 bg-green-300 rounded-full"
          }else if(target["target"]["type"]=="bnode"){
            img.className="w-10 h-10 bg-yellow-300 rounded-full"
          }else if(target["target"]["type"]=="menuOption"){
            img.className="w-10 h-10 bg-blue-300 rounded-full"
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
        if((target["target"]["type"]!="bnode")&(target["target"]["type"]!="uri")&(target["target"]["type"]!="menuOption")){
          a.setAttribute("class", "relative flex items-start group isDisabled");
        }else{
          a.setAttribute("class", "relative flex items-start group");
        }
        
        span=document.createElement("span")
        ////////////////console.log(target["target"])
        if(target["target"]["type"]=="menuOption"){
          menuOption=target["target"]["value"].split(",")
          newText = document.createTextNode("Sparql Endpoint: "+ menuOption[0]+ "and Position: "+menuOption[1]);
        }else{
          newText =document.createTextNode(target["target"]["value"]);
        }
        
        div4.appendChild(a).appendChild(span).appendChild(newText);
    }else{
        span=document.createElement("span")
        if(target["value"]!=undefined){
          newText = document.createTextNode(target["value"]);
          ////console.log(newText)
        }else{
          ////console.log(target)
          newText = document.createTextNode("no property");
          ////console.log(newText)
        }
        
        div4.appendChild(span).appendChild(newText);
    }
        
    el1=cell.appendChild(div)
    el1.appendChild(div2).appendChild(img)
    el1.appendChild(div3).appendChild(div4)
  }
  }
  function dblclickCellCluster(el){
    navigationPanel.dblclickCellCluster(el)
  }
  navigationPanel.prototype.dblclickCellCluster = async function (cell) {
    var navPanel=this,results;
    ////console.log(cell)
    results=await checkClassesBasicGraph(cell["more_results"],cell["subject-object"])
    ////console.log(results)
    results=results.map(function (d){
      if(cell["subject-object"]=="s"){
        d.o.id=genRandomString()
      }else if(cell["subject-object"]=="o"){
        d.s.id=genRandomString()
      }
      return d
    })

    if(cell["subject-object"]=="s"){
      navPanel.targets=results.map(function(d){
        return {
          "target":{"value":d.o.value,
          "id":d.s.id,"type":d.o.type},
          "source":{"id":cell["id"]},
          "value":cell["property"],
          "url":cell["url"],
          "subject-object":cell["subject-object"]
        }
      })
    }else if(cell["subject-object"]=="o"){
      navPanel.targets=results.map(function(d){
        return {
          "target":{"value":d.s.value,
          "id":d.s.id,"type":d.s.type},
          "source":{"id":cell["id"]},
          "value":cell["property"],
          "url":cell["url"],
          "subject-object":cell["subject-object"]
        }
      })
      //navPanel.targets=results.map(d=>d.s.value)
    }
    ////console.log(navPanel)
    navPanel.pages.endIndex=navPanel.targets.length
    navPanel.numTot=navPanel.targets.length
    //////console.log(nav)
    //navPanel.paginationNumbers()
    navPanel.showLines(1,false,cell["id"])
    navPanel.addEventsContentNav()
  }
navigationPanel.prototype.dblclickCellContent = async function (cell) {
  var navPanel=this,indexRows=1,bubble,node;
  console.log(cell)
  console.log(navPanel.type)
  if(navPanel.type=="basicGraph"){
    basicGraph()
  }else{
    freeGraph()
  }
  //}else{
  //  bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
  //  clickBubbleFreeGraph(bubble,networkGraph.data)
  //}
  function searchMenuOptionChild(){
    return (networkGraph.treeData.filter(d=>d.id==node["id"])[0]["children"].filter(v=>v.value==indexRows[0].url+","+indexRows[0]["subject-object"])[0])
  }
  async function basicGraph(){
    //var indexRows=1,node;
    var element=document.getElementById(cell.getAttribute("id"));
    console.log(element)
    indexRows=await networkGraph.wrangleData(element,"table");
    console.log(indexRows)
    if (indexRows.length<2){
      unclickBubble()

      clickBubble(element,networkGraph.data)
      d3.select("#"+row.getAttribute("id"))
      .attr("stroke", "yellow")
      .attr("stroke-width", "6px");
    }else{
      node=d3.select("#"+element.getAttribute("id")).data()[0]
      addMenuToTable(element,indexRows)
    }
  }
  async function freeGraph(){
    //if(networkGraph.treeData.filter(d=>d.id==cell.getAttribute("id")).length==0){
      indexRows=await networkGraph.wrangleDataFreeGraph(cell,"table");
      ////////////console.log(indexRows)
      if(indexRows.length==0){
        unclickBubbleFreeGraph()
        bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
        ////////////console.log(bubble)
        ////////////console.log(cell)
        clickBubbleFreeGraph(bubble,networkGraph.data)
        d3.select("#"+row.getAttribute("id"))
        .attr("stroke", "yellow")
        .attr("stroke-width", "6px");
      }else if (indexRows.length==1){
        unclickBubbleFreeGraph()
        node=d3.select("#"+cell.getAttribute("id")).data()[0]
        ////////////console.log(node)
        if(node["menuOption"].split(";").length>1){
          bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
          //bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
        }else{
          bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
        }
        ////////////console.log(bubble)
        ////////////console.log(cell)
        clickBubbleFreeGraph(bubble,networkGraph.data)
        d3.select("#"+row.getAttribute("id"))
        .attr("stroke", "yellow")
        .attr("stroke-width", "6px");
      }
  }
}

navigationPanel.prototype.clickCellContent = async function (cell){
  d3.selectAll(".nodeCircleCircle")
  .style("opacity", 1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}

navigationPanel.prototype.dblclickNav = async function (cell) {
  var navPanel=this,bubble;
  bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","").replace("_li","")))
  unclickBubbleFreeGraph()
  clickBubbleFreeGraph(bubble,networkGraph.data)
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}

navigationPanel.prototype.clickNav = async function (cell){
  d3.selectAll(".nodeCircleCircle")
  .style("opacity", 1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}
navigationPanel.prototype.addMenuToTable = function (node,menuItems){
  var navPanel=this;
  var textTooltip,div,textNode,newText,newCell,element,newRow,span,form,textMenu,property,propertyNode,new_url,new_subjectObject
  d3.selectAll(".menu-table").remove()
  console.log(node)
  console.log(menuItems)
  var rowIndex=$('#myModal #'+ (node["id"]+"_row"))[0].rowIndex;

  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

  for (var i = 0; i < menuItems.length; i++) {
      newRow = tbodyRef.insertRow(rowIndex+i);
      newRow.id="menu-table-"+ node.id + "-" + [i]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();
      newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
      newCell.setAttribute("colspan","3")
      newCell.setAttribute("x-data","{ tooltip: false }")

      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      a.setAttribute("x-on:mouseenter","tooltip = true")
      a.setAttribute("x-on:mouseleave","tooltip = false")

      div=document.createElement("div")
      div.setAttribute("x-show","tooltip")
      div.setAttribute("class","z-50 absolute bg-blue-300 border-graphite border-2 rounded p-4 mt-1")
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
navigationPanel.prototype.clickMenuTable = async function (form,element){
  var propertyEl,bubble,node;
  var node=d3.select("#"+element["id"]).data()[0]
  var navPanel=this;
  ////////////console.log(form)
  var newForm={"url":form["new_url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["new_subjectObject"]}
  propertyEl=form["property"]

  var form={"url":form["url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["subjectObject"]}
  ////////////console.log(element)
  node=d3.select("#"+element.getAttribute("id")).data()[0]
  await buildFreeGraph(newForm,"table",node)
  document.getElementById(element.getAttribute("id"))

  ////////////console.log(newForm)
  ////////////console.log(node)
  ////////////console.log(bubble)
  if(node["menuOption"].split(";").length>1){
    ////////////console.log("entra en mayor que 1")
    bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
    ////////////console.log(bubble)
  }else{
    bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+element.getAttribute("id"))
  }
  clickBubbleFreeGraph(bubble,networkGraph.data)

function searchMenuOptionChild(){
  return (networkGraph.treeData.filter(d=>d.id==node["id"])[0]["children"].filter(v=>v.value==newForm.url+","+newForm["subject-object"])[0])
}
}

function removeSelection(element){
  ////console.log(element)
  navigationPanel.removeSelection()
}
navigationPanel.prototype.removeSelection = function (){
  var navPanel=this;

  navPanel.targets=navPanel.targetsBackup
    
  ////console.log(navPanel)

  navPanel.contentTableSearch()
  $("#remove-sel").addClass("hidden")
  $("#node-search").val("")
}
function addSelToGraph(element){
  ////console.log(element)
  navigationPanel.addSelToGraph()
}
navigationPanel.prototype.addSelToGraph = function (){
  var navPanel=this,selected=[],results;
  var $boxes = $('input[name=nodeTable]:checked');
  ////console.log(d3.select("#"+document.getElementById($boxes[0].getAttribute("id").replace("_check","")).getAttribute("cluster")).data()[0])
  
  //////console.log(d3.select("#"+$boxes[0].getAttribute("id").replace("_check","")).getAttribute("cluster"))
  //////console.log(d3.select("#"+d3.select("#"+$boxes[0].getAttribute("id").replace("_check","")).getAttribute("cluster")).data()[0])
  
  var node=d3.select("#"+document.getElementById($boxes[0].getAttribute("id").replace("_check","")).getAttribute("cluster")).data()[0]
  //////console.log(d3.select("#"+$boxes[0].getAttribute("cluster")).data())
  $boxes.each(function(i){
    // Do stuff here with this
    //////console.log(d)
    ////console.log($boxes[i])
    selected.push(document.getElementById($boxes[i].getAttribute("id").replace("_check","")).querySelector("a span").innerText)

  });
  ////console.log($boxes)
  ////console.log(networkGraph.treeData)
  if(node["subject-object"]=="s"){
    results=node["more_results"].filter(d=>selected.includes(d.o.value))
  }else if(node["subject-object"]=="o"){
    results=node["more_results"].filter(d=>selected.includes(d.s.value))
  }
  ////console.log(results)
  addNodesGraph(results,node,form)
  //$("#myModal").removeClass("translate-x-0")
  //$("#myModal").addClass("translate-x-full")
  //$boxes.length;
}