var logicSpawn = {

	getHarvesterBody: function(room) {
		/*var nbWorkPart = Math.floor((room.energyAvailable - 100) / 100);
		var body = [];
		for (var i = 0; i < nbWorkPart; i++) {
			body.push(WORK);
		}
		body.push(CARRY);
		body.push(MOVE);
		return body;*/

		var nbLoop = Math.floor(room.energyAvailable / 400);
		var body = [];
		for (var i = 0; i < nbLoop; i++) {
			body.push(WORK);
			body.push(CARRY);
			body.push(MOVE);
			body.push(WORK);
			body.push(WORK);
		}
		var rest = room.energyAvailable % 400;
		while (rest >= 100) {
			body.push(WORK);
			rest -= 100;
		}
		while (rest >= 50) {
			body.push(CARRY);
			rest -= 50;
		}
		return body;
	},

	getTechBody: function(room) {
		var nbLoop = Math.floor(room.energyAvailable / 200);
		var body = [];
		for (var i = 0; i < nbLoop; i++) {
			body.push(WORK);
			body.push(CARRY);
			body.push(MOVE);
		}
		var rest = room.energyAvailable % 200;
		if (rest >= 100) {
		body.push(WORK);
		rest -= 100;
		}
		if (rest >= 50) {
		body.push(CARRY);
		}
		return body;
	},

	getRunnerBody: function(room) {
		/*var nbWorkPart = Math.floor(room.energyAvailable / 50);
		var nbLoop = Math.floor(nbWorkPart / 2);
		var body = [];

		console.log(room.energyAvailable);
		console.log(nbWorkPart);
		console.log(nbWorkPart / 2);
		console.log(nbLoop);

		for (var i = 0; i < nbLoop; i++) {
			body.push(CARRY);
			body.push(MOVE);
		}
		if (nbWorkPart % 2 > 0) {
			body.push(CARRY);
		}
		return body;*/

		var nbLoop = Math.floor(room.energyAvailable / 150);
		var body = [];
		for (var i = 0; i < nbLoop; i++) {
			body.push(CARRY);
			body.push(CARRY);
			body.push(MOVE);
		}
		var rest = room.energyAvailable % 150;
		while (rest >= 50) {
			body.push(CARRY);
			rest -= 50;
		}
		return body;
	},

	run: function(room) {
	var maxHarvester = 2;
	var maxRunner = 1;
	var maxUpgrader = 2;
	var maxBuilder = 1;
	var maxRepair = 1;

	var spawns = room.find(FIND_MY_SPAWNS);
	if (spawns.length) {

		var spawn = spawns[0];

		if (!spawn.spawning) {

			var nbHarvester = room.find(FIND_MY_CREEPS, {
				filter:	(creep) => creep.memory.role == 'harvester'
			}).length;

			var nbUpgrader = room.find(FIND_MY_CREEPS, {
				filter:	(creep) => creep.memory.role == 'upgrader'
			}).length;

			var nbBuilder = room.find(FIND_MY_CREEPS, {
				filter:	(creep) => creep.memory.role == 'builder'
			}).length;

			var nbRunner = room.find(FIND_MY_CREEPS, {
				filter:	(creep) => creep.memory.role == 'runner'
			}).length;

			var nbRepair = room.find(FIND_MY_CREEPS, {
				filter:	(creep) => creep.memory.role == 'repair'
			}).length;

			//var nbHarvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
			//var nbBuilder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
			//var nbUpgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;

			if (nbHarvester < maxHarvester) {
				//console.log('need harvester');
				var body = this.getHarvesterBody(room);
				//console.log(body);
				//console.log(room.energyAvailable);
				if (spawn.canCreateCreep(body) == OK) {
					spawn.createCreep(body, null, {role: 'harvester'});
				}
				else {
					console.log(spawn.canCreateCreep(body));
				}
			}

			else if (nbRunner < maxRunner) {
				var body = this.getRunnerBody(room);
				//console.log(body);
				if (spawn.canCreateCreep(body) == OK) {
					spawn.createCreep(body, null, {role: 'runner', collect: true});
				}
			}

			else if (nbUpgrader < maxUpgrader) {
				var body = this.getTechBody(room);
				if (spawn.canCreateCreep(body) == OK) {
					spawn.createCreep(body, null, {role: 'upgrader', upgrading: false});
				}
			}

			else if (nbBuilder < maxBuilder) {
				var body = this.getTechBody(room);
				if (spawn.canCreateCreep(body) == OK) {
					spawn.createCreep(body, null, {role: 'builder', building: false});
				}
			}

			else if (nbRepair < maxRepair) {
				var body = this.getTechBody(room);
				//console.log(body);
				if (spawn.canCreateCreep(body) == OK) {
					spawn.createCreep(body, null, {role: 'repair', repair: false, repair_id: null});
				}
			}

		}
	}
	}
};

module.exports = logicSpawn;
