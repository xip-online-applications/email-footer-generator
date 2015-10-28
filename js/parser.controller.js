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

    // The list of source code tags
    $scope.tags = [];

    /**
     * Go to step two.
     *
     * Parse the given source code.
     */
    $scope.goToStepTwo = function() {

        // Find all special tags
        $scope.sourceCodeParsed = angular.copy($scope.sourceCode);
        var tags = $scope.sourceCodeParsed.match(/{{([^{}]*)}}/g);

        // Get the type from the JSON string
        $scope.tags = [];

        // Iterate through all tags
        tags.forEach(function(tag, i) {

            // Strip the front and end tags
            var strippedTag = tag.substr(1, tag.length - 2);

            // Convert to JSON
            var parsed = JSON.parse(strippedTag);

            // Add an ID to the tag
            parsed.ID = '#'+i;
            parsed.value = '';

            // Replace the tag in the code
            $scope.sourceCodeParsed = $scope.sourceCodeParsed.replace(tag, '{'+parsed.ID+'}');

            // Get the type from the JSON string
            $scope.tags.push(parsed);

        });

        // Go to step two
        $scope.panelStep = 2;

    };

    /**
     * Go to the third step
     */
    $scope.goToStepThree = function () {
        console.log("Place content in tags", $scope.tags);

        // Iterate through all tags
        $scope.tags.forEach(function(tag) {

            // Replace the tag in the code
            $scope.sourceCodeParsed = $scope.sourceCodeParsed.replace('{{'+tag.ID+'}}', tag.value);

        });

        // Go to step two
        $scope.panelStep = 3;

    };

    /**
     * Save all settings in the local storage
     */
    $scope.load = function() {

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
                console.log("Loading: " + name);

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

    /**
     * Save all settings in the local storage
     */
    $scope.delete = function() {

        // Get all saved dialog
        var footers = JSON.parse(localStorage.getItem("footers"));
        if(!footers) footers = [];

        // Open the dialog
        var modal = $uibModal.open({
            templateUrl: 'modalDelete.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function() { return footers; }
            }
        });
        modal.result
            .then(function (name) {
                console.log("Loading: " + name);

                // Delete the name
                footers.splice(name, 1);
                localStorage.setItem("footers", JSON.stringify(footers));

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
                console.log("Saving: " + name);

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
