import AssetManager from "./AssetManager";
import Screen from "./Screen";
import { SCREEN_TITLES } from "./Constants";
import Gameplay from "./GameplayScreen";

export default class EndScreen extends Screen {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager,stage,"end");
    }

    public showMe(): void {
        super.showShape01();
        super.drawUIDonut(184,248);       
        super.drawUICup(312,248);
        super.writeHeader(151,15,SCREEN_TITLES[2]);
        super.writeBody(111,182,"THAT'S A LOT OF DONUTS");
        super.showReplay();
        super.showMe();
    }
}