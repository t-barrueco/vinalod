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

  if(vis.data.treeData){
    vis.treeData=vis.data.treeData
    vis.data=vis.data.flatData
  }

  //////console.log(vis.data)
  vis.width = +d3.select(this.parentElement).node().getBoundingClientRect().width;
  vis.height = +d3.select(this.parentElement).node().getBoundingClientRect().height;

  vis.svg = d3.select(this.parentElement).append("svg")
  .attr("width", vis.width)
  .attr("height", vis.height)

  vis.rect=vis.svg.append("rect")
    .attr('class', 'zoom')
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", vis.width)
    .attr("height", vis.height)
    //.call(zoom).on("dblclick.zoom", null)
    .call(d3.zoom()
        //.scaleExtent([-2, 8])
        .on("zoom", zoom))
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

    vis.colorScale = d3.scaleOrdinal()
    .domain(nodesClassesShow)
    .range(d3.schemeCategory20)
    colorScale=vis.colorScale

    vis.legend = vis.g.append("g")
        .attr("class","legendOrdinal")
        .attr("transform", "translate(20,50)")

    vis.legendOrdinal = d3.legendColor()
    //.shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
    .shapePadding(150)
    .shapeWidth(60)
    .orient('horizontal')
    .scale(vis.colorScale);

    vis.legend
    .call(vis.legendOrdinal);
  }
  
  

  vis.simulation = d3.forceSimulation();

  ////////////////////////////////////////////////////////////////////console.log(vis.forces.center.y)
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.maxSizeNode=d3.max(vis.data.nodes, d => d.number)  
    vis.sizeNode = d3.scaleLinear()
    .domain([0,vis.maxSizeNode])  // What's in the data
    .range([ 15, 25])  // Size in pixel
    //.range([ 10, 30])  // Size in pixel
 
  vis.initializeSimulation();
  vis.initializeDisplay();
  function zoom() {
    vis.g.attr("transform", d3.event.transform);
  }
};
NetworkGraph.prototype.zoomIn = function () {
  var vis = this;
/*     function zoom() {
      vis.g.attr("transform", d3.event.transform);
    } */
    var zoom = d3.zoom()
                .on('zoom', function() {
                  vis.g.attr("transform", d3.event.transform);
            });
    //console.log(d3.select('rect.zoom'))
    zoom.scaleBy(vis.g.transition().duration(750), 1.3);
    //d3.select('rect.zoom').call(zoom.scaleBy, 2)
}
NetworkGraph.prototype.zoomOut = function () {
  var vis = this;
/*     function zoom() {
      vis.g.attr("transform", d3.event.transform);
    } */
    var zoom = d3.zoom()
                .on('zoom', function() {
                  vis.g.attr("transform", d3.event.transform);
            });
    //console.log(d3.select('rect.zoom'))
    zoom.scaleBy(vis.g.transition().duration(750), 1 / 1.3);
    //d3.select('rect.zoom').call(zoom.scaleBy, 2)
}
// set up the simulation and event to update locations after each tick
NetworkGraph.prototype.initializeSimulation = function () {
  var vis = this;

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


  vis.simulation.on("tick", ticked);

  vis.updateForces();

  function ticked() {
    vis.link
        .attr("x1", function(d) { 
            return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

   vis.nodeCircle
        .attr("transform", function(d) { 

          return "translate(" + d.x + "," + d.y + ")"; })

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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-25,0])
  .html(function (d) {
      ////////////console.log(d)
      var text = `
      <table class="tiptable" style="margin-left: 2.5px">
          <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Name:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.value + `</span></td></tr>
          <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Class:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + nodesClassesCorrespondence[d.class] + `</span></td></tr>
          <tr><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#000000">Degree:</td><td style="text-align:left;vertical-align:top;word-wrap: break-word;color:#1f77b4">` + d.number + `</span></td></tr>
      </table>`;
    
    return text;
  });
  
  vis.g.call(vis.tip);

  vis.dataJoinGraph()
  vis.exitGraph()
  vis.enterGraph()
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
NetworkGraph.prototype.enterGraph = function(){
  var vis=this,r;
  vis.menuItems = [
    {
      title: 'Download data',
      action: (d) => {
        // TODO: add any action you want to perform
        downloadData(d)
      }
    },
    {
      title: 'Download SPARQL query',
      action: (d) => {
        // TODO: add any action you want to perform
        downloadQuery()
      }
    },
    {
      title: 'Show timeline',
      action: (d) => {
        // TODO: add any action you want to perform
        showTimeLine(d)
      }
    },
    {
      title: 'Show Wikipedia page',
      action: (d) => {
        // TODO: add any action you want to perform
        showWikipediaPage(d)
      }
    }

    
  ];

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

  vis.nodeCircle=vis.nodeCircle
  .enter().append("g")
  .attr("class", "nodeCircle")
  .attr("id",function(d){
    return (d.id+"_g")
  })

  vis.nodeCircleCircle=vis.nodeCircle
      .append("circle")
      .attr("class", "nodeCircleCircle")
      .attr("origId",function(d){
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
         return vis.colorScale(nodesClassesCorrespondence[d.class]);
        }
        
      })
      .on('mouseover', function(d){
        vis.tip.show(d,this);
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
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
        vis.isDblclick = true;
        clearTimeout(vis.dblclickTimeout);
        vis.dblclickTimeout = setTimeout(function () {
          vis.isDblclick = false;
        }, vis.timeoutTiming);
        vis.wrangleData(this,"bubble");
  
      })
      .on('contextmenu', (d) => {
        d3.event.preventDefault();
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
        vis.isDblclick = true;
        clearTimeout(vis.dblclickTimeout);
        vis.dblclickTimeout = setTimeout(function () {
          vis.isDblclick = false;
        }, vis.timeoutTiming);
        vis.wrangleData(this,"bubble");
  
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
        .attr("r", function(d) { return vis.sizeNode(d.number);})
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
        createContextMenu(d, vis.menuItems, 100, 100, vis.g);
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
      vis.menuFactory(d3.event.pageX, d3.event.pageY-200 , menuItems, d,"contextMenu");
      d3.event.preventDefault();
    }
    
}
NetworkGraph.prototype.menuFactory = function(x, y, menuItems, data,origin){

  var vis=this
  ////////////console.log(x)
  ////////////console.log(y)
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
      .attr('width', 250)
      .attr('height', 30)
      .on('click', (d) => { 
        if (origin=="contextMenu"){
          d.action(data)
        }else{
          d.action(d)
        }
      });

  d3.selectAll(".menuEntry")
      .append('text')
      .text((d) => { 
        return d.title; })
      .attr('x', x)
      .attr('y', (d, i) => { return y + (i * 30); })
      .attr('dy', 20)
      .attr('dx', 25)
      .on('click', (d) => { 
        d.action(data) });

  // Other interactions
  d3.select('body')
      .on('click', () => {
          d3.select(".contextMenu").remove();
      });
}
NetworkGraph.prototype.exitGraph = function(){
    var vis=this;
    vis.link.exit().remove();
    vis.nodeCircle.exit().remove();
}

NetworkGraph.prototype.wrangleData = async function (node,origin) {
  var vis = this;
  var children,pageX,pageY
  console.log(node)
  console.log(d3.select("#"+node.getAttribute("id").replace("_image","")).data())
  console.log(d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["x"])
  console.log(d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["y"])
  if (origin=="table"){
    console.log(d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["x"])
    console.log(d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["y"])

    pageX=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["x"]
    pageY=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["y"]+200
  }else{
    pageX=d3.event.pageX
    pageY=d3.event.pageY
  }
  if((d3.select("#"+node.getAttribute("id")).data()[0]["children"]==undefined)&&(d3.select("#"+node.getAttribute("id")).data()[0]["_children"]==undefined)){
    await addGraph(d3.select("#"+node.getAttribute("id")).data()[0],pageX,pageY)
    ////////console.log(vis.treeData)
    vis.data=flatten(vis.treeData).flatData
    vis.initializeSimulation();
    vis.dataJoinGraph()
    vis.exitGraph()
    
  }else{

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
  
      }else{
        if (node.getAttribute("root")=="1"){
          children=d3.select("#"+node.getAttribute("id")).data()[0]["children"]
          children.forEach(function(d){
            vis.expandLevelBranch(d)
          })
        }else{
          vis.expandLevelBranch(d3.select("#"+node.getAttribute("id")).data()[0])
        }
        
        vis.data=flatten(vis.treeData).flatData
        vis.initializeSimulation();
        vis.dataJoinGraph()
        vis.enterGraph()
        vis.initializeSimulation();
        vis.dataJoinGraph()
        vis.exitGraph()

    }
  }
  
  ////console.log(vis.data)
};

NetworkGraph.prototype.collapseAll = function () {
  var vis = this;
  var children;

  children=d3.select('[root="1"]').data()[0]["children"]

  children.forEach(function(d){
      vis.collapseBranch(d)
  })
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

  //d3.select("#"+node.getAttribute("id")).style("fill",nodeColor.darker(0.8))
}


NetworkGraph.prototype.expandAll = function () {
  var vis = this;
  var children;
 
  children=d3.select('[root="1"]').data()[0]["children"]

  children.forEach(function(d){
      vis.expandBranch(d)
  })
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.enterGraph()
  vis.initializeSimulation();
  vis.dataJoinGraph()
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
      if(vis.treeData[i]["id"]!=node.id){
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