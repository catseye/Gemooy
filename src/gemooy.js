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

    var p;
    var ip;
    var dp;

    this.init = function(view) {
        p = new GemooyPlayfield();

        ip = new yoob.Cursor(0, 0, 1, 1);
        ip.drawContext = function(ctx, x, y, cellWidth, cellHeight) {
            ctx.fillStyle = "#ff5080";
            ctx.fillRect(x, y, cellWidth, cellHeight);
        };

        dp = new yoob.Cursor(0, 0, 0, 0);
        dp.drawContext = function(ctx, x, y, cellWidth, cellHeight) {
            ctx.fillStyle = "#50ff80";
            ctx.fillRect(x, y, cellWidth, cellHeight);
        };
        view.pf = p;
        this.view = view.setCursors([ip, dp]);
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
        this.view.draw();
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
        this.view.draw();
    };
};
GemooyController.prototype = new yoob.Controller();
