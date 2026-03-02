# TODO

## Priority 1

- ~~Proper saving and loading in Lesson editor~~
- ~~Finish dowloader~~
  - ~~proper downloader logic and functionality~~
  - ~~when saving ask for appending selected or overrire stored lessons~~
  - ~~add title and change loading in endpointScreen.tsx~~
  - ~~fix netoworking ( addd support for manifest files)~~
  - ~~fix input funkyness in lesson Form~~
- ~~Add Theme Editor~~
  - ~~List locations with their colours~~
  - ~~Remove location~~ **(Not implemented and it should probably not be until further notice)**
  - ~~Prune Theme of unused locations~~
  - ~~Edit modal with defaults and colour picker~~
- Save/Share timetable
  - as image (no screenshots like pesants)

## Priority 2

- ~~Change loading state display to be prettier of TimetableScreen.tsx~~
- Settings tab
  - Toggle between location and lesson (id) theme mapping
- Save/Share timetable
  - ~~as link (probably as `ttshare://[username].me?data=[encoded data]` )~~ \* Note 1
  - ~~as QR (raw binary that is encoded similar to above)~~ **(Will not be implemented untill further notice)**
  - Export/Import from file
- Add information modal in endpointScreen so when (?) button is pressed info is displayed
- Add a current time line in TimetableScreen.tsx to show when in the timetable is the user currently
- <u>~~When pressing lesson in TimetableScreen.tsx show preview modal with more information~~, and when hold-pressing shift the zindex to move up/down to show overlaping lessons</u>
- ~~Make the ability to change theme in Lesson editor modal directly (no need to save and switch between drawers)~~
- ~~Improve designs with dropshadow~~
- ~~Refactor editor to use context and to use newer components~~
- ~~Implementation of scraping directly from WebView component by reaching `vapi://local.tt`~~

# NOTES

1. Encoding data

   1. Minify json
    - theme map is turned into an array of `[location, encoded_background]`
    - lesson startTime, endTime and day get bit-packed as `encoded_time`
    - lessons get turned into array of `[encoded_time, location, shortTitle, teacher, title, group(optional)]`
   2. compress
   3. Encode with Base94 
