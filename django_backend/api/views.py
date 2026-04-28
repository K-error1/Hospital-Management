from rest_framework import viewsets
from .models import User, Patient, Doctor, Nurse, Appointment, Prescription, VitalSign, Department, BillingRecord
from .serializers import (
    UserSerializer, PatientSerializer, DoctorSerializer, NurseSerializer,
    AppointmentSerializer, PrescriptionSerializer, VitalSignSerializer,
    DepartmentSerializer, BillingRecordSerializer
)

def _create_user_for_role(instance, role, default_password='password123'):
    if not User.objects.filter(email=instance.email).exists():
        User.objects.create_user(
            id=instance.id,
            username=instance.email,
            email=instance.email,
            password=default_password,
            name=instance.name,
            role=role,
            phone=getattr(instance, 'phone', ''),
            department=getattr(instance, 'department', ''),
            specialization=getattr(instance, 'specialization', '')
        )

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        if 'password' in self.request.data:
            user.set_password(self.request.data['password'])
            user.save()

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        _create_user_for_role(instance, 'patient')

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        _create_user_for_role(instance, 'doctor')

class NurseViewSet(viewsets.ModelViewSet):
    queryset = Nurse.objects.all()
    serializer_class = NurseSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        _create_user_for_role(instance, 'nurse')

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class VitalSignViewSet(viewsets.ModelViewSet):
    queryset = VitalSign.objects.all()
    serializer_class = VitalSignSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class BillingRecordViewSet(viewsets.ModelViewSet):
    queryset = BillingRecord.objects.all()
    serializer_class = BillingRecordSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .mpesa import MPesaClient

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'detail': 'Email and password are required'}, status=400)
    
    user = authenticate(request, email=email, password=password)
    if user is not None:
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        return Response({'detail': 'Invalid credentials'}, status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_payment_view(request):
    phone_number = request.data.get('phone')
    amount = request.data.get('amount')
    reference = request.data.get('reference', 'Hospital Bill')
    desc = request.data.get('desc', 'Payment for Medical Services')

    if not phone_number or not amount:
        return Response({'detail': 'Phone number and amount are required'}, status=400)

    client = MPesaClient()
    response = client.initiate_stk_push(phone_number, amount, reference, desc)

    if response.get('ResponseCode') == '0':
        return Response(response)
    else:
        return Response(response, status=400)
