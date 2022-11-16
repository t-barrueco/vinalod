MenuItems = function (_node) {
    this.node=_node
  };

MenuItems.prototype.init = async function () {
  var mi=this;
  //////////////////////console.log(document.getElementsByTagName("table"))
  mi.indexRows=[]
  mi.treeSelectedRows=0
  ////console.log(linkedDataGraph.treeData)
  await mi.buildOptions()
  //////////console.log(mi.indexRows[0]["askquery"])
  //console.log(mi)
  mi.filterByMenuOption()
  await mi.filterByAskResult()
  //mi.addCollapsedOptions()
  ////console.log("despues filterByAskResult")
  //mi.getNumberTreeResults()
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
    //////////console.log(mi.node)
    //////////console.log(mi.indexRows)
    //////////console.log(configFileExpert)
    if(mi.node.menuOption){
      let menuOptions=mi.node.menuOption.split(";")
      mi.indexRows=mi.indexRows.filter(d=>(!menuOptions.includes(d.option)))
    }
    //////////console.log(mi.indexRows)
}

MenuItems.prototype.filterByAskResult = async function () {
    var mi=this;
    mi.selectedRows=[]
    ////////console.log(mi.indexRows)
    for (var i = 0; i < mi.indexRows.length; i++) {
        try {
            //////////console.log(mi.indexRows[i].askquery)
            results = await runSparlqQuery(mi.indexRows[i].endpoint_url,mi.indexRows[i].askquery,"askquery");
            //////////////console.log(results)
        } catch (e) {
        results = false
        } 

        if(results==true){
          //////////////console.log("addselectedRow")
          mi.addSelectedRow(i)
        }
    }
  ////console.log("final filterByAskResult")
}

MenuItems.prototype.getSelectedRowByOption = async function (option){
    var mi=this;
    let row=mi.selectedRows.filter(d=>d.option==option)[0]
    return row
}
MenuItems.prototype.getMenuItemsInGraph = async function (){
    var mi=this;

    var elementMenu,position,width
    mi.menuItems=[]

    for (var i = 0; i < mi.selectedRows.length; i++) {
        elementMenu=mi.detailsMenuItemsInGraph(i)
        mi.menuItems.push(elementMenu)
    }

    elementMenu=mi.collapsedBranchMenuItemsInGraph()
    if(elementMenu!=-1){
      mi.menuItems.push(elementMenu)
    }
    if(mi.node["class"]=="free"){
        width=500
    }else{
        width=350
    }
    //////////////////console.log(networkGraph)
    networkGraph.menuFactory(100,0, mi.menuItems, mi.node,"dblClick",width)

}

MenuItems.prototype.getMenuItemsInTable = async function (){
    var menuItems=[],elementMenu,position,width
    var mi=this;

    ////////////////console.log(mi)
    ////////////////console.log("getMenuInTable")
    //navigationPanel.addMenuToTable()

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

/* MenuItems.prototype.update = async function (node) {
  var mi=this;
  mi.node=node
  mi.menuItems=[]
  await mi.init()
} */

function MenuItemsExpert(...args){
  MenuItems.apply(this, args);
  }
  
MenuItemsExpert.prototype = Object.create(MenuItems.prototype);

MenuItemsExpert.prototype.buildOptions = async function(){
  var mi=this,option;
  //////////console.log(configFileExpert)
  configFileExpert.option.forEach(option => {
    //////////console.log(option)
    //////////console.log(mi.node)
    let position = option.match("and Position: (.*)")[1];
    if((!mi.node["subject-object"])||(position==mi.node["subject-object"])){
      mi.indexRows.push(new OptionNodeExpert(option,mi.node))
    }
    //////////////console.log(configFileExpert)
    
    /* configFileExpert.position.forEach(position => {
      //////////console.log(position)
      let option_values={"endpoint_url":element["sparqlEndpoint"],"position":position}
      let option={"option":element.option}
      //////////console.log(option)
      mi.indexRows.push(new OptionNodeExpert(option_values,mi.node))
    }) */
  })
  ////////////console.log(mi)
  
}
/* MenuItemsExpert.prototype.buildOptions = async function(){
  var mi=this,cr,j=0;
  mi.indexRows=[]
  mi.selectedRows=[]
  const p = new Promise((resolve, reject) => {   d3.csv('../config_vinalod/sparqlEndpoints.csv', (err, data1) => {     if (err) {       reject(err);     } else {       resolve(data1);     }   }); }); 
  await p.then(async function (urls) {
    if(mi.node["id"]){
      subjectObject=['s','o']
    }else{
      subjectObject = [mi.node["subject-object"]]
    }
    uri = mi.node.uri
    mi.query=buildExpertQuery()
    mi.askquery=fromSelectToAskQuery(mi.query)
    subjectObject.forEach(function(d){
      for (var i = 0; i < urls.length; i++) {
        mi.indexRows[j]={}
        mi.indexRows[j]["url"]=urls[i]["sparqlEndpoint"]
        mi.indexRows[j]["askquery"]=mi.askquery
        mi.indexRows[j]["query"]=mi.query
        mi.indexRows[j]["subject-object"]=d
        mi.indexRows[j]["uri"]=uri
        j+=1;
      }
    })

    mi.selectedRows=mi.indexRows
  })
  function buildExpertQuery(){
    var sparqlQuery;
    if (mi.node["subject-object"] == "s") {
        sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?s=<" + mi.node["uri"]+ ">).}"
    } else {
        sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?o=<" + mi.node["uri"] + ">).}"
    }
    return sparqlQuery
  } 
} */

MenuItemsExpert.prototype.addSelectedRow=function (i){
  var mi=this;
  //////////////console.log(i)
  //////////////console.log(mi.selectedRows)
  //mi.indexRows[i]
  mi.selectedRows.push(mi.indexRows[i])
}

MenuItemsExpert.prototype.detailsMenuItemsInGraph=function (i){
  var mi=this;
  //uri = mi.selectedRows[i]["uri"]
  //url = mi.selectedRows[i]["url"]
  //query=mi.selectedRows[i]["query"]
  //subjectObject = mi.selectedRows[i]["subject-object"]
  //itemsDetails = { "uri": uri, "url": url, "subject-object": subjectObject }
  elementMenu = {
      title: "Sparql Endpoint: " + mi.selectedRows[i].endpoint_url + " and Position: " + mi.selectedRows[i]["position"],
      action: async (data,d) => {
      //////////console.log(d)
      ////////////console.log(data)
      
      let url = d.title.match("Sparql Endpoint: (.*) and Position:")[1];
      let position = d.title.match("and Position: (.*)")[1];
      let selectedRow=mi.selectedRows.filter(s=>(s.position==position&&s.endpoint_url==url))[0]
      form = { "url": url, "uri": selectedRow.node.uri, "position": position,"query":selectedRow.query}
      //await linkedDataGraph.update(form,data)
      //networkGraph.refresh()
      setMenuOption(data,d.title)
      //////////console.log(data)
      checkGraphExpert(form,data)
      //checkFilters()

      //////////////////////console.log(document.getElementsByTagName("table"))

      }
  }
  return elementMenu
}

MenuItemsExpert.prototype.getMenuItemsInPopup=function (){
  var mi=this;
  var modal;
  //$(".graph").remove()

  $("#modal3-content form").remove()

  d3.select("#modal3-content").select("div").remove()

  var content = document.getElementById("modal3-content");

  //////////console.log(mi)
  addOptions()

  modal = document.getElementById("myModal3")
  modal.style.display = "block";
  $("#graph-area").removeClass("hidden")
  $('#myModal3').resizable({

  });
  $("#myModal3").draggable()

  function addOptions(){
    var i=1;
    $.get("pages/popup_options.html", function (data) {
      //////////console.log(mi.selectedRows)
      mi.selectedRows.forEach(function (r) {
        //////////console.log(r)
        htmlOption=data
        htmlOption=htmlOption.replace("Option *","Option "+ String(i)).replace("Node URI",r.node.uri).replace("Subject",r.position).replace("Value_URL",r.endpoint_url)
        //////////////////////console.log(i)
        if(i!=mi.selectedRows.length){
          htmlOption+="<hr>"
        }
        //////////////////////console.log(htmlOption)
        $("#modal3-content").append($(htmlOption))
        i+=1
      })
    });
  }

}

MenuItemsExpert.prototype.getMenuItemsInTable = async function (){
  var menuItems=[],elementMenu,position,width
  var mi=this;

  //////////////console.log(mi)

  navigationPanel.addMenuToTable()
/*   for (var i = 0; i < items.length; i++) {
    if (items[i]["subject-object"]) {
        if(items[i]["subject-object"][0]){
        menuItems.push({ "url": items[i]["url"], "uri": items[i]["uri"], "subject-object": items[i]["subject-object"][0] })
        }else{
        menuItems.push({ "url": items[i]["url"], "uri": items[i]["uri"], "subject-object": items[i]["subject-object"]})
        }
    }else {
        menuItems.push({ "rowDataConfig": items[i]["rowNumber"], "node": node, "menuOption": items[i]["menuOption"] })
    }
  } */
}

function MenuItemsBasic(...args){
  MenuItems.apply(this, args);
  }
  
MenuItemsBasic.prototype = Object.create(MenuItems.prototype);

MenuItemsBasic.prototype.buildOptions=function (){
  var mi=this;
  //mi.indexRows=[]
  configFile.getRowsNodeClass(mi.node["className"]).forEach(element => {
    //////////////console.log(element)
    mi.indexRows.push(new OptionNodeBasic(element.option,mi.node))
    mi.indexRows[mi.indexRows.length - 1]["url"]=mi.indexRows[mi.indexRows.length - 1]["endpoint_url"]
    //mi.indexRows[mi.indexRows.length - 1]["askquery"]=mi.indexRows[mi.indexRows.length - 1]["askquery"]
    ////////console.log(mi.indexRows[mi.indexRows.length - 1]["askquery"])
  });
  //////////////console.log(mi.indexRows)
}

/* MenuItemsBasic.prototype.addCollapsedOptions = async function () {
  var mi=this;

  mi.selectedRows.push(new OptionNodeBasic("to be determined",mi.node))
} */
/* MenuItemsBasic.prototype.buildOptions=function (){
  var mi=this;
  mi.indexRows=[]
  mi.selectedRows=configFile.getRowsNodeClass(mi.node["className"])
  mi.selectedRows.forEach(element => {
      mi.indexRows.push(new ConfigRow(element.option,mi.node))
      //mi.indexRows[mi.indexRows.length - 1].fromSelectToAskQuery()
      mi.indexRows[mi.indexRows.length - 1]["url"]=mi.indexRows[mi.indexRows.length - 1]["rowFields"]["endpoint_url"]
      mi.indexRows[mi.indexRows.length - 1]["askquery"]=mi.indexRows[mi.indexRows.length - 1]["rowFields"]["askquery"]
      ////////////////console.log(mi.indexRows[mi.indexRows.length - 1]["askquery"])
  });
  ////////////////console.log(mi.indexRows)
} */
MenuItemsBasic.prototype.addSelectedRow=function (i){
  var mi=this;
  //////////console.log(mi.indexRows[i])
  if(configFile.file.filter(d=>d.option==mi.indexRows[i]["option"])[0]["type"]=="TREE") mi.treeSelectedRows+=1
  mi.selectedRows.push(mi.indexRows[i])
}

MenuItemsBasic.prototype.detailsMenuItemsInGraph=function (i){
  var mi=this;
  elementMenu={
    title: mi.selectedRows[i]["option"],
    action: async (data,d) => {
        //////////console.log(data)
        ////////////console.log(d)
        ////////////console.log(mi)
        //data.menuOption=d.title
        setMenuOption(data,d.title)
        ////////console.log(data)
        checkGraph(mi.selectedRows.filter(s=>s.option==d.title)[0],data)
    }
    }
  return elementMenu
}

MenuItemsBasic.prototype.collapsedBranchMenuItemsInGraph=function (){
  var mi=this;
  //console.log(mi.node)
  //console.log(configRow)
  let nodeTreeData=linkedDataGraph.treeData.filter(d=>d.id==mi.node.id)
  if((nodeTreeData.length>0)&&(nodeTreeData[0]._children)){
    elementMenu={
      title: configRow.option,
      action: async (data,d) => {
          //setMenuOption(data,d.title)
          networkGraph.expandBranch(data)
          //checkGraph(mi.selectedRows.filter(s=>s.option==d.title)[0],data)
      }
      }
    return elementMenu
  }
  return -1
}

MenuItemsBasic.prototype.getMenuItemsInTable = async function (){
  var menuItems=[],elementMenu,position,width
  var mi=this;

  //////////////console.log(mi)
  navigationPanel.addMenuToTable()
}

MenuItemsBasic.prototype.getMenuItemsInTableFromNav = async function (){
  var menuItems=[],elementMenu,position,width
  var mi=this;

  //////////////console.log(mi)
  navigationPanel.addMenuToTableFromNav()
}

/* MenuItemsBasic.prototype.getNumberTreeResults = async function (){
  var mi=this;

  let results=mi.selectedRows.map(d=>d.option).filter(function(f){
    //////////console.log(f)
    if(configFile.file.filter(c=>c.option==f)[0]["type"]=="TREE") return f
  })
  //////////console.log(results)
} */
