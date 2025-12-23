import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HDFCPayment.css';

const HDFCPayment = ({ orderId, amount, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get('/api/v1/payment/hdfc/config');
            setConfig(response.data.data);
        } catch (error) {
            console.error('Error fetching HDFC config:', error);
            setError('Failed to load payment configuration');
        }
    };

    const initiatePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            // Get user details
            const userResponse = await axios.get('/api/v1/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = userResponse.data.data;

            // Create payment order
            const orderResponse = await axios.post(
                '/api/v1/payment/hdfc/create-order',
                {
                    orderId: orderId,
                    amount: amount,
                    customerName: user.name,
                    customerEmail: user.email || '',
                    customerPhone: user.phone
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const { paymentUrl, paymentData, clientId } = orderResponse.data.data;

            // Create and submit payment form
            createPaymentForm(paymentUrl, paymentData, clientId);

        } catch (error) {
            console.error('Payment initiation error:', error);
            setError(error.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
            if (onFailure) {
                onFailure(error.response?.data?.message || 'Payment failed');
            }
        }
    };

    const createPaymentForm = (paymentUrl, paymentData, clientId) => {
        // Create form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentUrl;
        form.style.display = 'none';

        // Add form fields
        const fields = {
            merchantId: paymentData.merchantId,
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            customerName: paymentData.customerName,
            customerEmail: paymentData.customerEmail,
            customerPhone: paymentData.customerPhone,
            returnUrl: paymentData.returnUrl,
            cancelUrl: paymentData.cancelUrl,
            notifyUrl: paymentData.notifyUrl,
            hash: paymentData.hash,
            clientId: clientId
        };

        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        });

        // Append form to body and submit
        document.body.appendChild(form);
        form.submit();
    };

    if (!config) {
        return (
            <div className="hdfc-payment-container">
                <div className="loading-spinner">Loading payment gateway...</div>
            </div>
        );
    }

    return (
        <div className="hdfc-payment-container">
            {error && (
                <div className="payment-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                </div>
            )}

            <div className="payment-info">
                <div className="payment-amount">
                    <h3>Total Amount</h3>
                    <p className="amount">₹{amount?.toLocaleString()}</p>
                </div>

                <div className="payment-details">
                    <div className="detail-item">
                        <i className="fas fa-shield-alt"></i>
                        <span>Secure Payment by HDFC Bank</span>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-lock"></i>
                        <span>256-bit SSL Encryption</span>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-credit-card"></i>
                        <span>All Cards, UPI, Net Banking</span>
                    </div>
                </div>
            </div>

            <button
                onClick={initiatePayment}
                disabled={loading}
                className="hdfc-pay-button"
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <i className="fas fa-lock"></i>
                        Pay ₹{amount?.toLocaleString()}
                    </>
                )}
            </button>

            <div className="payment-footer">
                <p>
                    <i className="fas fa-info-circle"></i>
                    You will be redirected to HDFC SmartGateway to complete the payment
                </p>
            </div>
        </div>
    );
};

export default HDFCPayment;
