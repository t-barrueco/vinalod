function runWordcloud(parentTag, title) {
    drawWordCloud(title);

    function drawWordCloud(title) {
      title=title.replace(" general","")
      var words = []
  
      var terms_title_selected = title_terms
        .filter(function (d) { return d.title === title; })
      var termsRep=idTermTitle.filter(function (d) { return d.title === title; })
      termsRep.forEach(function (d, i) { 
        words.push(d["term"])});
  
      var word_count = {};
      if (words.length == 1) {
        word_count[words[0]] = 1;
      } else {
        words.forEach(function (word) {
          var word = word.toLowerCase();
          if (word!=title.toLowerCase()){
           if (word != "" && word.length > 1) {
             if (word_count[word]) {
               word_count[word]++;
             } else {
               word_count[word] = 1;
             }
           }
          }
        })
      }
      var width = $(document).width();
      var height = $(document).height();
  
      width = 470
      height = 470
  
      var color = d3.scaleOrdinal(d3.schemeCategory10);
  
      word_entries = d3.entries(word_count);
      word_entries.sort((a, b) => (a.value < b.value) ? 1 : -1)

       var max=d3.max(word_entries,d=>d.value)
       var maxRange=(max-1)+10
      if (word_entries.length==0){
       var xScale = d3.scalePow()
       .domain([1,1])
       .range([36,36]);
      }else{
       var xScale = d3.scalePow()
       .domain([1,max])
       .range([12,36]);
      }

      var tipWordcloud = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          var text = `
          <table style="margin-left: 2.5px">
              <tr><td>Term: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.key + `</span></td></tr>
              <tr><td>Ocurrences: </td><td style="text-align: right"><span style='color:#1f77b4'>` + d.value + `</span></td></tr>
          </table>`;
          return text;
        });
  
      d3.select("svg").call(tipWordcloud);
      
      d3.layout.cloud().size([width, height])
        .timeInterval(20)
        .words(word_entries)
        .spiral("archimedean")
         .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { 
          return xScale(+d.value); })
        .text(function (d) { return d.key; })
        .rotate(0)
  
        .font("Impact")
        .on("end", draw)
        .start();
  
      function draw(words) {
        var titleWord,dataMapOrg

        if (words.length==0){
          words=[{"key":"no terms selected for this category","x":0,"y":0,"rotate":0,"value":1}]
        }
        d3.select(parentTag).append("g")
          .attr("transform", "translate(10,-5)")
          .attr("id", "wordcloud")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function(d) { return xScale(d.value) + "px"; })
          .style("font-family", "Impact")
          .style("font-weight", "bold")
          .style("fill", "white")
          .style("opacity", "0")
          .attr("text-anchor", "middle")
          .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .attr("titleWord",title)
          .text(function (d) { return d.key; })
          .on("mouseover", tipWordcloud.show)
          .on("mouseout", tipWordcloud.hide)
          .on("click", function (d) {
            console.log(dataTableBefore)
            console.log(dataTableBeforeCountry)

            if(d.key!="no terms selected for this category"){
             update_map_table(d,title,this)
            }
          })
          .transition()
          .duration(750)
          .style("opacity", "1")
          .style("fill", function (d, i) { return color(i); })
      }
  
      d3.layout.cloud().stop();
    }
  }