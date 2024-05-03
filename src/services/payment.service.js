export const paymentIntent = () => {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      amount: 1000,
      currency: 'USD',
      description: 'AG-2024-001'
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch('http://localhost:3000/api/v1/payments', requestOptions)
      .then((response) => resolve(response.json()))
      .catch((error) => reject(error))
  })
}
