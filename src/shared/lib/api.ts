import { ISearchParams } from '../types';

export const cleanParams = (params: ISearchParams) => {
  const filteredParams: ISearchParams = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      filteredParams[key] = value;
    }
  });
  return filteredParams;
};

export function isObject(val: unknown): val is ISearchParams {
  return typeof val === 'object' && val !== null;
}
