# Generated by Django 2.1.5 on 2019-02-02 04:00

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('misc', '0007_auto_20190202_1128'),
    ]

    operations = [
        migrations.CreateModel(
            name='db_case_ongoing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_stamp', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('remarks', models.CharField(default=0, max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='db_users',
            fields=[
                ('nric', models.CharField(max_length=9, primary_key=True, serialize=False)),
                ('contact', models.IntegerField(unique=True)),
                ('cases_pending', models.IntegerField(default=0, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='db_traffic_offense',
            name='demerit',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='db_traffic_offense',
            name='fine',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='db_traffic_offense',
            name='nric',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='misc.db_users'),
        ),
        migrations.AddField(
            model_name='db_case_ongoing',
            name='nric',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='misc.db_users'),
        ),
    ]
