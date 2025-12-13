// Simple test to verify NBU API integration
import fetch from 'node-fetch';

async function testNBUAPI() {
  const testDate = '20241201'; // December 1, 2024
  const currency = 'USD';

  const url = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${testDate}&json`;

  console.log(`Testing NBU API for ${currency} on ${testDate}...`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('\n✅ API Response:');
    console.log(JSON.stringify(data, null, 2));

    if (data && data.length > 0) {
      console.log(`\n✅ Exchange rate: 1 ${data[0].cc} = ${data[0].rate} UAH`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testNBUAPI();

