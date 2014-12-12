/**
 * Author: Sai
 */
var costMetricsDB = require("../util/costMetricsDB");
var bikeStationDB = require("../util/bikeStationDB");
var bikeDB = require("../util/bikeDB");
var receipt = require("../util/receiptsDB");

var mongo = require("../util/MongoDBConnectionPool");
var dbc="j";
var collectionName = "trip";

function insertTrip(callback,json){

	var d = new Date();
	var timeStamp = d.getTime();
		
	json.tripId = json.bikeId + timeStamp;


	if(json.tripId )
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
				var bikeCosts;
		var costOverheads = [];

		/*
		bikeDB.findBikeById(function(err,result){
			if(!err){
				result.toArray(function(err,docs){
					if(!docs.length == 0){

						costOverheads.bikeCategoryScale = docs[0].bikeCategoryScale;
						costOverheads.bikeInsuranceScale = docs[0].bikeInsuranceScale;
						costOverheads.bikeLocationPremiumScale = docs[0].bikeLocationPremiumScale;
					}
				});
			}
		},json.bikeId);


		costOverheads.bookingStartTime = json.bookingStartTime;
		costOverheads.bookingEndTime = json.bookingEndTime; 

		costMetricsDB.getCostPerHr(function(err,cost){
			if(!err){
				json.tripCostPerHr = cost;
			}
			else{
				console.log(err);
			}
		},costOverheads);

			*/


			json.tripCostPerHr = 1;

		dbc.insert({'tripId':json.tripId, 'startHours':json.startHours,'startMinutes':json.startMinutes,'endHours':json.endHours ,'endMinutes':json.endMinutes , 'dropLocation':json.dropLocation ,'tripStatus':1, 'tripCostPerHr': json.tripCostPerHr},function (err,result){

			if(err){
				console.log(err);
				var er = "error";
				callback(er,null);
				//db.close();
			}
			
			else{

				bikeDB.updateAvailableUpto(function(error,updated){

					if(!error){
						console.log("BikeDB Time Updated.");
						var status = "Successfully Inserted";
						//db.close();
						console.log("Operation Successful.");
						callback(null,status);
					}
					else{
						console.log("Error updating AvailableStartTime for bikeId.");
						callback(error,null);
					}

				},json.bikeId, json.endHours,json.endMinutes);


				
			}
		});
			}
		},collectionName);

		
	}
	else{
		console.log("Insufficient Data.");
		var status = "Insufficient Data.";
		callback(status,null);
		//db.close();
	}
}

exports.insertTrip = insertTrip;


function updateTripStatus(json){

	if(json.tripStatus && json.tripId)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);	

		dbc.findAndModify({query: {'tripId': json.tripId },update: { $set: { 'tripStatus':json.tripStatus} }, upsert: true },function(err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			
			else{
				var transactionDetails = [];
				transactionDetails.tripId = json.tripId;
				transactionDetails.tripCostPerHr = tripCostPerHr;

				var endTimeHours = json.bookingEndTimeHours - json.bookingEndTimeHours;
				var endTimeMinutes = json.bookingEndTimeMinutes - json.bookingEndTimeMinutes;
				var totalTimeInMinutes = (endTimeHours*60) + endTimeMinutes;

				transactionDetails.tripTotalTime = totalTimeInMinutes;
				transactionDetails.tripTotalCost = (json.costPerHr * totalTimeInMinutes/60);


				receipt.insertTransaction(transactionDetails);
				
				console.log("Successfully Updated.");
				//db.close();
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.updateTripStatus = updateTripStatus;	


function removeTrip(json){

	if(json.tripId && json.timeRequested && json.bookingStartTimeHours && json.bookingStartTimeMinutes && json.bookingEndTimeHours && json.bookingDay && json.pickUpPoint && json.dropOffPoint && json.userEmail && json.bikeId && json.bikeName && json.tripStatus)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.remove({'tripId':json.tripId},function (err,result){
						
			if(err){
				console.log(err);
				//db.close();
			}

			else{
				console.log("Successfully Removed");
				//db.close();
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.removeTrip = removeTrip;

function findAllTrips(callback){

	mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
	},collectionName);
	
	dbc.find(function(err,result){
		
		if(err){
			console.log("No order exists.");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		
		else{
			//db.close();
			callback(err,result);
		}
	});
}

exports.findAllTrips = findAllTrips;

function findTripByTripId(callback,tripId){

	mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
	},collectionName);
	
	dbc.find({"tripId":tripId},function(err,result){
						
		if(err){
			console.log("No order exists.");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		else{
			//db.close();
			callback(err,result);
		}
	});
}
exports.findTripByTripId = findTripByTripId;


function findTripByBikerContactEmailAndStatus(callback,bikerContactEmail){

	mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
	},collectionName);
	
	dbc.find({"bikerContactEmail":bikerContactEmail, 'tripStatus': 1},function(err,result){
						
		if(err){
			console.log("No order exists.");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		else{
			//db.close();
			callback(err,result);
		}
	});
}

exports.findTripByBikerContactEmailAndStatus = findTripByBikerContactEmailAndStatus;



function extendTripTime(json){

	if(json.tripStatus && json.tripId)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);	

		dbc.findAndModify({query: {'tripId': json.tripId },update: { $set: { 'bookingEndTimeHours':json.extendedBookingEndTimeHours, 'bookingEndTimeMinutes':json.extendedBookingEndTimeMinutes} }, upsert: true },function(err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			
			else{
				console.log("Time Extended.");
			}
		});
	}
	else{
		console.log("Insufficient Data");
	}
}


exports.extendTripTime = extendTripTime;

function updateMaintainanceScale(json){

	if(json.bikeMaintainanceScale && json.percentage)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.findAndModify({query: {"bikeMaintainanceScale": json.bikeMaintainanceScale },update: { $set: { "percentage": json.percentage } }, upsert: true },function(err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			else{
				console.log("Successfully Updated.");
				//db.close();
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.updateMaintainanceScale = updateMaintainanceScale;




//Update bikeStation resourceCount & emptySlots based on dropOffPoint & bookingEndTime


