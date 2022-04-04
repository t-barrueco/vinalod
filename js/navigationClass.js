navigationPanel = function ( _type,_node) {
    this.type = _type;
    this.node = _node
    this.init();
  };
   
navigationPanel.prototype.init = function () {
  var navPanel=this;
  ////////////////////console.log("entra en init")
  navPanel.clusterElSelected=[]
  navPanel.imageArrowUp="images/arrow-up.svg"
  navPanel.imageArrowDown="images/arrow-down.svg"
  //////////////////////console.log(navPanel.node)
  if(navPanel.node==undefined){
    navPanel.node=networkGraph.rootNode
  }

  ////////console.log(navPanel.node)
  navPanel.element=document.getElementById(navPanel.node.id)
  ////////////////////console.log(navPanel.element)
  ////////////////////console.log(navPanel.node)
  navPanel.getNodes()
  //////////////////console.log(navPanel.targets)
  //////////////////console.log(navPanel.sources)
  navPanel.initModal()
  navPanel.navTableTable()
  navPanel.contentTable()
  navPanel.showChildrenDetails()
}
navigationPanel.prototype.showChildrenDetails = function (){
  var navPanel=this;
  ////////console.log(navPanel.targets)
  ////////console.log(navPanel.node)
  if((navPanel.targets.length==0)|((navPanel.node.detail=="")|(navPanel.node.detail==undefined))){
    $("#tabsNav").addClass("hidden")
  }else{
    $("#tabsNav").removeClass("hidden")
    $("#tabsNav nav").attr('id', navPanel.node.id+"_tabsNav");
  }
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
  $('#myModal').resizable({

  });
  $("#myModal").draggable()
  d3.selectAll("#modal-content table").remove()
}

navigationPanel.prototype.navTableTable = function ()
  {
    var last=false,property=false,first=true,ol=null  
    var navPanel=this,nodeClass;
    navPanel.navTable = document.getElementById("navTable");

    if((navPanel.navTable.querySelector("nav"))){
      ////////////////console.log("entra por aquí")
      navPanel.nav=navPanel.navTable.querySelector("nav")
      navPanel.ol=navPanel.navTable.querySelector("ol")
      ////////////////console.log(navPanel.nav)
      ////////////////console.log(navPanel.ol)
      if(navPanel.ol!=null){
        navPanel.ol.querySelectorAll("li").forEach(function(li){
          li.remove()
        })
      }else{
        navPanel.ol=document.createElement("ol")
        navPanel.ol.setAttribute("role", "list");
      }
      
    }else{
      ////////////////console.log("entra por else")
      navPanel.nav=navPanel.navTable.appendChild(document.createElement("nav"))
      //navPanel.nav=document.createElement("nav")
      navPanel.nav.setAttribute("aria-label", "Progress");
      navPanel.ol=document.createElement("ol")
      navPanel.ol.setAttribute("role", "list");
    }
    navPanel.sources.forEach(function (d,i){
      //////////////////console.log(d)
      if(d.source){
        nodeClass=d.source.class
      }else{
        nodeClass=d.class
      }
      if(nodeClass=="free"){
        if(i==0){
          ////////////////console.log("entra if segund")
          navPanel.addElementNav(d,i)
        }else{
          ////////////////console.log("entra else segundo")
          if(d["target"]["type"]!="menuOption"){
            navPanel.addElementNavProp(d,i,true)
            navPanel.addElementNavProp(d,i,false)
          }
        }
      }else{
        ////////////////console.log("entra tercer else")
        navPanel.addElementNav(d,i)
      }
    })
    
    navPanel.addEventsNav()

}

navigationPanel.prototype.addElementNav = function (source,i){
  var navPanel=this, last=false, imageSource="images/check.svg",imageSourceLast="images/location.svg",nodeClass
  if(source.source){
    nodeClass=source.source.class
  }else{
    nodeClass=source.class
  }
  if(nodeClass=="free"){
    addFreeGraph()
  }else{
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
    //////////////////console.log(navPanel.sources[i])
    if(navPanel.sources[i]["target"]!=undefined){
      a.id=navPanel.sources[i]["target"]["id"]+"_a"
    }else{
      a.id=navPanel.sources[i]["id"]+"_a"
    }

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
    span4.setAttribute("class","text-sm font-semibold tracking-wide uppercase")
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
      //////////////////console.log(navPanel.nav.querySelectorAll("ol").length)
      //////////////////console.log("entra en el primer if de nav")
      if((navPanel.nav.querySelectorAll("ol").length)==0){
        navPanel.nav=navPanel.nav.appendChild(navPanel.ol)
      }
      //el1=navPanel.navTable.appendChild(navPanel.nav).appendChild(navPanel.ol).appendChild(li)
      //////////////////console.log(navPanel.nav)
      //////////////////console.log(navPanel.ol)
      el1=navPanel.ol.appendChild(li)
      el1.appendChild(div)
    }else{
      ////////////////console.log("entra el primer else de nav")
      ////////////////console.log(navPanel.nav)
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
  //////////////////console.log(source)
  //////////////////console.log(i)
  //////////////////console.log(property)
  li.setAttribute("class", "relative pb-10");
  li.id=source["target"]["id"]+"_li"
  //////////////////console.log(property)
  //////////////////console.log(navPanel.sources.length-1)
  //////////////////console.log(navPanel.node.type)
  if((property)|((i<navPanel.sources.length-1)&(navPanel.node.type!="menuOption"))){
    div=document.createElement("div")
    div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
    div.setAttribute("aria-hidden", "true");
    li.appendChild(div)
  }
  //////////////////console.log(div)
  a=document.createElement("a")
  a.setAttribute("href", "#");
  if(property){
    a.setAttribute("class", "relative flex items-start group isDisabled");
  }else{
    a.setAttribute("class", "relative flex items-start group");
  }
  
  a.id=source["target"]["id"]+"_a"
  //////////////////console.log(a)
  span=document.createElement("span")
  span.setAttribute("class","h-9 flex items-center")
  
  span2=document.createElement("span")
  //////////////////console.log(span)
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
  //////////////////console.log(span2)
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
  //////////////////console.log(navPanel.ol)
  el1=navPanel.ol.appendChild(li)

  if(i<navPanel.sources.length-1){
      if(div!=undefined){
        el1.appendChild(div)
      }else{
        //////////////////console.log("undefined")
      }  
  }
  //////////////////console.log(el1)
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
    span5.innerHTML=  "   Sparql Endpoint(" + source["target"]["url"] + ")"
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
    el3.appendChild(span5)
  }else{
    span4.innerHTML = source["target"]["value"]
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
  }
  //////////////////console.log(el3)
}

navigationPanel.prototype.addEventsNav = function (){
  var navPanel=this;
  d3.selectAll("#navTable a").on("dblclick",function(){ 
    d3.event.preventDefault();
    //////////////////console.log("pasa por aquí")
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
  navPanel.numEnd=(navPanel.numLinesShown>navPanel.numTot) ? navPanel.numTot : navPanel.numLinesShown;
  navPanel.numCurrent=navPanel.numStart
  navPanel.contentRows=[]
  d3.selectAll("#modal-content table").remove()
  ////////////////////////console.log("pasa por aquí")
  ////////////////////console.log(navPanel.targets)
  //////console.log(navPanel.node)
  if (navPanel.targets.length>0){
    $("#dvTable").show()
    navPanel.table = document.createElement("table");
    navPanel.table.className="w-full divide-y divide-gray-200 table-auto"
  
    navPanel.thead=document.createElement("thead")
    navPanel.thead.className="bg-gray-50"
    var tr=document.createElement("tr")
    var th=document.createElement("th")
    th.setAttribute("colspan","3")
    th.setAttribute("scope","colgroup")
    th.setAttribute("class","px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider")
    if(navPanel.node["type"]=="menuOption"){
      menuOption=navPanel.node["value"].split(",")
      if(navPanel.node.class=="free"){
        labelFreeGraph()
      }else{
        labelBasicGraph()
      }
      
      th.innerHTML=searchHtml()
    }else{
      menuOption=navPanel.node["menuOption"]
      //////////console.log(navPanel.node["menuOption"])
      if(menuOption.split(";").length>1){
        th.innerHTML="Several options displayed in graph. Click on each option to see results values:";
      }else{
        menuOption=menuOption.split(",")
        ////////////////////////console.log(menuOption)
        if(navPanel.node.class=="free"){
          labelFreeGraph()
        }else{
          labelBasicGraph()
        }

        th.innerHTML=searchHtml()
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
    div2.className="inline-block min-w-full py-2 align-middle sm:px-2 lg:px-2"
    div3=document.createElement("div")    
    div3.className="overflow-auto border-b border-gray-200 shadow md:overflow-scroll sm:rounded-lg"

    navPanel.divPag=document.createElement("div")
    navPanel.divPag.className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-2"
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
    navPanel.prevNextVisibility()
    navPanel.addEventsContentNav()
  }else{
    /* $("#dvTable").hide()
    itemDetails() */
    if(navPanel.node.detail!=undefined){
      console.log(navPanel.node.detail)
      navPanel.showDetails()
    }
  }

  function labelFreeGraph(){
    label=`Sparql Endpoint: ` + menuOption[0]+ ` and Position: ` +menuOption[1]
  }
  function labelBasicGraph(){
    ////////////////////////console.log(menuOption)
    var exists;
    label=menuOption[0]
    ////////////////////////console.log(navPanel.node.class)
    ////////////////////////console.log()
    ////////////////////////console.log(configFile.filter(d=>d.class==navPanel.node.class)[0])
    if(label=="no options"){
      //////////////////////console.log(nodesClassesCorrespondence)
      //////////////////////console.log(navPanel.node.class)
      ////////////////////console.log(navPanel.node.class)
      if(configFile.filter(d=>d.class==navPanel.node.class)[0]){
        label=configFile.filter(d=>d.class==navPanel.node.class)[0]["option_text"]
      }else{
        const res = configFile.filter(function (x){
            ////////////////////console.log(x)
            if(x.hierarchy){
              exists=x.hierarchy.some(y => y.parent === navPanel.node.class)
            }
            //exists=x.hierarchy.some(y => y.parent === navPanel.node.class)
            ////////////////////console.log(exists)
            //////////////////////console.log(x)
          return exists
        })
        ////////////////////console.log(res) 
        label=res[0]["option_text"]
      }
      
    }else{
      ////////console.log(label)
      label=configFile.filter(d=>d.option==label)[0]["option_text"]
    }
    
  }
  function searchHtml(){
  var text=`<div>
          <label for="account-number" class="block text-sm font-medium text-gray-700">` + label + `</label>
          <div class="mt-1 relative rounded-md shadow-sm w-1/2 inline-block">
            <input type="text" name="nodeSearch" id="node-search" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 py-3 pl-3 sm:text-sm border-gray-300 rounded-md" placeholder="Find node...">
            <div class="absolute inset-y-0 right-0 pr-3 pt-3 flex items-top pointer-events-auto cursor-pointer inline-block">
              <svg class="h-5 w-5 text-gray-400 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" id="nav-search" onclick="navSearch()">
                <path fill-rule="evenodd" d="M21.7071068,20.2928932 C22.0976311,20.6834175 22.0976311,21.3165825 21.7071068,21.7071068 C21.3165825,22.0976311 20.6834175,22.0976311 20.2928932,21.7071068 L16.9056439,18.3198574 C15.5509601,19.3729184 13.8487115,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,13.8487115 19.3729184,15.5509601 18.3198574,16.9056439 L21.7071068,20.2928932 Z M12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 C8.6862915,6 6,8.6862915 6,12 C6,15.3137085 8.6862915,18 12,18 Z" clip-rule="evenodd" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="nav-delete" onclick="removeSelection()">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <button type="button" class="ml-5 py-2 px-3 font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hidden" id="remove-sel" onclick="removeSelection()">
            Remove selection
          </button>
          <button type="button" class="ml-5 py-2 px-3 font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hidden" id="add-sel-graph" onclick="addSelToGraph(this)">
            Add to graph
          </button>
        </div>`
    return text
  }
}

navigationPanel.prototype.showDetails = function (){
  var navPanel=this;
  $("#dvTable").hide()
  itemDetails()
  function itemDetails(){
    ////////console.log("itemDetails")
    let navDetailHeader,navDetailRow0,navDetailRow1;
    ////////console.log(navPanel.node)
    $("#dvDetails").empty()
    $.get("nav_detail.html", function (header) {
      $.get("nav_detail_row_0.html", function (row0) {
        $.get("nav_detail_row_1.html", function (row1) {
          $.get("nav_detail_row_attach.html", function (rowAttach) {

            navDetailHeader=header.replace("Title",navPanel.node["value"]).toUpperCase()
            ////////console.log(navDetailHeader)
            ////////console.log(navPanel.node)
/*             navPanel.node.detail.forEach(element => {
              ////////console.log(element)
            }) */
            $("#dvDetails").append($(navDetailHeader))
            //initMap()
            console.log(navPanel.node)
            if(navPanel.node.detail){
              Object.keys(navPanel.node.detail).forEach(key => {
                ////////console.log(key)
                if((key % 2 == 0)| (key == 0)){  
                  if(navPanel.node[navPanel.node.detail[key]["property"]]!=undefined){
                    ////////console.log(navPanel.node.detail[key])
                    navDetailRow0=row0.replace("Title",navPanel.node.detail[key]["text"].toUpperCase())
                    navDetailRow0=fieldItemDetails(navDetailRow0,navPanel.node[navPanel.node.detail[key]["property"]],navPanel.node.detail[key]["type"])
                    //navDetailRow0=navDetailRow0.replace("Content",navPanel.node[navPanel.node.detail[key]["property"]])
                    $("#dvDetails").append($(navDetailRow0))
                  }  
                }else{
                  if(navPanel.node[navPanel.node.detail[key]["property"]]!=undefined){
                    ////////console.log(navPanel.node.detail[key])
                    navDetailRow1=row1.replace("Title",navPanel.node.detail[key]["text"].toUpperCase())
                    navDetailRow1=fieldItemDetails(navDetailRow1,navPanel.node[navPanel.node.detail[key]["property"]],navPanel.node.detail[key]["type"])
                    $("#dvDetails").append($(navDetailRow1))
                  }
                }
                ////////console.log(navPanel.node.detail[key])
              })
            }

            
            //$("#dvDetails").append($(row0))

            //$('#dvTable').show();
            //appendHtmlOptions(optionsMenu)
            /* $("#options-menu").find("a").remove()
            optionsMenu.forEach(element => {
                html=optionsMenuHtml.replace("textTitle",element.option.trim()).replace("textComment",element.option_text.trim())
                $("#options-menu").append($(html))
            }); */
          });
        });
      });
    });
  }
  function fieldItemDetails(item,field,type){
    ////////console.log(item)
    ////////console.log(field)
    ////////console.log(type)
    if(type=="link"){
      item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field+'</a>')
    }else if(type=="telephone"){
        item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field.replace("tel:","") +'</a>')
    }else if(type=="email"){
      item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field.replace("mailto:","") +'</a>')
    }else if(type=="geojson"){
      //item=item.replace("Content",'<a href="' + "http://geojson.io/#data=data:text/x-url,"+encodeURIComponent(field)+'" target="_blank">'+field+'</a>')
      //////console.log(item)
      //////console.log(field)
      item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field+'</a>')
    }else{
      item=item.replace("Content",field)
      //item=item.replace("Content2","\n      <wrxml>\n        <description>&lt;p&gt;La política de seguridad alimentaria de la &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/eu_union.html&quot; target=&quot;_blank&quot;&gt;Unión Europea&lt;/a&gt; (UE) se rige principalmente por los artículos &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E168&quot; target=&quot;_blank&quot;&gt;168&lt;/a&gt; (salud pública) y &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E169&quot; target=&quot;_blank&quot;&gt;169&lt;/a&gt; (protección de los consumidores) del Tratado de Funcionamiento de la Unión Europea.&lt;/p&gt;&lt;p&gt;El objetivo de la política de seguridad alimentaria de la UE es proteger a los consumidores, al tiempo que se garantiza el buen funcionamiento del &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/internal_market.html&quot; target=&quot;_blank&quot;&gt;mercado interior&lt;/a&gt;. La legislación de la UE abarca toda la cadena alimentaria —«de la granja a la mesa»— de forma integrada y aplicando el concepto «Una sola salud».\xa0&lt;/p&gt;&lt;p&gt;Trata los aspectos de seguridad que abarcan la producción primaria, las condiciones de higiene en la elaboración de los alimentos, el envasado, el etiquetado y los controles oficiales sobre el cumplimiento de la normativa relativa a seguridad alimentaria.&lt;/p&gt;&lt;p&gt;La UE ha establecido determinadas normas para garantizar la higiene de los alimentos, la salud y el bienestar de los animales, la fitosanidad y la prevención de los riesgos de contaminación por sustancias externas, como por ejemplo los plaguicidas. Se realizan estrictas comprobaciones en cada fase, y las importaciones (por ejemplo, carne) procedentes de fuera de la UE deben cumplir las mismas normas y someterse a las mismas comprobaciones que los alimentos producidos en la UE.&lt;/p&gt;</description>\n      </wrxml>\n")
      //var parser = new DOMParser();
	    //var doc = parser.parseFromString("\n      <wrxml>\n        <description>&lt;p&gt;La política de seguridad alimentaria de la &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/eu_union.html&quot; target=&quot;_blank&quot;&gt;Unión Europea&lt;/a&gt; (UE) se rige principalmente por los artículos &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E168&quot; target=&quot;_blank&quot;&gt;168&lt;/a&gt; (salud pública) y &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E169&quot; target=&quot;_blank&quot;&gt;169&lt;/a&gt; (protección de los consumidores) del Tratado de Funcionamiento de la Unión Europea.&lt;/p&gt;&lt;p&gt;El objetivo de la política de seguridad alimentaria de la UE es proteger a los consumidores, al tiempo que se garantiza el buen funcionamiento del &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/internal_market.html&quot; target=&quot;_blank&quot;&gt;mercado interior&lt;/a&gt;. La legislación de la UE abarca toda la cadena alimentaria —«de la granja a la mesa»— de forma integrada y aplicando el concepto «Una sola salud».\xa0&lt;/p&gt;&lt;p&gt;Trata los aspectos de seguridad que abarcan la producción primaria, las condiciones de higiene en la elaboración de los alimentos, el envasado, el etiquetado y los controles oficiales sobre el cumplimiento de la normativa relativa a seguridad alimentaria.&lt;/p&gt;&lt;p&gt;La UE ha establecido determinadas normas para garantizar la higiene de los alimentos, la salud y el bienestar de los animales, la fitosanidad y la prevención de los riesgos de contaminación por sustancias externas, como por ejemplo los plaguicidas. Se realizan estrictas comprobaciones en cada fase, y las importaciones (por ejemplo, carne) procedentes de fuera de la UE deben cumplir las mismas normas y someterse a las mismas comprobaciones que los alimentos producidos en la UE.&lt;/p&gt;</description>\n      </wrxml>\n", 'text/html');
      //item=item.replace("Content",doc)
      //document.getElementById("testhtml").innerHTML="\n      <wrxml>\n        <description>&lt;p&gt;La política de seguridad alimentaria de la &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/eu_union.html&quot; target=&quot;_blank&quot;&gt;Unión Europea&lt;/a&gt; (UE) se rige principalmente por los artículos &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E168&quot; target=&quot;_blank&quot;&gt;168&lt;/a&gt; (salud pública) y &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E169&quot; target=&quot;_blank&quot;&gt;169&lt;/a&gt; (protección de los consumidores) del Tratado de Funcionamiento de la Unión Europea.&lt;/p&gt;&lt;p&gt;El objetivo de la política de seguridad alimentaria de la UE es proteger a los consumidores, al tiempo que se garantiza el buen funcionamiento del &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/internal_market.html&quot; target=&quot;_blank&quot;&gt;mercado interior&lt;/a&gt;. La legislación de la UE abarca toda la cadena alimentaria —«de la granja a la mesa»— de forma integrada y aplicando el concepto «Una sola salud».\xa0&lt;/p&gt;&lt;p&gt;Trata los aspectos de seguridad que abarcan la producción primaria, las condiciones de higiene en la elaboración de los alimentos, el envasado, el etiquetado y los controles oficiales sobre el cumplimiento de la normativa relativa a seguridad alimentaria.&lt;/p&gt;&lt;p&gt;La UE ha establecido determinadas normas para garantizar la higiene de los alimentos, la salud y el bienestar de los animales, la fitosanidad y la prevención de los riesgos de contaminación por sustancias externas, como por ejemplo los plaguicidas. Se realizan estrictas comprobaciones en cada fase, y las importaciones (por ejemplo, carne) procedentes de fuera de la UE deben cumplir las mismas normas y someterse a las mismas comprobaciones que los alimentos producidos en la UE.&lt;/p&gt;</description>\n      </wrxml>\n"
      //$("#testhtml").innerHTML("\n      <wrxml>\n        <description>&lt;p&gt;La política de seguridad alimentaria de la &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/eu_union.html&quot; target=&quot;_blank&quot;&gt;Unión Europea&lt;/a&gt; (UE) se rige principalmente por los artículos &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E168&quot; target=&quot;_blank&quot;&gt;168&lt;/a&gt; (salud pública) y &lt;a href=&quot;http://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016E169&quot; target=&quot;_blank&quot;&gt;169&lt;/a&gt; (protección de los consumidores) del Tratado de Funcionamiento de la Unión Europea.&lt;/p&gt;&lt;p&gt;El objetivo de la política de seguridad alimentaria de la UE es proteger a los consumidores, al tiempo que se garantiza el buen funcionamiento del &lt;a href=&quot;http://eur-lex.europa.eu/summary/glossary/internal_market.html&quot; target=&quot;_blank&quot;&gt;mercado interior&lt;/a&gt;. La legislación de la UE abarca toda la cadena alimentaria —«de la granja a la mesa»— de forma integrada y aplicando el concepto «Una sola salud».\xa0&lt;/p&gt;&lt;p&gt;Trata los aspectos de seguridad que abarcan la producción primaria, las condiciones de higiene en la elaboración de los alimentos, el envasado, el etiquetado y los controles oficiales sobre el cumplimiento de la normativa relativa a seguridad alimentaria.&lt;/p&gt;&lt;p&gt;La UE ha establecido determinadas normas para garantizar la higiene de los alimentos, la salud y el bienestar de los animales, la fitosanidad y la prevención de los riesgos de contaminación por sustancias externas, como por ejemplo los plaguicidas. Se realizan estrictas comprobaciones en cada fase, y las importaciones (por ejemplo, carne) procedentes de fuera de la UE deben cumplir las mismas normas y someterse a las mismas comprobaciones que los alimentos producidos en la UE.&lt;/p&gt;</description>\n      </wrxml>\n")
    }
    return item
    //<a href="url">link text</a>
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
/*         if(navPanel.numCurrent + maxPagesAfterCurrentPage >= navPanel.numPages){
          ////////////////////////////////////////console.log("mayor")
          ////////////////////////////////////////console.log(navPanel.numCurrent + maxPagesAfterCurrentPage)
        }else{
          ////////////////////////////////////////console.log("menor")
          ////////////////////////////////////////console.log(navPanel.numCurrent + maxPagesAfterCurrentPage)
        } */
        if (navPanel.numCurrent <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = navPanel.paginationLimit;
        } else if (navPanel.numCurrent + maxPagesAfterCurrentPage >= navPanel.numPages) {
            // current page near the end
            startPage = navPanel.numPages - navPanel.paginationLimit + 1;
            endPage = navPanel.numPages;
        } else {
            // current page somewhere in the middle
            startPage = navPanel.numCurrent - maxPagesBeforeCurrentPage;
            endPage = navPanel.numCurrent + maxPagesAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    let startIndex = ((navPanel.numCurrent - 1) * navPanel.numLinesShown)+1;
    let endIndex = Math.min(startIndex + navPanel.numLinesShown - 1, navPanel.numTot);
    
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
  navPanel.numPages=Math.ceil(navPanel.numTot/navPanel.numLinesShown)
  navPanel.arrNumberPages=[]
  navPanel.paginationLimit=10

  navPanel.pages = navPanel.paginationNumbers()

  pagePrev = document.getElementById('page-prev');

  for (i=0;i<=navPanel.pages.pages.length-1;i++) {
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
}

function showLines(numCurrent,type){
  //////////////////////console.log(numCurrent)
  var div=$("#modal-content tbody td div")[0]
  if(div.classList.contains("hidden")){
    navigation.showLines(numCurrent,false,false)
  }else{
    navigation.showLines(numCurrent,false,true)
  }
  navigation.addEventsContentNav()
}
function removeLinesNavContent(){
  var sel=document.querySelectorAll("#dvTable tbody tr")
  if(sel.length>0){
    sel.forEach(
      function(currentValue, currentIndex, listObj) {
        currentValue.remove()
      }
    )
  }
}
navigationPanel.prototype.prevNextVisibility = function (){
  var navPanel=this
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
navigationPanel.prototype.showLines = function (numCurrent,first,cluster){
  var navPanel=this,linesShown,numPagesElements;
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
  
  removeLinesNavContent()

  if(!first){
    numPagesElements = document.querySelectorAll('#div-pagination .num-page');
    numPagesElements.forEach(function(el){
      el.remove()
    })
    navPanel.showNumberPages()
    document.getElementById("numStart").textContent=navPanel.pages.startIndex
    document.getElementById("numEnd").textContent=navPanel.pages.endIndex
    document.getElementById("numTot").textContent=navPanel.numTot

    navPanel.prevNextVisibility()


  }
  
  if(first){
    linesShown=navPanel.targets.slice(navPanel.firstPage - 1, navPanel.numLinesShown);
  }else{
    linesShown=navPanel.targets.slice(navPanel.pages.startIndex - 1, navPanel.pages.endIndex);
  }
  
  if(cluster){
    $("#add-sel-graph").show()
  }
  for (var i = 0; i < linesShown.length; i++) {
    row = navPanel.tbody.insertRow(-1);
    row.id=linesShown[i]["target"]["id"]+"_row"
    navPanel.contentRows.push(row)
    if(linesShown[i]["target"]["class"]=="free"){
      if(cluster){
        navPanel.addElementContentTableProp(linesShown[i],i,cluster)
      }else{
        navPanel.addElementContentTableProp(linesShown[i],i)
      }
      
    }else{
      navPanel.addElementContentTable(linesShown[i],i)
    }
  }
}

navigationPanel.prototype.addEventsContentNav = function (){
  var navPanel=this,cell,nodeSearchField,node,checkboxes;
  navPanel.isDblclick = false;

  navPanel.searchValues=navPanel.targets.map(d=>d.target.value)

/*   checkboxes=document.getElementsByClassName("cluster-check")
  for (let item of checkboxes) {
    item.addEventListener("onclick",function(){
      //////////////////////console.log(this)
      //////////////////////console.log("checked")
    })
  }; */
  nodeSearchField=document.getElementById("node-search")
  if(nodeSearchField){
    autocomplete(nodeSearchField, navPanel.searchValues);

    // Execute a function when the user releases a key on the keyboard
      nodeSearchField.addEventListener("keyup", function(event) {
      if (event.key === 'Enter' ) {
        // Cancel the default action, if needed
        event.preventDefault();
        /* removeLinesNavContent()
        if(navPanel.targetsBackup){
          navPanel.resultsSearch = navPanel.targetsBackup.filter(a =>(a.target.value.includes(nodeSearchField.value)|(a.target.value==nodeSearchField.value)));
        }else{
          navPanel.resultsSearch = navPanel.targets.filter(a =>a.target.value.includes(nodeSearchField.value));
          navPanel.targetsBackup=navPanel.targets
        }
        
        navPanel.targets=navPanel.resultsSearch
        navPanel.contentTableSearch() */
        navPanel.valueSelected()
        //navPanel.addEventsContentNav()
        closeAllLists()
    
      }else{
        if(this.value==""){
          $("#nav-search").addClass("hidden")
          //$("#nav-delete").hide()
        }else{
          //$("#nav-delete").show()
          $("#nav-search").removeClass("hidden")
        }
      }
      });
  }


  navPanel.timeoutTiming = 500;
  d3.selectAll("#modal-content td").on("dblclick",function(){ 
    //////////////////////console.log("dblclick")
    $("#dvDetails").empty()
    node=d3.select("#"+this.getAttribute("id")).data()[0]
    d3.event.preventDefault();
    navPanel.isDblclick = true;
    clearTimeout(navPanel.dblclickTimeout);
    navPanel.dblclickTimeout = setTimeout(function () {
      navPanel.isDblclick = false;
    }, navPanel.timeoutTiming);

    if(this.getAttribute("cluster")){
      dblclickCellCluster(node)
    }else{
      node=d3.select("#"+this.getAttribute("id")).data()[0]
      if(node.more_results){
        if(node.more_results.length>0){
          navPanel.dblclickCellCluster(node)
        }else{
          dblclickCellContent(this)
        }
      }else{
        dblclickCellContent(this)
      }
      
    }

    return false;
  })
  .on("click",function(){  
    cell=this;
    $("#dvDetails").empty()
    //////console.log(cell)
    clearTimeout(navPanel.clickTimeout);
    //if(navPanel.node.detail!=undefined){
    //  navPanel.showDetails()
    //}
/*     navPanel.clickTimeout = setTimeout(function () {
      if(!navPanel.isDblclick) {
        // here goes your click codes
        dblclickCellContent(cell)
      }
    }, navPanel.timeoutTiming); */
  })
  
}
navigationPanel.prototype.valueSelected=function(){
  var navPanel=this;
  nodeSearchField=document.getElementById("node-search")
  removeLinesNavContent()
  //////////////////////console.log(navPanel.targets)
  //////////////////////console.log(nodeSearchField.value)
  if(navPanel.targetsBackup){
    navPanel.resultsSearch = navPanel.targetsBackup.filter(a =>(a.target.value.toUpperCase().includes(nodeSearchField.value.toUpperCase())|(a.target.value.toUpperCase()==nodeSearchField.value.toUpperCase())));
  }else{
    navPanel.resultsSearch = navPanel.targets.filter(a =>a.target.value.toUpperCase().includes(nodeSearchField.value.toUpperCase()));
    navPanel.targetsBackup=navPanel.targets
  }
  //////////////////////console.log(navPanel.resultsSearch)
  navPanel.targets=navPanel.resultsSearch
  navPanel.contentTableSearch()
  $("#nav-search").addClass("hidden")
  $("#nav-delete").removeClass("hidden")
  navPanel.addEventsContentNav()
}
navigationPanel.prototype.addElementContentTable = function (target,i){
  var navPanel=this;
  if(target["class"]=="free"){
    addFreeGraph()
  }else{
    addBasicGraph()
  }

  
  function addBasicGraph(){
    row = navPanel.tbody.insertRow(-1);
    
    cell = row.insertCell(-1);
    cell.className="px-2 py-4 whitespace-nowrap"
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
  cell.className="px-2 py-4 whitespace-nowrap"
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
  div2.className="flex-shrink-0 w-5 h-5"
  img=document.createElement("img")
  
  if(!property){
      if(nodesTable[i]["target"]["type"]=="uri"){
          img.className="w-5 h-5 bg-green-300 rounded-full"
        }else if(nodesTable[i]["target"]["type"]=="bnode"){
          img.className="w-5 h-5 bg-yellow-300 rounded-full"
        }else if(nodesTable[i]["target"]["type"]=="menuOption"){
          img.className="w-5 h-5 bg-blue-300 rounded-full"
        }else{
          img.className="w-5 h-5 bg-pink-300 rounded-full"
      }
      
  }else{
      img.className="w-5 h-5 bg-gray-300 rounded-full"
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

function addElChecked(el){
  //////////////////////console.log(el)
  navigation.addElChecked(el)
}
navigationPanel.prototype.addElChecked = function (el){
  var navPanel=this;
  if(el.checked){
    navPanel.clusterElSelected.push(el.getAttribute("id"))
  }else{
    navPanel.clusterElSelected.splice(navPanel.clusterElSelected.indexOf(el.getAttribute("id")), 1);
  }
  //////////////////////console.log(navPanel.clusterElSelected)
}
navigationPanel.prototype.addElementContentTableProp = function (target,i,cluster){
  var navPanel=this;
  insertCheckBox()
  insertContent(true)
  insertContent(false)
  function insertCheckBox(){
    cell = row.insertCell(-1);
    cell.className="px-2 py-4 whitespace-nowrap"
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
    input.className="form-checkbox cluster-check"
    input.setAttribute("onclick","addElChecked(this);");
    cell.appendChild(div).appendChild(input)
    
  }
  
  function insertContent(property){
    var menuOption;
    cell = row.insertCell(-1);
    cell.className="px-2 py-4 whitespace-nowrap"
    if(cluster){
      cell.setAttribute("cluster",cluster)
    }
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
    div2.className="flex-shrink-0 w-5 h-5"
    img=document.createElement("img")
    
    if(!property){
        if(target["target"]["type"]=="uri"){
            img.className="w-5 h-5 bg-green-300 rounded-full"
          }else if(target["target"]["type"]=="bnode"){
            img.className="w-5 h-5 bg-yellow-300 rounded-full"
          }else if(target["target"]["type"]=="menuOption"){
            img.className="w-5 h-5 bg-blue-300 rounded-full"
          }else{
            img.className="w-5 h-5 bg-pink-300 rounded-full"
        }
        
    }else{
        img.className="w-5 h-5 bg-gray-300 rounded-full"
    }
  
    div3=document.createElement("div")
    div3.className="relative ml-4"
    div4=document.createElement("div")
    div4.className="relative text-xs font-medium text-gray-900"
    if(!property){
        a=document.createElement("a")
        a.setAttribute("href", "#");
        if((target["target"]["type"]!="bnode")&(target["target"]["type"]!="uri")&(target["target"]["type"]!="menuOption")){
          a.setAttribute("class", "relative flex items-start group isDisabled");
        }else{
          a.setAttribute("class", "relative flex items-start group");
        }
        
        span=document.createElement("span")
        //span.className="text-sm"
        if(target["target"]["type"]=="menuOption"){
          menuOption=target["target"]["value"].split(",")
          newText = document.createTextNode("Sparql Endpoint: "+ menuOption[0]+ "and Position: "+menuOption[1]);
        }else{
          newText =document.createTextNode(target["target"]["value"]);
        }
        
        div4.appendChild(a).appendChild(span).appendChild(newText);
    }else{
        span=document.createElement("span")
        //span.className="text-sm"
        if(target["value"]!=undefined){
          newText = document.createTextNode(target["value"]);
        }else{
          newText = document.createTextNode("no property");
        }
        
        div4.appendChild(span).appendChild(newText);
    }
        
    el1=cell.appendChild(div)
    el1.appendChild(div2).appendChild(img)
    el1.appendChild(div3).appendChild(div4)
  }
  }
  function dblclickCellCluster(el){
    navigation.dblclickCellCluster(el)
  }
  navigationPanel.prototype.dblclickCellCluster = async function (cell) {
    var navPanel=this,results;
    results=cell.more_results
    
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
          "id":d.s.id,"type":d.o.type,"class":"free"},
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
          "id":d.s.id,"type":d.s.type,"class":"free"},
          "source":{"id":cell["id"]},
          "value":cell["property"],
          "url":cell["url"],
          "subject-object":cell["subject-object"]
        }
      })
    }
    navPanel.pages.endIndex=navPanel.targets.length
    navPanel.numTot=navPanel.targets.length
    navPanel.showLines(1,false,cell["id"])
    navPanel.addEventsContentNav()
  }
navigationPanel.prototype.dblclickCellContent = async function (cell) {
  var navPanel=this,indexRows=1,bubble,node;

  if(cell instanceof Element){
    bubble=d3.select("#"+cell.getAttribute("id")).data()[0]
  }else{
    bubble=cell
  }
  if(bubble){
    if(bubble.class=="free"){
      freeGraph()
    }else{
      //throw new Error("Something went badly wrong!");
      basicGraph()
    }
  }

  function searchMenuOptionChild(){
    return (networkGraph.treeData.filter(d=>d.id==node["id"])[0]["children"].filter(v=>v.value==indexRows[0].url+","+indexRows[0]["subject-object"])[0])
  }
  async function basicGraph(){
    var element=document.getElementById(cell.getAttribute("id"));
    ////console.log(element)
    ////////////////////console.log(element)
    ////////////////////console.log(bubble)
    //////////////////////console.log("dblclick basic graph")
    //////////////////////console.log(d3.select("#"+element.getAttribute("id")).data()[0])
    
    if(configFile.filter(v=>v.class==nodesClassesCorrespondence[get_node_from_element(element.getAttribute("id"))["class"]])[0]){
      ////console.log("if")
      if(configFile.filter(v=>v.class==nodesClassesCorrespondence[get_node_from_element(element.getAttribute("id"))["class"]])[0]["type"]=="WEBPAGE"){
        modal2=getModal2()
        ////////////////////console.log("entra")
        showWebPage(get_node_from_element(element.getAttribute("id"))[Object.keys(get_property_names(configFile.filter(v=>v.class==nodesClassesCorrespondence[get_node_from_element(element.getAttribute("id"))["class"]])[0]["properties"]))[0]],get_node_from_element(element.getAttribute("id"))["value"],modal2.modalHeader,modal2.modalContent)
        //return false
      }else{
        indexRows=await networkGraph.wrangleData(element,"table");
        //////console.log(indexRows)
        //throw new Error("Something went badly wrong!");
        //////////////////console.log(indexRows[0]["position"])
        //////////////////console.log(element)
        //throw new Error("Something went badly wrong!");
        //buildBasicGraph(indexRows[0]["position"],element,undefined)
/*         if (indexRows.length<2){
          unclickBubbleFreeGraph()
          ////console.log("if")
          clickBubbleFreeGraph(element,networkGraph.data)
          d3.select("#"+row.getAttribute("id"))
          .attr("stroke", "yellow")
          .attr("stroke-width", "6px");
        }else{
          ////console.log("else")
          node=d3.select("#"+element.getAttribute("id")).data()[0]
          //////////////////////console.log("addMenuToTable")
          addMenuToTable(node,indexRows)
        } */
      }
    }else{
      ////console.log("else")
      indexRows=await networkGraph.wrangleData(element,"table");
      //////console.log(d3.select("#"+element.getAttribute("id")).data())
      ////console.log(d3.select("#"+element.getAttribute("id")).data()[0]["children"])
      if(d3.select("#"+element.getAttribute("id")).data()[0]["children"]){
        ////console.log("children")
      }
      //////console.log(cell)
      //////console.log(indexRows)
/*       if (indexRows.length<2){
        ////console.log("if")
        unclickBubbleFreeGraph()
  
        clickBubbleFreeGraph(element,networkGraph.data)
        d3.select("#"+row.getAttribute("id"))
        .attr("stroke", "yellow")
        .attr("stroke-width", "6px");
      }else{
        ////console.log("else")
        node=d3.select("#"+element.getAttribute("id")).data()[0]
        //////////////////////console.log("addMenuToTable")
        addMenuToTable(node,indexRows)
      } */
    }
    //console.log(indexRows)
    //console.log(d3.select("#"+element.getAttribute("id")).data()[0])
    if((indexRows.length==0)&(d3.select("#"+element.getAttribute("id")).data()[0]["children"]==undefined)){
      //console.log("es el caso")
      if(d3.select("#"+element.getAttribute("id")).data()[0].detail!=undefined){
        //navPanel.node=d3.select("#"+element.getAttribute("id")).data()[0]
        clickBubbleFreeGraph(element,networkGraph.data)
      }
    }
  }
  async function freeGraph(){
      indexRows=await networkGraph.wrangleData(cell,"table");
      if(indexRows.length==0){
        unclickBubbleFreeGraph()
        bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
        clickBubbleFreeGraph(bubble,networkGraph.data)
        d3.select("#"+row.getAttribute("id"))
        .attr("stroke", "yellow")
        .attr("stroke-width", "6px");
      }else if (indexRows.length==1){
        unclickBubbleFreeGraph()
        node=d3.select("#"+cell.getAttribute("id")).data()[0]
        if(node["menuOption"].split(";").length>1){
          bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
        }else{
          bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
        }
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
  //////////////////console.log(cell)
  bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","").replace("_li","")))
  //unclickBubbleFreeGraph()
  //////////////////console.log(bubble)
  $("#dvDetails").empty()
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
  ////console.log("addMenuToTable method")
  d3.selectAll(".menu-table").remove()
  //////////////////////console.log("entra en navigation")
  var rowIndex=$('#myModal #'+ (node["id"]+"_row"))[0].rowIndex;

  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

  for (var i = 0; i < menuItems.length; i++) {
      //////////////////////console.log(menuItems[i])
      newRow = tbodyRef.insertRow(rowIndex+i);
      newRow.id="menu-table-"+ node.id + "-" + [i]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();
      newCell.className="px-2 py-4 bg-gray-100 whitespace-nowrap"
      newCell.setAttribute("colspan","3")
      newCell.setAttribute("x-data","{ tooltip: false }")

      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      a.setAttribute("x-on:mouseenter","tooltip = true")
      a.setAttribute("x-on:mouseleave","tooltip = false")

      div=document.createElement("div")
      div.setAttribute("x-show","tooltip")
      div.setAttribute("class","z-50 absolute text-xs bg-blue-300 border-graphite border-2 rounded p-4 mt-1")
      if(menuItems[i]["subject-object"]=="s"){
        textTooltip="Find all objects for the URI :" + d3.select("#"+node.id).data()[0].value + " in the SPARQL EndPoint: "+menuItems[i]["url"]
      }else{
        textTooltip="Find all subjects for the URI :" + d3.select("#"+node.id).data()[0].value + " in the SPARQL EndPoint: "+menuItems[i]["url"]
      }
      textNode = document.createTextNode (textTooltip);

      span=document.createElement("span")
      span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
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
navigationPanel.prototype.clickMenuTable = async function (form,node){
  var propertyEl,bubble;
  var navPanel=this;
  var newForm={"url":form["new_url"],"uri":node["value"],"subject-object":form["new_subjectObject"]}
  propertyEl=form["property"]

  var form={"url":form["url"],"uri":node["value"],"subject-object":form["subjectObject"]}

  await buildFreeGraph(newForm,"table",node)

  if(node["menuOption"].split(";").length>1){
    bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
  }else{
    bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+node.id)
  }
  clickBubbleFreeGraph(bubble,networkGraph.data)

function searchMenuOptionChild(){
  return (networkGraph.treeData.filter(d=>d.id==node["id"])[0]["children"].filter(v=>v.value==newForm.url+","+newForm["subject-object"])[0])
}
}

function removeSelection(){
  navigation.removeSelection()
}
navigationPanel.prototype.removeSelection = function (){
  var navPanel=this;

  navPanel.targets=navPanel.targetsBackup

  navPanel.contentTableSearch()
  $("#nav-delete").addClass("hidden")
  $("#node-search").val("")
}
function addSelToGraph(element){
  navigation.addSelToGraph()
}
navigationPanel.prototype.addSelToGraph = function (){
  var navPanel=this,selected=[],results,form,parent,configRow,children=[],clusterNode;
  //var $boxes = $('input[name=nodeTable]:checked');
  //////////////////////console.log(navPanel.clusterElSelected)
  ////////////////console.log(navPanel.clusterElSelected[0])
  ////////////////console.log((navPanel.clusterElSelected[0].replace("_check","")))
  ////////////////console.log(document.getElementById((navPanel.clusterElSelected[0].replace("_check",""))))
  //d3.select("#"+document.getElementById(navPanel.clusterElSelected[0].replace("_check","")).getAttribute("cluster"))
  var node=d3.select("#"+document.getElementById(navPanel.clusterElSelected[0].replace("_check","")).getAttribute("cluster")).data()[0]
  for (var i = 0; i < navPanel.clusterElSelected.length; i++) {
    selected.push(document.getElementById(navPanel.clusterElSelected[i].replace("_check","")).querySelector("a span").innerText)
  };
  //////////////////////console.log(networkGraph.treeData)
  //////////////////////console.log(networkGraph.data)
  //////////////////////console.log(node)
  if(node["subject-object"]=="s"){
    results=node["more_results"].filter(d=>selected.includes(d.o.value))
  }else if(node["subject-object"]=="o"){
    results=node["more_results"].filter(d=>selected.includes(d.s.value))
  }
  form={"uri":node["uri"],"url":node["url"],"subject-object":node["subject-object"]}
  getChildren()
  //////////////////////console.log(children)
  for (var i = 0; i < networkGraph.treeData.length; i++) {
    parent=networkGraph.treeData[i]["children"].filter(d=>d.id==node.id)
    if(parent.length>0){
      //value
      //more_results
      //navPanel.clusterElSelected.splice(navPanel.clusterElSelected.indexOf(el.getAttribute("id")), 1);
      //const filteredItems = networkGraph.treeData[i]["children"].filter(item => Boolean(item.more_results))
      const indexMoreResults = networkGraph.treeData[i]["children"].findIndex(item => Boolean(item.more_results))
      for (var j = 0; j < selected.length; j++) {
        //////////////////////console.log(selected[j])
        //////////////////////console.log(networkGraph.treeData[i]["children"][indexMoreResults]["more_results"])
        networkGraph.treeData[i]["children"][indexMoreResults]["more_results"].splice(networkGraph.treeData[i]["children"][indexMoreResults]["more_results"].indexOf(selected[j]),1)
      }
      networkGraph.treeData[i]["children"][indexMoreResults]["value"]=parseInt(networkGraph.treeData[i]["children"][indexMoreResults]["value"].split(" ")[0])-selected.length + " results"
      networkGraph.treeData[i]["children"]=networkGraph.treeData[i]["children"].concat(children)
      ////////////////////console.log(networkGraph.treeData[i])
      clusterNode=networkGraph.treeData[i]
      break;
    }
    
  }
  ////////////////console.log(clusterNode)
  //////////////////////console.log(parent)
  //////////////////////console.log(selected)
  //////////////////////console.log(node)
  //////////////////////console.log(results)
  //////////////////////console.log(networkGraph.treeData)
  //////////////////////console.log(networkGraph.data)
  
  //addNodesGraph(results,parent[0],form)
  networkGraph.data = flatten_freeGraph(networkGraph.treeData).flatData
  networkGraph.allData.nodes = networkGraph.data.nodes
  networkGraph.allData.links = networkGraph.data.links
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.enterGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.exitGraph()
  //////////////////////console.log(clusterNode)
  clickBubbleFreeGraph(document.getElementById(clusterNode.id),networkGraph.data)
  navPanel.clusterElSelected=[]
  
  function getChildren(){
    results.forEach(r => {
      if (form["subject-object"] == "s") {
        if (r["o"]["more_results"]) {
          more_results = r["o"]["more_results"]
        } else {
          more_results = ""
        }
        if (r["o"]["configRow"]) {
          configRow = r["o"]["configRow"]
        } else {
          configRow = ""
        }
        children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
      } else if (form["subject-object"] == "o") {
        if (r["s"]["more_results"]) {
          more_results = r["s"]["more_results"]
        } else {
          more_results = ""
        }
        if (r["s"]["configRow"]) {
          configRow = r["s"]["configRow"]
        } else {
          configRow = ""
        }
        children.push({ "id": genRandomString(), "value": r["s"]["value"], "type": r["s"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
      } 
    })
  }

}
function addMenuToTable(node,menuItems){
  var newText,newCell,element,newRow,span,div,textNode,textTooltip
  ////console.log("entra addçmenuToTable")
  d3.selectAll(".menu-table").remove()
  //////////////////////console.log(node["id"])
  //////////////////////console.log($('#myModal #'+ node["id"]).parent()[0].rowIndex)
  var rowIndex=$('#myModal #'+ node["id"]).parent()[0].rowIndex
  //var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex;
  //////////////////////console.log(rowIndex)
  var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];
  //////////////////////console.log("entra en la function addMenutottalbe")
  for (var i = 0; i < menuItems.length; i++) {
      newRow = tbodyRef.insertRow(rowIndex+i);
      newRow.id="menu-table-"+menuItems[i]["position"]
      newRow.className = 'menu-table';
      newCell = newRow.insertCell();
      newCell.className="px-2 py-4 bg-gray-100 whitespace-nowrap"
      newCell.setAttribute("x-data","{ tooltip: false }")
      // Append a text node to the cell
      a=document.createElement("a")
      a.setAttribute("href", "#");
      a.setAttribute("class", "relative flex items-start group");
      a.setAttribute("x-on:mouseenter","tooltip = true")
      a.setAttribute("x-on:mouseleave","tooltip = false")

      div=document.createElement("div")
      div.setAttribute("x-show","tooltip")
      div.setAttribute("class","z-50 absolute bg-indigo-300 border-graphite border-2 rounded p-4 mt-1")
              
      textNode = document.createTextNode (getCommentOption(menuItems[i]["option"]));
      
      span=document.createElement("span")
      span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
      newText = document.createTextNode(menuItems[i]["option"]);
      newCell.appendChild(a).appendChild(span).appendChild(newText);
      newCell.appendChild(div).appendChild(textNode)
      
      d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("dblclick",function(){  

        clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
      })
  }
}
async function clickMenuTable(position,node){
  var element=document.getElementById(node["id"])
  await buildBasicGraph(position,node)
  unclickBubbleFreeGraph()
  clickBubbleFreeGraph(element,networkGraph.data)
}
function showHideNavigation(){
  ////////////////////////console.log("checkbox")
  //////////////////////console.log(document.getElementById("show-nav").checked)
/*   if(document.getElementById("show-nav").checked){
    document.getElementById("show-nav").checked = false;
    showNavigation=false
  }else{
    document.getElementById("show-nav").checked = true;
    showNavigation=true
  } */
  if(document.getElementById("show-nav").checked){
    showNavigation=true
  }else{
    showNavigation=false
  }
}
function navSearch(){
  navigation.valueSelected()
}
