from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'user-profile', UserProfileView, basename='user-profile')
router.register(r'userprofiles/others', UserProfileOtherView, basename='userprofile-others')


urlpatterns = [
    path('registration/', RegistrationView.as_view(), name='registration'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('changepassword/', ChangePassword.as_view(), name='changepassword'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('', include(router.urls)),
    path('CSVData/', CSVDataAPIView.as_view(), name='csv-data'),
    path("anime-news/", AnimeNewsAPIView.as_view(), name="anime-news"),
    path("home-opinions/", HomeOpinionView.as_view(), name="home-opinions"),
    path('img-database/', ImgDataBaseView.as_view(), name='img-database'),
    path('animehome/', AnimeHomeAPIView.as_view(), name='animehome'),
    path('animeprofile/<int:anime_id>/', AnimeProfileAPIView.as_view(), name='animeprofile'),
    path('recommendations/<str:name>/', RecommendationAPIView.as_view(), name='recommendations'),
]

