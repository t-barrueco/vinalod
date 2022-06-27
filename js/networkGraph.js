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

//const { default: convertLayerAtRulesToControlComments } = require("tailwindcss/lib/lib/convertLayerAtRulesToControlComments");

NetworkGraph = function (_parentElement, _data, _forces, _graphType,_configRow) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.forces = _forces
  this.graphType=_graphType
  this.configRow=_configRow
  this.initTypeVis()
};

/////////////////// initVis Method //////////////////////
NetworkGraph.prototype.initTypeVis = function () {
  var vis = this;
  vis.initVis();
};

NetworkGraph.prototype.initVis = function () {
  var vis = this,coorX,coorY;
  //////////////////////console.log("initVis")
  if(vis.data.treeData){
    vis.treeData=vis.data.treeData
    vis.allData=vis.data.allData
    vis.data=vis.data.flatData
  }
  vis.rootNode=vis.data.nodes[0]




  //REVISAR EL TAMAÑO DEL GRÁFICO
  //vis.width = +d3.select(this.parentElement).node().getBoundingClientRect().width;
  //////////////////////////////////////////////////////////////////console.log(vis.width)
  //vis.width=1400
  //////////////////////////////////////////////////////////////////console.log(d3.select("#graph-area").node().getBoundingClientRect().width)
  //vis.width=d3.select("#graph-area").node().getBoundingClientRect().width
  //vis.height = +d3.select(this.parentElement).node().getBoundingClientRect().height;
  //////////////////////////////////////////////////////////////////console.log(vis.height)
  vis.width=1400
  vis.height=800
  vis.svg = d3.select(this.parentElement).append("svg")
  .attr("class", "graph z-0")
  .attr("preserveAspectRatio","xMidYMid meet")
  .attr("viewBox", `0 0 ${vis.width} ${vis.height}`)
/*   .attr("width", vis.width)
  .attr("height", vis.height)
  .attr("viewBox", `${-vis.width/2} ${-vis.height/2} ${vis.width*2} ${vis.height*2}`) */
  //.attr("width", vis.width)
  //.attr("height", vis.height)
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
  vis.dragX=0
  vis.dragY=0
  vis.graphAdded=false
  vis.centerGraphX=0
  vis.centerGraphY=0
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
        .style('stroke','none')
        
  
  

  vis.g=vis.svg.append("g")
  .attr("class", "gMain")
  .attr("transform","translate(0,0)")

  vis.svg
  .on("mousemove", function (actual, i) {
      //vis.coorX=((d3.mouse(this)[0]) /vis.zoomScale )
      //vis.coorY=((d3.mouse(this)[1]) /vis.zoomScale )
      //vis.coorX=((d3.mouse(this)[0] - vis.centerGraphX-vis.dragX) /vis.zoomScale )
      //vis.coorY=((d3.mouse(this)[1] - vis.centerGraphY-vis.dragY) /vis.zoomScale )
      //////////////////////////////////console.log(vis.centerGraphX)
      ////////////////////////////////////console.log(vis.centerGraphY)
      //////////////////////////////////console.log(vis.dragX)
      ////////////////////////////////////console.log(vis.dragY)
      //////////////////////////////////console.log(d3.mouse(this)[0])
      ////////////////////////////////////console.log(d3.mouse(this)[1])
      //////////////////////////////console.log(vis.zoomScale)
      //////////////////////////////console.log(d3.mouse(this)[0])
      //////////////////////////////console.log(d3.mouse(this)[1])
      if(vis.centerGraphX!=0){
        //vis.coorX=(vis.centerGraphX/vis.zoomScale )
        //vis.coorY=(vis.centerGraphY /vis.zoomScale )
        vis.coorX=((d3.mouse(this)[0]-vis.centerGraphX-vis.dragX) /vis.zoomScale )
        vis.coorY=((d3.mouse(this)[1]-vis.centerGraphY-vis.dragY) /vis.zoomScale )
        //////////////////////////////////console.log(((d3.mouse(this)[0]-vis.centerGraphX-vis.dragX) /vis.zoomScale ))
        //////////////////////////////////console.log(((d3.mouse(this)[1]-vis.centerGraphY-vis.dragY) /vis.zoomScale ))
        //////////////////////////////////console.log(((d3.mouse(this)[0]-vis.dragX) /vis.zoomScale ))
        //////////////////////////////////console.log(((d3.mouse(this)[1]-vis.dragY) /vis.zoomScale ))
        vis.coorSinCenterX=((d3.mouse(this)[0]-vis.dragX) /vis.zoomScale )
        vis.coorSinCenterY=((d3.mouse(this)[1]-vis.dragY) /vis.zoomScale )
        vis.coorSinDragX=((d3.mouse(this)[0]-vis.centerGraphX) /vis.zoomScale )
        vis.coorSinDragY=((d3.mouse(this)[1]-vis.centerGraphY) /vis.zoomScale )
        //////////////////////////////////console.log(vis.coorSinCenterX)
        //////////////////////////////////console.log(vis.coorSinDragX)
      }else{
        vis.coorX=((d3.mouse(this)[0]-vis.dragX) /vis.zoomScale )
        vis.coorY=((d3.mouse(this)[1]-vis.dragY) /vis.zoomScale )
      }

/*       d3.select("#coor").remove()
      networkGraph.g.append("text")
          .attr("id","coor")
          .attr("x", vis.coorX-50)             
          .attr("y", vis.coorY-50)
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .text("coor"); */
      /* var tip2=document.getElementsByClassName("d3-tip2")[0]
      ////////console.log(tip2)
      tip2.style.top=vis.coorY+50
      tip2.style.left=vis.coorX+50 */
      /* d3.select("#coor").remove()
      networkGraph.g.append("text")
          .attr("id","coor")
          .attr("x", vis.coorX-50)             
          .attr("y", vis.coorY-50)
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .text("coor");

      d3.select("#coorSinCenter").remove()
      networkGraph.g.append("text")
          .attr("id","coorSinCenter")
          .attr("x", vis.coorSinCenterX)             
          .attr("y", vis.coorSinCenterY)
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .text("coorSinCenter");
      if(vis.coorSinDragX){
        d3.select("#coorSinDrag").remove()
        networkGraph.g.append("text")
            .attr("id","coorSinDrag")
            .attr("x", vis.coorSinDragX-50)             
            .attr("y", vis.coorSinDragY-50)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("coorSinDrag");
      } */
      
      //////////////////////////////////////console.log(vis.coorX)
      //////////////////////////////////////console.log(vis.coorY)
      ////////////////////////////////////////console.log(d3.mouse(this)[0])
      ////////////////////////////////////////console.log(d3.mouse(this)[1])
      //vis.coorX=700
      //vis.coorY=600

  })

    var dragSvg = d3.zoom()
    .scaleExtent([0.25, 2.5])
    .on("zoom", function(e){
      //////////////////////////////////////////console.log("on zoom")
      vis.zoomed.call(vis);
      vis.zoomScale=d3.event.transform.k
      return true;
    })
    .on("start", function(){
      //////////////////////////////////////////console.log("start")
      //var transform=vis.g.attr("transform")
      d3.select('body').style("cursor", "move");
      //////////////////////////////console.log(d3.event.transform.x)
      d3.event.transform.x=0
      d3.event.transform.y=0
      //vis.g.attr("transform",  "translate(-1000,-1000) scale("+vis.zoomScale+")") 
      ////////////////////////////////////////////console.log()
      //vis.g.attr("transform",  "translate("+vis.dragX+","+vis.dragY+") scale("+vis.zoomScale+")")
      //vis.g.attr("transform",  "translate(-100,-100) scale("+vis.zoomScale+")") 
    })
    .on("end", function(){
      vis.dragX=d3.event.transform.x
      vis.dragY=d3.event.transform.y
      vis.zoomScale=d3.event.transform.k

      if(vis.dblClickId){
        ////////////////////////////console.log(d3.select("#"+vis.dblClickId).data()[0]["x"])
        ////////////////////////////console.log(d3.select("#"+vis.dblClickId).data()[0]["y"])
      }
      d3.select('body').style("cursor", "auto"); 
    })
/*     .subject(function() { 
      var t = d3.select(this);
      return {x: t.attr("x"), y: t.attr("y")};
      //////////////////////////////////////////console.log("origin")
    }) ; */
  vis.gLinks=vis.g.append("g")
  .attr("class", "links")

  //vis.svg
  /* vis.g
  .call(vis.drag); */

  vis.svg.call(dragSvg)
  .on("dblclick.zoom", null);

  vis.gNodes=vis.g.append("g")
  .attr("class", "nodes")
  //.call(vis.drag);

  vis.gNodesRect=vis.g.append("g")
  .attr("class", "nodesRect")

  vis.gNodesFree=vis.g.append("g")
  .attr("class", "nodesFree")
      
  vis.colorCorrespondence={
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

   /*  networkGraph.colorScale.range(["#6EE7B7","#FCD34D","#F9A8D4","#93C5FD","#EF4444"])
    networkGraph.colorScale.domain(["uri","bnode","literal","menu option","basic graph"])
    colorScale=networkGraph.colorScale
    legend.addColors(colorScale) */
    //////////////////////console.log(vis.graphType)
    /* if(vis.graphType=="expert"){
      nodesClassesShow=["uri","bnode","literal","menu option","basic graph"]
      vis.colorScaleRange=["#6EE7B7","#FCD34D","#F9A8D4","#93C5FD","#EF4444"]
    } */
    if(vis.graphType=="basic"){
      //vis.colorScaleDomain=nodesClassesShow
      ////console.log(vis.nodesClassesShow)
      vis.nodesClassesShow=configFile.getClassesShow(vis.configRow)
      //console.log(vis.nodesClassesShow)
      vis.colorScaleRange=vis.colors.slice(0,Object.values(vis.nodesClassesShow).length)
    }else{
      vis.nodesClassesShow=["uri","bnode","literal","menu option","link basic graph","typed-literal"]
      nodesClassesCorrespondence={uri:"uri",bnode:"bnode",literal:"literal",link_basic_graph:"link basic graph","typed-literal":"typed-literal"}
      //vis.colorScaleDomain=["uri","bnode","literal","menu option","basic graph"]
      vis.colorScaleRange=["#6EE7B7","#FCD34D","#F9A8D4","#93C5FD","#EF4444","#F9A8D4"]
      //vis.colorScaleRange=["#10B981","#EF4444","#F59E0B","#EC4899","#8B5CF6"]
    }
    vis.colorScaleDomain=Object.values(vis.nodesClassesShow)
    //////////////////////console.log(vis.colorScaleDomain)
   
    vis.colorScale = d3.scaleOrdinal()
    .domain(vis.colorScaleDomain)
    .range(vis.colorScaleRange)

    //colorScale=vis.colorScale
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
  ////////////////////////////////////////////console.log("zoomed")
  textImageZoom(d3.event.transform.k)
  //////////////////////////////////////////console.log(d3.event.transform.x)
  //////////////////////////////////////////console.log(vis.dragX)
  //vis.g.attr("transform", d3.event.transform)
  //////////////////////////////////////console.log("----MIENTRAS SE HACE ZOOM-----")

  
  //////////////////////////////console.log("transform.x: "+d3.event.transform.x)
  //////////////////////////////console.log("transform.y: "+d3.event.transform.y)
  //////////////////////////////console.log("dragX: "+vis.dragX)
  //////////////////////////////console.log("dragY: "+vis.dragY)
  //////////////////////////////console.log("centerX: "+vis.centerGraphX)
  //////////////////////////////console.log("centerY: "+vis.centerGraphY)
  ////////////////////////////////////////console.log("d3.event.transform.x+vis.dragX: "+(d3.event.transform.x+vis.dragX))
  ////////////////////////////////////////console.log("d3.event.transform.y+vis.dragY: "+(d3.event.transform.y+vis.dragY))
  ////////////////////////////////////////console.log("translate("+(d3.event.transform.x+vis.dragX)+","+(d3.event.transform.y+vis.dragY)+") scale(" + d3.event.transform.k + ")")
  /* if(((vis.dragX<0)&&(d3.event.transform.x<0))||((vis.dragX>0)&&(d3.event.transform.x>0))){
    vis.g.attr("transform","translate("+(d3.event.transform.x)+","+(d3.event.transform.y)+") scale(" + d3.event.transform.k + ")")
  }else{
    vis.g.attr("transform","translate("+(d3.event.transform.x+vis.dragX)+","+(d3.event.transform.y+vis.dragY)+") scale(" + d3.event.transform.k + ")")
  } */
  //if(vis.graphAdded){
    //vis.g.attr("transform","translate("+(d3.event.transform.x+vis.dragX)+","+(d3.event.transform.y+vis.dragY)+") scale(" + d3.event.transform.k + ")")
  //  vis.g.attr("transform","translate("+(vis.dragX)+","+(vis.dragY)+") scale(" + d3.event.transform.k + ")")

    //vis.graphAdded=false
  //}else{
  //  vis.g.attr("transform","translate("+(d3.event.transform.x)+","+(d3.event.transform.y)+") scale(" + d3.event.transform.k + ")")
  //}
  //////////////////////////////console.log(d3.event.transform.k)
  //////////////////////////console.log(vis.centerGraphX)
  if(vis.centerGraphX==0){
    vis.g.attr("transform","translate("+(d3.event.transform.x)+","+(d3.event.transform.y)+") scale(" + d3.event.transform.k + ")")
  }else{
    vis.g.attr("transform","translate("+(d3.event.transform.x+vis.centerGraphX)+","+(d3.event.transform.y+vis.centerGraphY)+") scale(" + d3.event.transform.k + ")")
  }
    /* if(vis.centerGraphX==0){
    ////////////////////////console.log("if")
    vis.g.attr("transform","translate("+(d3.event.transform.x)+","+(d3.event.transform.y)+") scale(" + d3.event.transform.k + ")")
  }else{
    ////////////////////////console.log("else")
    ////////////////////////////////console.log(vis.dragX)
    ////////////////////////////////console.log(vis.dragY)
    ////////////////////////////////console.log(vis.centerGraphX)
    ////////////////////////////////console.log(vis.centerGraphY)
    //alert("dragX"+vis.dragX)
    //alert("centerDrag"+vis.centerGraphX)
    ////////////////////////console.log(d3.event.transform)
    if(d3.event.transform.k==1){
      vis.g.attr("transform","translate("+(d3.event.transform.x-vis.dragX+vis.centerGraphX)+","+(d3.event.transform.y-vis.dragY+vis.centerGraphY)+") scale(" + d3.event.transform.k + ")")
    }else{
      vis.g.attr("transform","translate("+(d3.event.transform.x-vis.dragX)+","+(d3.event.transform.y-vis.dragY)+") scale(" + d3.event.transform.k + ")")
    }
    //vis.g.attr("transform","translate("+(d3.event.transform.x-vis.dragX+vis.centerGraphX)+","+(d3.event.transform.y-vis.dragY+vis.centerGraphY)+") scale(" + d3.event.transform.k + ")")
  } */
  //vis.dragX=d3.event.transform.x+vis.dragX
  //vis.dragY=d3.event.transform.y+vis.dragY
  //if((vis.dblClickId)&&(vis.addingGraph)){
/*   if(d3.event.transform.x!=0){
    vis.g.attr("transform","translate("+(d3.event.transform.x+vis.dragX)+","+(d3.event.transform.y+vis.dragY)+") scale(" + d3.event.transform.k + ")")
  }else{
    vis.g.attr("transform", d3.event.transform)
  } */
  //d3.select(".gMain")
  //  .attr("transform", 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
};

/* NetworkGraph.prototype.dragmove = function(d) {
  var vis = this;

  d.x += d3.event.dx;
  d.y +=  d3.event.dy;
  vis.attr("transform", function(d){
    return "translate(" + d.x + "," + d.y + ")";})
}; */

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

  vis.simulation.alphaMin(0.7)

  vis.simulation.on("tick", ticked)
  .on("end",function(){
    ////////////////////////console.log(vis.dblClickId)
    ////////////////////////console.log(vis.addingGraph)
    if((vis.dblClickId)&&(vis.addingGraph)){
      ////////////////////////console.log("entra")
      vis.g.bbox = vis.g.node().getBBox();
      ////////////////////////console.log(vis.g.bbox)
      vis.g.vx = vis.g.bbox.x;		// container x co-ordinate
      vis.g.vy = vis.g.bbox.y;		// container y co-ordinate
      vis.g.vw = vis.g.bbox.width;	// container width
      vis.g.vh = vis.g.bbox.height;	// container height

      let transformGet=getTransform()

      ////////////////////////console.log(transformGet)

      vis.g.transition()
      .attr("transform", "translate(" + transformGet.translate + ")scale(" + transformGet.scale + ")");

      vis.centerGraphX=transformGet.translate[0]
      vis.centerGraphY=transformGet.translate[1]
      vis.dragX=0
      vis.dragY=0

      highlightTargetNodes(d3.select("#"+vis.dblClickId.replace("_g","")).data()[0])

      vis.addingGraph=false
     
    }

    function getTransform() {
      //////////////////console.log(vis.dblClickId)
      bbox = d3.select("#"+vis.dblClickId).node().getBBox();
      var bx = bbox.x;
      bx=d3.select("#"+vis.dblClickId).data()[0]["x"]
      var by = bbox.y;
      by=d3.select("#"+vis.dblClickId).data()[0]["y"]
      var bw = bbox.width;
      var bh = bbox.height;
/*       networkGraph.g.append("text")
            .attr("id","mitad pantalla")
            .attr("x", bx)             
            .attr("y", by)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("posición nodo");
      networkGraph.g.append("text")
            .attr("id","mitad pantalla")
            .attr("x", d3.select("#"+vis.dblClickId).data()[0]["x"])             
            .attr("y", d3.select("#"+vis.dblClickId).data()[0]["y"])
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("posición nodo2"); */
      var tx = -bx*vis.zoomScale + vis.g.vx + vis.g.vw/2 - bw*vis.zoomScale/2;
      var ty = -by*vis.zoomScale + vis.g.vy + vis.g.vh/2 - bh*vis.zoomScale/2;
      return {translate: [tx, ty], scale: vis.zoomScale}
    }
  });    

  vis.updateForces();

  function ticked() {
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

    //d3.select('#alpha_value').style('flex-basis', (vis.simulation.alpha()*100) + '%');
    //////////////////////////////////////////////////console.log(vis.simulation.alpha())
    //////////////////////////////////////////////////console.log(vis.simulation.alpha().toFixed(3))
    //if(vis.simulation.alpha().toFixed(1)==0.1){
      //////////////////////////////////////////////////console.log("alpha0")
    //  vis.nodeCircle.attr("transform", "translate(0,0)") 
      //vis.g.attr("transform", "translate(0,0)")
    //}
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
      .links(vis.forceProperties.link.enabled ? vis.data.links : [])
      /* .on('end', function() {
        // layout is done
        "end simulation"
      }); */
  
  vis.simulation.alpha(1).restart();
  //vis.simulation.alphaTarget(0.5);
}

// generate the svg objects and force simulation
NetworkGraph.prototype.initializeDisplay = function() {
  var vis = this,text;

  //tooltip for the bubbles
  //if class=free call the function that gets tooltip for free graph
  //if class!=free then is basic graph and call tooltip for basic graph
  //if no class then is a tooltip for a menu in the graph
  /* ////////console.log("create tip")
  vis.tip = d3.tip()
  .attr('class', 'd3-tip z-50')
  //.offset([200,200])
  .offset(function() {
    //////////console.log(document.getElementsByClassName("d3-tip")[0].style.top)
    //////////console.log(document.getElementsByClassName("d3-tip")[0].style.left)
    //document.getElementsByClassName("d3-tip")[0].style.top=vis.coorY
    //document.getElementsByClassName("d3-tip")[0].style.left=vis.coorX
    //////////console.log(vis.coorX)
    //////////console.log(vis.coorY)
    //if(parseInt(document.getElementsByClassName("d3-tip")[0].style.top.replace("px",""))<0){
    //  return [300,300]
    //}
    //let tipTop=parseInt(document.getElementsByClassName("d3-tip")[0].style.top.replace("px",""))
    //let tipLeft=parseInt(document.getElementsByClassName("d3-tip")[0].style.left.replace("px",""))

    //let tipTop=parseInt(document.getElementsByClassName("d3-tip")[0].style.top.replace("px",""))
    //let tipLeft=parseInt(vis.coorX-document.getElementsByClassName("d3-tip")[0].style.left.replace("px",""))
    //////////console.log(vis.coorX-tipLeft)
    //return [-30,-50]
    //return [this.getBBox().height / 2, 0]
    //////////console.log(vis.coorX-tipLeft-50)
    //return [vis.coorX-tipLeft-50,vis.coorY-tipTop-50]
    ////////console.log(document.getElementsByClassName("gMain")[0])
    ////////console.log(vis.centerGraphX)
    ////////console.log(vis.centerGraphY)
    return [-50,-50]
    return [2*vis.centerGraphX,2*vis.centerGraphY]
  })
  .html(function (d) {
    //////////////////console.log(d)
    if(d){
      if(d["class"]){
        if(d["class"]=="free"){
          text=getTooltipTextFreeGraph(d)
       }else{
          text=getTooltipText(d)
       }
      }else if((d["source"])&&(d["target"])){
        text=getTooltipTextFreeGraph(d)
      }else{
        text=getTooltipMenu(d)
      }
    return text;
    }
  });
  ////////console.log(d3.select(".d3-tip")[0])
  if(!d3.select(".d3-tip")[0]){
    vis.g.call(vis.tip);
  } */
  if(!document.getElementsByClassName("tooltip")[0]){
    vis.tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0)
  }
  


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

  ////////////////////console.log(vis.treeData)
  ////////////////////console.log(vis.data)

  vis.link=vis.linkSel
  .data(vis.data.links,function(d){
    //////////////////////////console.log(d.id)
    return d.id;
  })
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

  //////////////////////console.log(vis.data.nodes)
  vis.nodeCircle=vis.circleSel
  .data(vis.data.nodes.filter(function(item) {
    return item["class"] != "free"
  }), function(d) { return d.id; })

  ////////////////////console.log(vis.nodeCircle)
  vis.circleSelFree=vis.gNodesFree
  .selectAll('.nodeCircleFree')

  vis.nodeCircleFree=vis.circleSelFree
  .data(vis.data.nodes.filter(function(item) {
    return item["class"] == "free"
  }), function(d) { return d.id; })

}

NetworkGraph.prototype.enterGraph = function(){
    var vis=this,r;
    let lineHeight = 12;
    //console.log(vis.nodesClassesShow)
    //console.log(vis)
    //vis.nodesClassesShow=configFile.getClassesShow(vis.configRow)
    console.log(Object.values(vis.nodesClassesShow))
    console.log(vis.colors)
    vis.colorScale.domain(Object.values(vis.nodesClassesShow))
    vis.colorScale.range(vis.colors.slice(0,Object.values(vis.nodesClassesShow).length))
    //console.log(vis.colorScale.range())
    
  
    //colorScale=vis.colorScale
    console.log(vis.colorScale.domain())
    //console.log(vis.colorScale.range())
    vis.isDblclick = false;
  
    vis.timeoutTiming = 500;

    drawLinks()

    //these arrow lines will shown only in free graph
    drawArrowLinesFree()  
    console.log(vis.colorScale.domain())
    drawCirclesBasic()
    console.log(vis.colorScale.domain())
    addTextForCircles()
    drawImageCirclesBasic()
    drawCirclesFree()
    drawImageClusterFree()

    console.log(vis.colorScale.domain())

      
      function drawLinks(){
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
            //////////////////console.log(d)
            if(d["target"]["class"]=="free"){
              //vis.tip.show(d,this);
              ////////console.log(d)
              addTooltip(getTooltipTextFreeGraph(d))
            }
          })
          .attr("id",function(d){
            return (d.source.id+"_"+d.target.id)
          })
          .on('mouseout', function(d){
            if(d["target"]["class"]=="free"){
              //vis.tip.hide(d,this);
              deleteTooltip()
            }
          });    
      }
      function drawArrowLinesFree(){
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

        ////console.log(vis.edgelabels)
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
      }
      function drawCirclesBasic(){
        vis.nodeCircle=vis.nodeCircle
        .enter().append("g")
        .attr("class", "nodeCircleBasic")
        .attr("id",function(d){
          return (d.id+"_g")
        })
        console.log(vis.colorScale.domain())
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
        .attr("r", function(d){
          if(!d.number){
            if((d.more_results!="")&&(d.more_results!=undefined)){
              //return vis.sizeNode(d.more_results)
              return 50;
            }else{
              //return vis.sizeNode(d.number)
              return 17;
            }
          }else{
            return vis.sizeNode(d.number)
          }
          })
        .attr("stroke", function(d){
          return "grey"
        })
        .attr("stroke-width", "1px")
        .style("fill", function(d){ 
           //console.log(d)
           console.log(vis.colorScale.domain())
           //////////////////console.log(d.class)
           //////////////////console.log(nodesClassesCorrespondence)
           //////////////////console.log(vis.colorScale(nodesClassesCorrespondence[d.class]))
           console.log(vis.colorScale.range())

           test=vis.colorScale(d.className)

           console.log(vis.colorScale.domain())
           return test;

        })
        //.on('mouseover', function(d){
          //vis.tip.show(d,this);
          //handleMouseover(d,this.getAttribute("id"))
        //})
        //.on('mouseout', function(d){
          //vis.tip.hide(d,this);
          //handleMouseout(d,this.getAttribute("id"))
        //})
        .on('clickout', function(d){
        })
        .on("click",function(){
          handleClickEvent(this)    
        })
        .on('dblclick', function(){
          console.log(vis.colorScale.domain())
          //////////////////////////////////////////////////console.log(d3.mouse(this))
          handleDblClickEvent(d3.mouse(this)[0],d3.mouse(this)[1],this.getAttribute("id"))
          if(get_node_from_element(this.getAttribute("id"))["class"]!="menuOption"){
            vis.wrangleData(this,"bubble",d3.event);
          }
          console.log(vis.colorScale.domain())
          //////////////////////////////////////////////////console.log(d.x)
          return false;
        })
        /* .on("dblclick.zoom", function(d) { 
          d3.event.stopPropagation();
          //////////////////////////////////////////////////console.log(d.x)
          //var dcx = (window.innerWidth/2-d.x*zoom.scale());
          //var dcy = (window.innerHeight/2-d.y*zoom.scale());
          var dcx = (window.innerWidth/2-vis.coorX);
          var dcy = (window.innerHeight/2-vis.cooY);
          //////////////////////////////////////////////////console.log(dcx)
          //////////////////////////////////////////////////console.log(dcy)

          //vis.g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
          vis.g.attr("transform", "translate("+ dcx + "," + dcy  + ")");

          vis.dragX=d3.event.transform.x
          vis.dragY=d3.event.transform.y
          vis.zoomScale=d3.event.transform.k
           
        }) */
        .on('contextmenu', (d) => {
          d3.event.preventDefault();
          getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        })
        console.log(vis.colorScale.domain())
        //.call(d3.drag()
        //        .on("start", dragstarted)
        //        .on("drag", dragged)
        //        .on("end", dragended));

      }
      function addTextForCircles(){
        vis.textCircle=vis.nodeCircle
            .append("text")
            .attr("class","nodeCircleText")
            .attr("id",function(d){
              return (d.id)+"_text"
            })       
            .attr("transform", 
            function(d){
              textRadiusText=textRadius(lines(words(d.value),d.value))
              return `translate(${-vis.sizeNode(d.number)/1.2},${-(textRadiusText/vis.sizeNode(d.number))/1.2}) scale(${vis.sizeNode(d.number) / textRadiusText})`
            })
            .attr('opacity', function(d) {
                  if(vis.zoomScale>1.5){
                    return 1;
                  }else{
                    return 0;
                  }
                      })
        vis.textCircle
            .selectAll("tspan")
            .data(function(d){
              return lines(words(d.value),d.value)
            })
            .enter().append("tspan")
              .attr("x", 0)
              .attr("y", (d, i) => (i - lines.length / 2 + 0.8) * lineHeight)
              .text(d => d.text);
      }
      function drawImageCirclesBasic(){
        var event={};
        vis.nodeCircleImage=vis.nodeCircle.append("svg:image")
        .attr("class", "nodeCircleImage")
        .attr("id",function(d){
          return (d.id+"_image")
        })
        .attr("xlink:href", function(d){
          let bubbleImg=bubbleImage(d)
          ////////////////////////console.log(bubbleImg)
          return bubbleImg;
        })
        .attr("x",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("y",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("width",function(d){return (vis.sizeNode(d.number)*1.5)+"px"})
        .attr("height",function(d){return (vis.sizeNode(d.number)*1.5)+"px"})
        .on('dblclick', function(d){
          //////////////////////////////////////////////////console.log(d3.mouse(this))
          handleDblClickEvent(d3.mouse(this)[0],d3.mouse(this)[1],this.getAttribute("id"))
          ////////////////////////////////////////////////console.log(this)
          if(get_node_from_element(this.getAttribute("id").replace("_image",""))["class"]!="menuOption"){
            event.pageX=d3.mouse(vis.g.node())[0]
            event.pageY=d3.mouse(vis.g.node())[0]

            var dcx = (window.innerWidth/2-d.x*vis.zoomScale);
            var dcy = (window.innerHeight/2-d.y*vis.zoomScale);
            //////////////////////////////////////////////////console.log(d.x)
            //////////////////////////////////////////////////console.log(d.y)
            //////////////////////////////////////////////////console.log(dcx)
            //////////////////////////////////////////////////console.log(dcy)
            ////////////////////////////////////////////////console.log(this)
            vis.wrangleData(this,"bubble",d.x + dcx,d.y + dcy);
          }
          return false;
        })
        /* .on("dblclick.zoom", function(d) { 
          d3.event.stopPropagation();
          //////////////////////////////////////////////////console.log(d.x)
          //var dcx = (window.innerWidth/2-d.x*zoom.scale());
          //var dcy = (window.innerHeight/2-d.y*zoom.scale());
          var dcx = (window.innerWidth/2-vis.coorX);
          var dcy = (window.innerHeight/2-vis.coorY);
          //////////////////////////////////////////////////console.log(dcx)
          //////////////////////////////////////////////////console.log(dcy)

          //vis.g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
          vis.g.attr("transform", "translate("+ dcx + "," + dcy  + ")");

          vis.dragX=d3.event.transform.x
          vis.dragY=d3.event.transform.y
          vis.zoomScale=d3.event.transform.k
        }) */
        .on('mouseover', function(d){
          handleMouseover(d,this.getAttribute("id").replace("_image",""))
        })
        .on('mouseout', function(d){
          handleMouseout(d,this.getAttribute("id").replace("_image",""))
        })
        .on("click",function(d){
          handleClickEvent(document.getElementById(this.getAttribute("id").replace("_image","")))
        })
        .on('contextmenu', (d) => {
          d3.event.preventDefault();
          getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        })
        .attr('opacity', function(d) {
          if(vis.zoomScale>1.5){
            return 0;
          }else{
            return 1;
          }
          
        })
      }

      function drawCirclesFree(){
        vis.nodeCircleFree=vis.nodeCircleFree
        .enter().append("g")
        .attr("class",function(d){
          if((d.more_results!="")&&(d.more_results!=undefined)){
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
              if((d.more_results!="")&&(d.more_results!=undefined)){
                return d.class + " nodeCircleCircleFree cluster"
              }else{
                return d.class + " nodeCircleCircleFree"
              }
            }) 
            .attr("r", function(d){
              if((d.more_results!="")&&(d.more_results!=undefined)){
                ////////////////////console.log(vis.sizeNode(d.more_results))
                //return vis.sizeNode(d.more_results)
                return 25;
              }else{
                //return vis.sizeNode(d.number)
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
              //////////////////////console.log(d.type)
              return vis.colorScale(d.type)
              
/*               if(d.type=="menuOption"){
                return "#93C5FD"
              }else if(d.configRow!=""){
                return "#A855F7";
              }else if(d.type=="uri"){
                return "#6EE7B7";
              }else if(d.type=="bnode"){
                return "#FCD34D";
              }else{
                return "#F9A8D4";
              } */
            })
            .on('mouseover', function(d){
              //vis.tip.show(d,this);
              //addTooltip(d)
              addTooltip(getTooltipTextFreeGraph(d))
            })
            .on('mouseout', function(d){
              //vis.tip.hide(d,this);
              deleteTooltip()
            })
            .on('clickout', function(d){
            })
            .on("click",function(d){
              var element=this
              timer = setTimeout(function() {
                if (!prevent) {
                  clickBubbleFreeGraph(element,vis.data)
                }
                prevent = false;
              }, delay);
            })
            .on('dblclick', function(d){
              ////////////////////////////////////////////////console.log(this)

              d3.event.stopPropagation();
              d3.event.preventDefault();
              if((d.type=="uri")||(d.type=="bnode")){
                clearTimeout(timer);
                prevent = true;
                vis.wrangleData(this,"bubble");
                return false;
              }
            })
            .on('contextmenu', (d) => {
              //if(d.type=="uri"){
                d3.event.preventDefault();
                getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
              //}
            })
            //.call(d3.drag()
            //        .on("start", dragstarted)
            //        .on("drag", dragged)
            //        .on("end", dragended));
      }
      function drawImageClusterFree(){
        d3.selectAll(".g-cluster")
        .append("svg:image")
        .attr("class", "clusterImage")
        .attr("id",function(d){
          return (d.id+"_image")
        })
        .attr("xlink:href", function(d){
          return "images/bubbles.svg";
        })
        .attr("x","-25px")
        .attr("y","-25px")
        .attr("width","50px")
        .attr("height","50px")
        .on('mouseover', function(d){
          //vis.tip.show(d,this);
          addTooltip(getTooltipTextFreeGraph(d))
        })
        .on('mouseout', function(d){
          //vis.tip.hide(d,this);
          deleteTooltip()
        })
        .on('clickout', function(d){
        })
        .on("click",function(d){
          var element=this
          timer = setTimeout(function() {
            if (!prevent) {
              clickBubbleFreeGraph(element,vis.data)
            }
            prevent = false;
          }, delay);
        })
        .on('dblclick', function(d){
          ////////////////////////////////////////////////console.log(this)

          d3.event.stopPropagation();
          d3.event.preventDefault();
          if((d.type=="uri")||(d.type=="bnode")){
            clearTimeout(timer);
            prevent = true;
            vis.wrangleData(this,"bubble");
            return false;
          }
        })
        .on('contextmenu', (d) => {
          //if(d.type=="uri"){
            d3.event.preventDefault();
            getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
          //}
        })
        //.call(d3.drag()
        //        .on("start", dragstarted)
        //        .on("drag", dragged)
        //        .on("end", dragended));

      }
      function handleDblClickEvent(mouseX,mouseY,id){
        d3.event.stopPropagation();
        d3.event.preventDefault();
        clearTimeout(timer);
        prevent = true;
        //////////////////////////////////////////console.log(id)
        vis.dblClickId=id.replace("_image","")
        //////////////////////////////////////////////////console.log(mouseX)
        //////////////////////////////////////////////////console.log(mouseY)
        //vis.coorX=((mouseX - vis.dragX) /vis.zoomScale )
        //vis.coorY=((mouseY - vis.dragY) /vis.zoomScale )
      }
      function handleClickEvent(element){
          ////////////////////////////console.log(d3.select("#"+element.getAttribute("id")+"_g"))
/*           var transform=d3.select("#"+element.getAttribute("id")+"_g").attr("transform")
          translate = transform.substring(transform.indexOf("(")+1, transform.indexOf(")")).split(",");
          var transform2=d3.select(".gMain").attr("transform")
          if(transform2){
            translate2 = transform2.substring(transform2.indexOf("(")+1, transform2.indexOf(")")).split(",");
            scale = transform2.substring(transform2.indexOf("(",transform2.indexOf(")")+1)+1, transform2.indexOf(")",transform2.indexOf(")")+1));
          } */
          
          //////////////////console.log(prevent)
          timer = setTimeout(function() {
          if (!prevent) {
              if (element.getAttribute("stroke-width")=="1px"){
              clickBubbleFreeGraph(element,vis.data)
              }else{
              unclickBubbleFreeGraph()
              };
          }
          prevent = false;
          }, delay);
      }

      function handleMouseover(data,circleId){
        //vis.tip.offset([-20,20]); 
        //vis.tip.show(data,this);

        addTooltip(getTooltipText(data))

	
        //////////console.log(vis.tip)
        //document.getElementsByClassName("d3-tip")[0].style.top=vis.coorY+50
        //document.getElementsByClassName("d3-tip")[0].style.left=vis.coorX+50

        d3.select("#"+circleId)
        .transition()
        .attr("r", function(d) { 
          r=vis.sizeNode(d.number)*2
          return r;
        })

        d3.select("#"+circleId+"_image")
        .transition()
        .attr("x",function(d){return "-"+(r-5)+"px"})
        .attr("y",function(d){return "-"+(r-5)+"px"})
        .attr("height", function(d) { 
          return (vis.sizeNode(d.number)*1.5*2)+"px";
        })
        .attr("width", function(d) { 
          return (vis.sizeNode(d.number)*1.5*2)+"px";
        })
      }
      function handleMouseout(data,circleId){
        //vis.tip.hide(data,this);
        deleteTooltip()
        d3.select("#"+circleId)
        .transition()
        .attr("r", function(d) { 
          return vis.sizeNode(d.number);})
        d3.select("#"+circleId+"_image")
        .transition()
        .attr("x",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("y",function(d){return "-"+(vis.sizeNode(d.number)-4)+"px"})
        .attr("width", function(d) { 
          return (vis.sizeNode(d.number)*1.5)+"px";
        })
        .attr("height", function(d) { 
          return (vis.sizeNode(d.number)*1.5)+"px";
        })
      }    
/*       function dragstarted(d) {
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
      } */
      function words(text){
        const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
        if (!words[words.length - 1]) words.pop();
        if (!words[0]) words.shift();
        return words;
      }
      function lines(words,text){
        let targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight)
        let line;
        let lineWidth0 = Infinity;
        const lines = [];
        for (let i = 0, n = words.length; i < n; ++i) {
          let lineText1 = (line ? line.text + " " : "") + words[i];
          //////////////////////////////////////////////////////////////////////////console.log(lineText1)
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
        ////////////////////////////////////////////////////////////////////////console.log(lines)
        return lines;
      }
/*       function longestString(strs) {
        return strs.sort(function(a, b) {return b.length - a.length})[0];
      } */
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
        ////////////////////////////////////////////////////////////////////////console.log(text)
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

  d3.select(".contextMenu").remove();
  vis.g
      .append('g').attr('class', "contextMenu z-50")
      .selectAll("tmp")
      .data(menuItems).enter()
      .append('g').attr('class', "menuEntry")
      .style({'cursor': 'pointer'});
  
  //addRect
  d3.selectAll(".menuEntry")
      .append('rect')
      .attr('uri',data[data["class"]+"_uri"])
      .attr('x', vis.coorX)
      .attr('y', (d, i) => { 
        return vis.coorY + (i * 30); })
      .attr('rx', 2)
      .attr('width', width)
      .attr('height', 30)
      .on('click', (d) => { 
        deleteTooltip()
        let p = d3.selectAll(".d3-tip");
        p.each(function () {
          this.style.opacity = "0"
        })
        d.action(data,d)

      })
      .on('mouseover', function(d){
        if(configFile.file.filter(v=>v.option==d.title).length>0){
          //vis.tip.show(getCommentOption(d.title),this);
          ////////console.log(getTooltipMenu(getCommentOption(d.title)))
          addTooltip(getTooltipMenu(getCommentOption(d.title)));

        }else{
          //vis.tip.show(getTooltip(d.title,uri),this);
          addTooltip(getTooltip(d.title,uri));
        }
        d3.select(this).style("fill","#DCDDF5")
      })
      .on('mouseout', function(d){
        //vis.tip.hide(d,this);
        deleteTooltip()
        d3.select(this).style("fill","white")
      });

  d3.selectAll(".menuEntry")
      .append('text')
      .text((d) => { 
        return d.title; })
      .attr('uri',data[data["class"]+"_uri"])
      .attr('x', vis.coorX)
      .attr('y', (d, i) => { return vis.coorY + (i * 30); })
      .attr('dy', 20)
      .attr('dx', 25)
      .style("font-size", "12px")
      .on('click', (d) => { 
        deleteTooltip()

        d3.selectAll(".d3-tip").each(function () {
          this.style.opacity = "0"
        })

        d.action(data,d) })
      .on('mouseover', function(d){
        if(configFile.file.filter(v=>v.option==d.title).length>0){
          //vis.tip.show(getCommentOption(d.title),this);
          //addTooltip(getCommentOption(d.title))
          addTooltip(getTooltipMenu(getCommentOption(d.title)));
        }else{
          //vis.tip.show(getTooltip(d.title,uri),this);
          //addTooltip(getTooltip(d.title,uri))
          addTooltip(getTooltip(d.title,uri));

        }
        d3.select(this).style("fill","#DCDDF5")
      })
      .on('mouseout', function(d){
        //vis.tip.hide(d,this);
        deleteTooltip()
      });

  function getTooltip(title,uri){
    //////////////////console.log(title)
    if(title.match("Sparql Endpoint: (.*) and Position:")){
      url = title.match("Sparql Endpoint: (.*) and Position:")[1]; 
      subjectObject=title.match("and Position: (.*)")[1];
      if(subjectObject=="s"){
        textTooltip="Find all objects for the URI :" + uri + " in the SPARQL EndPoint: "+url
      }else{
        textTooltip="Find all subjects for the URI :" + uri + " in the SPARQL EndPoint: "+url
      }
      return getTooltipMenu(textTooltip)
      //sreturn textTooltip
    }

  }

}
NetworkGraph.prototype.exitGraph = function(){
    var vis=this;
    vis.link.exit().remove();

    vis.nodeCircle.exit().remove();
    if(vis.graphType=="expert"){
      vis.edgepaths.exit().remove();
    }
}

NetworkGraph.prototype.wrangleData = async function (element,origin,pageX,pageY) {
  var vis = this;
  var children;
  //,pageX,pageY,
  var founded,indexRows=1,node,configRows=0,arrayMenuOptions,option
  //////////////////////////////////////////////////////console.log("wrangleData")
  if(element instanceof Element){
    founded=findNodeTreemap(element.getAttribute("id").replace("_image",""),vis.treeData)
    node=get_node_from_element(element.getAttribute("id").replace("_image",""))
  }else{
    founded=findNodeTreemap(element,vis.treeData)
    node=element
  }
  ////////console.log(node)
  //bubble clicked is from basic graph
  if(node.class!="free"){
    ////////////////////console.log(nodesClassesCorrespondence)
    //console.log(node)
    configRows=configFile.getRowsNodeClass(node["className"])
    //configRows=get_configRows_class(nodesClassesCorrespondence[node["class"]])
    //console.log(configRows)
    //filter configRows if menu options have been clicked before
    if(node["menuOption"]!=undefined){
      arrayMenuOptions=node["menuOption"].split(";")
      configRows = configRows.filter(function( obj ) {
        return !arrayMenuOptions.includes(obj.option);
      });
    }
    hideSpinMessage(interval)
    var interval=showSpinMessage("Checking if there are results for this node...")
    //filter rows that have results
    ////console.log(configRows)
    indexRows=await checkAskResults(configRows,node)
    //////console.log(indexRows)
    hideSpinMessage(interval)

    if (origin=="table"){
      pageX=d3.select("#"+element.getAttribute("id").replace("_image","")).data()[0]["x"]
      pageY=d3.select("#"+element.getAttribute("id").replace("_image","")).data()[0]["y"]
    }
    checkQueriesBasic()
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
    hideSpinMessage(interval)
    var interval=showSpinMessage("Checking if there are results for this node...")
    indexRows =await checkAskResultsFreeGraph(element, subjectObject)
    hideSpinMessage(interval)

    if (node.menuOption != undefined) {
      filterResultRows()
    }
    checkQueriesExpert()
  }

  return indexRows

  function filterResultRows() {
    var menuOption = node.menuOption.split(";")
    menuOption.forEach(function (d) {
      d = d.split(",")
      resultRows = resultRows.filter(function (r) {
        return (r.uri != node.value) || (r.url != d[0]) || (r["subject-object"] != d[1])
      })
    })

  }
  function checkQueriesBasic(){
    //console.log(indexRows)
    if(founded.length==0){
      addGraph(d3.select("#"+(element.getAttribute("id").replace("_image",""))).data()[0],indexRows)
      vis.data=flatten(vis.treeData).flatData
      vis.initializeSimulation();
      vis.dataJoinGraph()
      vis.exitGraph()
      //////console.log(indexRows)
    }else if(indexRows.length>0){
      if(founded[0]["_children"]){
        option=node.menuOption.split(";")[0]
        indexRows.push({"position":configFile.findIndex(d=>d.option==option),"option":configFile.filter(d=>d.option==option)[0]["option"],"option_text":configFile.filter(d=>d.option==option)[0]["option_text"]})
      }
      addGraph(d3.select("#"+(element.getAttribute("id").replace("_image",""))).data()[0],indexRows)
      vis.data=flatten(vis.treeData).flatData
      vis.initializeSimulation();
      vis.dataJoinGraph()
      vis.exitGraph()
      ////////////////////////////////////////////////////console.log(node)
    }else{
      //////////////////////////////////////////////////////console.log("else")
      if (founded[0]["children"]){
         if (element.getAttribute("root")=="1"){
            children=founded[0]["children"]
            children.forEach(function(d){
              vis.collapseNodeBranch(d)
            })
          }else{
            vis.collapseNodeBranch(founded[0])
          }
          vis.data=flatten(vis.treeData).flatData
          vis.initializeSimulation();
          vis.dataJoinGraph()
          vis.exitGraph()
    
        }else{
          if (element.getAttribute("root")=="1"){
            //children=founded[0]["children"]
            founded[0]["children"].forEach(function(d){
              vis.expandNodeBranch(d)
            })
          }else{
            vis.expandNodeBranch(founded[0])
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
  }
  async function checkQueriesExpert(){
    //////console.log(indexRows)
    if (indexRows.length > 1) {
      getMenuItems(indexRows, node, origin,"expert")
    } else if (indexRows.length == 1) {
      form = indexRows[0]
      //await buildFreeGraph(form, origin, node)
      await buildNetworkGraph(form,"expert",node)
      //////////////////////console.log("despues build")
    } 
  }
  async function addGraph(node,indexRows){

    //if more than one line in Config File is returned, show options in menu
    //console.log(indexRows)
    if(indexRows.length>1){
      getMenuItems(indexRows,node,origin,"basic")
    }else if (indexRows.length==1){
  
      //throw new Error("Something went badly wrong!");
  
      //if only one option is returned build graph.
      //////////////////console.log(indexRows)
      buildBasicGraph(indexRows[0],node)
      //////////////////////////////////////console.log(node)
/*       if(node){
        var p = $( "#"+node.id );
        var position = p.position();
        //////////////////////////////////////console.log(position)
      } */
    }/* else{
      //////////////////////////////////////////////////////console.log("no tiene resultados")
      //////////////////////////////////////////////////////console.log(navigation)
    } */
    //return indexRows
  }
};

//NetworkGraph.prototype.collapseAll = function (root) {
/* NetworkGraph.prototype.collapseAll = function () {
  var vis = this,treeDataEl;
  //var children;
  //children=vis.data.nodes[0]["children"]
  ////////////////////////////////////////////////////////////console.log(vis.treeData)
  ////////////////////////////////////////////////////////////////////////////////////////////console.log(children)
  function recurse(node) {
    var el;
    if(node.children){
      node.children.forEach(function(d){
        el=vis.treeData.filter(l=>l.id==d.id)
        if(el.length>0){
          recurse(el[0])
          vis.collapseBranch(el[0])
        }
      })
    }
    
  }
  //root["children"].forEach(function(r){
  vis.treeData[0]["children"].forEach(function(r){
    treeDataEl=vis.treeData.filter(d=>d.id==r.id)
    if(treeDataEl.length>0){
      if(treeDataEl[0].children){
        vis.collapseBranch(treeDataEl[0])
        recurse(treeDataEl[0]);
      }
    }
    
  })
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

} */

NetworkGraph.prototype.collapseAll = function () {
  var vis = this,treeDataEl;
  function recurse(node) {
    var el;
    ////////////////////console.log(node)
    if(node.children){
      node.children.forEach(function(d){
        ////////////////////console.log(d)
        el=vis.treeData.filter(l=>l.id==d.id)
        if(el.length>0){
          recurse(el[0])
          vis.collapseBranch(el[0])
        }
      })
    }
    
  }
  //root["children"].forEach(function(r){
  vis.treeData[0]["children"].forEach(function(r){
    treeDataEl=vis.treeData.filter(d=>d.id==r.id)
    if(treeDataEl.length>0){
      //if(treeDataEl[0].children){
      //////////////////console.log(treeDataEl[0])
      recurse(treeDataEl[0]);
      vis.collapseBranch(treeDataEl[0])
      
      //}
    }
    
  })
  ////////////console.log(vis.treeData)
  if(vis.treeData[0]["children"][0]["hidden"]){
    vis.treeData[0]["children"].forEach(function (c){
      delete c["hidden"]
    })
  }
  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

}
NetworkGraph.prototype.collapseNodeBranch = function (nodeTreeData) {
  var vis = this,treeDataEl;
  function recurse(node) {
    var el;
    ////////////////////console.log(node)
    if(node.children){
      node.children.forEach(function(d){
        ////////////////////console.log(d)
        el=vis.treeData.filter(l=>l.id==d.id)
        if(el.length>0){
          recurse(el[0])
          vis.collapseBranch(el[0])
        }
      })
    }
    
  }
  //root["children"].forEach(function(r){
  nodeTreeData=vis.treeData.filter(d=>d.id==nodeTreeData.id)[0]
  ////console.log(nodeTreeData)
  nodeTreeData["children"].forEach(function(r){
    ////////console.log(r)
    treeDataEl=vis.treeData.filter(d=>d.id==r.id)
    ////console.log(treeDataEl)
    if(treeDataEl.length>0){
      //if(treeDataEl[0].children){
      //////////////////console.log(treeDataEl[0])
      recurse(treeDataEl[0]);
      //vis.collapseBranch(treeDataEl[0])
      treeDataEl[0]._children = treeDataEl[0].children;
      delete treeDataEl[0].children;
      //}
    }
    
  })

  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

}
NetworkGraph.prototype.expandNodeBranch = function (nodeTreeData) {
  var vis = this/* ,treeDataEl;
  function recurse(node) {
    var el;
    ////////////////////console.log(node)
    if(node.children){
      node.children.forEach(function(d){
        ////////////////////console.log(d)
        el=vis.treeData.filter(l=>l.id==d.id)
        if(el.length>0){
          recurse(el[0])
          vis.expandBranch(el[0])
        }
      })
    }
    
  } */
  //root["children"].forEach(function(r){
  nodeTreeData=vis.treeData.filter(d=>d.id==nodeTreeData.id)[0]
  /* if(nodeTreeData.children){
    nodeTreeData._children = nodeTreeData.children;
    delete nodeTreeData.children;
  }else{ */
    nodeTreeData.children = nodeTreeData._children;
    delete nodeTreeData._children;
  //}
  
  //delete vis.treeData[index]["hidden"]
  /* nodeTreeData["_children"].forEach(function(r){
    ////////console.log(r)
    treeDataEl=vis.treeData.filter(d=>d.id==r.id)
    if(treeDataEl.length>0){
      //if(treeDataEl[0].children){
      //////////////////console.log(treeDataEl[0])
      recurse(treeDataEl[0]);
      //vis.collapseBranch(treeDataEl[0])
      treeDataEl[0].children = treeDataEl[0]._children;
      delete treeDataEl[0]._children;
      //}
    }
    
  }) */

  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

}
/* NetworkGraph.prototype.expandAll = function () {
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

} */
NetworkGraph.prototype.expandAll = function () {
  var vis = this,treeDataEl;
  function recurse(node) {
    var el;
    //////////////////console.log(node)
    if(node._children){
      node._children.forEach(function(d){
        //////////////////console.log(d)
        el=vis.treeData.filter(l=>l.id==d.id)
        //////////////////console.log(el)
        //////////////////console.log(vis.treeData)
        if(el.length>0){
          recurse(el[0])
          vis.expandBranch(el[0])
        }
      })
    }
    
  }
  //root["children"].forEach(function(r){
  vis.treeData[0]["children"].forEach(function(r){
    treeDataEl=vis.treeData.filter(d=>d.id==r.id)
    if(treeDataEl.length>0){
      //if(treeDataEl[0].children){
      //////////////////console.log(treeDataEl[0])
      recurse(treeDataEl[0]);
      vis.expandBranch(treeDataEl[0])
      
      //}
    }
    
  })
  //////////////////console.log(vis.treeData)
  vis.data=flatten(vis.treeData).flatData
  vis.refresh()
}
NetworkGraph.prototype.collapseBranch = function (node){
  var vis = this;
  ////////////console.log(node)
  let index=vis.treeData.findIndex(d=>d.id==node.id)
  vis.treeData[index]._children = vis.treeData[index].children;
  delete vis.treeData[index].children;
  vis.treeData[index]["hidden"]=true
  ////////////console.log(vis.treeData)
}

NetworkGraph.prototype.collapseFullBranch = function (node){
  var vis = this;
  var nodes=[]
  nodes.push(node.id)
  collapseNode(node)

  for (let i = 0; i < vis.treeData.length; i++) {
    if (nodes.includes(vis.treeData[i]["id"])){
      vis.treeData[i]._children = vis.treeData[i].children;
      delete vis.treeData[i].children;
      if(vis.treeData[i]["id"]!=node.id){
        vis.treeData[i]["hidden"]=true
      }
    }
  }
  function collapseNode(node) {
    var position;
    if(node){
      if(node["children"]){
        node["children"].forEach(function(d){
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
  let index=vis.treeData.findIndex(d=>d.id==node.id)
  vis.treeData[index].children = vis.treeData[index]._children;
  delete vis.treeData[index]._children;
  delete vis.treeData[index]["hidden"]
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

NetworkGraph.prototype.refresh = function (node){
  var vis = this;
  vis.dataJoinGraph()
  console.log(vis.colorScale.domain())

  vis.enterGraph()
  console.log(networkGraph.colorScale.domain())

  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()
}
