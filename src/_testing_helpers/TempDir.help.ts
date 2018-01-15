import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";

export interface IFileDictionary {
	[key: string]: string;
}

/**
 * This class is used for testing purposes to create fake directories with files.
 * You need to use the static factory method TempDir#create() to create a new TempDir.
 */
export class TempDir {

	/**
	 * Remove ALL created Temp Directories
	 */
	public static removeAll() {
		for (const dir of this._tempDirs) {
			dir.removeSelf();
		}
		this._tempDirs = [];
	}

	/**
	 * Factory method to create a new Temp directory
	 * @param folderPath The name of the temp directory
	 */
	public static create(folderPath: string, files?: IFileDictionary) {
		process.stdout.write("\nFolder: ");
		process.stdout.write(folderPath);
		process.stdout.write("\n");
		const dir = new TempDir(folderPath);
		this._tempDirs.push(dir);
		fse.emptyDirSync(dir.dir);
		if (files) {
			dir.addFiles(files);
		}
		return dir;
	}

	/**
	 * A list with all the created temp directories
	 */
	private static _tempDirs: TempDir[] = [];

	/**
	 * The full path of the temp directory
	 */
	public readonly dir: string;

	/**
	 * Creates a new Temp Directory
	 * @param folderPath The directory name
	 */
	private constructor(folderPath: string) {
		this.dir = path.join(os.tmpdir(), folderPath);
	}

	/**
	 * Add the files listed in the IFileDictionary object.
	 * Each key of the object is the path of a file, and
	 * each value is the plain text content of the file.
	 * @param files The IFileDictionry.
	 */
	public addFiles(files: IFileDictionary) {
		for (const key of Object.keys(files)) {
			fse.outputFileSync(path.join(this.dir, key), files[key]);
		}
	}

	/**
	 * Remove the current temp directory
	 */
	public removeSelf() {
		fse.removeSync(this.dir);
	}

	/**
	 * Reads the content of a file inside the temp directory
	 * @param file The file to read
	 */
	public read(file: string) {
		return fse.readFileSync(path.join(this.dir, file), "utf8");
	}

	/**
	 * Returns if a file exists inside the temp directory
	 * @param file The file to check for
	 */
	public exists(file: string) {
		return fse.existsSync(path.join(this.dir, file));
	}

	/**
	 * Same as path.join, but the base directory is the current temp directory
	 * @param paths The paths to resolve
	 */
	public join(...paths: string[]) {
		return path.join(this.dir, ...paths);
	}
}
