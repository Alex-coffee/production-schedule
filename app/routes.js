var Menu = require('./models/menu');
var News = require('./models/news');
var ContactEmailUtil = require('./utils/ContactEmail');

var newsImagePath = './public/website/images/news/';
// uploder ================================
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, newsImagePath)
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
})

var upload = multer({ storage: storage })
var type = upload.fields([
	{ name: 'file[]', maxCount: 10 },
]);

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
}

//fs ====================================
var fs = require('fs');

module.exports = function(app) {
	app.use(type);
	app.use(allowCrossDomain);

	// server routes ===========================================================
	// handle things like api calls
	app.get('/api/menu', function(req, res) {

		var query = {
			where: {
				level: 1
			},
			include: [{
				model: Menu.getModel(),
				as: 'submenus'
			}]
		}

		Menu.find(query).then(function(menus){
			res.json(menus);
		});
	});

	app.get('/api/industryMenu', function(req, res) {

		var query = {
			where: {
				category: req.query.category
			},
			include: [{
				model: Menu.getModel(),
				as: 'submenus'
			}]
		}

		Menu.find(query).then(function(menus){
			res.json(menus);
		});
	});

	// ================ website backend ======================
	app.post('/api/photos/upload', type, function (req, res, next) {
		res.send(200);
	});

	app.get('/api/newsPhotos/', function(req, res){
		fs.readdir(newsImagePath, function(err, items) {
			//console.log(items);
			res.json(items);
		});
	})

	app.post('/api/deletePhoto/', function(req, res, next){
		return fs.unlink(newsImagePath + req.body.id, function(){
			res.json({success: true});
		});
	})

	app.post('/api/news/delete/', function(req, res, next){
		var query = {}

		if(req.body.id != undefined){
			query.where = {
				id: req.body.id
			}

			News.deleteNews(query).then(function(news){
				res.json(news);
			});
		}
	})

	app.get('/api/news', function(req, res){

		var query = {
			where: {
				isDeleted: false
			},
			include: [{
				model: News.getNewsImageModel(),
				as: 'relevantPhotos'
			}]
		}

		if(req.query.id != undefined){
			query.where = {
				id: req.query.id,
				isDeleted: false
			}

			News.find(query).then(function(result){
				var news = result[0].dataValues;
				var buf = new Buffer(news.content);
				news.content = buf.toString("utf8");
				res.json(news);
			});
		}else{
			query.attributes = { exclude: ['content']}
			News.find(query).then(function(result){
				res.json(result);
			});
		}
	})

	app.post('/api/news', function(req, res){
		News.save(req.body).then(function(result){
			if(result.dataValues){
				var news = result.dataValues;
				var buf = new Buffer(news.content);
				news.content = buf.toString("utf8");
				res.json(news);
			}else{
				res.json(result);
			}
		});
	})

	app.post('/api/newsImage/delete/', function(req, res, next){

		var query = {}

		if(req.body.id != undefined){
			query.where = {
				id: req.body.id
			}

			News.deleteRelevantImage(query).then(function(news){
				res.json(news);
			});
		}
	})


	//app.get('/api/testData/', function(req, res, next){
	//	var JsonObj=JSON.parse(fs.readFileSync('./public/demo/data/test.json'));
	//	res.json(JsonObj);
	//})

	//send contact-us email
	app.post('/api/sendContactEmail', function(req, res){
		ContactEmailUtil.sendMail(req.body.mailObj);
	})


	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/demo/index.html');
	});

};