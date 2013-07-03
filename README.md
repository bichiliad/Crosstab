Crosstab
========

Javascript library for ensuring that important things happen in just one tab.

Some apps need things to happen in exactly one tab. Or, at the very least, it
would be a nice thing to have. 

Use it when your app...

 * Plays music and shouldn't play a bunch of things at once! (like Soundcloud)
 * Writes to local files (lock contention, etc).
 * Is a multiplayer game and should only have one person per computer
 * Fights with itself and needs to be kept in line.


Installation
------------

Source it in your html:

```html
<script type="text/javascript" src="path/to/tab.js"></script>
```

Initialize a tab object:

```javascript
var tab = new Tab();
```

And that's it. Unless you want it to things.

Oh, and there are *no dependencies* aside from localStorage support. 
So that's kinda cool, I guess.


Usage
-----

The ```Tab()``` method takes in an object that specifies the functions to call
when on and off events are triggered, and supports a number of options.
Here are their defaults:

```javascript
var tab = new Tab({

	/* Code you only want to happen in one tab */
	on: function() {},
	
	/* Code to do when a tab is done being on */
	off: function() {},

	/* Trigger on without waiting for other tabs to turn off */
	/* Not yet implemented, but shouldn't take long */  
	force: false

});
```

By default, ```on``` and ```off``` are empty functions, in case that wasn't clear.
You could initialize a bunch of tabs and have them do nothing. But that's silly. 


Still to do
-----------

 * Implement tab identifiers so multiple tab groups can exist across browsers. 
 	Something like ```group : [group_name]```.
 * Closure-ify the javascript.
 * Implement the ```force``` option.
 * Pass arguments to ```on``` and ```off```.
 * Allow for overriding of global ```force``` setting on a per-call basis.
 	For example, ```tab.on(false);```.
