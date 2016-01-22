angular.module('app')
    .controller('ParserController', ParserController);

ParserController.$inject = ['$scope', '$uibModal'];
function ParserController($scope, $uibModal) {

    // Initial step
    $scope.panelStep = 1;

    // The source code
    $scope.sourceCode = '<div class="example">{{{"type": "text", "name": "Test", "description": "A test input field."}}}</div>';

    // The parsed source code
    $scope.sourceCodeParsed = '';

	// The copyable source code
	$scope.sourceCodeCopyable = '';

    // The list of source code tags
    $scope.tags = {};

    /**
     * Go to step two.
     *
     * Parse the given source code.
     */
    $scope.goToStepTwo = function() {
        // Find all special tags
        $scope.sourceCodeParsed = angular.copy($scope.sourceCode);
        var tags = $scope.sourceCodeParsed.match(/{{([^{}]*)}}/g);

	    // Tags found?
	    if(tags == undefined || tags == null || tags.length <= 0) {
		    return;
	    }

        // Iterate through all tags
        tags.forEach(function(tag, i) {
            // Strip the front and end tags
            var strippedTag = tag.substr(1, tag.length - 2);

            // Convert to JSON
            var parsed = JSON.parse(strippedTag);

            // Add an ID to the tag
            if(parsed.id === undefined) parsed.id = '#'+i;

	        // Does the tag exist?
	        if($scope.tags[parsed.id] !== undefined) {
		        parsed = angular.extend($scope.tags[parsed.id], parsed);
	        }

            // Replace the tag in the code
            $scope.sourceCodeParsed = $scope.sourceCodeParsed.replace(tag, '{'+parsed.id+'}');

            // Get the type from the JSON string
            $scope.tags[parsed.id] = parsed;
        });

        // Go to step two
        $scope.panelStep = 2;

    };

    /**
     * Go to the third step
     */
    $scope.goToStepThree = function () {
	    // Copy source code
	    $scope.sourceCodeCopyable = angular.copy($scope.sourceCodeParsed);

        // Iterate through all tags
	    angular.forEach($scope.tags, function(value, key) {
		    // Replace the tag in the code
		    $scope.sourceCodeCopyable = $scope.sourceCodeCopyable.replace(new RegExp('{{'+key+'}}', 'g'), value.value);
	    });

        // Go to step two
        $scope.panelStep = 3;
    };

    /**
     * Reset all values
     */
    $scope.reset = function() {
	angular.forEach($scope.tags, function(value, key) {
		value.value = '';
	});
    }

    /**
     * Save all settings in the local storage
     */
    $scope.presets = function() {

        // Get all saved dialog
        var footers = JSON.parse(localStorage.getItem("footers"));
        if(!footers) footers = [];

        // Open the dialog
        var modal = $uibModal.open({
            templateUrl: 'modalLoad.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function() { return footers; }
            }
        });
        modal.result
            .then(function (name) {
	            // Reload footers
	            var footers = JSON.parse(localStorage.getItem("footers"));
	            if(!footers) footers = [];

                // Save the source
                $scope.sourceCode = localStorage.getItem("f" + name + "-source-unparsed");
                $scope.sourceCodeParsed = localStorage.getItem("f" + name + "-source-parsed");
                $scope.tags = JSON.parse(localStorage.getItem("f" + name + "-tags"));

                // Go to step two
                $scope.panelStep = 2;
            });

        function ModalInstanceCtrl($scope, $uibModalInstance, items) {

            // The list of items
            $scope.items = items;

            // The new name
            $scope.name = null;

	        /**
	         * Delete the selected item
	         */
	        $scope.delete = function() {
		        if($scope.name == null) return;
		        else {
			        $scope.items.splice($scope.name, 1);
			        localStorage.setItem("footers", JSON.stringify($scope.items));
		        }
	        };

            /**
             * Save
             */
            $scope.load = function () {
                if($scope.name == null) $scope.cancel();
                else $uibModalInstance.close($scope.name);
            };

            /**
             * Cancel
             */
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            /**
             * Set the item.
             * @param $event
             * @param item
             */
            $scope.setItem = function($event, item) {
	            $event.preventDefault();
                $scope.name = item;
            }
        }

    };

    /**
     * Save all settings in the local storage
     */
    $scope.save = function() {
        // Get all saved dialog
        var footers = JSON.parse(localStorage.getItem("footers"));
        if(!footers) footers = [];

        // Open the dialog
        $uibModal.open({
            templateUrl: 'modalSave.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () { return footers; }
            }
        }).result
            .then(function (name) {
                // Save the footer
                if(footers.indexOf(name) < 0) footers.push(name);
                localStorage.setItem("footers", JSON.stringify(footers));

                // Save the data
                localStorage.setItem("f" + name + "-source-unparsed", $scope.sourceCode);
                localStorage.setItem("f" + name + "-source-parsed", $scope.sourceCodeParsed);
                localStorage.setItem("f" + name + "-tags", JSON.stringify($scope.tags));
            });

        function ModalInstanceCtrl($scope, $uibModalInstance, items) {

            // The list of items
            $scope.items = items;

            // The new name
            $scope.name = null;

            /**
             * Save
             */
            $scope.ok = function () {
                if($scope.name == null) $scope.cancel();
                else $uibModalInstance.close($scope.name);
            };

            /**
             * Cancel
             */
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            /**
             * Set the item.
             * @param item
             */
            $scope.setItem = function(item) {
                $scope.name = item;
            }
        }

    };

}
