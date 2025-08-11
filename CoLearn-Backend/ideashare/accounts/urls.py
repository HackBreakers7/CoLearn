from django.urls import path
from .views import register_user,verify_otp,login_user

urlpatterns=[
    path('register/',register_user,name='register_user'),
    path('verify-otp/',verify_otp,name='verify_otp'),
    path('login/',login_user,name='login_user'),
]