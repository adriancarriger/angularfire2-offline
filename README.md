## Angularfire2 Offline

Cache angularfire2 data for offline use.

## Features:
 - Returns real-time Firebase data via Observables
 - While online Firebase data is stored locally (as data changes the local store is updated)
 - While offline local data is served if available
 - On reconnect, Observables update app with new Firebase data
 - Even while online, local data is used first when available which results in a faster load ux
 - If loaded from local store while online, and Firebase sends changes (usually a few moments later), the changes will be sent to all subscribers and the local store will be updated right away.

 ## License

 angularfire2-offline is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
