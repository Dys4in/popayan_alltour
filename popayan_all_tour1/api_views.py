from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login as auth_login
from .serializer import (
    UsuarioSerializer, 
    HotelSerializer, 
    RestauranteSerializer, 
    MuseosSerializer, 
    IglesiasSerializer
)
from .models import Hotel, Restaurante, Museos, Iglesias


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
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
        """POST /api/auth/logout/"""
        from django.contrib.auth import logout as auth_logout
        auth_logout(request)
        
        return Response({
            'success': True,
            'message': 'Sesión cerrada correctamente'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """GET /api/auth/me/"""
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
        """POST /api/auth/register/"""
        # ✅ LOG para debug
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Datos recibidos para registro: {request.data}")
        
        serializer = UsuarioSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            auth_login(request, user)
            
            return Response({
                'success': True,
                'message': 'Registro exitoso',
                'user': UsuarioSerializer(user).data,
                'session_id': request.session.session_key
            }, status=status.HTTP_201_CREATED)
        else:
            # ✅ LOG detallado de errores
            logger.error(f"Errores de validación: {serializer.errors}")
            
            return Response({
                'success': False,
                'message': 'Error de validación',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get'])
    def me(self, request):
        """GET /api/auth/me/ - Obtiene datos del usuario autenticado"""
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

    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        """PATCH /api/auth/update_profile/ - Actualiza datos del perfil"""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'No autenticado'
            }, status=status.HTTP_401_UNAUTHORIZED)

        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Datos recibidos para actualizar: {request.data}")

        # Campos permitidos para actualizar
        allowed_fields = ['nombre_completo', 'telefono', 'direccion', 'profesion']

        user = request.user
        updated_fields = []
    
        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
                updated_fields.append(field)
    
        if updated_fields:
            user.save()
            logger.info(f"Campos actualizados: {updated_fields}")
        
            return Response({
                'success': True,
                'message': 'Perfil actualizado exitosamente',
                'user': UsuarioSerializer(user).data,
                'updated_fields': updated_fields
            })
        else:
            return Response({
                'success': False,
                'message': 'No se proporcionaron campos para actualizar'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def upload_profile_image(self, request):
        """POST /api/auth/upload_profile_image/ - Sube imagen de perfil"""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'No autenticado'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if 'imagen' not in request.FILES:
            return Response({
                'success': False,
                'message': 'No se proporcionó ninguna imagen'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        imagen = request.FILES['imagen']
    
        # Validar tipo de archivo
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
        if imagen.content_type not in allowed_types:
            return Response({
                'success': False,
                'message': 'Formato de imagen no válido. Use JPG o PNG'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        # Validar tamaño (máximo 5MB)
        if imagen.size > 5 * 1024 * 1024:
            return Response({
                'success': False,
                'message': 'La imagen es muy grande. Máximo 5MB'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        # Guardar imagen
        user.imagen_perfil = imagen
        user.save()
    
        return Response({
            'success': True,
            'message': 'Imagen de perfil actualizada',
            'user': UsuarioSerializer(user).data,
            'imagen_url': user.imagen_perfil.url if user.imagen_perfil else None
        })

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """POST /api/auth/change_password/ - Cambia la contraseña"""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'No autenticado'
            }, status=status.HTTP_401_UNAUTHORIZED)

        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({
                'success': False,
                'message': 'Se requiere contraseña actual y nueva'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        user = request.user

        # Verificar contraseña actual
        if not user.check_password(current_password):
            return Response({
                'success': False,
                'message': 'Contraseña actual incorrecta'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        # Validar nueva contraseña
        if len(new_password) < 6:
            return Response({
                'success': False,
                'message': 'La nueva contraseña debe tener al menos 6 caracteres'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        # Cambiar contraseña
        user.set_password(new_password)
        user.save()
    
        return Response({
            'success': True,
            'message': 'Contraseña cambiada exitosamente'
        })

    @action(detail=False, methods=['delete'])
    def delete_account(self, request):
        """DELETE /api/auth/delete_account/ - Elimina la cuenta del usuario"""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'No autenticado'
            }, status=status.HTTP_401_UNAUTHORIZED)

        password = request.data.get('password')
        confirmation = request.data.get('confirmation')

        if not password:
            return Response({
                'success': False,
                'message': 'Se requiere la contraseña para confirmar'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        if confirmation != 'ELIMINAR':
            return Response({
                'success': False,
                'message': 'Confirmación incorrecta. Debe escribir "ELIMINAR"'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        user = request.user
    
        # Verificar contraseña
        if not user.check_password(password):
            return Response({
                'success': False,
                'message': 'Contraseña incorrecta'
            }, status=status.HTTP_400_BAD_REQUEST)
    
        # Soft delete: desactivar usuario en lugar de eliminarlo
        user.is_active = False
        user.save()
    
        # Cerrar sesión
        from django.contrib.auth import logout as auth_logout
        auth_logout(request)
    
        return Response({
            'success': True,
            'message': 'Cuenta eliminada exitosamente'
        })

    @action(detail=False, methods=['get'])
    def roles(self, request):
        """GET /api/auth/roles/ - Obtiene lista de roles"""
        from .models import Roles
        from .serializer import RolSerializer
    
        roles = Roles.objects.all()
        serializer = RolSerializer(roles, many=True)
    
        return Response({
            'success': True,
            'roles': serializer.data
        })

    @action(detail=False, methods=['get'])
    def tipos_establecimiento(self, request):
        """GET /api/auth/tipos_establecimiento/ - Obtiene tipos de establecimiento"""
        from .models import TipoEstablecimiento
        from .serializer import TipoEstablecimientoSerializer
    
        tipos = TipoEstablecimiento.objects.all()
        serializer = TipoEstablecimientoSerializer(tipos, many=True)
    
        return Response({
            'success': True,
            'tipos_establecimiento': serializer.data
        })

class HotelViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para CRUD de hoteles
    GET /api/hoteles/ - Lista todos los hoteles
    GET /api/hoteles/{id}/ - Detalle de un hotel
    POST /api/hoteles/ - Crear un hotel
    PATCH /api/hoteles/{id}/ - Actualizar parcialmente un hotel
    PUT /api/hoteles/{id}/ - Actualizar completamente un hotel
    DELETE /api/hoteles/{id}/ - Eliminar un hotel
    """
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Hotel.objects.filter(activo=True)
        # Filtros opcionales
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        return queryset.order_by('-fecha_creacion')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Hotel creado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Hotel actualizado exitosamente',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Soft delete
        instance.activo = False
        instance.save()
        
        return Response({
            'success': True,
            'message': 'Hotel eliminado exitosamente'
        }, status=status.HTTP_200_OK)


class RestauranteViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para CRUD de restaurantes
    GET /api/restaurantes/ - Lista todos los restaurantes
    GET /api/restaurantes/{id}/ - Detalle de un restaurante
    POST /api/restaurantes/ - Crear un restaurante
    PATCH /api/restaurantes/{id}/ - Actualizar parcialmente
    DELETE /api/restaurantes/{id}/ - Eliminar
    """
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Restaurante.objects.filter(activo=True)
        tipo_comida = self.request.query_params.get('tipo_comida', None)
        if tipo_comida:
            queryset = queryset.filter(tipo_comida__icontains=tipo_comida)
        return queryset.order_by('-fecha_creacion')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Restaurante creado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Restaurante actualizado exitosamente',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.activo = False
        instance.save()
        
        return Response({
            'success': True,
            'message': 'Restaurante eliminado exitosamente'
        }, status=status.HTTP_200_OK)


class MuseoViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para CRUD de museos
    """
    queryset = Museos.objects.all()
    serializer_class = MuseosSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        return Museos.objects.filter(activo=True).order_by('-fecha_creacion')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Museo creado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Museo actualizado exitosamente',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.activo = False
        instance.save()
        
        return Response({
            'success': True,
            'message': 'Museo eliminado exitosamente'
        }, status=status.HTTP_200_OK)


class IglesiaViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para CRUD de iglesias
    """
    queryset = Iglesias.objects.all()
    serializer_class = IglesiasSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        return Iglesias.objects.filter(activo=True).order_by('-fecha_creacion')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Iglesia creada exitosamente',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Iglesia actualizada exitosamente',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Error de validación',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.activo = False
        instance.save()
        
        return Response({
            'success': True,
            'message': 'Iglesia eliminada exitosamente'
        }, status=status.HTTP_200_OK)