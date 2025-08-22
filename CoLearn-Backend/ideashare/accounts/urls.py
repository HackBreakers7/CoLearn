from django.urls import path, include
from .views import register_user,verify_otp,login_user
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

urlpatterns=[
    path('register/',register_user,name='register_user'),
    path('verify-otp/',verify_otp,name='verify_otp'),
    path('login/',login_user,name='login_user'),
    
    # for google login
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),  # for Google OAuth
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
]