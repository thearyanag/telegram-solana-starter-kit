import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 60 * 60 * 60,
  checkperiod: 60 * 5,
  useClones: false,
});

export const setCache = (key: string, value: any) => {
  cache.set(key, value);
};

export const getCache = (key: string) => {
  return cache.get(key);
};
