function ChunkDisplayer(unitBoxSize, positionInWorld, scene) {
    this._scene = scene;
    this._positionInWorld = positionInWorld;
    this._unitBoxSize = unitBoxSize;
    this._isInitialized = false;
    this._initMeshes();
}
ChunkDisplayer.prototype._initMeshes = function () {
    this._meshes = new Array(BlocKTypes.Types.length);
    for (var typeIndex = 0; typeIndex < BlocKTypes.Types.length; typeIndex++) {
        var material;
        if (BlocKTypes.Materials[typeIndex] === undefined) {
            material = new BABYLON.StandardMaterial(BlocKTypes.Types[typeIndex].typeName + "Material", this._scene);
            material.diffuseTexture = new BABYLON.Texture(BlocKTypes.Types[typeIndex].url, this._scene);
            if (BlocKTypes.Types[typeIndex].transparency) {
                material.diffuseTexture.hasAlpha = true;
            }
            BlocKTypes.Materials[typeIndex] = material;
        }
        else {
            material = BlocKTypes.Materials[typeIndex];
        }
        this._meshes[BlocKTypes.Types[typeIndex].typeId] = new BoxMesh(BlocKTypes.Types[typeIndex].typeName + "Box", this._unitBoxSize, Chunk.CHUNKHEIGHT * 4, this._scene, material, this._positionInWorld);
        this._meshes[BlocKTypes.Types[typeIndex].typeId].checkCollisions = true;
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