MenuItems = function (_node) {
    this.node=_node
    //this.init();
  };

MenuItems.prototype.init = async function () {
    var mi=this,cr;
    //console.log(mi.node)
    mi.indexRows=[]
    //////console.log(mi.node)
    if(mi.node["subject-object"]){
        mi.selectedRows=[]
        const p = new Promise((resolve, reject) => {   d3.csv('../config_vinalod/sparqlEndpoints.csv', (err, data1) => {     if (err) {       reject(err);     } else {       resolve(data1);     }   }); }); 
        await p.then(async function (urls) {
          if (mi.node["subject-object"] == undefined) {
            subjectObject = ['s', 'o']
          } else {
            subjectObject = [mi.node["subject-object"]]
          }
          if (mi.node.id) {
            uri = d3.select("#" + mi.node.id).data()[0].value
          } else {
            uri = mi.node.uri
          }
          for (var j = 0; j < subjectObject.length; j++) {
            for (var i = 0; i < urls.length; i++) {
              results = await runAskSparlqQueryFreeGraph(urls[i].sparqlEndpoint, mi.node["uri"], subjectObject[j])
              if (results == true) {
                mi.selectedRows.push({ "url": urls[i].sparqlEndpoint, "subject-object": subjectObject[j], "uri": mi.node["uri"] })
              }
            }
          }
        })
    }else{
        mi.selectedRows=configFile.getRowsNodeClass(mi.node["className"])
        mi.selectedRows.forEach(element => {
            mi.indexRows.push(new ConfigRow(element.option,mi.node))
        });
        mi.filterByMenuOption()
        await mi.filterByAskResult()
    }
}
//MenuItems.prototype.test=
/* MenuItems.prototype.init = async function () {
    var mi=this,cr,resultRows=[];
    //console.log(mi.node)
    mi.indexRows=[]
    //////console.log(mi.node)
    if(mi.node["subject-object"]){
        //console.log(mi.node)
        //console.log(await checkAskResultsFreeGraph(mi.node,mi.option))
    }else{
        mi.selectedRows=configFile.getRowsNodeClass(mi.node["className"])
        mi.selectedRows.forEach(element => {
            mi.indexRows.push(new ConfigRow(element.option,mi.node))
        });
    }
    
    ////console.log(mi.indexRows)
    //throw new Error("Something went badly wrong!");
    mi.filterByMenuOption()
    await mi.filterByAskResult()
    ////console.log(mi)
    
    async function checkAskResultsFreeGraph(node, so) {
        var resultRows = []
        
        return new Promise((resolve, reject) => {
          d3.csv("../config_vinalod/sparqlEndpoints.csv",async function(urls){
              //////////////////////////////////////////////console.log(urls)
              //console.log(node)
            resolve(resultRows)
          })
        })
        .then(results => {
            //console.log(results);
        })
    } 
  } */
MenuItems.prototype.filterByMenuOption = function () {
    var mi=this;
/*     if(node["menuOption"]!=undefined){
        arrayMenuOptions=node["menuOption"].split(";")
        configRows = configRows.filter(function( obj ) {
          return !arrayMenuOptions.includes(obj.option);
        });
    }
    var menuOption = node.menuOption.split(";")
    menuOption.forEach(function (d) {
      d = d.split(",")
      resultRows = resultRows.filter(function (r) {
        return (r.uri != node.value) || (r.url != d[0]) || (r["subject-object"] != d[1])
      })
    })
 */
  }

MenuItems.prototype.filterByAskResult = async function () {
    var mi=this;
    var sparqlQuery,resultIndexRows=[],parameters,arrayMenuOptions
    for (var i = 0; i < mi.indexRows.length; i++) {
        mi.indexRows[i].fromSelectToAskQuery()
        //get parameters from config file
        ////console.log(mi.indexRows[i])
        //parameters=mi.indexRows[i].rowFields["parameters"]
        try {
            if(mi.indexRows[i]["option"]["subject-object"]){
                results = await runAskSparlqQuery(mi.indexRows[i].option["url"],mi.indexRows[i]["askquery"]);
            }else{
                results = await runAskSparlqQuery(mi.indexRows[i].rowFields["endpoint_url"],mi.indexRows[i].rowFields["askquery"]);
            }
            //////console.log(results)
        } catch (e) {
        results = false
        } 
        ////console.log(results)
        if(results==true){
            if(mi.indexRows[i]["option"]["subject-object"]){
                ////console.log("expert")
                resultIndexRows.push(mi.indexRows[i])
            }else{
                resultIndexRows.push(mi.indexRows[i].rowFields)
            }
        }
    }

    mi.selectedRows=resultIndexRows
    ////console.log(mi.selectedRows)
  }

/* MenuItems.prototype.checkQueriesBasic = async function () {
    function checkQueriesBasic(){
    if(selectedRows.length>0){
        if(founded[0]["_children"]){
            option=node.menuOption.split(";")[0]
            selectedRows.push({"position":configFile.findIndex(d=>d.option==option),"option":configFile.filter(d=>d.option==option)[0]["option"],"option_text":configFile.filter(d=>d.option==option)[0]["option_text"]})
        }
        addGraph(d3.select("#"+(element.getAttribute("id").replace("_image",""))).data()[0],selectedRows)
        vis.data=flatten(vis.treeData).flatData
        vis.initializeSimulation();
        vis.dataJoinGraph()
        vis.exitGraph()
        ////////////////////////////////////////////////////////////////////////console.log(node)
    }else{
        //////////////////////////////////////////////////////////////////////////console.log("else")
        if (founded[0]["children"]){
            //SE CONTRAE LOS CHILDREN

        
        }else{
            //SE EXPANDEN LOS
        }
        }
    }
} */
MenuItems.prototype.getSelectedRowByOption = async function (option){
    var mi=this;
    let row=mi.selectedRows.filter(d=>d.option==option)[0]
    ////////////console.log(row)
    return row
}
MenuItems.prototype.getMenuItemsInGraph = async function (){
    var mi=this;

    var elementMenu,position,width
    mi.menuItems=[]
    //if click on Navigation panel then origin=table
        //if click on bubble in graph, fill menu to show on screen next to bubble
        //and add action to build basic graph in case the option in the menu is clicked
    for (var i = 0; i < mi.selectedRows.length; i++) {
        //if(graphType=="basic"){
        noTableBasic()
        //}else if(graphType=="expert"){
        //    noTableExpert()
        //}
        mi.menuItems.push(elementMenu)
    }
    if(mi.node["class"]=="free"){
        width=500
    }else{
        width=350
    }
    //Send menuItems to menuFactory which will draw the menu in the graph
    networkGraph.menuFactory(100,0, mi.menuItems, mi.node,"dblClick",width)

    function noTableBasic(){
        
        elementMenu={
        title: mi.selectedRows[i]["option"],
        action: async (data,d) => {
            ////console.log(linkedDataGraph)
            ////console.log(data)
            console.log(d)
            await linkedDataGraph.update(d.title,data)
            console.log("antes refresh")
            networkGraph.refresh()
            //buildBasicGraph(d.title,mi.node)  
        }
        }
    }
    function noTableExpert(){
        if (items[i]["subject-object"]) {
        uri = items[i]["uri"]
        url = items[i]["url"]
        subjectObject = items[i]["subject-object"]
        itemsDetails = { "uri": uri, "url": url, "subject-object": subjectObject }
        elementMenu = {
            title: "Sparql Endpoint: " + url + " and Position: " + subjectObject,
            action: (data, d) => {
            url = d.title.match("Sparql Endpoint: (.*) and Position:")[1];
            subjectObject = d.title.match("and Position: (.*)")[1];
            form = { "url": url, "uri": uri, "subject-object": subjectObject }
            buildNetworkGraph(form,"expert",node)
            }
        }
        } else {
        elementMenu = {
            title: items[i]["menuOption"],
            action: (data, d) => {
            row = configFile.file.findIndex(v => v.option == d.title)
            buildNetworkGraph(configFile.getFieldsConfigFile(row), "basic",data)
            }
        }
        }
    }
    //}
}

MenuItems.prototype.getMenuItemsInTable = async function (){
    var menuItems=[],elementMenu,position,width
    navigationPanel.addMenuToTable()

    //if click on Navigation panel then origin=table
    /* if(graphType=="basic"){
    //tableBasic()
        //////console.log("addMenuToTable")
        navigationPanel.addMenuToTable()
    }else if(graphType=="expert"){
    //tableExpert()
    } */
    function tableExpert(){
        for (var i = 0; i < items.length; i++) {
        if (items[i]["subject-object"]) {
            if(items[i]["subject-object"][0]){
            menuItems.push({ "url": items[i]["url"], "uri": items[i]["uri"], "subject-object": items[i]["subject-object"][0] })
            }else{
            menuItems.push({ "url": items[i]["url"], "uri": items[i]["uri"], "subject-object": items[i]["subject-object"]})
            }
        }else {
            menuItems.push({ "rowDataConfig": items[i]["rowNumber"], "node": node, "menuOption": items[i]["menuOption"] })
        }
        }
    }
    function tableBasic(){
        for (var i = 0; i < items.length; i++) {
        //add all items to menu in table. Get options text and line in config file
        //and add it to the table
        menuItems.push({"option":items[i]["option"],"position":items[i]["position"]})
        }
    }
    //}
}
MenuItems.prototype.update = async function (node) {
    var mi=this;
    mi.node=node
    mi.menuItems=[]
    await mi.init()
  }

/* MenuItems.prototype.replaceParmtrsQuery = function(queryName){
  var mi=this;
  if(mi.node!=undefined){
      if((cr.rowFields.parameters!="")&&(cr.rowFields.parameters!=null)){
          for (let i = 0; i < cr.rowFields.parameters.length; ++i) { 
              cr.rowFields[queryName]=cr.rowFields[queryName].replaceAll("PARAMETER"+(i+2).toString(), cr.node[cr.rowFields.parameters[i]]);
          }  
      }
      cr.rowFields[queryName]=cr.rowFields[queryName].replaceAll("PARAMETER", cr.node[cr.node["class"]+"_uri"]);    
  }
} */
function MenuItemsExpert(...args){
  MenuItems.apply(this, args);
  }
  
MenuItemsExpert.prototype = Object.create(MenuItems.prototype);
  
MenuItemsExpert.prototype.getOptionsFromForm = async function(){
  var mi=this,cr;
  mi.indexRows=[]
  mi.selectedRows=[]
  const p = new Promise((resolve, reject) => {   d3.csv('../config_vinalod/sparqlEndpoints.csv', (err, data1) => {     if (err) {       reject(err);     } else {       resolve(data1);     }   }); }); 
  await p.then(async function (urls) {
/*     if (mi.node["subject-object"] == undefined) {
      subjectObject = ['s', 'o']
    } else {
      subjectObject = [mi.node["subject-object"]]
    } */
    subjectObject = [mi.node["subject-object"]]
/*     if (mi.node.id) {
      uri = d3.select("#" + mi.node.id).data()[0].value
    } else { */
    uri = mi.node.uri
    //}
    //for (var j = 0; j < subjectObject.length; j++) {
    for (var i = 0; i < urls.length; i++) {
      mi.query=buildExpertQuery()
      mi.askquery=fromSelectToAskQuery(mi.query)
      results = await runAskSparlqQueryFreeGraph(urls[i].sparqlEndpoint, mi.node["uri"], subjectObject[j])
      if (results == true) {
        mi.selectedRows.push({ "url": urls[i].sparqlEndpoint, "subject-object": subjectObject[j], "uri": mi.node["uri"] })
      }
    }
    console.log(mi.selectedRows)
    function buildExpertQuery(){
      var sparqlQuery;
      console.log(mi)
      if (so == "s") {
          sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?s=<" + uri+ ">).}"
      } else {
          sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?o=<" + uri + ">).}"
      }
      //cr.query=sparqlQuery
      return sparqlQuery
    }
    //}
  })
}

MenuItemsExpert.prototype.getOptions = async function(){
  var mi=this,cr;
  mi.indexRows=[]
  mi.selectedRows=[]
  const p = new Promise((resolve, reject) => {   d3.csv('../config_vinalod/sparqlEndpoints.csv', (err, data1) => {     if (err) {       reject(err);     } else {       resolve(data1);     }   }); }); 
  await p.then(async function (urls) {
    if (mi.node["subject-object"] == undefined) {
      subjectObject = ['s', 'o']
    } else {
      subjectObject = [mi.node["subject-object"]]
    }
    if (mi.node.id) {
      uri = d3.select("#" + mi.node.id).data()[0].value
    } else {
      uri = mi.node.uri
    }
    for (var j = 0; j < subjectObject.length; j++) {
      for (var i = 0; i < urls.length; i++) {
        results = await runAskSparlqQueryFreeGraph(urls[i].sparqlEndpoint, mi.node["uri"], subjectObject[j])
        if (results == true) {
          mi.selectedRows.push({ "url": urls[i].sparqlEndpoint, "subject-object": subjectObject[j], "uri": mi.node["uri"] })
        }
      }
    }
  })
}

MenuItemsExpert.prototype.getMenuItemsInPopup = async function(){
    var mi=this;
    
  };

function MenuItemsBasic(...args){
  MenuItems.apply(this, args);
  }
  
MenuItemsBasic.prototype = Object.create(MenuItems.prototype);
  
MenuItemsBasic.prototype.getMenuItemsInPopup = async function(){
    var mi=this;
    var mi=this,cr;
    //console.log(mi.node)
    mi.indexRows=[]
  };

