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


NetworkGraph = function (_parentElement,_forces,_data,_classesCorrespondence,_importedFilterClasses) {
  this.parentElement = _parentElement;
  this.forces = _forces
  this.data= _data
  this.classesCorrespondence= _classesCorrespondence
  this.importedFilterClasses= _importedFilterClasses
};


/////////////////// initVis Method //////////////////////
NetworkGraph.prototype.initVis = function () {
  var vis = this,coorX,coorY;
  vis.data=vis.data.flatData
  vis.treeData=linkedDataGraph.treeData
  vis.allData=JSON.parse(JSON.stringify(vis.data));

  vis.rootNode=vis.data.nodes[0]

  if(!vis.filterClassesObjects){
    vis.filterClassesObjects=[]
  }
  if(configRow){
    vis.queriesArray=[]
  }
  

  vis.filters=[]

  vis.width=1400
  vis.height=800
  vis.svg = d3.select(this.parentElement).append("svg")
  .attr("id", "networkGraph-svg")
  .attr("class", "graph z-0")
  .attr("preserveAspectRatio","xMidYMid meet")
  .attr("viewBox", `0 0 ${vis.width} ${vis.height}`)


  vis.zoomScale=1
  vis.dragX=0
  vis.dragY=0
  vis.graphAdded=false
  vis.centerGraphX=0
  vis.centerGraphY=0

  vis.svg.append('defs').append('marker')
        .attr("id",'arrow')
        .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
         .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
         .attr('refY',0)
         .attr('orient','auto')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', 'black')
        .style('stroke','none') 
  
    vis.svg.append("defs").append("marker")
    .attr("id", "arrowEnd")
    .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
         .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
         .attr('refY',0)
         .attr('orient','auto')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', 'black')
        .style('stroke','none');
  
    vis.svg.append("defs").append("marker")
      .attr("id", "arrowStart")
      .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
      .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
      .attr('refY',0)
      .attr('orient','auto')
      .attr('markerWidth',13)
      .attr('markerHeight',13)
      .attr('xoverflow','visible')
     .append('svg:path')
      .attr("d", "M0,0L10,-5L10,5Z")
      .attr('fill', 'black')
      .style('stroke','none');
  /*               
  vis.append("defs").selectAll("marker")
  .data(["arrow"])
  .enter().append("marker")
  .attr("id", "markerEnd")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 19)
  .attr("refY", -0,7)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr('markerUnits', "userSpaceOnUse")
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5");

  vis.append("defs").selectAll("marker")
    .data(["arrow"])
    .enter().append("marker")
    .attr("id", "markerStart")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", -12)
    .attr("refY", -0,7)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr('markerUnits', "userSpaceOnUse")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,0L10,-5L10,5Z"); */
  
  

  vis.g=vis.svg.append("g")
  .attr("class", "gMain")
  .attr("transform","translate(0,0)")

  vis.svg
  .on("mousemove", function (actual, i) {
      if(vis.centerGraphX!=0){
        vis.coorX=((d3.mouse(this)[0]-vis.centerGraphX-vis.dragX) /vis.zoomScale )
        vis.coorY=((d3.mouse(this)[1]-vis.centerGraphY-vis.dragY) /vis.zoomScale )
        vis.coorSinCenterX=((d3.mouse(this)[0]-vis.dragX) /vis.zoomScale )
        vis.coorSinCenterY=((d3.mouse(this)[1]-vis.dragY) /vis.zoomScale )
        vis.coorSinDragX=((d3.mouse(this)[0]-vis.centerGraphX) /vis.zoomScale )
        vis.coorSinDragY=((d3.mouse(this)[1]-vis.centerGraphY) /vis.zoomScale )
      }else{
        vis.coorX=((d3.mouse(this)[0]-vis.dragX) /vis.zoomScale )
        vis.coorY=((d3.mouse(this)[1]-vis.dragY) /vis.zoomScale )
      }

  })

    var dragSvg = d3.zoom()
    .scaleExtent([0.25, 2.5])
    .on("zoom", function(e){
      if (lineDragActive == false) {
        vis.zoomed.call(vis);
        vis.zoomScale=d3.event.transform.k
        return true;
      }
    })
    .on("start", function(){
      if (lineDragActive == false) {
        d3.select('body').style("cursor", "move");
        d3.event.transform.x=0
        d3.event.transform.y=0
      }
    })
    .on("end", function(){
      if (lineDragActive == false) {
        vis.dragX=d3.event.transform.x
        vis.dragY=d3.event.transform.y
        vis.zoomScale=d3.event.transform.k
        d3.select('body').style("cursor", "auto"); 
      }
    })

  vis.gLinks=vis.g.append("g")
  .attr("class", "links")

  vis.svg.call(dragSvg)
  .on("dblclick.zoom", null);

  vis.gNodes=vis.g.append("g")
  .attr("class", "nodes")

  vis.gNodesFree=vis.g.append("g")
  .attr("class", "nodesFree")

  vis.setColorScale()
   
  vis.colorScale = d3.scaleOrdinal()
  .domain(vis.colorScaleDomain)
  .range(vis.colorScaleRange)

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

  vis.sizeNode=d3.scalePow()
  .domain([0,vis.maxSizeNode])
  .range([ 15, 45])  // Size in pixel
 
  vis.initializeSimulation();
  vis.initializeDisplay();
  
};

NetworkGraph.prototype.zoomed = function(){
  var vis=this
  textImageZoom(d3.event.transform.k)
  
  if(vis.centerGraphX==0){
    vis.g.attr("transform","translate("+(d3.event.transform.x)+","+(d3.event.transform.y)+") scale(" + d3.event.transform.k + ")")
  }else{
    vis.g.attr("transform","translate("+(d3.event.transform.x+vis.centerGraphX)+","+(d3.event.transform.y+vis.centerGraphY)+") scale(" + d3.event.transform.k + ")")
  }
    
};

NetworkGraph.prototype.initializeSimulation = function () {
  var vis = this;
  vis.simulation.stop() 
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

  if((vis.dblClickId)&&(vis.addingGraph)){
    vis.g.bbox = vis.g.node().getBBox();
    vis.g.vx = vis.g.bbox.x;		// container x co-ordinate
    vis.g.vy = vis.g.bbox.y;		// container y co-ordinate
    vis.g.vw = vis.g.bbox.width;	// container width
    vis.g.vh = vis.g.bbox.height;	// container height

    let transformGet=getTransform()

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
      console.log(vis.dblClickId)
      bbox = d3.select("#"+vis.dblClickId).node().getBBox();
      var bx = bbox.x;
      bx=d3.select("#"+vis.dblClickId).data()[0]["x"]
      var by = bbox.y;
      by=d3.select("#"+vis.dblClickId).data()[0]["y"]
      var bw = bbox.width;
      var bh = bbox.height;

      var tx = -bx*vis.zoomScale + vis.g.vx + vis.g.vw/2 - bw*vis.zoomScale/2;
      var ty = -by*vis.zoomScale + vis.g.vy + vis.g.vh/2 - bh*vis.zoomScale/2;
      return {translate: [tx, ty], scale: vis.zoomScale}
    }
  });    
  vis.simulation.stop()

  vis.updateForces();

  function ticked() {
    fixCoordinates()
    vis.link.attr('d', function (d){
      return   'M ' + (d.source.x) + ' ' + (d.source.y) + ' L ' + d.target.x + ' ' + d.target.y
    });
    vis.edgepaths.attr('d', function (d){
          return   'M ' + (d.source.x) + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        });

    vis.nodeCircle
        .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")"; })

    vis.nodeCircleFree
          .attr("transform", function(d) { 
  
            return "translate(" + d.x + "," + d.y + ")"; })
    }
  function fixCoordinates(){
    //////console.log(vis.link.data())
    //////console.log(vis.link)
  }
}

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
  
  vis.simulation.alpha(1).restart();
}

// generate the svg objects and force simulation
NetworkGraph.prototype.initializeDisplay = function() {
  var vis = this,text;

  
  if(!document.getElementsByClassName("tooltip")[0]){
    vis.tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0)
  }
  
  vis.dataJoinGraph()
  vis.exitGraph()
  vis.enterGraph()
  vis.updateDisplay();
}

NetworkGraph.prototype.updateDisplay = function () {
  var vis = this;

  vis.link
      .style("stroke-width", vis.forceProperties.link.enabled ? 1 : .5)
      .style("opacity", vis.forceProperties.link.enabled ? 1 : 0);
}

NetworkGraph.prototype.dataJoinGraph = function(){
  var vis=this;

  vis.link = vis.gLinks
  .selectAll(".link")
  .data(vis.data.links.filter(function(item) {
    return item["source"]["class"] != "free"
  }), function(d) { return d.id; })

  vis.linklabels = vis.gLinks.selectAll(".linklabel")
  .data(vis.data.links.filter(function(item) {
    return item["source"]["class"] != "free"
  }), function(d) { return d.id; })

  vis.edgepaths = vis.gLinks
  .selectAll(".edgepath")
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

  vis.nodeCircleImages=vis.nodeCircle
  .data(vis.data.nodes.filter(function(item) {
    return !(mnemonicCodes.map(m=>m.org.value).includes(item[item["class"]+"_uri"]))
  }), function(d) { return d.id; })
  
  console.log(vis.nodeCircleImages)
  
  vis.nodeCircleMnemonic=vis.nodeCircle
  .data(vis.data.nodes.filter(function(item) {
    return (mnemonicCodes.map(m=>m.org.value).includes(item[item["class"]+"_uri"]))
  }), function(d) { return d.id; })

  console.log(vis.nodeCircleMnemonic)

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
    vis.maxSizeNode=d3.max(vis.data.nodes, d => d.number)  
    ////////////////////////////////////////console.log(vis.maxSizeNode)
    vis.sizeNode
    .domain([0,vis.maxSizeNode])

    if(configRow.node){
      d3.select("#"+configRow.node.id).data(vis.data.nodes.filter(d=>d.id==configRow.node.id)[0])
      ////////////////////////////////////console.log(d3.select("#"+configRow.node.id).data()[0])
      handleMouseout(configRow.node.id)
    }
    ////console.log(vis.nodesClassesShow)
    vis.colorScale.domain(Object.values(vis.nodesClassesShow))
    vis.colorScale.range(vis.colors.slice(0,Object.values(vis.nodesClassesShow).length))
    ////console.log(vis.colorScale.range())
    vis.isDblclick = false;
  
    vis.timeoutTiming = 500;

    drawLinks()

    //these arrow lines will shown only in free graph

    drawCirclesBasic()
    addTextForCircles()
    drawImageCirclesBasic()
    drawTextCirclesBasic()
    drawArrowLinesFree()  
    drawCirclesFree()
    drawImageClusterFree()
      
    function drawLinks(){
      //////////////////////////console.log("before drawlinks")
        ////////////////////////////////console.log(vis.link)
        vis.link=vis.link
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('id',function(d){
          return d.id+"_link";
        })
        .attr('link_id',function(d){
          return d.id;
        })
        .style("pointer-events", "none")
        .style("stroke", "black")
        .attr("stroke-width", 1)
        //.attr("marker-end","url(#arrow)");
        //.attr("marker-start", "url(#arrowStart");

        ////////////////////////////////console.log(vis.linklabels)
        vis.linklabels = vis.linklabels
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr('class', 'linklabel')
        .attr('id', function (d) {return d["id"]+"_label"})
        .attr('link_id',function(d){
          return d["id"]+"_label"
        })
        .attr('link_value',function(d){
          return d["relation"]
        })
        .attr('font-size', 12)
        .attr('fill', 'black')
        .append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d) {
              //////////////////////////////////////////console.log(d3.select("#"+d.id+"_link"))
              return "#"+d.id+"_link"})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function(d){
              return d.relation
            });
  
/*         vis.linklabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d) {
              ////////////////////////////////////////////console.log(d3.select("#"+d.id))
              return "#"+d.id+"_link"})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function(d){
              return d.relation
            }); */
          }
    function drawArrowLinesFree(){
        vis.edgepaths = vis.edgepaths
        .enter()
        .append('path')
        .attr('class', 'edgepath')
        .attr('id', function (d, i) {
          ////////////////////////////////console.log(d)
          return d.id+"_link"})
          //return 'edgepath' + i})
        .attr('link_id',function(d){
          return d.id
          //return d["source"]["id"]+"_"+d["target"]["id"]
        })
        .style("poin ter-events", "none")
        .style("stroke", "black")
        .attr("stroke-width", 1)
        .attr("marker-end", "url(#arrow)")
/*         .attr("marker-mid", "url(#arrow)")
        .attr("marker-start", "url(#arrow)") */

        //.attr("marker-start", "url(#arrowEnd)")
        //.attr("marker-start", "url(#arrowEnd")
/*         if(configRow.position=="s"){
          vis.edgepaths=vis.edgepaths.attr("marker-end","url(#arrowEnd)")
        }else if(configRow.position=="o"){
          vis.edgepaths=vis.edgepaths.attr("marker-start", "url(#arrowEnd")
        } */
        ////////////////////////////////console.log(vis.edgelabels)

/*         vis.linklabels = vis.linklabels
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr('class', 'linklabel')
        .attr('id', function (d) {return d["id"]+"_label"})
        .attr('link_id',function(d){
          return d["id"]+"_label"
        })
        .attr('link_value',function(d){
          return d["relation"]
        })
        .attr('font-size', 12)
        .attr('fill', 'black')
        .append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d) {
              //////////////////////////////////////////console.log(d3.select("#"+d.id+"_link"))
              return "#"+d.id+"_link"})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function(d){
              return d.relation
            }); */
        vis.edgelabels = vis.edgelabels
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr('class', 'edgelabel')
            .attr('id', function (d, i) {return d.id+"_label"})
            .attr('link_id',function(d){
              return d["id"]+"_label"
            })
            .attr('link_value',function(d){
              return d["value"]
            })
            .attr('font-size', 12)
            .attr('fill', 'black')
            .append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d, i) {return "#"+d.id+"_link"})
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
        //.attr("style","filter:url(#dropshadow)")
        .attr("id",function(d){
          return (d.id+"_g")
        })
        .on('dblclick', function(d){
          handleDblClickEvent(d3.mouse(this)[0],d3.mouse(this)[1],this.getAttribute("id").replace("_g",""))
          if(get_node_from_element(this.getAttribute("id").replace("_g",""))["class"]!="menuOption"){
            event.pageX=d3.mouse(vis.g.node())[0]
            event.pageY=d3.mouse(vis.g.node())[0]

            var dcx = (window.innerWidth/2-d.x*vis.zoomScale);
            var dcy = (window.innerHeight/2-d.y*vis.zoomScale);
            vis.wrangleData(this,"bubble",d.x + dcx,d.y + dcy);
          }
          return false;
        })
        .on('mouseover', function(d){
          handleMouseover(d,this.getAttribute("id").replace("_g",""))
        })
        .on('mouseout', function(d){
          handleMouseout(this.getAttribute("id").replace("_g",""))
        })
        .on("click",function(d){
          handleClickEvent(document.getElementById(this.getAttribute("id").replace("_g","")))
        })
        .on('contextmenu', (d) => {
          d3.event.preventDefault();
          getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        })
        .call(
          d3
            .drag()
            .on("start", dragStart)
            .on("drag", drag)
            .on("end", dragEnd)
        );

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
            if(d.class=="more_results"){
              return 50;
            }else{
              return vis.sizeNode(d.number)
            }
          })
        .attr("stroke", function(d){
          return "black"
        })
        .attr("stroke-width", "1px")
        .style("fill", function(d){ 
           test=vis.colorScale(d.className)
           return test;

        })
/*         .on('clickout', function(d){
        })
        .on("click",function(){
          handleClickEvent(this)    
        })
        .on('dblclick', function(){
          handleDblClickEvent(d3.mouse(this)[0],d3.mouse(this)[1],this.getAttribute("id"))
          if(get_node_from_element(this.getAttribute("id"))["class"]!="menuOption"){
            vis.wrangleData(this,"bubble",d3.event);
          }
          return false;
        })
        .on('contextmenu', (d) => {
          d3.event.preventDefault();
          getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        }) */
/*         .call(
          d3
            .drag()
            .on("start", dragStart)
            .on("drag", drag)
            .on("end", dragEnd)
        ); */
/*         function dragStart(d) {
          //console.log('drag start');
          lineDragActive = true;
          simulation.alphaTarget(0.5).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        
        function drag(d) {
          //console.log('dragging');
          // simulation.alpha(0.5).restart()
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
        
        function dragEnd(d) {
          // //console.log('drag end');
          lineDragActive = false;
          simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        } */

      }
    function addTextForCircles(){
        d3.selectAll(".nodeCircleMnemo").remove()

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
/*         vis.textCircle
           .selectAll("tspan").remove(); */

        vis.textCircleSpan=vis.textCircle
            .selectAll("tspan")
            .data(function(d){
              return lines(words(d.value),d.value)
            })

        
        vis.textCircleSpan    
        .enter().append("tspan")
              .attr("x", 0)
              .attr("y", (d, i) => (i - lines.length / 2 + 0.8) * lineHeight)
              .text(d => d.text);

        //vis.textCircleSpan.exit().remove()
      }
    function drawImageCirclesBasic(){
        var event={},mnemonic,bubbleImg;
        //d3.selectAll(".nodeCircleImage").remove()

        vis.nodeCircleImage=vis.nodeCircle.append("svg:image")
        .attr("class", "nodeCircleImage")
        .attr("id",function(d){
          return (d.id+"_image")
        })
        .attr("xlink:href", function(d){
          if(d.class=="more_results"){
            return "images/bubbles.svg";
          }else{
            mnemonic=getMnemonicCodeForOrg(d[d["class"]+"_uri"])
            if(mnemonic==undefined){
              bubbleImg=bubbleImage(d)
            }else{
              bubbleImg=""
            }
          return bubbleImg;
          }
        })
        .attr("x",function(d){
          if(d.class=="more_results"){
            return "-"+(50-4)+"px"
          }else{
            return "-"+(vis.sizeNode(d.number)-4)+"px"
          }
        })
        .attr("y",function(d){
          if(d.class=="more_results"){
            return "-"+(50-4)+"px"
          }else{
            return "-"+(vis.sizeNode(d.number)-4)+"px"
          }
        })
        .attr("width",function(d){
          if(d.class=="more_results"){
            return 50*1.5+"px"
          }else{
            return (vis.sizeNode(d.number)*1.5)+"px"
          }
        })
        .attr("height",function(d){
        if(d.class=="more_results"){
          return 50*1.5+"px"
        }else{
          return (vis.sizeNode(d.number)*1.5)+"px"
        }
      })
      .attr('opacity', function(d) {
        if(vis.zoomScale>1.5){
          return 0;
        }else{
          return 1;
        }
        
      })
/*         .on('dblclick', function(d){
          handleDblClickEvent(d3.mouse(this)[0],d3.mouse(this)[1],this.getAttribute("id"))
          if(get_node_from_element(this.getAttribute("id").replace("_image",""))["class"]!="menuOption"){
            event.pageX=d3.mouse(vis.g.node())[0]
            event.pageY=d3.mouse(vis.g.node())[0]

            var dcx = (window.innerWidth/2-d.x*vis.zoomScale);
            var dcy = (window.innerHeight/2-d.y*vis.zoomScale);
            vis.wrangleData(this,"bubble",d.x + dcx,d.y + dcy);
          }
          return false;
        })
        .on('mouseover', function(d){
          handleMouseover(d,this.getAttribute("id").replace("_image",""))
        })
        .on('mouseout', function(d){
          handleMouseout(this.getAttribute("id").replace("_image",""))
        })
        .on("click",function(d){
          handleClickEvent(document.getElementById(this.getAttribute("id").replace("_image","")))
        })
        .on('contextmenu', (d) => {
          d3.event.preventDefault();
          getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        }) */

/*         .call(
          d3
            .drag()
            .on("start", dragStart)
            .on("drag", drag)
            .on("end", dragEnd)
        ); */
      }
    function drawTextCirclesBasic(){
      var textValue,mnemonic;
      //////////////console.log(vis.nodeCircleMnemonic)
      ////////////console.log("drawTextCirclesBasic")
      //vis.nodeCircleMnemonic

      vis.mnemoCircle=vis.nodeCircle
      .append("text")
      .attr("class","nodeCircleMnemo")
      .attr("id",function(d){
        //////////////console.log(d)
        return (d.id)+"_mnemo"
      })       
      .attr("transform", 
      function(d){
        mnemonic=getMnemonicCodeForOrg(d[d["class"]+"_uri"])
        if(mnemonic!=undefined){
          textValue=mnemonic["code"]["value"]
          textRadiusText=textRadius(lines(words(textValue),textValue))
          return `translate(${-vis.sizeNode(d.number)/1.2},${-(textRadiusText/vis.sizeNode(d.number))/1.2}) scale(${vis.sizeNode(d.number) / textRadiusText})`
        }else{
          return `translate(0,0)`
        }
      })
      .attr('opacity', function(d) {
        if(vis.zoomScale>1.5){
          return 0;
        }else{
          return 1;
        }
        
      })
/*       .on('dblclick', function(d){
        handleDblClickEvent(d3.mouse(this)[0],d3.mouse(this)[1],this.getAttribute("id"))
        if(get_node_from_element(this.getAttribute("id").replace("_image",""))["class"]!="menuOption"){
          event.pageX=d3.mouse(vis.g.node())[0]
          event.pageY=d3.mouse(vis.g.node())[0]

          var dcx = (window.innerWidth/2-d.x*vis.zoomScale);
          var dcy = (window.innerHeight/2-d.y*vis.zoomScale);
          vis.wrangleData(this,"bubble",d.x + dcx,d.y + dcy);
        }
        return false;
      })
      .on('mouseover', function(d){
        handleMouseover(d,this.getAttribute("id").replace("_mnemo",""))
      })
      .on('mouseout', function(d){
        handleMouseout(this.getAttribute("id").replace("_mnemo",""))
      })
      .on("click",function(d){
        handleClickEvent(document.getElementById(this.getAttribute("id").replace("_mnemo","")))
      })
      .on('contextmenu', (d) => {
        d3.event.preventDefault();
        getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
      }) */

/*       .call(
        d3
          .drag()
          .on("start", dragStart)
          .on("drag", drag)
          .on("end", dragEnd)
      ); */
/*       .selectAll("tspan")
      .data(function(d){
        ////////////console.log(d)
        textValue=getMnemonicCodeForOrg(d[d["class"]+"_uri"])["code"]["value"]
        return lines(words(textValue),textValue)
      })
      .enter()
      .append("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => (i - lines.length / 2 + 1.5) * lineHeight)
        .text(d => d.text); */

     /*  .attr('opacity', function(d) {
            //if(vis.zoomScale>1.5){
              return 1;
            //}else{
            //  return 0;
            //}
                }) */
      vis.mnemoCircleText=vis.mnemoCircle
      .selectAll("tspan")
      .data(function(d){
        mnemonic=getMnemonicCodeForOrg(d[d["class"]+"_uri"])
        if(mnemonic!=undefined){
          textValue=mnemonic["code"]["value"]
        }else{
          textValue=""
        }
        return lines(words(textValue),textValue)
      })

      ////////////console.log(vis.mnemoCircleText)
      vis.mnemoCircleText
      .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i){
          return (i - lines.length / 2 + 1.5) * lineHeight
        })
        .text(d => d.text);
/*       function getMnemonicCodeForOrg(org){
        return mnemonicCodes.filter(m=>m.org.value==org)[0]
      } */
    }
    function drawShadow(){
  
/*         vis.nodeCircleImage=vis.nodeCircle.append("defs").append("filter")
        .attr("id", "dropshadow")
        .attr("x", "-40%")
        .attr("y", "-40%")
        .attr("width", "180%")
        .attr("height", "180%")
        .append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", "3")
        .append("feOffset")
        .attr("dx", "5")
        .attr("dy", "5")
        .attr("result", "offsetblur")
        .append("feOffset")
        .attr("dx", "-5")
        .attr("dy", "-5")
        .attr("result", "offsetblur")
        .append("feMerge")
        .append("feMergeNode")
        .append("feMergeNode")
        .attr("in", "SourceGraphic")
        .append("feMergeNode")
        .attr("in", "SourceGraphic") */
        vis.nodeCircleImage=vis.nodeCircle.append("defs").append("filter")
        .attr("id", "dropshadow")
        .attr("height", "130%")
        .append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 5)
        .attr("result", "blur")
        .append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0.5)
        .attr("dy", 0.5)
        .attr("result", "offsetBlur")
        .append("feMerge")
        .append("feMergeNode")
        .attr("in", "offsetBlur")
        .append("feMergeNode")
        .attr("in", "SourceGraphic")
      }
    function drawCirclesFree(){
        vis.nodeCircleFree=vis.nodeCircleFree
        .enter().append("g")
        .attr("class",function(d){
          if(d.class=="more_results"){
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
              ////////console.log(d.value)
              if(d.class=="more_results"){
                return d.class + " nodeCircleCircleFree cluster"
              }else{
                return d.class + " nodeCircleCircleFree"
              }
            }) 
            .attr("r", function(d){
              if(d.class=="more_results"){
                return 25;
              }else{
                return 17;
              }
            })
            .attr("id",d=>d.id)
            .attr("stroke-width", "1px")
            .style("stroke", function(d){
              return "black";
            })
            .style("stroke-opacity",1)
            .style("stroke-width", function(d){
                return 1;
            })
            .style("fill", function (d){
              return vis.colorScale(d.type)
            })
            .on('mouseover', function(d){
              addTooltip(getTooltipTextFreeGraph(d))
            })
            .on('mouseout', function(d){
              deleteTooltip()
            })
            .on('clickout', function(d){
            })
            .on("click",function(d){
              var element=this
              timer = setTimeout(function() {
                if (!prevent) {
                  clickBubbleGraph(element,vis.data)
                }
                prevent = false;
              }, delay);
            })
            .on('dblclick', function(d){
/*               d3.event.stopPropagation();
              d3.event.preventDefault();
              if((d.type=="uri")||(d.type=="bnode")){
                clearTimeout(timer);
                prevent = true;
                vis.wrangleData(this,"bubble");
                return false;
              } */
              //console.log(d)
              if(d.type=="uri"){
                handleDblClickEvent(d3.mouse(this)[0],d3.mouse(this)[1],this.getAttribute("id"))
                if(get_node_from_element(this.getAttribute("id"))["class"]!="menuOption"){
                  vis.wrangleData(this,"bubble",d3.event);
                }
              }
              return false;
            })
            .on('contextmenu', (d) => {
                d3.event.preventDefault();
                getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
            })
            .call(
              d3
                .drag()
                .on("start", dragStart)
                .on("drag", drag)
                .on("end", dragEnd)
            );
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
          addTooltip(getTooltipTextFreeGraph(d))
        })
        .on('mouseout', function(d){
          deleteTooltip()
        })
        .on('clickout', function(d){
        })
        .on("click",function(d){
          var element=this
          timer = setTimeout(function() {
            if (!prevent) {
              clickBubbleGraph(element,vis.data)
            }
            prevent = false;
          }, delay);
        })
        .on('dblclick', function(d){
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
            d3.event.preventDefault();
            getMenuItemsContextMenu(d,"bubble",d3.event.pageX,d3.event.pageY)
        })

      }
    function handleDblClickEvent(mouseX,mouseY,id){
        d3.event.stopPropagation();
        d3.event.preventDefault();
        clearTimeout(timer);
        prevent = true;
        //console.log(id)
        vis.dblClickId=id.replace("_image","")
      }
    function handleClickEvent(element){
          timer = setTimeout(function() {
          if (!prevent) {
              clickBubbleGraph(element,vis.data)
          }
          prevent = false;
          }, delay);
      }

      function handleMouseover(data,circleId){
        document.body.style.cursor = 'pointer';
        addTooltip(getTooltipText(data))

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
      function handleMouseout(circleId){
        document.body.style.cursor = 'auto';
        deleteTooltip()
        d3.select("#"+circleId)
        .transition()
        .attr("r", function(d) { 
          if(d.class=="more_results"){
            return 50;
          }else{
            //////////////////////////////////////console.log(d.value)
            //////////////////////////////////////console.log(d)
            return vis.sizeNode(d.number);
          }
          })
        d3.select("#"+circleId+"_image")
        .transition()
        .attr("x",function(d){
          if(d.class=="more_results"){
            return "-"+(50-4)+"px"
          }else{
            return "-"+(vis.sizeNode(d.number)-4)+"px"
          }
        })
        .attr("y",function(d){
          if(d.class=="more_results"){
            return "-"+(50-4)+"px"
          }else{
            return "-"+(vis.sizeNode(d.number)-4)+"px"
          }
        })
        .attr("width", function(d) { 
          if(d.class=="more_results"){
            return 50*1.5+"px"
          }else{
            return (vis.sizeNode(d.number)*1.5)+"px"
          }
        })
        .attr("height", function(d) { 
          if(d.class=="more_results"){
            return 50*1.5+"px"
          }else{
            return (vis.sizeNode(d.number)*1.5)+"px"
          }
        })
      }    

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
        return lines;
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
        const context = document.createElement("canvas").getContext("2d");
        return (context.measureText(text).width)
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
  
  d3.selectAll(".menuEntry")
      .append('rect')
      .attr('uri',data[data["class"]+"_uri"])
      .attr('x', vis.coorX)
      .attr('y', (d, i) => { 
        return vis.coorY + (i * 30); })
      .attr('rx', 2)
      .attr('width', width)
      .attr('height', 30)
      .attr('stroke', '#042F67')
      .attr('stroke-width', 3)

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
          addTooltip(getTooltipMenu(getCommentOption(d.title)));
        }else{
          //console.log(d)
          addTooltip(getTooltipInside(d.title,uri));
        }
        //d3.select(this).style("fill","#DCDDF5")
      })
      .on('mouseout', function(d){
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
      .style('fill', '#042F67')
      .style("font-size", "14px")
      .on('click', (d) => { 
        deleteTooltip()

        d3.selectAll(".d3-tip").each(function () {
          this.style.opacity = "0"
        })

        d.action(data,d) })
      .on('mouseover', function(d){
        if(configFile.file.filter(v=>v.option==d.title).length>0){
          addTooltip(getTooltipMenu(getCommentOption(d.title)));
        }else{
          addTooltip(getTooltipInside(d.title,uri));

        }
      })
      .on('mouseout', function(d){
        deleteTooltip()
      });

  function getTooltipInside(title,uri){
    if(title.match("Sparql Endpoint: (.*) and Position:")){
      url = title.match("Sparql Endpoint: (.*) and Position:")[1]; 
      subjectObject=title.match("and Position: (.*)")[1];
      if(subjectObject=="s"){
        textTooltip="Find all objects for the URI :" + uri + " in the SPARQL EndPoint: "+url
      }else{
        textTooltip="Find all subjects for the URI :" + uri + " in the SPARQL EndPoint: "+url
      }
      return getTooltipMenu(textTooltip)
    }else{
      return getTooltipMenu(title)
    }

  }

}
NetworkGraph.prototype.exitGraph = function(){
    var vis=this;
    vis.link.exit().remove();

    vis.nodeCircle.exit().remove();
    vis.nodeCircleFree.exit().remove();
    //if(vis.graphType=="expert"){
    vis.edgepaths.exit().remove();
    //}
}

NetworkGraph.prototype.wrangleData = async function (element,origin,pageX,pageY) {
  var vis = this;
  ////////////console.log(element)
  checkMenuItems("graph",element)
};

NetworkGraph.prototype.collapseAll = function () {
  var vis = this,ldg=linkedDataGraph;
  ldg.collapseBranch(ldg.treeData[0])
  ldg.showFirstLevelBranch(ldg.treeData[0])
  ldg.flatten()
  vis.updateData()
  ////console.log(networkGraph.treeData)
  vis.refreshNoFilters()
}
NetworkGraph.prototype.collapseNodeBranch = function (nodeTreeData) {
  var vis = this,treeDataEl;
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
  nodeTreeData=vis.treeData.filter(d=>d.id==nodeTreeData.id)[0]
  nodeTreeData["children"].forEach(function(r){
    treeDataEl=vis.treeData.filter(d=>d.id==r.id)
    if(treeDataEl.length>0){
      recurse(treeDataEl[0]);
      treeDataEl[0]._children = treeDataEl[0].children;
      delete treeDataEl[0].children;
    }
    
  })

  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

}
NetworkGraph.prototype.expandNodeBranch = function (nodeTreeData) {
  var vis = this
  nodeTreeData=vis.treeData.filter(d=>d.id==nodeTreeData.id)[0]
  nodeTreeData.children = nodeTreeData._children;
  delete nodeTreeData._children;

  vis.data=flatten(vis.treeData).flatData
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

}
NetworkGraph.prototype.expandAll = function () {
  var vis = this,ldg=linkedDataGraph;
  ldg.expandBranch(ldg.treeData[0])
  ldg.flatten()
  vis.updateData()
  vis.refreshNoFilters()
  
}

NetworkGraph.prototype.collapseBranch = function (node){
  var vis = this,ldg=linkedDataGraph;

  ldg.collapseBranch(node)
  ldg.flatten()
  vis.updateData()
  vis.refreshNoFilters()
}

NetworkGraph.prototype.expandBranch = function (node){
  var vis = this,ldg=linkedDataGraph;

  ldg.expandBranch(node)
  ldg.flatten()
  vis.updateData()
  vis.refreshNoFilters()
}

NetworkGraph.prototype.checkCollapseExpandBranch = function (node){
  var vis = this;
  if(vis.treeData.filter(d=>d.id==node.id)[0]["children"]){
    vis.collapseBranch(node)
  }else if(vis.treeData.filter(d=>d.id==node.id)[0]["_children"]){
    vis.expandBranch(node)
  }
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
          collapseNode(d)
        })
      }
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

NetworkGraph.prototype.refresh = function (node){
  var vis = this;
  vis.addingGraph=true
  console.log("refresh")
  vis.updateData()
  if(configRow){
    if(!vis.queriesArray){
      vis.queriesArray=[]
    }
    vis.queriesArray.push({"option":configRow.option,"query":configRow.query})
  }
  vis.addClassesShow()

  vis.dataJoinGraph()
  vis.enterGraph()
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()
  vis.updateFilters()
  legend.addColors()
  //vis.refreshNoFilters()
}

NetworkGraph.prototype.getFilteredOrNotFilteredData = function (){
  var vis = this,ldg=linkedDataGraph;
  if(ldg.dataFiltered){
    vis.data=ldg.dataFiltered.flatData
    vis.treeData=ldg.treeDataFiltered
  }else{
    vis.data=ldg.data.flatData
    vis.treeData=ldg.treeData
  }
}
NetworkGraph.prototype.refreshNoFilters = function (){
  var vis = this;
  vis.addingGraph=true

  vis.getFilteredOrNotFilteredData()
  vis.refreshCommon()
}

NetworkGraph.prototype.refreshClearFilters = function (){
  var vis = this;
  //vis.addingGraph=true
  vis.updateData()
  vis.refreshCommon()
}
NetworkGraph.prototype.refreshCommon = function (){
  var vis = this;
  vis.dataJoinGraph()
  vis.enterGraph()
  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()
}

NetworkGraph.prototype.updateData = function (){
  var vis = this;
  vis.data=linkedDataGraph.data.flatData
  vis.treeData=linkedDataGraph.treeData
  vis.allData=JSON.parse(JSON.stringify(vis.data));
}

NetworkGraph.prototype.addClassesShow = function(){
  var vis=this,newClasses;
}

NetworkGraph.prototype.setColorScale = async function(){
  var vis=this;

  if(configRow.class){
    setColorScaleBasic()
  }else{
    setColorScaleExpert()
  }

  function setColorScaleBasic(){
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
  
    vis.colorScaleRange=vis.colors.slice(0,Object.values(vis.nodesClassesShow).length)
    vis.colorScaleDomain=Object.values(vis.nodesClassesShow)
  }
  function setColorScaleExpert(){
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
    //vis.nodesClassesShow=["uri","bnode","literal","menu option","link basic graph","typed-literal","Results collapsed"]
    nodesClassesCorrespondence={uri:"uri",bnode:"bnode",literal:"literal","menu-option":"menu option",link_basic_graph:"link basic graph","typed-literal":"typed-literal","more_results":"Results collapsed"}
    vis.nodesClassesShow=nodesClassesCorrespondence

    vis.colorScaleRange=["#6EE7B7","#FCD34D","#F9A8D4","#93C5FD","#EF4444","#F9A8D4","#8B5CF6"]
    vis.colors=["#6EE7B7","#FCD34D","#F9A8D4","#93C5FD","#EF4444","#F9A8D4","#8B5CF6"]
  
    vis.colorScaleDomain=Object.values(vis.nodesClassesShow)
  }

}

NetworkGraph.prototype.updateFilters = async function () {
  var vis=this,newFilterClasses,existingFilterClasses,filterClass;
  if(configRow){
    if(configRow.class){
      if(configRow.filters){
        if((configRow.filters.length!=0)&&(configRow.filters!="None")){
          newFilterClasses=[...new Set(configRow.filters.map(d=>d.class))]
          existingFilterClasses=vis.filterClassesObjects.map(f=>f.name)
          for (let i = 0; i < newFilterClasses.length; i++) {
            if(!existingFilterClasses.includes(newFilterClasses[i])){
              filterClass=new FilterClassBasic(newFilterClasses[i])
              await filterClass.init()
              filterClass.checkHidden()
              vis.filterClassesObjects.push(filterClass) 
            }else{
              networkGraph.filterClassesObjects.filter(d=>d.name==newFilterClasses[i])[0].filters.forEach(function(f){
                f.resetAllValues()
              })
            }
          }
        }
      }
    }else{
      const filterClass=new FilterClassExpert(configRow.node["uri"])
      filterClass.init()
      vis.filterClassesObjects.push(filterClass) 
      getFiltersVisibility()
    }
  }
}

class NetworkGraphNotImported extends NetworkGraph {
  async addClassesShow() {
    super.addClassesShow();
    var vis=this,newClasses;
    newClasses=configRow.getClassesCorrespondence()
    for (let key in newClasses) {
      if(!Object.keys(vis.nodesClassesShow).includes(key)){
        vis.nodesClassesShow[key]=newClasses[key]
      }
    }
  }
  setColorScale() {
    var vis=this;
    vis.nodesClassesShow=configRow.getClassesCorrespondence()
    super.setColorScale()
  }
  async getFilters() {
    var vis=this,newFilterClasses,filterClass;
    vis.filterClassesObjects=[]
    if(configRow.filters){
      if(configRow.filters.length!=0){
        newFilterClasses=[...new Set(configRow.filters.map(d=>d.class))]
        for (let i = 0; i < newFilterClasses.length; i++) {
        //newFilterClasses.forEach(function(f){
          filterClass=new FilterClassBasic(newFilterClasses[i])
          await filterClass.init()
          vis.filterClassesObjects.push(filterClass) 
        //})
        }
      }
    }
    getFiltersVisibility()
    ////////////////////////////////////////////////console.log("en getfilters final")

  }
}
class NetworkGraphImported extends NetworkGraph {
  addClassesShow() {
    var vis=this;
    super.addClassesShow();

    vis.nodesClassesShow=vis.classesCorrespondence
  }
  setColorScale(){
    var vis=this;
    vis.nodesClassesShow=vis.classesCorrespondence
    super.setColorScale()
  }
  getFilters() {
    var vis=this,filterClass;
    ////////////console.log("getFilters")
    console.log(vis.importedFilterClasses)
    vis.importedFilterClasses.forEach(function(ifc){
      //////////console.log(ifc)
      filterClass=new FilterClassBasic(ifc.name)
      filterClass.getCode()
      //////////console.log("after class filter added")
      filterClass.filters=[]
      vis.filterClassesObjects.push(filterClass)
      //////////console.log(vis.filterClassesObjects)
      ifc.filters.forEach(function (f){
        filterClass.addFilterTypeImported(f,true)
      })
      filterClass.checkHidden()
    })
    //getFilters()
  }
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
  return forces
}

function dragStart(d) {
  //console.log("entra en dragStart")
  //console.log(d);
  ////console.log(d.y);
  //vis.g.attr("transform","translate("+(d3.event.transform.x)+","+(d3.event.transform.y)+") scale(" + d3.event.transform.k + ")")
  lineDragActive = true;
  if (!d3.event.active) networkGraph.simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
/*   networkGraph.simulation.alphaTarget(0.5).restart();
  d.fx = d.x;
  d.fy = d.y; */
}

function drag(d) {
  //console.log('dragging');
  networkGraph.simulation.alpha(0.5).restart()
  ////console.log(d3.event.x)
  ////console.log(d3.event.y)
  ////console.log(d3.event.transform.x)
/*   d.fx = d3.event.x;
  d.fy = d3.event.y; */
  d.fx= d3.event.x;
  d.fy= d3.event.y;
  /* //console.log(d3.select("#"+d.id+"_g").attr("transform","translate("+d3.event.x+","+d3.event.y+")"))
  //console.log(d.x)
  //console.log(d.y) */
 /*  d.fx = d3.event.x;"
  d.fy = d3.event.y; */
}

function dragEnd(d) {
  //console.log('drag end');
  lineDragActive = false;
  if (!d3.event.active) networkGraph.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  /* networkGraph.simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null; */
}