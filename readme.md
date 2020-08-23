# To Do List Web App
This is a simple To Do List App.

Content
- Initialization
  - Dependencies
- Screenshots
- Explanation of the Code
- References

## Initialization
To run this project, clone the repository by either of the two methods:
- Go to Code → Download ZIP, and extract the ZIP file.
- Go to Terminal, and run the following command: <br>
```git clone https://github.com/abhinrustagi/ToDo-List.git```

Then,
- Run the following command: <br> ```node app.js```

**Make sure you have node installed on your system.**

**If in case the ```node_modules``` folder is not available in your downloaded directory, go to Terminal, navigate to the folder containing the project and run ```npm install```.**

### Dependencies
This project relies heavily on the following ```npm``` packages:
- ```express```
- ```body-parser```
- ```ejs```

## Screenshots
**Home Screen**
![Home Screen](screens/Screen1.png)

**Adding a new item**
![Adding new item](screens/Screen2.png)

**New Item Added**
![New Item Added](screens/Screen4.png)

**Work List** (```/work```)
![Work List](screens/Screen3.png)

## Explanation of the Code

#### app.js
1. Lines 1 → 17: Package Imports, and Prerequisites.
2. Lines 19 → 34 <br>```app.get("/", function(req, res){ ... });```<br>
  Obtains the current day (in the form of an integer value, with Sunday as 0) →<br> Converts it into a string of the form "Day, Month Date" <br>→ Uses EJS to render a page with this worked string stored in the variable ```day```, on the template ```list.ejs```, with title as the passed parameter ```day```, and preset tasks from the array ```items```.
3. Lines 36 → 41 <br> ```app.get("/work", function(req, res){ ... });```<br>
Renders a separate list with title 'Work List', and no preset tasks. It uses a different array for storage (```workList```).
4. Lines 43 → 56 <br> ```app.post("/work", function(req, res){ ... });```<br>
Parses the request. → If the request came from the work page, adds the item to the array ```workList```, and redirects to the work page. → Else, adds the item to ```items``` array and redirects to the home page.
5. Lines 58 → <br>
Server setup on Port 8888.

## References
- [Node Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/#docs)
- [Body Parser Documentation](https://www.npmjs.com/package/body-parser)
