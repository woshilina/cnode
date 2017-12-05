const Koa = require('koa');
const renders = require('koa-ejs');
const path = require('path');
const session = require('koa-session');
const serve = require('koa-static');
const config = require('./database/config');
const app = new Koa();

app.keys = ['some secret hurr'];

renders(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'ejs',
  cache: false,
  debug: false
});

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false
};

app.use(session(CONFIG, app));

app.use(serve('public'));

app.use(require('./routers/onload').routes());
app.use(require('./routers/signin').routes());
app.use(require('./routers/main').routes());
app.use(require('./routers/topic').routes());
 
app.listen(3000);
