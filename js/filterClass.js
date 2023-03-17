/****************************************************
************MAIN FILTER CLASS**************
*****************************************************/

FilterClass = function (_name) {
  this.name = _name;
};
  

FilterClass.prototype.init= async function(){
  var cf=this;
  cf.filters=[]
  await cf.initFilters()
}

//get code for filter class
FilterClass.prototype.getCode= async function(){
  var cf=this;

  cf.code=await getHtmlCodeFromFile("pages/filter-class-item.html")
  
  //title for accordion element in filters
  cf.setTitle()
  $("#accordion-filters").append(cf.code)
}

//filter class will be shown if any of filters in class is visible
//it will be hide otherwise
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
    filtersVisible()
  }
}

/****************************************************
************FILTER CLASS FOR BASIC NODES**************
*****************************************************/

function FilterClassBasic(...args){
  FilterClass.apply(this, args);
}
  
FilterClassBasic.prototype = Object.create(FilterClass.prototype);

FilterClassBasic.prototype.initFilters = async function () {
  var cf=this;
  let filters=configRow.filters.filter(d=>d.class==cf.name)
  cf.getCode()
  for (let i = 0; i < filters.length; i++) {
    await cf.addFilterType(filters[i],false)
  }
  cf.checkHidden()
}

FilterClassBasic.prototype.hide=async function(){
  $( "#"+this.name+"_filters" )
  .closest( "#accordion-filters" )
  .fadeOut( "slow", function() {
  });
  this.hidden=true
}

FilterClassBasic.prototype.show=async function(){
  $( "#"+this.name+"_filters" )
  .closest( "#accordion-filters" )
  .fadeIn( "slow", function() {
  });
  delete this.hidden
}


FilterClassBasic.prototype.addFilterType = async function (filter,imported) {
  var cf=this,fi;
  if(filter["filter_type"]=="dropdown"){
    fi=new FilterBasicDropdown(filter,imported)
  }else if(filter["filter_type"]=="date"){
    fi=new FilterBasicDate(filter,imported)
  }else if(filter["filter_type"]=="text"){
    fi=new FilterBasicText(filter,imported)
  }else if(filter["filter_type"]=="number"){
    fi=new FilterBasicNumber(filter,imported)
  }  
  await fi.init()
  cf.filters.push(fi)
}

FilterClassBasic.prototype.addFilterTypeImported = async function (filter,imported) {
  var cf=this,fi;
  if(filter.details.filter_type=="dropdown"){
    fi=new FilterBasicDropdown(filter,imported)
    cf.filters.push(fi)
  }else if(filter.details.filter_type=="date"){
    fi=new FilterBasicDate(filter,imported)
    cf.filters.push(fi)
  }else if(filter.details.filter_type=="text"){
    fi=new FilterBasicText(filter,imported)
    cf.filters.push(fi)
  }else if(filter.details.filter_type=="number"){
    fi=new FilterBasicNumber(filter,imported)
    cf.filters.push(fi)
  }
  fi.addHtml()
}

FilterClassBasic.prototype.setTitle = async function () {
  var cf=this;
  cf.code=cf.code.replaceAll("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
}

/****************************************************
************FILTER CLASS FOR EXPERT NODES**************
*****************************************************/

function FilterClassExpert(...args){
  FilterClass.apply(this, args);
  }
    
FilterClassExpert.prototype = Object.create(FilterClass.prototype);

FilterClassExpert.prototype.initFilters = async function (){
  var cf=this,filters=[];

  cf.internalClass=noPunctuationStr(configRow.node.uri)
  filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"type","internalClass":cf.internalClass,"id":cf.internalClass+"_type"})
  filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"property","internalClass":cf.internalClass,"id":cf.internalClass+"_property"})
  filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"value","internalClass":cf.internalClass,"id":cf.internalClass+"_value"})

  cf.getCode()

  for (let i = 0; i < filters.length; i++) {
    if(filters[i]["filter_type"]=="dropdown"){
      fi=new FilterExpertDropdown(filters[i])
      await fi.init()
      fi.idNode=configRow.node.id
      cf.filters.push(fi)
    }
  }
  cf.checkHidden()
}

FilterClassExpert.prototype.addFilterTypeImported = async function (filter,imported){
  let cf=this,fi;

  if(filter["filter_type"]=="dropdown"){
    fi=new FilterExpertDropdown(filter,imported)
    cf.filters.push(fi)
    fi.addHtml()

    if(fi.values.length==0){
      fi.hide()
    }else{
      fi.show()
    }
  }
}

FilterClassExpert.prototype.updateFilters = async function (){
  var cf=this;
  for (let i = 0; i < cf.filters.length; i++) {
    cf.filters[i].getResultsField()
  }
  cf.checkHidden()
}


FilterClassExpert.prototype.hide=async function(){
  $( "#"+this.internalClass+"_filters" )
  .closest( "#accordion-filters" )
  .fadeOut( "slow", function() {
  });
  this.hidden=true
}

FilterClassExpert.prototype.show=async function(){
  $( "#"+this.internalClass+"_filters" )
  .closest( "#accordion-filters" )
  .fadeIn( "slow", function() {
  });
  delete this.hidden
}


FilterClassExpert.prototype.setTitle = async function () {
  var cf=this,name;
  cf.internalName=noPunctuationStr(cf.name)
  cf.code=cf.code.replaceAll("FilterClassName",cf.name).replaceAll("accordion-example-content",cf.internalName+"_filters")
}

Filter = function (_details,_imported) {
    var fi=this
    fi.imported=_imported
    fi.copyDetails(_details)
  };  


Filter.prototype.removeValuesChanged=function (){   
  delete this["valuesChanged"]
}

Filter.prototype.resetAllValues=function (){
  var fi=this
  fi.getValuesAllNodes()
  fi.fillField()
  fi.resetComponent()
  if(fi.values.length==0){
    fi.hide()
  }else{
    fi.show()
  }
}

Filter.prototype.emptyValuesChanged=function (){
  var fi=this
  delete fi.valuesChanged
}


function FilterBasic(...args){
  Filter.apply(this, args);
}
    
FilterBasic.prototype = Object.create(Filter.prototype);

FilterBasic.prototype.copyDetails=function(details){
  var fi=this;
  if(fi.imported){
    if(details){
      Object.keys(details).forEach(function(k){
        fi[k]=details[k]
      })
    }
    fi.imported=true
  }else{
    fi.details=details
  }
}

FilterBasic.prototype.init= async function () {
  var fi=this;

  fi.addHtml()
  if(fi.values.length==0){
    fi.hide()
  }else{
    fi.show()
  }
}

FilterBasic.prototype.getValuesAllNodes=function (){
  var fi=this,searchValues=[]
  let nodes=linkedDataGraph.allData.flatData.nodes.filter(d=>d.class==fi.details.class)
  searchValues=searchValues.concat(getSearchValues(nodes))

  fi.values=[...new Set(searchValues)].sort()

  function getSearchValues(n){
    return n.map(d=>d[fi.details.property]).filter(d=>d!=undefined)
  }
}

FilterBasic.prototype.valuesNodes=function(nodes){
  var fi=this,values=[]
  nodes.forEach(function(d){
    if(d["class"]==fi.details.class){
      if(d[fi.details.property]!=undefined){
        values.push(d[fi.details.property].toLowerCase())
      }
    }
  })
  return values
}

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

  if(!fi.imported){
    fi.getValuesAllNodes()
  }
  
}

FilterBasic.prototype.valuesFiltered= function () {
  var fi=this;
  linkedDataGraph.flattenAllData()
  fi.getValuesAllNodes()
  if(fi.values.length>0){
    fi.fillField()
  }

  if(fi.values.length==0){
    fi.hide()
  }else{
    fi.show()
  }
}

FilterBasic.prototype.getClass=function(){
  return networkGraph.filterClassesObjects.filter(c=>c.name==this.details.class)
}

Filter.prototype.hide= function () {
  let fi=this;
  fi.hidden=true
  
  let classFilter=fi.getClass()
  if(classFilter.length>0){
    classFilter[0].checkHidden()
  }
}

Filter.prototype.show= function () {
  var filterClass
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .fadeIn( "slow", function() {
  });
  delete this.hidden
  filterClass=networkGraph.filterClassesObjects.filter(cf=>cf.name==this.details.class)
  
  if(filterClass.length>0){
    filterClass[0].checkHidden()
  }
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
      $("#"+fi.details.class+"_filters").append($(code))
      var select=document.getElementById("select-default")
      select.name = fi.details.property;
      select.id = fi.id;
      fi.fillField();
      runAutoInit()
    });  
  }
  fillField(){
    var fi=this;
    checkAddAll(this.values)
    $(("#accordion-filters #"+fi.details.property+"_filter")).empty();
    var select=document.getElementById(fi.details.property+"_filter")
    addHtmlOptionsSelect(select,fi.values,false)
    if(fi.valuesChanged){
      select.value=fi.valuesChanged
      const $options = Array.from(select.options);
      const optionToSelect = $options.find(item => item.text ===fi.valuesChanged);
      optionToSelect.selected = true;
    }
  }
  checkConditionNode(node){
    var val;
    let elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue
    if(elValue=="All"){
      val=false
    }else{
      if(node[this.details.property]){
        if(elValue.toLowerCase()==node[this.details.property].toLowerCase()){
          val=false
        }else{
          val=true
        }
      }else{
        val=true
      }
    }
    return val
  }
  addValuesChanged(el){
    this["valuesChanged"]=el.value
  }
  sortValues(){
    this.values=[...new Set(this.values)].sort()
  }

  resetComponent(){
    let component=$("#"+this.id)[0]
    runAutoInit(component)
  }
  checkValuesChangedIn(){
    var fi=this,result;
    if(fi.values.includes(fi.valuesChanged)){
      result= true
    }else{
      result= false
    }
    return result
  }
}

class FilterBasicDate extends FilterBasic {
  async addHtml() {
    var fi=this;
    super.addHtml();

    await $.get("pages/date-filter.html", function (code) {
      code=code.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.details.filter_text)
      $("#"+fi.details.class+"_filters").append(code).ready(function () {
      $("#"+fi.details.class+"_filters #start-date").attr("name",fi.details.property+"_start")
      $("#"+fi.details.class+"_filters #start-date").attr("id",fi.details.property+"_filter_start")

      $("#"+fi.details.class+"_filters #end-date").attr("name",fi.details.property+"_end")
      $("#"+fi.details.class+"_filters #end-date").attr("id",fi.details.property+"_filter_end")
      fi.fillField()
      runAutoInit()
      })
    })
  }

  fillField(){
    var fi=this;
    fi.sortValues()
    if((!fi.valuesChanged)||(!fi.valuesChanged["start"])){
      document.getElementById(fi.details.property+"_filter_start").value = fi.values[0];
    }
    if((!fi.valuesChanged)||(!fi.valuesChanged["end"])){
      document.getElementById(fi.details.property+"_filter_end").value = fi.values[fi.values.length-1];
    }
  }
  checkConditionNode(node){
    let startDate=$("#"+this.details.property+"_filter_start").val()
    let endDate=$("#"+this.details.property+"_filter_end").val()
    if((formatDateComp(node[this.details.property])>=formatDateComp(startDate))&&(formatDateComp(node[this.details.property])<=formatDateComp(endDate))){
      return false
    }else{
      return true
    }
  }
  addValuesChanged(el){
    if(el.id.endsWith("_start")){
      if(this["valuesChanged"]){
        this["valuesChanged"]["start"]=el.value
      }else{
        this["valuesChanged"]={"start":el.value}
      }
    }else{
      if(this["valuesChanged"]){
        this["valuesChanged"]["end"]=el.value
      }else{
        this["valuesChanged"]={"end":el.value}
      }
    }
  }
  sortValues(){
    var fi=this;
    let setValues=[...new Set(fi.values)]
    setValues=setValues.sort(function(a,b){
      return formatDateComp(a) - formatDateComp(b);
    });
    fi.values=setValues.map(d=>{
      return dateValidFormat(d)
    })
  }

  resetComponent(){
    let component=$("#"+this.id+"_start")[0]
    runAutoInit(component)
    component=$("#"+this.id+"_end")[0]
    runAutoInit(component)
  }
  checkValidity(){
    var message="",errorMessage=false;
    let start=$("#"+this.details.property+"_filter_start")
    let end=$("#"+this.details.property+"_filter_end")
    
    if(!isValidDate(start.val())){
      message="Not valid start date format"
    }else if(!isValidDate(end.val())){
      message="Not valid end date format"
    }else if(formatDateComp(end.val())<formatDateComp(start.val())){
      message="Not valid date range"
    }else{
      message=""
    }

    start.parent().prev('.ecl-feedback-message').text(message);
    
    if(message!=""){
      errorMessage=true
    }

    return (errorMessage)
  }

  checkValuesChangedIn(){
    let fi=this,check=true;

    if(fi.valuesChanged["start"]){
      if((formatDateComp(fi.values[fi.values.length-1])<formatDateComp(fi.valuesChanged["start"]))){
        check=false
      }
    }
    if(fi.valuesChanged["end"]){
      if((formatDateComp(fi.values[0])>formatDateComp(fi.valuesChanged["end"]))){
        check=false
      }
    }
    return check
  }
}

class FilterBasicText extends FilterBasic {
  async addHtml() {
    var fi=this;
    super.addHtml();


    await $.get("pages/text-filter.html", function (code) {
      code=code.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.details.filter_text).replaceAll("Placeholder text","Enter "+fi.propertyFullName).replaceAll("example-input-id-1",fi.id)
      $("#"+fi.details.class+"_filters").append(code).ready(function () {
        fi.fillField()
        runAutoInit()
        fi.htmlEl=document.getElementById(fi.id)
      })
      })

      document.getElementById(fi.id).addEventListener("keyup", function(event) {
        if (event.key === 'Enter' ) {
          // Cancel the default action, if needed
          event.preventDefault();
          fi.addValuesChanged($("#"+fi.id))
          closeAllLists()
          relatedFilters(document.getElementById(fi.id))
        }
      })
  }
  fillField(){
    var fi=this;
    autocomplete(document.getElementById(fi.id), fi.values,1);
  }
  checkConditionNode(node){
    const elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue
    if(elValue!=""){
      if(!node[this.details.property].toLowerCase().includes(elValue.toLowerCase())){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  
  addValuesChanged(el){
    this["valuesChanged"]=el.value;
  }
  sortValues(){
    var fi=this;
    fi.values=[...new Set(fi.values)].sort()
  }
  resetComponent(){
  
  }

  checkValuesChangedIn(){
    let fi=this,result;
    if(fi.values.includes(fi.valuesChanged)){
      result= true
    }else{
      result= false
    }
    return result;
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

FilterExpert.prototype.copyDetails=function(_details){
  var fi=this;
  Object.assign(fi, _details);
}

FilterExpert.prototype.init= async function () {
  var fi=this;

  await fi.addHtml()

  if(fi.values.length==0){
    fi.hide()
  }else{
    fi.show()
  }
}

FilterExpert.prototype.valuesNodes=function(nodes){
  var fi=this,values=[],filterClassName
  let index=networkGraph.filterClassesObjects.findIndex((element) => element.filters.some((subElement) => subElement.id == node.id))
  networkGraph.filterClassesObjects.filter((d)=>d.name==filterClassName)[0]

  nodes.forEach(function(d){
    if(d.value!=fi.class){
      values.push(d[fi["field"]])
    }
  })
  return values
}

FilterExpert.prototype.getClass=function(){
  return networkGraph.filterClassesObjects.filter(c=>c.name==this.className)
}

FilterExpert.prototype.getValuesAllNodes=function (){
  var fi=this,values=[]
  let nodes=linkedDataGraph.allData.flatData.links.filter(d=>((d.source.id==fi.idNode)&&(d.target.class=="free")&&(d.target.type!="menuOption"))).map(v=>v.target)
  nodes.forEach(function(d){
    values.push(d[fi["field"]])
  })
  fi.values=[...new Set(values)].sort();
}

FilterExpert.prototype.valuesFiltered= function () {
  var fi=this;
  linkedDataGraph.flattenAllData()
  fi.getValuesAllNodes()
  if(fi.values.length>0){
    fi.fillField()
  }

  if(fi.values.length==0){
    fi.hide()
  }else{
    fi.show()
  }
}

FilterExpert.prototype.addHtml=function (){
    var fi=this;

    var div = document.createElement("div");
    div.className="relative"
}

FilterExpert.prototype.show= function () {
  var filterClass

  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .fadeIn( "slow", function() {
  });
  delete this.hidden
  filterClass=networkGraph.filterClassesObjects.filter(cf=>cf.name==this.class)
  if(filterClass.length>0){
    filterClass[0].checkHidden()
  }
}

class FilterExpertDropdown extends FilterExpert {
  async addHtml() {
    var fi=this;
    super.addHtml();
    await $.get("pages/select-filter.html", function (code) {
      code=code.replace("Label",fi.field).replace("relatedFilters(this)","relatedFiltersExpert(this)")
      $("#"+fi.internalClass+"_filters").append($(code))
      var select=document.getElementById("select-default")
      select.name = fi.internalClass + "_"+ fi.field;
      select.id = fi.internalClass + "_"+ fi.field;
      if(!fi.imported){
        fi.getResultsField()
      }
      fi.fillField();
      runAutoInit()
    });       
  }
  getResultsField(){
    var fi=this,valuesFilter;

    if(linkedDataGraph.treeData.filter(d=>d.id==configRow.node.id).length>0){
      let nodes=linkedDataGraph.treeData.filter(d=>d.id==configRow.node.id)[0]["children"].filter((element => element.class == "free"))
      if(nodes.length>0){
        if(fi.field=="type"){
          if(configRow.position=="s"){
            valuesFilter=[...new Set(configRow.results.map(d=>d.o.type))].sort()
          }else{
            valuesFilter=[...new Set(configRow.results.map(d=>d.s.type))].sort()
          }
        }else if(fi.field=="value"){
          if(configRow.position=="s"){
            valuesFilter=[...new Set(configRow.results.map(d=>d.o.value))].sort()
          }else{
            valuesFilter=[...new Set(configRow.results.map(d=>d.s.value))].sort()
          }
        }else if(fi.field=="property"){
          valuesFilter=[...new Set(configRow.results.map(d=>d.p.value))].sort()
        }
        if(fi.values){
          fi.values=[...new Set(fi.values.concat(valuesFilter))].sort()
        }else{
          fi.values=valuesFilter;
        }
      }else{
        fi.values=[]
      }
    }


  }
  fillField(){
    var fi=this;
    let select=document.getElementById(fi.internalClass + "_"+ fi.field)

    addHtmlOptionsSelect(select,fi.values)
    if(fi.valuesChanged){
      select.value=fi.valuesChanged
      const $options = Array.from(select.options);

      const optionToSelect = $options.find(item => item.text.toLowerCase() ===fi.valuesChanged.toLowerCase());
      optionToSelect.selected = true;
    }
  }
  addValuesChanged(el){
    this["valuesChanged"]=el.value
  }
  checkConditionNode(node){
    var fi=this;
    if(fi.valuesChanged){
      if(fi.valuesChanged.includes(node[fi.field])){
        return false
      }else{
        return true
      }
    }else{
      return false
    }

  }
  checkValuesChangedIn(){
    var fi=this;

    if(fi.values.includes(fi.valuesChanged)){
      return true
    }else{
      return false
    }
  }
  sortValues(){
    this.values=[...new Set(this.values)].sort()
  }
}
