
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
        assertEqual(eparse.printTokens(eparse.tokenize('2+3**5')),
                    '[number(2), op(+), number(3), op(**), number(5)]');

        assertEqual(eparse.printTokens(eparse.tokenize('(2+2)*2')),
                    '[lparen(), number(2), op(+), number(2), rparen(), '
                    + 'op(*), number(2)]');

        assertEqual(eparse.parseTokens(eparse.tokenize('2')), '2');

        assertEqual(eparse.parseTokens(eparse.tokenize('2+2**3**4*2+2')),
                    '[[2 + [[2 ** [3 ** 4]] * 2]] + 2]');

        eparse.terminal.echo('All tests OK!');
    } catch (err) {
        eparse.terminal.error('test: '+err);
    }
};
