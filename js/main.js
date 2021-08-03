
var nodes=[],links=[],data={},networkGraph,configFile=null,configFileExp=null,dataInstances,allDataModel,dataInstancesRessourceLegal,allData_at,allData_classSumLeg,nodesClasses,colorScale,nodesSel=[],execQueries=[],nodesClassesShow,nodesClassesCorrespondence,filesIcons,zoomScale=1,zoomY=0,zoomX=0,colorCorrespondence={};

  function dataViz(){
    var rowDataConfig;
          d3.tsv("txt/config_basicMode.txt",function(dataConfig){
            d3.tsv("txt/graph_icons.txt",function(dataIcons){
              filesIcons=dataIcons;
              rowDataConfig=fillDropDown(dataConfig)
              configFile=dataConfig
              buildBasicGraph(rowDataConfig)
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
  
  function buildDataBasic(results,properties,hierarchy,classes,configClasses,element){
    var nodes=[],options=[],optionNode="",procNode=[],treeData=[],root,position=[],value,tooltip=[],classTooltip;
    hierarchy=getHierarchy(hierarchy)
    if(element==undefined){
      nodesClasses=hierarchy
      nodesClassesCorrespondence=getClassesShow(classes)
      nodesClassesShow=Object.values(nodesClassesCorrespondence)
      //////console.log(hierarchy)
      classTooltip=hierarchy[0]
    }else{
      //////console.log(element)
      //////console.log(nodesClassesCorrespondence[element["class"]])
      classTooltip=nodesClassesCorrespondence[element["class"]]
    }
    
    properties=getProperties(properties)
    tooltip=getTooltip(classTooltip)
    ////console.log(tooltip)
    //////////////console.log(results)
    ////////////////////////////////////console.log(hierarchy[0])
    root=results[0][hierarchy[0]]["value"]
    results.forEach(function(r){
      //////////////////////////////////////////////console.log(r)
      for (i = 0; i < hierarchy.length-1; ++i) {    
        //////////console.log(hierarchy[i])
        if((!procNode[i])||(procNode[i]!=r[hierarchy[i]].value)){  
          if(element!=undefined){
            node=element
          }else{
            node={"id":genRandomString(),"value":r[hierarchy[i]].value,"shape":1,"class":hierarchy[i]}
          }
          //////////////////////////////////console.log(node)
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
          ////console.log(node)
          nodes.push(node)
          ////////////////////////////console.log(node)
          //////////////////////////////////////////////console.log(position[i-1])
          if(position[i-1]){
            ////////////////////////////////////////console.log(node)
            treeData[position[i-1]-1]["children"].push(node)
          }
          if(i!=(hierarchy.length-1)){
            ////////////////////////////////////////console.log(node)
            node["children"]=[]
            position[i]=treeData.push(node)
          }
          procNode[i]=node.value
        }
        
      } 
      if (r[hierarchy[hierarchy.length-1]]!=undefined){
        ////////////////////////////////////////console.log(r[hierarchy[hierarchy.length-1]])
        value=r[hierarchy[hierarchy.length-1]].value
        node={"id":genRandomString(),"value":value,"shape":1,"class":hierarchy[hierarchy.length-1]}
        //////////////////////////////////console.log(node)
        if(properties[hierarchy[hierarchy.length-1]]){
              properties[hierarchy[hierarchy.length-1]].forEach(function(k){
                if(r[k]==undefined){
                  node[k]=""
                }else{
                  node[k]=r[k].value
                }              
              })
        //}else{
        }
        //tooltip=getTooltip(hierarchy[i])
        //////console.log(hierarchy)
        //////console.log(tooltip)
        node["tooltip"]=getTooltipNode(tooltip,node["class"])
        ////console.log(node)
        nodes.push(node)
        ////////////////////////////////////////////console.log(nodes)
        treeData[position[position.length-1]-1]["children"].push(node)
        //////////////////////////////console.log(node)
        ////////////////////////////////////////////console.log(position[position.length-1]-1)
        ////////////////////////////////////////////console.log(treeData[position[position.length-1]-1]["children"])
      }
      })
      ////////////////////////////////////////////console.log(treeData)
      flatData=flatten(treeData)
      //////////////////////////////////////////console.log(flatData)
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
                links.push({"source": node.id, "target": c.id,"id":(removeChars(node.id)+"_"+removeChars(c.id))})
                i+=1;
              }
              recurse(c)
            }
          });
        } 
      }
      if(!node["hidden"]){
/*         if (node.children){
          node.children.forEach(function(c){
              position=links.indexOf(links.filter(function(item) {
                return ((item.source == node.id)&&(item.target == c.id))
              })[0])
              if(position==-1){
                links.push({"source": node.id, "target": c.id,"id":(removeChars(node.id)+"_"+removeChars(c.id))})
                i+=1;
              }
              recurse(c)
          });
        }  */
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
    if((configFile[i]["CLASS"]==data["class"])&&(configFile[i]["TYPE"]=="TIMELINE")){
      rowDataConfig=i
      break;
    }
  }
  node=data
  url=configFile[rowDataConfig]["URL"]
  sparqlQuery=configFile[rowDataConfig]["QUERY"]
  prefixes=""
  do{
    if(node["class"]!=undefined){
      sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_code"]); 
    }else{
      sparqlQuery=sparqlQuery.replace("PARAMETER", node);
    }
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

    results = await runSparlqQuery(settings)
    if(node["class"]!=undefined){
      sparqlQuery=sparqlQuery.replace(node[node["class"]+"_code"],"PARAMETER"); 
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
  modal2=document.getElementById("myModal2")
  modal2.style.display = "block";
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
async function getIterData(property){
  var nodes = [], links=[],number,children=0;
  async function recurse(node) {
    var i=0
    if (node.children){
      node.children.forEach(function(c){
          position=links.indexOf(links.filter(function(item) {
            return ((item.source == node.id)&&(item.target == c.id))
          })[0])
          if(position==-1){
            links.push({"source": node.id, "target": c.id,"id":(removeChars(node.id)+"_"+removeChars(c.id))})
            i+=1;
          }
          recurse(c)
      });
    } 
    
  }
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["CLASS"]==data["class"])&&(configFile[i]["TYPE"]=="ITERATION")){
      rowDataConfig=i
      break;
    }
  }
  root.forEach(function(r){
    recurse(r);
  })

  return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
}

function showWikipediaPage(data){
  var rowDataConfig,results,node,page,parameters,parameterTemp="";
  var modal=document.getElementById("myModal")
  modal.style.display = "none";
  //modal2.style.display = "none";
  ////////////////console.log(nodesClassesCorrespondence[data["class"]])
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["CLASS"]==nodesClassesCorrespondence[data["class"]])&&(configFile[i]["TYPE"]=="WEBPAGE")){
      rowDataConfig=i
      break;
    }
  }
  ////////////////console.log(rowDataConfig)
  node=data
  url=configFile[rowDataConfig]["URL"]
  sparqlQuery=configFile[rowDataConfig]["QUERY"]
  prefixes=""
  //////////////////console.log(rowDataConfig)
  ////////////////////console.log(sparqlQuery)
  //////////////////console.log(configFile[rowDataConfig])
  //parameter=node[configFile[rowDataConfig]["PARAMETERS"]]
  parameters=configFile[rowDataConfig]["PARAMETERS"]
  ////////////////console.log(parameters)
  if(parameters!=""){
    parameters=parameters.split(";")
    for (i = 0; i < parameters.length; ++i) { 
      ////////////////console.log(node)
      sparqlQuery=sparqlQuery.replace("PARAMETER"+(i+2).toString(), node[parameters[i]]);
    }  
  }
  //sparqlQuery=sparqlQuery.replace("PARAMETER",parameter);
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true       }; 
  ////////////////console.log(sparqlQuery)
  $.ajax(settings).then  (function( _data ) {
    results = _data.results.bindings;
    page=results[0]["article"]["value"]
    d3.select("#timelineGraph iframe").remove()
    iframe=d3.select("#timelineGraph").append("iframe")
    .attr("src",page)
      .style("width", "100%")
      .style("height","100%");
    d3.select(".modal-header2")
      .text(function(){
          return "Wikipedia Page";
      })
    modal2=document.getElementById("myModal2")
    modal2.style.display = "block";
    $('#myModal2').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal2").draggable()
  })
}
async function buildBasicGraph(rowDataConfig,node){
  var sparqlQuery,queryUrl, hierarchy, parameters,properties,options,prefixes,configClasses,classes,legendWidth,legendElements,legendElPosition=[];

  url=configFile[rowDataConfig]["URL"]
  sparqlQuery=configFile[rowDataConfig]["QUERY"]
  hierarchy=configFile[rowDataConfig]["HIERARCHY"]
  properties=configFile[rowDataConfig]["PROPERTIES"]
  options=configFile[rowDataConfig]["OPTION"]
  classes=configFile[rowDataConfig]["CLASSES"]
  parameters=configFile[rowDataConfig]["PARAMETERS"]
  filters=configFile[rowDataConfig]["FILTERS"]
  tooltip=configFile[rowDataConfig]["TOOLTIP"]

  ////////////////////////////////////////////////console.log(configFile)
  //////////////////////////////////////console.log(configFile)
  
  execQueries.push(sparqlQuery)
  configClasses = configFile.map(function(d) {
    return {
      class:d.CLASS,
      option:d.OPTION,
      option_text:d.OPTION_TEXT
    };
    })
  prefixes=""
  //When node is not undefined is because we call the function from a bubble as root and the Sparql Query has a PARAMETER
  if(node!=undefined){
    if(parameters!=""){
      parameters=parameters.split(";")
      for (i = 0; i < parameters.length; ++i) { 
        ////////////////////////////////////console.log(node)
        sparqlQuery=sparqlQuery.replace("PARAMETER"+(i+2).toString(), node[parameters[i]]);
      }  
      ////////////////////////////////////console.log(node["class"])
      if(node["class"]=="corporateBody"){
        ////////////////////////////////////console.log("node class corporateBody")
        sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]);
      }else{
        sparqlQuery=sparqlQuery.replace("PARAMETER", node["value"]);
      }
    }else{
      sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]);
    }
    nodesClassesCorrespondence=Object.assign(nodesClassesCorrespondence, getClassesShow(classes));
    nodesClassesShow=Array.from(new Set(nodesClassesShow.concat(Object.values(getClassesShow(classes)))))
  }
  //////////////console.log(sparqlQuery)
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  ////////////////////////////////////////////////////console.log(sparqlQuery)
  await $.ajax(settings).then  (function( _data ) {
    var results = _data.results.bindings;
    //Get new branch
    data=buildDataBasic(results,properties,hierarchy,classes,configClasses,node)
    //////////////////////////////////////////console.log(data)
    if((results.length>0)&(filters!="")){
      addFilters(filters,data)
    }
    if(node==undefined){
      //d3.select(".graph").remove()
      d3.selectAll("svg").remove()
      forces = {
        center: {
            x: 0.5,
            y: 0.3
        },
        charge: {
            enabled: true,
            strength: -200,
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
      //////////////////////////////////////////////////////////console.log(data)
      networkGraph = new NetworkGraph("#networkGraph", data,forces);
      collapse()
    }else{
      console.log(nodesClassesShow)
      console.log(colorScale.domain())
      var dif=differenceArrays(nodesClassesShow,colorScale.domain())
      console.log(dif)
      fillLegend(dif,true)
/*       networkGraph.colorScale.domain(nodesClassesShow)
 *//*       networkGraph.legendOrdinal
      .scale(networkGraph.colorScale);

      networkGraph.legend
      .call(networkGraph.legendOrdinal);
      legendWidth=d3.select(".legendOrdinal").attr("width")
      
      if(d3.select(".legendOrdinal").selectAll(".cell").nodes().length>6){
        d3.select(".legendOrdinal").selectAll(".cell").nodes().slice(0,7).forEach(function(d){
          legendElPosition.push(d.getAttribute("transform").substring(d.getAttribute("transform").lastIndexOf("(") + 1,d.getAttribute("transform").lastIndexOf(",")))
        })
        legendElements=d3.select(".legendOrdinal").selectAll(".cell").nodes().slice(6,)
        legendElements.forEach(function(d,i){
          d.setAttribute("transform", "translate("+legendElPosition[i]+",70)")
        })
      } */
      
      
      networkGraph.treeData=networkGraph.treeData.concat(data.treeData)
      ////////////////////////////////////////console.log(networkGraph.treeData)
      networkGraph.data=flatten(networkGraph.treeData).flatData
      ////////////////////////////////////////console.log(networkGraph.data)
      networkGraph.initializeSimulation();
      networkGraph.dataJoinGraph()
      networkGraph.enterGraph()
      networkGraph.initializeSimulation();
      networkGraph.dataJoinGraph()
      networkGraph.exitGraph()
    }
    
  })
  //////////////////////console.log(networkGraph.data)
}

// Get the modal
var modal = document.getElementById("myModal");

var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
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
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}

function downloadData(element){
  
  var nodes = [],row2,classIndex,hierarchy,lastHierarchy,row={};
  //////////////////console.log(element)
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
  ////console.log(tooltip)
  ////console.log(nodeClass)
  if(tooltip!=""){
    tooltip=tooltip.split(";")
    tooltip.forEach(function(k){
      if(k.split("-")[0].split("_")[0]==nodeClass){
        tooltipNode[k.split("-")[0]]=k.split("-")[1]
      }
    })
  }
  return tooltipNode
}
