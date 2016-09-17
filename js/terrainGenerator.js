function TerrainGenerator(pathToImage, worldManager){
    this._pathToImage = pathToImage; 
    this._imageWidth = 0;
    this._imageHeight = 0;

    this._worldManager = worldManager;

    this._chunkWidth = Chunk.CHUNKWIDTH;
    this._chunkDepth = Chunk.CHUNKDEPTH;
    
    this._imgMap = new Image();
    this._imgMap.src = this._pathToImage;

    this._mapData;
    
    var that = this;
    this._imgMap.addEventListener('load', function(){

        that._imageWidth = this.width;
        that._imageHeight = this.height;

        var canvas = document.createElement('canvas')
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');

        ctx.drawImage(this, 0, 0);

        that._mapData = ctx.getImageData(0, 0, this.width, this.height).data;

        that.populateTerrain();
    });

    this._imgMap.addEventListener('error', function(){
        console.log('failed to load terrainMap file -- TerrainGenerator');
    });
}

TerrainGenerator.prototype.populateWorldTerrain = function (){
    var height = 1;
    for (var x = 0; x < this._worldManager._width * Chunk.CHUNKWIDTH; x++) {
        for (var z = 0; z < this._worldManager._depth * Chunk.CHUNKDEPTH; z++) {
            height = 1;
            this._worldManager.addBox(x, 1, z, BlocKTypes.GRASS);
        }
    }
}

TerrainGenerator.prototype._getBlockTypeAt = function (x, y){

}

TerrainGenerator.prototype._getMapPixelColorAt = function(x, y){
    var index = (y * canvasWidth + x) * 4;
}