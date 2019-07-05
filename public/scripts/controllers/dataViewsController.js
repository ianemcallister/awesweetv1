angular
    .module('awesweet')
    .controller('dataViewsController', dataViewsController);

	dataViewsController.$inject = ['$scope','$log', '$location', "$routeParams", 'firebaseService'];

/* @ngInject */
function dataViewsController($scope, $log, $location, $routeParams, firebaseService) {

    //  DEFINE LOCAL VARIABLES
    var view = $location.$$path.split('/')[3];
    
    //  DEFINE VIEWMODEL VARIABLES
    var vm = this;
    vm.seasonInput = false;
    vm.instancesInput = false;
    vm.aChannel = {
        newSeason: "",
        seasonStart: "",
        seasonsEnd: "",
        itFrequency: "",
        itOpens: { hr: "", min: "", AP: "", time: ""},
        itCloses: { hr: "", min: "", AP: "", time: ""},
        newInstancesPreview: []
    }

    //  DEFINE VIEW MODEL FUNCTIONS
    vm.loadChannel = function(id) {
        $location.path('/admin/data/channel/' + id);
    };
    vm.navPrevious = function() {
        //  DEFINE LOCAL VARIABLES
        var channelsList = [];
        var i = 0;
        var index = 0;
        var pathIndex = 0;
        //  iterate over channels list
        Object.keys(vm.channels).forEach(function(key) {
            channelsList.push(vm.channels[key]);
            if(key == $routeParams.channelId) index = i;
            i++;
            //console.log(key);
        });

        if ((index - 1) > 0) pathIndex = index - 1;

        //console.log('nav to previous', index, pathIndex, channelsList[pathIndex].id);
        
        $location.path('/admin/data/channel/' + channelsList[pathIndex].id)
    };
    vm.navNext = function() {
        //  DEFINE LOCAL VARIABLES
        var channelsList = [];
        var i = 0;
        var index = 0;
        var pathIndex = 0;
        //  iterate over channels list
        Object.keys(vm.channels).forEach(function(key) {
            channelsList.push(vm.channels[key]);
            if(key == $routeParams.channelId) index = i;
            i++;
            //console.log(key);
        });

        if ((index + 1) < channelsList.length) pathIndex = index + 1;

        //console.log('nav to next', index, pathIndex, channelsList[pathIndex].id);
        
        $location.path('/admin/data/channel/' + channelsList[pathIndex].id)
    };
    vm.saveNewSeason = function(name) {
        //  DEFINE LOCAL VARIABLES
        console.log('saving seasons: ', name);
        firebaseService.create.season($routeParams.channelId, name)
        .then(function success(s) {
            alert('Saved Successfully', s);
        }).catch(function error(e) {
            alert('Error Savings', e);
        });
    };
    vm.previewIterations = function(start, end, freq) {
        //  DEFINE LOCAL VARIABLES
        var startDate = moment(start);
        var endDate = moment(end);
        vm.aChannel.newInstancesPreview = [];

        //  TEST FOR VIABLE VALUES
        if(start != "" && end != "", freq !="") {
            console.log('all values good');
            //  iterate based on frequency
            switch(freq) {
                case "Daily":
                    //  DEFINE LOCAL VARIBALES
                    var iterations = endDate.diff(startDate, 'days')
                    var cursorDate = startDate;
                    //  iterate to create the list
                    for(var i = 0; i <= iterations; i++) {
                        //save the date
                        vm.aChannel.newInstancesPreview.push(
                            { 
                                season: vm.aChannel.newSeason,
                                date: cursorDate.format() 
                            }
                        );
                        //notify the date
                        //console.log(cursorDate.format());
                        //incriment the date
                        cursorDate = cursorDate.add(1, 'days')
                    };
                    
                    break;
                case "Weekly":
                    //  DEFINE LOCAL VARIBALES
                    var iterations = endDate.diff(startDate, 'weeks')
                    var cursorDate = startDate;
                    //  iterate to create the list
                    for(var i = 0; i <= iterations; i++) {
                        //save the date
                        vm.aChannel.newInstancesPreview.push(
                            { 
                                season: vm.aChannel.newSeason,
                                date: cursorDate.format() 
                            }
                        );
                        //notify the date
                        //console.log(cursorDate.format());
                        //incriment the date
                        cursorDate = cursorDate.add(1, 'week')
                    };
                    break;
                case "Monthly":
                    //  DEFINE LOCAL VARIBALES
                    var iterations = endDate.diff(startDate, 'months')
                    var cursorDate = startDate;
                    //  iterate to create the list
                    for(var i = 0; i <= iterations; i++) {
                        //save the date
                        vm.aChannel.newInstancesPreview.push(
                            { 
                                season: vm.aChannel.newSeason,
                                date: cursorDate.format() 
                            }
                        );
                        //notify the date
                        //console.log(cursorDate.format());
                        //incriment the date
                        cursorDate = cursorDate.add(1, 'month')
                    };
                    break;
                default:
            };
        }
    };
    vm.setItTimes = function(path, hr, min, ap) {
        //  TEST FOR VALUES
        if (hr != "" && min != "" && ap != "") {
            
            if(ap == "PM") {
                vm.aChannel[path].time = (parseInt(hr) + 12) + ":" + min + "-07:00";
            } else {
                vm.aChannel[path].time = hr + ":" + min + "-07:00";
            }

            //  Add to all of the instances
            for(var i = 0; i < vm.aChannel.newInstancesPreview.length; i++) {
                vm.aChannel.newInstancesPreview[i][path] = vm.aChannel[path].time;
            };
            
        }

        console.log('this time', vm.aChannel.itOpens.time)
    };

    //  LOAD DATA
    switch(view) {
        case "instances_by_channel":
            firebaseService.read.instances()
            .then(function success(instancesList) {
                vm.instances = instancesList;
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
            break;
        case "channels":
            firebaseService.read.channels()
            .then(function success(channelsList) {
                vm.channels = channelsList;
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
            break;
        case "channel":
            console.log('$routeParams', $routeParams);
            firebaseService.read.channels()
            .then(function success(channelsList) {
                vm.channels = channelsList;
                vm.channelData = channelsList[$routeParams.channelId];
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
            firebaseService.query.instance($routeParams.channelId)
            .then(function success(instancesList) {
                vm.instances = instancesList;
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
        default:
    }




	$log.info('in the data views controller', view);	    //  TODO: TAKE THIS OUT LATER


}