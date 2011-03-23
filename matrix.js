var Matrix = (function(){
    var dim = 4;
    function Matrix(data) {
        this.data = data;
    }                    
    Matrix.zero = function() {
        var data = [];
        for(var i=0; i<dim; i++) {
            data.push([]);
            for(var j=0; j<dim; j++) {
                data[i].push(0);
            }
        }
        return new Matrix(data);
    }
    Matrix.identity = function() {
        var id = Matrix.zero();
        for(var i=0; i<dim; i++) {
            id.data[i][i] = 1;
        }
        return id;
    }
    Matrix.rotation = function(x1, x2, theta) {
        var R = Matrix.identity();
        R.data[x1][x1] =  Math.cos(theta);
        R.data[x1][x2] = -Math.sin(theta);
        R.data[x2][x1] =  Math.sin(theta);
        R.data[x2][x2] =  Math.cos(theta);
        return R;
    }
    Matrix.multiply = function(m1, m2) {
        var result = Matrix.zero();
        for(var i=0; i<dim; i++) {
            for(var j=0; j<dim; j++) {
                for(var k=0; k<dim; k++) {
                    result.data[i][j] += m1.data[i][k]*m2.data[k][j];
                }
            }
        }
        return result;
    }                 
    Matrix.apply = function(m, v) {
        var result = [0,0,0,0];
        for(var i=0; i<dim; i++) {
            for(var k=0; k<dim; k++) {
                result[i] += m.data[i][k]*v[k];
            }
        }
        return result;
    }
    return Matrix;
})();