/**
 * TruckController
 *
 * @description :: Server-side logic for managing trucks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  'new' : function (req,res){
    res.view();
    
  },
	/**
	ADDING A TRUCK TO THE PROFILE
	**/
	addTruck : function(req, res){
		var truckModel = req.param('truckModel');
		var phoneNumber = req.param('phoneNumber') || 1111111111;
		var phone = req.param('phone') || 1111111111;
		var creatorId = req.param('creatorId');
		var rate=req.param('rate') || 0;
		var  truckObj = {
			truckModel:truckModel,
			phoneNumber:phoneNumber,
			creatorId:creatorId,
			rate:rate
		} 
		Truck.create(truckObj, function truckCreated(err, truck){
			if(err){
				return err;
			}
		if(truck){
        var creatorId = truck.creatorId;
        User.findOne(creatorId).then(function(user){
          console.log(user);
          var creatorId = user.id;
          var creatorName = user.firstName+' '+user.lastName;
          var profilePhoto = user.profilePhoto || '';
          var creatorDetails={
            id:creatorId,
            name:creatorName,
            profilePhoto:profilePhoto
          };
          truck.creatorId=creatorDetails; 
          return res.json(200,{result:true,Objects : truck});
        });
        }
       });	
	},

/**
UPDATING TRUCK INFO
**/
editTruck: function(req,res,next){

    //Find the truck by id 
    Truck.findOne(req.param('id'),function foundTruck(err,truck){
      if(err) return next(err);
      if(!truck) return next();

      res.view({
        truck:truck
      });
    });
  },

  //update the value from edit form
  updateTruck: function(req,res,next){
    Truck.update(req.param('id'),req.params.all(), function truckUpdated(err){
      if(err) {
        return res.redirect('/truck/edit/'+req.param('id'));
      }

      res.redirect('/truck/show/'+req.param('id'));
    });
  },

	patchTruck : function(req,res,next){
    	 var patchObj = req.params.all();
		Truck.update(req.param('id'),patchObj, function truckUpdated(err){
			if(err) {
  		 	return res.json(400,{result:false, message:'cannot update data.'});
  		}
  		return res.json(200,{result:true,message:'successfully updated truck info.'});
		})

    },

/**
DELETING A TRUCK FROM PROFILE
**/
	deleteTruck : function(req, res, next){
    Truck.findOne(req.param('id'), function foundTruck(err,data){
      if(err) return next(err);
      if(!data) return next('Truck not found');
      Truck.destroy(req.param('id'), function truckDestroyed(err){
        if(err) return next(err);
      });
      res.json(200,{result:true,message:'Deletion successful'});
    });
  },  

/**
GET ALL TRUCKS INFORMATION
**/
  getAllTrucks: function(req,res){
  	Truck.find().then(function(trucks){
  		if(trucks){
        Truck.count(function(err,num){
                if(err){
                  return console.log(err);
                }
                console.log(num);
                res.json(200,{result:true,totalCount:num,objects:trucks});
              })
  			
  		}
  		else{
  			res.json(401,{result:false,message:'cannot get trucks data'});
  		}
  	},res.sendFailureResponse);
  }, 


/**
GET SINGLE TRUCK INFORMATION BY ITS ID
**/
  getTruckInfo: function(req,res){
        Truck.findOne(req.params.id)
          .then(function(truck){
            console.log(truck);
            if(truck){
            res.json({result:true,object:truck});
            }
            else{
              res.json({result:false,message:'Truck not found'});
            }
          },res.sendFailureResponse);
    },


/**
FIND TRUCK BY OWNER ID
**/
    getTruckByCreatorId : function(req, res){
	  var creatorId = req.param('creatorId');
	   var creatorDetails;
	   Truck.findOne(creatorId).then(function(user){
	          if(user){
	                var creatorId = user.id;
	                var creatorName = user.firstName+' '+user.lastName;
	                var profilePhoto = user.profilePhoto;
	                creatorDetails={
	                  id:creatorId,
	                  name:creatorName,
	                  profilePhoto:profilePhoto
	                };
	              console.log(creatorDetails);
	              Truck.find({creatorId:creatorId}).then(function(data){
	                if(data){
	                  for(i=0;i<data.length;i++){
	                    var creatorId=creatorDetails;
	                    data[i].creatorId=creatorId;
	                  }
	                  res.json(200,{result:true,objects:data});
	                }
	                else{
	                  res.json({result:false,message:'cannot get users data having creator id'}); 
	                }

	              },res.sendFailureResponse);

	          } else if(!user){
				    {
				        res.json({result:false,message:'cannot get users data having creator id'}); 
				    }

	        }
	    
	    });
  }, 

  
  
	
	
};

