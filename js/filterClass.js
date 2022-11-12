FilterClass = function (_name) {
  this.name = _name;
  //this.init()
};
  

FilterClass.prototype.init= async function(){
  var cf=this;
  cf.filters=[]
  await cf.initFilters()
}

FilterClass.prototype.getCode= async function(){
  var cf=this;

  cf.code=await getHtmlCodeFromFile("pages/filter-class-item.html")
  
  //cf.code=code.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
  cf.setTitle()
  $("#accordion-filters").append(cf.code)
}

function FilterClassBasic(...args){
  FilterClass.apply(this, args);
}
  
FilterClassBasic.prototype = Object.create(FilterClass.prototype);

FilterClassBasic.prototype.setValuesFilters = function(filterId){
  /* var cf=this;
  cf.filters.forEach(function(f){
    if(f.details.property!=name){
      ////////////console.log(f.htmlEl)
      ////////////console.log(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))
      let valuesFilter=[...new Set(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))]
      removeOptionsSelect(f)
      ////////////console.log(valuesFilter)
      addOptionsSelect(f.htmlEl,valuesFilter,false)
    }
  }) */
  var cf=this,values;
  cf.filters.forEach(function(f){
    if(f.id!=filterId){
      console.log(f)
      values=f.getValuesNodes(linkedDataGraph.dataFiltered["flatData"]["nodes"])
      console.log(values)
      f.addValuesField(values)
    }
    /* if(f.details.property!=name){
      ////////////console.log(f.htmlEl)
      ////////////console.log(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))
      let valuesFilter=[...new Set(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))]
      removeOptionsSelect(f)
      ////////////console.log(valuesFilter)
      addOptionsSelect(f.htmlEl,valuesFilter,false)
    } */
  })
}


FilterClassBasic.prototype.checkConditionNode = function(node,filterId){
  var cf=this,hidden=false;
  //console.log(hidden)
  cf.filters.forEach(function(f){
      //for (let i = 0; i < cf.filters.length; ++i) 
      if(f.id==filterId){
        let condition=f.checkConditionNode(node)
        ////////////////console.log(filters[i])
        ////////////////console.log(condition)
      if(condition){
          ////////////////////////console.log("true")
          hidden=true
          //break;
        //}else{
          ////////////////////////console.log("false")
      }
      }

  })
  //console.log(hidden)
  return hidden;
}

FilterClassBasic.prototype.setTitle = async function () {
  var cf=this;
  cf.code=cf.code.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
}

FilterClassBasic.prototype.initFilters = async function () {
  var cf=this;
  let filters=configRow.filters.filter(d=>d.class==cf.name)

/*   code=await getHtmlCodeFromFile("pages/filter-class-item.html")
  
  cf.code=code.replace("FilterClassName",networkGraph.nodesClassesShow[cf.name]).replaceAll("accordion-example-content",cf.name+"_filters")
  $("#accordion-filters").append(cf.code) */

  cf.getCode()

  for (let i = 0; i < filters.length; i++) {
/*     if(filters[i]["filter_type"]=="dropdown"){
      cf.filters.push(new FilterBasicDropdown(filters[i]))
    }else if(filters[i]["filter_type"]=="date"){
      cf.filters.push(new FilterBasicDate(filters[i]))
    }else if(filters[i]["filter_type"]=="text"){
      cf.filters.push(new FilterBasicText(filters[i]))
    }else if(filters[i]["filter_type"]=="number"){
      cf.filters.push(new FilterBasicNumber(filters[i]))
    } */
    //////////console.log(filters[i])
    await cf.addFilterType(filters[i],false)
  }
  //ECL.autoInit()

}

FilterClassBasic.prototype.addFilterType = async function (filter,imported) {
  var cf=this,fi;
  ////////////console.log(filter)
  ////////////console.log(imported)
  if(filter["filter_type"]=="dropdown"){
    ////console.log("antes FilterBasicDropdown")
    fi=new FilterBasicDropdown(filter,imported)
    await fi.init()
    cf.filters.push(fi)
    ////console.log("despues de FilterBasic Dropdown")
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
  ////////////console.log(filter)
  ////////////console.log(imported)
  ////////////console.log(cf)
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
  ////////////console.log(cf)
  cf.code=cf.code.replace("FilterClassName",cf.name).replaceAll("accordion-example-content",cf.internalName+"_filters")
}

FilterClassExpert.prototype.initFilters = async function (){
  var cf=this;
  ////////////console.log("init filters")
  //cf.filters=networkGraph.filters.filter(d=>d.class==cf.name)
  //////////console.log(cf)
  cf.internalClass=configRow.node.uri.replaceAll(":","_").replaceAll(".","_").replaceAll("/","_")
  cf.filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"type","internalClass":cf.internalClass,"id":cf.internalClass+"_type"})
  cf.filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"properties","internalClass":cf.internalClass,"id":cf.internalClass+"_properties"})
  cf.filters.push({"class":configRow.node.uri,"filter_type":"dropdown","field":"values","internalClass":cf.internalClass,"id":cf.internalClass+"_values"})
  
  ////////////console.log(cf)
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
  //console.log(f)
    /* if(f.details.property!=name){
      ////////////console.log(f.htmlEl)
      ////////////console.log(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))
      let valuesFilter=[...new Set(nodes.map(d=>d[f.details.property]).filter(d=>d!=undefined))]
      removeOptionsSelect(f)
      ////////////console.log(valuesFilter)
      addOptionsSelect(f.htmlEl,valuesFilter,false)
    } */
  })
}

Filter = function (_details,_imported) {
    ////////////console.log(_imported)
    var fi=this
    fi.details=_details
    fi.imported=_imported
    //fi.init()
    /* if(_imported){
      ////////////console.log("import")
      fi.import(_details)
    }else{
      fi.details = _details;
      ////////console.log(this)
      fi.init();
    } */
  };  
Filter.prototype.init= async function () {
  var fi=this;
  if(fi.imported){
    ////////////console.log("import")
    fi.import(fi.details)
  }else{
    ////console.log("antes de values and html")
    await fi.valuesAndHtml();
    //////console.log("despues de values and html")

  }
}
Filter.prototype.valuesAndHtml = async function () {
  var fi=this;
  fi.values=fi.getValuesNodes(networkGraph.data["nodes"])
  ////console.log("antes de addHtml")
  await fi.addHtml()
  //////console.log("despues de addHtml")

  ////////console.log("despues addHtml")

  }

Filter.prototype.import = function (details) {
    var fi=this;
    ////////////console.log(details)
    Object.keys(details).forEach(function(k){
      fi[k]=details[k]
    })
    ////////////console.log(fi)
    fi.addHtml()
    //fi.getValuesVisibleNodes()
    //fi.addHtml()
}
Filter.prototype.removeValuesChanged=function (){   
  console.log("entra en remove values changed") 
  delete this["valuesChanged"]
}

Filter.prototype.getValuesNodes=function (nodes){
    var fi=this,values=[]
    nodes.forEach(function(d){
      //////////////console.log(fi)
      if(d["class"]==fi.details.class){
        if(d[fi.details.property]!=undefined){
          values.push(d[fi.details.property].toLowerCase())
        }
      }
    })
    if(fi.details.filter_type=="date"){
      let setValues=[...new Set(values)]
      ////////////console.log(setValues)
      /* if(setValues>1){
        values=setValues.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return formatDate(a) - formatDate(b);
        });
      }else{
        ////////////console.log(setValues)
        values=[formatDate(setValues[0])]
      } */
      values=setValues.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        ////////////console.log(a)
        ////////////console.log(b)
        return formatDate(a) - formatDate(b);
      });
      ////////////console.log(values)
      /* values.forEach(function (f){

      }) */
      values=values.map(d=>dateValidFormat(d))
    }else{
      values=[...new Set(values)].sort()
    }
    ////////////console.log(values)
    return values
    /* if ((fi.values.length>1)&(fi.details.filter_type=="dropdown")){
      fi.values=["All"].concat(fi.values)
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
  //////console.log("al acabar el filter basic genérico")
}

class FilterBasicDropdown extends FilterBasic {
   async addHtml() {
    var fi=this;
    super.addHtml();
    ////console.log("al entrar en filterbasicdropdown")
    ////////console.log("entra")


    await $.get("pages/select-filter.html", function (code) {
      ////console.log("despues de añadir code")
      code=code.replace("Label",fi.propertyFullName)
      if(fi.details.filter_text){
        code=code.replaceAll("HelperText",fi.details.filter_text)
      }else{
        code=code.replaceAll("HelperText","")
      }
      $("#"+fi.details.class+"_filters").append($(code)).ready(function () {
        ////console.log(code)
        ECL.autoInit();
        var select=document.getElementById("select-default")
        select.name = fi.details.property;
        select.id = fi.id;
        ////////////console.log(fi.id)
  
        let valuesFilter=fi.values
        ////console.log(valuesFilter)
        addOptionsSelect(select,valuesFilter,false)
        if(fi.elValue){
          select.value = fi.elValue;
        }else{
          select.value = valuesFilter[0];
        }
      }) 
    });
    ////console.log("despues del codigo de añadir el código")
    /* ECL.autoInit();
    var select=document.getElementById("select-default")
    select.name = fi.details.property;
    select.id = fi.id;
    ////////////console.log(fi.id)

    let valuesFilter=fi.values
    //////////console.log(valueFilter)
    addOptionsSelect(select,valuesFilter,false)
    if(fi.elValue){
      select.value = fi.elValue;
    }else{
      select.value = valuesFilter[0];
    } */
    

/*     fi.htmlEl=document.getElementById(fi.id)

    //////////console.log(code)
    code=code.replace("Label",this.propertyFullName)
    if(this.details.filter_text){
      code=code.replaceAll("HelperText",this.details.filter_text)
    }else{
      code=code.replaceAll("HelperText","")
    }
    
    $("#"+this.details.class+"_filters").append(code).ready(function () {
      ECL.autoInit();
      var select=document.getElementById("select-default")
      select.name = fi.details.property;
      select.id = fi.id;
      ////////////console.log(fi.id)
  
      let valuesFilter=fi.values
      //////////console.log(valueFilter)
      addOptionsSelect(select,valuesFilter,false)
      if(fi.elValue){
        select.value = fi.elValue;
      }else{
        select.value = valuesFilter[0];
      }
      
  
      fi.htmlEl=document.getElementById(fi.id)
    }) */


    
  }
/*   checkConditionNode(node){
    let elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue

    if(elValue=="All"){
      return false
    }else{
      if(node[this.details.property]){
        ////////////console.log(elValue)
        ////////////console.log(node[this.details.property].toLowerCase())
        if(elValue.toLowerCase()==node[this.details.property].toLowerCase()){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    }
  } */
  addValuesField(values){
    //////////console.log(this.values);
    $(("#accordion-filters #"+this.details.property+"_filter")).empty();
    var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    ////////////console.log(this.details.property+"_filter")
    ////////////console.log(select)
    if(values.length>1){
      values=["All"].concat(values)
    }
    addHtmlOptionsSelect(select,values,false)
  }
  checkConditionNode(node){
    let elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue
    console.log(this)
    console.log(elValue)
    if(elValue=="All"){
      return false
    }else{
      if(node[this.details.property]){
        ////////////console.log(elValue)
        ////////////console.log(node[this.details.property].toLowerCase())
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
    //super.valuesChanged(values);
    console.log("entra")
    console.log(document.getElementById(this.id))
    this["valuesChanged"]=values
  }
}

class FilterBasicDate extends FilterBasic {
  async addHtml() {
    var fi=this;
    super.addHtml();
    //let code = await getHtmlCodeFromFile("pages/date-filter.html");

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
      ////////////console.log(this.values[0])
      /* $("#"+this.details.class+"_filters #start-date").attr("value",this.values[0])
      $("#"+this.details.class+"_filters #start-date").attr("name",this.details.property+"_start")
      $("#"+this.details.class+"_filters #start-date").attr("id",this.details.property+"_filter_start")

      $("#"+this.details.class+"_filters #end-date").attr("value",this.values[this.values.length-1])
      $("#"+this.details.class+"_filters #end-date").attr("name",this.details.property+"_end")
      $("#"+this.details.class+"_filters #end-date").attr("id",this.details.property+"_filter_end") */
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
  addValuesField(values){
    ////////////console.log(this.values);
    $(("#accordion-filters #"+this.details.property+"_filter_start")).val(values[0]);
    $(("#accordion-filters #"+this.details.property+"_filter_end")).val(values[values.length-1]);

    //var select = document.querySelector("#accordion-filters #"+this.details.property+"_filter");
    //addHtmlOptionsSelect(select,this.values,false)
  }
  addValuesChanged(values){
    this["valuesChanged"]=values
  }
}

class FilterBasicText extends FilterBasic {
  async addHtml() {
    var fi=this;
    super.addHtml();
/*     let code = await getHtmlCodeFromFile("pages/text-filter.html");
    code=code.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.details.filter_text).replaceAll("Placeholder text","Enter "+fi.propertyFullName).replaceAll("example-input-id-1",fi.id)
    $("#"+fi.details.class+"_filters").append(code).ready(function () {
      //ECL.autoInit();
    })
    let docs=document.getElementsByClassName(fi.details.class)
    let searchValues=[]
    for (let d of docs) {
        searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
    }
    fi.htmlEl=document.getElementById(fi.id)

    autocomplete(document.getElementById(fi.id), searchValues); */


    await $.get("pages/text-filter.html", function (code) {
      code=code.replace("Label",fi.propertyFullName).replaceAll("HelperText",fi.details.filter_text).replaceAll("Placeholder text","Enter "+fi.propertyFullName).replaceAll("example-input-id-1",fi.id)
      $("#"+fi.details.class+"_filters").append(code).ready(function () {
        //ECL.autoInit();
      })
      let docs=document.getElementsByClassName(fi.details.class)
      let searchValues=[]
      for (let d of docs) {
          searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
      }
      fi.htmlEl=document.getElementById(fi.id)

      autocomplete(document.getElementById(fi.id), searchValues);
      })
      ////////////console.log(this.values[0])
      /* $("#"+this.details.class+"_filters #start-date").attr("value",this.values[0])
      $("#"+this.details.class+"_filters #start-date").attr("name",this.details.property+"_start")
      $("#"+this.details.class+"_filters #start-date").attr("id",this.details.property+"_filter_start")

      $("#"+this.details.class+"_filters #end-date").attr("value",this.values[this.values.length-1])
      $("#"+this.details.class+"_filters #end-date").attr("name",this.details.property+"_end")
      $("#"+this.details.class+"_filters #end-date").attr("id",this.details.property+"_filter_end") */
  }

  checkConditionNode(node){
    const elValue=$("#"+this.details.property+"_filter").val()
    this.elValue=elValue
    if(elValue!=""){
      if(node[this.details.property]!=elValue){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  addValuesField(values){
    //this.htmlEl=document.getElementById(fi.id)

    autocomplete(document.getElementById(this.id), values);
  }
  addValuesChanged(values){
    this["valuesChanged"]=values
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
    //checkConditionNode(node){
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
      addValuesChanged(values){
        this["valuesChanged"]=values
      }

    //}
  }


function FilterExpert(...args){
    Filter.apply(this, args);
    }

FilterExpert.prototype = Object.create(Filter.prototype);

FilterExpert.prototype.addHtml=function (){
  /* var fi=this;
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
    
    fi.mainHtmlEl=div */
    var fi=this;

    var div = document.createElement("div");
    div.className="relative"
    ////////////////console.log(fi)
/*     div.id=fi.details.property.replaceAll(" ","_")+"_root"
    fi.id=fi.details.property.replaceAll(" ","_");

    fi.propertyFullName=configRow.properties.filter(d=>d.property==fi.details.property)[0]["property_name"].replace(networkGraph.nodesClassesShow[fi.details.class],"").trim()
    
    fi.mainHtmlEl=div

    if(document.getElementById(fi.id+"_selection")){
      fi.selection=document.getElementById(fi.id+"_selection")
    }else{
      fi.selection="none"
    }

    fi.htmlEl=document.getElementById(fi.id) */
}
class FilterExpertDropdown extends FilterExpert {
  async addHtml() {
    var valuesFilter;
    super.addHtml();
    ////////////////console.log(this)
    let code = await getHtmlCodeFromFile("pages/select-multiple-filter.html");
    code=code.replace("Label",this.details.field)
    ////////////console.log($("#"+this.details.internalClass+"_filters"))
    $("#"+this.details.internalClass+"_filters").append(code).ready(function () {
      ECL.autoInit();
    });
    ////////////console.log(this)
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
    /* if(valuesFilter.length>1){
      valuesFilter.unshift("All")
    } */
    
    
    //let valuesFilter=this.values
    //////////////////console.log("addOptions")
    addOptionsSelect(select,valuesFilter,true)
    ////////////////console.log(select)
    //select.value = "Select all";
    //selected=""

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
  addValuesField(values){
    this;
    $(("#accordion-filters #"+this.details.property)).empty();
    var select = document.querySelector("#accordion-filters #"+this.details.property);
    addOptionsSelect(select,values,true)
  }
}

/* class FilterExpertDropdown extends FilterExpert {
  async addHtml() {
    var valuesFilter;
    super.addHtml();
    ////////////////console.log(this)
    let code = await getHtmlCodeFromFile("pages/select-filter.html");
    code=code.replace("Label",this.details.field)
    ////////////////console.log($("#"+this.details.internalClass+"_filters"))
    $("#"+this.details.internalClass+"_filters").append(code).ready(function () {
      ECL.autoInit();
    });
    
    var select=document.getElementById("select-default")
    select.name = this.details.internalClass + "_"+ this.details.field;
    select.id = this.details.internalClass + "_"+ this.details.field;

    if(this.details.field=="type"){
      if(configRow.option.position=="s"){
        valuesFilter=[...new Set(linkedDataGraph.results.map(d=>d.o.type))].sort()
      }else{
        valuesFilter=[...new Set(linkedDataGraph.results.map(d=>d.s.type))].sort()
      }
    }else if(this.details.field=="values"){
      if(configRow.option.position=="s"){
        valuesFilter=[...new Set(linkedDataGraph.results.map(d=>d.o.value))].sort()
      }else{
        valuesFilter=[...new Set(linkedDataGraph.results.map(d=>d.s.value))].sort()
      }
    }else{
      valuesFilter=[...new Set(linkedDataGraph.results.map(d=>d.p.value))].sort()
    }
    if(valuesFilter.length>1){
      valuesFilter.unshift("All")
    }
    
    
    //let valuesFilter=this.values
    addOptionsSelect(select,valuesFilter)
    select.value = valuesFilter[0];

    code = await getHtmlCodeFromFile("pages/select-multiple-filter.html");
    $("#"+this.details.internalClass+"_filters").append(code).ready(function () {
      ////////////////console.log(code)
      ECL.autoInit();
    });
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
  addValuesField(values){
    this;
    $(("#accordion-filters #"+this.details.property)).empty();
    var select = document.querySelector("#accordion-filters #"+this.details.property);
    addOptionsSelect(select,this.values)
  }
} */