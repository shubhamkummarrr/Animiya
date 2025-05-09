from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self, email, name, tc, password2=None, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            tc=tc,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name,tc, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            tc=tc,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=255)
    tc = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField( auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "tc"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
    

def user_profile_photo_path(instance, filename):
    return f'profile_photos/{instance.user.id}/{filename}'

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")

    name = models.CharField(max_length=255, default="Your Name")  # Default name
    bio = models.TextField(blank=True, null=True, default="No bio provided")  # Default bio

    profile_photo = models.ImageField(
        upload_to=user_profile_photo_path,
        blank=True,
        null=True
    )  # Default image will be handled in serializer/view, not here

    def __str__(self):
        return self.user.email



class HomeOpinion(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="home_opinions")
    anime_name = models.CharField(max_length=255)
    char_name = models.CharField(max_length=255)
    char_img_url = models.URLField()
    opinion = models.TextField()
    agree = models.IntegerField(default=0)
    disagree = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f" {self.user.email} on {self.created_at}"
            

class ImgDataBase(models.Model):
    char_img_url = models.URLField()
    char_name = models.CharField(max_length=255)
    anime_name = models.CharField(max_length=255)
    opinion = models.TextField()
    agree = models.IntegerField(default=0)
    disagree = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"anime {self.anime_name} char {self.char_name}"
    
    
class ImgVote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    opinion = models.ForeignKey(ImgDataBase, on_delete=models.CASCADE)
    vote = models.CharField(max_length=10, choices=[('agree', 'Agree'), ('disagree', 'Disagree')])
    voted_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'opinion')  # Ek hi user ek hi opinion pe ek hi vote de sakta
