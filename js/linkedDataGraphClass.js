LinkedDataGraph = function (_option) {
    this.option=_option;
  };

LinkedDataGraph.prototype.init = function () {
    let ldg=this;
    
    ldg.buildData()
  }

LinkedDataGraph.prototype.buildData = function () {
  let ldg=this;    

  ldg.buildTreeData()

  if(getShowDuplicates()){
    ldg.showNoDuplicatesGraph()
  }
  ldg.flatten()
}

LinkedDataGraph.prototype.collapseAll= function (){
  let ldg=this;
  ldg.treeData.slice(1, ldg.treeData.length).forEach(function(n){
    ldg.collapseBranch(n)
  })
}

LinkedDataGraph.prototype.collapseBranch = function (node){
  let ldg=this;
  let index=ldg.treeData.findIndex(d=>d.id==node.id)
  if(index!=-1){
    ldg.treeData[index]._children = ldg.treeData[index].children;
    delete ldg.treeData[index].children;
    ldg.treeData[index]["hidden"]=true
    ldg.treeData[index]["collapsed"]=true
  }
}

LinkedDataGraph.prototype.expandAll= function (){
  let ldg=this;

  ldg.treeData.slice(1, ldg.treeData.length).forEach(function(n){
    ldg.expandBranch(n)
  })
}

LinkedDataGraph.prototype.expandBranch = function (node){
  let ldg=this;

  let index=ldg.treeData.findIndex(d=>d.id==node.id)
  if(index!=-1){
    ldg.treeData[index].children = ldg.treeData[index]._children;
    delete ldg.treeData[index]._children;
    if(!ldg.treeData[index].filtered){
      delete ldg.treeData[index].hidden
    }
    delete ldg.treeData[index].collapsed
    ldg.treeData[index].children.forEach(function(c){
      if(!c.filtered){
        delete c.hidden
      }
      delete c.collapsed
    })
  }
}

LinkedDataGraph.prototype.flatten = function(){
    var nodes = [], links=[];
    let ldg=this;
    
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

LinkedDataGraph.prototype.flattenAllData = function(){
  var nodes = [], links=[];
  let ldg=this;
  
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
  ldg.allTreeData.forEach(function(r){
    
    recurse(r);
  })
  
  
  ldg.allData={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.allTreeData};
}

LinkedDataGraph.prototype.showNoDuplicatesGraph = function(){
  var processedNodes = [];
  let ldg=this;

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
  let ldg=this;

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

LinkedDataGraph.prototype.add = function(){
  let ldg=this;
  ldg.data.treeData=ldg.treeData
  ldg.flatten()
}

LinkedDataGraph.prototype.filter = function(filterId){
  let ldg=this;

  networkGraph.filtered=true


  if(networkGraph.filterClassesObjects){
    networkGraph.filterClassesObjects.forEach(function (cf){
      cf.filters.forEach(function(f){
        f.valuesFiltered()
        if(f.valuesChanged){
          if(f.checkValuesChangedIn()){
            checkNodesForFilter(f);
          }else{
            f.emptyValuesChanged()
          }
        }
      })
    })
  }

  function recurse(node,filter) {
    let index;

    index=ldg.allTreeData.findIndex(function(element){
      if(element.children){
        return (element.children.some((subElement) => subElement.id === node.id))
      }
    })

    if((index!=-1)&&(ldg.allTreeData[index].hidden)&&(ldg.allTreeData[index].filtered)){
      node.hidden=true;
      node.filtered=true;
    }else if(!((node.hidden)&&(node.filtered))){
      checkHidden(node,filter)
    }


    if (node.children){
      node.children.forEach(function(c){
        recurse(c,filter)
      })
    }
    
  }

  function checkNodesForFilter(filter){
    ldg.allTreeData.forEach(function(r){
      recurse(r,filter);
    })
  }


  function checkHidden(node,filter){
    var check;
    
    if((node.class!="free")&&(node.class!="more_results")){
      check=checkFilter(node,filter)
    }else if((node.class=="free")&&(node.class!="more_results")){
      check=checkFilterExpert(node,filter)
    } 

    if(check){
      node.hidden=true
      node.filtered=true
    }else{
      if(node.collapsed){
        delete node.filtered
      }else{
        delete node.hidden
        delete node.filtered
      }
    }
  }

  function checkFilter(node,filter){
    let hidden=false;
    if(filter.details.class==node.class){
      hidden=filter.checkConditionNode(node)
    }
    return hidden
  }

  function checkFilterExpert(node,filter){
    var hidden=false;
    let index=ldg.allTreeData.findIndex((element) => element.children.some((subElement) => subElement.id == node.id))
    if(index!=-1){
      if(filter.idNode==ldg.allTreeData[index]["id"]){
        hidden=filter.checkConditionNode(node)
      }
    }
    return hidden
  }
}

LinkedDataGraph.prototype.clearFilter = function(){
  let ldg=this;

  function recurse(node) {
    //////////////////////////////////console.log(node.filter)
    if(node.filter){
      delete node.hidden
      delete node.filtered
    }
    if (node.children){
      node.children.forEach(function(c){
        recurse(c)
      })
    }
  }

  ldg.treeData.forEach(function(r){
    //////////////////////////////////console.log(r)
    recurse(r);
  })

  ldg.flatten()

}

LinkedDataGraph.prototype.clusterData = function (treeData,childrenLength) {
  let ldg=this;
  var maxNumber=parseInt($("#cluster-number").val())
  if((childrenLength)&&(childrenLength>maxNumber)){
    if(treeData.length>0){
      treeData.forEach(function(t){
        if(t.children){
          if(t.children.length>maxNumber){
            transformDataCluster(t)
          }
        }
      })
    }else{
      transformDataMenuOption()
    }
  }



  return treeData

  function transformDataCluster(branch){
    var node;

    if(configRow["endpoint_url"]){
      node={"id":genRandomString(),"value":branch.children.length + " results collapsed","shape":1,"class":"more_results","className":"Results collapsed","url":configRow.endpoint_url}
    }else{
      node={"id":genRandomString(),"value":branch.children.length + " results collapsed","shape":1,"class":"more_results","className":"Results collapsed"}
    }
    node.cluster=true
    node.more_results=branch.children
    branch.children=[node]
  }
  function transformDataMenuOption(){
    let menuOptions=configRow.node.menuOption.split(";"),more_results

    let branch=ldg.treeData.filter(d=>d.id==configRow.node.id)[0]

    let children=branch.children.filter(d=>d.value==menuOptions[menuOptions.length - 1])[0]["children"]

    if((branch.more_results)&&(Array.isArray(branch.more_results))){
      more_results=branch.more_results
      branch.more_results={}
      branch.more_results[menuOptions[0]]=more_results
      branch.more_results[menuOptions[1]]=children
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
    branch.children.filter(d=>d.value==menuOptions[menuOptions.length - 1])[0]["children"]=[node]
  }
}

async function settingsFromOption(type,option,node){
  if(type=="basic"){
    await settingsFromOpionBasic(option,node)
  }else{
    await settingsFromOpionExpert(option,node)
  }
  await linkedDataGraph.init()

  async function settingsFromOpionBasic(option,node){
    if((!configRow)||(configRow instanceof ConfigRowExpert)){
      configRow = new ConfigRowBasic(option,node);
      await configRow.init()
    }else{
      await configRow.update(option,node)
    }
  }
  async function settingsFromOpionExpert(option,node){
    if((!configRow)||(configRow instanceof ConfigRowBasic)){
      configRow = new ConfigRowExpert(option,node);
      await configRow.init()
    }else{
      await configRow.update(option,node)
    }
  }

};

LinkedDataGraph.prototype.importGraph = function(fileText){
  let ldg=this;

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
  let ldg=this;

  if(type=="basic"){
    await updateBasic()
  }else{
    await updateExpert()
  }

  await ldg.init()

  applyAllFilters()

  async function updateBasic(){
    if((configRow)&&(configRow instanceof ConfigRowBasic)){
      await configRow.fromOptionToConfigRow(option)
    }else{
      await settingsFromOption("basic",option,node)
    }
  }
  async function updateExpert(){
    if((configRow)&&(configRow instanceof ConfigRowExpert)){
      await configRow.fromOptionToConfigRow(option,node)
    } 
    else{
      await settingsFromOption("expert",option,node)
    }
  }
}

LinkedDataGraph.prototype.buildTreeData = function () {
  let ldg=this;
  let procNode=[],indexParent,child,indexNode,configRowResults,childrenLength;
  var treeResults;
  var properties=configRow.properties
  let treeData=[],children = []


  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }

  if(configRow.class){
    childrenLength=buildTreeDataBasic()
  }else{
    childrenLength=buildTreeDataExpert()
  }

  indexNode=ldg.treeData.findIndex(d=>d.id==configRow.node.id)
  if(indexNode!=-1){
    ldg.treeData.splice(indexNode, 1);
  }

  treeData=ldg.clusterData(treeData,childrenLength)

  configRow.treeData=treeData

  ldg.treeData=ldg.treeData.concat(treeData)

  //createMenuOptionNodes
  if(!ldg.allTreeData){
    ldg.allTreeData=JSON.parse(JSON.stringify(ldg.treeData))
  }
  getAllData()

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

    return(treeData[0]["children"].length)
  }


  function buildTreeDataExpert(){
    let menuOptionNodes=[],node1,node2;
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

    if (configRow.node.id) {
      if ((configRow.node.menuOption)&&(configRow.node.menuOption.includes(";"))){
        let obj = networkGraph.treeData.find(n => n.id == configRow.node["id"]);
        if (obj.children[0].type != "menuOption") {
          node1={ "id": genRandomString(), "value": configRow.node.menuOption.split(";")[0], "type": "menuOption", "children": obj.children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" }
          node2={ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" }
          menuOptionNodes.push(node1)
          menuOptionNodes.push(node2)
          obj.children = menuOptionNodes;
          treeData=[configRow.node]
          treeData.push(node1)
          treeData.push(node2)
        } else {
          node1={ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" }
          obj.children.push(node1)
          treeData=[configRow.node]
          treeData.push(node1)
        }
      } else {
        let index=ldg.treeData.findIndex((element) => element.children.some((subElement) => subElement.id === configRow.node.id))
        if(index!=-1){
          treeData=ldg.treeData[index]["children"].filter(d=>d.id==configRow.node.id)
          treeData[0]["children"]=children
        }else{
          configRow.node.children=children;
          treeData=[configRow.node]
        }
      }
    } else {
      menuOption = configRow["endpoint_url"] + "," + configRow.position
      treeData = [{ "id": genRandomString(), "value": configRow.results[0][configRow.position]["value"], "type": configRow.results[0][configRow.position]["type"], "children": children, "hidden": false, "menuOption": menuOption, "configRow": configRowResults, "class": "free" }]
  
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
        if (index!=-1){
          node=ldg.treeData[index].children.filter(d=>d.id==id)[0]
        }
      }
      return node
  }

  function createMenuOptionNodes(j){
    let node,nodeOption1,nodeOption2;
    if(configRow.node){
      if(!configRow.node.menuOption){
        node=nodeValues(configRow.results[j],0,configRow.node.id)
        if(!node["children"]){
          node["children"]=[]
        }
        //LO HE DEJADO AAQUÍ
/*         if(!node["children"]){
          node["children"]=[]
        } */
      }else{
        let menuOptions=configRow.node.menuOption.split(";")
        if(menuOptions.length==2){
           let children=ldg.treeData.filter(n=>n.id==configRow.node.id)[0]["children"]
           nodeOption1={"id":genRandomString(),"value":menuOptions[0],"shape":1,"class":"menuOption","className":"Menu Option","children":children}
           nodeOption2={"id":genRandomString(),"value":menuOptions[1],"shape":1,"class":"menuOption","className":"Menu Option","children":[]}

           node=nodeValues(configRow.results[j],0,configRow.node.id)
           node["children"]=[nodeOption1,nodeOption2]
           treeData.push(node)
           treeData.push(nodeOption1)
           treeData.push(nodeOption2)
        }else{
           node=nodeValues(configRow.results[j],0,configRow.node.id)
           node["children"]=[]
           treeData.push(node)
        }
      }
      
    }else{
      node=nodeValues(configRow.results[j],0)
      node["children"]=[]
      treeData.push(node)
    }
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