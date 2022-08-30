//var global=0;
var classesFilterList=[],filtersList=[]
function addFilters(){
    var filterObject,classFilterObject,bubbleId;
    let filters=configRow.rowFields.filters
    console.log(filters)
    console.log(linkedDataGraph)
    bubbleId=linkedDataGraph.treeData.slice(-1)[0]["id"]
    filters.forEach(function(d){
      property=d["property"]
      filterType=d["filter_type"]
      classFilter=d["property"].split("_")[0]
      parent=d["parent"]
      if(d["filter_text"]){
        filterText=d["filter_text"]
      }else{
        filterText=""
      }
      console.log(classesFilterList)
      if (classesFilterList.filter(c => c.name==classFilter).length==0){
            classFilterObject= new classFilterClass(classFilter)
            console.log("crea la clase del filtro")
            filterObject=new filter(classFilter, property, filterType,filterText,parent,bubbleId)
            classesFilterList.push(classFilterObject)
            filtersList.push(filterObject)

            propertiesFilterHist.push(property)
            filterObject.checkVisibility()
      }else if(!propertiesFilterHist.includes(property)){

            filterObject=new filter(classFilter, property, filterType,parent,bubbleId)
            propertiesFilterHist.push(property)
            filtersList.push(filterObject)
            filterObject.checkVisibility()
      }else if(filterType=="text"){
            filterObject=filtersList.filter(function (c){
                return c.property==property
            })[0]
            docs=document.getElementsByClassName(filterObject.classFilterName)
            var searchValues=[]
            for (let d of docs) {
                searchValues.push(d3.select("#"+d.getAttribute("id")).data()[0]["value"])
            }
            
            autocomplete(document.getElementById(filterObject.id), searchValues);
      }

    })

}
function changeHtmlFilter(element,classFilter){

      var filterObject=filtersList.filter(c => c.id==element.id.replace("_selection",""))[0]
      filterObject.changeHtml()
}
function range(element) {
  var values=[],classElement,propertyEl;

  classElement=element.getAttribute("id").replace("_filter","").split("_")[0]
  propertyEl=element.getAttribute("id").replace("_filter","")

  var selectedFilter=filtersList.filter(f => f.property==propertyEl)
  if(selectedFilter.length!=0)
  {
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
  
  values.sort(function(a, b){return a-b})
  return {
    minprice: values[0], 
    maxprice: values[values.length-1],
    min: values[0], 
    max: values[values.length-1],
    minthumb: 0,
    maxthumb: 0, 
    
    mintrigger() {  
      this.minthumb = ((this.minprice - this.min) / (this.max - this.min)) * 100;
    },
    
    maxtrigger() {
      this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);    
    }, 
  }
}

function applyFilter(element){
  var element_range,filters=[],valuesFilter=[],values=[],classFilter,allValues,parent;
  element_range=document.getElementById(element.getAttribute("id").replace(new RegExp("_start" + '$'), '').replace(new RegExp("_end" + '$'), ''))

  empty=checkFilterIcon(document.getElementById(element.name))

  if((element!=null)&(element_range!=null)){
    element=element_range
  }

  element_range=document.getElementById(element.parentNode.parentNode.getAttribute("id").replace("_filter",""))

  if((element!=null)&(element_range!=null)){
    element=element_range
  }

  if (filtersList.filter(f => f.id==element.getAttribute("id")).length!=0){

  var hiddenNodes=[],parentHidden=false,selectedFilter;

  selectedFilter=filtersList.filter(f => f.id==element.getAttribute("id"))[0]
  selectedFilter.applyFilter()
  

  branch=networkGraph.treeData.filter(function (f){
    return f.id==selectedFilter["bubbleId"]
  })


  checkNodesBranchFilter(selectedFilter,branch)

  branch=networkGraph.treeData.slice(position+1)

  if(branch.length>0){
    checkNodesFolBranches(branch)
  }
  networkGraph.data=flatten(networkGraph.treeData).flatData
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.enterGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.exitGraph()

  filtersList.forEach(function (f){
    f.getValuesFilterVisibleNodes()
    if(f!=selectedFilter){
      f.changeValues()
      f.checkVisibility()
    }
    
  })

  checkFilterIcon(document.getElementById(element.name))


}
function checkNodesBranchFilter(filter,branch){
    branch[0].children.forEach(function (d){
      d.hidden=check_filter(d,filter)
    })
}
function checkNodesFolBranches(branches) {
  var filtersBranch,resultHidden=false,nodes = [], links=[],number,children=0;
  function recurse(node) {

    node.children.forEach(function (d){
      if(node.hidden==true){
        d.hidden=true
      }else{
        if(filtersBranch.length>0){
          for (i = 0; i < filtersBranch.length; i++) {
            resultHidden=check_filter(d,filtersBranch[i])
            if(resultHidden==true){
              break;
            }
          }
          d.hidden=resultHidden
        }else{
          d.hidden=false
        }
      }
    })
  }
  branches.forEach(function(b){
    filtersBranch=filtersList.filter(function(f){
      return f.bubbleId==b.id
    })
    recurse(b);
  })
}

function check_filter(node,f){
  var hidden=false
    if(f.classFilterName==node.class){
      if(f.valuesField[0]!=""){

        if(!hiddenNodes.includes(node.id)){
          if(node[f.property]!=undefined){
            if(f.filterType=="date"){
              hidden=f.filterDate(node)
            }else if(f.filterType=="dropdown"){
              hidden=f.filterDropdown(node)
            }else if(f.filterType=="number"){
              hidden=f.filterNumber(node)
            }else if(f.filterType=="text"){
              hidden=f.filterText(node)
            }
           if(hidden){
              hiddenNodes.push(node.id)
            }
          }
        }
      }
    }

  return hidden
}
}

function applyFilter_backup(element){
  var element_range,filters=[],valuesFilter=[],values=[],classFilter,allValues,parent;
  element_range=document.getElementById(element.getAttribute("id").replace(new RegExp("_start" + '$'), '').replace(new RegExp("_end" + '$'), ''))

  empty=checkFilterIcon(document.getElementById(element.name))

  if((element!=null)&(element_range!=null)){
    element=element_range
  }

  element_range=document.getElementById(element.parentNode.parentNode.getAttribute("id").replace("_filter",""))

  if((element!=null)&(element_range!=null)){
    element=element_range
  }

  if (filtersList.filter(f => f.id==element.getAttribute("id")).length!=0){

  var hiddenNodes=[],parentHidden=false,selectedFilter;

  selectedFilter=filtersList.filter(f => f.id==element.getAttribute("id"))[0]
  selectedFilter.applyFilter()
  
  networkGraph.treeData.forEach(function(t){
    parentHidden=false
    if(hiddenNodes.includes(t.id)){
      t.hidden=true
      parentHidden=true
    }else{
      if(check_filter(t,selectedFilter)){
        t.hidden=true
        parentHidden=true
        if(!hiddenNodes.includes(t.id)){
          hiddenNodes.push(t.id)
        }
      }else{
        delete t.hidden
      }
    }
    
    if(t.children!=undefined){
      t.children.forEach(function(v){
        if(parentHidden){
          v["hidden"]=true
          if(!hiddenNodes.includes(v.id)){
            hiddenNodes.push(v.id)
          }
        }else{
          if(check_filter(v,selectedFilter)){  
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
  
  networkGraph.data=flatten(networkGraph.treeData).flatData
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.enterGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.exitGraph()

  filtersList.forEach(function (f){
    f.getValuesFilterVisibleNodes()

    if(f.classFilterName!=selectedFilter.classFilterName){
      f.changeValues()
      f.checkVisibility()
    }
    
  })

  checkFilterIcon(document.getElementById(element.name))

}
function check_filter(node,f){
  var hidden=false
    if(f.classFilterName==node.class){
      if(f.valuesField[0]!=""){

        if(!hiddenNodes.includes(node.id)){
          if(node[f.property]!=undefined){
            if(f.filterType=="date"){
              hidden=f.filterDate(node)
            }else if(f.filterType=="dropdown"){
              hidden=f.filterDropdown(node)
            }else if(f.filterType=="number"){
              hidden=f.filterNumber(node)
            }else if(f.filterType=="text"){
              hidden=f.filterText(node)
            }
           if(hidden){
              hiddenNodes.push(node.id)
            }
          }
        }
      }
    }

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
  if (e.key=="Enter"){
    applyFilter(element)
  }
}

function addFiltersFreeGraph(classFilterName,bubbleId){
  var filterObject,classFilterObject,filters;
  filters=[{"property": classFilterName+"_property","nodeType":"property","filterType":"dropdown","parent":""},
  {"property": classFilterName+"_nodeType","nodeType":"nodeType","filterType":"dropdown","parent":""}]

  filters.forEach(function(f){
    if (classesFilterList.filter(c => c.name==classFilterName).length==0){
          classFilterObject= new classFreeGraph(classFilterName)
          filterObject=new filterFreeGraph(f["property"],f["nodeType"],f["filterType"],classFilterName,bubbleId)
          classesFilterList.push(classFilterObject)
          propertiesFilterHist.push(f.property)
          filtersList.push(filterObject)
    }else if(!propertiesFilterHist.includes(f.property)){
      filterObject=new filterFreeGraph(f["property"],f["nodeType"],f["filterType"],classFilterName,bubbleId)
      propertiesFilterHist.push(f.property)
      filtersList.push(filterObject)
    }
  })

}
function applyFreeGraphFilter(element){
  var bubble,branch,visibleNodesIds=[],nodes=[],links=[],empty=true,element_range,filters=[],valuesFilter=[],values=[],classFilter,allValues,parent;

  var selectedFilter=filtersList.filter(f => f.name==element.name)[0]

  selectedFilter.values=[element.value]

  empty=checkFilterIcon(document.getElementById(element.name))

  branch=networkGraph.treeData.filter(function (f){
    return f.id==selectedFilter["bubbleId"]
  })

  visibleNodesIds.push(selectedFilter["bubbleId"])
  
  position=networkGraph.treeData.indexOf(networkGraph.treeData.filter(function(item) {
    return item.id == selectedFilter["bubbleId"]
  })[0])
  
  branch=networkGraph.treeData.slice(position)

  checkNodesBranchFilter(element,branch)

  branch=networkGraph.treeData.slice(0,position)

  checkPrevBranches(branch)

  branch=networkGraph.treeData.slice(position+1)

  if(branch.length>0){
    hideBranches(branch)
  }

  for (i = 0; i < networkGraph.allData.links.length; i++) {
  
    if((visibleNodesIds.includes(networkGraph.allData.links[i]["source"]["id"]))&(visibleNodesIds.includes(networkGraph.allData.links[i]["target"]["id"]))){
      
      if(!links.includes(networkGraph.allData.links[i])){
        links.push(networkGraph.allData.links[i])
      }
      if(!nodes.includes(networkGraph.allData.links[i]["source"])){
        nodes.push(networkGraph.allData.links[i]["source"])
      }
      if(!nodes.includes(networkGraph.allData.links[i]["target"])){
        nodes.push(networkGraph.allData.links[i]["target"])
      }
    }

  } 

  networkGraph.data.links=links
  networkGraph.data.nodes=nodes

  networkGraph.initializeSimulation();
  networkGraph.dataJoinFreeGraph()
  networkGraph.enterFreeGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinFreeGraph()

  networkGraph.exitGraph() 

  bubble=document.getElementById(element.getAttribute("bubbleId"))
  clickBubbleFreeGraph(bubble,networkGraph.data)

  filtersList.forEach(function (f){
    if(f!=selectedFilter){
      
      f.getValuesFilterVisibleNodes()
      f.changeValues()

    }
  })

  checkFilterIcon(document.getElementById(element.name))

  function checkNodesBranchFilter(filter,branch){
    if(filter.value!="All"){
      branch[0].children.forEach(function (d){
        d.hidden=checkNodeFilter(filter,d)
      })
    }else{
      branch[0].children.forEach(function (d){
        d.hidden=false
        visibleNodesIds.push(d.id)
      })
    }
  }
  function checkNodeFilter(filter,node){
    if(filter.getAttribute("nodeType")=="property"){
      if(filter.value.toLowerCase()!=node.property.toLowerCase()){
        node.hidden=true
      }else{
        node.hidden=false
        visibleNodesIds.push(node.id)
      }
    }else if(filter.getAttribute("nodeType")=="nodeType"){
      if(filter.value.toLowerCase()!=node.type){
        node.hidden=true
      }else{
        node.hidden=false
        visibleNodesIds.push(node.id)
      }
    }
    return node.hidden
  }
  function checkNodeFilter2(filter,node){
    var resultHidden=false

    if(filter.nodeType=="property"){
      if(filter.backValues!=undefined){
        if((!filter.backValues.includes(node.property.toLowerCase()))&((filter.backValues.length>1)|(filter.backValues[0]!='All'))){
          resultHidden=true
        }
      }else{
        if((!filter.values.includes(node.property.toLowerCase()))&(filter.values!=['All'])){
          resultHidden=true
        }
      }
      
    }else if(filter.nodeType=="nodeType"){
      if(filter.backValues!=undefined){
        
        if((!filter.backValues.includes(node.type.toLowerCase()))&((filter.backValues.length>1)|(filter.backValues[0]!='All'))){
          resultHidden=true
        }
      }else{
        if((!filter.values.includes(node.type.toLowerCase()))&(filter.values!=['All'])){
          resultHidden=true
        }
      }  
    }
    return resultHidden
  }
  
  function hideBranches(branches) {
    var filtersBranch,resultHidden=false,nodes = [], links=[],number,children=0;
    function recurse(node) {

      node.hidden=checkHidden(node)
      if(!node.hidden){
        visibleNodesIds.push(node.id)
      }
      node.children.forEach(function (d){
        if(node.hidden==true){
          d.hidden=true
        }else{
          if(filtersBranch.length>0){
            for (i = 0; i < filtersBranch.length; i++) {
              resultHidden=checkNodeFilter2(filtersBranch[i],d)
              if(resultHidden==true){
                break;
              }
            }
            d.hidden=resultHidden
          }else{
            d.hidden=false
          }
        }
        if(!d.hidden){
          visibleNodesIds.push(d.id)
        }
      })
    }
    branches.forEach(function(b){
      filtersBranch=filtersList.filter(function(f){
        return f.bubbleId==b.id
      })
      recurse(b);
    })
  }
  
  function checkHidden(node) {
    var found;

    for (i = 0; i < networkGraph.treeData.length; i++) {
      found=networkGraph.treeData[i].children.filter(function(d){
          return (d.id==node.id)
      })
      if(found.length!=0){
        break;
      }
    }
    return found[0].hidden
  }  

  function checkPrevBranches(branch) {
    for (i = 0; i < branch.length; i++) {
      if(!branch[i].hidden){
        visibleNodesIds.push(branch[i]["id"])
      }
      branch[i].children.forEach(function(d){
        if(!d.hidden){
          visibleNodesIds.push(d.id)
        }
      })
    }
  }  

}

function clearFilters(element){
  element.style.display="none"
  restartFilters(element)
}
function restartFilters(element){
  var classElementName,field;
  var classElement=element.parentNode.parentNode.parentNode.querySelector('.className')
  classElementName=classElement.children[0].id.replace("_root","").split("_")[0]

  for (let i = 0; i < classElement.children.length; i++) {
    field=document.getElementById(classElement.children[i].id.replace("_root",""))
    if(field.tagName.toLowerCase()=="input"){
      field.value=""
    }else if(field.tagName.toLowerCase()=="select"){
      field.value="All"
    }
  }
  filtersList.forEach(function(f){
    if(classElementName==f.classFilterName){
      applyFilter(document.querySelectorAll('[id="'+f.id+'"]')[0])
    }
  })
}
function clearFiltersFreeGraph(element){
  element.parentNode.querySelector('.filter-icon').style.display="none"
  restartFreeGraph(element)
}
function restartFreeGraph(element){
  var classElementName;
  
  var classElement=element.parentNode.parentNode.parentNode.querySelector('.className')

  classElementName=classElement.children[0].querySelector("select").getAttribute("classFilterName")
  for (let i = 0; i < classElement.children.length; i++) {
    document.getElementById(classElement.children[i].id.replace("_root","")).value="All"
  }
  filtersList.forEach(function(f){
    if(classElementName==f.classFilterName){
      applyFreeGraphFilter(document.querySelectorAll('[name="'+f.name+'"]')[0])
    }
  })
}
function checkFilterIcon(element){
  var empty=true,field;
  var classElement=element.parentNode.parentNode.parentNode.querySelector('.className')
  for (let i = 0; i < classElement.children.length; i++) {
   
    field=document.getElementById(classElement.children[i].id.replace("_root",""))
    if(field.tagName.toLowerCase()=="input"){
      if(document.getElementById(classElement.children[i].id.replace("_root","")).value!=""){
        empty=false
      }
    }else if(field.tagName.toLowerCase()=="select")
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

  filtered=links
  filtersList.filter(f=>f.classFilterName==element.getAttribute("classFilterName")).forEach(function (d){

    if((element.getAttribute("name")!=d.name)&(!(d.values.includes("All")))&(d.values.length>1)){

      filtered=filtered.filter(function (v){

        return d.values.includes(eval("v"+filterByField))
      })
    }
  })
  return filtered

}