/*
*    CORDIS DATA EXPLORATION
*    dropdown_ini.js.js
*    
*    created by EuriTrends
*/

function dataset1Dropdown_ini(dataset){
    
    var $dataset1 = $("#dataset1");

    dataset.sort(function(a, b) {    
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
    
    // $("#dataset1 option").each(function() {
    //     $(this).remove();
    //     });

    $.each(dataset, function() {
            $dataset1.append($("<option class=\"small\" data-toggle=\"tooltip\" data-placement=\"auto\" title=\"" + this.name +"\" />")
                .val(this.code)
                .text(this.title));
            });

            
    $("#dataset1 option[value=proj]").prop("selected", true);
            
};


function dataset2Dropdown_ini(dataset){
    
  var $dataset2 = $("#dataset2");

  dataset.sort(function(a, b) {    
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
  
  // $("#dataset2 option").each(function() {
  //     $(this).remove();
  //     });

  $.each(dataset, function() {
          $dataset2.append($("<option class=\"small\" data-toggle=\"tooltip\" data-placement=\"auto\" title=\"" + this.name +"\" />")
              .val(this.code)
              .text(this.title));
          });
  
  $("#dataset2 option[value=org]").prop("selected", true);
}
