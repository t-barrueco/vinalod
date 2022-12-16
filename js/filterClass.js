FilterClass = function (_name) {
  this.name = _name;
};
  

FilterClass.prototype.init= async function(){
  var cf=this;
  cf.filters=[]
  await cf.initFilters()
  //ECL.autoInit();
}

FilterClass.prototype.getCode= async function(){
  var cf=this;

  cf.code=await getHtmlCodeFromFile("pages/filter-class-item.html")
  
  cf.setTitle()
  $("#accordion-filters").append(cf.code)
}

FilterClass.prototype.checkHidden=async function(){
  var cf=this,hidden=true;
  //////console.log(cf.filters)
  for(i=0;i<cf.filters.length;i++){
    //////console.log(cf.filters[i].hidden)
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

FilterClass.prototype.checkConditionNode = function(node,filterId){
  var cf=this,hidden=false;
  ////console.log(node)
  ////console.log(filterId)
  cf.filters.forEach(function(f){
      var condition;
      if(filterId){
        //console.log(f.id)
        //console.log(filterId)
        ////console.log(f.details)
        //////////console.log(filterId)
        if(f.id==filterId){
          //////////console.log("f.id==filterID")
          condition=f.checkConditionNode(node)
        }
      }else{
        //////////console.log("f.id!=filterID")
        condition=f.checkConditionNode(node)
      }
      //console.log(condition)
      if(condition){
        //console.log(f)
        hidden=true
      }
  })
  return hidden;
}

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
    //this.hide();
  });
  //.hide();
  this.hidden=true
}

FilterClassBasic.prototype.show=async function(){
  $( "#"+this.name+"_filters" )
  .closest( "#accordion-filters" )
  .fadeIn( "slow", function() {
    //this.show();
  });
  //.show();

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
  //ECL.autoInit()
  
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
      //////console.log(f.values)
    }
  })
}

/* FilterClassBasic.prototype.checkConditionNode = function(node,filterId){
  var cf=this,hidden=false;
  //////////console.log(node)
  //////////console.log(filterId)
  cf.filters.forEach(function(f){
      var condition;
      if(filterId){
        //////////console.log(f.id)
        //////////console.log(filterId)
        if(f.id==filterId){
          //////////console.log("f.id==filterID")
          condition=f.checkConditionNode(node)
        }
      }else{
        //////////console.log("f.id!=filterID")
        condition=f.checkConditionNode(node)
      }
      if(condition){
        hidden=true
      }
  })
  return hidden;
} */

FilterClassBasic.prototype.setTitle = async function () {
  var cf=this;
  cf.code=cf.code.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
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
  var cf=this,filters=[];

  cf.internalClass=configRow.node.uri.replaceAll(":","_").replaceAll(".","_").replaceAll("/","_")
  filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"type","internalClass":cf.internalClass,"id":cf.internalClass+"_type"})
  filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"property","internalClass":cf.internalClass,"id":cf.internalClass+"_property"})
  filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"value","internalClass":cf.internalClass,"id":cf.internalClass+"_value"})
  
  cf.getCode()

  for (let i = 0; i < filters.length; i++) {
    if(filters[i]["filter_type"]=="dropdown"){
      fi=new FilterExpertDropdown(filters[i])
      await fi.init()
      //////console.log("antes de push")
      cf.filters.push(fi)
    }else if(cf.filters[i]["filter_type"]=="text"){
      fi=new FilterExpertText(filters[i])
      await fi.init()
      cf.filters.push(fi)
    }
  }

/*   $("#accordion-filters").append(cf.code).ready(async function (){

  }) */
  //////console.log("antes de hidden")
  cf.checkHidden()
}
FilterClassExpert.prototype.hide=async function(){
  $( "#"+this.internalClass+"_filters" )
  .closest( "#accordion-filters" )
  .fadeOut( "slow", function() {
    //this.hide();
  });
  //.hide();
  this.hidden=true
}

FilterClassExpert.prototype.show=async function(){
  $( "#"+this.internalClass+"_filters" )
  .closest( "#accordion-filters" )
  .fadeIn( "slow", function() {
    //this.show();
  });
  //.show();

  delete this.hidden
}

FilterClassExpert.prototype.setValuesFilters = function(){
  var cf=this;
  cf.filters.forEach(function(f){
  })
}

Filter = function (_details,_imported) {
    var fi=this
    //console.log(_details)
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
    var fi=this,values=[]
    nodes.forEach(function(d){
      if(d["class"]==fi.details.class){
        if(d[fi.details.property]!=undefined){
          values.push(d[fi.details.property].toLowerCase())
        }
      }
    })
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
    ////////console.log(d3.select("#"+d.getAttribute("id")).data()[0])
    ////////console.log(fi.details.property)
    if(d3.select("#"+d.getAttribute("id")).data()[0][fi.details.property]){
      searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0][fi.details.property])
    }
  }  
  ////////console.log(searchValues)
  fi.values=searchValues
  fi.sortValues()
}

Filter.prototype.resetAllValues=function (){
  var fi=this
  fi.getValuesAllNodes()
  //////console.log(fi.values)
  fi.fillField()
  //////console.log(fi.values)
  fi.resetComponent()
  //////console.log(fi.values)
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
  ////////console.log(fi.values)
  fi.sortValues()
  //fi.resetValue()
}

function FilterBasic(...args){
  Filter.apply(this, args);
  }
    
FilterBasic.prototype = Object.create(Filter.prototype);

FilterBasic.prototype.copyDetails=function(_details){
  var fi=this;
  fi.details=_details
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

  ////////console.log("addHtml super")
}

FilterBasic.prototype.hide= function () {
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  .fadeOut( "slow", function() {
    //this.hide();
  });
  //.hide();
  this.hidden=true
  networkGraph.filterClassesObjects.filter(cf=>cf.name==this.details.class)[0].checkHidden()
}

FilterBasic.prototype.show= function () {
  $( "#"+this.id )
  .closest( ".ecl-form-group" )
  //.show();
  .fadeIn( "slow", function() {
    //this.hide();
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
    fi.checkAddAll()
    $(("#accordion-filters #"+fi.details.property+"_filter")).empty();
    var select=document.getElementById(fi.details.property+"_filter")
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
  checkAddAll(){
    if(this.values.length>1){
      this.values=["All"].concat(this.values)
    }
  }
  addValuesChanged(el){
    this["valuesChanged"]=el.value
  }
  getValuesChanged(){
    var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    select.value=this["valuesChanged"]
  }
  sortValues(){
    this.values=[...new Set(this.values)].sort()
    //return values
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
    //////////console.log(ECL.autoInit())
  }
/*   resetValue(){
    var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    if(this.values.length>1){
      select.value = "All"
    }else{
      select.value = this.values[0];
    }
    const $options = Array.from(select.options);
    //////////console.log($options)
    const optionToSelect = $options.find(item => item.text ===select.value);
    optionToSelect.selected = true;
  } */
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
    ////////console.log("addHtml date")
    super.addHtml();

    await $.get("pages/date-filter.html", function (code) {
      //////////////////console.log(fi)
      //////////////console.log(ECL.autoInit());
      code=code.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.details.filter_text)
      $("#"+fi.details.class+"_filters").append(code).ready(function () {
      ////////////console.log(fi.values[0])

      //$("#"+fi.details.class+"_filters #start-date").attr("value",fi.values[0])
      //$("#"+fi.details.class+"_filters #start-date").attr("value",'01-06-2019')
      ////////////console.log($("#"+fi.details.class+"_filters #start-date").val())
      $("#"+fi.details.class+"_filters #start-date").attr("name",fi.details.property+"_start")
      $("#"+fi.details.class+"_filters #start-date").attr("id",fi.details.property+"_filter_start")

      //$("#"+fi.details.class+"_filters #end-date").attr("value",fi.values[fi.values.length-1])
      $("#"+fi.details.class+"_filters #end-date").attr("name",fi.details.property+"_end")
      $("#"+fi.details.class+"_filters #end-date").attr("id",fi.details.property+"_filter_end")
      ////////////console.log(ECL.autoInit());
      ////////console.log(fi)
      ////////console.log(this)
      ////////console.log(Object.getOwnPropertyNames(fi))
      fi.fillField()
      runAutoInit()
      ////////////console.log($("#"+fi.details.property+"_filter_start").val())

      })
    })
  }
  fillField(){
    var fi=this;
/*     ////////console.log(fi.values)
    ////////console.log($("#"+fi.details.property+"_filter_start"))
    ////////console.log($("#"+fi.details.property+"_filter_end"))
    $("#"+fi.details.property+"_filter_start").attr("value",fi.values[0])
    //////////console.log(fi.values)
    //////////console.log(fi.values.length)
    ////////console.log(fi.values[fi.values.length-1])
    ////////console.log($("#"+fi.details.property+"_filter_end"))
    $("#"+fi.details.property+"_filter_end").attr("value",fi.values[fi.values.length-1])
 */
    document.getElementById(fi.details.property+"_filter_start").value = fi.values[0];
    document.getElementById(fi.details.property+"_filter_end").value = fi.values[fi.values.length-1];
  }
  checkConditionNode(node){
    let startDate=$("#"+this.details.property+"_filter_start").val()
    let endDate=$("#"+this.details.property+"_filter_end").val()
    //////////console.log(formatDateComp(node[this.details.property]))
    //////////console.log(formatDateComp(startDate))
    //////////console.log(formatDateComp(endDate))
    if((formatDateComp(node[this.details.property])>=formatDateComp(startDate))&&(formatDateComp(node[this.details.property])<=formatDateComp(endDate))){
      return false
    }else{
      return true
    }
  }
  addValues(values){
    //////////console.log(values)
/*     if(!values){
      values=this.getValuesAllNodes()
      ////////console.log(values)
    } */
    if(values.length==0){
      this.hide()
    }else{
      this.show()
      //values=this.sortValues(values)
      this.sortValues()
      this.setValues(values)
      this.resetComponent()
      //let component=$("#tabsNav nav").attr('id', navPanel.node.id+"_tabsNav")[0]
      //////////console.log(this.id);
      //////////console.log(component)
      //////////console.log(values)
      //if((fi.valuesChanged)&&(values.includes(fi.valuesChanged))){
      ////////////console.log(this.valuesChanged)
/*       if(values.length>1){
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
          
          ////////////console.log(document.getElementById(this.details.property+"_filter_start").value)
          ////////////console.log(document.getElementById(this.details.property+"_filter_start"))
          //$(("#accordion-filters #"+this.details.property+"_filter_end")).val(values[values.length-1]);    
          document.getElementById(this.details.property+"_filter_end").value=formatDateShow(values[values.length-1])
      
        }
      }else{
        document.getElementById(this.details.property+"_filter_start").value=formatDateShow(values[0])
        document.getElementById(this.details.property+"_filter_end").value=formatDateShow(values[0])
      } */

    }
    ////////////console.log(document.getElementById(this.details.property+"_filter_start"))
    ////////////console.log(document.getElementById(this.details.property+"_filter_end"))

    //////////////console.log(window.ECL.components)
    //ECL.autoInit.update()
    //ECLupdate($(("#accordion-filters #"+this.details.property+"_filter_start"))[0])
    //ECL.autoInit().update()
    //this.autoinit.destroy()
    //ECLdestroy($(("#accordion-filters #"+this.details.property+"_filter_start"))[0])
    //ECLdestroy($(("#accordion-filters #"+this.details.property+"_filter_end"))[0])
    
    //////////////console.log( $(("#accordion-filters #"+this.details.property+"_filter_start"))[0].autoinit.destroy())
    //////////////console.log(ECL.autoInit())
  }
  addValuesChanged(el){
    //////////////console.log(el)
    //////////////////console.log(el.id)
    //////////////////console.log(el.value)
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
    //////////////console.log(this["valuesChanged"])
  }
  sortValues(){
    var fi=this;
    let setValues=[...new Set(fi.values)]
    //////////console.log(setValues)
    setValues=setValues.sort(function(a,b){
      return formatDateComp(a) - formatDateComp(b);
    });
    ////////console.log(setValues)
    fi.values=setValues.map(d=>{
      ////////console.log(d)
      return dateValidFormat(d)
    })
    ////////console.log(fi.values)
    //return values
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
        
        ////////////console.log(document.getElementById(this.details.property+"_filter_start").value)
        ////////////console.log(document.getElementById(this.details.property+"_filter_start"))
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
/*   resetValue(){
    ////////console.log(this)
    if(this.values.length>1){
      document.getElementById(this.details.property+"_filter_start").value=formatDateShow(this.values[0])
      document.getElementById(this.details.property+"_filter_end").value=formatDateShow(this.values[1])
    }else{
      document.getElementById(this.details.property+"_filter_start").value=formatDateShow(this.values[0])
      document.getElementById(this.details.property+"_filter_end").value=formatDateShow(this.values[0])
    }
    //this.resetComponent()
  } */
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
      //////////////////////console.log(elValue.toLowerCase())
      ////////////////////////console.log(node)
      //////////////////////console.log(node[this.details.property].toLowerCase())
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
    //////console.log(el)
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
  //console.log(_details)
  Object.assign(fi, _details);
  //console.log(fi)
  /* _details.forEach(function(d){
    //console.log(d)
  }) */
}

FilterExpert.prototype.addHtml=function (){
    var fi=this;

    var div = document.createElement("div");
    div.className="relative"
}
class FilterExpertDropdown extends FilterExpert {
  async addHtml() {
    var fi=this;
    //////console.log("addHtml expert dropdown")
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
    });
    
  }
  fillField(){
    var fi=this,valuesFilter;
    let select=document.getElementById(fi.internalClass + "_"+ fi.field)
    if(fi.field=="type"){
      ////console.log(configRow)
      if(configRow.position=="s"){
        valuesFilter=[...new Set(configRow.results.map(d=>d.o.type))].sort()
      }else{
        valuesFilter=[...new Set(configRow.results.map(d=>d.s.type))].sort()
      }
    }else if(fi.field=="values"){
      if(configRow.position=="s"){
        valuesFilter=[...new Set(configRow.results.map(d=>d.o.value))].sort()
      }else{
        valuesFilter=[...new Set(configRow.results.map(d=>d.s.value))].sort()
      }
    }else{
      valuesFilter=[...new Set(configRow.results.map(d=>d.p.value))].sort()
    }
    //////////////////console.log(select)
    addOptionsSelect(select,valuesFilter,true)
  }
  addValuesChanged(el){
    ////console.log($(el).val())
    this["valuesChanged"]=$(el).val()
  }
  checkConditionNode(node){
    var fi=this;
    //console.log(node)
    let filterCondition=$("#"+fi.property).val()
    //console.log(filterCondition)
    
    filterCondition=$("#"+fi.id).val()
    //console.log(filterCondition)
    if(filterCondition.includes(node[fi.field])){
      return false
    }else{
      return true
    }
    /* if(filterCondition=="All"){
      return false
    }else{
      if(node[this.property]){
        if(filterCondition==node[this.property].toLowerCase()){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    } */
  }
  addValuesField(values,filterId){
    this;
    $(("#accordion-filters #"+this.property)).empty();
    var select = document.querySelector("#accordion-filters #"+this.property);
    addOptionsSelect(select,values,true)
  }
}