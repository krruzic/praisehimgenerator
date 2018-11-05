var gif_frames = [];
var gif = new GIF({
  workers: 2,
  quality: 1,
  width: 464,
  height: 316
});
var cnvs = document.getElementById('cnvs');

$(document).ready(function() {
  var button = document.getElementById('savebutton');
  button.addEventListener('click', function (e) {
    $(".loading").css("display", "block");
    var numframes = 10;
    for (var i = 1; i <= numframes; i++) {
      var fg = $(".god")[0];
      var bg = $("#frame"+i)[0];
      var ctx = mergeImage(bg, fg);
      gif.addFrame(ctx, {copy: true, delay: 10});
    }
    gif.on('finished', function(blob) {
      var a = document.createElement("a");
      document.body.appendChild(a);
      url = window.URL.createObjectURL(blob);
      $(".loading").text("GIF Finished!!");
      $(".center-fit")[0].src = url;
      a.href = url;
      a.download = "worship.gif";
      a.click();
      gif.freeWorkers.forEach(w => w.terminate());
    });

    gif.on('progress', function(p) {
      $(".loading").text("rending image at quality: "+gif.options.quality + "... " + (Math.round(p * 100)) + "%");
    });

    gif.render();
    gif.freeWorkers.forEach(w => w.terminate());
  });

  $("#url-entry").bind('input', function(){
    $(".god").attr("src", $(this).val());
  });

  $("input:file").change(function (){
    showImage($(this)[0], $(".god")[0]);
  });
});

function showImage(src,target) {
  var fr=new FileReader();
  // when image is loaded, set the src of the image where you want to display it
  fr.onload = function(e) { target.src = this.result; };
  fr.readAsDataURL(src.files[0]);
}


// credit: https://stackoverflow.com/a/5717133
function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}

function mergeImage(img1, img2) {
  ctx = document.getElementById('cnvs').getContext('2d'); 
  ctx.clearRect(0, 0, 464, 316);
  ctx.drawImage(img1, 0, 0);
  ctx.drawImage(img2, 287, 12, 108, 126);
  return ctx;
}
