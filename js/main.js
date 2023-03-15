var data={},
linkedDataGraph,networkGraph,legend,navigationPanel,menuItems,configFile,configRow,filesIcons,
nodesClasses,configRowsList=[],
nodesClassesShow=[],nodesClassesCorrespondence,filesIcons,colorCorrespondence={},
optionsMenuHtml,showNavigation=true,mnemonicCodes,lineDragActive = false;
var timer = 0;
var delay = 400;
var prevent = false;
var test=0,test2=0;

window.onload = (event) => {
  //////////////////console.log("page is fully loaded");
  dataViz()
};
function keyPress (e) {
  if(e.key === "Escape") {
      // write your logic here.
    //////////////console.log("Escape")
  }
}
//this function will be execute when the page is fully loaded
function dataViz(){
    //If a graph is shared the name of the graph will be added to the url
    //we get the graph name from the url
    const queryString = window.location.search;
    //////////////console.log(queryString)
    const urlParams = new URLSearchParams(queryString);
    const graphName = urlParams.get('graph')
    //////////////console.log(graphName)
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
                    //////////////////console.log(mnemonicCodes)
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
  hideSelectGraphInCollection()
  hideGraphArea()
  showPageCollection()

  //remove all options from previous collections
  removeOptionsCollections()

  changeCollectionOptions(collection.value)
}

//get options from config file and show them as different choices in a page
function changeCollectionOptions(collection){
  let optionsMenu=configFile.file.filter(d=>d.collection==collection)
  if(optionsMenu.length==1){
    hideSelectGraphInCollection()
  }
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
  ////////////////console.log("collapse")
  networkGraph.collapseAll()
}
//when expand button is clicked
function expand(){
  console.log(JSON.parse(JSON.stringify(linkedDataGraph.treeData[0])))
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
  
}

//create a file whith all queries that have been run to construct the graph
function downloadQuery(){
  download(networkGraph.queriesArray, 'sparqlQueriesFromVINALOD.csv', 'text/csv;encoding:utf-8');       

}
/****************************************************
************IMPORT AND EXPORT FUNCTIONS**************
*****************************************************/

//create json data from graph for being exported or shared
function getDataToFile(){
  var navPanelNode;
  if(getNavPanelVisibility()){
    navPanelNode=navigationPanel.node
  }else{
    navPanelNode="None"
  }
  let file=JSON.stringify({"treeData":networkGraph.treeData,"classesCorrespondence":networkGraph.nodesClassesShow,"filterClasses":networkGraph.filterClassesObjects,"configRow":configRow,"navPanelNode":navPanelNode})
  return file
}

//run when click on button "Share graph"
//create an email with link to vinalod and the name of the graph stored in aws s3 
//added to the content of the email

function shareGraph(){
  //create a random file name
  var fileName=Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+".json"
  var link=window.location.href.toString();
  addFile()
  //alert("The URL of this page is: " + window.location.href);
  if(link.slice(-1)=="#"){
    link=link.substring(0, link.length - 1)
  }
  var anotherGraphId=link.split("?graph=")[1]
  
  if(anotherGraphId){
    link=link.replace("?graph=","").replace(anotherGraphId,"")
    ////console.log(link)
  }

  return parent.location="mailto:?subject=VINALOD graph&body=Follow or copy the following link in your browser in order to see the graph shared%0D%0D%0D" + encodeURIComponent(link+"?graph="+fileName);
  
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

//create and save JSON file that has data from the graph and save it to file. Launch from menu 'Save graph for later?'
function downloadGraph(){

  let file=getDataToFile()
  download(file, 'graph.json', 'text/json;encoding:utf-8');   
  
}

//create graph from JSON file passed as parameter
async function createGraphFromFile(fileText){

  //hide all elements from previous graphs
  hideElements()

  //show elements from tabs menu on the top that are visible when a graph is showed
  tabOptionsGraphVisible()

  //create a new element for storing the data. We specify that it is imported data
  linkedDataGraph = new LinkedDataGraph("imported");

  //import data into object that contains the data for the network graph
  linkedDataGraph.importGraph(fileText)

  //set networkgraph forces
  let forces=setForcesGraph()

  //create networkgraph with elements from the fileText that contains the data
  networkGraph = new NetworkGraphImported("#networkGraph",forces,linkedDataGraph.data,fileText.classesCorrespondence,fileText.filterClasses);
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

}

//function launched when click on import button in menu
function importGraph(file){
  //////////////////console.log(file)
  file.files[0].text().then(text => {
    createGraphFromFile(JSON.parse(text))
  })

  //remove value from file imported
  document.getElementById('import-file').value = null;
}

//add graph when added in url
//graph data stored in aws s3 bucket
function addSharedGraphInUrl(file){
  ////////////console.log("addSharedGraph")
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
      ////////////console.log("createGraph")
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
  hideSelectGraphInCollection()
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


/****************************************************
*******FUNTIONS FOR CREATING AND ADDING GRAPHS*******
*****************************************************/ 

//function run when expert form is filled and click on "Show" button
async function startExpert(element){
  ////console.log("startExpert")
  await checkMenuItems('form',element)
  ////////////console.log(menuItems)
  ////////////console.log(menuItems.selectedRows)
  if(menuItems.selectedRows.length==0){
    showErrorMessageExpertForm()
  }else{
    hideExpertForm()
  }
}

//launched if option selected when page that shows collection options is added
async function createNewBasicGraph(option){

  ////////////////console.log(option)
  removePreviousFilters()
  hideExpertForm()
  removeGraph()
  closeNavigationPanel()
  deleteTooltip()
  hidePageCollection()
  showGraphArea()
  removeColorsFromLegend()
  tabOptionsGraphVisible()


  //checkSelectGraphInCollection(option)

  if(typeof linkedDataGraph !== 'undefined'){
    linkedDataGraph = undefined;
  }

  linkedDataGraph = new LinkedDataGraph(option);
  await settingsFromOption("basic",option)

  let forces=setForcesGraph()

  if(networkGraph){
    networkGraph = undefined;
    legend=undefined
  }

  //showSpinMessage()
  networkGraph = new NetworkGraphNotImported("#networkGraph",forces,linkedDataGraph.data);

  await networkGraph.initVis()
  //hideSpinMessage()

  networkGraph.getFilters()

  legend=new Legend("legend",networkGraph)

  //networkGraph.collapseAll()
}

//create new expert graph
async function createNewExpertGraph(selectedRow){
  ////console.log("createNewExpertGraph")
  linkedDataGraph = new LinkedDataGraph(selectedRow);
  //////console.log(linkedDataGraph)
  await settingsFromOption("expert",linkedDataGraph.option)

  let forces=setForcesGraph()

  removeGraph()
  showGraphArea()
  hideExpertForm()
  hidePageCollection()
  removePreviousFilters()
  tabOptionsGraphVisible()

  //////console.log(forces)
  //////console.log(linkedDataGraph.data)
  //networkGraph = new NetworkGraph("#networkGraph",forces,linkedDataGraph.data);
  networkGraph = new NetworkGraphNotImported("#networkGraph",forces,linkedDataGraph.data);

  await networkGraph.initVis()

  //networkGraph.getFilters()
  networkGraph.updateFilters()

  legend=new Legend("legend",networkGraph)
}

function checkSelectGraphInCollection(option)
{
  let collection=configFile.file.filter(d=>d.option==option)[0]["collection"]
  let collectionOptions=configFile.file.filter(d=>d.collection==collection)
  let values=collectionOptions.map(d=>d.option)
  if(collectionOptions.length>1){
    showSelectGraphInCollection()
    $('#select-graph-in-collection option').remove()
    let selectField=document.getElementById("select-graph-in-collection")
    for (let i = 0; i < values.length; i++) {
      var optionSel = document.createElement("option");
      optionSel.value = values[i];
      optionSel.text = values[i].charAt(0).toUpperCase() + values[i].slice(1);
      if(optionSel.value==option){
        ////////////////console.log(option)
        optionSel.selected=true
      }
      selectField.appendChild(optionSel);
    }
  }
  
}
function changeGraphInCollection(element){
  //getOptionsCollectionSelect(this)

  ////////////////console.log(element.value)
  createNewBasicGraph(element.value)
}

//form sent from pop expert menu to create a new graph when option is selected
function createNewExpertGraphFromPopup(form){
  let url=form.querySelector("#url").value
  let position=form.querySelector("#subject-object").value
  let uri=form.querySelector("#uri").value

  let selectedRow=menuItems.selectedRows.filter(d=>((d.endpoint_url==url)&&(d.node.uri==uri)&&(d.position==position)))[0]
  //hideExpertForm()
  hidePopupWindowExpert()
  createNewExpertGraph(selectedRow)
}

//this function is launched when a bubble is clicled on the graph
//when a row is clicked on the navigationPanel table
//when an option is selected in the pop form for expert options
//we check the options that can be retrieved for the node and show
//them in the context menu, navigation panel or pop form 
//depending on the origin we will get data differently
//we pass the origin and the element from where the graph will be added
//or the options will be shown
async function checkMenuItems(origin,element) {
  var position;

  //first we get the parameters that will be passed when creating menuItems object
  //the way of getting the node depends on the origin

  if(origin=="form"){
    //when origin is the expert form we build the node with the options from the form
    node={"uri":element.querySelector('#free-uri').value, "position":element.querySelector('#subject-object').value,"class":element.querySelector('#class-node').value}
    
    //get the position from the form
    position=element.querySelector('#subject-object').value
  }else if(origin=="graph"){
    //when origin is the graph get the node from the element id
    node=get_node_from_element(element.getAttribute("id").replace("_image",""))
/*     if(element instanceof Element){
      node=get_node_from_element(element.getAttribute("id").replace("_image",""))
    }else{
      node=element
    } */
  }else if(origin=="table"){
    //when origin is table content in navigation panel
    // get the node from the table row id
    ////////console.log(element)
    node=getNodeFromTableRow(element)
  }else if(origin=="navigation"){
    //when origin is the last element in the navigation panel history
    //we get the node from the element id
    node=get_node_from_element(element.getAttribute("id").replace("_a",""))
  }

  //if node has collapsed children, they will be expanded.
  if(node._children){
    networkGraph.expandBranch(node)
  }else{
    //we create the menuItems object
    //it is created from the basic or expert type depending on the node class
    if(node.class!="free"){
      //////////////console.log(node)
      menuItems= new MenuItemsBasic(node)
    }else{
      menuItems= new MenuItemsExpert(node,position)
    }
    await menuItems.init()

    //////console.log(menuItems.selectedRows)

    //after the menuItems object is created and initialized we get the number of
    //possible options for graphs from that node
    //depending on the number of menu options we will do something different
    if(menuItems.selectedRows.length==0){
  /*     if(origin!="table"){
        if(networkGraph.treeData.filter(d=>d.id==node.id).length>0){
          networkGraph.checkCollapseExpandBranch(node)
        }
      } */
      //////////////////console.log("message for no graph")
      
      if(origin=="table"){
        ////////////////console.log(node)
        clickBubbleGraph(document.getElementById(node.id))
      }else if(origin=="navigation"){
        showMessageForNoGraphs()
      }
      //clickBubbleGraph(document.getElementById(node.id))
    }else if(menuItems.selectedRows.length==1){

      //if we get 1 result from the node options we show the graph
      //and show the navigation panel for the new option if active
      if(node.class!="free"){
        //if basic graph we add the menuOption to the node
        //like this we have a history of the options that have been selected
        setMenuOption(node,menuItems.selectedRows[0]["option"])
        //add basic graph to the existing graph
        await addBasicGraph(menuItems.selectedRows[0],node)
      }else{
        ////console.log(linkedDataGraph)
        ////////////console.log(menuItems.selectedRows[0]["option"])
        if((linkedDataGraph)&&(linkedDataGraph.option instanceof OptionNodeExpert)){
          ////////////////////////console.log("update linkedata")
          await addExpertGraph(menuItems.selectedRows[0],node)
        }else{
          await createNewExpertGraph(menuItems.selectedRows[0])
        }
      }
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
  
}

async function addBasicGraph(option,node){
  const rowInConfigFile=configFile.file.filter(c=>c.option==option.option)[0]

  if(rowInConfigFile["type"]=="TREE"){

    await linkedDataGraph.update(option,node,"basic")

    linkedDataGraph.filter()
     
    linkedDataGraph.flattenAllData()

    linkedDataGraph.data=linkedDataGraph.allData
    linkedDataGraph.treeData=linkedDataGraph.allTreeData

    networkGraph.refresh()

  }else{
    checkNotTreeGraph(rowInConfigFile,node)
  }
  return rowInConfigFile["type"]
}
async function addExpertGraph(option,node){
  addMenuOptionToNode(node,option.endpoint_url+","+option.position)
  if(networkGraph){
    ////////console.log(networkGraph.treeData)
  }
  await linkedDataGraph.update(option,node,"expert")
  ////////////console.log(linkedDataGraph)
  if(networkGraph){
    ////////console.log(networkGraph.treeData)
  }
  networkGraph.refresh()
}

/****************************************************
*******FUNTIONS FOR GRAPH NOT TREE - DUPLICATES*******
*****************************************************/ 

function showDuplicates(value){
  if(value=="yes"){
    showDuplicatesGraph()
  }else if(value=="no"){
    showNoDuplicatesGraph()
  }
  if(linkedDataGraph){
    linkedDataGraph.flatten()
  }
  if(networkGraph){
    networkGraph.refreshNoFilters()
  } 
}
function showDuplicatesGraph(){
  if(linkedDataGraph){
    linkedDataGraph.showDuplicatesGraph()
  }
  document.getElementById('radio-navigation-no').checked = false;
  document.getElementById('radio-navigation-yes').checked = true;
  document.getElementById('radio-navigation-yes').disabled=false;
  document.getElementById('radio-navigation-no').disabled=false;
}
function showNoDuplicatesGraph(){
  if(linkedDataGraph){
    linkedDataGraph.showNoDuplicatesGraph()
  }
  document.getElementById('radio-navigation-no').checked = true;
  document.getElementById('radio-navigation-yes').checked = false;
  document.getElementById('radio-navigation-yes').disabled=true;
  document.getElementById('radio-navigation-no').disabled=true;

}

function getShowDuplicates(){
  return $("#show-duplicates-no").is(":checked")
}

/****************************************************
************FUNTIONS RELATED TO FILTERS**************
*****************************************************/

function relatedFilters(element){
  var filter,filterId,id,wrongValues=false,ldg=linkedDataGraph;

  getAllData()

  id=element.getAttribute("id").replace("_filter","")
  id=id.replace("_start","").replace("_end","")

  let filterClassName=id.split("_")[0]

  let filterClass=networkGraph.filterClassesObjects.filter((d)=>d.name==filterClassName)[0]

  if(filterClass){
    filter=filterClass.filters.filter((f)=>f.details.property==id)[0]
    //console.log(filter)
    if(filter.details.filter_type=="date"){
      wrongValues=filter.checkValidity()
    }
    if(!wrongValues){
      filter.addValuesChanged(element)
      linkedDataGraph.filter(filter.id)
     
      //console.log(JSON.parse(JSON.stringify(linkedDataGraph.allTreeData)))
      linkedDataGraph.flattenAllData()

      //setValuesFilters(id)

      $("#apply-filter button")
      .removeAttr( "disabled" )
    }else{
      d3.select("#apply-filter button")
      .attr("disabled","")
    }
  }
}


function applyAllFilters(){
  var filterClass;

  if(networkGraph.filterClassesObjects.length>0){
    for (var i = 0; i < networkGraph.filterClassesObjects.length; i++) {
      filterClass=networkGraph.filterClassesObjects[i]
      for (var j = 0; j < filterClass.filters.length; j++) {
        if(!filterClass.filters[j].hidden){
          linkedDataGraph.filter(filterClass.filters[j].id)
        }   
      }
    }
    linkedDataGraph.flatten()
  }
}
function getFilterClassExpertName(id){
  id=id.replace(/(_type$)/, '')
  id=id.replace(/(_property$)/, '')
  id=id.replace(/(_value$)/, '')
  return id
}
function relatedFiltersExpert(element){
  var filter,id;
  getAllData()
/* 
  filter.addValuesChanged(element)
  linkedDataGraph.filter(filter.id)
 
  //console.log(JSON.parse(JSON.stringify(linkedDataGraph.allTreeData)))
  linkedDataGraph.flattenAllData() */

  id=getFilterClassExpertName(element.getAttribute("id"))
  let filterClass=networkGraph.filterClassesObjects.filter((d)=>d.internalName==id)[0]
  console.log(filterClass)
  if(filterClass){
    filter=filterClass.filters.filter((f)=>f.field==element.closest(".ecl-form-group").querySelector("label").textContent)[0]
    filter.addValuesChanged(element)
    linkedDataGraph.filter(filter.id)
    linkedDataGraph.flattenAllData()
    //setValuesFilters(id)
  }
}
function getAllData(){
  var ldg=linkedDataGraph;
 /*  function recurse(node) {
      if((node.filtered)&&(!node.collapsed)){
        delete node.hidden;
      }
      delete node.filtered;

      if (node.children){
        node.children.forEach(function(c){
          recurse(c)
        })
      }
  }  */

  ldg.allTreeData=JSON.parse(JSON.stringify(ldg.treeData))
  resetData("allTreeData")
  ldg.flattenAllData()
}
function resetData(data){
  var ldg=linkedDataGraph
  function recurse(node) {
      if((node.filtered)&&(!node.collapsed)){
        delete node.hidden;
      }
      delete node.filtered;

      if (node.children){
        node.children.forEach(function(c){
          recurse(c)
        })
      }
  } 

  ldg[data].forEach(function(n){
    recurse(n)
  })
}
function applyFilters(){
  networkGraph.filtered=true
  linkedDataGraph.data=linkedDataGraph.allData
  linkedDataGraph.treeData=linkedDataGraph.allTreeData
  networkGraph.refreshNoFilters()
  if(checkNavigationPanelOpen()){
    clickBubbleGraph(document.getElementById(navigationPanel.node.id))
  }
  
}

function setValuesFilters(filterId){
  networkGraph.filterClassesObjects.forEach(function (cf){
    cf.setValuesFilters(filterId)
  })
}

function clearFilters(){
  networkGraph.filtered=false
  resetData("treeData")
  linkedDataGraph.allTreeData=linkedDataGraph.treeData
  linkedDataGraph.flatten()
  linkedDataGraph.flattenAllData()
  networkGraph.refresh()
  networkGraph.filterClassesObjects.forEach(function (cf){
    cf.filters.forEach(async function (f){
      delete f.valuesChanged
      f.resetAllValues()
    })
  })
}

/*************************************************************************
************CHECK EXISTING BASIC GRAPH NODE IN EXPERT GRAPH**************
*************************************************************************/
async function checkBasicGraph(node){
  var classesLinesConfig={},filterClasses="",results,child;
  //////////////////console.log(node)
  //////////////////console.log(classesLinesConfig)
/*   if(networkGraph.treeData.filter(d=>d.id==node.id).length>0){
    node["children"]=networkGraph.treeData.filter(d=>d.id==node.id)[0]["children"]
  } */
  //////////////////console.log(configFile)
  for (var i = 0; i < configFile.file.length; i++) {
    if((configFile.file[i].modelClass!=undefined)&&(configFile.file[i].modelClass!="None")){
      if(Object.keys(classesLinesConfig).includes(configFile.file[i].modelClass)){
        classesLinesConfig[configFile.file[i].modelClass]["lines"].push(i)
      }else{
        //////////////////console.log(configFile.file[i])
        classesLinesConfig[configFile.file[i].modelClass]={"class":configFile.file[i]["class"],"lines":[i],"class_orig":configFile.file[i]["classes_text"].filter(o => o.text === configFile.file[i].class)[0]["class"]}
      }
    }
  }
  ////////////////console.log(classesLinesConfig)
  var classesInConfig=Object.keys(classesLinesConfig)
  //networkGraph.classesLinesConfig=classesLinesConfig
  for (var i = 0; i < classesInConfig.length; i++) {
    //////////////////console.log(classesInConfig[i])
    if(filterClasses==""){
      filterClasses+="(<"+classesInConfig[i]+">"
    }else{
      filterClasses+=",<"+classesInConfig[i]+">"
    }
    //////////////////console.log(filterClasses)
  }
  filterClasses+=")"

  //results=await checkClassesNode(node,classesLinesConfig,filterClasses)
  for (var i = 0; i < node.children.length; i++) {
    //////////////////console.log(node.children[i])
    if(node.children[i]["type"]=="uri"){
      results=await checkClassesNode(node.children[i],classesLinesConfig,filterClasses)
    }
  }
  
  //////////////////////////console.log(results)
  //networkGraph.nodesLinkBasicGraph=results
  //addColorsBasicGraph(results,node["children"])
}

async function checkClassesNode(node,classesLinesConfig,filterClasses){
  ////////////////////////console.log(node)
  //var filterClasses="",subjectObject=node.children[0]["subject-object"],sparqlQuery,settings,endpoint_url=node.children[0]["url"],results,resultsAsk;
  var sparqlQuery,settings,results,resultsAsk;
 

  ////////////////console.log(filterClasses)
  ////////////////console.log(node)

/*   if(subjectObject=="s"){
    sparqlQuery="SELECT distinct ?child ?class WHERE{{ ?s ?p ?child. ?child <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class.} FILTER (?s=<"+node.value+">). FILTER (?class in "+filterClasses+")}"
  }else{
    sparqlQuery="SELECT distinct ?child ?class WHERE{{ ?child ?p ?o. ?child <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class.} FILTER (?o=<"+node.value+">). FILTER (?class in "+filterClasses+")}"
  } */
  //sparqlQuery="SELECT distinct ?child ?class WHERE{{ ?s ?p ?child. ?child <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class.} FILTER (?s=<"+node.value+">). FILTER (?class in "+filterClasses+")}"
  sparqlQuery="SELECT distinct ?s ?class WHERE{{ ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class.} FILTER (?s=<"+node.value+">). FILTER (?class in "+filterClasses+")}"
  ////////////////console.log(sparqlQuery)
  prefixes=""
  queryUrl = node["url"] + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  results = await runSparlqQuery(node["url"],sparqlQuery,"query")
  ////////////////console.log(results)
  results=await filterResults(results,classesLinesConfig)
  //////////////////////////console.log(results)
  return results
  async function filterResults(results,classesLinesConfig){
    var askquery,filteredResults=[];
    for (var i = 0; i < results.length; i++) {
      ////////////////console.log(results[i]["class"]["value"])
      ////////////////console.log(classesLinesConfig[results[i]["class"]["value"]]["lines"])
      for (var j = 0; j < classesLinesConfig[results[i]["class"]["value"]]["lines"].length; j++) {
        if((configFile.file[classesLinesConfig[results[i]["class"]["value"]]["lines"][j]]["askquery"])&&(configFile.file[classesLinesConfig[results[i]["class"]["value"]]["lines"][j]]["askquery"]!="None")){
          askquery=configFile.file[classesLinesConfig[results[i]["class"]["value"]]["lines"][j]]["askquery"]
        }else{
          askquery=fromSelectToAskQuery(configFile.file[classesLinesConfig[results[i]["class"]["value"]]["lines"][j]]["query"])
        }
        ////////console.log(askquery)
        if(askquery){
          if(askquery.indexOf("PARAMETER2") === -1){
            askquery=askquery.replaceAll("PARAMETER",results[i]["s"]["value"])
            resultsAsk= await runSparlqQuery(configFile.file[classesLinesConfig[results[i]["class"]["value"]]["lines"][j]]["endpoint_url"], askquery,"askquery")
            ////////////////console.log(resultsAsk)
            if(resultsAsk){
              filteredResults.push(results[i])
              ////////////////console.log(node)
              //idNode=node["children"].filter(d=>d.value==results[i]["s"]["value"]).map(v=>v.id)
              if(d3.select("#"+node.id).data()[0]["configRow"]==""){
                d3.select("#"+node.id).data()[0]["configRow"]=[]
              }
              d3.select("#"+node.id).data()[0]["configRow"].push(classesLinesConfig[results[i]["class"]["value"]]["lines"][j])
              d3.select("#"+node.id).style('fill', "red");
              ////////////////console.log(node)
              ////////////////console.log(d3.select("#"+node.id).data()[0])
            }
          }
        }
      }
    }
    return filteredResults
  }
}

/****************************************************
************INITIALIZE ALL MODAL WINDOWS**************
*****************************************************/


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
  //////////////console.log("ANYWHERE OUTSIDE THE MODAL")
}

///////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////TO BE PLACED

function checkEmptyURI(field){
  //////////////console.log(field.value)
  if(field.value==""){
    hideErrorMessageExpertForm()
  }
}


function changeSvgHeight(field){
/*   if(field){
    ////////////console.log(field.getAttribute('aria-expanded'))
  } */
  
  networkGraph.height=$( document ).height();
  //////////////console.log(networkGraph.height)
  networkGraph.svg.attr("viewBox", `0 0 ${networkGraph.width} ${networkGraph.height}`)
}