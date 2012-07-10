===================
 Parser on browser
===================

.. demo

Feature
=======

- The operator table is editable by the user in a textbox, for example:

::

   // define operators here
   // arguments: name, priority (>0), associativity ('left', 'right')

   operator('+', 1, 'left');
   operator('^', 3, 'left');
   operator('-', 1, 'left');
   operator('*', 2, 'left');
   operator('/', 2, 'left');
   operator('**', 3, 'right');


- The parser understand '(' ')'

- The user input an expression and receive a list of tokens, then the parser result, for example:

::

   eparse> 2+2*2**2**2*2+2
   tokens: [number(2), op(+), number(2), op(*), number(2), op(**), number
   (2), op(**), number(2), op(*), number(2), op(+), number(2)]
   result: [[2 + [[2 * [2 ** [2 ** 2]]] * 2]] + 2]


Read code!
==========

Its parser is about 200 lines.

https://github.com/nishio/Parser-on-browser


License
=======

GPLv3 (c) NISHIO Hirokazu 2012


Thanks
======

Paweł Marczewski contributed much to the project.
