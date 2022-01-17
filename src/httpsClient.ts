import { https } from 'follow-redirects';
import { RequestOptions } from 'https';

let clientId = '';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
};

export const getOptions = (urlString: string) => {
  const url = new URL(urlString);
  url.searchParams.append('client_id', clientId);

  return {
    ...headers,
    host: url.host,
    path: url.pathname + url.search,
  };
};

export const setApiKey = (newApiKey: string): void => {
  if (!newApiKey || typeof newApiKey !== 'string') {
    throw new Error('Api key not provided!');
  }
  clientId = newApiKey;
};

export const httpsClient = {
  get: async (options: RequestOptions): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      if (!clientId) {
        throw new Error('api key not provided!');
      }
      https.get(options, response => {
        let data = '';

        response.on('data', chunk => {
          data += chunk;
        });

        response.on('end', () => {
          resolve(data);
        });

        response.on('error', error => {
          reject(error);
        });
      });
    });
  },
};
