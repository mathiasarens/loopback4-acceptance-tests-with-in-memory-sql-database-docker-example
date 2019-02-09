import {Loopback4InMemoryAcceptanceTestsExampleApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {TodoDataSource} from './datasources/todo.datasource';

export {Loopback4InMemoryAcceptanceTestsExampleApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new Loopback4InMemoryAcceptanceTestsExampleApplication(options);

  // configure development datasource
  app.dataSource(TodoDataSource);

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/todos`);

  return app;
}
