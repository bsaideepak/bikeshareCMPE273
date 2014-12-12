/**
 * Author: Sai
 */

var mongo = require("../util/MongoDBConnectionPool");
var dbc="j";
var collectionName = "receipts";

function insertTransaction(json){
	
	if(json.tripId)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.insert({'tripId':json.tripId,'tripTotalTime':json.tripTotalTime,'tripTotalCost':json.tripTotalCost,'tripCostPerHr':json.tripCostPerHr, 'receiptId':json.receiptId},function (err,result){

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

exports.insertTransaction = insertTransaction;


function removeTransaction(json){

	if(json.tripId)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);

		dbc.remove({'tripId':json.tripId,'receiptId':json.receiptId},function (err,result){
						
			if(err){
				console.log(err);
				//	db.close();
			}

			else{
				console.log("Successfully Removed");
				//db.close();
			}
		});
	
	}
	else{
		console.log("Insufficient Data.");
		db.close();
	}
}

exports.removeTransaction = removeTransaction;

function findAllTransactions(callback){

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

exports.findAllTransactions = findAllTransactions;

function findAllTransactionsByTripId(callback,tripId){

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

exports.findAllTransactionsByTripId = findAllTransactionsByTripId;

