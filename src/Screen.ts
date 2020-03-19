import AssetManager from "./AssetManager";

export default class Screen { 
    
    protected stage:createjs.StageGL; //protected is not the same as static, but accessible for its children 1 level down
    protected screen:createjs.Container;

    //screen objects
    protected instructions:createjs.Sprite;
    protected btnReplay:createjs.Sprite;
    protected shape01:createjs.Shape;
    protected titleText:createjs.BitmapText;
    protected bodyText:createjs.BitmapText;
    protected uiDonut:createjs.Sprite;
    protected uiCup:createjs.Sprite;

    //custom event
    protected eventNext:createjs.Event;
    protected eventPrevious:createjs.Event;
    protected eventGameplay:createjs.Event;

    //------------------------------------ GAME OVER SCREEN
    protected eventRestart:createjs.Event;

    constructor(assetManager:AssetManager, stage:createjs.StageGL, type:string) {
        this.stage = stage;

        //construct a Container to hold all sprites of this stage
        this.screen = new createjs.Container();

        //construct Sprite object for screen background
        let background:createjs.Sprite = assetManager.getSprite("gameUI", "Background", 0,0);
        this.screen.addChild(background);

        //construct bitmap texts
        this.titleText = new createjs.BitmapText(" ", assetManager.getSpriteSheet("fontImpact"));
        this.bodyText = new createjs.BitmapText(" ", assetManager.getSpriteSheet("fontCalibri")); 

        //add instructions
        this.instructions = assetManager.getSprite("gameUI", "howToPlay", 168, 150);

        //setup replay button
        this.btnReplay = assetManager.getSprite("gameUI", "Button Up", 294, 408);
        let replayBtnHelper:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnReplay, "Button Up", "Button Over", "Button Down", false);
        
        //draw a rounded rectangle
        this.shape01 = new createjs.Shape();
        this.shape01.graphics.beginFill("black");
        this.shape01.graphics.drawRoundRect(0,0,416,352,20);
        this.shape01.cache(0,0,416,352);
        this.shape01.alpha = 0.25;
        this.shape01.x = 88;
        this.shape01.y = 155;

        //draw a UI donut
        this.uiDonut = assetManager.getSprite("gameObjectSsprites");

        //draw a UI cup
        this.uiCup = assetManager.getSprite("gameUI")








        //add previous button to this screen
        let btnPrevious:createjs.Sprite = assetManager.getSprite("sprites", "buttons/previousUp", 10, 575);
        this.screen.addChild(btnPrevious);

        //add next button to this screen
        let btnNext:createjs.Sprite = assetManager.getSprite("sprites", "buttons/nextUp", 550, 575);
        this.screen.addChild(btnNext);

        //set up button helper to make btnNext & btnPrevious behave like a button
        let hitAreaSprite:createjs.Sprite = assetManager.getSprite("sprites", "buttons/hotspot");
        let nextButtonHelper:createjs.ButtonHelper = new createjs.ButtonHelper(btnNext,"buttons/nextUp", "buttons/nextOver", "buttons/nextOver",false, hitAreaSprite, "buttons/hotspot");
        let nextButtonHelper2:createjs.ButtonHelper = new createjs.ButtonHelper(btnPrevious,"buttons/previousUp", "buttons/previousOver", "buttons/previousOver",false, hitAreaSprite, "buttons/hotspot");

        //set up event listener for replay button
        this.btnReplay.on("click", this.onGameplay, this);

        btnNext.on("click", this.onNext, this); // => arrow function could solve this as well, scoping problem
        btnPrevious.on("click", this.onPrevious, this);

        //construct custom events
        this.eventNext = new createjs.Event(`${type}Next`, true, false);
        this.eventPrevious = new createjs.Event(`${type}Previous`, true, false);
        this.eventGameplay = new createjs.Event("gameplay", true, false);
    }
    
    //-------------------------------------- event handlers
    private onNext(e:createjs.Event):void {
        console.log("next clicked");

        //announce to the world that the next button has been clicked
        this.stage.dispatchEvent(this.eventNext);
    }
    
    private onPrevious(e:createjs.Event):void {
        console.log("previous clicked");
        this.stage.dispatchEvent(this.eventPrevious);
    }
    
    private onGameplay(e:createjs.Event):void {
        console.log("replay clicked");
        this.stage.dispatchEvent(this.eventGameplay);
    }
    
    //-------------------------------------- public methods
    public showMe():void {
        this.stage.addChild(this.screen);
    }

    public hideMe():void {
        this.stage.removeChild(this.screen);
    }

    public showInstruction():void {
        this.screen.addChild(this.instructions);
    }

    public showReplay():void {        
        this.screen.addChild(this.btnReplay);
    }
    
    public showShape01():void {
        this.screen.addChild(this.shape01);
    }

    public writeHeader(x:number, y:number, message:string):void {
        this.titleText.text = message;
        this.titleText.letterSpacing = 5;
        this.titleText.x = x;
        this.titleText.y = y;
        this.screen.addChild(this.titleText);
    }

    public writeBody(x:number, y:number, message:string):void {
        this.bodyText.text = message;
        this.bodyText.letterSpacing = 1;
        this.bodyText.lineHeight = 32;
        this.bodyText.x = x;
        this.bodyText.y = y;
        this.screen.addChild(this.bodyText);
    }

    public drawUIDonut(x:number,y:number):void {

        this.uiDonut.gotoAndStop("Donut");
        this.uiDonut.name = "Red Donut";
        this.uiDonut.x = x;
        this.uiDonut.y = y;
        this.screen.addChild(this.uiDonut);
    }

    public drawUICup(x:number,y:number):void {

        this.uiCup.gotoAndStop("hiScore");
        this.uiCup.name = "hiScore";
        this.uiCup.x = x;
        this.uiCup.y = y;
        this.screen.addChild(this.uiCup);
    }
}