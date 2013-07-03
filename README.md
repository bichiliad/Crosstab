Crosstab
========

Javascript library for ensuring that important things happen in just one tab.

Some apps need things to happen in exactly one tab. Or, at the very least, it
would be a nice thing to have. 

Use it when your app...

 - Plays music and shouldn't play a bunch of things at once! (like Soundcloud)
 - Writes to local files (lock contention, etc).
 - Is a multiplayer game and should only have one person per computer
 - Fights with itself and needs to be kept in line.


Demo
----

The contents of this repo are more or less hosted on my own site [here][1]. 
Check it out, or pull the repo and host it somewhere.

For some reason, ```localStorage``` events don't trigger properly on 
local files. 

Installation
------------

Source it in your html:

```html
<script type="text/javascript" src="path/to/tab.js"></script>
```

And that's it. 

Oh, and there are *no dependencies* aside from localStorage support. 
So that's kinda cool, I guess.


Usage, in short
---------------

Initialize a tab object in any page you want to track.

```javascript
var tab = new Tab({
  on: function()  { alert("on!");  },
  off: function() { alert("off!"); }
});
```

By default, ```on``` and ```off``` are empty functions.
You could initialize a bunch of tabs and have them do nothing. But that's silly.

Turning a tab on turns all other tabs off, and can be done as such: 

```javascript
tab.on();
```
Manually turning a tab off is similar:

```javascript
tab.off();
```


Usage, in long
--------------

The ```Tab()``` object takes in an object that specifies the functions to call
when on and off events are triggered, and supports a number of options.
Here are their defaults:

```javascript
var tab = new Tab({

	/* Code you only want to happen in one tab */
	on: function() {},
	
	/* Code to do when a tab is done being on */
	off: function() {},

	/* Trigger on without waiting for other tabs to turn off */
	force: false

});
```

An instance of the ```Tab()``` object supports a number of methods:

```javascript
/* Turn a tab on. Pass in args to your supplied method, although this doesn't
 * do anything for now. Force is a string and can either be "off" or "on". 
 */
tab.on([args, force]); 

/* Turns a tab off. Again, pass it arguments if you'd like. Nothing to force
 * here, though. 
 */ 
tab.off([args]);

/* Get the current status of a tab. Returns true if on, false otherwise. 
 */ 
tab.status();

/* Show the tab's id. */
tab.id;

```


Still to do
-----------

 - Implement tab identifiers so multiple tab groups can exist across browsers. 
 	Something like ```group : [group_name]```.
 - Pass arguments to ```on``` and ```off```.
 - Bug fixing.

[1]: http://technoheads.org/apps/crosstab
