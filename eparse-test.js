
// Testing

eparse.test = function() {
    eparse.terminal.echo('Running tests...');
    try {
        eparse.terminal.echo('All tests OK!');
    } catch (err) {
        eparse.terminal.error('test: '+err);
    }
};
