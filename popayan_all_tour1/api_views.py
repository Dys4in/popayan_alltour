# Crea popayan_all_tour1/api_views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as auth_login
from .serializer import UsuarioSerializer
from .models import Hotel, Restaurante, Museos, Iglesias
from .serializer import (
    UsuarioSerializer, 
    HotelSerializer, 
    RestauranteSerializer, 
    MuseosSerializer, 
    IglesiasSerializer
)

class AuthViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Endpoint de login para la app móvil
        POST /api/auth/login/
        Body: {"email": "...", "password": "..."}
        """
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        
        if not email or not password:
            return Response({
                'success': False,
                'message': 'Email y contraseña son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, email=email, password=password)
        
        if user is not None and user.is_active:
            auth_login(request, user)
            
            # Serializar datos del usuario
            user_data = UsuarioSerializer(user).data
            
            return Response({
                'success': True,
                'message': 'Login exitoso',
                'user': user_data,
                'session_id': request.session.session_key
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Correo o contraseña incorrectos'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """
        Endpoint de logout
        POST /api/auth/logout/
        """
        from django.contrib.auth import logout as auth_logout
        auth_logout(request)
        
        return Response({
            'success': True,
            'message': 'Sesión cerrada correctamente'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Obtener datos del usuario autenticado
        GET /api/auth/me/
        """
        if request.user.is_authenticated:
            user_data = UsuarioSerializer(request.user).data
            return Response({
                'success': True,
                'user': user_data
            })
        else:
            return Response({
                'success': False,
                'message': 'No autenticado'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
    @action(detail=False, methods=['post'])
    def register(self, request):
        """        Endpoint de registro para la app móvil
        POST /api/auth/register/
        """
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data.get('password'))
            user.save()
            
            # Auto-login tras registro
            auth_login(request, user)
            
            return Response({
                'success': True,
                'message': 'Registro exitoso',
                'user': UsuarioSerializer(user).data,
                'session_id': request.session.session_key
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'message': 'Error de validación',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        


# ... tu AuthViewSet existente ...

class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar hoteles
    GET /api/hoteles/ - Lista todos los hoteles activos
    GET /api/hoteles/{id}/ - Detalle de un hotel
    """
    queryset = Hotel.objects.filter(activo=True)
    serializer_class = HotelSerializer
    
    def get_queryset(self):
        queryset = Hotel.objects.filter(activo=True)
        # Ordenar por fecha de creación (más recientes primero)
        return queryset.order_by('-fecha_creacion')


class RestauranteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar restaurantes
    GET /api/restaurantes/ - Lista todos los restaurantes activos
    GET /api/restaurantes/{id}/ - Detalle de un restaurante
    """
    queryset = Restaurante.objects.filter(activo=True)
    serializer_class = RestauranteSerializer
    
    def get_queryset(self):
        return Restaurante.objects.filter(activo=True).order_by('-fecha_creacion')


class MuseoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar museos
    GET /api/museos/ - Lista todos los museos activos
    GET /api/museos/{id}/ - Detalle de un museo
    """
    queryset = Museos.objects.filter(activo=True)
    serializer_class = MuseosSerializer
    
    def get_queryset(self):
        return Museos.objects.filter(activo=True).order_by('-fecha_creacion')


class IglesiaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar iglesias
    GET /api/iglesias/ - Lista todas las iglesias activas
    GET /api/iglesias/{id}/ - Detalle de una iglesia
    """
    queryset = Iglesias.objects.filter(activo=True)
    serializer_class = IglesiasSerializer
    
    def get_queryset(self):
        return Iglesias.objects.filter(activo=True).order_by('-fecha_creacion')