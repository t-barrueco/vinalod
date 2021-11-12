filter = function ( _classFilterName, _property, _filterType,_parent,_bubbleId) {
    this.property = _property;
    this.filterType = _filterType;
    this.classFilterName = _classFilterName
    this.parent=_parent
    this.bubbleId=_bubbleId
    this.init();
  };
  
  /////////////////// initVis Method //////////////////////
  
filter.prototype.init = function () {
  var fi=this;
  fi.getValuesFilterVisibleNodes()
  fi.addHtml()
  //fi.checkVisibility()
  }

filter.prototype.getValuesFilterVisibleNodes=function (){
  var fi=this,values=[]
  networkGraph.data["nodes"].forEach(function(d){

    if(d["class"]==fi.classFilterName){
      values.push(d[fi.property].toLowerCase())
    }
  })
  values=[...new Set(values)].sort()
  fi.values=values

  if ((fi.values.length>1)&(fi.filterType=="dropdown")){
    fi.values=["All"].concat(fi.values)
  }
}
filter.prototype.getValuesFilterAllNodes=function (){
  var fi=this,ids=[],values=[]

  networkGraph.treeData.forEach(function(item){
    if(!ids.includes(item.id)){
      if(item[fi.property]){
        if(!values.includes(item[fi.property])){
          values.push(item[fi.property])
        }
      }
      ids.push(item.id)
    }
    if(item.children){
      item.children.forEach(function (c){
        if(!ids.includes(c.id)){
          if(c[fi.property]){
            if(!values.includes(c[fi.property])){
              values.push(c[fi.property])
            }
          }
          ids.push(c.id)
        }
      })
    }
  })
  fi.allValues=values;
}
filter.prototype.addHtml = function () {
    var fi=this;

    var div = document.createElement("div");
    div.className="relative"
    div.id=property.replaceAll(" ","_")+"_root"
    fi.id=fi.property.replaceAll(" ","_");

    
    if(fi.filterType=="dropdown"){

      addDropdown("dropdown",div)

    }
    else if (fi.filterType=="date"){
      addDropdown("dropdown_date",div)
      addDate(div)

        
    }else if (fi.filterType=="date_range"){
  
      addDateRange(div)
 
    }else if (filterType=="text"){
      addText(div)
    
    }else if (filterType=="between_numbers"){ 
      addBetweenNumbers()
      
    }else if (filterType=="number"){
      
      addNumber(div)
    }
    
    fi.mainHtmlEl=div

    if(document.getElementById(fi.id+"_selection")){
      fi.selection=document.getElementById(fi.id+"_selection")
    }else{
      fi.selection="none"
    }

    fi.htmlEl=document.getElementById(fi.id)
    
    function addDropdown(dropdownType,div){
      var select = document.createElement("select");
      select.name = fi.property;
      select.id = fi.property.replaceAll(" ","_");
      
      if (fi.filterType=="dropdown_multiple"){
        select.setAttribute('multiple', true);
      }    
  
      if(dropdownType=="dropdown_date"){
        valuesFilter=["date later than","date earlier than","date range"]
        internalValuesFilter=["<",">","<>"]
        select.className="w-full h-10 pl-3 pr-6 text-base bg-gray-200 border rounded-lg appearance-none focus:shadow-outline"
        select.setAttribute("onchange",'changeHtmlFilter(this,"'+fi.classFilterName+'")');
        select.id+="_selection"
        
      }else if(dropdownType=="dropdown_number"){
        valuesFilter=["greater than","smaller than","equal to","number range"]
        internalValuesFilter=["<",">","==","<>"]
        select.className="w-full h-10 pl-3 pr-6 text-base bg-gray-200 border rounded-lg appearance-none focus:shadow-outline"
        select.setAttribute("onchange",'changeHtmlFilter(this,"'+fi.classFilterName+'")');
        select.id+="_selection"  
      }else{
        valuesFilter=fi.values
        internalValuesFilter=fi.values
        select.className="w-full h-10 pl-3 pr-6 text-base border rounded-lg appearance-none focus:shadow-outline " + fi.classFilterName +"_filter"
        select.setAttribute("onchange","applyFilter(this)"); 
      }
      
      for (let i = 0; i < valuesFilter.length; i++) {
        var option = document.createElement("option");
        option.value = internalValuesFilter[i];
        option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        select.appendChild(option);
      }
      select.value = internalValuesFilter[0];
      var label = document.createElement("label");
      label.innerHTML = fi.property.split("_")[1]
      label.htmlFor = fi.property.split("_")[1];
      if((dropdownType=="dropdown_date")|(dropdownType=="dropdown_number")){
        label.id=fi.property.replaceAll(" ","_")+"_selection_label"
      }else{
        label.id=fi.property.replaceAll(" ","_")+"_label"
      }
      
      if((dropdownType=="dropdown_date")|(dropdownType=="dropdown_number")){
        label.innerHTML=label.innerHTML+ " selection"
        label.htmlFor = label.htmlFor + " selection"
      }
      
      label.className="block mb-2 text-base font-light text-gray-700"

      var root=document.getElementById(fi.classFilterName+"_filters").appendChild(div)
      root.appendChild(label);
      root.appendChild(select);//
  
    } 
    function addDate(div){
  
      var dateInput = document.createElement("input");
      dateInput.name = fi.property;
      dateInput.id = fi.property.replaceAll(" ","_");
      dateInput.type="date"
      dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, fi.classFilter) +"_filter"
      dateInput.setAttribute("onchange","applyFilter(this)"); 

      var label = document.createElement("label");
      label.innerHTML = fi.property.split("_")[1]
      label.htmlFor = fi.property.split("_")[1];
      label.id = fi.property.replaceAll(" ","_")+"_label"
      label.className="block mb-2 text-base font-light text-gray-700"

      var root=document.getElementById(fi.classFilterName+"_filters").appendChild(div)
      root.appendChild(label);
      root.appendChild(dateInput);  
    }
    
    function addText(div){
      var label = document.createElement("label");

      label.innerHTML = fi.property.split("_")[1]
      label.htmlFor = fi.property.split("_")[1];
      label.id= fi.property.replaceAll(" ","_")+"_label";
      label.className="block mb-2 text-base font-light text-gray-700"
      
      var div = document.createElement("div");
      div.className="relative"
  
      var textInput = document.createElement("input");
      textInput.name = fi.property;
      textInput.id = fi.property.replaceAll(" ","_");
      textInput.type="text"
      textInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      textInput.placeholder='Enter Text'
      textInput.setAttribute("onKeyDown","textEnter(this,event)"); 

      document.getElementById(fi.classFilterName+"_filters").appendChild(label);
      document.getElementById(fi.classFilterName+"_filters").appendChild(div).appendChild(textInput);
  
      docs=document.getElementsByClassName(fi.classFilterName)

      var searchValues=[]
      for (let d of docs) {
          searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
      }
      autocomplete(document.getElementById(fi.id), searchValues);
    }

    function addNumber(div){
      addDropdown("dropdown_number",div)  
      
      var label = document.createElement("label");
      label.innerHTML = fi.property.split("_")[1]
      label.htmlFor = fi.property.split("_")[1];
      label.id=fi.property.replaceAll(" ","_")+"_label";
      label.className="block mb-2 text-base font-light text-gray-700"
      
      var div = document.createElement("div");
      div.className="relative" //+ classFilter +"_filter"
  
      var textInput = document.createElement("input");
      textInput.name = fi.property;
      textInput.id = fi.property.replaceAll(" ","_");
      textInput.type="text"
      textInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date"' 
      textInput.placeholder='Enter Number'
      textInput.setAttribute("onchange","applyFilter(this)"); 

      document.getElementById(fi.classFilterName+"_filters").appendChild(label);
      document.getElementById(fi.classFilterName+"_filters").appendChild(div).appendChild(textInput);
      
    }
  }

filter.prototype.changeValues=function (){
  var fi=this,field;  
  if (fi.filterType=="dropdown"){
    field=document.getElementById(fi.id)
    valuesFilter=fi.values

    while (field.options.length > 0) {
      field.remove(0);
    }
    
    for (let i = 0; i < valuesFilter.length; i++) {
      var option = document.createElement("option");
      option.value = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
      option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
      field.appendChild(option);
    }
  }
}
filter.prototype.checkVisibility=function (){
  var fi=this,values=[]

  if((fi.values[0]=="")|(fi.values.length==0)){
    fi.hide()
  }else{
    fi.show()
  }
}
filter.prototype.hide=function (){
  var fi=this;
  document.getElementById(fi.id+"_root").parentNode.style.display = 'none'
  
  classFilterObject=classesFilterList.filter(c => c.name==classFilter)[0]
  classFilterObject.checkVisibility()
}
filter.prototype.hideJustField=function(){
  var fi=this;
  document.getElementById(fi.id).style.display = 'none'
}
filter.prototype.show=function (){
  var fi=this;
  document.getElementById(fi.id).parentNode.style.display = 'block'
  document.getElementById(fi.id+"_label").parentNode.style.display = 'block'
  classFilterObject=classesFilterList.filter(c => c.name==fi.classFilterName)[0]
  classFilterObject.checkVisibility()
}
filter.prototype.changeHtml = function () {
  var fi=this,value;
  value=document.getElementById(fi.id+"_selection").value

  if((value=="<>")&(fi.filterType=="date")){

    fi.htmlEl.style.display = "none";
    document.getElementById(fi.id+"_label").style.display = "none";

    if(!document.getElementById(fi.id+"_start")){
      addDateRange()
    }else{
      document.getElementById(fi.id+"_start_label").style.display = "block";
      document.getElementById(fi.id+"_start").style.display = "block";
      document.getElementById(fi.id+"_end_label").style.display = "block";
      document.getElementById(fi.id+"_end").style.display = "block";
    }

    fi.htmlEl.value=""
  }else if(((value=="<")|(value==">"))&(fi.filterType=="date")){

    if(document.getElementById(fi.id+"_start")){
      document.getElementById(fi.id+"_label").style.display = "block";
      document.getElementById(fi.id).style.display = "block";
      document.getElementById(fi.id+"_start_label").style.display = "none";
      document.getElementById(fi.id+"_start").style.display = "none";
      document.getElementById(fi.id+"_end_label").style.display = "none";
      document.getElementById(fi.id+"_end").style.display = "none";
    }

      applyFilter(fi.htmlEl)
  }else if((value=="<>")&(fi.filterType=="number")){
   fi.hideJustField()
    if(document.getElementById(fi.id+"_filter")){
        document.getElementById(fi.id+"_filter").parentNode.style.display = 'block';
      }else{
        addBetweenNumbers()
      }
  }else if(((value=="<")|(value==">")|(value=="=="))&(fi.filterType=="number")){
    fi.htmlEl.style.display = 'block';
    if(document.getElementById(fi.id+"_filter")){
      document.getElementById(fi.id+"_filter").parentNode.style.display = 'none';
    }
    applyFilter(fi.htmlEl)

  }
  function addDateRange(){
   
    var dateInput = document.createElement("input");
    dateInput.name = fi.id+"_start";
    dateInput.id = fi.id+"_start";
    dateInput.type="date"
    dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, fi.classFilterName) +"_filter"
    dateInput.setAttribute("onchange","applyFilter(this)"); 

    var label = document.createElement("label");
    label.innerHTML = fi.property.split("_")[1]+" Start";
    label.htmlFor = fi.property.split("_")[1]+" Start";
    label.id=dateInput.id+"_label"
    label.className="block mb-2 text-base font-light text-gray-700"


    fi.mainHtmlEl.appendChild(label)
    fi.mainHtmlEl.appendChild(dateInput)

    dateInput = document.createElement("input");
    dateInput.name = fi.id+"_end";
    dateInput.id = fi.id+"_end";
    dateInput.type="date"
    dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, fi.classFilterName) +"_filter"
    dateInput.setAttribute("onchange","applyFilter(this)"); 

    var label = document.createElement("label");
    label.innerHTML = fi.property.split("_")[1] + " End"
    label.htmlFor = fi.property.split("_")[1] + " End"
    label.id=dateInput.id+"_label"
    label.className="block mb-2 text-base font-light text-gray-700"
    fi.mainHtmlEl.appendChild(label)
    fi.mainHtmlEl.appendChild(dateInput)

  }
  function addBetweenNumbers(){
    var div = document.createElement("div");
    div.className="relative"

    var div2 = document.createElement("div");
    div2.className='flex items-center justify-center w-64 h-16 m-auto ' + getKeyByValue(nodesClassesCorrespondence, fi.classFilterName) +"_filter"
    div2.id=fi.property+"_between"
    var div3 = document.createElement("div");
    div3.className='relative min-w-full py-1'

    
    betNumbersInput = document.createElement("div")
    betNumbersInput.className="relative"

    betNumbersInput1 = document.createElement("div")
    betNumbersInput1.className="flex items-center justify-center h-screen"

    betNumbersInput2 = document.createElement("div")
    betNumbersInput2.className="relative w-full max-w-xl"
    betNumbersInput2.setAttribute("id",fi.property+"_filter")

    betNumbersInput2.setAttribute("x-data",'range($el)')
    betNumbersInput2.setAttribute("x-init",'mintrigger(); maxtrigger()')

    betNumbersInput3 = document.createElement("div")

    betNumbersInput4 = document.createElement("input")
    betNumbersInput4.className="absolute z-20 w-full h-2 opacity-0 appearance-none cursor-pointer pointer-events-none"
    betNumbersInput4.setAttribute("type",'range')
    betNumbersInput4.setAttribute("id",'range_min')
    betNumbersInput4.setAttribute("step",'1')
    betNumbersInput4.setAttribute("x-bind:min",'min')
    betNumbersInput4.setAttribute("x-bind:max",'max')
    betNumbersInput4.setAttribute("x-on:input",'mintrigger')
    betNumbersInput4.setAttribute("x-model",'minprice')
    betNumbersInput4.setAttribute("onchange","applyFilter(this)"); 

    betNumbersInput5 = document.createElement("input")
    betNumbersInput5.className="absolute z-20 w-full h-2 opacity-0 appearance-none cursor-pointer pointer-events-none"
    betNumbersInput5.setAttribute("type",'range')
    betNumbersInput5.setAttribute("id",'range_max')
    betNumbersInput5.setAttribute("step",'1')
    betNumbersInput5.setAttribute("x-bind:min",'min')
    betNumbersInput5.setAttribute("x-bind:max",'max')
    betNumbersInput5.setAttribute("x-on:input",'maxtrigger')
    betNumbersInput5.setAttribute("x-model",'maxprice')
    betNumbersInput5.setAttribute("onchange","applyFilter(this)"); 
    
    betNumbersInput6=document.createElement("div")
    betNumbersInput6.className="relative z-10 h-2"

    betNumbersInput7=document.createElement("div")
    betNumbersInput7.className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-gray-200 rounded-md"

    betNumbersInput8=document.createElement("div")
    betNumbersInput8.className="absolute top-0 bottom-0 z-20 bg-indigo-400 rounded-full"
    betNumbersInput8.setAttribute("x-bind:style","'right:'+maxthumb+'%; left:'+minthumb+'%'")

    betNumbersInput9=document.createElement("div")
    betNumbersInput9.className="absolute z-30 flex items-center justify-center w-4 h-4 -ml-2 bg-white border border-gray-300 rounded-full shadow cursor-pointer -top-1"
    betNumbersInput9.setAttribute("x-bind:style","'left: '+minthumb+'%'")

    betNumbersInput10=document.createElement("div")
    betNumbersInput10.className="absolute z-30 flex items-center justify-center w-4 h-4 -ml-2 bg-white border border-gray-300 rounded-full shadow cursor-pointer -top-1"
    betNumbersInput10.setAttribute("x-bind:style","'right: '+maxthumb+'%'")

    betNumbersInput11=document.createElement("div")
    betNumbersInput11.className="flex items-center justify-between py-2"

    betNumbersInput12=document.createElement("div")

    betNumbersInput13=document.createElement("input")
    betNumbersInput13.setAttribute("type",'text')
    betNumbersInput13.setAttribute("id",'text_min')
    betNumbersInput13.setAttribute("maxlength",'5')
    betNumbersInput13.setAttribute("x-on:input",'mintrigger')
    betNumbersInput13.setAttribute("x-model",'minprice')
    betNumbersInput13.className="w-24 px-3 py-2 text-center border border-gray-200 rounded"
    betNumbersInput13.setAttribute("onchange","applyFilter(this)"); 

    betNumbersInput14=document.createElement("div")

    betNumbersInput15=document.createElement("input")
    betNumbersInput15.setAttribute("type",'text')
    betNumbersInput15.setAttribute("id",'text_max')
    betNumbersInput15.setAttribute("maxlength",'5')
    betNumbersInput15.setAttribute("x-on:input",'maxtrigger')
    betNumbersInput15.setAttribute("x-model",'maxprice')
    betNumbersInput15.className="w-24 px-3 py-2 text-center border border-gray-200 rounded"
    betNumbersInput15.setAttribute("onchange","applyFilter(this)"); 

    var label=document.getElementById(fi.id+"_label")
    
    insertAfter(betNumbersInput,label)
    var nestedDiv1=betNumbersInput.appendChild(betNumbersInput2)
    var nestedDiv2=nestedDiv1.appendChild(betNumbersInput3)
    nestedDiv2.appendChild(betNumbersInput4)
    nestedDiv2.appendChild(betNumbersInput5)
    nestedDiv3=nestedDiv2.appendChild(betNumbersInput6)
    nestedDiv3.appendChild(betNumbersInput7)
    nestedDiv3.appendChild(betNumbersInput8)
    nestedDiv3.appendChild(betNumbersInput9)
    nestedDiv3.appendChild(betNumbersInput10)

    nestedDiv4=nestedDiv1.appendChild(betNumbersInput11)

    nestedDiv4.appendChild(betNumbersInput12).appendChild(betNumbersInput13)
    nestedDiv4.appendChild(betNumbersInput14).appendChild(betNumbersInput15)

  }

}
filter.prototype.applyFilter=function(){
  var fi=this,values=[];
  var hiddenNodes=[],parentHidden=false,position,selectedFilter;
  
  fi.getValuesFilterAllNodes()
  if(fi.filterType=="number"){
    if(fi.selection.value=="<>"){
      values.push(d3.select("#"+fi.id+"_filter #text_min").node().value)
      values.push(d3.select("#"+fi.id+"_filter #text_max").node().value)
      fi.valuesField=values
    }else{
      fi.valuesField=[document.getElementById(fi.id).value]
    }

  }else if(fi.filterType=="date"){
    if(fi.selection.value=="<>"){
      values.push(d3.select("#"+fi.property+"_start").node().value)
      values.push(d3.select("#"+fi.property+"_end").node().value)

      fi.valuesField=values
    }else{
      fi.valuesField=[document.getElementById(fi.id).value]
    }
    
  }else{
    fi.valuesField=[document.getElementById(fi.id).value.toLowerCase()]
  }

}
filter.prototype.filterText=function(node){
  var fi=this,hidden=false;
  if ((node[fi.property].toLowerCase()).indexOf(fi.valuesField[0].toLowerCase()) !== -1){
    hidden=false
  }else{
    hidden=true
  }
  return hidden
}
filter.prototype.filterNumber=function(node){
  var fi=this,hidden=false;
  if(fi.valuesField[0]==""){
    hidden=false;
  }else{
    if(fi.selection.value=="<>"){
      if(eval(fi.valuesField[0] +"<"+ node[fi.property]) & eval(fi.valuesField[1]+">"+node[fi.property])){
          hidden=false
      }else{
          hidden=true
      }
    }else{
     if(eval(fi.valuesField[0]+fi.selection.value+node[fi.property])){
        hidden=false
      }else{
        hidden=true
      }
    }
  }

  return hidden
}
filter.prototype.filterDropdown=function(node){
  var fi=this,hidden=false;
  if(fi.valuesField.includes("all")){
    if(node["hidden"]){
      hidden=false
    }
  }else if(!fi.valuesField.includes(node[fi.property].toLowerCase())){
      hidden=true
  }else{
      hidden=false
  }
  return hidden
}
filter.prototype.filterDate=function(node){
  var fi=this,hidden=false;

  if(fi.valuesField[0]==""){
    hidden=false
  }else{
    if(fi.selection.value=="<>"){
      if((fi.valuesField[0]=='')|(fi.valuesField[1]=='')){
        hidden=false
      }else{
        if(eval("new Date('"+fi.valuesField[0]+"') < new Date('"+node[fi.property]+"')") & eval("new Date('"+fi.valuesField[1]+"') > new Date('"+node[fi.property]+"')")){
          hidden=false;
        }else{
          hidden=true
        }
      }

    }else{
     if(eval("new Date('"+fi.valuesField+"')"+fi.selection.value+"new Date('"+node[fi.property]+"')")){
        hidden==false
      }else{
        hidden=true 
      }
    }
  }
  return hidden
}



classFilterClass = function (_name) {
    this.name = _name;
    this.init();
  };
    
classFilterClass.prototype.init = function () {
    var cf=this;

    cf.html=d3.select(".controls").append("div")
        .attr("class","m-2 px-4 py-2 border-b border-gray-600 bg-white shadow sm:px-6 classFilter")
    cf.mainHtmlEl=cf.html
        cf.titleColor=colorCorrespondence[colorScale(nodesClassesCorrespondence[cf.name])]
    
    cf.html
    .append("div")
    .attr("class","content-center")
    .append("a")
    .attr("href", "#")
    .append("img")
    .attr("class","mx-auto filter-icon")
    .attr("src","images/filter_cross.svg")
    .attr("width","40")
    .attr("height","40")
    .attr("title","click to clear filters")
    .attr("onclick","clearFilters(this)")
    .style("display","none")

    cf.html.append("div")
        .attr("class","classLabel border border-transparent mt-3 rounded-md bg-"+ colorCorrespondence[colorScale(nodesClassesCorrespondence[cf.name])])
        .append("h3")
        .attr("class","rounded-md container mx-auto py-3 text-lg font-medium leading-6 text-"+cf.titleColor.split("-")[0]+"-"+(parseInt(cf.titleColor.split("-")[1])+300))
        .text(nodesClassesCorrespondence[cf.name])
        
    cf.html=cf.html
        .append("div")
        .attr("class","py-3 className")
        .attr("id",cf.name+"_filters")
  }

classFilterClass.prototype.checkVisibility = function () {  
  var cf=this;
  cf.notEmpty=false;
  filtersList.filter(f => f.classFilterName==cf.name).map(p=>p.values).forEach(function(d){
    if((d!="")&(d!=[""])){
      cf.notEmpty=true
    }
  })
  if(!cf.notEmpty){
    cf.hide()
  }else{
    cf.show()
  }

}
classFilterClass.prototype.hide = function () {  
  var cf=this;
  cf.mainHtmlEl.style("display","none")
}
classFilterClass.prototype.show = function () {  
  var cf=this;
  cf.mainHtmlEl.style("display","block")
}

filterFreeGraph = function (_name,_nodeType,_filterType,_classFilterName,bubbleId) {
  this.name = _name.replaceAll("/","");
  this.nodeType=_nodeType
  this.filterType=_filterType
  this.classFilterName=_classFilterName
  this.bubbleId=bubbleId

  this.init();
};
filterFreeGraph.prototype.init = function () {
  var fi=this;
  fi.getValues()
  fi.getValuesFilterVisibleNodes()
  fi.addHtml()
  }
filterFreeGraph.prototype.getValues = function () {
    var fi=this,values=["All"];

    if(fi.nodeType=="property"){
      networkGraph.data.links.forEach(function(l){
        if(l["source"]["value"]==fi.classFilterName){
          if(!values.includes(l["value"])){
            values.push(l["value"])
          }
        }

      })
    }else if(fi.nodeType=="nodeType"){
      networkGraph.data.links.forEach(function(l){
        if(!values.includes(l["target"]["type"])){
          values.push(l["target"]["type"])        
        }
      })
    }
    values.sort(function(a, b){
      if(a < b) { return -1; }
      if(a > b) { return 1; }
      return 0;
  })
    fi.allValues=values
    fi.backValues=values
}
filterFreeGraph.prototype.resetValues = function () {
  var fi=this,values=["All"];

  if(fi.nodeType=="property"){
    networkGraph.allData.links.forEach(function(l){
      if(!values.includes(l["value"])){
        values.push(l["value"].toLowerCase())
      }
    })
  }else if(fi.nodeType=="nodeType"){
    networkGraph.allData.links.forEach(function(l){
      if(!values.includes(l["target"]["type"])){
        values.push(l["target"]["type"].toLowerCase())        
      }
    })
  }
  values.sort(function(a, b){
    if(a < b) { return -1; }
    if(a > b) { return 1; }
    return 0;
})
  fi.values=values
}
filterFreeGraph.prototype.addHtml = function () {
    var fi=this;
    var div = document.createElement("div");
    div.className="relative"

    div.id=fi.name.replaceAll("/","")+"_root"
    var select = document.createElement("select");
    select.name = fi.name.replaceAll("/","");
    select.id = fi.name.replaceAll("/","");
    select.setAttribute("nodeType",fi.nodeType)
    select.setAttribute("classFilterName",fi.classFilterName)
    select.setAttribute("bubbleId",fi.bubbleId)
    if (fi.filterType=="dropdown_multiple"){
      select.setAttribute('multiple', true);
    }    
  
    valuesFilter=fi.values
    internalValuesFilter=fi.values
    select.className="w-full h-10 pl-3 pr-6 text-base border rounded-lg appearance-none focus:shadow-outline " + fi.classFilterName +"_filter"
    select.setAttribute("onchange","applyFreeGraphFilter(this)"); 

    for (let i = 0; i < valuesFilter.length; i++) {
      var option = document.createElement("option");
      option.value = internalValuesFilter[i];
      option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
      select.appendChild(option);
    }
    select.value = internalValuesFilter[0];
    var label = document.createElement("label");
    var n = fi.name.lastIndexOf('_');
    var result = fi.name.substring(n + 1);
    label.innerHTML = result.charAt(0).toUpperCase() + result.slice(1)
    label.htmlFor = result.charAt(0).toUpperCase() + result.slice(1)

    label.id=fi.name.replaceAll("/","")+"_label"
    label.className="block mb-2 text-base font-light text-gray-700"

    var root=document.getElementById(fi.classFilterName.replaceAll("/","")+"_filters").appendChild(div)
    root.appendChild(label);
    root.appendChild(select);//
    
    fi.mainHtmlEl=div

  }

filterFreeGraph.prototype.getValuesFilterVisibleNodes=function (){
    var fi=this,values=[];

    fi.backValues=fi.values

    networkGraph.data["links"].forEach(function(d){

      if(fi.bubbleId==d.source.id){
        if (fi.nodeType=="property"){
          values.push(d["value"].toLowerCase())
        }else{
          values.push(d["target"]["type"].toLowerCase())
        }
      }
    })

    values=[...new Set(values)]
    values.sort(function(a, b){
      if(a < b) { return -1; }
      if(a > b) { return 1; }
      return 0;
    })

    fi.values=values
  
    if ((fi.values.length>1)&(fi.filterType=="dropdown")){
      fi.values=["All"].concat(fi.values)
    }
  }
filterFreeGraph.prototype.changeValues=function (){
    var fi=this,field;  
      field=document.getElementById(fi.name.replaceAll("/",""))

      valuesFilter=fi.values

      while (field.options.length > 0) {
        field.remove(0);
      }
      
      for (let i = 0; i < valuesFilter.length; i++) {
        var option = document.createElement("option");
        option.value = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        field.appendChild(option);
      }

      fi.checkVisibility()
}
filterFreeGraph.prototype.getValuesFilterVisibleNodes_backup=function (){
  var fi=this,values=[];

  networkGraph.data["links"].forEach(function(d){

    if (fi.nodeType=="property"){
      values.push(d["value"].toLowerCase())
    }else{
      values.push(d["target"]["type"].toLowerCase())
    }

  })
  values=[...new Set(values)].sort()
  fi.values=values

  if ((fi.values.length>1)&(fi.filterType=="dropdown")){
    fi.values=["All"].concat(fi.values)
  }
}
filterFreeGraph.prototype.changeValues_backup=function (){
  var fi=this,field;  
    field=document.getElementById(fi.name.replaceAll("/",""))
    valuesFilter=fi.values

    while (field.options.length > 0) {
      field.remove(0);
    }
    
    for (let i = 0; i < valuesFilter.length; i++) {
      var option = document.createElement("option");
      option.value = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
      option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
      field.appendChild(option);
    }
  
}
filterFreeGraph.prototype.checkVisibility=function (){
  var fi=this,values=[]
  if((fi.values[0]=="")|(fi.values.length==0)){
    fi.hide()
  }else{
    fi.show()
  }
}
filterFreeGraph.prototype.hide=function (){
  var fi=this;
  document.getElementById(fi.name+"_root").parentNode.style.display = 'none'

  classFilterObject=classesFilterList.filter(c => c.name==fi.classFilterName)[0]

  classFilterObject.checkVisibility()
}

filterFreeGraph.prototype.show=function (){
  var fi=this;

  document.getElementById(fi.name+"_root").parentNode.style.display = 'block'
  classFilterObject=classesFilterList.filter(c => c.name==fi.classFilterName)[0]
  classFilterObject.checkVisibility()
}
classFreeGraph = function (_name) {
    this.name = _name;
    this.init();
  };
  
classFreeGraph.prototype.init = function () {
    var cf=this;

    cf.html=d3.select(".controls").append("div")
        .attr("class","m-2 px-4 py-2 border-b border-gray-600 bg-white shadow sm:px-6 classFilter")

    cf.html
    .append("div")
    .attr("class","content-center")
    .append("a")
    .attr("href", "#")
    .append("img")
    .attr("class","mx-auto filter-icon")
    .attr("src","images/filter_cross.svg")
    .attr("width","40")
    .attr("height","40")
    .attr("title","click to clear filters")
    .attr("onclick","clearFiltersFreeGraph(this)")
    .style("display",'none')

    cf.html.append("div")
        .attr("class","limit classLabel border border-transparent mt-3 rounded-md bg-gray-300")
        .append("h3")
        .attr("class","rounded-md container mx-auto py-3 text-xss font-medium leading-6 text-gray-600")
        .text(cf.name)
        
    cf.html=cf.html
        .append("div")
        .attr("class","py-3 className")
        .attr("id",cf.name.replaceAll("/","")+"_filters")
  }

classFreeGraph.prototype.checkVisibility = function () {  
  var cf=this;
  cf.notEmpty=false;
  filtersList.filter(f => f.classFilterName==cf.name).map(p=>p.values).forEach(function(d){
    if((d!="")&(d!=[""])){
      cf.notEmpty=true
    }
  })
  if(!cf.notEmpty){
    cf.hide()
  }else{
    cf.show()
  }
  
}
classFreeGraph.prototype.hide = function () {  
  var cf=this;

  cf.html.node().parentNode.style.display = 'none'
}
classFreeGraph.prototype.show = function () {  
  var cf=this;
  cf.html.node().parentNode.style.display = 'block'
}
