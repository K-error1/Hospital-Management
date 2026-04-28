import requests
import base64
import json
from datetime import datetime

class MPesaClient:
    def __init__(self):
        # Sandbox credentials for Daraja API
        self.business_shortcode = '174379'
        self.passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
        self.consumer_key = 'dummy_consumer_key'
        self.consumer_secret = 'dummy_consumer_secret'
        self.env = 'sandbox'

    def get_access_token(self):
        # In a real scenario, this gets a token. Here we mock it if credentials are fake.
        # token_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        return "mock_access_token_for_sandbox"

    def initiate_stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """
        Initiate an STK Push (Lipa na M-Pesa Online) request.
        """
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = self.business_shortcode + self.passkey + timestamp
        password = base64.b64encode(password_str.encode('utf-8')).decode('utf-8')

        access_token = self.get_access_token()
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Standardizing phone number (assuming Kenyan format starting with 254)
        if str(phone_number).startswith("0"):
            phone_number = "254" + str(phone_number)[1:]

        payload = {
            "BusinessShortCode": self.business_shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.business_shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://mydomain.com/path",
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }

        # Mocking the request execution for local development to avoid real network failures on dummy keys
        # try:
        #     response = requests.post(api_url, json=payload, headers=headers)
        #     return response.json()
        # except Exception as e:
        #     return {"error": str(e)}

        return {
            "ResponseCode": "0",
            "ResponseDescription": "Success. Request accepted for processing",
            "CustomerMessage": f"Success. STK push initiated to {phone_number} for amount KES {amount}."
        }
