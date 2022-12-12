OptionNode = function (_option,_node) {
    this.option=_option
    this.node=_node
    this.init()
  };

OptionNode.prototype.init = async function () {
  var on=this;
  //////////////////console.log(document.getElementsByTagName("table"))

  await on.buildOption()
  //////console.log(on)
}

function OptionNodeBasic(...args){
    OptionNode.apply(this, args);
    }
    
OptionNodeBasic.prototype = Object.create(OptionNode.prototype);

OptionNodeBasic.prototype.buildOption = async function () {
    var on=this;
    on.rowConfigFile=configFile.getRowNumber(on.option)
    on.query= configFile.file[on.rowConfigFile]["query"]
    on.askquery= configFile.file[on.rowConfigFile]["askquery"]
    on.parameters= configFile.file[on.rowConfigFile]["parameters"]
    on.endpoint_url=configFile.file[on.rowConfigFile]["endpoint_url"]
    on.fromSelectToAskQuery()
  }

OptionNodeBasic.prototype.fromSelectToAskQuery = function(){
    var on=this;
    
    if(on["askquery"]=="None"){
      on.askquery=fromSelectToAskQuery(on.query)
    }
    on.replaceParmtrsQuery("askquery")
}

OptionNodeBasic.prototype.replaceParmtrsQuery = function(queryName){
  var on=this;
  if(on.node!=undefined) on[queryName]=replaceParmtrsQuery(on[queryName],on.parameters,on.node)
  }

function OptionNodeExpert(...args){
    OptionNode.apply(this, args);
    }
    
OptionNodeExpert.prototype = Object.create(OptionNode.prototype);

OptionNodeExpert.prototype.buildOption = async function () {
    var on=this;
    on.endpoint_url = on.option.match("Sparql Endpoint: (.*) and Position:")[1];
    on.position = on.option.match("and Position: (.*)")[1];
    on.query= "SELECT distinct ?s ?p ?o WHERE{{ ?s ?p ?o.} FILTER (?position=<PARAMETER>).}"
    on.askquery= "ASK WHERE{{ ?s ?p ?o.} FILTER (?position=<PARAMETER>).}".replace("position",on.position).replace("PARAMETER",on.node.uri)
  }
