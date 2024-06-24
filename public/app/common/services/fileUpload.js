angular.module('ml-app').service('fileUpload', ['$http', function ($http) {
	'use strict';
	this.saveFile = (file, details, uploadUrl, callback)=> {
		var fd = new FormData();
		fd.append('file', file);
		for (let key in details) {
			if (details.hasOwnProperty(key)) {
				fd.append(key, details[key]);
			}
		}
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).then(data => callback(null, data.data)).catch(err => callback(err));
	};

	this.simpleUpload = function (file, details, uploadUrl, callback) {
		var fd = new FormData();
		fd.append('file', file);
		for (let key in details) {
			if (details.hasOwnProperty(key)) {
				fd.append(key, details[key]);
			}
		}
		$http.put(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).then(data=> callback(null, data.data)).catch(err=> callback(err));
	};
}]);
