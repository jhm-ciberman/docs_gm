import IReporter from "../../reporter/interfaces/IReporter";

export default interface IValidationRule<T> {
	reporter: IReporter;
	validate(element: T): boolean;
}