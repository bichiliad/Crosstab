var Tab = (function(){

  var noop = function(){};

  // Debug flag, runs assertions.
  var _debug = true;

  // Private
  var _on;        // On function
  var _off;       // Off function
  var _force;     // Force flag
  var _id;        // tab id
  var _listener;  // storage listener

  // For testing
  var assert = function (test, str) {
    if (!_debug) 
      return;

    str = str || "Assertion failed."
    if(!test) {
      console.error(str);
    }
  }

  // run by on tabs to listen for off requests
  var _listen_for_reqs = function (e) {
    console.log("_listen_for_reqs");
    if (e.key === "_tab_req" && e.newValue !== _id) { 

      // Assert
      assert(_listener !== null && typeof _listener === "function",
          "_listener is null in _listen_for_reqs" );

      // Stop listening for off requests
      _listener();
      _listener = null;

      // Remove self from _tab_on
      if(get_on === _id) {        
        rem_on();
      }

      // Turn off tab.
      turn_off();
    }
  }

  // run by a pending on tab to know when to turn on
  var _listen_for_on = function (e) {
    console.log("_listen_for_on");
    // If _tab_on is now null, then fill its vacancy.
    if (e.key === "_tab_on" && e.newValue === null) {

      // Assert
      assert(_listener !== null && typeof _listener === "function",
          "_listener is null in _listen_for_on" );

      // Stop listening for on availabilities
      _listener();
      _listener = null;

      // If this is the requesting tab, then turn on
      if(get_req() === _id) {
        rem_req();
        set_on(_id);
        turn_on();
      }

      // Otherwise, the tab's request has been overridden by a newer one
      // and it doesn't need to do anything.

    }
  }

  // The thing that's called when a tab wants to be on.
  var turn_on = function (args, force) {
    // If force is enabled, or nothing is on,  call _on immediately
    if((_force && force !== "off") || force === "on" || get_on() === null) {
      // Call on
      _on();

      // Request for other tabs to be turned off.
      if (get_on() !== null) {
        set_req(_id);
      }

      // Set self as on tab.
      set_on(_id);

      // Listen for off requests.
      _listener = create_listener(_listen_for_reqs);

    }

    else { 
      // Request for other tabs to be turned off. 
      set_req(_id);

      // Wait for on tab to turn off.
      _listener = create_listener(_listen_for_on);
    }
  }

  // Turn the current tab off, and stop any requests.
  var turn_off = function (args) {
    if(get_req() === _id) {
      rem_req();
    }

    if(get_on() === _id) { 
      rem_on();
    }

    _off(args);
  }

  // If a tab isn't on, it's off.
  var get_status = function() {
    if(get_on === _id) { 
      return true; 
    }

    return false;
  }

  // Attaches fn to "storage" events, and then 
  var create_listener = function(fn) {
    console.log("create_listener");

    // Attach function
    window.addEventListener("storage", fn, false);

    // Return function that detatches function
    return function() {
      window.removeEventListener("storage", fn, false);
    }
  };

  // Generates a unique id for a tab.
  var generate_id = function() {
    // Already an id
    assert(_id === undefined, "Tried to generate an id when one exists already");
    console.log(_id);

    return "" + Math.floor((Math.random() * 1000)) + ":" + Date.now();
  }





  /**********************************
   * Local storage helper functions 
   **********************************/
   var has_local_storage = function() {
     try {
       var t = "hello"
       localStorage.setItem(t, t);
       localStorage.removeItem(t);
     } 
     catch(e) {
       console.error("Your browser does not support localStorage. A workaround is still being developed.");
       return false;
     }

     return true;
  };

  //_tab_on

  var set_on = function(tab) {
    if (typeof tab === "string") {
      localStorage.setItem("_tab_on", tab);
    }
  };

  var get_on = function() { 
    return localStorage.getItem("_tab_on");
  };

  var rem_on = function() {
    localStorage.removeItem("_tab_on");
  };

  //_tab_req

  var set_req = function(tab) { 
    if (typeof tab === "string") {
      localStorage.setItem("_tab_req", tab);
    }
  };

  var get_req = function() {
    return localStorage.setItem("_tab_req", tab);
  };

  var rem_req = function () {
    removeItem("_tab_req");
  }


  // Constructor!!!

  var result = function(options) {
    if(!has_local_storage()) {
      console.error("Tab not initialized");
      return;
    }

    _on    = options.on    || _on;
    _off   = options.off   || _off;
    _force = options.force || false;

    _id = generate_id();
    this.id = _id;

    this.on  = turn_on;
    this.off = turn_off;
    this.status = get_status;

  };

  return result;

})();



/*
  off: 
  only remove 
*/