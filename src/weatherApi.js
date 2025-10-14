export async function getWeatherInOulu() {
    const url = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&place=Oulu&maxlocations=1'
    const response = await fetch(url)
    const data = await response.text()

    const tempMatch = data.match(/<BsWfs:ParameterName>t2m<\/BsWfs:ParameterName>\s*<BsWfs:ParameterValue>(.*?)<\/BsWfs:ParameterValue>/)
    const temperature = tempMatch ? tempMatch[1] : '?'
    document.getElementById('weather').innerHTML = `<p>Oulussa lämpötila: ${temperature} &deg;C</p>`
}