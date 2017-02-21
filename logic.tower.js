var logicTower = {

	run: function(room) {
		var towers = room.find(FIND_STRUCTURES, {
			filter: function(struct){
				return (struct.structureType == STRUCTURE_TOWER);
			}
		});
		if (towers.length > 0) {
			var hostiles = room.find(FIND_HOSTILE_CREEPS);
			var wounded = room.find(FIND_MY_CREEPS, {
				filter: function(creep){
					return (creep.hits < creep.hitsMax);
				}
			});
			var repaired = room.find(FIND_STRUCTURES, {
				filter: function(struct){
					return (struct.hits < struct.hitsMax);
				}
			});

			if (hostiles.length > 0) {
				towers.forEach(function(tower) {
					var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
					tower.attack(target);
				});
			}
			else if (wounded.length > 0) {
				wounded.sort(function(a, b){
					return (a.hits - b.hits);
				});
				towers.forEach(function(tower){
					tower.heal(wounded[0]);
				});
			}
			else if (repaired.length > 0) {
				repaired.sort(function(a, b){
					return (a.hits - b.hits);
				});
				towers.forEach(function(tower){
					if (tower.energy > (tower.energyCapacity * 2) / 3) {
					    tower.repair(repaired[0]);
					}
				});
			}
		}
	}
};

module.exports = logicTower;
