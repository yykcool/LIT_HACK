# Generated by Django 2.1.5 on 2019-02-02 02:55

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='db_traffic_offense',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nric', models.CharField(max_length=9)),
                ('timestamp', models.DateTimeField(default=datetime.datetime(2019, 2, 2, 2, 55, 56, 945744, tzinfo=utc))),
                ('offense_type', models.CharField(max_length=15)),
                ('location', models.CharField(max_length=50)),
                ('fine', models.IntegerField(default='0')),
                ('demerit', models.IntegerField(default='0')),
            ],
        ),
    ]
