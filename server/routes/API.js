/*
*   API ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var cldb 		= require('../dbScripts/db-team-checklists.js');
    var ivdb        = require('../dbScripts/db-inventory.js');
    var asprop      = require('../asprop/asprop.js'); 
    var intuit      = require('../intuit/intuit.js');
    var proReport   = require('../asprop/prop-reporting.js');
    var APIRoutes   = require('express').Router();

    //	GET: API/data/allChecklists
    APIRoutes.get('/data/allChecklists', function(req, res) {
        
        //run the requird function
        cldb.getAllChecklists().then(function success(s) {
            
            //return an affirmative status code
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(JSON.stringify(s));

        }).catch(function error(e) {
            
            //return an error status code
            res.sendStatus(550);

        });
        
    });

    //	GET: API/data/aChecklist/:listId
    APIRoutes.get('/data/aChecklist/:listId', function(req, res) {
        
        //run the requird function
        cldb.getAChecklist(req.params.listId).then(function success(s) {
            
            //return an affirmative status code
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(JSON.stringify(s));

        }).catch(function error(e) {
            
            //return an error status code
            res.sendStatus(550);

        });
        
    });

    /*
    *   GET:    COMPILE DAILY RECAPS
    *   URL:    API/report/complieDailyRecaps
    * 
    *   This endpoint is used to compile the daily recaps
    */
    APIRoutes.get('/report/compileDailyRecaps', function(req, res) {
        //  NOTIFY PROGRESS
        console.log('compiling daily recaps');

        //  RUN THE METHOD
        asprop.reports.buildDailyRecap()
        .then(function success(s) {
            res.status(200);
            res.send(s);
        }).catch(function error(e) {
            res.status(550);
            res.send(e);
        });

    });

    /*
    *   GET:    PUBLISH DAILY RECAPS
    *   URL:    API/report/publishDailyRecaps
    * 
    *   This endpoint is used to compile the daily recaps
    */
    APIRoutes.get('/report/publishDailyRecaps', function(req, res) {
        //  NOTIFY PROGRESS
        console.log('publishing daily recaps');

        //  RUN THE METHOD
        asprop.reports.publishDlyRecps()
        .then(function success(s) {
            res.status(200);
            res.send(s);
        }).catch(function error(e) {
            res.status(550);
            res.send(e);
        });

    });

    /*
    *   GET: PUBLISH A SINGLE DAILY RECAP
    *   URL: API/report/publishARecap/:instanecId
    * 
    *   This endpoint facilitates the publishing of singular, approved Daily Recaps
    */
    APIRoutes.get('/report/publishARecap/:instanceId', function(req, res) {
        //  DEFINE LOCAL VARIABLES

        //  NOTIFY PROGRESS
        console.log('publishing Daily Recap', req.params.instanceId);

        proReport.dailyRecaps.singleRecapPublish(req.params.instanceId)
        .then(function success(s) {
            //return an affirmative status code
            res.status(200);
            res.send(s);
        }).catch(function error(e) {
            //return an error status code
            res.status(550);
            res.send(e);
        });

    });

    /*
    *   GET:    APPROVE DAILY RECAPS
    *   URL:    API/report/approveDailyRecaps
    * 
    *   This endpoint facilitates approval of the daily recaps
    */
    APIRoutes.get('/report/approveDailyRecaps', function(req, res) {
            //  NOTIFY PROGRESS
            console.log('approval of the daily recaps');

            //  RUN THE METHOD
            proReport.dailyRecaps.approve()
            .then(function success(s) {
                res.status(200);
                res.send(s);
            }).catch(function error(e) {
                res.status(550);
                res.send(e);
            });

    });

    APIRoutes.get('/report/instance/:instanceId', function(req, res) {

        console.log('got this param',req.params.instanceId );
        //run the requird function
        asprop.reports.instance(req.params.instanceId).then(function success(s) {
            
            //return an affirmative status code
            //res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(s);

        }).catch(function error(e) {
            
            //return an error status code
            res.status(550);
            res.send(e);
        });

    });

    /*
    *   GET:    INTUIT LOGIN REDIRECT
    *   URL:    API/intuit/authorize
    */
    APIRoutes.get('/intuit/authorize', function(req, res) {
        //  DEFINE LOCAL VARAIBLES
        // Redirect the authUri 
        res.redirect(intuit.authorize());
    });

    /*
    *   GET:    AUTH TOKEN FROM INTUIT
    *   URL:    API/intuit/callback
    */
   APIRoutes.get('/intuit/callback', function(req, res) {
        //  DEFINE LOCAL VARAIBLES
        
        // Parse the redirect URL for authCode and exchange them for tokens
        var parseRedirect = req.url;
        
        // Exchange the auth code retrieved from the **req.url** on the redirectUri
        oauthClient.createToken(parseRedirect)
        .then(function(authResponse) {
            console.log('The Token is  '+ JSON.stringify(authResponse.getJson()));
        })
        .catch(function(e) {
            console.error("The error message is :"+e.originalMessage);
            console.error(e.intuit_tid);
        });
        
    });


    return APIRoutes;
})();