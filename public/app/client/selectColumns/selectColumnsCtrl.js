/**
 * Created by Danut on 02-Jan-21.
 */

angular.module('ml-app').controller('selectColumnsCtrl', selectColumnsCtrl);
selectColumnsCtrl.$inject = ['$uibModalInstance', 'toastr', 'header', 'body'];
function selectColumnsCtrl($uibModalInstance, toastr, header, body) {

	let mm = this;

	for (let ob of header[0]) {
		ob.selected = true;
	}
	mm.header = header;

	let validation = arr => {
		let tmp = _.filter(arr, {selected: true});
		if (!tmp.length) {
			toastr.error('Select at least one column');
			return false;
		}
		return true;
	};

	mm.save = () => {
		if (validation(mm.header[0])) {
			for (let i = 0; i < header[0].length; i++) {
				body[i].selected = header[0][i].selected;
			}
			header[0] = _.filter(header[0], {selected: true});
			body = _.filter(body, {selected: true});
			for (let i = 0; i < header[0].length; i++) {
				header[0][i].ind = i;
				body[i].ind = i;
			}
			$uibModalInstance.close({header, body});
		}
	};
}
