var WorldManager = (function () {
    function WorldManager(width, depth, unitBoxSize, scene) {
        this._visibleChunksAroundPlayer = 5;
        this._world = new Array(width * depth);
        this._displayedChunk = new Array();
        this._width = width;
        this._depth = depth;
        this._unitBoxSize = unitBoxSize;
        this._scene = scene;
        //init displayers
        this._availableDisplayers = new Array();
        for (var disp = 0; disp < (this._visibleChunksAroundPlayer + 1) * (this._visibleChunksAroundPlayer + 1) * 4; disp++) {
            this._availableDisplayers.push(new ChunkDisplayer(this._unitBoxSize, new BABYLON.Vector3(0, 0, 0), this._scene));
        }
        //Terrain generator with terrainMap and HeightMap
        this._terrainGenerator = new TerrainGenerator(this, 'assets/images/terrainTestMap.png', 'assets/images/terrainTestHeightMap1.png');

    }

    //helper functions UNUSED
    WorldManager.prototype.createTree = function (position) {
        var height = Math.floor(Math.random() * 5) + 2;
        for (var h = 0; h < height; h++) {
            this.addBox(position.x, position.y + h, position.z, BlockTypes.WOOD);
        }
        this.createPlane(new BABYLON.Vector3(position.x - 2, position.y + height, position.z - 2), 5, 5, BlockTypes.LEAFS);
        this.createPlane(new BABYLON.Vector3(position.x - 3, position.y + height + 1, position.z - 3), 7, 7, BlockTypes.LEAFS);
        this.createPlane(new BABYLON.Vector3(position.x - 3, position.y + height + 2, position.z - 3), 7, 7, BlockTypes.LEAFS);
        this.createPlane(new BABYLON.Vector3(position.x - 2, position.y + height + 3, position.z - 2), 5, 5, BlockTypes.LEAFS);
    };
    WorldManager.prototype.createPlane = function (position, width, depth, blockType) {
        for (var x = position.x; x < position.x + width; x++) {
            for (var z = position.z; z < position.z + depth; z++) {
                this.addBox(x, position.y, z, blockType);
            }
        }
    };


    WorldManager.prototype.removeFromCoords = function (x, y, camera) {
        var ray = this._scene.createPickingRay(x, y, BABYLON.Matrix.Identity(), camera);
        var hitChunkFar;
        var hitChunk;
        var distanceFromPlayerHitChunk;
        var distanceFromPlayerHitChunkFar;
        //for (var chunkid = 0; chunkid < this._displayedChunk.length; chunkid++) {
        //    var chunk = this._displayedChunk[chunkid];
        //    var minimum = chunk.positionInWorld.add(new BABYLON.Vector3(-Chunk.CHUNKWIDTH / 2, -Chunk.CHUNKHEIGHT / 2, -Chunk.CHUNKDEPTH / 2));
        //    var maximum = chunk.positionInWorld.add(new BABYLON.Vector3(Chunk.CHUNKWIDTH / 2, Chunk.CHUNKHEIGHT / 2, Chunk.CHUNKDEPTH / 2));
        //    var intersected = ray.intersectsBoxMinMax(minimum, maximum);
        //    if (intersected) {
        //        if (hitChunk === undefined || distanceFromPlayerHitChunk > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
        //            hitChunk = chunk;
        //            distanceFromPlayerHitChunk = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
        //        }
        //        else if(hitChunk === undefined || distanceFromPlayerHitChunkFar > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
        //            hitChunkFar = chunk;
        //            distanceFromPlayerHitChunkFar = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
        //        }
        //    }
        //}
        var playerchunkX = Math.floor(this._playerPosition.x / Chunk.CHUNKWIDTH);
        var playerchunkY = Math.floor(this._playerPosition.z / Chunk.CHUNKDEPTH);
        hitChunk = this.getChunk(playerchunkX, playerchunkY);
        if (hitChunk != undefined) {
            var hitBox = hitChunk.getHitBox(ray, this._playerPosition);
            if (hitBox != undefined) {
                this.removeBox(hitBox.x, hitBox.y, hitBox.z);
                hitChunk.applyChanges();
            }
        }
    };
    WorldManager.prototype.addFromCoords = function (x, y, camera) {
        var ray = this._scene.createPickingRay(x, y, BABYLON.Matrix.Identity(), camera);
        var hitChunkFar;
        var hitChunk;
        var distanceFromPlayerHitChunk;
        var distanceFromPlayerHitChunkFar;
        //for (var chunkid = 0; chunkid < this._displayedChunk.length; chunkid++) {
        //    var chunk = this._displayedChunk[chunkid];
        //    var minimum = chunk.positionInWorld.add(new BABYLON.Vector3(-Chunk.CHUNKWIDTH / 2, -Chunk.CHUNKHEIGHT / 2, -Chunk.CHUNKDEPTH / 2));
        //    var maximum = chunk.positionInWorld.add(new BABYLON.Vector3(Chunk.CHUNKWIDTH / 2, Chunk.CHUNKHEIGHT / 2, Chunk.CHUNKDEPTH / 2));
        //    var intersected = ray.intersectsBoxMinMax(minimum, maximum);
        //    if (intersected) {
        //        if (hitChunk === undefined || distanceFromPlayerHitChunk > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
        //            hitChunk = chunk;
        //            distanceFromPlayerHitChunk = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
        //        }
        //        else if(hitChunk === undefined || distanceFromPlayerHitChunkFar > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
        //            hitChunkFar = chunk;
        //            distanceFromPlayerHitChunkFar = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
        //        }
        //    }
        //}
        var playerchunkX = Math.floor(this._playerPosition.x / Chunk.CHUNKWIDTH);
        var playerchunkY = Math.floor(this._playerPosition.z / Chunk.CHUNKDEPTH);
        hitChunk = this.getChunk(playerchunkX, playerchunkY);
        if (hitChunk != undefined) {
            var hitBox = hitChunk.getHitBox(ray, this._playerPosition);
            if (hitBox != undefined) {
                this.addBox(hitBox.x, hitBox.y + 1, hitBox.z, BlockTypes.GRASS);
                hitChunk.applyChanges();
            }
        }
    };
    WorldManager.prototype.addBox = function (x, y, z, blocType) {
        //Select chunk
        var chunkx = Math.floor(x / Chunk.CHUNKWIDTH);
        var chunky = Math.floor(z / Chunk.CHUNKDEPTH);
        var chunk = this.getChunk(chunkx, chunky);
        chunk.addBox(x - chunkx * Chunk.CHUNKWIDTH, y, z - chunky * Chunk.CHUNKDEPTH, blocType);
    };
    WorldManager.prototype.removeBox = function (x, y, z) {
        //Select chunk
        var chunkx = Math.floor(x / Chunk.CHUNKWIDTH);
        var chunky = Math.floor(z / Chunk.CHUNKDEPTH);
        var chunk = this.getChunk(chunkx, chunky);
        chunk.removeBox(x - chunkx * Chunk.CHUNKWIDTH, y, z - chunky * Chunk.CHUNKDEPTH);
    };
    WorldManager.prototype.getChunk = function (x, y) {
        var chunk = this._world[x * this._width + y];
        if (chunk === undefined) {
            chunk = new Chunk(new BABYLON.Vector3(x * Chunk.CHUNKWIDTH, 0, y * Chunk.CHUNKDEPTH));
            this.setChunk(x, y, chunk);
        }
        return chunk;
    };
    WorldManager.prototype.setChunk = function (x, y, chunk) {
        return this._world[x * this._width + y] = chunk;
    };
    //currently handles all movement
    WorldManager.prototype.setPlayerPosition = function (x, y, z) {
        //find the chunk where the player is
        var newChunkX = Math.round(x / Chunk.CHUNKWIDTH);
        var newChunkY = Math.round(z / Chunk.CHUNKDEPTH);
        //calculate visible chunks arround player
        var newChunkBoundingBoxXMin = newChunkX - this._visibleChunksAroundPlayer;
        var newChunkBoundingBoxXMax = newChunkX + this._visibleChunksAroundPlayer;
        var newChunkBoundingBoxYMin = newChunkY - this._visibleChunksAroundPlayer;
        var newChunkBoundingBoxYMax = newChunkY + this._visibleChunksAroundPlayer;
        //keep the chunks in check
        if(newChunkBoundingBoxYMin < 0){
            newChunkBoundingBoxYMin = 0;
        }
        if(newChunkBoundingBoxYMax > this._depth){
            newChunkBoundingBoxYMax = this._depth;
        }
        if(newChunkBoundingBoxXMin < 0){
            newChunkBoundingBoxXMin = 0;
        }
        if(newChunkBoundingBoxXMax > this._width){
            newChunkBoundingBoxXMax = this._width;
        }
        if (this._playerPosition === undefined) {
            this._playerPosition = new BABYLON.Vector3(x, y, z);
            for (var x = newChunkBoundingBoxXMin; x <= newChunkBoundingBoxXMax; x++) {
                for (var y = newChunkBoundingBoxYMin; y <= newChunkBoundingBoxYMax; y++) {
                    var chunk = this.getChunk(x, y);
                    chunk.show(this._availableDisplayers.pop());
                    this._displayedChunk.push(chunk);
                }
            }
        }
        else {
            //Current Chunk
            var oldChunkX = Math.round(this._playerPosition.x / Chunk.CHUNKWIDTH);
            var oldChunkY = Math.round(this._playerPosition.z / Chunk.CHUNKDEPTH);
            var oldChunkBoundingBoxXMin = oldChunkX - this._visibleChunksAroundPlayer;
            var oldChunkBoundingBoxXMax = oldChunkX + this._visibleChunksAroundPlayer;
            var oldChunkBoundingBoxYMin = oldChunkY - this._visibleChunksAroundPlayer;
            var oldChunkBoundingBoxYMax = oldChunkY + this._visibleChunksAroundPlayer;

            //keep the chunks in check
            if(oldChunkBoundingBoxYMin < 0){
                oldChunkBoundingBoxYMin = 0;
            }
            if(oldChunkBoundingBoxYMax > this._depth){
                oldChunkBoundingBoxYMax = this._depth;
            }
            if(oldChunkBoundingBoxXMin < 0){
                oldChunkBoundingBoxXMin = 0;
            }
            if(oldChunkBoundingBoxXMax > this._width){
                oldChunkBoundingBoxXMax = this._width;
            }
            //  if we have a movement detected
            if (oldChunkX != newChunkX || oldChunkY != newChunkY) {
                this._playerPosition.x = x;
                this._playerPosition.y = y;
                this._playerPosition.z = z;
                // Free the old chunks
                for (var x = oldChunkBoundingBoxXMin; x <= oldChunkBoundingBoxXMax; x++) {
                    for (var y = oldChunkBoundingBoxYMin; y <= oldChunkBoundingBoxYMax; y++) {
                        if (x < newChunkBoundingBoxXMin || x > newChunkBoundingBoxXMax || y < newChunkBoundingBoxYMin || y > newChunkBoundingBoxYMax) {
                            var removedChunk = this.getChunk(x, y);
                            var displayer = removedChunk.hide();
                            this._displayedChunk.splice(this._displayedChunk.indexOf(removedChunk), 1);
                            if (displayer != undefined)
                                this._availableDisplayers.push(displayer);
                        }
                    }
                }
                // Display new chunks
                for (var x = newChunkBoundingBoxXMin; x <= newChunkBoundingBoxXMax; x++) {
                    for (var y = newChunkBoundingBoxYMin; y <= newChunkBoundingBoxYMax; y++) {
                        if (x < oldChunkBoundingBoxXMin || x > oldChunkBoundingBoxXMax || y < oldChunkBoundingBoxYMin || y > oldChunkBoundingBoxYMax) {
                            var chunk = this.getChunk(x, y);
                            chunk.show(this._availableDisplayers.pop());
                            this._displayedChunk.push(chunk);
                        }
                    }
                }

            }
        }
    };

    /*
        currently used for debugging only
    */
    WorldManager.prototype.displayCurrentPlayerChunk = function(){
        x = document.getElementById('chunkX');
        y = document.getElementById('chunkY');
        x.innerHTML =  Math.round(this._playerPosition.x / Chunk.CHUNKWIDTH);
        y.innerHTML =  Math.round(this._playerPosition.z / Chunk.CHUNKDEPTH);
    }

    return WorldManager;
})();