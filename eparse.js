
eparse = {};

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
