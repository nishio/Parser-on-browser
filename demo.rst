Demo
====

.. it will inserted by https://github.com/nishio/learn_language/blob/master/doc/collect_readme.py
   at the point ".. demo" in README.rst

.. raw:: html

   <script src="repos/Parser-on-browser/eparse.js"></script>
   <script src="repos/Parser-on-browser/jquery-1.7.2.min.js"></script>
   <script src="repos/Parser-on-browser/jquery.terminal-0.4.15.js"></script>
   <script src="repos/Parser-on-browser/eparse.js"></script>
   <script src="repos/Parser-on-browser/eparse-test.js"></script>
   <link rel="stylesheet" type="text/css" href="repos/Parser-on-browser/terminal.css" />
   <script>
     $(function() {
       eparse.interface($('#term'), $('#operators'), $('#load'));
       eparse.test();
       $('body').click(function() { eparse.terminal.disable(); });
       $('#clear').click(function () { eparse.terminal.clear(); });
     });
   </script>

   <div id="term" style="width: 48%; height: 300px; float: left;"></div>
   <div style="width: 48%; float: right;">
       <textarea id="operators" style="width: 100%; height: 300px;">
   // define operators here
   // arguments: name, priority (>0), associativity ('left', 'right')

   operator('+', 1, 'left');
   operator('-', 1, 'left');
   operator('*', 2, 'left');
   operator('/', 2, 'left');
   operator('**', 3, 'right');
   </textarea>
       <input type="button" id="clear" value="Clear terminal" />
       <input type="button" id="load" value="Load operators" />
   </div>
   <p style="clear: both"></p>

