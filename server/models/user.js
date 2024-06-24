let auth = require('../utils/authentication');
module.exports = (sequelize, DataType) => {
	let model = sequelize.define('User', {
		first_name: {
			type: DataType.STRING
		},
		last_name: {
			type: DataType.STRING
		},
		email: {
			type: DataType.STRING,
			unique: true,
			allowNull: false
		},
		role: {
			type: DataType.STRING
		},
		phone: {
			type: DataType.STRING
		},
		owner: {
			type: DataType.INTEGER
		},
		active: {
			type: DataType.BOOLEAN
		},
		activity: {
			type: DataType.JSON
		},
		password: {
			type: DataType.STRING
		},
		salt: {
			type: DataType.STRING,
			allowNull: false,
			defaultValue: auth.createSalt
		}
	}, {
		//instanceMethods: {
		//	authenticate: function (password) {
		//		return auth.hashPwd(this.salt, password) === this.hashed_pwd;
		//	},
		//	toJSON: function () {
		//		let values = this.get({plain: true});
		//		delete values.password;
		//		delete values.salt;
		//		return values;
		//	}
		//},
		timestamps: true
	});

	model.addHook('beforeCreate', function beforeCreateUser(user) {
		user.password = auth.hashPwd(user.salt, user.password);
		return user;
	});

	return model;
};
