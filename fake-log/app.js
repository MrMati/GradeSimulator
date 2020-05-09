const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const cors = require("cors");
const protocol = require("./src/utils/connection");
// const favicon = require('serve-favicon');

const subdomain = require('express-subdomain');
const index = require('./src/routes/index');
const api = require('./src/routes/api');
const cufs = require('./src/routes/cufs');
const uonetplus = require('./src/routes/uonetplus');
const uonetplusOpiekun = require('./src/routes/uonetplus-opiekun');
const uonetplusUczen = require('./src/routes/uonetplus-uczen');
const uonetplusUzytkownik = require('./src/routes/uonetplus-uzytkownik');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.userInfo = require('./data/api/ListaUczniow')[1];
  res.locals.uonetplusUrl = protocol(req) + "://" + req.get('host').replace("uonetplus-opiekun", "uonetplus");
  res.locals.currentHost = protocol(req) + "://" + req.get('host');
  res.locals.proto = protocol(req);
  res.locals.host = req.get('host').replace(/(api|cufs|uonetplus|uonetplus-opiekun|uonetplus-uzytkownik)\./, "");

  res.cookie("UonetPlus_ASP.NET_SessionId", "", { httpOnly: true, domain: req.get("host") });
  res.cookie("ARR_DS_ARR301302", "", { httpOnly: true, domain: req.get("host") });
  res.cookie("ARR_" + req.get('host'), "1234567891012131314151617181920212223242526272829303132333435363", { httpOnly: true, domain: req.get("host") });
  next();
});

const corsOpt = {
  origin: process.env.CORS_ALLOW_ORIGIN || '*'
};
app.use(cors(corsOpt));
app.options('*', cors(corsOpt));

app.use(subdomain('api', api));
app.use(subdomain('cufs', cufs));
app.use(subdomain('uonetplus', uonetplus));
app.use(subdomain('uonetplus-opiekun', uonetplusOpiekun.use('/powiatwulkanowy/123456', uonetplusOpiekun)));
app.use(subdomain('uonetplus-opiekun', uonetplusOpiekun.use('/powiatwulkanowy/123457', uonetplusOpiekun)));
app.use(subdomain('uonetplus-opiekun', uonetplusOpiekun.use('/powiatwulkanowy/123458', uonetplusOpiekun)));
app.use(subdomain('uonetplus-uczen', uonetplusUczen.use('/powiatwulkanowy/123456', uonetplusUczen)));
app.use(subdomain('uonetplus-uczen', uonetplusUczen.use('/powiatwulkanowy/123457', uonetplusUczen)));
app.use(subdomain('uonetplus-uczen', uonetplusUczen.use('/powiatwulkanowy/123458', uonetplusUczen)));
app.use(subdomain('uonetplus-uzytkownik', uonetplusUzytkownik.use('/powiatwulkanowy', uonetplusUzytkownik)));
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (typeof(PhusionPassenger) !== 'undefined') {
  app.listen('passenger');
}

module.exports = app;
