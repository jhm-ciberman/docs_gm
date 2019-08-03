import Design from "../template/Design";

export default interface IDesignFilesCopier {
	copy(outputFolder: string, design: Design): Promise<void>;
}