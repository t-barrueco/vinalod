filter = function ( _classFilterName, _property, _filterType,_filterText,_parent,_bubbleId) {
    this.property = _property;
    this.filterType = _filterType;
    this.filterText = _filterText;
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
      //CAMBIAR PORQUE LO HE PUESTO EVENTUAL
      if(d[fi.property]!=undefined){
        values.push(d[fi.property].toLowerCase())
      }
      
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
    fi.propertyFullName=configRow.rowFields.properties.filter(d=>d.property==fi.property)[0]["property_name"].replace(networkGraph.nodesClassesShow[fi.classFilterName],"").trim()
    console.log(fi.propertyFullName)
    
    if(fi.filterType=="dropdown"){

      addDropdown()

    }
    else if (fi.filterType=="date"){
      //addDropdown("dropdown_date",div)
      console.log("add date")
      addDate()

        
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
    
    async function addDropdown(){
      var optionsMenuHtml,html

/*       let use=document.createElement("use")
      use.setAttribute("xlink:href","/component-library/dist/media/icons.ccfd2174.svg#corner-arrow")

      let svg=document.createElement("svg")
      svg.setAttribute("class","ecl-icon ecl-icon--s ecl-icon--rotate-180 ecl-select__icon-shape")
      svg.setAttribute("focusable","false")
      svg.setAttribute("aria-hidden","true")

      svg.appendChild(use)

      let div=document.createElement("div")
      
      div.setAttribute("class","ecl-select__icon")

      div.appendChild(svg)

      let select = document.createElement("select");
      select.name = fi.property;
      select.id = fi.property.replaceAll(" ","_");
      select.setAttribute("required","");
      select.className="ecl-select"
      select.setAttribute("onchange","applyFilter(this)"); 

      //if (fi.filterType=="dropdown_multiple"){
      //  select.setAttribute('multiple', true);
      //}  
      
      let valuesFilter=fi.values
      let internalValuesFilter=fi.values

      for (let i = 0; i < valuesFilter.length; i++) {
        var option = document.createElement("option");
        option.value = internalValuesFilter[i];
        option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        select.appendChild(option);
      }
      
      select.value = internalValuesFilter[0];

      let div2=document.createElement("div")
      
      div2.setAttribute("class","ecl-select__container ecl-select__container--m")
      div2.appendChild(select)
      div2.appendChild(div)

      let div3
      if(fi.filterText!=""){
        console.log("entra")
        div3=document.createElement("div")
        div3.setAttribute("class","ecl-help-block")
        const text = document.createTextNode(fi.filterText);
        div3.appendChild(text);
      }

      let label=document.createElement("label")
      label.setAttribute("class","ecl-form-label")
      label.setAttribute("for",fi.property.replaceAll(" ","_")+"_label")
      label.innerHTML = fi.propertyFullName;

      let div4=document.createElement("div")
      div4.setAttribute("class","ecl-form-group")

      div4.appendChild(label);
      if(fi.filterText!=""){
        console.log("entra2")
        div4.appendChild(div3);
      }
      div4.appendChild(div2);

      document.getElementById(fi.classFilterName+"_filters").appendChild(div4) */
      
      await $.get("select-filter.html", function (data) {
        optionsMenuHtml=data
        console.log(fi.filterText)
        html=optionsMenuHtml.replace("Label",fi.property.split("_")[1]).replaceAll("HelperText",fi.filterText)
        $("#"+fi.classFilterName+"_filters").append($(html))
      });

      var select=document.getElementById("select-default")
      select.name = fi.property;
      select.id = fi.property.replaceAll(" ","_");
      select.setAttribute("onchange","applyFilter(this)"); 

      let valuesFilter=fi.values
      let internalValuesFilter=fi.values

      for (let i = 0; i < valuesFilter.length; i++) {
        var option = document.createElement("option");
        option.value = internalValuesFilter[i];
        option.text = valuesFilter[i].charAt(0).toUpperCase() + valuesFilter[i].slice(1);
        select.appendChild(option);
      }
      select.value = internalValuesFilter[0];

      /* var select = document.createElement("select");
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
        label.innerHTML=fi.propertyFullName + " Selection"
        label.htmlFor = fi.propertyFullName + " Selection"
      }
      
      label.className="block mb-2 text-base font-light text-gray-700"

      var root=document.getElementById(fi.classFilterName+"_filters").appendChild(div)
      root.appendChild(label);
      root.appendChild(select);//
   */
    } 
    async function addDate(){
      var optionsMenuHtml,html
/*       <div class="ecl-form-group"><label class="ecl-form-label" for="example-input-id-1">Label<span
      class="ecl-form-label__required">*</span></label>
      <div class="ecl-help-block">This is the input&#x27;s helper text.</div>
      <div class="ecl-datepicker"><input type="text" autoComplete="off" data-ecl-datepicker-toggle=""
      data-ecl-auto-init="Datepicker" id="example-input-id-1" name="example-input-id-1"
      class="ecl-datepicker__field ecl-text-input ecl-text-input--s" required="" placeholder="DD-MM-YYYY"
      value="dd-mm-yyyy" /><svg class="ecl-icon ecl-icon--s ecl-datepicker__icon" focusable="false" aria-hidden="true">
      <use xlink:href="/component-library/dist/media/icons.ccfd2174.svg#calendar"></use>
      </svg></div>
      </div> */
      //let div=
/*       let use=document.createElement("use")
      use.setAttribute("xlink:href","images/icons.svg#general--calendar")
      //use.setAttribute("x","20")
      //use.setAttribute("y","20")
      console.log(window.location.href)

      console.log(window.location.pathname)
      //use.setAttribute("xlink:href","../images/icons.svg#calendar")

      let svg=document.createElement("svg")
      svg.setAttribute("class","ecl-icon ecl-icon--s ecl-datepicker__icon")
      svg.setAttribute("focusable","false")
      //svg.setAttribute("viewBox","0 0 30 10")
      //svg.setAttribute("aria-hidden","true")

      svg.appendChild(use)

      let input=document.createElement("input")
      input.setAttribute("type","text")
      input.setAttribute("autoComplete","off")
      input.setAttribute("data-ecl-datepicker-toggle","")
      input.setAttribute("ata-ecl-auto-init","Datepicker")
      input.setAttribute("id",fi.property.replaceAll(" ","_")+"_label")
      input.setAttribute("name",fi.property.replaceAll(" ","_")+"_label")
      input.setAttribute("class","ecl-datepicker__field ecl-text-input ecl-text-input--s")
      input.setAttribute("required","")
      input.setAttribute("placeholder","DD-MM-YYYY")
      input.setAttribute("value","dd-mm-yyyy")

      let div=document.createElement("div")
      div.setAttribute("class","ecl-datepicker")

      div.appendChild(input)
      div.appendChild(svg)

      let div2
      if(fi.filterText!=""){
        console.log("entra")
        div2=document.createElement("div")
        div2.setAttribute("class","ecl-help-block")
        const text = document.createTextNode(fi.filterText);
        div2.appendChild(text);
      }


      let label=document.createElement("label")
      label.setAttribute("class","ecl-form-label")
      label.setAttribute("for",fi.property.replaceAll(" ","_")+"_label")
      label.innerHTML = fi.propertyFullName;

      let div3=document.createElement("div")
      div3.setAttribute("class","ecl-form-group")

      div3.appendChild(label);
      if(fi.filterText!=""){
        console.log("entra2")
        div3.appendChild(div2);
      }
      div3.appendChild(div); */

      


/*       var dateInput = document.createElement("input");
      dateInput.name = fi.property;
      dateInput.id = fi.property.replaceAll(" ","_");
      dateInput.type="date"
      dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + fi.classFilter +"_filter"
      //dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, fi.classFilter) +"_filter"
      dateInput.setAttribute("onchange","applyFilter(this)"); 
      console.log(fi)
      //networkGraph.nodesClassesShow[fi.classFilterName]
      var label = document.createElement("label");
      label.innerHTML = fi.propertyFullName;
      label.htmlFor = fi.propertyFullName;
      label.id = fi.property.replaceAll(" ","_")+"_label"
      label.className="block mb-2 text-base font-light text-gray-700" */
/*       console.log("append filter date")
      console.log(fi.classFilterName+"_filters")
      console.log(document)
      document.getElementById(fi.classFilterName+"_filters").appendChild(div3) */

      await $.get("date-filter.html", function (data) {
        optionsMenuHtml=data
        html=optionsMenuHtml.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.filterText)
        $("#"+fi.classFilterName+"_filters").append($(html))
      });
      /* var elt = document.querySelector('[data-ecl-datepicker-toggle]');
      var datepicker = new ECL.Datepicker(elt);
      datepicker.init(); */
      //root.appendChild(label);
      //root.appendChild(dateInput);  
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
      addDropdown()  
      
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
  //document.getElementById(fi.id+"_label").parentNode.style.display = 'block'
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
    //this.init()
    //await this.init();
  };
    
classFilterClass.prototype.init = async function () {
    var cf=this,optionsMenuHtml,html;

/*     let svg=document.createElement("svg")
    svg.setAttribute("class","ecl-icon ecl-icon--m ecl-accordion__toggle-icon")
    svg.setAttribute("focusable","false")
    svg.setAttribute("aria-hidden","true")
    svg.setAttribute("data-ecl-accordion-icon","")

    let use=document.createElement("use")
    use.setAttribute("xlink:href","images/icons.svg#ui--plus")
    //use.setAttribute("href","images/icons.svg#general--calendar")

    

    svg.appendChild(use)

    let span2=document.createElement("span")
    span2.setAttribute("class","ecl-accordion__toggle-indicator")

    let span3=document.createElement("span")
    span3.setAttribute("class","ecl-accordion__toggle-label")
    span3.textContent = "Open";

    span2.appendChild(span3)
    span2.appendChild(svg)
    
    let span4=document.createElement("span")
    span4.setAttribute("class","ecl-accordion__toggle-title") 
    span4.textContent = networkGraph.nodesClassesShow[cf.name];

    let span=document.createElement("span")
    span.setAttribute("class","ecl-accordion__toggle-flex")

    span.appendChild(span2)
    span.appendChild(span4)

    let button=document.createElement("button")
    button.setAttribute("type","button")
    button.setAttribute("class","ecl-accordion__toggle")
    button.setAttribute("data-ecl-accordion-toggle","")
    button.setAttribute("data-ecl-label-expanded","Close")
    button.setAttribute("data-ecl-label-collapsed","Open")
    button.setAttribute("aria-controls",cf.name+"_filters")
    //button.onclick = showHideFilter(this)
    //button.addEventListener("click", showHideFilter(this)); 
    button.onclick=showHideFilter
    button.appendChild(span)

    let h3=document.createElement("h3")
    h3.setAttribute("class","ecl-accordion__title")

    h3.appendChild(button)
    
    let div2=document.createElement("div")
    div2.setAttribute("class","ecl-accordion__content") 
    //div2.setAttribute("hidden","") 
    div2.setAttribute("id",cf.name+"_filters") 
    div2.setAttribute("role","region") 

    let div=document.createElement("div")
    div.setAttribute("class","ecl-accordion__item")
    
    div.appendChild(h3)
    div.appendChild(div2)

    document.getElementById("accordion-filters").appendChild(div) */

/*     $.get("filter-class-item.html", function (data) {
      optionsMenuHtml=data
      html=optionsMenuHtml.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
      $("#accordion-filters").append($(html))
    }); */
    //get_item()
    await $.get("filter-class-item.html", function (data) {
      optionsMenuHtml=data
      html=optionsMenuHtml.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
      $("#accordion-filters").append($(html))
    });
    console.log(document.getElementById(cf.name+"_filters"))

/*     async function get_item(){
      await $.get("filter-class-item.html", function (data) {
        optionsMenuHtml=data
        html=optionsMenuHtml.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
        $("#accordion-filters").append($(html))
      });
    } */
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
  //cf.mainHtmlEl.style("display","block")
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

    //console.log(networkGraph.data["links"])
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
