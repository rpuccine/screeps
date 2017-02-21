var roleBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {

		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}

		if(creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say('🔄 harvest');
		}
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say('🚧 build');
		}

		if(creep.memory.building) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if(targets.length) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
			else {
				//creep.say('repair');
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
							return (structure.hits < structure.hitsMax);
						}
				});
				if(targets.length) {
					targets.sort((a,b) => a.hits - b.hits);
					if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
				else {
					console.log('no target');
				}
			}
		}
		else {
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: function(struct){
					return (struct.structureType == STRUCTURE_CONTAINER && struct.store[RESOURCE_ENERGY] > 0);
				}
			});
			var container = null;
			if (containers.length > 0) {
				container = containers[0];
			}

			if (container) {
				//console.log('builder want harvest container');
				if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, {visualizePathStyle: {stroke: '#ccf43c'}});
				}
			}
			else if (!container){
				var sources = creep.room.find(FIND_DROPPED_ENERGY);
				var source = null;
				if (sources.length > 0) {
					source = sources[0];
				}
				if (source) {
					if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					}
				}
			}
		}
	}
};

module.exports = roleBuilder;
