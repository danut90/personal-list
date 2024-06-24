angular.module('ml-app').controller('movieModalAddCtrl', movieModalAddCtrl);
movieModalAddCtrl.$inject = ['$loading', '$uibModalInstance', 'dialogs', 'toastr', 'utils', 'movieModel'];
function movieModalAddCtrl($loading, $uibModalInstance, dialogs, toastr, utils, movieModel) {

	let mm = this, old;

	mm.modal = {view_date: new Date(), id_user: window.bootstrappedUser.id};
	old = _.cloneDeep(mm.modal);

	const load = () => {
		$loading.start('loading-container');
		movieModel.forAddEdit.get().$promise.then(r => {
			mm.draftGenders = r.draftGenders;
			mm.actors = r.actors;
			$loading.finish('loading-container');
		}).catch(() => toastr.error('An error occurred'));
	};

	load();

	const validate = modal => {
		mm.required = {
			name: !modal.name
		};
		if (!modal.name) {
			toastr.error('Enter the movie name');
			return utils.focus();
		}
		return true;
	};

	mm.save = modal => {
		if (validate(modal)) {
			if (modal.year) {
				modal.year = modal.year.getFullYear();
			}
			$loading.start('loading-container');
			movieModel.simple.save(modal).$promise.then(() => {
				$loading.finish('loading-container');
				toastr.success('Success');
				$uibModalInstance.close();
			}).catch(() => {
				toastr.error('An error occurred');
				$uibModalInstance.dismiss();
			});
		}
	};

	mm.close = modal => {
		if (!angular.equals(old, modal)) {
			dialogs.confirm('Confirm closing', `You have data filled in the fields in the add movie form.</br>Do you want to close this form?`).result.then(() => {
				$uibModalInstance.dismiss();
			}).catch(() => null);
		} else {
			$uibModalInstance.dismiss();
		}
	};

}
