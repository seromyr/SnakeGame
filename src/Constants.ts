// game constants
export const STAGE_WIDTH:number = 600;
export const STAGE_HEIGHT:number = 600;
export const BACKGROUND_COLOR:string = "#FFFFFF";
export const FRAME_RATE:number = 30;
export const GAMEPLAY_GRIDX: number = 17;
export const GAMEPLAY_GRIDY: number = 15;
export const SCREEN_TITLES:string[] = 
    [
        "SNAKE",
        "GAMEPLAY",
        "GAMEOVER"
    ];

// manifest for AssetManager
export const ASSET_MANIFEST = [

    // default sprite, will be removed
    {
        type:"json",
        src:"./lib/spritesheets/sprites.json",
        id:"sprites",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/sprites.png",
        id:"sprites",
        data:0
    },

    // primary game objects
    {
        type:"json",
        src:"./lib/spritesheets/gameObjectSsprites.json",
        id:"gameObjectSsprites",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/gameObjectSsprites.png",
        id:"gameObjectSsprites",
        data:0
    },

    // game UI objects
    {
        type:"json",
        src:"./lib/spritesheets/gameUI.json",
        id:"gameUI",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/gameUI.png",
        id:"gameUI",
        data:0
    },

    // font, Calibri (uppercase, lowercase)
    {
        type:"json",
        src:"./lib/spritesheets/glyphs_Calibri.json",
        id:"fontCalibri",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/glyphs_Calibri.png",
        id:"fontCalibri",
        data:0
    },

    // font, Impact (uppercase only)
    {
        type:"json",
        src:"./lib/spritesheets/glyphs-Impact.json",
        id:"fontImpact",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/glyphs-Impact.png",
        id:"fontImpact",
        data:0
    },

    // game sounds
    // {
    //     type:"sound",
    //     src:"./lib/sounds/eat.wav",
    //     id:"eat",
    //     data:4
    // },
    // {
    //     type:"sound",
    //     src:"./lib/sounds/hit.wav",
    //     id:"hit",
    //     data:4
    // },
    // {
    //     type:"sound",
    //     src:"./lib/sounds/move.wav",
    //     id:"move",
    //     data:4
    // },
];