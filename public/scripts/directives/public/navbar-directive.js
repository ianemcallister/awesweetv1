/*
*	CUSTOMER LIST
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('navbarDirective', navbarDirective);

/* @ngInject */
function navbarDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/navbar-view.directive.htm',
		replace: true,
		scope: {
		},
		link: linkFunc,
		controller: navbarDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	navbarDirectiveController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function navbarDirectiveController($scope, $log) {
		//	DEFINE LOCAL VARIABLES
		var vm = this;

		//	DEFINE VIEW MODEL VARIABLES
		vm.isNavCollapsed = true;
		vm.isCollapsed = false;
		vm.isCollapsedHorizontal = false;

		//	REPORT PROGRESS
		$log.info('in navbar directive controller');
	}

	//pass it back
	return directive;
}
