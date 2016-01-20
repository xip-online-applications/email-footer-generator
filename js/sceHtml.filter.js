angular.module('app')
	.filter('sceHtml', function($sce) {
   		 return function(val) {
        		return $sce.trustAsHtml(val);
    		}; });

