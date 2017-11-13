import DocParam from "./DocParam";
import DocReturns from "./DocReturns";
import DocExample from "./DocExample";

/**
 * Represents a single script of the GameMaker project.
 */
export default class DocScript {

    /**
     * The name of the script.
     * @example "scr_character_jump".
     */
    public name: string;

    /**
     * The description of the script
     */
    public description: string | null = null;

    /**
     * An array of DocParams objects.
     * Representing each parameter or argument of the script.
     */
    public params: DocParam[] = [];

    /**
     * A DocReturns object, representing the returned value of the script.
     */
    public returns: DocReturns | null = null;

    /**
     * @alias returns
     */
    get return() {
        return this.returns;
    }

    /**
     * The Script usage examples
     */
    public examples: DocExample[] = [];

    /**
     * Is a private script?
     */
    public private: boolean = false; 

}
