from django.urls import path, include
from .views import register_user, verify_otp, login_user
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter


# Google OAuth login class (REST API endpoint)
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter


urlpatterns = [
    # ==========================
    # Custom authentication endpoints (no serializers)
    # ==========================
    path('register/', register_user, name='register_user'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('login/', login_user, name='login_user'),

    # ==========================
    # dj-rest-auth + allauth built-in endpoints
    # ==========================
    path('auth/', include('dj_rest_auth.urls')),  # Login, Logout, Password reset
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # Registration
    path('accounts/', include('allauth.urls')),  # Required for social auth

    # ==========================
    # Google OAuth2 login
    # ==========================
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),  # API login
    path('accounts/', include('allauth.socialaccount.urls')),
]
