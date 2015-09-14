var Spinner = require('spin.js');
var _ = require('lodash');

function spinnerDirective() {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var options = {
				lines: 12, // The number of lines to draw
				length: 33, // The length of each line
				width: 6, // The line thickness
				radius: 33, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#555', // #rgb or #rrggbb or array of colors
				speed: 2, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: true, // Whether to use hardware acceleration
				className: 'spinner',
				zIndex: 2e9,
				top: '160px',
				left: '50%',
			};

			var newOptions = $scope.$eval($attrs.spinnerOptions);
			if (_.isObject(newOptions)){
				_.merge(options, newOptions);
			}

			if ($attrs.overlay) {
				$element.prepend('<div class="loading-spinner-overlay"></div>');
			}

			var spinner = new Spinner(options);
			var SPINNING_CSS_CLASS = 'loading-spinner';
			var LOADING_CSS_CLASS = 'is-loading';
			$element.addClass(SPINNING_CSS_CLASS);

			$scope.$watch($attrs.spinner, function(isLoading) {
				if (isLoading){
					spinner.spin($element[0]);
					$element.addClass(LOADING_CSS_CLASS);
					$element.prop('disabled', true);
				} else {
					spinner.stop();
					$element.removeClass(LOADING_CSS_CLASS);
					$element.prop('disabled', false);
				}
			});
		},
	};
}

module.exports = [spinnerDirective];
