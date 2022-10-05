FilterClass = function (_name) {
  this.name = _name;
  this.init()
};
  
/* FilterClass.prototype.init = async function () {
  var cf=this;
  cf.filters=networkGraph.filters.filter(d=>d.class==cf.name)
  await cf.getCode()
  //bubbleId=linkedDataGraph.treeData.slice(-1)[0]["id"]
  $("#accordion-filters").append(cf.code).ready(function (){
    for (let i = 0; i < cf.filters.length; i++) {
      cf.filters[i].filterObject=new Filter(cf.filters[i])
    }
  })
} */

FilterClass.prototype.getCode= async function(){
  var cf=this;
  cf.code = await getHtmlCodeFromFile("pages/filter-class-item.html");
  cf.code=cf.code.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
}

function FilterClassBasic(...args){
  FilterClass.apply(this, args);
}
    
FilterClassBasic.prototype = Object.create(FilterClass.prototype);

FilterClassBasic.prototype.init = async function () {
  var cf=this;
  cf.filters=networkGraph.filters.filter(d=>d.class==cf.name)
  await cf.getCode()
  //bubbleId=linkedDataGraph.treeData.slice(-1)[0]["id"]
  $("#accordion-filters").append(cf.code).ready(function (){
    for (let i = 0; i < cf.filters.length; i++) {
      cf.filters[i].filterObject=new FilterBasic(cf.filters[i])
    }
  })
  //console.log(cf.filters)
}
/* FiltersClassBasic.prototype.getCode=function (){
} */

function FilterClassExpert(...args){
  FilterClass.apply(this, args);
  }
    
FilterClassExpert.prototype = Object.create(FilterClass.prototype);

/* FiltersClassExpert.prototype.getCode=function (){
} */

Filter = function (_details) {
    this.details = _details;
    //this.bubbleId=_bubbleId
    this.init();
  };  
  /////////////////// initVis Method //////////////////////
  
Filter.prototype.init = function () {
  var fi=this;
  fi.getValuesVisibleNodes()
  fi.addHtml()
  //fi.checkVisibility()
  }

Filter.prototype.getValuesVisibleNodes=function (){
    var fi=this,values=[]
    //console.log(fi)
    networkGraph.data["nodes"].forEach(function(d){
      
      if(d["class"]==fi.details.class){
        //CAMBIAR PORQUE LO HE PUESTO EVENTUAL
        //if(d[fi.details.property]!=undefined){
        //if(fi.details.filter_type=="date"){
        //values.push(formatDate(d[fi.details.property]))
        //}else{
        //console.log(d)
        //console.log(fi)
        if(d[fi.details.property]!=undefined){
          values.push(d[fi.details.property].toLowerCase())
        }
        
        //}
        ////console.log(d[fi.details.property])
        
        //}
        
      }
    })
    if(fi.details.filter_type=="date"){
      values=[...new Set(values)].sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return formatDate(a) - formatDate(b);
      });
    }else{
      values=[...new Set(values)].sort()
    }
    
    fi.values=values
    ////console.log(fi.values)
    if ((fi.values.length>1)&(fi.details.filter_type=="dropdown")){
      fi.values=["All"].concat(fi.values)
    }
  }
  Filter.prototype.addValues=function(){
    var fi=this,values=[];
    var hiddenNodes=[],parentHidden=false,position,selectedFilter;
/*     //console.log("applyFilter")
    //console.log(fi.details)
    //console.log(networkGraph.data.nodes)
    //console.log(linkedDataGraph) */
    //fi.getValuesFilterAllNodes()
    const index=networkGraph.filterCondition.findIndex(d=>d.class==fi.details.class)
    if(fi.details.filter_type=="number"){
/*       if(fi.selection.value=="<>"){
        values.push(d3.select("#"+fi.id+"_filter #text_min").node().value)
        values.push(d3.select("#"+fi.id+"_filter #text_max").node().value)
        fi.valuesField=values
      }else{
        fi.valuesField=[document.getElementById(fi.id).value]
      } */
    }else if(fi.details.filter_type=="date"){
      
      //console.log($("#"+fi.details.property+"_start"))
      //values={"class":fi.details.class,"properties":[{"property":fi.details.property,"type":"date","values":{"start":$("#"+fi.details.property+"_start").val(),"end":$("#"+fi.details.property+"_end").val()}}]}
      //values={"class":fi.details.class,"property":fi.details.property,"type":"date","values":{"start":$("#"+fi.details.property+"_start").val(),"end":$("#"+fi.details.property+"_end").val()}}
      ////console.log(values)
      if(index==-1){
        networkGraph.filterCondition.push({"class":fi.details.class,"properties":[{"property":fi.details.property,"type":"date","values":{"start":$("#"+fi.details.property+"_start").val(),"end":$("#"+fi.details.property+"_end").val()}}]})
      }else{
        networkGraph.filterCondition[index]["properties"].push({"property":fi.details.property,"type":"date","values":{"start":$("#"+fi.details.property+"_start").val(),"end":$("#"+fi.details.property+"_end").val()}})
      }
      //networkGraph.filterCondition.push({"class":fi.details.class,"property":fi.details.property})
      /* if(fi.selection.value=="<>"){
        values.push(d3.select("#"+fi.property+"_start").node().value)
        values.push(d3.select("#"+fi.property+"_end").node().value)
  
        fi.valuesField=values
      }else{
        fi.valuesField=[document.getElementById(fi.id).value]
      } */
      
    }else if(fi.details.filter_type=="dropdown"){
      //fi.valuesField=[document.getElementById(fi.id).value.toLowerCase()]
      //values={"class":fi.details.class,"properties":[{"property":fi.details.property,"type":"date","values":{"start":$("#"+fi.details.property+"_start").val(),"end":$("#"+fi.details.property+"_end").val()}}]}
      //values={"class":fi.details.class,"property":fi.details.property,"type":"date","values":{"start":$("#"+fi.details.property+"_start").val(),"end":$("#"+fi.details.property+"_end").val()}}
      ////console.log(values)
      if(index==-1){
        networkGraph.filterCondition.push({"class":fi.details.class,"properties":[{"property":fi.details.property,"type":"dropdown","values":[$("#"+fi.details.property).val()]}]})
      }else{
        networkGraph.filterCondition[index]["properties"].push({"property":fi.details.property,"type":"dropdown","values":[$("#"+fi.details.property).val()]})
      }
    }
  
  }

  Filter.prototype.applyFilter=function(){
    var fi=this,values=[];
    var hiddenNodes=[],parentHidden=false,position,selectedFilter;
    //console.log("applyFilter")
    //console.log(fi.mainHtmlEl)
    //console.log(networkGraph.data.nodes)
    //console.log(linkedDataGraph)
/*     fi.getValuesFilterAllNodes()
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
    } */
  
  }

function FilterBasic(...args){
  Filter.apply(this, args);
  }
    
FilterBasic.prototype = Object.create(Filter.prototype);

FilterBasic.prototype.addHtml= function () {
  var fi=this;

  var div = document.createElement("div");
  div.className="relative"
  ////console.log(fi)
  div.id=fi.details.property.replaceAll(" ","_")+"_root"
  fi.id=fi.details.property.replaceAll(" ","_");
  fi.propertyFullName=configRow.rowFields.properties.filter(d=>d.property==fi.details.property)[0]["property_name"].replace(networkGraph.nodesClassesShow[fi.details.class],"").trim()
  ////////console.log(fi.propertyFullName)
  //console.log(fi.details.filter_type)
  if(fi.details.filter_type=="dropdown"){
    ////console.log("antes")
    addDropdown()
    //////console.log("despues")
  }
  else if (fi.details.filter_type=="date"){
    //addDropdown("dropdown_date",div)
    addDate()  
  }else if (fi.details.filter_type=="date_range"){

    addDateRange(div)

  }else if (fi.details.filter_type=="text"){
    //console.log(fi)
    addText(div)
  
  }else if (fi.details.filter_type=="between_numbers"){ 
    addBetweenNumbers()
    
  }else if (fi.details.filter_type=="number"){
    
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
    //console.log("dropdown")
    let code = await getHtmlCodeFromFile("pages/select-filter.html");
    code=code.replace("Label",fi.details.property.split("_")[1].charAt(0).toUpperCase() + fi.details.property.split("_")[1].slice(1))
    //console.log(code)
    $("#"+fi.details.class+"_filters").append(code).ready(function () {
      ECL.autoInit();
      //console.log("239")
    });
    var select=document.getElementById("select-default")
    select.name = fi.details.property;
    select.id = fi.details.property.replaceAll(" ","_");
    //select.id = fi.details.property.replaceAll(" ","_")+"_filter";
    //select.setAttribute("onchange","applyFilter(this)"); 
    //console.log(fi.values)
    let valuesFilter=fi.values
    //let internalValuesFilter=fi.values
    //console.log(valuesFilter)
    addOptionsSelect(select,valuesFilter)
    //console.log(select)
    select.value = valuesFilter[0];
  } 
  async function addDate(){
    var optionsMenuHtml,html

    let code = await getHtmlCodeFromFile("pages/date-filter.html");
    //console.log(fi.values)
    code=code.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.details.filter_text)
    $("#"+fi.details.class+"_filters").append(code).ready(function () {
      ECL.autoInit();
      //console.log("265")
    })
    //console.log(fi.values)
    //console.log(fi.values[fi.values.length-1])
    //$("#"+fi.details.class+"_filters #start-date").attr("value",changeDateFormat(fi.values[0]))
    $("#"+fi.details.class+"_filters #start-date").attr("value",fi.values[0])
    $("#"+fi.details.class+"_filters #start-date").attr("name",fi.details.property+"_start")
    $("#"+fi.details.class+"_filters #start-date").attr("id",fi.details.property+"_start")

    //$("#"+fi.details.class+"_filters #end-date").attr("value",changeDateFormat(fi.values[fi.values.length-1]))
    $("#"+fi.details.class+"_filters #end-date").attr("value",fi.values[fi.values.length-1])
    $("#"+fi.details.class+"_filters #end-date").attr("name",fi.details.property+"_name")
    $("#"+fi.details.class+"_filters #end-date").attr("id",fi.details.property+"_end")


/*       await $.get("pages/date-filter.html", function (data) {
      optionsMenuHtml=data
      html=optionsMenuHtml.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.filterText)
      $("#"+fi.classFilterName+"_filters").append($(html))
    }); */
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
function FilterExpert(...args){
  Filter.apply(this, args);
  }
    
FilterExpert.prototype = Object.create(Filter.prototype);

FilterExpert.prototype.addHtml=function (){
}