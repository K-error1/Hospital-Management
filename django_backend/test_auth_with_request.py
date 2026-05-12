import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_system.settings')
django.setup()

from django.contrib.auth import authenticate
from django.test import RequestFactory

factory = RequestFactory()
request = factory.post('/api/auth/login/')

# Test with request object
user = authenticate(request, email='admin@medicare.co.ke', password='password123')
print(f"Test with request and email=: {user}")
