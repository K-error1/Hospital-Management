import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_system.settings')
django.setup()

from django.contrib.auth import authenticate
from django.test import RequestFactory

factory = RequestFactory()
request = factory.post('/api/auth/login/')

user = authenticate(request, email='otieno@medicare.co.ke', password='demo123')
if user:
    print(f"Auth Success! User: {user.email}")
else:
    print("Auth Failed! Trying password123...")
    user2 = authenticate(request, email='otieno@medicare.co.ke', password='password123')
    if user2:
        print("Success with password123")
    else:
        print("Failed both")
