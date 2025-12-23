import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './PaymentCallback.css';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Processing your payment...');
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        handlePaymentCallback();
    }, []);

    const handlePaymentCallback = async () => {
        try {
            // Get payment response from URL parameters
            const paymentData = {
                orderId: searchParams.get('orderId'),
                amount: searchParams.get('amount'),
                status: searchParams.get('status'),
                transactionId: searchParams.get('transactionId'),
                hash: searchParams.get('hash'),
                paymentMode: searchParams.get('paymentMode'),
                bankRefNo: searchParams.get('bankRefNo'),
                responseMessage: searchParams.get('responseMessage')
            };

            // Send to backend for verification
            const response = await axios.post('/api/v1/payment/hdfc/callback', paymentData);

            if (response.data.success) {
                setStatus('success');
                setMessage('Payment successful!');
                setOrderDetails(response.data.data);

                // Redirect to success page after 3 seconds
                setTimeout(() => {
                    navigate(`/order-success/${paymentData.orderId}`);
                }, 3000);
            } else {
                setStatus('failed');
                setMessage(response.data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment callback error:', error);
            setStatus('failed');
            setMessage(error.response?.data?.message || 'Payment verification failed');
        }
    };

    return (
        <div className="payment-callback-container">
            <div className="payment-callback-card">
                {status === 'processing' && (
                    <div className="payment-status processing">
                        <div className="spinner-large"></div>
                        <h2>Processing Payment</h2>
                        <p>{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="payment-status success">
                        <div className="success-icon">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h2>Payment Successful!</h2>
                        <p>{message}</p>
                        {orderDetails && (
                            <div className="order-details">
                                <div className="detail-row">
                                    <span>Order ID:</span>
                                    <strong>{orderDetails.orderId}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Transaction ID:</span>
                                    <strong>{orderDetails.transactionId}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Amount Paid:</span>
                                    <strong>₹{orderDetails.amount?.toLocaleString()}</strong>
                                </div>
                            </div>
                        )}
                        <p className="redirect-message">
                            Redirecting to order details...
                        </p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="payment-status failed">
                        <div className="failed-icon">
                            <i className="fas fa-times-circle"></i>
                        </div>
                        <h2>Payment Failed</h2>
                        <p>{message}</p>
                        <div className="action-buttons">
                            <button
                                onClick={() => navigate('/cart')}
                                className="btn btn-primary"
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="btn btn-secondary"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;
