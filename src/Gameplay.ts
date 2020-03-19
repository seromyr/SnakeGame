//MAIN GAMEPLAY
import { STAGE_WIDTH, STAGE_HEIGHT } from "./Constants";
import AssetManager from "./AssetManager";

//keycode: source https://keycode.info/
enum KeyCode {Left = 37, Right = 39, Up = 38, Down = 40, A = 65, D = 68, W = 87, S = 83};

export default class Screen {

    private stage:createjs.StageGL;
    private screen:createjs.Container;

    //screen objects
    private snakeHead:createjs.Sprite;
    private snakeBody:createjs.Sprite;
    private snakeTail:createjs.Sprite;

    

    private food:createjs.Sprite;
    private hazard:createjs.Sprite;


    //gameplay variables
    //------------------------------- public 
    public isMoving:boolean = false;
    public isDead = false;

    //------------------------------- private
    private speed = 0.5;
    private length = 1;
    private direction:string[];
    private currentDirection:string;
    private score:number;
    private keypressed:KeyCode;
    private gridX:number[] = [];
    private gridY:number[] = [];
    private currentGridX: number;
    private currentGridY: number;

    //keycode event
   
    


    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        //construct stage and container
        this.stage = stage;
        //this.stage.enableMouseOver(10);
        this.screen = new createjs.Container();

        //construct snake visual
        this.snakeHead = assetManager.getSprite("gameObjectSsprites");
        this.snakeHead.gotoAndStop("Alive_Head_Right");
        this.snakeHead.name = "Alive Head";
        this.snakeHead.regX = this.snakeHead.getBounds().width/2;
        this.snakeHead.regY = this.snakeHead.getBounds().height/2;
        this.snakeHead.x = 0;//136;
        this.snakeHead.y = 0;//328;
        this.screen.addChild(this.snakeHead);
        
        this.snakeBody = assetManager.getSprite("gameObjectSsprites");
        this.snakeBody.gotoAndStop("Alive_Body");
        this.snakeBody.regX = this.snakeBody.getBounds().width/2;
        this.snakeBody.regY = this.snakeBody.getBounds().height/2;
        this.snakeBody.x = 0;
        this.snakeBody.y = 0;
        this.screen.addChild(this.snakeBody);
        
        this.direction = ["left", "right", "up", "down"];
        

        //construct snake controls & mechanics        
        let btnUP:createjs.Sprite = assetManager.getSprite("gameObjectSsprites");
        btnUP.gotoAndStop("Hazards");
        btnUP.name = "up";
        btnUP.x = 281;
        btnUP.y = 54;
        this.screen.addChild(btnUP);
        
        let btnDOWN:createjs.Sprite = assetManager.getSprite("gameObjectSsprites");
        btnDOWN.gotoAndStop("Hazards");
        btnDOWN.name = "down";
        btnDOWN.x = 281;
        btnDOWN.y = 570;
        this.screen.addChild(btnDOWN);
        
        let btnLEFT:createjs.Sprite = assetManager.getSprite("gameObjectSsprites");
        btnLEFT.gotoAndStop("Hazards");
        btnLEFT.name = "left";
        btnLEFT.x = 0;
        btnLEFT.y = 312;
        this.screen.addChild(btnLEFT);
        
        let btnRIGHT:createjs.Sprite = assetManager.getSprite("gameObjectSsprites");
        btnRIGHT.gotoAndStop("Hazards");
        btnRIGHT.name = "right";
        btnRIGHT.x = 568;
        btnRIGHT.y = 312;
        this.screen.addChild(btnRIGHT);


        btnUP.on("mousedown", this.onStart, this);
        btnDOWN.on("mousedown", this.onStart, this);
        btnLEFT.on("mousedown", this.onStart, this);
        btnRIGHT.on("mousedown", this.onStart, this);


        //btnUP.on("click", onStop);
        //btnUP.on("mouseout", onStop);
    }

    //-------------------------------------- public methods
    public start():void {
        this.populateGrid();
        this.snakeHead.x = this.gridX[3];
        this.snakeHead.y = this.gridY[7];
        this.stage.addChild(this.screen);
    }

    public terminate():void {
        //reset snake postion and sprite
        this.snakeHead.gotoAndStop("Alive_Head_Right");
        this.snakeHead.x = this.gridX[3];
        this.snakeHead.y = this.gridY[7];
        this.snakeHead.scaleX = 1;
        this.isMoving = false;

        //current score reset
        this.length = 1;
        
        this.stage.removeChild(this.screen);
    }

    private populateGrid():void {
        //fill GridX
        let x:number = 40;
        for (let i:number = 0; i < 17; i++)
        {
            this.gridX[i] = x;
            x +=32;
            console.log(`gridX ${i} populated with ${x}`);
        }

        //fill GridY
        let y:number = 104;
        for (let i:number = 0; i < 15; i++)
        {
            this.gridY[i] = y;
            y +=32;
            console.log(`gridX ${i} populated with ${y}`);
        }
    }

    private onStart(e:createjs.Event):void {
        switch (e.target.name)
        {
            case this.direction[0]:
                this.currentDirection = this.direction[0];
                break;

            case this.direction[1]:
                this.currentDirection = this.direction[1];
                break;

            case this.direction[2]:
                this.currentDirection = this.direction[2];
            break;

            case this.direction[3]:
                this.currentDirection = this.direction[3];
                break;
        }

        //enable mouse over event when the button is clicked
        //this.stage.enableMouseOver();
        
        console.log(e.target.name + " button is clicked");
        console.log("current direction is " + this.currentDirection);

        this.isMoving = true;
    }

    public Update() {
        if (this.isMoving) {        
            //current grid position check
            for (let i:number = 0; i < this.gridX.length; i++) {
                if (this.snakeHead.x >= this.gridX[i]) {
                    this.currentGridX = i;
                }
            }

            for (let i:number = 0; i < this.gridY.length; i++) {
                if (this.snakeHead.y >= this.gridY[i]) {
                    this.currentGridY = i;
                }
            }
        
            console.log(`snake nodeX: ${this.currentGridX}, nodeY: ${this.currentGridY}`);            

            switch (this.currentDirection) {
                //move the snake to the corresponding direction
                //and snap it to the grid
                case this.direction[0]:
                    this.snakeHead.gotoAndStop("Alive_Head_Right");
                    this.snakeHead.y = this.gridY[this.currentGridY];
                    this.snakeHead.x -= this.speed;
                    this.snakeHead.scaleX = -1;
                    if (this.snakeHead.x < - this.snakeHead.getBounds().width) {
                        this.snakeHead.x = STAGE_WIDTH;
                    }
                    break;
        
                case this.direction[1]:
                    this.snakeHead.gotoAndStop("Alive_Head_Right");
                    this.snakeHead.y = this.gridY[this.currentGridY];
                    this.snakeHead.x += this.speed;
                    this.snakeHead.scaleX = 1;
                    if (this.snakeHead.x > STAGE_WIDTH) {
                        this.snakeHead.x = - this.snakeHead.getBounds().width;
                    }
                    break;
        
                case this.direction[2]:
                    this.snakeHead.gotoAndStop("Alive_Head_Up");
                    this.snakeHead.x = this.gridX[this.currentGridX];
                    this.snakeHead.y -= this.speed;
                    if (this.snakeHead.y < - this.snakeHead.getBounds().height) {
                        this.snakeHead.y = STAGE_HEIGHT;
                    }
                    break;
        
                case this.direction[3]:
                    this.snakeHead.gotoAndStop("Alive_Head_Down");
                    this.snakeHead.x = this.gridX[this.currentGridX];
                    this.snakeHead.y += this.speed;
                    if (this.snakeHead.y > STAGE_HEIGHT) {
                        this.snakeHead.y = - this.snakeHead.getBounds().height;
                    }
                    break;
            }
        }
    }
}


