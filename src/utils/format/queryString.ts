const encode = (o: Record<string, unknown>, sep?: string): string => {
  const list: string[] = [];
  Object.keys(o).map((key) => {
    if (o[key] != null && typeof o[key] !== 'object' && typeof o[key] !== 'function') {
      list.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(o[key]))}`);
    }
    return null;
  });
  return list.join(sep || '&');
};

const REXP_SPLIT = /&amp;|&|;/gim;
const decode = (str: string, s?: string | RegExp): Record<string, string> => {
  const sep = s || REXP_SPLIT;
  const result: Record<string, string> = {};
  const expr = str.split(sep as any);
  let key: string;
  let val: string;
  let index: number;
  for (let i = 0, len = expr.length; i < len; i += 1) {
    index = expr[i].indexOf('=');
    key = expr[i].substring(0, index);
    val = expr[i].substring(index + 1);
    if (val) {
      result[decodeURIComponent(key)] = decodeURIComponent(val);
    }
  }
  return result;
};

/**
 * Turn a string parameter into an object with the key and value pair
 *
 * @param query The stringified query parameter
 * @returns A plain object
 */
export const parseQuery = (query = ''): Record<string, string> => decode(query.replace(/\?/g, ''));

/**
 * Turn a query object into a web link parameter looking string
 *
 * @param query The plain object with the key and value pair
 * @returns A stringified query parameter
 */
export const stringifyQuery = (query: Record<string, unknown>): string => encode(query);
