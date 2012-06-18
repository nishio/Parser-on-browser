
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

    for (; input.length > 0; deleteSpaces()) {
        // First, look for a number
        var m = /^\d+/.exec(input);
        if (m != null) {
            input = input.substr(m[0].length);
            tokens.push({type: 'number', val: parseInt(m[0])});
            continue;
        }
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
};
