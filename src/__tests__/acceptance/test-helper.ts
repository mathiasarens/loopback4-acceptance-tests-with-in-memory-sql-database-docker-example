import {Loopback4InMemoryAcceptanceTestsExampleApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {TodoDataSource} from '../fixtures/datasources/todo.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  const config = givenHttpServerConfig();
  config.host = '127.0.0.1';
  const app = new Loopback4InMemoryAcceptanceTestsExampleApplication({
    rest: config,
  });

  app.dataSource(TodoDataSource);
  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: Loopback4InMemoryAcceptanceTestsExampleApplication;
  client: Client;
}
