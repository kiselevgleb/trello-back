const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

const ticketsAll = [{
  id: 0,
  text: 'Build a house',
  status: 'To do',
}, {
  id: 1,
  text: 'Plant a tree',
  status: 'To do',
}, {
  id: 2,
  text: 'Go to grocery',
  status: 'In progress',
  time: '00:08:43',
}, {
  id: 3,
  text: 'Take out the trash',
  status: 'Done',
  cost: '5.15',
}, {
  id: 4,
  text: 'Waik the dog',
  status: 'Done',
  cost: '5.15',
}


];
app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx) => {
  const {
    method,
  } = ctx.request.query;
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  });
  switch (method) {
    case 'allTickets':
      ctx.response.body = ticketsAll;
      return;
    case 'ticketByStatus':
      const {
        status,
      } = ctx.request.query;
      const result = ticketsAll.filter((tic) => tic.status === status);
      ctx.response.body = result;
      return;
    case 'delById':
      const js = JSON.parse(ctx.request.body);
      const resultDel = ticketsAll.filter((tic) => tic.id.toString() === js.num);
      const num = ticketsAll.indexOf(resultDel[0]);
      ticketsAll.splice(num, 1);
      ctx.response.body = ticketsAll;
      return;
    case 'createTicket':
      const j = JSON.parse(ctx.request.body);
      const repeat = ticketsAll.filter((tic) => tic.name === j.name);
      let numId = ticketsAll.length;
      let numEr = ticketsAll.filter((tic) => tic.id === numId);

      while (numEr.length !== 0) {
        numId++;
        numEr = ticketsAll.filter((tic) => tic.id === numId);
      }
      if (repeat.length === 0) {
        ticketsAll.push({
          id: numId,
          name: `${j.name}`,
          dis: `${j.dis}`,
          status: `${j.status}`,
          created: `${j.created}`,
        });
      }
      ctx.response.body = ticketsAll;
      return;
    default:
      ctx.response.status = 404;
  }
});
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
