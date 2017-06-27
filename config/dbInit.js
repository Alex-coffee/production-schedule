var menu = require('../app/models/menu');
var news = require('../app/models/news');
//var newsImage = require('../app/models/newsImage');

var init = function(sequelize){
    menu.prepare(sequelize);
    news.prepare(sequelize);
    //newsImage.prepare(sequelize);
}

module.exports = init;
