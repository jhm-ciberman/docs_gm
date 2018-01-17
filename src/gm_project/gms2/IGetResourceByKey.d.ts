import IGMResource from '../interfaces/IGMResource';

export default interface IGetResourceByKey {
	getResourceByKey(key: string): IGMResource | undefined;
}