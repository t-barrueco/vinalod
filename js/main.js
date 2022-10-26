var data={},linkedDataGraph,networkGraph,legend,navigationPanel,menuItems,configFile,configRow,filesIcons,
nodesClasses,nodesSelSources=[],nodesSelTarget=[],configRowsList=[],
nodesClassesShow=[],nodesClassesCorrespondence,filesIcons,colorCorrespondence={},
optionsMenuHtml,showNavigation=true;
var timer = 0;
var delay = 200;
var prevent = false;



function dataViz(){
    var optionsMenu;

    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const graphName = urlParams.get('graph')

    ////////console.log(document.getElementsByTagName("table"))
    //get configuration from config_basicMode.json where all options for basic mode
    //are specified and get graph_icon.txt where icons shown on bubbles are specified
          d3.json("config_vinalod/config_basicMode.json",function(dataConfig){
              d3.tsv("config_vinalod/graph_icons.txt",function(dataIcons){
                $("#expand-settings-legend").css("background-color", "#064494");
                $("#collapse-settings-legend").css("background-color", "#064494");
                ////////console.log(dataConfig)
                configFile = new ConfigFile(dataConfig);
                filesIcons=dataIcons;
                if(graphName){
                  addSharedGraph(graphName)
                }
              })
          })
}

function getOptionsCollectionSelect(collection){
  $('#landing-page').hide();
  $('#dataviz-collection').show();
  $('#graph-area').addClass("hidden")
  $('#dataviz-collection article').remove()
  changeCollectionOptions(collection.value)
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

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  if(navigationPanel){
    navigationPanel.clusterElSelected=[]
  }
  
  $("#myModal").removeClass("translate-x-0")
  $("#myModal").addClass("translate-x-full")
}

// When the user clicks anywhere outside of the modal, close it
/* window.onclick = function(event) {
} */
d3.select('body')
.on('click', () => {
    d3.select(".contextMenu").remove();
});

var modal2 = document.getElementById("myModal2");

var span2 = document.getElementsByClassName("close2")[0];


// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  ////////////////////////////////////////////////////////////////////////////////////////////////////console.log($("#myModal2"))
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
  ////console.log("entra en download query")
  ////console.log(networkGraph.queriesArray)
  networkGraph.queriesArray.forEach(function(q){
    download([{"query":q}], 'testQuery.csv', 'text/csv;encoding:utf-8');       
  })
}

function downloadGraph(){

  let file=JSON.stringify({"treeData":networkGraph.treeData,"classesCorrespondence":networkGraph.nodesClassesShow,"filterClasses":networkGraph.filterClassesObjects})
  download(file, 'graph.json', 'text/json;encoding:utf-8');   
  
}
async function createGraph(fileText){
  d3.selectAll(".classFilter").remove()
  $("#filters .ecl-accordion__item").remove()

  $("#form-container").addClass("hidden")

  $(".graph").remove() 
  $("#networkGraph-svg").remove()  

  hideModal("#myModal")
  deleteTooltip()
  //hide flyout menu
  $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
  $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")

  $('#landing-page'). hide();
  $('#dataviz-collection'). hide();
  $('#graph-area').removeClass("hidden")

  tabOptionsGraphVisible()

  propertiesFilterHist=[]

  if((typeof linkedDataGraph !== 'undefined')&&(linkedDataGraph instanceof LinkedDataGraphBasic)){
    linkedDataGraph = undefined;
  }

  linkedDataGraph = new LinkedDataGraphBasic("imported");
  linkedDataGraph.importGraph(fileText)
  let forces=setForcesGraph()
  networkGraph = new NetworkGraphBasicImported("#networkGraph",forces,linkedDataGraph.data,fileText.classesCorrespondence,fileText.filterClasses);
  await networkGraph.initVis()

  legend=new Legend("legend",networkGraph)

  networkGraph.getFilters()

  if(networkGraph.filterClassesObjects.length!=0){
    $("#filters").removeClass("hidden")
  }else{
    $("#filters").addClass("hidden")
  }

}

function importGraph(file){

  file.files[0].text().then(text => {
    createGraph(JSON.parse(text))
  })
  async function createGraph(fileText){
    d3.selectAll(".classFilter").remove()
    $("#filters .ecl-accordion__item").remove()
  
    $("#form-container").addClass("hidden")
  
    $(".graph").remove() 
    $("#networkGraph-svg").remove()  
  
    hideModal("#myModal")
    deleteTooltip()
    //hide flyout menu
    $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
    $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  
    $('#landing-page'). hide();
    $('#dataviz-collection'). hide();
    $('#graph-area').removeClass("hidden")
  
    tabOptionsGraphVisible()
  
    propertiesFilterHist=[]
  
    if((typeof linkedDataGraph !== 'undefined')&&(linkedDataGraph instanceof LinkedDataGraphBasic)){
      linkedDataGraph = undefined;
    }
  
    linkedDataGraph = new LinkedDataGraphBasic("imported");
    linkedDataGraph.importGraph(fileText)
    let forces=setForcesGraph()
    networkGraph = new NetworkGraphBasicImported("#networkGraph",forces,linkedDataGraph.data,fileText.classesCorrespondence,fileText.filterClasses);
    await networkGraph.initVis()

    legend=new Legend("legend",networkGraph)
  
    networkGraph.getFilters()

    if(networkGraph.filterClassesObjects.length!=0){
      $("#filters").removeClass("hidden")
    }else{
      $("#filters").addClass("hidden")
    }
  
  }
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
function showCollections(){
  $("#collections-div").removeClass("hidden")
  $("#form-container form").hide()

  $(".graph").remove() 

  tabOptionsGraphNotVisible()
  filtersNotVisible()
  noOptionSelectedCollections()
}
function expertMode(){

  $("#graph-area").addClass("hidden")
  $("#landing-page").hide()
  $("#dataviz-collection").hide()
  $("#landing-text").addClass("hidden")

  tabOptionsGraphNotVisible()

  getHtmlFromFile("pages/expert.html","form-container")

  $("#collections-div").addClass("hidden")

  if(legend){
    legend.deleteAllColors()
  }

  if(networkGraph){
    networkGraph = undefined;
    legend=undefined
  }
}

function changeCollectionOptions(collection){
  let optionsMenu=configFile.file.filter(d=>d.collection==collection)
  appendHtmlOptions(optionsMenu)
}
function appendHtmlOptions(optionsMenu){
  $.get("pages/dataviz_collection.html", function (data) {
    optionsMenu.forEach(element => {
      html=data.replace("textTitle",element.option.trim()).replace("textComment",element.option_text.trim())
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

function addSharedGraph(file){

  d3.json("config_vinalod/aws-s3.json",async function(data){
    ////console.log(data)
    const albumBucketName=data["albumBucketName"]
    const bucketRegion=data["bucketRegion"]
    const IdentityPoolId=data["IdentityPoolId"]


  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
    })
  });

  var s3 = new AWS.S3();

  var params = {
    Bucket: albumBucketName, 
    Key: file
  };

  await s3.getObject(params, function(err, data) {
     if (err){
//console.log(err, err.stack); // an error occurred
     }else {
      const fileText = JSON.parse(data.Body.toString());
      createGraph(fileText)
     }              // successful response
   });
})

}

async function changeBasicGraph(option){

  //console.log("changeBasicGraph")
  //console.log(option)
  //INCLUIR EN FUNCIÓN
  d3.selectAll(".classFilter").remove()
  $("#filters .ecl-accordion__item").remove()

  $("#form-container").addClass("hidden")

  $(".graph").remove() 
  $("#networkGraph-svg").remove()  

  hideModal("#myModal")
  deleteTooltip()
  //hide flyout menu
  $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
  $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")

  $('#landing-page'). hide();
  $('#dataviz-collection'). hide();
  $('#graph-area').removeClass("hidden")

  tabOptionsGraphVisible()

  //build and show graph
  showBasicGraph()
  //reset global variables
  propertiesFilterHist=[]

  //get option selected for searching in Config File
  option=option.innerText.trim()

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

  networkGraph = new NetworkGraphBasicNotImported("#networkGraph",forces,linkedDataGraph.data);

  await networkGraph.initVis()
  networkGraph.getFilters()

  legend=new Legend("legend",networkGraph)

  if(networkGraph.filterClassesObjects.length!=0){
    $("#filters").removeClass("hidden")
  }else{
    $("#filters").addClass("hidden")
  }

}
function changeTab(tab){ 
  //////console.log(tab.id)
  $("#main-tabs .ecl-tabs__link--active").removeClass("ecl-tabs__link--active")
  $("#content-main-tabs .content-item").addClass("hidden")
  ////////console.log(tab.textContent)
  tab.classList.add("ecl-tabs__link--active");
  tab.setAttribute("aria-selected", "true")
  //////console.log(tab.id.replace("-tab","-content"))
  //////console.log($("#content-main-tabs #"+tab.id.replace("-tab","-content")))

  $("#content-main-tabs #"+tab.id.replace("-tab","-content")).removeClass("hidden")
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
  return forces
}
function clickBubbleGraph(element) {
  var node
  nodesSelSources = []
  nodesSelTarget = []

  closeNavigationPanel()
  
  node = d3.select("#" + element.getAttribute("id")).data()[0]

  
  //CAMBIAR LOS CAMPOS DEL CONFIGROW
  if(configRow){
    configRow.node=node
  }
  networkGraph.node=node

  //console.log(node)
  if (navigationPanel == undefined) {
    if(node.class!="free") navigationPanel= new NavigationPanelBasic(node);
    else navigationPanel= new NavigationPanelExpert(node);
  } else {
    emptyNavigationPanel()
    navigationPanel.element = element
    navigationPanel.node = node
    navigationPanel.init()
  }
  openNavigationPanel()
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
  }else if(origin=="table"){
    //console.log(element)
    //const parent = element.parentElement.closest('tr');
    node=getNodeFromTableRow(element)
  }

  if(menuItems){
    await menuItems.update(node)
  }else{
    if(node.class!="free"){
      menuItems= new MenuItemsBasic(node)
    }else{
      menuItems= new MenuItemsExpert(node)
    }
    await menuItems.init()
  }

  if(menuItems.selectedRows.length==0){
    ////////////////////console.log("entra")
    // if (founded[0]["children"]){
      //SE CONTRAE LOS CHILDREN
    //}else{
      //SE EXPANDEN LOS CHILDREN
    //} 
  }else if(menuItems.selectedRows.length==1){
    if(node.class!="free"){
      checkGraph(menuItems.selectedRows[0].option,node)
/*       await linkedDataGraph.update(menuItems.selectedRows[0].option,node)
      networkGraph.refresh() */
      //checkFilters()
    }else{
      if((linkedDataGraph)&&(linkedDataGraph instanceof LinkedDataGraphExpert)){
        await linkedDataGraph.update(menuItems.selectedRows[0],node)
        networkGraph.refresh()
      }else{
        await showGraphExpert(menuItems.selectedRows[0])
      }
    }
    clickBubbleGraph(document.getElementById(node.id))
  }else if(menuItems.selectedRows.length>1){
    if(origin=="table"){
      menuItems.getMenuItemsInTable()
    }else{
      if(menuItems.node.id){
        menuItems.getMenuItemsInGraph()
      }else{
        menuItems.getMenuItemsInPopup()
      }
      
    }
  }
}

async function showGraphExpert(selectedRow){
  $("#accordion-filters").empty()
  //console.log(selectedRow)
  linkedDataGraph = new LinkedDataGraphExpert("",selectedRow);
  await linkedDataGraph.settingsFromOption()

  let forces=setForcesGraph()

  $(".graph").remove()
  $("#graph-area").removeClass("hidden")
  $("#form-container form").hide()
  $("#landing-page").hide()
  $("#dataviz-collection").hide()
  $("#landing-text").addClass("hidden")

  tabOptionsGraphVisible()

  networkGraph = new NetworkGraphExpert("#networkGraph",forces,linkedDataGraph.data);

  await networkGraph.initVis()

  //console.log("antes de get filters")
  networkGraph.getFilters()

  legend=new Legend("legend",networkGraph)

  if(networkGraph.filterClassesObjects.length!=0){
    $("#filters").removeClass("hidden")
  }else{
    $("#filters").addClass("hidden")
  }
}
function showGraphExpertFromPopup(form){
  let newForm={"url":form.querySelector("#url").value,"uri":form.querySelector("#uri").value,"subject-object":form.querySelector("#subject-object").value}
  let selectedRow=menuItems.selectedRows.filter(d=>((d.url==newForm.url)&&(d.uri==newForm.uri)&&(d["subject-object"]==newForm["subject-object"])))[0]
  $("#form-container form").hide
  let modal = document.getElementById("myModal3")
  modal.style.display = "none";
  showGraphExpert(selectedRow)
}

async function getHtmlFromFile(file,location){
  await $.get(file, function (data) {
    let html=data
    $("#"+location).append($(html))
  });
}

async function getHtmlCodeFromFile(file) {
  var code;
  const promise = new Promise(function (resolve, reject) {
    $.get({
      url: file,
      success: resolve,
      error: reject
    });
  })
  
  code=await promise.then(function (resolve){
    return resolve
  })
  ;
  return code
}

function applyFilters(){
  linkedDataGraph.filter()
  networkGraph.refresh()
}

function startExpert(origin,element){
  $("#form-container form").hide()
  $("#filters").addClass("hidden")
  checkMenuItems(origin,element)
}

function shareGraph(){
  var fileName=Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+".json"
  
  addFile()
  return parent.location="mailto:?subject=VINALOD graph&body=Follow or copy the following link in your browser in order to see the graph shared%0D%0D%0D" + encodeURIComponent("https://t-barrueco.github.io/vinalod/index.html?graph="+fileName);
  
  function addFile(){

    d3.json("config_vinalod/aws-s3.json",function(data){
      const albumBucketName=data["albumBucketName"]
      const bucketRegion=data["bucketRegion"]
      const IdentityPoolId=data["IdentityPoolId"]

      AWS.config.update({
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: IdentityPoolId
        })
      });
  
      file=JSON.stringify({"treeData":networkGraph.treeData,"classesCorrespondence":networkGraph.nodesClassesShow,"filterClasses":networkGraph.filterClassesObjects})
      var upload = new AWS.S3.ManagedUpload({
          params: {
            Bucket: albumBucketName,
            Key: fileName,
            Body: file
          }
        });
      
        var promise = upload.promise();
      
        promise.then(
          function(data) {
          },
          function(err) {
            return alert("There was an error creating the graph share: ", err.message);
          }
        );
    })


  }
}
async function checkGraph(option,data){
  const rowInConfigFile=configFile.file.filter(c=>c.option==option)[0]
  //console.log(rowInConfigFile)
  if(rowInConfigFile["type"]=="TREE"){
    await linkedDataGraph.update(option,data)
    networkGraph.refresh()
  }else{
    //console.log(rowInConfigFile)
    checkNotTreeGraph(rowInConfigFile,data)
  }
  return rowInConfigFile["type"]
}
async function checkGraphExpert(form,data){
  //form = { "url": url, "uri": uri, "subject-object": subjectObject,"query":query}
  await linkedDataGraph.update(form,data)
  networkGraph.refresh()
  clickBubbleGraph(document.getElementById(data.id))
}
function tabOptionsGraphVisible(){
  $('#settings-tab').parent().removeClass("hidden")
  $('#legend-tab').parent().removeClass("hidden")
  $('#share-graph-div').removeClass("hidden")
  $('#save-graph-div').removeClass("hidden")
}

function tabOptionsGraphNotVisible(){
  $('#settings-tab').parent().addClass("hidden")
  $('#legend-tab').parent().addClass("hidden")
  $('#share-graph-div').addClass("hidden")
  $('#save-graph-div').addClass("hidden")
}

function filtersVisible(){
  $("#filters").removeClass("hidden")
}

function filtersNotVisible(){
  $("#filters").addClass("hidden")
}

async function clickMenuTable(row){
  navigationPanel.clickMenuTable(row)
}
function emptyNavigationPanel(){
  $("#nav-children-tbody").empty()
}

function openNavigationPanel(){
  $("#myModal").removeClass("translate-x-full")
  $("#myModal").addClass("translate-x-0")
}
function closeNavigationPanel(){
  $("#myModal").addClass("translate-x-full")
  $("#myModal").removeClass("translate-x-0")
}
function clickElNavigationPanel(el){
  //console.log(el)
  clickBubbleGraph(document.getElementById(el.id.replace("_a","")))
}
/* function relatedFilters(){
  //console.log(networkGraph.filterClassesObjects)
  networkGraph.filterClassesObjects.forEach(function (cf){
    //console.log(cf)
    cf.filters.forEach(function(f){
      //console.log(f)
      getValue(f)
    })
  })
  function getValue(f){
    if(f.details.filter_type=="dropdown"){
      //console.log(f.htmlEl.value)
    }
  }
} */
function relatedFilters(filter){
  var nodes = [];
  let name=filter.getAttribute("name")

  function recurse(node) {
    if(!node["hidden"]){
      if(networkGraph.filterClassesObjects.filter(d=>d.name==node.class).length>0){
        let filters=networkGraph.filterClassesObjects.filter(d=>d.name==node.class)[0].filters
        for (let i = 0; i < filters.length; ++i) { 
          if(getValue(filters[i],node[filters[i].details.property])){
            if (!nodes.includes(node)) nodes.push(node)
            if (node.children){
              nodes.push(node)
              node.children.forEach(function(c){
                  recurse(c)
              });
            }
          }else{
            break;
          }
        }
      }else{
        if (!nodes.includes(node)) nodes.push(node)
        if(node.children){
          node.children.forEach(function(c){
              recurse(c)
          });
        }
      }
    }

  }
  networkGraph.treeData.forEach(function(r){
    recurse(r);
  })
  console.log(nodes)
  setValuesFilters(nodes,name)

  function getValue(f,value){
    if(f.details.filter_type=="dropdown"){
      //console.log(f.htmlEl.value)
      //console.log(value)
      if(value){
        if((f.htmlEl.value==value.toLowerCase())||(f.htmlEl.value=="All")){
          return true;
        }else{
          return false;
        }
      }else{
        return false
      }
    }
  }
  //ldg.data={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.treeData};
}
function setValuesFilters(nodes,name){
  networkGraph.filterClassesObjects.forEach(function (cf){
    //console.log(cf)
    cf.setValuesFilters(nodes,name)
    /* cf.filters.forEach(function(f){
      if(f.details.property!=name){
        //console.log(f.htmlEl)
        //console.log(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))
        let valuesFilter=[...new Set(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))]
        removeOptionsSelect(f)
        addOptionsSelect(f.htmlEl,valuesFilter,false)
      }
    }) */
  })
}
function removeOptionsSelect(f){
  console.log(f)
  $("#"+f.htmlEl.getAttribute("id")).empty();
}
function clearFilters(){
  console.log("clearFilters")
  linkedDataGraph.clearFilter()
  networkGraph.filterClassesObjects.forEach(function (cf){
    cf.filters.forEach(function (f){
      console.log(f)
      f.addValuesField()
    })
  })
  networkGraph.refresh()
}
function noOptionSelectedCollections(){
  ////console.log("entra")
  document.getElementById("select-collections").value = "------------";
  //$('#select-collections option[value=------------]').attr('selected','selected');
  //$("#select-collections").val("------------").change()
  //$("#select_id").val("val2").change();
}