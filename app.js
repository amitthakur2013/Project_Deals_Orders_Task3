const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose=require('mongoose');
const footerlinkrouter=require('./routes/footerlink');
const indexRouter = require('./routes/index');
const categoryRouter=require('./routes/categoryRouter');
const SubcategoryRouter=require('./routes/SubcategoryRouter');
const merchantRouter=require('./routes/merchantRouter');
const dealRouter=require('./routes/dealRouter');
const orderRouter=require('./routes/orderRouter');
const customerRouter=require('./routes/customerRouter');

const app = express();

mongoose.set('useFindAndModify',false);
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true);

// connect to the database
mongoose.connect('mongodb://localhost:27017/cms_data').then((db) => {
	console.log("Connected curently to server!");
}).catch((err)=>{
	console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/footer',footerlinkrouter);
app.use('/category',categoryRouter);
app.use('/merchant',merchantRouter);
app.use('/subcategory',SubcategoryRouter);
app.use('/deal',dealRouter);
app.use('/order',orderRouter);
app.use('/customer',customerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
