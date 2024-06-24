angular.module('ml-app').config(function ($translateProvider, dialogsProvider) {
	dialogsProvider.setSize('sm');
	dialogsProvider.useBackdrop('static');
	dialogsProvider.useEscClose(false);
});
