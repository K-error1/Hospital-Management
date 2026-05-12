import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_system.settings')
django.setup()

from api.models import Doctor, User
from api.views import _create_user_for_role

# Simulate Admin creating a doctor
email = 'test_doctor@medicare.co.ke'
if not User.objects.filter(email=email).exists():
    doc = Doctor.objects.create(
        id='test-doc-1',
        name='Test Doctor',
        email=email,
        specialization='General',
        department='General',
        phone='123456',
        status='Available'
    )
    _create_user_for_role(doc, 'doctor')
    print(f"Created doctor and user for {email}")
else:
    print(f"User {email} already exists")

from django.contrib.auth import authenticate
user = authenticate(email=email, password='password123')
print(f"Auth result for {email} with password123: {user}")
