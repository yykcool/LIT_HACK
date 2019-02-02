from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import authentication, permissions


class Webhook_test(APIView):
    def post (self, request):
        print(request)
