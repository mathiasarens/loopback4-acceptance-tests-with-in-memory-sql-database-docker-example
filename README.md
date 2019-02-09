# Loopback 4 Example

This Loopback 4 example includes

1. in-memory acceptance tests and a postgresql datasource for development/production.
2. configurations updates to run in a docker container
3. Optimisations for CircleCI
4. Visual Studio Code launch.json for debugging

Tests run in a docker container on [CircleCI](https://circleci.com)

# Modifications to standard configuration

## Stop loopback 4 booter from picking up development datasources during tests

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

Do the same for the devlopment/production datasource in [src/index.ts](https://github.com/mathiasarens/loopback4-acceptance-tests-with-in-memory-sql-database-docker-example/blob/master/src/index.ts)

```typescript
import {TodoDataSource} from './datasources/todo.datasource';
...
app.dataSource(TodoDataSource);
await app.boot();
```

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
