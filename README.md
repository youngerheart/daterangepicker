# daterangepicker
a simple daterangepicker

## DEMO
[Click here](http://elemefe.github.io/daterangepicker/)

## What achieved 
1. calendar component base on moment.js
2. date simple picker
3. date range picker
4. date terminal picker

## Usage

This component relies on moment and moment-range, so you should include them first

Include js and css in `/dist` by tag , you can also require js by `require('date-range-picker')`



      var configs1 = {
        lang: 'zh-cn', // using language
        numberOfCalendars: 1, // displaying month number
        type: 'single', // single, range, terminal
        date: '2015-10-01', // default date for type single
        range: ['2015-10-01', '2015-10-08'], default range for type range or terminal
        onSelect: function(date/range) {
          //...
        } // callback after select, return date or range with moment and moment-range object
      }
      /**
      * Get a dom object named such as el1 first
      */
      var drp1 = new DateRangePicker(el1, configs1);
      console.log(drp1.date) // current date for type
      console.log(drp1.range) // current range for type range and terminal


## Develop

      $ git clone && make dev

## TODO

Easily transform to angular directive or react component (in new project)
