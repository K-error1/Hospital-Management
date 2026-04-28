import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_system.settings')
django.setup()

from api.models import Doctor, Patient
print("DOCTORS:")
for d in Doctor.objects.all():
    print(d.email, d.name)
print("PATIENTS:")
for p in Patient.objects.all():
    print(p.email, p.name)
