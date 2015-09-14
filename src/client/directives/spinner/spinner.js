var Spinner = require('spin.js');
var _ = require('lodash');

function spinnerDirective() {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
			var options = {
				lines: 8,
				length: 28,
				width: 10,
				radius: 20,
				scale: 1,
				corners: 1,
				color: '#000',
				opacity: 0.25,
				rotate: 0,
				direction: 1,
				speed: 1.5,
				trail: 60,
				fps: 20,
				zIndex: 2e9,
				className: 'spinner',
				top: '50%',
				left: '50%',
				shadow: false,
				hwaccel: false,
				position: 'absolute'
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
