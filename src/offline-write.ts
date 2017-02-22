import { WriteCache } from './interfaces';

export function OfflineWrite(
  promise: firebase.Promise<void>,
  type: string,
  ref: string,
  method: string,
  args: any[],
  localForage) {
  let id;
  let done = false;
  localForage.getItem('write').then((writeCache: WriteCache) => {
    if (done) { return; }
    if (!writeCache) {
      writeCache = {
        lastId: 0,
        cache: {}
      };
    }
    writeCache.lastId++;
    id = writeCache.lastId;
    writeCache.cache[id] = {type: type, ref: ref, method: method, args: args};
    localForage.setItem(`write`, writeCache);
  });
  promise.then(() => {
    if (id) { WriteComplete(id, localForage); }
    done = true;
  });
}

export function WriteComplete(id, localForage) {
  return new Promise(resolve => {
    localForage.getItem('write').then((writeCache: WriteCache) => {
      delete writeCache.cache[id];
      localForage.setItem(`write`, writeCache).then(() => {
        resolve();
      });
    });
  });
}
