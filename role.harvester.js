var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep) {
		if(!creep.carryCapacity || creep.carry.energy < creep.carryCapacity) {
			// var source = creep.pos.findClosestByRange(FIND_SOURCES);
			// if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
			//	 creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			// }
			var sources = creep.room.find(FIND_SOURCES);
			if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
		else {
			/*for(var resourceType in creep.carry) {
					creep.drop(resourceType);
				}*/
			var target = null;
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => ((structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity))
			});
			if(targets.length > 0) {
				target = targets[0];
			}
			else {
				var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) <  structure.storeCapacity))
				});
				if (container) {
					target = container;
				}
			}
			if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
			}
			else if (!target) {
				for(var resourceType in creep.carry) {
					creep.drop(resourceType);
				}
			}
		}
	}
};

module.exports = roleHarvester;
