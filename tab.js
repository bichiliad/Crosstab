var Tab = function(options) {
  // Check to see if localStorage is available in the browser
  try {
    var t = "hello"
    localStorage.setItem(t, t);
    localStorage.removeItem(t);
  } catch(e) {
    console.error("Your browser does not support localStorage. A workaround is still being developed.");
    return undefined;
  }

  var opt = options || {};
  var noop = function() {};

  this.off_fn = opt.off || noop;
  this.on_fn = opt.on || noop;
  this.id = this.generate_id();

  var that = this;

  window.onbeforeunload = function(){
    console.log("onbeforeunload");
    if(localStorage.getItem("_tab_on") === that.id) {
      localStorage.removeItem("_tab_on");
    }

    if(localStorage.getItem("_tab_req") === that.id) {
      localStorage.removeItem("_tab_req");
    }
  };
}

// No-op function
Tab.prototype.noop = 

// Generates a unique id based on time + the current date, to ensure with 
// high probability that two tabs created within the same second don't have
// the same id. 
Tab.prototype.generate_id = function() {
  return "" + Math.floor((Math.random() * 1000)) + ":" + Date.now();
}

Tab.prototype.on = function(){
  var isOn = localStorage.getItem("_tab_on");

  // If nothing is on, just be on.
  if(!isOn || isOn === this.id || isOn === "undefined"){
    localStorage.setItem("_tab_on", this.id);
    this.on_fn();

    if(isOn !== this.id){
      var that = this;
      this._listen(function(e){
        // TODO: Time this out after a second or two
        if(e !== null && e.key === "_tab_req" && e.newValue !== that.id){
          localStorage.removeItem("_tab_on");
          that.off();
        }
      });
    }
  } 
  // Something is on. Request to be on, then fire when ready.
  else {
    localStorage.setItem("_tab_req", this.id);
    var that = this;

    this._listen(function(e){
      console.log(e);
      if(e !== null && e.key === "_tab_on" && e.newValue === null){
        localStorage.setItem("_tab_on", that.id);
        that.on_fn()
        console.log("fire_when_ready");
        that._unlisten(arguments.callee);

        that._listen(function(e){
          // TODO: Time this out after a second or two
          if(e !== null && e.key === "_tab_req" && e.newValue !== that.id){
            localStorage.removeItem("_tab_on");
            that.off();
          }
        });

      }
    });
  }
}

Tab.prototype.off = function(){
  if(localStorage.getItem("_tab_on") === this.id) {
    localStorage.removeItem("_tab_on");
  }

  if(localStorage.getItem("_tab_req") === this.id) {
    localStorage.removeItem("_tab_req");
  }

  this.off_fn();
}

// Bind @fn to storage events
Tab.prototype._listen = function(fn){
  // Wrap the function to handle IE's window.event standard.
  var fn_wrapper = function(e){
    if (!e) { e = window.event; }
    return fn(e);
  }
    //TODO: need to use attachEvent for ie8 and below support
    window.addEventListener("storage", fn_wrapper, false);
  }

// Unbind the storage listener
Tab.prototype._unlisten = function(fn){
  var fn_wrapper = function(e){
    if (!e) { e = window.event; }
    return fn(e); 
  }

  window.removeEventListener("storage", fn_wrapper, false);
}


////////////////////////////////////////
// Testing stuff
////////////////////////////////////////

var opt = {
  on: function(){ console.log("on"); },
  off: function(){ console.log("off"); }
}

var t = new Tab(opt);


// NOTE that file:// doesn't fire localStorage events properly / as expected.
// Submit a bug report if there isn't one already.
