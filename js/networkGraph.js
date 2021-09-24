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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
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

    ////////////////////////////////////////////////////////console.log("pasa por init")
    vis.colorScale = d3.scaleOrdinal()
    .domain(nodesClassesShow)
    //.range(d3.schemeCategory20)
    .range(vis.colors.slice(0,nodesClassesShow.length))
    ////////////////////////////////////////////////////////console.log(vis.colorScale.domain())
    ////////////////////////////////////////////////////////console.log(vis.colorScale.range())

    //////////////////////////////////////////////////////////console.log(nodesClassesShow.length)
    //////////////////////////////////////////////////////////console.log(vis.colors.slice(0,2))

    //////////////////////////////////////////////////////////console.log(vis.colors.slice(0,nodesClassesShow.length))
    //////////////////////////////////////////////////////////console.log(vis.colorScale.range())
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
  
  

  vis.simulation = d3.forceSimulation();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.forces.center.y)
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
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
    //////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.select('rect.zoom'))
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
                  //vis.g.attr("transform", "translate("+zoomX+","+zoomY+")"+d3.event.transform);
                  vis.g.attr("transform", d3.event.transform);
                  zoomScale=d3.event.transform.k;
                  zoomY=d3.event.transform.y
                  zoomX=d3.event.transform.x
            });
    //////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d3.select('rect.zoom'))
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-25,0])
  .html(function (d) {
      ////////////////////////////////////////////////////////////////////////////////////console.log(d)
      var text=getTooltipText(d)
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
  /* vis.menuItems = [
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

    
  ]; */
  vis.colorScale.range(vis.colors.slice(0,nodesClassesShow.length))

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

  vis.nodeCircle=vis.nodeCircle
  .enter().append("g")
  .attr("class", "nodeCircle")
  .attr("id",function(d){
    return (d.id+"_g")
  })

  
  vis.nodeCircleCircle=vis.nodeCircle
      .append("circle")
      .attr("class",function(d){
        ////////////////////////////////////////////////////////////console.log(d)
        return d.class + " nodeCircleCircle"
      }) 
      .attr("origId",function(d){
        ////////////////////////////////////////////////////////////console.log(d)
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
          ////////////////////////////////////////////////////////console.log(vis.colorScale.domain())
          ////////////////////////////////////////////////////////console.log(vis.colorScale.range())
          ////////////////////////////////////////////////////////console.log(nodesClassesCorrespondence[d.class])
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
        //////////////////////////////////////console.log("clickout");
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
        ////////////////////////////////////////console.log("pasa por aquí")
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
        //////////////////////////////////////////////////////////////////////////console.log(d)
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
        ////////////////////////////////////////console.log(d3.event)
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
          //////////////////////////////////////////////////////////////console.log(vis.sizeNode.domain())
          //////////////////////////////////////////////////////////////console.log(vis.sizeNode.range())
          //////////////////////////////////////////////////////////////console.log( vis.sizeNode(d.number))
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
        //////////////////////////////////////////////////////////////////////////console.log(d)
        getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        ////////////////////////////////////////////////////////////////////////////console.log(vis.menuItems)
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
      //////////////////////////////////////////////////////////////////////////console.log(menuItems)
      vis.menuFactory(d3.event.pageX-200, d3.event.pageY-200 , menuItems, d,"contextMenu");
      d3.event.preventDefault();
    }
  //////////////////console.log(vis.treeData)
  vis.allData=allData()
  //////////////////console.log(vis.allData)
  function allData(){
    var data=[]
    vis.treeData.forEach(function(d){
      ////////////////////console.log(d)
      if(!data.includes(d)){
        data.push(d)
      }
      if(d.children){
        d.children.forEach(function(v){
          //////////////////console.log(v)
          if(!data.includes(v)){
            data.push(v)
          }
        })
      }
    })
    //////////////////console.log(data)
    return data;
  }
}
NetworkGraph.prototype.menuFactory = function(x, y, menuItems, data,origin){

  var vis=this
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(x)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////console.log(y)
  ////////////////////////////////////////////////console.log(menuItems)
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
        //////////////////////////////////////////////////////////////////////////console.log(d)
        //////////////////////////////////////////////////////////////////////////console.log(origin)
        if (origin=="contextMenu"){
          d.action(data,d)
        }else{
          d.action(d)
        }
      });

  d3.selectAll(".menuEntry")
      .append('text')
      .text((d) => { 
        //////////////////////////////////////////////////////////////////////////console.log(d)
        return d.title; })
      .attr('x', x)
      .attr('y', (d, i) => { return y + (i * 30); })
      .attr('dy', 20)
      .attr('dx', 25)
      .on('click', (d) => { 
        //////////////////////////////////////////////console.log(d)
        //////////////////////////////////////////////console.log(data)

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
  var children,pageX,pageY,founded,indexRows=1
  //////////////////////////////////////////////////////////////////////////////console.log("wrangleData")
  //////////////////////////////////////console.log(node)
  //////////////////////////////////////console.log(origin)
  //Node always exist because we call wrangleData when clicking a bubble or clicking the table with the labels
  //Look for the data from the element by looking at the data in the treeData
  //If it exists there will be children for the node
  founded=findNodeTreemap(node.getAttribute("id").replace("_image",""),vis.treeData)
  //////////////////////////////////////////////console.log(vis.treeData)
  //////////////////////////////////////////////console.log(node.getAttribute("id"))
  //////////////////////////////////////console.log(founded)
  if (origin=="table"){
    pageX=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["x"]
    pageY=d3.select("#"+node.getAttribute("id").replace("_image","")).data()[0]["y"]
  }else{
    pageX=d3.event.pageX
    pageY=d3.event.pageY
  }
  if(founded.length==0){
    ////////////////////////////////////////console.log("length 0")
    indexRows=await addGraph(d3.select("#"+(node.getAttribute("id").replace("_image",""))).data()[0],pageX,pageY,origin)
    vis.data=flatten(vis.treeData).flatData
    vis.initializeSimulation();
    vis.dataJoinGraph()
    vis.exitGraph()
    
  }else{
    ////////////////////////////////////////console.log("children")

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
        vis.exitGraph()

    }
    
  }
  //////////////////console.log(vis.treeData)
  return indexRows
};

NetworkGraph.prototype.collapseAll = function () {
  var vis = this;
  var children;
  ////////////////////////////////////////////////////////////////console.log(d3.selectAll('[root="1"]'))
  ////////////////////////////////////////////////////////////////console.log(vis.treeData)
  //children=d3.select('[root="1"]').data()[0]["children"]
  ////////////////////////////////////////////////////////////////console.log(children)
  ////////////////////////////////////////////////////////////////console.log(vis.data.nodes[0]["children"])
  children=vis.data.nodes[0]["children"]
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
 
  //children=d3.select('[root="1"]').data()[0]["children"]
  children=vis.data.nodes[0]["children"]
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
      ////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData[i]["id"])
      ////////////////////////////////////////////////////////////////////////////////////////////////////console.log(node.id)
      if(vis.treeData[i]["id"]!=node.id){
        vis.treeData[i]["hidden"]=true
        ////////////////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData[i])
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
NetworkGraph.prototype.applyFilterCopy = function (values,property,typeComp,multiple){
  var vis = this;
  //var treeData=[]
  //typeComp == "equal","greater","lower"
  //multiple == true or false
  //////////////////////////////////////////console.log(values)
  //////////////////////////////////////////console.log(property)
  //////////////////////////////////////////console.log(vis.treeData)
  vis.treeData.forEach(function(d){
    //////////////////////////////////////////console.log(d)
    if(d[property]!=undefined){
      if(values.includes("All")){
        if(d["hidden"]){
          delete d.hidden
        }
      }else if(!values.includes(d[property])){
          d["hidden"]=true
      }else{
          delete d.hidden
      }
    }
    if(d.children!=undefined){
      d.children.forEach(function(v){
        //////////////////////////////////////////console.log(v)
        if(d["hidden"]==true){
          v["hidden"]=true
        }else{
          if(v[property]!=undefined){
            //////////////////////////////////////////console.log(values)
            //////////////////////////////////////////console.log(v[property])
            if(values.includes("All")){
              if(v["hidden"]){
                //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
                delete v.hidden
              }
            }else if(!values.includes(v[property])){
                //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
                v["hidden"]=true
            }else{
                delete v.hidden
            }
          }else{
            if(v["hidden"]){
              //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
              delete v.hidden
            }
          }
        }
        
      })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d[property])
    
  })
  ////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData)
  vis.data=flatten(vis.treeData).flatData
  ////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.enterGraph()
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()
}
NetworkGraph.prototype.applyFilter = function (values,property,typeComp,typeField,multiple){
  var vis = this;
  //var treeData=[]
  //typeComp == "==",">","<"
  //multiple == true or false
  //////////////////////////////////////////console.log(values)
  //////////////////////////////////////////console.log(property)
  //////////////////////////////////////////console.log(vis.treeData)
  //////////////////////////////////////////console.log(typeField)
  vis.treeData.forEach(function(d){
    //////////////////////////////////////////console.log(d)
    if(d[property]!=undefined){
      if(typeField=="date"){
        if (typeComp=="<>"){
          values=[document.getElementById(property+"_start").value,document.getElementById(property+"_end").value]
          if(eval("new Date('"+values[0]+"') < new Date('"+d[property]+"')") & eval("new Date('"+values[1]+"') > new Date('"+d[property]+"')")){
            delete d.hidden
          }else{
            d["hidden"]=true 
          }
        }else{
          //////////////////////////////////////console.log(eval("new Date('"+values+"')"+typeComp+"new Date('"+d[property]+"')"))
          if(eval("new Date('"+values+"')"+typeComp+"new Date('"+d[property]+"')")){
            delete d.hidden
          }else{
            d["hidden"]=true 
          }
        }
      }else if(typeField=="dropdown"){
        if(values.includes("All")){
          if(d["hidden"]){
            delete d.hidden
          }
        }else if(!values.includes(d[property])){
            d["hidden"]=true
        }else{
            delete d.hidden
        }
      }else{
        if(values=="All"){
          if(d["hidden"]){
            delete d.hidden
          }
        }else if(eval(values+typeComp+d[property])){
          delete d.hidden
        }else{
          d["hidden"]=true 
        }
        ////////////////////////////////////////////console.log(eval("new Date("+values+")"+typeComp+"new Date("+d[property]+")"))
      }

      /* if(values.includes("All")){
        if(d["hidden"]){
          delete d.hidden
        }
      }else if(!values.includes(d[property])){
          d["hidden"]=true
      }else{
          delete d.hidden
      } */
    }
    if(d.children!=undefined){
      d.children.forEach(function(v){
        //////////////////////////////////////////console.log(v)
        //////////////////////////////////////////console.log(property)
        //////////////////////////////////////////console.log(d["hidden"])
        if(d["hidden"]==true){
          v["hidden"]=true
        }else{
          if(v[property]!=undefined){
            //////////////////////////////////////////console.log(v)
            if(typeField=="date"){
              ////////////////////////////////////////console.log("new Date('"+values+"')"+typeComp+"new Date('"+v[property]+"')")
              ////////////////////////////////////////console.log(eval("new Date('"+values+"')"+typeComp+"new Date('"+v[property]+"')"))
              if (typeComp=="<>"){
                values=[document.getElementById(property+"_start").value,document.getElementById(property+"_end").value]
                if(eval("new Date('"+values[0]+"') < new Date('"+v[property]+"')") & eval("new Date('"+values[1]+"') > new Date('"+v[property]+"')")){
                  delete v.hidden
                }else{
                  v["hidden"]=true 
                }
              }else{
                if(eval("new Date('"+values+"')"+typeComp+"new Date('"+v[property]+"')")){
                  delete v.hidden
                }else{
                  v["hidden"]=true 
                }
              }  
            }else if(typeField=="dropdown"){
              if(values.includes("All")){
                if(v["hidden"]){
                  //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
                  delete v.hidden
                }
              }else if(!values.includes(v[property])){
                  //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
                  v["hidden"]=true
              }else{
                  delete v.hidden
              }
            }else{
              //////////////////////////////////////////console.log(values)
              //////////////////////////////////////////console.log(v[property])
              ////////////////////////////////////////////console.log(eval(values+typeComp+v[property]))
              //////////////////////////////////////////console.log(values+typeComp+v[property])
              if(values=="All"){
                if(v["hidden"]){
                  //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
                  delete v.hidden
                }
              }else if(eval(values+typeComp+v[property])){
                  //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
                  delete v.hidden
              }else{
                v["hidden"]=true
              }
              
            }
          }else{
            if(v["hidden"]){
              //////////////////////////////////////////////////////////////////////////////////////////console.log(v)
              delete v.hidden
            }
          }
        }
        
      })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////console.log(d[property])
    
  })
  ////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData)
  vis.data=flatten(vis.treeData).flatData
  ////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.enterGraph()
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()
}

NetworkGraph.prototype.applyFilter2 = function (filters,classFilter,property){
  function filterText(f,node){
    var hidden=false;
    if (node[f.property].indexOf(f.values[0]) !== -1){
      hidden=true
    }else{
      hidden=false
    }
    return hidden
  }
  function filterNumber(f,node){
    var hidden=false;
    ////console.log("filter Number")
    ////console.log(f.values)
    if(f.values[0]==""){
      hidden=false;
    }else{
      if(f.operator=="<>"){
        if(eval(f.values[0] +"<"+ node[f.property]) & eval(f.values[1]+">"+node[f.property])){
            hidden=false
        }else{
            hidden=true
        }
      }else{
        ////console.log(f.values[0]+f.operator+node[f.property])
        if(eval(f.values[0]+f.operator+node[f.property])){
          hidden=false
        }else{
          hidden=true
        }
      }
    }

    return hidden
  }
  function filterDropdown(f,node){
    var hidden=false;
    //////////////////////////////console.log(node[f.property])
    //////////////////////////////console.log(f.values)
    ////////////////////////////////console.log(f.values.includes(node[f.property]))
    if(f.values.includes("All")){
      if(nodes["hidden"]){
        hidden=false
      }
    }else if(!f.values.includes(node[f.property])){
        hidden=true
    }else{
        hidden=false
    }
    //////////////////////////////console.log(hidden)
    return hidden
  }
  function filterDate(f,node){
    var hidden=false;
    ////console.log("filterDate")
    ////console.log(f.values[0])
    if(f.values[0]==""){
      ////console.log("hidden false")
      hidden=false
    }else{
      if(f.operator=="<>"){
        if(eval("new Date('"+f.values[0]+"') < new Date('"+node[f.property]+"')") & eval("new Date('"+f.values[1]+"') > new Date('"+node[f.property]+"')")){
          hidden=false;
        }else{
          hidden=true
        }
      }else{
        ////console.log("new Date('"+f.values[0]+"')"+f.operator+"new Date('"+node[f.property]+"')")
        //////////////////////////////////////console.log(eval("new Date('"+values+"')"+typeComp+"new Date('"+d[property]+"')"))
        if(eval("new Date('"+f.values[0]+"')"+f.operator+"new Date('"+node[f.property]+"')")){
          hidden==false
        }else{
          hidden=true 
        }
      }
    }
    return hidden
  }

  function check_filters(node,filters){
    var hidden=false,hiddenNodes=[];
    ////console.log(node)
    filters.forEach(function (f){
      //////console.log(f)
      //////////////console.log(node)
      //////////////console.log(filters)
      ////console.log(f)
      ////console.log(f.values[0])
      ////console.log(f.filter_type)
      if(f.class==node.class){
        if((f.values[0]!="")|(f.filter_type!="dropdown")){
        ////console.log("entra if")
        ////console.log(hiddenNodes.includes(node.id))
          if(!hiddenNodes.includes(node.id)){
          //if(f.class==node.class){
            //////////////////////////////////console.log(node)
            if(node[f.property]!=undefined){
              if(f.filter_type=="date"){
                hidden=filterDate(f,node)
              }else if(f.filter_type=="dropdown"){
                hidden=filterDropdown(f,node)
              }else if(f.filter_type=="number"){
                hidden=filterNumber(f,node)
              }else if(f.filter_type=="text"){
                hidden=filterText(f,node)
              }
              if(hidden){
                hiddenNodes.push(node.id)
              }
              //{"class":f.property.split("_")[0],"property":f.property,"filter_type":f.filter_type,"values":values,"operator":">"
              //hidden=false
            }
          }
        }
      }
      ////console.log(hidden)
      ////////////////////////console.log(hiddenNodes)
    })
    return hidden
  }
  function check_one_filter(node,filters,classFilter,property){
    var hidden=false;
    ////////////////////////////////console.log(node)
    ////////////////////////////////console.log(filters)
    ////////////////////////////////console.log(classFilter)
    ////////////////////////////////console.log(property)

    ////////////////////////////console.log(selectedFilter)
    ////////////////////////////console.log(node)
    if(selectedFilter.class==node.class){
      //////////////////////////////console.log(node[selectedFilter.property])
      if(node[selectedFilter.property]!=undefined){
        if(selectedFilter.filter_type=="date"){
          hidden=filterDate(selectedFilter,node)
        }else if(selectedFilter.filter_type=="dropdown"){
          hidden=filterDropdown(selectedFilter,node)
        }else if(selectedFilter.filter_type=="number"){
          hidden=filterNumber(selectedFilter,node)
        }else if(selectedFilter.filter_type=="text"){
          hidden=filterText(selectedFilter,node)
        }
      }
    }

    return hidden
  }
  function changeValuesFilters(){
    var nodes,values=[],changedValue;
    //////////////////console.log("changeValuesFilters")
    visibilityFilters(classFilter)
    filters.forEach(function (f){
      //////////////////console.log(f)
      values=[]
      if ((f.filter_type=="dropdown")|(f.filter_type=="number")){
        if((classFilter!=f.class)|(property!=f.property)){
          ////////////////////console.log(f.values[0])
          //if((f.parentFilter=="")|(f.values[0]="All")){
/*           if(f.parentFilter==""){
            nodes=vis.data["nodes"].filter(function(item) {
              return ((item.class == f.class)&(selectedFilter.values[0]==item[selectedFilter.property]))
            })
            ////////////////////console.log(nodes)
          }else{ */
            ////////////////////console.log(f)
            console.log(vis.allData)
            console.log(f.class)
            console.log(selectedFilter)
            nodes=vis.allData.filter(function(item) {
              console.log(item.class)
              //console.log(f.class)
              //console.log(selectedFilter.values[0])
              console.log(item[selectedFilter.property])
              return ((item.class == f.class)&(selectedFilter.values[0]==item[selectedFilter.property]))
            })
         // } 
          nodes.forEach(function(n){
            //console.log(n)
            if(!(values.includes(n[f.property]))){
              //console.log(n[f.property])
              values.push(n[f.property])
            }
          })

          //////////////////console.log(f.filter_type)
          //////////////////console.log(f.property)
          //console.log(values)
          changedValue=addValuesToFilter(f.filter_type,f.property,values)
          ////////////console.log(changedValue)
          ////////////console.log(f)
          f.values=[changedValue]
        }
      }
    })
  }
  function addValuesToFilter(filterType,property,values){
    var selectLength,changedValue=""
    ////////////////console.log("addValuesToFilter")
    //console.log(property)
    if(filterType=="dropdown"){
      var option,options=[];
      var select=document.getElementById(property)
      ////////////////////////console.log(select)
      ////////////////////////console.log(select.value)
  
      /* $("#"+property).empty()
      if (values.length>1){
        values.unshift("All")
      }
      for (const val of values) {
          option = document.createElement("option");
          option.value = val;
          option.text = val.charAt(0).toUpperCase() + val.slice(1);
          select.appendChild(option);
      } */
      //console.log(values[0])
      //console.log(select.value)
      if((select.value=="")|(select.value=="All")){
        if(values[0]==undefined){
          select.value="All"
        }else{
          select.value=values[0]
        }
      }else{
        select.value=values[0]
      }
      //throw new Error("Something went badly wrong!");
      //////////////console.log(filters)
      changedValue=select.value
    }
    //filters.filter
    return changedValue
    }
  function visibilityFilters(classFilterChanged){
    var values,childNodes;
    //////////////////console.log(networkGraph.data)
    //////////////////console.log(document.getElementsByClassName("classFilter"))
    var classFilter=document.getElementsByClassName("classFilter")
    filters.forEach(function(f){
      ////////////console.log(f)
      ////////////console.log(f.class)
      ////////////////console.log(document.getElementById(f.class+"_filters").parentNode.style.display)
      if(document.getElementById(f.class+"_filters").parentNode.style.display=="none"){
        /* values=vis.data.nodes.filter(function(v){
          return v[property]!=""
        }) */
        ////////////console.log(document.getElementById(f.class+"_filters").childNodes)
/*         document.getElementById(f.class+"_filters").childNodes.forEach(function (d){
          ////////////console.log(d)
          if(d.id.endsWith("_label")){
            ////////////console.log(d.id)
            //////////console.log(vis.data.nodes)
            values=vis.data.nodes.filter(function(v){
              return v[d.id.replace("_label","")]!=""
            })
            ////////////console.log(values)
          }
        })  */
        document.getElementById(f.class+"_filters").parentNode.style.display="block"
      }
    })
    for (let c of classFilter) {
      //////////////////console.log(c.childNodes);
      c.childNodes.forEach(function(ch){
        //////////////////console.log(ch)
        if(classFilterChanged!=ch.id.split("_")[0]){
          if(ch.id){
            //////////////////console.log(ch.id)
            resultFilterNodes=networkGraph.data.nodes.filter(function(n){
              return n.class==ch.id.split("_")[0]
            })
            //////////////////console.log(resultFilterNodes)
            if(resultFilterNodes.length==0){
              c.style.display = "none";
            }
          }
        }
      })
    }
    //////////////////console.log(filters)
    
/*     classFilter.forEach(function (d){
      ////////////////console.log(d.getElementsByTagName("div"))
    }) */
  }
function newValuesFilters(classFilterChanged,property){
    var values,childNodes,classNotEmptyFilter=[],classHasFilter=[],newValues=[];
    //////////////////console.log(networkGraph.data)
    console.log(classFilterChanged)
    console.log(property)
    //////////////////console.log(document.getElementsByClassName("classFilter"))
    //var classFilter=document.getElementsByClassName("classFilter")
    filters.forEach(function(f){
      console.log(f)
      /* newValues=[]
      if((f.filter_type=="dropdown")&(f.property!=property)){
        var option,options=[];
        var select=document.getElementById(f.property)
        console.log(vis.data.nodes)
        vis.data.nodes.forEach(function (n){
          console.log(n[f.property])
          if (n[f.property]){
            console.log(n[f.property])
            newValues.push(n[f.property])
          }
        })
        newValues=[...new Set(newValues)]

        if(newValues.length>0){
          select.value=newValues[0]
          f.values=newValues[0]
        }
      } */
    //}

      document.getElementById(f.class+"_filters").childNodes.forEach(function (d){
        ////////console.log(d)
        if(d.id.endsWith("_label")){
          ////////////console.log(d.id)
          //////////console.log(vis.data.nodes)
          values=vis.data.nodes.filter(function(v){
            ////////console.log(v[d.id.replace("_label","")])
            return ((v[d.id.replace("_label","")]!="")&(v[d.id.replace("_label","")]!=undefined))
          })
          ////////console.log(values)
          ////////console.log(document.getElementById(d.id))
          ////////console.log(document.getElementById(d.id.replace("_label","")))
          //////////console.log(document.getElementById(d.id.replace("_selection_label","")))
          ////////console.log(values)
          if((values.length==0)&(f.class!=classFilterChanged)){
            document.getElementById(d.id).style.display="none"
            if(document.getElementById(d.id.replace("_label",""))){
              document.getElementById(d.id.replace("_label","")).style.display="none"
            }else if (document.getElementById(d.id.replace("_selection_label",""))){
              document.getElementById(d.id.replace("_selection_label","")).style.display="none"
            }
          }else{
            document.getElementById(d.id).style.display="block"
            if(document.getElementById(d.id.replace("_label",""))){
              document.getElementById(d.id.replace("_label","")).style.display="block"
            }else if (document.getElementById(d.id.replace("_selection_label",""))){
              document.getElementById(d.id.replace("_selection_label","")).style.display="block"
            }
            //document.getElementById(d.id.replace("_label","")).style.display="block"
            classNotEmptyFilter.push(f.class)
          }
          classHasFilter.push(f.class)
        }
      }) 
        //document.getElementById(f.class+"_filters").parentNode.style.display="block"
      //}
    })
    classNotEmptyFilter=[...new Set(classNotEmptyFilter)]
    classHasFilter=[...new Set(classHasFilter)]
    var elmts = classHasFilter.filter(f => !classNotEmptyFilter.includes(f));
    //diff = classNotEmptyFilter.filter(function(x) { return classHasFilter.indexOf(x) < 0 })
    ////////console.log(elmts)
    //////////console.log(diff)
    ////////console.log(classNotEmptyFilter)
    ////////console.log(classHasFilter)
    classHasFilter.forEach(function(d){
      document.getElementById(d+"_filters").parentNode.style.display="block"
    })
    elmts.forEach(function(d){
      document.getElementById(d+"_filters").parentNode.style.display="none"
    })
    /* classHasFilterforEach(function(d){
      document.getElementById(d+"_filters").parentNode.style.display="block"
    }) */
    /* filters.forEach(function (f){

    }) */
    
  }
  function changeValuesFilter(filterType,property,values){
    var selectLength,changedValue=""
    ////////////////console.log("addValuesToFilter")
    //console.log(property)
    if(filterType=="dropdown"){
      var option,options=[];
      var select=document.getElementById(property)

      if((select.value=="")|(select.value=="All")){
        if(values[0]==undefined){
          select.value="All"
        }else{
          select.value=values[0]
        }
      }else{
        select.value=values[0]
      }

      changedValue=select.value
    }
    return changedValue
    }
  //////console.log("empieza aquí")
  var vis = this,parentHidden=false,position,selectedFilter;
  
  vis.hiddenNodes=[]
  vis.filters=filters
  property=classFilter+"_"+property
  selectedFilter=filters.filter(function(item) {
    return ((item.class == classFilter)&(item.property == property))
  })[0]
  changeValuesFilters()
  //visibilityFilters(classFilter)
  //console.log(filters)
  //throw new Error("Something went badly wrong!");
  //////////////////console.log(classFilter)
  //////////////////console.log(property)
  //////////////////console.log(selectedFilter)
  //for (var i = vis.treeData.length - 1; i >= 0; i--) {
  //////////////////console.log(vis.treeData)
  vis.treeData.forEach(function(t){
    parentHidden=false
    ////////////////console.log(t)
    ////////////////console.log(hiddenNodes)
    if(vis.hiddenNodes.includes(t.id)){
      t.hidden=true
      parentHidden=true
    }else{
      //if(check_one_filter(t,filters,classFilter,property)){
      if(check_filters(t,filters)){
        t.hidden=true
        parentHidden=true
        if(!vis.hiddenNodes.includes(t.id)){
          vis.hiddenNodes.push(t.id)
        }
        ////////////////console.log(t)
        ////////////////console.log(hiddenNodes)
      }else{
        delete t.hidden
      }
    }
    
    if(t.children!=undefined){
      t.children.forEach(function(v){
        //////console.log(v)
        //////console.log(parentHidden)
        if(parentHidden){
          v["hidden"]=true
          if(!vis.hiddenNodes.includes(v.id)){
            vis.hiddenNodes.push(v.id)
          }
        }else{
          //if(check_one_filter(v,filters,classFilter,property)){
          if(check_filters(v,filters)){  
            //////console.log("hidden true segun filters")
            //////////////console.log(v)
            v["hidden"]=true
            if(!vis.hiddenNodes.includes(v.id)){
              vis.hiddenNodes.push(v.id)
            }
          }else{
            delete v.hidden
          }
        }
        
      })
    }
    
  })
  //////////////////////////////console.log(vis.visibleNodes)
  //changeValuesFilters()
  ////////////////////////////////////////////////////////////////////////////////////////console.log(vis.treeData)
  vis.data=flatten(vis.treeData).flatData
  ////////////////////////////////////////////////////////////////////////////////////////console.log(vis.data)
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.enterGraph()
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()
  ////////////////console.log(classFilter)
  newValuesFilters(classFilter,property)
  //changeValuesFilters()
}