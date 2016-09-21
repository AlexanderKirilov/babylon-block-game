var TerrainGenerator = (function(){
    function TerrainGenerator(worldManager, pathToTerrain, pathToHeightMap){
        this._pathToTerrain = pathToTerrain; 
        this._pathToHeightMap = pathToHeightMap;

        this._imageWidth = 0;
        this._imageHeight = 0;

        this._worldManager = worldManager;


        this._terrainMapImg = new Image();
        this._terrainMapImg.src = this._pathToTerrain;
        this._terrainMapBool = false;
        
        this._terrainMapData;
        
        this._heightMapImg = new Image();
        this._heightMapImg.src = this._pathToHeightMap;
        this._heightMapBool = false;

        this._heightMapData;

        var that = this;
        //Get image data from the Terrain Map
        this._terrainMapImg.addEventListener('load', function(){
            that._terrainMapBool = true;

            that._imageWidth = this.width;
            that._imageHeight = this.height;

            var canvas = document.createElement('canvas')
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext('2d');

            ctx.drawImage(this, 0, 0);

            that._terrainMapData = ctx.getImageData(0, 0, this.width, this.height).data;

            if(that._mapIsLoaded()){
                that.populateWorldTerrain();
            }
        });
        this._terrainMapImg.addEventListener('error', function(){
            console.log('failed to load terrainMap file -- TerrainGenerator');
        });

        //Get image date from Height Map
        this._heightMapImg.addEventListener('load', function(){
            that._heightMapBool = true;

            var canvas = document.createElement('canvas')
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext('2d');

            ctx.drawImage(this, 0, 0);

            that._heightMapData = ctx.getImageData(0, 0, this.width, this.height).data;

            if(that._mapIsLoaded()){
                that.populateWorldTerrain();
            }
        });
        this._heightMapImg.addEventListener('error', function(){
            console.log('failed to load terrainHeightMap file -- TerrainGenerator');
        });
    }

    //Populates worldManager with info from the image data
    TerrainGenerator.prototype.populateWorldTerrain = function (){
        var height = 0;
        for (var x = 0; x < this._worldManager._width * Chunk.CHUNKWIDTH; x++) {
            for (var z = 0; z < this._worldManager._depth * Chunk.CHUNKDEPTH; z++) {
                height = this._getMapHeightAt(x,z);
                for(var i = height-1; i <= height; i++){
                    this._worldManager.addBox(x, i , z, this._getBlockTypeAt(x,z));
                }
            }
        }
    }

    TerrainGenerator.prototype._getBlockTypeAt = function (x, y){
        var hexColor = this._getMapPixelColorAt(x, y);
        //TODO move this to BlockTypes
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

    //Calculate TerrainMap at:
    TerrainGenerator.prototype._getMapPixelColorAt = function(x, y){
        var index = (y * this._imageWidth + x) * 4;

        return rgbToHex(this._terrainMapData[index],this._terrainMapData[++index],this._terrainMapData[++index]);   
    }
    //Calculate HeightMap at:
    TerrainGenerator.prototype._getMapHeightAt = function(x, y){
        var index = (y * this._imageWidth + x) * 4;

        var height = Math.floor(this._heightMapData[index]/8);
        height = (height < 1) ? 1 : height;
        return height;
    }

    TerrainGenerator.prototype._mapIsLoaded = function(){
        if(this._terrainMapBool && this._heightMapBool){
            return true;
        }else{
            return false;
        }
    }
    
    return TerrainGenerator;
})();