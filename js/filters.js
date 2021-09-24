function addFilters(filters,data){
    var property,filterType,classFilter,valuesFilter,controls,filtersInClass;

    // Example format for filters
    // OP Theme_Publication date-date;OP Theme_Theme name-text;OP Theme Main_Publication date-date;OP Theme Main_Publication number-number    
    ////////////////////////console.log(filters)
    filters.forEach(function(d){
      // property format example: corporateBody_country
      property=d["property"]
      filterType=d["filter_type"]
      // classFilter format example: OP Theme
      classFilter=d["property"].split("_")[0]
      //create class for filter if does not exist
      if (!classFilterHist.includes(classFilter)){
        controls=d3.select(".controls").append("div")
        .attr("class","m-2 px-4 py-2 border-b border-gray-600 bg-white shadow sm:px-6 classFilter")

        var titleColor=colorCorrespondence[colorScale(nodesClassesCorrespondence[classFilter])]

        controls.append("div")
        .attr("class","classLabel border border-transparent mt-3 rounded-md bg-"+ colorCorrespondence[colorScale(nodesClassesCorrespondence[classFilter])])
        .append("h3")
        .attr("class","rounded-md container mx-auto py-3 text-lg font-medium leading-6 text-"+titleColor.split("-")[0]+"-"+(parseInt(titleColor.split("-")[1])+300))
        .text(nodesClassesCorrespondence[classFilter])
        
        controls=controls
        .append("div")
        .attr("class","py-3")
        .attr("id",classFilter+"_filters")
        classFilterHist.push(classFilter)
      }else if(!propertiesFilterHist.includes(property)){
        controls=d3.select("#"+classFilter+"_filters")
      }
      valuesFilter=getValuesFilter(classFilter,property)
      ////////////////////////console.log(valuesFilter)
      
      if(propertiesFilterHist.includes(property)){
        addValuesToFilter(filterType,property,valuesFilter)
      }else{
        addFilterType(filterType,valuesFilter,property,classFilter,controls,true)
        propertiesFilterHist.push(property)
      }
      if(valuesFilter[0]==""){
        document.getElementById(property).parentNode.style.display = 'none'
        document.getElementById(property+"_label").parentNode.style.display = 'none'
        if(hideClassFilter(property.split("_")[0])){
          ////////////////////////console.log("entra")
          ////////////////////////console.log(document.getElementById(property).parentNode.parentNode)
          document.getElementById(property).parentNode.parentNode.parentNode.style.display = 'none'
        }
        //d3.select("#"+property).node().parentNode.style("display", "none") 
        //////////////////////////console.log(filtersInClass)
      }
      //check_values_filter()
    })
  }
  function check_values_filter(){
      if(valuesFilter[0]==""){
        document.getElementById(property).parentNode.style.display = 'none'
        document.getElementById(property+"_label").parentNode.style.display = 'none'
        if(hideClassFilter(property.split("_")[0])){
          ////////////////////////console.log("entra")
          ////////////////////////console.log(document.getElementById(property).parentNode.parentNode)
          document.getElementById(property).parentNode.parentNode.parentNode.style.display = 'none'
        }
        //d3.select("#"+property).node().parentNode.style("display", "none") 
        //////////////////////////console.log(filtersInClass)
      }
  }  

  function hideClassFilter(classFilter){
    var filtersInClass
    ////////////////////////console.log(classFilter)
    filtersInClass=filtersInGraph.filter(function(d){
      ////////////////////////console.log(d.property.split("_")[0])
      ////////////////////////console.log(classFilter)
      return d.property.split("_")[0]==classFilter
    })
    ////////////////////////console.log(filtersInClass)
    if(filtersInClass.length==0){
      return true
    }else{
      false
    }
  }
  function getValuesFilter(classFilter,property){
    var values=[]
    // get all values from property in data
    networkGraph.data["nodes"].forEach(function(d){
      //getKeyByValue(nodesClassesCorrespondence,classFilter) gets class name from code, having class name showed to the user
      
      if(d["class"]==classFilter){
        values.push(d[property])
      }
    })
    values=[...new Set(values)].sort()
    return values
  }
  
  function addFilterType(filterType,valuesFilter,property,classFilter,controls,all){
    
  
    if((filterType=="dropdown")|(filterType=="dropdown_multiple")|(filterType=="dropdown_date")|(filterType=="dropdown_number")){
      //////////////////////////////////////////////console.log("entra en dropdown")
      if (all&(valuesFilter.length>1)){
        valuesFilter=["All"].concat(valuesFilter)
      }
  
      var div = document.createElement("div");
      div.className="relative"
      div.id=property.replaceAll(" ","_")+"_root"
      var select = document.createElement("select");
      select.name = property;
      select.id = property.replaceAll(" ","_");
      
      if (filterType=="dropdown_multiple"){
        select.setAttribute('multiple', true);
      }    

      if(filterType=="dropdown_date"){
        select.className="w-full h-10 pl-3 pr-6 text-base bg-gray-200 border rounded-lg appearance-none focus:shadow-outline"
        select.setAttribute("onchange",'changeDatesFilter(this,"'+classFilter+'")');
        select.id+="_dates_selection"
      }else if(filterType=="dropdown_number"){
        select.className="w-full h-10 pl-3 pr-6 text-base bg-gray-200 border rounded-lg appearance-none focus:shadow-outline"
        select.setAttribute("onchange",'changeNumbersFilter(this,"'+classFilter+'")');
        select.id+="_selection"  
      }else{
        select.className="w-full h-10 pl-3 pr-6 text-base border rounded-lg appearance-none focus:shadow-outline " + classFilter +"_filter"
        select.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'dropdown','')"); 
      }
      
      for (const val of valuesFilter) {
        var option = document.createElement("option");
        option.value = val;
        option.text = val.charAt(0).toUpperCase() + val.slice(1);
        select.appendChild(option);
      }
      select.value = valuesFilter[0];
      var label = document.createElement("label");
      label.innerHTML = property.split("_")[1]
      label.htmlFor = property.split("_")[1];
      if((filterType=="dropdown_date")|(filterType=="dropdown_number")){
        label.id=property.replaceAll(" ","_")+"_selection_label"
      }else{
        label.id=property.replaceAll(" ","_")+"_label"
      }
      
      if((filterType=="dropdown_date")|(filterType=="dropdown_number")){
        label.innerHTML=label.innerHTML+ " selection"
        label.htmlFor = label.htmlFor + " selection"
      }
      
      label.className="block mb-2 text-base font-light text-gray-700"
  
      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(select);//
    }
    else if (filterType=="date"){

      valuesFilter=["date later than","date earlier than","date range"]
      addFilterType("dropdown_date",valuesFilter,property,classFilter,controls,false)
      
      var div = document.createElement("div");
      div.className="relative"
      div.id=property.replaceAll(" ","_")+"_root"
  
      var dateInput = document.createElement("input");
      dateInput.name = property;
      dateInput.id = property.replaceAll(" ","_");
      dateInput.type="date"
      dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      dateInput.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','')"); 

      var label = document.createElement("label");
      label.innerHTML = property.split("_")[1]
      label.htmlFor = property.split("_")[1];
      label.id = property.replaceAll(" ","_")+"_label"
      label.className="block mb-2 text-base font-light text-gray-700"
      
      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(dateInput);
    
    }else if (filterType=="date_range"){
  
      var div = document.createElement("div");
      div.className="relative"
      //div.id=property.replaceAll(" ","_")+"_root"

      var dateInput = document.createElement("input");
      dateInput.name = property;
      //////////////////////////////console.log(property)
      dateInput.id = property.replaceAll(" ","_");
      //////////////////////////////console.log(dateInput.id)
      dateInput.type="date"
      dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      //dateInput.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'"+getKeyByValue(nodesClassesCorrespondence, classFilter)+"')"); 
      dateInput.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','date range')"); 

      var label = document.createElement("label");
      label.innerHTML = property.replace(classFilter.replace(" ","_"),"").split("_").slice(1).join(" ")
      label.htmlFor = property.replace(classFilter.replace(" ","_"),"").split("_").slice(1).join(" ");
      label.id=dateInput.id+"_label"
      label.className="block mb-2 text-base font-light text-gray-700"
      insertAfter(label, d3.select("#"+property.replace("_end","_start")).node().parentNode)
      //throw new Error("Something went badly wrong!");

      insertAfter(div,label)
      div.appendChild(dateInput)
 
    }else if (filterType=="text"){
  
      var label = document.createElement("label");
      label.innerHTML = property.split("_")[1]
      label.htmlFor = property.split("_")[1];
      label.id= property.replaceAll(" ","_")+"_label";
      label.className="block mb-2 text-base font-light text-gray-700"
      
      var div = document.createElement("div");
      div.className="relative"
      div.id=property.replaceAll(" ","_")+"_root"
  
      var textInput = document.createElement("input");
      textInput.name = property;
      textInput.id = property.replaceAll(" ","_");
      textInput.type="text"
      textInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      textInput.placeholder='Enter Text'
      textInput.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'text','')"); 

      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(textInput);
  
      var classFilterOrig=getKeyByValue(nodesClassesCorrespondence, classFilter)
      docs=document.getElementsByClassName(classFilterOrig)

      var searchValues=[]
      for (let d of docs) {
          searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
      }
  
      autocomplete(document.getElementById(property.replaceAll(" ","_")), searchValues);
    
    }else if (filterType=="between_numbers"){ 
  
      var div = document.createElement("div");
      div.className="relative"
      //div.id=property.replaceAll(" ","_")+"_root"

      var div2 = document.createElement("div");
      div2.className='flex items-center justify-center w-64 h-16 m-auto ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      div2.id=property+"_between"
      var div3 = document.createElement("div");
      div3.className='relative min-w-full py-1'
  
      
      betNumbersInput = document.createElement("div")
      betNumbersInput.className="relative"

      betNumbersInput1 = document.createElement("div")
      betNumbersInput1.className="flex items-center justify-center h-screen"

      betNumbersInput2 = document.createElement("div")
      betNumbersInput2.className="relative w-full max-w-xl"
      betNumbersInput2.setAttribute("id",property+"_filter")
      //betNumbersInput2.setAttribute("id",function (){
        //SOLO UN FILTRO POR FIELD
        //if (document.getElementById(property+"_filter")){
        //  str.charAt(str.length-1)
        //}else{
        //  return property+"_filter";
        //}
        //return property+"_filter";
      //})
      //betNumbersInput2.setAttribute("x-ref","id")
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
      betNumbersInput4.setAttribute("onchange","applyFilterBet(this)"); 

      betNumbersInput5 = document.createElement("input")
      betNumbersInput5.className="absolute z-20 w-full h-2 opacity-0 appearance-none cursor-pointer pointer-events-none"
      betNumbersInput5.setAttribute("type",'range')
      betNumbersInput5.setAttribute("id",'range_max')
      betNumbersInput5.setAttribute("step",'1')
      betNumbersInput5.setAttribute("x-bind:min",'min')
      betNumbersInput5.setAttribute("x-bind:max",'max')
      betNumbersInput5.setAttribute("x-on:input",'maxtrigger')
      betNumbersInput5.setAttribute("x-model",'maxprice')
      betNumbersInput5.setAttribute("onchange","applyFilterBet(this)"); 
      
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
      betNumbersInput13.setAttribute("onchange","applyFilterBet(this)"); 

      betNumbersInput14=document.createElement("div")

      betNumbersInput15=document.createElement("input")
      betNumbersInput15.setAttribute("type",'text')
      betNumbersInput15.setAttribute("id",'text_max')
      betNumbersInput15.setAttribute("maxlength",'5')
      betNumbersInput15.setAttribute("x-on:input",'maxtrigger')
      betNumbersInput15.setAttribute("x-model",'maxprice')
      betNumbersInput15.className="w-24 px-3 py-2 text-center border border-gray-200 rounded"
      betNumbersInput15.setAttribute("onchange","applyFilterBet(this)"); 

      var label = document.createElement("label");
      label.innerHTML = property.replace(getKeyByValue(nodesClassesCorrespondence, classFilter)+"_","").replaceAll("_"," ")
      label.htmlFor = property.replace(getKeyByValue(nodesClassesCorrespondence, classFilter)+"_","").replaceAll("_"," ")
      label.id=property+"_between_label"
      label.className="block mb-2 text-base font-light text-gray-700"

      divEl=document.getElementById(classFilter+"_filters")
      divEl.appendChild(label)

      var nestedDiv1=divEl.appendChild(betNumbersInput).appendChild(betNumbersInput2)
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

    }else if (filterType=="number"){
      valuesFilter=["greater than","smaller than","equal to","number range"]
      addFilterType("dropdown_number",valuesFilter,property ,classFilter,controls,false)  
      
      var label = document.createElement("label");
      label.innerHTML = property.split("_")[1]
      label.htmlFor = property.split("_")[1];
      label.id=property.replaceAll(" ","_")+"_label";
      label.className="block mb-2 text-base font-light text-gray-700"
      
      var div = document.createElement("div");
      div.className="relative" //+ classFilter +"_filter"
      div.id=property.replaceAll(" ","_")+"_root"
  
      var textInput = document.createElement("input");
      textInput.name = property;
      textInput.id = property.replaceAll(" ","_");
      textInput.type="text"
      textInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date"' 
      textInput.placeholder='Enter Number'
      textInput.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'number','')"); 

      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(textInput);
  
      
    }
  }
  
  function changeDatesFilter(element,classFilter){
    var dateField,label,dateFieldVal,id;

    if(element.value=="date range"){
      id=element.id.replace("_dates_selection","")
      dateField=document.getElementById(element.id.replace("_dates_selection",""))
      dateField.id+="_start"
      dateField.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','date range')"); 
      label=d3.select("#"+element.id.replace("_dates_selection","_label"))
      label=document.getElementById(element.id.replace("_dates_selection","")+"_label")
      label.innerHTML += " start"
      label.htmlFor+=" start"
      label.id=label.id.replace("label","start_label")
      document.getElementById(element.id.replace("_dates_selection",""))
      ////////////////////////////////console.log(document.getElementById(element.id.replace("_dates_selection","_end")))
      //////////////////////////////console.log(dateField.id)
      //////////////////////////////console.log(dateField.id.replace(id+"_start",id+"_end"))
      addFilterType("date_range","",dateField.id.replace(id+"_start",id+"_end"),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)

      if((document.getElementById(element.id.replace("_dates_selection","_start")).value!="")&(document.getElementById(element.id.replace("_dates_selection","_end")).value!="")){
        applyFilter([document.getElementById(element.id.replace("_dates_selection","_start")).value],document.getElementById(element.id.replace("_dates_selection","_start")).id,'date','date later than')
        applyFilter([document.getElementById(element.id.replace("_dates_selection","_end")).value],document.getElementById(element.id.replace("_dates_selection","_end")).id,'date','date earlier than')  
      }

    }if((element.value=="date later than")|(element.value=="date earlier than")){
      //////////////////////////////////////console.log("if two options")
      dateField=document.getElementById(element.id.replace("_dates_selection","_start"))
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
      }
      ////////////////////////////////////console.log(dateFieldVal.value)
      dateFieldVal.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','')"); 

      if(dateFieldVal.value!=""){
        applyFilter([dateFieldVal.value],dateFieldVal.getAttribute('id'),'date','')
      }
    }
   }
   function changeNumbersFilter(element,classFilter){

    if(element.value=="number range"){
      document.getElementById(element.id.replace("_selection","")).parentNode.style.display = 'none';
      document.getElementById(element.id.replace("_selection","_label")).style.display = 'none';
      if(document.getElementById(element.id.replace("_selection","_filter"))){
        //////////////////////////////////////////////////console.log(document.getElementById(element.id.replace("_selection","_between")).parentNode)
        document.getElementById(element.id.replace("_selection","_filter")).parentNode.style.display = 'block';
        document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'block';
      }else{
        addFilterType("between_numbers","",element.id.replace("_selection",""),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)
      }
    }if((element.value=="greater than")|(element.value=="smaller than")|(element.value=="equal to")){
      document.getElementById(element.id.replace("_selection","")).parentNode.style.display = 'block';
      document.getElementById(element.id.replace("_selection","_label")).style.display = 'block';
      if(document.getElementById(element.id.replace("_selection","_filter"))){
        document.getElementById(element.id.replace("_selection","_filter")).parentNode.style.display = 'none';
      }
      ////////////////////////////////////////console.log(document.getElementById(element.id.replace("_selection","_between")))
      if(document.getElementById(element.id.replace("_selection","_filter"))){
        document.getElementById(element.id.replace("_selection","_filter")).parentNode.style.display = 'none';
        document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'none';
      }
      ////////////////////console.log(document.getElementById(element.id).getAttribute("id"))
      filterAllFields(document.getElementById(element.id).getAttribute("id").replace("_selection",""))
      //applyFilter(document.getElementById(element.id.replace("_selection","")),"number","")
    }
   }
   function applyFilterBet(element){
    var typeField,value,property
    ////////////////////////////////////console.log(element.parentNode.parentNode)
    typeField=element.getAttribute("id")
    value=element.value
    if(typeField=="range_min"){
      property=element.parentNode.parentNode.getAttribute("id").replace("_filter","")
      networkGraph.applyFilter(value,property,"<","number")
    }else if (typeField=="text_min"){
      property=element.parentNode.parentNode.parentNode.getAttribute("id").replace("_filter","")
      networkGraph.applyFilter(value,property,"<","number")
    }else if (typeField=="range_max"){
      property=element.parentNode.parentNode.getAttribute("id").replace("_filter","")
      networkGraph.applyFilter(value,property,">","number")
    }else if (typeField=="text_max"){
      property=element.parentNode.parentNode.parentNode.getAttribute("id").replace("_filter","")
      networkGraph.applyFilter(value,property,">","number")
    }
   }
   function applyFilter(value,property,type,typeComp){
     //////////////console.log("applyFilter")
     filterAllFields(property)
   }

   function filterValuesFilters(classFilter,property){
    var selectValues

    const fieldsClass=document.getElementsByClassName(classFilter+"_filter")

    for (let i = 0; i < fieldsClass.length; i++) {
      //////////////////////////////////////////////////console.log(fieldsClass[i]);
      if (fieldsClass[i]["id"]!=property){
        //////////////////////////////////////////////////console.log(fieldsClass[i].tagName)
        selectValues=networkGraph.data.nodes.filter(function(d){
          return d.class==classFilter
        })

        selectValues=selectValues.map(function(item) {
          return (item[fieldsClass[i]["id"]])
         }) 

        selectValues=[...new Set(selectValues)].sort()

        if(fieldsClass[i].tagName=="SELECT"){
          filterDropdown(fieldsClass[i],selectValues)
        }
      }
    }
   }
   function filterDropdown(fieldClass,selectValues){
    for (j = fieldClass.length - 1; j>= 0; j--) {
      fieldClass.remove(j);
      ////////////////////////////////////////////////////console.log(fieldsClass[i][j])
    }
    if(selectValues.length>1){
      var option = document.createElement("option");
      option.value = "All";
      fieldClass.appendChild(option);
    }
    for (const val of selectValues) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      fieldClass.appendChild(option);
    } 
   }

   function range(element) {
      var values=[],classElement,propertyEl;
      classElement=element.parentNode.parentNode.getAttribute("id").replace("_filters","")
      propertyEl=element.getAttribute("id").replace("_filter","")

      networkGraph.treeData.forEach(function (d){
        if (d.class==classElement){
          if(d.hidden){
            if(d.hidden!=true){
              values.push(d.id)
              if (d.children){
                d.children.forEach(function (v){
                  if (v.class==classElement){
                    if(v.hidden){
                      if(v.hidden!=true){
                        values.push(v[propertyEl])
                      }
                    }else{
                      values.push(v[propertyEl])
                    }
                  }
                })
              }
            }
          }
        }else{
          if (d.children){
            d.children.forEach(function (v){
              if (v.class==classElement){
                if(v.hidden){
                  if(v.hidden!=true){
                    values.push(v[propertyEl])
                  }
                }else{
                  values.push(v[propertyEl])
                }
              }
            })
          }
        }
      })
      values.sort(function(a, b){return a-b})
      return {
        minprice: values[0], 
        maxprice: values[values.length-1],
        min: values[0], 
        max: values[values.length-1],
        minthumb: 0,
        maxthumb: 0, 
        
        mintrigger() {  
          //this.minprice = Math.min(this.minprice, this.maxprice - 500);      
          this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;
        },
        
        maxtrigger() {
          //this.maxprice = Math.max(this.maxprice, this.minprice + 500); 
          this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);    
        }, 
      }
}


function filterAllFields(property){
  var filters=[],valuesFilter=[],values=[],classFilter,allValues,parent;

  classFilter=property.split("_")[0]
  property=property.split("_")[1]
  ////////////////////console.log(property)
  var options=configFile.filter(function(item) {
    return graphHistory.includes(item.option)
  })
  options.forEach(function (d){
    if (d.filters.length>0){
      d.filters.forEach(function (v){
        filters.push(v)
      })
    }
    ////////////////////////////////////console.log(d.filters)
  })
  
  //////////////////////////////////console.log(filters)
  filters.forEach(function (f){
    console.log(f)
    allValues=get_all_values_filter(f)
    if(f.parent){
      parent=f.parent
    }else{
      parent=""
    }
    if(f.filter_type=="number"){
      if(document.getElementById(f.property+"_selection").value=="number range"){
        //////////////////////////////console.log(d3.select("#"+f.property+"_filter #text_min").node().value)
        values.push(d3.select("#"+f.property+"_filter #text_min").node().value)
        values.push(d3.select("#"+f.property+"_filter #text_max").node().value)
        //////////////////////////////console.log(d3.select("#"+f.property+"_filter #text_max").node().value)
        //allValues
        valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"<>","allValues":allValues,"parentFilter":parent})
      }else{
        values=[document.getElementById(f.property).value]
        console.log(values)
        if(document.getElementById(f.property+"_selection").value=="greater than"){
          valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"<","allValues":allValues,"parentFilter":parent})
        }else if (document.getElementById(f.property+"_selection").value=="smaller than"){
          valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":">","allValues":allValues,"parentFilter":parent})
        }else if (document.getElementById(f.property+"_selection").value=="equal to")
        valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"==","allValues":allValues,"parentFilter":parent})
        console.log(valuesFilter)
      }
    }else if(f.filter_type=="date"){
      if(document.getElementById(f.property+"_dates_selection").value=="date range"){
        //////////////////////////////console.log(d3.select("#"+f.property+"_start").node().value)
        values.push(d3.select("#"+f.property+"_start").node().value)
        //////////////////////////////console.log(d3.select("#"+f.property+"_end").node().value)
        values.push(d3.select("#"+f.property+"_end").node().value)
        valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"<>","allValues":allValues,"parentFilter":parent})
      }else{
        //////////////////////////////console.log(f.property)
        //////////////////////////////console.log(f.property+"_dates_selection")
        values=[document.getElementById(f.property).value]
        if(document.getElementById(f.property+"_dates_selection").value=="date later than"){
          valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"<","allValues":allValues,"parentFilter":parent})
        }else if (document.getElementById(f.property+"_dates_selection").value=="date earlier than"){
          valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":">","allValues":allValues,"parentFilter":parent})
        }
      }
    }else{
      //document.getElementById(f.property).value
      values=[document.getElementById(f.property).value]
      valuesFilter.push({"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":"==","allValues":allValues,"parentFilter":parent})
    }
    ////////////////////////////////////console.log(document.getElementById(f.property).value)
    values=[]
  })
  ////////////////////////console.log(valuesFilter)
  //get_all_values_filter()
  console.log(valuesFilter)
  
  
  ////////////////////console.log(classFilter)
  ////////////////////console.log(property)
  networkGraph.applyFilter2(valuesFilter,classFilter,property)
}
function get_all_values_filter(filter){
  var ids=[],values=[]
  ////////////////////////////console.log(filter)
  networkGraph.treeData.forEach(function(item){
    ////////////////////////////console.log(item)
    if(!ids.includes(item.id)){
      if(item[filter.property]){
        if(!values.includes(item[filter.property])){
          values.push(item[filter.property])
        }
      }
      ids.push(item.id)
    }
    if(item.children){
      item.children.forEach(function (c){
        ////////////////////////////console.log(c)
        if(!ids.includes(c.id)){
          if(c[filter.property]){
            if(!values.includes(c[filter.property])){
              values.push(c[filter.property])
            }
          }
          ids.push(c.id)
        }
      })
    }
  })
  return values;
}