import { unwrap } from '../database';

export class EmulateList {
  /**
   * the last passed value of the parent list
   */
  observableValue: any[];
  /**
   * An array used to store write operations that require an initial value to be set
   * in {@link value} before being applied
   */
  que = [];
  constructor() { }
  /**
   * Emulates an offline write assuming the remote data has not changed
   * @param observableValue the current value of the parent list
   * @param method AngularFire2 write method to emulate
   * @param value new value to write
   * @param key optional key used with some write methods
   */
  emulate(observableValue, method, value = null, key?) {

    this.observableValue = observableValue;

    const clonedValue = JSON.parse(JSON.stringify(value));
    if (this.observableValue === undefined) {
      this.que.push({
        method: method,
        value: clonedValue,
        key: key
      });
      return;
    }
    this.processEmulation(method, clonedValue, key);
    return this.observableValue;
  }
  /**
   * Emulates write opperations that require an initial value.
   *
   * - Some write operations can't happen if there is no intiial value. So while the app is waiting
   * for a value, those operations are stored in a queue.
   * - processQue is called after an initial value has been added to the parent observable
   */
  processQue(observableValue) {
    this.observableValue = observableValue;
    this.que.forEach(queTask => {
      this.processEmulation(queTask.method, queTask.value, queTask.key);
    });
    this.que = [];
    return this.observableValue;
  }
  /**
   * Calculates the result of a given emulation without updating subscribers of the parent Observable
   *
   * - this allows for the processing of many emulations before notifying subscribers
   * @param method the AngularFire2 method being emulated
   * @param value the new value to be used by the given method
   * @param key can be used for remove and required for update
   */
  private processEmulation(method, value, key) {
    if (this.observableValue === null) {
      this.observableValue = [];
    }
    const newValue = unwrap(key, value, () => value !== null);
    if (method === 'push') {
      let found = false;
      this.observableValue.forEach((item, index) => {
        if (item.$key === key) {
          this.observableValue[index] = newValue;
          found = true;
        }
      });
      if (!found) {
        this.observableValue.push(newValue);
      }
    } else if (method === 'update') {
      let found = false;
      this.observableValue.forEach((item, index) => {
        if (item.$key === key) {
          found = true;
          this.observableValue[index] = newValue;
        }
      });
      if (!found) {
        this.observableValue.push(newValue);
      }
    } else { // `remove` is the only remaining option
      if (!key) {
        this.observableValue = [];
      } else {
        this.observableValue.forEach((item, index) => {
          if (item.$key === key) {
            this.observableValue.splice(index, 1);
          }
        });
      }
    }
  }
}
