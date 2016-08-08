$(function () {
    var colors = ['black', 'red', 'green', 'blue', 'yellow', 'magenta', 'white'];
    var canvas = $('#canvas');
    var colorElement = $('#color');
    for (var i = 0; i < colors.length; i++) {
        colorElement.append('<option value="' + (i + 1) + '">' + colors[i] + '</option>');
    }

    var buttonPressed = false;

    canvas
        .mousedown(function () {
            buttonPressed = true;
        })
        .mouseup(function () {
            buttonPressed = false;
        })
        .mousemove(function (e) {
            if (buttonPressed) {
                setPoint(e.offsetX, e.offsetY, colorElement.val());
            }
        });

    var ctx = canvas[0].getContext('2d');

    function setPoint(x, y, color) {
        ctx.fillStyle = colors[color - 1];
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function clearPoints() {
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
    }

    $('#clear').click(clearPoints);


});