/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var bcrypt = require('bcrypt');


module.exports = {

  'new': function(req,res){
  	res.view('session/new');
  },

  create: function(req,res,next){

  	//check for email and password in params  sent via the form,
  	// if none redirect to sigin form

  	if(!req.param('email') || !req.param('password')){

  		var usernamePasswordRequiredError = [{name:'usernamePasswordRequired', message:'You must enter username and password.'}]

  		//Remember that err is the object being passed down (a.k.a flash.err) whose value is 
  		// another object with the key of usernamePasswordRequiredError

  		req.session.flash = {
  			err: usernamePasswordRequiredError
  		} 

  		res.redirect('/session/new');
  		return;
  	}


  	//Try to find the user by their email address
  	User.findOneByEmail(req.param('email')).exec(function(err,user){
  		if(err) return next(err);

  		//if no user is found
  		if(!user){
  			var noAccountError = [{name:'noAccount', message: 'The email ' + req.param('email')+' doesn\'t exist.'}]
  			req.session.flash = {
  				err: noAccountError
  			}
  			res.redirect('/session/new');
  			return;
  		}

  	// Compare the password from param to the encrpted password 
  	bcrypt.compare(req.param('password'), user.encryptedPassword, function foundUser(err,valid) {
  		if(err) return next(err);

  		//if the password from form doesn't match the password in database
  		if(!valid){
  			var usernamePasswordMismatchError = [{name:'usernamePasswordMismatch', message: 'Invalid username and password combination.'}]
  			req.session.flash = {
  				err: usernamePasswordMismatchError
  			}
  			res.redirect('/session/new');
  			return;
  		}

  		//Log user in
  		req.session.authenticated = true;
  		req.session.User = user;
      

      //If the user is also admin redirect to user list
      //This is used in conjuction with config/policies.js
      if(req.session.User.admin){
        //res.redirect('/user');
        res.redirect('/');
        return;
      }
      else{
  		//redirect to the user profile 
  		res.redirect('/');
  	  }
    });

  	});
  },
/**
ACCOUNT VERIFY
**/

verifyAccount : function (req, res) {
 var isVerified = req.param('isVerified');
 //var token = req.param('token');
 User.findOne({email: req.param('email')}, function (err, user) {
   if (err) {
      return res.serverError(error);
   }
   if(user){
    var id = user.id;
   // var token = token;
    var isVerified = isVerified;
    User.update(id,req.params.all(), function userUpdated(err){
      if(err) {
        req.session.flash = {
          err: err
        }
      }else{
       res.redirect('/user/show/'+user.id);
      }
      
    });
   }
 });   
},

/**
VIEW FOR FORGOT PASSWORD
**/

  'forgotPassword': function(req,res){
    res.view('user/forgotPassword');
  },



/**
  SEND PASSWORD RESET EMAIL
  **/
    sendResetEmail : function(req,res){
    var sendgrid_api_key = "";
    var sendgrid  = require('sendgrid')(sendgrid_api_key);
    var email = req.param('email');
    User.findOne({email: req.param('email')}, function (err, user) {
      if (err) {
            return res.serverError(error);
      }
      if(user){
        var id = user.id;
        var emailtoSend     = new sendgrid.Email({
          to:       email,
          from:     'info@truckaggregation.net',
          subject:  'Link for password reset',
          text:     "Please copy and paste the URL in your browser to reset your password " +':' +" localhost:1337/auth/resetPassword/"+email+'/'+id
        });
        sendgrid.send(emailtoSend, function(err, json) {
          if (err) { return console.error(err); }
          console.log(json);
          res.json ({
            result:true,
            message: json,
            Description:"A link for password reset is sent to your email address. Please, open your email and follow the password reset instructions."
          });
        });
      }
    }); 

  },

/**
PASSWORD RESET 
**/
passwordReset : function (req, res) {
 // get the user
 User.findOne({email: req.param('email')}, function (err, user) {
   if (err) {
      return res.serverError(error);
   }
   if(user){
    var id = user.id;
    var password = req.param('password');
    User.update(id,password, function userUpdated(err){
      if(err) {
        return res.json(401,{result:false, message:'cannot update user password'});
      }else{
        return res.json(200,{result:true,message:'successfully updated user Password.'});
      }
      
    });
   }
 });   
},


/**
CHANGE PASSWORD
**/
changePassword : function (req, res) {
 // get the user
 User.findOne({email: req.param('email')}, function (err, user) {
   if (err) {
      return res.serverError(error);
   }
   if(user){
    var id = user.id;
    var password = req.param('password');
    User.update(id,password, function userUpdated(err){
      if(err) {
        return res.json(401,{result:false, message:'cannot update user password'});
      }else{
        return res.json(200,{result:true,message:'successfully updated user Password.'});
      }
      
    });
   }
 });   
},

  //Logout ( Destroy) function

  destroy: function(req,res,next){

  	//wipe out the session (logout)
  	req.session.destroy();

  	//Redirect the browser to the signin form
  	res.redirect('/');
  },

  
};
