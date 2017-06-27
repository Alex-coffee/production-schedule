var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var Menu = new Schema({
    label: { type: String, required: true},
    link: { type: String, required: true},
    subMenu: [{ type: Schema.Types.ObjectId, ref: 'Menu' }],
    created_at: Date,
    updated_at: Date
});


// on every save, add the date
Menu.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

// the schema is useless so far
// we need to create a model using it
var Menu = mongoose.model('Menu', Menu);

// make this available to our users in our Node applications
module.exports = Menu;