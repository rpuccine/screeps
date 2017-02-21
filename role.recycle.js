var roleRecycle = {

	run: function(creep) {
		var target = null;
		if (!creep.memory.targetId) {
			target = Game.spawns[creep.room.memory.spawn];
			creep.memory.targetId = target.id;
		}
		else {
			target = Game.getObjectById(creep.memory.targetId);
		}

		var path = creep.pos.findPathTo(target);

		if (path.length < 2) {
			target.recycle(creep);
		}
		else if (!creep.fatigue){
			var ret = creep.Move(path[0].direction);
			if (ret != OK) {
				console.log('creep ' + creep.name + ' ret move: 'ret);
			}
		}
	}
};

module.exports = roleRecycle;
