import os
import json

# Directorio donde están las imágenes
directorio = 'imagenes'

# Idiomas disponibles
idiomas = ['es', 'en', 'fr', 'ja']

# Estructura por imagen
obras = []

for nombre_archivo in os.listdir(directorio):
    if nombre_archivo.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
        obra = {
            "ruta": f"{directorio}/{nombre_archivo}",
            "titulo": {
                "es": f"Título de {nombre_archivo}",
                "en": f"Title of {nombre_archivo}",
                "fr": f"Titre de {nombre_archivo}",
                "ja": f"{nombre_archivo} のタイトル"
            },
            "descripcion": {
                "es": f"Descripción de {nombre_archivo}",
                "en": f"Description of {nombre_archivo}",
                "fr": f"Description de {nombre_archivo}",
                "ja": f"{nombre_archivo} の説明"
            }
        }
        obras.append(obra)

# Guardar en JSON
with open('obras.json', 'w', encoding='utf-8') as f:
    json.dump(obras, f, ensure_ascii=False, indent=4)

print("Archivo obras.json generado correctamente.")
