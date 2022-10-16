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

  $("#accordion-filters").append(cf.code).ready(function (){
    for (let i = 0; i < cf.filters.length; i++) {
      console.log(cf.filters)
      if(cf.filters[i]["filter_type"]=="dropdown"){
        cf.filters[i].filterObject=new FilterBasicDropdown(cf.filters[i])
      }else if(cf.filters[i]["filter_type"]=="date"){
        cf.filters[i].filterObject=new FilterBasicDate(cf.filters[i])
      }else if(cf.filters[i]["filter_type"]=="text"){
        cf.filters[i].filterObject=new FilterBasicText(cf.filters[i])
      }else if(cf.filters[i]["filter_type"]=="number"){
        cf.filters[i].filterObject=new FilterBasicNumber(cf.filters[i])
      }
    }
  })
}

function FilterClassExpert(...args){
  FilterClass.apply(this, args);
  }
    
FilterClassExpert.prototype = Object.create(FilterClass.prototype);

Filter = function (_details) {
    this.details = _details;
    this.init();
  };  
  
Filter.prototype.init = function () {
  var fi=this;
  fi.getValuesVisibleNodes()
  fi.addHtml()
  //fi.checkVisibility()
  }

Filter.prototype.getValuesVisibleNodes=function (){
    var fi=this,values=[]
    networkGraph.data["nodes"].forEach(function(d){

      if(d["class"]==fi.details.class){
        if(d[fi.details.property]!=undefined){
          values.push(d[fi.details.property].toLowerCase())
        }
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
    if ((fi.values.length>1)&(fi.details.filter_type=="dropdown")){
      fi.values=["All"].concat(fi.values)
    }
  }

function FilterBasic(...args){
  Filter.apply(this, args);
  }
    
FilterBasic.prototype = Object.create(Filter.prototype);

FilterBasic.prototype.addHtml= function () {
  var fi=this;

  var div = document.createElement("div");
  div.className="relative"
  div.id=fi.details.property.replaceAll(" ","_")+"_root"
  fi.id=fi.details.property.replaceAll(" ","_");

  fi.propertyFullName=configRow.rowFields.properties.filter(d=>d.property==fi.details.property)[0]["property_name"].replace(networkGraph.nodesClassesShow[fi.details.class],"").trim()
  
  fi.mainHtmlEl=div

  if(document.getElementById(fi.id+"_selection")){
    fi.selection=document.getElementById(fi.id+"_selection")
  }else{
    fi.selection="none"
  }

  fi.htmlEl=document.getElementById(fi.id)

}

/* FilterBasic.prototype.addValuesField =function (){
  var fi=this;
  //console.log(fi)
  $(("#accordion-filters #"+fi.details.property)).empty();
  var select = document.querySelector("#accordion-filters #"+fi.details.property);
  //////console.log(select)
  addOptionsSelect(select,fi.values)
} */

class FilterBasicDropdown extends FilterBasic {
  async addHtml() {
    super.addHtml();

    let code = await getHtmlCodeFromFile("pages/select-filter.html");
    code=code.replace("Label",this.details.property.split("_")[1].charAt(0).toUpperCase() + this.details.property.split("_")[1].slice(1))
    $("#"+this.details.class+"_filters").append(code).ready(function () {
      ECL.autoInit();
    });
    var select=document.getElementById("select-default")
    select.name = this.details.property;
    select.id = this.details.property.replaceAll(" ","_");

    let valuesFilter=this.values
    addOptionsSelect(select,valuesFilter)
    select.value = valuesFilter[0];
  }
  checkConditionNode(node){
    let filterCondition=$("#"+this.details.property).val()
    if(filterCondition=="All"){
      return false
    }else{
      if(node[this.details.property]){
        if(filterCondition==node[this.details.property].toLowerCase()){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    }
  }
  addValuesField(){
    this;
    $(("#accordion-filters #"+this.details.property)).empty();
    var select = document.querySelector("#accordion-filters #"+this.details.property);
    addOptionsSelect(select,this.values)
  }
}

class FilterBasicDate extends FilterBasic {
  async addHtml() {
    super.addHtml();
    let code = await getHtmlCodeFromFile("pages/date-filter.html");
    code=code.replace("Label",this.propertyFullName).replaceAll("HelperText",this.details.filter_text)
    $("#"+this.details.class+"_filters").append(code).ready(function () {
      ECL.autoInit();
    })

    $("#"+this.details.class+"_filters #start-date").attr("value",this.values[0])
    $("#"+this.details.class+"_filters #start-date").attr("name",this.details.property+"_start")
    $("#"+this.details.class+"_filters #start-date").attr("id",this.details.property+"_start")

    $("#"+this.details.class+"_filters #end-date").attr("value",this.values[this.values.length-1])
    $("#"+this.details.class+"_filters #end-date").attr("name",this.details.property+"_name")
    $("#"+this.details.class+"_filters #end-date").attr("id",this.details.property+"_end")
  }
  checkConditionNode(node){
    console.log(this)
    let startDate=$("#"+this.details.property+"_start").val()
    let endDate=$("#"+this.details.property+"_end").val()

    if((formatDate(node[this.details.property])>=formatDate(startDate))&&(formatDate(node[this.details.property])<=formatDate(endDate))){
      return false
    }else{
      return true
    }
  }
}
class FilterBasicText extends FilterBasic {
  async addHtml() {
    super.addHtml();
    console.log("entra en filterbasictext")
    let code = await getHtmlCodeFromFile("pages/text-filter.html");
    code=code.replace("Label",this.propertyFullName).replaceAll("HelperText",this.details.filter_text).replaceAll("Placeholder text","Enter "+this.propertyFullName).replaceAll("example-input-id-1",this.details.property+"_filter")
    $("#"+this.details.class+"_filters").append(code).ready(function () {
      ECL.autoInit();
    })
    let docs=document.getElementsByClassName(this.details.class)
    let searchValues=[]
    for (let d of docs) {
        searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
    }
    console.log(this)
    console.log(searchValues)
    
    autocomplete(document.getElementById(this.id+"_filter"), searchValues);
  }
  checkConditionNode(node){
    const filterValue=$("#"+this.details.property+"_filter").val()
    if(filterValue!=""){
      if(node[this.details.property]!=$("#"+this.details.property+"_filter").val()){
        return true
      }else{
        return false
      }
    }else{
      return false
    }

/*     if((formatDate(node[this.details.property])>=formatDate(startDate))&&(formatDate(node[this.details.property])<=formatDate(endDate))){
      return false
    }else{
      return true
    } */
  }
}

class FilterBasicNumber extends FilterBasic {
    async addHtml() {
      super.addHtml();

/*       var label = document.createElement("label");
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
      document.getElementById(fi.classFilterName+"_filters").appendChild(div).appendChild(textInput); */
    }
    checkConditionNode(node){
/*       const filterValue=$("#"+this.details.property+"_filter").val()
      if(filterValue!=""){
        if(node[this.details.property]!=$("#"+this.details.property+"_filter").val()){
          return true
        }else{
          return false
        }
      }else{
        return false
      } */

    }
  }


function FilterExpert(...args){
    Filter.apply(this, args);
    }

FilterExpert.prototype = Object.create(Filter.prototype);

FilterExpert.prototype.addHtml=function (){
}