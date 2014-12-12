var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var controller = require("./routes/controller");

var bikeStationDB = require("./util/bikeStationDB");
var bikeDB = require("./util/bikeDB");
var receiptDB = require("./util/receiptsDB");
var userAccountsDB = require("./util/userAccountsDB");

var http = require('http');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
}

else {

var app = express();

/*
var RedisStore = require('connect-redis')(express);

app.use(express.cookieParser());
app.use(express.session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 2,
    pass: 'RedisPASS'
  }),
  secret: '1234567890QWERTY'
}));
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.set('port', process.env.PORT || 3000);
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(app.router);


app.get('/', controller.hello,controller.hi); //Record Current Location.
app.post('/biker_login', controller.bikerLogin);  //User Login.
app.post('/signup', controller.signup);  //User Signup/Registeration.
//app.post('/select', controller.checkSessionExists, controller.showSelectionPage);
app.get('/rent'/*,controller.checkSessionExists*/, controller.showMapsPlot);
app.get('/bike_info' /*,controller.checkSessionExists*/, controller.showSelectedBikeInfo);
app.post('/trip_confirmation' /*,controller.checkSessionExists*/, controller.tripConfirmation); 
app.get('/extend_booking' /*,controller.checkSessionExists*/, controller.extendExistingBooking);  
//app.get('/advanced_booking' /*,controller.checkSessionExists */, controller.makeAdvancedBooking);   
app.post('/change_password' /*,controller.checkSessionExists*/, controller.changePassword); 
app.post('/add_new_bike' /*,controller.checkSessionExists*/, controller.addNewBike); 
app.post('/report_damage' /*,controller.checkSessionExists*/, controller.reportDammage);
app.post('/return_bike' /*,controller.checkSessionExists*/, controller.returnBike);
app.post('/view_all_my_rides' /*,controller.checkSessionExists*/, controller.viewAllMyRides);
app.post('/bikeOnwer' /*,controller.checkSessionExists*/, controller.adminFunctions);
app.post('/bikeOwner_cost_scales_confirmation' /*,controller.checkSessionExists*/, controller.adminFunctionsConfirmation);

app.all('*', function(req, res){
    res.render('homepage');
    //res.send(404);
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
}
