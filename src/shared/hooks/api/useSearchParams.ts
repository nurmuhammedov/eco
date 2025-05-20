import { cleanParams, convertParamsToObject, isObject } from '@/shared/lib';
import { ISearchParams } from '@/shared/types';
import { useSearchParams } from 'react-router-dom';

function useCustomSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsObj: ISearchParams = convertParamsToObject(searchParams);
  const paramsStr: string = searchParams.toString();

  function addParams(paramKeyOrObj: ISearchParams, ...removeKeys: string[]): void {
    if (!paramKeyOrObj) return;

    let newParams: ISearchParams = { ...paramsObj };

    if (removeKeys && removeKeys.length > 0) {
      removeKeys.forEach((key) => {
        delete newParams[key];
      });
    }

    if (isObject(paramKeyOrObj)) {
      newParams = { ...newParams, ...paramKeyOrObj };
    }

    setSearchParams(cleanParams(newParams) as unknown as URLSearchParams, { replace: true });
  }

  function removeParams(...paramKeys: string[]): void {
    const paramsCopy: ISearchParams = { ...paramsObj };
    paramKeys.forEach((pk) => {
      delete paramsCopy[pk];
    });
    setSearchParams(paramsCopy as unknown as URLSearchParams, { replace: true });
  }

  return {
    paramsObject: paramsObj,
    paramsString: paramsStr,
    addParams,
    removeParams,
  };
}

export default useCustomSearchParams;
