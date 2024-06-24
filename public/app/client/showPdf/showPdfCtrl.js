angular.module('ml-app').controller('showPdfCtrl', showPdfCtrl);
showPdfCtrl.$inject = ['$scope', '$sce', 'options'];
function showPdfCtrl($scope, $sce, options) {

	let isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
	let chromeVersion = isChrome ? parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) : null;
	$scope.showIfrm = chromeVersion && chromeVersion <= 50 ? true : false;

	$scope.fileName = options.fileName;
	$scope.url = $sce.trustAsResourceUrl(URL.createObjectURL(options.file));

	$scope.download = () => {
		let a = document.createElement('a');
		a.download = !!$scope.fileName ? $scope.fileName + (options.fileExtension ? '.' + options.fileExtension : '.pdf') : null;
		a.href = $scope.url;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
}