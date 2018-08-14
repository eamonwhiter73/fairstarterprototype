window.onload = function() {
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

	const settings = {timestampsInSnapshots: true};
  	db.settings(settings);

	printResponse();

	//get the data URL and encode in JSON
	function getTransactionInfo(URL) {
		var params = new URLSearchParams(document.location.search.substring(1));
		var data = params.get("sku"); // is the string "Jonathan"
		document.getElementById('url').innerHTML = data;
		return data;
	}

	// Makes a result string for success situation
	function handleSuccess(sku){
		var quantity = 0;
		var resultString = "";
		if(sku != null) {
			resultString = sku;

			//alert(transactionInfo[transactionId]);
		  	// Add a new document in collection "cities"
			db.collection("items").where("barcode", "==", sku)
			    .get()
			    .then(function(querySnapshot) {
			        querySnapshot.forEach(function(doc) {
			            // doc.data() is never undefined for query doc snapshots
			            console.log(doc.id, " => ", doc.data());
			            quantity = doc.data().quantity;

			            // Add a new document in collection "cities"
						db.collection("items").where('barcode', '==', sku)
							.update({
						    	quantity: Number(quantity) - 1
							})
							.then(function() {
							   	resultString = "SUCCESS";
							})
							.catch(function(error) {
							    resultString = "Error writing document: " + error;
							});

			        });
			    })
			    .catch(function(error) {
			        resultString = "Error getting documents: ", error;
			    });
		}
		else {
			resultString = "SKU IS NULL";
		}

		document.getElementById('url').innerHTML = resultString;
	}


	// Makes an error string for error situation
	function handleError(){
		document.getElementById('url').innerHTML = "ERROR - WILL I EVER SEE THIS?";
	}

	// Determines whether error or success based on urlParams, then prints the string
	function printResponse() {
	  var responseUrl = window.location.href;
	  var skunumber = getTransactionInfo(responseUrl);

	  if (skunumber != null) {
	   	handleSuccess(skunumber);
	  } else {
	  	handleError();
	  }
	}
};

