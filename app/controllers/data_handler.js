const fs = require("fs");
const Product = require("./product");
const productsArray = JSON.parse(fs.readFileSync("./app/data/products.json"));

function getProducts() {
    return productsArray;
}

function getProductById(uuid) {
    const product = productsArray.find(element => element.uuid === uuid);
    return product != null ? product : {};
}

// Puede recibir stringsJson u objetos
function createProduct(product) {
    if (typeof (product) == "string")
        productsArray.push(Product.createFromJson(product));
    else if (typeof (product) == "object")
        productsArray.push(Product.createFromObject(product))
    fs.writeFileSync("./app/data/products.json", JSON.stringify(getProducts(), null, 4))
}

function updateProduct(uuid, updatedProduct) {
    const index = productsArray.findIndex(element => element.uuid === uuid);
    if (index !== -1) {
        Object.assign(productsArray[index], updatedProduct);
        fs.writeFileSync("./app/data/products.json", JSON.stringify(getProducts(), null, 4))
        return true;
    }
    return false;
}

function deleteProduct(uuid) {
    const index = productsArray.findIndex(element => element.uuid === uuid)
    if (index != -1) {
        productsArray.splice(index, 1);
        fs.writeFileSync("./app/data/products.json", JSON.stringify(getProducts(), null, 4))
        return true;
    }
    return false;
}

function findProduct(query) {
    // Busqueda por nombre
    if (!query.includes(":"))
        return productsArray.filter(element => element.getTitle === query.trim());

    const queryParts = query.split(":");
    const category = queryParts[0].trim();
    const title = queryParts[1].trim();

    if (category && title) {
        return productsArray.filter(
            element => element.getCategory === category && element.getTitle === title
        );
    }
    else if (category)
        return productsArray.filter(element => element.getCategory === category);
    else
        return [];
}

function productListToHtml() {
    const htmlArray = productsArray.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card w-100 h-100 w-5000 h-100">
                <img class="card-img-top img_product"
                     src="${product.getImageURL}"
                     alt="${product.getTitle}">
                <div class="card-body">
                    <h4 class="card-title">${product.getTitle}</h4>
                    <p class="card-text">${product.getDescription} <br> Insertado con dom</p>
                </div>
            </div>
        </div>`
    );

    const dom = document.getElementById("dom");
    dom.innerHTML = htmlArray.join("");
}

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.findProduct = findProduct;