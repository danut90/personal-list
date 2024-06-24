'use strict';

exports.unauthorised = unauthorised;
exports.unauthenticated = unauthenticated;
exports.loggedIn = loggedIn;
exports.generic = generic;
exports.error = error;
exports.success = success;

function unauthorised(res, message) {
	message = message || 'unauthorised';
	res.status(401);
	res.send({success: false, message: message});
}

function unauthenticated(res, message) {
	message = message || 'unauthenticated';
	res.status(403);
	res.send({success: false, message: message});
}

function loggedIn(res, user, message) {
	message = message || 'Welcome';
	res.send({success: true, message: message, user: user});
}

function generic(res, data, message) {
	message = message || '';
	res.send({success: true, message: message, data: data});
}

function error(res, message, err) {
	message = message || 'An error occurred';
	res.send({success: false, message: message, err: err});
}

function success(res, message) {
	message = message || 'Success!!';
	res.send({success: true, message: message});
}
