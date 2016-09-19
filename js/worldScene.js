var Game = function(){
    var DEBUG = false;

    var worldWidthInChunks = 25;
    var worldDepthInChunks = 25;

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function (engine) {
        var scene = new BABYLON.Scene(engine);

        scene.collisionsEnabled = true;
        //scene.gravity = new BABYLON.Vector3(0, -5, 0);       

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 25, 0), scene);
        light.intensity = 1.0;

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 6000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/images/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        return scene;
    };

    var createWorldManager = function (scene) {
        var worldManager = new WorldManager(worldWidthInChunks, worldDepthInChunks, 1, scene);
        return worldManager;
    };

    var _createCamera = function(scene){
        var startPointPlayer = new BABYLON.Vector3(10 * 16, 20, 10 * 16);

        var camera = new BABYLON.FreeCamera("freeCamera", startPointPlayer, scene);
        //camera = new BABYLON.ArcRotateCamera("arcCamera", 1, 0.8, 10, new BABYLON.Vector3(0, -1, 0), scene);
        camera.attachControl(canvas, false);
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysRight.push(68);
        camera.keysLeft.push(65);

        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        camera.applyGravity = false;
        camera.checkCollisions = true;
        camera.speed = 0.4;

        return camera;
    }

    function onInit(){
        var scene = createScene(engine);
        var camera = _createCamera(scene);

        var worldManager = createWorldManager(scene);

        //add/remove boxed
        canvas.addEventListener('mouseup', function (evt) {
            var mousePos = getMousePos(canvas, evt);
            if(evt.which === 1){
                worldManager.addFromCoords(mousePos.x, mousePos.y, camera);
            }else{
                worldManager.removeFromCoords(mousePos.x, mousePos.y, camera);
            }
        }, false);

        //handle chunk generation at movement
        setInterval(function () {
            worldManager.setPlayerPosition(camera.position.x, camera.position.y, camera.position.z);
        }, 500);
        //Listen for resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
        
        /*
            FOR DEBUG PURPOSES ONLY
        */
        if(DEBUG){
        var posx = document.getElementById('posX');
        var posy = document.getElementById('posY');
            setInterval(function(){
                posx.style.display = 'block';
                posy.style.display = 'block';
                posx.innerHTML = Math.round(camera.position.x);
                posy.innerHTML = Math.round(camera.position.z);
                worldManager.displayCurrentPlayerChunk()
            }, 2000);
            scene.debugLayer.show();
        }

        engine.runRenderLoop(function () {
            scene.render();
        });
    }


    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function getChar(event) {
        if (event.which == null) {
            return String.fromCharCode(event.keyCode) // IE
        } else if (event.which!=0 && event.charCode!=0) {
            return String.fromCharCode(event.which)   // the rest
        } else {
            return null // special key
        }
    }
    
    return {
        onInit: function(){
            onInit();
        }
    }
}();