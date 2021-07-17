/*
*    Network graph
*    
*    created by Teresa Barrueco
*    
*    based on the version of d3-force testing ground by Steve Haroz at
*    https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03
*    GNU General Public License, version 3
*    https://opensource.org/licenses/GPL-3.0 
*    
*/




NetworkGraph = function (_parentElement, _data, _forces) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.forces = _forces
  this.initVis();
};

/////////////////// initVis Method //////////////////////

NetworkGraph.prototype.initVis = function () {
  var vis = this;

  //////////////console.log(vis.data.treeData)
  if(vis.data.treeData){
    vis.treeData=vis.data.treeData
    vis.data=vis.data.flatData
    ////////console.log(vis.treeData)
  }

  ////////////////////////////console.log(configFile)
  ////////////////console.log(d3.select(this.parentElement).node().parentElement.getBoundingClientRect().width)
  ////////////////console.log(d3.select(this.parentElement).node().parentElement)
  ////////////////console.log(d3.select(this.parentElement).node().parentElement.getBoundingClientRect().height)
  vis.width = +d3.select(this.parentElement).node().getBoundingClientRect().width;
  vis.height = +d3.select(this.parentElement).node().getBoundingClientRect().height;
  //////////////console.log(vis.width)
  //////////////console.log(vis.height)
  //////////////console.log(d3.select(this.parentElement).node())

  vis.svg = d3.select(this.parentElement).append("svg")
  .attr("width", vis.width)
  .attr("height", vis.height)

  //vis.container=d3.select(this.parentElement)
  //.attr("viewBox", `-50 -650 1350 1200`)
  //.attr("viewBox", `50 50 1350 1200`)
  //.attr("viewBox", `0 0 ${vis.width} ${vis.height}`)
/*   .attr("width", "100%")
  .attr("height", "100%") */
/*   .call(d3.zoom().scaleExtent([1, 3]).on("zoom", function () {
    vis.svg.attr("transform", d3.event.transform)
  
})).on("dblclick.zoom", null); */
//.call(d3.zoom().scaleExtent([1, 8]).on("zoom", zoom))
//.append("g");

  vis.gLinks=vis.svg.append("g")
  .attr("class", "links")

  vis.gNodes=vis.svg.append("g")
  .attr("class", "nodes")

  vis.gNodesRect=vis.svg.append("g")
  .attr("class", "nodesRect")

  console.log(configFile)
  console.log(nodesClasses)
  if(nodesClasses!=undefined){
    vis.colorScale = d3.scaleOrdinal()
    .domain(nodesClasses)
    //.range(d3.schemePaired());
    .range(d3.schemeCategory20)
  }
  

  vis.simulation = d3.forceSimulation();

  //console.log(vis.forces.center.y)
  vis.forceProperties = {
    center: {
        x: vis.forces.center.x,
        y: vis.forces.center.y
    },
    charge: {
        enabled: vis.forces.charge.enabled,
        strength: vis.forces.charge.strength,
        distanceMin: vis.forces.charge.distanceMin,
        distanceMax: vis.forces.charge.distanceMax
    },
    collide: {
        enabled: vis.forces.collide.enabled,
        strength: vis.forces.collide.strength,
        iterations: vis.forces.collide.iterations,
        radius: vis.forces.collide.radius
    },
    forceX: {
        enabled: vis.forces.forceX.enabled,
        strength: vis.forces.forceX.strength,
        x: vis.forces.forceX.x
    },
    forceY: {
        enabled: vis.forces.forceY.enabled,
        strength: vis.forces.forceY.strength,
        y: vis.forces.forceY.y
    },
    link: {
        enabled: vis.forces.link.enabled,
        distance: vis.forces.link.distance,
        iterations: vis.forces.link.iterations
    }
  }

  /* vis.forceProperties = {
    center: {
        x: 0.5,
        y: 0.5
    },
    charge: {
        enabled: true,
        strength: -200,
        distanceMin: 100,
        distanceMax: 2000
    },
    collide: {
        enabled: true,
        strength: .2,
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
        distance: 100,
        iterations: 1
    }
  } */
  //////////////////////////////////////console.log(vis.data)
  vis.maxSizeNode=d3.max(vis.data.nodes, d => d.number)  
    vis.sizeNode = d3.scaleLinear()
    .domain([0,vis.maxSizeNode])  // What's in the data
    .range([ 10, 15])  // Size in pixel
    //.range([ 10, 30])  // Size in pixel
 
  vis.initializeSimulation();
  vis.initializeDisplay();

/*   function zoom() {
    var zoom = d3.event;
    vis.svg.attr("transform", "translate(" + zoom.translate + ")scale(" + zoom.scale + ")");
  } */
};

// set up the simulation and event to update locations after each tick
NetworkGraph.prototype.initializeSimulation = function () {
  var vis = this;

  // Aquí se transforma la data de los nodes
  ////////////////console.log(vis.data.nodes)
  vis.simulation.nodes(vis.data.nodes);
  vis.initializeForces();

}
NetworkGraph.prototype.initializeForces = function() {
  var vis = this;

  
  vis.simulation
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide())
      .force("center", d3.forceCenter())
      .force("forceX", d3.forceX())
      .force("forceY", d3.forceY());


  vis.simulation.on("tick", ticked);

  vis.updateForces();

  function ticked() {
    vis.link
        .attr("x1", function(d) { 
            return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    vis.navCircle
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

    vis.nodeCircle
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        //.style("opacity", 1);

    vis.labels
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })

/*     vis.labels
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y-20; }) */

    /* vis.labelsRect
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y-20; }) */
    vis.labelsRect
        .attr("x", function(d) { 
          //////////console.log(d.x)
          return d.x; })
        .attr("y", function(d) { return d.y-20; })

    vis.nodeRect
        .attr("x", function(d) { return d.x - 20; })
        .attr("y", function(d) { return d.y - 10; })
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("height", 20)
        .attr("width", 40)
        //.style("opacity", 1);

    d3.select('#alpha_value').style('flex-basis', (vis.simulation.alpha()*100) + '%');
  }
}

// apply new force properties
NetworkGraph.prototype.updateForces= function() {

  var vis = this;
 
  vis.simulation.force("center")
      .x(vis.width * vis.forceProperties.center.x)
      .y(vis.height * vis.forceProperties.center.y);
  vis.simulation.force("charge")
      .strength(vis.forceProperties.charge.strength * vis.forceProperties.charge.enabled)
      .distanceMin(vis.forceProperties.charge.distanceMin)
      .distanceMax(vis.forceProperties.charge.distanceMax);
  vis.simulation.force("collide")
      .strength(vis.forceProperties.collide.strength * vis.forceProperties.collide.enabled)
      .radius(vis.forceProperties.collide.radius)
      .iterations(vis.forceProperties.collide.iterations);
  vis.simulation.force("forceX")
      .strength(vis.forceProperties.forceX.strength * vis.forceProperties.forceX.enabled)
      .x(vis.width * vis.forceProperties.forceX.x);
  vis.simulation.force("forceY")
      .strength(vis.forceProperties.forceY.strength * vis.forceProperties.forceY.enabled)
      .y(vis.height * vis.forceProperties.forceY.y);
  
  //////////////////console.log(vis.forceProperties.link)
  // Aquí es dónde se transforma la data de los links
  ////console.log(vis.data.nodes)
  //console.log(vis.data.links)
  vis.simulation.force("link")
      .id(function(d) {
          return d.id;})
      .distance(vis.forceProperties.link.distance)
      .iterations(vis.forceProperties.link.iterations)
      .links(vis.forceProperties.link.enabled ? vis.data.links : []);

  // updates ignored until this is run
  // restarts the simulation (important if simulation has already slowed down)
  vis.simulation.alpha(1).restart();
}

// generate the svg objects and force simulation
NetworkGraph.prototype.initializeDisplay = function() {
  var vis = this,linkId,classElement;
  //////////////////////////////////////console.log(vis.data)
  vis.tip = d3.tip()
  .attr('class', 'd3-tip')
  //.offset([250,-90])
  .html(function (d) {
      ////////////////console.log(d)
      
      ////////////////////console.log(element)
      ////////////////////console.log(this.getAttribute("id"))
      if(d){
        ////////////console.log(d)
        if((d.comment==undefined)&(!d.model)){
          ////////////console.log("!d.comment")
          if(!d.class){
            var text = `
              <table class="tiptable" style="margin-left: 2.5px">
                  <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Value:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.value + `</span></td></tr>
                  <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
              </table>`;
            }else{
              if(d.class){
                classElement=d.class
              }else{
                classElement="keyword"
              }
              var text = `
                <table class="tiptable" style="margin-left: 2.5px">
                    <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Value:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.value + `</span></td></tr>
                    <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Class:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + classElement + `</span></td></tr>
                    <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
                </table>`;
              }
        }else if(d.model){
          if(d.label==undefined){
            var text = `
            <table class="tiptable" style="margin-left: 2.5px">
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Name:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.name + `</span></td></tr>
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Class:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.class + `</span></td></tr>
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
            </table>`;
          }else{
            var text = `
            <table class="tiptable" style="margin-left: 2.5px">
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Name:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.name + `</span></td></tr>
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Label:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.label + `</span></td></tr>
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
            </table>`;
          }
          
        }else{
          var text = `
                <table class="tiptable" style="margin-left: 2.5px">
                    <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Name:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.name + `</span></td></tr>
                    <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Label:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.label + `</span></td></tr>
                    <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Comment:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.comment + `</span></td></tr>
                    <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
                </table>`;
        }
        
      }
      else{
        var text = `
            <table class="tiptable" style="margin-left: 2.5px">
                <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:red">CLICK TO ADD A NEW GRAPH BASED ON ...</span></td></tr>
            </table>`;
      }
    
    return text;
  });
  
  vis.svg.call(vis.tip);

  vis.dataJoinGraph()
  vis.exitGraph()
  vis.enterGraph()
// visualize the graph
  d3.selectAll(".navCircle")
  .style("opacity", 0)

  d3.selectAll(".nodeLabel")
  .style("opacity", 0)

  d3.selectAll(".rectLabel")
  .style("opacity", 0)
  
  vis.updateDisplay();

}

NetworkGraph.prototype.updateDisplay = function () {
  var vis = this;

  
  vis.link
      .style("stroke-width", vis.forceProperties.link.enabled ? 1 : .5)
      .style("opacity", vis.forceProperties.link.enabled ? 1 : 0);
}

NetworkGraph.prototype.updateAll = function (){
  var vis = this;

  vis.initializeSimulation();
  vis.updateDisplay();
}
/////////////////// wrangleVis Method ///////////////////

NetworkGraph.prototype.wrangleData = function (node) {
  var vis = this;
  ////////////////////////////console.log("entra wrangle data")
  if(document.getElementById('expert').checked) {
  if (node.getAttribute("class")!="nodeCircle"){
    if (d3.select("#"+node.getAttribute("id")).data()[0]["children"]){
      for (let i = 0; i < vis.treeData.length; i++) {
        if (vis.treeData[i]["id"]==d3.select("#"+node.getAttribute("id")).data()[0]["id"]){
          vis.treeData[i]._children = vis.treeData[i].children;
          delete vis.treeData[i].children;
          vis.data=flatten(vis.treeData).flatData
          vis.initializeSimulation();
          //////////////////////////////console.log(parar)
          vis.dataJoinGraph()
          vis.exitGraph()

          d3.select("#"+node.getAttribute("id")).style("fill","#e96b36")
          
          break;
        }
      }
    }else{
      for (let i = 0; i < vis.treeData.length; i++) {
      
        if (vis.treeData[i]["id"]==d3.select("#"+node.getAttribute("id")).data()[0]["id"]){
          vis.treeData[i].children = vis.treeData[i]._children;
          delete vis.treeData[i]._children;
          vis.data=flatten(vis.treeData).flatData

          vis.initializeSimulation();
          //vis.initializeDisplay();
          vis.dataJoinGraph()
          vis.enterGraph()
          vis.initializeSimulation();
          vis.dataJoinGraph()
          vis.exitGraph()
          //vis.initializeSimulation();

          d3.select("#"+node.getAttribute("id")).style("fill","#f5aa41")
          //////////////////////////////console.log("llega al final")
          //parar=true
          break;
      }
    }
    //vis.dataJoinGraph()
    //vis.exitGraph()
    d3.selectAll(".navCircle")
      .style("opacity", 0)
    
    d3.selectAll(".nodeLabel")
      .style("opacity", 0)
  }
  
  }else{
    //////////////////////////console.log("es nodeCircle")
    if((d3.select("#"+node.getAttribute("id")).data()[0]["type"]=="uri")||(d3.select("#"+node.getAttribute("id")).data()[0]["type"]=="bnode")){
      url="https://publications.europa.eu/webapi/rdf/sparql"  
      prefixes=""
      //////////////////////////console.log(node)
      sparqlQuery = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>  \
      SELECT DISTINCT ?s ?p ?o \
      where {{?s ?p ?o.} \
            bind (if(ISBLANK(?o),<LONG::bif:iri_id_num>(?o),'') as ?oID). \
            bind (if(LANG(?o),LANG(?o),'') as ?oLANG). \
            FILTER(?oLANG='en'||?oLANG='') \
            filter(?s=<"+node.getAttribute("origId")+">) \
            } \
      order by DESC(?oLANG) (?p=<http://www.w3.org/2008/05/skos-xl#prefLabel>||?p=<http://www.w3.org/2008/05/skos-xl#altLabel>) ?s ?g \
      #LIMIT 1 OFFSET 0"

      //////////////////////////console.log(sparqlQuery)
      var queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
      settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
      $.ajax(settings).then  (function( _data ) {
          //////////////////////////////console.log(node)
          
          var results = _data.results.bindings;
          //////////////////////////console.log(results)

          data=buildDataExpert(results,node)

          if (data){
            vis.treeData=data.treeData
            vis.data=data.flatData
            //vis.data=flatten(vis.treeData).flatData
            vis.initializeSimulation();
            vis.dataJoinGraph()
            vis.enterGraph()
            vis.dataJoinGraph()
            vis.exitGraph()
          
          }

           
          
      })
    }
  }
  }else{
    vis.wrangleDataBasic(node)
  }
};


NetworkGraph.prototype.dataJoinGraph = function(){
  var vis=this;

  vis.linkSel = vis.gLinks
  .selectAll("line")

  vis.link=vis.linkSel
  .data(vis.data.links,function(d){
    return d.id;
  })

/*   vis.gNodesSel=vis.gNodes
  .selectAll('nodes')

  vis.gNodesPack=vis.gNodesSel
  .data(vis.data.nodes.filter(function(item) {
    return item.shape == 1
  }), function(d) { return d.id; }) */

  vis.circleSel=vis.gNodes
  .selectAll('.nodeCircle')

  vis.nodeCircle=vis.circleSel
  .data(vis.data.nodes.filter(function(item) {
    ////////////////console.log(item)
    return item.shape == 1
  }), function(d) { return d.id; })

  vis.navCircleSel=vis.gNodes
  .selectAll('.navCircle')

  vis.navCircle=vis.navCircleSel
  .data(vis.data.nodes.filter(function(item) {
    return item.shape == 1
  }), function(d) { return d.id; })

  vis.labelsSel=vis.gNodes
  .selectAll('.nodeLabel')

  vis.labels = vis.labelsSel
  .data(vis.data.nodes.filter(function(item) {
    return item.shape == 1
  }), function(d) { return d.id; })

/*     vis.gNodesRect=vis.gNodesRect
    .selectAll('.nodesRects')
    .data(vis.data.nodes.filter(function(item) {
      return item.shape == 2
    }), function(d) { return d.id; }) */

  vis.labelsRectSel=vis.gNodesRect
  .selectAll('.rectLabel')

  vis.labelsRect = vis.labelsRectSel
  .data(vis.data.nodes.filter(function(item) {
    return item.shape == 2
  }))

  vis.rectSel=vis.gNodesRect
    .selectAll("rect")

  vis.nodeRect=vis.rectSel
    .data(vis.data.nodes.filter(function(item) {
      return item.shape == 2
    }))

}
NetworkGraph.prototype.enterGraph = function(){
  var vis=this;
  vis.menuItems = [
    {
      title: 'First action',
      action: (d) => {
        // TODO: add any action you want to perform
        //////////console.log(d);
      }
    },
    {
      title: 'Second action',
      action: (d) => {
        // TODO: add any action you want to perform
        //////////console.log(d);
      }
    }
  ];
  //vis.containerRect = vis.container.getBoundingClientRect();
  //vis.height = containerRect.height;
  //vis.width = containerRect.width;
  
  //////////////////console.log(vis.link)
  //////////////////console.log(vis.gNodesCircles)
  //////////////////console.log(vis.gNodesRect)
  vis.isDblclick = false;

  vis.timeoutTiming = 500;

  vis.link=vis.link
      .enter().append("line")
      .attr("class", "link")
      .attr("origId",function(d){
        return (d.source.id+"_"+d.target.id)
      })
      .attr("index",function(d){
        return d.index;
      })
      .attr("id",function(d){
        return (d.source.id+"_"+d.target.id)
      }); 

  
/*   vis.gNodesCircles=vis.gNodesCircles
    .enter().append("g")
    .attr("class", "nodesCircles")
    .attr("id",function(d){
      return (d.id+"_g")
    })

  vis.navCircle=vis.gNodesCircles
  .append("circle")
  .attr("class", "navCircle")
  .attr("id",function(d){
    //////////////////////////////console.log(d)
    return (d.id+"_nav")
  })
  .attr("r", function(d){
    ////////////////////////////////console.log(vis.sizeNode(d.number))
    return vis.sizeNode(d.number)+20})
  .attr("options",function(d){
      if(d.options){
        ////////////////////////console.log(d)
        return (d.options);
      }else{
        return 0;
      }
      
    })
  .attr("stroke", function(d){
    return "grey"
  })
  .attr("stroke-width", "1px")
  .style("fill","white")
  .on('mouseover', function(d){
    ////////////////////console.log(d)
    //////////////////console.log(this.style.opacity)
    if(this.style.opacity==1){
      vis.tip.show(this);
    }
  })
  .on('mouseout', function(d){
    vis.tip.hide(d,this);
    //mouseout()
  }) */

    vis.navCircle=vis.navCircle
    .enter().append("circle")
    .attr("class", "navCircle")
    .attr("id",function(d){
      //////////////////////////////console.log(d)
      return (d.id+"_nav")
    })
    .attr("r", function(d){
      ////////////////////////////////console.log(vis.sizeNode(d.number))
      return vis.sizeNode(d.number)+20})
    .attr("options",function(d){
        if(d.options){
          ////////////////////////console.log(d)
          return (d.options);
        }else{
          return 0;
        }
        
      })
    .attr("stroke", function(d){
      return "grey"
    })
    .attr("stroke-width", "1px")
    .style("fill","white")
    .on('mouseover', function(d){
      ////////////////////console.log(d)
      //////////////////console.log(this.style.opacity)
      if(this.style.opacity==1){
        vis.tip.show(this);
      }
    })
    .on('mouseout', function(d){
      vis.tip.hide(d,this);
      //mouseout()
    })

    vis.nodeCircle=vis.nodeCircle
    .enter().append("circle")
    .attr("class", "nodeCircle")
    .attr("origId",function(d){
      //////////////////////////////////////console.log(d)
      return d.value
    })
    .attr("id",function(d){
      return (d.id)
    })
    .attr("root", function(d){
      if(d.root){
        return 1;
      }else{
        return 0;
      }
    })
    .attr("options",function(d){
      if(d.options){
        //////////////////////////console.log(d.options)
        return (d.options);
      }else{
        return 0;
      }
      
    })
    // si queremos cambiar el radius de los nodos
    .attr("r", function(d){
      ////////console.log(d.number)
      return vis.sizeNode(d.number)})
    .attr("stroke", function(d){
      return "grey"
    })
    .attr("stroke-width", "1px")
    .style("fill", function(d){ 
      if(!d.class){
        if ((d.type=="typed-literal")||(d.type=="literal")){
          return "#c5b0d5";
        }else if(d.type=="bnode"){
          return "#98df8a";
        }else if(d.root){
          return "#f9e14c"
        }else{
          return "#a3cbe2"
        }
      }else{
        return vis.colorScale(d.class);
        ////////////////////////////////////console.log(d.class)
/*         if (d.class=="dataset"){
          return "#ef6653";
        }else if(d.class=="theme"){
          return "#529dcc";
        }else if(d.class=="publisher"){
          return "#fbd74a";
        }else if(d.class=="dataset_keyword"){
          return "#d4d4d4"
        }else if(d.class=='class-sum-leg'){
          if (d.number==0){
            return "#ffbaf3"
          }else{
            return "#b78cb1"
          }
        }else if(d.class=="summary_legislation_eu"){
          if(d.number==0){
            return "#fffff2"
          }else{
            return "#c9eab6"
          }
        }else if(d.class=="ressource_legal"){
          return "#fbd74a"
        }else if(d.class=="authority_table"){
          if (d.number==0){
            return "#56bfff"
            //return "#ffbaf3"
          }else{
            return "#4190c5"
            //return "#b78cb1"
          }
        }else if(d.class=="eurovoc"){
          return "#fbd74a";
        }else if(d.class=="eurovocThesauri"){
          return "#d9e8f5"
        }else if(d.class=="eurovocConcept"){
          return "#e5dce3"
        }else if(d.class=="workType"){
          return "#7fcdbb"
        }else if(d.class=="work"){
          return "#f8c480"
        } */
      }
      
    })
    .on('mouseover', function(d){
      vis.tip.show(d,this);
    })
    .on('mouseout', function(d){
      vis.tip.hide(d,this);
      //mouseout()
    })
    .on("click",function(d){
      //document.getElementById(modalId).classList.add(isVisible);
      //////////////console.log(d)
      //var e=d3.event;
      //////////////console.log(this)
      var element=this
      clearTimeout(vis.clickTimeout);
      vis.clickTimeout = setTimeout(function () {
        if(!vis.isDblclick) {
          // here goes your click codes
          ////////////console.log('a simple click.');
          if(!d.comment){
            //////////console.log(this)
            if (element.getAttribute("stroke-width")=="1px"){
              //window.open('https://javascript.info');
              mouseover(element,vis.data)
            }else{
              mouseout()
            }
          }else{
            //////////////console.log("model")
            ////////////console.log(element)
            modelClick(element,vis.data)
          }
        }
      }, vis.timeoutTiming);

    })
    .on('dblclick', function(d){
      vis.isDblclick = true;
      clearTimeout(vis.dblclickTimeout);
      vis.dblclickTimeout = setTimeout(function () {
        vis.isDblclick = false;
      }, vis.timeoutTiming);
      //-----
      // here goes your dblclick codes
      if((!d.comment)&(d.class!="ressource_legal")){
        vis.wrangleData(this);
      }else{
        if(d.class=="ressource_legal"){
          euvocDblClick(this)
        }else{
          modelDblClick(this)
        }
        
      }
    })
    .on('contextmenu', (d) => {
      d3.event.preventDefault();
      createContextMenu(d, vis.menuItems, 100, 100, vis.svg);
      //////////console.log("context menu")
    })
    .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    vis.labels = vis.labels
    .enter().append("text")
    .attr("class","nodeLabel")
    .attr("id",function(d){
      return (d.id+"_label")
    })
    .text(function(d) {
      //console.log(d)
      if(d.comment){
        //console.log(d.label)
        return d.label;
      }else if(d.class=="authority_table"){
        return d.label;
      }else{
        if(d.value){
          return d.value;
        }else{
          return d.label
        }
      }
    })



/*     vis.gNodesRect=vis.gNodesRect
    .enter().append("g")
    .attr("class", "nodesRects")
    .attr("id",function(d){
      return (d.id+"_g")
    })


    vis.nodeRect=vis.gNodesRect
      .append("rect") */
    vis.nodeRect=vis.nodeRect
      .enter().append("rect")
      .attr("class", "nodeRect")
      .attr("origId",function(d){
        return d.value
      })
      .attr("id",function(d){
        return (d.id)
      })
      .attr("stroke", "grey")
      .attr("stroke-width", "1px")
      .style("fill", function(d){ 
        return "#f5aa41"
      })
      .on('mouseover', function(d){
        vis.tip.show(d,this);
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
      })
      .on("click",function(d){
        if (this.getAttribute("stroke-width")=="1px"){
          mouseover(this,vis.data)
        }else{
          mouseout()
        }
      })
      .on('dblclick', function(d){
        vis.tip.hide(d,this);
        vis.wrangleData(this);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    vis.labelsRect = vis.labelsRect
        .enter().append("text")
        .attr("class","rectLabel")
        .attr("id",function(d){
          return (d.id+"_label")
        })
        .text(function(d) {
          if(!d.label){
            return d.value;
          }else{
            return d.label;
          }
        })

/*     vis.labelsRect = vis.gNodesRect.append("text")
    .attr("class","rectLabel")
    .attr("id",function(d){
      return (d.id+"_label")
    })
    .text(function(d) {
      return d.value;
    }) */

    function color(d) {
      return d._children ? "#e86935" : "#f5aa41";
    }
    //////////// UI EVENTS ////////////
  
    function dragstarted(d) {
      if (!d3.event.active) vis.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
  
    function dragended(d) {
      if (!d3.event.active) vis.simulation.alphaTarget(0.0001);
      d.fx = null;
      d.fy = null;
    }
    function createContextMenu (d, menuItems, width, height, svgId) {
      //menuFactory(d3.event.pageX - width / 2, d3.event.pageY - height / 2, menuItems, d, svgId);
      menuFactory(d3.event.pageX , d3.event.pageY , menuItems, d, svgId);
      d3.event.preventDefault();
    }
    function menuFactory (x, y, menuItems, data, svgId) {
      //d3.select(`.${styles.contextMenu}`).remove();
      //////////console.log(menuItems)
      d3.select(".contextMenu").remove();
      // Draw the menu
      vis.svg
          .append('g').attr('class', "contextMenu")
          .selectAll("tmp")
          .data(menuItems).enter()
          .append('g').attr('class', "menuEntry")
          .style({'cursor': 'pointer'});
  
      // Draw menu entries
      d3.selectAll(".menuEntry")
          .append('rect')
          .attr('x', x)
          .attr('y', (d, i) => { 
            //////////console.log(d)
            return y + (i * 30); })
          .attr('rx', 2)
          .attr('width', 150)
          .attr('height', 30)
          .on('click', (d) => { d.action(data) });
  
      d3.selectAll(".menuEntry")
          .append('text')
          .text((d) => { 
            //////////console.log(d)
            return d.title; })
          .attr('x', x)
          .attr('y', (d, i) => { return y + (i * 30); })
          .attr('dy', 20)
          .attr('dx', 45)
          .on('click', (d) => { d.action(data) });
  
      // Other interactions
      d3.select('body')
          .on('click', () => {
              d3.select(".contextMenu").remove();
          });
    }
}
NetworkGraph.prototype.exitGraph = function(){
    var vis=this;

    //////////////////console.log(vis.link)
    vis.link.exit().remove();
    //////////////////console.log(vis.gNodesCircles)
    vis.navCircle.exit().remove();
    vis.nodeCircle.exit().remove();
    vis.labels.exit().remove();
    //////////////////console.log(vis.gNodesRect)
    vis.nodeRect.exit().remove();
    vis.labelsRect.exit().remove();

}

NetworkGraph.prototype.wrangleDataBasic = function (node) {
  var vis = this;
  var nodes=[],children

  var nodeColor= d3.rgb(node.style.fill)

    if (d3.select("#"+node.getAttribute("id")).data()[0]["children"]){
      if (node.getAttribute("root")=="1"){
        children=d3.select("#"+node.getAttribute("id")).data()[0]["children"]
        children.forEach(function(d){
          vis.collapseBranch(d)
        })
      }else{
        vis.collapseBranch(d3.select("#"+node.getAttribute("id")).data()[0])
      }
      vis.data=flatten(vis.treeData).flatData
      vis.initializeSimulation();
      vis.dataJoinGraph()
      vis.exitGraph()

      d3.select("#"+node.getAttribute("id")).style("fill",nodeColor.darker(0.8))
    }else{
      if (node.getAttribute("root")=="1"){
        children=d3.select("#"+node.getAttribute("id")).data()[0]["children"]
        children.forEach(function(d){
          //vis.expandBranch(d)
          vis.expandLevelBranch(d)
        })
      }else{
        //vis.expandBranch(d3.select("#"+node.getAttribute("id")).data()[0])
        vis.expandLevelBranch(d3.select("#"+node.getAttribute("id")).data()[0])
      }
      //U3QZQUlzIf7txEOJ
      
      vis.data=flatten(vis.treeData).flatData
      ////console.log(vis.data)
      //vis.initializeSimulation();
      //////console.log(vis.treeData)
      //////console.log(vis.data)
      vis.initializeSimulation();
      //vis.initializeDisplay();
      vis.dataJoinGraph()
      vis.enterGraph()
      vis.initializeSimulation();
      vis.dataJoinGraph()
      vis.exitGraph()
      d3.selectAll(".navCircle")
      .style("opacity", 0)
    
      d3.selectAll(".nodeLabel")
      .style("opacity", 0)

      d3.select("#"+node.getAttribute("id")).style("fill",nodeColor.brighter(0.8))
      //console.log(nodeColor.brighter(0.8))
  }
  
};

NetworkGraph.prototype.collapseAll = function () {
  var vis = this;
  var children;
  //////////////////console.log(d3.select('[root="1"]'));
  ////////////////////console.log(d3.select("[fill=rgb(251, 215, 74)]"));
  children=d3.select('[root="1"]').data()[0]["children"]
  //////////////////console.log(children)
  //////////////////console.log(d3.select('[root="1"]').data())
  children.forEach(function(d){
      //////////////////console.log(d)
      vis.collapseBranch(d)
  })
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

  d3.select("#"+node.getAttribute("id")).style("fill",nodeColor.darker(0.8))
}


NetworkGraph.prototype.expandAll = function () {
  var vis = this;
  var children;
  //////////////////console.log(d3.select('[root="1"]'));
  ////////////////////console.log(d3.select("[fill=rgb(251, 215, 74)]"));
  children=d3.select('[root="1"]').data()[0]["children"]
  //////////////////console.log(children)
  //////////////////console.log(d3.select('[root="1"]').data())
  children.forEach(function(d){
      //////////////////console.log(d)
      vis.expandBranch(d)
  })
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
      //vis.initializeDisplay();
  vis.dataJoinGraph()
  vis.enterGraph()
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

  d3.selectAll(".navCircle")
  .style("opacity", 0)

  d3.selectAll(".nodeLabel")
  .style("opacity", 0)

  d3.select("#"+node.getAttribute("id")).style("fill",nodeColor.brighter(0.8))
}
NetworkGraph.prototype.collapseBranch = function (node){
  var vis = this;
  var nodes=[]
  nodes.push(node.id)
      //}
  collapse(node)
  //////////////////////console.log(nodes)
  for (let i = 0; i < vis.treeData.length; i++) {

    if (nodes.includes(vis.treeData[i]["id"])){
      vis.treeData[i]._children = vis.treeData[i].children;
      delete vis.treeData[i].children;
      ////////////////////console.log(vis.treeData)
      ////////////////////console.log(vis.treeData[i]["id"])
      if(vis.treeData[i]["id"]!=node.id){
        ////////////////////console.log(vis.treeData[i])
        vis.treeData[i]["hidden"]=true
      }
    }
  }
  function collapse(node) {
    var position;
    if(node["children"]){
      node["children"].forEach(function(d){
        position=nodes.indexOf(nodes.filter(function(item) {
          return (item.id == d.id)
        })[0])
        if(position==-1){
          nodes.push(d.id)
        }  
        collapse(d)
      })
    }
  }
}
NetworkGraph.prototype.expandBranch = function (node){
  var vis = this;
  var nodes=[]
  nodes.push(node.id)
  expand(node)
  for (let i = 0; i < vis.treeData.length; i++) {
    if (nodes.includes(vis.treeData[i]["id"])){
      vis.treeData[i].children = vis.treeData[i]._children;
      delete vis.treeData[i]._children;
      if(vis.treeData[i]["hidden"]){
        delete vis.treeData[i].hidden;
      }
    }
  }
  function expand(node) {
    var position;
    if(node["_children"]){
      node["_children"].forEach(function(d){
        position=nodes.indexOf(nodes.filter(function(item) {
          return (item.id == d.id)
        })[0])
        if(position==-1){
          nodes.push(d.id)
        }  
        expand(d)
      })
    }
  }
}
NetworkGraph.prototype.expandLevelBranch = function (node){
  var vis = this;
  var nodes=[]
  nodes.push(node.id)
  expand(node)
  //console.log(nodes)
  //console.log(vis.treeData)
  for (let i = 0; i < vis.treeData.length; i++) {
    //console.log(vis.treeData[i]["id"])
    if(node.id==vis.treeData[i]["id"]){
      vis.treeData[i].children = vis.treeData[i]._children;
      delete vis.treeData[i]._children;
    }
    if (nodes.includes(vis.treeData[i]["id"])){
      //console.log(vis.treeData[i]["id"])
      /* vis.treeData[i].children = vis.treeData[i]._children;
      delete vis.treeData[i]._children; */
      if(vis.treeData[i]["hidden"]){
        delete vis.treeData[i].hidden;
      }
      ////console.log(vis.treeData[i])
    }
  }
  function expand(node) {
    var position;
    ////console.log(node)
    if(node["_children"]){
      node["_children"].forEach(function(d){
        ////console.log(d.id)
        position=nodes.indexOf(nodes.filter(function(item) {
          return (item.id == d.id)
        })[0])
        if(position==-1){
          nodes.push(d.id)
        }  
        //expand(d)
      })
    }
  }
}