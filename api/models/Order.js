/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		orderType:{type:'string',enum:['Fast','Econo']},
  		items:{type:'array',defaultsTo:[]},
  		size:{type:'string',enum:['Size1','Size2','Size3']},
  		amount : {type:'integer',defaultsTo:0}
  }
};

