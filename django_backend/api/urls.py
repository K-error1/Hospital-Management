from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    UserViewSet, PatientViewSet, DoctorViewSet, NurseViewSet,
    AppointmentViewSet, PrescriptionViewSet, VitalSignViewSet,
    DepartmentViewSet, BillingRecordViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'nurses', NurseViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'vitals', VitalSignViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'billing', BillingRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.login_view, name='login'),
    path('payment/mpesa/', views.mpesa_payment_view, name='mpesa_payment'),
]
