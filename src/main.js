import { getWeatherInOulu } from "./weatherApi.js"
getWeatherInOulu()

const catalogSection = document.getElementById('catalog')
const contactSection = document.getElementById('contact')
contactSection.style.display = 'none'
catalogSection.style.display = 'grid'

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault()
        const target = link.getAttribute('href').substring(1)
        if (target === 'contact') {
            contactSection.style.display = 'block'
            catalogSection.style.display = 'none'
        } else if (target === 'catalog') {
            contactSection.style.display = 'none'
            catalogSection.style.display = 'grid'
        }
    })
})
// Tuotekatalogi
const productCollection = new Map()
const productList = document.querySelector('.product-list')
const itemCards = document.querySelectorAll('.card')

itemCards.forEach(card => {
    card.addEventListener('click', () => {
        const name = card.dataset.name
        const price = parseFloat(card.dataset.price)
        
        if (productCollection.has(name)) {
            productCollection.delete(name)
        } else {
            productCollection.set(name, price)
        }
        updateProductList()
    })
})

// Säilytä asetettu tarjous localStorageen
function saveOffer(key, offer) {
    localStorage.setItem(`offer_${key}`, offer)
}
// Lataa tarjous localStoragesta
function loadOffer(key) {
    const value = localStorage.getItem(`offer_${key}`)
    return value ? parseFloat(value) : null
}

// Tuotelista
function updateProductList() {
    productList.innerHTML = ''
    
    if (productCollection.size === 0) {
        const p = document.createElement('p')
        p.textContent = 'Kori on tyhjä. Lisää tavaraa luettelosta...'
        p.classList.add('empty-message')
        productList.append(p)
        return
    }

    const ul = document.createElement('ul')
    let inputs = []

    for (let [key, value] of productCollection) {
        const li = document.createElement('li')

        const span = document.createElement('span')
        span.textContent = `${key} - ${value.toFixed(2)} €`
        
        const input = document.createElement('input')
        input.type = 'number'
        input.min = value + 0.5;
        input.step = 0.05
        input.placeholder = `Tarjoa väh. ${value+0.5} €`

        const savedOffer = loadOffer(key)
        if (savedOffer) { input.value = savedOffer.toFixed(2) }
        
        input.addEventListener('input', () => updateTotal())
        input.addEventListener('change', async () => {
            let offer = parseFloat(input.value)
            if (isNaN(offer) || offer < value + 0.5) {
                alert(`Tarjous ei voi olla alle ${value+0.05} €`)
                input.value = value.toFixed(2)
            } else {
                console.log(`Tarjous tuotteelle ${key}: ${offer.toFixed(2)} €`)
                saveOffer(key, offer)
                updateTotal()
            }
        })

        const removeBtn = document.createElement('button')
        removeBtn.textContent = 'Poista'
        removeBtn.classList.add('remove-btn')
        removeBtn.addEventListener('click', () => {
            productCollection.delete(key)
            localStorage.removeItem(`offer_${key}`)
            updateProductList()
        })

        inputs.push({ key, basePrice: value, input})
        li.append(span, input, removeBtn)
        ul.appendChild(li)
    }

    productList.appendChild(ul)
    // Yhteishinta ja lähetä-nappi
    let totalDiv = document.getElementById('total-div')
    if (!totalDiv) {
        totalDiv = document.createElement('div')
        totalDiv.id = 'total-div'
        totalDiv.classList.add('total-section')
    } else {
        totalDiv.innerHTML = ''
    }

    
    const totalLabel = document.createElement('span')
    totalLabel.textContent = 'Yhteishinta: '
    
    const totalValue = document.createElement('strong')
    totalValue.id = 'total-price'
    totalValue.textContent = `0.00 €`

    totalDiv.append(totalLabel, totalValue)
    productList.append(totalDiv)
    
    const submitBtn = document.createElement('button')
    submitBtn.classList.add('submit-btn')
    submitBtn.textContent = 'Tee tarjous'
    submitBtn.addEventListener('click', () => {
        let feedback = document.getElementById('feedback-message')
        if (!feedback) {
            feedback = document.createElement('div')
            feedback.id = 'feedback-message'
            feedback.style.marginTop = '1rem'
            productList.appendChild(feedback)
        }
        const invalid = inputs.some(({ basePrice, input }) =>
            !input.value || parseFloat(input.value) <= basePrice)
        if (invalid) {
            feedback.textContent = 'Kaikille tuoteille ei ole kelpaavaa tarjousta'
            feedback.style.color = 'red'
            return
        }
        const offers = inputs.map(({ key, input }) => ({ tuote: key, tarjous: parseFloat(input.value)}))
        console.log('Tarjoukset valmiina lähetettäväksi: ', offers)

        feedback.textContent = 'Tarjoukset lähetetty onnistuneesti!'
        feedback.style.color = 'green'
    })
    productList.append(submitBtn)
    updateTotal()
    
    function updateTotal() {
        let total = 0
        inputs.forEach(({ basePrice, input }) => {
            const offer = parseFloat(input.value)
            if (!isNaN(offer) && offer > basePrice) {
                total += offer
            }
        })
        totalValue.textContent = `${total.toFixed(2)}`
    }
}

//Yhteydenotto
const form = document.getElementById('contactForm')
const messagesDiv =  document.getElementById('messages')

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    const messages = JSON.parse(localStorage.getItem('messages') || '[]')
    messages.push(data)
    localStorage.setItem('messages', JSON.stringify(messages))
    displayMessages()
    form.reset()        
})

function displayMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]')
    messagesDiv.innerHTML = messages.map(m =>
        `<p><strong>${m.name}l</strong> (${m.email}): ${m.message}</p>`).join('')
}