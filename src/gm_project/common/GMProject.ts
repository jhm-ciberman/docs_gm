import * as path from "path";

import IGMFolder from "../interfaces/IGMFolder";
import IGMProject from "../interfaces/IGMProject";
import GMFolder from "./GMFolder";

/**
 * Represents a GameMaker Project.
 */
export default class GMProject extends GMFolder implements IGMProject {

	/**
	 * The path of the project
	 */
	public readonly path: string;

	/**
	 * Project's name
	 */
	public readonly name: string;

	/**
	 * An array with the project's top level folders. (Example: "objects", "scripts", "sprites", "rooms")
	 */
	protected _children: IGMFolder[] = [];

	/**
	 * Creates a new GMS1 Project
	 * @param gmProjectFolder The folder of the GM project
	 */
	public constructor(gmProjectFolder: string) {
		super("");
		this.path = gmProjectFolder;
		this.name = path.basename(path.resolve(gmProjectFolder));
	}

	/**
	 * Gets the top level folders of the project
	 */
	public get children(): IterableIterator<IGMFolder> {
		return this._children[Symbol.iterator]();
	}

	/**
	 * Adds a top level folder to the project
	 * @param child The folder to add
	 */
	public addChild(child: IGMFolder) {
		child.parent = this;
		this._children.push(child);
	}

	/**
	 * The project fullpath is allways a "/"
	 */
	get fullpath(): string {
		return "/";
	}

}
