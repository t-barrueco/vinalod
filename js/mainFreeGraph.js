var navigation, navigationBasic, navigationFree, sparqlQueryWindow, interval;
$(document).ajaxSend(function (event, request, settings) {
  sparqlQueryWindow = request
});

async function addURLGraph(field) {
  var indexRows
  d3.selectAll(".classFilter").remove()
  if (document.getElementById("navTable").querySelector('ol')) {
    document.getElementById("navTable").querySelector('ol').remove()
  }

  filtersList = []

  indexRows = await checkQueries(field.querySelector('#free-uri').value, field.querySelector('#subject-object').value, "form")
  if(indexRows.length!=0){
    $("#graph-area").removeClass("hidden")
    $("#form-container").addClass("hidden")
  }
  //return false
}

function buildTreeData(results, form, node) {
  var children = [], treeData = [], more_results, menuOption, menuOptionNodes = [], configRow;

  results.forEach(r => {
    if (form["subject-object"] == "s") {
      if (r["o"]["more_results"]) {
        more_results = r["o"]["more_results"]
      } else {
        more_results = ""
      }
      if (r["o"]["configRow"]) {
        configRow = r["o"]["configRow"]
      } else {
        configRow = ""
      }
      children.push({ "id": genRandomString(), "value": r["o"]["value"], "type": r["o"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
    } else if (form["subject-object"] == "o") {
      if (r["s"]["more_results"]) {
        more_results = r["s"]["more_results"]
      } else {
        more_results = ""
      }
      if (r["s"]["configRow"]) {
        configRow = r["s"]["configRow"]
      } else {
        configRow = ""
      }
      children.push({ "id": genRandomString(), "value": r["s"]["value"], "type": r["s"]["type"], "uri": form["uri"], "url": form["url"], "subject-object": form["subject-object"], "hidden": false, "property": r["p"]["value"], "more_results": more_results, "configRow": configRow, "class": "free" })
    }


  })
  if (node != undefined) {
    if (node["menuOption"]) {
      menuOption = node["menuOption"] + ";" + form["url"] + "," + form["subject-object"]
      networkGraph.treeData.filter(d => d.id == node["id"])
      let obj = networkGraph.treeData.find(n => n.id == node["id"]);
      if (obj["children"])
        if (obj.children[0].type != "menuOption") {
          menuOptionNodes.push({ "id": genRandomString(), "value": node["menuOption"], "type": "menuOption", "children": obj.children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          menuOptionNodes.push({ "id": genRandomString(), "value": form["url"] + "," + form["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
          obj.children = menuOptionNodes;
        } else {
          obj.children.push({ "id": genRandomString(), "value": form["url"] + "," + form["subject-object"], "type": "menuOption", "children": children, "hidden": false, "more_results": "", "menuOption": "", "uri": obj.value, "class": "free" })
        }

      obj["menuOption"] = menuOption
    } else {
      menuOption = node["url"] + "," + node["subject-object"]
      treeData = [{ "id": node["id"], "value": node["value"], "type": node["type"], "children": children, "hidden": false, "more_results": more_results, "menuOption": menuOption, "configRow": configRow, "class": "free" }]
    }

  } else {
    menuOption = form["url"] + "," + form["subject-object"]
    treeData = [{ "id": genRandomString(), "value": results[0][form["subject-object"]]["value"], "type": results[0][form["subject-object"]]["type"], "children": children, "hidden": false, "more_results": "", "menuOption": menuOption, "configRow": configRow, "class": "free" }]
  }
  return treeData
}
function flatten_freeGraph(root) {
  var nodes = [], links = [];
  function recurse(node) {
    if (!node["hidden"]) {
      position = nodes.indexOf(nodes.filter(function (item) {
        return item.id == node.id
      })[0])
      if (position == -1) {
        nodes.push(node)
        position = (nodes.length) - 1
      } else {
        nodes[position]["menuOption"] = node["menuOption"]
      }
      if (node.children) {
        nodes[position]["number"] = node.children.length
        node.children.forEach(function (c) {
          if (!c["hidden"]) {
            position = links.indexOf(links.filter(function (item) {
              return ((item.source == node.id) && (item.target == c.id))
            })[0])
            if (position == -1) {
              links.push({ "source": node.id, "target": c.id, "id": (node.id + "_" + c.id), "value": c.property })
            }
            recurse(c)
          }
        });
      } else {
        nodes[position]["number"] = 0;
      }
    }

  }

  root.forEach(function (r) {
    recurse(r);
  })

  return { "flatData": { "nodes": nodes, "links": links }, "treeData": root };
}

async function buildFreeGraph(form, origin, node) {
  var sparqlQuery, queryUrl, uri, url, subjectObject;
  var $objectAjax;
  prefixes = ""

  if (origin == "form") {
    uri = form.querySelector("#uri").innerHTML
    url = form.querySelector("#url").innerHTML
    subjectObject = form.querySelector("#subject-object").innerHTML

    $("#myModal3").hide();
  } else if (origin == "bubble") {
    uri = form["uri"]
    url = form["url"]
    if (form["subjectObject"] == undefined) {
      subjectObject = form["subject-object"]
    } else {
      subjectObject = form["subjectObject"]
    }

  } else {
    uri = form["uri"]
    url = form["url"]
    subjectObject = form["subject-object"]
  }
  form = { "uri": uri, "url": url, "subject-object": subjectObject }
  if (subjectObject == "s") {
    sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?s=<" + uri + ">).}"
  } else {
    sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?o=<" + uri + ">).}"
  }

  var fn = function () {
    d3.select("#spin").style("display", "none")
    document.getElementById("sparql-timeout").style.display = "inline-block"
  };
  interval = setInterval(fn, 8000);
  queryUrl = url + "?query=" + prefixes + encodeURIComponent(sparqlQuery) + "&format=json";
  settings = {
    url: queryUrl, async: true, dataType: 'jsonp',
    success: function (data) {

      $objectAjax = null;
    }
  };
  d3.select("#spin-message")
    .text("Waiting for Sparql query")

  d3.select("#spin").style("display", "inline-flex")

  $objectAjax = $.ajax(settings).then(function (_data) {
    var results = _data.results.bindings;
    d3.select("#spin").style("display", "none")
    results = clusterResults(results, subjectObject)
    return results
  })

    .fail(function (jqXHR, textStatus, errorThrown) {
      document.getElementById("sparql-timeout").style.display = "inline-block"
    })

    .always(function (jqXHR, textStatus, errorThrown) {
      d3.select("#spin").style("display", "none")

    })
    .done(function (data, textStatus, jqXHR) {
      createGraph(data)
      clearInterval(interval)
      d3.select("#spin").style("display", "none")
      document.getElementById("sparql-timeout").style.display = "none"
    })
  try {
    await $objectAjax
  } catch (e) {
  }
  function createGraph(results) {
    if ((origin === 'form') || (origin === 'first')) {
      data = getFreeGraphData(results, form)
      d3.selectAll(".graph").remove()
      forces = {
        center: {
          x: 0.5,
          y: 0.3
        },
        charge: {
          enabled: true,
          strength: -800,
          distanceMin: 100,
          distanceMax: 2000
        },
        collide: {
          enabled: true,
          strength: .8,
          iterations: 1,
          radius: 5
        },
        forceX: {
          enabled: true,
          strength: .1,
          x: .2
        },
        forceY: {
          enabled: true,
          strength: .1,
          y: .2
        },
        link: {
          enabled: true,
          distance: 300,
          iterations: 1
        }
      }
      if(networkGraph){
        networkGraph.graphType="freeGraph"
        networkGraph.data=data
        networkGraph.forces=forces
        networkGraph.initVis()
        //console.log(colorScale.domain())
        //console.log(colorScale.range())
        //legend.addColors(colorScale)
        //colors={"bg-green-300":"#86efac","bg-yellow-300":"#fde047","bg-pink-300":"#f9a8d4","bg-blue-300":"#93c5fd"}
        networkGraph.colorScale.range(["#86efac","#fde047","#f9a8d4","#93c5fd"])
        ////console.log(nodesClassesShow)
        //["bg-green-300","bg-yellow-300","bg-pink-300","bg-blue-300"]
        networkGraph.colorScale.domain(["uri","bnode","literal","menu Option"])
        colorScale=networkGraph.colorScale
        legend.addColors(colorScale)
      }else{
        networkGraph = new NetworkGraph("#networkGraph", data, forces, "freeGraph");
        legend=new Legend("legend")
        //console.log(colorScale)
        legend.addColors(colorScale)
      }     
    } else {

      addNodesGraph(results, node, form)
      if(showNavigation){
        if (typeof (navigation) != "object") {
          navigation = new navigationPanel("freeGraph", node);
        } else if (navigation.type != "freeGraph") {
          navigation = new navigationPanel("freeGraph", node);
        } else {
          navigation.node=node
          navigation.init()
        }
      }
    }
  }
}
function addNodesGraph(results, node, form) {
  links = addFreeGraphData(results, node, form)
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.enterGraph()
  networkGraph.initializeSimulation();
  networkGraph.dataJoinGraph()
  networkGraph.exitGraph()
  networkGraph.zoomOut()

}
function dblclickCellContent(cell) {
  navigation.dblclickCellContent(cell)
}
function clickCellContent(cell) {
  navigation.clickCellContent(cell)
}
function dblclickNav(cell) {
  navigation.dblclickNav(cell)
}
function clickNav(cell) {
  navigation.clickNav(cell)
}
function getFreeGraphData(results, form) {
  var nodes = [], links = [], data, treeData, flattenData;

  treeData = buildTreeData(results, form)
  flattenData = flatten_freeGraph(treeData)
  data = { "flatData": flattenData.flatData, "allData": flattenData.flatData, "treeData": treeData }
  return data
}
function addFreeGraphData(results, node, form) {
  var links = [], nodes = [], treeData;
  subjectObject = form["subject-object"]
  treeData = buildTreeData(results, form, node)

  if (treeData.length > 0) {
    flattenData = flatten_freeGraph(treeData)
    data = { "flatData": flattenData.flatData, "allData": flattenData.flatData, "treeData": treeData }
    networkGraph.treeData = networkGraph.treeData.concat(treeData)
  }

  networkGraph.data = flatten_freeGraph(networkGraph.treeData).flatData
  networkGraph.allData.nodes = networkGraph.data.nodes
  networkGraph.allData.links = networkGraph.data.links

  if (treeData.length > 0) {
    return data.flatData.links;
  } else {
    return networkGraph.data.links;
  }

}

function getTooltipTextFreeGraph(d) {
  var menuOptions, sparqlEndpoint = "", position = "",text;
  if (d.type == "menuOption") {
    menuOptions = d.value.split(",")
    text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-2 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Option values
          </h3>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              URI
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + d.uri + `
              </dd>
            </div>
            <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              Sparql Endpoint
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + menuOptions[0] + `
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
              Position
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ` + menuOptions[1] + `
              </dd>
            </div>
          </dl>
        </div>
      </div>`;
  } else if (typeof (d) == "string") {
    text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
          ` + d + `
          </h3>
        </div>
        </div>`;
  } else {
    if (d.menuOption != undefined) {
      if (d.menuOption.split(";").length == 1) {
        sparqlEndpoint = d.menuOption.split(",")[0]
        position = d.menuOption.split(",")[1]
      } else {
        sparqlEndpoint = "several"
      }
    }
    if (d.property) {
      text = `
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-2 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Node values
            </h3>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Property
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ` + d.property + `
                </dd>
              </div>
              <div class="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Name
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ` + d.value + `
                </dd>
              </div>
            </dl>
          </div>
        </div>`;
      getOptionChosen()
    } else {
      text = `<div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-2 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Node values
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + d.value + `
                  </dd>
                </div>
              </dl>
            </div>
          </div>`;
      getOptionChosen()
    }
    function getOptionChosen() {
      if (d.menuOption != undefined) {
        if (sparqlEndpoint != "several") {
          text = text + `
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-2 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Option chosen
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Sparlq Endpoint
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + sparqlEndpoint + `
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                  Position
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ` + position + `
                  </dd>
                </div>
              </dl>
            </div>
          </div>`
        } else {
          text = text + `
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
              Several options displayed in graph. Click on each option to see results values
              </h3>
            </div>
            </div>`
        }
      }
    }
  }

  return text;
}
async function checkQueries(element, subjectObject, origin, pageX, pageY) {
  var node;
  var resultRows =await checkAskResultsFreeGraph(element, subjectObject)
  if (typeof (element) != "string") {
    node = d3.select("#" + element.getAttribute("id")).data()[0]
  }
  if ((origin == "bubble") || (origin == "table")) {
    if (node.menuOption != undefined) {
      filterResultRows()
    }
  }
  if (resultRows.length > 1) {

    if (origin == "form") {
      removeMsgNoResults()
      getOptionsWindow(resultRows)
    } else {
      getMenuItemsFreeGraph(resultRows, element, pageX, pageY, origin)
    }
  } else if (resultRows.length == 1) {
    form = resultRows[0]
    if (origin == "form") {
      removeMsgNoResults()
      origin = "first"
    }
    await buildFreeGraph(form, origin, node)
  } else if ((resultRows.length == 0) && (origin == "form")) {
    d3.selectAll(".graph").remove()
    addMsgNoResults()
  }
  return resultRows
  function filterResultRows() {
    var menuOption = node.menuOption.split(";")
    menuOption.forEach(function (d) {
      d = d.split(",")
      resultRows = resultRows.filter(function (r) {
        return (r.uri != node.value) || (r.url != d[0]) || (r["subject-object"] != d[1])
      })
    })

  }
}
function removeMsgNoResults(){
    var msgNoResults = document.getElementById("msg-no-results");
    msgNoResults.classList.add("hidden");
    msgNoResults.classList.remove("inline-block");
}
function addMsgNoResults(){
    var msgNoResults = document.getElementById("msg-no-results");
    msgNoResults.classList.remove("hidden");
    msgNoResults.classList.add("inline-block");
}
async function checkAskResultsFreeGraph(node, so) {
  var resultRows = []

  return new Promise((resolve, reject) => {
    d3.csv("../config_vinalod/sparqlEndpoints.csv",async function(urls){
        if (so == undefined) {
          subjectObject = ['s', 'o']
        } else {
          subjectObject = [so]
        }
        if (typeof node === 'object') {
          uri = d3.select("#" + node.id).data()[0].value
        } else {
          uri = node
        }
        for (var j = 0; j < subjectObject.length; j++) {
          for (var i = 0; i < urls.length; i++) {
            results = await runAskSparlqQueryFreeGraph(urls[i].sparqlEndpoint, uri, subjectObject[j])
            if (results == true) {
              resultRows.push({ "url": urls[i].sparqlEndpoint, "subject-object": subjectObject[j], "uri": uri })
            }
          }
        }
      resolve(resultRows)
    })
  })
}

async function runAskSparlqQueryFreeGraph(url, uri, subjectObject) {
  var prefixes = "", settings
  if (subjectObject == "s") {
    sparqlQuery = "ASK where {<" + uri + "> ?p ?o}"
  } else {
    sparqlQuery = "ASK where {?s ?p <" + uri + ">}"
  }
  var queryUrl = url + "?query=" + prefixes + encodeURIComponent(sparqlQuery) + "&format=json";
  if (url == "https://query.wikidata.org/sparql") {
    settings = { url: queryUrl, async: true };
  } else {
    settings = { url: queryUrl, async: true, dataType: 'jsonp' };
  }
  return new Promise((resolve, reject) => {
    $.ajax(settings).then(function (_data) {
      results = _data.boolean;
      resolve(results)
    })
  })
}
function getOptionsWindow(results) {
  var modal, i = 1;

  $("#modal3-content form").remove()

  d3.select("#modal3-content").select("div").remove()

  var content = document.getElementById("modal3-content");


  results.forEach(function (r) {
    content.appendChild(getHtmlOption(r, i))
    i += 1
  })

  modal = document.getElementById("myModal3")
  modal.style.display = "block";
  $('#myModal3').resizable({

  });
  $("#myModal3").draggable()

}

function getHtmlOption(r, i) {
  form = document.createElement("form")
  form.setAttribute("class", "px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md")
  form.setAttribute("name", "option" + i)
  form.setAttribute("onsubmit", "buildFreeGraph(this,'form');return false")

  div = document.createElement("div")
  div.setAttribute("class", "px-4 py-2 bg-white border-b border-gray-200 sm:px-6")
  div1 = document.createElement("div")
  div1.setAttribute("class", "flex flex-wrap items-center justify-between -mt-4 -ml-4 sm:flex-nowrap")

  div2 = document.createElement("div")
  div2.setAttribute("class", "mt-4 ml-4")

  div3 = document.createElement("div")
  div3.setAttribute("class", "flex-shrink-0 mt-4 ml-4")

  h3 = document.createElement("h3")
  h3.setAttribute("class", "text-lg font-medium leading-6 text-gray-900")
  h3.innerHTML = "Option " + i + ": show graph with following settings"

  dl = document.createElement("dl")
  dl.setAttribute("class", "sm:divide-y sm:divide-gray-200")

  div4 = document.createElement("div")
  div4.setAttribute("class", "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6")

  dt = document.createElement("dt")
  dt.setAttribute("class", "text-sm font-medium text-gray-500")
  dt.innerHTML = "URI: "

  dd = document.createElement("dd")
  dd.setAttribute("id", "uri")
  dd.setAttribute("class", "break-all mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2")
  dd.innerHTML = r["uri"]

  div5 = document.createElement("div")
  div5.setAttribute("class", "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6")

  dt2 = document.createElement("dt")
  dt2.setAttribute("class", "text-sm font-medium text-gray-500")
  dt2.innerHTML = "Sparql Endpoint: "

  dd2 = document.createElement("dd")
  dd2.setAttribute("id", "url")
  dd2.setAttribute("class", "break-all mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2")
  dd2.innerHTML = r["url"]

  div6 = document.createElement("div")
  div6.setAttribute("class", "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6")

  dt3 = document.createElement("dt")
  dt3.setAttribute("class", "text-sm font-medium text-gray-500")
  dt3.innerHTML = "Position: "

  dd3 = document.createElement("dd")
  dd3.setAttribute("id", "subject-object")
  dd3.setAttribute("class", "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2")
  dd3.innerHTML = r["subject-object"]

  button = document.createElement("button")
  button.setAttribute("type", "submit")
  button.setAttribute("class", "relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500")
  button.innerHTML = "Show graph"

  div4.appendChild(dt)
  div4.appendChild(dd)

  div5.appendChild(dt2)
  div5.appendChild(dd2)

  div6.appendChild(dt3)
  div6.appendChild(dd3)

  dl.appendChild(div4)
  dl.appendChild(div5)
  dl.appendChild(div6)

  div2.appendChild(h3)

  div1.appendChild(div2)
  div1.appendChild(dl)
  div1.appendChild(div3).appendChild(button)
  div.appendChild(div1)

  form.appendChild(div)

  return form
}
function getMenuItemsFreeGraph(items, element, pageX, pageY, origin) {
  var menuItems = [], elementMenu,form, uri, url, subjectObject, row
  var node = d3.select("#" + element.getAttribute("id")).data()[0]

  if (node["configRow"]) {
    node["configRow"].forEach(function (r) {
      items.push({ "rowNumber": r, "row": configFile[r], "menuOption": configFile[r]["option"] })
    })
  }

  if (origin == "table") {
    for (var i = 0; i < items.length; i++) {
      if (items[i]["subject-object"]) {
        menuItems.push({ "url": items[i]["url"], "uri": items[i]["uri"], "subject-object": items[i]["subject-object"] })
      }
      else {
        menuItems.push({ "rowDataConfig": items[i]["rowNumber"], "node": node, "menuOption": items[i]["menuOption"] })
      }
    }
    navigation.addMenuToTable(node, menuItems)
  } else {
    for (var i = 0; i < items.length; i++) {
      if (items[i]["subject-object"]) {
        uri = items[i]["uri"]
        url = items[i]["url"]
        subjectObject = items[i]["subject-object"]
        itemsDetails = { "uri": uri, "url": url, "subject-object": subjectObject }
        elementMenu = {
          title: "Sparql Endpoint: " + url + " and Position: " + subjectObject,
          action: (data, d) => {
            url = d.title.match("Sparql Endpoint: (.*) and Position:")[1];
            subjectObject = d.title.match("and Position: (.*)")[1];
            form = { "url": url, "uri": uri, "subjectObject": subjectObject }
            buildFreeGraph(form, origin, node)

          }
        }
      } else {
        elementMenu = {
          title: items[i]["menuOption"],
          action: (data, d) => {
            row = configFile.findIndex(v => v.option == d.title)
            buildBasicGraph(row, d3.select("#" + data.getAttribute("id")).data()[0], d.title)
          }
        }
      }
      menuItems.push(elementMenu)
    }
    networkGraph.menuFactory(pageX - 400, pageY - 450, menuItems, element, "dblClick", 500)
  }

}
function clickBubbleFreeGraph(element, data) {
  var node
  nodesSelSources = []
  nodesSelTarget = []
  node = d3.select("#" + element.getAttribute("id")).data()[0]

  if (navigation == undefined) {
    navigation = new navigationPanel("freeGraph", node);
  } else {
    navigation.element = element
    navigation.node = node
    navigation.init()
  }
  $("#myModal").removeClass("translate-x-full")
  $("#myModal").addClass("translate-x-0")
}
function unclickBubbleFreeGraph() {
  nodesSelSources = []
  nodesSelTarget = []

  d3.selectAll(".nodeCircle")
    .style("opacity", 1)
  d3.selectAll(".nodeCircleCircle")
    .style("opacity", 1)
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");
  d3.selectAll(".link")
    .style("opacity", 1)
    .style("stroke", "grey")
    .style("fill", "grey")
    .style("stroke-width", "1px");
}
function fillLegendFreeGraph() {
  var colorsFreeGraph = [{ "name": "uri", "color": "bg-green-300" }, { "name": "bnode", "color": "bg-yellow-300" }, { "name": "literal", "color": "bg-pink-300" }, { "name": "menu Option", "color": "bg-blue-300" }]

  $("#legend li").remove()
  colorsFreeGraph.forEach(function (c) {
    appendLiFreeGraph(c.color, c.name)
  })


}
function appendLiFreeGraph(color, textLi) {
  var li, classLi;
  classLi = "flex items-center justify-center flex-shrink-0 w-16 text-sm font-medium text-white rounded-l-md "
  li = d3.select("#legend").append("li")
    .attr("class", "flex col-span-1 rounded-md shadow-sm")
  li.append("div")
    .attr("class", classLi + color)
  li.append("div")
    .attr("class", "flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md")
    .append("div")
    .attr("class", "flex-1 px-4 py-2 text-sm truncate")
    .append("a")
    .attr("class", "font-medium text-gray-900 hover:text-gray-600")
    .append("text")
    .text(textLi.toUpperCase());
}
function clusterResults(results, subjectObject) {
  var ocurrences = [], small, big, results_small, results_big, num_occ, results_big_filtered;
  var properties = results.map(function (r) {
    return r["p"]["value"]
  })
  var unique_properties = [...new Set(properties)]
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  unique_properties.forEach(function (d) {
    ocurrences.push({ "value": d, "ocurrences": countOccurrences(properties, d) })
  })
  small = ocurrences.filter(d => d.ocurrences <= 300).map(d => d.value)
  big = ocurrences.filter(d => d.ocurrences > 300).map(d => d.value)
  results_small = results.filter(r => small.includes(r["p"]["value"]))
  results_big = results.filter(r => big.includes(r["p"]["value"]))
  big.forEach(function (b) {
    results_big_filtered = results_big.filter(r => r["p"]["value"] == b)
    num_occ = ocurrences.filter(o => o.value == results_big[0]["p"]["value"])[0]["ocurrences"]
    if (subjectObject == "s") {
      results_small.push({ "o": { "type": results_big_filtered[0]["o"]["type"], "value": num_occ + " results", "more_results": results_big_filtered }, "p": results_big_filtered[0]["p"], "s": results_big_filtered[0]["s"], "class": "Cluster" })
    } else {
      results_small.push({ "s": { "type": results_big_filtered[0]["s"]["type"], "value": num_occ + " results", "more_results": results_big_filtered }, "p": results_big_filtered[0]["p"], "o": results_big_filtered[0]["o"], "class": "Cluster" })
    }
  })
  return results_small
}
async function checkBasicGraph(node){
    var classesInConfig=[],classesLinesConfig={},results;
    //nodes.push(node)


    for (var i = 0; i < configFile.length; i++) {
      if(configFile[i].modelClass!=undefined){
        if(classesInConfig.includes(configFile[i].modelClass)){
          classesLinesConfig[configFile[i].modelClass]["lines"].push(i)
        }else{
          classesLinesConfig[configFile[i].modelClass]={"class":configFile[i]["class"],"lines":[i]}
          classesInConfig.push(configFile[i].modelClass)
        }
      }
    }

    results=await checkClassesNode(classesInConfig,node)
    addColorsBasicGraph(results,classesLinesConfig,node["children"])
}
function addColorsBasicGraph(results,classesLinesConfig,children){
  var classesFound=[],idNode
  for (var i = 0; i < results.length; i++) {
    if(!classesFound.includes(classesLinesConfig[results[i]["class"]["value"]]["class"])){
      appendLiFreeGraph("bg-red-500", classesLinesConfig[results[i]["class"]["value"]]["class"]) 
      classesFound.push(classesLinesConfig[results[i]["class"]["value"]]["class"])
    }
    idNode=children.filter(d=>d.value==results[i]["child"]["value"]).map(v=>v.id)
    d3.select("#"+idNode).style("fill","#EF4444")
  }
}
async function checkClassesNode(classesInConfig,node){
  var filterClasses="",subjectObject=node.children[0]["subject-object"],sparqlQuery,settings,endpoint_url=node.children[0]["url"],results;
  for (var i = 0; i < classesInConfig.length; i++) {
    if(filterClasses==""){
      filterClasses+="(<"+classesInConfig[i]+">"
    }else{
      filterClasses+=",<"+classesInConfig[i]+">"
    }
  }
  filterClasses+=")"

  if(subjectObject=="s"){
    sparqlQuery="SELECT distinct ?child ?class WHERE{{ ?s ?p ?child. ?child <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class.} FILTER (?s=<"+node.value+">). FILTER (?class in "+filterClasses+")}"
  }else{
    sparqlQuery="SELECT distinct ?child ?class WHERE{{ ?child ?p ?o. ?child <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?class.} FILTER (?o=<"+node.value+">). FILTER (?class in "+filterClasses+")}"
  }

  prefixes=""
  queryUrl = endpoint_url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
  settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
  results = await runSparlqQuery(settings)
  
  return results

}

async function checkClassesBasicGraph(results, subjectObject, node) {
  var classes=[], classesConfig, askQuery, endpoint_url, configRows, resultsAsk;
  classesConfig = configFile.filter(d => d.modelClass != undefined).map(v => v.modelClass)

  for (var i = 0; i < results.length; i++) {

    for (var j = 0; j < classes.length; j++) {
      if (classesConfig.includes(classes[j])) {
        configRows = getAllIndexes(configFile, classes[j], "modelClass")
        for (const row of configRows) {
          if ((!configFile[row]["query"].includes("PARAMETER2")) && (configFile[row]["type"] == "TREE")) {
            askQuery = fromSelectToAskQuery(configFile[row]["query"])
            if (subjectObject == "s") {
              askQuery = askQuery.replace("PARAMETER", results[i]["o"]["value"]);
            } else if (subjectObject == "o") {
              askQuery = askQuery.replace("PARAMETER", results[i]["s"]["value"]);
            }

            endpoint_url = configFile[row]["endpoint_url"]
            resultsAsk = await runAskSparlqQuery(endpoint_url, askQuery)
            if (resultsAsk == true) {
              if (results[i]["configRow"]) {
                if (subjectObject == "s") {
                  results[i]["o"]["configRow"].push(row)
                } else {
                  results[i]["s"]["configRow"].push(row)
                }
              } else {
                if (subjectObject == "s") {
                  results[i]["o"]["configRow"] = [row]
                } else {
                  results[i]["s"]["configRow"] = [row]
                }
              }
            }
          }
        }
      }
    }
  }

  return results

}
function getCommentMenuFreeGraph(title) {
}
function continueSparql(element) {
  document.getElementById("sparql-timeout").style.display = "none"
  d3.select("#spin").style("display", "inline-flex")
}
function stopSparql(element) {
  sparqlQueryWindow.abort()
  clearInterval(interval);
  document.getElementById("sparql-timeout").style.display = "none"
}
function getAllIndexes(arr, value, field) {
  var indexes = [], i;
  for (i = 0; i < arr.length; i++)
    if (arr[i][field] === value)
      indexes.push(i);
  return indexes;
}