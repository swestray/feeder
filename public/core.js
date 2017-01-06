var app = angular.module('Feeder', []);

app.controller('recipeController', function($scope, $http){
	$scope.formData = {};

    // when landing on the page, get all recipes and show them
    $http.get('/api/recipes')
        .success(function(data) {
            $scope.recipes = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the data to the node API
    $scope.createRecipe = function() {
        $http.post('/api/recipes', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.recipes = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.addReview = function(id) {
    	$http.post('/api/recipes/' + id + '/reviews', $scope.review)
    		.success(function(data){
    			$scope.review = {};
    			$scope.reviews = data;
    			console.log(data);
    		})
    		.error(function(data){
    			console.log('Error: ' + data);
    		});
    }


    // delete a recipe after checking it
    $scope.deleteRecipe = function(id) {
        $http.delete('/api/recipes/' + id)
            .success(function(data) {
                $scope.recipes = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
});

app.controller('CollapseController', function($scope){
	var collapsed = true;

	$scope.collapse = function(product){
		if(collapsed){
			$scope.collapseBtn = 'glyphicon glyphicon-chevron-up'
			collapsed = false;
		}
		else{
			$scope.collapseBtn = 'glyphicon glyphicon-chevron-down'
			collapsed = true;
		}
	}
});

app.controller('YumController', function($scope){
	var isYummed = false;
	var isYucked = false;
	$scope.yum = function(recipe) {
		if(isYummed){
			isYummed = false;
			$scope.yumButton = 'yum';
			recipe.score -= 1
		}
		else if(isYucked){
			isYucked = false;
			isYummed = true;
			$scope.yumButton = 'YUM';
			$scope.yuckButton = 'yuck';
			recipe.score += 2;
		}
		else{
			isYummed = true;
			$scope.yumButton = 'YUM'
			recipe.score += 1;
		}
	};
	$scope.yuck = function (recipe) {
		if(isYucked){
			isYucked = false;
			$scope.yuckButton = 'yuck'
			recipe.score += 1;
		}
		else if(isYummed){
			isYummed = false;
			isYucked = true;
			$scope.yuckButton = 'YUCK';
			$scope.yumButton = 'yum';
			recipe.score -= 2;
		}
		else{
			isYucked = true;
			$scope.yuckButton = 'YUCK'
			recipe.score -= 1;
		}
	};
});

app.controller('TabController', function($scope){
    $scope.tab = 1;
    $scope.setTab = function(newValue){
    $scope.tab = newValue;
   	};
   	$scope.isSet = function(tabName){
   		return $scope.tab === tabName;
   	};
});