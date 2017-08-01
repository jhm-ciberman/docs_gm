

import DocParam from "./DocParam";
import DocReturns from "./DocReturns";

export default class DocScript {

    public description:string|null = null;
    public params:DocParam[] = [];
    public returns:DocReturns|null = null;
    public name:string;

}
