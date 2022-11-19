FilterClass = function (_name) {
  this.name = _name;
};
  

FilterClass.prototype.init= async function(){
  var cf=this;
  cf.filters=[]
  await cf.initFilters()
}

FilterClass.prototype.getCode= async function(){
  var cf=this;

  cf.code=await getHtmlCodeFromFile("pages/filter-class-item.html")
  
  cf.setTitle()
  $("#accordion-filters").append(cf.code)
}

FilterClass.prototype.checkHidden=async function(){
  var cf=this,hidden=true;
  for(i=0;i<cf.filters.length;i++){
    if(!cf.filters[i].hidden){
      hidden=false
    }
  }
  if(hidden){
    cf.hide()
  }else{
    cf.show()
  }
}

FilterClass.prototype.hide=async function(){
  $( "#"+this.name+"_filters" )
  .closest( "#accordion-filters" )
  .hide();
  this.hidden=true
}

FilterClass.prototype.show=async function(){
  $( "#"+this.name+"_filters" )
  .closest( "#accordion-filters" )
  .show();
  delete this.hidden
}

function FilterClassBasic(...args){
  FilterClass.apply(this, args);
}
  
FilterClassBasic.prototype = Object.create(FilterClass.prototype);


FilterClassBasic.prototype.setValuesFilters= function(filterId){
  var cf=this,values;
  cf.filters.forEach(function(f){
    if(f.id!=filterId){
      values=f.getValuesNodes(linkedDataGraph.dataFiltered["flatData"]["nodes"])
      f.addValuesField(values,filterId)
    }
  })
}

FilterClassBasic.prototype.checkConditionNode = function(node,filterId){
  var cf=this,hidden=false;
  cf.filters.forEach(function(f){
      var condition;
      if(filterId){
        if(f.id==filterId){
          condition=f.checkConditionNode(node)
        }
      }else{
        condition=f.checkConditionNode(node)
      }
      if(condition){
        hidden=true
      }
  })
  return hidden;
}

FilterClassBasic.prototype.setTitle = async function () {
  var cf=this;
  cf.code=cf.code.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
}

FilterClassBasic.prototype.initFilters = async function () {
  var cf=this;
  let filters=configRow.filters.filter(d=>d.class==cf.name)
  cf.getCode()
  for (let i = 0; i < filters.length; i++) {
    await cf.addFilterType(filters[i],false)
  }
}

FilterClassBasic.prototype.addFilterType = async function (filter,imported) {
  var cf=this,fi;
  if(filter["filter_type"]=="dropdown"){
    fi=new FilterBasicDropdown(filter,imported)
    await fi.init()
    cf.filters.push(fi)
  }else if(filter["filter_type"]=="date"){
    fi=new FilterBasicDate(filter,imported)
    await fi.init()
    cf.filters.push(fi)
  }else if(filter["filter_type"]=="text"){
    fi=new FilterBasicText(filter,imported)
    await fi.init()
    cf.filters.push(fi)
  }else if(filter["filter_type"]=="number"){
    cf.filters.push(new FilterBasicNumber(filter,imported))
  }
  ECL.autoInit()
}

FilterClassBasic.prototype.addFilterTypeImported = async function (filter,imported) {
  var cf=this,fi;
  if(filter.details.filter_type=="dropdown"){
    cf.filters.push(new FilterBasicDropdown(filter,imported))
  }else if(filter.details.filter_type=="date"){
    cf.filters.push(new FilterBasicDate(filter,imported))
  }else if(filter.details.filter_type=="text"){
    cf.filters.push(new FilterBasicText(filter,imported))
  }else if(filter.details.filter_type=="number"){
    cf.filters.push(new FilterBasicNumber(filter,imported))
  }
}

function FilterClassExpert(...args){
  FilterClass.apply(this, args);
  }
    
FilterClassExpert.prototype = Object.create(FilterClass.prototype);

FilterClassExpert.prototype.setTitle = async function () {
  var cf=this,name;
  cf.internalName=cf.name.replaceAll(":","_").replaceAll(".","_").replaceAll("/","_")
  cf.code=cf.code.replace("FilterClassName",cf.name).replaceAll("accordion-example-content",cf.internalName+"_filters")
}

FilterClassExpert.prototype.initFilters = async function (){
  var cf=this;
  cf.internalClass=configRow.node.uri.replaceAll(":","_").replaceAll(".","_").replaceAll("/","_")
  cf.filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"type","internalClass":cf.internalClass,"id":cf.internalClass+"_type"})
  cf.filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"properties","internalClass":cf.internalClass,"id":cf.internalClass+"_properties"})
  cf.filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"values","internalClass":cf.internalClass,"id":cf.internalClass+"_values"})
  
  cf.code=await cf.getCode()

  $("#accordion-filters").append(cf.code).ready(async function (){
    for (let i = 0; i < cf.filters.length; i++) {
      if(cf.filters[i]["filter_type"]=="dropdown"){
        cf.filters[i].filterObject=new FilterExpertDropdown(cf.filters[i])
      }else if(cf.filters[i]["filter_type"]=="text"){
        cf.filters[i].filterObject=new FilterExpertText(cf.filters[i])
      }
    }
  })
}

FilterClassExpert.prototype.setValuesFilters = function(){
  var cf=this;
  cf.filters.forEach(function(f){
  })
}

Filter = function (_details,_imported) {
    var fi=this
    fi.details=_details
    fi.imported=_imported
  };  
Filter.prototype.init= async function () {
  var fi=this;
  if(fi.imported){
    fi.import(fi.details)
  }else{
    await fi.valuesAndHtml();
  }
}
Filter.prototype.valuesAndHtml = async function () {
  var fi=this;
  fi.values=fi.getValuesNodes(networkGraph.data["nodes"])
  await fi.addHtml()
  }

Filter.prototype.import = function (details) {
    var fi=this;
    Object.keys(details).forEach(function(k){
      fi[k]=details[k]
    })
    fi.addHtml()
}
Filter.prototype.removeValuesChanged=function (){   
  delete this["valuesChanged"]
}

Filter.prototype.getValuesNodes=function (nodes){
    var fi=this,values=[]
    nodes.forEach(function(d){
      if(d["class"]==fi.details.class){
        if(d[fi.details.property]!=undefined){
          values.push(d[fi.details.property].toLowerCase())
        }
      }
    })
    return fi.sortValues(values)
}

Filter.prototype.getValuesAllNodes=function (){
  var fi=this
  let docs=document.getElementsByClassName(fi.details.class)
  let searchValues=[]
  for (let d of docs) {
    if(d3.select("#"+d.getAttribute("id")).data()[0][fi.details.property]){
      searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0][fi.details.property])
    }
  }  
  return searchValues
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
  fi.id=fi.details.property.replaceAll(" ","_")+"_filter";
  if(!fi.propertyFullName){
    fi.propertyFullName=configRow.properties.filter(d=>d.property==fi.details.property)[0]["property_name"].replace(networkGraph.nodesClassesShow[fi.details.class],"").trim()
  }
  
  fi.mainHtmlEl=div

  if(document.getElementById(fi.id+"_selection")){
    fi.selection=document.getElementById(fi.id+"_selection")
  }else{
    fi.selection="none"
  }
}
FilterBasic.prototype.addValuesField= function (values,filterId) {
  var hidden=false;
  let index=networkGraph.filterClassesObjects.findIndex((element) => element.filters.some((subElement) => subElement.id === filterId))
  let filterChanged=networkGraph.filterClassesObjects[index]["filters"].filter(f=>f.id==filterId)[0]
  let addValuesResult=this.checkValues(linkedDataGraph.dataFiltered.flatData.nodes)
  if(filterChanged.details.class==this.details.class){
    if(!this.valuesChanged){
      this.addValues(linkedDataGraph.dataFiltered.flatData.nodes)
    }else if(linkedDataGraph.dataFiltered.flatData.nodes.some((subElement) => subElement[this.details.property]==this.valuesChanged)){
      //SE QUEDA EL MISMO VALOR QUE valuesChanged
      this.getValuesChanged()
    }else{
      this.addValues(linkedDataGraph.dataFiltered.flatData.nodes)
    }
  }else if(addValuesResult.length>0){
    this.addValues(linkedDataGraph.dataFiltered.flatData.nodes)
  }else{
    hidden=true
  }
  if(hidden){
    this.hide()
  }else{
    this.show()
  }
  
}
FilterBasic.prototype.hide= function () {
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .hide();
  this.hidden=true
  networkGraph.filterClassesObjects.filter(cf=>cf.name==this.details.class)[0].checkHidden()
}
FilterBasic.prototype.checkValues=function(nodes){
  var values;
  if(nodes){
    values=this.getValuesNodes(nodes)
  }else{
    values=this.getValuesAllNodes()
  }
  return values
}

FilterBasic.prototype.show= function () {
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .show();
  delete this.hidden
  networkGraph.filterClassesObjects.filter(cf=>cf.name==this.details.class)[0].checkHidden()
}

class FilterBasicDropdown extends FilterBasic {
   async addHtml() {
    var fi=this;
    super.addHtml();
    await $.get("pages/select-filter.html", function (code) {
      code=code.replace("Label",fi.propertyFullName)
      if(fi.details.filter_text){
        code=code.replaceAll("HelperText",fi.details.filter_text)
      }else{
        code=code.replaceAll("HelperText","")
      }
      $("#"+fi.details.class+"_filters").append($(code)).ready(function () {
        ECL.autoInit();
        var select=document.getElementById("select-default")
        select.name = fi.details.property;
        select.id = fi.id;
        fi.addValues()
      }) 
    });       
  }
  checkConditionNode(node){
    let elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue
    if(elValue=="All"){
      return false
    }else{
      if(node[this.details.property]){
        if(elValue.toLowerCase()==node[this.details.property].toLowerCase()){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    }
  }
  addValuesChanged(values){
    this["valuesChanged"]=values
  }
  getValuesChanged(){
    select.value=this["valuesChanged"]
  }
  sortValues(values){
    values=[...new Set(values)].sort()
    return values
  }
  addValues(nodes){
    var fi=this,values;
    $(("#accordion-filters #"+this.details.property+"_filter")).empty();
    var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    values=this.checkValues(nodes)
    values=this.sortValues(values)
    if(values.length>1){
      values=["All"].concat(values)
    }
    addHtmlOptionsSelect(select,values,false)
    if(values.length!=1){
      if((fi.elValue)&&(fi.valuesChanged)){
        select.value=fi.valuesChanged;
      }else if(fi.elValue){
        select.value = fi.elValue;
      }else{
        select.value = values[0];
      }
    }else{
      select.value = values[0];
    }
    
    //////console.log(select.value)
    //////console.log(values)
    //////console.log(fi.elValue)
  }
}

class FilterBasicDate extends FilterBasic {
  async addHtml() {
    var fi=this;
    super.addHtml();

    await $.get("pages/date-filter.html", function (code) {
      code=code.replace("Label",this.propertyFullName).replaceAll("HelperText",fi.details.filter_text)
      $("#"+fi.details.class+"_filters").append(code).ready(function () {
      ECL.autoInit();
      $("#"+fi.details.class+"_filters #start-date").attr("value",fi.values[0])
      $("#"+fi.details.class+"_filters #start-date").attr("name",fi.details.property+"_start")
      $("#"+fi.details.class+"_filters #start-date").attr("id",fi.details.property+"_filter_start")

      $("#"+fi.details.class+"_filters #end-date").attr("value",fi.values[fi.values.length-1])
      $("#"+fi.details.class+"_filters #end-date").attr("name",fi.details.property+"_end")
      $("#"+fi.details.class+"_filters #end-date").attr("id",fi.details.property+"_filter_end")
      })
    })
  }
  checkConditionNode(node){
    let startDate=$("#"+this.details.property+"_filter_start").val()
    let endDate=$("#"+this.details.property+"_filter_end").val()

    if((formatDate(node[this.details.property])>=formatDate(startDate))&&(formatDate(node[this.details.property])<=formatDate(endDate))){
      return false
    }else{
      return true
    }
  }
  addValues(nodes){
    if(nodes){
      values=this.getValuesNodes(nodes)
    }else{
      values=this.getValuesAllNodes()
    }
    values=this.sortValues(values)

    $(("#accordion-filters #"+this.details.property+"_filter_start")).val(values[0]);
    $(("#accordion-filters #"+this.details.property+"_filter_end")).val(values[values.length-1]);
  }
  addValuesChanged(values){
    this["valuesChanged"]=values
  }
  sortValues(values){
    let setValues=[...new Set(values)]
    values=setValues.sort(function(a,b){
      return formatDate(a) - formatDate(b);
    });
    values=values.map(d=>dateValidFormat(d))
    
    return values
  }
}

class FilterBasicText extends FilterBasic {
  async addHtml() {
    var fi=this;
    super.addHtml();


    await $.get("pages/text-filter.html", function (code) {
      code=code.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.details.filter_text).replaceAll("Placeholder text","Enter "+fi.propertyFullName).replaceAll("example-input-id-1",fi.id)
      $("#"+fi.details.class+"_filters").append(code).ready(function () {
        //ECL.autoInit();
      })
      fi.htmlEl=document.getElementById(fi.id)
      fi.addValues()
      })

      document.getElementById(fi.id).addEventListener("keyup", function(event) {
        if (event.key === 'Enter' ) {
          // Cancel the default action, if needed
          event.preventDefault();
          fi.addValuesChanged($("#"+fi.id).val())
          closeAllLists()
          relatedFilters(document.getElementById(fi.id))
        }
      })
  }

  checkConditionNode(node){
    const elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue
    if(elValue!=""){
      if(node[this.details.property].includes(elValue)){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  addValues(nodes){
    var fi=this;
    var searchValues;
    if(nodes){
      searchValues=this.getValuesNodes(nodes)
    }else{
      searchValues=this.getValuesAllNodes()
    }
    searchValues=this.sortValues(searchValues)
    autocomplete(document.getElementById(fi.id), searchValues,1);
  }
  
  addValuesChanged(values){
    this["valuesChanged"]=values
  }
  sortValues(values){
    values=[...new Set(values)].sort()
    return values
  }
}

class FilterBasicNumber extends FilterBasic {
    async addHtml() {
      super.addHtml();
    }
      addValuesChanged(values){
        this["valuesChanged"]=values
      }
}


function FilterExpert(...args){
    Filter.apply(this, args);
    }

FilterExpert.prototype = Object.create(Filter.prototype);

FilterExpert.prototype.addHtml=function (){
    var fi=this;

    var div = document.createElement("div");
    div.className="relative"
}
class FilterExpertDropdown extends FilterExpert {
  async addHtml() {
    var valuesFilter;
    super.addHtml();
    let code = await getHtmlCodeFromFile("pages/select-multiple-filter.html");
    code=code.replace("Label",this.details.field)
    $("#"+this.details.internalClass+"_filters").append(code).ready(function () {
      ECL.autoInit();
    });
    var select=document.getElementById("select-multiple")
    select.name = this.details.internalClass + "_"+ this.details.field;
    select.id = this.details.internalClass + "_"+ this.details.field;

    if(this.details.field=="type"){
      if(configRow.option.position=="s"){
        valuesFilter=[...new Set(configRow.results.map(d=>d.o.type))].sort()
      }else{
        valuesFilter=[...new Set(configRow.results.map(d=>d.s.type))].sort()
      }
    }else if(this.details.field=="values"){
      if(configRow.option.position=="s"){
        valuesFilter=[...new Set(configRow.results.map(d=>d.o.value))].sort()
      }else{
        valuesFilter=[...new Set(configRow.results.map(d=>d.s.value))].sort()
      }
    }else{
      valuesFilter=[...new Set(configRow.results.map(d=>d.p.value))].sort()
    }
    addOptionsSelect(select,valuesFilter,true)
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
  addValuesField(values,filterId){
    this;
    $(("#accordion-filters #"+this.details.property)).empty();
    var select = document.querySelector("#accordion-filters #"+this.details.property);
    addOptionsSelect(select,values,true)
  }
}