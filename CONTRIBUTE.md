# Contribute

If you want to contribute with the code, first create a fork, then clone it in your local computer (`git clone <REPO URL>`) and then run `npm install` to install all dependencies.

If you use Visual Studio Code as your editor, the project will have configured some tasks to compile and build the typescript faster.

```bash
# Task names
# Run them from Visual Studio Code or with "npm run <task>"
test        # Lint, build and run unit tests and generates coverage
test-only   # Build and Run only the unit tests
lint        # Lint the typescript code
build       # Build the entire app
watch       # Run the compiler in watch mode
clean       # Deletes the ./dist/ and ./coverage/ folder
coverage    # Generate test coverage in ./coverage/index.html
integration # Builds and run the integration tests
```

If not, you can allways run `npm run watch` to start the typescript compiler for the current project directory in watch mode. (Will recompile after any change).

Also, it's recomended that you run `npm run lint` to lint the project. (`npm test` will do it automatically for you)

Also, when you finish adding your feature, please run `npm run integration` to execute the integration tests.

When you are ready, send a pull request.

If you have any question, please contact me with a new issue.