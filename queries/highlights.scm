(identifier) @variable

(call_expression
  function: (identifier) @function)

(call_expression
  function: (identifier) @function.builtin
  (#match? @function.builtin "^(int|float|string|len|del|print|append|slice)$"))

(function_definition
  name: (identifier) @function)

(comment) @comment

[
 "fn"
 "return"
 "let"
 "while"
 "if"
 "else"
 "break"
 "continue"
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
