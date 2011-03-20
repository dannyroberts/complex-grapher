Complex = (function() {
    function Complex(x, y) {
       this.x = x;
       this.y = y; 
    }
    
    Complex.prototype = {
        toString: function() {
            return this.x + " + " + this.y + "i";
        }
    }
    Complex.add = function(c1, c2) {
        return new Complex(
            c1.x + c2.x,
            c1.y + c2.y
        );
    };
    Complex.multiply = function(c1, c2) {
        return new Complex(
            c1.x * c2.x - c1.y * c2.y,
            c1.x * c2.y + c1.y * c2.x
        );
    };
    Complex.pow = function(c1, c2) {
        if(Math.floor(c2.x) == c2.x && c2.y == 0) {
            var result = new Complex(1, 0);
            for(var i=0; i<c2.x; i++) {
                result = Complex.multiply(result, c1);
            }
            return result;
        }
        throw NotImplemented;
    }
    Complex.exp = function(c) {
        var ex = Math.exp(c.x);
        return new Complex(
            ex * Math.cos(c.y),
            ex * Math.sin(c.y)
        );
    }
    Complex.isNaN = function(c) {
        return isNaN(c.x) || isNaN(c.y);
    }
    Complex.i = new Complex(0, 1);
    return Complex;
})();