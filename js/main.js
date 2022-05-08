var nodes=[],links=[],data={},networkGraph,legend,configFile=null,configFileExp=null,dataInstances,allDataModel,
dataInstancesRessourceLegal,allData_at,allData_classSumLeg,nodesClasses,
nodesSelSources=[],nodesSelTarget=[],execQueries=[],nodesClassesShow=[],nodesClassesCorrespondence,
filesIcons,colorCorrespondence={},classFilterHist=[],propertiesFilterHist=[],
graphHistory=[],filtersInGraph=[],filtersList=[],classesFilterList=[],optionsMenuHtml,showNavigation=true,numClicks = 0;
var timer = 0;
var delay = 200;
var prevent = false;

function dataViz(){
    var optionsMenu;
    //get configuration from config_basicMode.json where all options for basic mode
    //are specified and get graph_icon.txt where icons shown on bubbles are specified
          d3.json("../config_vinalod/config_basicMode.json",function(dataConfig){
              d3.tsv("../config_vinalod/graph_icons.txt",function(dataIcons){
                configFile=dataConfig;
                filesIcons=dataIcons;
                //the collection chosen per default in the flyout menu is 
                //eu_vocabularies
                optionsMenu=dataConfig.filter(d=>d.collection=="eu_vocabularies")
                //get html shown for every option in flyout menu chosen
                $.get("optionMainMenu.html", function (data) {
                    optionsMenuHtml=data
                    appendHtmlOptions(optionsMenu)
                });
              })
          })
  }
function updateAll(){
    networkGraph.updateAll();
  }
function forceYChecked(checked){
  networkGraph.forceProperties.forceY.enabled = checked; 
  updateAll();
}
function forceYStrength(value){
  networkGraph.forceProperties.forceY.strength=value; 
  updateAll();
}
function forceYY(value){
  networkGraph.forceProperties.forceY.y=value; 
  updateAll();
}
function forceCenterX(value){
  networkGraph.forceProperties.center.x=value; 
  updateAll()
}
function forceCenterY(value){
networkGraph.forceProperties.center.y=value;
updateAll();
}
function forceChargedChecked(checked){
  networkGraph.forceProperties.charge.enabled = checked; 
  updateAll()
}
function forceChargeStrength(value){
  networkGraph.forceProperties.charge.strength=value; 
  updateAll();
}
function forceChargeDistanceMin(value){
  networkGraph.forceProperties.charge.distanceMin=value; 
  updateAll()
}
function forceChargeDistanceMax(value){
  networkGraph.forceProperties.charge.distanceMax=value; 
  updateAll()
}
function forceCollideChecked(checked){
  networkGraph.forceProperties.collide.enabled = checked; 
  updateAll();
}
function forceCollideStrength(value){
  networkGraph.forceProperties.collide.strength=value; 
  updateAll();
}
function forceCollideRadius(value){
  networkGraph.forceProperties.collide.radius=value;
  updateAll();
}
function forceCollideIterations(value){
  networkGraph.forceProperties.collide.iterations=value;
  updateAll();
}
function forceXChecked(checked){
  networkGraph.forceProperties.forceX.enabled = checked; 
  updateAll();
}
function forceXStrength(value){
  networkGraph.forceProperties.forceX.strength=value; 
  updateAll();
}
function forceXX(value){
  networkGraph.forceProperties.forceX.x=value; 
  updateAll();
}
function forceLinksChecked(checked){
  networkGraph.forceProperties.link.enabled = checked; 
  updateAll();
}
function forceLinksDistance(value){
  networkGraph.forceProperties.link.distance=value; 
  updateAll();
}
function forceLinksIterations(value){
  networkGraph.forceProperties.link.iterations=value; 
  updateAll();
}

  
async function buildBasicGraph(rowDataConfig,node){
    var configRow,sparqlQuery,parameters,modal2,prefixes,configClasses;
    //console.log("buildBasicGraph")
    //get all fields from config file and save them in configRow.
    //configRow is an object with all fields from Config File Row.
    configRow=getFieldsConfigFile(configFile,rowDataConfig)

    //add a query to array. This will be used in download query menu option from right menu
    execQueries.push(configRow.sparqlQuery)
    
    //add all classes in the Config File line to configClasses
    /* configClasses = configFile.map(function(d) {
      return {
        class:d.class,
        option:d.option,
        option_text:d.option_text
      };
      }) */

    prefixes=""

    //When node is not undefined is because we call the function from a bubble as root and the Sparql Query has a PARAMETER
    if(node!=undefined){
      //if we come from a bubble clicked or a row in a table
      //we have to replace the PARAMETERS in the original query with the values
      //replaceParmtrsQuery()
      if(nodesClassesCorrespondence==null){
        nodesClassesCorrespondence=getClassesShow(configRow["classes"])
      } 
      nodesClassesCorrespondence=Object.assign(nodesClassesCorrespondence, getClassesShow(configRow.classes));
      nodesClassesShow=Array.from(new Set(nodesClassesShow.concat(Object.values(getClassesShow(configRow.classes)))))
    }
    //console.log(nodesClassesCorrespondence)
    //console.log(nodesClassesShow)
    //The graph type can be TREE, TIMELINE, TABLE, WORDCLOUD...
    if(configRow.graphType=="TREE"){
      //console.log(configRow)
      //console.log(node)
      ////console.log(configClasses)
      buildNetworkGraph(configRow,"basic",node)
    }else{
      ////////////console.log("other type config row")
      ////////////console.log(configRow)
      //sparqlQuery=configRow.sparqlQuery
      sparqlQuery=replaceParmtrsQuery(configRow,node)
      ////////////console.log(sparqlQuery)
      if (configRow.graphType=="TREEGRAPH"){
        modal2=getModal2()
        showTreegraph(node,sparqlQuery,modal2.modalHeader,modal2.modalContent)
        showModal("#myModal2")
      }else if (configRow.graphType=="WIKIPEDIA"){
        ////////////////////////////////////////////////////////////console.log("WIKIPEDIA")
        modal2=getModal2()
        showWikipediaPage(node,modal2.modalHeader,modal2.modalContent)
        showModal("#myModal2")
      }else if (configRow.graphType=="WEBPAGE"){
        modal2=getModal2()
        showWebPage(page,modal2.modalHeader,modal2.modalContent)
        showModal("#myModal2")
      }else if (configRow.graphType=="WEBPAGE_QUERY"){
        showWebPageQuery(node,sparqlQuery,configRow.url)
      }else if (configRow.graphType=="TIMELINE"){
        modal2=getModal2()
        showTimeLine(node,modal2.modalHeader,modal2.modalContent)
        showModal("#myModal2")
      }else if (configRow.graphType=="PDF"){
        modal2=getModal2()
        showPdf(node,sparqlQuery,configRow.url,modal2.modalHeader,modal2.modalContent)
        showModal("#myModal2")
      }else if (configRow.graphType=="TABLE"){
        modal2=getModal2()
        showTable(node,sparqlQuery,configRow,modal2.modalHeader,modal2.modalContent)
        showModal("#myModal2")
      }else if (configRow.graphType=="WORDCLOUD"){
        modal2=getModal2()
        showWordcloud(node,sparqlQuery,configRow,modal2.modalHeader,modal2.modalContent)
        showModal("#myModal2")
      }
    }

  }

//get all fields from config file. if the field does not exists it will be empty
function getFieldsConfigFile(configFile,rowDataConfig){
  var url, query,hierarchy,properties_full,options,option_text
  var graphType,classes,parameters,filters,tooltip,columns,property_names,detail

  if(configFile[rowDataConfig]["endpoint_url"]){
    endpoint_url=configFile[rowDataConfig]["endpoint_url"]
  }else{
    endpoint_url=""
  }

  if(configFile[rowDataConfig]["query"]){
    query=configFile[rowDataConfig]["query"]
  }else{
    query=""
  }

  if(configFile[rowDataConfig]["hierarchy"]){
    hierarchy=configFile[rowDataConfig]["hierarchy"]
  }else{
    hierarchy=""
  }
  
  if(configFile[rowDataConfig]["properties"]){
    properties_full=configFile[rowDataConfig]["properties"]
  }else{
    properties_full=""
  }
  
  if(configFile[rowDataConfig]["option"]){
    options=configFile[rowDataConfig]["option"]
  }else{
    options=""
  }

  if(configFile[rowDataConfig]["option_text"]){
    option_text=configFile[rowDataConfig]["option_text"]
  }else{
    option_text=""
  }

  if(configFile[rowDataConfig]["type"]){
    graphType=configFile[rowDataConfig]["type"]
  }else{
    graphType=""
  }

  if(configFile[rowDataConfig]["classes_text"]){
    classes=configFile[rowDataConfig]["classes_text"]
  }else{
    classes=""
  }
  
  if(configFile[rowDataConfig]["parameters"]){
    parameters=configFile[rowDataConfig]["parameters"]
  }else{
    parameters=""
  }

  if(configFile[rowDataConfig]["filters"]){
    filters=configFile[rowDataConfig]["filters"]
  }else{
    filters=""
  }

  if(configFile[rowDataConfig]["tooltip"]){
    tooltip=configFile[rowDataConfig]["tooltip"]
  }else{
    tooltip=""
  }

  if(configFile[rowDataConfig]["columns"]){
    columns=configFile[rowDataConfig]["columns"]
  }else{
    columns=""
  }

  if(get_property_names(properties_full)){
    property_names=get_property_names(properties_full)
  }else{
    property_names=""
  }

  if(configFile[rowDataConfig]["details"]){
    detail=configFile[rowDataConfig]["details"]
  }else{
    detail=""
  }

  return {"endpoint_url":endpoint_url,"query":query,"hierarchy":hierarchy,"properties_full":properties_full,
  "options":options,"option_text":option_text,"graphType":graphType,"classes":classes,"parameters":parameters,
  "filters":filters,"tooltip":tooltip,"columns":columns,"property_names":property_names,"detail":detail,"rowNumber":rowDataConfig}
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
  //////////////////////////console.log("collapse")
  $("#settings-legend").removeClass("hidden")
  $("#expand-settings-legend").addClass("hidden")
  $("#collapse-settings-legend").removeClass("hidden")
}

collapse_settings_legend.onclick = function() {
  //////////////////////////console.log("collapse")
  $("#settings-legend").addClass("hidden")
  $("#expand-settings-legend").removeClass("hidden")
  $("#collapse-settings-legend").addClass("hidden")
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  if(navigation){
    navigation.clusterElSelected=[]
  }
  
  $("#myModal").removeClass("translate-x-0")
  $("#myModal").addClass("translate-x-full")
}

// When the user clicks anywhere outside of the modal, close it
/* window.onclick = function(event) {
  if (event.target == modal) {
    $("#myModal").removeClass("translate-x-0")
    $("#myModal").addClass("translate-x-full")
  }
} */
d3.select('body')
.on('click', () => {
    d3.select(".contextMenu").remove();
});

var modal2 = document.getElementById("myModal2");

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close2")[0];


// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  //////////////////////////////////////////////////////////////////console.log($("#myModal2"))
  $("#myModal2").removeClass("translate-x-0")
  $("#myModal2").addClass("translate-x-full")
}

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
  execQueries.forEach(function(q){
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
  $("#graph-area").addClass("hidden")
  $("#form-container").removeClass("hidden")
  $("#landing-img").addClass("hidden")
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

  oldCollection=$("#tabs-sections").find(".bg-blue-500")
  
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
  }
  optionsMenu=configFile.filter(d=>d.collection==collection)
  appendHtmlOptions(optionsMenu)
}
//add html in flyout menu for every option
function appendHtmlOptions(optionsMenu){
  $("#options-menu").find("a").remove()
  optionsMenu.forEach(element => {
      html=optionsMenuHtml.replace("textTitle",element.option.trim()).replace("textComment",element.option_text.trim())
      $("#options-menu").append($(html))
  });
}
function handleNavigation(node){
  if(showNavigation){
    if (typeof (navigation) != "object") {
      navigation = new navigationPanel("freeGraph", node);
    } else if (navigation.type != "freeGraph") {
      navigation = new navigationPanel("freeGraph", node);
    } else {
      navigation.node=node
      navigation.init()
    }
  }
}
/* window.onclick = function(event) {

  ////////////console.log(document.getElementById("myModal").contains(event.target))
  ////////////console.log(event.target)
  if (document.getElementById("myModal").contains(event.target)) {
    ////////////console.log("hide")
    hideModal("#myModal");
  }
  } */
function collapse(){
  networkGraph.collapseAll()
}
function expand(){
  networkGraph.expandAll()
}