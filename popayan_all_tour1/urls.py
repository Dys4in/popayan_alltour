# popayan_all_tour1/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import RolViewSet, TipoEstablecimientoViewSet, UsuarioViewSet, HotelViewSet
from .api_upload import upload_imagen  # ✅ NUEVO
from .api_views import AuthViewSet
# Registramos los ViewSets en el router
router = DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'tipos-establecimientos', TipoEstablecimientoViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'hoteles', HotelViewSet)
router.register(r'auth', AuthViewSet, basename='auth')
urlpatterns = [
    path("api/", include(router.urls)),
    path("api/upload-imagen/", upload_imagen, name="upload_imagen"),  # ✅ NUEVO
]