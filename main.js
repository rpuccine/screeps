var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRunner = require('role.runner');
var roleRepair = require('role.repair');
var roleRecycle = require('role.recycle');

var logicSpawn = require('logic.spawn');
var logicTower = require('logic.tower');

var utils = require('utils');

module.exports.loop = function () {

	utils.clearMemory();

	for (var roomName in Game.rooms) {
		var room = Game.rooms[roomName];

		if (room.energyAvailable >= (room.energyCapacityAvailable) / 2) {
			logicSpawn.run(room);
		}
		logicTower.run(room);
	}

	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if(creep.memory.role == 'harvester') {
			roleHarvester.run(creep);
		}
		if(creep.memory.role == 'upgrader') {
			roleUpgrader.run(creep);
		}
		if(creep.memory.role == 'builder') {
			roleBuilder.run(creep);
		}
		if(creep.memory.role == 'runner') {
			roleRunner.run(creep);
		}
		if(creep.memory.role == 'repair') {
			roleRepair.run(creep);
		}
		if(creep.memory.role == 'recycle') {
			roleRecycle.run(creep);
		}
	}
}
