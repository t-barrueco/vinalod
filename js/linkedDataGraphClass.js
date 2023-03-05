LinkedDataGraph = function (_option) {
    this.option=_option;
  };

LinkedDataGraph.prototype.init = function () {
    var ldg=this;
    
    ldg.buildData()
  }

LinkedDataGraph.prototype.buildData = function () {
  var ldg=this;    
  if(networkGraph){
    //console.log(networkGraph.treeData)
  }
  ldg.buildTreeData()
  if(networkGraph){
    //console.log(networkGraph.treeData)
  }
  if(getShowDuplicates()){
    ldg.showNoDuplicatesGraph()
  }
  ldg.flatten()
}

LinkedDataGraph.prototype.collapseBranch = function (node){
  var ldg=this;
  
  function recurse(node) {
    let index=ldg.treeData.findIndex(d=>d.id==node.id)
    if(index!=-1){
      ldg.treeData[index]._children = ldg.treeData[index].children;
      delete ldg.treeData[index].children;
      ldg.treeData[index]["hidden"]=true
      if (ldg.treeData[index]._children){
        ldg.treeData[index]._children.forEach(function(c){
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
    let index=ldg.treeData.findIndex(d=>d.id==node.id)
    if(index!=-1){
      if(ldg.treeData[index]._children){
        ldg.treeData[index].children = ldg.treeData[index]._children;
        delete ldg.treeData[index]._children;
      } 
      if(ldg.treeData[index]["hidden"]) delete ldg.treeData[index]["hidden"]
      if (ldg.treeData[index].children){
        ldg.treeData[index].children.forEach(function(c){
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
}

LinkedDataGraph.prototype.expandFirstLevelBranch = function(node){
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
                return (item.source.id == node.id)&&(item.target.id == c.id)
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

LinkedDataGraph.prototype.showNoDuplicatesGraph = function(){
  var processedNodes = [];
  var ldg=this;

  function recurse(node) {
    let nodeUri=node[node["class"]+"_uri"]
    if(!processedNodes.includes(nodeUri)){
      replaceDuplicates(node.id,nodeUri)
      processedNodes.push(node[node["class"]+"_uri"])
    }

    if (node.children){
      node.children.forEach(function(c){
          recurse(c)
      });
    }
  }
  ldg.treeData.forEach(function(r){
    recurse(r);
  })
  function replaceDuplicates(id,uri){
    var indexChild;
    ldg.treeData.forEach(function(i){
      
      if(i[i["class"]+"_uri"]==uri){
        i["id"]=id
      }
      if(i.children){
        indexChild=i["children"].findIndex(d=>d[d["class"]+"_uri"]==uri)
        if(indexChild!=-1){
          i["children"][indexChild]["id"]=id
        }
      }
    })
  }
}

LinkedDataGraph.prototype.showDuplicatesGraph = function(){
  var ldg=this;

  function recurse(node) {
    node.id=genRandomString()
    if (node.children){
      node.children.forEach(function(c){
          recurse(c)
      });
    }
  }
  ldg.treeData.forEach(function(r){
    recurse(r);
  })
}

LinkedDataGraph.prototype.flattenFiltered = function(){
  var nodes = [], links=[];
  var ldg=this;
  //////console.log("flattenFiltered")

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
              return ((item.source.id == node.id)&&(item.target.id == c.id))
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

  ldg.treeDataFiltered.forEach(function(r){
    recurse(r);
  })

  ldg.dataFiltered={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.treeDataFiltered};
}

LinkedDataGraph.prototype.add = function(){
  var ldg=this;
  ldg.data.treeData=ldg.treeData
  ldg.flatten()
}

LinkedDataGraph.prototype.filter = function(filterId){
  var ldg=this;

  //networkGraph.filtered=true

  function recurse(node) {
    var hidden=false,nodesIds=[],index;
    //console.log(node.more_results)
    if(node.more_results){
      if(Array.isArray(node.more_results)){
        checkMoreResults(node)
      }
      
      //////console.log(node)
    }
    index=ldg.treeDataFiltered.findIndex(function(element){
      if(element.children){
        return (element.children.some((subElement) => subElement.id === node.id))
      }
    })
    if(ldg.treeDataFiltered[index]){
      
    }
    
    if((index!=-1)&&(ldg.treeDataFiltered[index].hidden)){
      node.hidden=true;
      node.filter=true;
    }else{
      checkHidden(node)
    }

      if (node.children){
        node.children.forEach(function(c){
          recurse(c)
        })
      }
    
  }

  ldg.treeDataFiltered=JSON.parse(JSON.stringify(ldg.treeData));
  ldg.treeDataFiltered.forEach(function(r){
    recurse(r);
  })

  ////console.log(ldg.treeDataFiltered)
  ////console.log(ldg.treeData)
  function checkMoreResults(node){
    var children=[];
    var maxNumber=$("#cluster-number").val()
    ////console.log(node.more_results)
    node.more_results.forEach(function(mr){
      checkHidden(mr)
      //////console.log(mr)
      if(!mr.hidden){
        children.push(mr)
      }
    })
    ////console.log(children)
    if(children.length<maxNumber){
      node.children=children
      //////console.log("refresh")
      //networkGraph.refresh()
    }
    ////console.log(node)
  }
  function checkHidden(node){
    var check;
    if(node.class!="free"){
      check=checkFilter(node)
    }else{
      check=checkFilterExpert(node,filterId)
    }

    if(check){
      node.hidden=true
      node.filter=true
    }else{
      delete node.hidden
      delete node.filter
    }
    
  }

  function checkFilter(node){
    var hidden=false;
    let filterClass=networkGraph.filterClassesObjects.filter(function(f){
      return f.name==node.class
    })
    
    if(filterClass.length>0){
      //////console.log(filterClass[0].checkConditionNode(node,filterId))
      hidden=filterClass[0].checkConditionNode(node,filterId)
      //////console.log(hidden)
    }
    
    return hidden
  }
  function checkFilterExpert(node,filterId){
    var hidden=false,classNameNode,filterClass;
    let index=networkGraph.treeData.findIndex((element) => element.children.some((subElement) => subElement.id == node.id))
    
    
    if(index!=-1){
      classNameNode=noPunctuationStr(networkGraph.treeData[index]["value"])
      
      
      if(filterId){
        if(classNameNode==getFilterClassExpertName(filterId)){
          getHidden()
        }
      }else{
        getHidden()
      }
      
      return hidden
    }

    return hidden
    function getHidden(){
      filterClass=networkGraph.filterClassesObjects.filter(function(f){
        return f.internalName==classNameNode
      })
      if(filterClass.length>0){
        hidden=filterClass[0].checkConditionNode(node)
      }
    }

  }
}


LinkedDataGraph.prototype.clearFilter = function(){
  var ldg=this;

  function recurse(node) {
    //////console.log(node.filter)
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
    //////console.log(r)
    recurse(r);
  })

  ldg.flatten()

}

LinkedDataGraph.prototype.clusterData = function (treeData,childrenLength) {
  var ldg=this;
  var maxNumber=parseInt($("#cluster-number").val())
  
  //console.log(treeData)
  //console.log(configRow.results)
  //console.log(configRow.node)
  if((childrenLength)&&(childrenLength>maxNumber)){
    if(treeData.length>0){
      treeData.forEach(function(t){
        //console.log(t)
        console.log(t.children.length)
        if(t.children.length>maxNumber){
        //if(t.children.length>maxNumber){
          transformData(t)
        }
      })
    }else{
      transformDataMenuOption()
    }
  }



  return treeData

  function transformData(branch){
    var node;
    
    branch.cluster=true
    branch.more_results=branch.children
    
    
    if(configRow["endpoint_url"]){
      node={"id":genRandomString(),"value":branch.children.length + " results collapsed","shape":1,"class":"more_results","className":"Results collapsed","url":configRow.endpoint_url}
    }else{
      node={"id":genRandomString(),"value":branch.children.length + " results collapsed","shape":1,"class":"more_results","className":"Results collapsed"}
    }
    branch.children=[node]
  }
  function transformDataMenuOption(){
    var menuOptions=configRow.node.menuOption.split(";"),more_results

    var branch=ldg.treeData.filter(d=>d.id==configRow.node.id)[0]

    let children=branch.children.filter(d=>d.value==menuOptions[menuOptions.length - 1])[0]["children"]

    //console.log(branch.more_results)

    if((branch.more_results)&&(Array.isArray(branch.more_results))){
      //menuOptions0=menuOptions[0]
      //menuOptions1=menuOptions[1]
      more_results=branch.more_results
      branch.more_results={}
      branch.more_results[menuOptions[0]]=more_results
      branch.more_results[menuOptions[1]]=children
      //branch.more_results={menuOptions[0]:branch.more_results,menuOptions1:children}
      //branch.more_results={menuOptions0:branch.more_results,menuOptions1:children}
    }else if(!branch.more_results){
      branch.more_results=children
    }else{
      branch.more_results[menuOptions[menuOptions.length - 1]]=children
    }

    if(configRow["endpoint_url"]){
      node={"id":genRandomString(),"value":children.length + " results collapsed","shape":1,"class":"more_results","className":"Results collapsed","url":configRow.endpoint_url}
    }else{
      node={"id":genRandomString(),"value":children.length + " results collapsed","shape":1,"class":"more_results","className":"Results collapsed"}
    }
    //console.log(branch.children)
    branch.children.filter(d=>d.value==menuOptions[menuOptions.length - 1])[0]["children"]=[node]
    //branch.children.push(node)
    //console.log(branch)
  }
}

async function settingsFromOption(type){

  if(type=="basic"){
    await settingsFromOpionBasic()
  }else{
    await settingsFromOpionExpert()
  }
  await linkedDataGraph.init()

  async function settingsFromOpionBasic(){
    if((!configRow)||(configRow instanceof ConfigRowExpert)){
      configRow = new ConfigRowBasic(linkedDataGraph.option);
      await configRow.init()
    }else{
      await configRow.update(linkedDataGraph.option,linkedDataGraph.node)
    }
  }
  async function settingsFromOpionExpert(){
    if((!configRow)||(configRow instanceof ConfigRowBasic)){
      configRow = new ConfigRowExpert(linkedDataGraph.option);
      await configRow.init()
    }else{
      await configRow.update(linkedDataGraph.option,linkedDataGraph.node)
    }
  }

};

LinkedDataGraph.prototype.importGraph = function(fileText){
  var ldg=this;

  ldg.treeData=fileText.treeData
  
  if(!configRow){
    if(fileText.configRow.class){
      configRow = new ConfigRowBasic(fileText.configRow.option,fileText.configRow.node);
    }else{
      configRow = new ConfigRowExpert(fileText.configRow.option,fileText.configRow.node);
    }

    
    configRow.import(fileText.configRow)
    
  }
  ldg.treeData=fileText.treeData
  ldg.flatten()
}

LinkedDataGraph.prototype.update = async function(option,node,type){
  var ldg=this;
  ////console.log(node.menuOption)

  if(type=="basic"){
    await updateBasic()
  }else{
    await updateExpert()
  }

  if(networkGraph){
    //console.log(networkGraph.treeData)
  }

  await ldg.init()

  if(networkGraph){
    //console.log(networkGraph.treeData)
  }
  applyAllFilters()

  async function updateBasic(){
    if(configRow){
      await configRow.fromOptionToConfigRow(option)
    } 
    else{
      configRow=new ConfigRowBasic(option,node)
      settingsFromOption("basic")
    }
  }
  async function updateExpert(){
    if(configRow){
      ////console.log("from option to config row")
      ////console.log(node.menuOption)
      await configRow.fromOptionToConfigRow(option,node)
    } 
    else{
      configRow=new ConfigRowExpert(option,node)
      settingsFromOption("expert")
    }
    ////console.log(configRow)
  }
}

LinkedDataGraph.prototype.buildTreeData = function () {
  var ldg=this;
  var procNode=[],indexParent,child,indexNode,configRowResults,childrenLength;
  var treeResults;
  var properties=configRow.properties
  var treeData=[],children = []
  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }

  if(configRow.class){
    buildTreeDataBasic()
  }else{
    childrenLength=buildTreeDataExpert()
  }

  ////console.log(configRow)
  if((configRow.hierarchy)&&(configRow.node)){
    indexNode=ldg.treeData.findIndex(d=>d.id==configRow.node.id)
    if(indexNode!=-1){
      ldg.treeData.splice(indexNode, 1);
    }
  }

  console.log(treeData)
  
  treeData=treeData.reverse()
  
  treeData=ldg.clusterData(treeData,childrenLength)

  configRow.treeData=treeData

  ldg.treeData=ldg.treeData.concat(treeData)
  //console.log("cluster data")
  console.log(ldg.treeData)
  //treeData=ldg.clusterData(treeData)
  
  if((treeData.length>1)&&(treeData[0].children[0].class!="menuOption")){
    ldg.collapseBranch(treeData[0])
    linkedDataGraph.showFirstLevelBranch(treeData[0])
  }

  function buildTreeDataBasic(){
    for (let j = 0; j < configRow.results.length; ++j) {
      treeResults=get_hierarchy_from_keys(Object.keys(configRow.results[j]))

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
                procNode[i]=configRow.results[j][treeResults[i]]["value"]
              }else{
                if(treeData.length==0) createMenuOptionNodes(j)
                
                if((configRow.node)&&(configRow.node.class=="free")){
                  procNode[i]=configRow.node.value
                }else{
                  procNode[i]=configRow.results[j][treeResults[i]]["value"]
                }
              } 
          }
          
          
          
      }
      procNode=[]
    }
  }

  function buildTreeDataExpert(){
    ////console.log(configRow.results)
    var menuOptionNodes=[]
    configRow.results.forEach(r => {
      if (configRow.position == "s") {
        if (r["o"]["configRow"]) {
          configRowResults = r["o"]["configRow"]
        } else {
          configRowResults = ""
        }
        children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": r["o"]["value"], "url": configRow["endpoint_url"], "hidden": false, "property": r["p"]["value"], "configRow": configRowResults, "class": "free" })
      } else if (configRow.position == "o") {
        if (r["s"]["configRow"]) {
          configRowResults = r["s"]["configRow"]
        } else {
          configRowResults = ""
        }
        children.push({ "id": genRandomString(), "value": r["s"]["value"], "type": r["s"]["type"], "uri": r["s"]["value"], "url": configRow["endpoint_url"], "hidden": false, "property": r["p"]["value"], "configRow": configRowResults, "class": "free" })
      }
  
  
    })
    //console.log(configRow.node.id)
    console.log(children)
    if (configRow.node.id) {
      ////console.log(configRow.node.menuOption)
      //console.log(configRow.node)
      if ((configRow.node.menuOption)&&(configRow.node.menuOption.includes(";"))){
        //console.log("entra en if")
        //menuOption = configRow.node.menuOption + ";" + configRow["endpoint_url"] + "," + configRow.position
        //////console.log(menuOption)
        console.log(configRow.node.menuOption)
        //networkGraph.treeData.filter(d => d.id == configRow.node["id"])
        //console.log(networkGraph.treeData)
        let obj = networkGraph.treeData.find(n => n.id == configRow.node["id"]);
        ////console.log(networkGraph.treeData)
        ////console.log(configRow.node["id"])
        if (obj["children"])
          if (obj.children[0].type != "menuOption") {
            menuOptionNodes.push({ "id": genRandomString(), "value": configRow.node.menuOption.split(";")[0], "type": "menuOption", "children": obj.children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
            menuOptionNodes.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
            obj.children = menuOptionNodes;
          } else {
            obj.children.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
          }
        //obj["menuOption"] = menuOption
      //}else if(configRow.node.menuOption){
      } else {
        //console.log("else")
        let index=ldg.treeData.findIndex((element) => element.children.some((subElement) => subElement.id === configRow.node.id))
        if(index!=-1){
          //console.log("index -1")
          treeData=ldg.treeData[index]["children"].filter(d=>d.id==configRow.node.id)
          treeData[0]["children"]=children
        }else{
          //console.log("else else")
          configRow.node.children=children;
          treeData=[configRow.node]
          //treeData = [{ "id": configRow.node.id, "value": configRow.node["value"], "type": configRow.node["type"], "children": children, "hidden": false, "configRow": configRowResults, "class": "free" }]
        }
      }
  
    } else {
      menuOption = configRow["endpoint_url"] + "," + configRow.position
      treeData = [{ "id": genRandomString(), "value": configRow.results[0][configRow.position]["value"], "type": configRow.results[0][configRow.position]["type"], "children": children, "hidden": false, "menuOption": menuOption, "configRow": configRowResults, "class": "free" }]
  
    }
    if(networkGraph){
      //console.log(networkGraph.treeData)
    }
    
  return children.length
  }
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
      var node,className,prop,relation;
      if(id==undefined){
        id=genRandomString()
        className=configRow["classes_text"].filter(d=>d.class==treeResults[index])[0]["text"]
        relation=configRow["hierarchy"].filter(d=>d.child==treeResults[index])
        
        
        
        if(relation.length>0){
          relation=configRow["hierarchy"].filter(d=>d.child==treeResults[index])[0]["relation"]
          node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index],"className":className,"relation":relation}
        }else{
          node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index],"className":className}
        }  
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
      }else{
        
        
        let index=ldg.treeData.findIndex(function(element){
          if(element.children){
            return (element.children.some((subElement) => subElement.id === id))
          }
        })
        node=ldg.treeData[index].children.filter(d=>d.id==id)[0]
      }
      return node
  }

  function createMenuOptionNodes(j){
    var node,nodeOption1,nodeOption2;

    if(configRow.node){
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

LinkedDataGraph.prototype.addLink = function (node,c,links) {

  if(configRow.class){
    let index=links.findIndex((element) => element.target.id === node.id)

    if(index!=-1){
      node=links[index]["target"]
    }
    links.push({"source": node, "target": c,"id":(node.id+"_"+c.id),"relation":c.relation})
  }else{
    links.push({ "source": node, "target": c, "id": (node.id + "_" + c.id), "value": c.property })
  }
}