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

//score bitmap text
let scoreCurrent:createjs.BitmapText;
let scoreHighest:createjs.BitmapText;
let hiScore:number;

//keyboard input variables
let downkey: boolean = false;
let upkey: boolean = false;
let leftkey: boolean = false;
let rightkey: boolean = false;
let keyDownCount :number = 0;

//let browser focus on gameplay canvas after loading
window.focus();

// --------------------------------------------------- keyboard input monitor
function monitorKeys():void {
    if      (leftkey)  keyDownCount++;
    else if (rightkey) keyDownCount++;
    else if (upkey)    keyDownCount++;
    else if (downkey)  keyDownCount++;
}

// --------------------------------------------------- game constructor
function onReady(e:createjs.Event):void {
    console.log(">> adding sprites to game");

    //set current state of keys
    downkey = false;
    upkey = false;
    rightkey = false;
    leftkey = false;

    // construct game object sprites
    introScreen = new IntroScreen(assetManager, stage);
    gameplayScreen = new GameplayScreen(assetManager, stage);
    endScreen = new EndScreen(assetManager, stage);

    scoreCurrent = new createjs.BitmapText(" ", assetManager.getSpriteSheet("fontCalibri"));
    scoreHighest = new createjs.BitmapText(" ", assetManager.getSpriteSheet("fontCalibri"));
    hiScore = 0;

    // intro screen is displayed by default
    introScreen.showMe();
    
    gameplay = new Gameplay(assetManager, stage);

    // keyboard input monitors
    stage.on("click", onShowGameplay, null, true);
    stage.on("gameplay", onShowGameplay);
    
    //intro screen appears only once
    stage.on("introNext", onShowGameplay, null, true);

    //wire up eventListener for keyboard keys to start game
    document.onkeydown = (e:KeyboardEvent) => {
        if (e.keyCode == 32 ||
            e.keyCode == 13 ||
            e.keyCode == 37 ||
            e.keyCode == 38 ||
            e.keyCode == 39 ||
            e.keyCode == 40) {
            onShowGameplay();
        }
    };

    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}

function onShowGameplay():void {
    introScreen.hideMe();
    gameplayScreen.showMe();
    endScreen.hideMe();

    //wire up eventListener for keyboard keys only on gameplay screen
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
    gameplay.start();
}

function onShowEnd():void {
    gameplayScreen.hideMe();
    endScreen.showMe();
    
    
    writeScore(232,252, (gameplay.score).toString());
    writeHiScore(362,252, hiScore.toString());
    //remove keyboard event listener
    document.onkeydown = null;
    document.onkeyup = null;

    gameplay.terminate();
}

function onKeyDown(e:KeyboardEvent):void {
    // which key is pressed?
    if (e.keyCode == 37 || e.keyCode == 65) {
        leftkey = true;
        //console.log("Left key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[1]) {
            gameplay.currentDirection == gameplay.direction[1]
        }
        else gameplay.currentDirection = gameplay.direction[0];
    }
        
    else if (e.keyCode == 39 || e.keyCode == 68) {
        rightkey = true;
        //console.log("Right key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[0]) {
            gameplay.currentDirection == gameplay.direction[0]
        }
        else gameplay.currentDirection = gameplay.direction[1];
    }

    else if (e.keyCode == 38 || e.keyCode == 87) {
        upkey = true;
        //console.log("Up key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[3]) {
            gameplay.currentDirection == gameplay.direction[3]
        }
        else gameplay.currentDirection = gameplay.direction[2];
    }

    else if (e.keyCode == 40 || e.keyCode == 83) {
        downkey = true;
        //console.log("Down key is pressed.");
        if (gameplay.currentDirection == gameplay.direction[2]) {
            gameplay.currentDirection == gameplay.direction[2]
        }
        else gameplay.currentDirection = gameplay.direction[3];
    }

    console.log("Current direction is " + gameplay.currentDirection);
    gameplay.isMoving = true;
}

function onKeyUp(e:KeyboardEvent):void {
    keyDownCount = 0;

    if      (e.keyCode == 37) leftkey  = false;
    else if (e.keyCode == 39) rightkey = false;
    else if (e.keyCode == 38) upkey    = false;
    else if (e.keyCode == 40) downkey  = false;

    if (e.keyCode == 37 ||
        e.keyCode == 38 ||
        e.keyCode == 39 ||
        e.keyCode == 40) {
        //play sound effect
        createjs.Sound.play("keyUpSound");
    }
}

function onTick(e:createjs.Event):void {
    // TESTING FPS
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    // the official game loop here
    // monitoring key input
    monitorKeys();

    gameplay.Update();
    writeScore(64,24, (gameplay.score).toString());

    if (gameplay.showHiScore)
        {
            writeHiScore(192,24, hiScore.toString());
        }

    if (hiScore < gameplay.score)
    {
        hiScore =  gameplay.score;
    }

    if (gameplay.gameOver)
    {
       onShowEnd();
    }    

    // update the stage!
    stage.update();
}

// get score from gameplay
function writeScore(x:number, y:number, message:string):void {
    scoreCurrent.text = message;
    scoreCurrent.letterSpacing = 1;
    scoreCurrent.lineHeight = 32;
    scoreCurrent.x = x;
    scoreCurrent.y = y;
    stage.addChild(scoreCurrent);
}

function writeHiScore(x:number, y:number, message:string):void {
    scoreHighest.text = message;
    scoreHighest.letterSpacing = 1;
    scoreHighest.lineHeight = 32;
    scoreHighest.x = x;
    scoreHighest.y = y;
    stage.addChild(scoreHighest);
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