LinkedDataGraph = function (_option) {
    this.option=_option;
  };

LinkedDataGraph.prototype.init = function () {
    var ldg=this;
    //////////////////console.log(configRow)
    ldg.buildData()
  }

LinkedDataGraph.prototype.buildData = function () {
  var ldg=this;
  ldg.buildTreeData()
  //console.log(ldg.treeData)
  if(getShowDuplicates()){
    ldg.showNoDuplicatesGraph()
  }
  ldg.flatten()
  checkTestLdg()
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
    //console.log("------------------flatten------------------")
    function recurse(node) {
      ////////console.log(node)
      if(!node["hidden"]){
        position=nodes.indexOf(nodes.filter(function(item) {
          return item.id == node.id
        })[0])
        if(position==-1){
          //console.log("---------node------------")
          //console.log("node value: "+node.value)
          //console.log("node x: "+node.x)
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
      //////////console.log(r.value)
      recurse(r);
    })
    ////////////////////////console.log(ldg.treeData)
    ////////////////////console.log(nodes)
    ldg.data={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.treeData};
    //////////console.log(ldg.data.flatData.links)
    //////////console.log(ldg.treeData)
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
      ////////////////////////////console.log(i)
      ////////////////////////////console.log(i[i["class"]+"_uri"])
      ////////////////////////////console.log(uri)
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

  function recurse(node) {
    ////console.log(node.value)
    ////console.log(node.hidden)
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
          ////////////////////////console.log(c)
          if(!c["hidden"]){
            //////////console.log(links)
            ////////console.log(node.id)
            ////////console.log(c.id)
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

  ldg.treeDataFiltered.forEach(function(r){
    recurse(r);
  })
  ////console.log(nodes)
  ldg.dataFiltered={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.treeDataFiltered};
}

LinkedDataGraph.prototype.add = function(){
  var ldg=this;
  ldg.data.treeData=ldg.treeData
  ldg.flatten()
}

LinkedDataGraph.prototype.filter = function(filterId){
  var ldg=this;
  ////////////////////////////console.log("filter")
  function recurse(node) {
    var hidden=false,nodesIds=[],index;
    //index=ldg.treeDataFiltered.findIndex((element) => element.children.some((subElement) => subElement.id === node.id))
    
    index=ldg.treeDataFiltered.findIndex(function(element){
      if(element.children){
        return (element.children.some((subElement) => subElement.id === node.id))
      }
    })
    //////////////////////////console.log(index)
    //////////////////////////console.log(ldg.treeDataFiltered[index])
    //////////////////////////console.log(node.id)
    if((index!=-1)&&(ldg.treeDataFiltered[index].hidden)){
      node.hidden=true;
      node.filter=true;
    }else{
      checkHidden(node)
    }

    if(!node.hidden){
      if (node.children){
        node.children.forEach(function(c){
          recurse(c)
        })
      }
    }
  }

  ldg.treeDataFiltered=JSON.parse(JSON.stringify(ldg.treeData));
  ldg.treeDataFiltered.forEach(function(r){
    recurse(r);
  })


  //////console.log(ldg.treeDataFiltered)

  //////console.log(ldg.treeDataFiltered)
  function checkHidden(node){
    var check;
    if(node.class!="free"){
      check=checkFilter(node)
    }else{
      check=checkFilterExpert(node,filterId)
    }
    //////console.log(node.value)
    //////console.log(check)
    if(check){
      node.hidden=true
      node.filter=true
    }else{
      delete node.hidden
      delete node.filter
    }
    //////////////////////////////console.log(node)
  }

  function checkFilter(node){
    var hidden=false;
    let filterClass=networkGraph.filterClassesObjects.filter(function(f){
      return f.name==node.class
    })
    //////////////////////console.log(filterClass)
    if(filterClass.length>0){
      hidden=filterClass[0].checkConditionNode(node,filterId)
    }
    //////////////////////console.log(node)
    //////////////////////console.log(hidden)
    return hidden
  }
  function checkFilterExpert(node,filterId){
    var hidden=false,classNameNode,filterClass;
    let index=networkGraph.treeData.findIndex((element) => element.children.some((subElement) => subElement.id == node.id))
    //////console.log(filterId)
    //id=getFilterClassExpertName(filterId)
    if(index!=-1){
      classNameNode=noPunctuationStr(networkGraph.treeData[index]["value"])
      //////console.log(classNameNode)
      //////console.log(getFilterClassExpertName(filterId))
      if(filterId){
        if(classNameNode==getFilterClassExpertName(filterId)){
          getHidden()
        }
      }else{
        getHidden()
      }
      
      return hidden
    }
    /* //////console.log(node)
    let index=networkGraph.treeData.findIndex((element) => element.children.some((subElement) => subElement.id == node.id))
    //if(networkGraph.filter((element) => element.children.some((subElement) => subElement.id === node.id)).length>0){
    ////////////////////////console.log(networkGraph.treeData)
    //////console.log(index)
    if(index!=-1){
      let className=noPunctuationStr(networkGraph.treeData[index]["value"])
      //////console.log(className)
      ////////////////////////console.log(networkGraph.data.links)
      ////////////////////////console.log(networkGraph.treeData[index])
      let filterClass=networkGraph.filterClassesObjects.filter(function(f){
        return f.internalName==className
      })
      //////console.log(filterClass)
      //////console.log(filterId)
      if(filterClass.length>0){
        hidden=filterClass[0].checkConditionNode(node,filterId)
        //////////////////////console.log(node.value)
        //////////////////////console.log(hidden)
      }
    } */
/*     //////console.log(filterClass)
    //////console.log(node)
    if(filterClass[0]["name"]==node.value){
      hidden=false
    } */
    ////////////////////////////console.log(hidden)
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

LinkedDataGraph.prototype.clusterData = function (treeData) {
  var ldg=this;
  var maxNumber=parseInt($("#cluster-number").val())

  //////////console.log(treeData)
  //////////console.log(maxNumber)
  treeData.forEach(function(t){
    //////////console.log(t.children.length)
    //////////console.log(maxNumber)
    if(t.children.length>maxNumber){
      transformData(t)
    }
  })

  return treeData

  function transformData(branch){
    var node;
    ////////////////////////////console.log(branch)
    branch.cluster=true
    branch.more_results=branch.children
    //////////console.log(configRow)
    //let node={"id":genRandomString(),"value":branch.children.length + " results collpsed","shape":1,"class":"more_results","className":"Results collapsed"}
    if(configRow["endpoint_url"]){
      node={"id":genRandomString(),"value":branch.children.length + " results collpsed","shape":1,"class":"more_results","className":"Results collapsed","url":configRow.endpoint_url}
    }else{
      node={"id":genRandomString(),"value":branch.children.length + " results collpsed","shape":1,"class":"more_results","className":"Results collapsed"}
    }
    branch.children=[node]
  }
}

function LinkedDataGraphBasic(...args){
  LinkedDataGraph.apply(this, args);
}

LinkedDataGraphBasic.prototype = Object.create(LinkedDataGraph.prototype);

LinkedDataGraphBasic.prototype.settingsFromOption = async function(){
  var ldg=this;
  if((!configRow)||(configRow instanceof ConfigRowExpert)){
    configRow = new ConfigRowBasic(ldg.option);
    await configRow.init()
  }else{
    await configRow.update(ldg.option,ldg.node)
  }
  ////////////////////////console.log(configRow)
  await ldg.init()
};

LinkedDataGraphBasic.prototype.importGraph = function(fileText){
  var ldg=this;

  ldg.treeData=fileText.treeData
  if(!configRow){
    configRow = new ConfigRowBasic(fileText.configRow.option,fileText.configRow.node);
    //configRow=fileText.configRow
    configRow.import(fileText.configRow)
    //configRow.initImport()

  }
  ldg.treeData=fileText.treeData
  ldg.flatten()
}

LinkedDataGraphBasic.prototype.update = async function(option){
  var ldg=this;
  //////console.log(configRow)
  if(configRow){
    await configRow.fromOptionToConfigRow(option)
  } 
  else{
    configRow=new ConfigRowBasic(option,node)
    ldg.settingsFromOption(option)
  }
  await ldg.init()
}

/* LinkedDataGraphBasic.prototype.clusterData = function (treeData) {
  var ldg=this;
  var maxNumber=parseInt($("#cluster-number").val())

  treeData.forEach(function(t){
    if(t.children.length>maxNumber){
      transformData(t)
    }
  })

  return treeData

  function transformData(branch){
    ////////////////////////////console.log(branch)
    branch.cluster=true
    branch.more_results=branch.children
    let node={"id":genRandomString(),"value":branch.children.length + " results collpsed","shape":1,"class":"more_results","className":"Results collapsed"}
    branch.children=[node]
  }
} */

LinkedDataGraphBasic.prototype.buildTreeData = function () {
  var ldg=this;
  var procNode=[],indexParent,tmpNode,child,classFreeNode,indexNode;
  var treeResults;
  var properties=configRow.properties
  var treeData=[]
  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }
  //////////////////////console.log(configRow.node)
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

  ////////////console.log(treeData[0]["vx"])

  ldg.treeData=ldg.treeData.concat(treeData)
  //console.log(ldg.treeData)
  configRow.treeData=treeData
  ////////////////////////console.log(treeData)
  treeData=ldg.clusterData(treeData)
  if(treeData.length>1){
    ldg.collapseBranch(treeData[0])
    linkedDataGraph.showFirstLevelBranch(treeData[0])
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
  
  /* function getRelation(node){
    ////////////////////////console.log(node)
  } */
  
  function nodeValues(r,index,id){
      var node,className,prop,relation;
      if(id==undefined){
        id=genRandomString()
        className=configRow["classes_text"].filter(d=>d.class==treeResults[index])[0]["text"]
        relation=configRow["hierarchy"].filter(d=>d.child==treeResults[index])
        ////////////////////////console.log(configRow["hierarchy"])
        ////////////////////////console.log(treeResults[index])
        ////////////////////////console.log(configFile)
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
            //////////////////////////console.log(k)
            
            if(r[k["property"]]!=undefined){
              //checkPropertyInFilters(k) 
              node[k["property"]]=r[k["property"]].value
            }
          })
        }
      }else{
        ////////////////////////////console.log(ldg.treeData)
        //let index=ldg.treeData.findIndex((element) => element.children.some((subElement) => subElement.id === id))
        let index=ldg.treeData.findIndex(function(element){
          if(element.children){
            return (element.children.some((subElement) => subElement.id === id))
          }
        })
        node=ldg.treeData[index].children.filter(d=>d.id==id)[0]
      }
      return node
  }
/*   function checkPropertyInFilters(property){
    var filterProperty;
    ////////////////////////console.log(property)
    ////////////////////////console.log(configRow)
    if(configRow.filters.length>0){
      filterProperty=configRow.filter.filter(d=>d.property==property.property)
      if(filterProperty.length>0){
        if(filterProperty[0]["filter_type"]=="date"){

        }
      }
    }
  } */
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

LinkedDataGraphBasic.prototype.addLink = function (node,c,links) {
  ////////////////////////console.log(c)
  //console.log("source value: "+node.value)
  //console.log("source x: "+ node.x)
  //console.log("target value: "+c.value)
  //console.log("target x: "+c.x)
  //console.log(links)
  //console.log(node)
  let index=links.findIndex((element) => element.target.id === node.id)
  //let index=links.findIndex((element) => element.target.some((subElement) => subElement.id === node.id))

  if(index!=-1){
    //console.log(node.value)
    node=links[index]["target"]
  }
  links.push({"source": node, "target": c,"id":(node.id+"_"+c.id),"relation":c.relation})
}

function LinkedDataGraphExpert(...args){
  LinkedDataGraph.apply(this, args);
}

LinkedDataGraphExpert.prototype = Object.create(LinkedDataGraph.prototype);

LinkedDataGraphExpert.prototype.buildTreeData = function () {
  var ldg=this, configRowResults;

  var children = [], treeData = []

  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }
  ////////////////////console.log(configRow.node)
  configRow.results.forEach(r => {
    if (configRow.position == "s") {
/*       if (r["o"]["more_results"]) {
        more_results = r["o"]["more_results"]
      } else {
        more_results = ""
      } */
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
  ////////////console.log(configRow.node)
  if (configRow.node.id) {
    if (configRow.node.menuOption) {
      ////////////////////console.log(configRow.node)
      menuOption = configRow.node.menuOption + ";" + configRow["endpoint_url"] + "," + configRow.position
      networkGraph.treeData.filter(d => d.id == configRow.node["id"])
      let obj = networkGraph.treeData.find(n => n.id == configRow.node["id"]);
      if (obj["children"])
        if (obj.children[0].type != "menuOption") {
          menuOptionNodes.push({ "id": genRandomString(), "value": configRow.node.menuOption, "type": "menuOption", "children": obj.children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
          menuOptionNodes.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
          obj.children = menuOptionNodes;
        } else {
          obj.children.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
        }
      obj["menuOption"] = menuOption
    } else {
      ////////////////////console.log(configRow.node)
      let index=ldg.treeData.findIndex((element) => element.children.some((subElement) => subElement.id === configRow.node.id))
      if(index!=-1){
        treeData=ldg.treeData[index]["children"].filter(d=>d.id==configRow.node.id)
        treeData[0]["children"]=children
        ////////////console.log(treeData[0])
      }else{
        treeData = [{ "id": configRow.node.id, "value": configRow.node["value"], "type": configRow.node["type"], "children": children, "hidden": false, "configRow": configRowResults, "class": "free" }]
      }
    }

  } else {
    menuOption = configRow["endpoint_url"] + "," + configRow.position
    ////////////console.log(ldg.treeData[0])
    ////////////////console.log(configRow)
    //treeData = [{ "id": genRandomString(), "value": configRow.results[0][configRow.position]["value"], "type": configRow.results[0][configRow.position]["type"], "children": children, "hidden": false, "more_results": "", "menuOption": menuOption, "configRow": configRowResults, "class": "free" }]
    treeData = [{ "id": genRandomString(), "value": configRow.results[0][configRow.position]["value"], "type": configRow.results[0][configRow.position]["type"], "children": children, "hidden": false, "menuOption": menuOption, "configRow": configRowResults, "class": "free" }]

  }
/*   if(configRow.node){
    let index=ldg.treeData.findIndex((element) => element.children.some((subElement) => subElement.id === configRow.node.id))
    //indexNode=ldg.treeData.findIndex(d=>d.id==configRow.node.id)
    ldg.treeData[index]["children"]
    if(indexNode!=-1){
      ldg.treeData.splice(indexNode, 1);
    }
  } */

  ////////////console.log(treeData[0]["vx"])
  //////////console.log("llama a clusterData")
  treeData=ldg.clusterData(treeData)
  configRow.treeData=treeData
  ldg.treeData=ldg.treeData.concat(treeData)
  //////////////console.log(treeData)
  //////////////////console.log(ldg.treeData)
};

LinkedDataGraphExpert.prototype.update = async function(option,node){
  var ldg=this;
/*   ldg.settings=option
  ldg.node=node
  await ldg.init()
  var ldg=this; */
  ////////////////console.log(node)
  //////////////console.log(option)
  //////////////console.log(node)
  //////////////console.log(configRow)
  if(configRow){
    await configRow.fromOptionToConfigRow(option,node)
  } 
  else{
    configRow=new ConfigRowExpert(option,node)
    ldg.settingsFromOption(option)
  }
  ////////////////console.log(configRow)
  //////////////////console.log(ldg.data.flatData.nodes)
  //////////////////console.log(networkGraph.data.nodes)
  await ldg.init()
  //////////////////console.log(ldg.data.flatData.nodes)
}

LinkedDataGraphExpert.prototype.addLink = function (node,c,links) {
  //if(links.findIndex(node))
  links.push({ "source": node, "target": c, "id": (node.id + "_" + c.id), "value": c.property })
}

LinkedDataGraphExpert.prototype.settingsFromOption = async function(){
  var ldg=this;
  //////////////////////console.log(ldg.option)
  if((!configRow)||(configRow instanceof ConfigRowBasic)){
    configRow = new ConfigRowExpert(ldg.option);
    await configRow.init()
  }else{
    await configRow.update(ldg.option,ldg.node)
  }
  ////////////////////console.log(configRow)
  await ldg.init()
};

LinkedDataGraphExpert.prototype.getFilters = function () {
  var ldg=this;
}