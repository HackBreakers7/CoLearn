from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone 
from datetime import timedelta 

class CustomUser(AbstractUser):
    full_name=models.CharField(max_length=255)
    phone_number=models.CharField(max_length=15,unique=True)
    skills=models.TextField()
    is_verified=models.BooleanField(default=False)

    REQUIRED_FIELDS = ['email', 'phone_number', 'full_name']
# Create your models here.
class OTP(models.Model):
    user=models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    code=models.CharField(max_length=6)
    created_at=models.DateTimeField(auto_now_add=True)
    is_verified=models.BooleanField(default=False)
    
    def is_expired(self):
        return timezone.now() > self.created_at +timedelta(minutes=1)