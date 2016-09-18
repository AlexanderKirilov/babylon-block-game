function TerrainGenerator(worldManager, pathToTerrain, pathToHeightMap){
    this._pathToTerrain = pathToTerrain; 
    this._pathToHeightMap = pathToHeightMap;

    this._imageWidth = 0;
    this._imageHeight = 0;

    this._worldManager = worldManager;

    this._chunkWidth = Chunk.CHUNKWIDTH;
    this._chunkDepth = Chunk.CHUNKDEPTH;
    

    this._terrainMapImg = new Image();
    this._terrainMapImg.src = this._pathToTerrain;
    this._terrainMapBool = false;
    
    this._terrainMapData;

    var that = this;
    this._terrainMapImg.addEventListener('load', function(){
        this._terrainMapBool = true;

        that._imageWidth = this.width;
        that._imageHeight = this.height;

        var canvas = document.createElement('canvas')
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');

        ctx.drawImage(this, 0, 0);

        that._terrainMapData = ctx.getImageData(0, 0, this.width, this.height).data;

        that.populateWorldTerrain();
    });

    this._terrainMapImg.addEventListener('error', function(){
        console.log('failed to load terrainMap file -- TerrainGenerator');
    });
}

TerrainGenerator.prototype.populateWorldTerrain = function (){

    var height = 1;
    for (var x = 0; x < this._worldManager._width * Chunk.CHUNKWIDTH; x++) {
        for (var z = 0; z < this._worldManager._depth * Chunk.CHUNKDEPTH; z++) {
            height = 1;
            this._worldManager.addBox(x, 1, z, this._getBlockTypeAt(x,z));
        }
    }
}

TerrainGenerator.prototype._getBlockTypeAt = function (x, y){
    var hexColor = this._getMapPixelColorAt(x, y);

    var blockType = 0;
    switch(hexColor){
        case '#0000ff':
            blockType = BlockTypes.STONE;
            break;
        case '#00ff00':
            blockType = BlockTypes.WOOD;
            break;
        default:
            blockType = BlockTypes.GRASS;
            break;
    }
    return blockType;
}

TerrainGenerator.prototype._getMapPixelColorAt = function(x, y){
    var index = (y * this._imageWidth + x) * 4;

    return rgbToHex(this._terrainMapData[index],this._terrainMapData[++index],this._terrainMapData[++index]);   
}

TerrainGenerator.prototype._getMapHeightAt = function(x, y){
    var index = (y * this._imageWidth + x) * 4;

    return this._heightMapData[index];
}