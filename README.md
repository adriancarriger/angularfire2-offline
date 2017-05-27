# Issue Examples

Offline functionality isn't so easy to demonstraight in a Plunker, and this gh-pages branch serves to fill that gap.

# Options

- Create an issue quickly based on the angular-cli based project. [View setup instructions](https://github.com/adriancarriger/angularfire2-offline/blob/gh-pages/base/angular-cli/README.md#angularfire2-offline---base-angular-cli-project)



@rodrifmed thanks again for pointing out this interesting issue! First I'll explain what I found, and then propose a solution. Anyone interested in the issue is welcome to chime in.

## What is happening

### Demos

If you [clear app storage](https://developers.google.com/web/tools/chrome-devtools/manage-data/local-storage#clear-storage) before each demo you'll notice that:
 - [Demo 9.4](https://adriancarriger.github.io/angularfire2-offline/issues/9.4/dist/) will only return results match `READ`
- [Demo 9.5](https://adriancarriger.github.io/angularfire2-offline/issues/9.5/dist/) returns for `READ` and `NOT_READ`

The only difference is that [9.4 uses `.first()`](https://github.com/adriancarriger/angularfire2-offline/blob/gh-pages/issues/9.4/src/app/app.component.ts#L42) and [9.5 doesn't](https://github.com/adriancarriger/angularfire2-offline/blob/gh-pages/issues/9.5/src/app/app.component.ts#L42).

### Step by step

1. The first request for items matching `READ` is sent to Firebase
1. `subscribe` returns the expected results
1. The second request for items matching `NOT_READ` is sent to Firebase
1. Afo checks the in-memory cache (not device storage)
    - because both queries belong to the same reference it finds the last dataset from Firebase which only contains results matching `READ`
    - Afo runs the query locally
    - `subscribe` returns the results available (empty array)
1. Afo receives Firebase data for the second query (items matching `NOT_READ`)
    - Demo 9.4 ignores the new data (because of the `.first()` method)
    - Demo 9.5 `subscribe` returns the expected results

## Is this a bug?

- Running a query on the first dataset available may be desired for some use cases, especially when the app may lose connection at any time.
- However, an app may need a guarantee that queries run against data of a specific scope.

Some apps may prioritize speed over quality and vise versa.

## Possible solution

Afo cannot know ahead of time what queries will be made to the same reference. I suggest an optional param called `largestQuery` telling Afo the largest query that will be made to Firebase. If given this param, then the request will be made to Firebase once and the remaining queries would run locally.

## Example

The proposed solution would look something like this:

```ts
this.afoDatabase.list('firebase/ref', {
  query: {
    limitToFirst: 15
  },
  largestQuery: {
    limitToFirst: 500
  }
});
```

