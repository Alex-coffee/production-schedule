var Sequelize = require('sequelize');
var Menu;

module.exports = {
    prepare: function(sequelize){
        Menu = sequelize.define('menu', {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            label: { type: Sequelize.STRING, allowNull: false},
            category: { type: Sequelize.STRING, allowNull: true},
            link: { type: Sequelize.STRING, allowNull: false},
            isAbstract: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false},
            level: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1},
            order: { type: Sequelize.INTEGER, allowNull: true},
            thumbnailPath: { type: Sequelize.STRING, allowNull: true},
        });

        Menu.hasMany(Menu, {as: 'submenus'})
        //Menu.hasOne(Menu, {as: 'parentmenu', foreignKey: 'parentId'});

        var homeMenu  = Menu.build({label: "home_label", link: "home", order: 1})
            , solutionMenu  = Menu.build({label: "solution_label", link: "solution", isAbstract: true, order: 2})
            //, newsMenu  = Menu.build({label: "news_label", link: "news", order: 3})
            , companyMenu  = Menu.build({label: "company_label", link: "company", order: 4})

            , aviationMenu  = Menu.build({label: "aviation_label", link: "solution.aviation", level:2, isAbstract: true, order: 1})
            , productionMenu  = Menu.build({label: "production_label", link: "solution.production", level:2, isAbstract: true, order: 2})
            , transportationMenu  = Menu.build({label: "transportation_label", link: "solution.transportation", level:2, isAbstract: true, order: 3})

            , crewMenu  = Menu.build({label: "crew_label", category: "aviation", link: "solution.aviation.crew", level:3, thumbnailPath: "/resources/img/website/product/crew_product.jpg"})
            , checkinMenu  = Menu.build({label: "checkin_label", category: "aviation", link: "solution.aviation.checkin", level:3, thumbnailPath: "/resources/img/website/product/checkin_product.png"})
            , gateMenu  = Menu.build({label: "gate_label", category: "aviation", link: "solution.aviation.gate", level:3, thumbnailPath: "/resources/img/website/product/gate_product.jpg"})
            , loadMenu  = Menu.build({label: "load_label", category: "aviation", link: "solution.aviation.load", level:3, thumbnailPath: "/resources/img/website/product/load_product.jpg"})
            , flightAssessmentMenu  = Menu.build({label: "flightAssessment_label", category: "aviation", link: "solution.aviation.flightAssessment", level:3, thumbnailPath: "/resources/img/website/product/flight_assessment.jpg"})

            , cuttingMenu  = Menu.build({label: "cutting_label", category: "production", link: "solution.production.cutting", level:3, thumbnailPath: "/resources/img/website/product/cutting_product.png"})
            , dispatchMenu  = Menu.build({label: "dispatch_label", category: "transportation", link: "solution.transportation.dispatch", level:3, thumbnailPath: "/resources/img/website/fields3.jpg"})

            , contactMenu  = Menu.build({label: "contact_label", link: "contact", order: 5})
            ;

        Menu.sync({force:true}).then(function(result){
        
            Promise.all([
                homeMenu.save(),
                solutionMenu.save(),
                //newsMenu.save(),
                companyMenu.save(),
                contactMenu.save(),
        
                aviationMenu.save(),
                productionMenu.save(),
                transportationMenu.save(),
        
                crewMenu.save(),
                checkinMenu.save(),
                gateMenu.save(),
                loadMenu.save(),
                flightAssessmentMenu.save(),
                cuttingMenu.save(),
                dispatchMenu.save(),
        
            ]).then(function(r){
//                solutionMenu.setSubmenus([crewMenu, checkinMenu, gateMenu, loadMenu, flightAssessmentMenu, cuttingMenu, dispatchMenu]);
        
                aviationMenu.setSubmenus([crewMenu, checkinMenu, gateMenu, loadMenu, flightAssessmentMenu]);
                productionMenu.setSubmenus([cuttingMenu]);
                transportationMenu.setSubmenus([dispatchMenu]);
        
                solutionMenu.setSubmenus([aviationMenu, productionMenu, transportationMenu]);
        
            });
        
        });
    },
    getModel: function(){
        return Menu;
    },
    find: function(query){
        return Menu.findAll(query);
    },
    create: function(menu){
        Menu.create(menu).then(function(result){
            console.log(result);
        });


        //var Categories = Product.hasMany(Tag, {as: 'categories'});
        //
        //Product.create({
        //    id: 1,
        //    title: 'Chair',
        //    categories: [
        //        {id: 1, name: 'Alpha'},
        //        {id: 2, name: 'Beta'}
        //    ]
        //}, {
        //    include: [ Categories ]
        //})
    }
}