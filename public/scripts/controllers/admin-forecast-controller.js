angular
    .module('awesweet')
    .controller('adminForecastController', adminForecastController);

	adminForecastController.$inject = ['$scope','$log', '$routeParams', '$location', 'firebaseService'];

/* @ngInject */
function adminForecastController($scope, $log, $routeParams, $location, firebaseService) {

	//define view model variable
    var vm = this;
    
    //  DEFINE VIEW MODEL
    vm.year = $routeParams.year;
    vm.week = $routeParams.week;
    vm.start = weekStart(vm.year, vm.week);
    vm.end = moment(vm.start).add(6, 'd').format();
    vm.inflows = {
        "Retail": {},
        "Wholesale": {},
        "Online": {},
        "Other": {},
    };
    vm.outflows = [];

    
    //  QUERY DATABASE DATA
    firebaseService.query.instancesByDate(vm.start, vm.end)
    .then(function success(s) {
        //return an affirmative status code
        console.log(s);
        vm.inflows.Retail = s;
        $scope.$apply();
    }).catch(function error(e) {
        console.log(e);
    });
    
    

    //  VIEW MODEL FUNCTIONS
    vm.changeWeek =function(currentWeek, change) {
        var newWeek = parseInt(currentWeek) + parseInt(change);
        //console.log('new week', newWeek);
        if(newWeek < 53 && newWeek > 0) $location.path('admin/forecasts/weekly/' + vm.year + '/'+ newWeek)
        else console.log('problem');
    };

    //  LOCAL FUNCTIONS
    function weekStart(year, week) {
        //  DEFINE LOCAL VARIABLES
        var calStart = moment(new Date(2018,11,31));
        var additionalWeeks = 0;

        //  CALCULATE ADDITIONAL WEEKS
        if(year > 2019) additionalWeeks = additionalWeeks + ((year - 2019) * 52) - 1 + parseInt(week)
        else additionalWeeks = additionalWeeks - 1 + parseInt(week);

        //  ADD ADDITIONAL WEEKS
        var startMonday = calStart.add(additionalWeeks, 'w');

        //  NOTIFY PROGRESS
        //console.log("adding", additionalWeeks, "weeks", startMonday.format());

        return startMonday.format();
    };

	$log.info('in the adminForecastController', $routeParams, vm.start);	    //  TODO: TAKE THIS OUT LATER


}