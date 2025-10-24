export async function handler(event) {
  const API_KEY = process.env.WEATHER_API_KEY;
  const params = event.queryStringParameters;

  let url;
  if (params.q) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(params.q)}&appid=${API_KEY}&units=metric`;
  } else if (params.lat && params.lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${API_KEY}&units=metric`;
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing parameters" }) };
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
