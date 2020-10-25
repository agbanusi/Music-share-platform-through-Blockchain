# HOW TO RUN
run in a cmd after installing ganache-cli
``` 
ganache-cli
```
open another command line and paste these after each other
```
truffle compile
```
```
truffle migrate
```
Then start the server
```
npm run start
```

To run the app
``` 
cd client && npm install && expo start
```

# Main API Endpoint
- POST login
needs email and password
returns name of user, email of user and id of user or person_id and success status or Failed status

- GET /meterTransactions/{meter_id}
needs the meter_id supplied to the endpoint
returns list of last 15 transactions on the meter as history, unit remaining as availableUnit,and unit used for that day so far as daily or return a Failed status if not successful

- GET /personTransaction/{person_id}
needs personId
returns list of unit bought as amount and date it was bought as date

- GET /consumption/{meter_id}?time=timer
need meter_id and timer which is either 'month', 'year', or 'day'
returns gross energy within the month or year or day as energy and detail of tariff used by the meter producer

- POST /createMeter
needs body of serial_number, meter_type_id and manufacturer_id, these are gotten from the body of the meter
returns success status or Failed status

- Get /allMeters/{person_id}
needs the person_id
returns the list of meters found registered

- POST /addPerson
needs the body of 
    - title 
    - name
    - surname 
    - birth_date 
    - sex 
    - education
    - city_id 
    - street
    - email
    - phone 
    - nationality
return success status and data or Failed status

- PUT /updatePerson/{person_id}
needs the body of 
    - title 
    - name
    - surname 
    - birth_date 
    - sex 
    - education
return success status or Failed status

- POST /addAddress/{person_id}
needs the body of 
    - email
    - phone
    - street
    - city_id
    - primary
return success status and data or Failed status

- PUT /updateAddress/{person_id}
needs person_id and  the body of 
    - id this is the address_id it is found from the addAddress endpoint, personAddresses endpoint the person's details too
    - email
    - phone
    - street
    - city_id
    - primary
return success status or Failed status

- GET addresses/{person_id}
needs person_id
returns addresses as the lsit of the addresses of the user

## Persistent Connections using socket.io
- On connection to the server, the server emits a 'connected' event with data of socket_id
- When the app has connected to the database and gotten the list of all meters being used, it should send an event to the server with the name 'accepted'
- The app should listen for the event with the name 'update' to update the units and daily conumptions so far and history, it will update evry hour
# Group 5 MPM API usage documentation

- ## authentication
  - Login [here](http://demo.micropowermanager.com/docs/#jwt-authentication)
    ```
    POST api/auth/login
    ```
    _Requirements_
    - email
    - password

  - Refresh Token [here](http://demo.micropowermanager.com/docs/#refresh-token)
    ```
    POST api/auth/refresh
    ```
    Needs old token
- ## Meter Parameter
  - List with meters [here](http://demo.micropowermanager.com/docs/#list-with-meters)
    ```
    api/meters/parameters/{meterParameter}
    ```
  - Create [here](http://demo.micropowermanager.com/docs/#refresh-token)
    ```
    POST api/meters/parameters
    ```
    - meter_id 
    - tariff_id
    - customer_id
    - geo_points
  - Update [here](http://demo.micropowermanager.com/docs/#update)
    ```
    PUT api/meters/{serialNumber}/parameters
    ```
    - tariffId
    - personId
- ## Tariffs
  - List [here](http://demo.micropowermanager.com/docs/#list82)
    ```
    GET api/tariffs
    ```
- # Meters
  - List [here](http://demo.micropowermanager.com/docs/#list42)
    ```
    GET api/meters
    ```
  - Detail [here](http://demo.micropowermanager.com/docs/#detail43)
    ```
    GET api/meters/{id}
    ```
  - Create [here](http://demo.micropowermanager.com/docs/#create44)
    ```
    POST api/meters
    ```
    - serial_number 
    - meter_type_id
    - manufacturer_id 	
  - Update [here](http://demo.micropowermanager.com/docs/#update45)
    ```
    PUT api/meters/{id}
    ```
  - Revenue [here](http://demo.micropowermanager.com/docs/#revenue)
    ```
    GET api/meters/{serialNumber}/revenue
    ```
	- Meter Transactions [here](http://demo.micropowermanager.com/docs/?javascript#list-with-all-relation)
    ```
    GET api/meters/{serialNumber}/transactions
    ```
  - Consumption List [here](http://demo.micropowermanager.com/docs/?javascript#consumption-list)
    ```
    GET api/meters/{serialNumber}/consumptions/{start}/{end}
    ```
- ## Payment History
  - Details [here](http://demo.micropowermanager.com/docs/?javascript#detail58)
    ```
    GET api/app/agents/customers/{customerId}/graph/{period}/{limit?}/{order?}
    ```
  - Payment Periods [here](http://demo.micropowermanager.com/docs/?javascript#payment-periods)
    ```
    GET api/paymenthistories/{personId}/period
    ```
  - Payment periods date range [here](http://demo.micropowermanager.com/docs/?javascript#payments-list-with-date-range)
    ```
    POST api/paymenthistories/overview
    ```
- # People
  - Transactions Details [here](http://demo.micropowermanager.com/docs/?javascript#transactions)
    ```
    GET api/people/{person_id_}/transactions
    ```
  - Person with Meters & geo/tariffs [here](http://demo.micropowermanager.com/docs/?javascript#person-with-meters-geo)
    ```
    GET api/people/{person}/meters/geo
    ```
    tariffs
    ```
    GET api/people/{person}/meters
    ```
  - Update Address [here](http://demo.micropowermanager.com/docs/?javascript#update-address73)
    ```
    PUT api/people/{person}/addresses
    ```
    - id
    - email
    - phone
    - street
    - city_id
    - primary
  - Create People [here](http://demo.micropowermanager.com/docs/?javascript#create79)
    ```
    POST api/people
    ```
  - Update People
    ```
    PUT api/people/{person}
    ```
    see doc for body details