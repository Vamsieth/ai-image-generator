import { process } from "./env.js"; //this is it :)


const apiKey = process.env.HF_API_KEY;

const generate = document.getElementById("generate");
const userInput = document.getElementById("user-prompt");


const maxImages = 4;
let selectedImageNumber = null;

function getRandomNumber(min,max){

    return Math.floor(Math.random() * (max - min +1)) + min;
}

userInput.addEventListener("keypress", e =>{
    if(e.key == 'Enter'){
        e.preventDefault();
        generateImages(userInput.value);

    }
})


function disableGenerateButton() {
    generate.disabled = true;
}


function enableGenerateButton() {
    generate.disabled = false;
}


function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        
        const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; 
}

generate.addEventListener('click', () => {
    const input = userInput.value;
    generateImages(input);

});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;

    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}




