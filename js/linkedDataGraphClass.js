LinkedDataGraph = function (_option) {
    this.option=_option;
    //this.settings=_settings
    //this.node=_node;
  };

LinkedDataGraph.prototype.init = function () {
    var ldg=this;
    //ldg.filterClassesObjects=[]
    //await ldg.getResults()
    //////////////console.log("antes de buildData")
    ////////////console.log(configRow)
    ldg.buildData()
    //ldg.getFilters()
    //////////////////////////////console.log(ldg.data.treeData)
  }

/* LinkedDataGraph.prototype.getResults = async function () {
    var ldg=this;
    configRow.results = await runSparlqQuery(configRow.endpoint_url,configRow.query,"query");
    //////////////////////////////console.log(configRow.results)
  } */

LinkedDataGraph.prototype.buildData = function () {
  var ldg=this;
  ////////////console.log(configRow)
  ldg.buildTreeData()
  ldg.flatten()
}

LinkedDataGraph.prototype.collapseBranch = function (node){
  var ldg=this;
  
  function recurse(node) {
    console.log(node)
    let index=ldg.treeData.findIndex(d=>d.id==node.id)
    if(index!=-1){
      ldg.treeData[index]._children = ldg.treeData[index].children;
      delete ldg.treeData[index].children;
      ldg.treeData[index]["hidden"]=true
      if (ldg.treeData[index]._children){
        ldg.treeData[index]._children.forEach(function(c){
          console.log(c)
          recurse(c)
        })
      }
    }
    
  }
  recurse(node)
}

LinkedDataGraph.prototype.expandBranch = function (node){
  var ldg=this;

  function recurse(node) {
    console.log(node)
    let index=ldg.treeData.findIndex(d=>d.id==node.id)
    if(index!=-1){
      if(ldg.treeData[index]._children){
        ldg.treeData[index].children = ldg.treeData[index]._children;
        delete ldg.treeData[index]._children;
      } 
      if(ldg.treeData[index]["hidden"]) delete ldg.treeData[index]["hidden"]
      if (ldg.treeData[index].children){
        ldg.treeData[index].children.forEach(function(c){
          console.log(c)
          recurse(c)
        })
      }
    }
    
  }

  recurse(node)
}

LinkedDataGraph.prototype.showFirstLevelBranch = function(node){
  var ldg=this;
  let position=ldg.treeData.findIndex(d=>d.id==node.id)
  if(position!=-1){
    delete ldg.treeData[position]["hidden"]
    if(ldg.treeData[position]._children){
      ldg.treeData[position].children=ldg.treeData[position]._children
      delete ldg.treeData[position]._children
      ldg.treeData[position].children.forEach(d=>delete d["hidden"])
    }
  }
  console.log(ldg.treeData)
}

LinkedDataGraph.prototype.expandFirstLevelBranch = function(node){
  var ldg=this;
  let position=ldg.treeData.findIndex(d=>d.id==node.id)
  if(position!=-1){
    delete ldg.treeData[position]["hidden"]
    console.log(ldg.treeData[position]["children"])
    if(ldg.treeData[position]._children){
      ldg.treeData[position].children=ldg.treeData[position]._children
      delete ldg.treeData[position]._children
      ldg.treeData[position].children.forEach(d=>delete d["hidden"])
    }
  }
  console.log(ldg.treeData)
}

LinkedDataGraph.prototype.flatten = function(){
    var nodes = [], links=[];
    var ldg=this;

    function recurse(node) {
      if(!node["hidden"]){
        position=nodes.indexOf(nodes.filter(function(item) {
          return item.id == node.id
        })[0])
        if(position==-1){
          nodes.push(node)
          position=(nodes.length)-1
        }
        if (node.children){
          nodes[position]["number"]=node.children.length
          node.children.forEach(function(c){
            if(!c["hidden"]){
              position=links.indexOf(links.filter(function(item) {
                return ((item.source == node.id)&&(item.target == c.id))
              })[0])
              if(position==-1){
                ldg.addLink(node,c,links)
              }
              recurse(c)
            }
          });
        }else{
          nodes[position]["number"]=0;
        } 
      }

    }

    ldg.treeData.forEach(function(r){
      recurse(r);
    })
    //console.log(nodes)
    ldg.data={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.treeData};
}
LinkedDataGraph.prototype.add = function(){
  var ldg=this;
  ldg.data.treeData=ldg.treeData
  ldg.flatten()
}
LinkedDataGraph.prototype.filter = function(){
  var ldg=this;

  function recurse(node) {
    var hidden=false;

    checkHidden(node)

    if (node.children){
      node.children.forEach(function(c){
        checkHidden(c)
      })
    }
  }

  ldg.treeData.forEach(function(r){
    recurse(r);
  })

  ldg.flatten()

  function checkHidden(node){
    if (checkFilter(node)){
      node.hidden=true
      node.filter=true
    }else{
      delete node.hidden
      delete node.filter
    }
    hidden=false
  }

  function checkFilter(node){
    var hidden=false,filters,condition
    let filterClass=networkGraph.filterClassesObjects.filter(function(f){
      ////////////////console.log(f)
      ////////////////console.log(node)
      return f.name==node.class
    })
    if(filterClass.length>0){
      filters=filterClass[0].filters
      for (let i = 0; i < filters.length; ++i) {
      //filterClass[0].filters.forEach(function (fi){
        //////////////////////console.log(fi.filterObject)
        ////////////////console.log(filters[i].checkConditionNode(node))
        //////////////console.log(node)
        condition=filters[i].checkConditionNode(node)
        //////////////console.log(filters[i])
        //////////////console.log(condition)
        if(condition){
          //////////////////////console.log("true")
          hidden=true
          //break;
        //}else{
          //////////////////////console.log("false")
        }
      }
    }
    //////////////console.log(node)
    //////////////console.log(hidden)
    return hidden
  }
}
LinkedDataGraph.prototype.clearFilter = function(){
  var ldg=this;

  function recurse(node) {
    //var hidden=false;

    //checkHidden(node)
    ////////////////console.log(node)
    if(node.filter){
      delete node.hidden
      delete node.filter
    }
    if (node.children){
      node.children.forEach(function(c){
        recurse(c)
      })
    }
  }

  ldg.treeData.forEach(function(r){
    recurse(r);
  })

  ldg.flatten()

}
/* LinkedDataGraph.prototype.updateData=function(){
  var ldg=this;
  
} */
function LinkedDataGraphBasic(...args){
  LinkedDataGraph.apply(this, args);
}

LinkedDataGraphBasic.prototype = Object.create(LinkedDataGraph.prototype);

LinkedDataGraphBasic.prototype.settingsFromOption = async function(){
  var ldg=this;
  //console.log(configRow)
  if((!configRow)||(configRow instanceof ConfigRowExpert)){
    configRow = new ConfigRowBasic(ldg.option);
    await configRow.init()
  }else{
    await configRow.update(ldg.option,ldg.node)
  }
  await ldg.init()
};

LinkedDataGraphBasic.prototype.importGraph = function(fileText){
  var ldg=this;
  //console.log(ldg)
  ////console.log(configRow)
  //console.log(fileText)

  ldg.treeData=fileText.treeData
  //ldg.classesCorrespondence=fileText.classesCorrespondence
  if(!configRow){
    //console.log("antes configRow")
    configRow = new ConfigRowBasic(fileText.option);
    //console.log("despues crearConfiRowBasic")

    configRow.initImport()
    //console.log("despues initImport")

  }
  configRow.treeData=fileText.treeData
  //console.log("antes de flatten")
  ldg.flatten()
  //console.log("despues de flatten")
}

LinkedDataGraphBasic.prototype.update = async function(option){
  var ldg=this;
  //ldg.option=option
  //ldg.node=node
  ////////////console.log("linkedDataGraph update")
  ////////////////console.log("entra en linkedDataGraphBasic update")
  ////////////////console.log(option)
  ////////////////console.log(node)
  //console.log(configRow)
  if(configRow){
    //////////////console.log("entra por if")
    await configRow.fromOptionToConfigRow(option)
  } 
  else{
    ////////////////console.log(node)
    //////////////console.log("entra por else")
    configRow=new ConfigRow(option,node)
    ////////////////console.log("despues de crear configrow")
    ldg.settingsFromOption(option)
    ////////////////console.log("despues de settingsFromOption")

  }
  ////////////console.log(configRow)
  //ldg.settings["query"]=configRow.query
  //configRow["endpoint_url"]=configRow.endpoint_url
  await ldg.init()
}

LinkedDataGraphBasic.prototype.buildTreeData = function () {
  var ldg=this;
  var procNode=[],indexParent,tmpNode,child,classFreeNode,indexNode;
  var treeResults;
  var properties=configRow.properties
  var treeData=[]
  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }

  for (let j = 0; j < configRow.results.length; ++j) {
      treeResults=get_hierarchy_from_keys(Object.keys(configRow.results[j]))
      //////console.log(configRow.results[j])
      //////console.log(treeResults)
      for (let i = 0; i < treeResults.length; ++i) {
          if(configRow.results[j][treeResults[i]]){
              if(i>0){
                indexParent=checkNodeInTreeData()
                if(treeData[indexParent]["children"].filter(d=>d.value==configRow.results[j][treeResults[i]]["value"]).length==0){
                    child=nodeValues(configRow.results[j],i)
                    
                    child["configRowNumber"]=configRow["rowNumber"]
                    treeData[indexParent]["children"].push(child)
                    if(i<(treeResults.length-1)){
                        child["children"]=[]
                        treeData.push(child)
                    }
                }
              }else{
                if(treeData.length==0) createMenuOptionNodes(j)
              } 
          } 
          procNode[i]=configRow.results[j][treeResults[i]]["value"]
      }
      procNode=[]
  }

  if(configRow.node){
    indexNode=ldg.treeData.findIndex(d=>d.id==configRow.node.id)
    if(indexNode!=-1){
      ldg.treeData.splice(indexNode, 1);
    }
  }
  ldg.treeData=ldg.treeData.concat(treeData)
  configRow.treeData=treeData

  function checkNodeInTreeData(){
    var pathSearch=JSON.parse(JSON.stringify(procNode));
    var prevNodeIndex=-1,prevNodeId;
    while(pathSearch.length>0){
      if(prevNodeIndex!=-1){
          prevNodeId=treeData[prevNodeIndex]["children"].filter(d=>d.value==pathSearch[0])[0]["id"]
          prevNodeIndex=treeData.findIndex(d=>d.id==prevNodeId)
      }else{
          prevNodeIndex=treeData.findIndex(d=>d.value==pathSearch[0])
          if(treeData.filter((element) => element.children.some((subElement) => subElement.class === "menuOption")).length>0){
            prevNodeId=treeData[prevNodeIndex]["children"].filter(d=>d.value==configRow.option)[0]["id"]
            prevNodeIndex=treeData.findIndex(d=>d.id==prevNodeId)
          }
      }
      pathSearch.shift()
    }
    return prevNodeIndex
  }

  function get_hierarchy_from_keys(keys){
      var keysH=[],result,index_;
      keys.forEach(function(k){
      index_=k.indexOf("_")
      if(index_!=-1){
          result = k.substring(0,index_);
          if(!keysH.includes(result)){
          keysH.push(result)
          }
      }else{
          if(!keysH.includes(k)){
          keysH.push(k)
          }
      }
      })
      return keysH
  }
  
  
  function nodeValues(r,index,id){
      var node,className,prop;
      if(id==undefined){
        id=genRandomString()
      }
      //////console.log(configRow["classes_text"])
      //////console.log(treeResults)
      //////console.log(index)
      className=configRow["classes_text"].filter(d=>d.class==treeResults[index])[0]["text"]
      node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index],"className":className}

      if(configRow.tooltip){
        node["tooltip"]=getTooltipNode(configRow.tooltip,node["class"])
      }
      if((configRow.detail!="")&&(configRow.details!=undefined)){
      node["detail"]=getDetail(configRow.details,node["class"])
      }
      prop=properties.filter(d=>d.class==treeResults[index])
      if(prop.length>0){
      prop.forEach(function(k){
        if(r[k["property"]]!=undefined){
        node[k["property"]]=r[k["property"]].value
        }
      })
      }
      return node
  }
  function createMenuOptionNodes(j){
    var node,nodeOption1,nodeOption2;

    if(configRow.node){
/*       let menuOptions=configRow.node.menuOption.split(";")
      if(menuOptions.length==2){
        let children=ldg.treeData.filter(n=>n.id==configRow.node.id)[0]["children"]
        nodeOption1={"id":genRandomString(),"value":menuOptions[0],"shape":1,"class":"menuOption","className":"Menu Option","children":children}
        treeData.push(nodeOption1)
        nodeOption2={"id":genRandomString(),"value":menuOptions[1],"shape":1,"class":"menuOption","className":"Menu Option","children":[]}
        treeData.push(nodeOption2)
        
        node=nodeValues(configRow.results[j],0,configRow.node.id)
        node["children"]=[nodeOption1,nodeOption2]
      }else{
        node=nodeValues(configRow.results[j],0,configRow.node.id)
        node["children"]=[]
      } */
      if(!configRow.node.menuOption){
        node=nodeValues(configRow.results[j],0,configRow.node.id)
        node["children"]=[]
      }else{
        let menuOptions=configRow.node.menuOption.split(";")
        if(menuOptions.length==2){
           let children=ldg.treeData.filter(n=>n.id==configRow.node.id)[0]["children"]
           nodeOption1={"id":genRandomString(),"value":menuOptions[0],"shape":1,"class":"menuOption","className":"Menu Option","children":children}
           treeData.push(nodeOption1)
           nodeOption2={"id":genRandomString(),"value":menuOptions[1],"shape":1,"class":"menuOption","className":"Menu Option","children":[]}
           treeData.push(nodeOption2)

           node=nodeValues(configRow.results[j],0,configRow.node.id)
           node["children"]=[nodeOption1,nodeOption2]
        }else{
           node=nodeValues(configRow.results[j],0,configRow.node.id)
          node["children"]=[]
        }
      }
      
    }else{
      node=nodeValues(configRow.results[j],0)
      node["children"]=[]
    }
    treeData.push(node)
  }
    
}

/* LinkedDataGraphBasic.prototype.buildTreeData = function () {
  var ldg=this;
  var procNode=[],indexParent,tmpNode,child,classFreeNode;
  var treeResults;
  ////////////////////console.log(configRow.properties)
  var properties=configRow.properties
  var treeData=[]
  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }

  //////////////////////////console.log(configRow.results)
  //////////////console.log(configRow.option)
  for (let j = 0; j < configRow.results.length; ++j) {
      //////////////////////////console.log(configRow.results[j])
      //////////////console.log(configRow.results)
      treeResults=get_hierarchy_from_keys(Object.keys(configRow.results[j]))
      //////////////console.log(treeResults)
      for (let i = 0; i < treeResults.length; ++i) {
          if(configRow.results[j][treeResults[i]]){
              if(i>0){
              indexParent=checkNodeInTreeData()
              //////////////////////////console.log(indexParent)
              if(treeData[indexParent]["children"].filter(d=>d.value==configRow.results[j][treeResults[i]]["value"]).length==0){
                  child=nodeValues(configRow.results[j],i)
                  
                  child["configRowNumber"]=configRow["rowNumber"]
                  treeData[indexParent]["children"].push(child)
                  if(i<(treeResults.length-1)){
                      child["children"]=[]
                      treeData.push(child)
                  }
              }
              }else{
              if(treeData.length==0){
                  if(configRow.node){
                  tmpNode=nodeValues(configRow.results[j],0,configRow.node.id)
                  }else{
                  tmpNode=nodeValues(configRow.results[j],0)
                  }
                  tmpNode["children"]=[]
                  treeData.push(tmpNode)
              }
              } 
              } 
          procNode[i]=configRow.results[j][treeResults[i]]["value"]
      }
      procNode=[]
  }

  ldg.treeData=ldg.treeData.concat(treeData)
  ////////////console.log(treeData)
  configRow.treeData=treeData
  ////////////console.log(ldg.treeData)

  ////////////////////console.log(ldg.treeData)
  function checkNodeInTreeData(){
      var pathSearch=JSON.parse(JSON.stringify(procNode));
      var prevNodeIndex=-1,prevNodeId;
      //////////////////////////console.log(treeData)
      while(pathSearch.length>0){
      if(prevNodeIndex!=-1){
          prevNodeId=treeData[prevNodeIndex]["children"].filter(d=>d.value==pathSearch[0])[0]["id"]
          prevNodeIndex=treeData.findIndex(d=>d.id==prevNodeId)
      }else{
          prevNodeIndex=treeData.findIndex(d=>d.value==pathSearch[0])
      }
      pathSearch.shift()
      }
      return prevNodeIndex
  }

  function get_hierarchy_from_keys(keys){
      var keysH=[],result,index_;
      keys.forEach(function(k){
      index_=k.indexOf("_")
      if(index_!=-1){
          result = k.substring(0,index_);
          if(!keysH.includes(result)){
          keysH.push(result)
          }
      }else{
          if(!keysH.includes(k)){
          keysH.push(k)
          }
      }
      })
      return keysH
  }
  
  
  function nodeValues(r,index,id){
      var node,className,prop;
      if(id==undefined){
        id=genRandomString()
      }
      //////////////console.log(configRow["classes_text"])
      //////////////console.log(treeResults)
      //////////////console.log(treeResults[index])
      className=configRow["classes_text"].filter(d=>d.class==treeResults[index])[0]["text"]
      node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index],"className":className}
      //node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index],"className":className,"menuOption":r[treeResults[index]].menuOption}
      //if((index==0)||((treeResults.length>2)&&(index<(treeResults.length-1)))){
      //  node["menuOption"]=configRow.options
      //}

      if(configRow.tooltip){
        node["tooltip"]=getTooltipNode(configRow.tooltip,node["class"])
      }
      if((configRow.detail!="")&&(configRow.details!=undefined)){
      node["detail"]=getDetail(configRow.details,node["class"])
      }
      ////////////////////console.log(properties)
      prop=properties.filter(d=>d.class==treeResults[index])
      ////////////////////console.log(prop)
      if(prop.length>0){
      prop.forEach(function(k){
        ////////////////////console.log(r)
        if(r[k["property"]]!=undefined){
        node[k["property"]]=r[k["property"]].value
        }
      })
      }
      ////////////////////console.log(node)
      return node
  }
    
} */

LinkedDataGraphBasic.prototype.addLink = function (node,c,links) {
  links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
}

function LinkedDataGraphExpert(...args){
  LinkedDataGraph.apply(this, args);
}

LinkedDataGraphExpert.prototype = Object.create(LinkedDataGraph.prototype);

LinkedDataGraphExpert.prototype.buildTreeData = function () {
  var ldg=this, configRowResults;

  var children = [], treeData = []
  //, more_results, menuOption, menuOptionNodes = [];

  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }
  //////////////////////////////console.log(configRow.option.position)
  ////////////console.log(configRow)

  configRow.results.forEach(r => {
    if (configRow.position == "s") {
      if (r["o"]["more_results"]) {
        more_results = r["o"]["more_results"]
      } else {
        more_results = ""
      }
      if (r["o"]["configRow"]) {
        configRowResults = r["o"]["configRow"]
      } else {
        configRowResults = ""
      }
      children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": r["o"]["value"], "url": configRow["endpoint_url"], "position": configRow.position, "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRowResults, "class": "free" })
    } else if (configRow.position == "o") {
      if (r["s"]["more_results"]) {
        more_results = r["s"]["more_results"]
      } else {
        more_results = ""
      }
      if (r["s"]["configRow"]) {
        configRowResults = r["s"]["configRow"]
      } else {
        configRowResults = ""
      }
      children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": r["o"]["value"], "url": configRow["endpoint_url"], "position": configRow.position, "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRowResults, "class": "free" })
    }


  })
  if (ldg.node != undefined) {
    if (configRow.node.menuOption) {
      menuOption = configRow.node.menuOption + ";" + configRow["endpoint_url"] + "," + configRow.position
      networkGraph.treeData.filter(d => d.id == ldg.node["id"])
      let obj = networkGraph.treeData.find(n => n.id == ldg.node["id"]);
      if (obj["children"])
        if (obj.children[0].type != "menuOption") {
          menuOptionNodes.push({ "id": genRandomString(), "value": configRow.node.menuOption, "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          menuOptionNodes.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          obj.children = menuOptionNodes;
        } else {
          obj.children.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
        }

      obj["menuOption"] = menuOption
    } else {
      treeData = [{ "id": ldg.node["id"], "value": ldg.node["value"], "type": ldg.node["type"], "children": children, "hidden": false, "more_results": more_results, "configRow": configRowResults, "class": "free" }]
      //menuOption = ldg.node["url"] + "," + ldg.node["subject-object"]
      //treeData = [{ "id": ldg.node["id"], "value": ldg.node["value"], "type": ldg.node["type"], "children": children, "hidden": false, "more_results": more_results, "menuOption": menuOption, "configRow": configRowResults, "class": "free" }]
    }

  } else {
    menuOption = configRow["endpoint_url"] + "," + configRow.position
    treeData = [{ "id": genRandomString(), "value": configRow.results[0][configRow.position]["value"], "type": configRow.results[0][configRow.position]["type"], "children": children, "hidden": false, "more_results": "", "menuOption": menuOption, "configRow": configRowResults, "class": "free" }]
  }
  configRow.treeData=treeData
  ldg.treeData=ldg.treeData.concat(treeData)
};

LinkedDataGraphExpert.prototype.update = async function(option,node){
  var ldg=this;
  ldg.settings=option
  ldg.node=node
  //console.log("linkedDataExpert update")
  await ldg.init()
}

LinkedDataGraphExpert.prototype.addLink = function (node,c,links) {
  links.push({ "source": node.id, "target": c.id, "id": (node.id + "_" + c.id), "value": c.property })
}

LinkedDataGraphExpert.prototype.settingsFromOption = async function(){
  var ldg=this;
  //console.log("settings from option")
  if((!configRow)||(configRow instanceof ConfigRowBasic)){
    configRow = new ConfigRowExpert(ldg.option);
    await configRow.init()
  }else{
    await configRow.update(ldg.option,ldg.node)
  }
  ////////////console.log(configRow)
  ////////////console.log("antes de ldg init")
  await ldg.init()
};

LinkedDataGraphExpert.prototype.getFilters = function () {
  var ldg=this;
  //////////////////console.log(ldg)
}