circlePack = function(_parentElement,_root){
    this.parentElement=_parentElement;
    this.root=_root
    this.initVis();
};

circlePack.prototype.initVis=function(){
    var vis=this;
    var text;

    console.log(window.innerWidth)
    vis.svg = d3.select("#" + vis.parentElement),
    vis.margin = 500,

    vis.parentNodeWidth=vis.svg.node().parentElement.getBoundingClientRect().width;
    vis.parentNodeHeight=vis.svg.node().parentElement.getBoundingClientRect().height;

    vis.svg
    .attr("width", vis.parentNodeWidth)
    .attr("height", vis.parentNodeHeight);
/*     .attr("width",700)
    .attr("height",800) */
    vis.diameter = window.innerWidth
    diameter=vis.diameter
    vis.tipCoord=[30,30]

    vis.g = vis.svg.append("g").attr("id", "groupCircles").attr("transform", "translate(" + vis.diameter / 4 + "," + vis.diameter / 4 + ")")
    .style("font", "10px sans-serif")
    .attr("text-anchor", "middle");
    
    vis.color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["#d9e8f5", "#0468ac"])
    .interpolate(d3.interpolateHcl);


    vis.pack = d3.pack()
    .size([vis.diameter - vis.margin, vis.diameter - vis.margin])
    .padding(1);

    vis.tip = d3.tip()
    .attr('class', 'd3-tip')

    .html(function (d) {
    console.log(d)
    if (d.name=="root"){
      text = `
      <table style="margin-left: 2.5px">
          <tr><td>Category: </td><td style="text-align: right"><span style='color:#1f77b4'> all categories </span></td></tr>
          <tr><td>Occurrences: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.data["size"] + `</span></td></tr>
      </table>
      <hr>
      Click on category to zoom in and zoom out`;
      return text;
    }else{
      text = `
            <table style="margin-left: 2.5px">
                <tr><td>Category: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.data["name"] + `</span></td></tr>
                <tr><td>Occurrences: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.data["size"] + `</span></td></tr>
            </table>
            <hr>
        Click on category to zoom in and zoom out`;
      return text;
    }

    });

    vis.svg.call(vis.tip);

    vis.sizeCircle = d3.scalePow()
    .exponent(0.5)
    .range([1, vis.diameter]);

    vis.root = d3.hierarchy(vis.root)
    .sum(function (d) { return vis.sizeCircle(d.size); })
    .sort(function (a, b) { return b.value - a.value; });

    vis.focus = vis.root
    vis.nodes = vis.pack(vis.root).descendants()

    vis.idsCircles = []
 
    vis.circle = vis.g.selectAll("circle")
    .data(vis.nodes)
    .enter()

    .append("circle")
    .attr("name", function (d) { return d.data.name })
    .attr("id", function (d) {

    return get_id_circle(d)

    })
    .attr("class", function (d) {

    if ((d.parent) && (d.children) && (firstLevel.includes(d.data.name))) {
        return "node node--first-level"
    } else if ((d.parent) && (d.children)) {
        return "node node--second-level"
    } else if (d.children) {
        return "node node--root"
    } else {
        return "node node--leaf"
    }
    })
    .style("fill", function (d) { return d.children ? vis.color(d.depth) : null; })
    .on("mouseover", function(d){
      showTooltip(d,"circle_packing",vis.tipCoord[0],vis.tipCoord[1])
    })
    .on("mouseout", hideTooltip)
    .on("mousemove",function(d){
      moveTooltip(d,vis.tipCoord[0],vis.tipCoord[1])
    })
/*     .on("dblclick",function(e){ 
      e.preventDefault();
    }) */
    .on("click", function (d) {
      $("#termSearch").val('');
      $("#termSearchautocomplete-list").remove()
      termSelected=undefined

      if(d!=vis.focus){
          vis.selectBubble(d,true)       
      }else{
          vis.selectBubble(d3.select("#root").data()[0],true)
      }
      
      })

      get_arc_text(null, focus)

      vis.node = vis.g.selectAll("circle,text");
      vis.zoomTo([vis.root.x, vis.root.y, vis.root.r * 2 + vis.margin]);
      vis.n = 0;

    
}
circlePack.prototype.zoom=function(d){
    var vis=this;
    vis.focus0 = vis.focus; 
    vis.focus = vis.root;

    vis.focus=d

    vis.transition = d3.transition()
      .duration(750)
      .tween("zoom", function (d) {
  
        vis.i = d3.interpolateZoom(vis.view, [vis.focus.x, vis.focus.y, vis.focus.r * 2 + vis.margin]);
  
        return function (t) { vis.zoomTo(vis.i(t)); };
      })
      .each(function () { ++vis.n; })
      .on("end", function () {
        if (!--vis.n) {
          text_inside_circles(vis.focus, vis.diameter);
        }
      });

    if (vis.focus.data.name == "root") {
  
      vis.transition.select("#groupCircles").selectAll("text")
        .style("fill-opacity", 0)
  
      d3.selectAll(".title text")
      .style("fill-opacity", 1)
      .style("display", "block")
      d3.selectAll(".label").select("text")
      .style("display", "block")
      .style("fill-opacity", 1)
    }
}
circlePack.prototype.zoomTo=function(v){

    var vis=this;
    var a
    if (vis.focus.data.name == "root") {
      a = 1 / 1.5
    } else {
      a = 2
    }

    vis.view = v;
    var k = (vis.diameter/4.5) / vis.focus.r

    console.log("///////// antes de recorrer los nodes//////////")
    var ddefined=0,dnotdefined=0
    vis.node.attr("transform", function (d) {

      if (d!=undefined){
        ddefined+=1
        return "translate(" + ((d.x - v[0]) * k) + "," + (d.y - v[1]) * k + ")";
      }else{
        dnotdefined+=1
      }      
    });
    vis.circle.attr("r", function (d) {
      return d.r * k;
    })
    console.log("d defined:"+ddefined)
    console.log("d not defined:"+dnotdefined)
    console.log("///////// despues de recorrer los nodes//////////")
  }

circlePack.prototype.selectBubble=function(d,stopPropagation){
    var vis=this;
    if ((d.data.name == "root")){
        selectedCategory="all"
    }else{
        selectedCategory=d.data.name
    }

    d3.selectAll(".textBubble").remove()
    if(dataTableBefore){
        d3.selectAll(".country").style("opacity", 1)
        maporg.countrySelected=false
        maporg.centerMap(maporg.centered,null)
        d3.selectAll("path").style("stroke", "grey")
        dataTableBefore=undefined
        maporg.codeCountrySelected="none"
    }
    var name=get_name_euroscivoc(d.data.name)
    name=name.replace(" general","")
    categories_filtered=filter_categories(categoriesParentChild,name)
    if ((d.data.name == "root")|(vis.focus == d)) {
        dataTable=table_proj(dataIdProjectCat)
        dataMapOrg=select_organisations_category("all")
        maporg.data = dataMapOrg["count"]
        maporg.dataProjects = dataMapOrg["projects"]

    } else {

        dataMapOrg=select_organisations_category(d.data.name)

        maporg.data = dataMapOrg["count"]
        maporg.dataProjects = dataMapOrg["projects"]

        dataTable=table_proj(select_projects_category(d.data.name))
        dataTableBefore=dataTable
        dataTableBeforeCountry=dataTable
    }

    maporg.drawMap()

    if (vis.focus !== "root") {
        d3.selectAll('.textBubble').remove()
    }
    if (vis.focus !== d) {
        d3.select(".hiddenArcWrapper").remove()
        vis.zoom(d)
        if (stopPropagation){
            d3.event.stopPropagation();
        }
        
        d3.select("#wordcloud").remove()
        if (vis.focus.data.children) {
        if ((vis.focus.data.children.length == 0)) {
            runWordcloud("#groupCircles", d.data.name)
        } else {
            d3.select("#wordcloud").remove()
        }
        } else {
        runWordcloud("#groupCircles", d.data.name)
        }

    }
}

function text_inside_circles(d, diameter) {
  var child, nodes = [], childData, result = [], side,childrenChildren

  if (d) {
    var circlesId = [], selectedCircle, circlesChildren = []

    if (d.data.name !== "root") {
      circlesChildren.push(d)
    }
    if (d.data.children==undefined){
      d.data.children=[]
    }
    if (d.data.children) {
      d.data.children.forEach(function (v) {

        if (!v.children){
          v.children=[]
        }
        if (v.children.length == 0) {

          circlesId.push({ "name": v.name, "size": v.size })
        } else {

          circlesChildren.push({ "name": v.name, "size": v.size })
          v.children.forEach(function(z){
            if(!z.children){
              circlesId.push({ "name": z.name, "size": z.size })
            }else{
              if ((z.children.length == 0)) {
                circlesId.push({ "name": z.name, "size": z.size })
              }else{
                circlesChildren.push({ "name": z.name, "size": z.size })
              }
            }
          })
          
        }

      })
    }

    var g = d3.select("#groupCircles")

    for (const i in circlesChildren) {

      child = d3.selectAll("#" + get_id_circle(circlesChildren[i]))

      side = 2 * child.attr("r") * Math.cos(Math.PI / 4)
      result = child.attr("transform").split(/[/(,/);]/);
      dx = child.attr("r") - side / 2

      nodes[i] = {
        name: child.data()[0].data.name,
        depth: child.data()[0].depth,
        r: child.attr("r"),
        x: result[1],
        y: result[2]
      }
      //}
      if (circlesChildren.length !== 0) {
        get_arc_text(nodes, d)
      }
      if (circlesId.length!==0){
        for (const i in circlesId) {

          if (d.data.name !== circlesId[i].name) {

            idsCircles = []
            var t = circlesId[i].name.split(" ")
            t.forEach(function (v) {
              idsCircles.push(v.replace(/[^\w\s]|_/g, "")
                .replace(/\s+/g, " ")
                .replace("%", ""));
            })

            idsCircles = idsCircles.join("_")

            if (isNaN(idsCircles[0])) {
              selectedCircle = d3.selectAll("#" + idsCircles)
            }
            else {
              selectedCircle = d3.selectAll("#N" + idsCircles)
            }

            var radiusCircle=selectedCircle.attr("r")
            var side = 2 * d.r * Math.cos(Math.PI / 4),
              dx = d.r - side / 2;
            result = selectedCircle.attr("transform").split(/[/(,/);]/);


            var side = 2 * selectedCircle.attr("r") * Math.cos(Math.PI / 4),
              dx = selectedCircle.attr("r") - side / 2;


            radius=side
          
            gText = g

            const words = circlesId[i].name.split(/\s+/g);

            if (!words[words.length - 1]) {
              words.pop();
            }
            if (!words[0]) {
              words.shift();
            }

            lineHeight = 12

            targetWidth = Math.sqrt(measureWidth(circlesId[i].name.trim()) * lineHeight)

            let line;
            let lineWidth0 = Infinity;
            const lines = [];
            for (let i = 0, n = words.length; i < n; ++i) {
              let lineText1 = (line ? line.text + " " : "") + words[i];
              let lineWidth1 = measureWidth(lineText1, radius);
              if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
                line.width = lineWidth0 = lineWidth1;
                line.text = lineText1;
              } else {
                lineWidth0 = measureWidth(words[i]);
                line = { width: lineWidth0, text: words[i] };
                lines.push(line);
              }
            }
            radius = 0;
            for (let i = 0, n = lines.length; i < n; ++i) {
              const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
              const dx = lines[i].width / 2;
              textRadius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
            }

            gText.append("text")
                .attr("transform", `translate(${result[1]},${result[2]}) scale(${radiusCircle / textRadius/1.6})`)
              .selectAll("tspan")
              .data(lines)
              .enter().append("tspan")
                .attr("class","textBubble")
                .attr("x", 0)
                .attr("y", (d, i) => (i - lines.length / 2 + 0.8) * lineHeight)
                .style('fill', '#083573')
                .text(d => d.text);

          }

        }
      }
      
    }

  }

}

function measureWidth(text, radius) {
  const context = document.createElement("canvas").getContext("2d");
  return context.measureText(text).width;
}

function get_arc_text(nodes, focus) {
    var overlapNode = [];
    var arcText
  
    d3.select(".hiddenArcWrapper").remove()
    var v = [focus.x, focus.y, focus.r * 2 + 500]
    if (nodes == null) {
  
      d3.selectAll(".node--first-level")
        .each(function (d, i) {
          overlapNode[i] = {
            name: d.data.name,
            depth: d.depth,
            r: d.r,
            x: d.x,
            y: d.y
          }
        });
    } else {
      overlapNode = nodes;
    }
  

    var hiddenArcWrapper = d3.select("#groupCircles").append("g")
      .attr("class", "hiddenArcWrapper")
      .style("opacity", 1);
    //Create the arcs on which the text can be plotted - will be hidden
    if (nodes !== null) {
      if (nodes.length !== 1) {
        var hiddenArcs = hiddenArcWrapper.selectAll(".circleArcHidden")
          .data(overlapNode)
          .enter().append("path")
          .attr("class", "circleArcHidden")
          .attr("id", function (d, i) {
  
            return "circleArc_" + i;
          })
          .attr("d", function (d, i) {
            radio = d.r /0.98
            radioX = radio * 1.2
            radioEnd = radio * 1.2
            return "M " + - radio + " 0 A " + radio + " " + radio + " 0 1 1 " + radio + " 0";
          })
          .style("fill", "none");
  
        //var k = 420 / focus.r
  
        arcText = hiddenArcWrapper.selectAll(".circleText")
          .data(overlapNode)
          .enter().append("text")
          .attr("class", "circleText")
          .style("font-size", function (d) {
            //Calculate best font-size
            d.fontSize = d.r / 9;
            return Math.round(d.fontSize) + "px";
          })
          .attr("font-weight", "bold")
          .style('fill', '#083573')
          .attr("text-anchor", "middle")
          .attr("alignment-baseline","alphabetic")
          .attr("transform", function (d, i) {
            return "translate(" + d.x + "," + d.y + ")"
          })
          .append("textPath")
          .attr("startOffset", "50%")
          .attr("id", function (d, i) {
            return "textArc_" + i
          })
          .attr("xlink:href", function (d, i) { return "#circleArc_" + i; })
          .text(function (d) {
            return d.name.replace(/ and /g, ' & ');
          });
      } else {
        var hiddenArcs = hiddenArcWrapper.selectAll(".circleArcHidden")
          .data(overlapNode)
          .enter().append("path")
          .attr("class", "circleArcHidden")
          .attr("id", function (d, i) {
            return "circleArc_" + i;
          })
          .attr("d", function (d, i) {
            radio = d.r * 1.04
            radioX = radio * 1.2
            radioEnd = radio * 1.2
            return "M " + - radio + " 0 A " + radio + " " + radio + " 0 1 1 " + radio + " 0";
          })
          .style("fill", "none");
          
        //var k = 320 / focus.r
        var k=(diameter/5) / focus.r
        arcText = hiddenArcWrapper.selectAll(".circleText")
          .data(overlapNode)
          .enter().append("text")
          .attr("class", "circleText")
          .style("font-size", function (d) {
            //Calculate best font-size
            d.fontSize = d.r / 7;
            return Math.round(d.fontSize) + "px";
          })
          .style("font-weight", "bold")
          .style('fill', '#083573')
          .attr("text-anchor", "middle")
          .attr("transform", function (d, i) {
            return "translate(" + d.x + "," + d.y + ")"
          })
          .append("textPath")
          .attr("startOffset", "50%")
          .attr("id", function (d, i) {
            return "textArc_" + i
          })
          .attr("xlink:href", function (d, i) { return "#circleArc_" + i; })
          .text(function (d) {
            return d.name.replace(/ and /g, ' & ');
          });
      }
  
    } else {
      var hiddenArcs = hiddenArcWrapper.selectAll(".circleArcHidden")
        .data(overlapNode)
        .enter().append("path")
        .attr("class", "circleArcHidden")
        .attr("id", function (d, i) {
          return "circleArc_" + i;
        })
        .attr("d", function (d, i) {
          radio = d.r / 1.5
          return "M " + -radio + " 0 A " + radio + " " + radio + " 0 0 1 " + radio + " 0";
        })
        .style("fill", "none");
      //var k = 420 / focus.r
  
      arcText = hiddenArcWrapper.selectAll(".circleText")
        .data(overlapNode)
        .enter().append("text")
        .attr("class", "circleText")
        .style("font-size", function (d) {
          //Calculate best font-size
          d.fontSize = d.r / 10;
          return Math.round(d.fontSize) + "px";
        })
        .attr("font-weight", "bold")
        .style('fill', '#083573')
        .attr("text-anchor", "middle")
        .append("textPath")
        .attr("startOffset", "50%")
        .attr("xlink:href", function (d, i) { return "#circleArc_" + i; })
        .text(function (d) {
          return d.name.replace(/ and /g, ' & ');
        });
    }
  
  }

  
//}