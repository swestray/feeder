var express = require('express');
var app = express(), server = require('http').createServer(app);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://stone:westray@ds037215.mlab.com:37215/feeder');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

//model
var Recipe = mongoose.model('Recipe', {
	title: String,
	description: String,
	reviews: [String],
	ingredients: [{quantity: Number, unit: String, item: String}],
	steps: [String],
	score: { type: Number, default: 0 }
});

    // API
    // get all recipes
    app.get('/api/recipes', function(req, res) {

        // use mongoose to get all recipes in the database
        Recipe.find(function(err, recipes) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(recipes); // return all recipes in JSON format
        });
    });

    // create recipe and send back all recipes after creation
    app.post('/api/recipes', function(req, res) {

        // create a recipe, information comes from AJAX request from Angular
        Recipe.create({
            title : req.body.title,
            description: req.body.description,
            reviews: req.body.reviews,
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            score: req.body.score
        }, function(err, recipe) {
            if (err)
                res.send(err);

            // get and return all the recipes after you create another
            Recipe.find(function(err, recipes) {
                if (err)
                    res.send(err)
                res.json(recipes);
            });
        });

    });

    //push a new review for a certain recipe
    app.post('/api/recipes/:recipe_id/reviews', function(req, res){
    	Recipe.findByIdAndUpdate(req.params.recipe_id, {$push: {"reviews": req.body.review}}, function(err,recipe){
    		if(err)
    			res.send(err);
    		recipe.save(function(err){
    			if(err)
    				res.send(err);
    			res.json({message: 'review pushed ' + req.body.review});
    		});
    	});
    });

    //update a recipe with new score
    app.put('/api/recipes/:recipe_id', function(req, res){
    	Recipe.findById(req.params.recipe_id, function(err, recipe){
    		if(err)
    			res.send(err);

    		recipe.score = req.body.score;

    		recipe.save(function(err){
    			if(err)
    				res.send(err);

    			res.json({ message: 'recipe updated!'});
    		});
    	});
    });

    // delete a recipe
    app.delete('/api/recipes/:recipe_id', function(req, res) {
        Recipe.remove({
            _id : req.params.recipe_id
        }, function(err, recipe) {
            if (err)
                res.send(err);

            // get and return all the recipes after you create another
            Recipe.find(function(err, recipes) {
                if (err)
                    res.send(err)
                res.json(recipes);
            });
        });
    });

    app.get('*', function(req, res){
    	res.sendfile('./public/index.html');
    });


app.listen(8000);
console.log('app is listening on port 8000');