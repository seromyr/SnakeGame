//MAIN GAMEPLAY
import { STAGE_WIDTH, STAGE_HEIGHT, GAMEPLAY_GRIDX, GAMEPLAY_GRIDY } from "./Constants";
import AssetManager from "./AssetManager";

//keycode: source https://keycode.info/
enum KeyCode {Left = 37, Right = 39, Up = 38, Down = 40, A = 65, D = 68, W = 87, S = 83};

export default class Screen {

    private stage:createjs.StageGL;
    private screen:createjs.Container;

    //screen objects
    private _snakeHead:createjs.Sprite;
    private _snakeBody:createjs.Sprite[] = [];
    private _snakeTail:createjs.Sprite;
    private _food:createjs.Sprite;
    private _hazard:createjs.Sprite;

    //gameplay variables   
    //------------------------------- private
    //--------------------------------------- for the snake head only
    private _snakeSpeed = 8;
    private _snakeLength = 255;
    private _direction:string[];
    private _currentDirection:string;
    private score:number;
    private gridX:number[] = [];
    private gridY:number[] = [];
    private currentGridX:number;
    private currentGridY:number;

    //--------------------------------------- for the whole snake
    private travelLog:number[][] = [[],[]];
    private _isMoving:boolean = false;
    private _directionSwitch:boolean;

    //--------------------------------------- for the food aka. Donut
    private currentFoodGridX:number = 7;
    private currentFoodGridY:number = 7;

    //encapsulation of important variables
    get currentDirection():string                   {return this._currentDirection;}
    set currentDirection(value:string)              { this._currentDirection = value;}

    get direction():string[]                        {return this._direction;}

    get isMoving():boolean                          {return this._isMoving;}
    set isMoving(value:boolean)                     { this._isMoving = value;}
    
    get directionSwitch():boolean                   {return this._directionSwitch;}
    set directionSwitch(value:boolean)              { this._directionSwitch = value;}

    //CONSTRUCTOR
    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        //construct stage and container
        this.stage = stage;
        this.screen = new createjs.Container();

        //construct snake default visual

        //---------------------- the head
        this._snakeHead = assetManager.getSprite("gameObjectSsprites");
        this._snakeHead.gotoAndStop("Alive_Head_Right");
        this._snakeHead.name = "Alive Head";
        this._snakeHead.regX = this._snakeHead.getBounds().width/2;
        this._snakeHead.regY = this._snakeHead.getBounds().height/2;
        this.screen.addChild(this._snakeHead);

        //---------------------- the body        
        for (let i:number = 0; i < this._snakeLength; i++)
        {
            this._snakeBody[i] = assetManager.getSprite("gameObjectSsprites");
            this._snakeBody[i].gotoAndStop("Alive_Body");
            this._snakeBody[i].regX = this._snakeBody[i].getBounds().width/2;
            this._snakeBody[i].regY = this._snakeBody[i].getBounds().height/2;
        }

        //---------------------- the tail
        this._snakeTail = assetManager.getSprite("gameObjectSsprites");
        this._snakeTail.gotoAndStop("Alive_Tail_Right");
        this._snakeTail.regX = this._snakeTail.getBounds().width/2;
        this._snakeTail.regY = this._snakeTail.getBounds().height/2;
        this.screen.addChild(this._snakeTail);

        //snake direction
        this._direction = ["left", "right", "up", "down"];

        //snake travel log initialization
        //----------------------- head
        this.travelLog[0][0] = 3;
        this.travelLog[0][1] = 7;
        //----------------------- body
        this.travelLog[1][0] = 2;
        this.travelLog[1][1] = 7;
        //----------------------- tail
        this.travelLog.push([1,7]);
        
        //construct food visual
        this._food = assetManager.getSprite("gameObjectSsprites");
        this._food.gotoAndStop("Donut");
        this._food.name = "Donut";
        this._food.regX = this._food.getBounds().width/2;
        this._food.regY = this._food.getBounds().height/2;
        this.currentFoodGridX = 7;
        this.currentFoodGridY = 7;

        this.screen.addChild(this._food);
    }

    //PUBLIC METHODS
    //-------------- to start a new game
    public start():void {
        //initiate snake position and sprite
        this.populateGrid();
        this.currentGridX = 3;
        this.currentGridY = 7;
        this._snakeLength = 1;

        //draw default game objects with default value
        //--------------------------------------------- food position
        this._food.x = this.gridX[7];
        this._food.y = this.gridY[7];
        //--------------------------------------------- snake head position
        this._snakeHead.x = this.gridX[3];
        this._snakeHead.y = this.gridY[7];
        //--------------------------------------------- snake body position
        this._snakeBody[0].x = this.gridX[2];
        this._snakeBody[0].y = this.gridY[7];
        this.screen.addChild(this._snakeBody[0]);
        //--------------------------------------------- snake tail position
        this._snakeTail.x = this.gridX[1];
        this._snakeTail.y = this.gridY[7];

        this.stage.addChild(this.screen);
    }

    //-------------- to stop a game
    public terminate():void {
        //reset snake postion and sprite
        this._snakeHead.gotoAndStop("Alive_Head_Right");
        this._snakeHead.x = this.gridX[3];
        this._snakeHead.y = this.gridY[7];
        this._snakeHead.scaleX = 1;

        this._snakeBody[0].gotoAndStop("Alive_Body");
        this._snakeBody[0].x = this.gridX[2];
        this._snakeBody[0].y = this.gridY[7];

        this._snakeTail.gotoAndStop("Alive_Tail_Right");
        this._snakeTail.x = this.gridX[1];
        this._snakeTail.y = this.gridY[7];

        for (let i:number = 0; i < this._snakeLength; i++)
        {
            //this.stage.removeChild(this.snakeBody[i]);
            this._snakeBody[i].x = this.gridX[2];
            this._snakeBody[i].y = this.gridY[7];
            this.travelLog.pop();

            this.screen.removeChild(this._snakeBody[i]);
            this.screen.removeChild(this._snakeBody[i]);
        }
        this.travelLog.push([1,7]);
        
        this.stage.removeChild(this.screen);
        
        //current score reset
        this._snakeLength = 1;
        this._isMoving = false;
    }

    //PRIVATE METHODS
    //--------------- to random a number
    private randomMe(low:number, high:number) {
        let randomNum:number = 0;
        randomNum = Math.floor(Math.random() * (high - low + 1)) + low;
        return randomNum;
    }

    //--------------- to create a matrix for the snake to travel within
    private populateGrid():void {
        //create columns
        let x:number = 40; // << start X postion of the 1st grid on the game canvas
        for (let i:number = 0; i < GAMEPLAY_GRIDX; i++)
        {
            this.gridX[i] = x;
            x +=32;
            console.log(`gridX ${i} populated with ${x}`);
        }

        //create rows
        let y:number = 104; // << start Y postion of the 1st grid on the game canvas
        for (let i:number = 0; i < GAMEPLAY_GRIDY; i++)
        {
            this.gridY[i] = y;
            y +=32;
            console.log(`gridY ${i} populated with ${y}`);
        }
    }

    //--------------- to monitor snake travel history
    private TravelLogMonitor():void {
        
        //if the snake head moved to a new grid, shift the array values to the next index elements
        //----------------  X  ----------------------------------------  Y  -----------------------
        if (this.travelLog[0][0] != this.currentGridX || this.travelLog[0][1] != this.currentGridY)
        {
            //console.log("snake head moved to a new position");

            //start shifting
            for (let i:number = this.travelLog.length - 1; i > 0; i--)
            {
                //the X
                this.travelLog[i][0] = this.travelLog[i - 1][0];
                //the Y
                this.travelLog[i][1] = this.travelLog[i - 1][1];
            }

            //update the head
            this.travelLog[0][0] = this.currentGridX;
            this.travelLog[0][1] = this.currentGridY;

            //snake body stays somewhere in between, starts from the second index
            for (let i:number = 0; i < this._snakeLength; i++)
            {
                this._snakeBody[i].x = this.gridX[this.travelLog[i + 1][0]];
                this._snakeBody[i].y = this.gridY[this.travelLog[i + 1][1]];
            }
            
            //snake tail will always be in the last element of the array
            this._snakeTail.x = this.gridX[this.travelLog[this.travelLog.length - 1][0]];
            this._snakeTail.y = this.gridY[this.travelLog[this.travelLog.length - 1][1]];
        }
    }

    //--------------- to control the snake
    private SnakeController()
    {
        switch (this._currentDirection) {
            //move the snake to the corresponding direction
            //and snap it to the grid
            case this._direction[0]:
                this._snakeHead.gotoAndStop("Alive_Head_Right");

                for (let i:number = 0; i < this.gridX.length; i++)
                {
                    if (this._snakeHead.x >= this.gridX[i])
                    {
                        this.currentGridX = i;
                    }
                }

                this._snakeHead.y = this.gridY[this.currentGridY];
                this._snakeHead.x -= this._snakeSpeed;
                this._snakeHead.scaleX = -1;

                if (this._snakeHead.x <= this.gridX[0])
                {
                    this.isMoving = false;
                }
                break;
    
            case this._direction[1]:
                this._snakeHead.gotoAndStop("Alive_Head_Right");

                for (let i:number = 0; i < this.gridX.length; i++)
                {
                    if (this._snakeHead.x + 31 >= this.gridX[i])
                    {
                        this.currentGridX = i;
                    }
                }

                this._snakeHead.y = this.gridY[this.currentGridY];
                this._snakeHead.x += this._snakeSpeed;
                this._snakeHead.scaleX = 1;

                if (this._snakeHead.x  >= this.gridX[16])
                {
                    this.isMoving = false;
                }
                break;
    
            case this._direction[2]:
                this._snakeHead.gotoAndStop("Alive_Head_Up");

                for (let i:number = 0; i < this.gridY.length; i++)
                {
                    if (this._snakeHead.y >= this.gridY[i])
                    {
                        this.currentGridY = i;
                    }
                }

                this._snakeHead.x = this.gridX[this.currentGridX];
                this._snakeHead.y -= this._snakeSpeed;

                if (this._snakeHead.y <= this.gridY[0])
                {
                    this.isMoving = false;
                }
                break;
    
            case this._direction[3]:
                this._snakeHead.gotoAndStop("Alive_Head_Down");

                for (let i:number = 0; i < this.gridY.length; i++)
                {
                    if (this._snakeHead.y + 31 >= this.gridY[i])
                    {
                        this.currentGridY = i;
                    }
                }

                this._snakeHead.x = this.gridX[this.currentGridX];
                this._snakeHead.y += this._snakeSpeed;

                if (this._snakeHead.y >= this.gridY[14])
                {
                    this.isMoving = false;
                }
                break;
        }
    }

    //--------------- to monitor the food
    private FoodMonitor()
    {
        //check if the donut has been eaten or not
        let foodEaten:boolean = false;

        //donut is eaten when snake head collides with the donut
        if (this.currentGridX == this.currentFoodGridX && this.currentGridY == this.currentFoodGridY)
        {
            foodEaten = true;
            console.log("Donut eaten!");
            this._snakeLength++;

            //increase the size of the travel log array at the last index
            this.travelLog.push([,]);
            //display the newly added snake body
            this.screen.addChild(this._snakeBody[this._snakeLength - 1]);
            
            console.log("Snake length increased to " + this._snakeLength);
        }

        //random a new food on the gameplay canvas
        if (foodEaten)
        {
            do
            {
                this.currentFoodGridX = this.randomMe(0, this.gridX.length - 1);
                this.currentFoodGridY = this.randomMe(0, this.gridY.length - 1);
            }

            while
                (
                    this.currentFoodGridX == this.currentGridX &&
                    this.currentFoodGridY == this.currentGridY &&
                    this.travelLog.includes([this.currentFoodGridX,this.currentFoodGridY])
                )

            this._food.x = this.gridX[this.currentFoodGridX];  
            this._food.y = this.gridY[this.currentFoodGridY];
            console.log("food x: " + this.gridX[this.currentFoodGridX]);
            console.log("food Y: " + this.gridY[this.currentFoodGridY]);
        }      
    }

    public Update() {

        if (this._isMoving)
        {
            this.FoodMonitor();
            this.TravelLogMonitor();
            this.SnakeController();
            //console.log(`snake nodeX: ${this.currentGridX}, nodeY: ${this.currentGridY}`);            
        }
    }
}


