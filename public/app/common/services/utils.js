angular.module('ml-app').service('utils', ['$uibModal', '$loading', '$timeout', function ($uibModal, $loading, $timeout) {

	this.saveFile = (blobType, data, fileName) => {
		let a = document.createElement('a');
		document.body.appendChild(a);
		a.href = blobType ? window.URL.createObjectURL(new Blob([data], {'type': 'application/' + blobType})) : data;
		a.download = fileName;
		a.click();
		window.URL.revokeObjectURL(a.href);
	};

	// set height for view by viewId
	this.setViewHeight = (viewId, bottom) => {
		let id = viewId ? viewId : 'view';
		let e = document.getElementById(id);
		if (e) {
			let distanceToTop = e.getBoundingClientRect().top + (bottom ? bottom : 30);
			let vh = window.innerHeight;
			if (vh > 450) {
				e.style.maxHeight = vh - distanceToTop + 'px';
			}
		}
	};

	// set height for uiGrid
	this.setGridHeight = (id, lng, resize, bottom) => {
		let e = document.getElementById(id);
		if (e) {
			let distanceToTop = e.getBoundingClientRect().top + 15;
			let height = window.innerHeight - distanceToTop - (bottom ? bottom : 0);
			let rowsHeight = lng * 30 + 110;
			e.style.height = (rowsHeight < height ? rowsHeight : height) + 'px';
			if (resize) {
				$(window).trigger('resize');
			}
		}
	};

	this.openLink = link => {
		let a = document.createElement('a');
		document.body.appendChild(a);
		a.href = link;
		a.target = '_blank';
		a.click();
	};

	this.openPdfModal = (options, uibModalInstance) => {
		$loading.finish('loading-container');
		$uibModal.open({
			templateUrl: 'app/client/showPdf/showPdf',
			controller: 'showPdfCtrl',
			windowClass: 'full-screen',
			resolve: {options: () => options}
		}).result.catch(() => {
			if (uibModalInstance) {
				uibModalInstance.dismiss();
			}
		});
	};

	this.moveElemFirst = (arr, col, val) => {
		if (arr.length && col && val) {
			let ind;
			for (let i = 0, lng = arr.length; i < lng; i++) {
				if (arr[i][col] === val) {
					ind = i;
					break;
				}
			}
			let element = arr[ind];
			arr.splice(ind, 1);
			arr.splice(0, 0, element);
			return arr;
		}
		return arr;
	};

	this.focus = element => {
		element = element ? element : 'input';
		let input;
		if (element === 'input') {
			input = angular.element('input.ng-invalid').first();
		}
		if (element === 'textarea') {
			input = angular.element('textarea.ng-invalid').first();
		}
		if (element === 'uiSelect') {
			input = angular.element('div.select2.ng-invalid').first().find('input');
		}
		$timeout(() => input.focus());
		return false;
	};

}]);
