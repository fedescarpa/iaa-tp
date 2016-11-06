var canvas;
var ctx;

var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var paths = [];
var paintFlag = false;
var color = "black";
var lineWidth = 20;
    
var clearBeforeDraw = false;

function init() {
    canvas = document.getElementById('myCanvas');

    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

// draws a line from (x1, y1) to (x2, y2) with nice rounded caps
function draw(ctx, color, lineWidth, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $('.character').html(' ' + '????');
}

function findxy(res, e) {
    if (res == 'down') {
        if (clearBeforeDraw == true) {
          ctx.clearRect(0,0,canvas.width,canvas.height);
          paths = [];
          clearBeforeDraw = false;
        }
        
        prevX = currX;
        prevY = currY;
        currX = e.clientX - (e.clientX - e.layerX);
        currY = e.clientY - (e.clientY - e.layerY);
        
        console.log('Event:', e);
        console.log('CurrX:', currX);
        console.log('CurrY:', currY);

        //draw a circle
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.closePath();
        ctx.fill();

        paths.push([[currX], [currY]]);
        paintFlag = true;
    }
    if (res == 'up' || res == "out") {
        paintFlag = false;
    }
    
    if (res == 'move') {
        if (paintFlag) {
            // draw a line to previous point
            prevX = currX;
            prevY = currY;
            currX = e.clientX - (e.clientX - e.layerX);
            currY = e.clientY - (e.clientY - e.layerY);
            currPath = paths[paths.length-1];
            currPath[0].push(currX);
            currPath[1].push(currY);
            paths[paths.length-1] = currPath;
            draw(ctx, color, lineWidth, prevX, prevY, currX, currY);
        }
    }
}

function reconocer() {
  $('.character').html(' ' + '????');
  const dataCanvas = document.getElementById('myCanvas');

  const data = dataCanvas.toDataURL('image/png');

  $.post({
    url: '/recognize',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ base64: data }), 
    success: function(data) {
      $('.character').html(' ' + (data.result || '????'));
    }
  });

}

$(document).ready(function () {
  init();
  $('.btn-primary').on('click', erase);
  $('.btn-default').on('click', reconocer);
  $('.character').html(' ' + '????');
});