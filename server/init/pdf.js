module.exports = (app) => {
	'use strict';
	let Handlebars = require('handlebars'),
		Swag = require('swag'),
		fs = require("fs"),
		crypto = require("crypto"),
		defaults = null;

	Handlebars.registerHelper('equal', function (lvalue, rvalue, options) {
		return lvalue !== rvalue ? options.inverse(this) : options.fn(this);
	});

	Handlebars.registerHelper('times', function (n, block) {
		let accum = '';
		for (let i = 0; i < n; ++i) {
			accum += block.fn(i);
		}
		return accum;
	});

	Handlebars.registerHelper('concat', function (val) {
		return 'head' + val;
	});

	Handlebars.registerHelper('getLocalityType', function (unit) {
		if (unit.address.localityType == 1) {
			return 'Municipiul <b>' + unit.address.locality + '</b>';
		} else if (unit.address.localityType == 2) {
			return 'Orașul <b>' + unit.address.locality + '</b>';
		} else {
			return 'Comuna <b>' + unit.address.locality + '</b>';
		}
	});

	Handlebars.registerHelper('notEqual', function (lvalue, rvalue, options) {
		return lvalue === rvalue ? options.inverse(this) : options.fn(this);
	});

	Handlebars.registerHelper('equal', function (lvalue, rvalue, options) {
		return lvalue !== rvalue ? options.inverse(this) : options.fn(this);
	});

	Handlebars.registerHelper('compare', function (lval, op, rval, options) {
		switch (op) {
			case '!=':
				return lval != rval ? options.fn(this) : options.inverse(this);
			case '==':
				return lval == rval ? options.fn(this) : options.inverse(this);
			case '===':
				return lval === rval ? options.fn(this) : options.inverse(this);
			case '<':
				return lval < rval ? options.fn(this) : options.inverse(this);
			case '<=':
				return lval <= rval ? options.fn(this) : options.inverse(this);
			case '>':
				return lval > rval ? options.fn(this) : options.inverse(this);
			case '>=':
				return lval >= rval ? options.fn(this) : options.inverse(this);
		}
	});

	Handlebars.registerHelper('compareDif', function (lval, op, rval, dif, options) {
		rval += dif;
		switch (op) {
			case '!=':
				return lval != rval ? options.fn(this) : options.inverse(this);
			case '==':
				return lval == rval ? options.fn(this) : options.inverse(this);
			case '===':
				return lval === rval ? options.fn(this) : options.inverse(this);
			case '<':
				return lval < rval ? options.fn(this) : options.inverse(this);
			case '<=':
				return lval <= rval ? options.fn(this) : options.inverse(this);
			case '>':
				return lval > rval ? options.fn(this) : options.inverse(this);
			case '>=':
				return lval >= rval ? options.fn(this) : options.inverse(this);
		}
	});

	Handlebars.registerHelper('eachData', function (arr, ind) {
		var val = '';
		if (arr[ind] === true) {
			val = 'checked="checked"';
		}
		return val;
	});

	Handlebars.registerHelper('equalIndexDif', function (lval, rval, dif, options) {
		return lval === (rval - dif) ? options.fn(this) : options.inverse(this);
	});

	Handlebars.registerHelper('currency', function (amount) {
		let num = Number(amount);
		return num.format(2, 3, '.', ',') + ' Lei';
	});

	Number.prototype.format = function (n, x, s, c) {
		let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
			num = this.toFixed(Math.max(0, ~~n));

		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	};

	Swag.registerHelpers(Handlebars);


	let format = {
		portrait: {
			tempDir: "./tempReports",
			tplBaseDir: "./server/reports",
			pageSize: "A4",
			width: 1654,
			height: 2339,
			orientation: "portrait",
			pageMargin: "1cm"
		},
		landscape: {
			tempDir: "./tempReports",
			tplBaseDir: "./server/reports",
			pageSize: "A4",
			height: 793,
			width: 1122,
			orientation: "landscape",
			pageMargin: "1cm"
		}
	};

	let capture = function (opts, callback) {
		//let fn = !!opts.headerHtml ? 'function(pageNum, numPages) { var x = \'' + opts.headerHtml.trim().replace(/(\r\n|\n|\r)/gm, "") +
		//'\'; return x.replace("#currentPage#",pageNum).replace("#totalPages#",numPages);}' : null;
		let filePath = defaults.tempDir + "/" + crypto.randomBytes(12).toString('hex') + ".pdf";
		let p;
		try {
			return app.locals.ph.createPage().then(function (page) {
				p = page;
				Promise.all([page.property("paperSize", {
					format: defaults.pageSize,
					orientation: defaults.orientation,
					margin: defaults.pageMargin,
					footer: opts.disableFooter ? null : {
						height: "1cm",
						contents: app.locals.ph.callback(function (pageNum, numPages) {
							return "<h6  style='text-align: center; font-size: 8px; font-weight: normal;'>Pagina " + pageNum + " / " + numPages + "</h6>";
						})
					}
				}), page.property("viewportSize", {
					width: defaults.width,
					height: defaults.height
				}), page.setContent(opts.html, 'content')]).then(() => {
					return page.render(filePath).then(function (err) {
						callback(err, filePath);
					});
				});
			});
		} catch (e) {
			try {
				if (p != null) {
					p.close();
				}
			} catch (e) {
				console.log('err catch');
				callback('Exception rendering pdf:' + e.toString());
			}
			callback('Exception rendering pdf:' + e.toString());
		}
	};

	return {
		renderer: function (opts, callback) {
			let headerHtml = null;
			defaults = format[opts.formatP];
			var e, html, template;
			try {
				if (!opts.tpl) {
					return {mesage: 'No template provided'};
				}
				template = Handlebars.compile(fs.readFileSync(opts.tpl).toString());
				html = template(opts.data);
				if (opts.headerTpl) {
					headerHtml = Handlebars.compile(fs.readFileSync(opts.headerTpl).toString())(opts.data);
				}
			} catch (_error) {
				console.log('catch', _error);
				e = _error;
				let xx = opts.tpl.split('/');
				if (xx.length) {
					let fis = xx[xx.length - 1];
					console.log('Template:', fis);
				}
				if (opts && opts.data) {
					console.log('Err template pdf:', e);
				}
				return callback(_error);
			}
			return capture({
				html: html,
				name: opts.name,
				headerHtml: headerHtml,
				disableFooter: opts.disableFooter
			}, callback);
		}
	};

};
