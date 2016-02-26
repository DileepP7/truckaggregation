/**
* Truck.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		truckModel:{type:'string'},
  		driverName:{type: 'string',model:'user'},
  		phoneNumber:{type:'string'},
  		rate:{type:'integer'},
  }
};

