# Ember.js 2.18 Tutorial - Demo Application

## Before

![yoember](/closure-actions-errors.png "Ember.js Tutorial")


## After

![yoember](/closure-actions-final-result.png "Ember.js Tutorial")

This is the original repository of the Library App.

For detailed, step by step implementation click here: [Ember tutorial](http://yoember.com)

Live demo: [library-app.firebaseapp.com](https://library-app.firebaseapp.com/)

## How can you run this application locally?

I assume, you have Node.js on your computer. [Node.js installation](http://yoember.com/nodejs/the-best-way-to-install-node-js/)

* Please create an app on [Firebase](http://www.firebase.com) first. You can register there with one click and create a new app. You have to setup this app name in `config/environment.js`. (This will be your own cloud based database.)

* Clone this repository in your project folder
```
$ git clone git@github.com:zoltan-nz/library-app.git
```
* Change to the application directory
```
$ cd library-app
```
* Install node packages
```
$ npm install
```
* Setup in `config/environment.js` Firebase settings. ([Setup firebase in your Ember project](http://yoember.com/#setup-a-server-on-firebase))

* Launch the application with Ember server.
```
$ ember server
```
* Open the application in your browser
```
$ open http://localhost:4200
```

[www.yoember.com - The Ember.js Tutorial](http://yoember.com)

## How can I rename the Firebase Project ID?

I have contacted the Firebase Support, they replied:

Regarding your concern, you can do this by doing the following:

1. On your project overview, click the Gear icon and select project
   settings.
2. On the General Tab of your project settings page, you can see the
   Project name, Public-facing name and other fields.
3. Edit the field of your choice by clicking the Pencil icon.

you can refer to this doc: `https://support.google.com/cloud/answer/6158840?hl=en`

The project ID is a unique identifier for a project. When you first
create a project, you can accept the default generated project ID or
create your own. **A project ID cannot be changed after the project is
created**, so if you are creating a new project, be sure to choose an ID
that you'll be comfortable using for the lifetime of the project.


## How to set a custom ID when pushing a new object into Firebase

I am using Firebase with AngularJS in my application. When a user logs
into the app with the Facebook authentication I want to create a new
user object (with some properties coming from Facebook and some relative
to my app) and store it in Firebase. It's simple, I'm pushing the new
User object:

```java
...
var travelBidsFirebaseRef = new Firebase(url);
var newUserRef = travelBidsFirebaseRef.child("user").push(user,
callback);
...
```

`push()` generates a unique ID, smth. like: `-J08SgyOeOU_fFb1CB3G.`.
So the only way I can access this User object is by using this ID:

```java
angularFire(travelBidsFirebaseRef + "/user/-J08SgyOeOU_fFb1CB3G", $scope, 'user', {});
```

But when I receive authentication data from Facebook I have only
Facebook ID and there is no way of me knowing the Firebase ID generated
earlier (otherwise I would have to maintain a map of all users, which I
don't want to). So here is the question: how do I save new User to the
Firebase with a custom ID, e.g. Facebook ID?

Instead of using `push()`, use `set()` with the Facebook ID:

```java
travelBidsFirebaseRef.child("user").push(user, callback);
travelBidsFirebaseRef.child("user").child(facebookId).set(user, callback);
```

As of FirebaseSimpleLogin 1.0, you can now use `uid`, which is unique
across providers:

```java
new FirebaseSimpleLogin(ref, function(err, user) {
  if( err ) throw err;
  travelBidsFirebaseRef.child('user/'+user.uid).set(user, callback);
});
```

You can also try something like this:

```java
var empsRef = ref.child("employees");

empsRef.child('11111').set({
  lastname: "Lee",
  firstname: "Kang"
});

empsRef.child('22222').set({
  lastname: "Nut",
  firstname: "Dough"
});
```

The output should look like this:

```
"employees" : {
  "11111" : {
    "lastname" : "Lee",
    "firstname": "Kang"
  },
  "22222" : {
    "lastname" : "Nut",
    "firstname": "Dough"
  }
}
```

## Introduction to Ember Closure Actions

Closure actions were introduced in Ember v.1.13.0 and they brought a lot
of improvements over old action handling mechanism in Ember. These
improvements enabled Ember to adopt new data flow model called - Data
Down Actions Up (DDAU) that simplified communication between parent and
child components.

Closure actions are based on JavaScript closures which are basically
functions that remember environment in which they were created. So
closure actions are just functions that remember context in which they
were defined. Since they are just functions we can pass them as a value
and call them directly as a callback. This enables us to pass them to
inner components and call them directly from components. With the old
approach we had to use `sendAction()` from component and call action on
controller or route.

1. Install an Addon `ember install ember-route-action-helper`

2. Edit the Components:

  - `app/components/author-select.js`:

```javascript
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({

  tagName: 'select',
  classNames: ['form-control'],
  authors: null,
  book: null,

  change(event) {
    const selectedAuthorId = event.target.value;
    const selectedAuthor = this.get('authors').find((record) => record.id === selectedAuthorId);

    // this.sendAction('action', selectedAuthor, this.get('book'));
    get(this, 'press_author')(selectedAuthor, this.get('book'));
  }
});
```

  - `app/components/library-item-form.js`:

```javascript
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({

  buttonLabel: 'Save',

  actions: {

    buttonClicked(param) {
      // this.sendAction('action', param);
      get(this, 'press_save')(param);
    }

  }
});
```

  - `app/components/library-select.js`:

```javascript
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({

  tagName: 'select',
  classNames: ['form-control'],
  libraries: null,
  book: null,

  change(event) {
    const selectedAuthorId = event.target.value;
    // const selectedAuthor = this.get('authors').find((record) => record.id === selectedAuthorId);
    const selectedAuthor = get(this, 'authors').find((record) => record.id === selectedAuthorId);

    // this.sendAction('action', selectedLibrary, this.get('book'));
    get(this, 'press_select')(selectedLibrary, this.get('book'));
  }
});
```

  - `app/components/seeder-block.js`:

```javascript
// ...

import { get } from '@ember/object';

// ...

actions: {

  generateAction() {
    if (this.get('isCounterValid')) {

      // Action up to Seeder Controller with the requested amount
      // this.sendAction('generateAction', this.get('counter'));
      get(this, 'generateAction')(this.get('counter'));
    }
  },

  deleteAction() {
    // this.sendAction('deleteAction');
    get(this, 'deleteAction')();
  }

}
```

3. Edit the Templates:

  - `app/templates/books.hbs`:


```
{{author-select
  book=book
  authors=authors
  default=book.author
  press_author=(route-action 'saveAuthor')}}
```

  - `app/templates/libraries/form.hbs`

```
{{library-item-form item=model buttonLabel=buttonLabel action='saveLibrary'}}
{{library-item-form item=model buttonLabel=buttonLabel press_save=(route-action 'saveLibrary')}}
```
  - `app/templates/books.hbs`

```
{{#if book.isLibraryEditing}}

  {{library-select
    book=book
    libraries=libraries
    default=book.library
    // action='saveLibrary'}}
    press_select=(route-action 'saveLibrary')}}

```

  - `app/templates/admin/seeder.hbs`

```
{{seeder-block
  sectionTitle='Libraries'
  generateAction=(action 'generateLibraries')
  deleteAction=(action 'deleteLibraries')
  generateReady=libDone
  deleteReady=libDelDone
  generateInProgress=generateLibrariesInProgress
  deleteInProgress=deleteLibrariesInProgress
}}

{{seeder-block
  sectionTitle='Authors with Books'
  generateAction=(action 'generateBooksAndAuthors')
  deleteAction=(action 'deleteBooksAndAuthors')
  generateReady=authDone
  deleteReady=authDelDone
  generateInProgress=generateBooksInProgress
  deleteInProgress=deleteBooksInProgress
}}
```

## Library data for example

```
Hawaii State Public Library System
44 Merchant Street Honolulu, Hawaii 96813
(808) 586-3500
```

### 24 May 2018 by Oleg G.Kapranov


[1]:  http://emjs.ru/
[2]:  http://yoember.com/
[3]:  https://library-app.firebaseapp.com/
[4]:  https://github.com/zoltan-nz/product-app
[5]:  https://stackoverflow.com/questions/28822054/firebase-how-to-generate-a-unique-numeric-id-for-key
[6]:  https://www.npmjs.com/package/firebase-key
[7]:  http://mariechatfield.com/tutorials/firebase/step1.html
[8]:  http://mariechatfield.com/tutorials/firebase/step2.html
[9]:  http://mariechatfield.com/tutorials/firebase/step3.html
[10]: http://mariechatfield.com/tutorials/firebase/step4.html
[11]: http://mariechatfield.com/tutorials/firebase/step5.html
[12]: http://mariechatfield.com/tutorials/firebase/step6.html
[13]: https://firebase.googleblog.com/2016/12/working-with-multiple-firebase-projects-in-an-android-app.html
[14]: https://howtofirebase.com/save-and-query-firebase-data-ed73fb8c6e3a
[15]: https://firebase.google.com/docs/auth/admin/create-custom-tokens
[16]: http://www.tothenew.com/blog/custom-ids-in-firebase/
[17]: https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html
[18]: https://gist.github.com/mikelehen/3596a30bd69384624c11
[19]: https://gist.github.com/amirh/0e7b480691f7e6506317a7600398124b
[20]: https://www.npmjs.com/package/pushid
[21]: https://hex.pm/packages/firebase_pushid
[22]: https://github.com/resonantcore/lib/blob/develop/js/secure_random/secure_random.js
[23]: https://gist.github.com/azell/b96d27e4091f5a966bae
[24]: https://github.com/GuiluisAA/library-app
[25]: https://github.com/atomiccc/sodashop
[26]: https://www.axiomq.com/blog/introduction-to-ember-closure-actions
[27]: https://medium.com/front-end-hacking/accessing-actions-in-emberjs-1c6084d06ddc
[28]: https://medium.com/@sunskyearthwind/accessing-actions-in-ember-js-2018-17131a93df10
[29]: https://stackoverflow.com/questions/31101296/how-to-call-an-action-on-a-route-using-closure-actions
[30]: https://www.youtube.com/watch?v=ZC5UdCCfG3Y
[31]: http://miguelcamba.com/blog/2016/01/24/ember-closure-actions-in-depth
[32]: https://www.emberscreencasts.com/posts/73-action-bubbling
[33]: http://www.thegreatcodeadventure.com/ember-components-closure-actions
[34]: http://qaru.site/questions/278560/how-to-call-an-action-on-a-route-using-closure-actions
[35]: https://phraseapp.com/blog/posts/javascript-how-to-translate-emberjs-apps/
[36]: https://github.com/jamesarosen/ember-i18n
[37]: https://discuss.emberjs.com/t/how-to-architect-multilanguage-routes-with-i18n/9747
[38]: https://eviltrout.com/2013/11/24/i18n-in-ember.html
[39]: https://github.com/DavyJonesLocker/ember-cli-i18n
[40]: https://medium.com/peep-stack/building-a-performant-web-app-with-ember-fastboot-and-phoenix-part-1-fa1241654308
[41]: http://vikram-s-narayan.github.io/blog/authentication-with-ember-and-firebase-part-1/
[42]: http://emberwatch.com/tutorials.html
[43]: https://www.smashingmagazine.com/2013/11/an-in-depth-introduction-to-ember-js/
[44]: http://jkneb.github.io/ember-crud/
[45]: https://github.com/jkneb/ember-crud
[46]: https://www.sitepoint.com/getting-started-with-ember-and-ember-cli/
[47]: https://github.com/sitepoint-editors/sitepoint-contactmanager
[48]: https://github.com/LaminSanneh/sitepoint-contactmanager
[49]: https://emberigniter.com/should-we-use-ember-controllers/
[50]: https://resolve.digital/blog/posts/creating-a-todo-application-using-the-phoenix-framework-and-ember-js/
[51]: http://oddbird.net/susy/docs/
[52]: https://github.com/davewasmer/ember-cli-susy
[53]: https://stackoverflow.com/questions/45009701/import-susy-in-ember-application
[54]: https://github.com/dgeb/ember_data_example
