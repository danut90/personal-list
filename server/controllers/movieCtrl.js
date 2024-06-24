module.exports = db => {
	'use strict';
	const {success: rhs , error: rh} = require('../utils/requestHandler');
	const saveError = require('../utils/utilsDb')(db).saveError;
	const _ = require('lodash');
	const async = require('async');

	return {
		createUpdate: (req, res) => {
			if (!req.body.id) {
				/** create new movie **/
				db.models.Movie.create(req.body).then(movie => {
					db.query(`SELECT id, name FROM "DraftActorRole" ORDER BY id`, {type: db.QueryTypes.SELECT}).then(actorRoles => {
						let tmp, movieActors = [];
						if (req.body.ids_director && req.body.ids_director.length) {
							tmp = _.find(actorRoles, {name: 'Director'});
							if (tmp) {
								for (let i = 0; i < req.body.ids_director.length; i++) {
									movieActors.push({id_draft_actor_role: tmp.id, id_actor: req.body.ids_director[i], id_movie: movie.id});
								}
							}
						}
						if (req.body.ids_writer && req.body.ids_writer.length) {
							tmp = _.find(actorRoles, {name: 'Writer'});
							if (tmp) {
								for (let i = 0; i < req.body.ids_writer.length; i++) {
									movieActors.push({id_draft_actor_role: tmp.id, id_actor: req.body.ids_writer[i], id_movie: movie.id});
								}
							}
						}
						if (req.body.ids_star && req.body.ids_star.length) {
							tmp = _.find(actorRoles, {name: 'Star'});
							if (tmp) {
								for (let i = 0; i < req.body.ids_star.length; i++) {
									movieActors.push({id_draft_actor_role: tmp.id, id_actor: req.body.ids_star[i], id_movie: movie.id});
								}
							}
						}
						if (movieActors.length) {
							db.models.MovieActor.bulkCreate(movieActors).then(() => res.json(movie)).catch(e => saveError(req.user, `movieCtrl create - bulkCreate DraftActorRole`, e, res));
						} else {
							res.json(movie);
						}
					}).catch(e => saveError(req.user, `movieCtrl create - select DraftActorRole`, e, res));
				}).catch(e => saveError(req.user, `movieCtrl create`, e, res));
			} else {
				/** update movie **/
				db.models.Movie.update(req.body, {where: {id: req.body.id}}).then(resp => {
					if (resp[0] > 0) {
						let t = [], movieActors = [], oldMovieActors;
						t.push(cb => {
							db.query(`SELECT id, name FROM "DraftActorRole" ORDER BY id`, {type: db.QueryTypes.SELECT}).then(actorRoles => {
								let tmp;
								if (req.body.ids_director && req.body.ids_director.length) {
									tmp = _.find(actorRoles, {name: 'Director'});
									if (tmp) {
										for (let i = 0; i < req.body.ids_director.length; i++) {
											movieActors.push({id_draft_actor_role: tmp.id, id_actor: req.body.ids_director[i], id_movie: req.body.id});
										}
									}
								}
								if (req.body.ids_writer && req.body.ids_writer.length) {
									tmp = _.find(actorRoles, {name: 'Writer'});
									if (tmp) {
										for (let i = 0; i < req.body.ids_writer.length; i++) {
											movieActors.push({id_draft_actor_role: tmp.id, id_actor: req.body.ids_writer[i], id_movie: req.body.id});
										}
									}
								}
								if (req.body.ids_star && req.body.ids_star.length) {
									tmp = _.find(actorRoles, {name: 'Star'});
									if (tmp) {
										for (let i = 0; i < req.body.ids_star.length; i++) {
											movieActors.push({id_draft_actor_role: tmp.id, id_actor: req.body.ids_star[i], id_movie: req.body.id});
										}
									}
								}
								cb();
							}).catch(e => cb(e));
						});
						t.push(cb => {
							db.query(`SELECT id FROM "MovieActor" WHERE id_movie = ${req.body.id} ORDER BY id`, {type: db.QueryTypes.SELECT}).then(resp => {
								oldMovieActors = resp;
								cb();
							}).catch(e => cb(e));
						});
						async.parallel(t, e => {
							if (e) {
								saveError(req.user, `movieCtrl update - select MovieActor - parallel, id: ${req.body.id}`, e, res);
							} else {
								t = [];
								let toCreateMovieActors = [], toUpdateMovieActors = [];
								for (let i = 0; i < movieActors.length; i++) {
									if (oldMovieActors.length) {
										movieActors[i].id = oldMovieActors[0].id;
										oldMovieActors.shift();
										toUpdateMovieActors.push(movieActors[i]);
									} else {
										toCreateMovieActors.push(movieActors[i]);
									}
								}
								if (toCreateMovieActors.length) {
									t.push(cb => {
										db.models.MovieActor.bulkCreate(toCreateMovieActors).then(() => cb()).catch(e => cb(e));
									});
								}
								if (toUpdateMovieActors.length) {
									_.each(toUpdateMovieActors, row => {
										t.push(cb => {
											db.models.MovieActor.update(row, {where: {id: row.id}}).then(() => cb()).catch(e => cb(e));
										});
									});
								}
								if (oldMovieActors.length) {
									t.push(cb => {
										db.query(`DELETE FROM "MovieActor" WHERE id IN (${_.map(oldMovieActors, 'id')})`).then(() => cb()).catch(e => cb(e));
									});
								}
								async.parallel(t, e => {
									if (e) {
										saveError(req.user, `movieCtrl update - create MovieActor - parallel, id: ${req.body.id}`, e, res);
									} else {
										rhs(res);
									}
								});
							}
						});
					} else {
						saveError(req.user, `movieCtrl update, id: ${req.body.id}`, 'not found', res);
					}
				}).catch(e => saveError(req.user, `movieCtrl update, id: ${req.body.id}`, e, res));
			}
		},

		forAddEdit: (req, res) => {
			async.parallel({
				actors: cb => {
					db.query(`
					SELECT id, name
					FROM "Actor"
					WHERE id_user = ${req.user.id}
					ORDER BY name
					`, {type: db.QueryTypes.SELECT}).then(r => cb(null, r)).catch(e => cb(e));
				},
				draftGenders: cb => {
					db.query(`
					SELECT id, name
					FROM "DraftGender"
					ORDER BY name
					`, {type: db.QueryTypes.SELECT}).then(r => cb(null, r)).catch(e => cb(e));
				}
			}, (e, r) => {
				if (e) {
					saveError(req.user, `movieCtrl forAddEdit`, e, res);
				} else {
					res.json(r);
				}
			});
		},

		findAll: (req, res) => {
			db.query(`
			SELECT m.*, string_agg(g.name, ', ') AS gender
			FROM "Movie" m
			LEFT JOIN "DraftGender" g ON g.id = ANY(m.ids_gender)
			WHERE m.id_user = ${req.user.id}
			GROUP BY m.id
			ORDER BY m.id DESC
			`, {type: db.QueryTypes.SELECT}).then(r => {
				res.json(r);
			}).catch(e => saveError(req.user, `movieCtrl findAll`, e, res));
		},

		find: (req, res) => {
			let tasks = [], movie, movieActors = [];
			tasks.push(cb => {
				db.query(`SELECT * FROM "Movie" WHERE id = ${req.params.id}`, {type: db.QueryTypes.SELECT}).then(resp => {
					if (resp.length) {
						movie = resp[0];
						cb();
					} else {
						cb('not found');
					}
				}).catch(e => cb(e));
			});
			tasks.push(cb => {
				db.query(`
				SELECT ma.id_draft_actor_role, ma.id_actor, dar.name
				FROM "MovieActor" ma
				LEFT JOIN "DraftActorRole" dar ON dar.id = ma.id_draft_actor_role
				WHERE ma.id_movie = ${req.params.id}
				`, {type: db.QueryTypes.SELECT}).then(resp => {
					movieActors = resp;
					cb();
				}).catch(e => cb(e));
			});
			async.parallel(tasks, e => {
				if (e) {
					saveError(req.user, `movieCtrl find, id: ${req.params.id}`, 'not found', res);
				} else {
					movie.ids_director = _.map(_.filter(movieActors, {name: 'Director'}), 'id_actor');
					movie.ids_writer = _.map(_.filter(movieActors, {name: 'Writer'}), 'id_actor');
					movie.ids_star = _.map(_.filter(movieActors, {name: 'Star'}), 'id_actor');
					res.json(movie);
				}
			});
		},

		destroy: (req, res) => {
			db.query(`DELETE FROM "Movie" WHERE id = ${req.params.id}`).then(resp => {
				if (resp[1].rowCount > 0) {
					rhs(res);
				} else {
					rh(res, `movieCtrl destroy, id: ${req.params.id}`, 'not found');
				}
			}).catch(e => saveError(req.user, `movieCtrl destroy, id: ${req.params.id}`, e, res));
		}

	};
};
