from django.shortcuts import render
import datetime

# Create your views here.
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser, OTP
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate,login as auth_login 
from rest_framework.permissions import AllowAny
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import datetime

@csrf_exempt
@api_view(['POST'])

def register_user(request):
    print("Received form data:", request.data)
    data=request.data

    full_name=data.get("full_name")
    username=data.get("username")
    email=data.get("email")
    phone=data.get("phone_number")
    password=data.get("password")
    confirm_password=data.get("confirm_password")
    skills=data.get("skills")
    missing_fields = []
    if not full_name: missing_fields.append("full_name")
    if not username: missing_fields.append("username")
    if not email:missing_fields.append("email")
    if not phone:missing_fields.append("phone_number")
    if not password:missing_fields.append("password")
    if not confirm_password:missing_fields.append("confirm_password")
    if not isinstance(skills, list):
      missing_fields.append("skills")
    
    if missing_fields:
        return Response({"error":f"Missing or invalid fields:{','.join(missing_fields)}"},status=400)
    if password !=confirm_password:
        return Response({"error":"Password do not match"},status=400)
    
    if CustomUser.objects.filter(username=username).exists():
        return Response({"error":"username already exists."},status=400)
    
    if CustomUser.objects.filter(email=email).exists():
        return Response({"error":"email already registered."},status=400)
    
    if CustomUser.objects.filter(phone_number=phone).exists():
        return Response({"error":"Phone number already registered."},status=400)

    
    user=CustomUser.objects.create(
        full_name=full_name,
        username=username,
        email=email,
        phone_number=phone,
        skills=skills,
        password=make_password(password),
        is_active=False,
    )

    otp_code=get_random_string(length=6,allowed_chars="0123456789")
    OTP.objects.create(user=user,code=otp_code)

    try:
        send_mail(
            "Your OTP Code",
            f"Hello {user.full_name},your OTP code is:{otp_code}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
    except Exception as e:
        return Response({'error':f"Failed to send OTP:{str(e)}"},status=500) 
    return Response({
        "message":"Registeration successful. OTP sent to your email.",
        "user_id":user.id
    },status=201)   

@csrf_exempt 
@api_view (['POST'])
@permission_classes([AllowAny])
@authentication_classes([]) 
def verify_otp(request):
    user_id=request.data.get("user_id")
    otp_code=request.data.get("otp_code")

    if not user_id or not otp_code:
        return Response({"error":"user_id and otp_code are required "},status=400)
    
    try:
        otp=OTP.objects.get(user_id=user_id,code=otp_code,is_verified=False)
        otp.is_verified=True
        otp.save()

        user=CustomUser.objects.get(id=user_id)
        user.is_active=True
        user.is_verified=True
        user.save()

        return Response({"message":"OTP verified successfully."},status=200)
    except OTP.DoesNotExist:
        return Response({"error":"Invalid or already used OTP."},status=400)
    except CustomUser.DoesNotExist:
        return Response({"error":"User does not exist."},status=404)
    
@api_view(['POST'])
def login_user(request):
    username=request.data.get('username')
    password=request.data.get('password')

    if not username or not password:
        return Response({"error":'username and password are required.'},status=status.HTTP_400_BAD_REQUEST)
    user=authenticate(request,username=username,password=password)

    if user is not None:
        if not user.is_active:
            return Response({'error':'user is not verified.Please verify OTP first.'},status=status.HTTP_403_FORBIDDEN)
        auth_login(request,user)

        refresh=RefreshToken.for_user(user)
        access=str(refresh.access_token)

        access_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        refresh_expiry = datetime.datetime.utcnow() + datetime.timedelta(days=7)
        
        response = Response({
            'message':'Login successful!',
            'username':user.username,
            'user_id':user.id
        },status=status.HTTP_200_OK)
    
    
        response.set_cookie(
            key='access_token',
            value=access,
            httponly=True,
            secure=True,
            samesite='Strict',
            expires=access_expiry
        )        
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite='Strict',
            expires=refresh_expiry
        )
        
        return response
    
    else:
        return Response({'error':'Invalid credentials.'},status=status.HTTP_401_UNAUTHORIZED)
   
   
    
# views.py
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .models import CustomUser   # adjust if you named it differently

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        try:
            # Verify token with Google
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
            
            email = idinfo.get("email")
            name = idinfo.get("name", email.split('@')[0])
            picture = idinfo.get("picture")

            user, created = CustomUser.objects.get_or_create(email=email, defaults={
                "username": name,
                "is_active": True,
            })

            if created:
                user.is_verified = True
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Google login successful!",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "user_id": user.id,
                "picture": picture,
            })
        except Exception as e:
            return Response({"error": str(e)}, status=400)
