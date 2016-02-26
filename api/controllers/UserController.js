/**
 * UserController
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
var passport = require('passport');

module.exports = {
    

  'new' : function (req,res){
  	res.view();
  	
  },


  create: function (req,res,next) {
  	//create user with params sent from
  	//the signup form i.e new.ejs

  	User.create(req.params.all(), function userCreated(err,user){

  		//if error
  		if(err){
  			req.session.flash = {
  				err: err
  			}

  			//if error redirect to the signup page
  			return res.redirect('/user/new');
  		}
      req.session.authenticated = true;
      req.session.User = user;
      if(req.session.User){
        req.session.User = user;

        //Log user in
        
        var sendgrid_api_key = "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";
        var sendgrid  = require('sendgrid')(sendgrid_api_key);
        var myEmail = user.email;
        var fullName =user.firstName+' '+user.lastName;
        var email     = new sendgrid.Email({
            to:       myEmail,
            from:     'info@truckaggregation.org',
            subject:  'Registration Email',
            text:     'Dear'+' ' +fullName+", You have been successfully signed up with the email "+myEmail+". Thank you for registering with us. Please copy and paste the URL in your browser to verify your Account " +':' +" localhost:1337/session/verifyAccount/"+myEmail+"/"+true
          });
          sendgrid.send(email, function(err, json) {
            if (err) { return console.error(err); }
            console.log(json);

          });

    		//If user create sucessfully, redeirect to the show acion
    		// res.json(user); //show json 

    		res.redirect('/user/show/'+user.id);
  		}

  	});


  },

  //show user details
  show: function(req,res,next){

    if(!req.param('id')){
      id = req.session.User.id;

      User.findOne(id).exec(function(err, user){
          if(err) return res.serverError();
          
           //res.json(user);
           res.view({user : user});
        });
    }
    else{
      id = req.param('id');

      User.findOne(id).exec(function(err, user){
          if(err) return res.serverError();
          
           //res.json(user);
           res.view({
             user: user 
            });
        });
    }
  	
      

     
  		/*res.view({
  			user: user
  		});*/
  },

  //show all users
  index: function(req,res,next){

  	// console.log(new Date());
  	// console.log(req.session.authenticated);

  	//Get an array of all users in the user collection
  	User.find(function foundUser(err,user){
  		if(err) return(err);

  		//pass array to the view
  		res.view({
  			user : user
  		});
  	});
  },

  //edit action 
  edit: function(req,res,next){

  	//Find the user by id 
  	User.findOne(req.param('id'),function foundUser(err,user){
  		if(err) return next(err);
  		if(!user) return next();

  		res.view({
  			user:user
  		});
  	});
  },

  //update the value from edit form
  update: function(req,res,next){
  	User.update(req.param('id'),req.params.all(), function userUpdated(err){
  		if(err) {
  			return res.redirect('/user/edit/'+req.param('id'));
  		}

  		res.redirect('/user/show/'+req.param('id'));
  	});
  },


/**
 * UPLOAD PROFILE PHOTO FOR CURRENTLY LOGGED-IN USER
 **/
uploadProfilePhoto: function (req, res) {

  req.file('profilePhoto').upload({
    // don't allow the total upload size to exceed ~10MB
    maxBytes: 10000000
  },function whenDone(err, uploadedFiles) {
    if (err) {
      return res.negotiate(err);
    }

    // If no files were uploaded, respond with an error.
    if (uploadedFiles.length === 0){
      return res.badRequest('No file was uploaded');
    }
    // Save the "fd" and the url where the avatar for a user can be accessed
    User.update(req.session.User.id, {

      // Generate a unique URL where the avatar can be downloaded.
     // profilePhoto: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), req.session.User.id),

      // Grab the first file and use it's `fd` (file descriptor)
      profilePhoto: uploadedFiles[0].fd
    })
    .exec(function (err){
      if (err) return res.negotiate(err);
      res.redirect('/user/show/'+req.session.User.id);
    });
  });
},

/*
avatar: function (req, res){
  req.validate({
    id: 'string'
  });

  User.findOne(req.session.User.id).exec(function (err, user){
    if (err) return res.negotiate(err);
    if (!user) return res.notFound();

    // User has no avatar image uploaded.
    // (should have never have hit this endpoint and used the default image)
    if (!user.profilePhoto) {
      return res.notFound();
    }

    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk;

    // Stream the file down
    fileAdapter.read(user.profilePhoto)
    .on('error', function (err){
      return res.serverError(err);
    })
    .pipe(res);
  });
},  */

  /**
  DELETING USER FROM DATABASE
  **/
  destroy: function(req,res,next){

  	User.findOne(req.param('id'), function foundUser(err,user){

  		if(err) return next(err);

  		if(!user) return next('User doesn\'t exists.');

  		User.destroy(req.param('id'), function userDestroyed(err){
  			if(err) return next(err);
  		});

  		res.redirect('/user');

  	});
  },


  'login': function (req, res) {
    res.view();
  },
  'accountSetting':function(req,res){
    res.view();
  },
  'addDriver':function(req,res){
    res.view();
  },

  'dashboard': function (req, res) {
    res.view();
  },

  logout: function (req, res){
    req.session.User = null;
    console.log("You have logged out");
    req.session.flash = 'You have logged out';
    res.view('user/login');
  },







};
