var data={},
linkedDataGraph,networkGraph,legend,navigationPanel,menuItems,configFile,configRow,filesIcons,
nodesClasses,nodesSelSources=[],nodesSelTarget=[],configRowsList=[],
nodesClassesShow=[],nodesClassesCorrespondence,filesIcons,colorCorrespondence={},
optionsMenuHtml,showNavigation=true,mnemonicCodes;
var timer = 0;
var delay = 400;
var prevent = false;


//this function will be execute when loading the page in <body> onload
function dataViz(){
    //If a graph is shared the name of the graph will be added to the url
    //we get the graph name from the url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const graphName = urlParams.get('graph')

    //WE READ THE FOLLOWING FILES:
    //config_basicMode.json -> config file where all options for basic mode are stored
    //graph_icon.txt -> where icons shown on bubbles are specified
    //query_mnemonic.txt -> query for getting mnemonic codes for organisations
    //sparqlEndpoints.csv -> endpoints urls used in expert mode where we search for the url
          d3.json("config_vinalod/config_basicMode.json",function(dataConfigBasic){
              d3.text("config_vinalod/query_mnemonic.txt",function(dataMnemonicCodes){
                d3.tsv("config_vinalod/graph_icons.txt",function(dataIcons){
                  d3.csv('../config_vinalod/sparqlEndpoints.csv',async function(dataConfigExpert){
                    //create configFile for basic mode with data from config_basicMode.json
                    configFile = new ConfigFileBasic(dataConfigBasic);
                    //create configFile for expert mode with data from sparqlEndpoints.csv
                    configFileExpert=new ConfigFileExpert(dataConfigExpert);
                    //get all uris with mnemonicCode. This code will be shown instead of icons
                    mnemonicCodes=await getMnemonicCodes(dataMnemonicCodes);
                    //icons for bubbles in basic mode will be stored in filesIcons
                    filesIcons=dataIcons;
                    //if a graph name is added to the url we will show the graph shared
                    if(graphName){
                      addSharedGraphInUrl(graphName)
                    }
                  }) 
                })
              })
          })
}

//run the query that gets all uris with mnemonicCode
async function getMnemonicCodes(sparqlQuery){
  results = await runSparlqQuery("https://publications.europa.eu/webapi/rdf/sparql",sparqlQuery,"query")
  return results
}

//when a new collection is selected in the selection field we get all options
//of basic graphs added to the config file
function getOptionsCollectionSelect(collection){
  //visibility
  //landingPageNotVisible()
  hideGraphArea()
  showPageCollection()

  //remove all options from previous collections
  $('#dataviz-collection article').remove()

  changeCollectionOptions(collection.value)
}

//get options from config file and show them as different choices in a page
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

//when collapse button is clicked
function collapse(){
  networkGraph.collapseAll()
}
//when expand button is clicked
function expand(){
  networkGraph.expandAll()
}

//run when click on download data context menu option
function downloadData(){
  
  var data = [];

  networkGraph.data.links.forEach(function (l){
    if(l.target.property){
      data.push({"from":l.source.value,"property/relation":l.target.property,"to":l.target.value})
    }else{
      data.push({"from":l.source.value,"property/relation":l.relation,"to":l.target.value})
    }
  })

  download(data, 'graphDataFromVINALOD.csv', 'text/csv;encoding:utf-8');

/*   root=networkGraph.treeData.filter(function(item) {
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
  console.log(nodes)
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
  } */
  
}

//create a file whith all queries that have been run to construct the graph
function downloadQuery(){
/*   var data=[]
  networkGraph.queriesArray.forEach(function(q){
    da
  }) */
  download(networkGraph.queriesArray, 'sparqlQueriesFromVINALOD.csv', 'text/csv;encoding:utf-8');       

}

//create json data from graph for being exported or shared
function getDataToFile(){
  var navPanelNode;
  if(getNavPanelVisibility()){
    navPanelNode=navigationPanel.node
  }else{
    navPanelNode=none
  }
  let file=JSON.stringify({"treeData":networkGraph.treeData,"classesCorrespondence":networkGraph.nodesClassesShow,"filterClasses":networkGraph.filterClassesObjects,"configRow":configRow,"navPanelNode":navPanelNode})
  return file
}

//create and save JSON file that has data from the graph and save it to file. Launch from menu 'Save graph for later?'
function downloadGraph(){

  //let file=JSON.stringify({"treeData":networkGraph.treeData,"classesCorrespondence":networkGraph.nodesClassesShow,"filterClasses":networkGraph.filterClassesObjects})
  let file=getDataToFile()
  download(file, 'graph.json', 'text/json;encoding:utf-8');   
  
}

//create graph from JSON file passed as parameter
async function createGraphFromFile(fileText){

  //hide all elements from previous graphs
  hideElements()

  //show elements from tabs menu on the top that are visible when a graph is showed
  tabOptionsGraphVisible()

  //propertiesFilterHist=[]

/*   if((typeof linkedDataGraph !== 'undefined')&&(linkedDataGraph instanceof LinkedDataGraphBasic)){
    linkedDataGraph = undefined;
  } */

/*   if(typeof linkedDataGraph !== 'undefined'){
    linkedDataGraph = undefined;
  } */

  //create a new element for storing the data. We specify that it is imported data
  linkedDataGraph = new LinkedDataGraphBasic("imported");

  //import data into object that contains the data for the network graph
  linkedDataGraph.importGraph(fileText)

  //set networkgraph forces
  let forces=setForcesGraph()

  //create networkgraph with elements from the fileText that contains the data
  networkGraph = new NetworkGraphBasicImported("#networkGraph",forces,linkedDataGraph.data,fileText.classesCorrespondence,fileText.filterClasses);
  await networkGraph.initVis()

  //create colors legend
  legend=new Legend("legend",networkGraph)

  //add filters that has been stored in the fileText
  networkGraph.getFilters()

  //open navpanel if navpanel was opened when sharing or exporting the graph
  if(fileText.navPanelNode!="None"){
    clickBubbleGraph(document.getElementById(fileText.navPanelNode.id))
  }

  networkGraph.refreshNoFilters()

/*   if(networkGraph.filterClassesObjects.length!=0){
    $("#filters").removeClass("hidden")
  }else{
    $("#filters").addClass("hidden")
  } */

}

//function launched when click on import button in menu
function importGraph(file){
  console.log(file)
  file.files[0].text().then(text => {
    createGraphFromFile(JSON.parse(text))
  })

  //remove value from file imported
  document.getElementById('import-file').value = null;
/*   async function createGraph(fileText){
    d3.selectAll(".classFilter").remove()
    $("#filters .ecl-accordion__item").remove()
  
    hideExpertForm()
    removeGraph()
    $("#networkGraph-svg").remove()  
  
    closeNavigationPanel()
    deleteTooltip()
    //hide flyout menu
    //$("#flyoutMenu").removeClass("opacity-100 translate-y-0")
    //$("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  
    //landingPageNotVisible()
    hidePageCollection()
    showGraphArea()
  
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
  
  } */
}

//add graph when added in url
//graph data stored in aws s3 bucket
function addSharedGraphInUrl(file){

  //get details for aws s3 bucket on file
  d3.json("config_vinalod/aws-s3.json",async function(data){
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
      /// TO DO???????????????
     }else {
      //get data from file
      const fileText = JSON.parse(data.Body.toString());
      //create graph
      createGraphFromFile(fileText)
     }             
   });
})

}

//visibility options when click on basic mode radio button
function showCollections(){
  collectionOptionsVisible()
  hideExpertForm()
  removeGraph()
  tabOptionsGraphNotVisible()
  filtersNotVisible()
  noOptionSelectedCollections()
}

//show form to enter data for expert mode.
// This form will be shown if the expert radio button is clicked
function expertMode(){

  //hide elements from previous graphs or options
  hideElements()
  //show tabs in main menu when graph is not shown
  tabOptionsGraphNotVisible()
  removeColorsFromLegend()
  //get html code for expert form
  getHtmlFromFile("pages/expert.html","form-container")

  collectionOptionsNotVisible()

  //if networkGraph exists we remove the objects
  if(networkGraph){
    networkGraph = undefined;
    legend=undefined
  }
}




/* function handleNavigation(){
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
} */


//launched if option selected in when page that shows collection options is added
async function changeBasicGraph(option){

  removePreviousFilters()
/*   d3.selectAll(".classFilter").remove()
  $("#filters .ecl-accordion__item").remove() */

  hideExpertForm()
  removeGraph()
  //$("#networkGraph-svg").remove()  

  closeNavigationPanel()
  deleteTooltip()
  //hide flyout menu
  /* $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
  $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1") */

  //landingPageNotVisible()
  hidePageCollection()
  showGraphArea()
  removeColorsFromLegend()
  tabOptionsGraphVisible()

  //build and show graph
  //showBasicGraph()

  //reset global variables
  //propertiesFilterHist=[]

  if(typeof linkedDataGraph !== 'undefined'){
    linkedDataGraph = undefined;
  }

  linkedDataGraph = new LinkedDataGraphBasic(option);
  await linkedDataGraph.settingsFromOption()

  let forces=setForcesGraph()

  if(networkGraph){
    networkGraph = undefined;
    legend=undefined
  }

  //showSpinMessage()
  networkGraph = new NetworkGraphBasicNotImported("#networkGraph",forces,linkedDataGraph.data);

  await networkGraph.initVis()
  //hideSpinMessage()
  ////////////console.log("antes de getFilters")
  networkGraph.getFilters()

  legend=new Legend("legend",networkGraph)

/*   if(networkGraph.filterClassesObjects.length!=0){
    $("#filters").removeClass("hidden")
  }else{
    $("#filters").addClass("hidden")
  } */
  networkGraph.collapseAll()
  ////////////console.log("autoInit")
  ////////////console.log(ECL.autoInit());

}
function changeTab(tab){ 
  $("#main-tabs .ecl-tabs__link--active").removeClass("ecl-tabs__link--active")
  $("#content-main-tabs .content-item").addClass("hidden")
  tab.classList.add("ecl-tabs__link--active");
  tab.setAttribute("aria-selected", "true")

  $("#content-main-tabs #"+tab.id.replace("-tab","-content")).removeClass("hidden")
}

function clickBubbleGraph(element) {
  var node
  nodesSelSources = []
  nodesSelTarget = []

  closeNavigationPanel()
  
  //////console.log(element)
  //////console.log(element.getAttribute("id"))
  if(element){
    node = d3.select("#" + element.getAttribute("id")).data()[0]
  }else{
    node=networkGraph.treeData[0]
  }
  
  //////console.log(node)
  
  //CAMBIAR LOS CAMPOS DEL CONFIGROW
  if(configRow){
    configRow.node=node
  }
  networkGraph.node=node

  fitSizeModal(node)

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
  //ECL.autoInit()
}
async function checkMenuItems(origin,element) {
  var position;
  if(origin=="form"){
    node={"uri":element.querySelector('#free-uri').value, "position":element.querySelector('#subject-object').value,"class":element.querySelector('#class-node').value}
    position=element.querySelector('#subject-object').value
  }else if(origin=="graph"){
    if(element instanceof Element){
      node=get_node_from_element(element.getAttribute("id").replace("_image",""))
    }else{
      node=element
    }
  }else if(origin=="table"){
    node=getNodeFromTableRow(element)
  }else if(origin=="navigation"){
    node=get_node_from_element(element.getAttribute("id").replace("_a",""))
  }
  
/*   if(menuItems){
    //console.log(node.class)
    //console.log(menuItems)
    if(((node.class!="free")&&(menuItems instanceof MenuItemsBasic))||((node.class=="free")&&(menuItems instanceof MenuItemsExpert))){
      //console.log("menuItems.update()")
      await menuItems.update(node)
    }else if(node.class!="free"){
      menuItems= new MenuItemsBasic(node)
      await menuItems.init()
    }else{
      menuItems= new MenuItemsExpert(node)
      await menuItems.init()
    }
  }else{
    if(node.class!="free"){
      menuItems= new MenuItemsBasic(node)
    }else{
      menuItems= new MenuItemsExpert(node)
    }
    await menuItems.init()
  } */

  if(node.class!="free"){
    menuItems= new MenuItemsBasic(node)
  }else{
    menuItems= new MenuItemsExpert(node,position)
  }
  await menuItems.init()
  
  //console.log(menuItems)

  if(menuItems.selectedRows.length==0){
    if(origin!="table"){
      if(networkGraph.treeData.filter(d=>d.id==node.id).length>0){
        networkGraph.checkCollapseExpandBranch(node)
      }
    }
    clickBubbleGraph(document.getElementById(node.id))
  }else if(menuItems.selectedRows.length==1){
    if(node.class!="free"){
      setMenuOption(node,menuItems.selectedRows[0]["option"])
      await checkGraph(menuItems.selectedRows[0],node)
    }else{
      if((linkedDataGraph)&&(linkedDataGraph instanceof LinkedDataGraphExpert)){
        //////console.log("update linkedata")
        await linkedDataGraph.update(menuItems.selectedRows[0],node)
        networkGraph.refresh()
      }else{
        await showGraphExpert(menuItems.selectedRows[0])
      }
    }
    //console.log(node.id)
    clickBubbleGraph(document.getElementById(node.id))
  }else if(menuItems.selectedRows.length>1){
    if(origin=="table"){
      menuItems.getMenuItemsInTable()
    }else if(origin=="navigation"){
      menuItems.getMenuItemsInTableFromNav()
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
  //////console.log("showExpert")
  //////console.log(selectedRow)
  linkedDataGraph = new LinkedDataGraphExpert(selectedRow);
  await linkedDataGraph.settingsFromOption()

  let forces=setForcesGraph()

  removeGraph()
  showGraphArea()
  hideExpertForm()
  //landingPageNotVisible()
  hidePageCollection()
  removePreviousFilters()
  //hideLandingText() 
  tabOptionsGraphVisible()

  networkGraph = new NetworkGraphExpert("#networkGraph",forces,linkedDataGraph.data);

  await networkGraph.initVis()

  //////console.log("showGraphExpert")
  networkGraph.getFilters()

  legend=new Legend("legend",networkGraph)

/*   if(networkGraph.filterClassesObjects.length!=0){
    $("#filters").removeClass("hidden")
  }else{
    $("#filters").addClass("hidden")
  } */
}
function showGraphExpertFromPopup(form){
  let url=form.querySelector("#url").value
  let position=form.querySelector("#subject-object").value
  let uri=form.querySelector("#uri").value

  //////console.log(menuItems)
  //////console.log(url)
  //////console.log(position)
  //////console.log(uri)
  let selectedRow=menuItems.selectedRows.filter(d=>((d.endpoint_url==url)&&(d.node.uri==uri)&&(d.position==position)))[0]
  hideExpertForm()
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
  const promise = new Promise(function (resolve, reject) {
    $.get({
      url: file,
      success: resolve,
      error: reject
    });
  })
  const code = await promise;
  return code;
}

function relatedFilters(element){
  var filter,filterId,id;
  /* if (isLoading){
    return
  } */
  ////////////console.log(loaded)
  ////////////console.log(element.value)
  //////console.log(element)
  //////console.log(element.getAttribute("id"))

  id=element.getAttribute("id").replace("_filter","")
  id=id.replace("_start","").replace("_end","")

  let filterClassName=id.split("_")[0]
  //////console.log(filterClassName)
  //////console.log(networkGraph.filterClassesObjects)

  let filterClass=networkGraph.filterClassesObjects.filter((d)=>d.name==filterClassName)[0]

  //////console.log(filterClass)
  if(filterClass){
    filter=filterClass.filters.filter((f)=>f.details.property==id)[0]

    //////console.log(filter)
    filter.addValuesChanged(element)
    linkedDataGraph.filter(filterId)
    linkedDataGraph.flattenFiltered()
    //////console.log(linkedDataGraph.treeDataFiltered)
    setValuesFilters(id)
  }
  
}

function relatedFiltersExpert(element){
  var filter,id;
  /* if (isLoading){
    return
  } */
  ////////////console.log(loaded)
  ////////////console.log(element.value)
  //////console.log(element)
  //////console.log(element.getAttribute("id"))

  id=element.getAttribute("id").replace(/(_type$)/, '')
  id=id.replace(/(_property$)/, '')
  id=id.replace(/(_value$)/, '')

  let filterClassName=id
  //////console.log(filterClassName)
  //////console.log(networkGraph.filterClassesObjects)

  let filterClass=networkGraph.filterClassesObjects.filter((d)=>d.internalName==filterClassName)[0]
  //////console.log(filterClass)
  if(filterClass){
    filter=filterClass.filters.filter((f)=>f.id==element.getAttribute("id"))[0]
    
    //////console.log(filter)
    filter.addValuesChanged(element)
    linkedDataGraph.filter(filter.id)
    linkedDataGraph.flattenFiltered()
    //////console.log(linkedDataGraph.treeDataFiltered)
    setValuesFilters(id)
  }
  
}
function changeDate(el){
  var values;

  var filterId=el.getAttribute("id").replace("_start","").replace("_end","")
  //let index=networkGraph.filterClassesObjects.findIndex((element) => element.filters.some((subElement) => subElement.id === filterId))
  //values=networkGraph.filterClassesObjects[index].filters.filter(d=>d.id==filterId)[0]["values"]
  //if((el.getAttribute("id").endsWith("_end"))&&(formatDate(values[values.length-1])!=formatDate(el.value))){
    //relatedFilters(el)
  //}else if((el.getAttribute("id").endsWith("_start"))&&(formatDate(values[0])!=formatDate(el.value))){
    //relatedFilters(el)
  //}
  //ECL.autoInit()
  relatedFilters(this)
}

function getFilteredData(){
  linkedDataGraph.filter()
  linkedDataGraph.treeData=linkedDataGraph.treeDataFiltered
  linkedDataGraph.flatten()
}

function applyFilters(){
  getFilteredData()
  networkGraph.refreshNoFilters()
}

function startExpert(element){
  hideExpertForm()
  //$("#filters").addClass("hidden")
  //node={"uri":element.querySelector('#free-uri').value, "position":element.querySelector('#subject-object').value,"class":element.querySelector('#class-node').value}
  ////console.log(node)
  checkMenuItems('form',element)
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
      file=getDataToFile()
      /* if(getNavPanelVisibility()){
        navPanelNode=navigationPanel.node
      }else{
        navPanelNode=none
      }
      file=JSON.stringify({"treeData":networkGraph.treeData,"classesCorrespondence":networkGraph.nodesClassesShow,"filterClasses":networkGraph.filterClassesObjects,"configRow":configRow,"navPanelNode":navPanelNode}) */
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


async function checkGraph(option,node){
  const rowInConfigFile=configFile.file.filter(c=>c.option==option.option)[0]

  if(rowInConfigFile["type"]=="TREE"){
/*     //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].vx)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].x)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].value)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].vx)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["target"].x)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["target"].value) */
    await linkedDataGraph.update(option,node)
/*     //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].vx)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].x)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].value)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["source"].vx)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["target"].x)
    //console.log(networkGraph.data.links[networkGraph.data.links.length-1]["target"].value) */

    networkGraph.refresh()

    //ECL.autoInit()
  }else{
    checkNotTreeGraph(rowInConfigFile,node)
  }
  return rowInConfigFile["type"]
}
async function checkGraphExpert(form,data){
  ////console.log(data.menu)
/*   //console.log(vis.data.links[vis.data.links.length-1]["source"].vx)
  //console.log(vis.data.links[vis.data.links.length-1]["source"].x)
  //console.log(vis.data.links[vis.data.links.length-1]["source"].value)
  //console.log(vis.data.links[vis.data.links.length-1]["source"].vx)
  //console.log(vis.data.links[vis.data.links.length-1]["target"].x)
  //console.log(vis.data.links[vis.data.links.length-1]["target"].value) */
  await linkedDataGraph.update(form,data)
/*   //console.log(vis.data.links[vis.data.links.length-1]["source"].vx)
  //console.log(vis.data.links[vis.data.links.length-1]["source"].x)
  //console.log(vis.data.links[vis.data.links.length-1]["source"].value)
  //console.log(vis.data.links[vis.data.links.length-1]["source"].vx)
  //console.log(vis.data.links[vis.data.links.length-1]["target"].x)
  //console.log(vis.data.links[vis.data.links.length-1]["target"].value) */
  ////console.log(networkGraph.data.nodes)
  ////console.log(linkedDataGraph.data.flatData.nodes)
  networkGraph.refresh()
}
function tabOptionsGraphVisible(){
  //$('#settings-tab').parent().removeClass("hidden")
  $('#collapse-graph-div').removeClass("hidden")
  $('#legend-tab').parent().removeClass("hidden")
  $('#share-graph-div').removeClass("hidden")
  $('#save-graph-div').removeClass("hidden")
}

function tabOptionsGraphNotVisible(){
  //$('#settings-tab').parent().addClass("hidden")
  $('#legend-tab').parent().addClass("hidden")
  $('#share-graph-div').addClass("hidden")
  $('#save-graph-div').addClass("hidden")
  $('#collapse-graph-div').addClass("hidden")

}
function showNavTabs(){
  $("#tabsNav").removeClass("hidden")
  ////////////console.log("autoInit")
  //////////console.log(ECL.autoInit())
}
function hideNavTabs(){
  $("#tabsNav").addClass("hidden")
}

async function clickMenuTable(row){
  navigationPanel.clickMenuTable(row)
}
function emptyNavigationPanel(){
  //$(".ecl-search-form").delete()
  $("#nav-children-tbody").empty()
}

function removeSearchNavContent(){
  $("#search-nav-content").remove()
}

function clickElNavigationPanel(el){
  //removeSearchNavContent()
  clickBubbleGraph(document.getElementById(el.id.replace("_a","")))
}
function setValuesFilters(filterId){
  ////////////console.log("function setValuesFilters")
  networkGraph.filterClassesObjects.forEach(function (cf){
    cf.setValuesFilters(filterId)
  })
}
function removeOptionsSelect(f){
  $("#"+f.htmlEl.getAttribute("id")).empty();
}
function clearFilters(){
  linkedDataGraph.clearFilter()
  //////console.log(linkedDataGraph.data.flatData.nodes)
  //////console.log(linkedDataGraph.data.treeData)
  
  //////////////console.log("despues forEach")
  networkGraph.refreshNoFilters()
  //////////////console.log("despues refresh")
  networkGraph.filterClassesObjects.forEach(function (cf){
    cf.filters.forEach(async function (f){
      //f.addValuesField(f.values)
      //////console.log(f)
      f.resetAllValues()
      ////////console.log("despues de addValues")
      //f.resetValue()
      //////////////console.log("despues de resetvalue")
    })
  })
}
function noOptionSelectedCollections(){
  document.getElementById("select-collections").value = "------------";
}
function showDuplicates(value){
  ////////////////console.log(value)
  if(value=="yes"){
    showDuplicatesGraph()
  }else if(value=="no"){
    showNoDuplicatesGraph()
  }
  linkedDataGraph.flatten()
  networkGraph.refreshNoFilters()
}
function showDuplicatesGraph(){
  linkedDataGraph.showDuplicatesGraph()
}
function showNoDuplicatesGraph(){
  ////////////////console.log(linkedDataGraph.treeData)
  linkedDataGraph.showNoDuplicatesGraph()
}

function getShowDuplicates(){
  return $("#show-duplicates-no").is(":checked")
}

//INITIALIZE ALL MODAL WINDOWS

// get navigation panel modal window
var modal = document.getElementById("myModal");

// get close element from navigation panel
var span = document.getElementsByClassName("close")[0];


// When the user clicks on (x), close the modal
span.onclick = function() {
  if(navigationPanel){
    navigationPanel.clusterElSelected=[]
  }
  closeNavigationPanel()
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
  $("#myModal2").removeClass("translate-x-0")
  $("#myModal2").addClass("translate-x-full")
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
}
