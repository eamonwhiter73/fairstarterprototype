$(document).ready(function() {
    //If successful, Square Point of Sale returns the following parameters.
	const clientTransactionId = "client_transaction_id";
	const transactionId = "transaction_id";

	//If there's an error, Square Point of Sale returns the following parameters.
	const errorField = "error_code";

	var config = {
	        apiKey: "AIzaSyB48MIAoHmA1ZhKwN9LV54EG-CoUEykFhc",
	        authDomain: "fairstarterprototype.firebaseapp.com",
	        databaseURL: "https://fairstarterprototype.firebaseio.com",
	        projectId: "fairstarterprototype",
	        storageBucket: "fairstarterprototype.appspot.com",
	        messagingSenderId: "736108062496"
	    };

	firebase.initializeApp(config);

	var db = firebase.firestore();

	printResponse();

	//get the data URL and encode in JSON
	function getTransactionInfo(URL) {
		var params = new URLSearchParams(document.location.search.substring(1));
		var data = decodeURI(params.get("data")); // is the string "Jonathan"

		//alert("data: " + data);
		var transactionInfo = JSON.parse(data);
		return transactionInfo;
	}

	// Makes a result string for success situation
	function handleSuccess(transactionInfo){
	  var resultString ="";

	  if (clientTransactionId in transactionInfo) {
	    resultString += "Client Transaction ID: " + transactionInfo[clientTransactionId] + "<br>";
	  }

	  if (transactionId in transactionInfo) {
	  	//alert(transactionInfo[transactionId]);
	    
	    //resultString += "Transaction Info: " + transactionInfo[transactionId] + "<br>";

	    //DO THIS FROM SERVER, MAKE CALL FROM HERE TO SERVER
	    var params = {id:transactionInfo[transactionId]};

	    var url = new URL("https://fairstarter.eamondev.com/transactionlookup.php");

		url.search = new URLSearchParams(params);

		fetch(url, {
			method: 'GET',
			headers: {
			    Accept: 'application/json',
			}
		}).then(response => {
		  if (response.ok) {
		    response.json().then(json => {
		        alert(json.data);

		    	var quant = 0;
		    	var itemsRef = db.collection('items');
				var query = itemsRef.where('barcode', '==', String(json.data)).get()
				    .then(snapshot => {

				      snapshot.forEach(doc => {
				        quant = Number(doc.data().quantity);
				        
				        var newVal = Number(quant) - 1;
				    	
				    	itemsRef.doc(doc.id).update({
						    quantity: newVal
						})
						.then(function() {
						    alert("Quantity successfully updated!");
						})
						.catch(function(error) {
						    alert("Error writing document: ", error);
						});
				      })
				    })
				    /*.then((val) => {
				      	
				    })*/
				    .catch(err => {
				      alert('Error getting documents ' + JSON.stringify(err));
				    });
		    });
		  }
		  else {
		  	alert("Response is not ok.");
		  }
		})
		.catch(error=> {
			alert("Error: " + error);
		});

	    /*fetch(url)
	    	.then(data => data.json())
	    	.then(res=>{
	    		if (!res.ok) {
		            alert(response.statusText);
		        }
        		
        		alert("Response: " + res.text());
        	})
	    	.catch(error=>{alert("Error: " + error)});

	    /*$.ajax({
	    	 url: "https://connect.squareup.com/v2/locations/JN6S37JH6M1Z2/transactions/" + transactionInfo[transactionId],
	         type: "GET",
	         headers: { "Authorization": "Bearer sq0atp-on5KcHDr0dhlbefU0EwVwg" },
	         success: function(response) {
		    	alert("transaction looked up");
		        resultString += "Response: " + response + "<br>";
		     },
		     error: function (error) {
        		alert(JSON.stringify(error));
        	 }
	    });*/

	    /*$.get("https://connect.squareup.com/v2/locations/JN6S37JH6M1Z2/transactions/" + transactionInfo[transactionId], function(data, status){
	    	alert("transaction looked up");
	        resultString += "Data: " + data + "\nStatus: " + status + "<br>";
	    })*/

	    // Add a new document in collection "cities"
		/*db.collection("items").doc("LA").set({
		    name: "Los Angeles",
		    state: "CA",
		    country: "USA"
		})
		.then(function() {
		    console.log("Document successfully written!");
		})
		.catch(function(error) {
		    console.error("Error writing document: ", error);
		});*/
	  }
	  else {
	    resultString += "Transaction ID: NO CARD USED<br>";
	  }
	  return resultString;
	}


	// Makes an error string for error situation
	function handleError(transactionInfo){
	  var resultString ="";

	  if (errorField in transactionInfo) {
	    resultString += "Error: " + JSON.stringify(transactionInfo[errorField])+ "<br>";
	  }
	  if (transactionId in transactionInfo) {
	    resultString += "Transaction ID: " + transactionInfo[transactionId] + "<br>";
	  }
	   else {
	    resultString += "Transaction ID: PROCESSED OFFLINE OR NO CARD USED<br>";
	  }
	  return resultString;
	}

	// Determines whether error or success based on urlParams, then prints the string
	function printResponse() {
	  var responseUrl = window.location.href;
	  var transactionInfo = getTransactionInfo(responseUrl);
	  var resultString = "IN PRINT RESPONSE";

	  if (errorField in transactionInfo) {
	    resultString = handleError(transactionInfo);
	  } else {
	    resultString = handleSuccess(transactionInfo);
	  }

	  document.getElementById('url').innerHTML = resultString;
	}
});