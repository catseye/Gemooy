function GemooyController(canvas) {
    var self = {};
    var interval_id;

    var p = Playfield();
    var ip_x;
    var ip_y;
    var ip_dx;
    var ip_dy;
    var dp_x;
    var dp_y;

    self.draw = function() {
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textBaseline = "top";

        var height = 20;
        ctx.font = height + "px monospace";
        var width = ctx.measureText("@").width;

        ctx.fillStyle = "#ff5080";
        ctx.fillRect(ip_x * width, ip_y * height, width, height);

        ctx.fillStyle = "#50ff80";
        ctx.fillRect(dp_x * width, dp_y * height, width, height);

        ctx.fillStyle = "black";
        p.foreach(function (x, y, value) {
            ctx.fillText(value, x * width, y * height);
        });
    }

    var rotate_clockwise = function() {
        if (ip_dx === 0 && ip_dy === -1) {
            ip_dx = 1; ip_dy = -1;
        } else if (ip_dx === 1 && ip_dy === -1) {
            ip_dx = 1; ip_dy = 0;
        } else if (ip_dx === 1 && ip_dy === 0) {
            ip_dx = 1; ip_dy = 1;
        } else if (ip_dx === 1 && ip_dy === 1) {
            ip_dx = 0; ip_dy = 1;
        } else if (ip_dx === 0 && ip_dy === 1) {
            ip_dx = -1; ip_dy = 1;
        } else if (ip_dx === -1 && ip_dy === 1) {
            ip_dx = -1; ip_dy = 0;
        } else if (ip_dx === -1 && ip_dy === 0) {
            ip_dx = -1; ip_dy = -1;
        } else if (ip_dx === -1 && ip_dy === -1) {
            ip_dx = 0; ip_dy = -1;
        }
    }

    var rotate_counterclockwise = function() {
        if (ip_dx === 0 && ip_dy === -1) {
            ip_dx = -1; ip_dy = -1;
        } else if (ip_dx === -1 && ip_dy === -1) {
            ip_dx = -1; ip_dy = 0;
        } else if (ip_dx === -1 && ip_dy === 0) {
            ip_dx = -1; ip_dy = 1;
        } else if (ip_dx === -1 && ip_dy === 1) {
            ip_dx = 0; ip_dy = 1;
        } else if (ip_dx === 0 && ip_dy === 1) {
            ip_dx = 1; ip_dy = 1;
        } else if (ip_dx === 1 && ip_dy === 1) {
            ip_dx = 1; ip_dy = 0;
        } else if (ip_dx === 1 && ip_dy === 0) {
            ip_dx = 1; ip_dy = -1;
        } else if (ip_dx === 1 && ip_dy === -1) {
            ip_dx = 0; ip_dy = -1;
        }
    }

    var is_headed = function(dx, dy) {
        return ip_dx === dx && ip_dy === dy;
    }

    var advance = function() {
        ip_x += ip_dx;
        ip_y += ip_dy;
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
        var instr = p.get(ip_x, ip_y);

        if (instr === '@') {
            var data = p.get(dp_x, dp_y);
            if (data === undefined) {
                rotate_clockwise();
            } else if (data == '#') {
                rotate_counterclockwise();
            }
        } else if (instr === '#') {
            if (is_headed(0, -1)) {
                dp_y--;
                advance();
            } else if (is_headed(0, 1)) {
                dp_y++;
                advance();
            } else if (is_headed(1, 0)) {
                dp_x++;
                advance();
            } else if (is_headed(-1, 0)) {
                dp_x--;
                advance();
            } else if (is_headed(-1, -1) || is_headed(1, -1)) {
                increment(dp_x, dp_y);
            } else if (is_headed(-1, 1) || is_headed(1, 1)) {
                decrement(dp_x, dp_y);
            }
        }

        advance();
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
                ip_x = x;
                ip_y = y;
                return ' ';
            } else if (value === '%') {
                dp_x = x;
                dp_y = y;
                return ' ';
            }
        });
        ip_dx = 1;
        ip_dy = 1;
        self.draw();
    }

    return self;
}
