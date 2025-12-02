from django.contrib import admin

from django.contrib import admin
from .models import Roles, TipoEstablecimiento, Usuario, Hotel


@admin.register(Roles)
class RolAdmin(admin.ModelAdmin):
    list_display = ("id", "rol")
    search_fields = ("rol",)


@admin.register(TipoEstablecimiento)
class TipoEstablecimientoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "nombre_completo", "rol", "tipo_establecimiento", "is_active")
    list_filter = ("rol", "is_active")
    search_fields = ("email", "nombre_completo", "identificacion")


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "empresario", "activo", "fecha_creacion")
    list_filter = ("activo",)
    search_fields = ("nombre", "descripcion")


# Register your models here.
