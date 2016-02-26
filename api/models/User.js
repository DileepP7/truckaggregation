/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

        userType : {type:'string',enum:['Visitor','Standard User','Corporate User','Agent','Truck Owner','Via e-truck Admin'],required:true,defaultsTo:'Visitor'},
        firstName : {type:'string',required:true},
        middleName : {type:'string'},
        lastName : {type:'string',required:true},
        phone1 : {type:'number'},
        phone2 : {type:'number'},
        email : {type: 'string',email: true,unique:true},
        profilePhoto : {defaultsTo : '',type : 'string'},
        gender :  {type:'string',required:false,enum:['M','F']},
        birthday : {type:'date',required:false},
        language : {type:'string'},
        contactAddresses : {
          BillingAddr:{type:'string'},
          PickupAddr: {type:'string'},
          DeliveryAddr: {type:'string'},
        },
        companyName:{type:'string'},
        companyPhone:{type:'string'},
        paymentMethod:{type:'string',enum:['paypal','creditCard']},
        companyDetails : {
          companyName:{type:'string'},
          PrimaryContactInfo:{type:'number',format:'111111111'},
        },
        iDProof : {
          IdNo : {type:'number'},
          IdProofScannedCopy : {type:'string'},
        },
        encryptedPassword : { type:'string'},
        isVerified : {type:'boolean',defaultsTo:'false'},

  	
  	//hide parameter to display in JSON
  	toJSON: function(){
  		var obj = this.toObject();
  		delete obj.password;
  		delete obj.confirmation;
  		delete obj.encryptedPassword;
  		delete obj._csrf;
  		return obj;
  	 }
    
  },



  beforeValidation: function(values,next){
    console.log(values);
    if(typeof values.admin !== 'undefined'){
      if(values.admin === 'unchecked'){
        values.admin = false;
      }else if(values.admin[1] === 'on'){
        values.admin = true;
      }
    }
    next();
  },

  beforeCreate: function(values,next){

    //This checks to make sure the password and password confirmation match before creating record
    if(!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match the password confirmation"]});

    }

    require('bcrypt').hash(values.password,10, function passwordEncrypted(err,encryptedPassword) {
      if(err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });


  }

};
