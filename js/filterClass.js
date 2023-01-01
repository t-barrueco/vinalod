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

//check filters codition for node in this class
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
//set values to other filters when filter changes
//filterId=id from changed filter
FilterClassBasic.prototype.setValuesFilters= function(filterId){
  var cf=this,values;
  cf.filters.forEach(function(f){
    if(f.id!=filterId){
      //get all values from nodes after data has been filtered
      f.getValuesNodes(linkedDataGraph.dataFiltered["flatData"]["nodes"])
    }
  })
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
      cf.filters.push(fi)
    }else if(cf.filters[i]["filter_type"]=="text"){
      fi=new FilterExpertText(filters[i])
      await fi.init()
      cf.filters.push(fi)
    }
  }
  cf.checkHidden()
  document.querySelectorAll('.ecl-checkbox').forEach(item => {
    //////console.log(item)
    item.addEventListener('click', event => {
      relatedFiltersExpert(item)
      //handle click
    })
  })

/*   //////console.log($( ".ecl-checkbox__input" ))
  $( ".ecl-checkbox__input" ).each(function(){
    //////console.log(this)
    //////console.log($("#"+this.getAttribute("id")).on( "click", function() {
      alert( $( this ) );
    }))
  
    //////console.log(this)
  })
  $( ".ecl-checkbox" ).each(function(){
    //////console.log(this)
    //////console.log($("#"+this.getAttribute("id")).on( "click", function() {
      alert( $( this ) );
    }))
  
    //////console.log(this)
  }) */
/*   $( ".ecl-checkbox__input" ).on( "click", function() {
    alert( $( this ) );
  }); */
/*   const checkBox = document.querySelectorAll('.ecl-checkbox__input');

  ////////console.log(checkBox)
  checkBox.forEach(box => {
    //////console.log(box)
    box.addEventListener("click", relatedFiltersExpert);
    //////console.log(box)
    throw new Error('missing channels property: ');
  }); */
}

FilterClassExpert.prototype.checkConditionNode = function(node){
  var cf=this,hidden=false;
  //////console.log(node)
  cf.filters.forEach(function(f){
      var condition;
      condition=f.checkConditionNode(node)
      //////console.log(condition)
      if(condition){
        hidden=true
      }
  })
  //////console.log("final hidden:"+hidden)
  return hidden;
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

FilterClassExpert.prototype.setValuesFilters = function(filterId){
  var cf=this,values;
  cf.filters.forEach(function(f){
    f.getValuesNodes(linkedDataGraph.dataFiltered["flatData"]["nodes"])
    /* if(f.id!=filterId){
      //get all values from nodes after data has been filtered
      //////console.log(linkedDataGraph.dataFiltered["flatData"]["nodes"])
      f.getValuesNodes(linkedDataGraph.dataFiltered["flatData"]["nodes"])
    } */
  })
}

FilterClassExpert.prototype.setTitle = async function () {
  var cf=this,name;
  cf.internalName=cf.name.replaceAll(":","_").replaceAll(".","_").replaceAll("/","_")
  cf.code=cf.code.replaceAll("FilterClassName",cf.name).replaceAll("accordion-example-content",cf.internalName+"_filters")
}

Filter = function (_details,_imported) {
    var fi=this
    fi.imported=_imported
    fi.copyDetails(_details)
  };  

Filter.prototype.init= async function () {
  var fi=this;
  if(fi.imported){
    fi.import(fi.details)
  }else{
    //await fi.valuesAndHtml();
    await fi.addHtml()
  }
}

/* Filter.prototype.valuesAndHtml = async function () {
  var fi=this;
  //fi.values=fi.getValuesNodes(networkGraph.data["nodes"])
  //fi.setAllValues()
  fi.addHtml()
  } */

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
    var fi=this
    let values=fi.valuesNodes(nodes);
    //////console.log(values)
    if(values.length==0){
      fi.hide()
    }else{
      fi.show()
      fi.values=values
      fi.sortValues()
      fi.fillField()
    }
}

Filter.prototype.getValuesAllNodes=function (){
  var fi=this
  let docs=document.getElementsByClassName(fi.details.class)
  let searchValues=[]
  for (let d of docs) {
    //////////////console.log(d3.select("#"+d.getAttribute("id")).data()[0])
    //////////////console.log(fi.details.property)
    if(d3.select("#"+d.getAttribute("id")).data()[0][fi.details.property]){
      searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0][fi.details.property])
    }
  }  
  //////////////console.log(searchValues)
  fi.values=searchValues
  fi.sortValues()
}

Filter.prototype.resetAllValues=function (){
  var fi=this
  fi.getValuesAllNodes()
  ////////////console.log(fi.values)
  fi.fillField()
  ////////////console.log(fi.values)
  fi.resetComponent()
  ////////////console.log(fi.values)
  if(fi.values.length==0){
    fi.hide()
  }else{
    fi.show()
  }
}
/* Filter.prototype.update=function(){
  getValuesAllNodes
} */
Filter.prototype.setAllValues=function (){
  var fi=this
  fi.values=fi.getValuesAllNodes()
  //////////////console.log(fi.values)
  fi.sortValues()
  //fi.resetValue()
}

function FilterBasic(...args){
  Filter.apply(this, args);
  }
    
FilterBasic.prototype = Object.create(Filter.prototype);

FilterBasic.prototype.copyDetails=function(details){
  var fi=this;
  //////console.log(details)
  if(fi.imported){
    fi.import(details)
    //fi=details
    fi.imported=true
  }else{
    fi.details=details
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

  fi.getValuesAllNodes()

  //////////////console.log("addHtml super")
}

FilterBasic.prototype.hide= function () {
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .fadeOut( "slow", function() {
  });
  this.hidden=true
  networkGraph.filterClassesObjects.filter(cf=>cf.name==this.details.class)[0].checkHidden()
}

FilterBasic.prototype.show= function () {
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .fadeIn( "slow", function() {
  });
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
        var select=document.getElementById("select-default")
        select.name = fi.details.property;
        select.id = fi.id;
        fi.fillField();
        runAutoInit()
      }) 
    });       
  }
  fillField(){
    var fi=this;
    checkAddAll(this.values)
    $(("#accordion-filters #"+fi.details.property+"_filter")).empty();
    var select=document.getElementById(fi.details.property+"_filter")
    //fi.values=checkAddAll(fi.values)
    addHtmlOptionsSelect(select,fi.values,false)
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
/*   checkAddAll(){
    if(this.values.length>1){
      this.values=["All"].concat(this.values)
    }
  } */
  addValuesChanged(el){
    this["valuesChanged"]=el.value
  }
  getValuesChanged(){
    var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    select.value=this["valuesChanged"]
  }
  sortValues(){
    this.values=[...new Set(this.values)].sort()
  }
  addValues(values){
    var fi=this;
    $(("#accordion-filters #"+this.details.property+"_filter")).empty();
    var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    if(values.length==0){
      this.hide()
    }else{
      this.show()
      if(values.length>1){
        values=["All"].concat(values)
      }
      addHtmlOptionsSelect(select,values,false)
      fi.setValue(values)
    }
  }
  setValue(values){
    var fi=this;
    var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    if(values.length==1){
      select.value = values[0];
    }else{
      if((fi.valuesChanged)&&(values.includes(fi.valuesChanged))){
        select.value=fi.valuesChanged
      }else{
        fi.valuesChanged=undefined
        select.value = values[0];
      }
    }
  }
  resetComponent(){
    let component=$("#"+this.id)[0]
    runAutoInit(component)
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
    document.getElementById(fi.details.property+"_filter_start").value = fi.values[0];
    document.getElementById(fi.details.property+"_filter_end").value = fi.values[fi.values.length-1];
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
  addValues(values){
    if(values.length==0){
      this.hide()
    }else{
      this.show()
      this.sortValues()
      this.setValues(values)
      this.resetComponent()
    }
  }
  addValuesChanged(el){
    ////////////////////console.log(el)
    ////////////////////////console.log(el.id)
    ////////////////////////console.log(el.value)
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
    ////////////////////console.log(this["valuesChanged"])
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
  setValues(values){
    //var fi=this;
    if(values.length>1){
      if(this.valuesChanged){
        if(this.valuesChanged["start"]){
          //$(("#accordion-filters #"+this.details.property+"_filter_start")).val(this.valuesChanged["start"]);
          document.getElementById(this.details.property+"_filter_start").value=formatDateShow(this.valuesChanged["start"])
        }else{
          //$(("#accordion-filters #"+this.details.property+"_filter_start")).val(values[0]);
          document.getElementById(this.details.property+"_filter_start").value=formatDateShow(values[0])
        }
        if(this.valuesChanged["end"]){
          //$(("#accordion-filters #"+this.details.property+"_filter_start")).val(this.valuesChanged["end"]);
          document.getElementById(this.details.property+"_filter_end").value=formatDateShow(this.valuesChanged["end"])
        }else{
          //$(("#accordion-filters #"+this.details.property+"_filter_end")).val(values[values.length-1]);
          document.getElementById(this.details.property+"_filter_end").value=formatDateShow(values[values.length-1])
        }
      }else{
        //$(("#accordion-filters #"+this.details.property+"_filter_start")).val(values[0]);
        document.getElementById(this.details.property+"_filter_start").value=formatDateShow(values[0])
        //$(("#accordion-filters #"+this.details.property+"_filter_start")).val(values[0]);
        
        //////////////////console.log(document.getElementById(this.details.property+"_filter_start").value)
        //////////////////console.log(document.getElementById(this.details.property+"_filter_start"))
        //$(("#accordion-filters #"+this.details.property+"_filter_end")).val(values[values.length-1]);    
        document.getElementById(this.details.property+"_filter_end").value=formatDateShow(values[values.length-1])
    
      }
    }else{
      document.getElementById(this.details.property+"_filter_start").value=formatDateShow(values[0])
      document.getElementById(this.details.property+"_filter_end").value=formatDateShow(values[0])
    }

  }
  resetComponent(){
    let component=$("#"+this.id+"_start")[0]
    runAutoInit(component)
    component=$("#"+this.id+"_end")[0]
    runAutoInit(component)
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
        //ECL.autoInit();
      })
      //fi.addValues()
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
    //values=this.sortValues(value)
    autocomplete(document.getElementById(fi.id), fi.values,1);
  }
  checkConditionNode(node){
    const elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue
    if(elValue!=""){
      ////////////////////////////console.log(elValue.toLowerCase())
      //////////////////////////////console.log(node)
      ////////////////////////////console.log(node[this.details.property].toLowerCase())
      if(!node[this.details.property].toLowerCase().includes(elValue.toLowerCase())){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  addValues(values){
    var fi=this;
    var searchValues;
/*     if(!values){
      values=this.getValuesAllNodes()
    } */
    if(values.length==0){
      this.hide()
    }else{
      this.show()
      values=this.sortValues(value)
      autocomplete(document.getElementById(fi.id), values,1);
    }

  }
  
  addValuesChanged(el){
    this["valuesChanged"]=el.value;
  }
  sortValues(){
    var fi=this;
    fi.values=[...new Set(fi.values)].sort()
    //return values
  }
  resetComponent(){
  
  }
/*   resetValue(){
    
  } */
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
  ////////console.log(_details)
  Object.assign(fi, _details);
  ////////console.log(fi)
  /* _details.forEach(function(d){
    ////////console.log(d)
  }) */
}

FilterExpert.prototype.valuesNodes=function(nodes){
  var fi=this,values=[],filterClassName
  ////console.log(fi)
  let index=networkGraph.filterClassesObjects.findIndex((element) => element.filters.some((subElement) => subElement.id == node.id))
  networkGraph.filterClassesObjects.filter((d)=>d.name==filterClassName)[0]

  nodes.forEach(function(d){
    if(d.value!=fi.class){
      values.push(d[fi["field"]])
    }
    ////////console.log(d[fi["field"]])
    //values.push(d[fi["field"]])
    /* if(d["class"]==fi.details.class){
      if(d[fi.details.property]!=undefined){
        values.push(d[fi.details.property].toLowerCase())
      }
    } */
  })
  //////console.log(fi)
  //////console.log(values)
  return values
}

FilterExpert.prototype.addHtml=function (){
    var fi=this;

    var div = document.createElement("div");
    div.className="relative"
}

FilterExpert.prototype.show= function () {
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .fadeIn( "slow", function() {
  });
  delete this.hidden
  networkGraph.filterClassesObjects.filter(cf=>cf.name==this.class)[0].checkHidden()
}

class FilterExpertDropdown extends FilterExpert {
  async addHtml() {
    var fi=this;
    super.addHtml();
    await $.get("pages/select-filter.html", function (code) {
      code=code.replace("Label",fi.field).replace("relatedFilters(this)","relatedFiltersExpert(this)")
/*       if(fi.details.filter_text){
        code=code.replaceAll("HelperText",fi.details.filter_text)
      }else{
        code=code.replaceAll("HelperText","")
      } */
      $("#"+fi.internalClass+"_filters").append($(code)).ready(function () {
        //console.log(code)
        var select=document.getElementById("select-default")
        select.name = fi.internalClass + "_"+ fi.field;
        select.id = fi.internalClass + "_"+ fi.field;
        fi.getResultsField();
        fi.fillField();
        runAutoInit()
      }) 
    });       
  }
  getResultsField(){
    var fi=this,valuesFilter;
    //////console.log(fi.field)
    if(fi.field=="type"){
      //////console.log(configRow)
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
    fi.values=valuesFilter;
  }
  fillField(){
    var fi=this;
    let select=document.getElementById(fi.internalClass + "_"+ fi.field)
    ////////////////////////console.log(select)
    ////////console.log(valuesFilter)
    //fi.values=checkAddAll(fi.values)
    addHtmlOptionsSelect(select,fi.values)
  }
  addValuesChanged(el){
/*     //////console.log(el)
    var value=el.value()
    //////console.log(value)
    var checked=el.querySelector("input").checked
    if(!this["valuesChanged"]){
      this["valuesChanged"]=[]
    }
    if(checked){
      this["valuesChanged"].push(value)
    }else{
      if(this["valuesChanged"].includes(value)){
        this["valuesChanged"].splice(this["valuesChanged"].indexOf(el.getAttribute("data-select-multiple-value")),1);
      }
    }
    if((value=="Select all")&&(checked)){
      this["valuesChanged"]=this.values
    }else if((value=="Select all")&&(!checked)){
      this["valuesChanged"]=[]
    }
    //////console.log(this["valuesChanged"]) */
    this["valuesChanged"]=el.value
    //////console.log(el.value)
  }
  checkConditionNode(node){
    var fi=this;
    //////console.log(node[fi.field])

    ////////console.log(filterCondition)
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
  sortValues(){
    this.values=[...new Set(this.values)].sort()
  }
}
/* class FilterExpertDropdown extends FilterExpert {
  async addHtml() {
    var fi=this;
    ////////////console.log("addHtml expert dropdown")
    super.addHtml();
    let code = await getHtmlCodeFromFile("pages/select-multiple-filter.html");
    code=code.replace("Label",fi.field)
    $("#"+fi.internalClass+"_filters").append(code).ready(function () {
      //ECL.autoInit();
      var select=document.getElementById("select-multiple")
      select.name = fi.internalClass + "_"+ fi.field;
      select.id = fi.internalClass + "_"+ fi.field;
      fi.fillField();
      runAutoInit()
      //$(".ecl-checkbox__input").click(relatedFiltersExpert(this));
    });
    
  }
  fillField(){
    var fi=this,valuesFilter;
    let select=document.getElementById(fi.internalClass + "_"+ fi.field)
    //////console.log(fi.field)
    if(fi.field=="type"){
      //////console.log(configRow)
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
    ////////////////////////console.log(select)
    ////////console.log(valuesFilter)
    this.values=valuesFilter
    //////console.log(this)
    addHtmlOptionsSelectMultiple(select,valuesFilter)
  }
  addValuesChanged(el){
    var value=el.getAttribute("data-select-multiple-value")
    var checked=el.querySelector("input").checked
    if(!this["valuesChanged"]){
      this["valuesChanged"]=[]
    }
    if(checked){
      this["valuesChanged"].push(value)
    }else{
      if(this["valuesChanged"].includes(value)){
        this["valuesChanged"].splice(this["valuesChanged"].indexOf(el.getAttribute("data-select-multiple-value")),1);
      }
    }
    if((value=="Select all")&&(checked)){
      this["valuesChanged"]=this.values
    }else if((value=="Select all")&&(!checked)){
      this["valuesChanged"]=[]
    }
    //////console.log(this["valuesChanged"])
  }
  checkConditionNode(node){
    var fi=this;
    //////console.log(node[fi.field])

    ////////console.log(filterCondition)
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
  addValuesField(values,filterId){
    this;
    $(("#accordion-filters #"+this.property)).empty();
    var select = document.querySelector("#accordion-filters #"+this.property);
    addHtmlOptionsSelectMultiple(select,values,true)
  }
} */