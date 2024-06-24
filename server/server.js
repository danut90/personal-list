(function () {
	'use strict';
	const cluster = require('cluster');
	const worker = process.env.WEB_CONCURRENCY || 1;

	if (cluster.isMaster) {
		console.log(`Master ${process.pid} is running`);
		for (let i = 0; i < worker; i++) {
			cluster.fork({RUN_CRON: i === 0});
		}

		Object.keys(cluster.workers).forEach(id => console.log('I am running with ID : ' + cluster.workers[id].process.pid));

		cluster.on('exit', function (worker, code, signal) {
			console.log('worker ' + worker.process.pid + ' died');
			if (signal) {
				console.log(`worker was killed by signal: ${signal}`);
			} else if (code !== 0) {
				console.log(`worker exited with error code: ${code}`);
			} else {
				console.log('worker success!');
			}
			cluster.fork();
		});
	} else {
		global.NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
		const express = require('express');
		const config = require('./init/config').init();
		global.config = config;

		const app = express();
		const server = require('http').createServer(app);
		const io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
		const pg = require('./db/initPg');
		const phantomInit = require('./init/phantomInit');
		const emailTransport = require('./init/emailTransport');

		const { createClient } = require("redis");
		const { createAdapter } = require("@socket.io/redis-adapter");

		if (process.env.REDIS_URL) {
			const pubClient = createClient({
				//url: config.redisTls ? process.env.REDIS_TLS_URL : process.env.REDIS_URL,
				url: process.env.REDIS_URL,
				socket: {
					tls: process.env.REDIS_TLS ? process.env.REDIS_TLS : false,
					rejectUnauthorized: false
				}
			});
			const subClient = pubClient.duplicate();
			Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
				io.adapter(createAdapter(pubClient, subClient));
			}).catch(e => console.log('pubClient & subClient connect', e));

			//pubClient.connect();
			//subClient.connect();
			//io.adapter(createAdapter(pubClient, subClient));

			pubClient.on("connect", () => console.log('pubClient connect'));
			pubClient.on("error", (err) => console.log('pubClient error', err));
			//pubClient.on("ready", () => console.log('pubClient ready'));
			//pubClient.on("reconnecting", () => console.log('pubClient reconnecting'));
			//pubClient.on("end", () => console.log('pubClient end'));

			subClient.on("connect", () => console.log('subClient connect'));
			subClient.on("error", (err) => console.log('subClient error', err));
			//subClient.on("ready", () => console.log('subClient ready'));
			//subClient.on("reconnecting", () => console.log('subClient reconnecting'));
			//subClient.on("end", () => console.log('subClient end'));
		}

		Promise.all([pg(config), phantomInit.createPhantomSession(app), emailTransport.createTransport(config)]).then(values => {
			app.locals.config = config;
			app.locals.db = values[0];
			app.locals.ph = values[1];
			app.locals.email = values[2];
			app.locals.io = io;

			require('./init/express')(app, config);
			require('./routes')(app);

			server.listen(config.port, config.ip, () => {
				console.log('Listening on port: %d, env: %s', config.port, config.env);

				io.on('connection', socket => {
					socket.on('join', data => {
						socket.join(data.id);
						socket.join(data.unit.id);
					});
					socket.on('accountDisabled', user => io.sockets.in(user.id).emit('accountDisabled', user));
					socket.on('getOnlineUsers', () => io.sockets.emit('getOnlineUsers'));
					socket.on('imOnline', user => io.sockets.emit('imOnline', user));
					socket.on('pageReload', users => io.sockets.emit('pageReload', users));
					socket.on('reloadUser', data => io.sockets.emit('reloadUser', data));
					//socket.on('disconnect', reason => {console.log(`disconnect socket.io ${reason}`);});
				});
				io.of('/').adapter.on('error', e => console.log('ERROR no redis server', e));

				process.on('exit', () => {
					console.log('exiting phantom session');
					app.locals.ph.exit();
				});
			});
		}).catch(e => console.log('Init sequence error:', e));

		module.exports = app;
	}
}());


//(function () {
//	'use strict';
//
//	global.NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//	const express = require('express');
//	const config = require('./init/config').init();
//	global.config = config;
//
//	let app = express();
//	let server = require('http').createServer(app);
//	//let io = require('socket.io')(server);
//	let pg = require('./db/initPg');
//
//	let phantomInit = require('./init/phantomInit');
//	let emailTransport = require('./init/emailTransport');
//
//	Promise.all([pg(config), phantomInit.createPhantomSession(app)]).then(values => {
//		const [db, phSession] = values;
//		app.locals.config = config;
//		app.locals.email = global.smtpTransport = emailTransport.createTransport();
//		app.locals.db = db;
//		app.locals.ph = phSession;
//		//let dbScr = require('./db/dbScripts');
//		//dbScr.addDefaultUser(db);
//		//require('./utils/dbSync')(app);
//		require('./init/express')(app, config);
//		require('./routes')(app);
//
//		//io.on('connection', function(socket){
//		//  console.log('a user connected');
//		//  socket.on('disconnect', function(){
//		//    console.log('user disconnected');
//		//  });
//		//});
//
//		//io.on('connection', function(socket) {
//		//    console.log('new connection');
//		//    //socket.broadcast.emit('notification', {
//		//    //  message: 'new customer global broadcast'
//		//    //});
//		//    var s = socket;
//		//    //console.log('primul s ', s)
//		//    socket.on('add-customer', function(customer) {
//		//        console.log('face add ', customer.id_unit)
//		//        //console.log('primul s  al doilea', s)
//		//        io.emit('notification', {
//		//            message: 'new customer',
//		//            customer: customer
//		//        });
//		//    });
//		//});
//
//		server.listen(config.port, config.ip, () => {
//			console.log('Listening on port: %d, env: %s', config.port, config.env);
//			process.on('exit', () => {
//				console.log('exiting phantom session');
//				app.locals.ph.exit();
//			});
//		});
//	}).catch(reason => console.log('Init sequence error: ', reason));
//
//	module.exports = app;
//}());