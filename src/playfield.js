function Cursor(x, y, dx, dy) {
    var self = {};
    self.x = x;
    self.y = y;
    self.dx = dx;
    self.dy = dy;

    self.is_headed = function(dx, dy) {
        return self.dx === dx && self.dy === dy;
    }

    self.advance = function() {
        self.x += self.dx;
        self.y += self.dy;
    }

    self.rotate_clockwise = function() {
        if (self.dx === 0 && self.dy === -1) {
            self.dx = 1; self.dy = -1;
        } else if (self.dx === 1 && self.dy === -1) {
            self.dx = 1; self.dy = 0;
        } else if (self.dx === 1 && self.dy === 0) {
            self.dx = 1; self.dy = 1;
        } else if (self.dx === 1 && self.dy === 1) {
            self.dx = 0; self.dy = 1;
        } else if (self.dx === 0 && self.dy === 1) {
            self.dx = -1; self.dy = 1;
        } else if (self.dx === -1 && self.dy === 1) {
            self.dx = -1; self.dy = 0;
        } else if (self.dx === -1 && self.dy === 0) {
            self.dx = -1; self.dy = -1;
        } else if (self.dx === -1 && self.dy === -1) {
            self.dx = 0; self.dy = -1;
        }
    }

    self.rotate_counterclockwise = function() {
        if (self.dx === 0 && self.dy === -1) {
            self.dx = -1; self.dy = -1;
        } else if (self.dx === -1 && self.dy === -1) {
            self.dx = -1; self.dy = 0;
        } else if (self.dx === -1 && self.dy === 0) {
            self.dx = -1; self.dy = 1;
        } else if (self.dx === -1 && self.dy === 1) {
            self.dx = 0; self.dy = 1;
        } else if (self.dx === 0 && self.dy === 1) {
            self.dx = 1; self.dy = 1;
        } else if (self.dx === 1 && self.dy === 1) {
            self.dx = 1; self.dy = 0;
        } else if (self.dx === 1 && self.dy === 0) {
            self.dx = 1; self.dy = -1;
        } else if (self.dx === 1 && self.dy === -1) {
            self.dx = 0; self.dy = -1;
        }
    }

    return self;
}

function Playfield() {
    var self = {};
    var store = {};
    self.min_x = undefined;
    self.min_y = undefined;
    self.max_x = undefined;
    self.max_y = undefined;

    /*
     * Cells are undefined if they were never written to.
     */
    self.get = function(x, y) {
        return store[x+','+y];
    }

    self.put = function(x, y, value) {
        if (self.min_x === undefined || x < self.min_x) self.min_x = x;
        if (self.max_x === undefined || x > self.max_x) self.max_x = x;
        if (self.min_y === undefined || y < self.min_y) self.min_y = y;
        if (self.max_y === undefined || y > self.max_y) self.max_y = y;
        store[x+','+y] = value;
    }

    self.clear = function() {
        store = {};
        self.min_x = undefined;
        self.min_y = undefined;
        self.max_x = undefined;
        self.max_y = undefined;
    };
          
    /*
     * Load a string into the playfield.
     * The string may be multiline, with newline (ASCII 10)
     * characters delimiting lines.  ASCII 13 is ignored.
     */
    self.load = function(x, y, string) {
        var lx = x;
        var ly = y;
        for (var i = 0; i < string.length; i++) {
            var c = string.charAt(i);
            if (c === '\n') {
                lx = x;
                ly++;
            } else if (c === ' ') {
                self.put(lx, ly, undefined);
                lx++;
            } else if (c === '\r') {
            } else {
                self.put(lx, ly, c);
                lx++;
            }
        }
    }

    /*
     * fun is a callback which takes three parameters:
     * x, y, and value.
     * This function ensures a particular order.
     */
    self.foreach = function(fun) {
        for (var y = self.min_y; y <= self.max_y; y++) {
            for (var x = self.min_x; x <= self.max_x; x++) {
                var key = x+','+y;
                var value = store[key];
                if (value === undefined)
                    continue;
                var result = fun(x, y, value);
                if (result !== undefined) {
                    if (result === ' ') {
                        result = undefined;
                    }
                    self.put(x, y, result);
                }
            }
        }
    }

    return self;
}
