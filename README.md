# Huutokauppa SPA

Tässä projektissa toteutetaan **SPA (Single Page Application)** -tyyppinen sovellus, jossa käyttäjä voi valita tuoteitta ja tehdä niistä hintatarjouksia.

## Toiminnot

- Käyttäjä voi valita yhden tai useamman tuotteen.
    - Sama tuote voi valita vain kerran.
- Jokaiselle tuotteelle annetaan **tarjoushinta**, joka täytyy olla suurempi kuin nykyinen korkein tarjous.
- Tarjoukset tallentuvat **LocalStorageen**, jotta käyttäjän tekemät valinnat ja hinnat säilyvät sivun päivityksen jälkeen.
- Käyttäjä voi poistaa tuotteita valintalistalta.
- Kun lähettäjä lähettää tarjouksen, kaikkien valittujen tuotteiden yhteishinta lasketaan ja lähetetään viestinä sivuston ylläpitäjälle.

## Yhteydenotto

Sivustolla on myös näkymä **yhteydenottolomake**, jonka kautta käyttäjä voi ottaa yhteyttä esimerkiksi tarjoakseen omia tuotteitaan myyntiin.

## Käytetyt teknologiat

**HTML5**, **CSS**, **JS**, **LocalStorage**

## Kehitysideoita

- Backend-integraatio tarjousten tallentamiseen tietokantaan
- Käyttäjäkohtainen kirjautuminen ja näiden historia hallinnointi
