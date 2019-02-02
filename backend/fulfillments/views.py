from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import authentication, permissions


class default(APIView):
    def post (self, request, format=None):
        print(request)
