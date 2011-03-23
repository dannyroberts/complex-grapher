start
  = SPACE a:additive SPACE { var code = "(function(z) {return " + a + ";})"; var f = eval(code); f.code = code; return f}
//  = SPACE a:additive SPACE { return eval("(function(z) {return " + a + ";})"); }

additive
  = left:negative SPACE "+" SPACE right:additive { return "Complex.add(" + left + ", " + right + ")"; }
  / left:negative SPACE "-" SPACE right:additive { return "Complex.add(" + left + ", Complex.negative(" + right + "))"; }
  / negative

negative
  = "-" SPACE c:multiplicative { return "Complex.negative(" + c + ")"; }
  / multiplicative

multiplicative
  = left:exponential SPACE "*"? SPACE right:multiplicative { return "Complex.multiply(" + left + ", " + right + ")"; }
  / left:exponential SPACE "/" SPACE right:multiplicative { return "Complex.divide(" + left + ", " + right + ")"; }
  / exponential

exponential
  = left:function_call SPACE "**" SPACE right:function_call { return "Complex.pow(" + left + ", " + right + ")"; }
  / function_call

function_call
  = f:function SPACE z:primary { return f + "(" + z + ")"; }
  / primary

primary
  = number
  / variable
  / "(" SPACE a:additive SPACE ")" { return "(" + a + ")"; }

number "number"
  = before:[0-9]* "." after:[0-9]+ { return "(new Complex(" + before.join("") + "." + after.join("") + ", 0))"; }
  / digits:[0-9]+ "."? { return "(new Complex(" + digits.join("") + ", 0))"; }
  
  
variable
  = "z" { return "z"; }
  / cnst:("i"/"pi"/"e") { return "Complex." + cnst; }

function
  = fn:("exp"/"re"/"im"/"abs"/"conj") { return "Complex." + fn; }

SPACE = " "*