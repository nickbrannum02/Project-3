import numpy as np
import sqlite3
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine, func
from flask import Flask, jsonify



#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///florida_info_db.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
courts = Base.classes.court_location
elderly = Base.classes.elderly_people

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/courts_complete<br/>"
        f"/api/elderly_complete<br/>"
        f"/api/county_data"
    )


@app.route('/api/courts_complete', methods=['GET'])
def courts():
    # Connect to the SQLite database
    conn = sqlite3.connect('florida_info_db.sqlite')  # Replace with your database name
    # Create a cursor object
    cursor = conn.cursor()
    # Execute an SQL query to select all rows from the table
    cursor.execute('SELECT * FROM court_location')  # Replace with your table name
    # Fetch all rows from the query result
    rows = cursor.fetchall()
    # Close the database connection
    conn.close()
    # Convert the rows to a list of dictionaries
    court_data = [{'Location Name': row[0], 'City': row[1], 'Number of Courts': row[2], 'County': row[3], "Latitude": row[4], "Longitude": row[5]} for row in rows]
    # Return the data as JSON
    return jsonify(court_data)


@app.route('/api/elderly_complete', methods=['GET'])
def elderly():
    # Connect to the SQLite database
    conn = sqlite3.connect('florida_info_db.sqlite')  # Replace with your database name
    # Create a cursor object
    cursor = conn.cursor()
    # Execute an SQL query to select all rows from the table
    cursor.execute('SELECT * FROM elderly_people')  # Replace with your table name
    # Fetch all rows from the query result
    rows = cursor.fetchall()
    # Close the database connection
    conn.close()
    # Convert the rows to a list of dictionaries
    data = [{'Total_Population': row[0], 'County_ID': row[1], 'Elderly_Population': row[2], 'County': row[3], "Percent_Elderly": row[4]} for row in rows]
    # Return the data as JSON
    return jsonify(data)

@app.route('/api/county_data', methods=['GET'])
def base_map():
    # Connect to the SQLite database
    conn = sqlite3.connect('florida_info_db.sqlite')  # Replace with your database name
    # Create a cursor object
    cursor = conn.cursor()
    # Execute an SQL query to select all rows from the table
    sql_query = """SELECT e.County, e.Percent_Elderly, SUM(c.'Number of Courts') AS TotalCourts
                FROM elderly_people e
                JOIN court_location c on e.County = c.County
                GROUP BY e.County, e.Percent_Elderly"""
    cursor.execute(sql_query)
    # Fetch all rows from the query result
    rows = cursor.fetchall()
    # Close the database connection
    conn.close()
    # Convert the rows to a list of dictionaries
    county_data = [{'County': row[0], 'Percent Elderly': row[1], 'Number of Courts': row[2]} for row in rows]
    # Return the data as JSON
    return jsonify(county_data)


if __name__ == '__main__':
    app.run(debug=True)