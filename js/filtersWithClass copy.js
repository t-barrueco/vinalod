var global=0;
function addFilters(filters,data){
    var filterObject,classFilterObject;
    /* if(options=="WHOISWHO Suborganizations"){
      ////////////////////////////////////////console.log(classesFilterList)
      throw new Error("Something went badly wrong!")
    } */
    //////////////////////////console.log(filters)
    
    //////////////////////////////////////////console.log(classesFilterList)
    //////////////////////////////console.log(networkGraph.treeData)
    /* if(filters.length>4){
      throw new Error("Something went badly wrong!");
    } */
    

    filters.forEach(function(d){
      property=d["property"]
      filterType=d["filter_type"]
      // classFilter format example: OP Theme
      classFilter=d["property"].split("_")[0]
      parent=d["parent"]
      //////////////////////////////////////////console.log(classesFilterList)
      ////////////////////////////////////////////console.log(classFilter)
      //if(!filtersList.includes(new filter(classFilter, property, filterType))){
/*       if(filters[0]["property"]=="directoryOrg_locality"){
            ////////////////////////////////////////console.log(classesFilterList)
            ////////////////////////////////////////console.log(classFilter)
            ////////////////////////////////////////console.log(classesFilterList.filter(c => c.name==classFilter).length)
            throw new Error("Something went badly wrong!");
            } */
      ////////////////////////////console.log(classesFilterList)
      ////////////////////////////console.log(propertiesFilterHist)

      if (classesFilterList.filter(c => c.name==classFilter).length==0){
            ////////////////////////////////////////////console.log(d)
            classFilterObject= new classFilterClass(classFilter)
            filterObject=new filter(classFilter, property, filterType,parent)
            //////////////////////////////////////////console.log(classesFilterList)
            //filtersList.push(new filter(classFilter, property, filterType));
            classesFilterList.push(classFilterObject)
            filtersList.push(filterObject)
            //filterObject.classFilterObject=classFilterObject
            //classFilterObject.listFiltersObjects=[filterObject]
            propertiesFilterHist.push(property)
            //classFilterHist.push(classFilterObject.name)
            filterObject.checkVisibility()
      }else if(!propertiesFilterHist.includes(property)){

            filterObject=new filter(classFilter, property, filterType,parent)
            //filterObject.classFilterObject=classesFilterList.filter(function (c){
            //    return c.name=classFilter
            //})
            //////////////////////////////////////////console.log(classesFilterList)
            //filterObject.classFilterObject.listFiltersObjects.push(filterObject)
            propertiesFilterHist.push(property)
            filtersList.push(filterObject)
            //////////////////////////////////////////////console.log(filterObject.classFilterObject)
            filterObject.checkVisibility()
      }else if(filterType=="text"){
            filterObject=filtersList.filter(function (c){
                return c.property==property
            })[0]
            //////////////////////////console.log(filterObject)
            docs=document.getElementsByClassName(filterObject.classFilterName)
            //////////////////////////console.log(docs)
            var searchValues=[]
            for (let d of docs) {
                searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
            }
            ////////////////////////////console.log(fi)
            ////////////////////////////console.log(document.getElementById(fi.id))
            //////////////////////////console.log(searchValues)
            autocomplete(document.getElementById(filterObject.id), searchValues);
      }
      //else{
        //////////////////////////////////console.log("está en el histórico de properties")
      //}
    //////////////////////////////////console.log(d)
    //////////////////////////////////console.log(filterObject)
    
    })
    ////////////////////////////////////////////console.log(filtersList)
    //////////////////////////////////////////console.log(classesFilterList)
}
function changeHtmlFilter(element,classFilter){

      var filterObject=filtersList.filter(c => c.id==element.id.replace("_selection",""))[0]
      filterObject.changeHtml()

/*       var dateField,label,dateFieldVal,id;
  
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
  
        addFilterType("date_range","",dateField.id.replace(id+"_start",id+"_end"),classFilter,d3.select("#"+classFilter.replaceAll(" ","_")),false)
  
        if((document.getElementById(element.id.replace("_dates_selection","_start")).value!="")&(document.getElementById(element.id.replace("_dates_selection","_end")).value!="")){
          applyFilter([document.getElementById(element.id.replace("_dates_selection","_start")).value],document.getElementById(element.id.replace("_dates_selection","_start")).id,'date','date later than')
          applyFilter([document.getElementById(element.id.replace("_dates_selection","_end")).value],document.getElementById(element.id.replace("_dates_selection","_end")).id,'date','date earlier than')  
        }
  
      }if((element.value=="date later than")|(element.value=="date earlier than")){
  
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
        ////////////////////////////////////////////////////////////////////////////////console.log(dateFieldVal.value)
        dateFieldVal.setAttribute("onchange","applyFilter([this.value],this.getAttribute('id'),'date','')"); 
  
        if(dateFieldVal.value!=""){
          applyFilter([dateFieldVal.value],dateFieldVal.getAttribute('id'),'date','')
        }
      } */
}
function range(element) {
  var values=[],classElement,propertyEl;
  //////////////////////////////////////console.log(element.getAttribute("id"))
  /* classElement=element.parentNode.parentNode.getAttribute("id").replace("_filters","")
  propertyEl=element.getAttribute("id").replace("_filter","") */
  classElement=element.getAttribute("id").replace("_filter","").split("_")[0]
  propertyEl=element.getAttribute("id").replace("_filter","")
  //////////////////////////////console.log(propertyEl)
  //filtersList.filter
  var selectedFilter=filtersList.filter(f => f.property==propertyEl)
  if(selectedFilter.length!=0)
  {
    //////////////////////////////console.log(selectedFilter)
    if(selectedFilter[0]["allValues"]){
      values=selectedFilter[0]["allValues"]
    }else{
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
    }
  }
  /* else{
    //////////////////////////////console.log("no está seleccionado")
  } */
  //////////////////////////////////////console.log(classElement)
  //////////////////////////////////////console.log(propertyEl)
/*   networkGraph.treeData.forEach(function (d){
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
  }) */
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
function applyFilter(element){
  var element_range,filters=[],valuesFilter=[],values=[],classFilter,allValues,parent;
  // Get all current values and all values for filters and update the array of filters and pass it to networkgraph.applyFilter
  //classFilter=property.split("_")[0]
  //property=property.split("_")[1]

/*   //get all lines of config file for graphs added
  var options=configFile.filter(function(item) {
    return graphHistory.includes(item.option)
  })

  //add all filters added until now
  options.forEach(function (d){
    if (d.filters.length>0){
      d.filters.forEach(function (v){
        filters.push(v)
      })
    }
  }) */
  ////////////////////console.log(element)
  ////////////////////////////////////////console.log(element.getAttribute("id"))
  ////////////////////////////console.log(applyFilter)
  element_range=document.getElementById(element.getAttribute("id").replace(new RegExp("_start" + '$'), '').replace(new RegExp("_end" + '$'), ''))
  //////////////////////////////console.log(element_range)
  if((element!=null)&(element_range!=null)){
    ////////////////////////////////////////console.log("entra")
    element=element_range
  }

  element_range=document.getElementById(element.parentNode.parentNode.getAttribute("id").replace("_filter",""))

  if((element!=null)&(element_range!=null)){
    ////////////////////////////////////////console.log("entra")
    element=element_range
  }

  //////////////////////////////console.log(element)
  ////////////////////////////////////////console.log(filtersList)
  //iterate all filters added 
/*   filtersList.forEach(function (f){
    f.applyFilter()
  }) */
  //filters=valuesFilter
  //networkGraph.applyFilter2(valuesFilter,classFilter,property)
  ////////////////////////////////////////console.log(filtersList.filter(f => f.id==element.getAttribute("id")))
  if (filtersList.filter(f => f.id==element.getAttribute("id")).length!=0){

  var hiddenNodes=[],parentHidden=false,selectedFilter;

  selectedFilter=filtersList.filter(f => f.id==element.getAttribute("id"))[0]
  //////////////////////////////////////console.log(selectedFilter)
  selectedFilter.applyFilter()
  //vis.filters=filters
  //property=classFilter+"_"+property
  /* selectedFilter=filters.filter(function(item) {
    return ((item.class == classFilter)&(item.property == property))
  })[0]
  //////////////////////////////////////console.log(filtersList) */
  //changeValuesFilters()

  networkGraph.treeData.forEach(function(t){
    parentHidden=false
    //////////////////////////////////////console.log(t)
    //////////////////////////////////////////////////////////////console.log(hiddenNodes)
    if(hiddenNodes.includes(t.id)){
      t.hidden=true
      parentHidden=true
    }else{
      //if(check_one_filter(t,filters,classFilter,property)){
      if(check_filter(t,selectedFilter)){
        t.hidden=true
        parentHidden=true
        if(!hiddenNodes.includes(t.id)){
          hiddenNodes.push(t.id)
        }
        //////////////////////////////////////////////////////////////console.log(t)
        //////////////////////////////////////////////////////////////console.log(hiddenNodes)
      }else{
        delete t.hidden
      }
    }
    
    if(t.children!=undefined){
      t.children.forEach(function(v){
        ////////////////////////////////////////////////////console.log(v)
        ////////////////////////////////////////////////////console.log(parentHidden)
        if(parentHidden){
          v["hidden"]=true
          if(!hiddenNodes.includes(v.id)){
            hiddenNodes.push(v.id)
          }
        }else{
          //if(check_one_filter(v,filters,classFilter,property)){
          if(check_filter(v,selectedFilter)){  
            //////////////////////////////console.log("hidden true segun filters")
            //////////////////////////////console.log(v)
            v["hidden"]=true
            if(!hiddenNodes.includes(v.id)){
              hiddenNodes.push(v.id)
            }
          }else{
            delete v.hidden
          }
        }
        
      })
    }
    
  })
  ////////////////////////////////////////////////////////////////////////////console.log(vis.visibleNodes)
  //changeValuesFilters()
  //////////////////////////////console.log(networkGraph.treeData)
  networkGraph.data=flatten(networkGraph.treeData).flatData
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.enterGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.exitGraph()
  //////////////////////////////////////////////////////////////console.log(classFilter)
  //newValuesFilters(classFilter,property)
  filtersList.forEach(function (f){
    f.getValuesFilterVisibleNodes()
    //////////////////////////////////console.log(f.values)
    //////////////////////////////////console.log(f.parent)
    if(f.classFilterName!=selectedFilter.classFilterName){
      f.changeValues()
      f.checkVisibility()
    }
    
  })
}
function check_filter(node,f){
  var hidden=false
    if(f.classFilterName==node.class){
      if(f.valuesField[0]!=""){

        if(!hiddenNodes.includes(node.id)){
          if(node[f.property]!=undefined){
            if(f.filterType=="date"){
              //////////////////////////////////////console.log("node filter date")
              hidden=f.filterDate(node)
            }else if(f.filterType=="dropdown"){
              hidden=f.filterDropdown(node)
            }else if(f.filterType=="number"){
              ////////////////////////////////console.log("check number")
              hidden=f.filterNumber(node)
            }else if(f.filterType=="text"){
              hidden=f.filterText(node)
            }
            //////////////////////////////console.log(node)
            //////////////////////////////console.log(hidden)
            if(hidden){
              hiddenNodes.push(node.id)
            }
            //{"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":">"
            //hidden=false
          }
        }
      }
    }
    //////////////////////////////////////////////////console.log(hidden)
    //////////////////////////////////////////////////////////////////////console.log(hiddenNodes)
  //})
  return hidden
}
}
function autocomplete(inp, arr) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          b.innerHTML = arr[i].substr(0,arr[i].indexOf(val));
          b.innerHTML += "<strong>" + arr[i].substr(arr[i].indexOf(val), val.length) + "</strong>";
          b.innerHTML += arr[i].substr(arr[i].indexOf(val)+val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
function textEnter(element,e){
  ////////////////////////////console.log(element)
  ////////////////////////////console.log(e)
  if (e.key=="Enter"){
    applyFilter(element)
  }
/*   keyPress(e){
    if(e.keyCode == 13){
       //////////////////////////console.log('value', e.target.value);
       // put the login here
    }
 } */
}

function addFiltersFreeGraph(classFilterName){
  var filterObject,classFilterObject,filters;
  filters=[{"property": classFilterName+"_property","nodeType":"property","filterType":"dropdown","parent":""},
  {"property": classFilterName+"_nodeType","nodeType":"nodeType","filterType":"dropdown","parent":""}]
  ////////////console.log(classesFilterList)

  ////////////////////////console.log(networkGraph.data)
  filters.forEach(function(f){
    //////////console.log(f)
    ////////////console.log(classesFilterList.filter(c => c.name==classFilterName).length)
    //////////console.log(propertiesFilterHist)
    if (classesFilterList.filter(c => c.name==classFilterName).length==0){
          ////////////console.log(f)
          classFilterObject= new classFreeGraph(classFilterName)
          //classFilterObject= new classFilterClass(classFilter)
          filterObject=new filterFreeGraph(f["property"],f["nodeType"],f["filterType"],classFilterName)
          //filterObject=new filter(classFilter, f["property"], f["filterType"],parent)
          classesFilterList.push(classFilterObject)
          propertiesFilterHist.push(f.property)
          ////////////console.log(classesFilterList)
          filtersList.push(filterObject)
          //filterObject.checkVisibility()
    //}else{
    }else if(!propertiesFilterHist.includes(f.property)){
      filterObject=new filterFreeGraph(f["property"],f["nodeType"],f["filterType"],classFilterName)
      propertiesFilterHist.push(f.property)
      filtersList.push(filterObject)
    }
  })
  //console.log(classesFilterList)
  //console.log(filtersList)

}
function applyFreeGraphFilter(element){
  var nodes=[],links=[],empty=true,element_range,filters=[],valuesFilter=[],values=[],classFilter,allValues,parent;

  ////console.log(element)
  ////console.log(filtersList)
  ////console.log(element.name)
  var selectedFilter=filtersList.filter(f => f.name==element.name)[0]
  ////////console.log(element.value)
  //checkFilterIcon(element)
  selectedFilter.values=[element.value]
  ////////console.log(element.getAttribute("nodeType"))
  empty=checkFilterIcon(document.getElementById(element.name))

  if(element.getAttribute("nodeType")=="property"){
    //////////console.log(networkGraph.allData)
    ////////console.log("property")
    nodes.push(networkGraph.allData.links[0]["source"])
    //////console.log(networkGraph.allData.links)
    for (i = 0; i < networkGraph.allData.links.length; i++) {
      //////console.log(element.value)
      if(element.value!="All"){
        //////console.log(networkGraph.allData.links[i]["value"])
        if(element.value.toLowerCase()==networkGraph.allData.links[i]["value"].toLowerCase()){
          //////console.log("encuentra alguno igual")
          links.push(networkGraph.allData.links[i])
          nodes.push(networkGraph.allData.links[i]["target"])
        //}else{
        }
      }else{
        //////console.log(networkGraph.data.links)

        links.push(networkGraph.allData.links[i])
        nodes.push(networkGraph.allData.links[i]["target"])        
      }
      
    } 
    if(!empty){
      links=checkValuesOtherFilters(element,"['target']['type']",links)
      ////console.log(links.map(n=>n["target"]["value"]))
      nodes=[links[0]["source"]]
      nodes=nodes.concat(links.map(n=>n["target"]))
    }

    //////////console.log(links)
    networkGraph.data.links=links
    networkGraph.data.nodes=nodes

  }else if(element.getAttribute("nodeType")=="nodeType"){{
    nodes.push(networkGraph.allData.links[0]["source"])
    //////console.log(networkGraph.allData.links)
    for (i = 0; i < networkGraph.allData.links.length; i++) {
      if(element.value!="All"){
        //////console.log(networkGraph.allData.links[i])
        //////console.log(element.value)
        if(element.value.toLowerCase()==networkGraph.allData.links[i]["target"]["type"].toLowerCase()){
          links.push(networkGraph.allData.links[i])
          nodes.push(networkGraph.allData.links[i]["target"])
        //}else{
        }
      }else{
        //////console.log(checkFilterIcon(document.getElementById(element.name)))
        links.push(networkGraph.allData.links[i])
        nodes.push(networkGraph.allData.links[i]["target"])
      }
    } 
    if(!empty){

      ////console.log("pasa por aquí")
      links=checkValuesOtherFilters(element,"['value']",links)
      ////console.log(links.map(n=>n["target"]["value"]))
      //console.log(nodes)
      networkGraph.data.links=networkGraph.data.links.filter(function(d){
        ////console.log(d)
        ////console.log(element)
        return ((d["source"]["value"]!=element.getAttribute("classFilterName"))|links.includes(d))
      })
      nodes=[networkGraph.data.links[0]["source"]]
      nodes=nodes.concat(networkGraph.data.links.map(n=>n["target"]))
    }
    
    //networkGraph.data.nodes=nodes
    //networkGraph.data.links=links
    networkGraph.data.nodes=nodes

  }

  }
  //console.log(links)
  //console.log(nodes)

  networkGraph.initializeSimulation();
  networkGraph.dataJoinFreeGraph()
  //////////console.log(networkGraph.data)
  networkGraph.enterFreeGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinFreeGraph()
  //////////console.log(networkGraph.data)
  networkGraph.exitGraph() 
  labelsClickFreeGraph(nodes)
  ////console.log(filtersList)
  /* if(global==1){
    throw new Error("Something went badly wrong!")
  }else{
    global+=1
  } */
  filtersList.forEach(function (f){
    if(f!=selectedFilter){
      ////////console.log("entra en distinto de selected")
      
      f.getValuesFilterVisibleNodes()
      f.changeValues()
    }
  })
  //////console.log(element.name)
  //////console.log(document.getElementById(element.name))
  checkFilterIcon(document.getElementById(element.name))
}
function clearFilters(element){
  ////////console.log(element.parentNode.parentNode.parentNode.querySelector('.className').getAttribute("id"))
  ////////console.log(element.parentNode.parentNode.parentNode.querySelector('.className'))
}
function clearFiltersFreeGraph(element){
  ////////console.log(element.parentNode.parentNode.parentNode.querySelector('.className').getAttribute("id"))
  ////////console.log(element.parentNode.parentNode.parentNode.querySelector('.className'))
  var classElement=element.parentNode.parentNode.parentNode.querySelector('.className')
  element.parentNode.querySelector('.filter-icon').style.display="none"
  for (let i = 0; i < classElement.children.length; i++) {
    document.getElementById(classElement.children[i].id.replace("_root","")).value="All"
  }
  restartFreeGraph(element)
}
function restartFreeGraph(element){
  ////////console.log(element.parentNode.parentNode.parentNode.querySelector('.className').getAttribute("id"))
  ////////console.log(element.parentNode.parentNode.parentNode.querySelector('.className'))
  var classElement=element.parentNode.parentNode.parentNode.querySelector('.className')
  //////////console.log(element.parentNode)
  //element.parentNode.querySelector('.filter-icon').style.display="none"
  for (let i = 0; i < classElement.children.length; i++) {
    document.getElementById(classElement.children[i].id.replace("_root","")).value="All"
  }
  ////////console.log(filtersList)
  filtersList.forEach(function(f){
    applyFreeGraphFilter(document.querySelectorAll('[name="'+f.name+'"]')[0])
    //applyFreeGraphFilter(f)
  })
}
function checkFilterIcon(element){
  var empty=true
  ////////console.log(element.parentNode.parentNode.parentNode.querySelector('.className').getAttribute("id"))
  var classElement=element.parentNode.parentNode.parentNode.querySelector('.className')
  for (let i = 0; i < classElement.children.length; i++) {
    if(document.getElementById(classElement.children[i].id.replace("_root","")).value!="All"){
      empty=false
    }
  }
  if(empty){
    element.parentNode.parentNode.parentNode.querySelector('.filter-icon').style.display="none"
  }else{
    element.parentNode.parentNode.parentNode.querySelector('.filter-icon').style.display="block"
  }
  return empty;
}
function checkValuesOtherFilters(element,filterByField,links){
  var filtered;
  //console.log(element)
  ////console.log(filtersList)
  filtered=links
  filtersList.filter(f=>f.classFilterName==element.getAttribute("classFilterName")).forEach(function (d){
    //console.log(d)
    //if(element.getAttribute("classfiltername")==
    if((element.getAttribute("name")!=d.name)&(!(d.values.includes("All")))&(d.values.length>1)){
      //console.log(d)
      ////console.log(networkGraph.allData)
      filtered=filtered.filter(function (v){
        ////console.log(d)
        //console.log(eval("v"+filterByField))
        //console.log(d.values)
        return d.values.includes(eval("v"+filterByField))
      })
      //console.log(filtered)
    }
  })
  //console.log(filtered)
  return filtered
  /* filtersList.filter(function (f){
    ////console.log(f.classFilterName)
    ////console.log(element.getAttribute("classFilterName"))
    if(element.getAttribute("classFilterName")==f.classFilterName){
      ////console.log("iguales")
    }
  }) */
  //networkGraph.data.links.filter(d=>d.target.type==)
}