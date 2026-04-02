import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { paymentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiX, FiLock, FiCreditCard } from 'react-icons/fi'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      color: '#1E293B',
      '::placeholder': { color: '#94A3B8' }
    },
    invalid: { color: '#DC2626' }
  }
}

function CheckoutForm({ course, onSuccess, onClose }) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [cardError, setCardError] = useState('')

  const handlePay = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    setCardError('')

    try {
      // Step 1: Create PaymentIntent on backend
      const { data } = await paymentAPI.createIntent({
        courseId: course.id,
        userId: user.id
      })

      // Step 2: Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user.name, email: user.email }
        }
      })

      if (result.error) {
        setCardError(result.error.message)
        setLoading(false)
        return
      }

      if (result.paymentIntent.status === 'succeeded') {
        // Step 3: Confirm with backend → save order
        await paymentAPI.confirmPayment({
          paymentIntentId: result.paymentIntent.id,
          courseId: course.id,
          userId: user.id
        })
        toast.success('🎉 Course purchased successfully!')
        onSuccess()
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment failed. Please try again.'
      setCardError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Course summary */}
      <div style={{
        background: '#E6F1FB', borderRadius: 10, padding: '14px 16px',
        marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 13, color: '#475569' }}>Purchasing</div>
          <div style={{ fontWeight: 700, color: '#042C53', fontSize: 15 }}>{course.title}</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>by {course.instructor}</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#185FA5' }}>
          ₹{course.price?.toLocaleString()}
        </div>
      </div>

      {/* Test card notice */}
      <div className="alert alert-info" style={{ fontSize: 12 }}>
        <strong>Test mode:</strong> Use card 4242 4242 4242 4242 · Any future date · Any CVC
      </div>

      {/* Card element */}
      <div style={{ marginBottom: 16 }}>
        <label className="form-label"><FiCreditCard size={13} style={{ marginRight: 5 }} />Card Details</label>
        <div style={{
          border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '12px 14px',
          background: 'white', transition: 'border-color 0.2s'
        }}>
          <CardElement options={CARD_STYLE} />
        </div>
      </div>

      {cardError && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>{cardError}</div>
      )}

      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        className="btn btn-primary"
        style={{ width: '100%', padding: '13px', fontSize: 15 }}
      >
        {loading ? (
          <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing…</>
        ) : (
          <><FiLock size={15} /> Pay ₹{course.price?.toLocaleString()}</>
        )}
      </button>

      <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#94A3B8' }}>
        🔒 Secured by Stripe · Your card details are encrypted
      </div>
    </div>
  )
}

export default function CheckoutModal({ course, onClose, onSuccess }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">Complete Purchase</span>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <Elements stripe={stripePromise}>
            <CheckoutForm course={course} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        </div>
      </div>
    </div>
  )
}
