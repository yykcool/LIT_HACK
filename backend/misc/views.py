from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import authentication, permissions


class webhook_test(APIView):
    def post (self, request):
        print(request)
