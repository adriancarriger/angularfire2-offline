# Working with Promises

AngularFire2 Offline works almost exactly like AngularFire2 promises, with one exception: the `offline` promise property.

The caveat with this is that, rather than calling operation().then() and operation().offline.then(), you need to create a reference to the result of the operation.

```ts
// before
this.listObservable.push({newObject}).then(() => {
    // async operation once push is done
});
this.listObservable.push({newObject}).offline.then(() => {
    // async operation once push is done
});

// after
let reference = this.listObservable.push({newObject});
reference.then(() => {
    // async operation once push is done
});
reference.offline.then(() => {
    // async operation once push is done
});
```

If you do the first example, you will end up calling push twice, as you can tell. The second example mitigates this by creating a reference to the response from firebase.push, which contains a promise and an `offline` promise property, so `push` is only called once.
