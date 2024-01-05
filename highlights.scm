(call_expression
  function: (identifier) @function.builtin
  (.match? @function.builtin "^(int|float|string|len|del|print|append|slice)$"))

(call_expression
  function: (identifier) @function)

(function_definition
  name: (identifier) @function)

(identifier) @variable

[
 "fn"
 "return"
 "let"
 "while"
 "if"
 "else"
] @keyword

[
 "-"
 "+"
 "*"
 "/"
 "!"
 "="
 ":="
 "<"
 "<="
 ">"
 ">="
 "=="
 "!="
] @operator

[
 (integer)
 (float)
] @number

(string_literal) @string

[
 (true)
 (false)
] @constant.builtin
