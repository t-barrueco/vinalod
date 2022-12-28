d3.csv('suits.csv',function(data){
    console.log(data)
    //const links = data.links.map(d => Object.create(d));
    //const nodes = data.nodes.map(d => Object.create(d));
    const types = ["licensing", "suit", "resolved"]
    const links=data;
    var tmp=data.map(d=>d.source).concat(data.map(d=>d.target))
    console.log(tmp)
    var tmp2=Array.from([...new Set(data.map(d=>d.source).concat(data.map(d=>d.target)))])
    const height=800
    const width=600
    var nodes=[];
    var color = d3.scaleOrdinal(types, d3.schemeCategory10)
    tmp2.forEach(d=>nodes.push({"id":d}))
    console.log(nodes)
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force('collide', d3.forceCollide(d => 65))

    const svg = d3.select("#graph").append("svg")
        .attr("viewBox", [0, 0, width, height])

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(types)
        .append("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 38)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", 'M0,-5L10,0L0,5');

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .append("path")
        .attr("stroke", d => color(d.type))
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .append("g")
        //.call(drag(simulation));

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 25)
        .attr('fill', d => '#6baed6');
  
    node.append("text")
        .attr("x", 30 + 4)
        .attr("y", "0.31em")
        .text(d => d.id)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);
  
    node.on('dblclick', (e, d) => console.log(nodes[d.index]))


    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    invalidation.then(() => simulation.stop());

    //return svg.node();
})