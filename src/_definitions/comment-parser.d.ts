// Type definitions for comment-parser 0.3.2
// Project: comment-parser
// Definitions by: Javier "Ciberman" Mora <https://github.com/jhm-ciberman/>

declare module "comment-parser" {
    interface Comment {
        tags: Tag[];
        line: number;
        description: string;
        source: string;
    }
    interface Tag {
        tag: string;
        name: string;
        optional: boolean;
        type: string;
        description: string;
        line: number;
        source: string;
    }
    interface Options {
        parsers?: [(str:string, data:any) => {source:string, data:any}];
        dotted_names?: boolean;
    }

    function parse(str: string, opts?:Options): [Comment];

    export = parse;
}
