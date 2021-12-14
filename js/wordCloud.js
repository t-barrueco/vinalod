function wordCloudGraph(words,title,modalHeader,modalContent){
    var common = "poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";

    var word_count = {};
    
    var wordsNoStop=[]

    modalHeader.innerHTML = title

    if(d3.select("#modalGraph")){
      d3.select("#modalGraph").remove()
    }
    var div=document.createElement("div")
    div.setAttribute("id","modalGraph")
    div.setAttribute("style","overflow: auto")
    modalContent.appendChild(div)

    var stopwords=["council","(alde),","(ni)","(verts/ale)","written","mr","mrs","(s&d)","(s&d),","(ppe),","no.","no","(ppe)","(ppe-de)","council.","question","commission:","commission.","eu","ec","(ec)","i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now","european","commission","europe"]

    words.forEach(function (w){
        if(!stopwords.includes(w.toLowerCase())){
            wordsNoStop.push(w)
        }
    })

    words=wordsNoStop

      if (words.length == 1){
        word_count[words[0]] = 1;
      } else {
        words.forEach(function(word){
          var word = word.toLowerCase();
          if (word != "" && common.indexOf(word)==-1 && word.length>1){
            if (word_count[word]){
              word_count[word]++;
            } else {
              word_count[word] = 1;
            }
          }
        })
      }

    var fill = d3.scaleOrdinal(d3.schemeCategory20);

    //Construct the word cloud's SVG element

    // Set the dimensions and margins of the diagram
    var margin = {top: 20, right: 0, bottom: 0, left: 20},
    width = 1060 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var word_entries = d3.entries(word_count);

    var xScale = d3.scaleLinear()
       .domain([0, d3.max(word_entries, function(d) {
          return d.value;
        })
       ])
       .range([10,100]);

    d3.layout.cloud().size([width, height])
      .timeInterval(20)
      .words(word_entries)
      .fontSize(function(d) { return xScale(+d.value); })
      .text(function(d) { return d.key; })
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .on("end", draw)
      .start();

    function draw(words) {


        d3.select("#modalGraph").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + [width + margin.right + margin.left >> 1, height + margin.top + margin.bottom >> 1] + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return xScale(d.value) + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.key; });
    }

    d3.layout.cloud().stop();
  }


