# AngularCli Progressive Web App

## Steps to create project

### 1. Install [angular-cli](https://github.com/angular/angular-cli)

```bash
npm install -g angular-cli
```

### 2. Create a new project

```bash
ng new <project-name>
cd <project-name>
```

The Angular CLI's `new` command will set up the latest Angular build in a new project structure.

### 3. Test your Setup

```bash
ng serve
open http://localhost:4200
```

You should see a message that says *App works!*

### 4. Install Dependencies

```bash
npm install --save angularfire2-offline angularfire2 firebase
```

Now that you have a new project setup, install AngularFire2 and Firebase from npm.

### 5. Setup @NgModule

Open `/src/app/app.module.ts`, inject the Firebase providers, and specify your Firebase configuration.
This can be found in your project at [the Firebase Console](https://console.firebase.google.com):

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFire2OfflineModule } from 'angularfire2-offline';

// Must export the config
export const firebaseConfig = {
  apiKey: '<your-key>',
  databaseURL: '<your-database-URL>'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFire2OfflineModule.forRoot(),
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 6. Use in a component

In `/src/app/app.component.ts`:

```ts
import { Component } from '@angular/core';
import {
  Angularfire2OfflineService,
  ObjectObservable,
  ListObservable } from 'angularfire2-offline';

@Component({
  selector: 'project-name-app',
  templateUrl: 'app.component.html'
})
export class MyApp {
  info: ObjectObservable;
  items: ListObservable;
  constructor(afo: Angularfire2OfflineService) {
    this.info = afo.database.object('/info');
    this.items = afo.database.list('/items');
  }
}
```

Open `/src/app/app.component.html`:

```html
<h1>{{ (info | async)?.name }}</h1>
<ul>
  <li *ngFor="let item of items | async">
    {{ item.name }}
  </li>
</ul>
```

### 7. Run your app

```bash
ng serve
```

Run the serve command and go to `localhost:4200` in your browser.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
