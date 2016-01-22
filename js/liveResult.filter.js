angular.module('app')
	.filter('liveResult', function($sce) {
   		 return function(html, tags) {			
			var parsed = angular.copy(html);
            		angular.forEach(tags, function(value, key) {
				parsed = parsed.replace(new RegExp('{{'+key+'}}', 'g'), value.value);
            		});
			return parsed;
    		}; });

