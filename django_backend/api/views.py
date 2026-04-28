from rest_framework import viewsets
from .models import User, Patient, Doctor, Nurse, Appointment, Prescription, VitalSign, Department, BillingRecord, AuditLog
from .serializers import (
    UserSerializer, PatientSerializer, DoctorSerializer, NurseSerializer,
    AppointmentSerializer, PrescriptionSerializer, VitalSignSerializer,
    DepartmentSerializer, BillingRecordSerializer, AuditLogSerializer
)

def log_action(user_obj, action, details=""):
    if user_obj and hasattr(user_obj, 'is_authenticated') and user_obj.is_authenticated:
        AuditLog.objects.create(
            user=user_obj.email,
            role=getattr(user_obj, 'role', 'unknown'),
            action=action,
            details=details
        )
    else:
        AuditLog.objects.create(
            user="Anonymous/System",
            role="system",
            action=action,
            details=details
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
        log_action(self.request.user, f"Created User: {user.email}")

    def perform_update(self, serializer):
        user = serializer.save()
        log_action(self.request.user, f"Updated User: {user.email}")

    def perform_destroy(self, instance):
        log_action(self.request.user, f"Deleted User: {instance.email}")
        instance.delete()

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        _create_user_for_role(instance, 'patient')
        log_action(self.request.user, f"Registered Patient: {instance.name}")

    def perform_update(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, f"Updated Patient Info: {instance.name}")

    def perform_destroy(self, instance):
        log_action(self.request.user, f"Deleted Patient: {instance.name}")
        instance.delete()

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

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'patient':
            return BillingRecord.objects.filter(patientId=user.id)
        return BillingRecord.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, f"Generated Bill for {instance.patientName}", f"Amount: {instance.totalAmount}")

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer

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
        from django.contrib.auth import login as auth_login
        auth_login(request, user)
        log_action(user, "User Login Success")
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        log_action(None, f"Failed Login Attempt: {email}")
        return Response({'detail': 'Invalid credentials'}, status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
def change_password_view(request):
    email = request.data.get('email')
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not all([email, old_password, new_password, confirm_password]):
        return Response({'detail': 'Email and all password fields are required'}, status=400)

    user = authenticate(request, email=email, password=old_password)
    if user is None:
        return Response({'detail': 'Incorrect current password'}, status=400)

    if new_password != confirm_password:
        return Response({'detail': 'New passwords do not match'}, status=400)

    if new_password == old_password:
        return Response({'detail': 'New password must be different from current password'}, status=400)

    if len(new_password) < 8:
        return Response({'detail': 'Password must be at least 8 characters long'}, status=400)

    user.set_password(new_password)
    user.must_change_password = False
    user.save()
    log_action(user, "Password Changed Successfully")

    return Response({'detail': 'Password changed successfully'})

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

@api_view(['POST'])
@permission_classes([AllowAny])
def mock_payment_view(request):
    import time
    bill_id = request.data.get('billId')
    amount = float(request.data.get('amount', 0))
    phone = request.data.get('phone')

    if not bill_id or amount <= 0:
        return Response({'detail': 'Valid bill ID and amount are required'}, status=400)

    try:
        bill = BillingRecord.objects.get(id=bill_id)
        
        # Simulate STK Push delay
        time.sleep(2) 
        
        bill.paidAmount += amount
        bill.paymentMethod = 'mpesa'
        bill.paymentRef = f'MOCK-{int(time.time())}'
        
        balance = bill.totalAmount - bill.insuranceCovered - bill.paidAmount
        if balance <= 0:
            bill.status = 'Paid'
            bill.payment_status = 'Paid'
        elif bill.paidAmount > 0:
            bill.payment_status = 'Partial'
        else:
            bill.payment_status = 'Unpaid'
            
        bill.save()
        return Response({
            'detail': 'Payment processed successfully',
            'billId': bill.id,
            'newPaidAmount': bill.paidAmount,
            'paymentStatus': bill.payment_status,
            'reference': bill.paymentRef
        })
    except BillingRecord.DoesNotExist:
        return Response({'detail': 'Bill not found'}, status=404)
