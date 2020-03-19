// createjs typescript definition for TypeScript
/// <reference path="./../node_modules/@types/createjs/index.d.ts" />

// importing createjs framework
import "createjs";

// importing game constants
import { STAGE_WIDTH, STAGE_HEIGHT, BACKGROUND_COLOR, FRAME_RATE, ASSET_MANIFEST } from "./Constants";
import AssetManager from "./AssetManager";
import ShapeFactory from "./ShapeFactory";
import IntroScreen from "./IntroScreen";
import GameplayScreen from "./GameplayScreen";
import EndScreen from "./EndScreen";
import Gameplay from "./Gameplay";

// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;
let assetManager:AssetManager;
let introScreen:IntroScreen;
let gameplayScreen:GameplayScreen;
let endScreen:EndScreen;
let gameplay:Gameplay;

// --------------------------------------------------- event handlers
function onReady(e:createjs.Event):void {
    console.log(">> adding sprites to game");

    // construct game object sprites
    // ...

    introScreen = new IntroScreen(assetManager, stage);
    introScreen.showMe();

    gameplayScreen = new GameplayScreen(assetManager, stage);
    endScreen = new EndScreen(assetManager, stage);
    
    gameplay = new Gameplay(assetManager, stage);


    stage.on("gameplay", onShowGameplay);

    stage.on("introNext", onShowGameplay);
    stage.on("gameplayNext", onShowEnd);
    stage.on("endNext", onShowIntro);

    stage.on("introPrevious", onShowEnd);
    stage.on("gameplayPrevious", onShowIntro);
    stage.on("endPrevious", onShowGameplay);    

    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}

function onShowGameplay():void {
    console.log("intro screen next button has been clicked");
    introScreen.hideMe();
    gameplayScreen.showMe();
    endScreen.hideMe();

    gameplay.start();
    
}

function onShowEnd():void {
    console.log("content screen next button has been clicked");
    gameplayScreen.hideMe();
    endScreen.showMe();

    gameplay.terminate();
}

function onShowIntro():void {
    console.log("end screen next button has been clicked");
    endScreen.hideMe();
    introScreen.showMe();

    gameplay.terminate();
}

function onTick(e:createjs.Event):void {
    // TESTING FPS
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    // the official game loop here
    // ...

    gameplay.Update();
    

    // update the stage!
    stage.update();
}

// --------------------------------------------------- main method
function main():void {
    console.log(">> initializing");

    // get reference to canvas
    canvas = <HTMLCanvasElement> document.getElementById("game-canvas");
    // set canvas width and height - this will be the stage size
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;

    // create stage object
    stage = new createjs.StageGL(canvas, { antialias: true });
    stage.enableMouseOver(10);

    // color the stage
    let shapeFactory:ShapeFactory = new ShapeFactory(stage);
    shapeFactory.color = BACKGROUND_COLOR;
    shapeFactory.rectangle(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    // construct AssetManager object to load spritesheet and sound assets
    assetManager = new AssetManager(stage);
    stage.on("allAssetsLoaded", onReady, null, true);
    // load the assets
    assetManager.loadAssets(ASSET_MANIFEST);
}

main();