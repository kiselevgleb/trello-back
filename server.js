const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

let ticketsAll = [{
  id: 0,
  text: 'Build a house',
  status: 'To do',
  time: "false",
  cost: "false",
}, {
  id: 1,
  text: 'Plant a tree',
  status: 'To do',
  time: "false",
  cost: "false",
}, {
  id: 2,
  text: 'Go to grocery',
  status: 'In progress',
  time: '523',
  cost: "false",
}, {
  id: 3,
  text: 'Take out the trash',
  status: 'Done',
  time: "false",
  cost: '5.15',
}, {
  id: 4,
  text: 'Waik the dog',
  status: 'Done',
  time: "false",
  cost: '5.15',
}];

function intervalFunc() {
  const result = ticketsAll.filter((tic) => tic.status === 'In progress');
  ticketsAll = ticketsAll.filter((tic) => tic.status !== 'In progress');
  result.map((t) =>
    ticketsAll.push({
      id: `${t.id}`,
      text: `${t.text}`,
      status: `${t.status}`,
      time: `${parseInt(t.time) + 1}`,
      cost: `${t.cost}`,
    }));
}

setInterval(intervalFunc, 1000);

app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx) => {
  const {
    method,
  } = ctx.request.query;
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods":
      "GET, POST, PUT, DELETE, OPTIONS, UPDATE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    "Content-Type": "application/json",
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
      console.log(147)
      console.log(ctx.request.body)
      const j = ctx.request.body;
      let numId;
      if (j.text !== undefined) {
        const repeat = ticketsAll.filter((tic) => tic.text !== j.text);
        if (j.id === undefined) {
          numId = ticketsAll.length;
          let numEr = ticketsAll.filter((tic) => tic.id === numId);
          while (numEr.length !== 0) {
            numId++;
            numEr = ticketsAll.filter((tic) => tic.id === numId);
          }
        }
        ticketsAll = repeat;
        ticketsAll.push({
          id: `${j.id ? j.id : numId}`,
          text: `${j.text}`,
          status: `${j.status}`,
          time: `${j.time}`,
          cost: `${j.cost}`,
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