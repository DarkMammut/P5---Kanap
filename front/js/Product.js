const product=window.location.search.split("?").join("");
console.log(product)

let productData = [];

const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${product}`)
        .then((res) => res.json())
        .then((promise)=> {
            productData = promise;
            console.log(productData);
        }
    );
};
const productDisplay = async () => {
    await fetchProduct();
}

fetchProduct();
