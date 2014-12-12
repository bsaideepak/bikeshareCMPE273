/**
 * Author: Sai
 */

var mongo = require("../util/MongoDBConnectionPool");
var dbc="j";
var collectionName = "bikeDB";

function insertBike(callback,json){
	
	if(json.bikeId && json.bikeName){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.insert({'bikeId':json.bikeId,'bikeName':json.bikeName, 'bikeCurrentLatitide': json.bikeCurrentLatitude, 'bikeCurrentLongitude': json.bikeCurrentLongitude, 'bikeCategoryScale':json.bikeCategoryScale, 'bikeAdvancedBookingFlag': json.bikeAdvancedBookingFlag, 'bikeInsuranceScale':json.bikeInsuranceScale, 'bikeMaintainanceScale':json.bikeMaintainanceScale, 'bikeLocationPremiumScale': json.bikeLocationPremiumScale, 'bikeOwnerContact': json.bikeOwnerContact, 'bikeOwnerName': json.bikeOwnerName, 'bikeInUseFlag': json.bikeInUseFlag, 'bikeAvailableFromHours':json.bikeAvailableFromHours, 'bikeAvailableFromMinutes':json.bikeAvailableFromMinutes, 'bikeAvailableUptoHours': json.bikeAvailableUptoHours, 'bikeAvailableUptoMinutes': json.bikeAvailableUptoMinutes},function (err,result){
					
			if(err){
				console.log(err);
				callback(err,null);
				//db.close();
			}
					
			else{
				var status = 1;
				console.log("Operation Successful.");
				callback(null,status);
				//db.close();
			}
		}); 
	}
	else{
		console.log("Incomplete Data.");
	}
}

exports.insertBike = insertBike;


function updateBikeInfo(json){

	if(json.bikeId && json.bikeName){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
				
		dbc.findAndModify({query: {"bikeId": json.bikeId },update: { $set: { 'bikeCurrentLatitide':json.bikeCurrentLatitide,'bikeCurrentLongitude':json.bikeCurrentLongitude, 'bikeAdvancedBookingFlag':json.bikeAdvancedBookingFlag, 'bikeLocationName': json.bikeLocationName } }, upsert: true },function(err,result){

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

exports.updateBikeInfo = updateBikeInfo;	

function updateBikeInUseFlag(json){

	if(json.bikeId){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
				
		dbc.findAndModify({query: {"bikeId": json.bikeId },update: { $set: { 'bikeCurrentLatitide':json.bikeCurrentLatitide,'bikeCurrentLongitude':json.bikeCurrentLongitude, 'bikeInUseFlag': json.bikeInUseFlag} }, upsert: true },function(err,result){

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

exports.updateBikeInUseFlag = updateBikeInUseFlag;	



function removeBike(json){

	if(json.bikeId && json.bikeName){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.remove({'bikeId':json.bikeId},function (err,result){
						
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

exports.removeBike = removeBike;

function findAllBikes(callback){

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
			callback(err,result);
			//db.close();
		}
	});
}

exports.findAllBikes = findAllBikes;

function findAllBikesByCurrentStationId(callback, bikeLocationName){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);
	
	dbc.find({'bikeLocationName':bikeLocationName},function(err,result){

		if(err){
			console.log("No order exists.");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		else{
			callback(err,result);
			//db.close();
		}
	});
}


exports.findAllBikesByCurrentStationId = findAllBikesByCurrentStationId;


function findAllBikesNotInUse(callback){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;

			dbc.find({'bikeInUseFlag': 0},function(err,result){

				if(err){
					console.log("No order exists.");
					//db.close();
					var errorMessage = "db error";
					callback(errorMessage,null);
				}
				
				else{
					console.log("Results Success.");
					callback(null,result);
					//db.close();
				}
			});
		}

	},collectionName);
}


exports.findAllBikesNotInUse = findAllBikesNotInUse;


function updateAvailableUpto(callback,bikeId,endTimeHours,endTimeMinutes){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
			var status = "Error: ";
			callback(status,null);
		}
		else{
			dbc = coll;

			dbc.findAndModify({'bikeId': bikeId},[['_id','asc']],{$set: {"bikeAvailableFromHours":endTimeHours, "bikeAvailableFromMinutes":endTimeMinutes }}, function(err,result){

				if(err){
					console.log("Error Updating flag.");
					var status = "Error Updating flag.";
					callback(null,status);
				}
				else{
					console.log("No Error Updating.");
					var status = "No Error Updating.";
					callback(null,status);
				}
			});
		}
	},collectionName);
}

exports.updateAvailableUpto = updateAvailableUpto;

function findBikeById(callback, bikeId){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
			callback();
		}
		else{
			dbc = coll;

			dbc.find({'bikeId':bikeId},function(err,result){

				if(err){
					console.log("No bike exists.");
					var status = "No bike exists.";
					//db.close();
					callback(status,null);
				}
		
				else{

					result.toArray(function(error,docs){
						if(error){
							var e = "Error With Callback.";
							callback(e,null);
						}
						if(docs.length!=0){
							callback(null,docs);
						}
						else{
							console.log("No results fetched.");
							callback(null,docs);
						}
						
					});
				}
			});
		}
	},collectionName);
}

exports.findBikeById = findBikeById;


function updateCategoryPriority(json){

	if(json.categoryPriority && json.percentage)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
		
		dbc.findAndModify({query: {'bikeId':json.bikeId },update: { $set: { "bikeCategoryScale": json.bikeCategoryScale,"percentage": json.percentage } }, upsert: true },function(err,result){

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

exports.updateCategoryPriority = updateCategoryPriority;


function updateInsurancePriority(json){

	if(json.insurancePriority && json.percentage)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
		
		dbc.findAndModify({query: {'bikeId':json.bikeId },update: { $set: { "bikeInsuranceScale": json.bikeInsuranceScale ,"percentage": json.percentage } }, upsert: true },function(err,result){

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

exports.updateInsurancePriority = updateInsurancePriority;



function updateLocationPriority(json){

	if(json.locationPriority && json.percentage)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.findAndModify({query: {'bikeId':json.bikeId },update: { $set: { "bikeLocationPremiumScale": json.bikeLocationPremiumScale,"percentage": json.percentage } }, upsert: true },function(err,result){

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

exports.updateLocationPriority = updateLocationPriority;



