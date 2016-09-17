function BlocKTypes() {
}
BlocKTypes.STONE = 0;
BlocKTypes.GRASS = 1;
BlocKTypes.SNOW = 2;
BlocKTypes.WOOD = 3;
BlocKTypes.LEAFS = 4;
BlocKTypes.Types = [
    { typeName: "Stone", typeId: BlocKTypes.STONE, url: "./Assets/Textures/stone.png", transparency: false },
    { typeName: "Grass", typeId: BlocKTypes.GRASS, url: "./Assets/Textures/grass.png", transparency: false },
    { typeName: "Snow", typeId: BlocKTypes.SNOW, url: "./Assets/Textures/snow.png", transparency: false },
    { typeName: "Wood", typeId: BlocKTypes.WOOD, url: "./Assets/Textures/wood.png", transparency: false },
    { typeName: "Leafs", typeId: BlocKTypes.LEAFS, url: "./Assets/Textures/leafs.png", transparency: true },
];
BlocKTypes.Materials = new Array(BlocKTypes.Types.length);

function Chunk(positionInWorld) {
    this._width = Chunk.CHUNKWIDTH;
    this._depth = Chunk.CHUNKDEPTH;
    this._height = Chunk.CHUNKHEIGHT;
    this._chunkData = new Array(this._width * this._depth * this._height);
    this._boxToDraw = new Array(BlocKTypes.Types.length);
    this._positionInWorld = positionInWorld;
    this._realHeight = 0;
    for (var i = 0; i < BlocKTypes.Types.length; i++) {
        this._boxToDraw[i] = new Array();
    }
    this._boxToErase = new Array(BlocKTypes.Types.length);
    for (var i = 0; i < BlocKTypes.Types.length; i++) {
        this._boxToErase[i] = new Array();
    }
}
Chunk.prototype.show = function (displayer) {
    if (displayer != undefined) {
        this._displayer = displayer;
        this._displayer.positionInWorld = this._positionInWorld;
        //could be a different method
        this.applyChanges();
    }
};
Chunk.prototype.hide = function () {
    var displayer = this._displayer;
    if (displayer != undefined) {
        displayer.empty();
    }
    return displayer;
};
Object.defineProperty(Chunk.prototype, "positionInWorld", {
    get: function () {
        return this._positionInWorld;
    },
    set: function (value) {
        this._positionInWorld = value;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(Chunk.prototype, "displayer", {
    get: function () {
        return this._displayer;
    },
    set: function (value) {
        this._displayer = value;
    },
    enumerable: true,
    configurable: true
});
Chunk.prototype.applyChanges = function () {
    var boxType;
    if (this._displayer != undefined) {
        if (!this._displayer.isInitialized) {
            //init boxes
            for (var x = 0; x < this._width; x++) {
                for (var y = 0; y <= this._realHeight; y++) {
                    for (var z = 0; z < this._depth; z++) {
                        boxType = this.getBoxType(x, y, z);
                        if (boxType != undefined) {
                            this._displayer.addBox(x, y, z, boxType);
                        }
                    }
                }
            }
            for (var i = 0; i < BlocKTypes.Types.length; i++) {
                this._boxToDraw[i] = new Array();
            }
            this._boxToErase = new Array(BlocKTypes.Types.length);
            for (var i = 0; i < BlocKTypes.Types.length; i++) {
                this._boxToErase[i] = new Array();
            }
            this._displayer.updateMeshes();
            this._displayer.isInitialized = true;
        }
        else {
            //update boxes
            for (var meshId = 0; meshId < BlocKTypes.Types.length; meshId++) {
                while (this._boxToDraw[meshId].length > 0) {
                    var x = this._boxToDraw[meshId].pop();
                    var y = this._boxToDraw[meshId].pop();
                    var z = this._boxToDraw[meshId].pop();
                    this._displayer.addBox(x, y, z, meshId);
                }
                while (this._boxToErase[meshId].length > 0) {
                    var x = this._boxToErase[meshId].pop();
                    var y = this._boxToErase[meshId].pop();
                    var z = this._boxToErase[meshId].pop();
                    this._displayer.eraseBox(x, y, z, meshId);
                }
                this._displayer.updateMeshes();
            }
        }
    }
};
Chunk.prototype.getHitBox = function (ray, playerPosition) {
    var boxType;
    var hitbox;
    var distanceFromPlayer;
    for (var x = 0; x < this._width; x++) {
        for (var y = 0; y <= this._realHeight; y++) {
            for (var z = 0; z < this._depth; z++) {
                boxType = this.getBoxType(x, y, z);
                if (boxType != undefined) {
                    var half = 0.5;
                    var minimum = new BABYLON.Vector3(this.positionInWorld.x + x - half, this.positionInWorld.y + y - half, this.positionInWorld.z + z - half);
                    var maximum = new BABYLON.Vector3(this.positionInWorld.x + x + half, this.positionInWorld.y + y + half, this.positionInWorld.z + z + half);
                    var intersected = ray.intersectsBoxMinMax(minimum, maximum);
                    var hit = new BABYLON.Vector3(this.positionInWorld.x + x, this.positionInWorld.y + y, this.positionInWorld.z + z);
                    if (intersected && (hitbox === undefined || distanceFromPlayer > BABYLON.Vector3.Distance(hit, playerPosition))) {
                        hitbox = hit;
                        distanceFromPlayer = BABYLON.Vector3.Distance(hitbox, playerPosition);
                    }
                }
            }
        }
    }
    return hitbox;
};
Chunk.prototype.getBoxType = function (x, y, z) {
    return this._chunkData[x * this._width + y * this._width * this._height + z];
};
Chunk.prototype.addBox = function (x, y, z, boxType) {
    this._chunkData[x * this._width + y * this._width * this._height + z] = boxType;
    if (y > this._realHeight)
        this._realHeight = y;
    this._boxToDraw[boxType].push(z, y, x);
};
Chunk.prototype.removeBox = function (x, y, z) {
    var boxType = this.getBoxType(x, y, z);
    this._chunkData[x * this._width + y * this._width * this._height + z] = undefined;
    if (boxType != undefined)
        this._boxToErase[boxType].push(z, y, x);
};
Chunk.CHUNKHEIGHT = 32;
Chunk.CHUNKWIDTH = 24;
Chunk.CHUNKDEPTH = 24;