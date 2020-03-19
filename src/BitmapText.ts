import AssetManager from "./AssetManager";

export default class BitmapText {

    private bitmapTextHeader:createjs.BitmapText;
    private bitmapTextBody:createjs.BitmapText;
    private message:string;
    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        

        //Create header bitmap text using Impact font - UPPERCASE only
        this.bitmapTextHeader = new createjs.BitmapText(this.message, assetManager.getSpriteSheet("fontImpact"));
        
        
        //Create body bitmap text using Calibri font - UPPERCASE & lower case
        this.bitmapTextBody = new createjs.BitmapText(this.message, assetManager.getSpriteSheet("fontCalibri"));

        stage.addChild(this.bitmapTextHeader);
        stage.addChild(this.bitmapTextBody);
        
    }

    public WriteMessage(x:number, y:number, message:string, isHeader:boolean = true):void {
        
        switch (isHeader)
        {
            case true:
                this.message = message;
                this.bitmapTextHeader.letterSpacing = 2;
                this.bitmapTextHeader.x = x;
                this.bitmapTextHeader.y = y;                
            break;
            case false:
                this.message = message;
                this.bitmapTextBody.letterSpacing = 1;
                this.bitmapTextBody.x = x;
                this.bitmapTextBody.y = y;
            break;
        }
    }
}