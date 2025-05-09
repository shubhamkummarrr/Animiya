from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import *
from django.contrib.auth import authenticate
from .renderers import UserRenderer
from rest_framework import viewsets
import pandas as pd
import os
import random
import requests
import json
import time
from django.shortcuts import get_object_or_404
from django.db.models import F
import pickle
import logging

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.ERROR)




def get_token(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

class RegistrationView(APIView):
    renderer_classes = [UserRenderer]
    
    def post(self, request, formate=None):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_token(user)
        return Response({"token":token, "msg":"Registration successful"}, status=status.HTTP_201_CREATED)
    
class LoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(**serializer.validated_data)
        if user:
            token = get_token(user)
            return Response({"token":token, "msg":"Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"errors":{"non_fields_error":"email or password is not valid"}}, status=status.HTTP_401_UNAUTHORIZED)
        

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    
    def get(self, request, format=None):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)
    
    
class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    
    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data, context = {'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg":"Password changed successfully"}, status=status.HTTP_200_OK)
    
class UserProfileView(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
        
class UserProfileOtherView(viewsets.ReadOnlyModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    
    def get_queryset(self):
        return UserProfile.objects.exclude(user=self.request.user)

class HomeOpinionView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = HomeOpinionSerializer(data=request.data)
        if serializer.is_valid():
            char_img_url = request.data.get('char_img_url')

            # Pehle check karo koi purani entry toh nahi usi user ke liye
            old_opinion = HomeOpinion.objects.filter(user=request.user, char_img_url=char_img_url)
            if old_opinion.exists():
                old_opinion.delete()
                return Response({"msg":"You clicked again on Agree or Disagree"})
            # Ab nayi entry save karo
            serializer.save(user=request.user)
            return Response({"msg": "Opinion added successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, format=None):
        opinions = HomeOpinion.objects.filter(user=request.user)
        serializer = HomeOpinionSerializer(opinions, many=True)
        return Response(serializer.data)

class ImgDataBaseView(APIView):
    renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        serializer = ImgDataBaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"ImgDataBase":"Saved successfully"}, status=status.HTTP_201_CREATED)
    
    def get(self, request, format=None):
        opinions = ImgDataBase.objects.all()
        serializer = ImgDataBaseSerializer(opinions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, format=None):
        opinion_id = request.data.get('id')
        action = request.data.get('action')
        user = request.user

        try:
            opinion = ImgDataBase.objects.get(id=opinion_id)
        except ImgDataBase.DoesNotExist:
            return Response({'error': 'Opinion not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get or create user's vote for this opinion
        vote_obj, created = ImgVote.objects.get_or_create(user=user, opinion=opinion)

        if vote_obj.vote == action:
            # Same vote again, do nothing
            return Response({'message': f'Already voted {action}'}, status=status.HTTP_200_OK)

        # Handle vote change
        # Update counters properly
        # Remove old vote first
        if vote_obj.vote == 'agree':
            opinion.agree = F('agree') - 1
        elif vote_obj.vote == 'disagree':
            opinion.disagree = F('disagree') - 1

        # Add new vote
        if action == 'agree':
            opinion.agree = F('agree') + 1
        elif action == 'disagree':
            opinion.disagree = F('disagree') + 1
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        # Update vote record
        vote_obj.vote = action
        vote_obj.save()
        opinion.save()
        opinion.refresh_from_db()

        serializer = ImgDataBaseSerializer(opinion)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class AnimeHomeAPIView(APIView):
    renderer_classes = [UserRenderer]
    def get(self, request):
        try:
            anime = pd.read_pickle(os.path.join(settings.BASE_DIR, 'api', 'anime.pkl'))
            anime.rename(columns = {"Image URL": "Img_url", "English Name":"Eng_name"}, inplace=True)

            # Popular anime
            popular_anime = anime.sort_values(by='Popularity')[["anime_id","Name","Eng_name","Genres","Img_url"]].iloc[:50]
            popular_anime = popular_anime.to_dict(orient='records')
            
            # trending anime
            trending_anime = anime[anime["Start_Year"] >=2024].sort_values(by="Favorites", ascending=False)[["anime_id","Name","Eng_name","Genres","Img_url"]].iloc[:10]
            trending_anime = trending_anime.to_dict(orient='records')

            # Favorites this year (2024)
            top_score = anime[anime["Start_Year"] == 2025].sort_values(by='Scored By', ascending=False)[["anime_id","Name","Eng_name","Genres","Img_url"]].iloc[:50]
            top_score = top_score.to_dict(orient='records')

            # This season (2025)
            this_season = anime[anime["Start_Year"] == 2025].sort_values(by='Favorites', ascending=False)[["anime_id","Name","Eng_name","Genres","Img_url"]]
            this_season = this_season.to_dict(orient='records')
            
            # 2024
            previos_year = anime[anime["Start_Year"] == 2024][["anime_id","Name","Eng_name","Genres","Img_url"]]
            previos_year = previos_year.to_dict(orient='records')

            # TEENON KO EK dict mein return karo
            data = {
                'popular_anime': popular_anime,
                'trending_anime': trending_anime,
                'top_score': top_score,
                'this_season': this_season,
                'previos_year': previos_year,
                'anime': anime.head(1).to_dict(orient='records')
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AnimeProfileAPIView(APIView):
    renderer_classes = [UserRenderer]
    def get(self, request, anime_id):
        try:
            anime = pd.read_pickle(os.path.join(settings.BASE_DIR, 'api', 'anime.pkl'))
            anime.rename(columns = {"Image URL": "Img_url", "English Name":"Eng_name"}, inplace=True)

            data = {
                'anime1': anime[anime["anime_id"]==anime_id].to_dict(orient='records')
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RecommendationAPIView(APIView):
    def get(self, request, name):
        try:
            # Load the model and data files first
            with open(os.path.join(settings.BASE_DIR, 'api', 'new_df.pkl'), 'rb') as f:
                new_df = pickle.load(f)

            with open(os.path.join(settings.BASE_DIR, 'api', 'similarity.pkl'), 'rb') as f:
                similarity = pickle.load(f)

            anime_data = pd.read_pickle(os.path.join(settings.BASE_DIR, 'api', 'anime.pkl'))
            anime_data.rename(columns={
                "Image URL": "Img_url", 
                "English Name": "Eng_name",
                "Scored By": "Scored_By"
            }, inplace=True)

            # Recommendation function
            def get_recommendations(anime_name, num_recommendations=20):
                """Get ordered recommendations for a specific anime."""
                try:
                    index = new_df[new_df["Name"] == anime_name].index[0]
                    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
                    top_indices = [i[0] for i in distances[1:num_recommendations+1]]
                    return new_df.iloc[top_indices].reset_index(drop=True)
                except IndexError:
                    raise ValueError(f"Anime '{anime_name}' not found in database")

            # Get recommendations
            recommendations = get_recommendations(name, num_recommendations=20)
            
            # Merge with additional anime data while preserving order
            recommended_animes = (
                recommendations[['Name']]
                .merge(
                    anime_data[[
                        'anime_id', 
                        'Name', 
                        'Eng_name', 
                        'Genres', 
                        'Img_url',
                        'Score',
                        'Scored_By',
                        'Episodes',
                        'Type'
                    ]],
                    on='Name',
                    how='left'
                )
                .drop_duplicates(subset=['Name'])  # Ensure no duplicates
            )
            
            # Convert to JSON/dict format
            result = recommended_animes.to_dict(orient='records')

            return Response(result, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Recommendation error: {str(e)}")
            return Response(
                {'error': 'Internal server error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )        
        
            
class CSVDataAPIView(APIView):
    def get(self, request):
        try:
            # CSV file path (make sure it's the correct path)
            csv_path = os.path.join(settings.BASE_DIR, 'api', 'newAnimeData.csv')
            df = pd.read_csv(csv_path).sample(100)

            # Convert to JSON/dict format
            data = df.to_dict(orient='records')
            return Response(data, status=status.HTTP_200_OK)
        
        except FileNotFoundError:
            return Response({'error': 'CSV file not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


CACHE_FILE = "anime_news_cache.json"
CACHE_TIMEOUT = 60 * 60 * 60 # 1 hour

class AnimeNewsAPIView(APIView):
    def get(self, request):
        try:
            # Step 1: Check if cache file exists and is fresh
            if os.path.exists(CACHE_FILE):
                file_time = os.path.getmtime(CACHE_FILE)
                if time.time() - file_time < CACHE_TIMEOUT:
                    with open(CACHE_FILE, "r") as f:
                        cached_data = json.load(f)
                    return Response(cached_data, status=status.HTTP_200_OK)

            # Step 2: Make fresh API call
            top_anime_url = "https://api.jikan.moe/v4/top/anime"
            anime_response = requests.get(top_anime_url)
            anime_data = anime_response.json()["data"]

            random_anime = random.sample(anime_data, 10)
            news_list = []

            for anime in random_anime:
                anime_id = anime["mal_id"]
                anime_image = anime["images"]["jpg"]["large_image_url"]

                news_url = f"https://api.jikan.moe/v4/anime/{anime_id}/news"
                news_response = requests.get(news_url)
                news_data = news_response.json().get("data", [])

                for news_item in news_data[:2]:
                    news_list.append({
                        "title": news_item["title"],
                        "excerpt": news_item["excerpt"],
                        "url": news_item["url"],
                        "date": news_item["date"],
                        "image": anime_image
                    })
                    

            random.shuffle(news_list)

            # Step 3: Save to cache
            with open(CACHE_FILE, "w") as f:
                json.dump(news_list, f)

            return Response(news_list, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
