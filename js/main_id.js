
var nodes=[],links=[],data={},networkGraph;parar=false
var filter="http://publications.europa.eu/resource/authority/corporate-body/PUBL",url="https://publications.europa.eu/webapi/rdf/sparql"
var buttonFilter={"corporate-body/PUBL":{"url":"https://publications.europa.eu/webapi/rdf/sparql","filter":"http://publications.europa.eu/resource/authority/corporate-body/PUBL"},
"corporate-body/CONSIL":{"url":"https://data.europa.eu/euodp/sparqlep","filter":"http://publications.europa.eu/resource/authority/corporate-body/CONSIL"},
"pub-theme/G01A":{"url":"https://publications.europa.eu/webapi/rdf/sparql","filter":"http://publications.europa.eu/resource/authority/pub-theme/G01A"},
"coronavirus-data":{"url":"https://data.europa.eu/euodp/sparqlep","filter":"http://data.europa.eu/88u/dataset/covid-19-coronavirus-data"}}

//"http://publications.europa.eu/resource/authority/corporate-body/PUBL"
/* https://data.europa.eu/euodp/sparqlep
https://www.europeandataportal.eu/sparql */
prefixes=""


  function dataViz(){
    var queryUrl
      if(document.getElementById('basic').checked) {
        url="https://data.europa.eu/euodp/sparqlep"
        prefixes=""
        sparqlQuery = "PREFIX dcat: <http://www.w3.org/ns/dcat#>  \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>  \
        PREFIX dc: <http://purl.org/dc/terms/>  \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>  \
        PREFIX dce: <http://purl.org/dc/elements/1.1/>  \
        SELECT DISTINCT ?dataset_url ?dataset ?publisher ?publisher_id ?publisher_url ?theme \
        WHERE { {?RecordURI a dcat:CatalogRecord;  \
        foaf:primaryTopic ?dataset_url . \
        ?dataset_url dc:title ?dataset ;  \
        dc:publisher ?publisherURI ;  \
        dcat:theme ?dcatTheme .  \
        ?dcatTheme skos:prefLabel ?theme .  \
        ?publisherURI skos:prefLabel ?publisher ;  \
        dce:identifier ?publisher_id ;  \
        foaf:homepage ?publisher_url .  \
        FILTER (lang(?publisher)= 'en') \
        FILTER (lang(?theme)= 'en') \
        FILTER(?publisherURI = <http://publications.europa.eu/resource/authority/corporate-body/CNECT>) \
        FILTER ( fn:contains(?dcatTheme, 'http://publications.europa.eu/resource/authority/data-theme/')) \}}"
        
        queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
        settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
        $.ajax(settings).then  (function( _data ) {
            var results = _data.results.bindings;
            console.log(results)
        })
        /* d3.json("../data/dataset_ready2.json", function(data) {
          d3.tsv("../txt/config_basicMode.txt",function(dataConfig){
              //var results = data.results.bindings;
              //data=constructTreeBasic(results,dataConfig[0])
              console.log(data)
              //data=data.flatData
              networkGraph = new NetworkGraph("#networkGraph", data);
          })
        }) */
      }else{
        sparqlQuery = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>  \
        SELECT DISTINCT ?s ?p ?o \
        where {{?s ?p ?o.} \
              bind (if(ISBLANK(?o),<LONG::bif:iri_id_num>(?o),'') as ?oID). \
              bind (if(LANG(?o),LANG(?o),'') as ?oLANG). \
              FILTER(?oLANG='en'||?oLANG='') \
              filter(?s=<"+filter+">) \
              } \
        order by DESC(?oLANG) (?p=<http://www.w3.org/2008/05/skos-xl#prefLabel>||?p=<http://www.w3.org/2008/05/skos-xl#altLabel>) ?s ?g \
        #LIMIT 25 OFFSET 0"
        queryUrl = url + "?query=" + prefixes +  encodeURIComponent(  sparqlQuery  )+ "&format=json";
        settings = { url: queryUrl, async: true   , dataType: 'jsonp'     };
        $.ajax(settings).then  (function( _data ) {
            var results = _data.results.bindings;
            data=constructTree(results,null)
            console.log(data)
            networkGraph = new NetworkGraph("#networkGraph", data);
        })
      }   

    //}
    
  }
  function updateAll(){
      networkGraph.updateAll();
    }
  function forceYChecked(checked){
    //////////////////////////////////////////////////////////////////console.log(networkGraph)
    //////////////////////////////////////////////////////////////console.log(checked)
    networkGraph.forceProperties.forceY.enabled = checked; 
    updateAll();
    //////////////////////////////////////////////////////////////////console.log("sale de forceChange")
  }
  function forceYStrength(value){
    //////////////////////////////////////////////////////////////console.log(value)
    networkGraph.forceProperties.forceY.strength=value; 
    updateAll();
  }
  function forceYY(value){
    //////////////////////////////////////////////////////////////console.log(value)
    networkGraph.forceProperties.forceY.y=value; 
    updateAll();
  }
  function forceCenterX(value){
    networkGraph.forceProperties.center.x=value; 
    updateAll()
  }
  function forceCenterY(value){
  networkGraph.forceProperties.center.y=value;
  updateAll();
  }
  function forceChargedChecked(checked){
    networkGraph.forceProperties.charge.enabled = checked; 
    updateAll()
  }
  function forceChargeStrength(value){
    networkGraph.forceProperties.charge.strength=value; 
    updateAll();
  }
  function forceChargeDistanceMin(value){
    networkGraph.forceProperties.charge.distanceMin=value; 
    updateAll()
  }
  function forceChargeDistanceMax(value){
    networkGraph.forceProperties.charge.distanceMax=value; 
    updateAll()
  }
  function forceCollideChecked(checked){
    networkGraph.forceProperties.collide.enabled = checked; 
    updateAll();
  }
  function forceCollideStrength(value){
    networkGraph.forceProperties.collide.strength=value; 
    updateAll();
  }
  function forceCollideRadius(value){
    networkGraph.forceProperties.collide.radius=value;
    updateAll();
  }
  function forceCollideIterations(value){
    networkGraph.forceProperties.collide.iterations=value;
    updateAll();
  }
  function forceXChecked(checked){
    networkGraph.forceProperties.forceX.enabled = checked; 
    updateAll();
  }
  function forceXStrength(value){
    networkGraph.forceProperties.forceX.strength=value; 
    updateAll();
  }
  function forceXX(value){
    networkGraph.forceProperties.forceX.x=value; 
    updateAll();
  }
  function forceLinksChecked(checked){
    networkGraph.forceProperties.link.enabled = checked; 
    updateAll();
  }
  function forceLinksDistance(value){
    networkGraph.forceProperties.link.distance=value; 
    updateAll();
  }
  function forceLinksIterations(value){
    networkGraph.forceProperties.link.iterations=value; 
    updateAll();
  }

  function constructTree(results,node){
    var tempData=[],flatData,idSubject,idProperty,idObject;
    //console.log(id)
    if (results.length>0){
      if (node){
        results.forEach(function(r){
          //////////////////////console.log(r)
          idSubject=removeChars(r.s.value)+"_"+removeChars(r.p.value)+"_"+removeChars(r.o.value)
          idProperty=removeChars(r.p.value)+"_"+removeChars(r.o.value)+"_"+removeChars(r.s.value)
          idObject=removeChars(r.o.value)+"_"+removeChars(r.s.value)+"_"+removeChars(r.p.value)
          position=tempData.indexOf(tempData.filter(function(item) {
            return item.id == idSubject
          })[0])
          if(position==-1){
            tempData.push({"id":idSubject,"value":r.s.value,"shape":1,"type":r.s.type,"children":[{"id":idProperty,"value":r.p.value,"shape":2,"type":r.p.type}]})
          }else{
            position2=tempData[position]["children"].indexOf(tempData[position]["children"].filter(function(item) {
              return item.id == idProperty
            })[0])
            if(position2==-1){
              tempData[position]["children"].push({"id":idProperty,"value":r.p.value,"shape":2,"type":r.p.type})
            }
          }
          position=tempData.indexOf(tempData.filter(function(item) {
            return item.id == idProperty
          })[0])
          if(position==-1){
            tempData.push({"id":idProperty,"value":r.p.value,"shape":2,"type":r.p.type,"children":[{"id":idObject,"value":r.o.value,"shape":1,"type":r.o.type}]})
          }else{
            position2=tempData[position]["children"].indexOf(tempData[position]["children"].filter(function(item) {
              return item.id == idObject
            })[0])
            if(position2==-1){
              tempData[position]["children"].push({"id":idObject,"value":r.o.value,"shape":2,"type":r.o.type})
            }
          }
          //////////////////////////////////////console.log(tempData)
        })
        //////////////////////////////////////console.log(tempData[0].children.length)
        for (i = 0; i < networkGraph.treeData.length; ++i) {
          for (j = 0; j < networkGraph.treeData[i].children.length; ++j) {
            if(networkGraph.treeData[i].children[j].id==node.id){
              networkGraph.treeData[i].children[j].number=tempData[0].children.length
            }
          }
        }
        //////////////////////////////////////console.log(networkGraph.treeData)
        networkGraph.treeData=networkGraph.treeData.concat(tempData)
        //////////////////////////////////////console.log(networkGraph.treeData)
        tempData=networkGraph.treeData
      }else{
        results.forEach(function(r){
          //////////////////////console.log(r)
          idSubject=removeChars(r.s.value)+"_"+removeChars(r.p.value)+"_"+removeChars(r.o.value)
          idProperty=removeChars(r.p.value)+"_"+removeChars(r.o.value)+"_"+removeChars(r.s.value)
          idObject=removeChars(r.o.value)+"_"+removeChars(r.s.value)+"_"+removeChars(r.p.value)
          if (!r.o.value.endsWith("y/")){
            ////////////////////console.log(r.o.value)
            //////////////////////console.log(r.o.value.endsWith("/"));
            position=tempData.indexOf(tempData.filter(function(item) {
              return item.id == idSubject
            })[0])
            if(position!=-1){
              position2=tempData[position]["children"].indexOf(tempData[position]["children"].filter(function(item) {
                return item.id == idProperty
              })[0])
              if(position2==-1){
                tempData[position]["children"].push({"id":idProperty,"value":r.p.value,"shape":2,"type":r.p.type})
                ////////////////////////////////////////console.log(tempData)
              }
            }else{
              tempData.push({"id":idSubject,"value":r.s.value,"shape":1,"type":r.s.type,"children":[{"id":idProperty,"value":r.p.value,"shape":2,"type":r.p.type}]})
            }
            position=tempData.indexOf(tempData.filter(function(item) {
              return item.id == idProperty
            })[0])
            if(position!=-1){
              position2=tempData[position]["children"].indexOf(tempData[position]["children"].filter(function(item) {
                return item.id == idObject
              })[0])
              if(position2==-1){
                tempData[position]["children"].push({"id":idObject,"value":r.o.value,"shape":1,"type":r.o.type})
              }
            }else{
              tempData.push({"id":idProperty,"value":r.p.value,"shape":2,"type":r.p.type,"children":[{"id":idObject,"value":r.o.value,"shape":1,"type":r.o.type}]})
            }
          }
          
        })
      }
      
    ////////////console.log(tempData)
    flatData=flatten(tempData)
    return flatData
    }
    return [];
  }

  function constructTreeBasic(results,config){
    var tempData=[],flatData,children=[],nodes=[],links=[],hierarchy=[],properties=[],tempProp={},position,position2;

    

    
    
    return [];
  }

  function flatten(root) {
    var nodes = [], links=[],number,children=0;
    ////////////////////////////////////////console.log(root)
/*     root.forEach(function(d){
      ////////////////////////////////////////console.log(d)
      if (d.children){
        children+=d.children.length
      }
    }) */
    //////////////////////////////////////////console.log(children)
    function recurse(node) {
      //////////////////////////////console.log(node)
      var i=0
      if (node.children){
        //////////////////////////console.log(node.children)
        node.children.forEach(function(c){
          ////////////////////////console.log(c)
            position=links.indexOf(links.filter(function(item) {
              return ((item.source == node.id)&&(item.target == c.id))
            })[0])
            if(position==-1){
              links.push({"source": node.id, "target": c.id,"id":(removeChars(node.id)+"_"+removeChars(c.id))})
              i+=1;
            }
            recurse(c)
        });
      } 
      position=nodes.indexOf(nodes.filter(function(item) {
        return item.id == node.id
      })[0])
      if(position==-1){
        node["number"]=0
        nodes.push(node);
      }
    }
    root.forEach(function(r){
      position=nodes.indexOf(nodes.filter(function(item) {
        return item.id == r.id
      })[0])
      if(position==-1){
        if (r.children){
          number=r.children.length
        }else{
          number=0
        }
        r["number"]=number
        nodes.push(r);
      }
    })
    root.forEach(function(r){
      console.log(r)
      recurse(r);
    })
    //////////////////////////////////////console.log(links)
    //throw new Error("Something went badly wrong!");
    return {"flatData":{"nodes":nodes,"links":links},"treeData":root};
  }

  function basicModeData(data){
    var elements=[],uriException=["http://purl.org/dc/terms/title","http://purl.org/dc/terms/description"]
    //var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

    //var regex = new RegExp(expression);

/*     test="Dataset replaced by:  http://data.europa.eu/euodp/data/dataset/HH5H6xSuF7o7Al1vfwA"
    //////////////////////////////console.log(test.match(regex))
    test="Dataset replaced by"
    //////////////////////////////console.log(test.match(regex)) */
    //var t = 'www.google.com';

/*     if (t.match(regex)) {
      alert("Successful match");
    } else {
      alert("No match");
    } */
/*     uriException=["http://purl.org/dc/terms/title",
    "http://schema.org/url","http://purl.org/dc/terms/description"] */
    ////////////////////////////////console.log(data)
    data.forEach(function(d){
      //////////////////////////////console.log(d)
      //if((!((d.o.type=="uri")||(d.o.type=="bnode")))||(uriException.includes(d.o.value))){
      
      if (!d.o.value.match(regex)) {
      //if(!((d.o.type=="uri")||(d.o.type=="bnode"))){
        
        //////////////////////////////console.log(d.p.value)
        position=elements.indexOf(elements.filter(function(k) {
          return k.value == d.s.value
        })[0])
        if(position==-1){
          if((d.p.value=="http://www.w3.org/2004/02/skos/core#prefLabel")||(d.p.value=="http://purl.org/dc/terms/title")){
            //label=d.o.value
            //////////////////////////////console.log(d)
            elements.push({"value":d.s.value,"properties":[d.o.value],"links":[],"label":d.o.value})
          }else{
            elements.push({"value":d.s.value,"properties":[d.o.value],"links":[]})
          }
          //////////////////////////////console.log(elements)
          //throw new Error("Something went badly wrong!");
          
        }else{
          if((d.p.value=="http://www.w3.org/2004/02/skos/core#prefLabel")||(d.p.value=="http://purl.org/dc/terms/title")){
            //label=d.o.value
            //////////////////////////////console.log(d)
            elements[position]["label"]=d.o.value
            //////////////////////////////console.log(d.o.value)
          }
          elements[position]["properties"].push(d.o.value)
          //////////////////////////////console.log(elements)
          //throw new Error("Something went badly wrong!");
        } 
      }else{
        if (d.p.value=="http://schema.org/url"){
          position=elements.indexOf(elements.filter(function(k) {
            return k.value == d.s.value
          })[0])
          if(position==-1){
            elements.push({"value":d.s.value,"links":[],"properties":[],"linksLabels":[d.o.value]})
          }else{
            elements[position]["linksLabels"]=[d.o.value]
          }
        }else{
          position=elements.indexOf(elements.filter(function(k) {
            return k.value == d.s.value
          })[0])
          if(position==-1){
            elements.push({"value":d.s.value,"links":[d.o.value],"properties":[]})
          }else{
            elements[position]["links"].push(d.o.value)
          }
        } 
      }
      ////////////////////////////////console.log(elements)
    })
    //////////////////////////////console.log(elements)
    elements.forEach(function(d){
      //////////////////////////////console.log(d)
      d.links.forEach(function(k){
        //////////////////////////////console.log(k)
          if(d.linksLabels){
            d.linksLabels.push(elements.filter(function(s) {
              return s.value == k
            })[0].properties[0])
          }else{
            d.linksLabels=[elements.filter(function(s) {
              return s.value == k
            })[0].properties[0]]
          }
          //////////////////////////////console.log(d)
        //}
        //throw new Error("Something went badly wrong!");
      })
      /* if (d.properties.length==0){
        //////////////////////////////console.log(d)
      } */
      /* position=elements.indexOf(elements.filter(function(k) {
        return k.value == d.s.value
      })[0]) */
    })
    ////////////////////////////console.log(elements)
    /* elements.forEach(function(d){
      //////////////////////////////console.log(d)
      position=elements.indexOf(elements.filter(function(k) {
        return k.link == d.s.value
      })[0])
      if(position==-1){
        elements.push({"value":d.s.value,"properties":[d.o.value],"links":[]})
      }else{
        elements[position]["properties"].push(d.o.value)
      } 
    }) */
    return elements;
  }

  