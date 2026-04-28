from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50)
    avatar = models.CharField(max_length=255, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    must_change_password = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name', 'role']

class Patient(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    bloodGroup = models.CharField(max_length=10)
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    admissionDate = models.DateField()
    status = models.CharField(max_length=50)
    assignedDoctor = models.CharField(max_length=50)
    assignedNurse = models.CharField(max_length=50)
    room = models.CharField(max_length=50, null=True, blank=True)
    diagnosis = models.CharField(max_length=255, null=True, blank=True)

class Doctor(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    phone = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=50)
    patientsCount = models.IntegerField(default=0)
    experience = models.CharField(max_length=50)
    qualification = models.CharField(max_length=100)

class Nurse(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    shift = models.CharField(max_length=50)
    phone = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=50)
    assignedWard = models.CharField(max_length=100)
    patientsCount = models.IntegerField(default=0)

class Appointment(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    patientId = models.CharField(max_length=50)
    patientName = models.CharField(max_length=100)
    doctorId = models.CharField(max_length=50)
    doctorName = models.CharField(max_length=100)
    date = models.DateField()
    time = models.CharField(max_length=20)
    status = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    notes = models.TextField(null=True, blank=True)

class Prescription(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    patientId = models.CharField(max_length=50)
    patientName = models.CharField(max_length=100)
    doctorId = models.CharField(max_length=50)
    doctorName = models.CharField(max_length=100)
    date = models.DateField()
    medications = models.JSONField()
    diagnosis = models.CharField(max_length=255)
    notes = models.TextField(null=True, blank=True)

class VitalSign(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    patientId = models.CharField(max_length=50)
    patientName = models.CharField(max_length=100)
    nurseId = models.CharField(max_length=50)
    date = models.DateField()
    time = models.CharField(max_length=20)
    temperature = models.FloatField()
    bloodPressure = models.CharField(max_length=50)
    heartRate = models.IntegerField()
    oxygenLevel = models.IntegerField()
    weight = models.FloatField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

class Department(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    head = models.CharField(max_length=100)
    doctorsCount = models.IntegerField(default=0)
    nursesCount = models.IntegerField(default=0)
    bedsTotal = models.IntegerField(default=0)
    bedsOccupied = models.IntegerField(default=0)

class BillingRecord(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    patientId = models.CharField(max_length=50)
    patientName = models.CharField(max_length=100)
    date = models.DateField()
    items = models.JSONField()
    totalAmount = models.FloatField()
    status = models.CharField(max_length=50)
    insuranceCovered = models.FloatField(default=0)
    paidAmount = models.FloatField(default=0)
    payment_status = models.CharField(max_length=50, default='Unpaid')
    paymentMethod = models.CharField(max_length=50, null=True, blank=True)
    paymentRef = models.CharField(max_length=100, null=True, blank=True)

class AuditLog(models.Model):
    user = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    action = models.CharField(max_length=255)
    details = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} ({self.role}) - {self.action} at {self.timestamp}"
