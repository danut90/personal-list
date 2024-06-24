angular.module('ml-app').service('excelFunction', [function () {

	let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC'];
	let border = {
		top: {style: 'thin', color: {auto: 1}},
		bottom: {style: 'thin', color: {auto: 1}},
		left: {style: 'thin', color: {auto: 1}},
		right: {style: 'thin', color: {auto: 1}}
	};

	this.addTitle = (sheet, title, rowCount, across) => {
		// sheet['!cols'] = [];
		sheet['A' + rowCount.value] = {t: 's', v: title, s: {alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}, font: {bold: true, name: 'Arial', sz: 10}}};
		sheet['!merges'].push({s: {r: rowCount.value - 1, c: 0}, e: {r: rowCount.value - 1, c: 0 + across}});
		rowCount.value += 2;
	};

	this.addHeader = (sheet, header, rowCount) => {
		for (let i = 0, ln = header.length; i < ln; i++) {
			let head = header[i];
			for (let j = 0, lng = head.length; j < lng; j++) {
				let cell = {t: 's', v: head[j].name, s: {alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}, font: {bold: true, name: 'Arial', sz: 10}, fill: {fgColor: {rgb: 'D8D8D8'}}, border: {top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'thin'}}}};
				if (head[j].color) {
					cell.s.fill = {fgColor: {rgb: head[j].color}};
				}
				if (head[j].border) {
					cell.s.border = border;
				}
				if (head[j].wch) {
					if (head[j].ind) {
						sheet['!cols'][head[j].ind] = {wch: head[j].wch};
					} else {
						sheet['!cols'].push({wch: head[j].wch});
					}
				}
				sheet[alphabet[head[j].ind] + rowCount.value] = cell;
				if (head[j].across) {
					for (let k = head[j].ind + 1; k <= head[j].ind + head[j].across; k++) {
						sheet[alphabet[k] + rowCount.value] = {s: {border: head[j].border ? border : {}, alignment: {}}};
					}
					sheet['!merges'].push({s: {r: rowCount.value - 1, c: head[j].ind}, e: {r: rowCount.value - 1, c: head[j].ind + head[j].across}});
				} else if (head[j].down) {
					sheet[alphabet[head[j].ind] + (rowCount.value + head[j].down)] = {s: {border: head[j].border ? border : {}, alignment: {}}};
					sheet['!merges'].push({s: {r: rowCount.value - 1, c: head[j].ind}, e: {r: rowCount.value + head[j].down - 1, c: head[j].ind}});
				}
			}
			rowCount.value++;
		}
	};

	this.addRow = (sheet, row, rowCount, columns, sameRow) => {
		for (let i = 0, ln = columns.length; i < ln; i++) {
			let cell = {t: columns[i].type, v: '', s: {alignment: {}, font: {}, border: {top: {style: 'thin'}, bottom: {style: 'thin'}, left: {style: 'thin'}, right: {style: 'thin'}}}};
			if (!_.isNil(row[columns[i].columnName])) {
				cell.v = columns[i].type === 'n' ? parseFloat(row[columns[i].columnName]) : row[columns[i].columnName];
			}
			if (columns[i].wrapText) {
				cell.s.alignment.wrapText = columns[i].wrapText;
			}
			if (columns[i].horizontal) {
				cell.s.alignment.horizontal = columns[i].horizontal;
			}
			if (columns[i].vertical) {
				cell.s.alignment.vertical = columns[i].vertical;
			} else {
				cell.s.alignment.vertical = 'center';
			}
			if (columns[i].color) {
				cell.s.fill = {fgColor: {rgb: columns[i].color}};
			}
			if (columns[i].z) {
				cell.z = columns[i].z;
			}
			if (columns[i].border) {
				cell.s.border = border;
			}
			if (columns[i].bold || row.bold) {
				cell.s.font.bold = columns[i].bold || row.bold;
			}
			if (columns[i].wch) {
				sheet['!cols'][columns[i].ind] = {wch: columns[i].wch};
			}
			cell.s.font.name = 'Arial';
			cell.s.font.sz = '8';
			sheet[alphabet[columns[i].ind] + rowCount.value] = cell;
			if (columns[i].across) {
				for (let k = columns[i].ind + 1; k <= columns[i].ind + columns[i].across; k++) {
					sheet[alphabet[k] + rowCount.value] = {s: {border: columns[i].border ? border : {}, alignment: {}}};
				}
				sheet['!merges'].push({s: {r: rowCount.value - 1, c: columns[i].ind}, e: {r: rowCount.value - 1, c: columns[i].ind + columns[i].across}});
			} else if (columns[i].down) {
				sheet[alphabet[columns[i].ind] + rowCount.value] = {s: {border: columns[i].border ? border : {}, alignment: {}}};
				sheet['!merges'].push({s: {r: rowCount.value - 1, c: columns[i].ind}, e: {r: rowCount.value + columns[i].down - 1, c: columns[i].ind}});
			}
			// }
		}
		!sameRow && rowCount.value++;
	};

	this.makeRef = (sheet, colLength, rowCount) => {
		if (colLength > alphabet.length) {
			sheet['!ref'] = alphabet[0] + '1:' + alphabet[0] + alphabet[colLength - alphabet.length] + rowCount.value;
		} else {
			sheet['!ref'] = alphabet[0] + '1:' + alphabet[colLength] + rowCount.value;
		}
	};

	this.createExcel = (sheet, sheetName, extension) => {
		let workbook = {SheetNames: [], Sheets: {}};
		workbook.SheetNames.push(sheetName);
		workbook.Sheets[sheetName] = sheet;
		let wbout = XLSX.write(workbook, {bookType: extension, bookSST: false, type: 'binary', cellStyles: true});
		return makeBlob(wbout);
	};

	function makeBlob(s) {
		let buf = new ArrayBuffer(s.length);
		let view = new Uint8Array(buf);
		for (let i = 0; i < s.length; i++) {
			view[i] = s.charCodeAt(i) & 0xFF;
		}
		return buf;
	}

}]);
