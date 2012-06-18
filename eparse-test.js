
// Testing

function assertEqual(e1, e2) {
    if (e1 != e2) {
        var err = 'Assertion failed: ' + e1 + ' != ' + e2;
        throw err;
    }
};

eparse.test = function() {
    eparse.terminal.echo('Running tests...');
    try {
        assertEqual(eparse.printTokens(eparse.tokenize('1 2 3')),
                    '[number(1), number(2), number(3)]');
        eparse.terminal.echo('All tests OK!');
    } catch (err) {
        eparse.terminal.error('test: '+err);
    }
};
