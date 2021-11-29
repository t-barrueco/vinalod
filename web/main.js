$(document).ready(function(){
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
    $("#tabs-sections").load("tabMainMenu.html", function(responseTxt, statusTxt, jqXHR){
/*         if(statusTxt == "success"){
            alert("New content loaded successfully!");
        } */
        if(statusTxt == "error"){
            alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
        }
    });
    $("#options-menu").load("optionMainMenu.html", function(responseTxt, statusTxt, jqXHR){
        /*         if(statusTxt == "success"){
                    alert("New content loaded successfully!");
                } */
                if(statusTxt == "error"){
                    alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
                }
            })
    $("#iconMenu1").load("../images/person_icon.svg", function(responseTxt, statusTxt, jqXHR){
                /*         if(statusTxt == "success"){
                            alert("New content loaded successfully!");
                        } */
                        if(statusTxt == "error"){
                            alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
                        }
                    })
});