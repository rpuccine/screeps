var roleRunner = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(!creep.memory.collect && creep.carry.energy == 0) {
			creep.memory.collect = true;
			creep.say('🔄 collect');
		}
		if(creep.memory.collect && (creep.carry.energy == creep.carryCapacity)) {
			creep.memory.collect = false;
			creep.say('🚧 dispatch');
		}


		if(creep.memory.collect) {
			var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
			if (droppedEnergy.length > 0) {
				if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#54ca54'}});
				}
			}
			else {
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0);
					}
				});
				if (targets.length) {
					if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#54ca54'}});
					}
				}
			}
		}
		else {
			//console.log('dispatch');
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity);
				}
			});
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity);
				}
			});
			if(targets.length > 0) {
				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
			else if (containers.length > 0) {
				if(creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		}
	}
};

module.exports = roleRunner;
