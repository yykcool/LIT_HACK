from rest_framework import generics
from rest_framework.views import APIView, Response
import json

class webhook_test(APIView):
    def post (self, request):
        print(request)
        return Response({'status_code':'200'})

