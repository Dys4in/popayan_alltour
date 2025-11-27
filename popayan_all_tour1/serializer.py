from rest_framework import serializers
from .models import Roles, TipoEstablecimiento, Usuario, Hotel, Restaurante, Museos, Iglesias


# ============================================================
# SERIALIZER PARA ROLES
# ============================================================
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = "__all__"


# ============================================================
# SERIALIZER PARA TIPO DE ESTABLECIMIENTO
# ============================================================
class TipoEstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEstablecimiento
        fields = "__all__"


# ============================================================
# SERIALIZER PARA USUARIO
# ============================================================
class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolSerializer(read_only=True)
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Roles.objects.all(), source="rol", write_only=True
    )

    tipo_establecimiento = TipoEstablecimientoSerializer(read_only=True)
    tipo_establecimiento_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoEstablecimiento.objects.all(),
        source="tipo_establecimiento",
        write_only=True,
        required=False
    )

    class Meta:
        model = Usuario
        fields = [
            "id",
            "email",
            "nombre_completo",
            "telefono",
            "profesion",
            "identificacion",
            "fecha_nacimiento",
            "direccion",
            "imagen_perfil",
            "rol", "rol_id",
            "tipo_establecimiento", "tipo_establecimiento_id",
            "is_active",
        ]


# ============================================================
# SERIALIZER PARA HOTEL (✅ ACTUALIZADO)
# ============================================================
class HotelSerializer(serializers.ModelSerializer):
    empresario = UsuarioSerializer(read_only=True)
    empresario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source="empresario",
        write_only=True,
        required=False
    )
    
    # ✅ Campo calculado que devuelve la URL correcta
    imagen_display = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "nombre",
            "descripcion",
            "horario_aten", 
            "direccion",
            "imagen",
            "imagen_url",
            "imagen_display",  # ✅ NUEVO: URL final para usar
            "url_mas_info",
            "fecha_creacion",
            "activo",
            "empresario", 
            "empresario_id"
        ]
    
    def get_imagen_display(self, obj):
        """Devuelve la URL correcta (Cloudinary o local)"""
        return obj.get_imagen_url()


# ============================================================
# SERIALIZER PARA RESTAURANTE (✅ NUEVO)
# ============================================================
class RestauranteSerializer(serializers.ModelSerializer):
    empresario = UsuarioSerializer(read_only=True)
    empresario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source="empresario",
        write_only=True,
        required=False
    )
    imagen_display = serializers.SerializerMethodField()

    class Meta:
        model = Restaurante
        fields = [
            "id", "nombre", "descripcion", "horario_aten", "direccion", "imagen", "imagen_url", 
            "imagen_display", "url_mas_info", "fecha_creacion", 
            "activo", "empresario", "empresario_id"
        ]
    
    def get_imagen_display(self, obj):
        return obj.get_imagen_url()


# ============================================================
# SERIALIZER PARA MUSEOS (✅ NUEVO)
# ============================================================
class MuseosSerializer(serializers.ModelSerializer):
    empresario = UsuarioSerializer(read_only=True)
    empresario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source="empresario",
        write_only=True,
        required=False
    )
    imagen_display = serializers.SerializerMethodField()

    class Meta:
        model = Museos
        fields = [
            "id", "nombre", "descripcion", "horario_aten", "direccion", "imagen", "imagen_url", 
            "imagen_display", "url_mas_info", "fecha_creacion", 
            "activo", "empresario", "empresario_id"
        ]
    
    def get_imagen_display(self, obj):
        return obj.get_imagen_url()


# ============================================================
# SERIALIZER PARA IGLESIAS (✅ NUEVO)
# ============================================================
class IglesiasSerializer(serializers.ModelSerializer):
    empresario = UsuarioSerializer(read_only=True)
    empresario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source="empresario",
        write_only=True,
        required=False
    )
    imagen_display = serializers.SerializerMethodField()

    class Meta:
        model = Iglesias
        fields = [
            "id", "nombre", "descripcion", "horario_aten", "direccion", "imagen", "imagen_url", 
            "imagen_display", "url_mas_info", "fecha_creacion", 
            "activo", "empresario", "empresario_id"
        ]
    
    def get_imagen_display(self, obj):
        return obj.get_imagen_url()