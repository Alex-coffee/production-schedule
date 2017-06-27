//fs ====================================
var fs = require('fs');
var q = require('q');
var async = require('async');

var Console = require('console').Console;
var spawn = require('child_process').spawn;
var airportNodeConfig = require('../config/airportNode');


function groupOptimize(optmizeParam){
    let deferred = q.defer();
    var orCommand = [];
    orCommand.push(airportNodeConfig.systemPath + airportNodeConfig.orCommand);
    orCommand.push(airportNodeConfig.systemPath + airportNodeConfig.outputPath);
    orCommand.push(optmizeParam);

    console.log("command: " + orCommand.join(" "));

    var bat = spawn('cmd', ['/s', '/c', orCommand.join(" ")]);
    bat.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    bat.stderr.on('error', function (data) {
        console.log(data.toString());
    });

    bat.on('exit', function (code) {
        if(code == 0){
            console.log(optmizeParam + "  finished.");
            deferred.resolve(200);
        }else{
            console.log(optmizeParam + "  code: " + code);
            deferred.reject(500);
        }
    });

    return deferred.promise;
}

module.exports = function(app) {

    app.post('/api/saveJSON/', function(req, res){
        fs.open(airportNodeConfig.path + "/json/" + req.body.fileName, "w",function(err, fd){
            var points = JSON.stringify(req.body.content);
            var buf = new Buffer(points);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.end('{"status" : "success", "message" : "数据已保存"}');
        })
    }),

    app.post('/api/saveParameter/', function(req, res){

        fs.open(airportNodeConfig.dataPath + "/Parameters.json", "w",function(err, fd){
            var parameters = JSON.stringify(req.body);
            var buf = new Buffer(parameters);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.status(200).send({message: "参数已保存"});
        })
    }),

    app.post('/api/saveFlight', function(req, res){

        fs.open(airportNodeConfig.dataPath + "/Flights.json", "w",function(err, fd){
            var parameters = JSON.stringify(req.body);
            var buf = new Buffer(parameters);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.status(200).send({message: "航班数据已保存"});
        })
    }),

    app.post('/api/saveDistance', function(req, res){

        fs.open(airportNodeConfig.dataPath + "/Distances.json", "w",function(err, fd){
            var parameters = JSON.stringify(req.body);
            var buf = new Buffer(parameters);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.status(200).send({message: "登机口距离数据已保存"});
        })
    }),


    app.post('/api/saveStaff', function(req, res){

        fs.open(airportNodeConfig.dataPath + "/Staffs.json", "w",function(err, fd){
            var parameters = JSON.stringify(req.body);
            var buf = new Buffer(parameters);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.status(200).send({message: "登机口距离数据已保存"});
        })
    }),

    app.post('/api/aggregatedFlights/save', function(req, res){

        fs.open(airportNodeConfig.dataPath + "/AggregatedFlights.json", "w",function(err, fd){
            var parameters = JSON.stringify(req.body);
            var buf = new Buffer(parameters);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.status(200).send({message: "航班组合数据已保存"});
        })
    }),

    app.post('/api/aggregatedFlights/generate', function(req, res){

        var orCommand = [];
        orCommand.push(airportNodeConfig.systemPath + airportNodeConfig.orCommand);
        orCommand.push(airportNodeConfig.systemPath + airportNodeConfig.outputPath);
        orCommand.push("aggregate");
        orCommand.push("M");
        orCommand.push("I");
        orCommand.push("I1");
        orCommand.push("false");

        console.log("command: " + orCommand.join(" "));

        var bat = spawn('cmd', ['/s', '/c', orCommand.join(" ")]);
        bat.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        bat.stderr.on('error', function (data) {
            console.log(data.toString());
        });

        bat.on('exit', function (code) {
            console.log("Code: " + code);
            if(code == 0){
                res.status(200).send({
                    message: "已生成结果"
                });
            }else{
                res.status(500).send({
                    message: "运行失败，代码: " + code
                });
            }
        });
    }),

    app.get('/api/solutions/get', function(req, res){
        let solutions = [];
        let files = fs.readdirSync(airportNodeConfig.dataPath);
        files.forEach(function(fileObj){
            if(fileObj.indexOf("Solution_") == 0){
                let solutionContent = fs.readFileSync(airportNodeConfig.dataPath + "/" + fileObj, "utf8");
                solutions = solutions.concat(JSON.parse(solutionContent));
            }
        })
        res.status(200).send(solutions);
    }),

    app.post('/api/solutions/reset', function(req, res){
        let files = fs.readdirSync(airportNodeConfig.dataPath);
        files.forEach(function(fileObj){
            if(fileObj.indexOf("Solution_") == 0){
                fs.unlinkSync(airportNodeConfig.dataPath + "/" + fileObj);
            }
        })

        let flightCoverStatusContent = fs.readFileSync(airportNodeConfig.dataPath + "/flightCoverStatus.json", "utf8");
        let flightCoverStatus = JSON.parse(flightCoverStatusContent);
        flightCoverStatus.forEach(function(status){
            status.isCovered = false;
        })
        fs.open(airportNodeConfig.dataPath + "/flightCoverStatus.json", "w",function(err, fd){
            var parameters = JSON.stringify(flightCoverStatus);
            var buf = new Buffer(parameters);
            fs.writeSync(fd,buf,0,buf.length,0);
            res.status(200).send({message: "Files Deleted"});
        })
    }),

    app.post('/api/runOR', function(req, res) {
        var orCommand = [];
        orCommand.push(airportNodeConfig.systemPath + airportNodeConfig.orCommand);
        orCommand.push(airportNodeConfig.systemPath + airportNodeConfig.outputPath);
        orCommand.push(req.body.model);
        orCommand.push(req.body.shift);
        orCommand.push(req.body.staffGroup);
        orCommand.push(req.body.staffGroup + req.body.subGroup);
        orCommand.push(req.body.lisence);

        console.log("command: " + orCommand.join(" "));

        var bat = spawn('cmd', ['/s', '/c', orCommand.join(" ")]);
        bat.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        bat.stderr.on('error', function (data) {
            console.log(data.toString());
        });

        bat.on('exit', function (code) {
            console.log("Code: " + code);
            if(code == 0){
                res.status(200).send({
                    message: "已生成结果"
                });
            }else{
                res.status(500).send({
                    message: "运行失败，代码: " + code
                });
            }
        });
    }),
    app.post('/api/batch/runOR', function(req, res) {
        async.series({
            MII1False: function(callback){
                groupOptimize("optimize M I I1 false").then(function (res) {
                    callback(null, res);
                }, function (err) {
                    callback(null, 500);
                })
            },
            MII1True: function(callback){
                groupOptimize("optimize M I I1 true").then(function (res) {
                    callback(null, res);
                }, function (err) {
                    callback(null, 500);
                })
            },
            MDD1False: function(callback){
                groupOptimize("optimize M D D1 false").then(function (res) {
                    callback(null, res);
                }, function (err) {
                    callback(null, 500);
                })
            },
            MDD1True: function(callback){
                groupOptimize("optimize M D D1 true").then(function (res) {
                    callback(null, res);
                }, function (err) {
                    callback(null, 500);
                })
            },
            // MII2False: function(callback){
            //     groupOptimize("optimize M I I2 false").then(function (res) {
            //         callback(null, res);
            //     }, function (err) {
            //         callback(null, 500);
            //     })
            // },
            // MII2True: function(callback){
            //     groupOptimize("optimize M I I2 true").then(function (res) {
            //         callback(null, res);
            //     }, function (err) {
            //         callback(null, 500);
            //     })
            // },
            // MDD2False: function(callback){
            //     groupOptimize("optimize M D D2 false").then(function (res) {
            //         callback(null, res);
            //     }, function (err) {
            //         callback(null, 500);
            //     })
            // },
            // MDD2True: function(callback){
            //     groupOptimize("optimize M D D2 true").then(function (res) {
            //         callback(null, res);
            //     }, function (err) {
            //         callback(null, 500);
            //     })
            // },
            KPIMDD1True: function(callback){

                let solutions = [];
                let files = fs.readdirSync(airportNodeConfig.dataPath);
                files.forEach(function(fileObj){
                    if(fileObj.indexOf("Solution_") == 0){
                        let solutionContent = fs.readFileSync(airportNodeConfig.dataPath + "/" + fileObj, "utf8");
                        solutions = solutions.concat(JSON.parse(solutionContent));
                    }
                })
                fs.open(airportNodeConfig.dataPath + "/Solutions.json", "w",function(err, fd){
                    var parameters = JSON.stringify(solutions);
                    var buf = new Buffer(parameters);
                    fs.writeSync(fd,buf,0,buf.length,0);

                    groupOptimize("kpi M D D1 true").then(function (res) {
                        callback(null, res);
                    }, function (err) {
                        callback(null, 500);
                    })
                })
            },
        },
        function(err, results) {
            console.log(results);
            // results is now equal to: {one: 1, two: 2}
            res.status(200).send({
                message: "已生成结果"
            });
        });
    }),
    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/demo/index.html');
    });

};