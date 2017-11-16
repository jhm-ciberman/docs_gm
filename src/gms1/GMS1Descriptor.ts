// GameMaker:Studio 1 *.xml project data

export interface Root {
    Configs: any;
    NewExtensions: any;
    TutorialState: any;
    sounds: [Folder];
    sprites: [Folder];
    backgrounds: [Folder];
    paths: [Folder];
    scripts: [Folder];
    fonts: [Folder];
    objects: [Folder];
    rooms: [Folder];
}

export interface Folder {
    $: { name: string };
    sounds?: Folder[];
    sound?: string[];
    sprites?: Folder[];
    sprite?: string[];
    backgrounds?: Folder[];
    background?: string[];
    paths?: Folder[];
    path?: string[];
    scripts?: Folder[];
    script?: string[];
    fonts?: Folder[];
    font?: string[];
    objects?: Folder[];
    object?: string[];
    rooms?: Folder[];
    room?: string[];
}
