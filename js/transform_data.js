// Transform data Basic Graph
/////////////////////////////////
function buildData(branchType,results, settingsGraph, node,configClasses){
  var treeData;
  //if node has no children, concat the new treeData with the
  //data already in the treeData of the Networkgraph
  if(branchType=="basic"){
    treeData=buildDataBasic(results,settingsGraph,configClasses,node)
    console.log(treeData)
  }else if(branchType=="expert"){
    treeData=buildDataExpert(results, settingsGraph, node)
    console.log(treeData)
  }
  if(node!=undefined){
    if(networkGraph.treeData.filter(d=>d.id==node.id).length==0){
      /* for (let i = 0; i < networkGraph.treeData.length; ++i) {
        indexNode=networkGraph.treeData[i].children.findIndex(d=>d.id==node.id)
        if(indexNode!=-1){
          break;
        }
      }
      networkGraph.treeData[i]["children"][indexNode]["children"]=flatData.treeData[0]["children"] */
      networkGraph.treeData=networkGraph.treeData.concat(treeData)
      console.log(networkGraph.treeData)
    }else{
    //if we have clicked already an option for the node
    //click on splitInMenuOption
      splitInMenuOption(treeData,networkGraph.treeData)
    }
  }
  if(branchType=="basic"){
    console.log(treeData)
    flattenData=flatten_v2(treeData)
  }else if(branchType=="expert"){
    flattenData = flatten_freeGraph(treeData)
  }
  
  data = { "flatData": flattenData.flatData, "allData": flattenData.flatData, "treeData": treeData }
  return data
  
  function splitInMenuOption(newTreeData){
    var menuOptionNodes=[],newMenuOption;

    let obj = networkGraph.treeData.find(n => n.id == newTreeData[0]["id"]);
    ////////console.log(obj)
    ////////console.log(newTreeData[0])
    ////////console.log(networkGraph.treeData)
    ////////////console.log(obj.menuOption)
    ////////////console.log(obj.children)
    ////////////console.log(newTreeData[0].menuOption)
    ////////console.log(nodesClassesCorrespondence)
    ////////console.log(colorCorrespondence)
    ////////console.log(colorScale.range())
    //////console.log(nodesClassesShow)
    //////console.log(nodesClassesCorrespondence)
    if(!nodesClassesShow.includes("menuOption")){
      nodesClassesShow.push("menuOption")
      nodesClassesCorrespondence["menuOption"]="menuOption"
    }
    if(obj.children){
      newMenuOption={ "id": genRandomString(), "value": newTreeData[0].menuOption, "type": "menuOption", "children": newTreeData[0].children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" }
      if(obj.children[0]["class"]!="menuOption"){
        menuOptionNodes.push({ "id": genRandomString(), "value": obj.menuOption, "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" })
        menuOptionNodes.push(newMenuOption)
        obj.children = menuOptionNodes;
      }else{
        obj.children.push(newMenuOption)
      }
    }else{
      //newMenuOption={ "id": genRandomString(), "value": newTreeData[0].menuOption, "type": "menuOption", "children": newTreeData[0].children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" }
      if(obj._children){
        //menuOptionNodes.push({ "id": genRandomString(), "value": obj.menuOption, "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" })
        //menuOptionNodes.push(newMenuOption)
        obj.children = newTreeData[0].children;
      }
    }
    
    
  }
}
function buildDataBasic(results,configRow,configClasses,node){
  var procNode=[],indexParent,treeData=[],tmpNode,indexNode,child,classFreeNode;
  var hierarchy=get_hierarchy(configRow["hierarchy"])
  var treeResults;
  ////////////////////////////console.log("buildDataBasic")
  //hierarchy=hierarchy.reverse()
  //alert("pasa")

  ////////////////////////////console.log(results)
  ////////////////////////////console.log(configRow["properties_full"])
  var properties=get_properties(configRow["properties_full"])
  ////////////////////////////console.log(properties)
  if(node==undefined){
    nodesClasses=hierarchy
    nodesClassesCorrespondence=getClassesShow(configRow["classes"])
    console.log(nodesClassesCorrespondence)
    nodesClassesShow=Object.values(nodesClassesCorrespondence)
    console.log(nodesClassesShow)
    classTooltip=hierarchy[0]
  }else{
    //////////////console.log(node)
    //////////////////////////////////console.log(configRow)
    ////////////////////////////////console.log(node.menuOption)
    //{det: 'DET', detLevel1: 'DET Level'}
    //det: "DET"
    //detLevel1: "DET Level"
    addClassLinkToBasic()
    ////////////////////////////////console.log(node.menuOption)
    if(node.menuOption==undefined){
      node.menuOption=configRow.options
    }else{
      node.menuOption=node.menuOption + ";"+ configRow.options
    }
  }   
  console.log(results)
  //////////////////////////console.log(hierarchy)
  for (let j = 0; j < results.length; ++j) {
    ////////////////console.log(Object.keys(results[j]));
    treeResults=get_hierarchy_from_keys(Object.keys(results[j]))
    ////////////////console.log(treeResults)
    for (let i = 0; i < treeResults.length; ++i) {
      //////////////////////////console.log(results[j][hierarchy[i]])
      //////////////////console.log(results[j])

      if(results[j][treeResults[i]]){
        //////////////////////////console.log(procNode[i])
        ////////////////console.log(i)
        ////////////////console.log(results[j][treeResults[i]])
        if(procNode[i]!=results[j][treeResults[i]].value){
          if(i>1){
            indexParent=idFromHierarchy(i,j)
            //////////////////console.log(treeData)
            child=nodeValues(results[j],i)
            child["configRowNumber"]=configRow["rowNumber"]
            treeData[indexParent]["children"].push(child)
          }else if(i==1){
            child=nodeValues(results[j],i)
            //console.log(child)
            //console.log(configRow)
            //child["configRow"]
            child["configRowNumber"]=configRow["rowNumber"]
            treeData[0]["children"].push(child)        
          }else{
            //const listHasCatalogs = this.originalLearningItems.filter(item => item.catalogues.map(catalogs => catalogs.some(catalog => catalog.value == val.catalogSearch)  
            //////////////////console.log(treeData)
            if(treeData.findIndex(d=>d.value==results[j][treeResults[0]].value)==-1){
              if(node){
                //users = treeData.filter(d => d.children.some(v.id==node.id))
                ////////////////////////////////////console.log(node.id)
                ////////////////////////////////////console.log(networkGraph.treeData)
                //users = networkGraph.treeData.filter(d => d.children.some(v => v.id == node.id))
                ////////////////////////////////////console.log(users)
                tmpNode=nodeValues(results[j],0,node.id)
                //////////////////console.log(tmpNode)
              }else{
                tmpNode=nodeValues(results[j],0)
                //////////////////console.log(tmpNode)
              }
              tmpNode["children"]=[]
              treeData.push(tmpNode)
              //////////////////console.log(treeData[0])
            }
          }
        } 
        procNode[i]=results[j][treeResults[i]]["value"]
      }else{
        procNode[i]=""
      }

/*       if(results[j][hierarchy[i]]){
        procNode[i]=results[j][hierarchy[i]]["value"]
      }else{
        procNode[i]=""
      } */
      
    }
  }
  //console.log(networkGraph.treeData)
  console.log(treeData)
  treeData=updateNodeChildren(treeData)
  console.log(treeData)
  //flatData=flatten_v2(treeData)
  ////////console.log(flatData)
  //return flatData
 /*  //if node has no children, concat the new treeData with the
  //data already in the treeData of the Networkgraph
  if(node!=undefined){
    if(networkGraph.treeData.filter(d=>d.id==node.id).length==0){
      // for (let i = 0; i < networkGraph.treeData.length; ++i) {
      //  indexNode=networkGraph.treeData[i].children.findIndex(d=>d.id==node.id)
      //  if(indexNode!=-1){
      //    break;
      //  }
      //}
      //networkGraph.treeData[i]["children"][indexNode]["children"]=flatData.treeData[0]["children"] 
      networkGraph.treeData=networkGraph.treeData.concat(flatData.treeData)
      //////console.log(networkGraph.treeData)
    }else{
    //if we have clicked already an option for the node
    //click on splitInMenuOption
      splitInMenuOption(flatData.treeData,networkGraph.treeData)
    }
  } */

  return treeData

  /* function splitInMenuOption(newTreeData){
    var menuOptionNodes=[],newMenuOption;

    let obj = networkGraph.treeData.find(n => n.id == newTreeData[0]["id"]);
    ////////console.log(obj)
    ////////console.log(newTreeData[0])
    ////////console.log(networkGraph.treeData)
    ////////////console.log(obj.menuOption)
    ////////////console.log(obj.children)
    ////////////console.log(newTreeData[0].menuOption)
    ////////console.log(nodesClassesCorrespondence)
    ////////console.log(colorCorrespondence)
    ////////console.log(colorScale.range())
    //////console.log(nodesClassesShow)
    //////console.log(nodesClassesCorrespondence)
    if(!nodesClassesShow.includes("menuOption")){
      nodesClassesShow.push("menuOption")
      nodesClassesCorrespondence["menuOption"]="menuOption"
    }
    if(obj.children){
      newMenuOption={ "id": genRandomString(), "value": newTreeData[0].menuOption, "type": "menuOption", "children": newTreeData[0].children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" }
      if(obj.children[0]["class"]!="menuOption"){
        menuOptionNodes.push({ "id": genRandomString(), "value": obj.menuOption, "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" })
        menuOptionNodes.push(newMenuOption)
        obj.children = menuOptionNodes;
      }else{
        obj.children.push(newMenuOption)
      }
    }else{
      //newMenuOption={ "id": genRandomString(), "value": newTreeData[0].menuOption, "type": "menuOption", "children": newTreeData[0].children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" }
      if(obj._children){
        //menuOptionNodes.push({ "id": genRandomString(), "value": obj.menuOption, "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" })
        //menuOptionNodes.push(newMenuOption)
        obj.children = newTreeData[0].children;
      }
    }
    
    
  } */
  function addClassLinkToBasic(){
    if(node["class"]=="free"){
      console.log(networkGraph.classesLinesConfig)
      classFreeNode=networkGraph.classesLinesConfig[networkGraph.nodesLinkBasicGraph.filter(d=>d.child.value==node["value"])[0]["class"]["value"]]
      //node["class"]=classFreeNode["class_orig"]
      let tmp={}
      tmp[classFreeNode["class_orig"]]=classFreeNode["class"]
/*       if(!nodesClassesCorrespondence){
        nodesClassesCorrespondence=[tmp]
        //nodesClassesShow=[classFreeNode["class"]]
      }else{
        nodesClassesCorrespondence[classFreeNode["class_orig"]]=classFreeNode["class"]
        //nodesClassesShow.push(classFreeNode["class"])
      }
      if(!nodesClassesShow){
        nodesClassesShow=[classFreeNode["class"]]
      }else{
        nodesClassesShow.push(classFreeNode["class"])
      } */
      //console.log(networkGraph.treeData)
      //nodesClassesCorrespondence=getClassesShow(configRow["classes"])
      nodesClassesCorrespondence={ ...nodesClassesCorrespondence, ...getClassesShow(configRow["classes"])}
      console.log(nodesClassesCorrespondence)
      nodesClassesShow=Object.values(nodesClassesCorrespondence)
      console.log(nodesClassesShow)
    }
  }
  function get_hierarchy_from_keys(keys){
    var keysH=[],result,index_;
    keys.forEach(function(k){
      index_=k.indexOf("_")
      if(index_!=-1){
        result = k.substring(0,index_);
        ////////////////console.log(result)
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
  function idFromHierarchy(i,j){
    var k=1;
    var indexParent,tmpNode,tmpId,tmpIndex,lastIndex="";
    while(k<i){
      if(k==1){
        lastIndex=0
      }
      //////////////////console.log(results[j][treeResults[k]].value)
      //////////////////console.log(treeData[lastIndex]["children"])
      tmpId=treeData[lastIndex]["children"].filter(d=>d.value==results[j][treeResults[k]].value)[0]["id"]
      tmpIndex=treeData.findIndex(d=>d.id==tmpId)
      if(tmpIndex==-1){
        tmpNode=nodeValues(results[j],k,tmpId)
        tmpNode["children"]=[]
        indexParent=treeData.push(tmpNode)-1
      }else{
        lastIndex=tmpIndex
        indexParent=lastIndex
      }
      k+=1
    }
    return indexParent
  }

  /* function buildDataExpert(results, form, node) {
    var children = [], treeData = [], more_results, menuOption, menuOptionNodes = [], configRow;
  
    results.forEach(r => {
      if (form["subject-object"] == "s") {
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
        children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
      } else if (form["subject-object"] == "o") {
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
        children.push({ "id": genRandomString(), "value": r["s"]["value"], "type": r["s"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
      }
  
  
    })
    if (node != undefined) {
      if (node["menuOption"]) {
        menuOption = node["menuOption"] + ";" + form["url"] + "," + form["subject-object"]
        networkGraph.treeData.filter(d => d.id == node["id"])
        let obj = networkGraph.treeData.find(n => n.id == node["id"]);
        if (obj["children"])
          if (obj.children[0].type != "menuOption") {
            menuOptionNodes.push({ "id": genRandomString(), "value": node["menuOption"], "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
            menuOptionNodes.push({ "id": genRandomString(), "value": form["url"] + "," + form["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
            obj.children = menuOptionNodes;
          } else {
            obj.children.push({ "id": genRandomString(), "value": form["url"] + "," + form["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          }
  
        obj["menuOption"] = menuOption
      } else {
        menuOption = node["url"] + "," + node["subject-object"]
        treeData = [{ "id": node["id"], "value": node["value"], "type": node["type"], "children": children, "hidden": false, "more_results": more_results, "menuOption": menuOption, "configRow": configRow, "class": "free" }]
      }
  
    } else {
      menuOption = form["url"] + "," + form["subject-object"]
      treeData = [{ "id": genRandomString(), "value": results[0][form["subject-object"]]["value"], "type": results[0][form["subject-object"]]["type"], "children": children, "hidden": false, "more_results": "", "menuOption": menuOption, "configRow": configRow, "class": "free" }]
    }
    flattenData = flatten_freeGraph(treeData)
    data = { "flatData": flattenData.flatData, "allData": flattenData.flatData, "treeData": treeData }
    return data
    //return treeData
  } */

  function flatten_freeGraph(root) {
    var nodes = [], links = [];
    function recurse(node) {
      if (!node["hidden"]) {
        position = nodes.indexOf(nodes.filter(function (item) {
          return item.id == node.id
        })[0])
        if (position == -1) {
          nodes.push(node)
          position = (nodes.length) - 1
        } else {
          nodes[position]["menuOption"] = node["menuOption"]
        }
        if (node.children) {
          nodes[position]["number"] = node.children.length
          node.children.forEach(function (c) {
            if (!c["hidden"]) {
              position = links.indexOf(links.filter(function (item) {
                return ((item.source == node.id) && (item.target == c.id))
              })[0])
              if (position == -1) {
                links.push({ "source": node.id, "target": c.id, "id": (node.id + "_" + c.id), "value": c.property })
              }
              recurse(c)
            }
          });
        } else {
          nodes[position]["number"] = 0;
        }
      }
  
    }
  
    root.forEach(function (r) {
      recurse(r);
    })
  
    return { "flatData": { "nodes": nodes, "links": links }, "treeData": root };
  }

  function nodeValues(r,index,id){
    var node;
    if(id==undefined){
      id=genRandomString()
    }
    ////////////////console.log(treeResults)
    ////////////console.log(r)
    ////////////console.log(configRow)
    node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index]}
    //////////////////////////console.log("nodeValues")
    if((index==0)||((treeResults.length>2)&&(index<(treeResults.length-1)))){
      node["menuOption"]=configRow.options
    }
    //PARECE QUE NO SE UTILIZA!!!!
    node["tooltip"]=getTooltipNode(configRow.tooltip,node["class"])
    //////////////////////////console.log("getDetail")
    //////////////////////////console.log(configRow)
    if((configRow.detail!="")&&(configRow.detail!=undefined)){
      node["detail"]=getDetail(configRow.detail,node["class"])
    }
    //////////////////console.log(node)
    //////////////////console.log(treeResults[index])
    //////////////////console.log(properties)
    if(properties[treeResults[index]]){
      properties[treeResults[index]].forEach(function(k){
        if(r[k]!=undefined){
          node[k]=r[k].value
        }
      })
    }
    ////////////////console.log(node)
    return node
  }

  function updateNodeChildren(tD){
    var indexChild,index;
    tD=tD.reverse()
    for (let i = 0; i < tD.length; ++i) {
      index=tD.findIndex(function(d){
        if(d.children.filter(v=>v.id==tD[i]["id"]).length>0){
          return true;
        }else{
          return false;
        }
      })
      if(index!=-1){
        indexChild=tD[index]["children"].findIndex(d=>d.id==tD[i]["id"])
        tD[i]["menuOption"]=tD[index]["children"][indexChild]["menuOption"]
        tD[index]["children"][indexChild]=tD[i]
      }
    }
    return tD.reverse()
  }
}
function showTreeData(node,treeData){
    var children
    
    var indexNode=treeData.findIndex(d=>d.id==node.id)
    children=treeData[indexNode]["_children"]
    delete treeData[indexNode]._children;
    treeData[indexNode]["children"]=children
    for (let i = 0; i < treeData[indexNode]["children"].length; i++) {
      treeData[indexNode]["children"][i]["hidden"]=false
    }
    //////////////////////////////////////////////////////////////////////////////////////console.log(treeData)
    return treeData
  }
function flatten(root) {
    var nodes = [], links=[],number,children=0;
    //////console.log("ENTRA EN FLATTEN----------------------------")
    function recurse(node) {
      var i=0
      ////////console.log(node)
      if(!node["hidden"]){
        if (node.children){
          node.children.forEach(function(c){
            if(!c["hidden"]){
              position=links.indexOf(links.filter(function(item) {
                return ((item.source == node.id)&&(item.target == c.id))
              })[0])
              if(position==-1){
                links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
                i+=1;
              }
              ////////console.log(c)
              recurse(c)
              addNode(c)
            }
          });
        } 
        //addNode(node)
        /* position=nodes.indexOf(nodes.filter(function(item) {
          return item.id == node.id
        })[0])
        if(position==-1){
          if(node["number"]==undefined){
            node["number"]=0
          }
          nodes.push(node);
        } */
      }
      //if(!node["hidden"]){
        /* position=nodes.indexOf(nodes.filter(function(item) {
          return item.id == node.id
        })[0])
        if(position==-1){
          if(node["number"]==undefined){
            node["number"]=0
          }
          nodes.push(node);
        } */
      //}
    }
    /* root.forEach(function(r){
      position=nodes.indexOf(nodes.filter(function(item) {
        return item.id == r.id
      })[0])
      if(position==-1){
        if (r.children){
          number=r.children.length
        }else{
          if (r["number"]){
            number=r["number"]
          }else{
            number=0
          }
        }
        r["number"]=number
        if(!r["hidden"]){
          nodes.push(r);
        }
      }
    }) */
    function addNode(rNode){
      ////////console.log(rNode)
      position=nodes.indexOf(nodes.filter(function(item) {
        return item.id == rNode.id
      })[0])
      if(position==-1){
        if (rNode.children){
          number=rNode.children.length
        }else{
          if (rNode["number"]){
            number=rNode["number"]
          }else{
            number=0
          }
        }
        rNode["number"]=number
        if(!rNode["hidden"]){
          nodes.push(rNode);
        }
      }
    }
    root.forEach(function(r){
      //////console.log(r)
      recurse(r);
      addNode(r)
    })
  
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
  }
function flatten_v2(root) {
    var nodes = [], links=[];
    //////////////////////////////////////////////////////////////////////console.log(root)
    function recurse(node) {
      //////////////////////////////////////////////////////////////////////console.log(node)
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
          //////////////////////////////////////////////////////////////////////////////////////console.log(node.children.length)
          node.children.forEach(function(c){
            if(!c["hidden"]){
              position=links.indexOf(links.filter(function(item) {
                return ((item.source == node.id)&&(item.target == c.id))
              })[0])
              if(position==-1){
                links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
              }
              recurse(c)
            }
          });
        }else{
          nodes[position]["number"]=0;
        } 
      }

    }

    root.forEach(function(r){
      //////////////////////////////////////////////////////////////////////console.log(r)
      recurse(r);
    })
    
    //nodes=nodes.splice.apply(nodes, [2, 0].concat(nodes.slice(-6)));
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
  }
/* function flatten_nestedNodes() {
    var nodes = [], links=[], addedNodes=[];
    //////////////////////////////////////////////////////////////////////console.log(root)
    //////////////////////////console.log(networkGraph.treeData)
    function recurse(node) {
      var positionParent,positionChild;
      //////////////////////////console.log(node)
      //////////////////////////console.log(node[node.class+"_uri"])
      if(!node["hidden"]){
        positionParent=nodes.indexOf(nodes.filter(function(item) {
          return item[item.class+"_uri"] == node[node.class+"_uri"]
        })[0])
        if(positionParent==-1){
          nodes.push(node)
          positionParent=(nodes.length)-1
        }

        if (node.children){
          //nodes[position]["number"]=node.children.length
          node.children.forEach(function(c){
            if(!c["hidden"]){
              position=links.indexOf(links.filter(function(item) {
                return ((item.source == node.id)&&(item.target == c.id))
              })[0])
              if(position==-1){
                links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
              }
              recurse(c)
            }
          });
        }else{
          nodes[position]["number"]=0;
        } 
      }

    }

    networkGraph.treeData.forEach(function(r){
      //////////////////////////////////////////////////////////////////////console.log(r)
      recurse(r);
    })
  
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
} */
function treeDataNestedNodes(){
  var changedNodes=[]
  //////////////////////////console.log(networkGraph.treeData)
  //var treeDataCopy
  //const treeData = [ ...networkGraph.treeData ];
  //let treeData=new Array()
  //treeData=networkGraph.treeData.concat()
  //treeData = networkGraph.treeData.map((d) => d);
  //var tempArray = JSON.parse(JSON.stringify(mainArray));
  //networkGraph.treeDataNested = networkGraph.treeData.map(object => ({ ...object }))
  networkGraph.treeDataNested = JSON.parse(JSON.stringify(networkGraph.treeData));
  ////////////////////////console.log(networkGraph.treeData[0]["id"])
  //networkGraph.treeDataNested[0]["id"]="test"
  ////////////////////////console.log(networkGraph.treeDataNested)
  ////////////////////////console.log(networkGraph.treeData)

  //const treeData=networkGraph.treeData
  /* function recurse(node,index) {
    ////////////////////////////console.log(node)
    //////////////////////////console.log(treeData[index]["children"].length)
    //////////////////////////console.log(treeData.length)
    copyDuplicates(index,-1,treeData,node)
    if (node.children){
      node.children.forEach(function(c,i){
        //////////////////////////console.log(c)
        //////////////////////////console.log(i)
      })
    }
  } */
  networkGraph.treeDataNested.forEach(function(r,index){
    //////////////////////////console.log(r)
    //recurse(r,index);
    /* if(r["children"]){
      networkGraph.treeDataNested=copyDuplicates(index,-1,networkGraph.treeData,r)
      r["children"].forEach(function(c,indexC){
        networkGraph.treeDataNested=copyDuplicates(index,indexC,networkGraph.treeData,c)
      })
    } */
    if(index<(networkGraph.treeDataNested.length-1)){
      if(!changedNodes.includes(r[r["class"]+"_uri"])){
        //networkGraph.treeDataNested=copyDuplicates(index+1,-1,networkGraph.treeData,r)
        copyDuplicates(index+1,-1,r)
        //////////////////////////console.log(index)
        //////////////////////console.log("FOR EACH PARENT")
        //////////////////////console.log(r)
        changedNodes.push(r[r["class"]+"_uri"])
      }
      r["children"].forEach(function(c,indexC){
        if(!changedNodes.includes(c[c["class"]+"_uri"])){
          copyDuplicates(index,indexC,c)
          //////////////////////////console.log(index)
          //////////////////////console.log("FOR EACH CHILD")
          //////////////////////console.log(c)
          //////////////////////////console.log(indexC)
          changedNodes.push(c[c["class"]+"_uri"])
        }
      })
    }
  })
  ////////////////////console.log(networkGraph.treeData)
  ////////////////////console.log(networkGraph.treeDataNested)
  ////////////////////console.log(networkGraph.treeData==networkGraph.treeDataNested)
  return flatten_v2(networkGraph.treeDataNested)
}
function copyDuplicates(index,i,node){
//function copyDuplicates(index,i,treeData,node){
  //////////////////////console.log(node)
  if(i!=-1){
    /* for (j = i; j < treeData[index]["children"].length; ++j) {
      if(node[node["class"]+"_uri"]==treeData[index]["children"][j][treeData[index]["children"][j]["class"]+"_uri"]){
        treeData[index]["children"][j]=node
      }
    } */
    //treeData=copyInChildren(index,i,treeData,node)
    copyInChildren(index,i,node)
  }
  //////////////////////console.log(index+1)
  //////////////////////console.log(networkGraph.treeDataNested.length)
  for (let j = index+1; j < networkGraph.treeDataNested.length; j++) {
    //////////////////////console.log(j)
    copyInParent(j,node)
    copyInChildren(j,0,node)
  }

  
  function copyInChildren(index,i,node){
    var childLength=networkGraph.treeDataNested[index]["children"].length
    //////////////////////console.log(node)
/*     ////////////////////////console.log(networkGraph.treeDataNested[index]["children"].length)
    ////////////////////////console.log(typeof(i))
    j=parseInt(i)
    ////////////////////////console.log(++j)
    ////////////////////////console.log(j) */
    for (let k = i; k < childLength; k++) {
      /* //////////////////////console.log(index)
      //////////////////////console.log(networkGraph.treeDataNested)
      //////////////////////console.log(k)
      //////////////////////console.log(networkGraph.treeDataNested[index]["children"][k])
      //////////////////////console.log(node[node["class"]+"_uri"])
      //////////////////////console.log(networkGraph.treeDataNested[index]["children"][k]["class"]) */
      ////////////////////////console.log(j)
      ////////////////////////console.log(node[node["class"]+"_uri"])
      //////////////////////console.log(networkGraph.treeDataNested[index]["children"][k][networkGraph.treeDataNested[index]["children"][k]["class"]+"_uri"])
      if((node[node["class"]+"_uri"]==networkGraph.treeDataNested[index]["children"][k][networkGraph.treeDataNested[index]["children"][k]["class"]+"_uri"])&&(node.id!=networkGraph.treeDataNested[index]["children"][k]["id"])){
        ////////////////////console.log(node)
        ////////////////////console.log(networkGraph.treeDataNested)
        ////////////////////console.log(index)
        networkGraph.treeDataNested[index]["children"][k]=node
        //////////////////////console.log(networkGraph.treeDataNested[index]["children"][k])
        //////////////////////console.log("igual")
      }
    }
  }
  function copyInParent(j,node){
    //////////////////////console.log(networkGraph.treeDataNested[j][networkGraph.treeDataNested[j]["class"]+"_uri"])
    //////////////////////console.log(node[node["class"]+"_uri"])
    if(node[node["class"]+"_uri"]==networkGraph.treeDataNested[j][networkGraph.treeDataNested[j]["class"]+"_uri"]){
      if(networkGraph.treeDataNested[j]["children"]){
        if(node["children"]){
          addChildren(node,j)
          //node["children"]=node["children"].concat(networkGraph.treeDataNested[j]["children"])
        }else{
          node["children"]=networkGraph.treeDataNested[j]["children"]
        }
      }
      ////////////////////////console.log(node)
      ////////////////////////console.log(networkGraph.treeDataNested[j])
      networkGraph.treeDataNested[j]=node
    }
    //return treeData
  }
  function addChildren(node,indexP){
    ////////////////////console.log(node["children"])
    ////////////////////console.log(networkGraph.treeDataNested[indexP]["children"])
    ////////////////////console.log(node["children"]==networkGraph.treeDataNested[indexP]["children"])
    ////////////////////console.log(node["children"].length)
    for (let l = 0; l < node["children"].length; l++) {
      if((networkGraph.treeDataNested[indexP]["children"].findIndex(d=>d.id==node["children"][l]["id"]))!=-1){
        node["children"].splice(l,1); 
        ////////////////////console.log(node["children"][l])
      }
    }
    //////////////////////console.log(node["children"][0]["id"])
    node["children"]=node["children"].concat(networkGraph.treeDataNested[j]["children"])
    ////////////////////console.log(node["children"])
  }
}
function flatten_v3(root) {
    var nodes = [], links=[];
    function recurse(node) {
      if(!node["hidden"]){
        //////////////////////////////////////////////////////////////////////////////////////console.log(node)
        position=nodes.indexOf(nodes.filter(function(item) {
          return item.id == node.id
        })[0])
        //////////////////////////////////////////////////////////////////////////////////////console.log(position)
        if(position==-1){
          nodes.push(node)
          position=(nodes.length)-1
        }
        if (node.children){
          nodes[position]["number"]=node.children.length
          //////////////////////////////////////////////////////////////////////////////////////console.log(nodes[position]["number"])
          ////////////////////////////////////////////////////////////////////////////////////////console.log(node.children.length)
          node.children.forEach(function(c){
            //////////////////////////////////////////////////////////////////////////////////////console.log(c)
            if(!c["hidden"]){
              position=links.indexOf(links.filter(function(item) {
                return ((item.source == node.id)&&(item.target == c.id))
              })[0])
              //////////////////////////////////////////////////////////////////////////////////////console.log(position)
              if(position==-1){
                links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
                //////////////////////////////////////////////////////////////////////////////////////console.log({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
              }
              recurse(c)
            }
          });
        }else{
          nodes[position]["number"]=0;
        } 
      }

    }

    root.forEach(function(r){
      recurse(r);
    })
    //////////////////////////////////////////////////////////////////////////////////////console.log(nodes)
    //////////////////////////////////////////////////////////////////////////////////////console.log(links)
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
  }

// Transform data Free Graph
//////////////////////////////
/* function addMenuOption(menuOption,node){
  ////////////////////////////////////////////////////////////////////////console.log(menuOption)
  ////////////////////////////////////////////////////////////////////////console.log(node)
  if(node["menuOption"]==undefined){
    ////////////////////////////////////////////////////////////////////////console.log(menuOption)
    return menuOption
  }else{
    ////////////////////////////////////////////////////////////////////////console.log(node["menuOption"] + ";" + menuOption)
    return node["menuOption"] + ";" + menuOption
  } 
} */
/* function splitInMenuOption(node,menuOptions){
  var menuOptionNodes=[]
  //////////////////////////////////////////console.log(node)
  //////////////////////////////////////////console.log(menuOptions.split(";"))
  let obj = networkGraph.treeData.find(n => n.id == node["id"]);
  //////////////////////////////////////////console.log(obj.children)
  menuOptionNodes.push({ "id": genRandomString(), "value": menuOptions.split(";")[0], "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" })
  menuOptionNodes.push({ "id": genRandomString(), "value": menuOptions.split(";")[1], "type": "menuOption", "children": [], "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" })
  obj.children = menuOptionNodes;
  //} else {
  //obj.children.push({ "id": genRandomString(), "value": form["url"] + "," + form["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
  //}
} */
/* function addNewMenuOption(node){
  let obj = networkGraph.treeData.find(n => n.id == node["id"]);
  obj.children.push({ "id": genRandomString(), "value": node["menuOption"].split(";")[node["menuOption"].split(";").length-1], "type": "menuOption", "children": [], "hidden": false, "more_results": "", "menuOption": "", "class": "menuOption" })
} */
/* function addMenuOptionNode(){
  var childrenMenuOption;
  node["children"]=[{"value":arrayMenuOptions[0],"id":genRandomString(),"class":"menuOption","shape":1,"number":0,"children":node["children"]}]
  node["children"].push({"value":arrayMenuOptions[1],"id":genRandomString(),"class":"menuOption","shape":1,"number":0,"children":[]})
  if(!("menuOption" in nodesClassesCorrespondence)){
    nodesClassesCorrespondence["menuOption"]="Menu option"
  }
  if(!nodesClassesShow.includes("Menu option")){
    nodesClassesShow.push("Menu option")
  }

}
function create_menuNode(index,treeData){
  if(networkGraph.treeData[index]["class"]!="menuOption"){
    networkGraph.treeData[index]["children"].concat(treeData.children)
  }
  if((node["menuOption"]!=undefined)&(node["menuOption"]!="no option")){
    arrayMenuOptions.push(node["menuOption"])
    arrayMenuOptions.push(menuOption)
    if(arrayMenuOptions.length>1){
      addMenuOptionNode()
    }
  }
  if(menuOption!=undefined){
    if(newNode["menuOption"]==undefined){
      newNode["menuOption"]=menuOption
      newNode["menuOptionText"]=configFile.filter(d=>d.option==menuOption)[0]["option_text"]
    }else{
      newNode["menuOption"]+=";"+menuOption
      newNode["menuOptionText"]="Several options displayed in graph. Click on each option to see results values:"
    }
    
  }else{
    newNode["menuOption"]="no options"
  }
} */
function buildDataExpert(results, form, node) {
  var children = [], treeData = [], more_results, menuOption, menuOptionNodes = [], configRow;
  console.log(results)
  console.log(form)
  results.forEach(r => {
    if (form["subject-object"] == "s") {
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
      children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
    } else if (form["subject-object"] == "o") {
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
      children.push({ "id": genRandomString(), "value": r["s"]["value"], "type": r["s"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
    }
  })
  console.log(children)
  if (node != undefined) {
    if (node["menuOption"]) {
      menuOption = node["menuOption"] + ";" + form["url"] + "," + form["subject-object"]
      networkGraph.treeData.filter(d => d.id == node["id"])
      let obj = networkGraph.treeData.find(n => n.id == node["id"]);
      if (obj["children"])
        if (obj.children[0].type != "menuOption") {
          menuOptionNodes.push({ "id": genRandomString(), "value": node["menuOption"], "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          menuOptionNodes.push({ "id": genRandomString(), "value": form["url"] + "," + form["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          obj.children = menuOptionNodes;
        } else {
          obj.children.push({ "id": genRandomString(), "value": form["url"] + "," + form["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
        }

      obj["menuOption"] = menuOption
    } else {
      menuOption = node["url"] + "," + node["subject-object"]
      treeData = [{ "id": node["id"], "value": node["value"], "type": node["type"], "children": children, "hidden": false, "more_results": more_results, "menuOption": menuOption, "configRow": configRow, "class": "free" }]
    }

  } else {
    menuOption = form["url"] + "," + form["subject-object"]
    treeData = [{ "id": genRandomString(), "value": results[0][form["subject-object"]]["value"], "type": results[0][form["subject-object"]]["type"], "children": children, "hidden": false, "more_results": "", "menuOption": menuOption, "configRow": configRow, "class": "free" }]
  }
  return treeData
/*   function getFreeGraphData(results, form) {
    var nodes = [], links = [], data, treeData, flattenData;
  
    treeData = buildTreeData(results, form)
    flattenData = flatten_freeGraph(treeData)
    data = { "flatData": flattenData.flatData, "allData": flattenData.flatData, "treeData": treeData }
    return data
  }
  return treeData */
  /* flattenData = flatten_freeGraph(treeData)
  data = { "flatData": flattenData.flatData, "allData": flattenData.flatData, "treeData": treeData }
  return data */
}