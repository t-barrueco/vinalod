var navigation;
async function addURLGraph(field){
  //var uri;
  var indexRows
  ////////////////////////////////////////console.log(field.parentNode.parentNode.getElementsByTagName("input")[0].value)
  //networkGraph = new NetworkGraph("#networkGraph", data,forces,"freeGraph");
  ////////////////////////////console.log(field.querySelector('#free-uri').value)
  ////////////////////////////console.log(field.querySelector('#subject-object').value) 
  d3.selectAll(".classFilter").remove()
  if(document.getElementById("navTable").querySelector('ol')){
    document.getElementById("navTable").querySelector('ol').remove()
  }
  
  fillLegendFreeGraph()
  filtersList=[]
  indexRows=await checkQueries(field.querySelector('#free-uri').value,field.querySelector('#subject-object').value,"form")
  ////////////////////////////console.log(indexRows)
  //buildFreeGraph(field.querySelector('#free-uri'),field.querySelector('#subject-object'))
}
function buildTreeData (results,form,links,nodes){
    var children=[],treeData,nodesIds,id,idParent,idTarget,more_results;
    results.forEach(element => {

      if(form["subject-object"]=="s"){
        nodesIds=nodes.filter(d=>d.value==element["o"]["value"]).map(d=>d.id)
      }else{
        nodesIds=nodes.filter(d=>d.value==element["s"]["value"]).map(d=>d.id)
      }
      //////console.log(nodesIds)
      //////console.log(element)
      if(nodesIds.length>1){
/*         nodesIds.forEach(function (n){
          ////////////////console.log(links.filter(d=>d.target==n.id))
        })  
        ////////////////console.log(nodesIds) */
        //////////////////console.log(nodesIds.includes(l.target))
        id=links.filter(function(l){
          ////////////console.log(l)
          ////////////console.log(typeof(l.target))
          if(typeof(l.target)=="string"){
            idTarget=l.target
          }else{
            idTarget=l.target["id"]
          }
          return ((nodesIds.includes(idTarget))&(element["p"]["value"]==l.value))
        })[0]["target"]
        ////////////console.log(id)
        //[0]["target"]
        //id=links.filter(l=>((nodesIds.includes(l.target)))&(element["p"]["value"]==l.value))[0]["target"]
      }else{
        id=nodesIds[0]
      }
      ////////////////console.log(id)
      if(form["subject-object"]=="s"){
        if(element["o"]["more_results"]){
          more_results=element["o"]["more_results"]
        }else{
          more_results=""
        }
        children.push({"id":id,"value":element["o"]["value"],"type":element["o"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"hidden":false,"property":element["p"]["value"],"more_results":more_results})
      }else{
        if(element["s"]["more_results"]){
          more_results=element["s"]["more_results"]
        }else{
          more_results=""
        }
        children.push({"id":id,"value":element["s"]["value"],"type":element["s"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"hidden":false,"property":element["p"]["value"],"more_results":more_results})
      }
      //children.push(element["target"])
    });
    //////////////////console.log(links[0]["source"])
    //////////////////console.log(nodes.filter(d=>d.id==links[0]["source"]))
    //////////////////console.log(links[0]["source"])
    //treeData=[links[0]["source"]]
    //////////////////console.log(treeData)
    //treeData[0]["children"]=children
    ////////////////console.log(typeof(links[0]["source"]))
    if(typeof(links[0]["source"])=="string"){
      idParent=links[0]["source"]
    }else{
      idParent=links[0]["source"]["id"]
    }
    
    if(form["subject-object"]=="s"){
      //treeData=[links[0]["source"]]
      //treeData[0]["children"]=children
      if(results[0]["s"]["more_results"]){
        more_results=results[0]["s"]["more_results"]
      }else{
        more_results=""
      }
      treeData=[{"id":idParent,"value":results[0]["s"]["value"],"type":results[0]["s"]["type"],"children":children,"hidden":false,"more_results":more_results}]
    }else{
      if(results[0]["o"]["more_results"]){
        more_results=results[0]["o"]["more_results"]
      }else{
        more_results=""
      }
      treeData=[{"id":idParent,"value":results[0]["o"]["value"],"type":results[0]["o"]["type"],"children":children,"hidden":false,"more_results":more_results}]
    }
    ////////////////console.log(treeData)
    return treeData
}
async function buildFreeGraph(form,origin,node){
    var sparqlQuery,queryUrl,uri,url,subjectObject,newForm,nodes;
    prefixes=""
    ////////////////////console.log(form)
    ////////////////////console.log(origin)
    if(origin=="form"){
      ////////////////////////////console.log(form)
      uri=form.querySelector("#uri").innerHTML
      url=form.querySelector("#url").innerHTML
      subjectObject=form.querySelector("#subject-object").innerHTML

      ////////////////////////////console.log(uri)
      ////////////////////////////console.log(url)
      ////////////////////////////console.log(subjectObject)
      $("#myModal3").hide();
    }else if(origin=="first"){
      uri=form["uri"]
      url=form["url"]
      subjectObject=form["subject-object"]
      ////////////////////////////console.log(subjectObject)
      //////////////////////////console.log(subjectObject)
    }else if(origin=="bubble"){
      uri=form["uri"]
      url=form["url"]
      subjectObject=form["subjectObject"]
      ////////////////////////////console.log(subjectObject)
      //////////////////////////console.log(subjectObject)
    }else{
      uri=form["uri"]
      url=form["url"]
      subjectObject=form["subject-object"]
      ////////////////////////////console.log(subjectObject)
      //////////////////////////console.log(subjectObject)
    }
    form={"uri":uri,"url":url,"subject-object":subjectObject}
    /* if(origin!="form"){
      uri=node.value
    } */
    //if(typeof node === 'object'){
    //  uri=node.value
    //}
    /* else{
      uri=uri
    } */
    /* if(uri){

    }
    uri="http://publications.europa.eu/resource/authority/corporate-body/EP_GROUP_EPP" */
    //sparqlQuery="SELECT DISTINCT ?s ?p ?o where {{?s ?p ?o} filter(?"+subjectObject+"=<"+uri+">).} LIMIT 300"
    /* if(subjectObject=="s"){
      sparqlQuery="SELECT DISTINCT <"+uri+"> AS ?s ?p ?o where {{<"+uri+"> ?p ?o}} LIMIT 300"
    }else{
      sparqlQuery="SELECT DISTINCT ?s ?p <"+uri+"> AS ?o where {{?s ?p <"+uri+">}} LIMIT 300"
    } */
    if(subjectObject=="s"){
      sparqlQuery="SELECT DISTINCT <"+uri+"> AS ?s ?p ?o where {{<"+uri+"> ?p ?o}}"
    }else{
      sparqlQuery="SELECT DISTINCT ?s ?p <"+uri+"> AS ?o where {{?s ?p <"+uri+">}}"
    }
    //////////////////console.log(sparqlQuery)
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    ////////////////////////////console.log(queryUrl)
    ////////////////////////////console.log(sparqlQuery)
    await $.ajax(settings).then  (function( _data ) {
      var results = _data.results.bindings;
      ////////////////////console.log(results)
      //////////////////////////////////console.log(origin)
      ////////////////////////////////console.log(typeof(node))
      if((origin === 'form')|(origin === 'first')){
        ////////////////////////////////console.log("newgraph")
        ////console.log(results)
        if(results.length>300){
          results=clusterResults(results,subjectObject)
        }
        ////console.log(results)
        //throw new Error("Something went badly wrong!");
        data=getFreeGraphData(results,form)
        ////////////////////console.log(data)
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(data)
        ////////////////////////////////////console.log(networkGraph)
        //console.log(data)
        networkGraph = new NetworkGraph("#networkGraph", data,forces,"freeGraph");
  
        //newForm={"uri":uri,"url":url,"subject-object":subjectObject}
        //labelsClickFreeGraph(data["flatData"]["nodes"][0],newForm,null,null)
        
        ////console.log(typeof(navigation)=="object")
        if(typeof(navigation)!="object"){
          navigation = new navigation("freeGraph");
        }else{
          navigation.init()
        }
        
        //////////console.log(data.treeData[0]["id"])
        addFiltersFreeGraph(uri,data.treeData[0]["id"])
      }else{
        //////////////////////////console.log("adding nodes")
        //node=d3.select("#"+)
        //////////////////console.log(node)
        links=addFreeGraphData(results,d3.select("#"+ node.getAttribute("id")),form)
        //addFiltersFreeGraph(uri)
        //////////console.log(links[0]["source"]["id"])
        addFiltersFreeGraph(form["uri"],links[0]["source"]["id"])
      }
      
    })
  }
function dblclickCellContent(cell){
  navigation.dblclickCellContent(cell)
}
function clickCellContent(cell){
  navigation.clickCellContent(cell)
}
function dblclickNav(cell){
  //////////////////console.log("entra aquí")
  navigation.dblclickNav(cell)
}
function clickNav(cell){
  navigation.clickNav(cell)
}
function getFreeGraphData(results,form){
    var nodes=[],links=[],subjectId,objectId,more_results;
    
    
    //////////////////////console.log(results)
    ////////////////////////console.log(subjectObject)
   
    ////////////////////////console.log(nodes)
    subjectId=genRandomString()

    if(subjectObject=="o"){
      if(results[0]["o"]["more_results"]){
        more_results=results[0]["o"]["more_results"]
      }else{
        more_results=""
      }
      nodes.push({"id":subjectId,"value":results[0]["o"]["value"],"shape":1,"class":"node","type":results[0]["o"]["type"]})
    }else{
      nodes.push({"id":subjectId,"value":results[0]["s"]["value"],"shape":1,"class":"node","type":results[0]["s"]["type"]})
    }
    
    results.forEach(function (r){
      checkConfigFileNode(r)
      objectId=genRandomString()
      if(subjectObject=="o"){
        if(r["s"]["more_results"]){
          more_results=r["s"]["more_results"]
        }else{
          more_results=""
        }
        nodes.push({"id":objectId,"value":r["s"]["value"],"shape":1,"class":"node","type":r["s"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"property":r["p"]["value"],"more_results":more_results})
        links.push({'source': subjectId, 'target': objectId, 'value': r["p"]["value"]})
      }else{
        if(r["o"]["more_results"]){
          more_results=r["o"]["more_results"]
        }else{
          more_results=""
        }
        nodes.push({"id":objectId,"value":r["o"]["value"],"shape":1,"class":"node","type":r["o"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"property":r["p"]["value"],"more_results":more_results})
        links.push({'source': subjectId, 'target': objectId, 'value': r["p"]["value"]})
      }
    })
    var treeData=buildTreeData(results,form,links,nodes)
    //console.log(nodes)
    return data={"flatData":{"nodes":nodes,"links":links},"allData":{"nodes":nodes,"links":links},"treeData":treeData}
  }
function addFreeGraphData(results,node,form){
    var subjectId,objectId,subjectNode,objectNode,links=[],nodes=[];

    ////////////////////////console.log(subjectObject)
    //////////////////////console.log(results)
    ////////////////console.log(form)
    subjectObject=form["subject-object"]
    subjectNode=networkGraph.data.nodes.filter(function (n){
      return n.value==node.data()[0]["value"]
    })[0]

    results.forEach(function (r){

      objectId=genRandomString()
      if(subjectObject=="o"){
        objectNode={"id":objectId,"value":r["s"]["value"],"shape":1,"class":"node","type":r["s"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"property":r["p"]["value"]}
      }else{
        objectNode={"id":objectId,"value":r["o"]["value"],"shape":1,"class":"node","type":r["o"]["type"],"uri":form["uri"],"url":form["url"],"subject-object":form["subject-object"],"property":r["p"]["value"]}
      }
      nodes.push(objectNode)
      links.push({'source': subjectNode, 'target': objectNode, 'value': r["p"]["value"]})
    })

    networkGraph.treeData=networkGraph.treeData.concat(buildTreeData(results,form,links,nodes))
    //////////////////console.log(links)
    //////////////////console.log(networkGraph.data.links)
    networkGraph.data.links=networkGraph.data.links.concat(links)

    //////////////////console.log(networkGraph.data.links)
    networkGraph.data.nodes=networkGraph.data.nodes.concat(nodes)

    ////////console.log(networkGraph.allData)
    
    networkGraph.allData.nodes=networkGraph.allData.nodes.concat(nodes)
    networkGraph.allData.links=networkGraph.allData.links.concat(links)


    networkGraph.initializeSimulation();
    networkGraph.dataJoinFreeGraph()
    networkGraph.enterFreeGraph()
    networkGraph.initializeSimulation();
    networkGraph.dataJoinFreeGraph()
    networkGraph.exitGraph()
    networkGraph.zoomOut()
    networkGraph.zoomOut()
    ////////////////////////////////console.log(networkGraph.treeData)
    return links;
    //return data={"flatData":{"nodes":nodes,"links":links},"allData":{"nodes":nodes,"links":links},"treeData":treeData}
  }
/* async function addFreeGraph(node,pageX,pageY,origin){
    var indexRows=[],className,query="";
    await checkQueries(node,origin)
    await buildFreeGraph(node,origin)
  } */

  function getTooltipTextFreeGraph(d){
    //////////////////////////////////////////console.log(d)
    ////////////////////////////////////////////////////////////////console.log(nodesClassesCorrespondence)
    ////////////////////////////////////////////////////////////////console.log(d.class)
    ////////console.log(d)
      var text = `
        <table class="tiptable" style="margin-left: 2.5px">
            <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Property:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.property + `</span></td></tr>
            <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Name:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.value + `</span></td></tr>
            </table>`;
    return text;    
  }
  async function checkQueries(node,subjectObject,origin,pageX,pageY){
    var resultRows=await checkAskResultsFreeGraph(node,subjectObject)
    //////////////////////////console.log(origin)
    //////////////////////console.log(resultRows)
    if(resultRows.length>1){
      //getMenuItems(resultRows,node,pageX,pageY,origin)
      //////////////////////////////console.log(subjectObject)
      if(origin=="form"){
        getOptionsWindow(resultRows)
      }else if(origin=="bubble"){
        ////////////////////////////console.log("bubble")
        getMenuItemsFreeGraph(resultRows,node,pageX,pageY,origin)
      }else if(origin=="table"){
        getMenuItemsFreeGraph(resultRows,node,pageX,pageY,origin)
        //addMenuToTableFreeGraph(node,menuItems)
      }
      
      //if()
    }else if (resultRows.length==1){
      ////////////////////////console.log(node)
      ////////////////////////console.log(resultRows)
      form=resultRows[0]
      await buildFreeGraph(form,"first")//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
    }
    return resultRows
  }
  async function checkAskResultsFreeGraph(node,so){
    //var sparqlQuery;
    var resultRows=[]
    var urls=['https://publications.europa.eu/webapi/rdf/sparql','https://data.europa.eu/sparql']

    ////////////////////////////console.log(node)
    ////////////////////////////console.log(so)
    if(so==undefined){
      subjectObject=['s','o']
    }else{
      subjectObject=[so]
    }
    ////////////////////////////console.log(node)
    ////////////////////////////console.log(subjectObject)
    

    ////////////////////////////console.log(typeof(node))
    if(typeof node === 'object'){
      ////////////////////////////console.log(d3.select("#"+node.getAttribute("id")).data()[0].value)
      uri=d3.select("#"+node.getAttribute("id")).data()[0].value
    }else{
      uri=node
    }
    for (var j = 0; j < subjectObject.length; j++) {
      for (var i = 0; i < urls.length; i++) {
        ////////////////////////////console.log(subjectObject[j])
        ////////////////////////////console.log(urls[i])
        results = await runAskSparlqQueryFreeGraph(urls[i],uri,subjectObject[j])
        //////////////////console.log(results)
        if(results==true){
          
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(singleIndexRow["position"])
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(singleIndexRow)
          resultRows.push({"url":urls[i],"subject-object":subjectObject[j],"uri":uri})
        }
      }
    }
    ////////////////////////////console.log(resultRows)
    return resultRows
  }
/*   async function runAskSparlqQueryFreeGraph(subjectObject){
    var urls=['https://publications.europa.eu/webapi/rdf/sparql','https://data.europa.eu/sparql']

    urls.forEach(function (url){
      sparqlQuery="ASK where {{?s ?p ?o} filter(?"+subjectObject+"=<"+uri+">).}"
      queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
      settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
      ////////////////////////////////console.log(sparqlQuery)
      await $.ajax(settings).then  (function( _data ) {
        var results = _data.results.bindings;
      })
    })
    
  } */
  async function runAskSparlqQueryFreeGraph(url,uri,subjectObject){
    var prefixes="",settings
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(url)
    //////////////////////////////////////console.log(sparqlQuery)
    if(subjectObject=="s"){
      sparqlQuery="ASK where {<"+uri+"> ?p ?o}"
    }else{
      sparqlQuery="ASK where {?s ?p <"+uri+">}"
    }
    //sparqlQuery="ASK where {{?s ?p ?o} filter(?"+subjectObject+"=<"+uri+">).}"
    var queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    //////////////////console.log(queryUrl)
    //////////////////console.log(sparqlQuery)
    if (url=="https://query.wikidata.org/sparql"){
      settings = { url: queryUrl, async: true       }; 
    }else{
      settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(settings)
    return new Promise((resolve, reject) => {
    $.ajax(settings).then  (function( _data ) {
      results = _data.boolean;
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(results)
      resolve(results)
    })
    })
  }
  function getOptionsWindow(results){
    var modal,i=1;
    ////////////////////////////console.log(results)

    //getTextOptions(results)
    d3.select("#modal3-content").select("div").remove()

    var content = document.getElementById("modal3-content");

    results.forEach(function (r){
      content.appendChild(getHtmlOption(r,i))
      i+=1
    })
    
    modal=document.getElementById("myModal3")
    modal.style.display = "block";
    $('#myModal3').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal").draggable()

/*     <div class="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
          <div class="flex flex-wrap items-center justify-between -mt-4 -ml-4 sm:flex-nowrap">
            <div class="mt-4 ml-4">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Job Postings
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit quam corrupti consectetur.
              </p>
            </div>
            <div class="flex-shrink-0 mt-4 ml-4">
              <button type="button" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create new job
              </button>
            </div>
          </div>
        </div> */
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

    /* p=document.createElement("p")
    p.setAttribute("class","mt-1 text-sm text-gray-500")
    p.innerHTML="Lorem ipsum dolor sit amet consectetur adipisicing elit quam corrupti consectetur." */
    
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
    button.setAttribute("class","relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500")
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

    ////////////////////////////console.log(div)
    ////////////////////////////console.log(div1)
    
    ////////////////////////////console.log(div)
   
    div2.appendChild(h3)
    //div2.appendChild(p)

    
    div1.appendChild(div2)
    div1.appendChild(dl)
    div1.appendChild(div3).appendChild(button)
    div.appendChild(div1)

    form.appendChild(div)
/*     <div class="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
    <div class="flex flex-wrap items-center justify-between -mt-4 -ml-4 sm:flex-nowrap">
      <div class="mt-4 ml-4">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Option 1: show Graph with following settings
        </h3>
<!--             <p class="mt-1 text-sm text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit quam corrupti consectetur.
        </p> -->
      </div>
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            Full name
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            Margot Foster asdfasdf sda sdfasdfasdf sadfa asdfasdf dsfd aasd
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            Application for
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            Backend Developer
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            Email address
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            margotfoster@example.com
          </dd>
        </div>

      </dl>
      <div class="flex-shrink-0 mt-4 ml-4">
        <button type="button" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Show graph
        </button>
      </div>
    </div>

  </div> */
    
    return form
  }
  function getMenuItemsFreeGraph(items,node,pageX,pageY,origin){
    var menuItems=[],element,position,form,uri,url,subjectObject
    //////////////////////////console.log(items)
    //////////////////////////console.log(node)
    ////////////////////////////console.log(pageX)
    ////////////////////////////console.log(pageY)
    //////////////////////////console.log(origin)
    ////////////////////////////////////////////////////////////////////////////console.log("getMenuItems")
    if (origin=="table"){
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(origin)
      for (var i = 0; i < items.length; i++) {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(items[i]["position"])
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(items[i]["option"])
        menuItems.push({"url":items[i]["url"],"uri":items[i]["uri"],"subject-object":items[i]["subject-object"]})
      }
      //addMenuToTableFreeGraph(node,menuItems)
      navigation.addMenuToTable(node,menuItems)
    /*  for (var i = 0; i < items.length; i++) {
    } */
    }else{
      //////////////////////////console.log(items)
      for (var i = 0; i < items.length; i++) {
        //position=items[i]["position"]
        
        uri=items[i]["uri"]
        url=items[i]["url"]
        subjectObject=items[i]["subject-object"]
        itemsDetails={"uri":uri,"url":url,"subject-object":subjectObject}
        ////////////////////////////console.log(itemsDetails)
        ////////////////////////////console.log(items[i])
        element={
          title: "Sparql Endpoint: "+ url + " and Position: "+ subjectObject,
          action: (data,d) => {
            /* for (var i = 0; i < configFile.length; i++) {
                  if(configFile[i]["option"] == d.title){
                    position=i
                  }
                } */
            //buildBasicGraph(position,node)
            //////////////////////////console.log(d.title)
            //url=cow(.*)milk 
            url = d.title.match("Sparql Endpoint: (.*) and Position:")[1]; 
            //uri=items[i["uri"]]  
            subjectObject=d.title.match("and Position: (.*)")[1];
            form={"url":url,"uri":uri,"subjectObject":subjectObject}
            ////////////////////console.log(form)
            buildFreeGraph(form,origin,node)

          }
        }
        menuItems.push(element)
      }
      //////////////////////////////////////////////////////////////////////////////console.log(menuItems)
      networkGraph.menuFactory(pageX-400,pageY-450, menuItems, node,"dblClick",500)
    }
    
  }
/*   function clickBubbleFreeGraph(element,data) {
    var nodeData,sources2
    nodesSelSources=[]
    nodesSelTarget=[]
    ////////////////////////console.log("pasa por aquí")
    ////////////////////console.log(element)
    ////////////////////console.log(data)
    ////////////////////////////////////////////console.log(classesFilterList)
    d3.selectAll(".nodeCircle")
    .style("opacity", 0.1)
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");
  
    d3.selectAll(".link")
    .style("opacity", 0.1)
    .style("stroke", "#aaaaaa")
    .style("stroke-width", "1px");
  
    //////////////////////////////////////////////////////////////////console.log(d3.select("#"+element.getAttribute("id")))
    //////////////////////////////////////////////////////////////////console.log(element.getAttribute("id"))
    nodeData=d3.select("#"+element.getAttribute("id")).data()[0]
  
    var idEl=element.getAttribute("id");
    var nodesTable=data.links.filter(function(item) {
      return item.source.id == idEl
    })
    var sources=data.links.filter(function(item) {
      return item.target.id == idEl
    })
    //////////////////////console.log(targets)
    ////////////////////console.log(sources)
    if (sources.length>0){
      sources2=data.links.filter(function(item) {
        return item.target.id == sources[0]["source"]["id"]
      })
  
      while(sources2.length>0){
        sources2.forEach(function(d){
          sources.push(d)
        })
        sources2=data.links.filter(function(item) {
          return item.target.id == sources2[0]["source"]["id"]
        })
        ////////////////////////////////////////////////////////////////////////console.log(sources2)
      }
    }
    
    sources=sources.reverse();
    
    //////////////////////console.log(sources)
    sources.forEach(function(t){
      nodesSelSources.push({"class":t.source.class,"id":t.source.id,"value":t.source.value})
      d3.select("#"+t.source.id)
      .style("opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", "3px");
  
      d3.select("#"+t.source.id+"_g")
      .style("opacity", 1)
  
      d3.select("#"+t.source.id+"_"+element.id)
      .style("opacity", 1)
      .style("stroke", "black")
      .style("fill","black")
      .style("stroke-width", "3px");
  
      d3.select("#"+t.source.id+"_"+t.target.id)
      .style("opacity", 1)
      .style("stroke", "black")
      .style("fill","black")
      .style("stroke-width", "3px");
      ////////////////////////////////////////////////////////////////////////console.log(t)
    });
  
    nodesSelSources.push({"id":nodeData.id,"value":nodeData.value})
  
    //////////////////////////////////////////////////////////////////console.log(nodesSelSources)
    nodesTable.forEach(function(s){
      ////////////////////console.log(s)
      nodesSelTarget.push({"class":s.target.class,"id":s.target.id,"value":s.target.value})
      d3.select("#"+ s.target.id)
      .style("opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", "3px");
  
      d3.select("#"+ s.target.id+"_g")
      .style("opacity", 1)
  
      d3.select("#"+element.id+"_"+s.target.id)
      .style("opacity", 1)
      .style("stroke", "black")
      .style("fill","black")
      .style("stroke-width", "3px");
    });
  
    //////////////////////console.log(targets)
    //////////////////////////////////////////////////////////////////////console.log(nodesSelTarget)
    
    d3.select("#"+element.id)
    .style("opacity", 1)
    .attr("stroke", "black")
    .attr("stroke-width", "3px");
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.select("#"+element.id+"_image"))
    d3.select("#"+element.id+"_g")
    .style("opacity", 1)
  
  
    labelsClickFreeGraph(element)
  } */

  function clickBubbleFreeGraph(element,data) {
    var nodeData,sources2
    nodesSelSources=[]
    nodesSelTarget=[]
    ////////////console.log("pasa por clickBubbleFreeGraph")
    //////console.log(element)
    ////////////console.log(data)
  
    //labelsClickFreeGraph(element)
    navigation.element=element
    navigation.node=d3.select("#"+element.getAttribute("id")).data()[0]
    navigation.getNodes()
    navigation.initModal()
    ////////////////////console.log(navigation)
    navigation.navTableTable()
    ////////////console.log("después de navTableTable en clickBubbleFreeGraph")
    navigation.contentTable()
    ////////////console.log("después de contentTable en clickBubbleFreeGraph")

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
      var colorsFreeGraph=[{"name":"uri","color":"bg-green-300"},{"name":"bnode","color":"bg-yellow-300"},{"name":"literal","color":"bg-pink-300"}]
    
      d3.selectAll("#legend li").remove()
      colorsFreeGraph.forEach(function (c){
        appendLiFreeGraph(c.color,c.name)
      })

    ////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.select("#legend"))
    
  /*   <li class="flex col-span-1 rounded-md shadow-sm">
        <div class="flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white bg-pink-600 rounded-l-md">
        </div>
        <div class="flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md">
          <div class="flex-1 px-4 py-2 text-sm truncate">
            <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Graph API</a>
          </div>
        </div>
      </li> */
  }
  function appendLiFreeGraph(color,textLi){
    var li,classLi;
    //////////////////////////////////////////////////////////////////////////////////console.log(textLi)
    //////////////////////////////////////////////////////////////////////////////////console.log(i)
    //////////////////////////////////////////////////////////////////////////////////console.log(colorScale.range())
    //////////////////////////////////////////////////////////////////////////////////console.log(colorScale.range()[i])
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
    ////console.log(unique_properties)
    unique_properties.forEach(function (d){
      //////console.log(countOccurrences(properties,d))
      ocurrences.push({"value":d,"ocurrences":countOccurrences(properties,d)})
    })
    //////console.log(ocurrences.filter(d=>d.ocurrences<300).map(d=>d.value))
    small=ocurrences.filter(d=>d.ocurrences<=300).map(d=>d.value)
    big=ocurrences.filter(d=>d.ocurrences>300).map(d=>d.value)
    ////console.log(ocurrences)
    results_small=results.filter(r=>small.includes(r["p"]["value"]))
    results_big=results.filter(r=>big.includes(r["p"]["value"]))
    ////console.log(results_big)
    ////console.log(big)
    big.forEach(function(b){
      ////console.log(b)
      results_big_filtered=results_big.filter(r=>r["p"]["value"]==b)
      num_occ=ocurrences.filter(o=>o.value==results_big[0]["p"]["value"])[0]["ocurrences"]
      ////console.log(num_occ)
      if(subjectObject=="s"){
        results_small.push({"o":{"type":results_big_filtered[0]["o"]["type"],"value":num_occ+" results","more_results":results_big_filtered},"p":results_big_filtered[0]["p"],"s":results_big_filtered[0]["s"]})
      }else{
        results_small.push({"s":{"type":results_big_filtered[0]["s"]["type"],"value":num_occ+" results","more_results":results_big_filtered},"p":results_big_filtered[0]["p"],"o":results_big_filtered[0]["o"]})
      }
    })
    
    return results_small
    //////console.log(countOccurrences(properties,unique_properties[0]))
  }