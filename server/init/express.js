module.exports = (app, config)=> {
	'use strict';
	let express = require('express'),
		morgan = require('morgan'),
		compression = require('compression'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		favicon = require('serve-favicon'),
		path = require('path'),
		helmet = require('helmet'),
		multer = require('multer'),
		timeout = require('express-timeout-handler');

	let options = {
		timeout: 27000,
		onTimeout: function (req, res) {
			let logError = require('../utils/utils')(app).logError;
			let body = req.body ? JSON.stringify(req.body) : '';
			logError(req.user, 'Request timeout', `url: ${req.originalUrl}, method: ${req.method}, body: ${body}`);
			res.status(503).end();
		}
		//disable: ['write', 'setHeaders', 'send', 'json', 'end']
	};
	app.use(timeout.handler(options));
	app.use(compression());
	if ('dev' === config.env) {
		app.use(helmet({
			crossOriginEmbedderPolicy: false,
			crossOriginOpenerPolicy: false,
			crossOriginResourcePolicy: false,
			originAgentCluster: false,
			contentSecurityPolicy: false
		}));
	} else {
		app.use(helmet({
			originAgentCluster: false,
			contentSecurityPolicy: {
				// defaults
				//directives: {
				//  defaultSrc: ['self'],
				//  baseUri: ['self'],
				//  blockAllMixedContent: [],
				//  fontSrc: ['self', 'https:', 'data:'],
				//  frameAncestors: ['self'],
				//  imgSrc: ['self', 'data:'],
				//  objectSrc: ['none'],
				//  scriptSrc: ['self'],
				//  scriptSrcElem: ['self'],
				//  scriptSrcAttr: ['none'],
				//  styleSrc: ['self', 'https:', 'unsafe-inline'],
				//  styleSrcElem: ['self', 'https:', 'unsafe-inline'],
				//  upgradeInsecureRequests: []
				//},

				directives: {
					defaultSrc: ["'self'", 'data:'],

					baseUri: ["'self'"],
					blockAllMixedContent: [],

					connectSrc: ["'self'", 'data:', 'https:', 'ws://localhost:8002'],

					fontSrc: ["'self'", 'https:'],
					frameAncestors: ['self'],
					frameSrc: ['blob:'],

					imgSrc: ["'self'", 'data:', 'https:'],

					objectSrc: ["'self'", 'blob:'],

					//scriptSrc: ["'self'", "data:"],
					scriptSrc: ["'self'", "data:", "'unsafe-inline'"], // test firefox
					scriptSrcAttr: ['none', "'unsafe-inline'"],
					scriptSrcElem: ["'self'", 'data:', "'unsafe-inline'", "'unsafe-eval'", 'https:'],
					styleSrc: ["'self'", "data:", "'unsafe-inline'", "'unsafe-eval'"],
					styleSrcElem: ["'self'", "data:", "'unsafe-inline'", "'unsafe-eval'", 'https:'],

					upgradeInsecureRequests: []
				},
				reportOnly: false
			}
		}));
	}
	app.disable('x-powered-by');
	app.use(express.static(path.join(config.path, '/public')));
	app.set('views', config.path + '/server/views');
	app.set('view engine', 'pug');
	app.use(favicon('./public/app/images/favicon.ico'));
	app.use(multer({dest: './tempReports/'}).any());
	app.use(bodyParser.json({limit: '10mb'}));
	app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
	app.use(cookieParser());
	app.set('appPath', config.path + '/public');
	app.use(morgan('dev'));

	if ('dev' === config.env) {
		//app.use(require('connect-livereload')());
		app.use(require('connect-livereload')({port: 35730}));
		app.disable('view cache');
	}
};
