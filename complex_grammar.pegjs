start
//  = SPACE a:additive SPACE { return "(function(z) {return " + a + ";})"; }
  = SPACE a:additive SPACE { return eval("(function(z) {return " + a + ";})"); }

additive
  = left:multiplicative SPACE "+" SPACE right:additive { return "Complex.add(" + left + ", " + right + ")"; }
  / multiplicative

multiplicative
  = left:exponential SPACE "*"? SPACE right:multiplicative { return "Complex.multiply(" + left + ", " + right + ")"; }
  / exponential

exponential
  = left:function_call SPACE "**" SPACE right:function_call { return "Complex.pow(" + left + ", " + right + ")"; }
  / function_call

function_call
  = f:function SPACE z:primary { return f + "(" + z + ")"; }
  / primary   

primary
  = integer
  / variable
  / "(" SPACE a:additive SPACE ")" { return "(" + a + ")"; }

integer "integer"
  = digits:[0-9]+ { return "(new Complex(" + digits.join("") + ", 0))"; }
  
variable
  = z:"z" { return "z"; }
  / i:"i" { return "Complex.i" }

function
  = "exp" { return "Complex.exp" }

SPACE = " "*