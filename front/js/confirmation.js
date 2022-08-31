const idOrder=window.location.search.split("?order=").join("");
console.log(idOrder);

document.getElementById("orderId").innerText = idOrder;