Data = function (_results,_branchType) {
    this.results=_results
    this.branchType=_branchType
    //this.parent=_parent
    this.init();
  };

Data.prototype.init = function () {
    var dt=this;
    dt.buildData()
  }

Data.prototype.buildTreeData = function () {
    var dt=this;
    var procNode=[],indexParent,tmpNode,child,classFreeNode;
    var treeResults;
    var properties=configRow.rowFields.properties
    dt.treeData=[]

    for (let j = 0; j < dt.results.length; ++j) {
        treeResults=get_hierarchy_from_keys(Object.keys(dt.results[j]))
        for (let i = 0; i < treeResults.length; ++i) {
            if(dt.results[j][treeResults[i]]){
                if(i>0){
                indexParent=checkNodeInTreeData()
                if(dt.treeData[indexParent]["children"].filter(d=>d.value==dt.results[j][treeResults[i]]["value"]).length==0){
                    child=nodeValues(dt.results[j],i)
                    
                    child["configRowNumber"]=configRow["rowNumber"]
                    dt.treeData[indexParent]["children"].push(child)
                    if(i<(treeResults.length-1)){
                        child["children"]=[]
                        dt.treeData.push(child)
                    }
                }
                }else{
                if(dt.treeData.length==0){
                    if(configRow.node){
                    tmpNode=nodeValues(dt.results[j],0,configRow.node.id)
                    }else{
                    tmpNode=nodeValues(dt.results[j],0)
                    }
                    tmpNode["children"]=[]
                    dt.treeData.push(tmpNode)
                }
                } 
                } 
            procNode[i]=dt.results[j][treeResults[i]]["value"]
        }
        procNode=[]
    }

    function checkNodeInTreeData(){
        var pathSearch=JSON.parse(JSON.stringify(procNode));
        var prevNodeIndex=-1,prevNodeId;
        
        while(pathSearch.length>0){
        if(prevNodeIndex!=-1){
            prevNodeId=dt.treeData[prevNodeIndex]["children"].filter(d=>d.value==pathSearch[0])[0]["id"]
            prevNodeIndex=dt.treeData.findIndex(d=>d.id==prevNodeId)
        }else{
            prevNodeIndex=dt.treeData.findIndex(d=>d.value==pathSearch[0])
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
        console.log(configRow)
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
Data.prototype.buildData = function () {
  var dt=this;
  //if node has no children, concat the new treeData with the
  //data already in the treeData of the Networkgraph
  dt.buildTreeData()

  dt.flatten()
}
Data.prototype.flatten = function(){
    var nodes = [], links=[];
    var dt=this;

    function recurse(node) {
      ////////////console.log(node)
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
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node.children.length)
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

    dt.treeData.forEach(function(r){
      ////////////console.log(r)
      recurse(r);
    })
    ////////////console.log(nodes)
    dt.flatData={"flatData":{"nodes":nodes,"links":links},"treeData":dt.treeData};
    dt.allData=dt.flatData
}
Data.prototype.add = function(){
  var dt=this;
  dt.treeData=networkGraph.treeData.concat(dt.treeData)
  dt.flatData.treeData=dt.treeData
  dt.allData.treeData=dt.treeData
  dt.flatten()
}
Data.prototype.update = function(results,branchType){
  var dt=this;
  dt.results=results
  dt.branchType=branchType
  dt.init()
  dt.add()
}