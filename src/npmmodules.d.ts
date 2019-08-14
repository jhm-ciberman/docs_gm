import { getInstalledPath } from "get-installed-path";
import open = require("open");
import pkgDir = require("pkg-dir");

/*
This file contains all the external (mockable) npm modules types
*/

export type IGetInstalledPath = typeof getInstalledPath;
export type IOpen = typeof open;
export type IPkgDir = (dir: string) => Promise<string | undefined>;