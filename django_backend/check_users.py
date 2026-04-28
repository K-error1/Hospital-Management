import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_system.settings')
django.setup()

from api.models import Doctor, Patient, User
from api.views import _create_user_for_role

pat = Patient.objects.get(email='chridpin001@gmail.com')
try:
    _create_user_for_role(pat, 'patient')
    print("Patient User created successfully")
except Exception as e:
    import traceback
    traceback.print_exc()

print("All Users in DB now:")
for u in User.objects.all():
    print(u.email, getattr(u, 'role', ''))
