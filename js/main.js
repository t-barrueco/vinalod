var nodes=[],links=[],data={},networkGraph,legend,navigationPanel,menuItems,configFileExp=null,dataInstances,allDataModel,
allData_at,allData_classSumLeg,nodesClasses,
nodesSelSources=[],nodesSelTarget=[],configRowsList=[],nodesClassesShow=[],nodesClassesCorrespondence,
filesIcons,colorCorrespondence={},classFilterHist=[],propertiesFilterHist=[],
graphHistory=[],filtersInGraph=[],filtersList=[],classesFilterList=[],optionsMenuHtml,showNavigation=true,numClicks = 0;
var timer = 0;
var delay = 200;
var prevent = false;
//console.log(navigationPanel)
function dataViz(){
    var optionsMenu;
    //get configuration from config_basicMode.json where all options for basic mode
    //are specified and get graph_icon.txt where icons shown on bubbles are specified
          d3.json("../config_vinalod/config_basicMode.json",function(dataConfig){
              d3.tsv("../config_vinalod/graph_icons.txt",function(dataIcons){
                //-----------configFile=dataConfig;
                configFile = new ConfigFile(dataConfig);
                filesIcons=dataIcons;
                //the collection chosen per default in the flyout menu is 
                //eu_vocabularies
                optionsMenu=configFile.filterByValueField("eu_vocabularies","collection")
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
  
async function buildBasicGraph(option,node){
    var sparqlQuery,modal2,prefixes;
    //////console.log("buildBasicGraph")
    //////console.log(arguments)
    //console.log(option)
    //console.log(node)
    if(typeof configRow !== 'undefined'){
      ////console.log(option)
      configRow.update(option,node)
    }else{
      configRow = new ConfigRow(option,node);
    }
    
    //console.log(configRow)
    prefixes=""

    //The graph type can be TREE, TIMELINE, TABLE, WORDCLOUD...
    if(configRow.rowFields.type=="TREE"){
      //////console.log("TREE")
      await buildNetworkGraph(configRow,"basic",node)
    }else{
      ////////////////////////console.log("other type config row")
      ////////////////////////console.log(configRow)
      //sparqlQuery=configRow.sparqlQuery
      deleteTooltip()
      sparqlQuery=configRow.rowFields.query
      ////////////////////////console.log(sparqlQuery)
      if (configRow.type=="TREEGRAPH"){
        modal2=getModal2()
        showTreegraph(node,sparqlQuery,modal2.modalHeader,modal2.modalContent,configRow)
        showModal("#myModal2")
      }else if (configRow.type=="WIKIPEDIA"){
        ////////////////////////////////////////////////////////////////////////console.log("WIKIPEDIA")
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
  console.log("fin build")
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
  //////////////////////////////////////console.log("collapse")
  $("#settings-legend").removeClass("hidden")
  $("#expand-settings-legend").addClass("hidden")
  $("#collapse-settings-legend").removeClass("hidden")
}

collapse_settings_legend.onclick = function() {
  //////////////////////////////////////console.log("collapse")
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
window.onclick = function(event) {
  ////////////console.log(event.target)
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
span2.onclick = function() {
  //////////////////////////////////////////////////////////////////////////////console.log($("#myModal2"))
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
  optionsMenu=configFile.file.filter(d=>d.collection==collection)
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
function handleNavigation(){
  //console.log("handleNavigation")
  //console.log(showNavigation)
  if(showNavigation){
    //console.log(navigation)
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

function collapse(){
  networkGraph.collapseAll()
}
function expand(){
  networkGraph.expandAll()
}