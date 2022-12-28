MenuItems = function (_node,_position) {
    this.node=_node
    this.position=_position
  };

MenuItems.prototype.init = async function () {
  var mi=this;
  mi.indexRows=[]
  mi.treeSelectedRows=0
  await mi.buildOptions()
  mi.filterByMenuOption()
  await mi.filterByAskResult()
}

MenuItems.prototype.filterByMenuOption = function () {
    var mi=this;
    if(mi.node.menuOption){
      let menuOptions=mi.node.menuOption.split(";")
      mi.indexRows=mi.indexRows.filter(d=>(!menuOptions.includes(d.option)))
    }
}

MenuItems.prototype.filterByAskResult = async function () {
    var mi=this;
    mi.selectedRows=[]
    for (var i = 0; i < mi.indexRows.length; i++) {
        try {
            results = await runSparlqQuery(mi.indexRows[i].endpoint_url,mi.indexRows[i].askquery,"askquery");
        } catch (e) {
        results = false
        } 

        if(results==true){
          mi.addSelectedRow(i)
        }
    }
}
/* 
MenuItems.prototype.getSelectedRowByOption = async function (option){
    var mi=this;
    let row=mi.selectedRows.filter(d=>d.option==option)[0]
    return row
} */
MenuItems.prototype.getMenuItemsInGraph = async function (){
    var mi=this;

    var elementMenu,position,width
    mi.menuItems=[]

    //console.log(mi.selectedRows)
    for (var i = 0; i < mi.selectedRows.length; i++) {
        elementMenu=mi.detailsMenuItemsInGraph(i)
        mi.menuItems.push(elementMenu)
    }

    elementMenu=mi.collapsedBranchMenuItemsInGraph()
    if(elementMenu!=-1){
      mi.menuItems.push(elementMenu)
    }
    if(mi.node["class"]=="free"){
        width=600
    }else{
        width=350
    }
    networkGraph.menuFactory(100,0, mi.menuItems, mi.node,"dblClick",width)

}

/* MenuItems.prototype.getMenuItemsInTable = async function (){
    var menuItems=[],elementMenu,position,width
    var mi=this;

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
} */

MenuItems.prototype.update = async function (node) {
    var mi=this;
    mi.node=node
    mi.menuItems=[]
    await mi.init()
  }

MenuItems.prototype.collapsedBranchMenuItemsInGraph=function (){
  var mi=this;
  let nodeTreeData=linkedDataGraph.treeData.filter(d=>d.id==mi.node.id)
  if((nodeTreeData.length>0)&&(nodeTreeData[0]._children)){
    elementMenu={
      title: configRow.option,
      action: async (data,d) => {
          networkGraph.expandBranch(data)
      }
      }
    return elementMenu
  }
  return -1
}

function MenuItemsExpert(...args){
  MenuItems.apply(this, args);
  }
  
MenuItemsExpert.prototype = Object.create(MenuItems.prototype);

MenuItemsExpert.prototype.buildOptions = async function(){
  var mi=this,option;
  console.log(mi.node["position"])
  configFileExpert.option.forEach(option => {
    let position = option.match("and Position: (.*)")[1];
    if((!mi.node["position"])||(position==mi.node["position"])){
      mi.indexRows.push(new OptionNodeExpert(option,mi.node))
    }
  })  
}

MenuItemsExpert.prototype.addSelectedRow=function (i){
  var mi=this;
  mi.selectedRows.push(mi.indexRows[i])
}

MenuItemsExpert.prototype.detailsMenuItemsInGraph=function (i){
  var mi=this;
  elementMenu = {
      title: "Sparql Endpoint: " + mi.selectedRows[i].endpoint_url + " and Position: " + mi.selectedRows[i]["position"],
      action: async (data,d) => {
      let url = d.title.match("Sparql Endpoint: (.*) and Position:")[1];
      let position = d.title.match("and Position: (.*)")[1];
      let selectedRow=mi.selectedRows.filter(s=>(s.position==position&&s.endpoint_url==url))[0]
/*       form = { "url": url, "uri": selectedRow.node.uri, "position": position,"query":selectedRow.query}
      //console.log(data)
      //console.log(d)
      //console.log("entra por details menu in graph")
      checkGraphExpert(form,data)
      setMenuOption(data,d.title) */
      checkGraphExpert(selectedRow,node)
      }
  }
  return elementMenu
}

MenuItemsExpert.prototype.getMenuItemsInPopup=function (){
  var mi=this;
  var modal;

  $("#modal3-content form").remove()

  d3.select("#modal3-content").select("div").remove()

  var content = document.getElementById("modal3-content");
  addOptions()

  showPopupWindowExpert()
  showGraphArea()

  function addOptions(){
    var i=1;
    $.get("pages/popup_options.html", function (data) {
      mi.selectedRows.forEach(function (r) {
        htmlOption=data
        htmlOption=htmlOption.replace("Option *","Option "+ String(i)).replace("Node URI",r.node.uri).replace("Subject",r.position).replace("Value_URL",r.endpoint_url)
        if(i!=mi.selectedRows.length){
          htmlOption+="<hr>"
        }
        $("#modal3-content").append($(htmlOption))
        i+=1
      })
    });
  }

}

MenuItemsExpert.prototype.getMenuItemsInTable = async function (){
  var menuItems=[],elementMenu,position,width
  var mi=this;

  navigationPanel.addMenuToTable()
}

function MenuItemsBasic(...args){
  MenuItems.apply(this, args);
  }
  
MenuItemsBasic.prototype = Object.create(MenuItems.prototype);

MenuItemsBasic.prototype.buildOptions=function (){
  var mi=this;
  configFile.getRowsNodeClass(mi.node["className"]).forEach(element => {
    mi.indexRows.push(new OptionNodeBasic(element.option,mi.node))
    mi.indexRows[mi.indexRows.length - 1]["url"]=mi.indexRows[mi.indexRows.length - 1]["endpoint_url"]
  });
}

MenuItemsBasic.prototype.addSelectedRow=function (i){
  var mi=this;
  if(configFile.file.filter(d=>d.option==mi.indexRows[i]["option"])[0]["type"]=="TREE") mi.treeSelectedRows+=1
  mi.selectedRows.push(mi.indexRows[i])
}

MenuItemsBasic.prototype.detailsMenuItemsInGraph=function (i){
  var mi=this;
  elementMenu={
    title: mi.selectedRows[i]["option"],
    action: async (data,d) => {
        setMenuOption(data,d.title)
        addBasicGraph(mi.selectedRows.filter(s=>s.option==d.title)[0],data)
    }
    }
  return elementMenu
}

MenuItemsBasic.prototype.getMenuItemsInTable = async function (){
  var menuItems=[],elementMenu,position,width
  var mi=this;
  navigationPanel.addMenuToTable()
}

MenuItemsBasic.prototype.getMenuItemsInTableFromNav = async function (){
  var menuItems=[],elementMenu,position,width
  var mi=this;
  navigationPanel.addMenuToTableFromNav()
}


