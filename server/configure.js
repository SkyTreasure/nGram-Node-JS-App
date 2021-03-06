var path=require('path'),
	routes=require('./routes'),
	exphbs=require('express-handlebars'),
	express=require('express'),
	bodyParser=require('body-parser'),
	cookieParser=require('cookie-parser'),
	morgan=require('morgan'),
	methodOverride=require('method-override'),
	moment=require('moment'),
	multer = require('multer'),
	

	errorHandler=require('errorhandler');

module.exports=	function(app){
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({'extended':true}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser('skytreasure'));
	routes(app);//moving the routes to routes folder.
	app.use('/public/', express.static(path.join(__dirname,  
           '../public')));
	


	//upload=multer.diskStorat({ dest: path.join(__dirname,'../public/upload/temp')}),

	var storage = multer.diskStorage({
  		destination: "../public/upload/temp",
		filename: function (req, file, cb) {
		    cb(null, file.fieldname + '-' + Date.now())
		  }
	});

	var upload = multer({ storage: storage });

	app.use(upload.single('img'));
 

	if ('development' === app.get('env')) {
	   app.use(errorHandler());
	}

	app.engine('handlebars', exphbs.create({
	    defaultLayout: 'main',
	    layoutsDir: app.get('views') + '/layouts',
	    partialsDir: [app.get('views') + '/partials'],
	    helpers:{
	    	timeago: function(timestamp){
	    		return moment(timestamp).startOf('minute').fromNow();
	    	}
	    }
	}).engine);
	app.set('view engine', 'handlebars');
    return app;
};