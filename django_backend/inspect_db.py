import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_system.settings')
django.setup()

from api.models import User, Doctor, Patient, Nurse

print("--- USERS ---")
for u in User.objects.all():
    print(f"Email: {u.email}, Role: {u.role}, Has Password: {u.has_usable_password()}, Is Active: {u.is_active}")

print("\n--- DOCTORS ---")
for d in Doctor.objects.all():
    print(f"Email: {d.email}, Name: {d.name}")

print("\n--- PATIENTS ---")
for p in Patient.objects.all():
    print(f"Email: {p.email}, Name: {p.name}")

print("\n--- NURSES ---")
for n in Nurse.objects.all():
    print(f"Email: {n.email}, Name: {n.name}")
