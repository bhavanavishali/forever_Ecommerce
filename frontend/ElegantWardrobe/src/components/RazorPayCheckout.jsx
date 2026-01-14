import api from '@/api'
import React from 'react'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const RazorpayCheckout = ({ amount, name, email, phone }) => {
  const handlePayment = async () => {
    const res = await loadRazorpayScript()
    if (!res) {
      alert('Razorpay SDK failed to load.')
      return
    }

    try {
      const response = await api.post('create_order/', { amount })
      const data = response.data
      console.log(response)

      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: 'INR',
        name: 'My Shop',
        description: 'Purchase Payment',
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/verify_payment/', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            })
            alert(verifyRes.data.status)
          } catch (err) {
            console.error('Payment verification failed', err)
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: name || 'Customer Name',
          email: email || 'customer@example.com',
          contact: phone || '9999999999',
        },
        theme: {
          color: '#0d6efd',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Order creation failed:', err)
      alert('Unable to start payment')
    }
  }

  return (
    <button onClick={handlePayment} style={{ padding: '10px 20px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '5px' }}>
      Pay ₹{amount}
    </button>
  )
}

export default RazorpayCheckout
