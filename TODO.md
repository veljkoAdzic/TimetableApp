# TODO

## Priority 1

- ~~Proper saving and loading in Lesson editor~~
- ~~Finish dowloader~~
  - ~~proper downloader logic and functionality~~
  - ~~when saving ask for appending selected or overrire stored lessons~~
  - ~~add title and change loading in endpointScreen.tsx~~
  - fix netoworking ( addd support for manifest files)
  - ~~fix input funkyness in lesson Form~~
- Add Theme Editor
  - List locations with their colours
  - Remove location
  - Prune Theme of unused locations
  - Edit modal with defaults and colour picker
- Save/Share timetable as image (no screenshots like pesants)

## Priority 2

- Change loading state display to be prettier of TimetableScreen.tsx
- Settings tab maybe?
- Save/Share timetable as link (probably as `ttshare://[username].me?data=[encoded data]` ) \* Note 1
- Add information modal in endpointScreen so when (?) button is pressed info is displayed
- Add a current time line in TimetableScreen.tsx to show when in the timetable is the user currently
- When pressing lesson in TimetableScreen.tsx show preview modal with more information

# NOTES

1. Encoding data

   1. Remove ids and extra_descriptions from lessons, border from colours
   2. Compress startTime and endTime in lessons
   3. Minify json

      ```
      {"lessons": ..., "colours": ...} -> {"l": ..., "c": ...}

      lessons: [{
      day -> d
      endTime -> et
      group -> g
      location -> l
      shortTitle -> s
      startTime -> st
      teacher -> tc
      title -> t
      }, ...]

      colours: [ "key" , {background, text}], ... ] -> { "key": {bg, t} }
      ```

   4. compress with gzip (Or Brodli - it seems to have better compression)
   5. Z85 (ZeroMQ) encode result
   6. Make encoding URL safe with `encodeURIComponent(encodeZ85(result))`

   ```js
   function encodeZ85(str) {
     const escape = {
       ":": "~0",
       "=": "~1",
       "/": "~2",
       "?": "~3",
       "&": "~4",
       "%": "~5",
       "#": "~6",
       "+": "~7",
       "^": "~8",
       "<": "~9",
       ">": "~a",
       "[": "~b",
       "]": "~c",
       "{": "~d",
       "}": "~e",
       "@": "~f",
       " $": "~g",
     };
     res = "";
     for (let c of str) {
       res += escape[c] || c;
     }
     return res;
   }
   ```

   Example: `ttshare://JohnDoe.me?data=9~5~3tIZ3~4.H~a4VN8ZRf9JZ3~4.H15iX~25f.VAhz4mjDWlI~4aY5*kZPO0~5Ky3OL24~eiwq~2~4r~f~a4VK~erAhCpp~3~0q!0~83~cm4IGKY3JT3Ue(~ef~7mp*l~0sxB48x~3nZ~2BvuGZC~chT~0Y~0u~3~0wODOVU-~9GEheA~0JxI~4k6tPbRm.)jFmwk~9M~bw~9~bPj7x!~5~0j-YFYLf!Z~4~7~0IG!~0eirH9v.~eIR.XYuib5~9b0S~0sYOM~5jk6aa!4)szAq~0gu3uPKH~brtX3~7~1n(~6Y~8ml8~1ah0pddapHm~bi8~30*O~5f~0~04~5wBTDvuwwElHB~e8.~4o~29l1px~3~9~f!qQGG\*8uep!SDRwOiFFg0~1pKCqDaawbwt4g(.brXOflqoNeelEmeq5r23j4ZdlG~3C63bp1ctf~9X3I5~c8(~45~8I5twg~4aMyy!BVtNf-jZ3~4.H`
   length: 513
