# Florida Pickleball Project
------------
## Project Description

### Goal
Our goal was to visualize data regarding the locations of pickleball courts, hopsitals, and the elderly population in the state of Florida to understand the relationships of these categories and explain how their proximity to each other could help explain trends in increases in the number of elderly people in Florida as well as the increased popularity of pickleball. This was our group's first opportunity to build from scratch and practice more of the development skills. 
Our goal was to combine our skills in python data manipulation, sql querying, flask app generation, and mapping libraries to create meaningful visualizations. Our chosen dataset was focused on the population of people older than 65 in the state of Florida and their proximity to hospitals and pickleball courts. Pickleball is becoming increasingly popular with retirement age populations and Florida is key state where retired people are moving to. 

CREDITS 
Each member of our group referenced activities that we had completed in class and challenges that we had completed outside of class in order to understand the syntax and structure of the different files that were created to complete this project. When stuck, members of our group would ask questions to Chatgpt in order to clarify what might be causing an error or how to move a section of code to a different line in order for it to run correctly. Additionally we met via Zoom regularly to solve problems and overcome challenges by having everyone look at code segments together to identify why it may not be functioning as we expected to and to make changes. 

A website, Pickleheads (https://www.pickleheads.com/courts/us/florida), was webscraped to retrieve pickleball court locations and the number of courts present at that location.
The Census API Population Estimate from 2019, https://www.census.gov/data/developers/data-sets/popest-popproj/popest.Vintage_2019.html#list-tab-2014455046, was used to create our main dataset with population information.
The GeoApify Places API Playground, https://apidocs.geoapify.com/playground/places/, was used to retrieve the location of hospitals in Florida. This list is not comprehensive. 

SOFTWARES USED 

LIBRARIES 
Numpy
Splinter
BeautifulSoup
Flask
SQLite3
SQLalchemy
D3
Flask
Pandas
Requests

LANGUAGES 
Python
SQL
Javascript
HTML
CSS

SOFTWARE
VSCode
GitLens


------------
## Code Explanation with Figures/Visualizations
## Part 1: API and Webscraping
- There are two files for this section: API Pull.ipynb and webscraping.ipynb.
- For API Pull.ipynb:
  -  Used the Census API to pull information about the population that is 65 and older in Florida and a performed a separate pull for the total population of Florida.
  -  Converted the results from both API pulls to JSON format.
  -  Formatted the columns for each pull and saved them as DataFrames with Pandas.
  -  Merged the two DataFrames using an outer join on the column 'county'.
  -  Split the name column into county and state and removed the word 'county' from the county column.
  -  Removed unnecessary and duplicate columns.
  -  Renamed columns and corrected datatypes for select columns.
  -  Created a column that contained the percent elderly which was calculated from the elderly population and total population columns and formatted the column accordingly.
  -  Pulled hospital information from GeoApify and appended the information to a list in the form of a dictionary.
  -  Converted the hospital list of dictionaries to a DataFrame.
  -  Created an ID column to be used as the primary key in the hospital sqlite database.
  -  Converted the hospital and population dataframes to tables in one shared sqlite3 database with their respective primary keys.
-  For webscraping.ipynb:
  -  Used the browser from splinter to create a connection to the pickleheads website.
  -  Found the section of interest by finding the associated class.
  -  Used browser to click the show more button in the open browser so that all of the pickleball court information could be webscraped.
  -  Created a BeautifulSoup object and parsed with the html parser.
  -  Appended the location, city and number of courts to three separate lists in a for loop.
  -  Converted the three lists into a dictionary followed by a DataFrame.
  -  Used an existing CSV that correlates the city and counties in Florida, including the latitude and longitude coordinates.
  -  Merged the existing dataframe with the imported csv.
  -  Removed the word 'court' from the column containing the number of courts so that calculations for total number of courts could be performed.
  -  Added an ID column to function as the primary key.
  -  Converted the court dataframe to a table in the same shared sqlite3 database as the hospital and population tables.
  -  Quit the browser.

## Part 2: SQLite Querying, Flask App SetUp and D3 Data Preparation. 
- Verified that the three expected tables were in the database.

![image](https://github.com/nickbrannum02/Project-3/assets/132176159/7c3f8175-bdbc-489b-a59f-149b793832e9)

- The Flask App:
  -  In pickleapp.py, set up the flask app by:
    -  Imported dependencies.
    -  Reflected an existing database with SQLAlchemy's automap_base.
    -  Saved a reference to each of the three tables.
    -  Initialized the flask app and used the methods 'GET' and 'POST' to access the index.html in the template folder using render_template.
    -  The first route is the court information.
    -  This route queried the court_location table for all columns, converted the rows in the table to a list of dictionaries with the appropriate keys for each value using list comprehension, and jsonified the queried         and formatted data.
 
![image](https://github.com/nickbrannum02/Project-3/assets/132176159/5a38fefb-d696-4660-9658-02e1c368a95e)


    -  The second route is the elderly population information.
    -  This route queried the elderly_people table for all columns, converted the rows in the table to a list of dictionaries with the appropriate keys for each value using list comprehension, and jsonified the queried         and formatted data.

![image](https://github.com/nickbrannum02/Project-3/assets/132176159/4f423807-b57b-422e-9254-ce800e0968a0)

    
    -  The third route is the percent elderly and court information combined.
    -  This route:
      -  Queried the elderly_population table for the County, Percent_Elderly and Total_Population and queried the court_location table for the Number of Courts and calculated the CourtsPer10kPeople from the number of            Courts and Total_Population by getting the total number of courts by county and casting  the total as TotalCourts, then using the TotalCourts, calculated the numbers for the CourtsPer10KPeople.
      -  The court_location and elderly_population tables were joined on county and grouped by county and percent_elderly.
      -  Then converted the rows in the table to a list of dictionaries with the appropriate keys for each value using list comprehension, and jsonified the queried and formatted data.

![image](https://github.com/nickbrannum02/Project-3/assets/132176159/5044d78b-9cb7-4aa6-aadc-976a7a32f531)

      
    -  The final route contains the hospital information.
    -  This route queried the hospital table for all columns, converted the rows in the table to a list of dictionaries with the appropriate keys for each value using list comprehension, and jsonified the queried               and formatted data.

![image](https://github.com/nickbrannum02/Project-3/assets/132176159/de5d51ce-de6e-4c91-b6a7-b2b0700b1fd4)

    
    -  The Flask App was then instructed to run.
    
  -  In getData.js:
    -  The D3 library was utilized to pull the data from the flask API paths and console.log the information.
        -  This information is then used in the logic.js file.
  -  leaflet-heat.js is a file from a javascript library that was set up specifically to draw heatmaps. This file will also be utilized in logic.js.
  -  In logic.js:
    -  A sleep function was added to allow all of the data to load before anything was mapped.
    -  The map layer was initialized using the Leaflet.js library.
    -  The baseLayer was setup from the openstreetmap template.
    -  The court icons were set up, a cluster group for the markers was initialized, the court dataset was looped through to set up markers for each latitude and longitude pair, which represent an individual court.
       -  A popup was set up to show the location, city, county, and number of courts represented by that marker.
    -  The cluster grouping was applied to the markers and the markers were added to the layer.
    -  In order to display a scatterplot of the Percent_Elderly population vs Courts per 10,000 Residents:
      -  The countyData from the getData.js was iterrated through by row and the county was appended to the labels list, the Percent Elderly was appended to the xDatapoints list and the Courts per 10,000 was appended to          the yDatapoints list. These lists were used with the Chart.js library to create a scatterplot of the data.
      -  The variable ctx stored the information from index.html that had an ID of 'scatterplot' to create a 2 dimensional visualization.
      -  The chart was then set up to identify where it should render the scatterplot in the html using the ctx variable and chart the scatterplot from the assembled lists from above.
   
![image](https://github.com/nickbrannum02/Project-3/assets/132176159/ac28dd4f-5833-47c1-9c7e-e0beebe7c370)


    -  The hospital icons were set up,  a cluster group for the markers was initialized, the hospital dataset was looped through to set up markers for each latitude and longitude pair, which represent an individual             hospital.
      -  A popup was set up to show the hospital name, city and county represented by that marker.
    -  The cluster grouping was applied to the markers and the hospital markers were added to the layer.
    -  For the heatmap, the courtData was looped through and the latitude and longitude for each court were pushed to the heatArray.
    -  The parameters for the heatLayer were established.
    -  The baseLayer, courtMarkers, hospitalMarkers and the heatLayer were added to the maps.
    -  An object called overlayLayers was established to allow different layers to be selected and deselected on the rendered map.
    -  All of the layers were then added to the map. This is the rendered map with all optional layers shown.

![image](https://github.com/nickbrannum02/Project-3/assets/132176159/192f0dc2-8fcc-4543-8594-c49c43e99d3f)

       

### HTML Portion
- The head section of index.html sets up the cluster markers, the icons, and the leaflet CSS styling.
- The body set the background to gray and set up the IDs for the map and scatterplot.
- There is a section of fun facts about pickleball followed by two visualizations from Google trends that are embedded.







## Conclusion
Our group completed a project focused on the relationship between pickleball courts and where older people move to retire, focusing exclusively on the state of Florida as our retirement location. Relationships of interest included:  elderly populations and proximity to pickleball courts and where is the elderly population on the rise within the US and where is it decreasing. Data was gathered primarily from Census.gov data tables to accurately identify populations of the different counties in Florida and an API from The Global Pickleball Network website to collect data focused on pickleball court locations.  
