export default class Reporter {

    public constructor() {

    }

    public debug(...str:any[]) {
        console.debug(...str);
    }

    public info(...str: any[]) {
        console.info(...str);
    }

    public warn(...str: any[]) {
        console.warn(...str);
    }

    public error(...str: any[]) {
        console.error(...str);
    }


}