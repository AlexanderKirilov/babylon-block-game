var ChunkDisplayer = (function () {
    function ChunkDisplayer(unitBoxSize, positionInWorld, scene) {
        this._scene = scene;
        this._positionInWorld = positionInWorld;
        this._unitBoxSize = unitBoxSize;
        this._isInitialized = false;
        this._initMeshes();
    }
    ChunkDisplayer.prototype._initMeshes = function () {
        this._meshes = new Array(BlockTypes.Types.length);
        for (var typeIndex = 0; typeIndex < BlockTypes.Types.length; typeIndex++) {
            var material;
            if (BlockTypes.Materials[typeIndex] === undefined) {
                material = new BABYLON.StandardMaterial(BlockTypes.Types[typeIndex].typeName + "Material", this._scene);
                if(BlockTypes.Types[typeIndex].useTexture){
                    material.diffuseTexture = new BABYLON.Texture(BlockTypes.Types[typeIndex].url, this._scene);
                }else{
                    material.diffuseColor = BlockTypes.Types[typeIndex].color;
                }

                if (BlockTypes.Types[typeIndex].transparency) {
                    material.diffuseTexture.hasAlpha = true;
                }
                BlockTypes.Materials[typeIndex] = material;
            }
            else {
                material = BlockTypes.Materials[typeIndex];
            }
            this._meshes[BlockTypes.Types[typeIndex].typeId] = new BoxMesh(BlockTypes.Types[typeIndex].typeName + "Box", this._unitBoxSize, Chunk.CHUNKHEIGHT * 4, this._scene, material, this._positionInWorld);
            this._meshes[BlockTypes.Types[typeIndex].typeId].checkCollisions = true;
        }
    };
    ChunkDisplayer.prototype.addBox = function (x, y, z, boxType) {
        this._meshes[boxType].addBox(x, y, z);
    };
    ChunkDisplayer.prototype.eraseBox = function (x, y, z, boxType) {
        this._meshes[boxType].removeBox(x, y, z);
    };
    ChunkDisplayer.prototype.empty = function () {
        for (var meshId = 0; meshId < this._meshes.length; meshId++) {
            this._meshes[meshId].empty();
        }
        this._isInitialized = false;
    };
    ChunkDisplayer.prototype.updateMeshes = function () {
        for (var meshId = 0; meshId < this._meshes.length; meshId++) {
            this._meshes[meshId].updateMesh();
        }
    };

    /**
        FOR DEVELOPMENT ONLY !
    */
    ChunkDisplayer.prototype._peekMesh = function(){
        return this._meshes;
    };
    ChunkDisplayer.prototype._recomputeWorldMatrix = function(){
        for(var i = 0; i < this._meshes.length; i++){
            console.log(this._meshes[i]._mesh.computeWorldMatrix(true));
        }
    };
    Object.defineProperty(ChunkDisplayer.prototype, "positionInWorld", {
        get: function () {
            return this._positionInWorld;
        },
        set: function (value) {
            this._positionInWorld = value;
            for (var meshId = 0; meshId < this._meshes.length; meshId++) {
                this._meshes[meshId].positionInWorld = this._positionInWorld;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChunkDisplayer.prototype, "isInitialized", {
        get: function () {
            return this._isInitialized;
        },
        set: function (value) {
            this._isInitialized = value;
        },
        enumerable: true,
        configurable: true
    });

    return ChunkDisplayer;
})();