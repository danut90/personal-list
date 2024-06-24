module.exports = {
	init: () => {
		//init config function
		const _ = require('lodash');
		const path = require('path');
		if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
			require('with-env')();
		}
		let conf = require('konfig')(),
			G = {};
		let rawConf = _.pick(conf, ['common', conf.common.env || process.env]);
		G.config = _.extend({}, rawConf.common, rawConf[conf.common.env] || process.env);
		G.config.path = path.normalize(__dirname + '/../../');
		G.config.roles = {
			admin: 'admin',
			client: 'client',
			guest: 'guest'
		};
		return G.config;
	}
};
