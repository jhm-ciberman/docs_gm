

declare interface GMS1ProjectData {
    Configs:any;
    NewExtensions:any;
    TutorialState:any;
    sounds:[GMS1FolderData];
    sprites:[GMS1FolderData];
    backgrounds:[GMS1FolderData];
    paths:[GMS1FolderData];
    scripts:[GMS1FolderData];
    fonts:[GMS1FolderData];
    objects:[GMS1FolderData];
    rooms:[GMS1FolderData];
}

declare interface GMS1FolderData {
    $ :{name :string};
    sounds?: GMS1FolderData[];
    sound?: string[];
    sprites?: GMS1FolderData[];
    sprite?: string[];
    backgrounds?: GMS1FolderData[];
    background?: string[];
    paths?: GMS1FolderData[];
    path?: string[];
    scripts?: GMS1FolderData[];
    script?: string[];
    fonts?: GMS1FolderData[];
    font?: string[];
    objects?: GMS1FolderData[];
    object?: string[];
    rooms?: GMS1FolderData[];
    room?: string[];
}
