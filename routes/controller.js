/**
 * Author: Sai
 */


var userAccountsDB = require("../util/userAccountsDB");
var bikeStationDB = require("../util/bikeStationDB");
var bikeDB = require("../util/bikeDB");
var tripDB = require("../util/tripDB");
var receiptDB = require("../util/receiptsDB");

var latitude;
var longitude;

var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
        console.log("Error " + err);
});

	

 exports.bikerLogin = function (req, res) {
	if(!req.body.hasOwnProperty('bikerContactEmail') || !req.body.hasOwnProperty('bikerPassword')) {
		res.statusCode = 400;
		console.log(req);
		return res.send('Error 400: Post syntax incorrect.');
	}
	var json = [];
	json.bikerContactEmail = req.body.bikerContactEmail;
	json.bikerPassword = req.body.bikerPassword;

	//req.session.latitude = req.body.latitude;
	//req.session.longitude = req.body.longitude;

	//latitude = req.session.latitude;
	//longitude = req.session.longitude;
	
	userAccountsDB.userLogin(function(err,results){
		if(err){
			console.log(err);
		}
		else
		{
			if(results==1){

				client.setex(req.body.bikerContactEmail, 900, req.body.bikerContactEmail, function (err, reply) {     //REDIS Set.
       				console.log(reply.toString());
    			});

				//res.render('../views/bikeStations.ejs');
				console.log("success");
				return res.render('select');
			
			}
			
			else if(results==0)
			{
				console.log("Invalid Id or Password");
				return res.send(err);
				//res.render('../views/LogInError.ejs');
			}
		}
	},json);
}

exports.hello = function(req,res,next){
	if(true)
		next();
	else
		res.render('hello');
}

exports.hi = function(req,res){
	res.render('hello');
}


exports.signup = function (req, res) {
	if(!req.body.hasOwnProperty('bikerContactEmail')  ) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	var json = [];
	json.bikerContactEmail = req.body.bikerContactEmail;
	json.bikerPassword = req.body.bikerPassword;
	json.bikerName = req.body.bikerName;
	json.bikerContactAddress = req.body.bikerContactAddress;
	json.bikerContactPhone = req.body.bikerContactPhone;

	userAccountsDB.newUser(function(err,result){
		if(!err){
			return res.send("New User Created. Login to continue.");
		}
		else{
			return res.send(err);
		}
	},json);

}



exports.checkSessionExists = function(req, res, next) {
	client.get(bikerContactEmail, function(err,bikerDetails){
		if(bikerDetails != null){
			next();
		}
		else{
			return res.render('../views/sessionExpired.ejs');
		}
	});
}

exports.showSelectionPage = function(req,res){
	res.render('select');
}

//In showMapsPlot, the booking times of bikes need to be considered. Re-Write the function findAllBikesNotInUse.

exports.showMapsPlot = function(req,res){
	bikeDB.findAllBikesNotInUse(function(err,result){
		if(!err){
			console.log("No Error in rendering map ");
			//return res.send("Error in rendering map ");
			res.render('showMapsPlot',{'json':result});
		}
		else{
			//res.render('error');
			console.log("Actual error. Maps Plot Not Ready to Render.");
			return res.send("Actual error. Maps Plot Not Ready to Render." + err);
		}
	});
}

exports.showSelectedBikeInfo = function(req,res){
	var query = require('url').parse(req.url,true).query;
	var bikeId = query.bikeId;
	console.log("BikeId: "+bikeId);
	if(bikeId){

		console.log(bikeId);

		bikeDB.findBikeById(function(err,docs){
			if(!err){
				console.log("Error Rendering Page.");
				res.render('bike_info',{'json':docs});
			}
			else{
				console.log("Database Error.");
				return res.send('database error');
			}

		},parseInt(bikeId));
	}
	else{
		console.log("Error hitting the URL. Missing Parameters.");
		res.render('error');
	}
}

//Incomplete Extend Booking Feature.

exports.extendExistingBooking = function(req, res){
	//if(!req.body.hasOwnProperty('tripId') || !req.body.hasOwnProperty('tripStatus')){
		//console.log("PLease Priint...");
		res.render('extend',{'json':"json"});
	//}
	//else{
		//res.render('error');
	//}
}

exports.tripConfirmation = function(req, res) {

	if(!req.body.hasOwnProperty('bikeId') || !req.body.hasOwnProperty('startHours') || !req.body.hasOwnProperty('startMinutes') || !req.body.hasOwnProperty('endHours') || !req.body.hasOwnProperty('endMinutes') || !req.body.hasOwnProperty('pickUpPointLatitide') || !req.body.hasOwnProperty('dropLocation')  ) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	var json = [];
	json.bikeId = req.body.bikeId;
	json.dropLocation= req.body.dropLocation;
	json.tripStatus = 1;
	json.startHours = req.body.startHours;
	json.startMinutes = req.body.startMinutes;
	json.endHours = req.body.endHours;
	json.endMinutes = req.body.endMinutes;
	
	tripDB.insertTrip(function(err,result){

		if(!err){
			console.log(json);
			res.render('tripConfirmation',{'json1' : json});
		}
		else{
			res.render('er');
		}

	},json);
}


exports.changePassword = function(req, res){

	var json = [];

	if(!req.body.hasOwnProperty('bikerContactEmail') || !req.body.hasOwnProperty('bikerCurrentPassword') || !req.body.hasOwnProperty('bikerNewPassword')  || !req.body.hasOwnProperty('bikerName') || !req.body.hasOwnProperty('bikerContactAddress') || !req.body.hasOwnProperty('bikerContactPhone')){

		json.bikerName = req.body.bikerName;
		json.bikerContactEmail = req.body.bikerContactEmail;
		json.bikerContactPhone = req.body.bikerContactPhone;
		json.bikerContactAddress = req.body.bikerContactAddress;
		json.bikerCurrentPassword = req.body.bikerCurrentPassword;
		json.bikerNewPassword = req.body.bikerNewPassword;

		userAccountsDB.changePassword(function(err,result){
			if(!err){
				if(result == 1){
					res.render('passwordChanged');
				}
				else{
					res.render('error');
				}
			}
		},json);
	}
	else{
		res.render(error);
	}

}

exports.addNewBike = function(req,res){

	var json = [];

	if(!req.body.hasOwnProperty('bikeId') || !req.body.hasOwnProperty('bikeName') || !req.body.hasOwnProperty('bikeCurrentLatitide')  || !req.body.hasOwnProperty('bikeCurrentLongitude') || !req.body.hasOwnProperty('bikeCategoryScale') || !req.body.hasOwnProperty('bikeAdvancedBookingFlag') || !req.body.hasOwnProperty('bikeInsuranceScale') || !req.body.hasOwnProperty('bikeMaintainanceScale') || !req.body.hasOwnProperty('bikeOwnerContact')  || !req.body.hasOwnProperty('bikeLocationPremiumScale') || !req.body.hasOwnProperty('bikeOwnerName') || !req.body.hasOwnProperty('bikeAdvancedBookingFlag')){

		json.bikeId = req.body.bikeId;
		json.bikeName = req.body.bikeName;
		json.bikeCurrentLatitide = req.body.bikeCurrentLatitide;
		json.bikeCurrentLongitude = req.body.bikeCurrentLongitude;
		json.bikeCategoryScale = req.body.bikeCategoryScale;
		json.bikeAdvancedBookingFlag = req.body.bikeAdvancedBookingFlag;
		json.bikeInsuranceScale = req.body.bikeInsuranceScale;
		json.bikeMaintainanceScale = req.body.bikeMaintainanceScale;
		json.bikeLocationPremiumScale = req.body.bikeLocationPremiumScale;
		json.bikeOwnerContact = req.body.bikeOwnerContact;
		json.bikeOwnerName = req.body.bikeOwnerName;
		json.bikeInUseFlag = req.body.bikeInUseFlag;

		bikeDB.insertBike(function(err,result){
			if(!err){
				res.render('added_new_bike',{'json':json});
			}
			else{
				res.render('error_adding_bike',{'json':json});
			}
		},json)
	}
	else{
		res.render('error');
	}	
}

exports.reportDammage = function(req,res){

	if(!req.body.hasOwnProperty('bikeId') || !req.body.hasOwnProperty('bookingStartTimeHours') || !req.body.hasOwnProperty('bookingStartTimeMinutes') || !req.body.hasOwnProperty('bookingEndTimeHours') || !req.body.hasOwnProperty('bookingEndTimeMinutes') || !req.body.hasOwnProperty('pickUpPoint') || !req.body.hasOwnProperty('dropOffPoint') || !req.body.hasOwnProperty('bikerContactEmail') || !req.body.hasOwnProperty('bikerContactPhone') || !req.body.hasOwnProperty('bikerName') || !req.body.hasOwnProperty('tripStatus') || !req.body.hasOwnProperty('bikeMaintainanceScale') ) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	var json = [];
	json.bikeId = req.body.bikeId;
	json.bikerName = req.body.bikerName;
	json.bikerContactEmail = req.body.bikerContactEmail;
	json.bikerContactPhone = req.body.bikerContactPhone;
	json.pickUpPoint= req.body.pickUpPoint;
	json.dropOffPoint= req.body.dropOffPoint;
	json.tripStatus = req.body.tripStatus;
	json.bookingStartTimeHours = req.body.bookingStartTimeHours;
	json.bookingEndTimeMinutes = req.body.bookingEndTimeMinutes;
	json.bookingStartTimeHours = req.body.bookingStartTimeHours;
	json.bookingEndTimeMinutes = req.body.bookingEndTimeMinutes;
	json.bikeMaintainanceScale = req.body.bikeMaintainanceScale;	

	tripDB.insertTrip(function(err,result){
		if(!err){
			console.log("Dammage Reported.");

			bikeDB.findAllBikesNotInUse(function(err,results){
				if(!err){
					res.render('showMapsPlot',{'json':results.toArray()});
				}
				else{
					res.render('error');
				}
			});
		}
		else{
			console.log("Error: "+err);
		}
	});
}

exports.returnBike = function(req,res){
	if(!req.body.hasOwnProperty('bikeId') || !req.body.hasOwnProperty('bookingStartTimeHours') || !req.body.hasOwnProperty('bookingStartTimeMinutes') || !req.body.hasOwnProperty('bookingEndTimeHours') || !req.body.hasOwnProperty('bookingEndTimeMinutes') || !req.body.hasOwnProperty('pickUpPoint') || !req.body.hasOwnProperty('dropOffPoint') || !req.body.hasOwnProperty('bikerContactEmail') || !req.body.hasOwnProperty('bikerContactPhone') || !req.body.hasOwnProperty('bikerName') || !req.body.hasOwnProperty('tripStatus') || !req.body.hasOwnProperty('bikeMaintainanceScale') ) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	var json = [];
	json.bikeId = req.body.bikeId;
	json.bikerName = req.body.bikerName;
	json.bikerContactEmail = req.body.bikerContactEmail;
	json.bikerContactPhone = req.body.bikerContactPhone;
	json.pickUpPoint= req.body.pickUpPoint;
	json.dropOffPoint= req.body.dropOffPoint;
	json.tripStatus = req.body.tripStatus;
	json.bookingStartTimeHours = req.body.bookingStartTimeHours;
	json.bookingEndTimeMinutes = req.body.bookingEndTimeMinutes;
	json.bookingStartTimeHours = req.body.bookingStartTimeHours;
	json.bookingEndTimeMinutes = req.body.bookingEndTimeMinutes;
	json.bikeMaintainanceScale = req.body.bikeMaintainanceScale;	

	tripDB.updateTripStatus(json);
}


exports.viewAllMyRides = function(req,res){
	tripDB.findTripByBikerContactEmail(function(err,result){
		res.render('view_all_my_bike_rides',{'json':result.toArray()});
	});
}

exports.adminFunctions = function(req,res){
	res.render('priorityScales');
}

exports.adminFunctionsConfirmation = function(req,res){
	if(!req.body.hasOwnProperty('bikeLocationPremiumScale') || !req.body.hasOwnProperty('bikeInsuranceScale') || !req.body.hasOwnProperty('bikeCategoryScale')){

		var json = [];
		json.bikeId = req.body.bikeId;
		json.bikeLocationPremiumScale = req.body.bikeLocationPremiumScale;
		json.bikeInsuranceScale = req.body.bikeInsuranceScale;
		json.bikeCategoryScale = req.body.bikeCategoryScale;
		bikeDB.updateCategoryPriority(json);
		bikeDB.updateInsurancePriority(json);
		bikeDB.updateLocationPriority(json);
	}
	else{
		console.log("Insufficient Data.");
	}
}

