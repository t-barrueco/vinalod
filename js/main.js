var nodes=[],links=[],data={},networkGraph,configFile=null,configFileExp=null,dataInstances,allDataModel,
dataInstancesRessourceLegal,allData_at,allData_classSumLeg,nodesClasses,colorScale,
nodesSelSources=[],nodesSelTarget=[],execQueries=[],nodesClassesShow=[],nodesClassesCorrespondence,
filesIcons,zoomScale=1,zoomY=0,zoomX=0,colorCorrespondence={},classFilterHist=[],propertiesFilterHist=[],
graphHistory=[],filtersInGraph=[],filtersList=[],classesFilterList=[],optionsMenuHtml;
$.xhrPool = [];
  function dataViz(){
    var rowDataConfig,optionsMenu;
          d3.json("../config_vinalod/config_basicMode.json",function(dataConfig){
              d3.tsv("../config_vinalod/graph_icons.txt",function(dataIcons){
                filesIcons=dataIcons;
                //rowDataConfig=fillDropDown(dataConfig)
                configFile=dataConfig
                //buildBasicGraph(rowDataConfig)
                optionsMenu=dataConfig.filter(d=>d.collection=="eu_vocabularies")
                $.get("optionMainMenu.html", function (data) {
                    optionsMenuHtml=data
                    appendHtmlOptions(optionsMenu)
                });
              })
          })
  }
  function updateAll(){
      networkGraph.updateAll();
    }
  function forceYChecked(checked){
    networkGraph.forceProperties.forceY.enabled = checked; 
    updateAll();
  }
  function forceYStrength(value){
    networkGraph.forceProperties.forceY.strength=value; 
    updateAll();
  }
  function forceYY(value){
    networkGraph.forceProperties.forceY.y=value; 
    updateAll();
  }
  function forceCenterX(value){
    networkGraph.forceProperties.center.x=value; 
    updateAll()
  }
  function forceCenterY(value){
  networkGraph.forceProperties.center.y=value;
  updateAll();
  }
  function forceChargedChecked(checked){
    networkGraph.forceProperties.charge.enabled = checked; 
    updateAll()
  }
  function forceChargeStrength(value){
    networkGraph.forceProperties.charge.strength=value; 
    updateAll();
  }
  function forceChargeDistanceMin(value){
    networkGraph.forceProperties.charge.distanceMin=value; 
    updateAll()
  }
  function forceChargeDistanceMax(value){
    networkGraph.forceProperties.charge.distanceMax=value; 
    updateAll()
  }
  function forceCollideChecked(checked){
    networkGraph.forceProperties.collide.enabled = checked; 
    updateAll();
  }
  function forceCollideStrength(value){
    networkGraph.forceProperties.collide.strength=value; 
    updateAll();
  }
  function forceCollideRadius(value){
    networkGraph.forceProperties.collide.radius=value;
    updateAll();
  }
  function forceCollideIterations(value){
    networkGraph.forceProperties.collide.iterations=value;
    updateAll();
  }
  function forceXChecked(checked){
    networkGraph.forceProperties.forceX.enabled = checked; 
    updateAll();
  }
  function forceXStrength(value){
    networkGraph.forceProperties.forceX.strength=value; 
    updateAll();
  }
  function forceXX(value){
    networkGraph.forceProperties.forceX.x=value; 
    updateAll();
  }
  function forceLinksChecked(checked){
    networkGraph.forceProperties.link.enabled = checked; 
    updateAll();
  }
  function forceLinksDistance(value){
    networkGraph.forceProperties.link.distance=value; 
    updateAll();
  }
  function forceLinksIterations(value){
    networkGraph.forceProperties.link.iterations=value; 
    updateAll();
  }
  async function buildBasicGraph(rowDataConfig,node,menuOption){
    ////console.log(rowDataConfig)
    ////console.log(node)
    ////console.log(menuOption)
    var configRow,sparqlQuery,queryUrl, hierarchy, parameters,properties,property_names,options,prefixes,configClasses,classes,option_text,legendWidth,legendElements,legendElPosition=[],graphType,columns,found;
    url=configFile[rowDataConfig]["endpoint_url"]
    sparqlQuery=configFile[rowDataConfig]["query"]
    hierarchy=configFile[rowDataConfig]["hierarchy"]
    properties_full=configFile[rowDataConfig]["properties"]
    options=configFile[rowDataConfig]["option"]
    option_text=configFile[rowDataConfig]["option_text"]
    graphType=configFile[rowDataConfig]["type"]
    classes=configFile[rowDataConfig]["classes_text"]
    parameters=configFile[rowDataConfig]["parameters"]
    filters=configFile[rowDataConfig]["filters"]
    tooltip=configFile[rowDataConfig]["tooltip"]
    columns=configFile[rowDataConfig]["columns"]
    property_names=get_property_names(properties_full)
    
    /* if((networkGraph!=undefined)&(menuOption!="OP Themes and publication author")){
      ////////////////////console.log(menuOption)
      ////////////////////console.log(networkGraph.treeData)
      ////////////////////console.log(menuOption)
      throw new Error("Something went badly wrong!");
    } */
    
    configRow={"url":url,"sparqlQuery":sparqlQuery,"hierarchy":hierarchy,"properties_full":properties_full,
    "options":options,"option_text":option_text,"graphType":graphType,"classes":classes,"parameters":parameters,
    "filters":filters,"tooltip":tooltip,"columns":columns,"property_names":property_names}
  
    execQueries.push(sparqlQuery)
    configClasses = configFile.map(function(d) {
      return {
        class:d.class,
        option:d.option,
        option_text:d.option_text
      };
      })
    prefixes=""
    //When node is not undefined is because we call the function from a bubble as root and the Sparql Query has a PARAMETER
    if(node!=undefined){
      if(parameters!=""){
        ////console.log(parameters)
        parameters=get_parameters(parameters)
        for (i = 0; i < parameters.length; ++i) { 
          ////////console.log(node[parameters[i]])
          sparqlQuery=sparqlQuery.replace("PARAMETER"+(i+2).toString(), node[parameters[i]]);
        }  
        ////console.log(node)
          if((node[node["class"]+"_uri"]!=undefined)&(node[node["class"]+"_uri"]!="")){
            ////console.log("primera")
            sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]);
          }else{
            ////console.log("segunda")
            sparqlQuery=sparqlQuery.replace("PARAMETER", node["value"]);
          }
      }else{
        ////console.log(node)
        if(node["configRow"]){
          sparqlQuery=sparqlQuery.replace("PARAMETER", node["value"]);
        }else{
          sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]);
        }
        //////console.log(node[node["class"]+"_uri"])
        
      }

      nodesClassesCorrespondence=Object.assign(nodesClassesCorrespondence, getClassesShow(classes));
      nodesClassesShow=Array.from(new Set(nodesClassesShow.concat(Object.values(getClassesShow(classes)))))
      //////////////console.log(nodesClassesCorrespondence)
      //////////////console.log(nodesClassesShow)
    }
  
    if(graphType=="TREE"){
    var fn = function(){
        d3.select("#spin").style("display","none")
        document.getElementById("sparql-timeout").style.display="inline-block"
    };
    
    interval = setInterval(fn, 8000);
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    d3.select("#spin-message")
      .text("Waiting for Sparql query")
    d3.select("#spin").style("display","inline-flex")
  
    //console.log(sparqlQuery)
    ////console.log(queryUrl)
    $objectAjax=$.ajax(settings).then  (function( _data ) {
      var results = _data.results.bindings;
      //console.log(results)
      d3.select("#spin").style("display","none")
      //////console.log(results)
      graphHistory.push(options)
      ////////////////////////console.log(properties)
     
      
      if(node==undefined){
        data=buildDataBasic(results,configRow,configClasses,node)
        d3.selectAll(".graph").remove()
        forces = {
          center: {
              x: 0.5,
              y: 0.3
          },
          charge: {
              enabled: true,
              strength: -500,
              distanceMin: 100,
              distanceMax: 2000
          },
          collide: {
              enabled: true,
              strength: .2,
              iterations: 1,
              radius: 5
          },
          forceX: {
              enabled: true,
              strength: .1,
              x: .2
          },
          forceY: {
              enabled: true,
              strength: .1,
              y: .2
          },
          link: {
              enabled: true,
              distance: 100,
              iterations: 1
          }
        }
        networkGraph = new NetworkGraph("#networkGraph", data,forces,"fromConfig");
        collapse()
      }else{
        ////////////////////console.log(networkGraph.treeData)
        data=buildDataBasic(results,configRow,configClasses,node,menuOption)
        var dif=differenceArrays(nodesClassesShow,colorScale.domain())
        //////////////console.log(dif)
        ////////////console.log(nodesClassesShow)
        ////////////console.log(colorScale.domain())
        found=networkGraph.treeData.filter(function(item) {
          //////////////////////console.log(item.id)
          //////////////////////console.log(data.treeData[0]["id"])
          return (item.id == data.treeData[0]["id"])
        })
        //////////////////////console.log(found)
        if(found.length!=0){
         /*  if((networkGraph!=undefined)&(menuOption!="OP Themes and publication author")){
            ////////////////////console.log(menuOption)
            ////////////////////console.log(networkGraph.treeData)
            ////////////////////console.log(menuOption)
            //////////////////////console.log(treeData[position[i-1]-1])
           // throw new Error("Something went badly wrong!");
          } */
          //////////////////////console.log(networkGraph.treeData.indexOf(found[0]))
          create_menuNode(networkGraph.treeData.indexOf(found[0]),data.treeData[0])
          networkGraph.data=flatten(networkGraph.treeData).flatData
        }else{
        //////////////////////console.log(networkGraph.treeData)
        networkGraph.treeData=networkGraph.treeData.concat(data.treeData)
        networkGraph.data=flatten(networkGraph.treeData).flatData
        }

        networkGraph.initializeSimulation();
        networkGraph.dataJoinGraph()
        networkGraph.enterGraph()
        fillLegend(dif,true)
        networkGraph.initializeSimulation();
        if(networkGraph.graphType=="freeGraph"){
          networkGraph.dataJoinFreeGraph()
        }else{
          networkGraph.dataJoinGraph()
        }
        networkGraph.exitGraph()
      }
      if((results.length>0)&(filters!="")){
        addFilters(filters,data)
        
        filtersInGraph=filtersInGraph.concat(filters)
      }
  
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      document.getElementById("sparql-timeout").style.display="inline-block"
    })
  
    .always(function(jqXHR, textStatus, errorThrown) {
        d3.select("#spin").style("display","none")
  
    })
    .done(function (data, textStatus, jqXHR) {
      clearInterval(interval)
      d3.select("#spin").style("display","none")
      document.getElementById("sparql-timeout").style.display="none"
    })
    await $objectAjax
    }else if (graphType=="TREEGRAPH"){
      showTreegraph(node,sparqlQuery)
    }else if (graphType=="WEBPAGE"){
      showWikipediaPage(node)
    }else if (graphType=="TIMELINE"){
      showTimeLine(node)
    }else if (graphType=="PDF"){
      showPdf(node,sparqlQuery,url)
    }else if (graphType=="TABLE"){
      showTable(node,sparqlQuery,columns,property_names)
    }else if (graphType=="WORDCLOUD"){
      showWordcloud(node,sparqlQuery,configRow)
    }
    function create_menuNode(index,treeData){
      //////////////////////console.log(networkGraph.treeData[index])
      //////////////////////console.log(treeData)
      ////////////////////console.log(networkGraph.treeData)
      if(networkGraph.treeData[index]["class"]!="menuOption"){
        networkGraph.treeData[index]["children"].concat(treeData.children)
      }
    }
  }
  function buildDataBasic(results,configRow,configClasses,element,menuOption){

  //function buildDataBasic(results,properties,hierarchy,classes,configClasses,element,option_text){
    var nodes=[],options=[],optionNode="",procNode=[],treeData=[],root,position=[],value,tooltip=[],classTooltip,uri,arrayMenuOptions=[];
    hierarchy=get_hierarchy(configRow["hierarchy"])
    //console.log(hierarchy)
    //console.log(element)
    if(element==undefined){
      nodesClasses=hierarchy
      nodesClassesCorrespondence=getClassesShow(configRow["classes"])
      //console.log(nodesClassesCorrespondence)
      nodesClassesShow=Object.values(nodesClassesCorrespondence)
      //console.log(nodesClassesShow)
      classTooltip=hierarchy[0]
    }else{
      classTooltip=nodesClassesCorrespondence[element["class"]]
      if((element["menuOption"]!=undefined)&(element["menuOption"]!="no option")){
        arrayMenuOptions.push(element["menuOption"])
        arrayMenuOptions.push(menuOption)
        if(arrayMenuOptions.length>1){
          addMenuOptionNode()
        }
      }
    }
    
    
    properties=get_properties(configRow["properties_full"])
    tooltip=getTooltip(classTooltip,configRow["option_text"])
    root=results[0][hierarchy[0]]["value"]

    results.forEach(function(r){
      for (i = 0; i < hierarchy.length-1; ++i) {    
        if((!procNode[i])||(procNode[i]!=r[hierarchy[i]].value)){  
          if(element!=undefined){
            node=element
          }else{
            node={"id":genRandomString(),"value":r[hierarchy[i]].value,"shape":1,"class":hierarchy[i]}
          }
          //console.log(node)
          if(r[hierarchy[i]].value==root){
            node["root"]=true
            if(element!=undefined){
              node["id"]=element.id
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
            node["options"]=optionNode
          }

          node["tooltip"]=getTooltipNode(tooltip,node["class"])
          if(properties[hierarchy[i]]){
            properties[hierarchy[i]].forEach(function(k){
              node[k]=r[k].value
            })
          }
          if(menuOption!=undefined){
            if(node["menuOption"]==undefined){
              node["menuOption"]=menuOption
              node["menuOptionText"]=configFile.filter(d=>d.option==menuOption)[0]["option_text"]
            }else{
              node["menuOption"]+=";"+menuOption
              node["menuOptionText"]="Several options displayed in graph. Click on each option to see results values:"
            }
            
          }else{
            //console.log(node)
            //console.log(configFile)
            //console.log(node.class)
            node["menuOption"]="no options"
          }
          
          nodes.push(node)
          if(position[i-1]){
            //console.log(treeData[position[i-1]-1])
            //console.log(node)
            if(treeData[position[i-1]-1]["children"]==undefined){
              treeData[position[i-1]-1]["children"]=[]
            }
            treeData[position[i-1]-1]["children"].push(node)
          }
          if(i!=(hierarchy.length-1)){
            position[i]=treeData.push(node)
          }
          procNode[i]=node.value
        }
        
      } 
      
      if (r[hierarchy[hierarchy.length-1]]!=undefined){
        value=r[hierarchy[hierarchy.length-1]].value
        node={"id":genRandomString(),"value":value,"shape":1,"class":hierarchy[hierarchy.length-1]}
        if(properties[hierarchy[hierarchy.length-1]]){
              properties[hierarchy[hierarchy.length-1]].forEach(function(k){
                if(r[k]==undefined){
                  node[k]=""
                }else{
                  node[k]=r[k].value
                }              
              })
        }
        node["tooltip"]=getTooltipNode(tooltip,node["class"])
        nodes.push(node)

        if(treeData[position[position.length-1]-1]["children"]==undefined){
          treeData[position[position.length-1]-1]["children"]=[]
        }
        if(treeData[position[position.length-1]-1]["menuOption"]){
          if(arrayMenuOptions.length>1){
            treeData[position[position.length-1]-1]["children"][1]["children"].push(node)
          }else{
            treeData[position[position.length-1]-1]["children"].push(node)
          }
        }else{
          treeData[position[position.length-1]-1]["children"].push(node)
        }
        
        
      }
      })
      
      flatData=flatten_v2(treeData)
      return flatData
      function addMenuOptionNode(){
        var childrenMenuOption;
        element["children"]=[{"value":arrayMenuOptions[0],"id":genRandomString(),"class":"menuOption","shape":1,"number":0,"children":element["children"]}]
        element["children"].push({"value":arrayMenuOptions[1],"id":genRandomString(),"class":"menuOption","shape":1,"number":0,"children":[]})
        if(!("menuOption" in nodesClassesCorrespondence)){
          nodesClassesCorrespondence["menuOption"]="Menu option"
        }
        if(!nodesClassesShow.includes("Menu option")){
          nodesClassesShow.push("Menu option")
        }

      }
  }
  function buildDataBasic_copy(results,configRow,configClasses,element,menuOption){

    //function buildDataBasic(results,properties,hierarchy,classes,configClasses,element,option_text){
      var nodes=[],options=[],optionNode="",procNode=[],treeData=[],root,position=[],value,tooltip=[],classTooltip,uri;
      hierarchy=get_hierarchy(configRow["hierarchy"])
      //////////////////////console.log(menuOption)
      if(element==undefined){
        nodesClasses=hierarchy
        nodesClassesCorrespondence=getClassesShow(configRow["classes"])
        nodesClassesShow=Object.values(nodesClassesCorrespondence)
        classTooltip=hierarchy[0]
      }else{
        classTooltip=nodesClassesCorrespondence[element["class"]]
      }
      properties=get_properties(configRow["properties_full"])
      tooltip=getTooltip(classTooltip,configRow["option_text"])
      root=results[0][hierarchy[0]]["value"]
      results.forEach(function(r){
        for (i = 0; i < hierarchy.length-1; ++i) {    
          if((!procNode[i])||(procNode[i]!=r[hierarchy[i]].value)){  
            if(element!=undefined){
              node=element
            }else{
              node={"id":genRandomString(),"value":r[hierarchy[i]].value,"shape":1,"class":hierarchy[i]}
            }
            if(r[hierarchy[i]].value==root){
              node["root"]=true
              if(element!=undefined){
                node["id"]=element.id
              }
            }
            options=getOptions(configClasses,hierarchy[i])
            ////////////////////////console.log(options)
            ////////////////////////console.log(node)
            if(options.length>0){
              optionNode=""
              options.forEach(function(k){
                if(optionNode==""){
                  optionNode=k.option+"-"+k.option_text
                }else{
                  optionNode=optionNode+";"+k.option+"-"+k.option_text
                }
              })
              node["options"]=optionNode
            }
  
            node["tooltip"]=getTooltipNode(tooltip,node["class"])
            if(properties[hierarchy[i]]){
              properties[hierarchy[i]].forEach(function(k){
                node[k]=r[k].value
              })
            }
            if(menuOption!=undefined){
              if(node["menuOption"]==undefined){
                node["menuOption"]=menuOption
              }else{
                node["menuOption"]+=";"+menuOption
            }
              
            }else{
              node["menuOption"]="no options"
            }
            
            nodes.push(node)
  
            if(position[i-1]){
              treeData[position[i-1]-1]["children"].push(node)
            }
            if(i!=(hierarchy.length-1)){
              ////////////////////console.log(node["children"])
              //node["children"]=[]
              position[i]=treeData.push(node)
             /*  if((networkGraph!=undefined)&(menuOption!="OP Themes and publication author")){
                ////////////////////console.log(menuOption)
                ////////////////////console.log(networkGraph.treeData)
                ////////////////////console.log(menuOption)
                ////////////////////console.log(treeData)
                throw new Error("Something went badly wrong!");
              } */
            }
            procNode[i]=node.value
          }
          
        } 
        
        if (r[hierarchy[hierarchy.length-1]]!=undefined){
          value=r[hierarchy[hierarchy.length-1]].value
          node={"id":genRandomString(),"value":value,"shape":1,"class":hierarchy[hierarchy.length-1]}
          if(properties[hierarchy[hierarchy.length-1]]){
                properties[hierarchy[hierarchy.length-1]].forEach(function(k){
                  if(r[k]==undefined){
                    node[k]=""
                  }else{
                    node[k]=r[k].value
                  }              
                })
          }
          node["tooltip"]=getTooltipNode(tooltip,node["class"])
          ////////////////////////console.log(node)
          ////////////////////////console.log(menuOption)
          /* if(menuOption!=undefined){
            node["menuOption"]=menuOption
          } */
          nodes.push(node)
          //if()
          if(treeData[position[position.length-1]-1]["children"]==undefined){
            treeData[position[position.length-1]-1]["children"]=[]
          }
          treeData[position[position.length-1]-1]["children"].push(node)
        }
        })
        ////////////////////////console.log(treeData)
        
        flatData=flatten_v2(treeData)
        ////////////////////////console.log(flatData)
        return flatData
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
function collapse(){
  networkGraph.collapseAll()
}
function expand(){
  networkGraph.expandAll()
}
function zoomIn(){
  networkGraph.zoomIn()
}
function zoomOut(){
  networkGraph.zoomOut()
}
async function showTimeLine(data){
  var rowDataConfig,results,node,dataTimeline=[];

  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[data["class"]])&&(configFile[i]["type"]=="TIMELINE")){
      rowDataConfig=i
      break;
    }
  }
  node=data
  url=configFile[rowDataConfig]["endpoint_url"]
  sparqlQuery=configFile[rowDataConfig]["query"]
  prefixes=""
  do{
    if(node["class"]!=undefined){
      sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]); 
    }else{
      sparqlQuery=sparqlQuery.replace("PARAMETER", node);
    }
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

    results = await runSparlqQuery(settings)
    if(node["class"]!=undefined){
      sparqlQuery=sparqlQuery.replace(node[node["class"]+"_uri"],"PARAMETER"); 
    }else{
      sparqlQuery=sparqlQuery.replace(node,"PARAMETER"); 
    }
    if(results[0]["replaces"]!=undefined){
      node=results[0]["replaces"]["value"]
    }    
    if(results[0]["endDate"]==undefined){
      let today = new Date().toISOString().slice(0, 10)

      results[0]["endDate"]={"value":today.toString()}
    }
    dataTimeline.push(results[0])
    }
  while (results[0]["replaces"]!=undefined) 
  
  timelineGraph(dataTimeline)
  //modal2=document.getElementById("myModal2")
  //modal2.style.display = "block";
  $("#myModal2").removeClass("translate-x-full")
  $("#myModal2").addClass("translate-x-0")
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
async function showPdf(node,sparqlQuery,url){
  prefixes=""
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  results = await runSparlqQuery(settings)
  var pdf=results[0]["item"]["value"]
  modal2=document.getElementById("myModal2")
  modal2.style.display = "block";
  d3.select(".modal-header2 h2").remove()
  modalHeader2=document.getElementsByClassName("modal-header2")[0]
  modalHeader2.classList.add("mb-4");
  var h2=document.createElement("h2")
  h2.className="text-lg font-medium text-gray-900"
  h2.innerHTML = "PDF"
  modalHeader2.appendChild(h2);
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
  if(d3.select("#modalGraph")){
    d3.select("#modalGraph").remove()
  }
  var div=document.createElement("div")
  div.setAttribute("id","modalGraph")
  div.setAttribute("style","overflow: auto")
  document.getElementsByClassName("modal-content2")[0].appendChild(div)
  PDFObject.embed(pdf, "#modalGraph");
}
async function showTable(node,sparqlQuery,columns,column_names){
  var rowDataConfig,results,data=[],modalHeader2;
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["type"]=="TABLE")){
      rowDataConfig=i
      break;
    }
  }
  url=configFile[rowDataConfig]["endpoint_url"]
  prefixes=""
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  results = await runSparlqQuery(settings)
  table(results,columns,column_names)
  modal2=document.getElementById("myModal2")

  d3.select(".modal-header2 h2").remove()
  modalHeader2=document.getElementsByClassName("modal-header2")[0]
  var h2=document.createElement("h2")
  h2.className="text-lg font-medium text-gray-900"
  h2.innerHTML = node["value"]
  modalHeader2.appendChild(h2);

  modal2.style.display = "block";
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
function table(data,columns,column_names){
  var cellContent;
  if(d3.select("#modalGraph")){
    d3.select("#modalGraph").remove()
  }
  var div=document.createElement("div")
  div.setAttribute("id","modalGraph")
  div.setAttribute("style","overflow: auto")
  document.getElementsByClassName("modal-content2")[0].appendChild(div)
  var mainEl=document.getElementById("modalGraph")
  var div=document.createElement("div");
  div.className="flex flex-col mt-6"

  var div2=document.createElement("div");
  div2.className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"

  var div3=document.createElement("div");
  div3.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"

  var div4=document.createElement("div");
  div4.className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"

  var table = document.createElement("table");

  table.className="min-w-full divide-y divide-gray-200"

  header = table.createTHead();
  header.className="bg-gray-50"
  var row = header.insertRow(0);    

  for (var i = columns.length-1; i >= 0; i--) {
      var headerCell = row.insertCell(0);
      headerCell.setAttribute("scope", "col");
      headerCell.setAttribute("class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
      if(Object.keys(column_names).includes(columns[i])){
        headerCell.innerHTML = column_names[columns[i]]
      }else{
        headerCell.innerHTML = nodesClassesCorrespondence[columns[i]]
      }
      
  }
  body=table.createTBody();
  for (var j = 0; j < data.length; j++) {
    row = body.insertRow();
    if(j%2==0){
      row.className="bg-white"
    }else{
      row.className="bg-gray-50"
    }
    for (var i = 0; i < columns.length; i++) {
      cell = row.insertCell();
      cell.className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
      if(data[j][columns[i]]!=undefined){
        if (columns[i].slice(-6)=="_image"){
          cellContent = document.createElement('img'); 
          cellContent.src = data[j][columns[i]]["value"]; 
          cellContent.className="w-12 rounded-full h-14"
        }else{
          cellContent = document.createTextNode(data[j][columns[i]]["value"]);
        }
      }else{
        cellContent = document.createTextNode("");
      }
      
      cell.appendChild(cellContent);
    }
   
  }

  mainEl.appendChild(div).appendChild(div2).appendChild(div3).appendChild(div4).appendChild(table);

}
async function showTreegraph(node,sparqlQuery){
  var rowDataConfig,results,dataTreegraph=[];
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["type"]=="TREEGRAPH")){
      rowDataConfig=i
      break;
    }
  }
  url=configFile[rowDataConfig]["endpoint_url"]
  prefixes=""

  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  results = await runSparlqQuery(settings)
  
  dataTreegraph=transformDataTreegraph(node,results)
  treeGraph(dataTreegraph,node["value"])
  modal2=document.getElementById("myModal2")
  modal2.style.display = "block";
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
function transformDataTreegraph(node,data){
  var treeData,membership=[]

    for (i = 0; i < data.length; ++i) { 
      membership.push({
        "name": data[i]["membership"]["value"],
        //"parent": node["value"],
        "children": [
        {
            "name": data[i]["person"]["value"],
            //"parent": data[i]["membership"]["value"]
        }]})
    }
    treeData={"name":"Organisation",
                   //"parent":"null",
                  "children":membership}

    return treeData
}
async function showWordcloud(node,sparqlQuery,configRow){
  var rowDataConfig,results,dataTreegraph=[],title;
  //////////////////////////console.log(node)

  if(node!=undefined){
    for (i = 0; i < configFile.length; ++i) { 
      if((configFile[i]["class"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["type"]=="WORDCLOUD")){
        rowDataConfig=i
        break;
      }
    }
    url=configFile[rowDataConfig]["endpoint_url"]
    title=node["value"]
  }else{
    url=configRow["url"]
    title="WordCloud"
  }
  
  prefixes=""
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  results = await runSparlqQuery(settings)
  
  dataWordCloud=transformDataWordCloud(results)
  wordCloudGraph(dataWordCloud,title)
  modal2=document.getElementById("myModal2")
  modal2.style.display = "block";
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
function transformDataWordCloud(data){
  var wordCloudData=[],splittedStr=[]
  for (i = 0; i < data.length; ++i) { 
    splittedStr=data[i]["text"]["value"]
    if(splittedStr.includes(".")){
      splittedStr=splittedStr.split(".")[1]
    }
    splittedStr=splittedStr.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(" ")
    wordCloudData.push(splittedStr)
  }
  return wordCloudData.flat()
}
function transformDataTreegraph(node,data){
  var treeData,membership=[]

    for (i = 0; i < data.length; ++i) { 
      membership.push({
        "name": data[i]["membership"]["value"],
        //"parent": node["value"],
        "children": [
        {
            "name": data[i]["person"]["value"],
            //"parent": data[i]["membership"]["value"]
        }]})
    }
    treeData={"name":"Organisation",
                   //"parent":"null",
                  "children":membership}

    return treeData
}

function showWikipediaPage(data){
  var rowDataConfig,results,node,page,parameters,parameterTemp="";
  var modal=document.getElementById("myModal")
  modal.style.display = "none";
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[data["class"]])&&(configFile[i]["type"]=="WEBPAGE")){
      rowDataConfig=i
      break;
    }
  }
  node=data
  url=configFile[rowDataConfig]["endpoint_url"]
  sparqlQuery=configFile[rowDataConfig]["query"]
  prefixes=""
  parameters=configFile[rowDataConfig]["parameters"]

  if(parameters.length>0){
    parameters=get_parameters(parameters)
    for (i = 0; i < parameters.length; ++i) { 
      sparqlQuery=sparqlQuery.replace("PARAMETER"+(i+2).toString(), node[parameters[i]]);
    }  
  }
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true       }; 
  $.ajax(settings).then  (function( _data ) {
    results = _data.results.bindings;
    page=results[0]["article"]["value"]
    if(d3.select("#modalGraph")){
      d3.select("#modalGraph").remove()
    }
    var div=document.createElement("div")
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    document.getElementsByClassName("modal-content2")[0].appendChild(div)
    iframe=d3.select("#modalGraph").append("iframe")
    .attr("src",page)
      .style("width", "100%")
      .style("height","100%");
    d3.select(".modal-header2 h2").remove()
    modalHeader2=document.getElementsByClassName("modal-header2")[0]
    modalHeader2.classList.add("mb-4");
    var h2=document.createElement("h2")
    h2.className="text-lg font-medium text-gray-900"
    h2.innerHTML = "Wikipedia Page"

    modalHeader2.appendChild(h2);
    modal2=document.getElementById("myModal2")
    modal2.style.display = "block";
    $('#myModal2').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal2").draggable()
  })
}

// Get the modal
var modal = document.getElementById("myModal");

var span = document.getElementsByClassName("close")[0];

////console.log(span)

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  ////console.log("entra")
  //modal.style.display = "none";
  $("#myModal").removeClass("translate-x-0")
  $("#myModal").addClass("translate-x-full")
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var modal2 = document.getElementById("myModal2");

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close2")[0];


// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  //modal2.style.display = "none";
  $("#myModal2").removeClass("translate-x-0")
  $("#myModal2").addClass("translate-x-full")
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}

function downloadData(element){
  
  var nodes = [],row2,classIndex,hierarchy,lastHierarchy,row={};
  root=networkGraph.treeData.filter(function(item) {
    if(item[item["class"]+"_uri"]!=undefined){
      return item[item["class"]+"_uri"] == element[element["class"]+"_uri"]
    }else{
      return item[item["class"]+"_code"] == element[element["class"]+"_code"]
    }
    
  })[0]

  for (i = 0; i < nodesClasses.length; ++i) { 
    if(nodesClasses[i]==root["class"]){
      classIndex=i
    }
  }  
  hierarchy=nodesClasses.slice(classIndex, nodesClasses.length);

  lastHierarchy=hierarchy[hierarchy.length-1]

  if (root.children){
    root.children.forEach(function(r){
      row={}
      row[root["class"]]=root["value"]
      if(root[root["class"]+"_uri"]!=undefined){
        row[root["class"]+"_uri"]=root[root["class"]+"_uri"]
      }else{
        row[root["class"]+"_code"]=root[root["class"]+"_code"]
      }
      recurse(r);
      nodes.push(row)
    })
  }else if (root._children){
    root._children.forEach(function(r){
      row={}
      row[root["class"]]=root["value"]
      if(root[root["class"]+"_uri"]!=undefined){
        row[root["class"]+"_uri"]=root[root["class"]+"_uri"]
      }else{
        row[root["class"]+"_code"]=root[root["class"]+"_code"]
      }
      recurse(r);
      nodes.push(row)
    })
  }

  download(nodes, 'testDownload.csv', 'text/csv;encoding:utf-8');
  function recurse(node) {
    var i=0
    row[node["class"]]=node["value"]
    if(node[node["class"]+"_uri"]!=undefined){
      row[node["class"]+"_uri"]=node[node["class"]+"_uri"]
    }else{
      row[node["class"]+"_code"]=node[node["class"]+"_code"]
    }
    if (node["class"]==lastHierarchy){
      nodes.push(row)
      row={ ...row2};
    }else{
      row2={ ...row };
    }
    if(node.children){
        node.children.forEach(function(c){
          recurse(c)
      });     
    }else if (node._children){
        node._children.forEach(function(c){
          recurse(c)
        });
    }
  }
  
}
function downloadQuery(){
  execQueries.forEach(function(q){
    download([{"query":q}], 'testQuery.csv', 'text/csv;encoding:utf-8');       
  })
}
function getTooltipNode(tooltip,nodeClass){
  var tooltipNode={}
  if(tooltip!=""){
    tooltip.forEach(function(k){
      if(k["property"].split("_")[0]==nodeClass){
        tooltipNode[k["property"]]=k["tooltip_text"]
      }
    })
  }
  return tooltipNode
}
function get_parameters(parameters){
  var temp=[]
  parameters.forEach(function(d){
    temp.push(d["property"])
  })
  return temp
}

//ADD connect with classes in basic mode
function checkConfigFileNode(result){
  if(result["o"].type=="uri"){
    //////////////////////////////////////console.log(result)
    //////////////////////////////////////console.log(configFile)
  }
}
function expertMode(){
  if($("#flyoutMenu").hasClass("opacity-100")){
      $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
      $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  }
  $("#graph-area").addClass("hidden")
  $("#form-container").removeClass("hidden")
  $("#landing-img").addClass("hidden")
  $("#landing-text").addClass("hidden")
}
function basicMode(){
  ////console.log("basicMode")
  ////console.log($("#flyoutMenu").attr("class"))
  ////console.log($("#flyoutMenu").hasClass("opacity-0"))
  if($("#flyoutMenu").hasClass("opacity-0")){
      $("#flyoutMenu").addClass("transition ease-out duration-200")
      $("#flyoutMenu").removeClass("hidden opacity-0 translate-y-1")
      $("#flyoutMenu").addClass("opacity-100 translate-y-0")
  }else{
      changeCollectionOptions("eu_vocabularies")
      $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
      $("#flyoutMenu").addClass("hidden opacity-0 translate-y-1")
  }
  
}
/* function changeBasicGraph(option){
  ////console.log(option)
  ////console.log($(option).find( "#optionMain" ).text().trim())
  
} */
function changeCollectionOptions(collection){
  var newCollection,oldCollection;
  ////console.log(collection)
  ////console.log(configFile)
  ////console.log($("#"+collection))
  ////console.log($("#"+collection).find(".bg-transparent"))
  ////console.log($("#"+collection).find(".bg-transparent").length)
  ////console.log($("#tabs-sections").find("nav").find("bg-blue-500"))
  oldCollection=$("#tabs-sections").find(".bg-blue-500")
  
  ////console.log(oldCollection)
  oldCollection.removeClass("bg-blue-500")
  oldCollection.addClass("bg-transparent")
  oldCollection.parent().removeClass("text-gray-900")
  oldCollection.parent().addClass("text-gray-500")

  if($("#"+collection).find(".bg-transparent").length==1){
      newCollection=$("#"+collection).find(".bg-transparent")
      newCollection.removeClass("bg-transparent")
      newCollection.addClass("bg-blue-500")
      newCollection.parent().addClass("text-gray-900")
      newCollection.parent().removeClass("text-gray-500")
  }
  optionsMenu=configFile.filter(d=>d.collection==collection)
  ////console.log(optionsMenu)
  appendHtmlOptions(optionsMenu)
  //////console.log(optionsMenuHtml)
}
function appendHtmlOptions(optionsMenu){
  $("#options-menu").find("a").remove()
  optionsMenu.forEach(element => {
      ////console.log(element)
      //optionsMenu=dataConfig.filter(d=>d.collection=="EU Vocabularies")
      //htmlObject = document.createElement(data)
      //htmlObject.innerHTML = data;
      html=optionsMenuHtml.replace("textTitle",element.option.trim()).replace("textComment",element.option_text.trim())
      //data.replace("textComment",element.option_text)
      $("#options-menu").append($(html))
/*                     $.get("optionMainMenu.html", function (data) {
          //$("#appendToThis").append(data);
          ////console.log(data)
          ////console.log(typeof(data))
      }); */
/*                         $("#options-menu").load("optionMainMenu.html", function(responseTxt, statusTxt, jqXHR){
          if(statusTxt == "error"){
              alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
          }
      }) */
  });
}