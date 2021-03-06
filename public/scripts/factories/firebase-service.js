/*
*	FIREBASE SERVICE
*
*/

//  DEFINE MODULE
angular
    .module('awesweet')
    .factory('firebaseService', firebaseService);

//  DEPENDENCY INJECTION
firebaseService.$inject = ['$log', '$http', '$firebase', '$firebaseObject', '$firebaseArray'];

//  DECLARE THE SERVICE
/* @ngInject */
function firebaseService($log, $http, $firebase, $firebaseObject, $firebaseArray) {

    //  DECLARE GLOBALS

    //  DEFINE METHODS
    var firebaseMod = {
        read: {
            record: readRecord,
            inventoryInstances: readInventoryInstances,
            instances: readInstances,
            channels: readChannels,
            anInstance: readAnInstance
        },
        create: {
            emailUser: create_user_email,
            season: createSeason,
            channel: createChannel,
            instancesList: createInstancesList
        },
        authenticate: {
            email: email_authentication
        },
        query: {
            equalTo: equalToQuery,
            instanceAccts: queryInstanceAccts,
            instances: queryInstances,
            instancesByDate: queryInstancesByDate,
            shifts: queryShifts
        },
        update: {
           record: updateRecord 
        },
        push: {
            record: pushRecord
        },
        resolve: {
            instanceAccts: resolveInstanceAccts
        },
        templates: {
            instanceFilters: instanceFiltersTemplate
        }
    };

    /*
    *   CREATE
    */
    /*
    *
    */
    function createInstancesList(instanesList){
        //  DECLARE LOCAL VARIABLES
        var updates = {};

        console.log('createInstancesList', instanesList);

        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {

            //  ITERATE
            instanesList.forEach(function(instance){

                //  Get a key for the new post
                var newInstanceKey = firebase.database().ref().child('instances').push().key;
                
                instance.instance_id = newInstanceKey
                updates["/instances/" + newInstanceKey] = instance

            });
            
            updateRecord(updates)
            .then(function success(s) {
                resolve(s);
            }).catch(function error(e) {
                reject(e);
            });

        });
    };

    function createSeason(chId, value) {
        //  DECLARE LOCAL VARIABLES
        var seasonObject = {
            "channelId": chId,
            "title": value
        };
        var channelObject = {
            "seasonId": "",
            "title": value
        };
        //  NOTIFY PROGRESS
        console.log('creating a new season', seasonObject);
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {

            //  Get a key for the new post
            var newSeasonKey = firebase.database().ref().child('seasons').push().key;
            var newChSeasonKey = firebase.database().ref('/channels/' + chId + "/seasons").push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/seasons/' + newSeasonKey] = seasonObject;
            updates['/channels/' + chId + '/seasons/' + newChSeasonKey] = { seasonId: newSeasonKey, title: value };

            firebase.database().ref().update(updates)
            .then(function success(s) {
                resolve(newSeasonKey);
            }).catch(function error(e) {
                reject(e);
            });
        });
    };

    /*
    *
    */
    function createChannel(name, type) {
        //  DEFINE LOCAL VARIABLES
        var updates = {};
        var newChannelKey = firebase.database().ref().child('channels').push().key;
        updates['/channels/' + newChannelKey] = {
            id: newChannelKey,
            qbId: "",
            sqId: "",
            title: name,
            type: type,
            wiwId: ""
        };

        console.log('sending this', updates);
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            firebase.database().ref().update(updates)
            .then(function success(s) {
                resolve(s);
            }).catch(function error(e) {
                reject(e);
            });
        });
    };

    /*
    *
    */
    function updateRecord(updates) {
        //  DEFINE LOCAL VARAIBLES
        //  NOTIFY PROGRESS
        console.log('updateRecord', updates);
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            firebase.database().ref().update(updates)
            .then(function success(snapshot) {
                resolve(snapshot);
            }).catch(function error(e) {
                reject(e);
            });
        });        
    }

    /*
    *   PUSH RECORD
    */
    function pushRecord(path) {
        //  DEFINE LOCAL VARIABLES
        //  RETURN VALUE
        return firebase.database().ref(path).push().key;
    };

    /*
    *   READ INVENTORY INSTANCES
    */
    function readInventoryInstances() {
        //  DECLARE LOCAL VARIABLES
        //  NOTIFY PROGRESS
        console.log('reading inventory instances');
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            firebase.database().ref('/inventory/instances').once('value')
            .then(function success(snapshot) {
                resolve(snapshot.val());
            }).catch(function error(e) {
                reject(e);
            });
        });
    };
    /*
    *
    */
    function readRecord(readPath) {
        //  DECLARE LOCAL VARIABLES
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            firebase.database().ref(readPath).once('value')
            .then(function success(snapshot) {
                resolve(snapshot.val());
            }).catch(function error(e) {
                reject(e);
            });
        });            
    };

    /*
    *   READ AN INSTANCE
    */
    function readAnInstance(instanceId) {
        //  DECLARE LOCAL VARIABLES
        var readPath = '/instances/' + instanceId;

        //  NOTIFY PROGRESS
        console.log('reading an instance');
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            firebase.database().ref(readPath).once('value')
            .then(function success(snapshot) {
                resolve(snapshot.val());
            }).catch(function error(e) {
                reject(e);
            });
        });     
    };

    /*
    *   READ INSTANCES
    */
   function readInstances() {
        //  DECLARE LOCAL VARIABLES
        //  NOTIFY PROGRESS
        //console.log('reading instances');
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            firebase.database().ref('/instances').once('value')
            .then(function success(snapshot) {
                resolve(snapshot.val());
            }).catch(function error(e) {
                reject(e);
            });
        });
    };

    /*
    *   READ Channels
    */
   function readChannels() {
    //  DECLARE LOCAL VARIABLES
    //  NOTIFY PROGRESS
    console.log('reading Channels');
    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {
        firebase.database().ref('/channels').once('value')
        .then(function success(snapshot) {
            resolve(snapshot.val());
        }).catch(function error(e) {
            reject(e);
        });
    });
};

    /*
    *   EMAIL AUTHENTICATION
    *   
    *   This method takes a username (email) and password, and returns a sucess or failure 
    */
    function create_user_email(email, password) {
        //  DEFINE LOCAL VARIABLES

        //  NOTIFY PROGIRESS
        $log.info('authenticating email');

        //  return new async work
        return new Promise(function (resolve, reject) {

            //  AUTHENTICATE WITH FIREBASE
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function sucess(s) {
                //  PASS THE RESULT BACK
                resolve(s);
            }).catch(function(e) {
                reject(e);
            });
            
        });
    };

    /*
    *   EMAIL AUTHENTICATION
    *   
    *   This method takes a username (email) and password, and returns a sucess or failure 
    */
    function email_authentication(email, password) {
        //  DEFINE LOCAL VARIABLES

        //  NOTIFY PROGIRESS
        $log.info('authenticating email');

        //  return new async work
        return new Promise(function (resolve, reject) {

            //  AUTHENTICATE WITH FIREBASE
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function sucess(s) {
                //  PASS THE RESULT BACK
                resolve(s);
			}).catch(function(e) {
				reject(e);
            });
            
        });
    };

    /*
    *   QUERY RECORDS   
    *
    */
    function equalToQuery(path, orderby, value) {
        //  DEFINE LOCAL VARIABLES

        //  NOTIFY PROGRES
        console.log('equalToQuery got these values', path, orderby, value);
        //  RETURN ASYNC WORK
        return new Promise(function (resolve, reject) {

            var instanceAccts = firebase.database().ref(path).orderByChild(orderby).equalTo(value);

            instanceAccts.once("value")
            .then(function(snapshot) {
                resolve(snapshot.val());
            })
            .catch(function(e) {
                reject(e);
            });
        }); 
    };

    /*
    *   QUERY INSTANCE ACCTS
    *   
    *   This method takes a username (email) and password, and returns a sucess or failure 
    */
    function queryInstanceAccts(instanceId) {
        //  DEFINE LOCAL VARIABLES
        //  RETURN ASYNC WORK
        return new Promise(function (resolve, reject) {

            var instanceAccts = firebase.database().ref('inventory/accts').orderByChild('instance_id').equalTo(instanceId);

            instanceAccts.once("value")
            .then(function(snapshot) {
                resolve(snapshot.val());
            })
            .catch(function(e) {
                reject(e);
            });
        });
    };

    /*
    *   QUERY INSTANCES
    *   
    *   This method takes 
    */
    function queryInstances(filter, id) {
        //  DEFINE LOCAL VARIABLES
        console.log('querying Instances with ', filter, id);
        //  RETURN ASYNC WORK
        return new Promise(function (resolve, reject) {

            var instances = firebase.database().ref('instances').orderByChild(filter).equalTo(id);

            instances.once("value")
            .then(function(snapshot) {
                resolve(snapshot.val());
            })
            .catch(function(e) {
                reject(e);
            });
        });
    };

    /*
    *   QUERY INSTANCES BT DATE
    *   
    *   This method takes a start date and end ate
    */
    function queryInstancesByDate(startDate, endDate) {
        //  DEFINE LOCAL VARIABLES
        //  RETURN ASYNC WORK
        return new Promise(function (resolve, reject) {

            var instances = firebase.database().ref('instances').orderByChild('opens').startAt(startDate).endAt(endDate);

            instances.once("value")
            .then(function(snapshot) {
                resolve(snapshot.val());
            })
            .catch(function(e) {
                reject(e);
            });
        });
    };

    /*
    *   QUERY SHIFTS
    */
    function queryShifts(instanceId) {
        //  DEFINE LOCAL VARIABLES
        //  RETURN ASYNC WORK
        return new Promise(function (resolve, reject) {

            var shifts = firebase.database().ref('shifts').orderByChild('instance_id').equalTo(instanceId);

            shifts.once("value")
            .then(function(snapshot) {
                //console.log('got these shifts', snapshot.val());
                resolve(snapshot.val());
            })
            .catch(function(e) {
                reject(e);
            });
        });
    };

    /*
    *   RESOLVE INSTANCE ACCTS
    *   
    *   This method takes the instance id.
    *   
    */
    function resolveInstanceAccts(data) {
        return new Promise(function(resolve, reject) {
            queryInstanceAccts(data)
            .then(function(s) {
                resolve(s);
            })
            .catch(function(e) {
                reject(e);
            });
        });
    }

    function instanceFiltersTemplate() {
        return {
            "skipped": false,
            "filters": {
                "employees": {},
                "devices": {}
            },
            "sales": {
                "0": { "name": "Gross Sales", "reported": 0, "bold": true, "adjustment": 0.00, "actual": 0, "forecast": 0, "difference": 0},
                "1": { "name": "Returns", "reported": 0, "bold": false, "adjustment": 0.00, "actual": 0, "forecast": 0, "difference": 0 },
                "2": { "name": "Discounts & Comps", "reported": 0, "bold": false, "adjustment": 0.00, "actual": 0, "forecast": 0, "difference": 0 },
                "3": { "name": "Net Sales", "reported": 0, "bold": true, "adjustment": 0.00, "actual": 0, "forecast": 0, "difference": 0 },
                "4": { "name": "Tips", "reported": 0, "bold": false, "adjustment": 0.00, "actual": 0, "forecast": 0, "difference": 0 },
                "5": { "name": "Total", "reported": 0, "bold": true, "adjustment": 0.00, "actual": 0, "forecast": 0, "difference": 0 }
            },
            "payments": {
                "0": { "name": "Total Collected", "reported": 0, "bold": true, "adjustment": 0, "actual": 0, "forecast": 0, "difference": 0 },
                "1": { "name": "Cash", "reported": 0, "bold": false, "adjustment": 0, "actual": 0, "forecast": 0, "difference": 0 },
                "2": { "name": "Card", "reported": 0, "bold": false, "adjustment": 0, "actual": 0, "forecast": 0, "difference": 0 },
                "3": { "name": "Other", "reported": 0, "bold": false, "adjustment": 0, "actual": 0, "forecast": 0, "difference": 0 },
                "4": { "name": "Fees", "reported": 0, "bold": false, "adjustment": 0, "actual": 0, "forecast": 0, "difference": 0 },
                "5": { "name": "Net Total", "reported": 0, "bold": true, "adjustment": 0, "actual": 0, "forecast": 0, "difference": 0 }
            }
        }
    }

    //  RETURN THE METHOD
    return firebaseMod;
};