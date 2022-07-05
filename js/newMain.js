//const { data } = require("autoprefixer")

//if basic graph settings==configRow and if free graph settings==form
async function buildNetworkGraph(settingsGraph,branchType,node){
    //console.log(settingsGraph)

    let sparqlQuery=getQuery()
    let url=getEndpointUrl()

    hideSpinMessage(interval)

    var interval=showSpinMessage("Waiting for Sparql query")
    let prefixes=""

    let queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
    let settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };

    //console.log(sparqlQuery)
    //console.log(settings) 
    if(data){
      //console.log(data.treeData)
    }
    try {
      var results = await runSparlqQuery(settings);
      //var results = results.bindings;
      //console.log(results)

      //VER SI HAY MUCHOS RESULTADOS
      ////-------------------results = clusterResults(results, settingsGraph)
      //stop displaing message when executing query
      hideSpinMessage(interval)

      //if no bubble is clicked or row in the table
      if(configRow.node==undefined){
        data=new Data(results,branchType)
        //add forces to graph
        setForcesGraph()

        //check if there is an object networkGraph already
        if(networkGraph){
          legend.deleteAllColors()
        }else{
          d3.selectAll(".graph").remove()
          ////////console.log("antes networkgraph")
          networkGraph = new NetworkGraph("#networkGraph",forces,branchType,settingsGraph["rowNumber"]);
          ////////console.log("despues networkgraph")
          legend=new Legend("legend")
        }

        networkGraph.collapseAll()
      }else{
        ////console.log(configRow.node)
        //data.update(results,branchType)
        networkGraph.addingGraph=true
        networkGraph.dblClickId=configRow.node.id.replace("_image","")+"_g"
        networkGraph.mergeData(results,"basic")
        networkGraph.refresh()

        legend.addColors(networkGraph.colorScale)

        
        handleNavigation(configRow.node)

        //collapse graph if is basic type and hierarchy has more than two levels
        if(branchType=="basic"){
          //  networkGraph.collapseNodeBranch(node)
          //collapse(networkGraph.treeData.filter(d=>d.id==node.id)[0])
        }
        if(document.getElementsByClassName("d3-tip")[0]){
          document.getElementsByClassName("d3-tip")[0].remove()
          networkGraph.g.call(networkGraph.tip);
        }
      }
    } catch (e) {
      results = false
    }
    //console.log(data.treeData)
    hideSpinMessage(interval)

    function getEndpointUrl(){
        var url;
        ////////console.log(configRow)
        url=configRow.rowFields.endpoint_url
        return url
    }
    function getQuery(){
      var sparqlQuery;
      if(branchType=="basic"){
          sparqlQuery=configRow.rowFields.query
      }else if(branchType=="expert"){
          sparqlQuery=buildExpertQuery()
      }
      return sparqlQuery
    }

    function buildExpertQuery(){
        var sparqlQuery;
        if (settingsGraph["subject-object"] == "s") {
            sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?s=<" + settingsGraph["uri"]+ ">).}"
        } else {
            sparqlQuery = "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?o=<" + settingsGraph["uri"] + ">).}"
        }
        return sparqlQuery
    }

    function setForcesGraph(){
      forces = {
        center: {
            x: 0.5,
            y: 0.5
        },
        charge: {
            enabled: true,
            strength: -800,
            distanceMin: 100,
            distanceMax: 2000
        },
        collide: {
            enabled: false,
            strength: .2,
            iterations: 1,
            radius: 5
        },
        forceX: {
            enabled:true,
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
            distance: 100,
            iterations: 1
        }
      }
    }
}
function clusterResults(results, settings) {
  var ocurrences = [], small, big, results_small, results_big, num_occ, results_big_filtered;
  if(settings["subject-object"]){
    var properties = results.map(function (r) {
      return r["p"]["value"]
    })
    var subjectObject=settings["subject-object"]
    var unique_properties = [...new Set(properties)]
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    unique_properties.forEach(function (d) {
      ocurrences.push({ "value": d, "ocurrences": countOccurrences(properties, d) })
    })
    small = ocurrences.filter(d => d.ocurrences <= 20).map(d => d.value)
    big = ocurrences.filter(d => d.ocurrences > 20).map(d => d.value)
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
    return results_small;
  }else{
    return results;
  }  
}

async function checkAskResultsFreeGraph(node, so) {
  var resultRows = []

  return new Promise((resolve, reject) => {
    d3.csv("../config_vinalod/sparqlEndpoints.csv",async function(urls){
        ////////////////////////////////////console.log(urls)
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
