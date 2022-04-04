function getModal2(){
    if($("#modal-content2 #modalGraph")){
      $("#modal-content2 #modalGraph").remove()
    }
    if($("#modal-content2 iframe")){
      $("#modal-content2 iframe").remove()
    }
    /* if($("#modalHeader2 h2")){
      $("#modalHeader2 h2").remove()
    }
    if($("#modal-content2 h2")){
      $("#modal-content2 h2").remove()
    } */
    showModal("#myModal2")
    return {"modalHeader":document.getElementById("modalHeader2"),"modalContent":document.getElementById("modal-content2")}
  }
  function showModal(id){
  
    $(id).removeClass("translate-x-full")
    $(id).addClass("translate-x-0")
    ////console.log($(id))
  }
  async function showTimeLine(data,modalHeader,modalContent){
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
    
    timelineGraph(dataTimeline,modalHeader,modalContent)
  
    $('#myModal2').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal2").draggable()
  }
  async function showPdf(node,sparqlQuery,url,modalHeader,modalContent){
    prefixes=""
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    //console.log(sparqlQuery)
    results = await runSparlqQuery(settings)
    //console.log(node)

    
    if(results[0]["item"]){
      var pdf=results[0]["item"]["value"]
    }

    ////console.log(checkUrl(pdf))
    //console.log(pdf)
    modalHeader.innerHTML = "PDF"
    $('#myModal2').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal2").draggable()
  
    var div=document.createElement("div")
    div.className="h-full"
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    modalContent.appendChild(div)
    PDFObject.embed(pdf, "#modalGraph");
    //PDFObject.embed(pdf, "#modalGraph");
  }
  async function showWebPageQuery(node,sparqlQuery,url){
    var page;
    prefixes=""
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    //console.log(sparqlQuery)
    results = await runSparlqQuery(settings)
    //console.log(node)
    //console.log(results)
    if(results[0]["item"]){
      page=results[0]["item"]["value"]
    }else{
      page=results[0]["item1"]["value"]
    }
    var url = page;

    /*var req = new XMLHttpRequest();
    req.open('GET', page, false);
    req.send(null);
    var headers = req.getAllResponseHeaders().toLowerCase();
    alert(headers); */
    /* try {
      const data = await ky.get(url)
      //console.log(data)
      ////console.log(data.products)
    } catch (error) {
      if (error.response) {
        //console.log(error.response.status)
      } else {
        //console.log(error.message)
      }
    } */
    
    //const axios = require('axios');
    
/*     axios.get(url).then(resp => {

      //console.log(resp.data);
  })
    .catch(function(error) {
       //console.log(resp)
       //console.log(error);  
    }) */
    /* axios.get(url).then(resp => {

        //console.log(resp.data);
    })
    .catch(function(error) {
      //console.log(error.data);  
      //console.log(error.status);  
      //console.log(error.headers);  
  }) */
    /* .catch(function(error) {
      //console.log(error);
      //console.log(error.status)
    }); */
/*     axios.get('network error')
     .then((response) => {})
     .catch((error) => {
         //console.log(error. request );
     }) */
    
    /* $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        alert("Details saved successfully!!!");
      },
      error: function (xhr, ajaxOptions, thrownError) {
        //console.log(xhr.status);
        //console.log(ajaxOptions)
        //console.log(thrownError);
      }
    })
    .done(function() {
        //console.log("ok");
    }).fail(function (jqXHR, textStatus, error) {
        // Handle error here
        //console.log(jqXHR.responseText);
        //console.log(textStatus)
        //console.log(error)
    }); */

    /* fetch(url)
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }).then(function(response) {
        //console.log("ok");
    }).catch(function(error) {
        //console.log(error);
    }); */
    //var output = document.getElementById("output");
    /* var http = new XMLHttpRequest();
    checkFileExist()

    function checkFileExist() {
        if (url.length === 0) {
            output.innerHTML = "Please enter File URL";
        } else {
            try{
              http.open('HEAD', url, false);
            }catch(err){
              //console.log(err)
            }
            try{
              http.send();
            }catch(err){
              //console.log(err)
              //console.log(HEAD)
            }
              
            if (http.status === 200) {
                alert("File exists");
            } else {
                alert("File doesn't exists");
            }
        }
    } */
/*     var req = new XMLHttpRequest();
    req.open('GET', page, false);
    req.send(null);
    var headers = req.getAllResponseHeaders().toLowerCase();
    alert(headers); */
    /* var request = new XMLHttpRequest();
    request.open('GET', page, true);
    //console.log(request.status)
    //console.log(request)
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            //console.log(request.status)
            if (request.status !== 404) {  
                //alert("Oh no, it does not exist!");
                request.send();
            }  
        }
    }; */
    /* var request = new XMLHttpRequest();  
    request.open('GET', page, true);
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if (request.status !== 404) {  
                //alert("Oh no, it does not exist!");
                request.send();
            }  
        }
    }; */
    //request.send();
    /* $("#webpage").remove()
    var iframe=document.createElement("iframe")
    iframe.id="webpage"
    
    iframe.setAttribute("src",page)
    iframe.setAttribute("style","width: 100%") 
    iframe.setAttribute("style","height: 100%") 

    modalContent.appendChild(iframe)
    modalHeader.innerHTML = node.value

    $('#myModal2').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal2").draggable() */
    window.open(page, '_blank').focus();
  }
  async function showTable(node,sparqlQuery,columns,column_names,modalHeader,modalContent){
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
    table(results,columns,column_names,modalContent)
  
    //var h2=document.createElement("h2")
    //h2.className="text-lg font-medium text-gray-900"
    //h2.innerHTML = node["value"]
    modalHeader.innerHTML = node["value"]
    //modalHeader.appendChild(h2);
  
    $('#myModal2').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal2").draggable()
  }
  function table(data,columns,column_names,modalContent){
    var cellContent;
    if(d3.select("#modalGraph")){
      d3.select("#modalGraph").remove()
      $("#modal-content iframe").remove()
    }
    var div=document.createElement("div")
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    modalContent.appendChild(div)
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
  async function showTreegraph(node,sparqlQuery,modalHeader,modalContent){
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
    treeGraph(dataTreegraph,node["value"],modalHeader,modalContent)
  
    $('#myModal2').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal2").draggable()
  }
  
  async function showWordcloud(node,sparqlQuery,configRow,modalHeader,modalContent){
    var rowDataConfig,results,dataTreegraph=[],title;
  
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
    wordCloudGraph(dataWordCloud,title,modalHeader,modalContent)
  
    $("#myModal2").removeClass("translate-x-full")
    $("#myModal2").addClass("translate-x-0")
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
  
  function showWikipediaPage(data,modalHeader,modalContent){
    var rowDataConfig,results,node,page,parameters,parameterTemp="";
  
    for (i = 0; i < configFile.length; ++i) { 
      if((configFile[i]["class"]==nodesClassesCorrespondence[data["class"]])&&(configFile[i]["type"]=="WIKIPEDIA")){
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
      ////console.log(results)
      page=results[0]["article"]["value"]
  
      var div=document.createElement("div")
      div.className="h-full"
      div.setAttribute("id","modalGraph")
      div.setAttribute("style","overflow: auto")
      modalContent.appendChild(div)
      iframe=d3.select("#modalGraph").append("iframe")
      .attr("src",page)
        .style("width", "100%")
        .style("height","100%");
  
      modalHeader.innerHTML = "Wikipedia Page"
  
      $('#myModal2').resizable({
        //alsoResize: ".modal-dialog",
        //minHeight: 150
      });
      $("#myModal2").draggable()
    })
  }
  function showWebPage(page,title,modalHeader,modalContent){
      ////////console.log(page)
  
      $("#webpage").remove()
      var iframe=document.createElement("iframe")
      iframe.id="webpage"
      
      iframe.setAttribute("src",page)
      iframe.setAttribute("style","width: 100%") 
      iframe.setAttribute("style","height: 100%") 
  
      modalContent.appendChild(iframe)
      modalHeader.innerHTML = title
  
      $('#myModal2').resizable({
        //alsoResize: ".modal-dialog",
        //minHeight: 150
      });
      $("#myModal2").draggable()
  }