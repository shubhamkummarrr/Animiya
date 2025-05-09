from rest_framework import serializers
from .models import *
from django.conf import settings


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField( style={'input_type':'password'} ,write_only=True)
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'password2', 'tc']
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match")
        
        if data['tc'] != True:
            raise serializers.ValidationError("You must accept the terms and conditions")
        return data
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'email']
        

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        style={'input_type': 'password'}, write_only=True
    )
    new_password = serializers.CharField(
        style={'input_type': 'password'}, write_only=True
    )

    def validate_old_password(self, value):
        """Validate that the old password is correct."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect')
        return value

    def validate(self, data):
        """Ensure the new password is different from the old one."""
        if data['new_password'] == data['old_password']:
            raise serializers.ValidationError(
                {'new_password': 'New password cannot be the same as the old password'}
            )
        return data

    def save(self, **kwargs):
        """Update the user's password."""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'bio', 'profile_photo']
        extra_kwargs = {
            'name': {'required': False, 'default': 'Your name'},
            'bio': {'required': False, 'default': 'No bio provided'},
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Profile Photo - Default image if not uploaded
        if instance.profile_photo:
            request = self.context.get('request')
            representation['profile_photo'] = request.build_absolute_uri(instance.profile_photo.url)
        else:
            representation['profile_photo'] = 'https://i.ibb.co/6RJ5hq3/anime-avatar.png'  # Put your CDN/static image path here

        return representation


class HomeOpinionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeOpinion
        fields = ['id','anime_name', 'char_name', 'char_img_url','opinion', 'agree', 'disagree']

class ImgDataBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImgDataBase
        fields = ['id','anime_name', 'char_name', 'char_img_url','opinion', 'agree', 'disagree']
        
        
    
