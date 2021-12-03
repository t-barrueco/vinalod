navigation = function ( _type,_node) {
    this.type = _type;
    this.node = _node
    this.init();
  };
   
navigation.prototype.init = function () {
  var navPanel=this;
  navPanel.imageArrowUp="images/arrow-up.svg"
  navPanel.imageArrowDown="images/arrow-down.svg"
  navPanel.node=networkGraph.rootNode
  //console.log(networkGraph.rootNode)
  navPanel.element=document.getElementById(navPanel.node.id)
  navPanel.getNodes()
  navPanel.initModal()
  navPanel.navTableTable()
  navPanel.contentTable()
  //////console.log("entra")
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
  //navPanel.modal=document.getElementById("myModal")
  //navPanel.modal.style.display = "block";
  $("#myModal").addClass("translate-x-0")
  $("#myModal").removeClass("translate-x-full")
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
        //////console.log(d)
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

navigation.prototype.addElementNav = function (source,i){
  var navPanel=this;
  var li=document.createElement("li")
  li.setAttribute("class", "relative pb-10");
  li.id=source["id"]+"_li"

  if(i<navPanel.sources.length-1){
      ////console.log("element nav")
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
  //////console.log(source["type"])
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

navigation.prototype.addElementNavProp = function (source,i,property){
  var li=document.createElement("li")
  var div,a,li,span,span2,el1
  var navPanel=this;
  li.setAttribute("class", "relative pb-10");
  li.id=source["target"]["id"]+"_li"

  ////console.log(source)
  ////console.log(navPanel.sources.length)
  ////console.log(i)
  ////console.log(property)
  ////console.log(source["target"]["menuOption"])
  ////console.log(navPanel.node)
/*   if(source["target"]["type"]!="menuOption"){
    
  } */
/*   if(source["target"]["menuOption"]){
    ////console.log("entra en source target menuOption")
    if(property){
      ////console.log("entra en property")
      div=document.createElement("div")
      div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
      div.setAttribute("aria-hidden", "true");
      li.appendChild(div)
    }else if((source["target"]["menuOption"].split(";").length<2)&(i<navPanel.sources.length-1)){
      ////console.log("entra en el largo")
      //if(i<navPanel.sources.length-1){
        div=document.createElement("div")
        div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
        div.setAttribute("aria-hidden", "true");
        li.appendChild(div)
      }
  }else if((property)|(i<navPanel.sources.length-1)){
    ////console.log("el de por descarte")
    div=document.createElement("div")
    div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
    div.setAttribute("aria-hidden", "true");
    li.appendChild(div)
  } */
  //if((property)|((i<navPanel.sources.length-1)&(navPanel.node.type!="menuOption"))){
  if((property)|((i<navPanel.sources.length-1)&(navPanel.node.type!="menuOption"))){
  //if((property)|((i<navPanel.sources.length-1)&(navPanel.node.type!="menuOption"))|(navPanel.node.type=="menuOption")){
    ////console.log("el de por descarte")
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

  ////console.log(el1)
  if(i<navPanel.sources.length-1){
      ////console.log(div)
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
    //////console.log(source)
    span5.innerHTML=  "   Sparql Endpoint(" + source["target"]["url"] + ")"
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
    el3.appendChild(span5)
  }else{
    span4.innerHTML = source["target"]["value"]
    el3=el2.appendChild(span3)
    el3.appendChild(span4)
  }
  ////console.log(el3)
}

/* navigation.prototype.addLineElementNav = function (li){
  var navPanel=this;
  var div=document.createElement("div")
  div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
  div.setAttribute("aria-hidden", "true");
  li.appendChild(div)
} */

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
  var menuOption;
  navPanel.numStart=1
  navPanel.numTot=navPanel.targets.length
  navPanel.numLinesShown=10
  navPanel.numEnd=navPanel.numLinesShown
  navPanel.numCurrent=navPanel.numStart
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
    if(navPanel.node["type"]=="menuOption"){
      menuOption=navPanel.node["value"].split(",")
      th.innerHTML=`<div>
      <label for="account-number" class="block text-sm font-medium text-gray-700"> Sparql Endpoint: ` + menuOption[0]+ ` and Position: ` +menuOption[1] + `</label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <input type="text" name="account-number" id="account-number" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="000-00-0000">
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <!-- Heroicon name: solid/question-mark-circle -->
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M21.7071068,20.2928932 C22.0976311,20.6834175 22.0976311,21.3165825 21.7071068,21.7071068 C21.3165825,22.0976311 20.6834175,22.0976311 20.2928932,21.7071068 L16.9056439,18.3198574 C15.5509601,19.3729184 13.8487115,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,13.8487115 19.3729184,15.5509601 18.3198574,16.9056439 L21.7071068,20.2928932 Z M12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 C8.6862915,6 6,8.6862915 6,12 C6,15.3137085 8.6862915,18 12,18 Z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      </div>`
    }else{
      ////console.log(navPanel.node)
      menuOption=navPanel.node["menuOption"]
      if(menuOption.split(";").length>1){
        //menuOption=navPanel.node["menuOption"].split(",")
        th.innerHTML="Several options displayed in graph. Click on each option to see results values:";
      }else{
        menuOption=menuOption.split(",")
        th.innerHTML=`<div>
        <label for="account-number" class="block text-sm font-medium text-gray-700"> Sparql Endpoint: ` + menuOption[0]+ ` and Position: ` +menuOption[1] + `</label>
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
/*         th.innerHTML=`<div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <!-- Heroicon name: solid/mail -->
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input type="email" name="email" id="email" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="you@example.com">
        </div>
      </div>` */
      }
     
      //th.innerHTML=navPanel.node["value"]
    }
    
    
    navPanel.thead.appendChild(tr).appendChild(th)
    navPanel.tbody=document.createElement("tbody")
    navPanel.tbody.className="bg-white divide-y divide-gray-200"

    
/*     for (var i = 0; i < navPanel.targets.length; i++) {
      row = navPanel.tbody.insertRow(-1);
      row.id=navPanel.targets[i]["target"]["id"]+"_row"
      navPanel.contentRows.push(row)
      if(navPanel.type=="freeGraph"){
        navPanel.addElementContentTableProp(navPanel.targets[i],i)
      }else{
        navPanel.addElementContentTable(navPanel.targets[i],i)
      }
    } */
    console.log(navPanel.numCurrent)
    navPanel.showLines(navPanel.numCurrent)

    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
  
    div=document.createElement("div")    
    div.className="flex flex-col"
    div2=document.createElement("div")    
    div2.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
    div3=document.createElement("div")    
    div3.className="overflow-auto border-b border-gray-200 shadow md:overflow-scroll sm:rounded-lg"

    divPag=document.createElement("div")
    divPag.className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
    divPag.id="div-pagination"
    divPag.innerHTML=`<div class="flex-1 flex justify-between sm:hidden">
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
            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" id="page-prev">
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: solid/chevron-left -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </a>
            <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->`
    navPanel.showPageNumbers()
    divPag.innerHTML +=`<a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" id="page-next">
              <span class="sr-only">Next</span>
              <!-- Heroicon name: solid/chevron-right -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      </div>`
    
    navPanel.fullTable=dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(navPanel.table)
    navPanel.fullTable.appendChild(navPanel.thead)
    navPanel.fullTable.appendChild(navPanel.tbody); 
    dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(divPag);
    
    navPanel.addEventsContentNav()
  }

  
}
navigation.prototype.showPageNumbers = function (){
  //function showPageNumbers(){
    var navPanel=this,pagePrev,textHtml=""
    var numPages=Math.ceil(navPanel.numTot/navPanel.numLinesShown)
    console.log(numPages)
    console.log(navPanel.numCurrent)
    console.log(document.querySelectorAll('[aria-label="Pagination"]'))
    console.log(document.querySelectorAll('#div-pagination .num-page'))
    var numPagesElements = document.querySelectorAll('#div-pagination .num-page');
    console.log(numPagesElements)
    if(numPagesElements.length>0){
      numPagesElements.forEach(function(el){
        el.remove()
      })
      pagePrev = document.getElementById('page-prev');
      for (i=1;i<=numPages-1;i++) {
        if(i==navPanel.numCurrent){
          textHtml +=`<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page">`+ i + `</a>`
        }else{
          textHtml +=`<a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page" onClick="showLines(this.textContent)">`
          + i + `</a>`
        }
      }
      pagePrev.insertAdjacentHTML('afterend', textHtml);
    }else{
      for (i=1;i<=numPages-1;i++) {
        if(i==navPanel.numCurrent){
          divPag.innerHTML +=`<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page">`+ i + `</a>`
        }else{
          divPag.innerHTML +=`<a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium num-page" onClick="showLines(this.textContent)">`
          + i + `</a>`
        }
      }
    }

    //divPag.innerHTML +=`<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">`+ numCurrent+ `</a>`
    
  }
/* navigation.prototype.showPageNumbers = function (){
//function showPageNumbers(){
  var navPanel=this
  var numPages=Math.ceil(navPanel.numTot/navPanel.numLinesShown)
  console.log(numPages)
  console.log(navPanel.numCurrent)
  //divPag.innerHTML +=`<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">`+ numCurrent+ `</a>`
  for (i=1;i<=numPages-1;i++) {
    if(i==navPanel.numCurrent){
      divPag.innerHTML +=`<a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">`+ i + `</a>`
    }else{
      divPag.innerHTML +=`<a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" onClick="showLines(this.textContent)">`
      + i + `</a>`
    }
  }
  
} */
function showLines(numCurrent){
  console.log(numCurrent)
  navigation.showLines(numCurrent)
}
navigation.prototype.showLines = function (numCurrent){
  var navPanel=this,linesShown;
  navPanel.numCurrent=numCurrent
  //console.log(d3.selectAll("#dvTable tr"))
  //console.log(document.getElementById("#dvTable").querySelector('tr'))
  var sel=document.querySelectorAll("#dvTable tbody tr")
  console.log(sel)
  if(sel.length>0){
    sel.forEach(
      function(currentValue, currentIndex, listObj) {
        //console.log(currentValue + ', ' + currentIndex + ', ' + this);
        currentValue.remove()
      }
    )
  }

  //console.log(navPanel.numCurrent*navPanel.numLinesShown)
  //console.log(navPanel.numCurrent*navPanel.numLinesShown+navPanel.numLinesShown)
  linesShown=navPanel.targets.slice(navPanel.numCurrent*navPanel.numLinesShown, navPanel.numCurrent*navPanel.numLinesShown+navPanel.numLinesShown);
  console.log(linesShown)
  for (var i = 0; i < linesShown.length; i++) {
    row = navPanel.tbody.insertRow(-1);
    row.id=linesShown[i]["target"]["id"]+"_row"
    navPanel.contentRows.push(row)
    if(navPanel.type=="freeGraph"){
      navPanel.addElementContentTableProp(linesShown[i],i)
    }else{
      navPanel.addElementContentTable(linesShown[i],i)
    }
  }
  if(navPanel.numCurrent!=1){
    navPanel.showPageNumbers()
  }
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
  
  //////console.log(nodesTable[i]["target"]["type"])
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

navigation.prototype.addElementContentTableProp = function (target,i){
  var navPanel=this;

  insertContent(true)
  insertContent(false)
  
  function insertContent(property){
    var menuOption;
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
    
    //////console.log(target["target"]["type"]=="uri")
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
        //////console.log(target["target"])
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

navigation.prototype.dblclickCellContent = async function (cell) {
  var indexRows=1,bubble,node;
  //if(networkGraph.treeData.filter(d=>d.id==cell.getAttribute("id")).length==0){
    indexRows=await networkGraph.wrangleDataFreeGraph(cell,"table");
    //console.log(indexRows)
    if(indexRows.length==0){
      unclickBubbleFreeGraph()
      bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
      //console.log(bubble)
      //console.log(cell)
      clickBubbleFreeGraph(bubble,networkGraph.data)
      d3.select("#"+row.getAttribute("id"))
      .attr("stroke", "yellow")
      .attr("stroke-width", "6px");
    }else if (indexRows.length==1){
      unclickBubbleFreeGraph()
      node=d3.select("#"+cell.getAttribute("id")).data()[0]
      //console.log(node)
      if(node["menuOption"].split(";").length>1){
        bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
        //bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
      }else{
        bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
      }
      //console.log(bubble)
      //console.log(cell)
      clickBubbleFreeGraph(bubble,networkGraph.data)
      d3.select("#"+row.getAttribute("id"))
      .attr("stroke", "yellow")
      .attr("stroke-width", "6px");
    }
  //}else{
  //  bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
  //  clickBubbleFreeGraph(bubble,networkGraph.data)
  //}
  function searchMenuOptionChild(){
    return (networkGraph.treeData.filter(d=>d.id==node["id"])[0]["children"].filter(v=>v.value==indexRows[0].url+","+indexRows[0]["subject-object"])[0])
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
navigation.prototype.clickMenuTable = async function (form,element){
  var propertyEl,bubble,node;
  var node=d3.select("#"+element["id"]).data()[0]
  var navPanel=this;
  //console.log(form)
  var newForm={"url":form["new_url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["new_subjectObject"]}
  propertyEl=form["property"]

  var form={"url":form["url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["subjectObject"]}
  //console.log(element)
  node=d3.select("#"+element.getAttribute("id")).data()[0]
  await buildFreeGraph(newForm,"table",node)
  document.getElementById(element.getAttribute("id"))

  //console.log(newForm)
  //console.log(node)
  //console.log(bubble)
  if(node["menuOption"].split(";").length>1){
    //console.log("entra en mayor que 1")
    bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
    //console.log(bubble)
  }else{
    bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+element.getAttribute("id"))
  }
  clickBubbleFreeGraph(bubble,networkGraph.data)

function searchMenuOptionChild(){
  return (networkGraph.treeData.filter(d=>d.id==node["id"])[0]["children"].filter(v=>v.value==newForm.url+","+newForm["subject-object"])[0])
}
}