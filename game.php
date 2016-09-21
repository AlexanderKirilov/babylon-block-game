<?php
session_start();

if(!isset($_SESSION['user_session'])){
    header("Location: index.php");
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Dania</title>
    
    <link rel="stylesheet" href="assets/stylesheets/index.css">
</head>
<body>

	<canvas id='renderCanvas'>
	</canvas>

    <div id="debugPanel">
        <div id="chunkInfo">
            <p id="info">currentChunk:</p>
            <span id="chunkX"></span>
            <span id="chunkY"></span>
        </div>
        <div id="coordInfo">
            <p>currentPosInWorld:</p>
            <span id="posX"></span>
            <span id="posY"></span>
        </div>
    </div>


    <!-- hand js , for universal controls across devices | https://handjs.codeplex.com/ -->
    <script src="node_modules/handjs/hand.min.js" type="text/javascript" charset="utf-8"></script>
    <!-- physics library 
    <script src="node_modules/babylonjs/Oimo.js" type="text/javascript" charset="utf-8" async></script>-->
    <!-- the 3D engine - minified -->
    <script src="node_modules/babylonjs/babylon.max.js" type="text/javascript"></script>

    <script src="js/utilities.js" type="text/javascript"></script>
    <!-- the custom mesh -->
    <script src="js/boxmesh.js" type="text/javascript"></script>

    <script type="text/javascript" src="js/chunk.js"></script>
    <script type="text/javascript" src="js/chunkDisplayer.js"></script>
    
    <script type="text/javascript" src="js/terrainGenerator.js"></script>
    
    <script type="text/javascript" src="js/worldManager.js"></script>

    <script type="text/javascript" src="js/worldScene.js"></script>

    <script>
        Game.onInit();
    </script>
</body>