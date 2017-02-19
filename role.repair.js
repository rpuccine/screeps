var roleRepair = {

	/** @param {Creep} creep **/
	run: function(creep) {

		var target = null;
		if (creep.memory.repair_id) {
			target = Game.getObjectById(creep.memory.repair_id);
		}
		if (target && (target.hits == target.hitsMax)) {
			creep.memory.repair_id = null;
		}

		if(creep.memory.repair && creep.carry.energy == 0 ) {
			creep.memory.repair = false;
			creep.memory.repair_id = null;
			creep.say('🔄 collect');
		}
		if((!creep.memory.repair && creep.carry.energy == creep.carryCapacity) ||
				(creep.memory.repair && !creep.memory.repair_id)) {
			creep.memory.repair = true;
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.hits < structure.hitsMax);
				}
			});
			if(targets.length) {
				targets.sort((a,b) => a.hits - b.hits);
				creep.memory.repair_id = targets[0].id;
			}
			else {
				console.log('no repaire target');
				creep.memory.repair_id = null;
			}
			creep.say('🚧 repair');
		}

		if(creep.memory.repair && creep.memory.repair_id) {
			//creep.say('repair');
			var target = Game.getObjectById(creep.memory.repair_id);
			if(creep.repair(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {visualizePathStyle: {stroke: '#634586'}});
			}
			else {
				//console.log('repaire ret :' + creep.repair(target));
			}
		}
		else if (!creep.memory.repair) {
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0);
				}
			});
			var container = null;
			if (containers.length) {
				container = containers[0];
			}
			if (container && container.store[RESOURCE_ENERGY] > 0) {
				if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, {visualizePathStyle: {stroke: '#ccf43c'}});
				}
			}
		}
	}
};

module.exports = roleRepair;
