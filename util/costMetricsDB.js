/**
 * Author: Sai
 */

var mongo = require("../util/MongoDBConnectionPool");
var dbc="j";
var collectionName = "CostMetrics";

function insertCategoryPriority(json){
	
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

		dbc.insert({'categoryPriority':json.categoryPriority,'percentage':json.percentage},function (err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			else{
				//db.close();
				console.log("Operation Successful.");
			}
		});

	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.insertCategoryPriority = insertCategoryPriority;


function insertLocationPriority(json){
	
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
		
		dbc.insert({'locationPriority':json.locationPriority,'percentage':json.percentage},function (err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			else{
				//db.close();
				console.log("Operation Successful.");
			}
		});
				
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.insertLocationPriority = insertLocationPriority;


function insertInsurancePriority(json){
	
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
		
		dbc.insert({'insurancePriority':json.categoryPriority,'percentage':json.percentage},function (err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			
			else{
				var status = "Successfully Inserted";
							
				//db.close();
				console.log("Operation Successful.");
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.insertInsurancePriority = insertInsurancePriority;


function insertTimePriority(json){
	
	if(json.bookingStartTime && json.bookingEndTime && json.bookingDay && json.percentage)
	{
		mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
		},collectionName);
		
		dbc.insert({'bookingStartTime':json.bookingStartTime,'bookingEndTime':json.bookingEndTime,'bookingDay':json.bookingDay,'percentage':json.percentage},function (err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			
			else{
				var status = "Successfully Inserted";
							
				//db.close();
				console.log("Operation Successful.");
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.insertTimePriority = insertTimePriority;


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
		
		dbc.findAndModify({query: {"categoryPriority": json.categoryPriority },update: { $set: { "percentage": json.percentage } }, upsert: true },function(err,result){

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
		
		dbc.findAndModify({query: {"insurancePriority": json.insurancePriority },update: { $set: { "percentage": json.percentage } }, upsert: true },function(err,result){

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
		
		dbc.findAndModify({query: {"locationPriority": json.locationPriority },update: { $set: { "percentage": json.percentage } }, upsert: true },function(err,result){

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


function updateTimePriority(json){

	if(json.bookingDay && json.bookingEndTime && json.bookingStartTime)
	{
		mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
		},collectionName);

		dbc.findAndModify({query: {"bookingDay": json.bookingDay, "bookingEndTime": json.bookingEndTime, "bookingStartTime": json.bookingStartTime },update: { $set: { "percentage": json.percentage } }, upsert: true },function(err,result){

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

exports.updateTimePriority = updateTimePriority;


function getLocationPriorityPercentage(callback,locationPriority){

	var percentage;
	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);

	dbc.find({'locationPriority': locationPriority }, function(err,result){
		
		if(err){
			console.log("");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		
		else{
			result.toArray(function(err,docs){
				
				if(!docs.length == 0){
					percentage = docs[0].percentage;
					callback(err,percentage);
				}
				//db.close();
			});
		}
	});
}

exports.getLocationPriorityPercentage = getLocationPriorityPercentage;


function getCategoryPriorityPercentage(callback,categoryPriority){

	var percentage;
	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);

	dbc.find({'categoryPriority': categoryPriority }, function(err,result){
		
		if(err){
			console.log("");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		
		else{
			result.toArray(function(err,docs){
				
				if(!docs.length == 0){
					percentage = docs[0].percentage;
					callback(err,percentage);
				}
				//db.close();
			});
		}
	});
}

exports.getCategoryPriorityPercentage = getCategoryPriorityPercentage;


function getInsurancePriorityPercentage(callback,insurancePriority){

	var percentage;
	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);

	dbc.find({'insurancePriority': insurancePriority }, function(err,result){
		
		if(err){
			console.log("");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		else{
			result.toArray(function(err,docs){
				
				if(!docs.length == 0){
					
					percentage = docs[0].percentage;
					callback(err,percentage);
				}
					//db.close();
			});			
		}
	});
}

exports.getInsurancePriorityPercentage = getInsurancePriorityPercentage;


function getTimePriorityPercentage(callback,json){

	var percentage;
	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);

	dbc.find({'bookingStartTime': json.bookingStartTime, 'bookingEndTime': json.bookingEndTime, 'bookingDay': json.bookingDay  }, function(err,result){
		
		if(err){
			console.log("");
			//db.close();
			callback(err,new Error("Error: "+ err));
		}
		else{
			result.toArray(function(err,docs){
				if(!docs.length == 0){
					percentage = docs[0].percentage;
					callback(err,percentage);
				}
				//db.close();
			});
		}
	});
}

exports.getTimePriorityPercentage = getTimePriorityPercentage;


function getCostPerHr(callback,json){

	//var percentage;
	var timeInputs = [];
	timeInputs.bookingDay = json.bookingDay;
	timeInputs.bookingStartTime = json.bookingStartTime;
	timeInputs.bookingEndTime = json.bookingEndTime;

	var percentages = [];
	

	getTimePriorityPercentage(function(err, percentageValue){
		if(!err){
			percentages.timePercentage = percentageValue;
		}
	},timeInputs);


	getCategoryPriorityPercentage(function(err,percentageValue){
		if(!err){
			percentages.categoryPercentage = percentageValue;
		}
	},json.categoryPriority);
	

	getLocationPriorityPercentage(function(err,percentageValue){
		if(!err){
			percentages.locationPercentage = percentageValue;
		}
	},json.locationPriority);


	getInsurancePriorityPercentage(function(err,percentageValue){
		if(!err){
			percentages.insurancePercentage = percentageValue;
		}
	},json.insurancePriority);

	var costPerHr = 5 + (5*percentages.timePercentage/100) + (5*percentages.insurancePercentage/100) + (5*percentages.categoryPercentage/100) + (5*percentages.locationPercentage/100);

	callback(null, costPerHr);
	
}
exports.getCostPerHr = getCostPerHr;









