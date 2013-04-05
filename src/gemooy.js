/*
 * requires yoob.Controller
 * requires yoob.Playfield
 * requires yoob.Cursor
 */
function GemooyPlayfield() {
    this.setDefault(' ');

    this.increment = function(x, y) {
        var data = this.get(x, y);
        if (data === ' ') {
            data = '#';
        } else if (data === '#') {
            data = '@';
        } else if (data === '@') {
            data = ' ';
        }
        this.put(x, y, data);
    };

    this.decrement = function(x, y) {
        var data = this.get(x, y);
        if (data === ' ') {
            data = '@';
        } else if (data === '@') {
            data = '#';
        } else if (data === '#') {
            data = ' ';
        }
        this.put(x, y, data);
    };
};
GemooyPlayfield.prototype = new yoob.Playfield();


function GemooyController() {
    var intervalId;
    var canvas;
    var ctx;

    var p;
    var ip;
    var dp;

    this.init = function(c) {
        p = new GemooyPlayfield();
        ip = new yoob.Cursor(0, 0, 1, 1);
        dp = new yoob.Cursor(0, 0, 0, 0);
        canvas = c;
        ctx = canvas.getContext('2d');
    };

    this.draw = function() {
        var height = 20;
        ctx.font = height + "px monospace";
        var width = ctx.measureText("@").width;

        canvas.width = p.getExtentX() * width;
        canvas.height = p.getExtentY() *  height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textBaseline = "top";
        ctx.font = height + "px monospace";

        ctx.fillStyle = "#ff5080";
        ctx.fillRect(ip.x * width, ip.y * height, width, height);

        ctx.fillStyle = "#50ff80";
        ctx.fillRect(dp.x * width, dp.y * height, width, height);

        ctx.fillStyle = "black";
        p.foreach(function (x, y, value) {
            ctx.fillText(value, x * width, y * height);
        });
    };

    this.step = function() {
        var instr = p.get(ip.x, ip.y);

        if (instr === '@') {
            var data = p.get(dp.x, dp.y);
            if (data === ' ') {
                ip.rotateClockwise();
            } else if (data == '#') {
                ip.rotateCounterclockwise();
            }
        } else if (instr === '#') {
            if (ip.isHeaded(0, -1)) {
                dp.y--;
                ip.advance();
            } else if (ip.isHeaded(0, 1)) {
                dp.y++;
                ip.advance();
            } else if (ip.isHeaded(1, 0)) {
                dp.x++;
                ip.advance();
            } else if (ip.isHeaded(-1, 0)) {
                dp.x--;
                ip.advance();
            } else if (ip.isHeaded(-1, -1) || ip.isHeaded(1, -1)) {
                p.increment(dp.x, dp.y);
            } else if (ip.isHeaded(-1, 1) || ip.isHeaded(1, 1)) {
                p.decrement(dp.x, dp.y);
            }
        }

        ip.advance();
        this.draw();
    };

    this.load = function(text) {
        p.clear();
        p.load(0, 0, text);
        p.foreach(function (x, y, value) {
            if (value === '$') {
                ip.x = x;
                ip.y = y;
                return ' ';
            } else if (value === '%') {
                dp.x = x;
                dp.y = y;
                return ' ';
            }
        });
        ip.dx = 1;
        ip.dy = 1;
        this.draw();
    };
};
GemooyController.prototype = new yoob.Controller();
