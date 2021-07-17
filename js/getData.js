
var nodes=[],links=[],data={},networkGraph;
url="https://publications.europa.eu/webapi/rdf/sparql"
/* https://data.europa.eu/euodp/sparqlep
https://www.europeandataportal.eu/sparql */
prefixes=""
/*     sparqlQuery = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
select  distinct ?g ?s ?p ?o \
where {GRAPH ?g {?s ?p ?o.}} \
LIMIT 25" */
sparqlQuery = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
select  distinct ?s ?p ?o \
where {?s ?p ?o.} \
LIMIT 25"
console.log(sparqlQuery)
var queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
$.ajax(settings).then  (function( _data ) {
    console.log(_data)
    var results = _data.results.bindings;
    console.log(results)
    for ( var i in results ) {
        results[i].o.value
        nodes.append({"id":results[i].s.value})
        nodes.append({"id":results[i].o.value})
        links.append({"source": results[i].s.value, "target": results[i].o.value, "value": results[i].p.value})
    } 
    data["nodes"]=nodes;
    data["links"]=links;
    console.log(data)
    networkGraph = new NetworkGraph("#networkGraph", data);
    networkGraph.wrangleData();
})

function updateAll(){
    networkGraph.updateAll();
  }
  function forceYChecked(checked){
    ////console.log(networkGraph)
    console.log(checked)
    networkGraph.forceProperties.forceY.enabled = checked; 
    updateAll();
    ////console.log("sale de forceChange")
  }
  function forceYStrength(value){
    console.log(value)
    networkGraph.forceProperties.forceY.strength=value; 
    updateAll();
  }
  function forceYY(value){
    console.log(value)
    networkGraph.forceProperties.forceY.y=value; 
    updateAll();
  }
  function forceCenterX(value){
    networkGraph.forceProperties.center.x=value; 
    updateAll()
  }
  function forceCenterY(value){
  networkGraph.forceProperties.center.y=value;
  updateAll();
  }
  function forceChargedChecked(checked){
    networkGraph.forceProperties.charge.enabled = checked; 
    updateAll()
  }
  function forceChargeStrength(value){
    networkGraph.forceProperties.charge.strength=value; 
    updateAll();
  }
  function forceChargeDistanceMin(value){
    networkGraph.forceProperties.charge.distanceMin=value; 
    updateAll()
  }
  function forceChargeDistanceMax(value){
    networkGraph.forceProperties.charge.distanceMax=value; 
    updateAll()
  }
  function forceCollideChecked(checked){
    networkGraph.forceProperties.collide.enabled = checked; 
    updateAll();
  }
  function forceCollideStrength(value){
    networkGraph.forceProperties.collide.strength=value; 
    updateAll();
  }
  function forceCollideRadius(value){
    networkGraph.forceProperties.collide.radius=value;
    updateAll();
  }
  function forceCollideIterations(value){
    networkGraph.forceProperties.collide.iterations=value;
    updateAll();
  }
  function forceXChecked(checked){
    networkGraph.forceProperties.forceX.enabled = checked; 
    updateAll();
  }
  function forceXStrength(value){
    networkGraph.forceProperties.forceX.strength=value; 
    updateAll();
  }
  function forceXX(value){
    networkGraph.forceProperties.forceX.x=value; 
    updateAll();
  }
  function forceLinksChecked(checked){
    networkGraph.forceProperties.link.enabled = checked; 
    updateAll();
  }
  function forceLinksDistance(value){
    networkGraph.forceProperties.link.distance=value; 
    updateAll();
  }
  function forceLinksIterations(value){
    networkGraph.forceProperties.link.iterations=value; 
    updateAll();
  }