// Transform data Basic Graph
/////////////////////////////////

function buildDataBasic(results,configRow,configClasses,node,menuOption){
    var nodes=[],options=[],optionNode="",procNode=[],treeData=[],root,position=[],value,tooltip=[],classTooltip,uri,arrayMenuOptions=[],newNode;
    hierarchy=get_hierarchy(configRow["hierarchy"])
    //console.log(hierarchy)
    //console.log(node)
    if(node==undefined){
      nodesClasses=hierarchy
      nodesClassesCorrespondence=getClassesShow(configRow["classes"])
      nodesClassesShow=Object.values(nodesClassesCorrespondence)
      classTooltip=hierarchy[0]
    }else{
      classTooltip=nodesClassesCorrespondence[node["class"]]
      //console.log(classTooltip)
      //console.log(node["menuOption"])
      if((node["menuOption"]!=undefined)&(node["menuOption"]!="no option")){
        arrayMenuOptions.push(node["menuOption"])
        arrayMenuOptions.push(menuOption)
        if(arrayMenuOptions.length>1){
          addMenuOptionNode()
        }
      }
    }    
    properties=get_properties(configRow["properties_full"])
    tooltip=getTooltip(configRow["option_text"])
    //console.log(results[0])
    //console.log(hierarchy[0])
    root=results[0][hierarchy[0]]["value"]

    results.forEach(function(r){
      //////console.log(hierarchy)
      for (i = 0; i < hierarchy.length-1; ++i) {   
        //console.log(procNode[i])
        //console.log(r[hierarchy[i]].value) 
        if((!procNode[i])||(procNode[i]!=r[hierarchy[i]].value)){  
          if(node!=undefined){
            newNode=node
          }else{
            newNode={"id":genRandomString(),"value":r[hierarchy[i]].value,"shape":1,"class":hierarchy[i]}
          }
          //////console.log(newNode)
          if(r[hierarchy[i]].value==root){
            newNode["root"]=true
            if(node!=undefined){
              newNode["id"]=node.id
            }
          }
          options=getOptions(configClasses,hierarchy[i])

          if(options.length>0){
            optionNode=""
            options.forEach(function(k){
              if(optionNode==""){
                optionNode=k.option+"-"+k.option_text
              }else{
                optionNode=optionNode+";"+k.option+"-"+k.option_text
              }
            })
            newNode["options"]=optionNode
          }
          //console.log(configRow)
          newNode["tooltip"]=getTooltipNode(tooltip,newNode["class"])
          //console.log(properties)
          if(properties[hierarchy[i]]){
            properties[hierarchy[i]].forEach(function(k){
              //console.log(r)
              //console.log(k)
              //console.log(r[k])
              newNode[k]=r[k].value
            })
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
          
          nodes.push(newNode)
          if(position[i-1]){
            if(treeData[position[i-1]-1]["children"]==undefined){
              treeData[position[i-1]-1]["children"]=[]
            }
            treeData[position[i-1]-1]["children"].push(newNode)
          }
          if(i!=(hierarchy.length-1)){
            position[i]=treeData.push(newNode)
          }
          procNode[i]=newNode.value
        }
        
      } 

      if (r[hierarchy[hierarchy.length-1]]!=undefined){
        value=r[hierarchy[hierarchy.length-1]].value
        newNode={"id":genRandomString(),"value":value,"shape":1,"class":hierarchy[hierarchy.length-1]}
        if(properties[hierarchy[hierarchy.length-1]]){
              properties[hierarchy[hierarchy.length-1]].forEach(function(k){
                if(r[k]==undefined){
                  newNode[k]=""
                }else{
                  newNode[k]=r[k].value
                }              
              })
        }
        newNode["tooltip"]=getTooltipNode(tooltip,newNode["class"])
        nodes.push(newNode)

        if(treeData[position[position.length-1]-1]["children"]==undefined){
          treeData[position[position.length-1]-1]["children"]=[]
        }
        if(treeData[position[position.length-1]-1]["menuOption"]){
          if(arrayMenuOptions.length>1){
            treeData[position[position.length-1]-1]["children"][1]["children"].push(newNode)
          }else{
            treeData[position[position.length-1]-1]["children"].push(newNode)
          }
        }else{
          treeData[position[position.length-1]-1]["children"].push(newNode)
        }
        
        
      }
      })
      ////console.log(treeData)
      //throw new Error("Something went badly wrong!");

      flatData=flatten_v2(treeData)
      return flatData
      function addMenuOptionNode(){
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
    ////console.log(treeData)
    return treeData
  }
function flatten(root) {
    var nodes = [], links=[],number,children=0;
    function recurse(node) {
      var i=0
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
              recurse(c)
            }
          });
        } 
      }
      if(!node["hidden"]){
        position=nodes.indexOf(nodes.filter(function(item) {
          return item.id == node.id
        })[0])
        if(position==-1){
          if(node["number"]==undefined){
            node["number"]=0
          }
          nodes.push(node);
        }
      }
    }
    root.forEach(function(r){
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
    })
    root.forEach(function(r){
      recurse(r);
    })
  
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
  }
function flatten_v2(root) {
    var nodes = [], links=[];
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
          ////console.log(node.children.length)
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
      recurse(r);
    })
  
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
  }
function flatten_v3(root) {
    var nodes = [], links=[];
    function recurse(node) {
      if(!node["hidden"]){
        ////console.log(node)
        position=nodes.indexOf(nodes.filter(function(item) {
          return item.id == node.id
        })[0])
        ////console.log(position)
        if(position==-1){
          nodes.push(node)
          position=(nodes.length)-1
        }
        if (node.children){
          nodes[position]["number"]=node.children.length
          ////console.log(nodes[position]["number"])
          //////console.log(node.children.length)
          node.children.forEach(function(c){
            ////console.log(c)
            if(!c["hidden"]){
              position=links.indexOf(links.filter(function(item) {
                return ((item.source == node.id)&&(item.target == c.id))
              })[0])
              ////console.log(position)
              if(position==-1){
                links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
                ////console.log({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id)})
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
    ////console.log(nodes)
    ////console.log(links)
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
  }

// Transform data Free Graph
//////////////////////////////
