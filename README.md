daterangepicker
=========

[![NPM version](https://img.shields.io/npm/v/date-range-picker.svg)](https://www.npmjs.com/package/date-range-picker) [![Downloads](https://img.shields.io/npm/dm/date-range-picker.svg)](http://badge.fury.io/js/date-range-picker)

build [![Build Status](https://travis-ci.org/ElemeFE/daterangepicker.svg)](https://travis-ci.org/ElemeFE/daterangepicker) [![Coverage Status](https://img.shields.io/coveralls/ElemeFE/daterangepicker.svg)](https://coveralls.io/r/ElemeFE/daterangepicker/)

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

      $ npm install date-range-picker
      $ bower install date-range-picker // or use bower

Include js in `/dist` by tag , you can also require js by `require('date-range-picker')`


      var configs1 = {
        lang: 'zh-cn', // using language
        numberOfCalendars: 1, // displaying month number
        calendarType: 'day', // type of calendar, day, week or month, dafault 'day'
        type: 'single', // single, range, terminal
        time: true, // want display & ctrl hours and minutes or not
        noCalendars: false, // want not display & ctrl calandar, default false
        date: moment('2015-10-01 23:33'), // default date for type single
        range: moment.range(['2015-10-01', '2015-10-08']), // default range for type range or terminal
        minDate: moment('2015-09-30'), // limit minDate
        maxDate: moment(), // limit maxDate
        onSelect: function(date/range) {
          //...
          drp2.set('range', range); // set range in onSelect is no use
        } // callback after select, return date or range with moment and moment-range object
      }

      /* Get a dom object named such as el1 first */
      var drp1 = new DateRangePicker(el1, configs1);
      console.log(drp1.date); // current date for type
      console.log(drp1.range); // current range for type range and terminal
      console.log(drp1.time.hours); // current hours array
      console.log(drp1.time.minutes); // current minutes array

      /* set a value and reload daterangepicker */
      drp1.set('range', moment.range()); // support: date and range, and I'm not ensure set other props are useful. 
      
      /* clear daterangepicker */
      drp1.clear();

      /* support for shortcuts */
      config.shortcuts = {
        el: shortcutsEl, // default: null
        btns: ['today', ...] // sort and which btn will be shown, 
        // default and only those option ['today', 'yesterday', 'lastWeek', 'custom']
      }
      // only support chinese, english and japanese , you can give me a PR for your language.
      // in src/lang.js
      {
        today: 'todayStr', // such as: '今天'
        yesterday: 'yesterdayStr', // such as: '昨天'
        lastWeek: 'lastWeekStr', // for range and terminal. such as: '最近一周'
        lastMonth: 'lastMonthStr', // for range and terminal. such as: '最近一月'
        custom: 'customStr' // such as: '自定义'
      };

      /* support for dimension in single(developing) */
      config.dimension = {
        el: dimensionEl, // default: null
        btns: ['day', ...] // sort and which btn will be shown, 
        // default and only those option ['day', 'week', 'month']
      }
      // only support chinese, english and japanese, you can give me a PR for your language.
      // in src/lang.js
      {
        day: 'dayStr', // such as: '日'
        week: 'weekStr', // such as: '周'
        month: 'monthStr' // such as: '月'
      };


## Develop

      $ git clone && make dev && view localhost:8888

## bug && suggestion?
Give me [issue](https://github.com/ElemeFE/daterangepicker/issues/new) please~

## TODO

Easily transform to angular directive or react component (in new project)
