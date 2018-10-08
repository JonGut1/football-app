# Football app

## Table of Contents

* [About](#about)
* [Instructions](#instructions)
* [Dependencies](#dependencies)
* [Known-Bugs](#known-bugs)

## About

In this app you can insert scores into a database and the app will automatically fetch the results of the Football World Cup 2018 match and will insert into a leaderboard.

## Instructions

To launch this app you need first to navigate to the src folder with your terminal and run:
```
php -S 127.0.0.1:8080
```
then in your browser type:
```
http://127.0.0.1:8080/src#!/
```

To insert scores select the insert tab and select a match, then enter a name and scores. When everything that is needed is filled click save.

To delete or view inserted scores navigate to the history tab and select on the name that you had inserted previously.

To check the leaderboards navigate to the leaderboard tab.

## Dependencies

* AngularJs,
* ES 2015,
* CSS3,
* HTML5,
* Football-Api ( https://www.football-data.org ),
* ui-router,
* some data insertion code was written in PHP.

## Known-Bugs

Need to refresh the page at certain situations in order for the deletion of the data would be visible in the leaderboard.

