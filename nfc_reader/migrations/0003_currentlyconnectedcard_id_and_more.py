# Generated by Django 4.1 on 2022-09-04 19:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('nfc_reader', '0002_currentlyconnectedcard'),
    ]

    operations = [
        migrations.AddField(
            model_name='currentlyconnectedcard',
            name='id',
            field=models.BigAutoField(auto_created=True, default=1, primary_key=True, serialize=False,
                                      verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='currentlyconnectedcard',
            name='card_uid',
            field=models.CharField(max_length=20),
        ),
    ]