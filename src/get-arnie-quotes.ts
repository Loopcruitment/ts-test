import { httpGet } from './mock-http-interface';

type FailureResult = {
  FAILURE: 'Your request has been terminated',
};

type SuccessResult = {
  [key: string]: string;
};

type TResult = SuccessResult | FailureResult;

type TResponse = {
  status: number;
  body: string;
}

const RES_CODE_KEY_MAPPING: { [key: string]: string} = {
  '200': 'Arnie Quote',
  default: 'FAILURE'
};

function serialiseResponse(response: TResponse): TResult {
  const { status, body } = response;
  const statusCodeInString = status === 200 ? String(status) : 'default';
  const resultKey: string = RES_CODE_KEY_MAPPING[statusCodeInString];
  const bodyInJson = JSON.parse(body);
  return { [resultKey]: bodyInJson.message};
}

export const getArnieQuotes = async (urls : string[]) : Promise<TResult[]> => {
  const requests = urls.map(httpGet)
  const responses = await Promise.all(requests);
  
  return responses.map(serialiseResponse);
};
