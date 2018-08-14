const functions = require('firebase-functions');
const SquareConnect = require('square-connect');
const defaultClient = SquareConnect.ApiClient.instance;
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

var api = new SquareConnect.CatalogApi();
var locationApi = new SquareConnect.LocationsApi();
var inventoryApi = new SquareConnect.V1ItemsApi();

oauth2 = defaultClient.authentications.oauth2;
oauth2.accessToken = 'sq0atp-on5KcHDr0dhlbefU0EwVwg';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addItem = functions.firestore
    .document('items/{itemId}')
    .onCreate((snap, context) => {
		// Get an object representing the document
		// e.g. {'name': 'Marie', 'age': 66}
		const newValue = snap.data();
		console.log(newValue);

		var variation = {
		    "type": "ITEM_VARIATION",
		    "id": "#"+newValue.barcode+"variation",
		    "present_at_all_locations": true,
		    "item_variation_data": {
		      "item_id": "#"+newValue.barcode,
		      "name": "Regular",
		      "pricing_type": "FIXED_PRICING",
		      "price_money": {
		        "amount": Number(newValue.price) * 100,
		        "currency": "USD",
		      },
		      "sku": newValue.barcode,
		      "track_inventory": true
		    }
		};

		// Create a new item or reconfigure an existing item
		var item = {
		  type: 'ITEM',
		  id: '#' + newValue.barcode,
		  item_data: {
		    name: newValue.barcode,
		    description: newValue.description,
		    variations: [variation]
		  }
		};

		// Initialize request body.
		// Set a unique idempotency key for each request.
		const idempotencyKey = require('crypto').randomBytes(32).toString('hex');
		console.log(idempotencyKey);
		
		var body = {
		  idempotency_key: idempotencyKey,
		  batches: [{
		  	objects: [item]
		  }]
		};

		/*const variationKey = require('crypto').randomBytes(32).toString('hex');
	    	var variationBody = {
			  idempotency_key: variationKey,
			  object: variation
			};

	    	api.upsertCatalogObject(variationBody)
			  .then((response) => {
			    console.log("Variation response: " + JSON.stringify(response));*/

		// Upsert the catalog item
		api.batchUpsertCatalogObjects(body)
		  .then((response) => {
		  	console.log("First response: " + JSON.stringify(response));
		  	var res = response;
		  	var variationId = res.objects[0].item_data.variations[0].id;

		    locationApi.listLocations().then(function(data) {
			  console.log('API called successfully in locationApi. Returned data: ' + JSON.stringify(data));

			  	var dat = data;
			    var locationId = dat.locations[0].id; // String | The ID of the item's associated location.

				 // String | The ID of the variation to adjust inventory information for.

				//var body = new SquareConnect.V1AdjustInventoryRequest(); // V1AdjustInventoryRequest | An object containing the fields to POST for the request.  See the corresponding object definition for field details.

				var adjustBody = {
					quantity_delta: Number(newValue.quantity),
					adjustment_type: 'RECEIVE_STOCK'
				}

				inventoryApi.adjustInventory(locationId, variationId, adjustBody).then(function(data) {
				  console.log('API called successfully in inventoryApi. Returned data: ' + JSON.stringify(data));
				}, function(error) {
				  console.error(error);
				});
			}, function(error) {
			  console.error(error);
			});
		  });
		return null;
    });
