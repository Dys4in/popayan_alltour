from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('popayan_all_tour1', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Restaurante',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200, verbose_name='Nombre del Restaurante')),
                ('descripcion', models.TextField(verbose_name='Descripción')),
                ('imagen', models.ImageField(upload_to='restaurantes/', verbose_name='Imagen')),
                ('url_mas_info', models.URLField(verbose_name='URL para más información')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('activo', models.BooleanField(default=True, verbose_name='Activo')),
                ('empresario', models.ForeignKey(blank=True, limit_choices_to={'rol__rol': 'empresario'}, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='restaurantes', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Restaurante',
                'verbose_name_plural': 'Restaurantes',
                'db_table': 'restaurantes',
                'ordering': ['-fecha_creacion'],
            },
        ),
    ]