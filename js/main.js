var data={},networkGraph,legend,navigationPanel,menuItems,configFile,configRow,filesIcons,
nodesClasses,nodesSelSources=[],nodesSelTarget=[],configRowsList=[],
nodesClassesShow=[],nodesClassesCorrespondence,filesIcons,colorCorrespondence={},
optionsMenuHtml,showNavigation=true;
var timer = 0;
var delay = 200;
var prevent = false;
//////console.log(navigationPanel)
function dataViz(){
    var optionsMenu;
    
    //get configuration from config_basicMode.json where all options for basic mode
    //are specified and get graph_icon.txt where icons shown on bubbles are specified
          d3.json("../config_vinalod/config_basicMode.json",function(dataConfig){
              d3.tsv("../config_vinalod/graph_icons.txt",function(dataIcons){
                //-----------configFile=dataConfig;
                $("#expand-settings-legend").css("background-color", "#064494");
                $("#collapse-settings-legend").css("background-color", "#064494");

                configFile = new ConfigFile(dataConfig);
                //console.log(configFile)
                filesIcons=dataIcons;
                //the collection chosen per default in the flyout menu is 
                //eu_vocabularies
                /* optionsMenu=configFile.filterByValueField("eu_vocabularies","collection")
                //get html shown for every option in flyout menu chosen
                $.get("dataviz_collection.html", function (data) {
                //$.get("optionMainMenu.html", function (data) {
                    optionsMenuHtml=data
                    appendHtmlOptions(optionsMenu)
                }); */
              })
          })
  }
/* function updateAll(){
    networkGraph.updateAll();
  } */
function getOptionsCollection(collection){
  $('#landing-page'). hide();
  $('#dataviz-collection'). show();
  $('#graph-area'). hide();
  $('#dataviz-collection article').remove()
  //$('#basic-mode').attr("area-expanded","false");
  changeCollectionOptions(collection.id.trim())
}
async function buildBasicGraph(option,node){
    var sparqlQuery,modal2,prefixes;
    //////////console.log("buildBasicGraph")
    //////////console.log(arguments)
    //console.log(option)
    //console.log(node)
    $('#landing-page'). hide();
    $('#dataviz-collection'). hide();
    $('#graph-area'). show();
    console.log(option)
    console.log(node)
    if((node==undefined)||(!node["subject-object"])){
      if(typeof configRow !== 'undefined'){
        ////////console.log(option)
        configRow.update(option,node)
      }else{
        configRow = new ConfigRow(option,node);
      }
          //The graph type can be TREE, TIMELINE, TABLE, WORDCLOUD...
      if(configRow.rowFields.type=="TREE"){
        //////////console.log("TREE")
        await buildNetworkGraph(configRow,"basic",node)
      }else{
        ////////////////////////////console.log("other type config row")
        ////////////////////////////console.log(configRow)
        //sparqlQuery=configRow.sparqlQuery
        deleteTooltip()
        sparqlQuery=configRow.rowFields.query
        ////////////////////////////console.log(sparqlQuery)
        if (configRow.type=="TREEGRAPH"){
          modal2=getModal2()
          showTreegraph(node,sparqlQuery,modal2.modalHeader,modal2.modalContent,configRow)
          showModal("#myModal2")
        }else if (configRow.type=="WIKIPEDIA"){
          ////////////////////////////////////////////////////////////////////////////console.log("WIKIPEDIA")
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
      console.log(option)
      await buildNetworkGraph(option,"expert",node)
    }

    
    //////console.log(configRow)
    //prefixes=""


  ////console.log("fin build")
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
  //////////////////////////////////////////console.log("collapse")
  $("#settings-legend").removeClass("hidden")
  $("#expand-settings-legend").addClass("hidden")
  $("#collapse-settings-legend").removeClass("hidden")
}

collapse_settings_legend.onclick = function() {
  //////////////////////////////////////////console.log("collapse")
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
  ////////////////console.log(event.target)
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
  //////////////////////////////////////////////////////////////////////////////////console.log($("#myModal2"))
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
function get_parameters(parameters){
  var temp=[]
  parameters.forEach(function(d){
    temp.push(d["property"])
  })
  return temp
}
function expertMode(){
  if($("#flyoutMenu").hasClass("opacity-100")){
      $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
      $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  }
  //console.log("entra")
  $("#graph-area").addClass("hidden")
  $("#form-container form").show()
  $("#landing-page").hide()
  $("#dataviz-collection").hide()
  $("#landing-text").addClass("hidden")
  if(legend){
    legend.deleteAllColors()
  }

  if(networkGraph){
    networkGraph = undefined;
    legend=undefined
    //legend.deleteAllColors()
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
  var newCollection,oldCollection;
  //console.log(collection)
  //let value="eu_whoiswho"
  //window.location.href = "collection.html?collection="+value;
/*   oldCollection=$("#tabs-sections").find(".bg-blue-500")
  
  oldCollection.removeClass("bg-blue-500")
  oldCollection.addClass("bg-transparent")
  oldCollection.parent().removeClass("text-gray-900")
  oldCollection.parent().addClass("text-gray-500")

  if($("#"+collection).find(".bg-transparent").length==1){
      newCollection=$("#"+collection).find(".bg-transparent")
      newCollection.removeClass("bg-transparent")
      newCollection.addClass("bg-blue-500")
      newCollection.parent().addClass("text-gray-900")
      newCollection.parent().removeClass("text-gray-500")
  } */
  let optionsMenu=configFile.file.filter(d=>d.collection==collection)
  //console.log(optionsMenu)
  appendHtmlOptions(optionsMenu)
}
function test(){
  d3.json("../config_vinalod/config_basicMode.json",function(dataConfig){
      //-----------configFile=dataConfig;
      configFile = new ConfigFile(dataConfig);
      //console.log(configFile)
      //the collection chosen per default in the flyout menu is 
      //eu_vocabularies
      /* optionsMenu=configFile.filterByValueField("eu_vocabularies","collection")
      //get html shown for every option in flyout menu chosen
      $.get("dataviz_collection.html", function (data) {
      //$.get("optionMainMenu.html", function (data) {
          optionsMenuHtml=data
          appendHtmlOptions(optionsMenu)
      }); */
      //console.log("test")
      //console.log(configFile)
      const queryString = window.location.search;
      //console.log(queryString);
      const collection = new URLSearchParams(queryString).get('collection');
      //console.log(collection)
      changeCollectionOptions(collection)
})

}
//add html in flyout menu for every option
/* function appendHtmlOptions(optionsMenu){
  $("#options-menu").find("a").remove()
  optionsMenu.forEach(element => {
      html=optionsMenuHtml.replace("textTitle",element.option.trim()).replace("textComment",element.option_text.trim())
      $("#options-menu").append($(html))
  });
} */
function appendHtmlOptions(optionsMenu){
  //$("#dataviz-collection").find("a").remove()
  $.get("dataviz_collection.html", function (data) {
    optionsMenuHtml=data
    //appendHtmlOptions(optionsMenu)
    optionsMenu.forEach(element => {
      html=optionsMenuHtml.replace("textTitle",element.option.trim()).replace("textComment",element.option_text.trim())
      $("#dataviz-collection").append($(html))
  });
  });
}
function handleNavigation(){
  //////console.log("handleNavigation")
  //////console.log(showNavigation)
  if(showNavigation){
    //////console.log(navigation)
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
async function buildNetworkGraph(settingsGraph,branchType,node){
  let sparqlQuery=getQuery()
  let url=getEndpointUrl()
  console.log(settingsGraph)
  hideSpinMessage(interval)

  var interval=showSpinMessage("Waiting for Sparql query")
  let prefixes=""

  let queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  let settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  if(data){
    //////////console.log(data.treeData)
  }
  try {
    var results = await runSparlqQuery(settings);
    console.log(results)
    console.log("despues")
    //VER SI HAY MUCHOS RESULTADOS
    ////-------------------results = clusterResults(results, settingsGraph)
    //stop displaing message when executing query
    console.log(configRow)
    //hideSpinMessage(interval)
    console.log(configRow)
    //if no bubble is clicked or row in the table
    if((configRow==undefined)||(configRow.node==undefined)){
      console.log("entra en if")
      data=new Data(results,branchType)
      //add forces to graph
      setForcesGraph()

      //check if there is an object networkGraph already
      if(networkGraph){
        legend.deleteAllColors()
      }else{
        d3.selectAll(".graph").remove()
        networkGraph = new NetworkGraph("#networkGraph",forces,branchType,settingsGraph["rowNumber"]);
        legend=new Legend("legend")
      }

      networkGraph.collapseAll()
    }else{
      console.log("entra en else")
      networkGraph.addingGraph=true
      networkGraph.dblClickId=configRow.node.id.replace("_image","")+"_g"
      networkGraph.mergeData(results,"basic")
      ////console.log(networkGraph.data)
      networkGraph.refresh()

      legend.addColors(networkGraph.colorScale)

      
      //handleNavigation()

      //collapse graph if is basic type and hierarchy has more than two levels
      if(branchType=="basic"){
        //collapse(networkGraph.treeData.filter(d=>d.id==node.id)[0])
      }
      if(document.getElementsByClassName("d3-tip")[0]){
        document.getElementsByClassName("d3-tip")[0].remove()
        networkGraph.g.call(networkGraph.tip);
      }
    }
  } catch (e) {
    console.log(e)
    results = false
  }
  hideSpinMessage(interval)

  function getEndpointUrl(){
      var url;
      if(branchType=="basic"){
        url=configRow.rowFields.endpoint_url
      }else if(branchType=="expert"){
        //url=configRow.option.url
        url=settingsGraph.url
      }
      return url
  }
  function getQuery(){
    var sparqlQuery;
    if(branchType=="basic"){
        sparqlQuery=configRow.rowFields.query
    }else if(branchType=="expert"){
        sparqlQuery=buildExpertQuery()
    }
    return sparqlQuery
  }

  function buildExpertQuery(){
      var sparqlQuery;
      if (settingsGraph["subject-object"] == "s") {
          sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?s=<" + settingsGraph["uri"]+ ">).}"
      } else {
          sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?o=<" + settingsGraph["uri"] + ">).}"
      }
      return sparqlQuery
  }

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

/* async function checkAskResultsFreeGraph(node, so) {
var resultRows = []

return new Promise((resolve, reject) => {
  d3.csv("../config_vinalod/sparqlEndpoints.csv",async function(urls){
      ////////////////////////////////////////////console.log(urls)
      if (so == undefined) {
        subjectObject = ['s', 'o']
      } else {
        subjectObject = [so]
      }
      if (typeof node === 'object') {
        uri = d3.select("#" + node.id).data()[0].value
      } else {
        uri = node
      }
      for (var j = 0; j < subjectObject.length; j++) {
        for (var i = 0; i < urls.length; i++) {
          results = await runAskSparlqQueryFreeGraph(urls[i].sparqlEndpoint, uri, subjectObject[j])
          if (results == true) {
            resultRows.push({ "url": urls[i].sparqlEndpoint, "subject-object": subjectObject[j], "uri": uri })
          }
        }
      }
    resolve(resultRows)
  })
})
} */
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
  
function changeBasicGraph(option){
  //console.log(option)

  //console.log(option.textContent);
  //console.log(option.innerText);
  //remove filter, legend and graph
  d3.selectAll(".classFilter").remove()
  d3.selectAll(".graph").remove()   
                                                                     
  hideModal("#myModal")
  deleteTooltip()
  //reset global variables
  propertiesFilterHist=[]

  if(networkGraph){
    networkGraph = undefined;
    legend.deleteAllColors()
    legend=undefined
  }
  //graphHistory=[]

  //hide flyout menu
  $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
  $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  
  
  //build and show graph
  showBasicGraph()

  //get option selected for searching in Config File
  option=option.innerText.trim()
  
  buildBasicGraph(option)
}

/* async function addURLGraph(field) {
  var indexRows
  //MIRAR POR QUÉ SE PONE ESTO!!!!
  if (document.getElementById("navTable").querySelector('ol')) {
    document.getElementById("navTable").querySelector('ol').remove()
  }

  var resultRows =await checkAskResultsFreeGraph(field.querySelector('#free-uri').value, field.querySelector('#subject-object').value)
  //console.log(resultRows)
  if (resultRows.length > 1) {
    removeMsgNoResults()
    getOptionsWindow(resultRows)
  }else if (resultRows.length == 1) {
    removeMsgNoResults()
    origin = "first"
    //await buildFreeGraph(form, origin, node)
    await buildNetworkGraph(resultRows[0], "expert")
  } else if (resultRows.length == 0) {
    d3.selectAll(".graph").remove()
    addMsgNoResults()
  }
  if(resultRows.length!=0){
    $("#graph-area").removeClass("hidden")
    $("#form-container").addClass("hidden")
  }
  //return false
} */
async function checkMenuItems(origin,element) {
  //console.log(element)
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
  console.log(menuItems)
  if(menuItems){
    await menuItems.update(node)
  }else{
    console.log("crea uno nuevo")
    console.log(node)
    menuItems= new MenuItems(node)
    await menuItems.init()
  }
  //console.log(menuItems)
  hideSpinMessage(interval)
  console.log(menuItems.selectedRows)
  if(menuItems.selectedRows.length==0){
    console.log("entra")
    // if (founded[0]["children"]){
      //SE CONTRAE LOS CHILDREN
    //}else{
      //SE EXPANDEN LOS CHILDREN
    //} 
  }else if(menuItems.selectedRows.length==1){
    console.log(menuItems.selectedRows)
    if(menuItems.selectedRows[0]["subject-object"]){
      console.log(menuItems.selectedRows)
      await buildBasicGraph(menuItems.selectedRows[0],node)
    }else{
      await buildBasicGraph(menuItems.selectedRows[0].option,node)
      clickBubbleFreeGraph(element)
    }
  }else if(menuItems.selectedRows.length>1){
    ////////////////////console.log("mayor de 1")
    //getMenuItems(indexRows,node,origin,"basic")
    if(origin=="table"){
      menuItems.getMenuItemsInTable()
    }else{
      menuItems.getMenuItemsInGraph()
    }
  }
}
async function checkAskResultsFreeGraph(node, so) {
  var resultRows = []
  
  return new Promise((resolve, reject) => {
    d3.csv("../config_vinalod/sparqlEndpoints.csv",async function(urls){
        ////////////////////////////////////////////console.log(urls)
        if (so == undefined) {
          subjectObject = ['s', 'o']
        } else {
          subjectObject = [so]
        }
        if (typeof node === 'object') {
          uri = d3.select("#" + node.id).data()[0].value
        } else {
          uri = node
        }
        for (var j = 0; j < subjectObject.length; j++) {
          for (var i = 0; i < urls.length; i++) {
            results = await runAskSparlqQueryFreeGraph(urls[i].sparqlEndpoint, uri, subjectObject[j])
            if (results == true) {
              resultRows.push({ "url": urls[i].sparqlEndpoint, "subject-object": subjectObject[j], "uri": uri })
            }
          }
        }
      resolve(resultRows)
    })
  })
  }