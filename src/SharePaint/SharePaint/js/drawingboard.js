$(function () {
    var hub;
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

    function updateAll(points) {
        if (!points) {
            return;
        }

        for (var x = 0; x < points.length; x++) {
            var row = points[x];
            for (y = 0; y < row.length; y++) {
                var color = row[y];
                if (color) {
                    setPoint(x, y, color);
                }
            }
        }
    }

    $('#clear').click(clearPoints);
    $('#getUpdate').click(function () {
        if (hub) {
            hub.server.getUpdate()
                .then(updateAll);
        }
    });


    $('#useIwcSignalR').click(function () {
        $('#useSignalR').hide();

        hub = SJ.iwc.SignalR.getHubProxy('drawingBoard', {
            client: {
                clear: clearPoints,
                drawPoint: setPoint,
                update: updateAll
            }
        });


        SJ.iwc.SignalR.getState().color = colorElement.val();
        var connected = false;

        colorElement.change(function () {
            SJ.iwc.SignalR.getState().color = $(this).val();
        });


        canvas.mousemove(function (e) {
            if (buttonPressed && connected) {
                hub.server.broadcastPoint(
                    Math.round(e.offsetX),
                    Math.round(e.offsetY)
                );
            }
        });

        $('#clear').click(function () {
            if (connected) {
                hub.server.broadcastClear();
            }
        });


        SJ.iwc.SignalR.start()
            .done(function () {
                connected = true;
            });
    });

    $('#useSignalR').click(function () {
        $('#useIwcSignalR').hide();

        hub = $.connection.drawingBoard;
        hub.state.color = colorElement.val();
        var connected = false;

        colorElement.change(function () {
            hub.state.color = $(this).val();
        });


        canvas.mousemove(function (e) {
            if (buttonPressed && connected) {
                hub.server.broadcastPoint(
                    Math.round(e.offsetX),
                    Math.round(e.offsetY)
                );
            }
        });

        $('#clear').click(function () {
            if (connected) {
                hub.server.broadcastClear();
            }
        });

        hub.client.clear = clearPoints;

        hub.client.drawPoint = setPoint;

        hub.client.update = updateAll;

        $.connection.hub.start()
            .done(function () {
                connected = true;
            });
    });

    $('#restartIwcSignalR').click(function () {
        SJ.iwc.SignalR.restart(function () {
            console.log('restart...');
        });
    });
});