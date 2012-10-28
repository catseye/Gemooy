function GemooyPlayfield() {
    this.increment = function(x, y) {
        var data = this.get(x, y);
        if (data === undefined) {
            data = '#';
        } else if (data === '#') {
            data = '@';
        } else if (data === '@') {
            data = undefined;
        }
        this.put(x, y, data);
    }

    this.decrement = function(x, y) {
        var data = this.get(x, y);
        if (data === undefined) {
            data = '@';
        } else if (data === '@') {
            data = '#';
        } else if (data === '#') {
            data = undefined;
        }
        this.put(x, y, data);
    }
}
GemooyPlayfield.prototype = new yoob.Playfield();


function GemooyController(canvas) {
    var interval_id;

    var p = new GemooyPlayfield();
    var ip = new yoob.Cursor(0, 0, 1, 1);
    var dp = new yoob.Cursor(0, 0, 0, 0);

    this.draw = function() {
        var ctx = canvas.getContext('2d');

        var height = 20;
        ctx.font = height + "px monospace";
        var width = ctx.measureText("@").width;

        canvas.width = (p.max_x - p.min_x + 1) * width;
        canvas.height = (p.max_y - p.min_y + 1) * height;

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
    }

    this.step = function() {
        var instr = p.get(ip.x, ip.y);

        if (instr === '@') {
            var data = p.get(dp.x, dp.y);
            if (data === undefined) {
                ip.rotate_clockwise();
            } else if (data == '#') {
                ip.rotate_counterclockwise();
            }
        } else if (instr === '#') {
            if (ip.is_headed(0, -1)) {
                dp.y--;
                ip.advance();
            } else if (ip.is_headed(0, 1)) {
                dp.y++;
                ip.advance();
            } else if (ip.is_headed(1, 0)) {
                dp.x++;
                ip.advance();
            } else if (ip.is_headed(-1, 0)) {
                dp.x--;
                ip.advance();
            } else if (ip.is_headed(-1, -1) || ip.is_headed(1, -1)) {
                p.increment(dp.x, dp.y);
            } else if (ip.is_headed(-1, 1) || ip.is_headed(1, 1)) {
                p.decrement(dp.x, dp.y);
            }
        }

        ip.advance();
        this.draw();
    }

    this.start = function() {
        if (interval_id !== undefined)
            return;
        this.step();
        var controller = this;
        interval_id = setInterval(function() { controller.step(); }, 100);
    }

    this.stop = function() {
        if (interval_id === undefined)
            return;
        clearInterval(interval_id);
        interval_id = undefined;
    }

    this.load = function(textarea) {
        this.stop();
        p.clear();
        p.load(0, 0, textarea.value);
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
    }
}
