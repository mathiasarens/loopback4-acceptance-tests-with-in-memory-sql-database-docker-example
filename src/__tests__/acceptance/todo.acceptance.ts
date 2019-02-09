import {Client, expect} from '@loopback/testlab';
import {Loopback4InMemoryAcceptanceTestsExampleApplication} from '../..';
import {setupApplication} from './test-helper';

describe('Todo', () => {
  let app: Loopback4InMemoryAcceptanceTestsExampleApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('add todo item on post', async () => {
    const res = await client
      .post('/todos')
      .send({title: 'Todo Item'})
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(res.body.id).to.be.a.Number();
    expect(res.body.title).to.eql('Todo Item');
    expect(res.body.isComplete).to.eql(false);
  });
});
