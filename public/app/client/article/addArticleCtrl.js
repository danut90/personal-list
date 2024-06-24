angular.module('ml-app').controller('addArticleCtrl', addArticleCtrl);
addArticleCtrl.$inject = ['$scope', '$loading', '$uibModalInstance', 'toastr', 'fileUpload', 'mlArticle'];
function addArticleCtrl($scope, $loading, $uibModalInstance, toastr, fileUpload, mlArticle) {

	let mm = this;

	mm.modal = {read_date: new Date()};

	$scope.$watch('mm.modal.file', () => {
		if (mm.modal.file) {
			if (validateFile(mm.modal.file)) {
				let arr = mm.modal.file.name.split('.');
				arr.pop();
				mm.modal.file_name = arr.join('.');
			} else {
				mm.modal.file = null;
				let inputFile = document.getElementById('inputFile');
				if (inputFile) {
					inputFile.value = null;
				}
			}
		}
	});
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

	let validation = ob => {
		if (!ob.name) {
			toastr.error('Enter the article name');
			return false;
		}
		return true;
	};

	mm.save = modal => {
		if (validation(modal)) {
			$loading.start('loading-container');
			mlArticle.simple.save(modal).$promise.then(resp => {
				let details = {
					name: modal.file_name,
					id_article: resp.id
				};
				if (mm.modal.file) {
					fileUpload.saveFile(mm.modal.file, details, '/api/file', (err, data) => {
						if (err) {
							toastr.error('File load error');
						} else {
							if (data.success) {
								toastr.success('File has been loaded');
							} else {
								toastr.error(data.message + '<br/>' + data.err.join('<br />'));
							}
							$loading.finish('loading-container');
							$uibModalInstance.close();
						}
					});
				} else {
					$loading.finish('loading-container');
					toastr.success('Success');
					$uibModalInstance.close();
				}
			}).catch(() => {
				toastr.error('An error occurred');
				$uibModalInstance.dismiss();
			});
		}
	};
}