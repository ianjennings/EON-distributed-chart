var pubnub = require('pubnub');
var express = require('express');
var uuid = require('node-uuid');
var colors = require('colors');

var mem = false;

// set defaults
var publish_key = "demo";
var channel = 'pnrickmem-' + uuid.v4();
var interval_timeout = 1000;

// init pubnub
var pubnub = require("pubnub")({
  publish_key: publish_key
});

var megabyte = 1024 * 1024;
var interval = false;

var publish_mem = function() {
  
  mem = process.memoryUsage();

  // publish to pubnub
  pubnub.publish({
    channel: channel,
    message: {
      y: [
        Math.ceil(mem.rss / megabyte * 100) / 100, 
        Math.ceil(mem.heapTotal / megabyte * 100) / 100,
        Math.ceil(mem.heapUsed / megabyte * 100) / 100
      ],
      x: new Date().getTime() / 1000
    }
  });

};

var start = function() {
  interval = setInterval(publish_mem, interval_timeout);
};

var stop = function() {
  clearInterval(interval);
};
var init = function(options) {

  if(typeof options !== "undefined") {
  
    publish_key = options.publish_key || publish_key;
    channel = options.channel || channel;
    interval_timeout = options.timeout || interval_timeout;

  }

  start();

};

module.exports = {
  start: start,
  stop: stop,
  init: init
};