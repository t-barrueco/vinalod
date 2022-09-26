var data={},linkedDataGraph,networkGraph,legend,navigationPanel,menuItems,configFile,configRow,filesIcons,
nodesClasses,nodesSelSources=[],nodesSelTarget=[],configRowsList=[],
nodesClassesShow=[],nodesClassesCorrespondence,filesIcons,colorCorrespondence={},
optionsMenuHtml,showNavigation=true;
var timer = 0;
var delay = 200;
var prevent = false;

function dataViz(){
    var optionsMenu;
    console.log(document.getElementsByTagName("table"))
    //get configuration from config_basicMode.json where all options for basic mode
    //are specified and get graph_icon.txt where icons shown on bubbles are specified
          d3.json("/config_vinalod/config_basicMode.json",function(dataConfig){
              d3.tsv("/config_vinalod/graph_icons.txt",function(dataIcons){
                $("#expand-settings-legend").css("background-color", "#064494");
                $("#collapse-settings-legend").css("background-color", "#064494");
                console.log(dataConfig)
                configFile = new ConfigFile(dataConfig);
                filesIcons=dataIcons;
              })
          })
}
function getOptionsCollection(collection){
  $('#landing-page').hide();
  $('#dataviz-collection').show();
  $('#graph-area').addClass("hidden")
  $('#dataviz-collection article').remove()
  console.log(document.getElementsByTagName("table"))

  changeCollectionOptions(collection.innerText.trim())
}
async function buildBasicGraph(option,node){
    var sparqlQuery,modal2;
    $('#landing-page'). hide();
    $('#dataviz-collection'). hide();
    $('#graph-area').removeClass("hidden")
    console.log(document.getElementsByTagName("table"))

    if((node==undefined)||(!node["subject-object"])){
      if(typeof configRow !== 'undefined'){
        configRow.update(option,node)
      }else{
        configRow = new ConfigRow(option,node);
      }
          //The graph type can be TREE, TIMELINE, TABLE, WORDCLOUD...
      if(configRow.rowFields.type=="TREE"){
        await buildNetworkGraph(configRow,"basic",node)

      }else{
        deleteTooltip()
        sparqlQuery=configRow.rowFields.query
        if (configRow.type=="TREEGRAPH"){
          modal2=getModal2()
          showTreegraph(node,sparqlQuery,modal2.modalHeader,modal2.modalContent,configRow)
          showModal("#myModal2")
        }else if (configRow.type=="WIKIPEDIA"){
          modal2=getModal2()
          showWikipediaPage(node,modal2.modalHeader,modal2.modalContent,configRow)
          showModal("#myModal2")
        }else if (configRow.type=="WEBPAGE"){
          modal2=getModal2()
          showWebPage(page,modal2.modalHeader,modal2.modalContent)
          showModal("#myModal2")
        }else if (configRow.type=="WEBPAGE_QUERY"){
          showWebPageQuery(node,sparqlQuery,configRow.url)
        }else if (configRow.type=="TIMELINE"){
          modal2=getModal2()
          showTimeLine(node,modal2.modalHeader,modal2.modalContent,configRow)
          showModal("#myModal2")
        }else if (configRow.type=="PDF"){
          modal2=getModal2()
          showPdf(node,sparqlQuery,configRow.url,modal2.modalHeader,modal2.modalContent)
          showModal("#myModal2")
        }else if (configRow.type=="TABLE"){
          modal2=getModal2()
          showTable(node,sparqlQuery,configRow,modal2.modalHeader,modal2.modalContent)
          showModal("#myModal2")
        }else if (configRow.type=="WORDCLOUD"){
          modal2=getModal2()
          showWordcloud(node,sparqlQuery,configRow,modal2.modalHeader,modal2.modalContent)
          showModal("#myModal2")
        }
      }
    }else{
      await buildNetworkGraph(option,"expert",node)
    }
  }
function collapse(){

  networkGraph.collapseAll()
}
function expand(){
  networkGraph.expandAll()
}

// Get the modal
var modal = document.getElementById("myModal");

var span = document.getElementsByClassName("close")[0];

var expand_settings_legend = document.getElementById("expand-settings-legend");
var collapse_settings_legend = document.getElementById("collapse-settings-legend");

expand_settings_legend.onclick = function() {
  $("#settings-legend").removeClass("hidden")
  $("#expand-settings-legend").addClass("hidden")
  $("#collapse-settings-legend").removeClass("hidden")
}

collapse_settings_legend.onclick = function() {
  $("#settings-legend").addClass("hidden")
  $("#expand-settings-legend").removeClass("hidden")
  $("#collapse-settings-legend").addClass("hidden")
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  if(navigationPanel){
    navigationPanel.clusterElSelected=[]
  }
  
  $("#myModal").removeClass("translate-x-0")
  $("#myModal").addClass("translate-x-full")
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  //////////////////////////console.log(event.target)
  /* if (event.target == modal) {
    $("#myModal").removeClass("translate-x-0")
    $("#myModal").addClass("translate-x-full")
  } */
}
d3.select('body')
.on('click', () => {
    d3.select(".contextMenu").remove();
});

var modal2 = document.getElementById("myModal2");

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close2")[0];


// When the user clicks on <span> (x), close the modal
/* span2.onclick = function() {
  ////////////////////////////////////////////////////////////////////////////////////////////console.log($("#myModal2"))
  $("#myModal2").removeClass("translate-x-0")
  $("#myModal2").addClass("translate-x-full")
} */

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
}

function downloadData(element){
  
  var nodes = [],row2,classIndex,hierarchy,lastHierarchy,row={};
  root=networkGraph.treeData.filter(function(item) {
    if(item[item["class"]+"_uri"]!=undefined){
      return item[item["class"]+"_uri"] == element[element["class"]+"_uri"]
    }else{
      return item[item["class"]+"_code"] == element[element["class"]+"_code"]
    }
    
  })[0]

  for (let i = 0; i < nodesClasses.length; ++i) { 
    if(nodesClasses[i]==root["class"]){
      classIndex=i
    }
  }  
  hierarchy=nodesClasses.slice(classIndex, nodesClasses.length);

  lastHierarchy=hierarchy[hierarchy.length-1]

  if (root.children){
    root.children.forEach(function(r){
      row={}
      row[root["class"]]=root["value"]
      if(root[root["class"]+"_uri"]!=undefined){
        row[root["class"]+"_uri"]=root[root["class"]+"_uri"]
      }else{
        row[root["class"]+"_code"]=root[root["class"]+"_code"]
      }
      recurse(r);
      nodes.push(row)
    })
  }else if (root._children){
    root._children.forEach(function(r){
      row={}
      row[root["class"]]=root["value"]
      if(root[root["class"]+"_uri"]!=undefined){
        row[root["class"]+"_uri"]=root[root["class"]+"_uri"]
      }else{
        row[root["class"]+"_code"]=root[root["class"]+"_code"]
      }
      recurse(r);
      nodes.push(row)
    })
  }

  download(nodes, 'testDownload.csv', 'text/csv;encoding:utf-8');
  function recurse(node) {
    var i=0
    row[node["class"]]=node["value"]
    if(node[node["class"]+"_uri"]!=undefined){
      row[node["class"]+"_uri"]=node[node["class"]+"_uri"]
    }else{
      row[node["class"]+"_code"]=node[node["class"]+"_code"]
    }
    if (node["class"]==lastHierarchy){
      nodes.push(row)
      row={ ...row2};
    }else{
      row2={ ...row };
    }
    if(node.children){
        node.children.forEach(function(c){
          recurse(c)
      });     
    }else if (node._children){
        node._children.forEach(function(c){
          recurse(c)
        });
    }
  }
  
}
function downloadQuery(){
  configRowsList.forEach(function(q){
    download([{"query":q}], 'testQuery.csv', 'text/csv;encoding:utf-8');       
  })
}
function getTooltipNode(tooltip,nodeClass){
  var tooltipNode={}
  if(tooltip!=""){
    tooltip.forEach(function(k){
      if(k["property"].split("_")[0]==nodeClass){
        tooltipNode[k["property"]]=k["tooltip_text"]
      }
    })
  }
  return tooltipNode
}
function expertMode(){
  if($("#flyoutMenu").hasClass("opacity-100")){
      $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
      $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  }
  $("#graph-area").addClass("hidden")
  //$("#form-container form").show()
  $("#landing-page").hide()
  $("#dataviz-collection").hide()
  $("#landing-text").addClass("hidden")

  console.log($("#form-container"))
  getHtmlFromFile("expert.html","form-container")


  if(legend){
    legend.deleteAllColors()
  }

  if(networkGraph){
    networkGraph = undefined;
    legend=undefined
  }
}
function basicMode(){
  if($("#flyoutMenu").hasClass("opacity-0")){
      $("#flyoutMenu").addClass("transition ease-out duration-200")
      $("#flyoutMenu").removeClass("hidden opacity-0 translate-y-1")
      $("#flyoutMenu").addClass("opacity-100 translate-y-0")
  }else{
      changeCollectionOptions("eu_vocabularies")
      $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
      $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  } 
}
function changeCollectionOptions(collection){
  //console.log(collection)
  let optionsMenu=configFile.file.filter(d=>d.collection==collection)
  appendHtmlOptions(optionsMenu)
}
function appendHtmlOptions(optionsMenu){
  //console.log(optionsMenu)
  $.get("pages/dataviz_collection.html", function (data) {
    //console.log(data)
    optionsMenuHtml=data
    //console.log(document.getElementById("dataviz-collection"))
    console.log(optionsMenu)
    optionsMenu.forEach(element => {
      html=optionsMenuHtml.replace("textTitle",element.option.trim()).replace("textComment",element.option_text.trim())
      $("#dataviz-collection").append($(html))
  });
  });
}
function handleNavigation(){
  if(showNavigation){
    if (typeof (navigation) != "object") {
      navigation = new navigationPanel("freeGraph");
    } else if (navigation.type != "freeGraph") {
      navigation = new navigationPanel("freeGraph");
    } else {
      navigation.node=node
      navigation.init()
    }
  }
}

function clusterResults(results, settings) {
var ocurrences = [], small, big, results_small, results_big, num_occ, results_big_filtered;
if(settings["subject-object"]){
  var properties = results.map(function (r) {
    return r["p"]["value"]
  })
  var subjectObject=settings["subject-object"]
  var unique_properties = [...new Set(properties)]
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  unique_properties.forEach(function (d) {
    ocurrences.push({ "value": d, "ocurrences": countOccurrences(properties, d) })
  })
  small = ocurrences.filter(d => d.ocurrences <= 20).map(d => d.value)
  big = ocurrences.filter(d => d.ocurrences > 20).map(d => d.value)
  results_small = results.filter(r => small.includes(r["p"]["value"]))
  results_big = results.filter(r => big.includes(r["p"]["value"]))
  big.forEach(function (b) {
    results_big_filtered = results_big.filter(r => r["p"]["value"] == b)
    num_occ = ocurrences.filter(o => o.value == results_big[0]["p"]["value"])[0]["ocurrences"]
    if (subjectObject == "s") {
      results_small.push({ "o": { "type": results_big_filtered[0]["o"]["type"], "value": num_occ + " results", "more_results": results_big_filtered }, "p": results_big_filtered[0]["p"], "s": results_big_filtered[0]["s"], "class": "Cluster" })
    } else {
      results_small.push({ "s": { "type": results_big_filtered[0]["s"]["type"], "value": num_occ + " results", "more_results": results_big_filtered }, "p": results_big_filtered[0]["p"], "o": results_big_filtered[0]["o"], "class": "Cluster" })
    }
  })
  return results_small;
}else{
  return results;
}  
}

function treeDataNestedNodes(){
  var changedNodes=[]

  networkGraph.treeDataNested = JSON.parse(JSON.stringify(networkGraph.treeData));

  networkGraph.treeDataNested.forEach(function(r,index){

    if(index<(networkGraph.treeDataNested.length-1)){
      if(!changedNodes.includes(r[r["class"]+"_uri"])){
        copyDuplicates(index+1,-1,r)
        changedNodes.push(r[r["class"]+"_uri"])
      }
      r["children"].forEach(function(c,indexC){
        if(!changedNodes.includes(c[c["class"]+"_uri"])){
          copyDuplicates(index,indexC,c)
          changedNodes.push(c[c["class"]+"_uri"])
        }
      })
    }
  })
  return flatten_v2(networkGraph.treeDataNested)
}
function copyDuplicates(index,i,node){
  if(i!=-1){
    copyInChildren(index,i,node)
  }
  for (let j = index+1; j < networkGraph.treeDataNested.length; j++) {
    copyInParent(j,node)
    copyInChildren(j,0,node)
  }

  
  function copyInChildren(index,i,node){
    var childLength=networkGraph.treeDataNested[index]["children"].length
    for (let k = i; k < childLength; k++) {
      if((node[node["class"]+"_uri"]==networkGraph.treeDataNested[index]["children"][k][networkGraph.treeDataNested[index]["children"][k]["class"]+"_uri"])&&(node.id!=networkGraph.treeDataNested[index]["children"][k]["id"])){
        networkGraph.treeDataNested[index]["children"][k]=node
      }
    }
  }
  function copyInParent(j,node){
    if(node[node["class"]+"_uri"]==networkGraph.treeDataNested[j][networkGraph.treeDataNested[j]["class"]+"_uri"]){
      if(networkGraph.treeDataNested[j]["children"]){
        if(node["children"]){
          addChildren(node,j)
        }else{
          node["children"]=networkGraph.treeDataNested[j]["children"]
        }
      }
      networkGraph.treeDataNested[j]=node
    }
  }
  function addChildren(node,indexP){
    for (let l = 0; l < node["children"].length; l++) {
      if((networkGraph.treeDataNested[indexP]["children"].findIndex(d=>d.id==node["children"][l]["id"]))!=-1){
        node["children"].splice(l,1); 
      }
    }
    node["children"]=node["children"].concat(networkGraph.treeDataNested[j]["children"])
  }
}
// changeBasicGraph is the function called when changing option in flyout menu
// of basic mode menu
  
async function changeBasicGraph(option){

  //INCLUIR EN FUNCIÓN
  d3.selectAll(".classFilter").remove()
  $("#filters .ecl-accordion__item").remove()

  $("#form-container").addClass("hidden")
  //d3.selectAll(".graph").remove()   
  console.log($("#networkGraph-svg"))
  console.log($(".graph"))

  $(".graph").remove() 
  $("#networkGraph-svg").remove()  
  $("#networkGraph-svg").remove()  

  console.log($("#networkGraph-svg"))

  hideModal("#myModal")
  deleteTooltip()
  //hide flyout menu
  $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
  $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")

  $('#landing-page'). hide();
  $('#dataviz-collection'). hide();
  $('#graph-area').removeClass("hidden")
  //build and show graph
  showBasicGraph()
  console.log($("#networkGraph-svg"))

  //reset global variables
  propertiesFilterHist=[]
  //graphHistory=[]

  //get option selected for searching in Config File
  option=option.innerText.trim()
  
  //buildBasicGraph(option)
  /* if((typeof linkedDataGraph !== 'undefined')&&(linkedDataGraph instanceof LinkedDataGraphBasic)){
    linkedDataGraph.data.flatData={}
    linkedDataGraph.data.treeData=[]
    await linkedDataGraph.update(option)
    console.log(linkedDataGraph.data)
  }else{
    linkedDataGraph = new LinkedDataGraphBasic(option);
    await linkedDataGraph.settingsFromOption()
  } */

  if((typeof linkedDataGraph !== 'undefined')&&(linkedDataGraph instanceof LinkedDataGraphBasic)){
    linkedDataGraph = undefined;
  }

  linkedDataGraph = new LinkedDataGraphBasic(option);
  await linkedDataGraph.settingsFromOption()

  let forces=setForcesGraph()

  if(networkGraph){
    networkGraph = undefined;
    legend.deleteAllColors()
    legend=undefined
  }

  //if(networkGraph){
  //  legend.deleteAllColors()
  //}else{
  console.log($(".graph"))
  //$(".graph").remove()
  console.log(linkedDataGraph.data)
  networkGraph = new NetworkGraphBasic("#networkGraph",forces,linkedDataGraph.data);
  ////////console.log(networkGraph)
  console.log($(".graph"))
  legend=new Legend("legend",networkGraph)

  if(configRow.rowFields.filters){
    if(configRow.rowFields.filters.length!=0){
      networkGraph.filters=configRow.rowFields.filters;
      console.log(networkGraph.filters)
      addFilters()
      $("#filters").removeClass("hidden")
    }else{
      $("#filters").addClass("hidden")
    }
  }else{
    $("#filters").addClass("hidden")
  }


  console.log(document.getElementsByTagName("table"))

  //addFilters()
  //}

}
/* async function checkMenuItems(origin,element) {
  ////////////console.log(element)
  if(origin=="form"){
    node={"uri":element.querySelector('#free-uri').value, "subject-object":element.querySelector('#subject-object').value}
  }else if(origin=="graph"){
    if(element instanceof Element){
      //founded=findNodeTreemap(element.getAttribute("id").replace("_image",""),vis.treeData)
      node=get_node_from_element(element.getAttribute("id").replace("_image",""))
    }else{
      //founded=findNodeTreemap(element,vis.treeData)
      node=element
    }
  }
  //////////console.log(menuItems)
  if(menuItems){
    await menuItems.update(node)
  }else{
    //////////console.log("crea uno nuevo")
    //////////console.log(node)
    menuItems= new MenuItems(node)
    await menuItems.init()
  }
  ////////////console.log(menuItems)
  hideSpinMessage(interval)
  //////////console.log(menuItems.selectedRows)
  if(menuItems.selectedRows.length==0){
    //////////console.log("entra")
    // if (founded[0]["children"]){
      //SE CONTRAE LOS CHILDREN
    //}else{
      //SE EXPANDEN LOS CHILDREN
    //} 
  }else if(menuItems.selectedRows.length==1){
    //////////console.log(menuItems.selectedRows)
    if(menuItems.selectedRows[0]["subject-object"]){
      //////////console.log(menuItems.selectedRows)
      await buildBasicGraph(menuItems.selectedRows[0],node)
    }else{
      await buildBasicGraph(menuItems.selectedRows[0].option,node)
      clickBubbleFreeGraph(element)
    }
  }else if(menuItems.selectedRows.length>1){
    //////////////////////////////console.log("mayor de 1")
    //getMenuItems(indexRows,node,origin,"basic")
    if(origin=="table"){
      menuItems.getMenuItemsInTable()
    }else{
      menuItems.getMenuItemsInGraph()
    }
  }
} */
function setForcesGraph(){
  forces = {
    center: {
        x: 0.5,
        y: 0.5
    },
    charge: {
        enabled: true,
        strength: -800,
        distanceMin: 100,
        distanceMax: 2000
    },
    collide: {
        enabled: false,
        strength: .2,
        iterations: 1,
        radius: 5
    },
    forceX: {
        enabled:true,
        strength: .1,
        x: .2
    },
    forceY: {
        enabled: true,
        strength: .1,
        y: .2
    },
    link: {
        enabled: true,
        distance: 100,
        iterations: 1
    }
  }
  return forces
}
function clickBubbleFreeGraph(element) {
  var node
  nodesSelSources = []
  nodesSelTarget = []

  node = d3.select("#" + element.getAttribute("id")).data()[0]

  //CAMBIAR LOS CAMPOS DEL CONFIGROW
  if(configRow){
    configRow.node=node
  }
  networkGraph.node=node
  //throw new Error("Something went badly wrong!");
  //console.log(navigation)
  //console.log(navigationPanel)

  if (navigationPanel == undefined) {
    navigationPanel= new NavigationPanel("freeGraph", node);
  } else {
    navigationPanel.element = element
    navigationPanel.node = node
    //navigation.init()
  }
  $("#myModal").removeClass("translate-x-full")
  $("#myModal").addClass("translate-x-0")
}
async function checkMenuItems(origin,element) {
  if(origin=="form"){
    node={"uri":element.querySelector('#free-uri').value, "subject-object":element.querySelector('#subject-object').value,"class":element.querySelector('#class-node').value}
  }else if(origin=="graph"){
    if(element instanceof Element){
      node=get_node_from_element(element.getAttribute("id").replace("_image",""))
    }else{
      node=element
    }
  }

  if(menuItems){
    ////////console.log(node)
    await menuItems.update(node)
  }else{
    if(node.class!="free"){
      menuItems= new MenuItemsBasic(node)
    }else{
      menuItems= new MenuItemsExpert(node)
    }
    await menuItems.init()
  }

  ////////console.log(menuItems.selectedRows)
  if(menuItems.selectedRows.length==0){
    ////////////console.log("entra")
    // if (founded[0]["children"]){
      //SE CONTRAE LOS CHILDREN
    //}else{
      //SE EXPANDEN LOS CHILDREN
    //} 
  }else if(menuItems.selectedRows.length==1){

    if(node.class!="free"){
      await linkedDataGraph.update(menuItems.selectedRows[0].option,node)
      networkGraph.refresh()
    }else{
      if((linkedDataGraph)&&(linkedDataGraph instanceof LinkedDataGraphExpert)){
        await linkedDataGraph.update(menuItems.selectedRows[0],node)
        networkGraph.refresh()
      }else{
        showGraphExpert(menuItems.selectedRows[0])
      }
    }

  }else if(menuItems.selectedRows.length>1){
    if(origin=="table"){
      menuItems.getMenuItemsInTable()
    }else{
      ////////console.log(menuItems.node)
      if(menuItems.node.id){
        menuItems.getMenuItemsInGraph()
      }else{
        menuItems.getMenuItemsInPopup()
      }
      
    }
  }
}
function startExpert(origin,element){
  $("#form-container form").hide()
  $("#filters").addClass("hidden")
  checkMenuItems(origin,element)
}
async function showGraphExpert(selectedRow){
  console.log("showGraphExpert")
  console.log(linkedDataGraph)
  linkedDataGraph = new LinkedDataGraphExpert("",selectedRow);
  await linkedDataGraph.settingsFromOption()
  
  ////////console.log("antes de networkgraph")
  let forces=setForcesGraph()
  ////////console.log(networkGraph)
  ////////console.log(linkedDataGraph.data)
  console.log($("#graph-area"))
  console.log($(".graph"))
  $(".graph").remove()
  $("#graph-area").removeClass("hidden")
  $("#form-container form").hide()
  $("#landing-page").hide()
  $("#dataviz-collection").hide()
  $("#landing-text").addClass("hidden")
  networkGraph = new NetworkGraphExpert("#networkGraph",forces,linkedDataGraph.data);
  legend=new Legend("legend",networkGraph)
}
function showGraphExpertFromPopup(form){
  ////////console.log(form)
  let newForm={"url":form.querySelector("#url").value,"uri":form.querySelector("#uri").value,"subject-object":form.querySelector("#subject-object").value}
  let selectedRow=menuItems.selectedRows.filter(d=>((d.url==newForm.url)&&(d.uri==newForm.uri)&&(d["subject-object"]==newForm["subject-object"])))[0]
  $("#form-container form").hide
  let modal = document.getElementById("myModal3")
  modal.style.display = "none";
  showGraphExpert(selectedRow)
}
function showHideFilter(filter){
  ////////console.log(filter)
  //////////console.log(this)
  let content=filter.parentNode.parentNode.getElementsByClassName("ecl-accordion__content").item(0)
  if(content.hasAttribute("hidden")){
    content.removeAttribute("hidden")
  }else{
    content.setAttribute("hidden","")
  }
  //////////console.log(this)

  //////////console.log(this.getElementsByClassName("ecl-accordion__content"))

}
async function getHtmlFromFile(file,location){
  await $.get(file, function (data) {
    let html=data
    //html=optionsMenuHtml.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.filterText)
    $("#"+location).append($(html))
  });
}
async function getHtmlFromFileToElement(file,element){
  ////////console.log(element)
  await $.get(file, function (data) {
    let html=data
    element.insertAdjacentHTML('beforeend', html);
  });
  ////////console.log(element)
}
function getHtmlFromFiles(files){
  var filesCode={}
  ////////console.log(element)

  files.forEach(async function(f){
    await $.get(f, function (data) {
      filesCode['"'+f+'"']=data
    });
  })
  //////console.log(filesCode)
  return filesCode
  ////////console.log(element)
}

function getHtmlCodeFromFile(file){
  console.log(file)
  return new Promise((resolve, reject) => {
    $.get({
      url: file,
      success: resolve,
      error: reject
    });
  });
}
/* async function insertCodeInElement(elementId,file){

const code = await getHtmlCodeFromFile(file);

////console.log(code)

//let html=data
$("#"+elementId).append(code)
//element.insertAdjacentHTML('beforeend', code);
//////console.log(element)
} */

function addFilters(){
  console.log(networkGraph.filters)
  if(networkGraph.filters!=null){
    networkGraph.filterClasses = [...new Set(networkGraph.filters.map(d=>d.class))]
    networkGraph.filterClasses.forEach(function(d){
      classFilterObject= new classFilterClass(d)
    })
  }

  ////console.log(networkGraph.filters.map(d=>d.class))
  //classFilterObject= new classFilterClass(classFilter)
}
function changeTab(tab){ 
  console.log(tab.id)
  $("#main-tabs .ecl-tabs__link--active").removeClass("ecl-tabs__link--active")
  $("#content-main-tabs ul").addClass("hidden")
  //console.log(tab.textContent)
  tab.classList.add("ecl-tabs__link--active");
  tab.setAttribute("aria-selected", "true")
  $("#content-main-tabs #"+tab.id.replace("-tab","-content")).removeClass("hidden")
}