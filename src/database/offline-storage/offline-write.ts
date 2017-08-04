import { WriteCache } from '../interfaces';
import { LocalUpdateService } from './local-update-service';

export function OfflineWrite(
  firebasePromise,
  type: string,
  ref: string,
  method: string,
  args: any[],
  localUpdateService: LocalUpdateService) {
  return localUpdateService.update('write', (writeCache: WriteCache) => {
    if (!writeCache) {
      writeCache = {
        lastId: 0,
        cache: {}
      };
    }
    writeCache.lastId++;
    writeCache.cache[writeCache.lastId] = {type: type, ref: ref, method: method, args: args};
    return writeCache;
  }).then((writeCache: WriteCache) => {
    const id = writeCache.lastId;
    firebasePromise.then(() => {
      WriteComplete(id, localUpdateService);
    });
  });
}

export function WriteComplete(id, localUpdateService: LocalUpdateService) {
  return localUpdateService.update('write', (writeCache: WriteCache) => {
    delete writeCache.cache[id];
    return writeCache;
  });
}
