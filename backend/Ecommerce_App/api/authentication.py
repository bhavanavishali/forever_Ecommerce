from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from .models import CustomUser

class JWTCookieAuthentication(BaseAuthentication):

    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return None  # No token, proceed without authentication

        try:
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = CustomUser.objects.get(id=user_id)

            # Check if the user is blocked (inactive)
            if not user.is_active:
                raise AuthenticationFailed('User is blocked or inactive.')

            return (user, token)

        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('User not found.')
        except Exception:
            raise AuthenticationFailed('Invalid or expired access token.')

        return None
