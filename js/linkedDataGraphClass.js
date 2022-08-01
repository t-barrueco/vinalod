LinkedDataGraph = function (_option,_settings,_node) {
    this.node=_node;
    this.option=_option;
    this.settings=_settings
    if(this.settings!=undefined){
      this.init();
    }
  };

LinkedDataGraph.prototype.init = async function () {
    var ldg=this;
    console.log("antes de get results")
    await ldg.getResults()
    console.log("despues de get results")
    //console.log(ldg)
    console.log("init")
    ldg.buildData()
  }

LinkedDataGraph.prototype.getResults = async function () {
    var ldg=this;
    let prefixes="";
    //console.log(configRow)
    let queryUrl = ldg.settings.url + "?query=" + prefixes +  encodeURIComponent(  ldg.settings.query  )+ "&format=json";
    console.log(queryUrl)
    let settingsQuery = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    ldg.results = await runSparlqQuery(settingsQuery);
    console.log(ldg.results)
    console.log("fin de getResults en linkedDataGraph")
  }

LinkedDataGraph.prototype.buildData = function () {
  var ldg=this;
  //if node has no children, concat the new treeData with the
  //data already in the treeData of the Networkgraph
  ldg.buildTreeData()

  ldg.flatten()
}
LinkedDataGraph.prototype.flatten = function(){
    var nodes = [], links=[];
    var ldg=this;

    function recurse(node) {
      //////////////console.log(node)
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
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node.children.length)
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

    ldg.treeData.forEach(function(r){
      //////////////console.log(r)
      recurse(r);
    })
    //console.log(nodes)
    ldg.data={"flatData":{"nodes":nodes,"links":links},"treeData":ldg.treeData};
    //ldg.allData=ldg.flatData
}
LinkedDataGraph.prototype.add = function(){
  var ldg=this;
  //console.log(networkGraph)
  //console.log(networkGraph.treeData)
  //console.log(ldg.data.treeData)
  //ldg.treeData=networkGraph.treeData.concat(ldg.data.treeData)
  console.log(ldg)
  ldg.data.treeData=ldg.treeData
  //ldg.allData.treeData=ldg.treeData
  ldg.flatten()
}
/* LinkedDataGraph.prototype.update = function(results,branchType){
  var ldg=this;
  ldg.results=results
  ldg.branchType=branchType
  ldg.init()
  ldg.add()
} */

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
  //console.log(ldg.settings.url)
  //console.log(ldg)
  await ldg.init()
};
LinkedDataGraphBasic.prototype.update = async function(option,node){
  var ldg=this;
  ldg.option=option
  ldg.node=node
  configRow.update(option,node)

  ldg.settings["query"]=configRow.rowFields.query
  ldg.settings["url"]=configRow.rowFields.endpoint_url
  await ldg.init()
}

LinkedDataGraphBasic.prototype.buildTreeData = function () {
  var ldg=this;
  var procNode=[],indexParent,tmpNode,child,classFreeNode;
  var treeResults;
  var properties=configRow.rowFields.properties
  var treeData=[]
  console.log("principio treeData")
  //console.log(ldg.treeData)
  if (ldg.treeData==undefined){
    ldg.treeData=[]
  }

  for (let j = 0; j < ldg.results.length; ++j) {
      treeResults=get_hierarchy_from_keys(Object.keys(ldg.results[j]))
      for (let i = 0; i < treeResults.length; ++i) {
          //console.log(i)
          //console.log(ldg.results[j][treeResults[i]])
          if(ldg.results[j][treeResults[i]]){
              if(i>0){
              indexParent=checkNodeInTreeData()
              //console.log(indexParent)
              //console.log(treeData)
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
                  //console.log(tmpNode)
                  treeData.push(tmpNode)
              }
              } 
              } 
          procNode[i]=ldg.results[j][treeResults[i]]["value"]
      }
      procNode=[]
  }

  ldg.treeData=ldg.treeData.concat(treeData)
  console.log(ldg.treeData)
  function checkNodeInTreeData(){
      var pathSearch=JSON.parse(JSON.stringify(procNode));
      var prevNodeIndex=-1,prevNodeId;
      //console.log(pathSearch)
      while(pathSearch.length>0){
      if(prevNodeIndex!=-1){
          prevNodeId=treeData[prevNodeIndex]["children"].filter(d=>d.value==pathSearch[0])[0]["id"]
          prevNodeIndex=treeData.findIndex(d=>d.id==prevNodeId)
      }else{
          //console.log(ldg.treeData)
          //console.log(pathSearch[0])
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
    
}