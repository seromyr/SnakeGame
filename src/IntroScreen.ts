import AssetManager from "./AssetManager";
import Screen from "./Screen";
import { SCREEN_TITLES } from "./Constants";

export default class IntroScreen extends Screen {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        //this must be the 1st line in the constructor method
        super(assetManager,stage, "intro");
        //super.addNextButton();
    }

    //override a method (METHOD OVERRIDING)
    public showMe():void{
        //this is where you would do more coding to get this screen ready, not in the constructor

        super.drawUIDonut(20,20);
        super.writeBody(60,20,"x 0");
        
        super.writeHeader(214,15, SCREEN_TITLES[0]);
        super.showInstruction();
        super.writeBody(201,320,"USE WASD OR\nARROW KEYS");
        super.showMe();
    }
}