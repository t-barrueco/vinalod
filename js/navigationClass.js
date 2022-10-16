NavigationPanel = function ( _type) {
    this.type = _type;
    this.init();
  };
   
NavigationPanel.prototype.init = function () {
  var navPanel=this;

  let files=["pages/navTable_element.html","pages/navTable_element_last.html"]

  navPanel.node=networkGraph.node
  navPanel.clusterElSelected=[]
  navPanel.imageArrowUp="images/arrow-up.svg"
  navPanel.imageArrowDown="images/arrow-down.svg"
  if(navPanel.node==undefined){
    navPanel.node=networkGraph.rootNode
  }

  navPanel.element=document.getElementById(navPanel.node.id)
  navPanel.getNodes()

  navPanel.initModal()
  navPanel.navTableTable()
  //console.log(document.getElementsByTagName("table"))

  navPanel.contentTable()
  //console.log(document.getElementsByTagName("table"))

  navPanel.showChildrenDetails()
}
NavigationPanel.prototype.showChildrenDetails = function (){
  var navPanel=this;
  if((navPanel.targets.length==0)||((navPanel.node.detail=="")||(navPanel.node.detail==undefined))){
    $("#tabsNav").addClass("hidden")
  }else{
    $("#tabsNav").removeClass("hidden")
    $("#tabsNav nav").attr('id', navPanel.node.id+"_tabsNav");
  }
}
NavigationPanel.prototype.getNodes = function (){
  var navPanel=this;
  var sources
  navPanel.targets=networkGraph.data.links.filter(function(item) {
    return item.source.id == navPanel.node.id
  })
  sources=networkGraph.data.links.filter(function(item) {
    return item.target.id == navPanel.node.id
  })
  console.log(navPanel.targets)
  console.log(sources)
  navPanel.sources=[navPanel.node]
  
  function recurse(node) {
    //var test;
    navPanel.sources.push(node)
    let sourcesNode=networkGraph.data.links.filter(function(item) {
      return item.target.id == node.id
    })
    sourcesNode.forEach(function(c){
        recurse(c.source)
    });
  }

  sources.forEach(function(r){
    recurse(r.source);
  })

  if (navPanel.sources.length>0){
    navPanel.sources=navPanel.sources.reverse();
  }
}

NavigationPanel.prototype.selectBubbles = function (){

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
NavigationPanel.prototype.initModal = function (){
  var navPanel=this;
  showModal("#myModal")
  $('#myModal').resizable({

  });
  $("#myModal").draggable()
  //d3.selectAll("#modal-content table").remove()
}

NavigationPanel.prototype.navTableTable = function ()
  {
    var navPanel=this,nodeClass;
    navPanel.navTable = document.getElementById("navTable");
    navPanel.nav=navPanel.navTable.querySelector("nav")
    navPanel.ol=navPanel.navTable.querySelector("ol")

    navPanel.ol.querySelectorAll("li").forEach(function(li){
      li.remove()
    })

    navPanel.sources.forEach(function (d,i){
      nodeClass=d.class
      if(nodeClass=="free"){
        if(i==0){
          navPanel.addElementNav(d,i)
        }else{
          if(d["target"]["type"]!="menuOption"){
            navPanel.addElementNavProp(d,i,true)
            navPanel.addElementNavProp(d,i,false)
          }
        }
      }else{
        navPanel.addElementNav(d,i)
      }
    })
    
    navPanel.addEventsNav()

}

NavigationPanel.prototype.addElementNav = function (source,i){
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
  async function addBasicGraph(last){
    //li=document.createElement("li")
    var file;
    if(!last){
      file="pages/navTable_element.html"
    }else{
      file="pages/navTable_element_last.html"
    }
    let code = await getHtmlCodeFromFile(file);
    $("#navTable ol").append(code).ready(function () {
      let li=navPanel.ol.querySelector("#li-empty")
      li.removeAttribute("id")
      let a=li.querySelector("a")
      a.id=navPanel.sources[i]["id"]+"_a"
      colorCircle=networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[navPanel.sources[i]["class"]])]
      let navImage=li.querySelector("#nav_image")
      navImage.classList.add("bg-"+ colorCircle)
      navImage.classList.add("group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))

      let navTableElement=li.querySelector("#navTable_element")
      navTableElement.querySelector("span").innerHTML = navPanel.sources[i]["value"]
      navTableElement.querySelector("img").setAttribute("src",bubbleImage(d3.select("#"+navPanel.sources[i]["id"]).data()[0]))
    })
  }

  function addFreeGraph(){
    var li=document.createElement("li")
    
  
    if(i<navPanel.sources.length-1){
      li.setAttribute("class", "relative pb-2");
      li.id=source["id"]+"_li"
      div=document.createElement("div")
      div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-black");
      div.setAttribute("aria-hidden", "true");
      li.appendChild(div)
    }else{
      li.setAttribute("class", "relative pb-5");
      li.id=source["id"]+"_li"
    }
  
    a=document.createElement("a")
    a.setAttribute("href", "#");
    a.setAttribute("class", "relative flex items-start group");
    a.id=source["id"]+"_a"
    
    span=document.createElement("span")
    span.setAttribute("class","h-9 flex items-center")
    
    span2=document.createElement("span")

    colorCircle=networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[source["type"]])]
  
    span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))
  
    img=document.createElement("img")
  
    if(i<navPanel.sources.length-1){
      if((navPanel.nav.querySelectorAll("ol").length)==0){
        navPanel.nav=navPanel.nav.appendChild(navPanel.ol)
      }
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

NavigationPanel.prototype.addElementNavProp = function (source,i,property){
  var li=document.createElement("li")
  var div,a,li,span,span2,el1
  var navPanel=this;
  li.setAttribute("class", "relative pb-2");
  li.id=source["target"]["id"]+"_li"
  if((property)||((i<navPanel.sources.length-1)&&(navPanel.node.type!="menuOption"))){
    div=document.createElement("div")
    div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-black");
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
    colorCircle=networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[source["target"]["type"]])]
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
  span4=document.createElement("h5")

  span4.setAttribute("class","ecl-u-type-heading-5")
  if(property){
    span4.innerHTML= source["target"]["property"]
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
}

NavigationPanel.prototype.addEventsNav = function (){
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
  });
}
NavigationPanel.prototype.contentTable = async function (){
  var navPanel=this,label;
  var menuOption;
  navPanel.numStart=1
  navPanel.numTot=navPanel.targets.length
  navPanel.numLinesShown=10
  navPanel.numEnd=(navPanel.numLinesShown>navPanel.numTot) ? navPanel.numTot : navPanel.numLinesShown;
  navPanel.numCurrent=navPanel.numStart
  navPanel.contentRows=[]

  if (navPanel.targets.length>0){
    $("#dvTable").show()
    //$("#dvDetails").empty()


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
      if(menuOption){
        if(menuOption.split(";").length>1){
          th.innerHTML="Several options displayed in graph. Click on each option to see results values:";
        }else{
          menuOption=menuOption.split(",")
          if(navPanel.node.class=="free"){
            labelFreeGraph()
          }else{
            labelBasicGraph()
          }
  
          th.innerHTML=searchHtml()
        }
      }

     
    }
    navPanel.tbody=document.getElementById("nav-children-tbody")
    navPanel.showLines(navPanel.numCurrent,true)
    
    let code = await getHtmlCodeFromFile("pages/navPagination2.html");
    $("#dvTable").append(code).ready(function () {
      //navPanel.showNumberPages()
      console.log(code)
      $("#numStart").text(navPanel.numStart)
      $("#numEnd").text(navPanel.numEnd)
      $("#numTot").text(navPanel.numTot)
  
      navPanel.prevNextVisibility()
      navPanel.addEventsContentNav()
    })
  }else{
    $("#dvTable").hide()
    if(navPanel.node.detail!=undefined){
      navPanel.showDetails()
    }else{
      $("#dvDetails").empty()
    }
  }

  function labelFreeGraph(){
    label=`Sparql Endpoint: ` + menuOption[0]+ ` and Position: ` +menuOption[1]
  }
  function labelBasicGraph(){
    var exists;
    label=menuOption[0]
    if(label=="no options"){
      if(configFile.filter(d=>d.class==navPanel.node.class)[0]){
        label=configFile.filter(d=>d.class==navPanel.node.class)[0]["option_text"]
      }else{
        const res = configFile.filter(function (x){
            if(x.hierarchy){
              exists=x.hierarchy.some(y => y.parent === navPanel.node.class)
            }
          return exists
        })
        label=res[0]["option_text"]
      }
      
    }else{
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

NavigationPanel.prototype.showDetails = function (){
  var navPanel=this;
  $("#dvTable").hide()
  itemDetails()
  function itemDetails(){
    let navDetailHeader,navDetailRow0,navDetailRow1;
    $("#dvDetails").empty()
    $.get("pages/nav_detail.html", function (header) {
      $.get("pages/nav_detail_row_0.html", function (row0) {
        $.get("pages/nav_detail_row_1.html", function (row1) {
          $.get("pages/nav_detail_row_attach.html", function (rowAttach) {
            ////////console.log(navPanel.node["value"])
            navDetailHeader=header.replace("Title",navPanel.node["value"])
            ////////console.log(navDetailHeader)
            $("#dvDetails").append($(navDetailHeader))
            if(navPanel.node.detail){
              Object.keys(navPanel.node.detail).forEach(key => {
                if((key % 2 == 0)|| (key == 0)){  
                  if(navPanel.node[navPanel.node.detail[key]["property"]]!=undefined){
                    navDetailRow0=row0.replace("Title",navPanel.node.detail[key]["text"])+":"
                    navDetailRow0=fieldItemDetails(navDetailRow0,navPanel.node[navPanel.node.detail[key]["property"]],navPanel.node.detail[key]["type"])
                    $("#dvDetails tbody").append($(navDetailRow0))
                  }  
                }else{
                  if(navPanel.node[navPanel.node.detail[key]["property"]]!=undefined){
                    navDetailRow1=row1.replace("Title",navPanel.node.detail[key]["text"])
                    navDetailRow1=fieldItemDetails(navDetailRow1,navPanel.node[navPanel.node.detail[key]["property"]],navPanel.node.detail[key]["type"])
                    $("#dvDetails tbody").append($(navDetailRow1))
                  }
                }
              })
            }

          });
        });
      });
    });
  }
  function fieldItemDetails(item,field,type){
    if(type=="link"){
      item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field+'</a>')
    }else if(type=="telephone"){
        item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field.replace("tel:","") +'</a>')
    }else if(type=="email"){
      item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field.replace("mailto:","") +'</a>')
    }else if(type=="geojson"){
      item=item.replace("Content",'<a href="'+field+'" target="_blank">'+field+'</a>')
    }else{
      item=item.replace("Content",field)
    }
    return item
  }

}

NavigationPanel.prototype.contentTableSearch = function (){
  var navPanel=this;
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
NavigationPanel.prototype.paginationNumbers = function (){
  var navPanel=this
 {  console.log(navPanel.numCurrent)
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
NavigationPanel.prototype.showNumberPages = async function (){
  var navPanel=this,textHtml="",afterElement="#item-previous"
  navPanel.firstPage=1
  navPanel.numPages=Math.ceil(navPanel.numTot/navPanel.numLinesShown)
  navPanel.arrNumberPages=[]
  navPanel.paginationLimit=10

  navPanel.pages = navPanel.paginationNumbers()

  pagePrev = document.getElementById('page-prev');

  let element = await getHtmlCodeFromFile("pages/navPagination_page.html");
  let currentElement = await getHtmlCodeFromFile("pages/navPagination_page_current.html");
  
  insertElementAfter((navPanel.pages.pages[0]))
  console.log(navPanel.pages.pages.length)
  afterElement="#page-1"
  for (let i=1;i<=navPanel.pages.pages.length-1;i++) {
    console.log(navPanel.pages.pages[i])
    insertElementAfter(navPanel.pages.pages[i],Object.assign("",element))
    afterElement="#page-"+navPanel.pages.pages[i]
    console.log(afterElement)
  }
  //throw new Error("Something went badly wrong!");
  if(pagePrev!=null){
    pagePrev.insertAdjacentHTML('afterend', textHtml);
  }
  function insertElement(numElement){
    if(numElement==navPanel.numCurrent){
      currentElement.replace("page-number",navPanel.pages.pages[i])
      $(currentElement.replace("page-number",numElement)).insertBefore($(afterElement))
    }else{
      $(element.replace("page-number",numElement)).insertBefore($(afterElement))
    }
  }
  function insertElementAfter(numElement,newElement){

    if(numElement==navPanel.numCurrent){
      currentElement=currentElement.replace("page-number",numElement).replace("id-item","page-"+numElement)
      console.log(currentElement)
      $(currentElement).insertAfter($(afterElement))
    }else{
     console.log(numElement)
     console.log(element)
     element=element.replace("page-number",numElement).replace("id-item","page-"+numElement)
     console.log(element)
     $(element).insertAfter($(afterElement))
    }
  }
}

function showLines(numCurrent,type){
  var div=$("#modal-content tbody td div")[0]
  if(div.classList.contains("hidden")){
    navigationPanel.showLines(numCurrent,false,false)
  }else{
    navigationPanel.showLines(numCurrent,false,true)
  }
  navigationPanel.addEventsContentNav()
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
NavigationPanel.prototype.prevNextVisibility = function (){
  var navPanel=this
  console.log(navPanel.pages)
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
NavigationPanel.prototype.showLines = function (numCurrent,first,cluster){
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
  ////////////console.log("showLines 873")
  removeLinesNavContent()

  if(!first){
    numPagesElements = document.querySelectorAll('#div-pagination .num-page');
    numPagesElements.forEach(function(el){
      el.remove()
    })
    //navPanel.showNumberPages()
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

  //console.log(linesShown)

  for (var i = 0; i < linesShown.length; i++) {
    //console.log(navPanel.tbody)
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

NavigationPanel.prototype.addEventsContentNav = function (){
  var navPanel=this,nodeSearchField,node;
  navPanel.isDblclick = false;

  navPanel.searchValues=navPanel.targets.map(d=>d.target.value)
  nodeSearchField=document.getElementById("node-search")
  if(nodeSearchField){
    autocomplete(nodeSearchField, navPanel.searchValues);

    // Execute a function when the user releases a key on the keyboard
      nodeSearchField.addEventListener("keyup", function(event) {
      if (event.key === 'Enter' ) {
        // Cancel the default action, if needed
        event.preventDefault();

        navPanel.valueSelected()
        closeAllLists()
    
      }else{
        if(this.value==""){
          $("#nav-search").addClass("hidden")
        }else{
          $("#nav-search").removeClass("hidden")
        }
      }
      });
  }


  navPanel.timeoutTiming = 500;
  d3.selectAll("#modal-content td").on("dblclick",function(){ 
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
    clearTimeout(navPanel.clickTimeout);

  })
  
}
NavigationPanel.prototype.valueSelected=function(){
  var navPanel=this;
  nodeSearchField=document.getElementById("node-search")
  removeLinesNavContent()

  if(navPanel.targetsBackup){
    navPanel.resultsSearch = navPanel.targetsBackup.filter(a =>(a.target.value.toUpperCase().includes(nodeSearchField.value.toUpperCase())||(a.target.value.toUpperCase()==nodeSearchField.value.toUpperCase())));
  }else{
    navPanel.resultsSearch = navPanel.targets.filter(a =>a.target.value.toUpperCase().includes(nodeSearchField.value.toUpperCase()));
    navPanel.targetsBackup=navPanel.targets
  }
  navPanel.targets=navPanel.resultsSearch
  navPanel.contentTableSearch()
  $("#nav-search").addClass("hidden")
  $("#nav-delete").removeClass("hidden")
  navPanel.addEventsContentNav()
}
NavigationPanel.prototype.addElementContentTable = function (target,i){
  var navPanel=this;
  if(target["class"]=="free"){
    addFreeGraph()
  }else{
    addBasicGraph()
  }

  
  async function addBasicGraph(){
    let code = await getHtmlCodeFromFile("pages/elementContentTable.html");
    $("#dvTable tbody" + " #"+target["target"]["id"]+"_row").append(code).ready(function () {
      $("#dvTable tbody"+" #"+target["target"]["id"]+"_row img").addClass("bg-"+networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[target["target"]["class"]])])
      $("#dvTable tbody"+" #"+target["target"]["id"]+"_row img").attr("src",bubbleImage(d3.select("#"+target["target"]["id"]).data()[0]))
      $("#dvTable tbody"+" #"+target["target"]["id"]+"_row span").text(target["target"]["value"]);
    })
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
    img.className="w-5 h-5 bg-"+networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[nodesTable[i]["target"]["type"]])] + " rounded-full"
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
  navigation.addElChecked(el)
}
NavigationPanel.prototype.addElChecked = function (el){
  var navPanel=this;
  if(el.checked){
    navPanel.clusterElSelected.push(el.getAttribute("id"))
  }else{
    navPanel.clusterElSelected.splice(navPanel.clusterElSelected.indexOf(el.getAttribute("id")), 1);
  }
}
NavigationPanel.prototype.addElementContentTableProp = function (target,i,cluster){
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
      img.className="w-5 h-5 bg-"+networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[target["target"]["type"]])] + " rounded-full"
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
        if((target["target"]["type"]!="bnode")&&(target["target"]["type"]!="uri")&&(target["target"]["type"]!="menuOption")){
          a.setAttribute("class", "relative flex items-start group isDisabled");
        }else{
          a.setAttribute("class", "relative flex items-start group");
        }
        
        span=document.createElement("span")
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
        }else if(target["target"]["property"]!=undefined){
          newText = document.createTextNode(target["target"]["property"]);
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
  NavigationPanel.prototype.dblclickCellCluster = async function (cell) {
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
NavigationPanel.prototype.dblclickCellContent = async function (cell) {
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
    await networkGraph.wrangleData(element,"table");
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
        if(node["menuOption"]){
          if(node["menuOption"].split(";").length>1){
            bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
          }else{
            bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","")))
          }
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

NavigationPanel.prototype.clickCellContent = async function (cell){
  d3.selectAll(".nodeCircleCircle")
  .style("opacity", 1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}

NavigationPanel.prototype.dblclickNav = async function (cell) {
  var navPanel=this,bubble;
  bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+(cell.getAttribute("id").replace("_a","").replace("_li","")))
  $("#dvDetails").empty()
  clickBubbleFreeGraph(bubble,networkGraph.data)
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}

NavigationPanel.prototype.clickNav = async function (cell){
  d3.selectAll(".nodeCircleCircle")
  .style("opacity", 1)
  .attr("stroke", "grey")
  .attr("stroke-width", "1px");
  d3.select("#"+row.getAttribute("id"))
  .attr("stroke", "yellow")
  .attr("stroke-width", "6px");
}
NavigationPanel.prototype.addMenuToTable = function (){
  var navPanel=this;
  menuTableBasic()
  function menuTableBasic(){
    var newText,newCell,newRow,span,div,textNode
    d3.selectAll(".menu-table").remove()
    var rowIndex=$('#myModal #'+ menuItems.node["id"]).parent()[0].rowIndex
    var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];
    for (var i = 0; i < menuItems.selectedRows.length; i++) {
        newRow = tbodyRef.insertRow(rowIndex+i);
        newRow.id="menu-table-"+menuItems.selectedRows[i]["position"]
        newRow.className = 'menu-table';
        newCell = newRow.insertCell();
        newCell.className="px-2 py-4 bg-gray-100 whitespace-nowrap"
        newCell.setAttribute("x-data","{ tooltip: false }")
        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        a.setAttribute("x-on:mouseenter","tooltip = true")
        a.setAttribute("x-on:mouseleave","tooltip = false")
  
        div=document.createElement("div")
        div.setAttribute("x-show","tooltip")
        div.setAttribute("class","z-50 absolute bg-indigo-300 border-graphite border-2 rounded p-4 mt-1")
        
        if(menuItems.node["class"]!="free"){
          textNode = document.createTextNode (getCommentOption(menuItems.selectedRows[i]["option"]));
        }
        
        
        span=document.createElement("span")
        span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
        newText = document.createTextNode(menuItems.selectedRows[i]["option"]);
        newCell.appendChild(a).appendChild(span).appendChild(newText);
        newCell.appendChild(div).appendChild(textNode)
        
        d3.selectAll("#menu-table-"+menuItems.selectedRows[i]["position"]).on("dblclick",function(){  
          navPanel.clickMenuTable(menuItems.selectedRows[0]["option"],menuItems.node)
        })
    }
  }
  function menuTableExpert(){
    var textTooltip,div,textNode,newText,newCell,newRow,span,form,textMenu,property,propertyNode,new_url,new_subjectObject
    d3.selectAll(".menu-table").remove()
    var rowIndex=$('#myModal #'+ (node["id"]+"_row"))[0].rowIndex;
  
    var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];
    for (var i = 0; i < menuItems.selectedRows.length; i++) {
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
}
NavigationPanel.prototype.clickMenuTable = async function (option,node){
  var bubble;
  var navPanel=this;
  clickMenuBasic(option,node)
  async function clickMenuBasic(option,node){
    var element=document.getElementById(node["id"])
    //CAMBIAR LA POSICIÓN POR LA OPTION SI SE PUEDE...
    await buildBasicGraph(option,node)
    clickBubbleFreeGraph(element,networkGraph.data)
  }
  async function clickMenuExpert(form){
    var newForm={"url":form["new_url"],"uri":node["value"],"subject-object":form["new_subjectObject"]}

    await buildNetworkGraph(newForm,"expert",node)
    if(node["menuOption"]){
      if(node["menuOption"].split(";").length>1){
        bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+searchMenuOptionChild()["id"])
      }else{
        bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+node.id)
      }
    }else{
      bubble=document.getElementsByClassName("gMain")[0].querySelector("#"+node.id)
    }
  
    clickBubbleFreeGraph(bubble,networkGraph.data)
  }
  

function searchMenuOptionChild(){
  return (networkGraph.treeData.filter(d=>d.id==node["id"])[0]["children"].filter(v=>v.value==newForm.url+","+newForm["subject-object"])[0])
}
}

function removeSelection(){
  navigation.removeSelection()
}
NavigationPanel.prototype.removeSelection = function (){
  var navPanel=this;

  navPanel.targets=navPanel.targetsBackup

  navPanel.contentTableSearch()
  $("#nav-delete").addClass("hidden")
  $("#node-search").val("")
}
function addSelToGraph(element){
  navigation.addSelToGraph()
}
NavigationPanel.prototype.addSelToGraph = function (){
  var navPanel=this,selected=[],results,form,parent,configRow,children=[],clusterNode;
  var node=d3.select("#"+document.getElementById(navPanel.clusterElSelected[0].replace("_check","")).getAttribute("cluster")).data()[0]
  for (var i = 0; i < navPanel.clusterElSelected.length; i++) {
    selected.push(document.getElementById(navPanel.clusterElSelected[i].replace("_check","")).querySelector("a span").innerText)
  };
  if(node["subject-object"]=="s"){
    results=node["more_results"].filter(d=>selected.includes(d.o.value))
  }else if(node["subject-object"]=="o"){
    results=node["more_results"].filter(d=>selected.includes(d.s.value))
  }
  form={"uri":node["uri"],"url":node["url"],"subject-object":node["subject-object"]}
  getChildren()
  for (var i = 0; i < networkGraph.treeData.length; i++) {
    parent=networkGraph.treeData[i]["children"].filter(d=>d.id==node.id)
    if(parent.length>0){
      const indexMoreResults = networkGraph.treeData[i]["children"].findIndex(item => Boolean(item.more_results))
      for (var j = 0; j < selected.length; j++) {
        networkGraph.treeData[i]["children"][indexMoreResults]["more_results"].splice(networkGraph.treeData[i]["children"][indexMoreResults]["more_results"].indexOf(selected[j]),1)
      }
      networkGraph.treeData[i]["children"][indexMoreResults]["value"]=parseInt(networkGraph.treeData[i]["children"][indexMoreResults]["value"].split(" ")[0])-selected.length + " results"
      networkGraph.treeData[i]["children"]=networkGraph.treeData[i]["children"].concat(children)
      clusterNode=networkGraph.treeData[i]
      break;
    }
    
  }

  networkGraph.data = flatten_freeGraph(networkGraph.treeData).flatData
  networkGraph.allData.nodes = networkGraph.data.nodes
  networkGraph.allData.links = networkGraph.data.links
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.enterGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.exitGraph()
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


function showHideNavigation(){
  if(document.getElementById("show-nav").checked){
    showNavigation=true
  }else{
    showNavigation=false
  }
}
function navSearch(){
  navigation.valueSelected()
}
