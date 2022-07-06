MenuItems = function (_node) {
    this.node=_node
    this.init();
  };

MenuItems.prototype.init = async function () {
    var mi=this,cr;
    mi.indexRows=[]
    mi.selectedRows=configFile.getRowsNodeClass(mi.node["className"])
    mi.selectedRows.forEach(element => {
        mi.indexRows.push(new ConfigRow(element.option,mi.node))
    });
    //throw new Error("Something went badly wrong!");
    mi.filterByMenuOption()
    await mi.filterByAskResult()
  }

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
        parameters=mi.indexRows[i].rowFields["parameters"]
        try {
            results = await runAskSparlqQuery(mi.indexRows[i].rowFields["endpoint_url"],mi.indexRows[i].rowFields["askquery"]);
            console.log(results)
        } catch (e) {
        results = false
        } 
        if(results==true){
            resultIndexRows.push(mi.indexRows[i].rowFields)
        }
    }

    mi.selectedRows=resultIndexRows
    console.log(mi.selectedRows)
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
        //////////////////////////////////////////////////////////////////console.log(node)
    }else{
        ////////////////////////////////////////////////////////////////////console.log("else")
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
    //////console.log(row)
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
        action: (data,d) => {
            buildBasicGraph(d.title,mi.node)  
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
        console.log("addMenuToTable")
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