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
  this.forces = _forces
  this.graphType=_graphType
  this.initTypeVis()
};

/////////////////// initVis Method //////////////////////
NetworkGraph.prototype.initTypeVis = function () {
  var vis = this;
  vis.initVis();
};

NetworkGraph.prototype.initVis = function () {
  var vis = this;
  ////console.log("init Vis")
  if(vis.data.treeData){
    vis.treeData=vis.data.treeData
    vis.allData=vis.data.allData
    vis.data=vis.data.flatData
  }
  vis.rootNode=vis.data.nodes[0]
  vis.width = +d3.select(this.parentElement).node().getBoundingClientRect().width;
  vis.width=1200
  vis.height = +d3.select(this.parentElement).node().getBoundingClientRect().height;
  vis.height=1200
  vis.svg = d3.select(this.parentElement).append("svg")
  .attr("class", "graph z-0")
  .attr("width", vis.width)
  .attr("height", vis.height)
/*   .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1000 600") */

/*   vis.rect=vis.svg.append("rect")
    .attr('class', 'zoom')
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", vis.width)
    .attr("height", vis.height)
    .on("click",function() { unclickBubbleFreeGraph() }) */
    

  vis.zoomScale=1
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
  .attr("class", "gMain")
  .attr("transform","translate(0,0)")
  //.call(networkGraph.drag);

  
  
  vis.drag = d3.drag()
          .subject(function(d){
            //console.log("subject")
            ////console.log(d)
            //return {x: d.x, y: d.y};
            //console.log(d3.select(this))
            var t = d3.select(this);
            //console.log(t)
            //console.log(t.attr("transform"))
            //console.log(t.attr("y"))
            //return {x: t.attr("x"), y: t.attr("y")};
            return {x: 0, y: 0};
          })
          .on("start",function(){
            d3.select('body').style("cursor", "move");
          })
          .on("drag", function(args){
            //d3.event.sourceEvent.stopPropagation();
            //console.log("drag-start")
            //d3.event.preventDefault();
            //vis.justDragged = true;
            vis.dragmove.call(vis, args);
          })
          .on("end", function(){
            d3.select('body').style("cursor", "auto");
          });

  //vis.svg
  /* .call(d3.zoom()
  .on("zoom",function(){
    zoom()
    zoomY=d3.event.transform.y
    zoomX=d3.event.transform.x
  }))
  .on("wheel.zoom", null);
  */
    var dragSvg = d3.zoom()
    .on("zoom", function(){
/*       if (d3.event.sourceEvent.shiftKey){
        // TODO  the internal d3 state is still changing
        return false;
      } else{ */
      vis.zoomed.call(vis);
      //}
      return true;
    })
    .on("start", function(){
      /* var ael = d3.select("#" + vis.consts.activeEditId).node();
      //console.log("startZoom")
      if (ael){
        ael.blur();
      } */
      //if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
      d3.select('body').style("cursor", "move");
    })
    .on("end", function(){
      //console.log(d3.event.transform)
      vis.dragX=d3.event.transform.x
      vis.dragY=d3.event.transform.y
      d3.select('body').style("cursor", "auto");
    });
  vis.gLinks=vis.g.append("g")
  .attr("class", "links")

  //vis.svg
  /* vis.g
  .call(vis.drag); */

  vis.svg.call(dragSvg).on("dblclick.zoom", null);

  vis.gNodes=vis.g.append("g")
  .attr("class", "nodes")
  //.call(vis.drag);

  vis.gNodesRect=vis.g.append("g")
  .attr("class", "nodesRect")

  vis.gNodesFree=vis.g.append("g")
  .attr("class", "nodesFree")
      
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
    "#6B7280":"gray-500"}

    vis.colors=["#6EE7B7","#FCA5A5","#FCD34D","#F9A8D4","#C4B5FD","#93C5FD","#D1D5DB"
    ,"#10B981","#EF4444","#F59E0B","#EC4899","#8B5CF6","#3B82F6","#6B7280"]

    vis.colorScale = d3.scaleOrdinal()
    .domain(nodesClassesShow)
    .range(vis.colors.slice(0,nodesClassesShow.length))

    colorScale=vis.colorScale

    ////////////////////////////////////////////console.log("pasa por network graph fill legend")
    ////////////////////////////////////////////console.log(networkGraph)
    if(vis.graphType=="freeGraph"){
      fillLegendFreeGraph()
    }else{
      fillLegend([],false)
    }        

  vis.simulation = d3.forceSimulation()
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

  vis.maxSizeNode=d3.max(vis.data.nodes, d => d.number)  
    vis.sizeNode = d3.scaleLinear()
    .domain([0,300])
    .range([ 15, 45])  // Size in pixel
 
  vis.initializeSimulation();
  vis.initializeDisplay();
  
};
NetworkGraph.prototype.zoomed = function(){
  var vis=this
  //this.state.justScaleTransGraph = true;
  //d3.select("." + vis.consts.graphClass)
  ////console.log(d3.event.transform)
  ////console.log(d3.select(".gMain"))
  
  textImageZoom(d3.event.transform.k)
  d3.select(".gMain")
    .attr("transform", 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
    //"translate(" + d3.event.transform.x + ") scale(" + d3.event.scale + ")"); 
};

/* NetworkGraph.prototype.zoomIn = function () {
  var vis = this;
  var zoom = d3.zoom()
                .on('zoom', function() {
                  ////console.log("pasa por aquí")
                  //vis.svg.attr("transform", d3.event.transform);
                  //vis.zoomScale=d3.event.transform.k;
                  //////console.log(vis.zoomScale)
                  //zoomY=d3.event.transform.y
                  //zoomX=d3.event.transform.x
                  //textImageZoom(vis.zoomScale)
            });
    ////console.log(networkGraph)
    //console.log(vis.dragX)
    //console.log(vis.dragY)
    //vis.svg.attr("transform", "translate("+vis.dragX+","+vis.dragY+")");
    vis.svg.attr("transform", "translate(0,0)");
    zoom.translateTo(vis.svg.transition().duration(0), vis.dragX,vis.dragY) 
    zoom.scaleBy(vis.svg.transition().duration(750), 1.3);
} */
NetworkGraph.prototype.dragmove = function(d) {
  var vis = this;
  //console.log("dragmove")
  //console.log(d)
  /* if (vis.state.shiftNodeDrag){
    vis.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(this.svgG.node())[1]);
  } else{ */
  d.x += d3.event.dx;
  d.y +=  d3.event.dy;
  vis.attr("transform", function(d){
    //console.log(d)
    return "translate(" + d.x + "," + d.y + ")";})
  //vis.updateGraph();
  //}
};
/* NetworkGraph.prototype.zoomOut = function () {
  var vis = this;
  var zoom = d3.zoom()
                .on('zoom', function() {
                  c
                  vis.svg.attr("transform", d3.event.transform);
                  //if(d3.event.transform.k>0.5){
                    vis.zoomScale=d3.event.transform.k;
                    //////////////////////////////////////////console.log(zoomScale)
                    zoomY=d3.event.transform.y
                    zoomX=d3.event.transform.x
                  //}      
                  textImageZoom(vis.zoomScale)            
            });
    zoom.scaleBy(vis.svg.transition().duration(750), 1 / 1.3);
    ////////////////////////////////////////////console.log(d3.event.transform.k)
} */

NetworkGraph.prototype.initializeSimulation = function () {
  var vis = this;
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
    ////console.log(vis.zoomScale)
    vis.link
        .attr("x1", function(d) { 
            return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    vis.edgepaths.attr('d', function (d){
          return   'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        });

    vis.nodeCircle
        .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")"; })

    vis.nodeCircleFree
          .attr("transform", function(d) { 
  
            return "translate(" + d.x + "," + d.y + ")"; })

    /* vis.textCircle.attr("transform", function(d) { 
              return "translate(" + d.x + "," + d.y + ")"; }) */
/*     vis.textCircle.attr("transform", function(d){
      //////////console.log(d)
      return `translate(${d.x / 2},${d.y / 2})`
      //return `translate(${d.x / 2},${dy / 2}) scale(${radius / textRadius})`
    }) */
    //vis.textCircle
    //.attr("transform", `translate(${d.x / 2},${d.y / 2}) 
    //scale(${radius / textRadius})`)

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
  var vis = this,linkId,classElement,text;
  vis.tip = d3.tip()
  .attr('class', 'd3-tip z-50')
  .offset([-25,0])
  .html(function (d) {
      //////////////////////////////////////////////////console.log(d)
      if(d["class"]){
        if(d["class"]=="free"){
          text=getTooltipTextFreeGraph(d)
       }else{
               text=getTooltipText(d)
       }
      }else{
        text=getTooltipMenu(d)
      }
      
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
  //////////////////////////////////////////////console.log(vis.link)
  vis.edgepaths = vis.gLinks.selectAll(".edgepath")
  .data(vis.data.links.filter(function(item) {
    return item["source"]["class"] == "free"
  }), function(d) { return d.id; })

  vis.edgelabels = vis.gLinks.selectAll(".edgelabel")
  .data(vis.data.links.filter(function(item) {
    return item["source"]["class"] == "free"
  }), function(d) { return d.id; })

  vis.circleSel=vis.gNodes
  .selectAll('.nodeCircleBasic')

  vis.nodeCircle=vis.circleSel
  .data(vis.data.nodes.filter(function(item) {
    return item["class"] != "free"
  }), function(d) { return d.id; })

  vis.circleSelFree=vis.gNodesFree
  .selectAll('.nodeCircleFree')

  vis.nodeCircleFree=vis.circleSelFree
  .data(vis.data.nodes.filter(function(item) {
    return item["class"] == "free"
  }), function(d) { return d.id; })

}

NetworkGraph.prototype.enterGraph = function(){
    var vis=this,r,cluster;
    vis.colorScale.range(vis.colors.slice(0,nodesClassesShow.length))
    vis.colorScale.domain(nodesClassesShow)
  
    colorScale=vis.colorScale
    
    vis.isDblclick = false;
  
    vis.timeoutTiming = 500;
    //////////////////////////////////console.log(vis.treeData)
   //aquí hay un origId y id en basicGraph y id en freeGraph
   //también en basicGraph tiene un "_" y no lo tiene en 
    vis.link=vis.link
        .enter().append("line")
        .attr("class", "link")
        .attr("origId",function(d){
          return (d.source.id+"_"+d.target.id)
        })
        .attr("index",function(d){
          return d.index;
                })
        .attr("value",d=>d["type"])
        .style("stroke", "grey")
        .style("fill","grey")
        .style("stroke-width", "1px")
        .attr('marker-end','url(#arrowhead)') 
        .on('mouseover', function(d){
          vis.tip.show(d,this);
        })
        .attr("id",function(d){
          return (d.source.id+"_"+d.target.id)
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
          return 'edgepath' + i})
        .attr('link_id',function(d){
          return d["source"]["id"]+d["target"]["id"]
        })
        .style("pointer-events", "none");

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
          return d.value
        });
  
    vis.nodeCircle=vis.nodeCircle
    .enter().append("g")
    .attr("class", "nodeCircleBasic")
    .attr("id",function(d){
      return (d.id+"_g")
    })
    
    vis.nodeCircleCircle=vis.nodeCircle
        .append("circle")
        .attr("class",function(d){
          return d.class + " nodeCircleCircle " + "circleBasic"
        }) 
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
        //.attr("cx", 17 / 2)
        //.attr("cy", 17 / 2)
        .attr("r", function(d){
          if(!d.number){
            if((d.more_results!="")&(d.more_results!=undefined)){
              return 50;
            }else{
              return 17;
            }
          }else{
            return vis.sizeNode(d.number)
          }
          //////////////////////////////////////////////////////////////console.log(d.number)
          })
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
        .on('clickout', function(d){
        })
        .on("click",function(d){
          var element=this
          timer = setTimeout(function() {
            if (!prevent) {
              ////////////////////////////////////////////console.log("entra en circle")
              if (element.getAttribute("stroke-width")=="1px"){
                clickBubbleFreeGraph(element,vis.data)
              }else{
                unclickBubbleFreeGraph()
              };
            }
            prevent = false;
          }, delay);

          /* if(handleClick()==1){
            ////////////////////////////////////////////console.log("entra en circle")
              if (element.getAttribute("stroke-width")=="1px"){
                clickBubbleFreeGraph(element,vis.data)
              }else{
                unclickBubbleFreeGraph()
              }
          } */
/*           ////////////////////////////////////////////console.log("pasa por click")
          clearTimeout(vis.clickTimeout);
          vis.clickTimeout = setTimeout(function () {
            if(!vis.isDblclick) {
              // here goes your click codes
              if(!d.comment){
                if (element.getAttribute("stroke-width")=="1px"){
                  clickBubbleFreeGraph(element,vis.data)
                }else{
                  unclickBubbleFreeGraph()
                }
              }else{
                modelClick(element,vis.data)
              }
            }
          }, vis.timeoutTiming); */
    
        })
        .on('dblclick', function(d){
          d3.event.stopPropagation();
          //d3.event.sourceEvent.stopPropagation();
          d3.event.preventDefault();
          //d3.event.preventDefault();
/*           d3.event.preventDefault();
          vis.isDblclick = true;
          clearTimeout(vis.dblclickTimeout);
          vis.dblclickTimeout = setTimeout(function () {
            vis.isDblclick = false;
          }, vis.timeoutTiming); */
          clearTimeout(timer);
          prevent = true;
          ////////////////////////////////////console.log(vis.treeData)
          //////////////////////////////////////////////console.log(configFile.filter(v=>v.class==get_node_from_element(this.getAttribute("id"))["class"]))
          //if(configFile.filter(v=>v.class==get_node_from_element(this.getAttribute("id"))["class"])[0]["type"]=="svg"){
            //////////////////////////////////////////////console.log(get_property_names(configFile.filter(v=>v.class==get_node_from_element(this.getAttribute("id"))["class"])[0]["properties"]))
            //showWebPage(page,modal2.modalHeader,modal2.modalContent)
          //}
          if(get_node_from_element(this.getAttribute("id"))["class"]!="menuOption"){
            vis.wrangleData(this,"bubble",d3.event);
          }
          handleNavigation(node)
          return false;
        })
        .on('contextmenu', (d) => {
          d3.event.preventDefault();
          getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        })
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

/*     vis.nodeCircle
    .append("foreignObject")
    .attr("width", "50px")
    .attr("height", "50px")
    .append("xhtml:body")
    .html("Lorem ipsum dolor sit amet, ..."); */

    //vis.nodeCircle
    /* .append("g")
              .attr("class", "label")
              .selectAll("text")
                .data(cells) */
              //.enter()
              //.append("text")
                //.each(function(d) {
                  ////////////console.log(d)
                  // compute the scale threshold for this element. i.e. how big does the scale need to be before I should display
                  //d.scaleThreshold = Math.sqrt(displayThreshold / d.area());
                  //d.opacityScale = d3.scale.linear() 
                  //  .domain([d.scaleThreshold, d.scaleThreshold * 1.3])
                  //  .range([0, 1]);
                  
                //})
/*                 .attr("class", function(d) {
                  var centroid = d.centroid(),
                      point = d.point,
                      angle = Math.round(Math.atan2(centroid[1] - point[1], centroid[0] - point[0]) / Math.PI * 2);
                  return "label--" + (d.orient = angle === 0 ? "right"
                      : angle === -1 ? "top"
                      : angle === 1 ? "bottom"
                      : "left");
                })
                .attr('opacity', function(d) {
                  if (d.scaleThreshold < 1) {
                    return 1;
                  }
                  return 0;
                })
                .attr("transform", function(d) { return "translate(" + d.point + ")"; })
                .attr("dy", function(d) { return d.orient === "left" || d.orient === "right" ? ".35em" : d.orient === "bottom" ? ".71em" : null; })
                .attr("x", function(d) { return d.orient === "right" ? 6 : d.orient === "left" ? -6 : null; })
                .attr("y", function(d) { return d.orient === "bottom" ? 6 : d.orient === "top" ? -6 : null; }) */
                //.text(function(d, i) { 
                //  return d.value
                //  return i * 1000;
                // });
    
    //targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight)
    let lineHeight = 12
    vis.textCircle=vis.nodeCircle
        .append("text")
        .attr("class","nodeCircleText")
        .attr("id",function(d){
          return (d.id)+"_text"
        })        /* if(!d.number){
          if((d.more_results!="")&(d.more_results!=undefined)){
            return 50;
          }else{
            return 17;
          }
        }else{
          return vis.sizeNode(d.number)
        } */
        .attr("transform", 
        function(d){
          //////console.log(d.value)
          textRadiusText=textRadius(lines(words(d.value),d.value))
          //////console.log(textRadiusText)
          return `translate(${-vis.sizeNode(d.number)/1.2},${-(textRadiusText/vis.sizeNode(d.number))/1.2}) scale(${vis.sizeNode(d.number) / textRadiusText})`
          //return `translate(${-vis.sizeNode(d.number)},${-textRadiusText/vis.sizeNode(d.number)}) scale(${vis.sizeNode(d.number) / textRadiusText})`
          //textRadiusText=42
          //return `translate(${-vis.sizeNode(d.number)/2},${-vis.sizeNode(d.number)/2}) scale(${vis.sizeNode(d.number) / textRadiusText})`
          //return `translate(${-100 / 2},${-100 / 2}) scale(${vis.sizeNode(d.number) / textRadiusText})`
          //return `translate(${width / 2},${height / 2}) scale(${vis.sizeNode(d.number) / textRadius})`
        })
        .attr('opacity', function(d) {
              //////console.log(vis.zoomScale)
              if(vis.zoomScale>1.5){
                return 1;
              }else{
                return 0;
              }
                  })
    vis.textCircle
        .selectAll("tspan")
        //.data(lines)
        .data(function(d){
          //////////console.log(d)
          return lines(words(d.value),d.value)
        })
        .enter().append("tspan")
          .attr("x", 0)
          .attr("y", (d, i) => (i - lines.length / 2 + 0.8) * lineHeight)
          .text(d => d.text);
            
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
          ////console.log("d3.event.sourceEvent.stopPropagation();")
          d3.event.stopPropagation();
          //d3.event.sourceEvent.stopPropagation();
          d3.event.preventDefault();
          ////////////////////////////////////console.log(vis.treeData)
          //d3.event.preventDefault();
          //vis.isDblclick = true;
          //clearTimeout(vis.dblclickTimeout);
          /* vis.dblclickTimeout = setTimeout(function () {
            vis.isDblclick = false;
          }, vis.timeoutTiming); */
          ////////////////////////////////////////////console.log(d)

          clearTimeout(timer);
          prevent = true;
          ////////////////////////////////////////////console.log(nodesClassesCorrespondence[get_node_from_element(this.getAttribute("id"))["class"]])
          ////////////////////////////////////////////console.log(get_node_from_element(this.getAttribute("id")))
          ////////////////////////////////////////////console.log(configFile.filter(v=>v.class==nodesClassesCorrespondence[get_node_from_element(this.getAttribute("id"))["class"]])[0])
          if(configFile.filter(v=>v.class==nodesClassesCorrespondence[get_node_from_element(this.getAttribute("id"))["class"]])[0]){
            if(configFile.filter(v=>v.class==nodesClassesCorrespondence[get_node_from_element(this.getAttribute("id"))["class"]])[0]["type"]=="WEBPAGE"){
              modal2=getModal2()
              ////////////////////////////////////////////console.log("entra")
              showWebPage(get_node_from_element(this.getAttribute("id"))[Object.keys(get_property_names(configFile.filter(v=>v.class==nodesClassesCorrespondence[get_node_from_element(this.getAttribute("id"))["class"]])[0]["properties"]))[0]],get_node_from_element(this.getAttribute("id"))["value"],modal2.modalHeader,modal2.modalContent)
              return false
            }
          }
          
          ////////////////////////console.log(get_node_from_element(this.getAttribute("id").replace("_image",""))["class"])
          if(get_node_from_element(this.getAttribute("id").replace("_image",""))["class"]!="menuOption"){
            //////////////////console.log(this)
            vis.wrangleData(this,"bubble",d3.event);
          }
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
          //////console.log(d3.select("#"+(this.getAttribute("id").replace("_image","_text"))))
          //d3.select("#"+(this.getAttribute("id").replace("_image","_text")))
          //.transition()
          //.attr("transform", `scale(1.5)`)
          /* d3.select("#"+(this.getAttribute("id").replace("_image","_text")))
          .transition()
          .attr("transform",`translate(${-vis.sizeNode(d.number)*2/1.2},${-vis.sizeNode(d.number)*2}) scale(2)`) */
          /* .attr("transform", 
            function(d){
              //////console.log(d.value)
              textRadiusText=textRadius(lines(words(d.value),d.value))
              //////console.log(textRadiusText)
              return `translate(${-vis.sizeNode(d.number)/1.2},${-textRadiusText/vis.sizeNode(d.number)}) scale(${vis.sizeNode(d.number) / textRadiusText})`
              //return `translate(${-vis.sizeNode(d.number)},${-textRadiusText/vis.sizeNode(d.number)}) scale(${vis.sizeNode(d.number) / textRadiusText})`
              //textRadiusText=42
              //return `translate(${-vis.sizeNode(d.number)/2},${-vis.sizeNode(d.number)/2}) scale(${vis.sizeNode(d.number) / textRadiusText})`
              //return `translate(${-100 / 2},${-100 / 2}) scale(${vis.sizeNode(d.number) / textRadiusText})`
              //return `translate(${width / 2},${height / 2}) scale(${vis.sizeNode(d.number) / textRadius})`
            }) */
          /* .attr("r", function(d) { 
            r=vis.sizeNode(d.number)*2
            return r;
          }) */

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
          //////////////////////////////////////////////console.log("entra")
          timer = setTimeout(function() {
            if (!prevent) {
              ////////////////////////////////////////////console.log("entra en circle")
              ////////////////////////////////////////////console.log(element.getAttribute("stroke-width"))
              //if (element.getAttribute("stroke-width")=="1px"){
              ////////////////////////////////////////////console.log("clickbubble")
              clickBubbleFreeGraph(element,vis.data)
              //}else{
              //  unclickBubbleFreeGraph()
              //};
            }
            prevent = false;
          }, delay);
          //////////////////////////////////////////////console.log(handleClick())
          /* res=handleClick()
          ////////////////////////////////////////////console.log(res)
          if(res==1){
          //if(handleClick()==1){
            ////////////////////////////////////////////console.log("entra también aquí en image")
            if (element.getAttribute("stroke-width")=="1px"){
              clickBubbleFreeGraph(element,vis.data)
              showModal("#myModal")
            }else{
              unclickBubbleFreeGraph()
            } */
/*             }else{
            modelClick(element,vis.data)
          } */
        //}
        /*           clearTimeout(vis.clickTimeout);
          vis.clickTimeout = setTimeout(function () {
            if(!vis.isDblclick) {
              element=document.getElementById(element.getAttribute("id").replace("_image",""));
              ////////////////////////////////////////////console.log("pasa por click")
              if (element.getAttribute("stroke-width")=="1px"){
                clickBubbleFreeGraph(element,vis.data)
              }else{
                unclickBubbleFreeGraph()
              }
            }
          }, vis.timeoutTiming); */

        })
        .on('contextmenu', (d) => {
          d3.event.preventDefault();
          getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        })
        .attr('opacity', function(d) {
/*           if (d.scaleThreshold < 1) {
            return 1;
          } */
          //////console.log(vis.zoomScale)
          if(vis.zoomScale>1.5){
            return 0;
          }else{
            return 1;
          }
          
        })
  
    vis.nodeCircleFree=vis.nodeCircleFree
        .enter().append("g")
        .attr("class",function(d){
          if((d.more_results!="")&(d.more_results!=undefined)){
            return "nodeCircleFree g-cluster"
          }else{
            return "nodeCircleFree"
          }
        }) 
        .attr("id",function(d){
          return (d.id+"_g")
        })
  
    vis.nodeCircleCircleFree=vis.nodeCircleFree
        .append("circle")
        .attr("class",function(d){
          if((d.more_results!="")&(d.more_results!=undefined)){
            return d.class + " nodeCircleCircleFree cluster"
          }else{
            return d.class + " nodeCircleCircleFree"
          }
        }) 
        .attr("r", function(d){
          if((d.more_results!="")&(d.more_results!=undefined)){
            return 50;
          }else{
            return 17;
          }
        })
        .attr("id",d=>d.id)
        .attr("stroke-width", "1px")
        .style("stroke", function(d){
          return "gray";
        })
        .style("stroke-opacity",1)
        .style("stroke-width", function(d){
            return 1;
        })
        .style("fill", function (d){
          if(d.type=="menuOption"){
            return "#93C5FD"
          }else if(d.configRow!=""){
            return "#A855F7";
          }else if(d.type=="uri"){
            return "#6EE7B7";
          }else if(d.type=="bnode"){
            return "#FCD34D";
          }else{
            return "#F9A8D4";
          }
        })
        .on('mouseover', function(d){
          vis.tip.show(d,this);
        })
        .on('mouseout', function(d){
          vis.tip.hide(d,this);
        })
        .on('clickout', function(d){
        })
        .on("click",function(d){
          var element=this
          var element=this
          timer = setTimeout(function() {
            if (!prevent) {
              ////////////////////////////////////////////console.log("entra en circle")
              ////////////////////////////////////////////console.log(element.getAttribute("stroke-width"))
              //if (element.getAttribute("stroke-width")=="1px"){
              ////////////////////////////////////////////console.log("clickbubble")
              clickBubbleFreeGraph(element,vis.data)
              //}else{
              //  unclickBubbleFreeGraph()
              //};
            }
            prevent = false;
          }, delay);
        })
        .on('dblclick', function(d){
          //d3.event.sourceEvent.stopPropagation();
          d3.event.stopPropagation();
          //d3.event.sourceEvent.stopPropagation();
          d3.event.preventDefault();
          //d3.event.preventDefault();
          if((d.type=="uri")|(d.type=="bnode")){
/*             d3.event.preventDefault();
            vis.isDblclick = true;
            clearTimeout(vis.dblclickTimeout);
            vis.dblclickTimeout = setTimeout(function () {
              vis.isDblclick = false;
            }, vis.timeoutTiming); */
            clearTimeout(timer);
            prevent = true;
            vis.wrangleData(this,"bubble");
            return false;
          }
        })
        .on('contextmenu', (d) => {
          ////////////console.log(d)
          if(d.type=="uri"){
            d3.event.preventDefault();
            getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
          }
        })
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
      //////////////////////////////////////////////console.log(vis.nodeCircleFree)
      //////////////////////////////////////////////console.log(d3.selectAll(".g-cluster"))
      d3.selectAll(".g-cluster")
      .append("svg:image")
        .attr("class", "clusterImage")
        .attr("id",function(d){
          return (d.id+"_image")
        })
        .attr("xlink:href", function(d){
          return "images/bubbles.svg";
        })
        .attr("x","-50px")
        .attr("y","-50px")
        .attr("width","100px")
        .attr("height","100px")
        .on('mouseover', function(d){
          vis.tip.show(d,this);
        })
        .on('mouseout', function(d){
          vis.tip.hide(d,this);
        })
        .on('clickout', function(d){
        })
        .on("click",function(d){
          var element=this
          timer = setTimeout(function() {
            if (!prevent) {
              ////////////////////////////////////////////console.log("entra en circle")
              ////////////////////////////////////////////console.log(element.getAttribute("stroke-width"))
              //if (element.getAttribute("stroke-width")=="1px"){
              ////////////////////////////////////////////console.log("clickbubble")
              clickBubbleFreeGraph(element,vis.data)
              //}else{
              //  unclickBubbleFreeGraph()
              //};
            }
            prevent = false;
          }, delay);
        })
        .on('dblclick', function(d){
          //d3.event.sourceEvent.stopPropagation();
          d3.event.stopPropagation();
          //d3.event.sourceEvent.stopPropagation();
          d3.event.preventDefault();
          //d3.event.preventDefault();
          if((d.type=="uri")|(d.type=="bnode")){
            /* d3.event.preventDefault();
            vis.isDblclick = true;
            clearTimeout(vis.dblclickTimeout);
            vis.dblclickTimeout = setTimeout(function () {
              vis.isDblclick = false;
            }, vis.timeoutTiming); */
            clearTimeout(timer);
            prevent = true;
            vis.wrangleData(this,"bubble");
            return false;
          }
        })
        .on('contextmenu', (d) => {
          if(d.type=="uri"){
            d3.event.preventDefault();
            getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
          }
        })
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

      //console.log(vis)
      //console.log(vis)

      /* var newGs= vis.circleSel.enter()
      .append("g");

      newGs.call(vis.drag); */
      


      function color(d) {
        return d._children ? "#e86935" : "#f5aa41";
      }
    
      function dragstarted(d) {
        ////console.log(vis.zoomScale)
        if (!d3.event.active) vis.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
    
      function dragged(d) {
        ////console.log(vis.zoomScale)
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
    
      function dragended(d) {
        ////console.log(vis.zoomScale)
        if (!d3.event.active) vis.simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
      }
      function createContextMenu (d, menuItems, width, height, svgId) {
        ////////////console.log(d)
        ////////////console.log(menuItems)
        vis.menuFactory(d3.event.pageX-200, d3.event.pageY-200 , menuItems, d,"contextMenu");
        d3.event.preventDefault();
      }
      function words(text){
        const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
        if (!words[words.length - 1]) words.pop();
        if (!words[0]) words.shift();
        //////////console.log(words)
        return words;
      }
      function lines(words,text){
        //let lineHeight = 12
        ////////console.log(words)
        //////////console.log(longestString(words))
        //let targetWidth = Math.sqrt(measureWidth(longestString(words).trim()) * lineHeight)
        let targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight)
        let line;
        let lineWidth0 = Infinity;
        const lines = [];
        for (let i = 0, n = words.length; i < n; ++i) {
          let lineText1 = (line ? line.text + " " : "") + words[i];
          //////////console.log(lineText1)
          let lineWidth1 = measureWidth(lineText1);
          if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
            line.width = lineWidth0 = lineWidth1;
            line.text = lineText1;
          } else {
            lineWidth0 = measureWidth(words[i]);
            line = {width: lineWidth0, text: words[i]};
            lines.push(line);
          }
        }
        ////////console.log(lines)
        return lines;
      }
      function longestString(strs) {
        return strs.sort(function(a, b) {return b.length - a.length})[0];
      }
      function textRadius(lines){
        let radius = 0;
        for (let i = 0, n = lines.length; i < n; ++i) {
          const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
          const dx = lines[i].width / 1.5;
          radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
        }
        return radius;
      }
      function measureWidth(text) {
        ////////console.log(text)
        const context = document.createElement("canvas").getContext("2d");
        return (context.measureText(text).width)
        //return text => context.measureText(text).width;
      }
  }

NetworkGraph.prototype.menuFactory = function(x, y, menuItems, data,origin,width){

  var vis=this,uri="",url,subjectObject;
  if(data instanceof Element){
    uri=d3.select("#"+data.getAttribute("id")).data()[0]["uri"]
  }
  ////////////console.log(menuItems)
  ////////////console.log(x)
  ////////////console.log(y)
  d3.select(".contextMenu").remove();
  vis.g
      .append('g').attr('class', "contextMenu")
      .selectAll("tmp")
      .data(menuItems).enter()
      .append('g').attr('class', "menuEntry")
      .style({'cursor': 'pointer'});
  
  d3.selectAll(".menuEntry")
      .append('rect')
      .attr('uri',data[data["class"]+"_uri"])
      .attr('x', x)
      .attr('y', (d, i) => { 
        ////////////console.log(d)
        ////////////console.log(i)
        ////////////console.log(y)
        return y + (i * 30); })
      .attr('rx', 2)
      .attr('width', width)
      .attr('height', 30)
      .on('click', (d) => { 
        ////////////////////////////////////////console.log("entra click")
        let p = d3.selectAll(".d3-tip");
        p.each(function () {
          this.style.opacity = "0"
        })
        if (origin=="contextMenu"){
          d.action(data,d)
        }else{
          ////////////////////console.log(data)
          ////////////////////console.log(d)
          d.action(data,d)
        }
      })
      .on('mouseover', function(d){
        if(configFile.filter(v=>v.option==d.title).length>0){
          vis.tip.show(getCommentOption(d.title),this);
        }else{
          vis.tip.show(getTooltip(d.title,uri),this);
        }
        d3.select(this).style("fill","#DCDDF5")
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
        d3.select(this).style("fill","white")
      });

  d3.selectAll(".menuEntry")
      .append('text')
      .text((d) => { 
        return d.title; })
      .attr('uri',data[data["class"]+"_uri"])
      .attr('x', x)
      .attr('y', (d, i) => { return y + (i * 30); })
      .attr('dy', 20)
      .attr('dx', 25)
      .style("font-size", "12px")
      .on('click', (d) => { 
        d3.selectAll(".d3-tip").each(function () {
          this.style.opacity = "0"
        })
        ////////////////////////////////////////console.log(data)
        ////////////////////////////////////////console.log(d)
        d.action(data,d) })
      .on('mouseover', function(d){
        if(configFile.filter(v=>v.option==d.title).length>0){
          vis.tip.show(getCommentOption(d.title),this);
        }else{
          vis.tip.show(getTooltip(d.title,uri),this);
        }
        d3.select(this).style("fill","#DCDDF5")
      })
      .on('mouseout', function(d){
        vis.tip.hide(d,this);
      });

  d3.select('body')
      .on('click', () => {
          d3.select(".contextMenu").remove();
      });

  function getTooltip(title,uri){
    url = title.match("Sparql Endpoint: (.*) and Position:")[1]; 
    subjectObject=title.match("and Position: (.*)")[1];
    if(subjectObject=="s"){
      textTooltip="Find all objects for the URI :" + uri + " in the SPARQL EndPoint: "+url
    }else{
      textTooltip="Find all subjects for the URI :" + uri + " in the SPARQL EndPoint: "+url
    }
    return textTooltip
  }

}
NetworkGraph.prototype.exitGraph = function(){
    var vis=this;
    vis.link.exit().remove();

    vis.nodeCircle.exit().remove();
    if(vis.graphType=="freeGraph"){
      vis.edgepaths.exit().remove();
    }
}

NetworkGraph.prototype.wrangleData = async function (element,origin,event) {
  var vis = this;
  var children,pageX,pageY,founded,indexRows=1,node,configRows=0,arrayMenuOptions
  //////////
  ////////////////////////////////////console.log(element)
  //////////////////////////////////////////////console.log(origin)
  //////////////////////////////////////////////console.log(event)
  if(element instanceof Element){
    founded=findNodeTreemap(element.getAttribute("id").replace("_image",""),vis.treeData)
  }else{
    founded=findNodeTreemap(element,vis.treeData)
  }
  ////////////////console.log(founded)
  if(element instanceof Element){
    node=get_node_from_element(element.getAttribute("id").replace("_image",""))
  }else{
    node=element
  }
  //////////
  ////////////////////////////////////console.log(node)
  if(node.class!="free"){
    configRows=get_configRows_class(nodesClassesCorrespondence[node["class"]])
    //////////console.log(configRows)
    ////////////////console.log(node)
    //////////////////////////////////////////////console.log(nodesClassesCorrespondence[node["class"]])
    //////////////////////console.log(configRows)
    //////////////////////////////////////////////console.log(configFile)
    /* if(node){
      if(node.menuOption){
        if(node.menuOption.split(";").length>1){
          ////////////////////////////////////////console.log(node.menuOption.split(";"))
          if(node.children[0]["class"]!="menuOption"){
            //////////////////////////////////////console.log("dividir en dos opciones")
            splitInMenuOption(node)
          }else{
            //////////////////////////////////////console.log("añadir nueva opción")
            addNewMenuOption(node)
          }
        }
      }
    } */
    //////////////////////console.log(node)
    if(node["menuOption"]!=undefined){
      arrayMenuOptions=node["menuOption"].split(";")
      ////////////////console.log(arrayMenuOptions)
      configRows = configRows.filter(function( obj ) {
        return !arrayMenuOptions.includes(obj.option);
      });
      ////////////////console.log(configRows)
    }

    indexRows=await checkAskResults(configRows,node)
    ////////////////console.log(indexRows)
    if (origin=="table"){
      pageX=d3.select("#"+element.getAttribute("id").replace("_image","")).data()[0]["x"]
      pageY=d3.select("#"+element.getAttribute("id").replace("_image","")).data()[0]["y"]
    }else{
      //pageX=d3.event.pageX
      //pageY=d3.event.pageY
      //pageX=event.pageX
      //pageY=event.pageY
      //pageX=event.offsetX
      //pageY=event.offsetY
      pageX=event.pageX
      pageY=event.pageY
    }
    ////////////////////console.log(node["menuOption"])
/*     if(node["menuOption"]!=undefined){
      arrayMenuOptions=node["menuOption"].split(";")
      indexRows = indexRows.filter(function( obj ) {
        return !arrayMenuOptions.includes(obj.option);
      });
    } */
  
    if(founded.length==0){
      ////////////////console.log("addGraph")
      //throw new Error("Something went badly wrong!");
      ////////////////console.log(indexRows)
      indexRows=await addGraph(d3.select("#"+(element.getAttribute("id").replace("_image",""))).data()[0],pageX,pageY,indexRows)
      ////////////////console.log(indexRows)
      //////////////console.log(vis.data)
      vis.data=flatten(vis.treeData).flatData
      vis.initializeSimulation();
      vis.dataJoinGraph()
      vis.exitGraph()
    }else if(indexRows.length>0){
      //////////////console.log(indexRows)
      //throw new Error("Something went badly wrong!");
      indexRows=await addGraph(d3.select("#"+(element.getAttribute("id").replace("_image",""))).data()[0],pageX,pageY,indexRows)
      ////////////////console.log(vis.data)
      ////////////////console.log(vis.treeData)
      vis.data=flatten(vis.treeData).flatData
      vis.initializeSimulation();
      vis.dataJoinGraph()
      vis.exitGraph()
    }else{
      ////////////////console.log("else")
      if (founded[0]["children"]){
         if (element.getAttribute("root")=="1"){
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
          if (element.getAttribute("root")=="1"){
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
        handleNavigation(founded[0])

      }
      
    }
  }else{
    if (origin=="table"){
      if(element instanceof Element){
        pageX=d3.select("#"+element.getAttribute("id").replace("_image","")).data()[0]["x"]
        pageY=d3.select("#"+element.getAttribute("id").replace("_image","")).data()[0]["y"]
      }else{
        pageX=element["x"]
        pageY=element["y"]        
      }
    }else{
      pageX=d3.event.pageX
      pageY=d3.event.pageY
    }
    //////////////////////////////////////////////console.log("check queries")
    indexRows=await checkQueries(element,undefined,origin,pageX,pageY)
  }
  //alert("pasa por wrangle data")
  ////////////////console.log(indexRows)
  return indexRows
};

NetworkGraph.prototype.collapseAll = function () {
  var vis = this,i=0;
  var children;
  children=vis.data.nodes[0]["children"]
  ////////////////////////////console.log(children)
  children.forEach(function(d){
      //////////////////////////////////console.log("collapseBranch")
      i+=1
      ////////////////////////////console.log(i)
      vis.collapseBranch(d)
  })
  vis.data=flatten(vis.treeData).flatData
  ////////////////////////////////console.log(vis.data)
  ////////////////////////////////console.log(vis.treeData)
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

}

NetworkGraph.prototype.expandAll = function () {
  var vis = this;
  var children;
 
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

}
NetworkGraph.prototype.collapseBranch = function (node){
  var vis = this;
  var nodes=[]
  nodes.push(node.id)
  //node=vis.treeData.filter(d=>d.id==node.id)[0]
  ////////////////////////////console.log(node)
  collapseNode(node)

  //////////////////////////////console.log(vis.treeData)
  for (let i = 0; i < vis.treeData.length; i++) {
    //////////////////////////////////console.log(vis.treeData[i]["id"])
    //////////////////////////////////console.log(nodes)
    //////////////////////////////////console.log()
    if (nodes.includes(vis.treeData[i]["id"])){
      ////////////////////////////////console.log("entra en _children")
      ////////////////////////////////console.log(vis.treeData[i])
      vis.treeData[i]._children = vis.treeData[i].children;
      delete vis.treeData[i].children;
      if(vis.treeData[i]["id"]!=node.id){
        ////////////////////////////////console.log("entra en hidden")
        vis.treeData[i]["hidden"]=true
      }
    }
  }
  function collapseNode(node) {
    var position;
    //////////////////////////////console.log(node["children"])
    //////////////////////////////console.log(node["_children"])
    if(node){
      if(node["children"]){
        node["children"].forEach(function(d){
          //////////////////////////////console.log(d)
          position=nodes.indexOf(nodes.filter(function(item) {
            return (item.id == d.id)
          })[0])
          if(position==-1){
            nodes.push(d.id)
          }  
          //d=vis.treeData.filter(v=>v.id==d.id)[0]
          collapseNode(d)
        })
      }
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
