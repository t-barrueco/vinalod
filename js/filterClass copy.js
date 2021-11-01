filter = function ( _classFilterName, _property, _filterType,_parent) {
    this.property = _property;
    this.filterType = _filterType;
    this.classFilterName = _classFilterName
    this.parent=_parent
    this.init();
  };
  
  /////////////////// initVis Method //////////////////////
  
filter.prototype.init = function () {
  var fi=this;
  //fi.values=getValuesFilterVisibleNodes()
  //////////////////////console.log("pasa por aquí")
  fi.getValuesFilterVisibleNodes()
  fi.addHtml()
  //fi.checkVisibility()
  }

filter.prototype.getValuesFilterVisibleNodes=function (){
  var fi=this,values=[]
  // get all values from property in data
  ////////////////////////console.log("pasa por aquí también")
  networkGraph.data["nodes"].forEach(function(d){
    //getKeyByValue(nodesClassesCorrespondence,classFilter) gets class name from code, having class name showed to the user
    
    if(d["class"]==fi.classFilterName){
      ////////////////////////console.log(d)
      values.push(d[fi.property])
    }
  })
  values=[...new Set(values)].sort()
  fi.values=values
  //////////////////////console.log(fi.values.length)
  //////////////////////console.log(fi.filterType)

  /// VER SI TIENE EL INCLUIDO ALL PARA ASIGNARLO A FI.ALL
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
        ////////////////////////////////////////////////////////console.log(c)
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
    //////////////////////////////////console.log(fi)
    //////////////////////////////////console.log(fi.filterType)
    //////////////////////////console.log("addHtml")
    //////////////////////////console.log(fi)
    //fi.getValuesFilterVisibleNodes
    var div = document.createElement("div");
    div.className="relative"
    div.id=property.replaceAll(" ","_")+"_root"
    fi.id=fi.property.replaceAll(" ","_");
    fi.htmlEl=document.getElementById(fi.id)
    
    if(fi.filterType=="dropdown"){
      ////////////////////////////////////////////////////////////////////////////////////console.log("entra en dropdown")
      /* if (fi.all&(fi.valuesFilter.length>1)){
        valuesFilter=["All"].concat(valuesFilter)
      } */

      addDropdown("dropdown",div)
  
/*       //////////////////////////////////console.log(fi.classFilter)
      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(select);// */
    }
    else if (fi.filterType=="date"){
      //////////////////////////console.log(div)
      addDropdown("dropdown_date",div)
      addDate(div)

        
    }else if (fi.filterType=="date_range"){
  
      addDateRange(div)
 
    }else if (filterType=="text"){
      //////////////////console.log(fi)
      addText(div)
    
    }else if (filterType=="between_numbers"){ 
      addBetweenNumbers()
      
    }else if (filterType=="number"){
      
      addNumber(div)
    }
    //document.getElementById(fi.classFilterName+"_filters")
    //fi.htmlEl=document.getElementById(fi.classFilterName+"_filters")
    
    fi.mainHtmlEl=div

    if(document.getElementById(fi.id+"_selection")){
      fi.selection=document.getElementById(fi.id+"_selection")
    }else{
      fi.selection="none"
    }
    //////////////////////////console.log(fi)
    
    function addDropdown(dropdownType,div){
      //////////////////////////console.log(div)
      //var div = document.createElement("div");
      ////////////////////////////////////console.log(fi)
      //div.className="relative"
      //div.id=property.replaceAll(" ","_")+"_root"
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
        //////////////////////////////////console.log("entra en dropdown number")
        valuesFilter=["greater than","smaller than","equal to","number range"]
        internalValuesFilter=["<",">","==","<>"]
        select.className="w-full h-10 pl-3 pr-6 text-base bg-gray-200 border rounded-lg appearance-none focus:shadow-outline"
        select.setAttribute("onchange",'changeHtmlFilter(this,"'+fi.classFilterName+'")');
        select.id+="_selection"  
      }else{
        //////////////////////console.log(fi.values)
        valuesFilter=fi.values
        internalValuesFilter=fi.values
        select.className="w-full h-10 pl-3 pr-6 text-base border rounded-lg appearance-none focus:shadow-outline " + fi.classFilterName +"_filter"
        //select.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'dropdown','')"); 
        select.setAttribute("onchange","applyFilter(this)"); 
      }
      
      //for (const val of valuesFilter) {
      for (let i = 0; i < valuesFilter.length; i++) {
        var option = document.createElement("option");
        option.value = internalValuesFilter[i];
        option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        select.appendChild(option);
      }
      //select.value = valuesFilter[0];
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
/*   
      document.getElementById(fi.classFilterName+"_filters").appendChild(label);
      document.getElementById(fi.classFilterName+"_filters").appendChild(div).appendChild(select);// */
  
      //////////////////////////console.log(fi.classFilterName)
      //////////////////////////console.log(div)
      var root=document.getElementById(fi.classFilterName+"_filters").appendChild(div)
      root.appendChild(label);
      root.appendChild(select);//
  
    } 
    function addDate(div){
/*       var div = document.createElement("div");
      div.className="relative"
      div.id=property.replaceAll(" ","_")+"_root" */
  
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
      //////////////////////////////////console.log(fi.classFilterName)
      //document.getElementById(fi.classFilterName+"_filters").appendChild(label);
      var root=document.getElementById(fi.classFilterName+"_filters").appendChild(div)
      root.appendChild(label);
      root.appendChild(dateInput);
      //document.getElementById(fi.classFilterName+"_filters").appendChild(div).appendChild(dateInput);
  
    }
    
    function addText(div){
      var label = document.createElement("label");

      //              <div class="search-form form-group box" style="margin-bottom: 0px;"">
      //<div class="input-search autocomplete">
      //<input id="termSearch" type="text" name="termCategoriesSearch" class="form-control" onfocus="this.value=''" placeholder="Type category...">
    //</div>
        //b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
        //  inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
        //  closeAllLists();
      //});

      label.innerHTML = fi.property.split("_")[1]
      label.htmlFor = fi.property.split("_")[1];
      label.id= fi.property.replaceAll(" ","_")+"_label";
      label.className="block mb-2 text-base font-light text-gray-700"
      
      var div = document.createElement("div");
      div.className="relative"
      //div.id=fi.property.replaceAll(" ","_")+"_root"
  
      var textInput = document.createElement("input");
      textInput.name = fi.property;
      textInput.id = fi.property.replaceAll(" ","_");
      textInput.type="text"
      textInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      textInput.placeholder='Enter Text'
      textInput.setAttribute("onKeyDown","textEnter(this,event)"); 
/*       .on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            // Do something
        }
    }); */
      document.getElementById(fi.classFilterName+"_filters").appendChild(label);
      document.getElementById(fi.classFilterName+"_filters").appendChild(div).appendChild(textInput);
  
      //var classFilterOrig=getKeyByValue(nodesClassesCorrespondence, fi.classFilterName)
      //////////////////console.log(nodesClassesCorrespondence)
      ////////////////console.log(fi.classFilterName)
      //////////////////console.log(classFilterOrig)
      docs=document.getElementsByClassName(fi.classFilterName)

      var searchValues=[]
      for (let d of docs) {
          searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
      }
      //////////////////console.log(fi)
      //////////////////console.log(document.getElementById(fi.id))
      ////////////////console.log(searchValues)
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
      //div.id=fi.property.replaceAll(" ","_")+"_root"
  
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

/* filter.prototype.getValuesFilterVisibleNodes=function (){
  var fi=this,values=[]
  // get all values from property in data
  networkGraph.data["nodes"].forEach(function(d){
    //getKeyByValue(nodesClassesCorrespondence,classFilter) gets class name from code, having class name showed to the user
    
    if(d["class"]==fi.classFilterName){
      values.push(d[fi.property])
    }
  })
  values=[...new Set(values)].sort()
  fi.values=values
  /// VER SI TIENE EL INCLUIDO ALL PARA ASIGNARLO A FI.ALL
  if (fi.all&(fi.values.length>1)&(fi.filterType=="dropdown")){
    fi.valuesFilter=["All"].concat(fi.values)
  }
} */
filter.prototype.changeValues=function (){
  var fi=this,field;  
  if (fi.filterType=="dropdown"){
    //selectBox.removeChild(selectBox.options[0]);
    field=document.getElementById(fi.id)
    valuesFilter=fi.values
    ////////////////////////console.log(field.options)
    //options=field.options
    while (field.options.length > 0) {
      field.remove(0);
    }
    
    for (let i = 0; i < valuesFilter.length; i++) {
      var option = document.createElement("option");
      option.value = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
      option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
      field.appendChild(option);
    }
/*     for (let i = 0; i < field.options.length; i++) {
      //////////////////////console.log(fi.values)
      if(!fi.values.includes(field.options[i].value)){
        field.removeChild(field.options[i]);
      }
    } */
  }
}
filter.prototype.checkVisibility=function (){
  var fi=this,values=[]
  // get all values from property in data
  //////////////////console.log(fi.property)
  //////////////////console.log(fi.values)
  if((fi.values[0]=="")|(fi.values.length==0)){
    fi.hide()
  }else{
    ////////////////////console.log("show")
    fi.show()
  }
}
filter.prototype.hide=function (){
  var fi=this;
  document.getElementById(fi.id+"_root").parentNode.style.display = 'none'
  //document.getElementById(fi.id+"_label").parentNode.style.display = 'none'
  
  classFilterObject=classesFilterList.filter(c => c.name==classFilter)[0]
  classFilterObject.checkVisibility()
}
filter.prototype.hideJustField=function(){
  var fi=this;
  document.getElementById(fi.id).style.display = 'none'
  //document.getElementById(fi.id+"_label").style.display = 'none'
}
filter.prototype.show=function (){
  var fi=this;
  document.getElementById(fi.id).parentNode.style.display = 'block'
  document.getElementById(fi.id+"_label").parentNode.style.display = 'block'
  classFilterObject=classesFilterList.filter(c => c.name==fi.classFilterName)[0]
  classFilterObject.checkVisibility()

  //if(hideClassFilter(property.split("_")[0])){
  //  document.getElementById(property).parentNode.parentNode.parentNode.style.display = 'none'
  //}
}
filter.prototype.changeHtml = function () {
  var fi=this,value;
  value=document.getElementById(fi.id+"_selection").value
  ////////////////////////////console.log(selElement.value)
  ////////////////////console.log("changeHtml")
  if((value=="<>")&(fi.filterType=="date")){
    //id=element.id.replace("_selection","")
    //////////////////////////console.log(fi.mainHtmlEl)
    //dateField=document.getElementById(element.id.replace("_selection",""))
    fi.htmlEl.style.display = "none";
    document.getElementById(fi.id+"_label").style.display = "none";
    //fi.property.split("_")[1]
    ////////////////////////////console.log(fi.htmlEl)
    //////////////////////////console.log(!document.getElementById(fi.id+"_start"))
    if(!document.getElementById(fi.id+"_start")){
      addDateRange()
    }else{
      document.getElementById(fi.id+"_start_label").style.display = "block";
      document.getElementById(fi.id+"_start").style.display = "block";
      document.getElementById(fi.id+"_end_label").style.display = "block";
      document.getElementById(fi.id+"_end").style.display = "block";
    }
    //addFilterType("date_range","",dateField.id.replace(id+"_start",id+"_end"),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)
   // APPLY FILTER!!!!!
   //!!!!!!!!!!!!!!!!!!!!
/*     if((document.getElementById(element.id.replace("_dates_selection","_start")).value!="")&(document.getElementById(element.id.replace("_dates_selection","_end")).value!="")){
      applyFilter([document.getElementById(element.id.replace("_dates_selection","_start")).value],document.getElementById(element.id.replace("_dates_selection","_start")).id,'date','<')
      applyFilter([document.getElementById(element.id.replace("_dates_selection","_end")).value],document.getElementById(element.id.replace("_dates_selection","_end")).id,'date','>')  
    } */
    ////////////////////////console.log(fi.htmlEl.value)
    //applyFilter(fi.htmlEl)
    fi.htmlEl.value=""
    //applyFilter(fi.htmlEl)
  }else if(((value=="<")|(value==">"))&(fi.filterType=="date")){

    if(document.getElementById(fi.id+"_start")){
      document.getElementById(fi.id+"_label").style.display = "block";
      document.getElementById(fi.id).style.display = "block";
      document.getElementById(fi.id+"_start_label").style.display = "none";
      document.getElementById(fi.id+"_start").style.display = "none";
      document.getElementById(fi.id+"_end_label").style.display = "none";
      document.getElementById(fi.id+"_end").style.display = "none";
    }
/*     dateField=document.getElementById(element.id.replace("_dates_selection","_start"))
    if (dateField){
      label=document.getElementById(element.id.replace("_dates_selection","_start_label"))
      dateField.id=dateField.id.replace("_start","")
      label.id=label.id.replace("_start","")
      label.innerHTML=label.innerHTML.replace(" start","")
      label.htmlFor=label.htmlFor.replace(" start","")
      d3.select("#"+element.id.replace("_dates_selection","_end")).remove()
      d3.select("#"+element.id.replace("_dates_selection","_end_label")).remove()
      dateFieldVal=dateField
    }else{
      dateFieldVal=document.getElementById(element.id.replace("_dates_selection",""))
    } */
    //////////////////////////////////////////////////////////////////console.log(dateFieldVal.value)
    //dateFieldVal.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','')"); 

    //if(fi.htmlEl.value!=""){
      applyFilter(fi.htmlEl)
    //}
  }else if((value=="<>")&(fi.filterType=="number")){
/*     document.getElementById(element.id.replace("_selection","")).parentNode.style.display = 'none';
    document.getElementById(element.id.replace("_selection","_label")).style.display = 'none'; */
    fi.hideJustField()
    //if(document.getElementById(element.id.replace("_selection","_filter"))){
      ////////////////////////////////////////////////////////////////////////////////console.log(document.getElementById(element.id.replace("_selection","_between")).parentNode)
    //  document.getElementById(element.id.replace("_selection","_filter")).parentNode.style.display = 'block';
    //  document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'block';
    //}else{
      //addFilterType("between_numbers","",element.id.replace("_selection",""),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)
      if(document.getElementById(fi.id+"_filter")){
        document.getElementById(fi.id+"_filter").parentNode.style.display = 'block';
      }else{
        ////////////////////console.log("addBetweenNumbers")
        addBetweenNumbers()
      }
    //}
  }else if(((value=="<")|(value==">")|(value=="=="))&(fi.filterType=="number")){
    ////////////////////console.log("entra en igual")
    fi.htmlEl.style.display = 'block';
    //document.getElementById(element.id.replace("_selection","_label")).style.display = 'block';
    if(document.getElementById(fi.id+"_filter")){
      document.getElementById(fi.id+"_filter").parentNode.style.display = 'none';
    }
    applyFilter(fi.htmlEl)
    //////////////////////////////////////////////////////////////////////console.log(document.getElementById(element.id.replace("_selection","_between")))
/*     if(document.getElementById(element.id.replace("_selection","_filter"))){
      document.getElementById(element.id.replace("_selection","_filter")).parentNode.style.display = 'none';
      document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'none';
    } */
    //////////////////////////////////////////////////console.log(document.getElementById(element.id).getAttribute("id"))
    //filterAllFields(document.getElementById(element.id).getAttribute("id").replace("_selection",""))
    //applyFilter(document.getElementById(element.id.replace("_selection","")),"number","")
  }
 //} 
  function addDateRange(){
    // START FIELD
    /* dateField.id+="_start"
    dateField.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','<>')"); 
    label=d3.select("#"+element.id.replace("_selection","_label"))
    label=document.getElementById(element.id.replace("_selection","")+"_label")
    label.innerHTML += " start"
    label.htmlFor+=" start"
    label.id=label.id.replace("label","start_label")
    document.getElementById(element.id.replace("_selection","")) */


    //var div = document.createElement("div");
    //div.className="relative"
    //div.id=property.replaceAll(" ","_")+"_root"
    //////////////////////////console.log(fi)

    var dateInput = document.createElement("input");
    dateInput.name = fi.id+"_start";
    ////////////////////////////////////////////////////////////////////console.log(property)
    dateInput.id = fi.id+"_start";
    ////////////////////////////////////////////////////////////////////console.log(dateInput.id)
    dateInput.type="date"
    dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, fi.classFilterName) +"_filter"
    //dateInput.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'"+getKeyByValue(nodesClassesCorrespondence, classFilter)+"')"); 
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
    ////////////////////////////////////////////////////////////////////console.log(property)
    dateInput.id = fi.id+"_end";
    ////////////////////////////////////////////////////////////////////console.log(dateInput.id)
    dateInput.type="date"
    dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, fi.classFilterName) +"_filter"
    //dateInput.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'"+getKeyByValue(nodesClassesCorrespondence, classFilter)+"')"); 
    dateInput.setAttribute("onchange","applyFilter(this)"); 

    var label = document.createElement("label");
    label.innerHTML = fi.property.split("_")[1] + " End"
    label.htmlFor = fi.property.split("_")[1] + " End"
    label.id=dateInput.id+"_label"
    label.className="block mb-2 text-base font-light text-gray-700"
    //insertAfter(label, d3.select("#"+fi.property.replace("_end","_start")).node().parentNode)
    //throw new Error("Something went badly wrong!");
    fi.mainHtmlEl.appendChild(label)
    fi.mainHtmlEl.appendChild(dateInput)
    //insertAfter(div,label)
    //div.appendChild(dateInput)
  }
  function addBetweenNumbers(){
    var div = document.createElement("div");
    div.className="relative"
    //div.id=property.replaceAll(" ","_")+"_root"

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

/*     var label = document.createElement("label");
    label.innerHTML = fi.property.replace(getKeyByValue(nodesClassesCorrespondence, fi.classFilterName)+"_","").replaceAll("_"," ") + " range"
    label.htmlFor = fi.property.replace(getKeyByValue(nodesClassesCorrespondence, fi.classFilterName)+"_","").replaceAll("_"," ")+ " range"
    label.id=fi.property+"_between_label"
    label.className="block mb-2 text-base font-light text-gray-700" */

    //divEl=document.getElementById(fi.classFilterName+"_filters")
    //divEl.appendChild(label)
    //divEl=document.getElementById(fi.id+"_root")
    //divEl.appendChild(label)
    var label=document.getElementById(fi.id+"_label")
    
    //var nestedDiv1=divEl.appendChild(betNumbersInput).appendChild(betNumbersInput2)
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
    //document.getElementById(fi.id+"_root").appendChild(label).appendChild(nestedDiv1)
    //fi.mainHtmlEl.appendChild(dateInput)
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
      //f.operator="<>"
/*     }else{
      if(document.getElementById(fi.id+"_selection").value=="<"){
        f.operator="<"
      }else if (document.getElementById(f.property+"_selection").value==">"){
        f.operator=">"
      }else if (document.getElementById(f.property+"_selection").value=="==")
        f.operator="=="
    } */
  }else if(fi.filterType=="date"){
    //////////////////////console.log(fi.selection.value)
    if(fi.selection.value=="<>"){
      //////////////////////////////////////////////////////////console.log(d3.select("#"+f.property+"_start").node().value)
      values.push(d3.select("#"+fi.property+"_start").node().value)
      //////////////////////////////////////////////////////////console.log(d3.select("#"+f.property+"_end").node().value)
      values.push(d3.select("#"+fi.property+"_end").node().value)
      //valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"<>","allValues":allValues,"parentFilter":parent})
    /* }else{
      //////////////////////////////////////////////////////////console.log(f.property)
      //////////////////////////////////////////////////////////console.log(f.property+"_dates_selection")
      values=[document.getElementById(f.property).value]
      if(document.getElementById(f.property+"_dates_selection").value=="<"){
        valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"<","allValues":allValues,"parentFilter":parent})
      }else if (document.getElementById(f.property+"_dates_selection").value==">"){
        valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":">","allValues":allValues,"parentFilter":parent})
      } */
      fi.valuesField=values
    }else{
      fi.valuesField=[document.getElementById(fi.id).value]
    }
  /* }else{
    //document.getElementById(f.property).value
    values=[document.getElementById(f.property).value]
    valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"==","allValues":allValues,"parentFilter":parent}) */
    
  }else{
    //////////////////////console.log(fi.id)
    //////////////////////console.log(document.getElementById(fi.id))
    fi.valuesField=[document.getElementById(fi.id).value]
  }
  //////////////////////console.log(fi.valuesField)
  //fi.checkVisibility()
  //fi.getValuesFilterVisibleNodes()

/*   networkGraph.treeData.forEach(function(t){
    parentHidden=false
    ////////////////////////////////////////////////console.log(t)
    ////////////////////////////////////////////////console.log(hiddenNodes)
    if(hiddenNodes.includes(t.id)){
      t.hidden=true
      parentHidden=true
    }else{
      //if(check_one_filter(t,filters,classFilter,property)){
      if(check_filters(t,filters)){
        t.hidden=true
        parentHidden=true
        if(!hiddenNodes.includes(t.id)){
          hiddenNodes.push(t.id)
        }
        ////////////////////////////////////////////////console.log(t)
        ////////////////////////////////////////////////console.log(hiddenNodes)
      }else{
        delete t.hidden
      }
    }
    
    if(t.children!=undefined){
      t.children.forEach(function(v){
        //////////////////////////////////////console.log(v)
        //////////////////////////////////////console.log(parentHidden)
        if(parentHidden){
          v["hidden"]=true
          if(!hiddenNodes.includes(v.id)){
            hiddenNodes.push(v.id)
          }
        }else{
          //if(check_one_filter(v,filters,classFilter,property)){
          if(check_filters(v,filters)){  
            //////////////////////////////////////console.log("hidden true segun filters")
            //////////////////////////////////////////////console.log(v)
            v["hidden"]=true
            if(!hiddenNodes.includes(v.id)){
              hiddenNodes.push(v.id)
            }
          }else{
            delete v.hidden
          }
        }
        
      })
    }
    
  }) */
  ////////////////console.log(fi.valuesField)
}
filter.prototype.filterText=function(node){
  var fi=this,hidden=false;
  ////////////////console.log(node[fi.property])
  ////////////////console.log(fi.valuesField[0])
  ////////////////console.log(node[fi.property].indexOf(fi.valuesField[0]))
  if ((node[fi.property].toLowerCase()).indexOf(fi.valuesField[0].toLowerCase()) !== -1){
    hidden=false
  }else{
    hidden=true
  }
  return hidden
}
filter.prototype.filterNumber=function(node){
  var fi=this,hidden=false;
  ////////////////////console.log(fi.valuesField)
  if(fi.valuesField[0]==""){
    hidden=false;
  }else{
    ////////////////////console.log(fi.selection.value)
    if(fi.selection.value=="<>"){
      if(eval(fi.valuesField[0] +"<"+ node[fi.property]) & eval(fi.valuesField[1]+">"+node[fi.property])){
          hidden=false
      }else{
          hidden=true
      }
    }else{
      ////////////////////console.log(fi.valuesField[0]+fi.selection.value+node[fi.property])
      ////////////////////console.log(eval(fi.valuesField[0]+fi.selection.value+node[fi.property]))
      if(eval(fi.valuesField[0]+fi.selection.value+node[fi.property])){
        hidden=false
      }else{
        hidden=true
      }
      ////////////////////console.log(hidden)
    }
  }

  return hidden
}
filter.prototype.filterDropdown=function(node){
  var fi=this,hidden=false;
  //////////////////////////////////////////////////////////////console.log(node[f.property])
  //////////////////////////////////////////////////////////////console.log(f.values)
  ////////////////////////////////////////////////////////////////console.log(f.values.includes(node[f.property]))
  if(fi.valuesField.includes("All")){
    if(node["hidden"]){
      hidden=false
    }
  }else if(!fi.valuesField.includes(node[fi.property])){
      hidden=true
  }else{
      hidden=false
  }
  //////////////////////////////////////////////////////////////console.log(hidden)
  return hidden
}
filter.prototype.filterDate=function(node){
  var fi=this,hidden=false;

  if(fi.valuesField[0]==""){
    hidden=false
  }else{
    ////////////////////////console.log(fi.selection.value)
    if(fi.selection.value=="<>"){
      //////////////////////console.log("new Date('"+fi.valuesField[0]+"') < new Date('"+node[fi.property]+"')")
      //////////////////////console.log(eval("new Date('"+fi.valuesField[0]+"') < new Date('"+node[fi.property]+"')"))
      //////////////////////console.log("new Date('"+fi.valuesField[1]+"') > new Date('"+node[fi.property]+"')")
      //////////////////////console.log(eval("new Date('"+fi.valuesField[1]+"') > new Date('"+node[fi.property]+"')"))
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
      //////////////////////console.log("new Date('"+fi.valuesField+"')"+fi.selection.value+"new Date('"+node[fi.property]+"')")
      //////////////////////console.log(eval("new Date('"+fi.valuesField+"')"+fi.selection.value+"new Date('"+node[fi.property]+"')"))
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
    //this.data = _data;
    //this.forces = _forces
    this.init();
  };
    
classFilterClass.prototype.init = function () {
    var cf=this;
    ////////////////////////////////console.log("entra en classFilter")
    ////////////////////////////////console.log(cf)
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
    .attr("class","mx-auto")
    .attr("src","/images/filter_cross.svg")
    .attr("width","40")
    .attr("height","40")
    .attr("title","click to clear filters")
    .attr("onclick","clearFilters(this)")
/*     .append("text")
    .text("prueba"); */

/*     <img alt="Qries" src="/images/filter.svg"
                     width="150" height="70"> */
    //width="500" height="600"
    //<img src="kiwi.svg" alt="Kiwi standing on oval">
    //<img src="https://www.w3schools.com/images/w3schools_green.jpg" alt="W3Schools.com"> 

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
  ////////////////////////////console.log(filtersList.filter(f => f.classFilterName==cf.name).map(p=>p.values))
  filtersList.filter(f => f.classFilterName==cf.name).map(p=>p.values).forEach(function(d){
    //////////////////////////console.log(d)
    if((d!="")&(d!=[""])){
      //////////////////////////console.log("distinto de empty")
      cf.notEmpty=true
    }
  })
  //////////////////////////console.log(cf)
  if(!cf.notEmpty){
    //////////////////////////console.log(cf.mainHtmlEl.node())
    cf.hide()
  }else{
    cf.show()
  }
  
  //if()
}
classFilterClass.prototype.hide = function () {  
  var cf=this;
  cf.mainHtmlEl.style("display","none")
}
classFilterClass.prototype.show = function () {  
  var cf=this;
  cf.mainHtmlEl.style("display","block")
}

filterFreeGraph = function (_name,_nodeType,_filterType,_classFilterName) {
  this.name = _name.replaceAll("/","");
  this.nodeType=_nodeType
  this.filterType=_filterType
  this.classFilterName=_classFilterName
  //this.data = _data;
  //this.forces = _forces
  this.init();
};
filterFreeGraph.prototype.init = function () {
  var fi=this;
  fi.getValues()
  fi.addHtml()
  }
filterFreeGraph.prototype.getValues = function () {
    var fi=this,values=["All"];
    ////////console.log(networkGraph.data)
    //console.log(fi.classFilterName)
    if(fi.nodeType=="property"){
      networkGraph.data.links.forEach(function(l){
        //console.log(l)
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
    fi.values=values
}
filterFreeGraph.prototype.resetValues = function () {
  var fi=this,values=["All"];
  ////////console.log(networkGraph.data)

  if(fi.nodeType=="property"){
    networkGraph.allData.links.forEach(function(l){
      if(!values.includes(l["value"])){
        values.push(l["value"])
      }
    })
  }else if(fi.nodeType=="nodeType"){
    networkGraph.allData.links.forEach(function(l){
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
  fi.values=values
}
filterFreeGraph.prototype.addHtml = function () {
    var fi=this;
    var div = document.createElement("div");
    div.className="relative"
    ////console.log(fi.classFilterName)
    ////console.log(fi.name)
    div.id=fi.name.replaceAll("/","")+"_root"
    
    var select = document.createElement("select");
    select.name = fi.name.replaceAll("/","");
    select.id = fi.name.replaceAll("/","");
    select.setAttribute("nodeType",fi.nodeType)
    select.setAttribute("classFilterName",fi.classFilterName)
    if (fi.filterType=="dropdown_multiple"){
      select.setAttribute('multiple', true);
    }    
  
    ////////console.log(fi)
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
    // get all values from property in data
    ////////////////////////console.log("pasa por aquí también")
    
    networkGraph.data["links"].forEach(function(d){
      //getKeyByValue(nodesClassesCorrespondence,classFilter) gets class name from code, having class name showed to the user
      
      //fi.nodeTypeif(d["class"]==fi.classFilterName){
        ////////////////////////console.log(d)
      //////////console.log(d)
      //console.log(fi.nodeType)
      if (fi.nodeType=="property"){
        values.push(d["value"])
      }else{
        values.push(d["target"]["type"])
      }
      
      //}
    })
    values=[...new Set(values)].sort()
    fi.values=values
    //////////////////////console.log(fi.values.length)
    //////////////////////console.log(fi.filterType)
  
    /// VER SI TIENE EL INCLUIDO ALL PARA ASIGNARLO A FI.ALL
    if ((fi.values.length>1)&(fi.filterType=="dropdown")){
      fi.values=["All"].concat(fi.values)
    }
  }
filterFreeGraph.prototype.changeValues=function (){
    var fi=this,field;  
      //selectBox.removeChild(selectBox.options[0]);
      field=document.getElementById(fi.name.replaceAll("/",""))
      ////console.log(fi.values)
      valuesFilter=fi.values
      //////////console.log(field)
      //options=field.options
      while (field.options.length > 0) {
        field.remove(0);
      }
      
      for (let i = 0; i < valuesFilter.length; i++) {
        var option = document.createElement("option");
        option.value = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        field.appendChild(option);
      }
  /*     for (let i = 0; i < field.options.length; i++) {
        //////////////////////console.log(fi.values)
        if(!fi.values.includes(field.options[i].value)){
          field.removeChild(field.options[i]);
        }
      } */
}

classFreeGraph = function (_name) {
    this.name = _name;
    ////////console.log(this.name)
    //this.data = _data;
    //this.forces = _forces
    this.init();
  };
  
classFreeGraph.prototype.init = function () {
    var cf=this;
    ////////////////////////////////console.log("entra en classFilter")
    ////////console.log(cf)
    cf.html=d3.select(".controls").append("div")
        .attr("class","m-2 px-4 py-2 border-b border-gray-600 bg-white shadow sm:px-6 classFilter")

    cf.html
    .append("div")
    .attr("class","content-center")
    .append("a")
    .attr("href", "#")
    .append("img")
    .attr("class","mx-auto filter-icon")
    .attr("src","/images/filter_cross.svg")
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
  ////////////////////////////console.log(filtersList.filter(f => f.classFilterName==cf.name).map(p=>p.values))
  filtersList.filter(f => f.classFilterName==cf.name).map(p=>p.values).forEach(function(d){
    //////////////////////////console.log(d)
    if((d!="")&(d!=[""])){
      //////////////////////////console.log("distinto de empty")
      cf.notEmpty=true
    }
  })
  //////////////////////////console.log(cf)
  if(!cf.notEmpty){
    //////////////////////////console.log(cf.mainHtmlEl.node())
    cf.hide()
  }else{
    cf.show()
  }
  
  //if()
}
classFreeGraph.prototype.hide = function () {  
  var cf=this;
  cf.mainHtmlEl.style("display","none")
}
classFreeGraph.prototype.show = function () {  
  var cf=this;
  cf.mainHtmlEl.style("display","block")
}
