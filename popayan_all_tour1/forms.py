from django import forms
from .models import Usuario, Roles, Hotel
from datetime import date
import os
from django.core.exceptions import ValidationError
from .utils import get_modelo, get_establecimiento_form


#formulario registro

class RegistroUsuarioForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = Usuario
        fields = [
            "email", "telefono", "password", "profesion",
            "nombre_completo", "identificacion", "fecha_nacimiento",
            "rol", "direccion", "tipo_establecimiento"
        ]
        widgets = {
            "fecha_nacimiento": forms.DateInput(attrs={"type": "date"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 🔹 Excluir "Administrador" del select
        self.fields["rol"].queryset = Roles.objects.exclude(rol__iexact="administrador")

    # 🔹 Validación personalizada para correo
    def clean_email(self):
        email = self.cleaned_data.get("email")
        if Usuario.objects.filter(email=email).exists():
            raise forms.ValidationError("Correo ya registrado")
        return email

    # 🔹 Validación personalizada para teléfono
    def clean_telefono(self):
        telefono = self.cleaned_data.get("telefono")
        if Usuario.objects.filter(telefono=telefono).exists():
            raise forms.ValidationError("Numero de teléfono en uso")
        if len(telefono) < 7:
            raise forms.ValidationError("Al menos 7 digitos")
        return telefono

    # 🔹 Validación personalizada para identificación
    def clean_identificacion(self):
        identificacion = self.cleaned_data.get("identificacion")
        if Usuario.objects.filter(identificacion=identificacion).exists():
            raise forms.ValidationError("Identificación ya registrada")
        return identificacion

    # 🔹 Validación de contraseña mínima
    def clean_password(self):
        password = self.cleaned_data.get("password")
        if len(password) < 5:
            raise forms.ValidationError("Al menos 5 caracteres")
        return password

    # 🔹 Validación de edad mínima
    def clean_fecha_nacimiento(self):
        fecha_nacimiento = self.cleaned_data.get("fecha_nacimiento")
        from datetime import date
        if fecha_nacimiento:
            edad = (date.today() - fecha_nacimiento).days // 365
            if edad < 16:
                raise forms.ValidationError("Debe ser mayor de 16 años")
        return fecha_nacimiento

    # 🔹 Guardar encriptando contraseña
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])  # 🔒 Encripta
        if commit:
            user.save()
        return user

#fin form

#perfil usuario
class UsuarioForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ["email", "password", "nombre_completo", "direccion", "telefono", "imagen_perfil"]
        widgets = {
            "password": forms.PasswordInput(render_value=True),
        }
#fin usuario






class EstablecimientoForm(forms.ModelForm):
    """
    Formulario dinámico para Hotel, Restaurante, Museo e Iglesia.
    Detecta automáticamente el modelo a partir del tipo indicado.
    """
    def __init__(self, *args, **kwargs):
        tipo = kwargs.pop('tipo', None)  # recibe 'hotel', 'restaurante', etc.
        super().__init__(*args, **kwargs)

        # Cambiar placeholders y títulos dinámicamente
        if tipo:
            nombre_tipo = tipo.capitalize()
            self.fields['nombre'].widget.attrs.update({
                'placeholder': f'Ingrese el nombre del {tipo}'
            })
            self.fields['descripcion'].widget.attrs.update({
                'placeholder': f'Descripción detallada del {tipo}'
            })
            self.fields['horario_aten'].widget.attrs.update({
                'placeholder': f'Horario de atención del {tipo}'
            })
            self.fields['direccion'].widget.attrs.update({
                'placeholder': f'Dirección del {tipo}'
            })
            self.fields['url_mas_info'].widget.attrs.update({
                'placeholder': 'https://ejemplo.com'
            })

    class Meta:
        model = None  # Se define dinámicamente al instanciar
        fields = ['nombre', 'descripcion', 'horario_aten', 'direccion', 'imagen', 'url_mas_info']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'descripcion': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 5
            }),
            'horario_aten': forms.TextInput(attrs={
                'class': 'form-control',
                'rows': 5
            }),
            'direccion': forms.TextInput(attrs={
                'class': 'form-control',
                'rows': 5
            }),
            'imagen': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'url_mas_info': forms.URLInput(attrs={
                'class': 'form-control'
            }),
        }

    def clean_imagen(self):
        imagen = self.cleaned_data.get('imagen')
        if imagen:
            if imagen.size > 5 * 1024 * 1024:  # 5MB
                raise forms.ValidationError("La imagen no puede ser mayor a 5MB.")
            
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
            ext = os.path.splitext(imagen.name)[1].lower()
            if ext not in valid_extensions:
                raise forms.ValidationError("Solo se permiten imágenes (jpg, jpeg, png, gif).")
        return imagen

def get_establecimiento_form(tipo):
    try:
        modelo = get_modelo(tipo)  # ✅ Ahora devuelve el modelo directamente
    except ValueError:
        class DummyForm(forms.Form):
            pass
        return DummyForm

    class EstablecimientoForm(forms.ModelForm):
        class Meta:
            model = modelo  # ✅ Ya no es string, es el modelo
            fields = ['nombre', 'descripcion', 'horario_aten', 'direccion', 'imagen', 'url_mas_info']
            widgets = {
                'nombre': forms.TextInput(attrs={
                    'class': 'form-control',
                    'placeholder': f'Ingrese el nombre del {tipo}'
                }),
                'descripcion': forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 5,
                    'placeholder': f'Descripción detallada del {tipo}'
                }),
                'horario_aten': forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 5,
                    'placeholder': f'Horario de atención del {tipo}'
                }),
                'direccion': forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 5,
                    'placeholder': f'Dirección del {tipo}'
                }),
                'imagen': forms.FileInput(attrs={
                    'class': 'form-control',
                    'accept': 'image/*'
                }),
                'url_mas_info': forms.URLInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'https://ejemplo.com'
                })
            }

    return EstablecimientoForm

#fin hoteles

from django import forms
from .models import Usuario, Roles, TipoEstablecimiento
from datetime import date
from django.core.exceptions import ValidationError

# ============================================================
# FORMULARIO DE EDICIÓN DE PERFIL DE USUARIO
# ============================================================

class EditarPerfilForm(forms.ModelForm):
    """
    Formulario para editar el perfil completo del usuario autenticado.
    Incluye validaciones personalizadas y manejo de imagen de perfil.
    """
    
    # Campo de contraseña opcional (solo si se quiere cambiar)
    nueva_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Dejar en blanco para mantener la actual'
        }),
        required=False,
        label='Nueva Contraseña'
    )
    
    confirmar_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Confirmar nueva contraseña'
        }),
        required=False,
        label='Confirmar Contraseña'
    )

    class Meta:
        model = Usuario
        fields = [
            'email', 'nombre_completo', 'fecha_nacimiento', 
            'direccion', 'telefono', 'profesion', 'identificacion',
            'rol', 'tipo_establecimiento', 'imagen_perfil'
        ]
        widgets = {
            'email': forms.EmailInput(attrs={
                'placeholder': 'correo@ejemplo.com'
            }),
            'nombre_completo': forms.TextInput(attrs={
                'placeholder': 'Nombre completo'
            }),
            'fecha_nacimiento': forms.DateInput(attrs={
                'type': 'date'
            }),
            'direccion': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Dirección completa'
            }),
            'telefono': forms.TextInput(attrs={
                'placeholder': '312 456 7890'
            }),
            'profesion': forms.TextInput(attrs={
                'placeholder': 'Profesión u ocupación'
            }),
            'identificacion': forms.TextInput(attrs={
                'placeholder': 'Número de identificación'
            }),
            'imagen_perfil': forms.FileInput(attrs={
                'accept': 'image/*',
                'style': 'display: none;'
            })
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        
        # El rol y tipo de establecimiento son de solo lectura para usuarios normales
        if self.user and not self.user.is_staff:
            self.fields['rol'].disabled = True
            self.fields['tipo_establecimiento'].disabled = True

    # ============================================================
    # VALIDACIONES PERSONALIZADAS
    # ============================================================

    def clean_email(self):
        """Validar que el email no esté en uso por otro usuario"""
        email = self.cleaned_data.get('email')
        if self.instance and self.instance.pk:
            # Excluir el usuario actual de la búsqueda
            if Usuario.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
                raise ValidationError('Este correo ya está registrado por otro usuario')
        return email

    def clean_telefono(self):
        """Validar formato y unicidad del teléfono"""
        telefono = self.cleaned_data.get('telefono')
        if telefono:
            # Validar longitud mínima
            if len(telefono) < 7:
                raise ValidationError('El teléfono debe tener al menos 7 dígitos')
            
            # Validar unicidad
            if self.instance and self.instance.pk:
                if Usuario.objects.filter(telefono=telefono).exclude(pk=self.instance.pk).exists():
                    raise ValidationError('Este teléfono ya está registrado por otro usuario')
        return telefono

    def clean_identificacion(self):
        """Validar unicidad de la identificación"""
        identificacion = self.cleaned_data.get('identificacion')
        if identificacion:
            if self.instance and self.instance.pk:
                if Usuario.objects.filter(identificacion=identificacion).exclude(pk=self.instance.pk).exists():
                    raise ValidationError('Esta identificación ya está registrada')
        return identificacion

    def clean_fecha_nacimiento(self):
        """Validar edad mínima de 16 años"""
        fecha_nacimiento = self.cleaned_data.get('fecha_nacimiento')
        if fecha_nacimiento:
            edad = (date.today() - fecha_nacimiento).days // 365
            if edad < 16:
                raise ValidationError('Debes ser mayor de 16 años')
        return fecha_nacimiento

    def clean_imagen_perfil(self):
        """Validar tamaño y formato de la imagen"""
        imagen = self.cleaned_data.get('imagen_perfil')
        if imagen:
            # Validar tamaño (máximo 5MB)
            if hasattr(imagen, 'size') and imagen.size > 5 * 1024 * 1024:
                raise ValidationError('La imagen no puede ser mayor a 5MB')
            
            # Validar extensión
            import os
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            ext = os.path.splitext(imagen.name)[1].lower()
            if ext not in valid_extensions:
                raise ValidationError('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)')
        
        return imagen

    def clean(self):
        """Validación cruzada de contraseñas"""
        cleaned_data = super().clean()
        nueva_password = cleaned_data.get('nueva_password')
        confirmar_password = cleaned_data.get('confirmar_password')

        # Si se ingresó una nueva contraseña, validar
        if nueva_password:
            if len(nueva_password) < 5:
                raise ValidationError('La contraseña debe tener al menos 5 caracteres')
            
            if nueva_password != confirmar_password:
                raise ValidationError('Las contraseñas no coinciden')

        # Validar que empresario tenga tipo de establecimiento
        rol = cleaned_data.get('rol')
        tipo_establecimiento = cleaned_data.get('tipo_establecimiento')
        
        if rol and rol.rol.lower() == 'empresario' and not tipo_establecimiento:
            raise ValidationError('Un empresario debe tener un tipo de establecimiento asignado')

        return cleaned_data

    def save(self, commit=True):
        """Guardar el usuario con la nueva contraseña si se proporcionó"""
        user = super().save(commit=False)
        
        # Actualizar contraseña si se proporcionó una nueva
        nueva_password = self.cleaned_data.get('nueva_password')
        if nueva_password:
            user.set_password(nueva_password)
        
        if commit:
            user.save()
        
        return user

