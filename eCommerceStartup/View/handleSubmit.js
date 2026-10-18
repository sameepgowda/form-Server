import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";

const form = document.getElementById("productForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("skunk");

    const product = event.target.productName.value;

    const res = {
        productName: product
    };

    try {
        const response = await axios.post(
            "http://localhost:3000/products",
            res
        );

        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
});