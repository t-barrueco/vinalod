
function labelsClick(element){
    var nodeData,cell,row,nodesTable,li,div,div2,div3,div4,a,span,span2,svg,path,el1,el2,span3,span4,img,colorCircle;
  
    ////////////////////////////////////////////////////console.log(element)
    nodeData=d3.select("#"+element.getAttribute("id")).data()[0]
  
    navTable()
    contentTable()

    modal=document.getElementById("myModal")
    modal.style.display = "block";
    $('#myModal').resizable({
      //alsoResize: ".modal-dialog",
      //minHeight: 150
    });
    $("#myModal").draggable()
  
  
    function navTable()
    {
      var last=false, imageSource="images/check.svg",imageSourceLast="images/location.svg"
      d3.select("#navTable").select("nav").remove()
    
      var navTable = document.getElementById("navTable");
      var nav=document.createElement("nav")
      nav.setAttribute("aria-label", "Progress");
      var ol=document.createElement("ol")
      ol.setAttribute("role", "list");
    
      for (var i = 0; i < nodesSelSources.length-1; i++) {
        addElementNavTable(last,imageSource)
      }
      
      //Last element is different because last element has not a link line with the following node
      //and has a different image
      
      last=true
      addElementNavTable(last,imageSourceLast)


      d3.selectAll("#navTable a").on("dblclick",function(){ 
        ////////////////////////////////////////////////////console.log(this.parentNode)
        dblclickNavTable(this)
        //dblclickTrTable(this)
      })
      .on("click",function(){  
        clickTrTable(this)
      })
      .on('contextmenu',function(){  
        var menuItems=[]
        d3.event.preventDefault();
        var node=d3.select("#"+this.getAttribute("id")).data()[0]
        getMenuItemsContextMenu(node,"table")
    
      });

      function addElementNavTable(last,navImage)
      {
  
          li=document.createElement("li")
          li.setAttribute("class", "relative pb-10");
  
          if(!last){
              div=document.createElement("div")
              div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
              div.setAttribute("aria-hidden", "true");
          }
  
          a=document.createElement("a")
          a.setAttribute("href", "#");
          a.setAttribute("class", "relative flex items-start group");
          a.id=nodesSelSources[i]["id"]+"_a"
          
          span=document.createElement("span")
          span.setAttribute("class","h-9 flex items-center")
          
          span2=document.createElement("span")
          
          colorCircle=colorCorrespondence[colorScale(nodesClassesCorrespondence[nodesSelSources[i]["class"]])]
  
          span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))
      
          img=document.createElement("img")
      
          /* if(!last){
  
          } */
          img.setAttribute("src",navImage)
          img.setAttribute('width','40px')
          img.setAttribute('height','40px')
      
          el1=navTable.appendChild(nav).appendChild(ol).appendChild(li)
  
          if(!last){
              el1.appendChild(div)
          }
          
          el2=el1.appendChild(a)
          //el2.appendChild(span).appendChild(span2).appendChild(svg).appendChild(path)
          el2.appendChild(span).appendChild(span2).appendChild(img)
          span3=document.createElement("span")
          span3.setAttribute("class","ml-4 min-w-0 flex flex-col")
          span4=document.createElement("span")
          span4.setAttribute("class","text-xs font-semibold tracking-wide uppercase")
          span4.innerHTML = nodesSelSources[i]["value"]
          img=document.createElement("img")
          //nodesSel[i]
          ////////////////////////////////////////////////////////console.log(bubbleImage(d3.select("#"+nodesSel[i]["id"]).data()[0]))
          ////////////////////////////////////////////////////////console.log(d3.select("#"+nodesSel[i]["id"]).data()[0])
          img.setAttribute("src",bubbleImage(d3.select("#"+nodesSelSources[i]["id"]).data()[0]))
          //img.setAttribute("src",bubbleImage(d3.select("#"+element.getAttribute("id")).data()[0]))
          img.setAttribute('width','40px')
          img.setAttribute('height','40px')
          el3=el2.appendChild(span3)
          el3.appendChild(span4)
          //el3.appendChild(span5)
          el3.appendChild(img)
      
      }
    }

    function contentTable(){
    d3.selectAll(".modal-content table").remove()
    if (nodesSelTarget.length>0){
  
      var table = document.createElement("table");
      table.className="w-full divide-y divide-gray-200 table-auto"
    
      var thead=document.createElement("thead")
      thead.className="bg-gray-50"
      var tr=document.createElement("tr")
      var th=document.createElement("th")
      th.setAttribute("scope","col")
      th.setAttribute("class","px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider")
      //th.innerHTML="Child nodes for "+nodeData["class"]+" "+nodeData["value"]
      th.innerHTML=nodeData["value"]
      thead.appendChild(tr).appendChild(th)
      var tbody=document.createElement("tbody")
      tbody.className="bg-white divide-y divide-gray-200"
      ////////////////////////////////////////////////////////console.log(nodesSel)
    
      //if(element.getAttribute("root")=="1"){
      nodesTable=nodesSelTarget;
      //}else{
      //  nodesTable=nodesSelTarget.slice(0, -1);
      //}
    
      //////////////////////////////////////////////////////console.log(nodes.nodesSelTarget)
      for (var i = 0; i < nodesTable.length; i++) {
        
        row = tbody.insertRow(-1);
        //row.style.backgroundColor = colorScale(nodesClassesCorrespondence[nodesTable[i]["class"]]); 
        row.id=nodesTable[i]["id"]
        cell = row.insertCell(-1);
        cell.className="px-6 py-4 whitespace-nowrap"
        div=document.createElement("div")
        div.className="flex items-center w-full"
        div2=document.createElement("div")
        div2.className="flex-shrink-0 w-10 h-10"
        img=document.createElement("img")
        img.className="w-10 h-10 rounded-full bg-"+colorCorrespondence[colorScale(nodesClassesCorrespondence[nodesTable[i]["class"]])]
        img.setAttribute("src",bubbleImage(d3.select("#"+nodesTable[i]["id"]).data()[0]))
        div3=document.createElement("div")
        div3.className="relative ml-4"
        div4=document.createElement("div")
        div4.className="relative text-sm font-medium text-gray-900"
        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        //a.id=nodesSelSources[i]["id"]
        span=document.createElement("span")
        newText = document.createTextNode(nodesTable[i]["value"]);
        div4.appendChild(a).appendChild(span).appendChild(newText);
        //div4.innerHTML = nodesTable[i]["value"];
        el1=cell.appendChild(div)
        el1.appendChild(div2).appendChild(img)
        el1.appendChild(div3).appendChild(div4)
    
      }
      var dvTable = document.getElementById("dvTable");
      dvTable.innerHTML = "";
    
      div=document.createElement("div")    
      div.className="flex flex-col"
      div2=document.createElement("div")    
      div2.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
      div3=document.createElement("div")    
      div3.className="overflow-auto border-b border-gray-200 shadow md:overflow-scroll sm:rounded-lg"
      var fullTable=dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(table)
      fullTable.appendChild(thead)
      fullTable.appendChild(tbody);
      d3.selectAll(".modal-content tr").on("dblclick",function(){  
        dblclickTrTable(this)
      })
      //.on("mouseover",function(){//////////////////////////////////////////////////console.log("mouseover a Table")})
      .on("click",function(){  
        clickTrTable(this)
      })
      .on('contextmenu',function(){  
        var menuItems=[]
  
        d3.event.preventDefault();
        var node=d3.select("#"+this.getAttribute("id")).data()[0]
        ////////////////////////////////////////////////////////console.log(node)
        getMenuItemsContextMenu(node,"table")
  
      });
    
    }
    }
  }
function labelsClickFreeGraph(element,newForm,form,propertyEl){
    console.log(nodesTable)
    var property,nodeData,cell,row,nodesTable,li,div,div2,div3,div4,a,span,span2,svg,path,el1,el2,span3,span4,img,colorCircle;
    var imageArrowUp="/images/arrow-up.svg",imageArrowDown="/images/arrow-down.svg"

    
    nodesTable=networkGraph.data.links.filter(function(item) {
      return item.source.id == element["id"]
    })
    console.log(nodesTable)
    console.log(newForm)

    modal=document.getElementById("myModal")
    modal.style.display = "block";
    $('#myModal').resizable({

    });
    $("#myModal").draggable()

    //throw new Error("Something went badly wrong!");
    navTable()
    
    d3.selectAll(".modal-content table").remove()
    if (nodesTable.length>0){
  
      var table = document.createElement("table");
      table.className="w-full divide-y divide-gray-200 table-auto"
    
      var thead=document.createElement("thead")
      thead.className="bg-gray-50"
      var tr=document.createElement("tr")
      var th=document.createElement("th")
      th.setAttribute("colspan","2")
      th.setAttribute("scope","colgroup")
      th.setAttribute("class","px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider")
      th.innerHTML=element["value"]
      thead.appendChild(tr).appendChild(th)
      var tbody=document.createElement("tbody")
      tbody.className="bg-white divide-y divide-gray-200"
      
      for (var i = 0; i < nodesTable.length; i++) {
        
        row = tbody.insertRow(-1);
        row.id=nodesTable[i]["target"]["id"]+"_row"
        property=true
        addElementContentTable(property)
        property=false
        addElementContentTable(property,subjectObject)
      }
      var dvTable = document.getElementById("dvTable");
      dvTable.innerHTML = "";
    
      div=document.createElement("div")    
      div.className="flex flex-col"
      div2=document.createElement("div")    
      div2.className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
      div3=document.createElement("div")    
      div3.className="overflow-auto border-b border-gray-200 shadow md:overflow-scroll sm:rounded-lg"
      var fullTable=dvTable.appendChild(div).appendChild(div2).appendChild(div3).appendChild(table)
      fullTable.appendChild(thead)
      fullTable.appendChild(tbody);
      
      d3.selectAll(".modal-content td").on("dblclick",function(){  
        dblclickTrTableFreeGraph(this)
      })
      //.on("mouseover",function(){////////////////////////////////////////////////////////console.log("mouseover a Table")})
      .on("click",function(){  
        clickTrTableFreeGraph(this)
      })
    
    }
  
  function addElementContentTable(property){
    cell = row.insertCell(-1);
    cell.className="px-6 py-4 whitespace-nowrap"
    if(!property){
      cell.id=nodesTable[i]["target"]["id"]
    }else{
      cell.id=nodesTable[i]["source"]["id"]+nodesTable[i]["target"]["id"]
    }
    
    ////////////console.log(element)
    div=document.createElement("div")
    if(!property){
      div.className="flex items-center w-full"
    }else{
      div.className="flex items-center w-full property"
      div.setAttribute("url",newForm["url"])
      div.setAttribute("subject-object",newForm["subject-object"])
      div.setAttribute("uri",nodesTable[i]["value"])
    }
    
    div2=document.createElement("div")
    div2.className="flex-shrink-0 w-10 h-10"
    img=document.createElement("img")
    
    if(!property){
        if(nodesTable[i]["target"]["type"]=="uri"){
            img.className="w-10 h-10 bg-green-300 rounded-full"
          }else if(nodesTable[i]["target"]["type"]=="bnode"){
            img.className="w-10 h-10 bg-yellow-300 rounded-full"
          }else{
            img.className="w-10 h-10 bg-pink-300 rounded-full"
        }
/*         if(subjectObjectEl=="o"){
          img.src=imageS
        }else{
          img.src=imageO
        } */
        
    }else{
        img.className="w-10 h-10 bg-gray-300 rounded-full"
        //img.src=imageP
    }

    //img.setAttribute("src",bubbleImage(d3.select("#"+nodesTable[i]["id"]).data()[0]))
    div3=document.createElement("div")
    div3.className="relative ml-4"
    div4=document.createElement("div")
    div4.className="relative text-sm font-medium text-gray-900"
    if(!property){
        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        //a.id=nodesTable[i]["id"]
        span=document.createElement("span")
        //if(!property){
        newText = document.createTextNode(nodesTable[i]["target"]["value"]);
        div4.appendChild(a).appendChild(span).appendChild(newText);
    }else{
        span=document.createElement("span")
        //span.class="property"
        newText = document.createTextNode(nodesTable[i]["value"]);
        div4.appendChild(span).appendChild(newText);
    }
        
    //div4.innerHTML = nodesTable[i]["value"];
    el1=cell.appendChild(div)
    el1.appendChild(div2).appendChild(img)
    el1.appendChild(div3).appendChild(div4)
  }
  function navTable()
  {
    var last=false,property=false,first=true,ol=null,imageS="images/letter_s.svg",imageO="images/letter_o.svg",imageP="images/letter_p.svg"
    //d3.select("#navTable").select("nav").remove()
  
    ////////console.log(document.getElementById("navTable").querySelector('li'))

    ol=document.getElementById("navTable").querySelector('ol')
    
    ////////console.log(ol)
    if (ol==null){
      ////////console.log("entra en null")
      var navTable = document.getElementById("navTable");
      var nav=document.createElement("nav")
      nav.setAttribute("aria-label", "Progress");
      var ol=document.createElement("ol")
      ol.setAttribute("role", "list");
      //console.log("pasa por aquí")
      first=true
      last=true
      property=false
    }else{
      first=false
      last=false
      //console.log(element)
      li=document.getElementById("navTable").querySelector(' ol > li:last-child')
      //console.log(li)
      changeElementNavTable(li)
      ////////console.log(li.id)
      property=true
      addElementNavTable(first,last,property,url,subjectObject,propertyEl)
      first=false
      property=false
      last=true
    }
    addElementNavTable(first,last,property,url,subjectObject,propertyEl)

    //////////console.log(nodesSelSources)
    //for (var i = 0; i < nodesSelSources.length-1; i++) {
    //  ////////console.log(nodesSelSources)
    //  addElementNavTable(last,imageSource)
    //}
    
    //Last element is different because last element has not a link line with the following node
    //and has a different image
    
    


    d3.selectAll("#navTable a").on("dblclick",function(){ 
      ////////////////////////////////////////////////////console.log(this.parentNode)
      dblclickNavTable(this)
      //dblclickTrTable(this)
    })
    .on("click",function(){  
      clickTrTable(this)
    })
    .on('contextmenu',function(){  
      var menuItems=[]
      d3.event.preventDefault();
      var node=d3.select("#"+this.getAttribute("id")).data()[0]
      getMenuItemsContextMenu(node,"table")
  
    });

    function changeElementNavTable(li){
      //console.log(li)
      //var img=li.querySelector('img')
      //img.src=navImage
      var div=document.createElement("div")
      div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
      div.setAttribute("aria-hidden", "true");
      li.appendChild(div)
      //el1.appendChild(div)
      //last=false
      //first=false
      //property=true
      //addElementNavTable(last,first,property)
    }
    function addElementNavTable(first,last,property,url,subjectObject,propertyEl)
    {

        li=document.createElement("li")
        li.setAttribute("class", "relative pb-10");
        ////////console.log(element)
        li.id=element["id"]+"_li"
        //////////console.log(nodesSelSources[i]["id"]+"_li")

        if(!last){
            div=document.createElement("div")
            div.setAttribute("class", "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-400");
            div.setAttribute("aria-hidden", "true");
        }

        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        a.id=element["id"]+"_a"
        
        span=document.createElement("span")
        span.setAttribute("class","h-9 flex items-center")
        
        span2=document.createElement("span")
        
        //colorCircle=colorCorrespondence[colorScale(nodesClassesCorrespondence[nodesSelSources[i]["class"]])]
        if(property){
          colorCircle="gray-300"
        }else{
          if(element["type"]=="uri"){
            colorCircle="green-300"
          }else if(element["type"]=="bnode"){
            colorCircle="yellow-300"
          }else{
            colorCircle="pink-300"
          }
        }


        span2.setAttribute("class","relative z-10 w-8 h-8 flex items-center justify-center bg-"+ colorCircle + " rounded-full group-hover:bg-"+colorCircle.split("-")[0]+"-"+(parseInt(colorCircle.split("-")[1])+100))
    
        img=document.createElement("img")
    
/*         if(!last){

        } */
        if(property){
          //img.setAttribute("src",imageP)
          if(subjectObject=="s"){
            img.setAttribute("src",imageArrowDown)
          }else{
            img.setAttribute("src",imageArrowUp)
          }
          img.setAttribute('width','40px')
          img.setAttribute('height','40px')
        }
        ////////console.log(ol)
        if(!first){
          el1=ol.appendChild(li)
        }else{
          el1=navTable.appendChild(nav).appendChild(ol).appendChild(li)
        }

        if(!last){
            el1.appendChild(div)
        }
        
        el2=el1.appendChild(a)
        //el2.appendChild(span).appendChild(span2).appendChild(svg).appendChild(path)
        if(property){
          el2.appendChild(span).appendChild(span2).appendChild(img)
        }else{
          el2.appendChild(span).appendChild(span2)
        }
        
        span3=document.createElement("span")
        span3.setAttribute("class","ml-4 min-w-0 flex flex-col")
        span4=document.createElement("span")
        span4.setAttribute("class","text-xs font-semibold tracking-wide uppercase")
        if(property){
          span4.innerHTML= propertyEl 
          
          span5=document.createElement("span")
          span5.setAttribute("class","text-xs tracking-wide")
          span5.setAttribute("style","color:indigo;font-weight:bolder")
          span5.innerHTML=  "   Sparql Endpoint(" + url + ")"
          el3=el2.appendChild(span3)
          el3.appendChild(span4)
          el3.appendChild(span5)
        }else{
          span4.innerHTML = element["value"]
          el3=el2.appendChild(span3)
          el3.appendChild(span4)
        }
        
        //img=document.createElement("img")
        //nodesSel[i]
        ////////////////////////////////////////////////////////console.log(bubbleImage(d3.select("#"+nodesSel[i]["id"]).data()[0]))
        ////////////////////////////////////////////////////////console.log(d3.select("#"+nodesSel[i]["id"]).data()[0])
        //img.setAttribute("src",navImage)
        //img.setAttribute("src",bubbleImage(d3.select("#"+element.getAttribute("id")).data()[0]))
        //img.setAttribute('width','40px')
        //img.setAttribute('height','40px')
        
        //el3.appendChild(span5)
        //el3.appendChild(img)
    
    }

  }
  
  }

function clickTrTable(row) {
    d3.selectAll(".nodeCircleCircle")
    .style("opacity", 1)
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");
    d3.select("#"+row.getAttribute("id"))
    .attr("stroke", "yellow")
    .attr("stroke-width", "6px");
  }
  async function dblclickTrTable(row) {
    var indexRows=1;
    var element=document.getElementById(row.getAttribute("id").replace("_a","").replace("_tr",""));
    //////////console.log("pasa por aquí")
    indexRows=await networkGraph.wrangleData(document.getElementById(row.getAttribute("id").replace("_a","")),"table");
    //throw new Error("Something went badly wrong!");

    if (indexRows.length<2){
      unclickBubble()

      clickBubble(element,networkGraph.data)
      d3.select("#"+row.getAttribute("id"))
      .attr("stroke", "yellow")
      .attr("stroke-width", "6px");
    }
  }
  async function dblclickNavTable(row) {
    var element=document.getElementById(row.getAttribute("id").replace("_a",""));
    clickBubble(element,networkGraph.data)
    d3.select("#"+row.getAttribute("id"))
    .attr("stroke", "yellow")
    .attr("stroke-width", "6px");

  }
  function bubbleImage(node){
    var icon=[];
    if((node[node["class"]+"_image"]!=undefined)&(node[node["class"]+"_image"]!="")){
      return node[node["class"]+"_image"];
    }else{
      if(node[node["class"]+"_uri"]){
        console.log(filesIcons)
        icon=filesIcons.filter(function(d){
          return d.ID==node[node["class"]+"_uri"];
        })
      }
      if(icon.length==0){
        icon=filesIcons.filter(function(d){
          return d.ID==nodesClassesCorrespondence[node["class"]];
        })
      }
      if(icon.length>0){
        return icon[0]["FILE"]
      }else{
        return "images/question_mark.svg";
      }
    }
    
  }
  async function dblclickTrTableFreeGraph(element) {
    var indexRows=1;
    //////////console.log(element)
    var element=document.getElementById(element.getAttribute("id").replace("_a","").replace("_tr",""));
    //////////console.log("pasa por aquí")
    indexRows=await networkGraph.wrangleDataFreeGraph(document.getElementById(element.id),"table");
    //throw new Error("Something went badly wrong!");
    
    //////////console.log(indexRows)
    if (indexRows.length<2){
      unclickBubbleFreeGraph()

      clickBubbleFreeGraph(element,networkGraph.data)
      d3.select("#"+row.getAttribute("id"))
      .attr("stroke", "yellow")
      .attr("stroke-width", "6px");
    }
  }
  function clickTrTableFreeGraph(row) {
    d3.selectAll(".nodeCircleCircle")
    .style("opacity", 1)
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");
    d3.select("#"+row.getAttribute("id"))
    .attr("stroke", "yellow")
    .attr("stroke-width", "6px");
  }

  function addMenuToTable(node,menuItems){
    var newText,newCell,element,newRow,span,div,textNode,textTooltip
    d3.selectAll(".menu-table").remove()
    ////////////////////////////////////////////////////////////////////////////////////////////////////console.log(menuItems)
    ////////////////////////////////console.log(node)
    var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex;
    var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];
  
  /*   <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td> */
    for (var i = 0; i < menuItems.length; i++) {
        newRow = tbodyRef.insertRow(rowIndex+i);
        //newRow.style.backgroundColor="white"
        newRow.id="menu-table-"+menuItems[i]["position"]
        newRow.className = 'menu-table';
        newCell = newRow.insertCell();
        newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
        newCell.setAttribute("x-data","{ tooltip: false }")
        // Append a text node to the cell
        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        a.setAttribute("x-on:mouseenter","tooltip = true")
        a.setAttribute("x-on:mouseleave","tooltip = false")

        div=document.createElement("div")
        div.setAttribute("x-show","tooltip")
        div.setAttribute("class","z-50 absolute bg-indigo-300 border-graphite border-2 rounded p-4 mt-1")
        
        //textTooltip=d3.select("#"+node.id).data()[0].value + " in the SPARQL EndPoint: "+menuItems[i]["url"]
        
        textNode = document.createTextNode (getCommentOption(menuItems[i]["option"]));
        
        //a.id=nodesTable[i]["id"]
        span=document.createElement("span")
        span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
        newText = document.createTextNode(menuItems[i]["option"]);
        newCell.appendChild(a).appendChild(span).appendChild(newText);
        newCell.appendChild(div).appendChild(textNode)
        
        /* newCell = newRow.insertCell();
        newCell.innerHTML = '<img src="images/right-arrow-button.svg" width="40" height="40">'; */
        d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("dblclick",function(){        
          clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
        })
    }
  }
  /* function addMenuToTableFreeGraph(node,menuItems){
    var newText,newCell,element,newRow,span,form,textMenu,property,propertyNode,new_url,new_subjectObject
    ////console.log(node)
    //////////console.log(node.parentNode)
    ////////console.log(node["id"])

    ////////console.log(menuItems)
    d3.selectAll(".menu-table").remove()
    ////////////////////////////////////////////////////////////////////////////////////////////////////console.log(menuItems)
    ////////////////////////////////console.log(node)
    ////////console.log($('#myModal #'+ (node["id"]+"_row")))
    var rowIndex=$('#myModal #'+ (node["id"]+"_row"))[0].rowIndex;
    ////////console.log($('#myModal #'+ node["id"]))
    ////////console.log(rowIndex)
    var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];

    for (var i = 0; i < menuItems.length; i++) {
        newRow = tbodyRef.insertRow(rowIndex+i);
        //newRow.style.backgroundColor="white"
        newRow.id="menu-table-"+ node.id + "-" + [i]
        newRow.className = 'menu-table';
        newCell = newRow.insertCell();
        newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
        newCell.setAttribute("colspan","2")
        // Append a text node to the cell
        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        //a.id=nodesTable[i]["id"]
        span=document.createElement("span")
        span.className="inline-flex px-2 text-sm font-semibold leading-5 text-gray-800 bg-white rounded-full"
        newText = document.createTextNode("Sparql Endpoint: "+ menuItems[i]["url"]+" Position: " +menuItems[i]["subject-object"]);
        newCell.appendChild(a).appendChild(span).appendChild(newText);
        ////////console.log(menuItems)
        //////console.log(d3.selectAll("#menu-table-"+[i]))
        
    }
    d3.selectAll(".menu-table" ).on("dblclick",function(){ 
      textMenu=this.querySelector("span").innerHTML
      new_url = textMenu.match("Sparql Endpoint: (.*) Position:")[1]; 
      new_subjectObject=textMenu.match("Position: (.*)")[1];
      //console.log(document.getElementById(node.id+"_row"))
      propertyNode=document.getElementById(node.id+"_row").querySelector(".property")
      //console.log(propertyNode)
      url=propertyNode.getAttribute("url")
      subjectObject=propertyNode.getAttribute("subject-object")
      property=document.getElementById(node.id+"_row").querySelector(".property").querySelector("span").innerHTML
      form={"url":url,"uri":d3.select("#"+node.id).data()[0].value,"subjectObject":subjectObject,"property":property,"new_url":new_url,"new_subjectObject":new_subjectObject}
      //console.log(form)
      clickMenuTableFreeGraph(form,node)
    })
  } */
  async function clickMenuTable(position,node){
    var element=document.getElementById(node["id"])
    //////////////////////////////////////////////////////////////////////////////////////////////////////////console.log("entra en clickMenuTable")
    await buildBasicGraph(position,node)
    //////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
    unclickBubble()
    clickBubble(element,networkGraph.data)
  }
  /* async function clickMenuTableFreeGraph(form,element){
    var propertyEl;
    var node=d3.select("#"+element["id"]).data()[0]
    //console.log(form)
    //console.log(d3.select("#"+element.id).data()[0]["value"])
    var newForm={"url":form["new_url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["new_subjectObject"]}
    ////////console.log(position)
    ////////console.log(node)
    //////console.log(element)
    propertyEl=form["property"]
    //console.log(form)
    //console.log(newForm)
    var form={"url":form["url"],"uri":d3.select("#"+element.id).data()[0]["value"],"subject-object":form["subject-object"]}
    //formNav={"url","uri","subject-object"}
    //formContent={"url","uri","subject-object"}
    //////////////////////////////////////////////////////////////////////////////////////////////////////////console.log("entra en clickMenuTable")
    await buildFreeGraph(newForm,"table",element)
    labelsClickFreeGraph(node,newForm,form,propertyEl)
    //console.log(node)
    //console.log(newForm)
    //console.log(form)
    //console.log(propertyEl)
    //////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(networkGraph.data)
    //unclickBubble()
    //clickBubble(element,networkGraph.data)
  } */
  function addContextMenuToTable(node,menuItems){
    var newText,newCell,element,id
    d3.selectAll(".menu-table").remove()
    //////////////////////////////////////////////////////console.log(node)
    //////////////////////////////////////////////////////////////////////////////////////////////////console.log(menuItems)
    var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex;
    var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];
  
    for (var i = 0; i < menuItems.length; i++) {
        var newRow = tbodyRef.insertRow(rowIndex+i);
        //newRow.style.backgroundColor="white"
        newRow.id="menu-table-"+menuItems[i]["position"]
        newRow.className = 'menu-table';
        newCell = newRow.insertCell();
        newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
        // Append a text node to the cell
        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        //a.id=nodesTable[i]["id"]
        span=document.createElement("span")
        span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
        newText = document.createTextNode(menuItems[i]["option"]);
        newCell.appendChild(a).appendChild(span).appendChild(newText);
  
  /*       newText = document.createTextNode(menuItems[i]["option"]);
        newCell.appendChild(newText);
        newCell = newRow.insertCell();
        newCell.innerHTML = '<img src="images/right-arrow-button.svg" width="40" height="40">'; */
        d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("dblclick",function(){ 
          //////////////////////////////////////////////////////////////////////////////////////////////////console.log(this)       
          id=this.getAttribute("id").replace("menu-table-","")
          action=menuItems.filter(function(d){
            return (d.position==id)
          })[0]["action"]
          ////////////////////////////////////////////////////////////console.log(action)
          eval(action)
          //clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
        })
    }
  }
  function addContextMenuToTableFreeGraph(node,menuItems){
    var newText,newCell,element,id
    d3.selectAll(".menu-table").remove()
    //////////////////////////////////////////////////////console.log(node)
    //////////////////////////////////////////////////////////////////////////////////////////////////console.log(menuItems)
    var rowIndex=$('#myModal #'+ node["id"])[0].rowIndex;
    var tbodyRef = document.getElementById('myModal').getElementsByTagName('tbody')[0];
  
    for (var i = 0; i < menuItems.length; i++) {
        var newRow = tbodyRef.insertRow(rowIndex+i);
        //newRow.style.backgroundColor="white"
        newRow.id="menu-table-"+menuItems[i]["position"]
        newRow.className = 'menu-table';
        newCell = newRow.insertCell();
        newCell.className="px-6 py-4 bg-gray-100 whitespace-nowrap"
        // Append a text node to the cell
        a=document.createElement("a")
        a.setAttribute("href", "#");
        a.setAttribute("class", "relative flex items-start group");
        //a.id=nodesTable[i]["id"]
        span=document.createElement("span")
        span.className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-white rounded-full"
        newText = document.createTextNode(menuItems[i]["option"]);
        newCell.appendChild(a).appendChild(span).appendChild(newText);
  
  /*       newText = document.createTextNode(menuItems[i]["option"]);
        newCell.appendChild(newText);
        newCell = newRow.insertCell();
        newCell.innerHTML = '<img src="images/right-arrow-button.svg" width="40" height="40">'; */
        d3.selectAll("#menu-table-"+menuItems[i]["position"]).on("dblclick",function(){ 
          //////////////////////////////////////////////////////////////////////////////////////////////////console.log(this)       
          id=this.getAttribute("id").replace("menu-table-","")
          action=menuItems.filter(function(d){
            return (d.position==id)
          })[0]["action"]
          ////////////////////////////////////////////////////////////console.log(action)
          eval(action)
          //clickMenuTable(this.getAttribute("id").replace("menu-table-",""),node)
        })
    }
  }