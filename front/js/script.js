let productData = [];

const fetchProduct = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json)
        .then((promise)=> {
            productData = promise;
            console.log(productData);
        }
    );
};

const productDisplay = async () => {
    await fetchProduct();

    document.getElementById("Items").innerHTML = productData.map((product) => `
        <a href="./product.html?id=${product._id}">
            <article>
            <img src=".../${product.imageUrl}.jpg" alt="${product.altTxt}"/>
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
            </article>
        </a>
    `)
};

productDisplay ();