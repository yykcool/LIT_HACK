from django.db import models
from django.utils import timezone


class db_users(models.Model):
    nric            = models.CharField(primary_key=True, max_length=9)
    contact         = models.IntegerField(unique=True)
    cases_pending   = models.IntegerField(null=True, default=0)

# DEPRECATED
class db_traffic_offense(models.Model):
    nric            = models.ForeignKey(to=db_users, on_delete=models.CASCADE)
    time_stamp      = models.DateTimeField(null=False, default=timezone.now)
    offense_type    = models.CharField(null=False, max_length= 15)
    location        = models.CharField(null=False, max_length=50)
    fine            = models.IntegerField(null=True, default=0)
    demerit         = models.IntegerField(null=True, default=0)
    remarks         = models.CharField(null=True, default='', max_length=50)

class db_case_ongoing(models.Model):
    nric            = models.ForeignKey(to=db_users, on_delete=models.CASCADE)
    time_stamp      = models.DateTimeField(editable=False, default=timezone.now)
    remarks         = models.CharField(null=False, default='', max_length=100)





