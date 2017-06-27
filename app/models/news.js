var Sequelize = require('sequelize');
var News;
var NewsImage;

module.exports = {
    prepare: function(sequelize){
        News = sequelize.define('news', {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            newsDate: { type: Sequelize.DATE},
            title: { type: Sequelize.STRING, allowNull: false},
            keywords: { type: Sequelize.STRING},
            description: { type: Sequelize.STRING},
            summary: { type: Sequelize.STRING},
            mainPhoto: { type: Sequelize.STRING},
            content: { type: Sequelize.BLOB('medium')},
            isDeleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
        });

        NewsImage = sequelize.define('newsImage', {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            path: { type: Sequelize.STRING, allowNull: false},
            description: { type: Sequelize.STRING},
            isDeleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
        });

        News.hasMany(NewsImage, {as: 'relevantPhotos'})
        NewsImage.belongsTo(News);

        News.sync();
        NewsImage.sync();
        //News.sync({force:true});
    },
    getModel: function(){
        return News;
    },
    getNewsImageModel: function(){
        return NewsImage;
    },
    find: function(query){
        return News.findAll(query);
    },
    deleteNews: function(query){
        //return News.destroy(query);
        return News.update({isDeleted: true}, query);
    },
    deleteRelevantImage: function(query){
        return NewsImage.destroy(query);
    },
    save: function(news){
        if(news.id){
            return News.update(news, {
                    where: {id : news.id}
                }
            ).then(function(result){
                var promiseArray = [];
                if(news.relevantPhotos == undefined) news.relevantPhotos = [];
                for(var i = 0; i < news.relevantPhotos.length; i++){
                    promiseArray.push(NewsImage.upsert(news.relevantPhotos[i]));
                }
                return Promise.all(promiseArray).then(function(r){
                    return News.find({ where: {id: news.id}, include: [{model: NewsImage, as: 'relevantPhotos'}]});
                });
            });
        }else{
            return News.create(news, {include: [{model: NewsImage, as: 'relevantPhotos'}]});
        }
    }
}