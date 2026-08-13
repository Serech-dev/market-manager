from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
    )

    def validate(self, attrs):
        email = attrs["email"].lower().strip()
        password = attrs["password"]

        user = User.objects.filter(
            email__iexact=email
        ).first()

        if user is None:
            raise serializers.ValidationError(
                "Correo o contraseña incorrectos."
            )

        authenticated_user = authenticate(
            username=user.username,
            password=password,
        )

        if authenticated_user is None:
            raise serializers.ValidationError(
                "Correo o contraseña incorrectos."
            )

        if not authenticated_user.is_active:
            raise serializers.ValidationError(
                "Esta cuenta está desactivada."
            )

        attrs["user"] = authenticated_user

        return attrs