var roleRunner = {

	tabPrio: {
		STRUCTURE_SPAWN: 1,
		STRUCTURE_EXTENSION: 2,
		STRUCTURE_TOWER: 3
	},

	/** @param {Creep} creep **/
	run: function(creep) {

		var source1Container = Game.getObjectById(creep.room.memory.harvestContainerId);
		var source2Container = Game.getObjectById('58aa2472367cd02d7f87f8c4');
		var upgradeContainer = Game.getObjectById(creep.room.memory.upgradeContainerId);
		var generalContainer = Game.getObjectById(creep.room.memory.generalContainerId);

		var dispatchContainer = [];
		dispatchContainer.push(upgradeContainer);
		dispatchContainer.push(generalContainer);
		dispatchContainer.sort(function(a, b) {
			return (_.sum(a.store) - _.sum(b.store));
		});

		var sourcesContainer = [];
		sourcesContainer.push(source1Container);
		sourcesContainer.push(source2Container);
		sourcesContainer.sort(function(a, b) {
			return (_.sum(a.store) + _.sum(b.store));
		});
		var sourceContainer = sourcesContainer[0];
		console.log(sourceContainer);

		var sourceDrop = null;
        creep.memory.drop_source = false;
		// si energy par terre, go collect
		var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
		if (_.sum(creep.carry) < creep.carryCapacity && droppedEnergy.length > 0) {
			creep.memory.collect = true;
			sourceDrop = droppedEnergy[0];
			console.log(sourceDrop);
			creep.memory.drop_source = true;
		}

		// si tout dispatch, go collect
		else if(!creep.memory.collect && creep.carry.energy == 0) {
			creep.memory.collect = true;
			creep.say('🔄 collect');
		}

		//si collect et (full or no more to collect)
		else if(creep.memory.collect && ((creep.carry.energy == creep.carryCapacity) ||
				(_.sum(creep.cary) > 0 && _.sum(sourceContainer.store) == 0))) {
			creep.memory.collect = false;
			creep.say('🚧 dispatch');
		}

//*************************EndStateverif********************

		//Collect
		if (creep.memory.collect) {
			// drooped energy to pickup
			if (creep.memory.drop_source) {
				var ret = creep.pickup(sourceDrop);
				if (ret == ERR_NOT_IN_RANGE) {
					creep.moveTo(sourceDrop, {visualizePathStyle: {stroke: '#54ca54'}});
				}
			}
			else {
				if (creep.withdraw(sourceContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sourceContainer, {visualizePathStyle: {stroke: '#54ca54'}});
				}
			}
		}
		// or dispatch
		else if (_.sum(creep.carry) > 0){
			//look for needed energy structure
			var dispatchTarget = null;
			var energyNeedTargets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (((structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity ) ||
						(structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity / 2)));
				}
			});
			if (energyNeedTargets.length > 0) {
				energyNeedTargets.sort(function(a, b) {
					return (roleRunner.tabPrio[a.structureType] - roleRunner.tabPrio[b.structureType]);
				});
				dispatchTarget = energyNeedTargets[0];
			}
			// or dispatch beetween target containers
			else {
				dispatchTarget = dispatchContainer[0];
			}
			// and transfer
			if(creep.transfer(dispatchTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(dispatchTarget, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
};

module.exports = roleRunner;
