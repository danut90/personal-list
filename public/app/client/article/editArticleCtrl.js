angular.module('ml-app').controller('editArticleCtrl', editArticleCtrl);
editArticleCtrl.$inject = ['$scope', '$loading', '$sce', '$uibModal', '$uibModalInstance', 'dialogs', 'toastr', 'fileUpload', 'mlArticle', 'mlFile', 'idOb'];
function editArticleCtrl($scope, $loading, $sce, $uibModal, $uibModalInstance, dialogs, toastr, fileUpload, mlArticle, mlFile, idOb) {

	let mm = this, old;


	mm.getFile = id => {
		mlFile.printById.get({id: id}).$promise.then(resp => {
			if (resp.extension === 'pdf') {
				mm.fileName = resp.name;
				mm.url = $sce.trustAsResourceUrl(resp.data);
				$uibModal.open({
					templateUrl: 'app/clientAdmin/showPdf/showPdf-modal',
					controller: 'showPdfCtrl',
					windowClass: 'full-screen',
					scope: mm
				}).result.catch(() => null);
			} else {
				toastr.info('!!!');
				//utils.saveFile(null, resp.data, resp.name);
			}
		});
	};

	mm.removeFile = modal => {
		dialogs.confirm('Confirmă ștergerea', 'Doriți să ștergeți fișierul încărcat ?', {size: 'sm'}).result.then(() => {
			delete modal.file;
			modal.removeFile = true;
		}).catch(() => null);
	};

	$scope.$watch('modal.file', () => {
		if (mm.modal && mm.modal.file) {
			if (validateFile(mm.modal.file)) {
				let arr = mm.modal.file.name.split('.');
				arr.pop();
				mm.modal.name = arr.join('.');
				mm.modal.has_file = true;
			} else {
				mm.modal.file = null;
				mm.modal.has_file = false;
				let inputFile = document.getElementById('inputFile');
				if (inputFile) {
					inputFile.value = null;
				}
			}
		}
	});

	mm.fileChanged = ob => {
		if (ob[0] && ob[0].name) {
			if (validateFile(ob[0])) {
				mm.modal.file = ob[0];
			}
		}
	};
	function validateFile(doc) {
		//if (doc) {
		//	if (!utils.validatePdf(doc)) {
		//		toastr.error('Documentul nu este un fișier PDF: ' + doc.name + '(' + doc.size + ')');
		//		return false;
		//	}
		//	if (!utils.validateSize(doc)) {
		//		toastr.error('Dimensiune maximă 5MB: ' + doc.name + '(' + doc.size + ')');
		//		return false;
		//	}
		//}
		return true;
	}
	
	$loading.start('loading-container');
	mlArticle.byId.get({id: idOb}).$promise.then(resp => {
		mm.modal = resp;
		old = angular.copy(resp);
		$loading.finish('loading-container');
	}).catch(() => {
		$uibModalInstance.dismiss();
		toastr.error('An error occurred');
	});

	let validation = ob => {
		if (!ob.name) {
			toastr.error('Enter the article name');
			return false;
		}
		return true;
	};

	//$scope.save = modal => {
	//	if (validation(modal)) {
	//		$loading.start('loading-container');
	//		let details = {
	//			name: modal.name,
	//			number: modal.number
	//		};
	//		if (modal.date) {
	//			details.date = modal.date;
	//		}
	//		if (modal.load_date) {
	//			details.load_date = modal.load_date;
	//		}
	//		details.id = modal.id;
	//		fileUpload.simpleUpload(modal.file, details, '/api/file/', (err, data) => {
	//			if (err) {
	//				toastr.error('Eroare la încărcarea fișierului');
	//			} else {
	//				if (data.success) {
	//					socket.emit('modifiedDocument', {login_info: window.bootstrappedUser.login_info, id_unit: window.bootstrappedUser.id_unit, name: modal.name, id_category: modal.id_category});
	//					toastr.success('Fișierul a fost actualizat');
	//					$loading.finish('loading-container');
	//					$uibModalInstance.close();
	//				} else {
	//					toastr.error(data.message + '<br/>' + data.err.join('<br />'));
	//				}
	//				$loading.finish('loading-container');
	//			}
	//		});
	//	}
	//};

	mm.save = modal => {
		if (!angular.equals(modal, old)) {
			if (validation(modal)) {
				mlArticle.simple.save(modal).$promise.then(() => {
					let details = {
						name: modal.name,
						number: modal.number
					};
					if (modal.date) {
						details.date = modal.date;
					}
					if (modal.load_date) {
						details.load_date = modal.load_date;
					}
					details.id = modal.id;
					fileUpload.simpleUpload(modal.file, details, '/api/file/', (err, data) => {
						if (err) {
							toastr.error('Eroare la încărcarea fișierului');
						} else {
							if (data.success) {
								toastr.success('Fișierul a fost actualizat');
								$loading.finish('loading-container');
								$uibModalInstance.close();
							} else {
								toastr.error(data.message + '<br/>' + data.err.join('<br />'));
							}
							$loading.finish('loading-container');
						}
					});

					toastr.success('Success');
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

	//mm.save = modal => {
	//	if (!angular.equals(modal, old)) {
	//		if (validation(modal)) {
	//			mlArticle.simple.save(modal).$promise.then(() => {
	//				toastr.success('Success');
	//				$uibModalInstance.close(modal);
	//			}).catch(() => {
	//				toastr.error('An error occurred');
	//				$uibModalInstance.dismiss();
	//			});
	//		}
	//	} else {
	//		toastr.info('No changes have been made');
	//		$uibModalInstance.dismiss();
	//	}
	//};
}