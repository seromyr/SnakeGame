import AssetManager from "./AssetManager";
import Screen from "./Screen";

export default class ContentScreen extends Screen {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager,stage,"content");
    }
}