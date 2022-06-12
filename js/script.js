const addressForm = document.querySelector("#address-form")
const cepInput = document.querySelector("#cep")
const addressInput = document.querySelector("#address")
const cityInput = document.querySelector("#city")
const neighborhoodInput = document.querySelector("#neighborhood")
const regionInput = document.querySelector("#region")
const formInputs = document.querySelectorAll("[data-input]")

const closeButton = document.querySelector("#close-message");

const fadeElement = document.querySelector("#fade");

const list = [];

//Validate CEP INPUT 
cepInput.addEventListener('keypress', (e) => {

 //Regular Expression(Regex) 
    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    //console.log(e.keyCode)
    //console.log(key)

 //allow only numbers - (Regex) 
    if(!onlyNumbers.test(key)){
        e.preventDefault();
        return;
    }
});

//Get Address event
cepInput.addEventListener("keyup", (e)=>{
    const inputValue = e.target.value

    //Check if we have correct length
    if(inputValue.length === 8){
        getAddress(inputValue);
    }
});

//Get customer address from API
const getAddress = async (cep) => {
    toggleLoader();

    cepInput.blur(); //Remove, cursor selection from cepInput

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`

    const response = await fetch(apiUrl)

    const data = await response.json();

 //Show error and reset form
    if(data.erro === "true"){
        if(!addressInput.hasAttribute("disabled")){
            toggleDisabled();
        }

        addressForm.reset()
        toggleLoader()
        //Show message
         toggleMessage("CEP inválido, tente novamente")
         return;
    }
    else{
        list.push(data)
    } 

    if(addressInput.value === ""){
        toggleDisabled();
    }

    addressInput.value = data.logradouro
    cityInput.value = data.localidade
    neighborhoodInput.value = data.bairro
    regionInput.value = data.uf

    toggleLoader();
};

// Add or remove Disabled attribute from Form
const toggleDisabled = () => {
    if(regionInput.hasAttribute("disabled")){
        formInputs.forEach((input) => {
            input.removeAttribute("disabled")
        })
    }
    else{
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled");
        });
    }
}

//Show or Hide Loader
const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle('hide');
    loaderElement.classList.toggle("hide");
};

//Show or hide message
const toggleMessage = (msg) => {
    const messageElement = document.querySelector("#message");

    const messageElementText = document.querySelector("#message p ");

    messageElementText.innerText = msg;

    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
};

// Close message Modal
closeButton.addEventListener("click", () => toggleMessage());

// Save address
addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleLoader();

    setTimeout(() => {
        toggleLoader();

        toggleMessage("Endereço salvo com sucesso!")
        addressForm.reset()

        toggleDisabled();
       
        console.log(list)
    }, 1500)

})