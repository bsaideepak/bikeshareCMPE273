/**
 * Author: Sai
 */

var mongo = require("../util/MongoDBConnectionPool");
var dbc="j";
var collectionName = "bikeStation";

function insertBikeStation(json){
	
	if(json.latitude && json.longitude && json.resourceCount && json.stationName){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
					
		dbc.insert({'lat':json.latitude,'long':json.longitude,'resourceCount':json.resourceCount,'stationName':json.stationName, 'stationId':json.stationId,'locationPriority': json.locationPriority},function (err,result){
					
			if(err){
				console.log(err);
				//db.close();
			}
					
			else{
				console.log("Operation Successful.");
				//db.close();
			}
		});
	
	}
	
	else{
		console.log("Insufficient Data.");
	}
}


exports.insertBikeStation = insertBikeStation;



function updateBikeStationResources(json){

	if(json.latitude && json.longitude && json.resourceCount && json.stationName && json.stationId){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
		
		dbc.findAndModify({query: {"stationId": json.stationId },update: { $set: { "resourceCount": json.resourceCount} }, upsert: true },function(err,result){

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

exports.updateBikeStationResources = updateBikeStationResources;	



function updateBikeStationPriority(json){

	if(json.latitude && json.longitude && json.resourceCount && json.stationName && json.stationId){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.findAndModify({query: {"stationId": json.stationId },update: { $set: { "locationPriority": json.locationPriority } }, upsert: true },function(err,result){

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

exports.updateBikeStationPriority = updateBikeStationPriority;	


function removeBikeStation(bikeStation){

	if(bikeStation){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
					
		dbc.remove({'lat':json.latitude,'long':json.longitude,'resourceCount':json.resourceCount,'stationName':json.stationName, 'stationId':json.stationId, 'locationPriority': json.locationPriority},function (err,result){
			
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

exports.removeBikeStation = removeBikeStation;

function findAllBikeStations(callback){

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
			console.log("");
			//db.close();
		}
		else{
			//db.close();
			callback(err,result);
		}
	});
}
exports.findAllBikeStations = findAllBikeStations;


function findLocationPriorityByBikeStationId(callback,stationId){

	var locPriority;
	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);

	dbc.find({'stationId': stationId }, function(err,result){
		if(err){
			console.log("");
			//db.close();
			callback(err,locationPriority);
		}
		else{
			result.toArray(function(err,docs){
				if(!docs.length == 0){
					locPriority = docs[0].locationPriority;
					callback(err,locationPriority);

				}
				//db.close();
			});					
		}
	});
}

exports.findLocationPriorityByBikeStationId = findLocationPriorityByBikeStationId;


function decreaseResourceCount(stationId){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);

	dbc.findAndModify({query: {"stationId": stationId },update: { $inc: { "resourceCount": 1 } }, upsert: true },function(err,result){

		if(err){
			console.log("Error While Updating.");
			common.closeConnection(db);
		}
		else{
			console.log("Recorded Updated.");
			common.closeConnection(db);
		}
	});
}

exports.decreaseResourceCount = decreaseResourceCount;


function returnBike(stationId){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);

	dbc.findAndModify({query: {"stationId": stationId },update: { $inc: { "resourceCount": -1 , "emptySlots": 1} }, upsert: true },function(err,result){

		if(err){
			console.log("Error WHile Updating.");
			common.closeConnection(db);
		}
		else{
			console.log("Recorded Updated.");
			common.closeConnection(db);
		}
	});
}

exports.returnBike = returnBike;

//update resourceCount and emptySlots.

//Function to find Nearest Lovations of bikeStations.

