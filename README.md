# daterangepicker
a simple daterangepicker

## DEMO
[Click here](http://elemefe.github.io/daterangepicker/)

## What achieved 
1. calendar component base on moment.js
2. date simple picker
3. date range picker
4. date terminal picker

**compatibility for IE**

* Because of using browserify, if you don't need hour and minute picker, it supports IE9.
* If you need hour and minute picker, because of using range input, it supports IE10.

## Usage

This component relies on moment and moment-range, so you should include them first

Include js and css in `/dist` by tag , you can also require js by `require('date-range-picker')`



      var configs1 = {
        lang: 'zh-cn', // using language
        numberOfCalendars: 1, // displaying month number
        type: 'single', // single, range, terminal
        time: true, // want display & ctrl hours and minutes or not
        date: moment('2015-10-01 23:33'), // default date for type single
        range: moment.range(['2015-10-01', '2015-10-08']), // default range for type range or terminal
        minDate: moment('2015-09-30'), // limit minDate
        maxDate: moment(), // limit maxDate
        onSelect: function(date/range) {
          //...
        } // callback after select, return date or range with moment and moment-range object
      }

      /* Get a dom object named such as el1 first */
      var drp1 = new DateRangePicker(el1, configs1);
      console.log(drp1.date); // current date for type
      console.log(drp1.range); // current range for type range and terminal
      console.log(drp1.time.hours); // current hours array
      console.log(drp1.time.minutes); // current minutes array

      /* set a value and reload daterangepicker */
      drp1.set('range', moment.range());



## Develop

      $ git clone && make dev

## TODO

Easily transform to angular directive or react component (in new project)