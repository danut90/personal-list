angular.module('ml-app').controller('movieModalEditCtrl', movieModalEditCtrl);
movieModalEditCtrl.$inject = ['$loading', '$uibModalInstance', 'dialogs', 'toastr', 'utils', 'movieModel', 'idMovie'];
function movieModalEditCtrl($loading, $uibModalInstance, dialogs, toastr, utils, movieModel, idMovie) {

	let mm = this, old;

	const load = () => {
		$loading.start('loading-container');
		let t = [];
		t.push(cb => {
			movieModel.forAddEdit.get().$promise.then(r => {
				mm.draftGenders = r.draftGenders;
				mm.actors = r.actors;
				cb();
			}).catch(e => cb(e));
		});
		t.push(cb => {
			movieModel.byId.get({id: idMovie}).$promise.then(r => {
				mm.modal = r;
				old = angular.copy(r);
				cb();
			}).catch(e => cb(e));
		});
		async.parallel(t, e => {
			$loading.finish('loading-container');
			if (e) {
				$uibModalInstance.dismiss();
				toastr.error('An error occurred');
			}
		});
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
		if (!angular.equals(modal, old)) {
			if (validate(modal)) {
				if (!_.isEqual(modal.year, old.year)) {
					modal.year = modal.year.getFullYear();
				}
				$loading.start('loading-container');
				movieModel.simple.save(modal).$promise.then(() => {
					toastr.success('Success');
					$loading.finish('loading-container');
					$uibModalInstance.close();
				}).catch(() => {
					toastr.error('An error occurred');
					$uibModalInstance.dismiss();
				});
			}
		} else {
			toastr.info('No changes have been made');
			$uibModalInstance.dismiss();
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
