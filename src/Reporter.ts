export default class Reporter {

    public constructor() {

    }

    public debug(...str:any[]) {
        console.log(...str);
    }

    public info(...str: any[]) {
        console.info(...str);
    }

    public warn(...str: any[]) {
        str[0] = "> WARNING: " + str[0];
        console.warn(...str);
    }

    public error(...str: any[]) {
        str[0] = "> ERROR: " + str[0];
        console.error(...str);
    }


}