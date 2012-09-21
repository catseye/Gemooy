function GemooyController(canvas) {
    var self = {};
    var interval_id;

    var p = Playfield();
    var ip = Cursor(0, 0, 1, 1);
    var dp = Cursor(0, 0, 0, 0);

    self.draw = function() {
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textBaseline = "top";

        var height = 20;
        ctx.font = height + "px monospace";
        var width = ctx.measureText("@").width;

        ctx.fillStyle = "#ff5080";
        ctx.fillRect(ip.x * width, ip.y * height, width, height);

        ctx.fillStyle = "#50ff80";
        ctx.fillRect(dp.x * width, dp.y * height, width, height);

        ctx.fillStyle = "black";
        p.foreach(function (x, y, value) {
            ctx.fillText(value, x * width, y * height);
        });
    }

    var increment = function(x, y) {
        var data = p.get(x, y);
        if (data === undefined) {
            data = '#';
        } else if (data === '#') {
            data = '@';
        } else if (data === '@') {
            data = undefined;
        }
        p.put(x, y, data);
    }

    var decrement = function(x, y) {
        var data = p.get(x, y);
        if (data === undefined) {
            data = '@';
        } else if (data === '@') {
            data = '#';
        } else if (data === '#') {
            data = undefined;
        }
        p.put(x, y, data);
    }

    self.step = function() {
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
                increment(dp.x, dp.y);
            } else if (ip.is_headed(-1, 1) || ip.is_headed(1, 1)) {
                decrement(dp.x, dp.y);
            }
        }

        ip.advance();
        self.draw();
    }

    self.start = function() {
        if (interval_id !== undefined)
            return;
        self.step();
        interval_id = setInterval(self.step, 100);
    }

    self.stop = function() {
        if (interval_id === undefined)
            return;
        clearInterval(interval_id);
        interval_id = undefined;
    }

    self.load = function(textarea) {
        self.stop();
        p.clear();
        p.load(0, 0, textarea.val());
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
        self.draw();
    }

    return self;
}
