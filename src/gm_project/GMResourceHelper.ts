import IGMFolder from "./IGMFolder";
import IGMResource from "./IGMResource";
import IGMScript from "./IGMScript";

export default class GMResourceHelper {
	/**
	 * Returns true if the resource is a IGMFolder
	 */
	public static isFolder(res: IGMResource): res is IGMFolder {
		return (res as IGMFolder).children !== undefined;
	}

	/**
	 * Returns true if the resource is a GMScript
	 */
	public static isScript(res: IGMResource): res is IGMScript {
		return (res as IGMScript).subScripts !== undefined;
	}
}
