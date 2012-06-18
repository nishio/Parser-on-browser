
eparse = {};

// Split the string into tokens. A token is a object with keys
// 'type', 'val'.
eparse.tokenize = function(str) {
    // We work by deleting from the front of the input.
    var input = str;

    // Delete spaces from the beginning of the input
    var deleteSpaces = function() {
        var pos = 0;
        while (/\s/.test(input[pos]) && pos < input.length)
            pos++;
        input = input.substr(pos);
    };

    var tokens = [];
    deleteSpaces();

    // If input starts with 's', delete it and return true
    var tryConsume = function(s) {
        if (input.substr(0, s.length) == s) {
            input = input.substr(s.length);
            return true;
        }
        return false;
    };

    for (; input.length > 0; deleteSpaces()) {
        // First, look for a number
        var m = /^\d+/.exec(input);
        if (m != null) {
            input = input.substr(m[0].length);
            tokens.push({type: 'number', val: parseInt(m[0])});
            continue;
        }

        // Now, try the operators
        var opFound = false;
        for (var i = 0; i < eparse.opsList.length; i++) {
            var op = eparse.opsList[i];
            if (tryConsume(op)) {
                tokens.push({type: 'op', val: op});
                opFound = true;
                break;
            }
        }
        if (opFound)
            continue;

        // Then try parentheses
        if (tryConsume('(')) {
            tokens.push({type: 'lparen', val: ''});
            continue;
        }

        if (tryConsume(')')) {
            tokens.push({type: 'rparen', val: ''});
            continue;
        }

        // We failed - now report the error. First, determine the position
        var pos = str.length - input.length;
        // string before error:
        var start = str.substr(0, pos);
        throw 'Lexer error: ' + start + '<HERE>' + input;
    }
    return tokens;
};

eparse.printToken = function(token) {
    return token.type + '(' + token.val + ')';
};

// Formats an array of tokens to a string in the format:
// [ number(2), op(+), ... ]
eparse.printTokens = function(tokens) {
    var s = '[';
    for (var i = 0; i < tokens.length; ++i) {
        s += eparse.printToken(tokens[i]);
        if (i < tokens.length-1)
            s += ', ';
    }
    s += ']';
    return s;
};

// Parse the tokens as an arithmetic expression. Returns a string description
eparse.parseTokens = function(tokens) {
    var pos = 0;

    var parseError = function() {
        if (pos == tokens.length)
            throw 'Parse error at the end of input';
        else
            throw 'Parse error before '+eparse.printToken(tokens[pos]);
    };

    // a number, or a parenthesized expression
    var simpleExpr = function() {
        if (pos == tokens.length)
            return null;

        if(tokens[pos].type == 'number')
            return tokens[pos++].val.toString();

        if(tokens[pos].type == 'lparen') {
            pos++;
            var e = expr(0);
            if (e == null)
                parseError();
            if (pos == tokens.length || tokens[pos].type != 'rparen')
                parseError();
            pos++;
            return e;
        }

        return null;
    };

    var operator = function() {
        if (pos < tokens.length && tokens[pos].type == 'op')
            return tokens[pos++].val;
        return null;
    };

    // a full expression
    var expr = function(priority) {
        var e1 = simpleExpr();
        if (e1 == null)
            return null;

        for (;;) {
            var op = operator();
            if (op == null)
                return e1;

            var opData = eparse.ops[op];
            if (opData.priority < priority ||
                (opData.priority == priority && opData.assoc == 'left')) {
                // We finish the expression here and let the caller
                // handle the rest.
                pos--; // unread the operator
                return e1;
            }

            // Otherwise, continue the expression
            var e2 = expr(opData.priority);
            if (e2 == null)
                parseError();

            e1 = '['+e1+' '+op+' '+e2+']';
            // then keep going
        }
    };

    var result = expr(0);
    if (result == null || pos < tokens.length)
        parseError();
    return result;
};

// Create an operator table from code
eparse.loadOps = function(code) {
    var ops = {};
    var opsList = [];

    // the code will invoke that function
    // reqs: priority > 0, assoc is 'left' or 'right'
    var operator = function(name, priority, assoc) {
        if (!(priority > 0 && (assoc == 'left' || assoc == 'right')))
            throw 'wrong operator definition for '+name;
        ops[name] = { 'priority': priority, 'assoc': assoc };
        opsList.push(name);
    };
    eval(code);

    // now sort the operators according to their length
    // (the lexer tries to match longer operators first)
    opsList.sort(function(a, b) { return b.length - a.length; });

    eparse.ops = ops;
    eparse.opsList = opsList;
};

// Initialize interface: terminal, operator textarea, load button
// (given as jQuery objects)
eparse.interface = function(terminal, ops, load) {
    terminal.terminal(
        function(str, terminal) {
            try {
                var tokens = eparse.tokenize(str);
                terminal.echo('tokens: '+eparse.printTokens(tokens));
                terminal.echo('result: '+eparse.parseTokens(tokens));
            } catch (err) {
                eparse.terminal.error(err);
            }
        },
        {
            greetings: "Expression parser. Type an arithmetic expression",
            prompt: 'eparse> '
        });
    eparse.terminal = terminal.terminal();
    load.click(function() {
                   eparse.terminal.echo('Loading operators...');
                   try {
                       eparse.loadOps(ops.val());
                       eparse.terminal.echo(eparse.opsList.length+' operators loaded');
                   } catch (err) {
                       eparse.terminal.error(err);
                   }
               });
    load.click();
};
