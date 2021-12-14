var navigation,navigationBasic,navigationFree,sparqlQueryWindow,interval;
$(document).ajaxComplete(function(event,request, settings){
  // Your code here
  
});
$(document).ajaxSend(function(event,request, settings){
  // Your code here
  sparqlQueryWindow=request
});

async function addURLGraph(field){
  var indexRows
  //////////console.log(field)
  d3.selectAll(".classFilter").remove()
  if(document.getElementById("navTable").querySelector('ol')){
    document.getElementById("navTable").querySelector('ol').remove()
  }
  
  fillLegendFreeGraph()
  filtersList=[]
  $("#graph-area").removeClass("hidden")
  $("#form-container").addClass("hidden")
  console.log("add URL Graph")
  indexRows=await checkQueries(field.querySelector('#free-uri').value,field.querySelector('#subject-object').value,"form")
}

function buildTreeData (results,form,node){
  var children=[],treeData=[],nodesIds,id,idParent,idTarget,more_results,menuOption,menuOptionNodes=[],configRow;
  //if(networkGraph){
    //console.log(networkGraph.treeData)
  //}
  console.log(form)
  console.log(results)
  //if(form typeof Element)
  results.forEach(r => {
    //console.log(r)
    if(form["subject-object"]=="s"){
      if(r["o"]["more_results"]){
        more_results=r["o"]["more_results"]
      }else{
        more_results=""
      }
      if(r["o"]["configRow"]){
        configRow=r["o"]["configRow"]
      }else{
        configRow=""
      }
      children.push({"id":genRandomString(),"value":r["o"]["value"],"type":r["o"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"hidden":false,"property":r["p"]["value"],"more_results":more_results,"configRow":configRow,"class":"free"})
    }else if(form["subject-object"]=="o"){
      if(r["s"]["more_results"]){
        more_results=r["s"]["more_results"]
      }else{
        more_results=""
      }
      if(r["s"]["configRow"]){
        configRow=r["s"]["configRow"]
      }else{
        configRow=""
      }
      children.push({"id":genRandomString(),"value":r["s"]["value"],"type":r["s"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"hidden":false,"property":r["p"]["value"],"more_results":more_results,"configRow":configRow,"class":"free"})
    }


  })
  console.log(children)
  if(node!=undefined){
    if(node["menuOption"]){
      console.log("entra en menuOption")
      menuOption=node["menuOption"]+";"+form["url"]+","+form["subject-object"]
      networkGraph.treeData.filter(d=>d.id==node["id"])
      let obj = networkGraph.treeData.find(n=>n.id==node["id"]);
      //console.log(obj)
      if(obj)
        if(obj.children[0].type!="menuOption"){
          menuOptionNodes.push({"id":genRandomString(),"value":node["menuOption"],"type":"menuOption","children":obj.children,"hidden":false,"more_results":"","menuOption":"","uri":obj.value,"class":"free"})
          menuOptionNodes.push({"id":genRandomString(),"value":form["url"]+","+form["subject-object"],"type":"menuOption","children":children,"hidden":false,"more_results":"","menuOption":"","uri":obj.value,"class":"free"})
          obj.children=menuOptionNodes;
        }else{
          obj.children.push({"id":genRandomString(),"value":form["url"]+","+form["subject-object"],"type":"menuOption","children":children,"hidden":false,"more_results":"","menuOption":"","uri":obj.value,"class":"free"})
        }
        
        obj["menuOption"]=menuOption
    }else{
      console.log(node)
      menuOption=node["url"]+","+node["subject-object"]
      treeData=[{"id":node["id"],"value":node["value"],"type":node["type"],"children":children,"hidden":false,"more_results":more_results,"menuOption":menuOption,"configRow":configRow,"class":"free"}]
    }

  }else{
    console.log("else")
    menuOption=form["url"]+","+form["subject-object"]
    treeData=[{"id":genRandomString(),"value":results[0][form["subject-object"]]["value"],"type":results[0][form["subject-object"]]["type"],"children":children,"hidden":false,"more_results":"","menuOption":menuOption,"configRow":configRow,"class":"free"}]
  }
  //console.log(treeData)
  return treeData
}
function flatten_freeGraph(root) {
  var nodes = [], links=[];
  function recurse(node) {
    if(!node["hidden"]){
      position=nodes.indexOf(nodes.filter(function(item) {
        return item.id == node.id
      })[0])
      if(position==-1){
        nodes.push(node)
        position=(nodes.length)-1
      }else{
        nodes[position]["menuOption"]=node["menuOption"]
      }
      if (node.children){
        nodes[position]["number"]=node.children.length
        node.children.forEach(function(c){
          ////////////////console.log(c)
          if(!c["hidden"]){
            position=links.indexOf(links.filter(function(item) {
              return ((item.source == node.id)&&(item.target == c.id))
            })[0])
            if(position==-1){
              links.push({"source": node.id, "target": c.id,"id":(node.id+"_"+c.id),"value":c.property})
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
    ////////////////////console.log(r)
    recurse(r);
  })

  return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
}

async function buildFreeGraph(form,origin,node){
    //////////////////////////console.log(form)
    var sparqlQuery,queryUrl,uri,url,subjectObject;
    var $objectAjax;
    prefixes=""
    console.log(origin)
    console.log(form)
    if(origin=="form"){
      uri=form.querySelector("#uri").innerHTML
      url=form.querySelector("#url").innerHTML
      subjectObject=form.querySelector("#subject-object").innerHTML

      $("#myModal3").hide();
    //}else if(origin=="first"){
    //  uri=form["uri"]
    //  url=form["url"]
    //  subjectObject=form["subject-object"]
    }else if(origin=="bubble"){
      uri=form["uri"]
      url=form["url"]
      if(form["subjectObject"]==undefined){
        subjectObject=form["subject-object"]
      }else{
        subjectObject=form["subjectObject"]
      }
      
   }else{
      uri=form["uri"]
      url=form["url"]
      subjectObject=form["subject-object"]
    }
    form={"uri":uri,"url":url,"subject-object":subjectObject}
    if(subjectObject=="s"){
      sparqlQuery="SELECT distinct ?s ?p ?o (group_concat(distinct ?class;separator=';') as ?classes) WHERE{{ ?s ?p ?o. ?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class} FILTER (?s=<"+uri+">).}"      
    }else{
      sparqlQuery="SELECT distinct ?s ?p ?o (group_concat(distinct ?class;separator=';') as ?classes) WHERE{{ ?s ?p ?o; <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class} FILTER (?o=<"+uri+">).}"      
    }
    
    var fn = function(){
        d3.select("#spin").style("display","none")
        document.getElementById("sparql-timeout").style.display="inline-block"
    };

    interval = setInterval(fn, 8000);
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'   ,
      success: function(data) {
        //do something
        ////////////console.log("SUCCESS")
        
        $objectAjax = null;
      }
    };
    d3.select("#spin-message")
    .text("Waiting for Sparql query")
    
    d3.select("#spin").style("display","inline-flex")
    ////////////console.log(sparqlQuery)
    ////////////////////////////console.log(origin)
    $objectAjax=$.ajax(settings).then  (function( _data ) {
      var results = _data.results.bindings;
        //////console.log(results.filter(d=>d.o.type!="bnode"))
        ////////////console.log("THEN")
        d3.select("#spin").style("display","none")
        results=clusterResults(results,subjectObject)
        return checkClassesBasicGraph(results,subjectObject,node)
    })
    
    .fail(function (jqXHR, textStatus, errorThrown) {
      document.getElementById("sparql-timeout").style.display="inline-block"
    })

    .always(function(jqXHR, textStatus, errorThrown) {
        d3.select("#spin").style("display","none")

    })
    //.success()
    .done(function (data, textStatus, jqXHR) {
      //createGraph()
      ////////////console.log(data)
      ////////////console.log("DONE")
      createGraph(data)
      clearInterval(interval)
      d3.select("#spin").style("display","none")
      document.getElementById("sparql-timeout").style.display="none"
    })
    try{
      await $objectAjax
    }catch(e){
      ////////////////////////////////////console.log(e)
    }
    function createGraph(results){
      if((origin === 'form')|(origin === 'first')){
        ////////////////////////////console.log("if")
        data=getFreeGraphData(results,form)
        d3.selectAll(".graph").remove()
        forces = {
          center: {
              x: 0.5,
              y: 0.3
          },
          charge: {
              enabled: true,
              strength: -800,
              distanceMin: 100,
              distanceMax: 2000
          },
          collide: {
              enabled: true,
              strength: .8,
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
              distance: 300,
              iterations: 1
          }
        }
        networkGraph = new NetworkGraph("#networkGraph", data,forces,"freeGraph");
  
        if(typeof(navigation)!="object"){
          navigation = new navigationPanel("freeGraph",node);
        }else if(navigationPanel.type!="freeGraph"){
          ////////console.log("crea un nuevo objeto navigation")
          navigation = new navigationPanel("freeGraph",node);
        }else{
          ////////console.log("entra en init")
          navigation.init()
        }
        
        addFiltersFreeGraph(uri,data.treeData[0]["id"])
      }else{

        addNodesGraph(results,node,form)
      }
    }
  }
function addNodesGraph(results,node,form){
  links=addFreeGraphData(results,node,form)
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.enterGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.exitGraph()
  networkGraph.zoomOut()
  networkGraph.zoomOut()

}
function dblclickCellContent(cell){
  ////////console.log(type)
  //if(type=="basicGraph"){
  navigation.dblclickCellContent(cell)
  //}else{
  //  navigationFree.dblclickCellContent(cell)
  //}
}
function clickCellContent(cell){
  //if(type=="basicGraph"){
  navigation.clickCellContent(cell)
  //}else{
  //  navigationFree.clickCellContent(cell)
  //}
  
}
function dblclickNav(cell){
  //if(type=="basicGraph"){
  //  navigationBasic.dblclickNav(cell)
  //}else{
    navigation.dblclickNav(cell)
  //}
  
}
function clickNav(cell){
  //if(type=="basicGraph"){
    navigation.clickNav(cell)
  //}else{
  //  navigationFree.clickNav(cell)
  //}
  
}
function getFreeGraphData(results,form){
    var nodes=[],links=[],subjectId,objectId,more_results,classBubble,data,treeData,flattenData;
    //subjectId=genRandomString()

/*     if(subjectObject=="o"){
      if(results[0]["o"]["more_results"]){
        more_results=results[0]["o"]["more_results"]
      }else{
        more_results=""
      }
      if(results[0]["class"]){
        classBubble=results[0]["class"]
      }else{
        classBubble="node"
      }
      nodes.push({"id":subjectId,"value":results[0]["o"]["value"],"shape":1,"class":classBubble,"menuOption":form["url"]+","+form["subject-object"],"type":results[0]["o"]["type"]})
    }else{
      nodes.push({"id":subjectId,"value":results[0]["s"]["value"],"shape":1,"class":classBubble,"menuOption":form["url"]+","+form["subject-object"],"type":results[0]["s"]["type"]})
    }
    
    results.forEach(function (r){
      checkConfigFileNode(r)
      objectId=genRandomString()
      ////////////////////////////////console.log(r)
      if(subjectObject=="o"){
        if(r["s"]["more_results"]){
          more_results=r["s"]["more_results"]
        }else{
          more_results=""
        }
        if(r["class"]){
          classBubble=r["class"]
        }else{
          classBubble="node"
        }
        nodes.push({"id":objectId,"value":r["s"]["value"],"shape":1,"class":classBubble,"type":r["s"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"property":r["p"]["value"],"more_results":more_results})
        links.push({'source': subjectId, 'target': objectId, 'value': r["p"]["value"]})
      }else{
        if(r["o"]["more_results"]){
          more_results=r["o"]["more_results"]
        }else{
          more_results=""
        }
        if(r["class"]){
          classBubble=r["class"]
        }else{
          classBubble="node"
        }
        nodes.push({"id":objectId,"value":r["o"]["value"],"shape":1,"class":classBubble,"type":r["o"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"property":r["p"]["value"],"more_results":more_results})
        links.push({'source': subjectId, 'target': objectId, 'value': r["p"]["value"]})
      }
    }) */
    //var treeData=buildTreeData(results,form,links,nodes)
    console.log("getFreeGraphdata")
    treeData=buildTreeData(results,form)
    flattenData=flatten_freeGraph(treeData)
    data={"flatData":flattenData.flatData,"allData":flattenData.flatData,"treeData":treeData}
    //////////////////////////console.log(data)
    return data
  }
function addFreeGraphData(results,node,form){
    var subjectId,objectId,subjectNode,objectNode,links=[],nodes=[],treeData;
    subjectObject=form["subject-object"]
    console.log("addfreegraphdata")
    treeData=buildTreeData(results,form,node)
    
    if(treeData.length>0){
      flattenData=flatten_freeGraph(treeData)

      ////////////////////console.log(flattenData)
      data={"flatData":flattenData.flatData,"allData":flattenData.flatData,"treeData":treeData}
      ////////////////////console.log(data)
  
      networkGraph.treeData=networkGraph.treeData.concat(treeData)
    }

    networkGraph.data=flatten_freeGraph(networkGraph.treeData).flatData
    networkGraph.allData.nodes=networkGraph.data.nodes
    networkGraph.allData.links=networkGraph.data.links

    if(treeData.length>0){
      return data.flatData.links;
    }else{
      return networkGraph.data.links;
    }
    
  }

  function getTooltipTextFreeGraph(d){
    var menuOptions,sparqlEndpoint="",position="";
    ////////////console.log(d)
    ////////////////////console.log(d.type)
    ////////////////////console.log(d["type"])
    if(d.type=="menuOption"){
      menuOptions=d.value.split(",")
      var text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-2 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Option values
          </h3>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              URI
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + d.uri + `
              </dd>
            </div>
            <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              Sparql Endpoint
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + menuOptions[0] + `
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              Position
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + menuOptions[1] + `
              </dd>
            </div>
          </dl>
        </div>
      </div>`;
    }else if(typeof(d)=="string"){
      var text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
          ` + d + `
          </h3>
        </div>
        </div>`;
    }else{
      if(d.menuOption!=undefined){
        if(d.menuOption.split(";").length==1){
          sparqlEndpoint=d.menuOption.split(",")[0]
          position=d.menuOption.split(",")[1]
        }else{
          sparqlEndpoint="several"
        }
      }
      if(d.property){
        var text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-2 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Node values
            </h3>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Property
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ` + d.property + `
                </dd>
              </div>
              <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Name
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ` + d.value + `
                </dd>
              </div>
            </dl>
          </div>
        </div>`;
        getOptionChosen()
      }else{
        var text = `<div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-2 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Node values
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + d.value + `
                  </dd>
                </div>
              </dl>
            </div>
          </div>`;
        getOptionChosen()
      }
      function getOptionChosen(){
        if(d.menuOption!=undefined){
          if(sparqlEndpoint!="several"){
            text=text+  `
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-2 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Option chosen
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Sparlq Endpoint
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + sparqlEndpoint + `
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Position
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + position + `
                  </dd>
                </div>
              </dl>
            </div>
          </div>`
          }else{
            text=text+ `
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
              Several options displayed in graph. Click on each option to see results values
              </h3>
            </div>
            </div>`
          }
        }
      }
    }

    return text;    
  }
  async function checkQueries(element,subjectObject,origin,pageX,pageY){
    var msgNoResults,node,menuOption;
    console.log("check queries")
    var resultRows=await checkAskResultsFreeGraph(element,subjectObject)
    ////////////////////////////console.log(resultRows)
    ////////////console.log(element)
    if(typeof(element)!="string"){
      node=d3.select("#"+element.getAttribute("id")).data()[0]
    }
    ////////////console.log(node)
    if((origin=="bubble")|(origin=="table")){
      if(node.menuOption!=undefined){
        filterResultRows()
      }
    }
    ////////////////////////////console.log(resultRows)
    if(resultRows.length>1){

      if(origin=="form"){
        msgNoResults = document.getElementById("msg-no-results");
        msgNoResults.classList.add("hidden");
        msgNoResults.classList.remove("inline-block");
        getOptionsWindow(resultRows)
      }else if(origin=="bubble"){
        //////////////////console.log(element)
        getMenuItemsFreeGraph(resultRows,element,pageX,pageY,origin)
      }else if(origin=="table"){
        getMenuItemsFreeGraph(resultRows,element,pageX,pageY,origin)
      }
    }else if (resultRows.length==1){
      //if(origin=="bubble"){
        //form={"uri":node["value"],"url":menuOption[0],"subject-object":menuOption[1]}
      //}

      form=resultRows[0]
      //////////////////////////console.log(resultRows[0])
      //////////////////////////console.log(form)
      ////////////////////////////console.log(form)
      if(origin=="form"){
        msgNoResults = document.getElementById("msg-no-results");
        msgNoResults.classList.add("hidden");
        msgNoResults.classList.remove("inline-block");
        origin="first"
      }
      ////////////////////////////console.log(node)
      await buildFreeGraph(form,origin,node)////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
    }else if((resultRows.length==0)&(origin=="form")){
      d3.selectAll(".graph").remove()
      msgNoResults = document.getElementById("msg-no-results");
      msgNoResults.classList.remove("hidden");
      msgNoResults.classList.add("inline-block");
    }
    ////////////////////////////////console.log(resultRows)
    return resultRows
    function filterResultRows(){
      //var menuOption=node.menuOption.split(",")
      var menuOption=node.menuOption.split(";")
      ////////////////console.log(node.menuOption)
      //if(menuOption.length)
      //////////////////////////console.log(resultRows)
      ////////////////console.log(menuOption)
      menuOption.forEach(function (d){
        //////////////////////////console.log(d)
        d=d.split(",")
        resultRows=resultRows.filter(function (r){
          //////////////////////////console.log(r)
          //////////////////////////console.log(r.uri)
          //////////////////////////console.log(node.value)
          //////////////////////////console.log(r.url)
          //////////////////////////console.log(d[0])
          //////////////////////////console.log(r["subject-object"])
          //////////////////////////console.log(d[1])
          //////////////////////////////console.log(r.uri)
          //////////////////////////////console.log(node.value)
          //////////////////////////////console.log(r.url)
          //////////////////////////////console.log(menuOption[0])
          //////////////////////////////console.log(r["subject-object"])
          //////////////////////////////console.log(menuOption[1])
          return (r.uri!=node.value)|(r.url!=d[0])|(r["subject-object"]!=d[1])
        })
      })
      ////////////////console.log(resultRows)
      //////////////////////////////console.log(node.menuOption)
      //////////////////////////////console.log(resultRows)
      //////////////////////////////console.log(node.value)
      //////////////////////////////console.log(menuOption)
      //resultRows=resultRows.filter(r=>(r.uri!=node.value)&(r.url!=menuOption[0])&(r["subject-object"]!=menuOption[1]))
      

/*       var childrenMenuOption;
      element["children"]=[{"value":arrayMenuOptions[0],"id":genRandomString(),"class":"menuOption","shape":1,"number":0,"children":element["children"]}]
      element["children"].push({"value":arrayMenuOptions[1],"id":genRandomString(),"class":"menuOption","shape":1,"number":0,"children":[]})
      ////////////////////////////////console.log(nodesClassesCorrespondence)
      if(!("menuOption" in nodesClassesCorrespondence)){
        nodesClassesCorrespondence["menuOption"]="Menu option"
      }
      ////////////////////////////////console.log(nodesClassesShow)
      if(!nodesClassesShow.includes("Menu option")){
        nodesClassesShow.push("Menu option")
      } */
      //////////////////////////////console.log(resultRows)
      
    }
  }
  async function checkAskResultsFreeGraph(node,so){
    var resultRows=[]
    console.log("check ask results")
    //var urls=['https://publications.europa.eu/webapi/rdf/sparql','https://data.europa.eu/sparql','https://query.wikidata.org/bigdata/namespace/wdq/sparql']
    var urls=['https://publications.europa.eu/webapi/rdf/sparql','https://data.europa.eu/sparql']
    if(so==undefined){
      subjectObject=['s','o']
    }else{
      subjectObject=[so]
    }
    if(typeof node === 'object'){
      uri=d3.select("#"+node.id).data()[0].value
    }else{
      uri=node
    }
    for (var j = 0; j < subjectObject.length; j++) {
      for (var i = 0; i < urls.length; i++) {
        results = await runAskSparlqQueryFreeGraph(urls[i],uri,subjectObject[j])
        if(results==true){
          resultRows.push({"url":urls[i],"subject-object":subjectObject[j],"uri":uri})
        }
      }
    }
    return resultRows
  }
  async function runAskSparlqQueryFreeGraph(url,uri,subjectObject){
    var prefixes="",settings
    if(subjectObject=="s"){
      sparqlQuery="ASK where {<"+uri+"> ?p ?o}"
    }else{
      sparqlQuery="ASK where {?s ?p <"+uri+">}"
    }
    var queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    if (url=="https://query.wikidata.org/sparql"){
      settings = { url: queryUrl, async: true       }; 
    }else{
      settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    }
    
    return new Promise((resolve, reject) => {
    $.ajax(settings).then  (function( _data ) {
      results = _data.boolean;
      resolve(results)
    })
    })
  }
  function getOptionsWindow(results){
    var modal,i=1;

    d3.select("#modal3-content").select("div").remove()

    var content = document.getElementById("modal3-content");

    results.forEach(function (r){
      content.appendChild(getHtmlOption(r,i))
      i+=1
    })
    
    modal=document.getElementById("myModal3")
    modal.style.display = "block";
    $('#myModal3').resizable({

    });
    $("#myModal").draggable()

  }

  function getHtmlOption(r,i){
    var subjectObject={"s":"Subject","o":"Object"}

    form=document.createElement("form")
    form.setAttribute("class","px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md")
    form.setAttribute("name","option"+i)
    form.setAttribute("onsubmit","buildFreeGraph(this,'form');return false")

    div=document.createElement("div")
    div.setAttribute("class","px-4 py-2 bg-white border-b border-gray-200 sm:px-6")
    div1=document.createElement("div")
    div1.setAttribute("class","flex flex-wrap items-center justify-between -mt-4 -ml-4 sm:flex-nowrap")

    div2=document.createElement("div")
    div2.setAttribute("class","mt-4 ml-4")

    div3=document.createElement("div")
    div3.setAttribute("class","flex-shrink-0 mt-4 ml-4")

    h3=document.createElement("h3")
    h3.setAttribute("class","text-lg font-medium leading-6 text-gray-900")
    h3.innerHTML ="Option "+ i +": show graph with following settings"

    dl=document.createElement("dl")
    dl.setAttribute("class","sm:divide-y sm:divide-gray-200")

    div4=document.createElement("div")
    div4.setAttribute("class","py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6")

    dt=document.createElement("dt")
    dt.setAttribute("class","text-sm font-medium text-gray-500")
    dt.innerHTML="URI: "
    
    dd=document.createElement("dd")
    dd.setAttribute("id","uri")
    dd.setAttribute("class","break-all mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2")
    dd.innerHTML=r["uri"]
    
    div5=document.createElement("div")
    div5.setAttribute("class","py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6")

    dt2=document.createElement("dt")
    dt2.setAttribute("class","text-sm font-medium text-gray-500")
    dt2.innerHTML="Sparql Endpoint: "
    
    dd2=document.createElement("dd")
    dd2.setAttribute("id","url")
    dd2.setAttribute("class","break-all mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2")
    dd2.innerHTML=r["url"]

    div6=document.createElement("div")
    div6.setAttribute("class","py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6")

    dt3=document.createElement("dt")
    dt3.setAttribute("class","text-sm font-medium text-gray-500")
    dt3.innerHTML="Position: "
    
    dd3=document.createElement("dd")
    dd3.setAttribute("id","subject-object")
    dd3.setAttribute("class","mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2")
    dd3.innerHTML=r["subject-object"]

    button=document.createElement("button")
    button.setAttribute("type","submit")
    button.setAttribute("class","relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500")
    button.innerHTML="Show graph"

    div4.appendChild(dt)
    div4.appendChild(dd)
    
    div5.appendChild(dt2)
    div5.appendChild(dd2)

    div6.appendChild(dt3)
    div6.appendChild(dd3)

    dl.appendChild(div4)
    dl.appendChild(div5)
    dl.appendChild(div6)
   
    div2.appendChild(h3)

    div1.appendChild(div2)
    div1.appendChild(dl)
    div1.appendChild(div3).appendChild(button)
    div.appendChild(div1)

    form.appendChild(div)
    
    return form
  }
  function getMenuItemsFreeGraph(items,element,pageX,pageY,origin){
    var menuItems=[],elementMenu,position,form,uri,url,subjectObject,row
    var node=d3.select("#"+element.getAttribute("id")).data()[0]
    //////////console.log(node)
    //////////console.log(items)
  
    if(node["configRow"]){
      node["configRow"].forEach(function(r){
        //////////console.log(configFile[r])
        items.push({"rowNumber":r,"row":configFile[r],"menuOption":configFile[r]["option"]})
        //buildBasicGraph(rowDataConfig,node,menuOption)
      })
    }
  
    if (origin=="table"){
      for (var i = 0; i < items.length; i++) {
        if(items[i]["subject-object"]){
          menuItems.push({"url":items[i]["url"],"uri":items[i]["uri"],"subject-object":items[i]["subject-object"]})
        }
        else{
          menuItems.push({"rowDataConfig":items[i]["rowNumber"],"node":node,"menuOption":items[i]["menuOption"]})
        }
      }
      navigation.addMenuToTable(node,menuItems)
    }else{
      for (var i = 0; i < items.length; i++) {
        if(items[i]["subject-object"]){
          //////////console.log(items[i])
          uri=items[i]["uri"]
          url=items[i]["url"]
          subjectObject=items[i]["subject-object"]
          itemsDetails={"uri":uri,"url":url,"subject-object":subjectObject}
          elementMenu={
            title: "Sparql Endpoint: "+ url + " and Position: "+ subjectObject,
            action: (data,d) => {
              url = d.title.match("Sparql Endpoint: (.*) and Position:")[1]; 
              subjectObject=d.title.match("and Position: (.*)")[1];
              form={"url":url,"uri":uri,"subjectObject":subjectObject}
              //////////////////console.log(typeof(element))
              //////////////////console.log(element)
              //////////////////console.log(d3.select("#"+element.getAttribute("id")).data()[0])
              buildFreeGraph(form,origin,node)

            }
          }
        }else{
          elementMenu={
            title: items[i]["menuOption"],
            action: (data,d) => {
            //////////console.log(data)
            //////////console.log(d)
            row=configFile.findIndex(v=>v.option==d.title)
            //////////console.log(row)
            buildBasicGraph(row,d3.select("#"+data.getAttribute("id")).data()[0],d.title)
            }
          }
        }
        menuItems.push(elementMenu)
      }
      //////////console.log(menuItems)
      networkGraph.menuFactory(pageX-400,pageY-450, menuItems, element,"dblClick",500)
    }
    
  }
  function clickBubbleFreeGraph(element,data) {
    var nodeData,sources2,node
    nodesSelSources=[]
    nodesSelTarget=[]
    //console.log(element)
    //console.log(navigation)
    node=d3.select("#"+element.getAttribute("id")).data()[0]
    if(navigation==undefined){
      navigation = new navigationPanel("freeGraph",node);
    }else{
      navigation.element=element
      navigation.node=node
      //console.log(navigation.node)
      //navigation.init()
      navigation.getNodes()
      navigation.initModal()
      navigation.navTableTable()
      navigation.contentTable()
    }
  }
  function unclickBubbleFreeGraph() {
    nodesSelSources=[]
    nodesSelTarget=[]
    $("#myModal").removeClass("in");
    $("#myModal").hide();
    d3.selectAll(".nodeCircle")
        .style("opacity", 1)
    d3.selectAll(".nodeCircleCircle")
        .style("opacity", 1)
        .attr("stroke", "grey")
        .attr("stroke-width", "1px");
    d3.selectAll(".link")
        .style("opacity", 1)
        .style("stroke", "grey")
        .style("fill","grey")
        .style("stroke-width", "1px");
  }
  function fillLegendFreeGraph(){
      var colorsFreeGraph=[{"name":"uri","color":"bg-green-300"},{"name":"bnode","color":"bg-yellow-300"},{"name":"literal","color":"bg-pink-300"},{"name":"menu Option","color":"bg-blue-300"},{"name":"guided mode graph","color":"bg-purple-500"}]
    
      d3.selectAll("#legend li").remove()
      colorsFreeGraph.forEach(function (c){
        appendLiFreeGraph(c.color,c.name)
      })

    
  }
  function appendLiFreeGraph(color,textLi){
    var li,classLi;
    ////console.log(color)
    classLi="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white rounded-l-md "
    li=d3.select("#legend").append("li")
    .attr("class", "flex col-span-1 rounded-md shadow-sm")
    li.append("div")
    .attr("class", classLi+color)
    li.append("div")
    .attr("class","flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md")
    .append("div")
    .attr("class","flex-1 px-4 py-2 text-sm truncate")
    .append("a")
    .attr("class","font-medium text-gray-900 hover:text-gray-600")
    .append("text")
    .text(textLi.toUpperCase());
  }
  function clusterResults(results,subjectObject){
    var ocurrences=[],small,big,results_small,results_big,num_occ,results_big_filtered;
    var properties=results.map(function (r){
      return r["p"]["value"]
    })
    var unique_properties=[...new Set(properties)]
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    unique_properties.forEach(function (d){
      ocurrences.push({"value":d,"ocurrences":countOccurrences(properties,d)})
    })
    small=ocurrences.filter(d=>d.ocurrences<=300).map(d=>d.value)
    big=ocurrences.filter(d=>d.ocurrences>300).map(d=>d.value)
    results_small=results.filter(r=>small.includes(r["p"]["value"]))
    results_big=results.filter(r=>big.includes(r["p"]["value"]))
    big.forEach(function(b){
      results_big_filtered=results_big.filter(r=>r["p"]["value"]==b)
      num_occ=ocurrences.filter(o=>o.value==results_big[0]["p"]["value"])[0]["ocurrences"]
      if(subjectObject=="s"){
        results_small.push({"o":{"type":results_big_filtered[0]["o"]["type"],"value":num_occ+" results","more_results":results_big_filtered},"p":results_big_filtered[0]["p"],"s":results_big_filtered[0]["s"],"class":"Cluster"})
      }else{
        results_small.push({"s":{"type":results_big_filtered[0]["s"]["type"],"value":num_occ+" results","more_results":results_big_filtered},"p":results_big_filtered[0]["p"],"o":results_big_filtered[0]["o"],"class":"Cluster"})
      }
    })
    return results_small
  }
  async function checkClassesBasicGraph(results,subjectObject,node){
    //var ocurrences=[],small,big,results_small,results_big,num_occ,results_big_filtered;
    var classes,classesConfig,sparqlQuery,askQuery,endpoint_url,configRows,resultsAsk;
    classesConfig=configFile.filter(d=>d.modelClass!=undefined).map(v=>v.modelClass)
    //////console.log(classesConfig)
    //////console.log(results)

    for (var i = 0; i < results.length; i++) {
      //////////console.log(results[i])
      //////console.log(results[i]["o"]["value"])
      //////console.log(results[i]["classes"]["value"])
      if(results[i]["o"]["value"]=="http://publications.europa.eu/resource/authority/corporate-body-classification/EP_GROUP"){
        //////console.log(results[i]["o"])
      }
      if(classes=results[i]["classes"]){
        classes=results[i]["classes"]["value"].split(";")
      }else{
        classes=[]
      }
      
      ////////console.log(classes)
      for (var j = 0; j < classes.length; j++) {
        if(classesConfig.includes(classes[j])){
          //configRow=configFile.findIndex(d=>d.modelClass==classes[j])
          configRows=getAllIndexes(configFile,classes[j],"modelClass")
          ////////////console.log(configRows)
          for (const row of configRows) {
          //configRows.forEach(function(row){
            if((!configFile[row]["query"].includes("PARAMETER2"))&(configFile[row]["type"]=="TREE")){
              askQuery=fromSelectToAskQuery(configFile[row]["query"])
              ////////////console.log(node)
              ////////////console.log(results[i])
              if(subjectObject=="s"){
                askQuery=askQuery.replace("PARAMETER",results[i]["o"]["value"]);
              }else if(subjectObject=="o"){
                askQuery=askQuery.replace("PARAMETER",results[i]["s"]["value"]);
              }
              
              ////////////console.log(askQuery)
              endpoint_url=configFile[row]["endpoint_url"]
              resultsAsk = await runAskSparlqQuery(endpoint_url,askQuery)
              ////////////console.log(resultsAsk)
              if(resultsAsk==true){
                if(results[i]["configRow"]){
                  if(subjectObject=="s"){
                    results[i]["o"]["configRow"].push(row)
                  }else{
                    results[i]["s"]["configRow"].push(row)
                  }
                }else{
                  if(subjectObject=="s"){
                    results[i]["o"]["configRow"]=[row]
                  }else{
                    results[i]["s"]["configRow"]=[row]
                  }
                }              
              }
            }

          //})
          }
          //////////////console.log(results)
          //////////////console.log(configFile[results[i]["configRow"]])
          // Now the one-liner would be:
          //results[i]["configRow"] = configFile.filter(d=>d.modelClass==classes[j])[0];
        }
      }
    }
    ////////////console.log(results)
    
    return results
    
  }
  function getCommentMenuFreeGraph(title){
    //////////////////////////////////////console.log(title)
  }
  function continueSparql(element){
    document.getElementById("sparql-timeout").style.display="none"
    d3.select("#spin").style("display","inline-flex")
  }
  function stopSparql(element){
    sparqlQueryWindow.abort()
    clearInterval(interval);
    document.getElementById("sparql-timeout").style.display="none"
  }
  function getAllIndexes(arr, value,field) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i][field] === value)
            indexes.push(i);
    return indexes;
}