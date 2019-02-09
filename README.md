# Loopback 4 Example

This Loopback 4 example includes

1. in-memory acceptance tests and a postgresql datasource for development/production.
2. configurations updates to run in an docker container
3. Optimisations for CircleCI
4. Visual Studio Code launch.json for debugging

Tests run in a docker container on [CircleCI](https://circleci.com)

# Modifications to standard configuration

## Stop loopback 4 booter from picking up development datasources during tests

The most difficult part in the configuration is to stop the loopback 4 booter in the acceptance tests from picking up the developement/production datasource during app.boot() command. This causes a ConnectException in a docker container without a postgresql installation.
Therefore I nulled the bootOptions in [src/application.ts]() from

```javascript
this.bootOptions = {
  controllers: {
    dirs: ['controllers'],
    extensions: ['.controller.js'],
    nested: true,
  },
};
```

to

```javascript
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

Now I could configure the different datasources for appeptance tests and development/production seperately in the src/index.ts and src/**tests**/test-helper.ts

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
