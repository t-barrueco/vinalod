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
      mi.checkMenuOptions(menuOptions)
    }
}

MenuItems.prototype.getMenuItemsInGraph = async function (){
    var mi=this;

    var elementMenu,position,width
    mi.menuItems=[]

    for (var i = 0; i < mi.selectedRows.length; i++) {
        elementMenu=mi.detailsMenuItemsInGraph(i)
        mi.menuItems.push(elementMenu)
    }
    //// MIRAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  configFileExpert.option.forEach(option => {
    let position = option.match("and Position: (.*)")[1];
    if((!mi.node["position"])||(position==mi.node["position"])){
      mi.indexRows.push(new OptionNodeExpert(option,mi.node))
    }
  })  

  if((node.configRow)&&(node.configRow.length>0)){
    for (var i = 0; i < node.configRow.length; i++) {
      mi.indexRows.push(new OptionNodeBasic(configFile.file[node.configRow[i]].option,mi.node))
      mi.indexRows[mi.indexRows.length - 1]["url"]=mi.indexRows[mi.indexRows.length - 1]["endpoint_url"]
    }
  }
}

MenuItemsExpert.prototype.addSelectedRow=function (i){
  var mi=this;
  mi.selectedRows.push(mi.indexRows[i])
}

MenuItemsExpert.prototype.checkMenuOptions=function(menuOptions){
  var mi=this;
  mi.indexRows=mi.indexRows.filter(d=>(!menuOptions.includes(d.endpoint_url+","+d.position)))
}

MenuItemsExpert.prototype.filterByAskResult = async function () {
  var mi=this;
  mi.selectedRows=[]
  for (var i = 0; i < mi.indexRows.length; i++) {
    if(!(mi.indexRows[i] instanceof OptionNodeBasic)){
      try {
        results = await runSparlqQuery(mi.indexRows[i].endpoint_url,mi.indexRows[i].askquery,"askquery");
      } catch (e) {
      results = false
      } 
      if(results==true){
        mi.addSelectedRow(i)
      }
    }else{
      mi.addSelectedRow(i)
    }
  }
}

MenuItemsExpert.prototype.detailsMenuItemsInGraph=function (i){
  var mi=this;

  if(!(mi.selectedRows[i] instanceof OptionNodeBasic)){
    elementMenu = {
        title: "Sparql Endpoint: " + mi.selectedRows[i].endpoint_url + " and Position: " + mi.selectedRows[i]["position"],
        action: async (data,d) => {
        configRow=new ConfigRowExpert(d.title,menuItems.node)
        let url = d.title.match("Sparql Endpoint: (.*) and Position:")[1];
        let position = d.title.match("and Position: (.*)")[1];
        let selectedRow=mi.selectedRows.filter(s=>(s.position==position&&s.endpoint_url==url))[0]
        addExpertGraph(selectedRow,node)
        }
    }
  }else{
    elementMenu=detailsMenuItemsInGraphBasic(i)
  }
  return elementMenu
}

MenuItemsExpert.prototype.getMenuItemsInPopup=function (){
  var mi=this;

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

MenuItemsBasic.prototype.checkMenuOptions=function(menuOptions){
  var mi=this;
  mi.indexRows=mi.indexRows.filter(d=>(!menuOptions.includes(d.option)))
}

MenuItemsBasic.prototype.filterByAskResult = async function () {
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

MenuItemsBasic.prototype.detailsMenuItemsInGraph=function (i){
  var mi=this;
  elementMenu={
    title: mi.selectedRows[i]["option"],
    action: async (data,d) => {
      if(configRow instanceof ConfigRowExpert){
        configRow = new ConfigRowBasic(d.title);
        await configRow.init()
      }
      setMenuOption(data,d.title)
      addBasicGraph(mi.selectedRows.filter(s=>s.option==d.title)[0],data)
    }
    }
  return elementMenu
}

function detailsMenuItemsInGraphBasic(i){
  elementMenu={
    title: menuItems.selectedRows[i]["option"],
    action: async (data,d) => {
        if((!configRow)||(configRow instanceof ConfigRowExpert)){
          configRow = new ConfigRowBasic(d.title);
          await configRow.init()
          let newColors=Object.keys(networkGraph.colorCorrespondence).filter(function(x){
            if(!networkGraph.colorScaleRange.includes(x)){
              return x;
            }
          });
          let newClasses=configRow.getClassesCorrespondence()
          networkGraph.nodesClassesShow = { ...networkGraph.nodesClassesShow,  ...newClasses };
          networkGraph.colorScaleRange=networkGraph.colorScaleRange.concat(newColors)
          networkGraph.colors=networkGraph.colors.concat(["#FCA5A5","#C4B5FD","#D1D5DB","#10B981","#F59E0B","#EC4899","#3B82F6","#6B7280"])
          networkGraph.colorScale
          .range(networkGraph.colorScaleRange)
        }
        setMenuOption(data,d.title)
        addBasicGraph(menuItems.selectedRows.filter(s=>s.option==d.title)[0],data)
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


