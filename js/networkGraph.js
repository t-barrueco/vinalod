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




NetworkGraph = function (_parentElement, _data, _forces, _graphType) {
  this.parentElement = _parentElement;
  this.data = _data;
/*   this.origData=_data;
 */  this.forces = _forces
  this.graphType=_graphType
  this.initTypeVis()
  ////////////////console.log("despues de crear el objeto")
};

/////////////////// initVis Method //////////////////////
NetworkGraph.prototype.initTypeVis = function () {
  var vis = this;
  if(vis.graphType=="fromConfig"){
    vis.initVis();
  }else if(this.graphType=="freeGraph"){
    vis.initFreeVis();
    ////////////////console.log("despues de initFreeVis")
  }
};

NetworkGraph.prototype.initVis = function () {
  var vis = this;

  if(vis.data.treeData){
  vis.treeData=vis.data.treeData
  vis.data=vis.data.flatData
  //vis.allData=vis.data.allData
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.width = +d3.select(this.parentElement).node().getBoundingClientRect().width;
  vis.height = +d3.select(this.parentElement).node().getBoundingClientRect().height;
  vis.height=1200
  vis.svg = d3.select(this.parentElement).append("svg")
  //.attr("xmlns","http://www.w3.org/2000/svg")
  .attr("class", "graph")
  .attr("width", vis.width)
  .attr("height", vis.height)
  //.on("dblclick", null);

  vis.rect=vis.svg.append("rect")
    .attr('class', 'zoom')
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", vis.width)
    .attr("height", vis.height)
    .on("click",function() { unclickBubble() })
    //.call(zoom).on("dblclick.zoom", null)
    .call(d3.zoom()
        //.scaleExtent([-2, 8])
        //.on("zoom", zoom))
        .on("zoom",function(){
          zoom()
          zoomY=d3.event.transform.y
          zoomX=d3.event.transform.x
        }))
        .on("wheel.zoom", null);



  vis.g=vis.svg.append("g")
  .attr("class", "gMain");

  vis.gLinks=vis.g.append("g")
  .attr("class", "links")


  vis.gNodes=vis.g.append("g")
  .attr("class", "nodes")

  vis.gNodesRect=vis.g.append("g")
  .attr("class", "nodesRect")

  if(nodesClassesShow!=undefined){
    
    colorCorrespondence={
    "#6EE7B7":"green-300",
    "#FCA5A5":"red-300",
    "#FCD34D":"yellow-300",
    "#F9A8D4":"pink-300",
    "#C4B5FD":"purple-300",
    "#93C5FD":"blue-300",
    "#D1D5DB":"gray-300",
    "#10B981":"green-500",
    "#EF4444":"red-500",
    "#F59E0B":"yellow-500",
    "#EC4899":"pink-500",
    "#8B5CF6":"purple-500",
    "#3B82F6":"blue-500",
    "#6B7280":"gray-s500"}

    vis.colors=["#6EE7B7","#FCA5A5","#FCD34D","#F9A8D4","#C4B5FD","#93C5FD","#D1D5DB"
    ,"#10B981","#EF4444","#F59E0B","#EC4899","#8B5CF6","#3B82F6","#6B7280"]

    //////////////////////////////////////////////////////////////////////////////////////////console.log("pasa por init")
    vis.colorScale = d3.scaleOrdinal()
    .domain(nodesClassesShow)
    //.range(d3.schemeCategory20)
    .range(vis.colors.slice(0,nodesClassesShow.length))
    //////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.domain())
    //////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.range())

    ////////////////////////////////////////////////////////////////////////////////////////////console.log(nodesClassesShow.length)
    ////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colors.slice(0,2))

    ////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colors.slice(0,nodesClassesShow.length))
    ////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.range())
    colorScale=vis.colorScale

    fillLegend([],false)

/*     vis.legend = vis.g.append("g")
        .attr("class","legendOrdinal")
        .attr("transform", "translate(20,50)") */

/*     vis.legend = d3.select(".legend").append("svg")
        .attr("class","legendOrdinal")
        .attr("transform", "translate(0,0)")
        .attr("width", vis.width)
        .attr("height", "120px")

    vis.legendOrdinal = d3.legendColor()
    //.shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
    .shapePadding(85)
    .shapeWidth(85)
    .orient('horizontal')
    .scale(vis.colorScale);

    vis.legend
    .call(vis.legendOrdinal); */
  }
  
  

  vis.simulation = d3.forceSimulation()
    //.force("charge", d3.forceManyBody())
    //.force("link", d3.forceLink(vis.data.links))
    //.force("center", d3.forceCenter());;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.forces.center.y)
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.maxSizeNode=d3.max(vis.data.nodes, d => d.number)  
    vis.sizeNode = d3.scaleLinear()
    //.domain([0,vis.maxSizeNode])  // What's in the data
    .domain([0,200])
    .range([ 15, 45])  // Size in pixel
    //.range([ 10, 30])  // Size in pixel
 
  vis.initializeSimulation();
  vis.initializeDisplay();
  /* function zoom() {
    vis.g.attr("transform", d3.event.transform);
  } */
};
NetworkGraph.prototype.initFreeVis = function () {
  var vis = this;

/*   if(vis.data.treeData){
    vis.treeData=vis.data.treeData
    vis.data=vis.data.flatData
  } */
  //////////console.log(vis.data)
  if(vis.data.treeData){
    vis.treeData=vis.data.treeData
    //////////console.log(vis.data.flatData)
    vis.allData=vis.data.allData
    vis.data=vis.data.flatData
    //////////console.log(vis.data)
  }
  ////console.log(vis.treeData)
  ////console.log(vis.data)
  vis.rootNode=vis.data.nodes[0]
  //vis.rootEl=d3.select("#"+vis.data.nodes[0]["id"])
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.width = +d3.select(this.parentElement).node().getBoundingClientRect().width;
  vis.height = +d3.select(this.parentElement).node().getBoundingClientRect().height;
  vis.height=800
  vis.svg = d3.select(this.parentElement).append("svg")
  //.attr("xmlns","http://www.w3.org/2000/svg")
  .attr("class", "graph")
  .attr("width", vis.width)
  .attr("height", vis.height)
  //.on("dblclick", null);

  vis.rect=vis.svg.append("rect")
    .attr('class', 'zoom')
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", vis.width)
    .attr("height", vis.height)
    .on("click",function() { unclickBubble() })
    //.call(zoom).on("dblclick.zoom", null)
    .call(d3.zoom()
        //.scaleExtent([-2, 8])
        //.on("zoom", zoom))
        .on("zoom",function(){
          zoom()
          zoomY=d3.event.transform.y
          zoomX=d3.event.transform.x
        }))
        .on("wheel.zoom", null);

  vis.svg.append('defs').append('marker')
        .attr("id",'arrowhead')
        .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
         .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
         .attr('refY',0)
         .attr('orient','auto')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');

  vis.g=vis.svg.append("g")
  .attr("class", "gMain");

  vis.gLinks=vis.g.append("g")
  .attr("class", "links")


  vis.gNodes=vis.g.append("g")
  .attr("class", "nodes")

  vis.gNodesRect=vis.g.append("g")
  .attr("class", "nodesRect")

/*   if(nodesClassesShow!=undefined){
    
    colorCorrespondence={
    "#6EE7B7":"green-300",
    "#FCA5A5":"red-300",
    "#FCD34D":"yellow-300",
    "#F9A8D4":"pink-300",
    "#C4B5FD":"purple-300",
    "#93C5FD":"blue-300",
    "#D1D5DB":"gray-300",
    "#10B981":"green-500",
    "#EF4444":"red-500",
    "#F59E0B":"yellow-500",
    "#EC4899":"pink-500",
    "#8B5CF6":"purple-500",
    "#3B82F6":"blue-500",
    "#6B7280":"gray-s500"}

    vis.colors=["#6EE7B7","#FCA5A5","#FCD34D","#F9A8D4","#C4B5FD","#93C5FD","#D1D5DB"
    ,"#10B981","#EF4444","#F59E0B","#EC4899","#8B5CF6","#3B82F6","#6B7280"]

    //////////////////////////////////////////////////////////////////////////////////////////console.log("pasa por init")
    vis.colorScale = d3.scaleOrdinal()
    .domain(nodesClassesShow)
    //.range(d3.schemeCategory20)
    .range(vis.colors.slice(0,nodesClassesShow.length))
    //////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.domain())
    //////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.range())

    ////////////////////////////////////////////////////////////////////////////////////////////console.log(nodesClassesShow.length)
    ////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colors.slice(0,2))

    ////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colors.slice(0,nodesClassesShow.length))
    ////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.range())
    colorScale=vis.colorScale

    fillLegend([],false)

  } */
  
  

  vis.simulation = d3.forceSimulation();

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.forces.center.y)
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
/*   vis.maxSizeNode=d3.max(vis.data.nodes, d => d.number)  
    vis.sizeNode = d3.scaleLinear()
    //.domain([0,vis.maxSizeNode])  // What's in the data
    .domain([0,200])
    .range([ 15, 45])  // Size in pixel
    //.range([ 10, 30])  // Size in pixel */
 
  vis.initializeSimulation();
  vis.initializeFreeDisplay();
  ////////////////console.log("despues de initializefreedisplay")
  /* function zoom() {
    vis.g.attr("transform", d3.event.transform);
  } */
};
NetworkGraph.prototype.zoomIn = function () {
  var vis = this;
/*     function zoom() {
      vis.g.attr("transform", d3.event.transform);
    } */
    var zoom = d3.zoom()
                .on('zoom', function() {
                  vis.g.attr("transform", d3.event.transform);
                  zoomScale=d3.event.transform.k;
                  zoomY=d3.event.transform.y
                  zoomX=d3.event.transform.x
            });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.select('rect.zoom'))
    zoom.scaleBy(vis.g.transition().duration(750), 1.3);
    
    //d3.select('rect.zoom').call(zoom.scaleBy, 2)
}
NetworkGraph.prototype.zoomOut = function () {
  var vis = this;
  ////////////////console.log("entra zoom")
/*     function zoom() {
      vis.g.attr("transform", d3.event.transform);
    } */
    var zoom = d3.zoom()
                .on('zoom', function() {
                  //vis.g.attr("transform", "translate("+zoomX+","+zoomY+")"+d3.event.transform);
                  vis.g.attr("transform", d3.event.transform);
                  zoomScale=d3.event.transform.k;
                  zoomY=d3.event.transform.y
                  zoomX=d3.event.transform.x
            });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.select('rect.zoom'))
    zoom.scaleBy(vis.g.transition().duration(750), 1 / 1.3);
    //d3.select('rect.zoom').call(zoom.scaleBy, 2)
}
// set up the simulation and event to update locations after each tick
NetworkGraph.prototype.initializeSimulation = function () {
  var vis = this;

  ////////////console.log(vis.data)
  // Aquí se transforma la data de los nodes
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

  if(vis.graphType=="freeGraph"){
    vis.simulation.on("tick", tickedFreeGraph);
  }else{
    vis.simulation.on("tick", ticked);
  }

  vis.updateForces();

  function ticked() {
    vis.link
        .attr("x1", function(d) { 
          //////////////////console.log(d)
            return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    
    vis.nodeCircle
        .attr("transform", function(d) { 

          return "translate(" + d.x + "," + d.y + ")"; })

    d3.select('#alpha_value').style('flex-basis', (vis.simulation.alpha()*100) + '%');
  }
  function tickedFreeGraph(){
    //////////////////console.log("entra")
/*     vis.edgepaths
    .attr("x1", function(d) { 
      ////////////////////console.log(d)
        return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; }); */
    //////////////////console.log(vis.edgepaths)
    //vis.edgepaths.attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
    vis.edgepaths.attr('d', function (d){
      //////////////////console.log(d)
      return   'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
    });
/*     vis.edgelabels
    .attr("x1", function(d) { 
      ////////////////////console.log(d)
        return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; }); */
    //////////////////console.log(vis.link)
    vis.link
        .attr("x1", function(d) { 
          ////////////////////console.log(d)
            return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    //////////////////console.log(vis.nodeCircle)
    vis.nodeCircle
        .attr("transform", function(d) { 
          ////////////////console.log(d.x)
          return "translate(" + d.x + "," + d.y + ")"; })

    d3.select('#alpha_value').style('flex-basis', (vis.simulation.alpha()*100) + '%');
  }
}

// apply new force properties
NetworkGraph.prototype.updateForces= function() {

  var vis = this;
 //////////////////console.log(vis.width * vis.forceProperties.center.x)
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
  //////////////////console.log(vis.data.links)
  vis.simulation.force("link")
      .id(function(d) {
          return d.id;})
      .distance(vis.forceProperties.link.distance)
      .iterations(vis.forceProperties.link.iterations)
      .links(vis.forceProperties.link.enabled ? vis.data.links : []);
  
  vis.simulation.alpha(1).restart();
}

// generate the svg objects and force simulation
NetworkGraph.prototype.initializeDisplay = function() {
  var vis = this,linkId,classElement;
  ////////////////console.log("entra en initializeDisplay")
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-25,0])
  .html(function (d) {
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
      var text=getTooltipText(d)
    return text;
  });
  
  vis.g.call(vis.tip);
  //////////////////////////console.log(classesFilterList)
  vis.dataJoinGraph()
  ////////////console.log("2")
  vis.exitGraph()
  ////////////////console.log("entra en initialize display")
  /* if(vis.graphType=="freeGraph"){
    ////////////////console.log("1")
    vis.enterFreeGraph()
  }else{ */
  vis.enterGraph()
  //}
  //vis.enterGraph()
  d3.selectAll(".navCircle")
  .style("opacity", 0)

  d3.selectAll(".nodeLabel")
  .style("opacity", 0)

  d3.selectAll(".rectLabel")
  .style("opacity", 0)
  
  vis.updateDisplay();

}
NetworkGraph.prototype.initializeFreeDisplay = function() {
  var vis = this,linkId,classElement;
  ////////////////console.log("entra en initializeFreeDisplay")

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-25,0])
  .html(function (d) {
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
      var text=getTooltipTextFreeGraph(d)
    return text;
  });
  
  vis.g.call(vis.tip);
  //////////////////////////console.log(classesFilterList)
  vis.dataJoinFreeGraph()
  ////////////console.log("1")
  vis.exitGraph()
  ////////////////console.log("2")
  vis.enterFreeGraph()

/*   d3.selectAll(".rectLabel")
  .style("opacity", 0) */
  ////////////////console.log("despues de enter free graph y anges de updateDisplay")
  vis.updateDisplay();
  ////////////////console.log("despues de updateDisplay")
}
NetworkGraph.prototype.updateDisplay = function () {
  var vis = this;

  ////////////////console.log("updateDisplay")
  vis.link
      .style("stroke-width", vis.forceProperties.link.enabled ? 1 : .5)
      .style("opacity", vis.forceProperties.link.enabled ? 1 : 0);
}

NetworkGraph.prototype.updateAll = function (){
  var vis = this;

  vis.initializeSimulation();
  vis.updateDisplay();
}


NetworkGraph.prototype.dataJoinGraph = function(){
  var vis=this;

  vis.linkSel = vis.gLinks
  .selectAll("line")

  vis.link=vis.linkSel
  .data(vis.data.links,function(d){
    return d.id;
  })

  vis.circleSel=vis.gNodes
  .selectAll('.nodeCircle')

  vis.nodeCircle=vis.circleSel
  .data(vis.data.nodes.filter(function(item) {
    return item.shape == 1
  }), function(d) { return d.id; })

}
NetworkGraph.prototype.dataJoinFreeGraph = function(){
  var vis=this;

  /* vis.linkSel = vis.gLinks
  .selectAll("line") 


  vis.link=vis.linkSel
  .data(vis.data.links,function(d){
    return d.id;
  }) */
  ////////console.log(vis.data.links)
  vis.link = vis.gLinks.selectAll(".link")
  .data(vis.data.links)
  ////////console.log(vis.link)
  vis.edgepaths = vis.gLinks.selectAll(".edgepath")
  .data(vis.data.links)

  //////console.log(vis.data.links)
  vis.edgelabels = vis.gLinks.selectAll(".edgelabel")
        .data(vis.data.links)
  //////console.log(vis.edgelabels)
  vis.circleSel=vis.gNodes
  .selectAll('.nodeCircle')

  //////////////////console.log(vis.data.nodes)
  
  vis.nodeCircle=vis.circleSel
  .data(vis.data.nodes,function(d){
    //////////////console.log(d.id)
    return d.id;
  })

}
NetworkGraph.prototype.enterGraph = function(){
  var vis=this,r;
  vis.colorScale.range(vis.colors.slice(0,nodesClassesShow.length))
  ////////////////console.log("entra en enterGraph")

  colorScale=vis.colorScale
  
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

  ////////////////console.log(vis.nodeCircle)
  vis.nodeCircle=vis.nodeCircle
  .enter().append("g")
  .attr("class", "nodeCircle")
  .attr("id",function(d){
    //////////////////////////////////console.log(d)
    return (d.id+"_g")
  })

  
  vis.nodeCircleCircle=vis.nodeCircle
      .append("circle")
      .attr("class",function(d){
        //////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        return d.class + " nodeCircleCircle"
      }) 
      .attr("origId",function(d){
        //////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
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
          return (d.options);
        }else{
          return 0;
        }
        
      })
      // si queremos cambiar el radius de los nodos
      .attr("r", function(d){
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
          //////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.domain())
          //////////////////////////////////////////////////////////////////////////////////////////console.log(vis.colorScale.range())
          //////////////////////////////////////////////////////////////////////////////////////////console.log(nodesClassesCorrespondence[d.class])
         return vis.colorScale(nodesClassesCorrespondence[d.class]);
        }
        
      })
      .on('mouseover', function(d){
        vis.tip.show(d,this);
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
      })
      .on('clickout', function(d){
        ////////////////////////////////////////////////////////////////////////console.log("clickout");
      })
      .on("click",function(d){
        var element=this
        clearTimeout(vis.clickTimeout);
        vis.clickTimeout = setTimeout(function () {
          if(!vis.isDblclick) {
            // here goes your click codes
            if(!d.comment){
              if (element.getAttribute("stroke-width")=="1px"){
                clickBubble(element,vis.data)
              }else{
                unclickBubble()
              }
            }else{
              modelClick(element,vis.data)
            }
          }
        }, vis.timeoutTiming);
  
      })
      .on('dblclick', function(d){
        //d3.event.stopPropagation(); 
        //////////////////////////////////////////////////////////////////////////console.log("pasa por aquí")
        d3.event.preventDefault();
        vis.isDblclick = true;
        clearTimeout(vis.dblclickTimeout);
        vis.dblclickTimeout = setTimeout(function () {
          vis.isDblclick = false;
        }, vis.timeoutTiming);
        vis.wrangleData(this,"bubble");
        return false;
      })
      .on('contextmenu', (d) => {
        d3.event.preventDefault();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        vis.menuItems=getMenuItemsContextMenu(d,"bubble")
        createContextMenu(d, vis.menuItems, 100, 100, vis.g);
      })
      .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

  vis.nodeCircleImage=vis.nodeCircle.append("svg:image")
      .attr("class", "nodeCircleImage")
      .attr("id",function(d){
        return (d.id+"_image")
      })
      .attr("xlink:href", function(d){
        return bubbleImage(d);
      })
      .attr("x",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
      .attr("y",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
      .attr("width",function(d){return (vis.sizeNode(d.number)*1.5)+"px"})
      .attr("height",function(d){return (vis.sizeNode(d.number)*1.5)+"px"})
      .on('dblclick', function(d){
        //////////////////////////////////////////////////////////////////////////console.log(d3.event)
        //d3.event.stopPropagation(); 
        d3.event.preventDefault();
        vis.isDblclick = true;
        clearTimeout(vis.dblclickTimeout);
        vis.dblclickTimeout = setTimeout(function () {
          vis.isDblclick = false;
        }, vis.timeoutTiming);
        vis.wrangleData(this,"bubble");
        return false;
      })
      .on('mouseover', function(d){
        vis.tip.show(d,this);
        d3.select("#"+(this.getAttribute("id").replace("_image","")))
        .transition()
        .attr("r", function(d) { 
          r=vis.sizeNode(d.number)*2
          return r;
        })

        d3.select("#"+this.getAttribute("id"))
        .transition()
        .attr("x",function(d){return "-"+(r-5)+"px"})
        .attr("y",function(d){return "-"+(r-5)+"px"})
        .attr("height", function(d) { 
          return (vis.sizeNode(d.number)*1.5*2)+"px";
        })
        .attr("width", function(d) { 
          return (vis.sizeNode(d.number)*1.5*2)+"px";
        })
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
        d3.select("#"+(this.getAttribute("id").replace("_image","")))
        .transition()
        .attr("r", function(d) { 
          ////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.sizeNode.domain())
          ////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.sizeNode.range())
          ////////////////////////////////////////////////////////////////////////////////////////////////console.log( vis.sizeNode(d.number))
          return vis.sizeNode(d.number);})
        d3.select("#"+this.getAttribute("id"))
        .transition()
        .attr("x",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("y",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("width", function(d) { 
          return (vis.sizeNode(d.number)*1.5)+"px";
        })
        .attr("height", function(d) { 
          return (vis.sizeNode(d.number)*1.5)+"px";
        })
      })
      .on("click",function(d){
        var element=this
        clearTimeout(vis.clickTimeout);
        vis.clickTimeout = setTimeout(function () {
          if(!vis.isDblclick) {
            element=document.getElementById(element.getAttribute("id").replace("_image",""));
            if (element.getAttribute("stroke-width")=="1px"){
              clickBubble(element,vis.data)
            }else{
              unclickBubble()
            }
          }
        }, vis.timeoutTiming);
  
      })
      .on('contextmenu', (d) => {
        d3.event.preventDefault();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.menuItems)
        //createContextMenu(d, vis.menuItems, 100, 100, vis.g);
      })

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
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(menuItems)
      vis.menuFactory(d3.event.pageX-200, d3.event.pageY-200 , menuItems, d,"contextMenu");
      d3.event.preventDefault();
    }
  ////////////////////////////////////////////////////console.log(vis.treeData)
  vis.allData=allData()
  ////////////////////////////////////////////////////console.log(vis.allData)
  function allData(){
    var data=[]
    vis.treeData.forEach(function(d){
      //////////////////////////////////////////////////////console.log(d)
      if(!data.includes(d)){
        data.push(d)
      }
      if(d.children){
        d.children.forEach(function(v){
          ////////////////////////////////////////////////////console.log(v)
          if(!data.includes(v)){
            data.push(v)
          }
        })
      }
    })
    ////////////////////////////////////////////////////console.log(data)
    return data;
  }
}
NetworkGraph.prototype.enterFreeGraph = function(){
  var vis=this,r;
  ////////////////console.log("enterFreeGraph 1")
  //vis.colorScale.range(vis.colors.slice(0,nodesClassesShow.length))

  //colorScale=vis.colorScale
  
  vis.isDblclick = false;

  vis.timeoutTiming = 500;

  ////////console.log(vis.link)
  ////////console.log(vis.nodeCircle)

  vis.link=vis.link.enter()
  .append("line")
  .attr("class", "link")
  .attr("id",function(d){
    return d["source"]["id"]+d["target"]["id"]
  })
  .attr("value",d=>d["type"])
  .attr("stroke", "steelblue")
  .attr('marker-end','url(#arrowhead)') 
  .on('mouseover', function(d){
    //////////////////console.log(d)
    vis.tip.show(d,this);
  })
  .on('mouseout', function(d){
    vis.tip.hide(d,this);
  });

  vis.edgepaths = vis.edgepaths
        .enter()
        .append('path')
        .attr('class', 'edgepath')
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('id', function (d, i) {
          //////////////////console.log(i)
          return 'edgepath' + i})
        .attr('link_id',function(d){
          return d["source"]["id"]+d["target"]["id"]
        })
        .style("pointer-events", "none");

  //////console.log(vis.edgelabels)
  vis.edgelabels = vis.edgelabels
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr('class', 'edgelabel')
        .attr('id', function (d, i) {return 'edgelabel' + i})
        .attr('link_id',function(d){
          return d["source"]["id"]+d["target"]["id"]
        })
        .attr('link_value',function(d){
          //////console.log(d.value)
          return d["value"]
        })
        .attr('font-size', 14)
        .attr('fill', '#aaa');
  
  vis.edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
        .attr('xlink:href', function (d, i) {return '#edgepath' + i})
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text(function(d){
          //////console.log(d)
          return d.value
        });
        
                //.text(d => d.type);
/*   vis.link=vis.link
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
      });  */

  
      ////////////////console.log("enterFreeGraph 2")
      ////////////console.log(vis.nodeCircle)

    vis.nodeCircle=vis.nodeCircle
      .enter().append("g")
      .attr("class", "nodeCircle")
      .attr("id",function(d){
        //////////////////////////////////console.log(d)
        return (d.id+"_g")
      })

    vis.nodeCircleCircle=vis.nodeCircle
      .append("circle")
      .attr("class",function(d){
        //////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        return d.class + " nodeCircleCircle"
      }) 
      .attr("r", function(d){
        ////console.log(d)
        //console.log(d.more_results)
        if((d.more_results!="")&(d.more_results!=undefined)){
          return 50;
        }else{
          return 17;
        }
      })
      .attr("id",d=>d.id)
      //.attr("r", d=> 17)//+ d.runtime/20 )
      .attr("stroke-width", "1px")
      .style("stroke", function(d){
        if((d.more_results!="")&(d.more_results!=undefined)){
          return "purple";
        }else{
          return "gray";
        }
      })
      .style("stroke-opacity",1)
      .style("stroke-width", function(d){
        if((d.more_results!="")&(d.more_results!=undefined)){
          return 5;
        }else{
          return 1;
        }
      })
      .style("fill", function (d){
        if(d.type=="uri"){
          return "#6EE7B7";
        }else if(d.type=="bnode"){
          return "#FCD34D";
        }else{
          return "#F9A8D4";
        }
      })
      //.style("fill", d => colorScale(d.group))
      .on('mouseover', function(d){
        //////////////////console.log(d)
        vis.tip.show(d,this);
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
      })
      .on('clickout', function(d){
        ////////////////////////////////////////////////////////////////////////console.log("clickout");
      })
      .on("click",function(d){
        var element=this
        clearTimeout(vis.clickTimeout);
        vis.clickTimeout = setTimeout(function () {
          if(!vis.isDblclick) {
            // here goes your click codes
            //if(!d.comment){
            if (element.getAttribute("stroke-width")=="1px"){
              console.log(element)
              clickBubbleFreeGraph(element,vis.data)
            }else{
              //unclickBubbleFreeGraph()
            }
            //}else{
            //  modelClick(element,vis.data)
            //}
          }
        }, vis.timeoutTiming);
      })
      .on('dblclick', function(d){
        //d3.event.stopPropagation(); 
        ////////////console.log(d)
/*         d3.event.preventDefault();
        vis.isDblclick = true;
        clearTimeout(vis.dblclickTimeout);
        vis.dblclickTimeout = setTimeout(function () {
          vis.isDblclick = false;
        }, vis.timeoutTiming);
        vis.wrangleData(this,"bubble");
        return false; */
        if((d.type=="uri")|(d.type=="bnode")){
          d3.event.preventDefault();
          vis.isDblclick = true;
          clearTimeout(vis.dblclickTimeout);
          vis.dblclickTimeout = setTimeout(function () {
            vis.isDblclick = false;
          }, vis.timeoutTiming);
          vis.wrangleDataFreeGraph(this,"bubble");
          return false;
        }
      })
      .on('contextmenu', (d) => {
        d3.event.preventDefault();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        vis.menuItems=getMenuItemsContextMenu(d,"bubble")
        createContextMenu(d, vis.menuItems, 100, 100, vis.g);
      })
      .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
  ////////////////console.log("enterFreeGraph 3")
/* 
  vis.nodeCircleImage=vis.nodeCircle.append("svg:image")
      .attr("class", "nodeCircleImage")
      .attr("id",function(d){
        return (d.id+"_image")
      })
      .attr("xlink:href", function(d){
        return bubbleImage(d);
      })
      .attr("x",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
      .attr("y",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
      .attr("width",function(d){return (vis.sizeNode(d.number)*1.5)+"px"})
      .attr("height",function(d){return (vis.sizeNode(d.number)*1.5)+"px"})
      .on('dblclick', function(d){
        //////////////////////////////////////////////////////////////////////////console.log(d3.event)
        //d3.event.stopPropagation(); 
        d3.event.preventDefault();
        vis.isDblclick = true;
        clearTimeout(vis.dblclickTimeout);
        vis.dblclickTimeout = setTimeout(function () {
          vis.isDblclick = false;
        }, vis.timeoutTiming);
        vis.wrangleData(this,"bubble");
        return false;
      })
      .on('mouseover', function(d){
        vis.tip.show(d,this);
        d3.select("#"+(this.getAttribute("id").replace("_image","")))
        .transition()
        .attr("r", function(d) { 
          r=vis.sizeNode(d.number)*2
          return r;
        })

        d3.select("#"+this.getAttribute("id"))
        .transition()
        .attr("x",function(d){return "-"+(r-5)+"px"})
        .attr("y",function(d){return "-"+(r-5)+"px"})
        .attr("height", function(d) { 
          return (vis.sizeNode(d.number)*1.5*2)+"px";
        })
        .attr("width", function(d) { 
          return (vis.sizeNode(d.number)*1.5*2)+"px";
        })
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
        d3.select("#"+(this.getAttribute("id").replace("_image","")))
        .transition()
        .attr("r", function(d) { 
          ////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.sizeNode.domain())
          ////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.sizeNode.range())
          ////////////////////////////////////////////////////////////////////////////////////////////////console.log( vis.sizeNode(d.number))
          return vis.sizeNode(d.number);})
        d3.select("#"+this.getAttribute("id"))
        .transition()
        .attr("x",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("y",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("width", function(d) { 
          return (vis.sizeNode(d.number)*1.5)+"px";
        })
        .attr("height", function(d) { 
          return (vis.sizeNode(d.number)*1.5)+"px";
        })
      })
      .on("click",function(d){
        var element=this
        clearTimeout(vis.clickTimeout);
        vis.clickTimeout = setTimeout(function () {
          if(!vis.isDblclick) {
            element=document.getElementById(element.getAttribute("id").replace("_image",""));
            if (element.getAttribute("stroke-width")=="1px"){
              clickBubble(element,vis.data)
            }else{
              unclickBubble()
            }
          }
        }, vis.timeoutTiming);
  
      })
      .on('contextmenu', (d) => {
        d3.event.preventDefault();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.menuItems)
        //createContextMenu(d, vis.menuItems, 100, 100, vis.g);
      }) */

    function color(d) {
      return d._children ? "#e86935" : "#f5aa41";
    }
    //////////// UI EVENTS ////////////
  
    function dragstarted(d) {
      ////////////////////console.log(d)
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
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(menuItems)
      vis.menuFactory(d3.event.pageX-200, d3.event.pageY-200 , menuItems, d,"contextMenu");
      d3.event.preventDefault();
    }
    ////////////////console.log("enterFreeGraph 4")
}
NetworkGraph.prototype.menuFactory = function(x, y, menuItems, data,origin,width){

  var vis=this
  ////console.log(data)
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(x)
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(y)
  //////////////////////////////////////////////////////////////////////////////////console.log(menuItems)
  d3.select(".contextMenu").remove();
  // Draw the menu
  vis.g
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
        return y + (i * 30); })
      .attr('rx', 2)
      .attr('width', width)
      .attr('height', 30)
      .on('click', (d) => { 
        ////console.log(d)
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(origin)
        if (origin=="contextMenu"){
          d.action(data,d)
        }else{
          d.action(data,d)
        }
      });

  d3.selectAll(".menuEntry")
      .append('text')
      .text((d) => { 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d)
        return d.title; })
      .attr('x', x)
      .attr('y', (d, i) => { return y + (i * 30); })
      .attr('dy', 20)
      .attr('dx', 25)
      .on('click', (d) => { 
        ////////////////////////////////////////////////////////////////////////////////console.log(d)
        ////////////////////////////////////////////////////////////////////////////////console.log(data)
        ////console.log(data)
        ////console.log(d)
        d.action(data,d) });

  // Other interactions
  d3.select('body')
      .on('click', () => {
          d3.select(".contextMenu").remove();
      });
}
NetworkGraph.prototype.exitGraph = function(){
    var vis=this;
    //////////////console.log(vis.link)
    vis.link.exit().remove();
    ////////////console.log(vis.nodeCircle)
    vis.nodeCircle.exit().remove();
    if(vis.graphType=="freeGraph"){
      vis.edgepaths.exit().remove();
    }
}

NetworkGraph.prototype.wrangleData = async function (node,origin) {
  var vis = this;
  var children,pageX,pageY,founded,indexRows=1
  ////////////////console.log("entra en wrangle data")
  //////////////////////////console.log(classesFilterList)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log("wrangleData")
  ////////////////////////////////////////////////////////////////////////console.log(node)
  ////////////////////////////////////////////////////////////////////////console.log(origin)
  //Node always exist because we call wrangleData when clicking a bubble or clicking the table with the labels
  //Look for the data from the element by looking at the data in the treeData
  //If it exists there will be children for the node
  founded=findNodeTreemap(node.getAttribute("id").replace("_image",""),vis.treeData)
  ////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData)
  ////////////////////////////////////////////////////////////////////////////////console.log(node.getAttribute("id"))
  ////////////////////////////console.log(founded)
  if (origin=="table"){
    pageX=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["x"]
    pageY=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["y"]
  }else{
    pageX=d3.event.pageX
    pageY=d3.event.pageY
  }
  ////console.log(pageX)
  ////console.log(pageY)
  if(founded.length==0){
    ////////console.log("length 0")
    indexRows=await addGraph(d3.select("#"+(node.getAttribute("id").replace("_image",""))).data()[0],pageX,pageY,origin)
    vis.data=flatten(vis.treeData).flatData
    //////////////////////////////console.log(vis.data)
    ////////console.log(networkGraph.data)
    ////////console.log(networkGraph.treeData)
    vis.initializeSimulation();
    vis.dataJoinGraph()
    ////////////console.log("9")
    vis.exitGraph()
    
  }else{
    ////////////////////////////////console.log("children")

    if (founded[0]["children"]){
       if (node.getAttribute("root")=="1"){
          children=founded[0]["children"]
          children.forEach(function(d){
            vis.collapseBranch(d)
          })
        }else{
          vis.collapseBranch(founded[0])
        }
        vis.data=flatten(vis.treeData).flatData
        vis.initializeSimulation();
        vis.dataJoinGraph()
        ////////////console.log("4")
        vis.exitGraph()
  
      }else{
        if (node.getAttribute("root")=="1"){
          children=founded[0]["children"]
          children.forEach(function(d){
            vis.expandLevelBranch(d)
          })
        }else{
          vis.expandLevelBranch(founded[0])
        }
        
      vis.data=flatten(vis.treeData).flatData
      vis.initializeSimulation();
      vis.dataJoinGraph()
      vis.enterGraph()
      
      vis.initializeSimulation();
      vis.dataJoinGraph()
      ////////////console.log("5")
      vis.exitGraph()

    }
    
  }
  //////////////////////////////console.log(indexRows)
  ////////////////////////////////////////////////////console.log(vis.treeData)
  return indexRows
};

NetworkGraph.prototype.wrangleDataFreeGraph = async function (node,origin) {
  var vis = this;
  var children,pageX,pageY,founded,resultRows
  //founded=findNodeTreemap(node.getAttribute("id").replace("_image",""),vis.treeData)
  ////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData)
  ////////////////////////////////////////////////////////////////////////////////console.log(node.getAttribute("id"))
  ////////////////////////////console.log(founded)
  ////console.log(node)
  if (origin=="table"){
    ////console.log(node)
    pageX=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["x"]
    pageY=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["y"]
  }else{
    pageX=d3.event.pageX
    pageY=d3.event.pageY
  }

  ////console.log(pageX)
  ////console.log(pageY)
  ////console.log(origin)
  ////console.log(node)

  //subjectObject.forEach(function (s){
  resultRows=await checkQueries(node,undefined,origin,pageX,pageY)
  ////console.log(resultRows)
  /* resultRows=await checkAskResultsFreeGraph(node,undefined)
  ////console.log(resultRows) */
  //})
  ////console.log(resultRows)
  //indexRows=await addFreeGraph(d3.select("#"+(node.getAttribute("id").replace("_image",""))).data()[0],pageX,pageY,origin)

  ////////console.log(networkGraph.data)
  ////////console.log(networkGraph.treeData)
  //vis.data=flatten(vis.treeData).flatData
  /* vis.initializeSimulation();
  vis.dataJoinFreeGraph()
  vis.enterFreeGraph()
  vis.initializeSimulation();
  vis.dataJoinFreeGraph()
  vis.exitGraph() */
  //////////////////////////////console.log(indexRows)
  ////////////////////////////////////////////////////console.log(vis.treeData)
  //return indexRows
  return resultRows
};

NetworkGraph.prototype.collapseAll = function () {
  var vis = this;
  var children;
  //////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.selectAll('[root="1"]'))
  //////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData)
  //children=d3.select('[root="1"]').data()[0]["children"]
  //////////////////////////////////////////////////////////////////////////////////////////////////console.log(children)
  //////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data.nodes[0]["children"])
  children=vis.data.nodes[0]["children"]
  children.forEach(function(d){
      vis.collapseBranch(d)
  })
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  ////////////console.log("7")
  vis.exitGraph()

  //d3.select("#"+node.getAttribute("id")).style("fill",nodeColor.darker(0.8))
}


NetworkGraph.prototype.expandAll = function () {
  var vis = this;
  var children;
 
  //children=d3.select('[root="1"]').data()[0]["children"]
  children=vis.data.nodes[0]["children"]
  children.forEach(function(d){
      vis.expandBranch(d)
  })
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  ////////////////console.log("entra en expandAll")
  if(vis.graphType=="freeGraph"){
    ////////////////console.log("6")
    vis.enterFreeGraph()
  }else{
    vis.enterGraph()
  }
  vis.initializeSimulation();
  vis.dataJoinGraph()
  ////////////console.log("8")
  vis.exitGraph()

  //d3.select("#"+node.getAttribute("id")).style("fill",nodeColor.brighter(0.8))
}
NetworkGraph.prototype.collapseBranch = function (node){
  var vis = this;
  var nodes=[]
  nodes.push(node.id)
  collapse(node)
  for (let i = 0; i < vis.treeData.length; i++) {

    if (nodes.includes(vis.treeData[i]["id"])){
      vis.treeData[i]._children = vis.treeData[i].children;
      delete vis.treeData[i].children;
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData[i]["id"])
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node.id)
      if(vis.treeData[i]["id"]!=node.id){
        vis.treeData[i]["hidden"]=true
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData[i])
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
  for (let i = 0; i < vis.treeData.length; i++) {
    if(node.id==vis.treeData[i]["id"]){
      vis.treeData[i].children = vis.treeData[i]._children;
      delete vis.treeData[i]._children;
    }
    if (nodes.includes(vis.treeData[i]["id"])){
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
      })
    }
  }
}
