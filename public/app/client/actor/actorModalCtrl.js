angular.module('ml-app').controller('actorModalCtrl', actorModalCtrl);
actorModalCtrl.$inject = ['$loading', '$uibModalInstance', 'toastr', 'utils', 'actorModel', 'option'];
function actorModalCtrl($loading, $uibModalInstance, toastr, utils, actorModel, option) {

	let mm = this, old;

	const load = () => {
		$loading.start('loading-container');
		let t = [];
		if (option.idActor) {
			t.push(cb => {
				actorModel.byId.get({id: option.idActor}).$promise.then(r => {
					mm.modal = r;
					old = _.cloneDeep(r);
					cb();
				}).catch(e => cb(e));
			});
		} else {
			mm.modal = {id_user: window.bootstrappedUser.id};
		}
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
			toastr.error('Enter the actor name');
			return utils.focus();
		}
		return true;
	};

	mm.save = modal => {
		if (!angular.equals(modal, old)) {
			if (validate(modal)) {
				$loading.start('loading-container');
				actorModel.simple.save(modal).$promise.then(() => {
					toastr.success('Success');
					$loading.finish('loading-container');
					$uibModalInstance.close(modal);
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

}
