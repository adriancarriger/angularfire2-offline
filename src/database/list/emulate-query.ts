import { FirebaseListFactoryOpts } from 'angularfire2/interfaces';
import { Observable } from 'rxjs/Observable';

export class EmulateQuery {
  orderKey: string;
  observableValue: any[];
  observableOptions: FirebaseListFactoryOpts;
  query: AfoQuery = {};
  queryReady: Promise<{}[]>;
  subscriptions = [];
  constructor() { }
  destroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
  /**
   * Gets the latest value of all query items, including Observable queries.
   *
   * If the query item's value is an observable, then we need to listen to that and update
   * the query when it updates.
   * @see https://goo.gl/mNVjGN
   */
  setupQuery(options: FirebaseListFactoryOpts) {
    // Store passed options
    this.observableOptions = options;
    // Ignore empty queries
    if (this.observableOptions === undefined || this.observableOptions.query === undefined) {
      return;
    }
    // Loop through query items
    this.queryReady = Promise.all(Object.keys(this.observableOptions.query).map(queryKey => {
      return new Promise(resolve => {
        // Checks if the query item is an observable
        if (this.observableOptions.query[queryKey] instanceof Observable) {
          this.subscriptions.push(
            this.observableOptions.query[queryKey].subscribe(value => {
              this.query[queryKey] = value;
              resolve();
            })
          );
        // Otherwise it's a regular query (e.g. not an Observable)
        } else {
          this.query[queryKey] = this.observableOptions.query[queryKey];
          resolve();
        }
      });
    }));
  }
  /**
   * Emulates the query that would be applied by AngularFire2
   *
   * Using format similar to [angularfire2](https://goo.gl/0EPvHf)
   */
  emulateQuery(value) {
    this.observableValue = value;
    if (this.observableOptions === undefined
      || this.observableOptions.query === undefined
      || this.observableValue === undefined) {
      return new Promise(resolve => resolve(this.observableValue));
    }
    return this.queryReady.then(() => {
      // Check orderBy
      if (this.query.orderByChild) {
        this.orderBy(this.query.orderByChild);
      } else if (this.query.orderByKey) {
        this.orderBy('$key');
      } else if (this.query.orderByPriority) {
        this.orderBy('$priority');
      } else if (this.query.orderByValue) {
        this.orderBy('$value');
      }

      // check equalTo
      if (hasKey(this.query, 'equalTo')) {
        if (hasKey(this.query.equalTo, 'value')) {
          this.equalTo(this.query.equalTo.value, this.query.equalTo.key);
        } else {
          this.equalTo(this.query.equalTo);
        }

        if (hasKey(this.query, 'startAt') || hasKey(this.query, 'endAt')) {
          throw new Error('Query Error: Cannot use startAt or endAt with equalTo.');
        }

        // apply limitTos
        if (!isNil(this.query.limitToFirst)) {
          this.limitToFirst(this.query.limitToFirst);
        }

        if (!isNil(this.query.limitToLast)) {
          this.limitToLast(this.query.limitToLast);
        }

        return this.observableValue;
      }

      // check startAt
      if (hasKey(this.query, 'startAt')) {
        if (hasKey(this.query.startAt, 'value')) {
          this.startAt(this.query.startAt.value, this.query.startAt.key);
        } else {
          this.startAt(this.query.startAt);
        }
      }

      if (hasKey(this.query, 'endAt')) {
        if (hasKey(this.query.endAt, 'value')) {
          this.endAt(this.query.endAt.value, this.query.endAt.key);
        } else {
          this.endAt(this.query.endAt);
        }
      }

      if (!isNil(this.query.limitToFirst) && this.query.limitToLast) {
        throw new Error('Query Error: Cannot use limitToFirst with limitToLast.');
      }

      // apply limitTos
      if (!isNil(this.query.limitToFirst)) {
        this.limitToFirst(this.query.limitToFirst);
      }

      if (!isNil(this.query.limitToLast)) {
        this.limitToLast(this.query.limitToLast);
      }

      return this.observableValue;
    });
  }
  private endAt(value, key?) {
    const orderingBy = key ? key : this.orderKey;
    this.observableValue = this.observableValue.filter(item => item[orderingBy] <= value);
  }
  private equalTo(value, key?) {
    const orderingBy = key ? key : this.orderKey;
    this.observableValue = this.observableValue.filter(item => item[orderingBy] === value);
  }
  private limitToFirst(limit: number) {
    if (limit < this.observableValue.length) {
      this.observableValue = this.observableValue.slice(0, limit);
    }
  }
  private limitToLast(limit: number) {
    if (limit < this.observableValue.length) {
      this.observableValue = this.observableValue.slice(-limit);
    }
  }
  private orderBy(x) {
    this.orderKey = x;
    this.observableValue.sort((a, b) => {
      const itemA = a[x];
      const itemB = b[x];
      if (itemA < itemB) { return -1; }
      if (itemA > itemB) { return 1; }
      return 0;
    });
  }
  private startAt(value, key?) {
    const orderingBy = key ? key : this.orderKey;
    this.observableValue = this.observableValue.filter(item => item[orderingBy] >= value);
  }
}

export interface AfoQuery {
  [key: string]: any;
}

export function isNil(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function hasKey(obj: Object, key: string): boolean {
  return obj && obj[key] !== undefined;
}
