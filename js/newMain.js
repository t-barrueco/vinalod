
//if basic graph settings==configRow and if free graph settings==form
async function buildNetworkGraph(settingsGraph,branchType,node){
    //////////console.log("buildNetworkGraph")
    let sparqlQuery=getQuery()
    let url=getEndpointUrl()
    hideSpinMessage(interval)
    //////////console.log(url)
    ////console.log(settingsGraph)
    ////////////console.log(branchType)
    //////////////console.log(node)
    var interval=showSpinMessage("Waiting for Sparql query")
    let prefixes=""
    ////////////console.log(sparqlQuery)
    let queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    let settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    //////////console.log(settings)

    /* var configClasses = settingsGraph.map(function(d) {
      return {
        class:d.class,
        option:d.option,
        option_text:d.option_text
      };
      }) */

    try {
      var results = await runSparlqQuery(settings);
      //var results = results.bindings;
      //////////console.log(results)
      results = clusterResults(results, settingsGraph)
      //stop displaing message when executing query
      hideSpinMessage(interval)
      ////////////console.log(branchType)
      ////////////console.log(settingsGraph)
      ////////////console.log(node)
      //////////////console.log(configClasses)
      buildData(branchType,results, settingsGraph, node)
      
      //if no bubble is clicked or row in the table
      if(node==undefined){
        //remove a graph if in there is one
        //d3.selectAll(".graph").remove()

        //get data from results in query
        /* if(branchType=="basic"){
          data=buildDataBasic(results,configRow,configClasses,node)
        }else if(branchType=="expert"){
          data=buildDataExpert()
        } */
        // if there is no node the type is basic
        
/*           if(branchType=="basic"){
          data=buildDataBasic(results,configRow,configClasses,node)
        }else if(branchType=="expert"){
          $("#myModal3").hide();
          //////////////console.log(results)
          data=buildDataExpert(results, settingsGraph, node)
          //////////////console.log(data) */
/*             if(settings.origin=="bubble"){
            addNodesGraph(results, node, form)
          }else{
            data=buildDataExpert(results, form, node)
          } */
        //}
        //data=buildDataBasic(results,configRow,configClasses,node)
        //add forces to graph
        setForcesGraph()

        //check if there is an object networkGraph already
        if(networkGraph){
          ////////////console.log("networkGraph")
          legend.deleteAllColors()
        }else{
          ////////////console.log("no networkGraph")
          d3.selectAll(".graph").remove()
          networkGraph = new NetworkGraph("#networkGraph", data,forces,branchType);
          legend=new Legend("legend")
        }
        ////console.log(networkGraph.treeData)
        //networkGraph.collapse
        //networkGraph.collapseAll()
        //collapse(networkGraph.treeData[0])
        //collapse()
      }else{
        ////////////console.log("node not undefined")
        //add information for centering the graph
        networkGraph.addingGraph=true
        networkGraph.dblClickId=node.id.replace("_image","")+"_g"

        //build data for the graph
        //buildDataBasic(results,configRow,configClasses,node)
/*           if(branchType=="basic"){
          data=buildDataBasic(results,configRow,configClasses,node)
        }else if(branchType=="expert"){
            //if(settings.origin=="bubble"){
            //  addNodesGraph(results, node, form)
            //}else{
          data=buildDataExpert(results, settingsGraph, node)
            //}
        } */
        networkGraph.data=flatten(networkGraph.treeData).flatData

        networkGraph.refresh()

        legend.addColors(networkGraph.colorScale)
        handleNavigation(node)

        //collapse graph if is basic type and hierarchy has more than two levels
        if(branchType=="basic"){
          ////console.log(settingsGraph)
          if(settingsGraph.hierarchy.length>1){
            networkGraph.collapseTest(node)
            //collapse(networkGraph.treeData.filter(d=>d.id==node.id)[0])
          }
        }
      }
    } catch (e) {
      console.log(e)
      results = false
    }
    hideSpinMessage(interval)
/*     $objectAjax=$.ajax(settings).then  (function( _data ) {
        var results = _data.results.bindings;
        ////////////console.log(results)
        results = clusterResults(results, settingsGraph)
        //stop displaing message when executing query
        hideSpinMessage(interval)
        ////////////console.log(branchType)
        ////////////console.log(settingsGraph)
        ////////////console.log(node)
        //////////////console.log(configClasses)
        buildData(branchType,results, settingsGraph, node,configClasses)
        
        //if no bubble is clicked or row in the table
        if(node==undefined){
          //remove a graph if in there is one
          //d3.selectAll(".graph").remove()

          //get data from results in query
          //}
          //data=buildDataBasic(results,configRow,configClasses,node)
          //add forces to graph
          setForcesGraph()

          //check if there is an object networkGraph already
          if(networkGraph){
            ////////////console.log("networkGraph")
            legend.deleteAllColors()
          }else{
            ////////////console.log("no networkGraph")
            d3.selectAll(".graph").remove()
            networkGraph = new NetworkGraph("#networkGraph", data,forces,branchType);
            legend=new Legend("legend")
          }

          collapse(networkGraph.treeData[0])
        }else{
          ////////////console.log("node not undefined")
          //add information for centering the graph
          networkGraph.addingGraph=true
          networkGraph.dblClickId=node.id.replace("_image","")+"_g"

          //build data for the graph
          //buildDataBasic(results,configRow,configClasses,node)
          networkGraph.data=flatten(networkGraph.treeData).flatData

          networkGraph.refresh()

          legend.addColors(networkGraph.colorScale)
          handleNavigation(node)

          //collapse graph if is basic type and hierarchy has more than two levels
          if(branchType=="basic"){
            if(settingsGraph.hierarchy.length>1){
                collapse(networkGraph.treeData.filter(d=>d.id==node.id)[0])
            }
          }
        }

      })
      //.fail(function (jqXHR, textStatus, errorThrown) {
      //  document.getElementById("sparql-timeout").style.display="inline-block"
      //})
      .always(function(jqXHR, textStatus, errorThrown) {
        hideSpinMessage(interval)
      })
      .done(function (data, textStatus, jqXHR) {
        //clearInterval(interval)
        //d3.select("#spin").style("display","none")
        //document.getElementById("sparql-timeout").style.display="none"
        hideSpinMessage(interval)

        

      })
      await $objectAjax */

    function getEndpointUrl(){
        //////////console.log(settingsGraph)
        var url;
        if(settingsGraph.url){
          url=settingsGraph.url
        }else{
          url=settingsGraph.endpoint_url
        }
        return url
    }
    function getQuery(){
      ////////////console.log(settingsGraph)
      var sparqlQuery;
      //////////console.log("getQuery")
      //////////console.log(branchType)
      if(branchType=="basic"){
          if (node){
              sparqlQuery=replaceParmtrsQuery(settingsGraph,node)
          }else{
              sparqlQuery=settingsGraph.query
          }
      }else if(branchType=="expert"){
          sparqlQuery=buildExpertQuery()
      }
      return sparqlQuery
    }

    function buildExpertQuery(){
        //form = { "uri": uri, "url": url, "subject-object": subjectObject }
        var sparqlQuery;
        if (settingsGraph["subject-object"] == "s") {
            sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?s=<" + settingsGraph["uri"]+ ">).}"
        } else {
            sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?o=<" + settingsGraph["uri"] + ">).}"
        }
        return sparqlQuery
    }

    /* function replaceParmtrsQuery(settingsGraph,node){
      var sparqlQuery;
      if(settingsGraph.parameters!=""){
        let parameters=get_parameters(settingsGraph.parameters)
        for (let i = 0; i < parameters.length; ++i) { 
          sparqlQuery=settingsGraph.sparqlQuery.replaceAll("PARAMETER"+(i+2).toString(), node[parameters[i]]);
        }  
        //The value for the PARAMETER in the Sparql query is the "[class]_uri" or the
        //name of the class with no "_uri"

        if((node[node["class"]+"_uri"]!=undefined)&&(node[node["class"]+"_uri"]!="")){
          sparqlQuery=sparqlQuery.replaceAll("PARAMETER", node[node["class"]+"_uri"]);
        }else{
          sparqlQuery=sparqlQuery.replaceAll("PARAMETER", node["value"]);
        }
      }else{
        //if(node["configRow"]){
        //  sparqlQuery=settingsGraph.sparqlQuery.replaceAll("PARAMETER", node["value"]);
        //}else{
        sparqlQuery=settingsGraph.sparqlQuery.replaceAll("PARAMETER", node[node["class"]+"_uri"]);
        //}        
      }
      return sparqlQuery
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
    }
}
function clusterResults(results, settings) {
  var ocurrences = [], small, big, results_small, results_big, num_occ, results_big_filtered;
  if(settings["subject-object"]){
    ////////////console.log(results)
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
    ////////////console.log(results_small)
    /* if(results_small.length>20){
      if (subjectObject == "s") {
        results_small=[{ "o": { "type": "several types", "value": results_small.length + " results", "more_results": results_small }, "p": "several properties", "s": results_big_filtered[0]["s"], "class": "Cluster" }]
      }else{
        results_small=[{ "s": { "type": "several types", "value": results_small.length + " results", "more_results": results_small }, "p": "several properties", "o": results_big_filtered[0]["o"], "class": "Cluster" }]
      }
    } */
    return results_small;
  }else{
    return results;
  }
  //////////////////////console.log(results_small)
  
}
function replaceParmtrsQuery(settingsGraph,node){
  var sparqlQuery;
  //////////console.log(settingsGraph)
  if((settingsGraph.parameters!="")&&(settingsGraph.parameters!=null)){
    let parameters=get_parameters(settingsGraph.parameters)
    for (let i = 0; i < parameters.length; ++i) { 
      sparqlQuery=settingsGraph.query.replaceAll("PARAMETER"+(i+2).toString(), node[parameters[i]]);
    }  
    //The value for the PARAMETER in the Sparql query is the "[class]_uri" or the
    //name of the class with no "_uri"

    if((node[node["class"]+"_uri"]!=undefined)&&(node[node["class"]+"_uri"]!="")){
      sparqlQuery=sparqlQuery.replaceAll("PARAMETER", node[node["class"]+"_uri"]);
    }else{
      sparqlQuery=sparqlQuery.replaceAll("PARAMETER", node["value"]);
    }
  }else{
    //if(node["configRow"]){
    //  sparqlQuery=settingsGraph.sparqlQuery.replaceAll("PARAMETER", node["value"]);
    //}else{
    //////////////console.log(node)
    //////////////console.log([node["class"]+"_uri"])
    //////////////console.log(settingsGraph.query)
    ////////////console.log(node)
    if(node["class"]=="free"){
      sparqlQuery=settingsGraph.query.replaceAll("PARAMETER", node["value"]);
    }else{
      sparqlQuery=settingsGraph.query.replaceAll("PARAMETER", node[node["class"]+"_uri"]);
    }
/*     if(node["class"]){
      sparqlQuery=settingsGraph.query.replaceAll("PARAMETER", node[node["class"]+"_uri"]);
    }else{
      sparqlQuery=settingsGraph.query.replaceAll("PARAMETER", node["value"]);
    } */
    
    //}        
  }
  return sparqlQuery
}
function getMenuItems(items,node,origin,graphType){
  var menuItems=[],elementMenu,position,width
  ////////////console.log(items)
  ////////////console.log(node)
  ////////////console.log(origin)
  ////////////console.log(graphType)
  if (node["configRow"]) {
    node["configRow"].forEach(function (r) {
      items.push({ "rowNumber": r, "row": configFile[r], "menuOption": configFile[r]["option"] })
    })
  }
  //if click on Navigation panel then origin=table
  if (origin=="table"){
    if(graphType=="basic"){
      tableBasic()
    }else if(graphType=="expert"){
      tableExpert()
    }
    //function that add menu items to table
    ////////////////////console.log("antes de add...")
    addMenuToTable(node,menuItems)
  }else{
    //if click on bubble in graph, fill menu to show on screen next to bubble
    //and add action to build basic graph in case the option in the menu is clicked
    for (var i = 0; i < items.length; i++) {
      if(graphType=="basic"){
        noTableBasic()
      }else if(graphType=="expert"){
        noTableExpert()
      }
      menuItems.push(elementMenu)
    }
    ////////////console.log(menuItems)
    ////////////console.log(node)
    if(node["class"]=="free"){
      width=500
    }else{
      width=350
    }
    //Send menuItems to menuFactory which will draw the menu in the graph
    networkGraph.menuFactory(100,0, menuItems, node,"dblClick",width)
  }
  function noTableBasic(){
    ////////////console.log(items)
    position=items[i]["position"]
    elementMenu={
      title: items[i]["option"],
      action: (data,d) => {
        
        for (var i = 0; i < configFile.length; i++) {
              if(configFile[i]["option"] == d.title){
                position=i
              }
            }
        if(node.menuOption!=undefined){
          if(node.menuOption.split(";")[0]==d.title){
            networkGraph.expandBranch(node)          
            networkGraph.data=flatten(networkGraph.treeData).flatData
            networkGraph.initializeSimulation();
            networkGraph.dataJoinGraph()
            networkGraph.enterGraph()
            
            networkGraph.initializeSimulation();
            networkGraph.dataJoinGraph()
            networkGraph.exitGraph()
          }else{
            buildBasicGraph(position,node)
          }
        }else{
          buildBasicGraph(position,node)
        }
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
          //buildFreeGraph(form, origin, node)
          buildNetworkGraph(form,"expert",node)
        }
      }
    } else {
      elementMenu = {
        title: items[i]["menuOption"],
        action: (data, d) => {
          row = configFile.findIndex(v => v.option == d.title)
          ////////////console.log(data)
          ////////////console.log(row)
          ////////////console.log(configFile[row])

          buildNetworkGraph(getFieldsConfigFile(configFile,row), "basic",data)
          //buildBasicGraph(row, d3.select("#" + data.getAttribute("id")).data()[0], d.title)
        }
      }
    }
  }
  function tableExpert(){
    if (items[i]["subject-object"]) {
      menuItems.push({ "url": items[i]["url"], "uri": items[i]["uri"], "subject-object": items[i]["subject-object"] })
    }
    else {
      menuItems.push({ "rowDataConfig": items[i]["rowNumber"], "node": node, "menuOption": items[i]["menuOption"] })
    }
  }
  function tableBasic(){
    for (var i = 0; i < items.length; i++) {
      //add all items to menu in table. Get options text and line in config file
      //and add it to the table
      menuItems.push({"option":items[i]["option"],"position":items[i]["position"]})
    }
  }
}
/* async function checkQueries(element, subjectObject, origin, pageX, pageY) {
  var node;
  //////////////console.log("checkQueries")
  var resultRows =await checkAskResultsFreeGraph(element, subjectObject)
  //////////////console.log(resultRows)
  if (typeof (element) != "string") {
    node = d3.select("#" + element.getAttribute("id")).data()[0]
  }
  //if ((origin == "bubble") || (origin == "table")) {
  if (node.menuOption != undefined) {
    filterResultRows()
  }
  //}
  if (resultRows.length > 1) {
      getMenuItems(resultRows, node, origin,"expert")
  } else if (resultRows.length == 1) {
    form = resultRows[0]
    //await buildFreeGraph(form, origin, node)
    await buildNetworkGraph(form, origin, node)
  } 
  ////////////console.log(resultRows)
  return resultRows

} */
async function checkAskResults(indexRows,node){
  var sparqlQuery,resultIndexRows=[],parameters,arrayMenuOptions

  if(node.menuOption){
    arrayMenuOptions=node.menuOption.split(";")
    indexRows=indexRows.filter(d=>!arrayMenuOptions.includes(d.option))
  }

  for (var i = 0; i < indexRows.length; i++) {
    //first we transform the select to ask query
    if(configFile[indexRows[i]["position"]]["askquery"]){
      sparqlQuery=configFile[indexRows[i]["position"]]["askquery"]
    }else{
      sparqlQuery=fromSelectToAskQuery(configFile[indexRows[i]["position"]]["query"])
    }
    
    //get parameters from config file
    parameters=configFile[indexRows[i]["position"]]["parameters"]
    if(node["class"]!=undefined){
      if((parameters!="")&&(parameters!=undefined)){
        //if there are parameters we have to replace everything form the node with the
        //parameters in the config file
        parameters=get_parameters(parameters)
        for (let j = 0; j < parameters.length; ++j) { 
          sparqlQuery=sparqlQuery.replaceAll("PARAMETER"+(j+2).toString(), node[parameters[j]]);
        }  
          if((node[node["class"]+"_uri"]!=undefined)&&(node[node["class"]+"_uri"]!="")){
            sparqlQuery=sparqlQuery.replaceAll("PARAMETER",node[node["class"]+"_uri"]);

          } else{
            sparqlQuery=sparqlQuery.replaceAll("PARAMETER",node["value"]);
          }
      }else{
        if(node[node["class"]+"_uri"]!=undefined){
          sparqlQuery=sparqlQuery.replaceAll("PARAMETER",node[node["class"]+"_uri"]);
        } else{
          sparqlQuery=sparqlQuery.replaceAll("PARAMETER",node[node["value"]+"_code"]);
        }
      }
    }else{
      sparqlQuery=sparqlQuery.replaceAll(node,"PARAMETER"); 
    }
    console.log(sparqlQuery)
    try {
      results = await runAskSparlqQuery(configFile[indexRows[i]["position"]]["endpoint_url"],sparqlQuery);
    } catch (e) {
      console.log(e)
      results = false
    } /* finally {
        ////////////console.log('We do cleanup here');
    } */
    //results = await runAskSparlqQuery(configFile[indexRows[i]["position"]]["endpoint_url"],sparqlQuery)
    ////////////console.log(results)
    //add row to the results if there are results returned
    if(results==true){
      resultIndexRows.push(indexRows[i])
    }
  }
  //////////////console.log(resultIndexRows)
  return resultIndexRows
}
async function checkAskResultsFreeGraph(node, so) {
  var resultRows = []

  return new Promise((resolve, reject) => {
    d3.csv("../config_vinalod/sparqlEndpoints.csv",async function(urls){
        //////////////////console.log(urls)
        if (so == undefined) {
          subjectObject = ['s', 'o']
        } else {
          subjectObject = [so]
        }
        //////////////console.log(subjectObject)
        //////////////console.log(urls)
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
      //////////////console.log(resultRows)
      resolve(resultRows)
    })
  })
}
/* function getMenuItems(items,node,pageX,pageY,origin){
  var menuItems=[],element,position
  
  //if click on Navigation panel then origin=table
  if (origin=="table"){
    for (var i = 0; i < items.length; i++) {
      //add all items to menu in table. Get options text and line in config file
      //and add it to the table
      menuItems.push({"option":items[i]["option"],"position":items[i]["position"]})
    }
    //function that add menu items to table
    ////////////////////console.log("antes de add...")
    addMenuToTable(node,menuItems)
  }else{
    //if click on bubble in graph, fill menu to show on screen next to bubble
    //and add action to build basic graph in case the option in the menu is clicked
    for (var i = 0; i < items.length; i++) {
      position=items[i]["position"]
      element={
        title: items[i]["option"],
        action: (data,d) => {
          
          for (var i = 0; i < configFile.length; i++) {
                if(configFile[i]["option"] == d.title){
                  position=i
                }
              }
          if(node.menuOption!=undefined){
            if(node.menuOption.split(";")[0]==d.title){
              networkGraph.expandLevelBranch(node)          
              networkGraph.data=flatten(networkGraph.treeData).flatData
              networkGraph.initializeSimulation();
              networkGraph.dataJoinGraph()
              networkGraph.enterGraph()
              
              networkGraph.initializeSimulation();
              networkGraph.dataJoinGraph()
              networkGraph.exitGraph()
            }else{
              buildBasicGraph(position,node,d.title)
            }
          }else{
            buildBasicGraph(position,node,d.title)
          }
        }
      }
      menuItems.push(element)
    }
    //Send menuItems to menuFactory which will draw the menu in the graph
    networkGraph.menuFactory(100,0, menuItems, node,"dblClick",250)
  }
}
function getMenuItemsFreeGraph(items, node, pageX, pageY, origin) {
  var menuItems = [], elementMenu,form, uri, url, subjectObject, row
  //////////////////console.log(node)
  if (node["configRow"]) {
    node["configRow"].forEach(function (r) {
      items.push({ "rowNumber": r, "row": configFile[r], "menuOption": configFile[r]["option"] })
    })
  }

  if (origin == "table") {
    for (var i = 0; i < items.length; i++) {
      if (items[i]["subject-object"]) {
        menuItems.push({ "url": items[i]["url"], "uri": items[i]["uri"], "subject-object": items[i]["subject-object"] })
      }
      else {
        menuItems.push({ "rowDataConfig": items[i]["rowNumber"], "node": node, "menuOption": items[i]["menuOption"] })
      }
    }
    navigation.addMenuToTable(node, menuItems)
  } else {
    for (var i = 0; i < items.length; i++) {
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
            //buildFreeGraph(form, origin, node)
            buildNetworkGraph(form,"expert",node)
          }
        }
      } else {
        elementMenu = {
          title: items[i]["menuOption"],
          action: (data, d) => {
            row = configFile.findIndex(v => v.option == d.title)
            buildBasicGraph(row, d3.select("#" + data.getAttribute("id")).data()[0], d.title)
          }
        }
      }
      menuItems.push(elementMenu)
    }
    networkGraph.menuFactory(pageX - 400, pageY - 450, menuItems, element, "dblClick", 500)
  }

} */