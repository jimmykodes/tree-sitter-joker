const
  PREC = {
    primary: 7,
    unary: 6,
    multiplicative: 5,
    additive: 4,
    comparative: 3,
    and: 2,
    or: 1,
    composite_literal: -1,
  },
  builtins = ["int", "float", "string", "len", "del", "print", "append", "slice"]

module.exports = grammar({
  name: "joker",
  word: $ => $.identifier,
  rules: {
    source_file: $ => repeat($._statement),

    function_definition: $ => seq(
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      field('body', $.block),
    ),

    function_literal: $ => seq(
      'fn',
      field('parameters', $.parameter_list),
      field('body', $.block),
    ),

    parameter_list: $ => seq(
      '(',
      optional(prec.left(seq(commaSep1($.identifier)))),
      ')'
    ),

    argument_list: $ => seq(
      '(',
      optional(seq(commaSep1($._expression))),
      ')',
    ),

    call_expression: $ => prec(PREC.primary, choice(
      seq(
        field('function', $._expression),
        field('arguments', $.argument_list),
      ),
      seq(
        field('function', alias(choice(...builtins), $.identifier)),
        field('arguments', $.argument_list),
      )
    )),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    true: _ => 'true',
    false: _ => 'false',

    _statement: $ => choice(
      $.function_definition,
      $.variable_definition,
      $.return_statement,
      $.assignment_statement,
      $.while_statement,
      $.if_statement,
      $.call_statement,
    ),


    _expression: $ => choice(
      $.identifier,
      $.integer,
      $.float,
      $.string_literal,
      $.map_literal,
      $.array_literal,
      $.function_literal,
      $.true,
      $.false,
      $.index_expression,
      $.unary_expression,
      $.binary_expression,
      $.call_expression,
    ),

    call_statement: $ => seq(
      $.call_expression,
      ';',
    ),

    return_statement: $ => seq(
      'return',
      $._expression,
      optional(';'),
    ),

    while_statement: $ => seq(
      'while',
      field('condition', $._expression),
      field('body', $.block)
    ),

    if_statement: $ => seq(
      'if',
      field('condition', $._expression),
      field('consequence', $.block),
      optional(seq(
        'else',
        field('alternative', $.block),
      ))
    ),

    variable_definition: $ => choice(
      seq("let", $.identifier, "=", $._expression, ";"),
      seq($.identifier, ":=", $._expression, ';'),
    ),

    assignment_statement: $ => seq(
      field('left', $.expression_list),
      field('operator', '='),
      field('right', $.expression_list),
      ";",
    ),

    expression_list: $ => commaSep1($._expression),

    unary_expression: $ => prec(PREC.unary, seq(
      field('operator', choice('!', '-')),
      field('operand', $._expression)
    )),

    binary_expression: $ => {
      const table = [
        [PREC.multiplicative, choice('*', '/')],
        [PREC.additive, choice('+', '-')],
        [PREC.comparative, choice('<', '<=', '>', '>=', '==', '!=')],
        // [PREC.and, '&&'],
        // [PREC.or, '||'],
      ];

      return choice(...table.map(([precedence, operator]) => prec.left(precedence, seq(
        field('left', $._expression),
        field('operator', operator),
        field('right', $._expression),
      )),
      ));
    },

    index_expression: $ => prec(PREC.primary, seq(
      field('operand', $._expression),
      '[',
      field('index', $._expression),
      ']',
    )),

    string_literal: _ => token(seq(
      '"',
      repeat(/[^"]/),
      '"',
    )),

    map_literal: $ => seq(
      "{",
      optional(commaSep1(seq(
        field("key", $._expression),
        ":",
        field("value", $._expression),
      ))),
      "}",
    ),
    array_literal: $ => seq(
      "[",
      optional(commaSep1($._expression)),
      "]",
    ),

    identifier: _ => /[a-zA-Z_]+/,

    integer: _ => token(/\d+/),
    float: _ => {
      const digits = repeat1(/[0-9]+/)
      return token(seq(digits, '.', digits))
    },
  }
})


function commaSep1(rule) {
  return sep1(rule, ",")
}

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)))
}
