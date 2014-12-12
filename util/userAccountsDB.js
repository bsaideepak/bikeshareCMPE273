/**
 * Author: Sai
 */

var mongo = require("../util/MongoDBConnectionPool");
var dbc="j";
var collectionName = "userAccounts"; 

function newUser(callback,json){
	
	if(json.bikerContactEmail && json.bikerPassword){

		console.log("Email: "+ json.bikerContactEmail );
		console.log("Pass: "+ json.bikerPassword );

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);	
		
		dbc.insert({'bikerContactEmail':json.bikerContactEmail,'bikerPassword':json.bikerPassword, 'bikerName':json.bikerName,'bikerContactAddress':json.bikerContactAddress, 'bikerContactPhone':json.bikerContactPhone },function (err,result){
					
			if(err){
				console.log(err);
				return res.send('Error 400: Error Creating a new user.');
				//db.close();
			}
					
			else{
				var success = "New User Created.";
				console.log("New User Created.");
				callback(null,success);
				//db.close();
			}
		});
	}
	else{
		var fail = "Insufficient Data.";
		console.log("Insufficient Data.");
		callback(fail,null);
		//db.close();
	}
}

exports.newUser = newUser;


function changeUserPassword(callback,json){
	
	if(json.usebikerContactEmailrEmail && json.bikerPassword){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);	
		
		var success = 0;

		dbc.findAndModify({query: {'bikerContactEmail':json.bikerContactEmail,'bikerPassword':json.bikerCurrentPassword, 'bikerName':json.bikerName,'bikerContactAddress':json.bikerContactAddress, 'bikerContactPhone':json.bikerContactPhone }, update: {$set: {'bikerContactEmail':json.bikerContactEmail,'bikerPassword':json.bikerNewPassword, 'bikerContactName':json.bikerContactName,'bikerContactAddress':json.bikerContactAddress } },upsert: true},function (err,result){
					
			if(err){
				console.log(err);
				//db.close();
			}
					
			else{
				if(result!=null){
					console.log("User Password Updated.");
					callback(null,1);
					//db.close();	
				}
				else{
					callback(null, 0);
				}
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.changeUserPassword = changeUserPassword;

function removeUser(json){
	
	if(json.bikerContactEmail && json.bikerCurrentPassword){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);	
				
		dbc.remove({'bikerContactEmail':json.bikerContactEmail,'bikerPassword':json.bikerPassword },function (err,result){
					
			if(err){
				console.log(err);
				//db.close();
			}
					
			else{
				console.log("User Deleted.");
				//db.close();
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.removeUser = removeUser;


function userLogin(callback,json){
	
	if(json.bikerContactEmail && json.bikerPassword){

		var authenticated;

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);	
				
		dbc.find({'bikerContactEmail':json.bikerContactEmail,'bikerPassword':json.bikerPassword },function (err,result){
					
			if(err){
				authenticated = 0;
				console.log(err);
				return res.send('Error 400: Error in Login.');
				//db.close();
			}
					
			else{
							
				var bikerContactEmail;
				var bikerPassword;
							
				result.toArray(function(err,docs){
								
					if(!docs.length==0)
					{
						//console.log(docs);
						bikerContactEmail = docs[0].bikerContactEmail;
						bikerPassword = docs[0].bikerPassword;

						if(json.bikerContactEmail==bikerContactEmail && json.bikerPassword == bikerPassword)
						{
							authenticated = 1;
							console.log("User Authenticated");
							callback(null,authenticated);
						}
						else
						{
							authenticated = 0;
							console.log("User Not Authenticated");
							callback(null,authenticated);
						}
					}
					else{
						var authenticated = "User Does Not Exist.";
						console.log("ERROR.");
						callback(null,authenticated);
					}
				});
			}
		});
	}
	else{
		var authenticated = "Insufficient Data.";
		console.log("Insufficient Data.");
		callback(null,authenticated);
		//db.close();
	}
}

exports.userLogin = userLogin;



