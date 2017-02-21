var roleRunner = {

	tabPrio: {
		STRUCTURE_SPAWN: 1,
		STRUCTURE_EXTENSION: 2,
		STRUCTURE_TOWER: 3
	},

	/** @param {Creep} creep **/
	run: function(creep) {

		var dispatchTarget = null;
		var energyNeedTargets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return ((structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity );
			}
		});
		if (energyNeedTargets.length > 0) {
			energyNeedTargets.sort(function(a, b) {
				return (roleRunner.tabPrio[a.structureType] - roleRunner.tabPrio[b.structureType]);
			});
			dispatchTarget = energyNeedTargets[0];
		}

		if(!creep.memory.collect && creep.carry.energy == 0) {
			creep.memory.collect = true;
			creep.say('🔄 collect');
		}
		if(creep.memory.collect && (creep.carry.energy == creep.carryCapacity)) {
			creep.memory.collect = false;
			creep.say('🚧 dispatch');
		}

		// si collect et energy needed
		if(creep.memory.collect && dispatchTarget) {
			var target = null;

			//LOOK for dropped energy
			var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
			if (droppedEnergy.length > 0) {
				target = droppedEnergy[0];
				creep.memory.drop_source = true;
			}

			// or fill containers
			if (!target) {
				var containers = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0);
					}
				});
				if (containers.length > 0) {
					target = containers[0];
					creep.memory.drop_source = false;
				}
			}

			// if target go for it
			if (target) {
				if (creep.memory.drop_source) {
					var ret = creep.pickup(target);
					if (ret == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#54ca54'}});
					}
				}
				else {
					if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#54ca54'}});
					}
				}
			}

			/*if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#54ca54'}});
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
			}*/
		}
		//si collect et not energy needed (look for containers management)
		else if (creep.memory.collect && !dispatchTarget) {
			var target = null;
			var fulledContainers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > (structure.storeCapacity * 3) / 4);
				}
			});
			var emptyContainers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity  / 2);
				}
			});
			if (fulledContainers.length > 0 && emptyContainers.length > 0) {
				target = fulledContainers[0];
			}

			if (target) {
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#54ca54'}});
				}
			}
		}
		else if (!creep.memory.collect && dispatchTarget) {
			if(creep.transfer(dispatchTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(dispatchTarget, {visualizePathStyle: {stroke: '#ffffff'}});
			}
			//console.log('dispatch');
			/*var targets = creep.room.find(FIND_STRUCTURES, {
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
			}*/
		}
		// di dispatch et full energy (container management)
		else if (!creep.memory.collect && !dispatchTarget) {
			var target = null;
			var emptyContainers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity  / 2);
				}
			});
			if (emptyContainers.length > 0) {
				target = emptyContainers[0];
			}

			if (target) {
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#54ca54'}});
				}
			}
		}
	}
};

module.exports = roleRunner;
