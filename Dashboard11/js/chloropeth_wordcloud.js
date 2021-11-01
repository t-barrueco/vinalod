/*
* chloropeth.js
*/

mapOrg = function(_parentElement,_data,_dataProjects){
    this._parentElement=_parentElement;
    this.data=_data;
    this.dataProjects=_dataProjects;
    this.dataAll=_data;
    this.initVis();

};

mapOrg.prototype.initVis=function(){
    var vis=this;
    var legendLabels=[]
    var minZoom;
    var maxZoom;

    ////////////////console.log(vis.data)
    parentNodeWidth=d3.selectAll("#map-chart").node().getBoundingClientRect().width;
    parentNodeHeight=d3.selectAll("#map-chart").node().getBoundingClientRect().height;

    vis.margin = {top: 0, right:0, bottom: 0, left: 0},
    vis.width = parentNodeWidth - vis.margin.left - vis.margin.right,
    vis.height = parentNodeHeight - vis.margin.top - vis.margin.bottom;
    vis.centered = null;
    vis.countrySelected=false
    vis.codeCountrySelected="none"
    vis.tipCoord=[-350,10]

    vis.svg=d3.selectAll("#map-chart")
    .append("svg")
    .attr("viewBox", "0 0 "  + vis.width + " " + vis.height)
    .attr("preserveAspectRatio", "none")

    vis.svg.g= vis.svg.append("g")
      .attr("transform", "translate(-60,170)");

    let maxNumOrg=d3.max(vis.data,
      d=>d.value);
    let medianNumOrg=d3.median(vis.data,
      d=>d.value);    
    let quantileNumOrg25=d3.quantile(vis.data, 0.25, d => d.value)
    let quantileNumOrg75=d3.quantile(vis.data, 0.75, d => d.value)  
    var interpolator = d3.interpolateRgb.gamma(2.2)("purple", "orange");
   
  vis.cScale = d3.scaleThreshold()
  .domain([10,50,100,500,1000,2000,3000,4000])
  .range(["#FEF5AC","#FDEB8B","#FBD74A","#F7B242","#F6A03F","#F06933","#D44F30","#9C1A29","#800026"])
  
  vis.legendWidth = d3.selectAll("#legendMap").node().offsetWidth;

  vis.svgLegend = d3.select("#legendMap")
  .append("svg")
  .attr("width", vis.width)
  .attr("height", 120)
  .append("g")

  vis.legend=vis.svgLegend
  .attr("class", "legend")

        
    vis.cScale.domain().forEach(element => legendLabels.push(element));
    var thresholdScale = d3.scaleThreshold()
          .domain(legendLabels)
          .range(vis.cScale.range());

        var legend = d3.legendColor()
        .shapeWidth(45)
        .orient('horizontal')
        .labelFormat(".0f")
        .labels(d3.legendHelpers.thresholdLabels)
        .labelWrap(50)
        .scale(thresholdScale)

        vis.legend
        .attr("transform","translate(80,10)")
        .style("font-size","12px")
        .call(legend)
        
    vis.wrangleData();
    vis.drawMap();
}

mapOrg.prototype.wrangleData=function(){
  var vis=this;
}


mapOrg.prototype.drawMap=function(){
    var vis=this;

vis.projection = d3.geoMercator()
.scale(90)
.translate([340, 20])

vis.path = d3.geoPath()
.projection(vis.projection);
    

function zoomed() {
  t = d3
    .event
    .transform;

  vis.svg.g
    .attr("transform", "translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
}

// Define map zoom behaviour
zoom = d3.zoom()
.on("zoom", zoomed);


// add zoom functionality
vis.svg.call(d3.zoom()
  .on("zoom", zoomed))
  .on("dblclick.zoom", null);

d3.json("../data/world-110m_XKX.geojson").then(function(mapInfo){    
    mapInfo.features=mapInfo.features.map(d=>{
        let country=d.id;

        dataCountry=vis.data.filter(function(d){
          return d.key==country
        })
        if (dataCountry.length == 0){
          ocurrences=0;
          countryName=d.properties.name
        }else{
          ocurrences=dataCountry[0]["value"]
          countryName=dataCountry[0]["countryName"]
        }
        d.properties.ocurrences=ocurrences;
        d.properties.countryName=countryName;
        return d;
    })

    vis.mapInfo=mapInfo;

    vis.tip=d3.tip()
    .attr('class', 'd3-tip')
    .offset([0,0])
    .html(function(d){
        var text = `
            <table style="margin-left: 2.5px">
                <tr><td>Country: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.properties.countryName + `</span></td></tr>
                <tr><td>Organisations: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.properties.ocurrences + `</span></td></tr>
           </table>
           <hr>
           Click on country to zoom in and select projects for that country.
           <br>
           Click again to zoom out`;
        return text;
    });
    vis.svg.g.call(vis.tip);

    vis.map=vis.svg.g
        .attr("class", "countries")
        .selectAll("path")
        .data(mapInfo.features.filter(d => d.id !== "ATA"))

    vis.map
    .attr("fill",
    d=>d.properties.ocurrences ?
    vis.cScale(d.properties.ocurrences):
    "white")


    vis.map
        .enter().append("path")
            .attr("fill",
                d=>d.properties.ocurrences ?
                vis.cScale(d.properties.ocurrences):
                "white")
            .style("stroke", function(d){
              return "grey"
              //}
            })
            .style("stroke-width", 0.5)
            .attr("d", d=>vis.path(d))
            .attr("class", "country")
            .attr("id", function(d){
              return d.id})
            .on("click.center",function(d){
                if (d.properties.ocurrences!=0){
                  d3.selectAll(".country").classed("country-on", false);
                  d3.select(this).classed("country-on", true);
                  d3.select(this).style("stroke", "black")
                  .style("opacity", 1);
                  vis.centerMap(d,null);

                  if (vis.centered == null){
                    d3.selectAll(".country").classed("country-on", false);
                  };
              }
            })
            .on("click", function(d){
              console.log(dataTableBefore)
              console.log(dataTableBeforeCountry)
              if(d.properties.ocurrences>0){
                if (vis.codeCountrySelected==this.id){
                  d3.selectAll(".country").style("opacity", 1)
                  vis.countrySelected=false
                  $('#previous_table').hide(); // MODIFICATIONS
                  $("#next_table").hide(); // MODIFICATIONS
                  console.log(dataTableBefore)
                  console.log(dataTableBeforeCountry)
                  console.log(termSelected)
                  if (termSelected!=undefined){
                    console.log(dataTable)
                    console.log(dataTableBeforeCountry)
                    if (vis.centered){
                      dataTable=dataTableBeforeCountry
                      dataTableBeforeCountry=undefined
                      dataTableBefore=undefined
                    }else{
                      console.log(dataTableBefore)
                      console.log(dataTableBeforeCountry)
                      dataTable=dataTableBeforeCountry
                      console.log(dataTable)
                    }

                  }else{
                    console.log(vis.centered)
                    dataTable=dataTableBefore
                    dataTableBefore=undefined
                  }
                  table_proj(dataTable);
                  vis.codeCountrySelected="none"
                }else{
                  d3.selectAll(".country").style("opacity", 0.2)
                  d3.select(this).style("stroke", "black")
                  .style("opacity", 1);
                  vis.countrySelected=true
                  vis.codeCountrySelected=this.id
                  filter_table_country(this.id)
                } 
              }
            })
            .on("mouseover", function(d){
              showTooltip(d,"map",vis.tipCoord[0],vis.tipCoord[1])
            })
            .on("mouseout", hideTooltip)
            .on("mousemove",function(d){
              moveTooltip(d,vis.tipCoord[0],vis.tipCoord[1])
            })

            .on("mouseout.stroke",function(d){
              if (vis.countrySelected){
                if (this.id!==vis.codeCountrySelected){
                  d3.select(this).style("stroke", "grey")
                  .style("opacity", 0.2);
                }
              }else{
                d3.select(this).style("stroke", "grey")
              }
              vis.tip.show;
            })
  });

}


mapOrg.prototype.centerMap=function(d,country){
    vis=this;
    var x, y, k;
    var area = vis.path.area(d);

    if (country != null){
        test=vis.mapInfo.features.filter(function(dp){
        return (d.country_code==dp.id)
      })
    }

    var centroid = vis.path.centroid(d);
    if ((d && vis.centered !== d) && (country==null)){

      d3.selectAll("#map")
      .attr("class","col-md-3 col-sm-3 col-lg-5")
      d3.selectAll("#table-bar")
      .attr("class","col-md-6 col-sm-6 col-lg-7 h-50")

      if (area>1000){
        x= centroid[0] - 230
        //y= centroid[1] - 30;
        y= centroid[1]-80;
        k=1.5
      }
      else if (area>500){
        x= centroid[0] - 150
        y= centroid[1] - 50;
        k=2
      }else{
        x= centroid[0] - 30
        y= centroid[1] -20;
        k=6
      }
      vis.centered = d;
    } else if (country){
      test=test[0]

      x = centroid[0];
      y = centroid[1];
      k = 3;
      vis.centered = test;
    } else {
      d3.selectAll("#map")
      .attr("class","col-md-6 col-sm-6 col-lg-12")
      d3.selectAll("#table-bar")
      .attr("class","col-md-6 col-sm-6 col-lg-7 h-50 collapse")
      x=40
      y=-170
      k = 1;
      vis.centered = null;
    }

    d3.select("map-chart").select("svg").selectAll("path")
    .classed("active", vis.centered && function(d) { return d === vis.centered; });
    d3.select("#map-chart").select("svg").select("g").transition()
        .duration(750)
        .attr("transform", "scale(" + k + ")translate(" + -x + "," + -y + ")")
    parentNodeWidth=d3.selectAll("#map-chart").node().getBoundingClientRect().width;
    parentNodeHeight=d3.selectAll("#map-chart").node().getBoundingClientRect().height;

  }




  
