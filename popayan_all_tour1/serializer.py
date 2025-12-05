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
        queryset=Roles.objects.all(), 
        source="rol", 
        write_only=True,
        required=True
    )

    tipo_establecimiento = TipoEstablecimientoSerializer(read_only=True)
    tipo_establecimiento_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoEstablecimiento.objects.all(),
        source="tipo_establecimiento",
        write_only=True,
        required=False,
        allow_null=True  # ✅ Permite null para turistas
    )
    
    # ✅ Campo password
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        min_length=6,
        style={'input_type': 'password'}
    )

    class Meta:
        model = Usuario
        fields = [
            "id",
            "email",
            "password",  # ✅ IMPORTANTE
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
        extra_kwargs = {
            'password': {'write_only': True},
            'profesion': {'required': False, 'allow_blank': True}  # ✅ Profesión opcional
        }
    
    def validate(self, data):
        """Valida que empresarios tengan tipo_establecimiento"""
        rol = data.get('rol')
        tipo_establecimiento = data.get('tipo_establecimiento')
        
        # Si es empresario (rol_id = 2), DEBE tener tipo_establecimiento
        if rol and rol.rol.lower() == 'empresario':
            if not tipo_establecimiento:
                raise serializers.ValidationError({
                    'tipo_establecimiento_id': 'Un empresario debe seleccionar un tipo de establecimiento'
                })
        
        return data
    
    def create(self, validated_data):
        """Crea usuario con password encriptado"""
        password = validated_data.pop('password')
        
        # Si profesion viene vacía, poner valor por defecto
        if not validated_data.get('profesion'):
            validated_data['profesion'] = 'No especificada'
        
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user

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

    # Agrega este serializer después de UsuarioSerializer

class UpdateProfileSerializer(serializers.Serializer):
    """Serializer para actualizar datos del perfil"""
    nombre_completo = serializers.CharField(max_length=255, required=False)
    telefono = serializers.CharField(max_length=20, required=False)
    direccion = serializers.CharField(max_length=255, required=False)
    profesion = serializers.CharField(max_length=100, required=False, allow_blank=True)
    
    def validate_telefono(self, value):
        """Valida formato de teléfono"""
        if value and not value.replace('+', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Formato de teléfono inválido")
        return value
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