/**
 * Author: Sai
 */

var bikeDB = require("../util/bikeDB");
var costMetricsDB = require("../util/costMetricsDB");
var bikeStationDB = require("../util/bikeStationDB");

var receipt = require("./util/receipt");

var mongo = require("../util/MongoDBConnectionPool");
var dbc="j";
var collectionName = "advancedBookingDB";

function insertAdvancedTrip(callback,json){
	
	if(json.tripId && json.bookingStartTimeHours && json.bookingStartTimeMinutes && json.bookingEndTimeHours && json.bookingEndMinutes && json.bookingDay && json.pickUpPoint && json.dropOffPoint && json.bikerContactEmail && json.bikerContactPhone && json.bikerContactAddress && json.bikeId && json.bikeName && json.tripStatus)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);	

		var d = new Date();
		var timeStamp = d.getTime();
		
		json.tripId = json.bikeId + timeStamp + json.totalHrsUsed; 

		var bikeCosts;
		var costOverheads = [];

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
				json.costPerHr = cost;
			}
			else{
				console.log(err);
			}
		}costOverheads);

		dbc.insert({'tripId':json.tripId, 'bookingStartTimeHours':json.bookingStartTimeHours,'bookingStartTimeMinutes':json.bookingStartTimeMinutes,'bookingEndTimeHours':json.bookingEndTimeHours ,'bookingEndTimeMinutes':json.bookingEndTimeMinutes ,'bookingDay':json.bookingDay, 'pickUpPoint':json.pickUpPoint ,'dropOffPoint':json.dropOffPoint ,'bikerContactEmail':json.bikerContactEmail ,'bikeId':json.bikeId ,'bikeName':json.bikeName ,'tripStatus':json.tripStatus, 'tripCostPerHr': json.costPerHr},function (err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			
			else{
				var status = "Successfully Inserted";
				//db.close();
				console.log("Operation Successful.");
				callback(err,status);
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.insertAdvancedTrip = insertAdvancedTrip;


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

function findAllTripsWithBikeId(callback,bikeId){

	mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
	},collectionName);
	
	dbc.find({'bikeId':bikeId},function(err,result){
		
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

exports.findAllTripsWithBikeId = findAllTripsWithBikeId;

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


//Update bikeStation resourceCount & emptySlots based on dropOffPoint & bookingEndTime


