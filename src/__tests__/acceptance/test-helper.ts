import {Loopback4InMemoryAcceptanceTestsExampleApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {TodoDataSource} from '../fixtures/datasources/todo.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new Loopback4InMemoryAcceptanceTestsExampleApplication({
    rest: givenHttpServerConfig(),
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
