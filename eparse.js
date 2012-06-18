
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

        throw 'lexer error';
    }
    return tokens;
};

// Formats an array of tokens to a string in the format:
// [ number(2), op(+), ... ]
eparse.printTokens = function(tokens) {
    var s = '[';
    for (var i = 0; i < tokens.length; ++i) {
        s += tokens[i].type+'('+tokens[i].val+')';
        if (i < tokens.length-1)
            s += ', ';
    }
    s += ']';
    return s;
};

// Create an operator table from code
eparse.loadOps = function(code) {
    var ops = {};
    var opsList = [];

    // the code will invoke that function
    // reqs: priority > 0, assoc is 'left' or 'right'
    var operator = function(name, priority, assoc) {
        console.log(name);
        if (!(priority > 0 && (assoc == 'left' || assoc == 'right')))
            throw 'wrong operator definition for '+name;
        ops['name'] = { 'priority': priority, 'assoc': assoc };
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
            terminal.echo(str);
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
