function addFilters(filters,data){
    var property,filterType,classFilter,valuesFilter,controls;

    // Example format for filters
    // OP Theme_Publication date-date;OP Theme_Theme name-text;OP Theme Main_Publication date-date;OP Theme Main_Publication number-number
    filters = filters.split(";");
    
    
    filters.forEach(function(d){
      //console.log(d)
      // property format example: corporateBody_country
      property=d.split("-")[0]
      filterType=d.split("-")[1]
      // classFilter format example: OP Theme
      classFilter=d.split("-")[0].split("_")[0]
      //////console.log(classFilter)
      //////console.log(nodesClassesCorrespondence)
      //create class for filter if does not exist
      //console.log(classFilterHist)
      if (!classFilterHist.includes(classFilter)){
        controls=d3.select(".controls").append("div")
        .attr("class","w-full px-4 py-2 border-b border-gray-600 bg-grey-700 sm:px-6 classFilter")

        //////console.log(colorScale.domain())
        //////console.log(colorScale.range())

        //////console.log(colorScale(classFilter))
        controls
        .append("h3")
        .attr("class","container mx-auto py-3 text-lg font-medium leading-6 text-gray-900 border-b border-gray-300 bg-"+ colorCorrespondence[colorScale(nodesClassesCorrespondence[classFilter])])
        .text(nodesClassesCorrespondence[classFilter])
        
        controls=controls
        .append("div")
        .attr("class","py-3")
        .attr("id",classFilter+"_filters")
        //.attr("id",getKeyByValue(nodesClassesCorrespondence, classFilter)+"_filters")
        //add class to history of classes
        classFilterHist.push(classFilter)
      }else if(!propertiesFilterHist.includes(property)){
/*         addValuesToFilter(filterType,property)
      }else{ */
        controls=d3.select("#"+classFilter+"_filters")
      }
      //////console.log(nodesClassesCorrespondence)   
      //valuesFilter=getValuesFilter(classFilter,property,data["flatData"]["nodes"])
      valuesFilter=getValuesFilter(classFilter,property)
      //console.log(valuesFilter)
      //console.log(filterType)
      //console.log(property)
      //console.log(classFilter)
      //console.log(controls)
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
    //console.log(classFilter)
    //console.log(property)
    ////console.log(data)
    // get all values from property in data
    //console.log(networkGraph.data)
    networkGraph.data["nodes"].forEach(function(d){
      //getKeyByValue(nodesClassesCorrespondence,classFilter) gets class name from code, having class name showed to the user
      
      if(d["class"]==classFilter){
        values.push(d[property])
      }
    })
    values=[...new Set(values)].sort()
    //////console.log(values)
    return values
  }
  
  function addFilterType(filterType,valuesFilter,property,classFilter,controls,all){
    
  
    if((filterType=="dropdown")|(filterType=="dropdown_multiple")|(filterType=="dropdown_date")|(filterType=="dropdown_number")){
      //console.log("entra en dropdown")
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
        select.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'"+getKeyByValue(nodesClassesCorrespondence, classFilter)+"')"); 
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
      
      label.className="block mb-2 text-base font-light text-indigo-600"
  
      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(select);//
    }
    else if (filterType=="date"){

      valuesFilter=["date later than","date earlier than","between dates"]
      addFilterType("dropdown_date",valuesFilter,property,classFilter,controls,false)
      
      var div = document.createElement("div");
      div.className="relative"
  
      var dateInput = document.createElement("input");
      dateInput.name = property;
      dateInput.id = property.replaceAll(" ","_");
      dateInput.type="date"
      dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
  
      var label = document.createElement("label");
      label.innerHTML = property.split("_")[1]
      label.htmlFor = property.split("_")[1];
      label.id = property.replaceAll(" ","_")+"_label"
      label.className="block mb-2 text-base font-light text-indigo-600"
      
      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(dateInput);
    
    }else if (filterType=="between_dates"){
  
      var div = document.createElement("div");
      div.className="relative"

      var dateInput = document.createElement("input");
      dateInput.name = property;
      dateInput.id = property.replaceAll(" ","_");
      dateInput.type="date"
      dateInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
        
      var label = document.createElement("label");
      label.innerHTML = property.replace(classFilter.replace(" ","_"),"").split("_").slice(1).join(" ")
      label.htmlFor = property.replace(classFilter.replace(" ","_"),"").split("_").slice(1).join(" ");
      label.id=dateInput.id+"_label"
      label.className="block mb-2 text-base font-light text-indigo-600"
      insertAfter(label, d3.select("#"+property.replace("_end","_start")).node().parentNode)

      insertAfter(div,label)
      div.appendChild(dateInput)
 
    }else if (filterType=="text"){
  
      var label = document.createElement("label");
      label.innerHTML = property.split("_")[1]
      label.htmlFor = property.split("_")[1];
      label.id= property.replaceAll(" ","_")+"_label";
      label.className="block mb-2 text-base font-light text-indigo-600"
      
      var div = document.createElement("div");
      div.className="relative"
  
      var textInput = document.createElement("input");
      textInput.name = property;
      textInput.id = property.replaceAll(" ","_");
      textInput.type="text"
      textInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      textInput.placeholder='Enter Text'
  
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
  
      /* var betNumbersInput = document.createElement("div");
      betNumbersInput.name = property;
      betNumbersInput.id = property.replaceAll(" ","_")+"_between";
      betNumbersInput.className='h-2 bg-gray-200 rounded-full'
  
      var betNumbersInput2 = document.createElement("div");
      betNumbersInput2.className='absolute w-0 h-2 bg-indigo-400 rounded-full'
      //It has to be dynamically changed
      betNumbersInput2.style='width: 24.1935%; left: 11.2903%;'
  
      var betNumbersInput3 = document.createElement("div")
      betNumbersInput3.className='absolute top-0 flex items-center justify-center w-4 h-4 -ml-2 bg-white border border-gray-300 rounded-full shadow cursor-pointer'
      betNumbersInput3.unselectable='on'
      betNumbersInput3.onselectstart='return false;'
      betNumbersInput3.style='left: 11.2903%;'
  
      betNumbersInput3_1=document.createElement('div')
      betNumbersInput3_1.className='relative w-1 -mt-2'
  
      betNumbersInput3_2=document.createElement("div")
      betNumbersInput3_2.className='absolute left-0 z-40 min-w-full mb-2 opacity-100 bottom-100'
      betNumbersInput3_2.style='margin-left: -25px;'
  
      betNumbersInput3_3=document.createElement("div")
      betNumbersInput3_3.className='relative shadow-md'
  
  
      var betNumbersInput4=document.createElement("div")
      betNumbersInput4.className='px-4 py-1 -mt-8 text-xs text-black truncate bg-white rounded'
      betNumbersInput4.innerHTML += '15';
  
      var betNumbersInput5=document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      betNumbersInput5.setAttribute("class","absolute left-0 h-2 min-w-full text-white top-100")
      betNumbersInput5.setAttribute("x",'0px')
      betNumbersInput5.setAttribute("y",'0px')

      betNumbersInput5.setAttribute("viewBox", "0 0 255 255"); 

      betNumbersInput5_1=document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      betNumbersInput5_1.setAttribute("class",'fill-current')
  
      var array = arr = [ [ 0,0 ], 
                   [ 127.5,127.5 ],
                   [ 255,0 ], ];
      
      for (value of array) {
        var point = betNumbersInput5.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        betNumbersInput5_1.points.appendItem(point);
      }
  
      var betNumbersInput6 = document.createElement("div")
      betNumbersInput6.className='absolute top-0 flex items-center justify-center w-4 h-4 -ml-2 bg-white border border-gray-300 rounded-full shadow cursor-pointer'
      betNumbersInput6.unselectable='on'
      betNumbersInput6.onselectstart='return false;'
      betNumbersInput6.style='left: 35.4839%;'
  
      betNumbersInput6_1=document.createElement('div')
      betNumbersInput6_1.className='relative w-1 -mt-2'
  
      betNumbersInput6_2=document.createElement("div")
      betNumbersInput6_2.className='absolute left-0 z-40 min-w-full mb-2 opacity-100 bottom-100'
      betNumbersInput6_2.style='margin-left: -25px;'
  
      betNumbersInput6_3=document.createElement("div")
      betNumbersInput6_3.className='relative shadow-md'
  
  
      var betNumbersInput7=document.createElement("div")
      betNumbersInput7.className='px-4 py-1 -mt-8 text-xs text-black truncate bg-white rounded'
      betNumbersInput7.innerHTML += '30';
  
      var betNumbersInput8=document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      betNumbersInput8.setAttribute("class","absolute left-0 h-2 min-w-full text-white top-100")
      betNumbersInput8.setAttribute("x",'0px')
      betNumbersInput8.setAttribute("y",'0px')

      betNumbersInput8.setAttribute("viewBox", "0 0 255 255"); 

      betNumbersInput8_1=document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      betNumbersInput8_1.setAttribute("class",'fill-current')
  
      var array = arr = [ [ 0,0 ], 
                   [ 127.5,127.5 ],
                   [ 255,0 ], ];
      
      for (value of array) {
        var point = betNumbersInput8.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        betNumbersInput8_1.points.appendItem(point);
      }
  
      betNumbersInput9=document.createElement("div")
      betNumbersInput9.className='absolute bottom-0 left-0 -mb-6 -ml-1 text-gray-800'
      betNumbersInput9.innerHTML += '8';
  
      betNumbersInput10 = document.createElement("div")
      betNumbersInput10.className='absolute bottom-0 right-0 -mb-6 -mr-1 text-gray-800'
      betNumbersInput10.innerHTML += '70'; */
      betNumbersInput = document.createElement("div")
      betNumbersInput.className="relative"

      betNumbersInput1 = document.createElement("div")
      betNumbersInput1.className="flex items-center justify-center h-screen"

      betNumbersInput2 = document.createElement("div")
      betNumbersInput2.className="relative w-full max-w-xl"
      betNumbersInput2.setAttribute("x-data",'range()')
      betNumbersInput2.setAttribute("x-init",'mintrigger(); maxtrigger()')

      betNumbersInput3 = document.createElement("div")

      betNumbersInput4 = document.createElement("input")
      betNumbersInput4.className="absolute z-20 w-full h-2 opacity-0 appearance-none cursor-pointer pointer-events-none"
      betNumbersInput4.setAttribute("type",'range')
      betNumbersInput4.setAttribute("step",'100')
      betNumbersInput4.setAttribute("x-bind:min",'min')
      betNumbersInput4.setAttribute("x-bind:max",'max')
      betNumbersInput4.setAttribute("x-on:input",'mintrigger')
      betNumbersInput4.setAttribute("x-model",'minprice')

      betNumbersInput5 = document.createElement("input")
      betNumbersInput5.className="absolute z-20 w-full h-2 opacity-0 appearance-none cursor-pointer pointer-events-none"
      betNumbersInput5.setAttribute("type",'range')
      betNumbersInput5.setAttribute("step",'100')
      betNumbersInput5.setAttribute("x-bind:min",'min')
      betNumbersInput5.setAttribute("x-bind:max",'max')
      betNumbersInput5.setAttribute("x-on:input",'maxtrigger')
      betNumbersInput5.setAttribute("x-model",'maxprice')

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
      betNumbersInput11.className="flex items-center justify-between py-5"

      betNumbersInput12=document.createElement("div")

      betNumbersInput13=document.createElement("input")
      betNumbersInput13.setAttribute("type",'text')
      betNumbersInput13.setAttribute("maxlength",'5')
      betNumbersInput13.setAttribute("x-on:input",'mintrigger')
      betNumbersInput13.setAttribute("x-model",'minprice')
      betNumbersInput13.className="w-24 px-3 py-2 text-center border border-gray-200 rounded"

      betNumbersInput14=document.createElement("div")

      betNumbersInput15=document.createElement("input")
      betNumbersInput15.setAttribute("type",'text')
      betNumbersInput15.setAttribute("maxlength",'5')
      betNumbersInput15.setAttribute("x-on:input",'maxtrigger')
      betNumbersInput15.setAttribute("x-model",'maxprice')
      betNumbersInput15.className="w-24 px-3 py-2 text-center border border-gray-200 rounded"

      /*<div class="flex items-center justify-center h-screen">
  <div x-data="range()" x-init="mintrigger(); maxtrigger()" class="relative w-full max-w-xl">
    <div>
      <input type="range"
             step="100"
             x-bind:min="min" x-bind:max="max"
             x-on:input="mintrigger"
             x-model="minprice"
             class="absolute z-20 w-full h-2 opacity-0 appearance-none cursor-pointer pointer-events-none">

      <input type="range" 
             step="100"
             x-bind:min="min" x-bind:max="max"
             x-on:input="maxtrigger"
             x-model="maxprice"
             class="absolute z-20 w-full h-2 opacity-0 appearance-none cursor-pointer pointer-events-none">

      <div class="relative z-10 h-2">

        <div class="absolute top-0 bottom-0 left-0 right-0 z-10 bg-gray-200 rounded-md"></div>

<!--         <div class="absolute top-0 bottom-0 z-20 bg-green-300 rounded-md" x-bind:style="'right:'+maxthumb+'%; left:'+minthumb+'%'"></div>
 -->        <div class="absolute top-0 bottom-0 z-20 bg-indigo-400 rounded-full" x-bind:style="'right:'+maxthumb+'%; left:'+minthumb+'%'"></div>
<!--             <div class="absolute w-0 h-2 bg-indigo-400 rounded-full" style="width: 24.1935%; left: 11.2903%;"></div>
 -->
        <div class="absolute z-30 flex items-center justify-center w-4 h-4 -ml-2 bg-white border border-gray-300 rounded-full shadow cursor-pointer -top-1" x-bind:style="'left: '+minthumb+'%'"></div>

        <div class="absolute z-30 flex items-center justify-center w-4 h-4 -ml-2 bg-white border border-gray-300 rounded-full shadow cursor-pointer -top-1" x-bind:style="'right: '+maxthumb+'%'"></div>
 
      </div>

    </div>
    
    <div class="flex items-center justify-between py-5">
      <div>
        <input type="text" maxlength="5" x-on:input="mintrigger" x-model="minprice" class="w-24 px-3 py-2 text-center border border-gray-200 rounded">
      </div>
      <div>
        <input type="text" maxlength="5" x-on:input="maxtrigger" x-model="maxprice" class="w-24 px-3 py-2 text-center border border-gray-200 rounded">
      </div>
    </div>
    
  </div>

<script>
    function range() {
        return {
          minprice: 1000, 
          maxprice: 7000,
          min: 100, 
          max: 10000,
          minthumb: 0,
          maxthumb: 0, 
          
          mintrigger() {   
            this.minprice = Math.min(this.minprice, this.maxprice - 500);      
            this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;
          },
           
          maxtrigger() {
            this.maxprice = Math.max(this.maxprice, this.minprice + 500); 
            this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);    
          }, 
        }
    }
</script>
</div>*/
      //////console.log(property)
      var label = document.createElement("label");
      label.innerHTML = property.replace(getKeyByValue(nodesClassesCorrespondence, classFilter)+"_","").replaceAll("_"," ")
      label.htmlFor = property.replace(getKeyByValue(nodesClassesCorrespondence, classFilter)+"_","").replaceAll("_"," ")
      label.id=property+"_between_label"
      label.className="block mb-2 text-base font-light text-indigo-600"

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

/*       var nestedDiv1=divEl.appendChild(div).appendChild(div2).appendChild(div3).appendChild(betNumbersInput)
      nestedDiv1.appendChild(betNumbersInput2)
      var rootDiv=nestedDiv1.appendChild(betNumbersInput3).appendChild(betNumbersInput3_1).appendChild(betNumbersInput3_2).appendChild(betNumbersInput3_3)
      rootDiv.appendChild(betNumbersInput4)
      rootDiv.appendChild(betNumbersInput5).appendChild(betNumbersInput5_1)
  
      var rootDiv2=nestedDiv1.appendChild(betNumbersInput6).appendChild(betNumbersInput6_1).appendChild(betNumbersInput6_2).appendChild(betNumbersInput6_3)
      rootDiv2.appendChild(betNumbersInput7)
      rootDiv2.appendChild(betNumbersInput8).appendChild(betNumbersInput8_1)
  
      nestedDiv1.appendChild(betNumbersInput9)
      nestedDiv1.appendChild(betNumbersInput10) */

    //}else if ((filterType=="number")|(filterType=="number_field")){
    }else if (filterType=="number"){
      valuesFilter=["greater than","smaller than","equal to","between numbers"]
      addFilterType("dropdown_number",valuesFilter,property ,classFilter,controls,false)  
      
      var label = document.createElement("label");
      label.innerHTML = property.split("_")[1]
      label.htmlFor = property.split("_")[1];
      label.id=property.replaceAll(" ","_")+"_label";
      label.className="block mb-2 text-base font-light text-indigo-600"
      
      var div = document.createElement("div");
      div.className="relative"
  
      var textInput = document.createElement("input");
      textInput.name = property;
      textInput.id = property.replaceAll(" ","_");
      textInput.type="text"
      textInput.className='block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" ' + getKeyByValue(nodesClassesCorrespondence, classFilter) +"_filter"
      textInput.placeholder='Enter Number'
  
      //document.getElementById(getKeyByValue(nodesClassesCorrespondence, classFilter)+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(label);
      document.getElementById(classFilter+"_filters").appendChild(div).appendChild(textInput);
  
      
    }
  }
  
  function changeDatesFilter(element,classFilter){
    var dateField,label

    if(element.value=="between dates"){
      dateField=d3.select("#"+element.id.replace("_dates_selection",""))
      dateField=document.getElementById(element.id.replace("_dates_selection",""))
      dateField.id+="_start"
      //.attr("id",dateField.attr("id")+"_start")

      label=d3.select("#"+element.id.replace("_dates_selection","_label"))
      label=document.getElementById(element.id.replace("_dates_selection","")+"_label")
      label.innerHTML += " start"
      label.htmlFor+=" start"
      label.id=label.id.replace("label","start_label")

      addFilterType("between_dates","",dateField.id.replace("start","end"),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)
    }if((element.value=="date later than")|(element.value=="date earlier than")){
      dateField=document.getElementById(element.id.replace("_dates_selection","_start"))
      label=document.getElementById(element.id.replace("_dates_selection","_start_label"))
      dateField.id=dateField.id.replace("_start","")
      label.id=label.id.replace("_start","")
      label.innerHTML=label.innerHTML.replace(" start","")
      label.htmlFor=label.htmlFor.replace(" start","")
      d3.select("#"+element.id.replace("_dates_selection","_end")).remove()
      d3.select("#"+element.id.replace("_dates_selection","_end_label")).remove()
      //d3.select("#"+element.id.replace("_dates_selection","_end").replace(classFilter+"_","")).remove()
  
    }
   }
   function changeNumbersFilter(element,classFilter){

    if(element.value=="between numbers"){
      document.getElementById(element.id.replace("_selection","")).parentNode.style.display = 'none';
      document.getElementById(element.id.replace("_selection","_label")).style.display = 'none';
      if(document.getElementById(element.id.replace("_selection","_between"))){
        //////console.log(document.getElementById(element.id.replace("_selection","_between")).parentNode)
        document.getElementById(element.id.replace("_selection","_between")).parentNode.style.display = 'block';
        document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'block';
      }else{
        addFilterType("between_numbers","",element.id.replace("_selection",""),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)
      }
    }if((element.value=="greater than")|(element.value=="smaller than")|(element.value=="equal to")){
      document.getElementById(element.id.replace("_selection","")).parentNode.style.display = 'block';
      document.getElementById(element.id.replace("_selection","_label")).style.display = 'block';
      document.getElementById(element.id.replace("_selection","_between")).parentNode.style.display = 'none';
      document.getElementById(element.id.replace("_selection","_between_label")).style.display = 'none';
    }
   }
   function applyFilter(values,property,classFilter){
    //////console.log(values)
    //////console.log(property)
    //////console.log(classFilter)
    
    networkGraph.applyFilter(values,property)
    filterValuesFilters(classFilter,property)
    //////console.log(networkGraph.data)
    //////console.log(networkGraph.treeData)
    filterData(networkGraph.data,property)
   }
   function filterValuesFilters(classFilter,property){
    var selectValues

    const fieldsClass=document.getElementsByClassName(classFilter+"_filter")

    for (let i = 0; i < fieldsClass.length; i++) {
      //////console.log(fieldsClass[i]);
      if (fieldsClass[i]["id"]!=property){
        //////console.log(fieldsClass[i].tagName)
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
        
/*         for (const val of valuesFilter) {
          var option = document.createElement("option");
          option.value = val;
          option.text = val.charAt(0).toUpperCase() + val.slice(1);
          select.appendChild(option);
        } */
        //var x = document.getElementById("mySelect");
        //x.remove(x.selectedIndex);
        /* for (j = fieldsClass[i].length - 1; j>= 0; j--) {
          fieldsClass[i].remove(j);
          ////////console.log(fieldsClass[i][j])
        }
        if(selectValues.length>1){
          var option = document.createElement("option");
          option.value = "All";
          fieldsClass[i].appendChild(option);
        }
        for (const val of selectValues) {
          var option = document.createElement("option");
          option.value = val;
          option.text = val.charAt(0).toUpperCase() + val.slice(1);
          fieldsClass[i].appendChild(option);
        }  */
        ////////console.log(selectValues.length)
      }
    }
   }
   function filterDropdown(fieldClass,selectValues){
    for (j = fieldClass.length - 1; j>= 0; j--) {
      fieldClass.remove(j);
      ////////console.log(fieldsClass[i][j])
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
       //////console.log(d)
     })
     data.nodes.filter(function(item) {
      return (item.id == d.id)
     }) */
     //data.nodes.forEach(element => //////console.log(element));
   }
   function range() {
     console.log("entra")
    return {
      minprice: 1000, 
      maxprice: 7000,
      min: 100, 
      max: 10000,
      minthumb: 0,
      maxthumb: 0, 
      
      mintrigger() {   
        this.minprice = Math.min(this.minprice, this.maxprice - 500);      
        this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;
      },
       
      maxtrigger() {
        this.maxprice = Math.max(this.maxprice, this.minprice + 500); 
        this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);    
      }, 
    }
}

function addValuesToFilter(filterType,property,values){
var selectLength
if(filterType=="dropdown"){
  var option,options=[];
  var select=document.getElementById(property)

  console.log(select.length)
/*   selectLength=select.length
  for (var i = 0; i < selectLength; i++) {
    //options.push(select[i].text)
    //val +=x[i].value + ",";
    console.log(i)
    //console.log(select.options[i].text)
    select.options[i] = null;
    //select.remove(i)
  } */
  $("#"+property).empty()
  if (values.length>1){
    values.unshift("All")
  }
  console.log(values)
  for (const val of values) {
    //if(!options.includes(option)){
      option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      select.appendChild(option);
    //}
  }
}
}