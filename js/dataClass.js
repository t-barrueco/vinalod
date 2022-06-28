Data = function (_results,_branchType) {
    this.results=_results
    this.branchType=_branchType
    //this.parent=_parent
    this.init();
  };

Data.prototype.init = function () {
    var dt=this;
    console.log("before build")
    console.log(dt)
    dt.buildData()
    //////////console.log(cf.file)
  }

Data.prototype.buildData = function (value,field) {
    var dt=this;
    var procNode=[],indexParent,treeData=[],tmpNode,child,classFreeNode;
    var treeResults;
    console.log("entra en build")
    console.log(configRow)
    var properties=configRow.rowFields.properties
    
    console.log(properties)
    for (let j = 0; j < results.length; ++j) {
        treeResults=get_hierarchy_from_keys(Object.keys(results[j]))
        for (let i = 0; i < treeResults.length; ++i) {
        if(results[j][treeResults[i]]){
            ////console.log(configRow)
            if(i>0){
            indexParent=checkNodeInTreeData()
            if(treeData[indexParent]["children"].filter(d=>d.value==results[j][treeResults[i]]["value"]).length==0){
                child=nodeValues(results[j],i)
                child["configRowNumber"]=configRow["rowNumber"]
                treeData[indexParent]["children"].push(child)
                if(i<(treeResults.length-1)){
                child["children"]=[]
                treeData.push(child)
                }
            }
            }else{
            if(treeData.length==0){
                if(node){
                tmpNode=nodeValues(results[j],0,node.id)
                }else{
                tmpNode=nodeValues(results[j],0)
                }
                tmpNode["children"]=[]
                treeData.push(tmpNode)
            }
            } 
            } 
        procNode[i]=results[j][treeResults[i]]["value"]
        }
        procNode=[]
    }

    dt.treeData

    function checkNodeInTreeData(){
        var pathSearch=JSON.parse(JSON.stringify(procNode));
        var prevNodeIndex=-1,prevNodeId;
        
        while(pathSearch.length>0){
        ////////////console.log(treeData.filter(d=>d.value==pathSearch[0]))
        if(prevNodeIndex!=-1){
            prevNodeId=treeData[prevNodeIndex]["children"].filter(d=>d.value==pathSearch[0])[0]["id"]
            prevNodeIndex=treeData.findIndex(d=>d.id==prevNodeId)
        }else{
            prevNodeIndex=treeData.findIndex(d=>d.value==pathSearch[0])
        }
        pathSearch.shift()
        ////////////console.log(pathSearch)
        ////////////console.log(procNode)
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
        var node,className;
        if(id==undefined){
        id=genRandomString()
        }

        className=configRow["classes"].filter(d=>d.class==treeResults[index])[0]["text"]
        node={"id":id,"value":r[treeResults[index]].value,"shape":1,"class":treeResults[index],"className":className}
        if((index==0)||((treeResults.length>2)&&(index<(treeResults.length-1)))){
        node["menuOption"]=configRow.options
        }
    
        node["tooltip"]=getTooltipNode(configRow.tooltip,node["class"])
    
        if((configRow.detail!="")&&(configRow.detail!=undefined)){
        node["detail"]=getDetail(configRow.detail,node["class"])
        }
    
        if(properties[treeResults[index]]){
        properties[treeResults[index]].forEach(function(k){
            if(r[k]!=undefined){
            node[k]=r[k].value
            }
        })
        }
        return node
    }
      
  }