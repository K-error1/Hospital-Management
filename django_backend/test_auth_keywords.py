import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_system.settings')
django.setup()

from django.contrib.auth import authenticate

# Test 1: Using email keyword
user1 = authenticate(email='admin@medicare.co.ke', password='password123')
print(f"Test with email=: {user1}")

# Test 2: Using username keyword (which maps to email in our model)
user2 = authenticate(username='admin@medicare.co.ke', password='password123')
print(f"Test with username=: {user2}")
