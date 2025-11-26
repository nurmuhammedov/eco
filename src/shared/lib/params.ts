import { ISearchParams } from '@/shared/types';

function _correctParamsDataType(paramsObj: Record<string, string>): ISearchParams {
  const copyParamsObj: ISearchParams = { ...paramsObj };

  for (const [key, value] of Object.entries(copyParamsObj)) {
    const toNumber = Number(value);
    if (!isNaN(toNumber)) {
      copyParamsObj[key] = toNumber;
      continue;
    } else if (value?.toString()?.toLowerCase() === 'true' || value?.toString()?.toLowerCase() === 'false') {
      copyParamsObj[key] = value?.toString()?.toLowerCase() === 'true';
      continue;
    } else if (typeof value === 'string') {
      copyParamsObj[key] = value?.toString()?.trim();
      continue;
    }

    copyParamsObj[key] = value;
  }

  return copyParamsObj;
}

function convertParamsToObject(params: URLSearchParams): ISearchParams {
  const paramsObj = Object.fromEntries(params);
  return _correctParamsDataType(paramsObj);
}

export { convertParamsToObject };
