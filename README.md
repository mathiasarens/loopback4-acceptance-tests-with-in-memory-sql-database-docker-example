# Loopback 4 Example [![CircleCI](https://circleci.com/gh/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example.svg?style=svg)](https://circleci.com/gh/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example)

This Loopback 4 example includes

1. in-memory acceptance tests and a postgresql datasource for development/production.
2. optimisations to run tests in a docker container
3. set up for CircleCI
4. Visual Studio Code launch.json for debugging

A very simple todo application is used to demonstrate the configuration changes.

Tests run in a docker container on [CircleCI](https://circleci.com/gh/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example)

# Modifications to standard configurations

The most difficult part in the configuration is to stop the loopback 4 booter in the acceptance tests from picking up the developement/production datasource during app.boot() command. This causes a ConnectException in a docker container without a postgresql installation.
Therefore I nulled the bootOptions in [src/application.ts](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/application.ts) from

```typescript
this.bootOptions = {
  controllers: {
    dirs: ['controllers'],
    extensions: ['.controller.js'],
    nested: true,
  },
};
```

to

```typescript
this.bootOptions = {
  controllers: {
    dirs: ['controllers'],
    extensions: ['.controller.js'],
    nested: true,
  },
  // don't pickup datasource configurations
  datasources: {
    dirs: [],
    extensions: [],
    nested: false,
  },
};
```

Now I can configure the different datasources for acceptance tests and development/production separately in the [src/index.ts](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/index.ts) and [src/\_\_tests\_\_/acceptance/test-helper.ts](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/__tests__/acceptance/test-helper.ts)

For the acceptance tests copy over the todo.datasource.ts and todo.datasource.json from src/datasources to src/\_\_tests\_\_/fixtures/datasources and change the [src/\_\_tests\_\_/fixtures/datasources/todo.datasource.json](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/__tests__/fixtures/datasources/todo.datasource.json) into a in-memory datasource

```json
{
  "name": "todo",
  "connector": "memory"
}
```

Then import and configure the datasource programatically for the acceptance tests in [src/\_\_tests\_\_/acceptance/test-helper.ts](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/__tests__/acceptance/test-helper.ts)

```typescript
import {TodoDataSource} from '../fixtures/datasources/todo.datasource';
...
app.dataSource(TodoDataSource);
await app.boot();
```

Do the same for the development/production datasource in [src/index.ts](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/index.ts)

```typescript
import {TodoDataSource} from './datasources/todo.datasource';
...
app.dataSource(TodoDataSource);
await app.boot();
```

# Optimisations to run tests in a docker container

Change host to '127.0.0.1' in
[src/\_\_tests\_\_/acceptance/test-helper.ts](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/__tests__/acceptance/test-helper.ts) to run tests in a docker environment

```typescript
const config = givenHttpServerConfig();
config.host = '127.0.0.1';
const app = new Loopback4InMemoryAcceptanceTestsExampleApplication({
  rest: config,
});
```

# Set up for Circle CI

1. reactivate package-lock.json in [.npmrc](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/.npmrc)
2. add [config.yml](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/.circleci/config.yml) to .circleci directory

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:11.8
    steps:
      - checkout
      - restore_cache:
          keys:
            - npm-cache-{{ .Branch }}-{{ checksum "package-lock.json" }}
            - npm-cache-{{ .Branch }}-
            - npm-cache-
      - run: npm install
      - save_cache:
          paths:
            - node_modules
          key: npm-cache-{{ .Branch }}-{{ checksum "package-lock.json" }}
      - run: npm run test
```

# Visual Studio Code launch.json for debugging

Add

```json
{
  "type": "node",
  "request": "launch",
  "name": "Mocha Tests",
  "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
  "args": [
    "-u",
    "tdd",
    "--timeout",
    "999999",
    "--colors",
    "${workspaceFolder}/dist/test"
  ],
  "internalConsoleOptions": "openOnSessionStart"
}
```

to your [.vscode/launch.json](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/.vscode/launch.json) to debug all tests

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
