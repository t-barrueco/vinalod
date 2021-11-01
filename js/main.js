
var nodes=[],links=[],data={},networkGraph,configFile=null,configFileExp=null,dataInstances,allDataModel,dataInstancesRessourceLegal,allData_at,allData_classSumLeg,nodesClasses,colorScale,nodesSelSources=[],nodesSelTarget=[],execQueries=[],nodesClassesShow,nodesClassesCorrespondence,filesIcons,zoomScale=1,zoomY=0,zoomX=0,colorCorrespondence={},classFilterHist=[],propertiesFilterHist=[],graphHistory=[],filtersInGraph=[],filtersList=[],classesFilterList=[];
  //window.onclick = function(event){
    /* if(!(event.target.className.baseVal=="circleClass")){
        d3.selectAll('circle').style('fill', function(d) {
        return d.color;
         })
    } */
    ////////////////////////////////////////////////////console.log("click window")
  //}
  //d3.select("svg").on("click",function(){
    ////////////////////////////////////////////////////console.log("click outside")
  //})
  function dataViz(){
    var rowDataConfig;
          d3.json("../config_vinalod/config_basicMode.json",function(dataConfig){
            //d3.json("../config_vinalod/config_basicMode_notTree.json",function(dataConfig_notTree){
              d3.tsv("txt/graph_icons.txt",function(dataIcons){
                filesIcons=dataIcons;
                ////////////////////////////////////////////////////////////console.log(dataConfig)
                rowDataConfig=fillDropDown(dataConfig)
                configFile=dataConfig
                //configFileNotTree=dataConfig_notTree
                
                buildBasicGraph(rowDataConfig)
              })
            //})
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
  
  function buildDataBasic(results,properties,hierarchy,classes,configClasses,element,option_text){
    var nodes=[],options=[],optionNode="",procNode=[],treeData=[],root,position=[],value,tooltip=[],classTooltip,uri;
    hierarchy=get_hierarchy(hierarchy)
    //////////////////////////////////////////////////////////////////console.log(hierarchy)
    if(element==undefined){
      nodesClasses=hierarchy
      nodesClassesCorrespondence=getClassesShow(classes)
      nodesClassesShow=Object.values(nodesClassesCorrespondence)
      ////////////////////////////////////////////////////////////////////////////////////////////console.log(hierarchy)
      classTooltip=hierarchy[0]
    }else{
      ////////////////////////////////////////////////////////////////////////////////////////////console.log(element)
      ////////////////////////////////////////////////////////////////////////////////////////////console.log(nodesClassesCorrespondence[element["class"]])
      classTooltip=nodesClassesCorrespondence[element["class"]]
    }
    ////////////////////////////////////////////////////////////////////console.log(hierarchy)
    properties=get_properties(properties_full)
    //property_names=get_property_names(properties_full)
    tooltip=getTooltip(classTooltip,option_text)
    ////////////////////////////////////////////////////////////////////console.log(tooltip)
    ////////////////////////////////console.log(results)
    ////////////////////////////////console.log(hierarchy)
    //////////////////console.log(properties)
    ////////////////console.log(results)
    ////////////////console.log(hierarchy[0])
    root=results[0][hierarchy[0]]["value"]
    results.forEach(function(r){
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(r)
      for (i = 0; i < hierarchy.length-1; ++i) {    
        ////////////////////////////////////////////////////////////////////////////////////////////////console.log(hierarchy[i])
        if((!procNode[i])||(procNode[i]!=r[hierarchy[i]].value)){  
          if(element!=undefined){
            node=element
          }else{
            ////////////////////console.log(r)
            ////////////////////console.log("value:      "+r[hierarchy[i]].value)
            node={"id":genRandomString(),"value":r[hierarchy[i]].value,"shape":1,"class":hierarchy[i]}
          }
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
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
          //////////////////////////////////////////////////////////////////////////////////////////console.log(node)
          nodes.push(node)
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(position[i-1])
          if(position[i-1]){
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
            treeData[position[i-1]-1]["children"].push(node)
          }
          if(i!=(hierarchy.length-1)){
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
            node["children"]=[]
            position[i]=treeData.push(node)
          }
          procNode[i]=node.value
        }
        
      } 
      if (r[hierarchy[hierarchy.length-1]]!=undefined){
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(r[hierarchy[hierarchy.length-1]])
        value=r[hierarchy[hierarchy.length-1]].value
        //////////////////////console.log(r)
        //////////////////////console.log("value:      "+r[hierarchy[i]].value)
        node={"id":genRandomString(),"value":value,"shape":1,"class":hierarchy[hierarchy.length-1]}
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
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
        ////////////////////////////////////////////////////////////////////////////////////////////console.log(hierarchy)
        ////////////////////////////////////////////////////////////////////////////////////////////console.log(tooltip)
        node["tooltip"]=getTooltipNode(tooltip,node["class"])
        //////////////////////////////////////////////////////////////////////////////////////////console.log(node)
        nodes.push(node)
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(nodes)
        treeData[position[position.length-1]-1]["children"].push(node)
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(position[position.length-1]-1)
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(treeData[position[position.length-1]-1]["children"])
      }
      })
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(treeData)
      flatData=flatten(treeData)
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(flatData)
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
async function showPdf(node,sparqlQuery,url){
  //////////////////////////////////////////////////////////////console.log("entra")
  //url=configFile[rowDataConfig]["endpoint_url"]
  //sparqlQuery=configFile[rowDataConfig]["query"]
  prefixes=""
  ////////////////////////////////////////////////////////////console.log(sparqlQuery)
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  results = await runSparlqQuery(settings)
  ////////////////////////////////////////////////////////////console.log(results)
  var pdf=results[0]["item"]["value"]
  ////////////////////////////////////////////////////////////console.log(node)
  modal2=document.getElementById("myModal2")
  modal2.style.display = "block";
  d3.select(".modal-header2 h2").remove()
  modalHeader2=document.getElementsByClassName("modal-header2")[0]
  ////////////////////////////////////////////////////////////console.log(modalHeader2)
  //modalHeader2.className="mb-4"
  modalHeader2.classList.add("mb-4");
  var h2=document.createElement("h2")
  h2.className="text-lg font-medium text-gray-900"
  //h2.innerHTML = node["value"]
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
  ////////////////////////////////////////////////////console.log(document.getElementsByClassName("modal-content2"))
  document.getElementsByClassName("modal-content2")[0].appendChild(div)
  PDFObject.embed(pdf, "#modalGraph");
  /* d3.select("#modalGraph").append("script")
  .attr("type",'text/javascript')
  .attr("src","https://op.europa.eu/o/opportal-widgets/js/widget/widgetload.js")

  var s = document.createElement('script');
  s.type = 'application/json';
  var code = '{"portalURL": "https://op.europa.eu","uuid": "portal2012a5591932400446fb8684a60a25a00a50","widgetType": "5","cellarId": "dd7623b2-a4f1-11e7-837e-01aa75ed71a1"};';
  s.appendChild(document.createTextNode(code));
  document.getElementById("modalGraph").appendChild(s) */

  //PDFObject.embed("/pdf/sample-3pp.pdf", "#example1");
/*   <script type='text/javascript' src='https://op.europa.eu/o/opportal-widgets/js/widget/widgetload.js'></script>
<script type='application/json'>
{
"portalURL": "https://op.europa.eu",
"uuid": "portal2012a5591932400446fb8684a60a25a00a50",
"widgetType": "5",
"cellarId": "dd7623b2-a4f1-11e7-837e-01aa75ed71a1"
}
</script> */
}
async function showTable(node,sparqlQuery,columns,column_names){
  var rowDataConfig,results,data=[],modalHeader2;
  ////////////////////////////////////////////////////////////console.log(configFile)
  ////////////////////////////////////////////////////////////console.log(columns)
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["type"]=="TABLE")){
      rowDataConfig=i
      break;
    }
  }
  //////////////////////////////////////////////////////////////console.log(configFile[rowDataConfig])
  url=configFile[rowDataConfig]["endpoint_url"]
  //sparqlQuery=configFile[rowDataConfig]["query"]
  prefixes=""
  ////////////////////////////////////////////////////////////console.log(sparqlQuery)
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  results = await runSparlqQuery(settings)
  ////////////////////////////////////////////////////////////console.log(results)
  ////////////////////////////////////////////////////////////console.log(node)
  //data=transformDataTable(results)
  table(results,columns,column_names)
  modal2=document.getElementById("myModal2")

/*   <h2 class="text-lg font-medium text-gray-900">
    Projects
  </h2>
  <p class="mt-1 text-sm text-gray-500">
    You haven’t created a project yet. Get started by selecting a template or start from an empty project.
  </p>
 */
  d3.select(".modal-header2 h2").remove()
  modalHeader2=document.getElementsByClassName("modal-header2")[0]
  ////////////////////////////////////////////////////////////console.log(modalHeader2)
  //modalHeader2.className="mb-4"
  var h2=document.createElement("h2")
  h2.className="text-lg font-medium text-gray-900"
  h2.innerHTML = node["value"]
  modalHeader2.appendChild(h2);

  /* d3.select(".modal-header2")
    //.style("background-color","blue")

    .text(function(){
        ////////////////////////////////////////////////////////////console.log(node)
        return node["value"];
    }) */
  modal2.style.display = "block";
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
/* function transformDataTable(data){
  ////////////////////////////////////////////////////////////console.log(data)
  ////////////////////////////////////////////////////////////console.log(Object.values(data[0]));
  ////////////////////////////////////////////////////////////console.log(Object.keys(data[0]));
} */
function table(data,columns,column_names){
  var cellContent;
  ////////////////////////////////////////////////////////////console.log(data)
  ////////////////////////////////////////////////////////////console.log(columns)
  ////////////////////////////////////////////////////////////console.log(column_names)

  //d3.select("#modalGraph div").remove()
  if(d3.select("#modalGraph")){
    d3.select("#modalGraph").remove()
  }
  var div=document.createElement("div")
  div.setAttribute("id","modalGraph")
  div.setAttribute("style","overflow: auto")
  ////////////////////////////////////////////////////console.log(document.getElementsByClassName("modal-content2"))
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

  
  //Add the header row.
  //var row = table.insertRow(-1);

  header = table.createTHead();
  header.className="bg-gray-50"
  var row = header.insertRow(0);    
  //var columns=Object.keys(data[0])
/* // Insert a new cell (<td>) at the first position of the "new" <tr> element:
var cell = row.insertCell(0);

// Add some bold text in the new cell:
cell.innerHTML = "<b>This is a table header</b>" */


  for (var i = columns.length-1; i >= 0; i--) {
      var headerCell = row.insertCell(0);
      //headerCell.innerHTML = customers[0][i];
      headerCell.setAttribute("scope", "col");
      headerCell.setAttribute("class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
      if(Object.keys(column_names).includes(columns[i])){
        headerCell.innerHTML = column_names[columns[i]]
      }else{
        headerCell.innerHTML = nodesClassesCorrespondence[columns[i]]
      }
      
      //row.appendChild(headerCell);
  }

  //var customers=4
  //Add the data rows.

  body=table.createTBody();
/*   row = body.insertRow();
  cell = row.insertCell();
  text = document.createTextNode("test row");
  cell.appendChild(text);
  cell = row.insertCell();
  text = document.createTextNode("test row");
  cell.appendChild(text);
  cell = row.insertCell();
  text = document.createTextNode("test row");
  cell.appendChild(text); */
  ////////////////////////////////////////////////////////////console.log(data)
  for (var j = 0; j < data.length; j++) {
    row = body.insertRow();
    if(j%2==0){
      row.className="bg-white"
    }else{
      row.className="bg-gray-50"
    }
    //row.style.backgroundColor = colorScale(nodesClassesCorrespondence[nodesTable[i]["class"]]); 
    //row.id=nodesTable[i]["id"]
    
/*     for (var i = columns.length-1; i >= 0; i--) {
      cell = row.insertCell();
      text = document.createTextNode(data[j][columns[i]]["value"]);
      cell.appendChild(text);
      //row.appendChild(headerCell);
    } */
    for (var i = 0; i < columns.length; i++) {
      cell = row.insertCell();
      cell.className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
      if(data[j][columns[i]]!=undefined){
        //if (data[j][columns[i]]["value"].slice(-4)==".jpg"){
        if (columns[i].slice(-6)=="_image"){
          cellContent = document.createElement('img'); 
          cellContent.src = data[j][columns[i]]["value"]; 
          cellContent.className="w-12 rounded-full h-14"
        }else{
          cellContent = document.createTextNode(data[j][columns[i]]["value"]);
          //cellContent = document.createTextNode("");
        }
      }else{
        cellContent = document.createTextNode("");
      }
      
      cell.appendChild(cellContent);
      //row.appendChild(headerCell);
    }
   
  }

  ////////////////////////////////////////////////////////////console.log(mainEl)
  mainEl.appendChild(div).appendChild(div2).appendChild(div3).appendChild(div4).appendChild(table);

}
async function showTreegraph(node,sparqlQuery){
  var rowDataConfig,results,dataTreegraph=[];
  //////////////////////////////////////////////////////////////////console.log(configFile)
  //////////////////////////////////////////////////////////////////console.log(node)
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["type"]=="TREEGRAPH")){
      rowDataConfig=i
      break;
    }
  }
  //////////////////////////////////////////////////////////////console.log(configFile[rowDataConfig])
  url=configFile[rowDataConfig]["endpoint_url"]
  //sparqlQuery=configFile[rowDataConfig]["QUERY"]
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
/*       if((configFile[i]["CLASS"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["TYPE"]=="TREEGRAPH")){
        rowDataConfig=i
        break;
      } */
      membership.push({
        "name": data[i]["membership"]["value"],
        //"parent": node["value"],
        "children": [
        {
            "name": data[i]["person"]["value"],
            //"parent": data[i]["membership"]["value"]
        }]})
      //data[i]["membership"]
      //membership ?membership_order ?membership_positionStatus ?person ?person_image
    }
    treeData={//"name":node["value"],
                "name":"Organisation",
                   //"parent":"null",
                  "children":membership}

    return treeData
}
async function showWordcloud(node,sparqlQuery){
  var rowDataConfig,results,dataTreegraph=[];
  //////////////////////////////////////////////////////////////////console.log(configFile)
  //////////////////////////////////////////////////////////////////console.log(node)
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["type"]=="WORDCLOUD")){
      rowDataConfig=i
      break;
    }
  }
  //////////////////////////////////////////////////////////////console.log(configFile[rowDataConfig])
  url=configFile[rowDataConfig]["endpoint_url"]
  //sparqlQuery=configFile[rowDataConfig]["QUERY"]
  prefixes=""

  ////////////////////////////////console.log(sparqlQuery)
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

  results = await runSparlqQuery(settings)
  
  dataWordCloud=transformDataWordCloud(node,results)
  wordCloudGraph(dataWordCloud,node["value"])
  modal2=document.getElementById("myModal2")
  modal2.style.display = "block";
  $('#myModal2').resizable({
    //alsoResize: ".modal-dialog",
    //minHeight: 150
  });
  $("#myModal2").draggable()
}
function transformDataWordCloud(node,data){
  var wordCloudData=[],splittedStr=[]
  for (i = 0; i < data.length; ++i) { 
    //////////////////////////////console.log(data[i]["text"]["value"])
    splittedStr=data[i]["text"]["value"]
    if(splittedStr.includes(".")){
      splittedStr=splittedStr.split(".")[1]
    }
    //wordCloudData.push(data[i]["text"]["value"].split(".")[1].split(" "))
    splittedStr=splittedStr.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(" ")
    wordCloudData.push(splittedStr)
  }
  return wordCloudData.flat()
}
function transformDataTreegraph(node,data){
  var treeData,membership=[]

    for (i = 0; i < data.length; ++i) { 
/*       if((configFile[i]["CLASS"]==nodesClassesCorrespondence[node["class"]])&&(configFile[i]["TYPE"]=="TREEGRAPH")){
        rowDataConfig=i
        break;
      } */
      membership.push({
        "name": data[i]["membership"]["value"],
        //"parent": node["value"],
        "children": [
        {
            "name": data[i]["person"]["value"],
            //"parent": data[i]["membership"]["value"]
        }]})
      //data[i]["membership"]
      //membership ?membership_order ?membership_positionStatus ?person ?person_image
    }
    treeData={//"name":node["value"],
                "name":"Organisation",
                   //"parent":"null",
                  "children":membership}

    return treeData
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

  ////////////////////////////////////////////////////////////console.log(data)
  //modal2.style.display = "none";
  //////////////////////////////////////////////////////////////////////////////////////////////////////console.log(nodesClassesCorrespondence[data["class"]])
  for (i = 0; i < configFile.length; ++i) { 
    if((configFile[i]["class"]==nodesClassesCorrespondence[data["class"]])&&(configFile[i]["type"]=="WEBPAGE")){
      rowDataConfig=i
      break;
    }
  }
  ////////////////////////////////////////////////////////////console.log(configFile)
  ////////////////////////////////////////////////////////////console.log(rowDataConfig)
  node=data
  url=configFile[rowDataConfig]["endpoint_url"]
  sparqlQuery=configFile[rowDataConfig]["query"]
  prefixes=""
  ////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(rowDataConfig)
  //////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(sparqlQuery)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(configFile[rowDataConfig])
  //parameter=node[configFile[rowDataConfig]["PARAMETERS"]]
  parameters=configFile[rowDataConfig]["parameters"]
  ////////////////////////////////////////////////////////////console.log(parameters)
  if(parameters.length>0){
    parameters=get_parameters(parameters)
    for (i = 0; i < parameters.length; ++i) { 
      //////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
      sparqlQuery=sparqlQuery.replace("PARAMETER"+(i+2).toString(), node[parameters[i]]);
    }  
  }
  //sparqlQuery=sparqlQuery.replace("PARAMETER",parameter);
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true       }; 
  //////////////////////////////////console.log(sparqlQuery)
  $.ajax(settings).then  (function( _data ) {
    results = _data.results.bindings;
    page=results[0]["article"]["value"]
/*     d3.select("#modalGraph svg").remove()
    d3.select("#modalGraph iframe").remove() */
    if(d3.select("#modalGraph")){
      d3.select("#modalGraph").remove()
    }
    var div=document.createElement("div")
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    ////////////////////////////////////////////////////console.log(document.getElementsByClassName("modal-content2"))
    document.getElementsByClassName("modal-content2")[0].appendChild(div)
    iframe=d3.select("#modalGraph").append("iframe")
    .attr("src",page)
      .style("width", "100%")
      .style("height","100%");
/*     d3.select(".modal-header2")
      .text(function(){
          return "Wikipedia Page";
      }) */
    d3.select(".modal-header2 h2").remove()
    modalHeader2=document.getElementsByClassName("modal-header2")[0]
    ////////////////////////////////////////////////////////////console.log(modalHeader2)
    //modalHeader2.className="mb-4"
    modalHeader2.classList.add("mb-4");
    var h2=document.createElement("h2")
    h2.className="text-lg font-medium text-gray-900"
    //h2.innerHTML = node["value"]
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

async function buildBasicGraph(rowDataConfig,node){
  var sparqlQuery,queryUrl, hierarchy, parameters,properties,property_names,options,prefixes,configClasses,classes,option_text,legendWidth,legendElements,legendElPosition=[],graphType,columns;
  //////////////////////////////console.log("entra")
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
  tooltip=configFile[rowDataConfig]["tooltip"]
  columns=configFile[rowDataConfig]["columns"]
  //////////////////////////////////console.log(classes)
  property_names=get_property_names(properties_full)
  //////////////////console.log(configFile[rowDataConfig])
  

  //////////////////////////console.log(options)
  
  //throw new Error("Something went badly wrong!");

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(configFile)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(configFile)
  
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
      //parameters=parameters.split(";")
      parameters=get_parameters(parameters)
      for (i = 0; i < parameters.length; ++i) { 
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node)
        sparqlQuery=sparqlQuery.replace("PARAMETER"+(i+2).toString(), node[parameters[i]]);
      }  
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node["class"])
      //if(node["class"]=="corporateBody"){
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log("node class corporateBody")
        ////////////////console.log(node)
        if((node[node["class"]+"_uri"]!=undefined)&(node[node["class"]+"_uri"]!="")){
          sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]);
        }else{
          sparqlQuery=sparqlQuery.replace("PARAMETER", node["value"]);
        }
      //}else{
      //  sparqlQuery=sparqlQuery.replace("PARAMETER", node["value"]);
      //}
    }else{
      sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]);
    }
    ////////////////////////////console.log(classes)
    nodesClassesCorrespondence=Object.assign(nodesClassesCorrespondence, getClassesShow(classes));
    nodesClassesShow=Array.from(new Set(nodesClassesShow.concat(Object.values(getClassesShow(classes)))))
  }
  //////////////////////////////console.log(graphType)
  ////////////////console.log(sparqlQuery)
  if(graphType=="TREE"){
    ////////////////////////////////console.log(sparqlQuery)
  queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  //console.log(sparqlQuery)
  await $.ajax(settings).then  (function( _data ) {
    var results = _data.results.bindings;
    ////////////////////////////////console.log(results)
    //Get new branch
    graphHistory.push(options)
    //////////////////////////////////////////////////console.log(graphHistory)
    data=buildDataBasic(results,properties,hierarchy,classes,configClasses,node,option_text)
    ////////////////////////////////console.log(data)
    
    if(node==undefined){
      //d3.select(".graph").remove()
      d3.selectAll(".graph").remove()
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
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(data)
      networkGraph = new NetworkGraph("#networkGraph", data,forces,"fromConfig");
      collapse()
    }else{
      //////////////////////////////////////////////////////////////////////////////////////console.log(nodesClassesShow)
      //////////////////////////////////////////////////////////////////////////////////////console.log(colorScale.domain())
      var dif=differenceArrays(nodesClassesShow,colorScale.domain())
/*       var dif=differenceArrays(nodesClassesShow,colorScale.domain())
      ////////////////////////////////////////////////////////////////////////////console.log(dif)
      ////////////////////////////////////////////////////////////////////////////console.log(filters)
      ////////////////////////////////////////////////////////////////////////////console.log(configFile[rowDataConfig])
      fillLegend(dif,true) */
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
      //////////////////////////////////console.log(networkGraph.treeData)
      networkGraph.data=flatten(networkGraph.treeData).flatData
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
      networkGraph.initializeSimulation();
      //if(networkGraph.graphType=="freeGraph"){
      //  //////////////console.log("entra por aquí")
      //  networkGraph.dataJoinFreeGraph()
      //  networkGraph.enterFreeGraph()
      //}else{
        networkGraph.dataJoinGraph()
        networkGraph.enterGraph()
      //}
      
      ////////////////////////////////////////////////////////////////////////console.log(dif)
      ////////////////////////////////////////////////////////////////////////////console.log(filters)
      ////////////////////////////////////////////////////////////////////////////console.log(configFile[rowDataConfig])
      fillLegend(dif,true)
      networkGraph.initializeSimulation();
      //networkGraph.dataJoinGraph()
      if(networkGraph.graphType=="freeGraph"){
        networkGraph.dataJoinFreeGraph()
      }else{
        networkGraph.dataJoinGraph()
      }
      networkGraph.exitGraph()
    }
    if((results.length>0)&(filters!="")){
      //////////////////////////console.log(filters)
      //////////////////////////////////////////////////////////////////////console.log(data)
      //////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
      ////////////////////////console.log("addFilters")
      addFilters(filters,data)
      
      filtersInGraph=filtersInGraph.concat(filters)
      ////////////////////////////////////////////////console.log(filtersInGraph)
    }

  })
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
    ////////////////////////////console.log(sparqlQuery)
    showWordcloud(node,sparqlQuery,columns,property_names)
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(element)
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
  //////////////////////////////////////////////////////////////////////////////////////////console.log(tooltip)
  //////////////////////////////////////////////////////////////////////////////////////////console.log(nodeClass)
  if(tooltip!=""){
    //tooltip=tooltip.split(";")
    //{'property': '', 'tooltip_text': ''}]
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
  //////////////////////////////////////////////////////////////////console.log(parameters)
  parameters.forEach(function(d){
    temp.push(d["property"])
  })
  return temp
}


function checkConfigFileNode(result){
  //////////console.log(result)
  if(result["o"].type=="uri"){
    ////////console.log(result)
    ////////console.log(configFile)
  }
}
/* function getFreeGraphTreeData(results){
  var treeData=[];
  subjectId=genRandomString()
  treeData.push({"id":subjectId,"value":results[0]["s"]["value"],"shape":1,"class":"node","type":results[0]["s"]["type"]})
  results.forEach(function (r){
    objectId=genRandomString()
    nodes.push({"id":objectId,"value":r["o"]["value"],"shape":1,"class":"node","type":r["o"]["type"]})
    links.push({source: subjectId, target: objectId, type: r["p"]["value"]})
  })
  treeData[position[i-1]-1]["children"].push(node)
} */