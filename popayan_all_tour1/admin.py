from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    Roles, TipoEstablecimiento, Usuario, Hotel, 
    Restaurante, Museos, Iglesias, VisitaEstablecimiento
)


@admin.register(Roles)
class RolAdmin(admin.ModelAdmin):
    list_display = ("id", "rol", "cantidad_usuarios")
    search_fields = ("rol",)
    readonly_fields = ("cantidad_usuarios",)
    
    def cantidad_usuarios(self, obj):
        """Muestra cuántos usuarios tienen este rol"""
        count = obj.usuario_set.count()
        return format_html(
            '<span style="font-weight: bold; color: #007bff;">{}</span>',
            count
        )
    cantidad_usuarios.short_description = "Usuarios con este rol"


@admin.register(TipoEstablecimiento)
class TipoEstablecimientoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "cantidad_usuarios")
    search_fields = ("nombre",)
    readonly_fields = ("cantidad_usuarios",)
    
    def cantidad_usuarios(self, obj):
        """Muestra cuántos usuarios tienen este tipo de establecimiento"""
        count = obj.usuario_set.count()
        return format_html(
            '<span style="font-weight: bold; color: #28a745;">{}</span>',
            count
        )
    cantidad_usuarios.short_description = "Empresarios"


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = (
        "id", "email", "nombre_completo", "rol", 
        "tipo_establecimiento", "telefono", "ver_imagen", 
        "estado_activo", "es_staff"
    )
    list_filter = ("rol", "is_active", "is_staff", "tipo_establecimiento")
    search_fields = ("email", "nombre_completo", "identificacion", "telefono")
    readonly_fields = ("ver_imagen_grande", "last_login")  # ✅ Cambiado a last_login
    
    fieldsets = (
        ("Información de Acceso", {
            "fields": ("email", "password", "is_active", "is_staff", "is_superuser")
        }),
        ("Información Personal", {
            "fields": (
                "nombre_completo", "identificacion", "fecha_nacimiento",
                "telefono", "direccion", "profesion"
            )
        }),
        ("Imagen de Perfil", {
            "fields": ("imagen_perfil", "ver_imagen_grande")
        }),
        ("Rol y Establecimiento", {
            "fields": ("rol", "tipo_establecimiento")
        }),
        ("Información Adicional", {
            "fields": ("last_login",),  # ✅ Cambiado a last_login
            "classes": ("collapse",)
        }),
    )
    
    def ver_imagen(self, obj):
        """Muestra miniatura de la imagen en el listado"""
        if obj.imagen_perfil:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%; object-fit: cover;" />',
                obj.imagen_perfil.url
            )
        return "Sin imagen"
    ver_imagen.short_description = "Imagen"
    
    def ver_imagen_grande(self, obj):
        """Muestra imagen grande en el detalle"""
        if obj.imagen_perfil:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 10px;" />',
                obj.imagen_perfil.url
            )
        return "Sin imagen de perfil"
    ver_imagen_grande.short_description = "Vista previa"
    
    def estado_activo(self, obj):
        """Muestra estado visual del usuario"""
        if obj.is_active:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Activo</span>'
            )
        return format_html(
            '<span style="color: red; font-weight: bold;">✗ Inactivo</span>'
        )
    estado_activo.short_description = "Estado"
    
    def es_staff(self, obj):
        """Indica si es staff"""
        return obj.is_staff
    es_staff.boolean = True
    es_staff.short_description = "Staff"


class EstablecimientoBaseAdmin(admin.ModelAdmin):
    """Clase base para todos los establecimientos con funcionalidad común"""
    list_display = (
        "id", "nombre", "empresario", "direccion", 
        "ver_imagen", "estado_activo", "visitas_total", 
        "fecha_creacion"
    )
    list_filter = ("activo", "fecha_creacion")
    search_fields = ("nombre", "descripcion", "direccion", "empresario__nombre_completo")
    readonly_fields = (
        "ver_imagen_grande", "fecha_creacion", 
        "visitas_total", "url_imagen_cloudinary"
    )
    date_hierarchy = "fecha_creacion"
    
    fieldsets = (
        ("Información Básica", {
            "fields": ("nombre", "descripcion", "empresario")
        }),
        ("Ubicación y Horarios", {
            "fields": ("direccion", "horario_aten")
        }),
        ("Imágenes", {
            "fields": ("imagen", "imagen_url", "ver_imagen_grande", "url_imagen_cloudinary")
        }),
        ("Enlaces y Estado", {
            "fields": ("url_mas_info", "activo")
        }),
        ("Información Adicional", {
            "fields": ("fecha_creacion", "visitas_total"),
            "classes": ("collapse",)
        }),
    )
    
    def ver_imagen(self, obj):
        """Miniatura en listado"""
        url = obj.get_imagen_url()
        if url:
            return format_html(
                '<img src="{}" width="60" height="60" style="border-radius: 8px; object-fit: cover;" />',
                url
            )
        return "Sin imagen"
    ver_imagen.short_description = "Imagen"
    
    def ver_imagen_grande(self, obj):
        """Imagen grande en detalle"""
        url = obj.get_imagen_url()
        if url:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 10px;" />',
                url
            )
        return "Sin imagen"
    ver_imagen_grande.short_description = "Vista previa"
    
    def url_imagen_cloudinary(self, obj):
        """Muestra la URL de Cloudinary si existe"""
        if obj.imagen_url:
            return format_html(
                '<a href="{}" target="_blank">{}</a>',
                obj.imagen_url,
                obj.imagen_url
            )
        return "No hay URL de Cloudinary"
    url_imagen_cloudinary.short_description = "URL Cloudinary"
    
    def estado_activo(self, obj):
        """Estado visual"""
        if obj.activo:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Activo</span>'
            )
        return format_html(
            '<span style="color: red; font-weight: bold;">✗ Inactivo</span>'
        )
    estado_activo.short_description = "Estado"
    
    def visitas_total(self, obj):
        """Cuenta las visitas al establecimiento"""
        from django.contrib.contenttypes.models import ContentType
        ct = ContentType.objects.get_for_model(obj)
        count = VisitaEstablecimiento.objects.filter(
            content_type=ct,
            object_id=obj.id
        ).count()
        return format_html(
            '<span style="font-weight: bold; color: #17a2b8;">{}</span>',
            count
        )
    visitas_total.short_description = "Visitas"


@admin.register(Hotel)
class HotelAdmin(EstablecimientoBaseAdmin):
    """Admin específico para Hoteles"""
    pass


@admin.register(Restaurante)
class RestauranteAdmin(EstablecimientoBaseAdmin):
    """Admin específico para Restaurantes"""
    pass


@admin.register(Museos)
class MuseosAdmin(EstablecimientoBaseAdmin):
    """Admin específico para Museos"""
    pass


@admin.register(Iglesias)
class IglesiasAdmin(EstablecimientoBaseAdmin):
    """Admin específico para Iglesias"""
    pass


@admin.register(VisitaEstablecimiento)
class VisitaEstablecimientoAdmin(admin.ModelAdmin):
    list_display = (
        "id", "tipo_establecimiento", "nombre_establecimiento",
        "fecha_visita", "ip_visitante", "usuario_visitante"
    )
    list_filter = ("content_type", "fecha_visita")
    search_fields = ("ip_visitante", "usuario__nombre_completo")
    readonly_fields = (
        "content_type", "object_id", "establecimiento",
        "fecha_visita", "ip_visitante", "user_agent", "usuario"
    )
    date_hierarchy = "fecha_visita"
    
    def tipo_establecimiento(self, obj):
        """Muestra el tipo de establecimiento"""
        return obj.content_type.model.capitalize()
    tipo_establecimiento.short_description = "Tipo"
    
    def nombre_establecimiento(self, obj):
        """Muestra el nombre del establecimiento visitado"""
        if obj.establecimiento:
            return obj.establecimiento.nombre
        return "N/A"
    nombre_establecimiento.short_description = "Establecimiento"
    
    def usuario_visitante(self, obj):
        """Muestra el usuario si está autenticado"""
        if obj.usuario:
            return format_html(
                '<a href="{}">{}</a>',
                reverse('admin:popayan_all_tour1_usuario_change', args=[obj.usuario.id]),
                obj.usuario.nombre_completo
            )
        return "Anónimo"
    usuario_visitante.short_description = "Usuario"
    
    def has_add_permission(self, request):
        """No permitir agregar visitas manualmente"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """No permitir editar visitas"""
        return False