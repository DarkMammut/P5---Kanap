const idOrder=window.location.search.split("?order=").join(""); //get orderID from URL

document.getElementById("orderId").innerText = idOrder; //add URL in HTML