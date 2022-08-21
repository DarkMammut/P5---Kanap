const idProduct=window.location.search.split("?id=").join("");
console.log(idProduct)

let product = [];

const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${idProduct}`)
        .then((res) => res.json())
        .then((promise)=> {
            product = promise;
            console.log(product);

        }
    );
};

async function ProductDisplay() {
    await fetchProduct();

    let image = `<img src="${product.imageUrl}" alt="${product.altTxt}"/>`;
    console.log(image);

    document.getElementsByClassName('item__img')[0].innerHTML = image;

}

ProductDisplay();

