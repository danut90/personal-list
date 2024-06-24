module.exports = {
	addDefaultUser: function addDefaultUser(db) {
		const User = db.User;

		User.count({}).then(function findUser(count) {
			if (count === 0) {
				User.create({
					email: 'ostasuc.danut@gmail.com',
					password: '0000',
					first_name: 'Ostasuc',
					last_name: 'Danut',
					role: 'admin',
					active: true
				}).then(function afterUserCreate(user) {
					console.log('Created admin', user.toJSON());
				}).catch((err) => {
					console.log("Error create default user:", err);
				});
			} else {
				console.log('Skipping add default user:', count);
			}
		}).catch((err) => {
			console.log("Error create default user:", err);
		});
	}
};
