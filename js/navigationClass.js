NavigationPanel = function ( _node) {
    this.node = _node;
    this.init();
  };
   
NavigationPanel.prototype.init = function () {
  var navPanel=this;

  navPanel.node=networkGraph.node
  navPanel.clusterElSelected=[]
  navPanel.imageArrowUp="images/arrow-up.svg"
  navPanel.imageArrowDown="images/arrow-down.svg"
  if(navPanel.node==undefined){
    navPanel.node=networkGraph.rootNode
  }

  navPanel.element=document.getElementById(navPanel.node.id)
  navPanel.getNodes()

  navPanel.navTableTable()

  navPanel.contentTable()

  navPanel.showChildrenDetails()

  navPanel.initModal()
}

NavigationPanel.prototype.getNodes = function (){
  var navPanel=this,links=[];
  var sources

  if(navPanel.node){
    if(navPanel.node.class=="more_results"){
      navPanel.node.more_results.forEach(function(d){
        links.push({"target":d})
      })
      navPanel.targets=links
      navPanel.more_results=true
    }else{
      navPanel.targets=networkGraph.data.links.filter(function(item) {
        return item.source.id == navPanel.node.id
      })
      navPanel.more_results=false
    }
  }else{
    navPanel.targets=networkGraph.data.links.filter(function(item) {
      return item.source.id == navPanel.node.id
    })
  }

  if(getShowDuplicates()){
    navPanel.sources=[navPanel.node]
    navPanel.fromNodes=networkGraph.data.links.filter(function(item) {
      return item.target.id == navPanel.node.id
    })
    navPanel.toNodes=navPanel.targets
    navPanel.fromNodes=changetargetPerSource(navPanel.fromNodes)
    navPanel.targets=navPanel.fromNodes
  }else{
    sources=networkGraph.data.links.filter(function(item) {
      return item.target.id == navPanel.node.id
    })
    navPanel.sources=[navPanel.node]
    
    sources.forEach(function(r){
      recurse(r.source);
    })
  
    if (navPanel.sources.length>0){
      navPanel.sources=navPanel.sources.reverse();
    }
    navPanel.fromNodes=[]
    navPanel.toNodes=[]
  }

  function recurse(node) {
    if(navPanel.sources.indexOf(node)==-1){
      navPanel.sources.push(node)
    }
    let sourcesNode=networkGraph.data.links.filter(function(item) {
      return item.target.id == node.id
    })
    sourcesNode.forEach(function(c){
        recurse(c.source)
    });
  }
  function buildtargetNodes(index){
    var links=[]

    if(index!=-1){
      linkedDataGraph.treeData[index]["more_results"].forEach(function(d){
        links.push({"target":d})
      })
    }else{
      return findNestedObj(linkedDataGraph.treeData,"id",navPanel.node.id)
    }
    
    return links

    function findNestedObj(entireObj, keyToFind, valToFind) {
      let links=[];
      entireObj.forEach(function(parent){
        var menuOptionElements,foundObj

        menuOptionElements=parent.children.filter(d=>((d.type)&&(d.type=="menuOption")))
        if(menuOptionElements.length>0){
          menuOptionElements.forEach(function(v){
            if(v.children.findIndex((subSubElement) => subSubElement.id == valToFind)!=-1){
              foundObj=v
            }
          })
        }
        if(foundObj){
          parent.more_results[foundObj.value].forEach(function(d){
            links.push({"target":d})
          })
        }
      })
      return links
    }
  }
  function changetargetPerSource(nodes){
    var tmp,reverse=[];
    nodes.forEach(function(n){
      tmp=n.source
      n.source=n.target
      n.target=tmp
      reverse.push(n)
    })
    return reverse
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
  openNavigationPanel()

  $('#myModal').resizable();
  $("#myModal").draggable()
}

NavigationPanel.prototype.navTableTable = async function ()
  {
    var navPanel=this,nodeClass;
    navPanel.navTable = document.getElementById("navTable");
    navPanel.nav=navPanel.navTable.querySelector("nav")
    navPanel.ol=navPanel.navTable.querySelector("ol")

    navPanel.ol.querySelectorAll("li").forEach(function(li){
      li.remove()
    })

    for (let i=0;i<navPanel.sources.length;i++) {
      nodeClass=navPanel.sources[i].class
      await navPanel.checkElementNav(navPanel.sources[i],i)
    }
}

NavigationPanel.prototype.addElementNav = async function (source,i){
  var navPanel=this, last=false,nodeClass
  
  if(source.source){
    nodeClass=source.source.class
  }else{
    nodeClass=source.class
  }

  if(i+1==navPanel.sources.length){
    last=true
  }

  navPanel.imageSource="images/check.svg"
  navPanel.imageSourceLast="images/location.svg"

  await navPanel.getCodeElementNav(last,i)
}

NavigationPanel.prototype.getCodeElementNav = async function (last,i){
  var navPanel=this,file,value;

  if(!last){
    file="pages/navTable_element.html"
  }else{
    file="pages/navTable_element_last.html"
  }
  if(last){
    if(navPanel.sources[i]["relation"]){
      file="pages/navTable_element_last.html"
    }else{
      file="pages/navTable_element_property_last.html"
    } 
  }else if(navPanel.sources[i]["relation"]){
    file="pages/navTable_element_middle.html"
  }else{
    file="pages/navTable_element.html"
  }
  code = await getHtmlCodeFromFile(file)
  .then(success => {return (success)})
  
  $("#navTable ol").append(code)

  let li=navPanel.ol.querySelector("#li-empty")
  li.removeAttribute("id")
  let a=li.querySelector("a")
  a.id=navPanel.sources[i]["id"]+"_a"

  if(navPanel.sources[i]["relation"]){
    let relation=navPanel.ol.querySelector("#navTable_relation")
    relation.querySelector(".ecl-timeline__content").innerHTML = navPanel.sources[i]["relation"]
    relation.id=navPanel.sources[i]["id"]+"_relation"
  }
  
  if(navPanel.sources[i]["class"]=="free"){
    colorCircle=networkGraph.colorCorrespondence[networkGraph.colorScale(navPanel.sources[i]["type"])]
  }else{
    colorCircle=networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[navPanel.sources[i]["class"]])]
  }

  let navImage=li.querySelector("#nav_image")
  if(navImage){
    navImage.classList.add("bg-"+ colorCircle)
    navImage.classList.add("group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))
  }

  let navTableElement=li.querySelector("#navTable_element")
  if((navPanel.sources[i].class=="free")&&(navPanel.sources[i].type)&&(navPanel.sources[i].type=="menuOption"))
  {
    value= getTextMenuOptionExpert(navPanel.sources[i]["value"])
  }else{
    value= navPanel.sources[i]["value"]
  }
  navTableElement.querySelector("span").innerHTML = value
  navImage=navTableElement.querySelector("img")
  if(navImage){
    navImage.setAttribute("src",bubbleImage(d3.select("#"+navPanel.sources[i]["id"]).data()[0]))
  }
}

NavigationPanel.prototype.addElementNavProp = async function (source,i,property){
  var navPanel=this;

  if(source["url"]){
    let code = await getHtmlCodeFromFile("pages/navTable_property.html");

    if(configRow["position"]=="s"){
      code=code.replace("arrow-image",navPanel.imageArrowDown)
    }else if(configRow["position"]=="o"){
      code=code.replace("arrow-image",navPanel.imageArrowUp)
    }
  
    if(source["property"]){
      code=code.replace("Text Property",source["property"]).replace("NameSparqlEndpoint",source["url"])
    }else{
      code=code.replace("Text Property","").replace("NameSparqlEndpoint",source["url"])
    }
    $("#navTable ol").append(code).ready(function () {

    })
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
    hideNavDetails()
    showNavContentTable()
    showNavContentTablePagination()
    if($("#dvTable th").length==0){
      navPanel.addHeaderContentTable()
    }else{
      navPanel.addTextToHeaderContentTable()
    }

    if(navPanel.node["type"]=="menuOption"){
      menuOption=navPanel.node["value"].split(",")
      label=navPanel.labelGraph(menuOption)
      
    }else{
      menuOption=navPanel.node["menuOption"]
      if(menuOption){
        if(menuOption.split(";").length>1){
          $("#dvTable th").text("Several options displayed in graph. Click on each option to see results:");
        }else{
          menuOption=menuOption.split(",")
          label=navPanel.labelGraph(menuOption)
        }
      }     
    }
    navPanel.tbody=document.getElementById("nav-children-tbody")
    navPanel.showLines(navPanel.numCurrent,true)
    
    if(($("#div-pagination").length)==0){
      let code = await getHtmlCodeFromFile("pages/navPagination.html");
      $("#dvTable").append(code)
      runAutoInit()
    }

    navPanel.showNumberPages()
    $("#numStart").text(navPanel.numStart)
    $("#numEnd").text(navPanel.numEnd)
    $("#numTot").text(navPanel.numTot)

    navPanel.prevNextVisibility()
  }else{
    $("#dvTable").hide()
    if(navPanel.node.detail!=undefined){
      navPanel.showDetails()
    }else{
      emptyNavDetails()
    }
  }

  if((navPanel.numPages>1)&&(!document.getElementById("search-nav-content"))){
    let search=searchHtml()
    $( "#dvTable th" )
    .html( $( "#dvTable th" ).html()+search);
  }else if((navPanel.numPages>1)&&(document.getElementById("search-nav-content"))){
    showSearchNavContent()
  }else if((navPanel.numPages==1)&&(document.getElementById("search-nav-content"))){
    hideSearchNavContent()
  }

  navPanel.addEventsContentNav()


  function searchHtml(){
  var text=`
  <form class="ecl-search-form ecl-u-mt-m" role="search" onsubmit="navSearch(this);return false" id="search-nav-content">
  <div class="ecl-form-group">
    <label for="search-input" class="ecl-form-label ecl-search-form__label">Search</label>
    <input type="search" name="nodeSearch" id="node-search" class="ecl-text-input ecl-text-input--m ecl-search-form__text-input" placeholder="Find node..." />
  </div>
  <button class="ecl-button ecl-button--search ecl-search-form__button" type="submit" aria-label="Search">
    <span class="ecl-button__container">
    <span class="ecl-button__label" data-ecl-label="true">Search</span>
      <svg class="ecl-icon ecl-icon--xs ecl-button__icon ecl-button__icon--after" focusable="false" aria-hidden="true" data-ecl-icon="">
            <use xlink:href="/images/icons.svg#general--search"></use>
      </svg>
    </span>
  </button>
  </form>
  <div class="demo-container ecl-u-d-flex ecl-u-justify-content-center ecl-u-mt-xs">
    <button class="items-center ecl-button ecl-button--primary" onclick="addToGraph()"  id="cluster-add" style="display: none;">Add to graph</button>
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
    emptyNavDetails()
    showNavDetails()
    $.get("pages/nav_detail.html", function (header) {
      $.get("pages/nav_detail_row_0.html", function (row0) {
        $.get("pages/nav_detail_row_1.html", function (row1) {
          $.get("pages/nav_detail_row_attach.html", function (rowAttach) {
            navDetailHeader=header.replace("Title",navPanel.node["value"])
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

NavigationPanel.prototype.showNumberPages = async function (){
  var navPanel=this,afterElement="#page-prev"
  navPanel.firstPage=1
  navPanel.numPages=Math.ceil(navPanel.numTot/navPanel.numLinesShown)
  navPanel.arrNumberPages=[]
  navPanel.paginationLimit=10

  navPanel.pages = navPanel.paginationNumbers()

  pagePrev = document.getElementById('page-prev');

  let element = await getHtmlCodeFromFile("pages/navPagination-page.html");
  let currentElement = await getHtmlCodeFromFile("pages/navPagination-page-current.html");
  
  for (let i=0;i<navPanel.pages.pages.length;i++) {
    if(navPanel.pages.pages[i]==navPanel.pages.currentPage){
      $(replaceCurrentPage(currentElement,navPanel.pages.pages[i])).insertAfter(afterElement);
    }else{
      let elementCopy = (' ' + element).slice(1);
      elementCopy=replacePage(elementCopy,navPanel.pages.pages[i])
      $(elementCopy).insertAfter(afterElement);
    }
    afterElement="#page-"+navPanel.pages.pages[i]
  }

  function replaceCurrentPage(element,page){
    return element.replace("Go to page X","Go to page "+page).replace("Number page",page).replace("page-current-id","page-"+page)
  }
  function replacePage(element,page){
    element=element.replace("Number page",page).replace("Page X",page).replace("page-x-id","page-"+page)
    return element
  }

}
NavigationPanel.prototype.showChildrenDetails = function (){
  var navPanel=this;
  if((navPanel.fromNodes.length>0)||((navPanel.targets.length>0)&&(navPanel.node.detail!=""))){
    showNavTabs()
    let component=$("#tabsNav nav").attr('id', navPanel.node.id+"_tabsNav")[0]
    runAutoInit(component)
  }else{
    hideNavTabs()
  }
}
function showLines(numCurrent){
  if(numCurrent.parentNode.id=="page-prev"){
    numCurrent=navigationPanel.pages.currentPage-1
  }else if(numCurrent.parentNode.id=="page-next"){
    numCurrent=navigationPanel.pages.currentPage+1
  }else{
    numCurrent=numCurrent.parentNode.id.replace("page-","")
  }
  navigationPanel.showLines(numCurrent,false,false)
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
function removeNumberPages(){
  $("#div-pagination nav li").each(function( index ){
    if(($( this )[0].id!="page-prev")&&($( this )[0].id!="page-next")) $( this )[0].remove()
  })
}
NavigationPanel.prototype.prevNextVisibility = function (){
  var navPanel=this

  if(navPanel.pages.currentPage==1){
    $('#page-prev').hide();
  }else{
    $('#page-prev').show();
  }
  if(navPanel.pages.currentPage==navPanel.pages.endPage){
    $('#page-next').hide();
  }else{
    $('#page-next').show();
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

  removeLinesNavContent()
  removeNumberPages()
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

  for (var i = 0; i < linesShown.length; i++) {
    row = navPanel.tbody.insertRow(-1);
    row.classList.add("ecl-table__row")
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
    autocomplete(nodeSearchField, navPanel.searchValues,3);

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
}
NavigationPanel.prototype.addHeaderContentTable = async function (){
  var navPanel=this;
  let code = await getHtmlCodeFromFile("pages/headerContentTable.html");
  $("#dvTable thead").append(code).ready(function () {
  })
  navPanel.addTextToHeaderContentTable()
}
NavigationPanel.prototype.addElementContentTable = async function (target,i){
  var navPanel=this;
  let code = await getHtmlCodeFromFile("pages/elementContentTable.html");
  $("#dvTable tbody" + " #"+target["target"]["id"]+"_row").append(code).ready(function () {
    $("#dvTable tbody"+" #"+target["target"]["id"]+"_row img").addClass("bg-"+networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[target["target"]["class"]])])
    $("#dvTable tbody"+" #"+target["target"]["id"]+"_row img").addClass("bg-"+networkGraph.colorCorrespondence[networkGraph.colorScale(networkGraph.nodesClassesShow[target["target"]["class"]])])
    $("#dvTable tbody"+" #"+target["target"]["id"]+"_row img").attr("src",bubbleImage(target["target"]))
    $("#dvTable tbody"+" #"+target["target"]["id"]+"_row span").text(target["target"]["value"]);
    if(navPanel.more_results){

      $(".cluster-check").parent().removeClass("hidden")
      showAddToGraph()
      //$("#cluster-add").show()
    }
  })

}

function addElChecked(el){
  navigationPanel.addElChecked(el)
}
function addToGraph(){
  navigationPanel.addToGraph()
  hideAddToGraph()
}

NavigationPanel.prototype.addToGraph = function (){
  var navPanel=this,node,indexChild,id,nodeMenuOption,parentNode,more_results,children;

  parentNode=networkGraph.data.links.filter(d=>d.target.id==navPanel.node.id)[0]["source"]
  more_results=navPanel.node["more_results"]
  children=parentNode["children"]
  id=parentNode.id

  navPanel.clusterElSelected.forEach(function(d){
    indexChild=more_results.findIndex(c=>c.id==d)
    node=more_results[indexChild]
    children.push(node)
    more_results.splice(indexChild, 1);
  })
  indexChild=children.findIndex(c=>c.id==navPanel.node.id)
  children[indexChild].value=more_results.length + " results collapsed"
  linkedDataGraph.treeData.filter(d=>d.id==na)
  linkedDataGraph.flatten()
  networkGraph.refreshNoFilters()
  clickBubbleGraph(document.getElementById(id))
}

NavigationPanel.prototype.addElChecked = function (el){
  var navPanel=this;
  if(el.checked){
    navPanel.clusterElSelected.push(el.closest( "tr" ).getAttribute("id").replace("_row",""))
  }else{
    navPanel.clusterElSelected.splice(navPanel.clusterElSelected.indexOf(el.closest( "tr" ).getAttribute("id").replace("_row","")), 1);
  }
}
NavigationPanel.prototype.addElementContentTableProp = async function (target,i,cluster){
  var navPanel=this;

  var navPanel=this;
  let code = await getHtmlCodeFromFile("pages/elementContentTableProperty.html");

  $("#dvTable tbody" + " #"+target["target"]["id"]+"_row").append(code).ready(function () {
    $("#"+target["target"]["id"]+"_row #property span").text(target["target"]["property"])
    $("#dvTable tbody"+" #"+target["target"]["id"]+"_row #subject-object img").addClass("bg-"+networkGraph.colorCorrespondence[networkGraph.colorScale(target["target"]["type"])])
    if(!target["target"]["property"]){
      $("#"+target["target"]["id"]+"_row #property").hide()
      $("#"+target["target"]["id"]+"_row #subject-object a").attr("ondblclick", "clickMenuOptionTable(this)");
      $("#"+target["target"]["id"]+"_row #subject-object span").text(getTextMenuOptionExpert(target["target"]["value"]))
    }else{
      $("#"+target["target"]["id"]+"_row #subject-object span").text(target["target"]["value"])
    }
    if(navPanel.more_results){
      $(".cluster-check").parent().removeClass("hidden")
      showAddToGraph()
    }
  })

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
  emptyNavDetails()
  clickBubbleGraph(bubble,networkGraph.data)
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
  clickBubbleGraph(document.getElementById(clusterNode.id),networkGraph.data)
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

NavigationPanel.prototype.addMenuToTable = async function (){

  var navPanel=this;
  d3.selectAll(".menu-table").remove()
  var rowIndex=$('#myModal #'+ menuItems.node["id"]+"_row")[0].rowIndex
  let tBodyRef=$('#myModal #'+ menuItems.node["id"]+"_row")
  addCodeMenuTable(tBodyRef)
}

function addCodeMenuTable(tBodyRef){
  if(menuItems.node["class"]!="free"){
    addCodeMenuTableBasic(tBodyRef)
  }else{
    addCodeMenuTableExpert(tBodyRef)
  }

  async function addCodeMenuTableBasic(tBodyRef){
      let code = await getHtmlCodeFromFile("pages/menu-table.html");
    
      menuItems.selectedRows = menuItems.selectedRows.reverse();
      for (var i = 0; i < menuItems.selectedRows.length; i++) {
        let option_text=configFile.file[menuItems.selectedRows[i]["rowConfigFile"]]["option_text"]
        if(!tBodyRef){
          $('#myModal #dvTable tbody').append(code.replace("Menu Option",menuItems.selectedRows[i]["option"]).replace("Menu Option Tooltip",option_text).replace("menu-table-id",menuItems.node["id"]+"_menu-option_"+i));
        }else{
          $(code.replace("Menu Option",menuItems.selectedRows[i]["option"]).replace("Menu Option Tooltip",option_text).replace("menu-table-id",menuItems.node["id"]+"_menu-option_"+i)).insertAfter(tBodyRef);
        }
      }
  }
  
  async function addCodeMenuTableExpert(tBodyRef){
      let code = await getHtmlCodeFromFile("pages/menu-table-property.html");
    
      menuItems.selectedRows = menuItems.selectedRows.reverse();
      for (var i = 0; i < menuItems.selectedRows.length; i++) {
        let menuOption="Sparql Endpoint: "+ menuItems.selectedRows[i]["endpoint_url"]+" Position: " +positionFullText(menuItems.selectedRows[i]["position"])
        let tooltipText="Find all objects for the URI :" + d3.select("#"+node.id).data()[0].value + " in the SPARQL EndPoint: "+menuItems.selectedRows[i]["endpoint_url"]
        $(code.replace("Menu Option",menuOption).replace("Menu Option Tooltip",tooltipText).replace("menu-table-id",menuItems.node["id"]+"_menu-option_"+i)).insertAfter(tBodyRef);
/*         if(!tBodyRef){
          $(code.replace("Menu Option",menuOption).replace("Menu Option Tooltip",tooltipText).replace("menu-table-id",menuItems.node["id"]+"_menu-option_"+i)).insertAfter(tBodyRef);
        }else{
          $(code.replace("Menu Option",menuOption).replace("Menu Option Tooltip",tooltipText).replace("menu-table-id",menuItems.node["id"]+"_menu-option_"+i)).insertAfter(tBodyRef);
        }  */
      }
  }
}

NavigationPanel.prototype.addMenuToTableFromNav = async function (){
  var navPanel=this;
  showNavContentTable()
  hideNavContentTablePagination()
  addCodeMenuTable()
}

NavigationPanel.prototype.clickMenuTable = async function (row){
  let node=get_node_from_element(row.id.split("_menu-option_")[0])

  if(node.class!="free"){
    clickMenuTableBasic(row,node)
  }else{
    clickMenuTableExpert(row,node)
  }
  async function clickMenuTableBasic(row,node){
    let i=row.id.split("_menu-option_")[1]
    node.menuOption=menuItems.selectedRows[i]["option"]
    let graphType=await addBasicGraph(menuItems.selectedRows[i],node)
    if(graphType=="TREE"){
      clickBubbleGraph(document.getElementById(row.id.split("_menu-option_")[0]))
    }
  }
  async function clickMenuTableExpert(row,node){
    let miNumber=row.getAttribute("id").split("_menu-option_")[1]

    await addExpertGraph(menuItems.selectedRows[miNumber],node)
    clickBubbleGraph(document.getElementById(row.id.split("_menu-option_")[0]))
  }
}

class NavigationPanelNoDuplicates extends NavigationPanel {
  async addHtml() {
   var fi=this;
   super.addHtml();
 }
}

NavigationPanel.prototype.checkElementNav = async function (d,i){
  var navPanel=this;
  if(d.class!="free"){
    await navPanel.addElementNav(d,i)
  }else{
    if(i==0){
      await navPanel.addElementNav(d,i)
    }else{
      await navPanel.addElementNavProp(d,i)
      await navPanel.addElementNav(d,i)
    }
  }
}

NavigationPanel.prototype.labelGraph = function (menuOption){
  var navPanel=this,exists,label;
  if(navPanel.node.class!="free"){
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
      label=configFile.file.filter(d=>d.option==label)[0]["option_text"]
    }
  }else{
    label=`Sparql Endpoint: ` + menuOption[0]+ ` and Position: ` +menuOption[1]
  }

  return label
}
NavigationPanel.prototype.addTextToHeaderContentTable = function (){
  var navPanel=this
  if(navPanel.node.class!="free"){
    $("#dvTable #nav-children-header").text(configRow.option_text)
  }else{
    console.log(navPanel.node.menuOption)
    if(navPanel.node.menuOption){
      if(navPanel.node.menuOption!=""){
        if(navPanel.node.menuOption.split(";").length>1){
          $("#dvTable #nav-children-header").text("Several options displayed in graph. Click on each option to see results:");
        }else{
          $("#dvTable #nav-children-header").text(getTextMenuOptionExpert(navPanel.node.menuOption));
        }
      }else{
        $("#dvTable #nav-children-header").text("");   
      }
    }

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
  navigationPanel.valueSelected()
}
function clickMenuOptionTable(element){
  let id=$(element).closest('tr').attr('id').replace("_row","")
  clickBubbleGraph(document.getElementById(id))
}