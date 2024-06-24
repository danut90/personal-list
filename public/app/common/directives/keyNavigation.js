(function () {
	'use strict';
	angular.module('ml-app').directive('keyNavigation', function () {

		function clearSelection() {
			let sel;
			if ((sel = document.selection) && sel.empty) {
				sel.empty();
			} else {
				if (window.getSelection) {
					window.getSelection().removeAllRanges();
				}
				let activeEl = document.activeElement;
				if (activeEl) {
					let tagName = activeEl.nodeName.toLowerCase();
					if (tagName === 'textarea' || (tagName === 'input' && activeEl.type === 'text')) {
						// Collapse the selection to the end
						activeEl.selectionStart = activeEl.selectionEnd = activeEl.value.length;
					}
				}
			}
		}

		function cursorPosition(node) {
			if (node.selectionStart) {
				return node.selectionStart;
			} else if (!document.selection) {
				return 0;
			}
			//let c = "001";
			//let sel	= document.selection.createRange();
			//let txt	= sel.text;
			//let dul	= sel.duplicate();
			//let len	= 0;
			//try{ dul.moveToElementText(node); }catch(e) { return 0; }
			//sel.text = txt + c;
			//len = (dul.text.indexOf(c));
			//sel.moveStart('character',-1);
			//sel.text = "";
			//return len;
		}

		return function (scope, element) {
			//element.on('keypress.mynavigation', 'input[type="text"]', handleNavigation);
			element.on('keydown', 'input', handleNavigation);
			element.on('keydown', 'textarea', handleNavigation);

			function handleNavigation(e) {
				var arrow = {left: 37, up: 38, right: 39, down: 40};
				// select all on focus
				element.find('input').keydown((e) => {
					// shortcut for key other than arrow keys
					if ($.inArray(e.which, [arrow.left, arrow.up, arrow.right, arrow.down]) < 0) {
						return;
					}

					let input = e.target, td = $(e.target).closest('td');
					let classes = input.classList, mata = [];
					for (let i = 0; i < classes.length; i++) {
						mata.push(classes[i]);
					}
					let isAutocomplete = mata.indexOf('autocomplete') > -1;
					var moveTo = null;
					switch (e.which) {
						case arrow.left:
						{
							if (input.type !== 'date') {
								if (input.selectionStart === 0) {
									moveTo = td.prev('td:has(input,textarea)');
									if (!moveTo[0]) {
										moveTo = td.prev('td').prev('td:has(input,textarea)');
									}
								}
							}
							break;
						}
						case arrow.right:
						{
							if (input.type !== 'date') {
								if (input.selectionEnd === input.value.length) {
									moveTo = td.next('td:has(input,textarea)');
									if (!moveTo[0]) {
										moveTo = td.next('td').next('td:has(input,textarea)');
									}
								}
							}
							break;
						}
						case arrow.up:
						case arrow.down:
						{
							if (!isAutocomplete) {
								let tr = td.closest('tr'), pos = td[0] ? td[0].cellIndex : null, moveToRow = null;
								if (e.which === arrow.down) {
									moveToRow = tr.next('tr');
									if (moveToRow[0]) {
										let inputs = moveToRow[0].getElementsByTagName('input');
										while (inputs && inputs.length === 0) {
											moveToRow = moveToRow.next('tr');
											if (moveToRow[0]) {
												inputs = moveToRow[0].getElementsByTagName('input');
											} else {
												inputs = [{}];
											}
										}
									}
								} else if (e.which === arrow.up) {
									moveToRow = tr.prev('tr');
									if (moveToRow[0]) {
										let inputs = moveToRow[0].getElementsByTagName('input');
										while (inputs && inputs.length === 0) {
											moveToRow = moveToRow.prev('tr');
											if (moveToRow[0]) {
												inputs = moveToRow[0].getElementsByTagName('input');
											} else {
												inputs = [{}];
											}
										}
									}
								}
								if (moveToRow.length) {
									moveTo = $(moveToRow[0].cells[pos]);
								}
							}
							break;
						}
					}
					if (moveTo && moveTo.length) {
						e.preventDefault();
						moveTo.find('input,textarea').each((i, input) => {
							input.focus();
							input.select();
						});
					}
				});

				element.find('textarea').keydown((e) => {
					// shortcut for key other than arrow keys
					if ($.inArray(e.which, [arrow.left, arrow.up, arrow.right, arrow.down]) < 0) {
						return;
					}

					let input = e.target, td = $(e.target).closest('td');
					var moveTo = null;

					switch (e.which) {
						case arrow.left:
						{
							if (input.selectionStart === 0) {
								moveTo = td.prev('td:has(input,textarea)');
							}
							break;
						}
						case arrow.right:
						{
							if (input.selectionEnd === input.value.length) {
								moveTo = td.next('td:has(input,textarea)');
							}
							break;
						}
						case arrow.up:
						case arrow.down:
						{
							let textLength = td[0].getElementsByTagName('textarea')[0].value.length;
							let tr = td.closest('tr');
							let pos = td[0].cellIndex;
							let moveToRow = null;
							if (e.which === arrow.down) {
								if (cursorPosition(td[0].getElementsByTagName('textarea')[0]) === textLength) {
									moveToRow = tr.next('tr');
									if (moveToRow[0]) {
										let inputs = moveToRow[0].getElementsByTagName('textarea');
										while (inputs && inputs.length === 0) {
											moveToRow = moveToRow.next('tr');
											if (moveToRow[0]) {
												inputs = moveToRow[0].getElementsByTagName('textarea');
											} else {
												inputs = [{}];
											}
										}
									}
								}
							} else if (e.which === arrow.up) {
								if (cursorPosition(td[0].getElementsByTagName('textarea')[0]) === 0) {
									moveToRow = tr.prev('tr');
									if (moveToRow[0]) {
										let inputs = moveToRow[0].getElementsByTagName('textarea');
										while (inputs && inputs.length === 0) {
											moveToRow = moveToRow.prev('tr');
											if (moveToRow[0]) {
												inputs = moveToRow[0].getElementsByTagName('textarea');
											} else {
												inputs = [{}];
											}
										}
									}
								}
							}
							if (moveToRow && moveToRow.length) {
								moveTo = $(moveToRow[0].cells[pos]);
							}
							break;
						}
					}
					if (moveTo && moveTo.length) {
						e.preventDefault();
						moveTo.find('input,textarea').each((i, input) => {
							input.focus();
							input.select();
						});
					}
				});

				let key = e.keyCode ? e.keyCode : e.which;
				if (key === 13) {
					clearSelection();
					//var nextElement = focusedElement.parent().next();
					//if (nextElement.find('input').length > 0) {
					//    nextElement.find('input').focus();
					//} else {
					//    nextElement = nextElement.parent().next().find('input').first();
					//    nextElement.focus();
					//}
				}
			}
		};
	});
})();
