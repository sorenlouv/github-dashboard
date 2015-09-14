var Awesomplete = require('awesomplete');

function autocompleteDirective() {
	return {
		restrict: 'E',
		template: '<input type="text"></input>',
		replace: true,
		link: function($scope, $element, $attrs) {
			var autocomplete = new Awesomplete($element[0], {
				filter: function(text, input) {
					var currentQuery = input.match(/[^,]*$/)[0];
					return Awesomplete.FILTER_CONTAINS(text, currentQuery);
				},
				replace: function(text) {
					var before = this.input.value.match(/^.+,\s*|/)[0];
					this.input.value = before + text + ', ';
				}
			});

			$scope.$watch($attrs.items, function(items) {
				autocomplete.list = items;
			});
		},
	};
}

autocompleteDirective.$inject = [];
module.exports = autocompleteDirective;
