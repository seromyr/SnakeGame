import AssetManager from "./AssetManager";
import Screen from "./Screen";
import { SCREEN_TITLES } from "./Constants";

export default class EndScreen extends Screen {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager,stage,"end");
    }

    public showMe() {
        super.showShape01();

        super.drawUIDonut(184,248);
        super.drawUICup(312,248);
        super.writeHeader(151,15,SCREEN_TITLES[2]);
        super.writeBody(167,182,"seriously it is over");
        super.showReplay();
        super.showMe();
    }
}