var optionsMenuHtml,configFile
function dataViz(){
    var optionsMenu,html;
          d3.json("config_basicMode.json",function(dataConfig){
                console.log(dataConfig)
                configFile=dataConfig
                console.log(dataConfig.filter(d=>d.collection=="eu_vocabularies"))
                optionsMenu=dataConfig.filter(d=>d.collection=="eu_vocabularies")
                $.get("optionMainMenu.html", function (data) {
                    optionsMenuHtml=data
                    appendHtmlOptions(optionsMenu)
                });
                //$.get("optionMainMenu.html", function (data) {
                    //$("#appendToThis").append(data);
                    //console.log(data.repeat(6))
                    //console.log(typeof(data))
                    //htmlObject.innerHTML = data.repeat(6);
                    //$("#options-menu").append(htmlObject)
/*                     $("#options-menu").load(htmlObject, function(responseTxt, statusTxt, jqXHR){
                        if(statusTxt == "error"){
                            alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
                        }
                    }) */
                //});
                
          })
/*     $("button").click(function(){
        $("#tabs-sections").load("tabMainMenu.html", function(responseTxt, statusTxt, jqXHR){
            if(statusTxt == "success"){
                alert("New content loaded successfully!");
            }
            if(statusTxt == "error"){
                alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
            }
        });
    }); */
/*     $("#tabs-sections").load("tabMainMenu.html", function(responseTxt, statusTxt, jqXHR){
        if(statusTxt == "error"){
            alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
        }
    });
    $("#options-menu").load("optionMainMenu.html", function(responseTxt, statusTxt, jqXHR){
                if(statusTxt == "error"){
                    alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
                }
            })
    $("#iconMenu1").load("../images/person_icon.svg", function(responseTxt, statusTxt, jqXHR){
                        if(statusTxt == "error"){
                            alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
                        }
                    }) */
};
function expertMode(){
    if($("#flyoutMenu").hasClass("opacity-100")){
        $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
        $("#flyoutMenu").addClass("opacity-0 translate-y-1")
    }
}
function basicMode(){
    console.log("basicMode")
    console.log($("#flyoutMenu").attr("class"))
    console.log($("#flyoutMenu").hasClass("opacity-0"))
    if($("#flyoutMenu").hasClass("opacity-0")){
        $("#flyoutMenu").addClass("transition ease-out duration-200")
        $("#flyoutMenu").removeClass("opacity-0 translate-y-1")
        $("#flyoutMenu").addClass("opacity-100 translate-y-0")
    }else{
        changeCollectionOptions("eu_vocabularies")
        $("#flyoutMenu").removeClass("opacity-100 translate-y-0")
        $("#flyoutMenu").addClass("opacity-0 translate-y-1")
    }
    
}
function changeBasicGraph(option){
    console.log(option)
    console.log($(option).find( "#optionMain" ).text().trim())
    
}
function changeCollectionOptions(collection){
    var newCollection,oldCollection;
    console.log(collection)
    console.log(configFile)
    console.log($("#"+collection))
    console.log($("#"+collection).find(".bg-transparent"))
    console.log($("#"+collection).find(".bg-transparent").length)
    console.log($("#tabs-sections").find("nav").find("bg-indigo-500"))
    oldCollection=$("#tabs-sections").find(".bg-indigo-500")
    
    console.log(oldCollection)
    oldCollection.removeClass("bg-indigo-500")
    oldCollection.addClass("bg-transparent")
    oldCollection.parent().removeClass("text-gray-900")
    oldCollection.parent().addClass("text-gray-500")

    if($("#"+collection).find(".bg-transparent").length==1){
        newCollection=$("#"+collection).find(".bg-transparent")
        newCollection.removeClass("bg-transparent")
        newCollection.addClass("bg-indigo-500")
        newCollection.parent().addClass("text-gray-900")
        newCollection.parent().removeClass("text-gray-500")
    }
    optionsMenu=configFile.filter(d=>d.collection==collection)
    console.log(optionsMenu)
    appendHtmlOptions(optionsMenu)
    //console.log(optionsMenuHtml)
}
function appendHtmlOptions(optionsMenu){
    $("#options-menu").find("a").remove()
    optionsMenu.forEach(element => {
        console.log(element)
        //optionsMenu=dataConfig.filter(d=>d.collection=="EU Vocabularies")
        //htmlObject = document.createElement(data)
        //htmlObject.innerHTML = data;
        html=optionsMenuHtml.replace("textTitle",element.option).replace("textComment",element.option_text)
        //data.replace("textComment",element.option_text)
        $("#options-menu").append($(html))
/*                     $.get("optionMainMenu.html", function (data) {
            //$("#appendToThis").append(data);
            console.log(data)
            console.log(typeof(data))
        }); */
/*                         $("#options-menu").load("optionMainMenu.html", function(responseTxt, statusTxt, jqXHR){
            if(statusTxt == "error"){
                alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
            }
        }) */
    });
}