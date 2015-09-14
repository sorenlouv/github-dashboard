var _ = require('lodash');

function teamService() {
	var service = {};

	service.add = function(name) {
		if (!name || _.contains(this.team, name)){
			return;
		}
		this.team.push(name);
		this.saveTeam();
	};

	service.remove = function(name) {
		_.pull(this.team, name);
		this.saveTeam();
	};

	service.saveTeam = function() {
		localStorage.setItem('team', JSON.stringify(this.team));
	};

	service.loadTeam = function() {
		var team = localStorage.getItem('team');
		if (!team) {
			return [];
		} else {
			return JSON.parse(team);
		}
	};

	service.getList = function() {
		if (!this.team) {
			this.team = this.loadTeam();
		}
		return this.team;
	};

	service.team = service.loadTeam();
	return service;
}

module.exports = [teamService];
