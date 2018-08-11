//If successful, Square Point of Sale returns the following parameters.
const clientTransactionId = "client_transaction_id";
const transactionId = "transaction_id";

//If there's an error, Square Point of Sale returns the following parameters.
const errorField = "error_code";

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
    resultString += "Transaction ID: " + transactionInfo[transactionId] + "<br>";
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
    resultString += "Client Transaction ID: " + transactionInfo[clientTransactionId] + "<br>";
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

window.onload = function() {
	printResponse();
}