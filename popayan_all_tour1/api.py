# api.py
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Roles, TipoEstablecimiento, Usuario, Hotel
from .serializer import (
    RolSerializer,
    TipoEstablecimientoSerializer,
    UsuarioSerializer,
    HotelSerializer,
)


# 🔹 Roles
class RolViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["rol"]  # permite filtrar por nombre exacto
    search_fields = ["rol"]     # búsqueda tipo LIKE
    ordering_fields = ["rol", "id"]
    ordering = ["rol"]


# 🔹 Tipo de Establecimiento
class TipoEstablecimientoViewSet(viewsets.ModelViewSet):
    queryset = TipoEstablecimiento.objects.all()
    serializer_class = TipoEstablecimientoSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["nombre"]
    search_fields = ["nombre"]
    ordering_fields = ["nombre", "id"]
    ordering = ["nombre"]


# 🔹 Usuarios
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["rol", "tipo_establecimiento", "is_active"] # filtros exactos
    search_fields = ["nombre_completo", "email", "identificacion"] 
    ordering_fields = ["nombre_completo", "fecha_nacimiento"]
    ordering = ["nombre_completo"]


# 🔹 Hoteles
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  
    # 👆 cualquiera puede ver hoteles, pero solo autenticados los crean/editan

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activo", "empresario"]
    search_fields = ["nombre", "descripcion"]
    ordering_fields = ["fecha_creacion", "nombre"]
    ordering = ["-fecha_creacion"]  # más recientes primero
