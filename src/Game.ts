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

//keyboard input variables

let downkey: boolean = false;
let upkey: boolean = false;
let leftkey: boolean = false;
let rightkey: boolean = false;
let keyDownCount :number = 0;
// window.focus();

// --------------------------------------------------- private methods
function monitorKeys():void {
    if (leftkey) {
        keyDownCount++;

    } else if (rightkey){

        keyDownCount++;

    } else if (upkey){

        keyDownCount++;

    } else if (downkey){

        keyDownCount++;
    }
}

// --------------------------------------------------- event handlers
function onReady(e:createjs.Event):void {
    console.log(">> adding sprites to game");

    //set current state of keys
    downkey = false;
    upkey = false;
    rightkey = false;
    leftkey = false;

    // construct game object sprites
    // ...

    introScreen = new IntroScreen(assetManager, stage);
    introScreen.showMe();

    gameplayScreen = new GameplayScreen(assetManager, stage);
    endScreen = new EndScreen(assetManager, stage);
    
    gameplay = new Gameplay(assetManager, stage);


    stage.on("gameplay", onShowGameplay);

    stage.on("introNext", onShowGameplay);
    //stage.on("gameplayNext", onShowEnd);
    //stage.on("endNext", onShowIntro);

    //stage.on("introPrevious", onShowEnd);
    //stage.on("gameplayPrevious", onShowIntro);
    //stage.on("endPrevious", onShowGameplay);
    
    //wire up eventListener for keyboard keys
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;

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

function onKeyDown(e:KeyboardEvent):void {

    // which key is pressed?
    if (e.keyCode == 37) {
        leftkey = true;
        //console.log("Left key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[1])
        {
            gameplay.currentDirection == gameplay.direction[1]
        }
        else gameplay.currentDirection = gameplay.direction[0];
    }
        
    else if (e.keyCode == 39) {
        rightkey = true;
        //console.log("Right key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[0])
        {
            gameplay.currentDirection == gameplay.direction[0]
        }
        else gameplay.currentDirection = gameplay.direction[1];
        
    } 
    else if (e.keyCode == 38) {
        upkey = true;
        //console.log("Up key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[3])
        {
            gameplay.currentDirection == gameplay.direction[3]
        }
        else gameplay.currentDirection = gameplay.direction[2];
    } 
    else if (e.keyCode == 40) {
        downkey = true;
        //console.log("Down key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[2])
        {
            gameplay.currentDirection == gameplay.direction[2]
        }
        else gameplay.currentDirection = gameplay.direction[3];
    }

    console.log("Current direction is " + gameplay.currentDirection);
    gameplay.isMoving = true;
    //console.log(keyDownCount);
}

function onKeyUp(e:KeyboardEvent):void {
    keyDownCount = 0;

    if (e.keyCode == 37) leftkey = false;
    else if (e.keyCode == 39) rightkey = false;
    else if (e.keyCode == 38) upkey = false;
    else if (e.keyCode == 40) downkey = false;

    if (e.keyCode == 37 || e.keyCode == 38 ||e.keyCode == 39 ||e.keyCode == 40) {
        //play sound effect
        createjs.Sound.play("keyUpSound");
    }
}

function onTick(e:createjs.Event):void {
    // TESTING FPS
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    // the official game loop here
    // ...

    //Monitor keys
    monitorKeys();

    gameplay.Update();
    if (gameplay.isDead)
    {
       onShowEnd();
    }    

    // update the stage!
    stage.update();
}

// --------------------------------------------------- main method
function main():void {
    window.focus();
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