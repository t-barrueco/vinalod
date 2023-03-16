LinkedDataGraph = function (_option) {
    this.option=_option;
  };

LinkedDataGraph.prototype.init = function () {
    var ldg=this;
    
    ldg.buildData()
  }

LinkedDataGraph.prototype.buildData = function () {
  var ldg=this;    

  ldg.buildTreeData()

  if(getShowDuplicates()){
    ldg.showNoDuplicatesGraph()
  }
  ldg.flatten()
}

LinkedDataGraph.prototype.collapseAll= function (){
  var ldg=this;
  ldg.treeData.slice(1, ldg.treeData.length).forEach(function(n){
    ldg.collapseBranch(n)
  })
}

LinkedDataGraph.prototype.collapseBranch = function (node){
  var ldg=this;
  let index=ldg.treeData.findIndex(d=>d.id==node.id)
  if(index!=-1){
    ldg.treeData[index]._children = ldg.treeData[index].children;
    delete ldg.treeData[index].children;
    ldg.treeData[index]["hidden"]=true
    ldg.treeData[index]["collapsed"]=true
  }
}

LinkedDataGraph.prototype.expandAll= function (){
  var ldg=this;

  ldg.treeData.slice(1, ldg.treeData.length).forEach(function(n){
    ldg.expandBranch(n)
  })
}

LinkedDataGraph.prototype.expandBranch = function (node){
  var ldg=this;

  ////////////console.log(JSON.parse(JSON.stringify(ldg.treeData[0])))

  let index=ldg.treeData.findIndex(d=>d.id==node.id)
  if(index!=-1){
    ldg.treeData[index].children = ldg.treeData[index]._children;
    delete ldg.treeData[index]._children;
    if(!ldg.treeData[index].filtered){
      delete ldg.treeData[index].hidden
    }
    delete ldg.treeData[index].collapsed
    ////////////console.log(JSON.parse(JSON.stringify(ldg.treeData[0])))
    ldg.treeData[index].children.forEach(function(c){
      //delete c.hidden
      if(!c.filtered){
        delete c.hidden
      }
      delete c.collapsed
    })
  }
}

/* LinkedDataGraph.prototype.showFirstLevelBranch = function(node){
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
} */

/* LinkedDataGraph.prototype.expandFirstLevelBranch = function(node){
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
} */

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

LinkedDataGraph.prototype.flattenAllData = function(){
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
  //////////////console.log(ldg.allTreeData)
  ldg.allTreeData.forEach(function(r){
    
    recurse(r);
  })
  
  
  ldg.allData={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.allTreeData};
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

LinkedDataGraph.prototype.add = function(){
  var ldg=this;
  ldg.data.treeData=ldg.treeData
  ldg.flatten()
}

/* LinkedDataGraph.prototype.filter = function(filterId){
  var ldg=this;
  //var test2=0

  networkGraph.filtered=true

  ////////////////console.log(filterId)
  function recurse(node) {
    var index;

    index=ldg.allTreeData.findIndex(function(element){
      if(element.children){
        return (element.children.some((subElement) => subElement.id === node.id))
      }
    })
    
    if((index!=-1)&&(ldg.allTreeData[index].hidden)&&(ldg.allTreeData[index].filtered)){
      node.hidden=true;
      node.filtered=true;
    }else{
      checkHidden(node)
    }

    if (node.children){
      node.children.forEach(function(c){
        recurse(c)
      })
    }
    
  }

  //ldg.treeDataFiltered=JSON.parse(JSON.stringify(ldg.treeData));

  ldg.allTreeData.forEach(function(r){
    recurse(r);
  })


  function checkHidden(node){
    var check;
    ////////////////console.log(filterId)
    if(node.class!="free"){
      check=checkFilter(node)
    }else{
      check=checkFilterExpert(node,filterId)
    }

    //////////////console.log(JSON.parse(JSON.stringify(node)))
    //////////////console.log(check)

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

  function checkFilter(node){
    var hidden=false;
    let filterClass=networkGraph.filterClassesObjects.filter(function(f){
      return f.name==node.class
    })
    
    if(filterClass.length>0){
      
      //////////////////console.log(JSON.parse(JSON.stringify(node)))
      hidden=filterClass[0].checkConditionNode(node,filterId)
      //////////////////console.log(hidden)
      //////////////////console.log(JSON.parse(JSON.stringify(node)))
      //////////////////console.log(JSON.parse(JSON.stringify(node)))
      //////////////////console.log(node)
      //////////////////console.log(hidden)
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
} */

LinkedDataGraph.prototype.filter = function(filterId){
  var ldg=this;

  networkGraph.filtered=true


  if(networkGraph.filterClassesObjects){
    networkGraph.filterClassesObjects.forEach(function (cf){
      cf.filters.forEach(function(f){
        //console.log($("#"+f.details.property+"_filter_start").val())
        //console.log($("#"+f.details.property+"_filter_end").val())
        f.valuesFiltered()
        //console.log($("#"+f.details.property+"_filter_start").val())
        //console.log($("#"+f.details.property+"_filter_end").val())
        if(f.valuesChanged){
          //console.log(f.valuesChanged)
          if(f.checkValuesChangedIn()){
            //console.log($("#"+f.details.property+"_filter_start").val())
            //console.log($("#"+f.details.property+"_filter_end").val())
            checkNodesForFilter(f);
          }else{
            f.emptyValuesChanged()
          }
        }
      })
    })
  }
  ////console.log(JSON.parse(JSON.stringify(ldg.allTreeData)))

  function recurse(node,filter) {
    var index;

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

  //ldg.treeDataFiltered=JSON.parse(JSON.stringify(ldg.treeData));
  function checkNodesForFilter(filter){
    ////console.log(filter)
    ////console.log(JSON.parse(JSON.stringify(ldg.allTreeData)))
    /* if(filter.details){
      ldg.allTreeData=ldg.allTreeData.reverse()
    } */
    //ldg.allTreeData=treeByOrder(ldg.allTreeData)

    ////console.log(JSON.parse(JSON.stringify(ldg.allTreeData)))
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
    var hidden=false;
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

/*   function treeByOrder(tree){
    var newTree=[]
    for(i=0;i<tree.length;i++){
      if(tree[i][])
    }
  } */
}

LinkedDataGraph.prototype.clearFilter = function(){
  var ldg=this;

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
  var ldg=this;
  var maxNumber=parseInt($("#cluster-number").val())
  
  //////////////////////////////console.log(treeData)
  //////////////////////////////console.log(configRow.results)
  //////////////////////////////console.log(configRow.node)
  if((childrenLength)&&(childrenLength>maxNumber)){
    if(treeData.length>0){
      treeData.forEach(function(t){
        ////////////////////////console.log(t.children.length)
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
    
    //branch.cluster=true
    //branch.more_results=branch.children
    
    
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
    var menuOptions=configRow.node.menuOption.split(";"),more_results

    var branch=ldg.treeData.filter(d=>d.id==configRow.node.id)[0]

    let children=branch.children.filter(d=>d.value==menuOptions[menuOptions.length - 1])[0]["children"]

    //////////////////////////////console.log(branch.more_results)
    ////////////console.log("transform data menu option")
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
    //////////////////////////////console.log(branch.children)
    branch.children.filter(d=>d.value==menuOptions[menuOptions.length - 1])[0]["children"]=[node]
    //branch.children.push(node)
    //////////////////////////////console.log(branch)
  }
}

async function settingsFromOption(type,option,node){
  //////////////////console.log("settingsFromOption")
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
  async function settingsFromOpionExpert(){
    if((!configRow)||(configRow instanceof ConfigRowBasic)){
      configRow = new ConfigRowExpert(option,node);
      await configRow.init()
    }else{
      await configRow.update(option,node)
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
  var ldg=this;
  var procNode=[],indexParent,child,indexNode,configRowResults,childrenLength;
  var treeResults;
  var properties=configRow.properties
  var treeData=[],children = []


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
  //////////console.log(JSON.parse(JSON.stringify(treeData)))
  //////////console.log(JSON.parse(JSON.stringify(ldg.treeData)))
  getAllData()
  //////////console.log(JSON.parse(JSON.stringify(treeData)))
  //////////console.log(JSON.parse(JSON.stringify(ldg.treeData)))
  //////////////////////////////console.log("cluster data")
  
  //treeData=ldg.clusterData(treeData)
  
  /* if((treeData.length>1)&&(treeData[0].children[0].class!="menuOption")){
    ldg.collapseBranch(treeData[0])
    linkedDataGraph.showFirstLevelBranch(treeData[0])
  } */

  function buildTreeDataBasic(){
    ////////////////////////console.log(configRow.results)
    for (let j = 0; j < configRow.results.length; ++j) {

      treeResults=get_hierarchy_from_keys(Object.keys(configRow.results[j]))
      ////////////////////////console.log(treeResults)

      for (let i = 0; i < treeResults.length; ++i) {
          if(configRow.results[j][treeResults[i]]){
              if(i>0){
                indexParent=checkNodeInTreeData()
                ////////////////////////console.log(indexParent)
                if(treeData[indexParent]["children"].filter(d=>d.value==configRow.results[j][treeResults[i]]["value"]).length==0){
                    ////////////////////////////console.log(configRow.results[j])
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
/*                 if(configRow.node){
                  ////////////console.log(JSON.parse(JSON.stringify(configRow.node)))
                } */
                
                if((configRow.node)&&(configRow.node.class=="free")){
                  procNode[i]=configRow.node.value
                }else{
                  //////////////////////console.log(configRow.results)
                  //////////////////////console.log(j)
                  //////////////////////console.log(treeResults)
                  //////////////////////console.log(i)
                  //////////////////////console.log(configRow.results[j][treeResults[i]]["value"])
                  procNode[i]=configRow.results[j][treeResults[i]]["value"]
                  //////////////////////console.log(procNode[0])
                }
/*                 if(configRow.node){
                  ////////////console.log(JSON.parse(JSON.stringify(configRow.node)))
                } */
              } 
          }
          
          
          
      }
      procNode=[]
    }
/*     if(configRow.node){
      ////////////console.log(JSON.parse(JSON.stringify(configRow.node)))
    } */
    ////////////console.log(JSON.parse(JSON.stringify(treeData[0])))
    return(treeData[0]["children"].length)
  }

/*   function buildTreeDataExpert(){
    ////////////////////////////////console.log(configRow.results)
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

    if (configRow.node.id) {
      if ((configRow.node.menuOption)&&(configRow.node.menuOption.includes(";"))){
        let obj = networkGraph.treeData.find(n => n.id == configRow.node["id"]);
        if (obj["children"])
          if (obj.children[0].type != "menuOption") {
            menuOptionNodes.push({ "id": genRandomString(), "value": configRow.node.menuOption.split(";")[0], "type": "menuOption", "children": obj.children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
            menuOptionNodes.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
            obj.children = menuOptionNodes;
          } else {
            obj.children.push({ "id": genRandomString(), "value": configRow["endpoint_url"] + "," + configRow.position, "type": "menuOption", "children": children, "hidden": false, "menuOption": "", "uri": obj.value, "class": "free" })
          }
          treeData=[configRow.node]

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
    if(networkGraph){
      //////////////////////////////console.log(networkGraph.treeData)
    }
    
  return children.length
  } */
  function buildTreeDataExpert(){
    ////////////////////console.log(configRow)
    var menuOptionNodes=[],node1,node2;
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
    if(networkGraph){
      //////////////////////////////console.log(networkGraph.treeData)
    }
    
  return children.length
  } 
  function checkNodeInTreeData(){
    //////////////////////console.log(procNode)
    var pathSearch=JSON.parse(JSON.stringify(procNode));
    var prevNodeIndex=-1,prevNodeId;
    //////////////////////console.log(pathSearch)
    while(pathSearch.length>0){
      //////////////////////console.log(prevNodeIndex)
      if(prevNodeIndex!=-1){
        //////////////////////console.log(pathSearch[0])
        //////////////////////console.log(treeData)
        prevNodeId=treeData[prevNodeIndex]["children"].filter(d=>d.value==pathSearch[0])[0]["id"]
        prevNodeIndex=treeData.findIndex(d=>d.id==prevNodeId)
      }else{
        //////////////////////console.log(treeData)
        //////////////////////console.log(pathSearch[0])
        prevNodeIndex=treeData.findIndex(d=>d.value==pathSearch[0])
        //////////////////////console.log(prevNodeIndex)
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
        
        ////////////////////////////console.log(id)
        ////////////////////////////console.log(ldg.treeData)
        let index=ldg.treeData.findIndex(function(element){
          if(element.children){
            return (element.children.some((subElement) => subElement.id === id))
          }
        })
        if (index!=-1){
          node=ldg.treeData[index].children.filter(d=>d.id==id)[0]
        }else{
          getNodeInMenuOption(id)
        }
      }
      return node
  }
  function getNodeInMenuOption(id){
    ////////////////////////////console.log(networkGraph.data.links)
    let link=networkGraph.data.links.filter(l=>l.target.id==id)[0]
    if((link.source.type)&&(link.source.type=="menuOption")){
      
    }
  }
/*   function createMenuOptionNodes(j){
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
  } */
  function createMenuOptionNodes(j){
    var node,nodeOption1,nodeOption2;
    ////////////console.log("createMenuOptionNodes")
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
           //treeData.push(nodeOption1)
           nodeOption2={"id":genRandomString(),"value":menuOptions[1],"shape":1,"class":"menuOption","className":"Menu Option","children":[]}
           //treeData.push(nodeOption2)

           node=nodeValues(configRow.results[j],0,configRow.node.id)
           node["children"]=[nodeOption1,nodeOption2]
           treeData.push(node)
           treeData.push(nodeOption1)
           treeData.push(nodeOption2)
           ////////////console.log(JSON.parse(JSON.stringify(node["children"])))
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
    ////////////////////////////console.log(node)
    //treeData.push(node)
    ////////////console.log(JSON.parse(JSON.stringify(node["children"])))

    ////////////////////////console.log(treeData)
  }
  //////////////////////////////console.log(treeData)
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