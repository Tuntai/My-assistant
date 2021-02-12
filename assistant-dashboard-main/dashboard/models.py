from django.db import models

# Create your models here.
class post(models.Model):
	post = models.CharField(max_length=100)