module.exports = {
	 
  //show all orders
  index: function(req,res,next){

  	Order.find(function foundOrder(err,order){
  		if(err) return(err);

  		//pass array to the view
  		res.view({
  			order : order
  		});
  	});
  },

  new: function(req,res){
    res.view();
  },

  create: function(req,res,next){
    //create order with params sent from order/new.ejs

    Order.create(req.params.all(), function orderCreated(err,order){

      //if error
      if(err){
        console.log(err);
        req.session.flash = {
          err: err
        }

        //if error redirect to the add new order page
        return res.redirect('/order/new');
      }

      //If order create sucessfully, redeirect to the show acion
       res.json(order); //show json 

      //res.redirect('/user/show/'+user.id);
      

    });
  },

  // Display latest 3 orders  for homepage

  latestorder: function(req,res,next){
    Order.find().sort('createdAt DESC').exec(function(err, order) {

    // Error handling
    if (err) {
      return console.log(err);

    // Found multiple users!
    } else {
      //send order to homepage(static/index.ejs)
      //res.json(order);
      console.log(order.length);
      
      
      res.view('static/index',{order:order});
    }
  });
  },



  show: function (req,res) {

    var userId = req.param('id');

    Order.findById(userId, function foundorder(err,order) {
      if(err) return next(err);

      if(!order) return next();

      res.view({
        order: order
      });
    });
  }
};