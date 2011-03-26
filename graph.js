var Graph = (function(){
    function Graph(f, c){
        this.points = [];
        this.backbone = [];
        this.config = c;
        
        
        for(var x=c.range.x.start; x<=c.range.x.end; x+=c.step) {
            var _points = [];
            for(var y=c.range.y.start; y<=c.range.y.end; y+=c.step) {
                var z = new Complex(x, y);
                var w = f(z);
                _points.push([z.x, z.y, w.x, w.y]);
            }
            this.points.push(_points);
        }
        for(var x=c.range.x.start; x<=c.range.x.end; x+=c.step) {
            var z = new Complex(x, 0);
            var w = f(z);
            this.backbone.push([z.x, z.y, w.x, w.y]);
        }
        //this.R = Matrix.rotation(0, 3, Math.PI/7);
        this.setAngles([0,0,0,0,0,0]);
    }
    Graph.rotations = [];
    for(var i=0; i<3; i++) {
        for(var j=i+1; j<4; j++) {
            Graph.rotations.push((function(i,j){
                return (function(theta) {
                    return Matrix.rotation(i, j, theta);
                });
            })(i,j));
        }
    }
    if(Graph.rotations.length != 6) {
        alert("Error: Graph.rotations.length != 6");
    }
        
    Graph.prototype = {
        setAngles: function(angles){
            this.R = Matrix.identity();
            this.log(Graph.rotations);
            for(var i in Graph.rotations) {
                var rot = Graph.rotations[i](angles[i]);
                this.log(rot.data);
                this.R = Matrix.multiply(this.R, rot);
            }
        },
        draw: function(){
            var c = this.config;          
            var width = c.ctx.canvas.width;
            var height = c.ctx.canvas.height; 
            c.ctx.clearRect(0,0,width,height);
            //this.clearLog();
            
            var canvas_points = [];
            var canvas_backbone = [];
            
            for(var i=0; i<this.points.length; i++) {
                var _canvas_points = [];
                for(var j=0; j<this.points[0].length; j++) {
                    _canvas_points.push(
                        this.convert_to_canvas(this.points[i][j])
                    );
                }
                canvas_points.push(_canvas_points);
            }
            
            for(var i=0; i<this.backbone.length; i++) {
                canvas_backbone.push(
                    this.convert_to_canvas(this.backbone[i])
                );
            }                                     

            var squares = [];
            for(var i=0; i<this.points.length-1; i++) {
                for(var j=0; j<this.points[0].length-1; j++) {
                    squares.push([
                        canvas_points[i][j],
                        canvas_points[i+1][j],
                        canvas_points[i+1][j+1],
                        canvas_points[i][j+1] 
                    ]);
                }
            }                  
            /* sort by the depth of the first point in the square */
            var cmp = function(f){
                return (function(a,b) {
                    if (f(a) > f(b)) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            }
            squares.sort(cmp(function(square){
                //return (square[0].z + square[1].z + square[2].z + square[3].z);
                return -square[0].z;
            }));
            
            {
                this.config.ctx.strokeStyle = "rgba(0,0,255,1)";
                this.config.ctx.lineWidth = 1;
                this.canvas('beginPath');
                this.canvas('moveTo', canvas_backbone[0]);
                for(var i in canvas_backbone) {
                    this.canvas('lineTo', canvas_backbone[i]);
                }
                this.canvas('stroke');
            }
            
            for(var k in squares) {
                h = (function(z){return Math.floor(z < 0 ? 0 : (z > 255 ? 255 : z));})(squares[k][0].z);
                this.config.ctx.fillStyle = "rgba("+h+","+h+","+h+",.5)";
                drk = Math.floor(h/2);
                this.config.ctx.strokeStyle = "rgba("+drk+","+drk+","+drk+",.3)";
                this.canvas('beginPath');
                this.canvas('moveTo', squares[k][0]);
                this.canvas('lineTo', squares[k][1]);
                this.canvas('lineTo', squares[k][2]);
                this.canvas('lineTo', squares[k][3]);
                this.canvas('moveTo', squares[k][0]);
                this.canvas('closePath');
                this.canvas('stroke');
                this.canvas('fill');       
            }
            
            
        },
        convert_to_canvas: function(point) {
            var c = this.config;
            var width = c.ctx.canvas.width;
            var height = c.ctx.canvas.height;
            var point = Matrix.apply(this.R, point);
            var _x = point[0];
            var _y = point[2];
            var _z = point[1]; // for depth
            return {
                x: width /2 + (c.center.x + _x)/c.scale*width,     
                y: height/2 - (c.center.y + _y)/c.scale*height,
                z: 127 + (_z)/c.scale*256   // 256 is the width of a color channel
            };
        },
        log: function(msg) {
            $("#log").append("<li>" + msg + "</li>");
        },
        clearLog: function() {
            $("#log").html("");
        },
        canvas: function(funcname, point) {
            if(typeof point != 'undefined' && point !== null) {
                return this.config.ctx[funcname](point.x, point.y);
            }
            else {
                return this.config.ctx[funcname]();
            }
        }
    }
    
    return Graph;
})();