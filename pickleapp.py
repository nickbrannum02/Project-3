# Import dependencies
import numpy as np
import sqlite3
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template



#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///florida_info_db.sqlite")

# Reflect an existing database into a new model
Base = automap_base()
# Reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
courts = Base.classes.court_location
elderly = Base.classes.elderly_people
hospitals = Base.classes.hospitals 

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/", methods=["GET", 'POST'])
def index():
    return render_template("index.html")


@app.route('/api/courts_complete', methods=['GET'])
def courts():
    # Connect to the SQLite database
    conn = sqlite3.connect('florida_info_db.sqlite')
    # Create a cursor object
    cursor = conn.cursor()
    # Execute an SQL query to select all rows from the courts table
    cursor.execute('SELECT * FROM court_location')
    # Fetch all rows from the query result
    rows = cursor.fetchall()
    # Close the database connection
    conn.close()
    # Convert the rows to a list of dictionaries
    court_data = [{'Location Name': row[0], 'City': row[1], 'Number of Courts': row[2], 'County': row[3], "Location": {"Latitude": row[4], "Longitude": row[5]}} for row in rows]
    # Return the data as JSON
    return jsonify(court_data)


@app.route('/api/elderly_complete', methods=['GET'])
def elderly():
    # Connect to the SQLite database
    conn = sqlite3.connect('florida_info_db.sqlite')
    # Create a cursor object
    cursor = conn.cursor()
    # Execute an SQL query to select all rows from the elderly table
    cursor.execute('SELECT * FROM elderly_people')
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
    conn = sqlite3.connect('florida_info_db.sqlite')
    cursor = conn.cursor()
    # Execute an SQL query to select needed rows from the tables
    sql_query = """SELECT e.County, e.Percent_Elderly, SUM(CAST(c."Number of Courts" AS REAL)) AS TotalCourts, 
                    ROUND((SUM(CAST(c."Number of Courts" AS REAL)) / (e.Total_Population / 10000)),2) AS CourtsPer10kPeople, e.Total_Population
                FROM elderly_people e
                JOIN court_location c on e.County = c.County
                GROUP BY e.County, e.Percent_Elderly"""
    cursor.execute(sql_query)
    # Fetch all rows from the query result
    rows = cursor.fetchall()
    # Close the database connection
    conn.close()
    # Convert the rows to a list of dictionaries
    county_data = [{'County': row[0], 'Percent Elderly': row[1], 'Number of Courts': row[2], 'Courts per 10,000': row[3], 'Total_Population': row[4]} for row in rows]
    # Return the data as JSON
    return jsonify(county_data)

@app.route('/api/hospital_data', methods=['GET'])
def hospitals():
    # Connect to the SQLite database
    conn = sqlite3.connect('florida_info_db.sqlite')
    # Create a cursor object
    cursor = conn.cursor()
    # Execute an SQL query to select all rows from the hospital table
    cursor.execute('SELECT * FROM hospitals')
    # Fetch all rows from the query result
    rows = cursor.fetchall()
    # Close the database connection
    conn.close()
    # Convert the rows to a list of dictionaries
    hospital_data = [{'Name': row[0], 'City': row[1], 'County': row[2], 'Latitude': row[3], "Longitude": row[4], "ID": row[5]} for row in rows]
    # Return the data as JSON
    return jsonify(hospital_data)


if __name__ == '__main__':
    app.run(debug=True)

#python pickleapp.py