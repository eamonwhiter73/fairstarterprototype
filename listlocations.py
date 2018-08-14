#!/usr/bin/python
import httplib, json

accessToken = 'sq0atp-on5KcHDr0dhlbefU0EwVwg'

# Set your request headers.
request_headers = {'Authorization': 'Bearer ' + accessToken,
                   'Accept':        'application/json',
                   'Content-Type':  'application/json'}

request_path = '/v2/locations'
request_body = ''

connection = httplib.HTTPSConnection('connect.squareup.com')
connection.request('GET', request_path, request_body, request_headers)
response = connection.getresponse()

#Convert response to JSON and store it in a variable.
locations = json.loads(response.read())

# Pretty-print the locations array.
print json.dumps(locations, indent=2, separators=(',',': '))