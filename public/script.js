  var act = true;
  function animate_load(addon,active){
    if(active == true){
      if(addon != "<div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div><div class='load-bar'>Loading</div>"){
        addon += "<div class='load-bar'>Loading</div>";
      } else {
        addon = ""
      }
      $("#result-list").html(addon);
      setTimeout(function(){
        animate_load(addon,act);
      }, 50)
    }
  }

  var arrayIdx = function(argArray, look){
    for(var b = 0; b < argArray.length; b += 1){
      if(argArray[b].Name == look){
        return argArray[b].Value;
      }
    }
  }

  $('body').on('mouseenter', '.item-show', function(event) {
    $(this).find('.desc-box').fadeIn(200, function() {
    });
  });

  $('body').on('mouseleave', '.desc-box', function(event) {
    $(this).fadeOut(200, function() {
    });
  });


  $("body").on('submit', '#search-bar', function(event) {
    debugger
    event.preventDefault();
    act = true;
    animate_load("",act);

    $.ajax({
      url: '/home/search',
      data: $(this).serialize(),
    })
    .done(function(data) {
      argArray = data.data.ItemSearchResponse.OperationRequest.Arguments.Argument;

      var nameSpace = {key: arrayIdx(argArray, "Keywords")}
      act = false
      var results = data.data.ItemSearchResponse.Items.Item
      $("#result-list").html("");
      $.each(results, function(index, val) {
        var theTemplateScript = $("#item-template").html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        var context = val;
        var theCompiledHtml = theTemplate(context);
        $("#result-list").append(theCompiledHtml)
      });
      $("#result-list").append('<br><nav><ul class="pagination" keywords="'+nameSpace.key+'"><li>1</li><li><a href="#" class="pag-link">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">5</a></li><li><a href="'+data.data.ItemSearchResponse.Items.MoreSearchResultsUrl+'" target="_blank">more..</a></li></ul></nav>')
    })

  });

  $("body").on('click', '.pag-link', function(event) {
    event.preventDefault();
    act = true;
    animate_load("",act);

    var numSpace = {page:$(this).text()};
    var keys = $(this).parent().parent().attr('keywords');
    $.ajax({
      url: '/home/search',
      data: {page: numSpace.page, keywords: keys},
    })
    .done(function(data) {
      argArray = data.data.ItemSearchResponse.OperationRequest.Arguments.Argument;

      var nameSpace = {key: arrayIdx(argArray, "Keywords")}
      act = false
      var results = data.data.ItemSearchResponse.Items.Item
      $("#result-list").html("");
      $.each(results, function(index, val) {
        var theTemplateScript = $("#item-template").html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        var context = val;
        var theCompiledHtml = theTemplate(context);
        $("#result-list").append(theCompiledHtml)
      });
      var footer_html = ""
      footer_html += '<br><nav><ul class="pagination" keywords="'+nameSpace.key+'">'

      for(var g = 1; g < 6; g+=1){
        if(numSpace.page == g){
          footer_html += '<li>'+g+'</li>'
        } else {
          footer_html += '<li><a href="#" class="pag-link">'+g+'</a></li>'
        }
      }

      footer_html += '<li><a href="'+data.data.ItemSearchResponse.Items.MoreSearchResultsUrl+'" target="_blank">more..</a></li></ul></nav>'

      $("#result-list").append(footer_html);
    })
});


  $("body").on('click', '.show-links', function(event) {
    event.preventDefault();
    $(this).parent().parent().find('.desc-box').css('opacity','.5');
    $(this).parent().parent().find('.links-container').slideDown('500', function() {
    });
  });

  $("body").on('click', '.hide-these-links', function(event) {
    event.preventDefault();
    $(this).parent().parent().slideUp(500);
    $(this).parent().parent().parent().find('.desc-box').css('opacity',1);
  });
