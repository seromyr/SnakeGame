import AssetManager from "./AssetManager";
import Screen from "./Screen";

export default class Gameplay extends Screen {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager,stage,"gameplay");
        super.drawUICup(148,20);
    }

    public showMe() {
        super.drawUIDonut(20,20);
        super.showMe();
    }
}