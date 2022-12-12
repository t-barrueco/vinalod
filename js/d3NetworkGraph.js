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
  /* vis.svg.append('defs').append('marker')
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
        .style('stroke','none') */
        
        vis.svg.append('defs')
        .append("marker")
                .attr("id", "arrow")
                .attr("viewBox","-0 -5 10 10")
                .attr("refX","23")
                .attr("refY","0")
                //.attr("markerUnits","strokeWidth")
                .attr('markerUnits', 'userSpaceOnUse')
                .attr("markerWidth","13")
                .attr("markerHeight","13")
                .attr("orient","auto")
                .append("svg:path")
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr("fill", "black")
                .style('stroke','none');      
  
  

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
      vis.zoomed.call(vis);
      vis.zoomScale=d3.event.transform.k
      return true;
    })
    .on("start", function(){
      d3.select('body').style("cursor", "move");
      d3.event.transform.x=0
      d3.event.transform.y=0
    })
    .on("end", function(){
      vis.dragX=d3.event.transform.x
      vis.dragY=d3.event.transform.y
      vis.zoomScale=d3.event.transform.k
      d3.select('body').style("cursor", "auto"); 
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
  //console.log(vis.maxSizeNode)
  //vis.sizeNode = d3.scaleLinear()
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

  vis.updateForces();

  function ticked() {
    vis.link.attr('d', function (d){
      return   'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
    });
        /* .attr("x1", function(d) { 
            return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
 */
    vis.edgepaths.attr('d', function (d){
          return   'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        });

    vis.nodeCircle
        .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")"; })

    vis.nodeCircleFree
          .attr("transform", function(d) { 
  
            return "translate(" + d.x + "," + d.y + ")"; })
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
  .data(vis.data.links,function(d){
    return d.id;
  })

/*   vis.link=vis.linkSel
  .data(vis.data.links,function(d){
    return d.id;
  }) */

  vis.linklabels = vis.gLinks.selectAll(".linklabel")
  .data(vis.data.links,function(d){
    return d.id;
  })

  //////console.log(vis.linklabels)

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
    var vis=this,r;
    let lineHeight = 12;

    vis.maxSizeNode=d3.max(vis.data.nodes, d => d.number)  
    //console.log(vis.maxSizeNode)
    vis.sizeNode
    .domain([0,vis.maxSizeNode])

    //console.log(vis.data.nodes)
    vis.data.nodes.forEach(n=>handleMouseout(n.id))

    vis.colorScale.domain(Object.values(vis.nodesClassesShow))
    vis.colorScale.range(vis.colors.slice(0,Object.values(vis.nodesClassesShow).length))
    vis.isDblclick = false;
  
    vis.timeoutTiming = 500;

    drawLinks()

    //these arrow lines will shown only in free graph
    drawArrowLinesFree()  
    drawCirclesBasic()
    addTextForCircles()
    drawImageCirclesBasic()
    drawCirclesFree()
    drawImageClusterFree()
      
    function drawLinks(){
        vis.link=vis.link
        .enter()
        .append('path')
        .attr('class', 'link')
        //.attr('fill-opacity', 0)
        //.attr('stroke-opacity', 0)
        .attr('id',function(d){
          ////console.log(d)
          ////console.log(d.id)
          ////console.log(d.source.id+"_"+d.target.id)
          return d.id+"_link";
          //return (d.source.id+"_"+d.target.id)+"_link"
        })
        .attr('link_id',function(d){
          return d.id;
          //return d["source"]["id"]+d["target"]["id"]
        })
        .style("pointer-events", "none")
        .style("stroke", "black")
        .attr("stroke-width", 1)
        .attr("marker-end","url(#arrow)"); ;
        /* .enter().append("path")
        .attr("class", "link")
        .attr("origId",function(d){
          return (d.source.id+"_"+d.target.id)
        })
        .attr("index",function(d){
          return d.index;
                })
        .attr("value",d=>d["type"])
        .style("stroke", "black")
        .style("fill","black")
        .style("stroke-width", "1px")
        .attr('marker-end','url(#arrowhead)') 
        .on('mouseover', function(d){
          if(d["target"]["class"]=="free"){
            addTooltip(getTooltipTextFreeGraph(d))
          }
        })
        .attr("id",function(d){
          return (d.source.id+"_"+d.target.id)
        })
        .on('mouseout', function(d){
          if(d["target"]["class"]=="free"){
            deleteTooltip()
          }
        }); */
        
        vis.linklabels = vis.linklabels
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr('class', 'linklabel')
        .attr('id', function (d) {return d["id"]+"_label"})
        .attr('link_id',function(d){
          //////console.log(d)
          //////console.log(d["id"]+"_label")
          return d["id"]+"_label"
          //return d["source"]["id"]+d["target"]["id"]+"_label"
        })
        .attr('link_value',function(d){
          //////console.log(d)
          return d["relation"]
        })
        .attr('font-size', 12)
        .attr('fill', 'black')
        .append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d) {
              ////console.log(d3.select("#"+d.id+"_link"))
              return "#"+d.id+"_link"})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function(d){
              return d.relation
            });
  
/*         vis.linklabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d) {
              //////console.log(d3.select("#"+d.id))
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
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('id', function (d, i) {
          //////console.log(i)
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
            .attr('fill', 'black');
      
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
        //.attr("style","filter:url(#dropshadow)")
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
        .on('clickout', function(d){
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
        })

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
          if(d.class=="more_results"){
            return "images/bubbles.svg";
          }else{
            let bubbleImg=bubbleImage(d)
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
        .on('dblclick', function(d){
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
        })
        .attr('opacity', function(d) {
          if(vis.zoomScale>1.5){
            return 0;
          }else{
            return 1;
          }
          
        })
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
        deleteTooltip()
        d3.select("#"+circleId)
        .transition()
        .attr("r", function(d) { 
          if(d.class=="more_results"){
            return 50;
          }else{
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
  checkMenuItems("graph",element)
};

NetworkGraph.prototype.collapseAll = function () {
  var vis = this,ldg=linkedDataGraph;
  ldg.showFirstLevelBranch(ldg.treeData[0])
  ldg.flatten()
  vis.updateData()
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

  getFilteredData()

  vis.data=linkedDataGraph.data.flatData
  vis.treeData=linkedDataGraph.treeData
  if(configRow){
    if(!vis.queriesArray){
      vis.queriesArray=[]
    }
    vis.queriesArray.push(configRow.query)
  }
  vis.addClassesShow()

  vis.dataJoinGraph()

  vis.enterGraph()


  vis.initializeSimulation();
  vis.dataJoinGraph()
  vis.exitGraph()

  vis.updateFilters()
  //ECL.autoInit()
  legend.addColors()
}

NetworkGraph.prototype.refreshNoFilters = function (){
  var vis = this;
  vis.addingGraph=true

  vis.data=linkedDataGraph.data.flatData
  vis.treeData=linkedDataGraph.treeData

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

function NetworkGraphBasic(...args){
  NetworkGraph.apply(this, args);
}

NetworkGraphBasic.prototype = Object.create(NetworkGraph.prototype);

NetworkGraphBasic.prototype.addClassesShow = function(){
  var vis=this,newClasses;
}
NetworkGraphBasic.prototype.getFilters = function(){
  var vis=this;
  ////////console.log("super getFilters")
  //////console.log(vis.filterClassesObjects)
  if(vis.filterClassesObjects.length!=0){
    //$("#filters").removeClass("hidden")
    filtersVisible()
  }else{
    //$("#filters").addClass("hidden")
    filtersNotVisible()
  }
}
NetworkGraphBasic.prototype.setColorScale = async function(){
  var vis=this;
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

NetworkGraphBasic.prototype.checkMenuItems = async function(){
  let node=get_node_from_element(element.getAttribute("id").replace("_image",""))

  if(menuItems){
    await menuItems.update(node)
  }else{
    menuItems= new MenuItems(node)
  }
}

NetworkGraphBasic.prototype.updateFilters = async function () {
  var vis=this,newFilterClasses,existingFilterClasses,filterClass,values;
  if(configRow){
    if(configRow.filters){
      if((configRow.filters.length!=0)&&(configRow.filters!="None")){
        newFilterClasses=[...new Set(configRow.filters.map(d=>d.class))]
        existingFilterClasses=vis.filterClassesObjects.map(f=>f.name)
        //newFilterClasses.forEach(function(cf){
        for (let i = 0; i < newFilterClasses.length; i++) {
          if(!existingFilterClasses.includes(newFilterClasses[i])){
            filterClass=new FilterClassBasic(newFilterClasses[i])
            await filterClass.init()
            ////////console.log("checkHidden")
            filterClass.checkHidden()
            vis.filterClassesObjects.push(filterClass) 
          }else{
            networkGraph.filterClassesObjects.filter(d=>d.name==newFilterClasses[i])[0].filters.forEach(function(f){
              console.log("update filters")
              f.resetAllValues()
            })
          }
        //})
        }
      }
    }
  }
}

class NetworkGraphBasicNotImported extends NetworkGraphBasic {
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
    //////////console.log("en getfilters principio")
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
    super.getFilters()
    //////////console.log("en getfilters final")

  }
}
class NetworkGraphBasicImported extends NetworkGraphBasic {
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

    vis.importedFilterClasses.forEach(function(ifc){
      filterClass=new FilterClassBasic(ifc.name)
      filterClass.getCode()
      filterClass.filters=[]
      vis.filterClassesObjects.push(filterClass)
      ifc.filters.forEach(function (f){
        filterClass.addFilterTypeImported(f,true)
      })
    })
    super.getFilters()
  }
}

function NetworkGraphExpert(...args){
  NetworkGraph.apply(this, args);
}

NetworkGraphExpert.prototype = Object.create(NetworkGraph.prototype);

NetworkGraphExpert.prototype.setColorScale = async function(){
  var vis=this;
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
  vis.nodesClassesShow=["uri","bnode","literal","menu option","link basic graph","typed-literal"]
  nodesClassesCorrespondence={uri:"uri",bnode:"bnode",literal:"literal",link_basic_graph:"link basic graph","typed-literal":"typed-literal"}
  vis.colorScaleRange=["#6EE7B7","#FCD34D","#F9A8D4","#93C5FD","#EF4444","#F9A8D4"]
  vis.colors=["#6EE7B7","#FCD34D","#F9A8D4","#93C5FD","#EF4444","#F9A8D4"]

  vis.colorScaleDomain=Object.values(vis.nodesClassesShow)
}
NetworkGraphExpert.prototype.addClassesShow = function(){
  var vis=this,newClasses;
}

NetworkGraphExpert.prototype.updateFilters = function () {
  var vis=this,newFilterClasses,existingFilterClasses,filterClass;

}

NetworkGraphExpert.prototype.getFilters = function () {
  var vis=this
  const filterClass=new FilterClassExpert(configRow.node["uri"])
  filterClass.init()
  vis.filterClassesObjects.push(filterClass) 
}
