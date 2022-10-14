LinkedDataGraph = function (_option,_settings,_node) {
    this.option=_option;
    this.settings=_settings
    this.node=_node;
  };

LinkedDataGraph.prototype.init = async function () {
    var ldg=this;
    //ldg.filterClassesObjects=[]
    await ldg.getResults()
    ldg.buildData()
    //ldg.getFilters()
    ////////////console.log(ldg.data.treeData)
  }

LinkedDataGraph.prototype.getResults = async function () {
    var ldg=this;
    ldg.results = await runSparlqQuery(ldg.settings.url,ldg.settings.query,"query");
    ////////////console.log(ldg.results)
  }

LinkedDataGraph.prototype.buildData = function () {
  var ldg=this;
  ldg.buildTreeData()
  ldg.flatten()
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
    }else{
      delete node.hidden
    }
    hidden=false
  }
  function checkFilter(node){
    var hidden=false
    let filterClass=networkGraph.filterClassesObjects.filter(function(f){
      return f.name==node.class
    })
    if(filterClass.length>0){
      filterClass[0].filters.forEach(function (fi){
        ////console.log(fi.filterObject)
        if(fi.checkConditionNode(node)){
          ////console.log("true")
          hidden=true
        //}else{
          ////console.log("false")
        }
      })
    }
    console.log(hidden)
    return hidden
  }
}

function LinkedDataGraphBasic(...args){
  LinkedDataGraph.apply(this, args);
}

LinkedDataGraphBasic.prototype = Object.create(LinkedDataGraph.prototype);

LinkedDataGraphBasic.prototype.settingsFromOption = async function(){
  var ldg=this;
  configRow = new ConfigRow(ldg.option);
  ldg.settings={}
  ldg.settings["query"]=configRow.rowFields.query
  ldg.settings["url"]=configRow.rowFields.endpoint_url
  await ldg.init()
};

LinkedDataGraphBasic.prototype.importGraph = async function(fileText){
  var ldg=this;

  console.log(fileText)

  ldg.treeData=fileText.treeData
  //ldg.classesCorrespondence=fileText.classesCorrespondence
  ldg.resultsData=fileText.treeData
  console.log(ldg)
  ldg.flatten()
}

LinkedDataGraphBasic.prototype.update = async function(option,node){
  var ldg=this;
  ldg.option=option
  ldg.node=node

  console.log(option)
  console.log(node)
  console.log(configRow)
  if(configRow) configRow.update(option,node)
  else{
    configRow=new ConfigRow(option,node)
    ldg.settingsFromOption(option)
  }
  console.log(configRow)
  ldg.settings["query"]=configRow.rowFields.query
  ldg.settings["url"]=configRow.rowFields.endpoint_url
  await ldg.init()
}

LinkedDataGraphBasic.prototype.buildTreeData = function () {
  var ldg=this;
  var procNode=[],indexParent,tmpNode,child,classFreeNode;
  var treeResults;
  //console.log(configRow.rowFields.properties)
  var properties=configRow.rowFields.properties
  var treeData=[]
  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }

  ////////console.log(ldg.results)
  for (let j = 0; j < ldg.results.length; ++j) {
      ////////console.log(ldg.results[j])
      treeResults=get_hierarchy_from_keys(Object.keys(ldg.results[j]))
      ////////console.log(treeResults)
      for (let i = 0; i < treeResults.length; ++i) {
          if(ldg.results[j][treeResults[i]]){
              if(i>0){
              indexParent=checkNodeInTreeData()
              ////////console.log(indexParent)
              if(treeData[indexParent]["children"].filter(d=>d.value==ldg.results[j][treeResults[i]]["value"]).length==0){
                  child=nodeValues(ldg.results[j],i)
                  
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
                  tmpNode=nodeValues(ldg.results[j],0,configRow.node.id)
                  }else{
                  tmpNode=nodeValues(ldg.results[j],0)
                  }
                  tmpNode["children"]=[]
                  treeData.push(tmpNode)
              }
              } 
              } 
          procNode[i]=ldg.results[j][treeResults[i]]["value"]
      }
      procNode=[]
  }

  ldg.treeData=ldg.treeData.concat(treeData)
  ldg.resultsData=treeData

  //console.log(ldg.treeData)
  function checkNodeInTreeData(){
      var pathSearch=JSON.parse(JSON.stringify(procNode));
      var prevNodeIndex=-1,prevNodeId;
      ////////console.log(treeData)
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

      className=configRow.rowFields["classes_text"].filter(d=>d.class==treeResults[index])[0]["text"]
      node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index],"className":className}
      if((index==0)||((treeResults.length>2)&&(index<(treeResults.length-1)))){
        node["menuOption"]=configRow.rowFields.options
      }

      if(configRow.rowFields.tooltip){
        node["tooltip"]=getTooltipNode(configRow.rowFields.tooltip,node["class"])
      }
      if((configRow.rowFields.detail!="")&&(configRow.rowFields.details!=undefined)){
      node["detail"]=getDetail(configRow.rowFields.details,node["class"])
      }
      //console.log(properties)
      prop=properties.filter(d=>d.class==treeResults[index])
      //console.log(prop)
      if(prop.length>0){
      prop.forEach(function(k){
        //console.log(r)
        if(r[k["property"]]!=undefined){
        node[k["property"]]=r[k["property"]].value
        }
      })
      }
      //console.log(node)
      return node
  }
    
}

LinkedDataGraphBasic.prototype.addLink = function (node,c,links) {
  links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
}

function LinkedDataGraphExpert(...args){
  LinkedDataGraph.apply(this, args);
}

LinkedDataGraphExpert.prototype = Object.create(LinkedDataGraph.prototype);

LinkedDataGraphExpert.prototype.buildTreeData = function () {
  var ldg=this;

  var children = [], treeData = [], more_results, menuOption, menuOptionNodes = [], configRow;

  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }
  ////////////console.log(ldg.settings["subject-object"])
  ldg.results.forEach(r => {
    if (ldg.settings["subject-object"] == "s") {
      if (r["o"]["more_results"]) {
        more_results = r["o"]["more_results"]
      } else {
        more_results = ""
      }
      if (r["o"]["configRow"]) {
        configRow = r["o"]["configRow"]
      } else {
        configRow = ""
      }
      children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": r["o"]["value"], "url": ldg.settings["url"], "subject-object": ldg.settings["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
    } else if (ldg.settings["subject-object"] == "o") {
      if (r["s"]["more_results"]) {
        more_results = r["s"]["more_results"]
      } else {
        more_results = ""
      }
      if (r["s"]["configRow"]) {
        configRow = r["s"]["configRow"]
      } else {
        configRow = ""
      }
      children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": r["o"]["value"], "url": ldg.settings["url"], "subject-object": ldg.settings["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
    }


  })
  if (ldg.node != undefined) {
    if (ldg.node["menuOption"]) {
      menuOption = ldg.node["menuOption"] + ";" + ldg.settings["url"] + "," + ldg.settings["subject-object"]
      networkGraph.treeData.filter(d => d.id == ldg.node["id"])
      let obj = networkGraph.treeData.find(n => n.id == ldg.node["id"]);
      if (obj["children"])
        if (obj.children[0].type != "menuOption") {
          menuOptionNodes.push({ "id": genRandomString(), "value": ldg.node["menuOption"], "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          menuOptionNodes.push({ "id": genRandomString(), "value": ldg.settings["url"] + "," + ldg.settings["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          obj.children = menuOptionNodes;
        } else {
          obj.children.push({ "id": genRandomString(), "value": ldg.settings["url"] + "," + ldg.settings["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
        }

      obj["menuOption"] = menuOption
    } else {
      menuOption = ldg.node["url"] + "," + ldg.node["subject-object"]
      treeData = [{ "id": ldg.node["id"], "value": ldg.node["value"], "type": ldg.node["type"], "children": children, "hidden": false, "more_results": more_results, "menuOption": menuOption, "configRow": configRow, "class": "free" }]
    }

  } else {
    menuOption = ldg.settings["url"] + "," + ldg.settings["subject-object"]
    treeData = [{ "id": genRandomString(), "value": ldg.results[0][ldg.settings["subject-object"]]["value"], "type": ldg.results[0][ldg.settings["subject-object"]]["type"], "children": children, "hidden": false, "more_results": "", "menuOption": menuOption, "configRow": configRow, "class": "free" }]
  }
  ldg.resultsData=treeData
  ldg.treeData=ldg.treeData.concat(treeData)
};

LinkedDataGraphExpert.prototype.update = async function(option,node){
  var ldg=this;
  ldg.settings=option
  ldg.node=node

  await ldg.init()
}

LinkedDataGraphExpert.prototype.addLink = function (node,c,links) {
  links.push({ "source": node.id, "target": c.id, "id": (node.id + "_" + c.id), "value": c.property })
}

LinkedDataGraphExpert.prototype.settingsFromOption = async function(){
  var ldg=this;
  await ldg.init()
};

LinkedDataGraphExpert.prototype.getFilters = function () {
  var ldg=this;
  console.log(ldg)
}