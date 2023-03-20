  function checkNotTreeGraph(rowInConfigFile,data){
    if(rowInConfigFile["type"]=="WORDCLOUD"){
      showWordcloud(rowInConfigFile,data)
    }else if(rowInConfigFile["type"]=="WIKIPEDIA"){
      //console.log("wikipedia")
      showWikipediaPage(rowInConfigFile,data)
    }else if(rowInConfigFile["type"]=="TABLE"){
      showTable(rowInConfigFile,data)
    }else if(rowInConfigFile["type"]=="BARCHART"){
      showBarchart(rowInConfigFile,data)
    }else if(rowInConfigFile["type"]=="LINECHART"){
      showLinechart(rowInConfigFile,data)
    }

  }
  function getModal2(){
    if($("#modal-content2 #modalGraph")){
      $("#modal-content2 #modalGraph").remove()
    }
    if($("#modal-content2 iframe")){
      $("#modal-content2 iframe").remove()
    }

    showModal("#myModal2")
    return {"modalHeader":document.getElementById("modalHeader2"),"modalContent":document.getElementById("modal-content2")}
  }
  function showModal(id){
  
    $(id).removeClass("translate-x-full")
    $(id).addClass("translate-x-0")
  }
  function hideModal(id){
  
    $(id).removeClass("translate-x-0")
    $(id).addClass("translate-x-full")
  }
  async function showTimeLine(data,modalHeader,modalContent,configRow){
    var results,node,dataTimeline=[];

    node=data
    let url=configRow["endpoint_url"]
    let sparqlQuery=configRow["query"]
    let prefixes=""
    do{
      if(node["class"]!=undefined){
        sparqlQuery=sparqlQuery.replace("PARAMETER", node[node["class"]+"_uri"]); 
      }else{
        sparqlQuery=sparqlQuery.replace("PARAMETER", node);
      }
      let queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
      let settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  
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
    let results = await runSparlqQuery(settings)
    
    if(results[0]["item"]){
      var pdf=results[0]["item"]["value"]
    }
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
  }
  async function showWebPageQuery(node,sparqlQuery,url){
    var page;
    prefixes=""
    queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
    results = await runSparlqQuery(settings)
    if(results[0]["item"]){
      page=results[0]["item"]["value"]
    }else{
      page=results[0]["item1"]["value"]
    }

    window.open(page, '_blank').focus();
  }
  async function showTable(rowInConfigFile,node){
    var columns=rowInConfigFile.columns,column_names=rowInConfigFile.properties
    var results;

    const query=rowInConfigFile.query.replace("PARAMETER",node[node.class+"_uri"])

    results=await runSparlqQuery(rowInConfigFile.endpoint_url,query,"query")

    const title=rowInConfigFile.option + " - " + node.value

    const modalHeader=getModalHeader()
    modalHeader.innerHTML = title

    table(results,columns,column_names)
  }
  function table(data,columns,column_names){
    var cellContent;
    modalVisibilityOn()

    const modalContent=getModalContent()

    var div=document.createElement("div")
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    modalContent.appendChild(div)
    var mainEl=document.getElementById("modalGraph")
    div=document.createElement("div");
    div.className="flex flex-col mt-6"
  
    var div2=document.createElement("div");
    div2.className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
  
    var div3=document.createElement("div");
    div3.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
  
    var div4=document.createElement("div");
    div4.className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"
  
    var table = document.createElement("table");
  
    table.className="min-w-full divide-y divide-gray-200"
  
    let header = table.createTHead();
    header.className="bg-gray-50"
    var row = header.insertRow(0);    
  
    for (var i = columns.length-1; i >= 0; i--) {
        var headerCell = row.insertCell(0);
        headerCell.setAttribute("scope", "col");
        headerCell.setAttribute("class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider");
        if(column_names.filter(c=>c.property==columns[i]).length>0){
          headerCell.innerHTML = column_names.filter(c=>c.property==columns[i])[0]["property_name"]
        }
        
    }
    let body=table.createTBody();
    for (var j = 0; j < data.length; j++) {
      row = body.insertRow();
      if(j%2==0){
        row.className="bg-white"
      }else{
        row.className="bg-gray-50"
      }
      for (var i = 0; i < columns.length; i++) {
        var cell = row.insertCell();
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
  async function showTreegraph(node,sparqlQuery,modalHeader,modalContent,rowDataConfig){
    var results,dataTreegraph=[];

    url=rowDataConfig["endpoint_url"]
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
  
  async function showWordcloud(rowInConfigFile,node){
    var results;
    const title=rowInConfigFile.option + " - " + node.value

    const query=rowInConfigFile.query.replace("PARAMETER",node[node.class+"_uri"])

    results=await runSparlqQuery(rowInConfigFile.endpoint_url,query,"query")
    let dataWordCloud=transformDataWordCloud(results)
    wordCloudGraph(dataWordCloud,title)
  
  }
  function transformDataWordCloud(data){
    var wordCloudData=[],splittedStr=[]
    for (let i = 0; i < data.length; ++i) { 
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
  
      for (let i = 0; i < data.length; ++i) { 
        membership.push({
          "name": data[i]["membership"]["value"],
          "children": [
          {
              "name": data[i]["person"]["value"],
          }]})
      }
      treeData={"name":"Organisation",
                    "children":membership}
  
      return treeData
  }
  
  async function showWikipediaPage(rowInConfigFile,node){
    var results,page;

    var sparqlQuery=rowInConfigFile.query
    sparqlQuery=sparqlQuery.replace("PARAMETER2", node[rowInConfigFile.parameters[0]["property"]]);

    results=await runSparlqQuery(rowInConfigFile.endpoint_url,sparqlQuery,"query")
    const title=rowInConfigFile.option + " - " + node.value

    const modalHeader=getModalHeader()
    modalHeader.innerHTML = title

    page=results[0]["article"]["value"]

    modalVisibilityOn()

    const modalContent=getModalContent()

    var div=document.createElement("div")
      div.className="h-full"
      div.setAttribute("id","modalGraph")
      div.setAttribute("style","overflow: auto")
      modalContent.appendChild(div)
      d3.select("#modalGraph").append("iframe")
      .attr("src",page)
        .style("width", "100%")
        .style("height","100%");

}
function showWebPage(page,title,modalHeader,modalContent){  
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
  async function showBarchart(rowInConfigFile,node){
    var results;
    const title=rowInConfigFile.option + " - " + node.value

    const query=rowInConfigFile.query.replace("PARAMETER",node[node.class+"_uri"])

    results=await runSparlqQuery(rowInConfigFile.endpoint_url,query,"query")
    let data=transformDataBarchart(results)
    createBarchart(data,title)
  
    function transformDataBarchart(results){
      var resultsTransformed=[]
      results.forEach(function(r){
        resultsTransformed.push({"Category":r["category"]["value"],"Number":r["number"]["value"]})
      })
      return resultsTransformed
    }
  }

  async function showLinechart(rowInConfigFile,node){
    var results;
    const query=rowInConfigFile.query.replace("PARAMETER2",node[rowInConfigFile.parameters[0]["property"]]).replace("PARAMETER",node[node.class+"_uri"])

    results=await runSparlqQuery(rowInConfigFile.endpoint_url,query,"query")
    data=transformDataLinechart(results)

    const title=rowInConfigFile.option + " - " + node.value

    createLinechart(data,title)
  
    function transformDataLinechart(results){
      var resultsTransformed=[]
      results.forEach(function(r){
        resultsTransformed.push({"date":d3.timeParse("%Y-%m-%d")(r["publicationDocument_date"]["value"]),"value":+r["publicationDocument_dateNumber"]["value"]})
      })
      return resultsTransformed
    }
  }