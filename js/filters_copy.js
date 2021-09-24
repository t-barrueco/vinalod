function addFilters(filters,data){
    var property,filterType,classFilter,valuesFilter,controls;

    // Example format for filters
    // OP Theme_Publication date-date;OP Theme_Theme name-text;OP Theme Main_Publication date-date;OP Theme Main_Publication number-number    
    
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
        .attr("class","border border-transparent mt-3 rounded-md bg-"+ colorCorrespondence[colorScale(nodesClassesCorrespondence[classFilter])])
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

      if(propertiesFilterHist.includes(property)){
        addValuesToFilter(filterType,property,valuesFilter)
      }else{
        addFilterType(filterType,valuesFilter,property,classFilter,controls,true)
        propertiesFilterHist.push(property)
      }
      
    })
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
      ////////////console.log("entra en dropdown")
      if (all&(valuesFilter.length>1)){
        valuesFilter=["All"].concat(valuesFilter)
      }
  
      var div = document.createElement("div");
      div.className="relative"
  
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

      var dateInput = document.createElement("input");
      dateInput.name = property;
      dateInput.id = property.replaceAll(" ","_");
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
    var dateField,label,dateFieldVal;

    if(element.value=="date range"){
      dateField=document.getElementById(element.id.replace("_dates_selection",""))
      dateField.id+="_start"
      dateField.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','date range')"); 
      label=d3.select("#"+element.id.replace("_dates_selection","_label"))
      label=document.getElementById(element.id.replace("_dates_selection","")+"_label")
      label.innerHTML += " start"
      label.htmlFor+=" start"
      label.id=label.id.replace("label","start_label")

      addFilterType("date_range","",dateField.id.replace("start","end"),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)

      if((document.getElementById(element.id.replace("_dates_selection","_start")).value!="")&(document.getElementById(element.id.replace("_dates_selection","_end")).value!="")){
        applyFilter([document.getElementById(element.id.replace("_dates_selection","_start")).value],document.getElementById(element.id.replace("_dates_selection","_start")).id,'date','date later than')
        applyFilter([document.getElementById(element.id.replace("_dates_selection","_end")).value],document.getElementById(element.id.replace("_dates_selection","_end")).id,'date','date earlier than')  
      }

    }if((element.value=="date later than")|(element.value=="date earlier than")){
      ////console.log("if two options")
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
      //console.log(dateFieldVal.value)
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
      if(document.getElementById(element.id.replace("_selection","_between"))){
        ////////////////console.log(document.getElementById(element.id.replace("_selection","_between")).parentNode)
        document.getElementById(element.id.replace("_selection","_between")).parentNode.style.display = 'block';
        document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'block';
      }else{
        addFilterType("between_numbers","",element.id.replace("_selection",""),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)
      }
    }if((element.value=="greater than")|(element.value=="smaller than")|(element.value=="equal to")){
      document.getElementById(element.id.replace("_selection","")).parentNode.style.display = 'block';
      document.getElementById(element.id.replace("_selection","_label")).style.display = 'block';
      //////console.log(document.getElementById(element.id.replace("_selection","_between")))
      if(document.getElementById(element.id.replace("_selection","_between"))){
        document.getElementById(element.id.replace("_selection","_between")).parentNode.style.display = 'none';
        document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'none';
      }

      applyFilter(document.getElementById(element.id.replace("_selection","")),"number","")
    }
   }
   function applyFilterBet(element){
    var typeField,value,property
    //console.log(element.parentNode.parentNode)
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
    console.log(value)
    console.log(property)
    console.log(type)
    console.log(typeComp)
    //console.log(classFilterHist)
    //console.log(propertiesFilterHist)
    if(type=="date"){
     if (typeComp==""){
        typeComp=$('#'+property.replace("_start","").replace("_end","")+"_dates_selection").val()
      }   
      if(typeComp=="date later than"){
        //console.log("mayor")
        networkGraph.applyFilter(value,property,"<","date")
      }else if (typeComp=="date earlier than"){
        //console.log("menor")
        networkGraph.applyFilter(value,property,">","date")
      }else if("date range"){
        property=property.replace("_start","").replace("_end","")
        if((document.getElementById(property+"_start").value!="")&(document.getElementById(property+"_end").value!="")){
          //console.log("entra apply filter date range")
          networkGraph.applyFilter(value,property,"<>","date")
        }
      }
    }else if(type=="number"){

      if (typeComp==undefined){
        typeComp=$('#'+property +"_selection").val()
      }
      if(typeComp=="greater than"){
        networkGraph.applyFilter(value,property,"<","number")
      }else if (typeComp=="smaller than"){
        networkGraph.applyFilter(value,property,">","number")
      }else if (typeComp=="equal to"){
        networkGraph.applyFilter(value,property,"==","number")
      }else{

      }
    }else if(type=="dropdown"){
      networkGraph.applyFilter(value,property,"","dropdown")
    }
    filterData(networkGraph.data,property)
   }
   function filterValuesFilters(classFilter,property){
    var selectValues

    const fieldsClass=document.getElementsByClassName(classFilter+"_filter")

    for (let i = 0; i < fieldsClass.length; i++) {
      ////////////////console.log(fieldsClass[i]);
      if (fieldsClass[i]["id"]!=property){
        ////////////////console.log(fieldsClass[i].tagName)
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
      //////////////////console.log(fieldsClass[i][j])
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
   function filterData(data,property){
     /* data.nodes.forEach(function (d){
       ////////////////console.log(d)
     })
     data.nodes.filter(function(item) {
      return (item.id == d.id)
     }) */
     //data.nodes.forEach(element => ////////////////console.log(element));
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

function addValuesToFilter(filterType,property,values){
var selectLength
if(filterType=="dropdown"){
  var option,options=[];
  var select=document.getElementById(property)
  $("#"+property).empty()
  if (values.length>1){
    values.unshift("All")
  }
  for (const val of values) {
      option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      select.appendChild(option);
  }
}
}
function filterAllFields(){
  values=[...new Set(values)].sort()
}