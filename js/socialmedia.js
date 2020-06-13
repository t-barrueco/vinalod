

////// SOCIAL MEDIA BUTTONS ///////////////////////////////////

$('#facebook').click(function () {
  console.log(window.location.href);
  $(this).attr('href', "https://www.facebook.com/sharer.php?u=" + window.location.href);

});

$('#twitter').click(function () {

  $(this).attr('href', "https://twitter.com/intent/tweet?url=" + window.location.href);
  // + 
  // "&text=EU Research and Innovation" +
  // + "&hashtags=H2020,European Commission Contribution ");
});


$('#linkedin').click(function () {

  $(this).attr('href', "https://www.linkedin.com/shareArticle?mini=true&url=" + window.location.href);
  // +
  //   "&title=EU Research and Innovation" +
  //   "&summary=EU Research and Innovation" +
  //   "&source=Publication Office of the European Union");

});