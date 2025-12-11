"""
URL configuration for popayan_all_tour project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include  
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.shortcuts import render
from popayan_all_tour1.views import registro,noticia, exportar_estadisticas_admin_excel, exportar_estadisticas_admin_pdf, exportar_estadisticas_empresario_excel, exportar_estadisticas_empresario_pdf ,registrar_visita, dashboard_administrador , estadisticas_establecimiento, login_view, terminos, home, entretenimiento, perfilUser, semanas, procesiones,login_view,logout_view, terminos, home, redirect_by_role, historia, historia_1601_view, historia_1701_view, historia_1801_view, historia_1831_view, memory, vista_establecimientos, agregar_establecimiento, editar_establecimiento,eliminar_establecimiento, listar_establecimientos_publicos, hoteles_view, eliminar_imagen_perfil, descargar_historia_completa_pdf, descargar_historia_año_pdf, reactivar_establecimiento, eliminar_permanente_establecimiento
from popayan_all_tour1.views import (
    CustomPasswordResetView, CustomPasswordResetDoneView,
    CustomPasswordResetConfirmView, CustomPasswordResetCompleteView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('registro', registro, name='registro'),
    path('', login_view, name='login'),
    path('terminos', terminos, name='terminos'),
    path('home', home, name='home'),
    path('noticia/', noticia, name='noticia'),
    path('semana/', semanas, name='semanaSanta'),
    path('procesiones/', procesiones, name='procesiones'),
    path('perfilUser', perfilUser, name='perfilUser'),
    path('entretenimiento', entretenimiento, name='entretenimiento'),
    path('recuperar/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('recuperar/enviado/', CustomPasswordResetDoneView.as_view(), name='password_reset_done'),
    path('recuperar/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('recuperar/completado/', CustomPasswordResetCompleteView.as_view(), name='password_reset_complete'),
    
    # ✅ Rutas específicas primero (más específicas arriba)
    path('hoteles/', listar_establecimientos_publicos, {'tipo': 'hotel'}, name='listar_hoteles'),
    path('restaurantes/', listar_establecimientos_publicos, {'tipo': 'restaurante'}, name='listar_restaurantes'),
    path('museos/', listar_establecimientos_publicos, {'tipo': 'museo'}, name='listar_museos'),
    path('iglesias/', listar_establecimientos_publicos, {'tipo': 'iglesia'}, name='listar_iglesias'),
    
    # ✅ Rutas de gestión (agregar/editar/eliminar)
    path('<str:tipo>/agregar/', agregar_establecimiento, name='agregar_establecimiento'),
    path('<str:tipo>/<int:id>/editar/', editar_establecimiento, name='editar_establecimiento'),
    path('empresario/eliminar/<str:tipo>/<int:id>/', eliminar_establecimiento, name='eliminar_establecimiento'),    
    path('redirect-by-role/', redirect_by_role, name='redirect_by_role'),
    path('logout/', logout_view, name='logout'),
    path('empresario/reactivar/<str:tipo>/<int:id>/', reactivar_establecimiento, name='reactivar_establecimiento'),
    path('empresario/eliminar-permanente/<str:tipo>/<int:id>/', eliminar_permanente_establecimiento, name='eliminar_permanente_establecimiento'),
    
    path('popares', memory, name='popares'),
    path('histori/', historia, name='historia_1537'),
    path('historia-1601/', historia_1601_view, name='historia_1601'),
    path('historia-1701/', historia_1701_view, name='historia_1701'),
    path('historia-1801/', historia_1801_view, name='historia_1801'),
    path('historia-1831/', historia_1831_view, name='historia_1831'),
    path('juegaso/', lambda request: render(request, 'juegaso/juego.html'), name='juegaso'),
    path('menu/', lambda request: render(request, 'juegaso/menu.html'), name='menu'),
    path('creditos/', lambda request: render(request, 'juegaso/creditos.html'), name='creditos'),
    
    path('ciroGoal/', lambda request: render(request, 'CiroGoal/CiroGoal/index.html'), name='CiroGoal'),

#api pdf
    path('historia/pdf/completa/', descargar_historia_completa_pdf, name='pdf_historia_completa'),
    path('historia/pdf/<int:ano>/', descargar_historia_año_pdf, name='pdf_historia_año'),


    # API
    path("", include("popayan_all_tour1.urls")),
    
    #Editar Usuario
    path('perfil/', perfilUser, name='perfilUser'),
    path('eliminar-imagen-perfil/', eliminar_imagen_perfil, name='eliminar_imagen_perfil'),
    
    # URL para registrar visita
    path('visita/<str:tipo>/<int:id>/', registrar_visita, name='registrar_visita'),
    path('empresario/estadisticas/', estadisticas_establecimiento, name='estadisticas_establecimiento'),
    
    #url para empresario descargar pdf o excel
    path('exportar/empresario/pdf/', exportar_estadisticas_empresario_pdf, name='exportar_empresario_pdf'),
    path('exportar/empresario/excel/', exportar_estadisticas_empresario_excel, name='exportar_empresario_excel'),
    
    #admin pdf y excel 
    path('exportar/admin/pdf/', exportar_estadisticas_admin_pdf, name='exportar_admin_pdf'),
    path('exportar/admin/excel/', exportar_estadisticas_admin_excel, name='exportar_admin_excel'),
        
    #Dashboard admin
    path('dashboard-administrador/', dashboard_administrador, name='dashboard_administrador'),    
    
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

