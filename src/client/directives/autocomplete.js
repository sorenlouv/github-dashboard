var Awesomplete = require('awesomplete');

function autocompleteDirective() {
	return {
		restrict: 'E',
		template: '<input type="text"></input>',
		replace: true,
		link: function($scope, $element, $attrs) {
			var autocomplete = new Awesomplete($element[0]);

			$scope.$watch($attrs.items, function(items) {
				autocomplete.list = items;
			});

			var onSelect = $scope.$eval($attrs.onSelect);
			$element.on('awesomplete-selectcomplete', function(evt) {
				var text = $element.val();
				$scope.$apply(function() {
					onSelect(text);
					$element.val('');
				});
			});
		},
	};
}

autocompleteDirective.$inject = [];
module.exports = autocompleteDirective;
