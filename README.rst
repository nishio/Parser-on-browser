===================
 Parser on browser
===================

TODO
====

- The operator table will be editable by the user in a textbox, for example:

::

   // arguments: name, priority (>0), associativity ('left', 'right')
   operator('+', 1, 'left');
   operator('-', 1, 'left');
   operator('*', 2, 'left');
   operator('/', 2, 'left');
   operator('**', 3, 'right');

- apart from that, the parser will of course understand '(' ')'

- The user will input an expression and receive a list of tokens, then the parser result, for example:

::

   input: 2+2*2**2**2*2+2
   tokens (lexer result): [number(2), op(+), number(2), op(*), number(2), ...]
   parser result: [[2 + [[2 * [2 ** [2 ** 2]]] * 2]] + 2]

