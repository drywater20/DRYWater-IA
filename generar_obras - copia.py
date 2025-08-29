# generar_obras.py
import os
import json

# Configuración
CARPETA_IMAGENES = "imagenes"
ARCHIVO_SALIDA = "obras.json"

# Estilos personalizados
ESTILOS = ["peces", "calamares", "varios", "otros"]

# Texto inicial multilingüe
TEXTO_INICIO = {
    "titulo": {
        "es": "Obras de Arte",
        "en": "Artworks",
        "fr": "Œuvres d'art",
        "ja": "芸術作品"
    },
    "descripcion_inicio": {
        "es": "Bienvenido a nuestra galería de arte. Haz clic en este texto para escuchar la presentación.",
        "en": "Welcome to our art gallery. Click on this text to listen to the presentation.",
        "fr": "Bienvenue dans notre galerie d'art. Cliquez sur ce texte pour écouter la présentation.",
        "ja": "アートギャラリーへようこそ。このテキストをクリックして、紹介を聞いてください。"
    }
}

# Imágenes que NO son obras (recursos del sitio)
IMAGENES_EXCLUIDAS = [
    "fondo.jpg", "fondo.JPG", "fondo.jpeg", "fondo.png",
    "fondo_horizontal.jpg", "fondo_horizontal.JPG",
    "header.jpg", "header.JPG", "cabecera.jpg", "cabecera.JPG"
]


def normalizar_nombre(nombre):
    """Convierte a minúsculas y elimina extensión"""
    return os.path.splitext(nombre.lower())[0]


def generar_obras():
    print("🔍 Buscando carpeta:", os.path.abspath(CARPETA_IMAGENES))

    # 1. Verificar si la carpeta 'imagenes' existe
    if not os.path.exists(CARPETA_IMAGENES):
        print(f"❌ ERROR: La carpeta '{CARPETA_IMAGENES}' no existe.")
        print("✅ Crea una carpeta llamada 'imagenes' en la misma ubicación que este script.")
        input("Presiona Enter para salir...")
        return

    # 2. Verificar si es una carpeta (no un archivo)
    if not os.path.isdir(CARPETA_IMAGENES):
        print(f"❌ ERROR: '{CARPETA_IMAGENES}' existe pero no es una carpeta.")
        input("Presiona Enter para salir...")
        return

    # 3. Listar archivos en la carpeta
    try:
        archivos = os.listdir(CARPETA_IMAGENES)
        print(f"📁 Encontrados {len(archivos)} archivos en '{CARPETA_IMAGENES}':")
        for f in archivos:
            print(f"   - {f}")
    except Exception as e:
        print(f"❌ ERROR al leer la carpeta: {e}")
        input("Presiona Enter para salir...")
        return

    # 4. Filtrar imágenes y excluir recursos
    imagenes_validas = []
    extensiones_validas = ('.jpg', '.jpeg', '.png', '.gif', '.JPG', '.JPEG', '.PNG', '.GIF')

    for archivo in archivos:
        ruta_completa = os.path.join(CARPETA_IMAGENES, archivo)
        if not os.path.isfile(ruta_completa):
            continue
        if not archivo.lower().endswith(extensiones_validas):
            print(f"⏭️  Saltando (no es imagen): {archivo}")
            continue

        nombre_base = normalizar_nombre(archivo)
        if nombre_base in [normalizar_nombre(f) for f in IMAGENES_EXCLUIDAS]:
            print(f"⏭️  Saltando (recurso): {archivo}")
            continue

        # Usar extensión .jpg en minúsculas
        ruta_relativa = f"imagenes/{nombre_base}.jpg"
        imagenes_validas.append(archivo)
        print(f"✅ Imagen válida encontrada: {archivo}")

    if len(imagenes_validas) == 0:
        print("❌ No se encontraron imágenes válidas en la carpeta 'imagenes/'.")
        print("Asegúrate de que hay archivos .jpg, .png, etc.")
        input("Presiona Enter para salir...")
        return

    # 5. Generar lista de obras
    obras = []
    for i, archivo in enumerate(imagenes_validas):
        nombre_base = normalizar_nombre(archivo)
        estilo = ESTILOS[i % len(ESTILOS)]  # Asignar estilo cíclicamente

        obra = {
            "imagen": f"imagenes/{nombre_base}.jpg",
            "titulo": {
                "es": f"Obra {i + 1}",
                "en": f"Artwork {i + 1}",
                "fr": f"Œuvre {i + 1}",
                "ja": f"作品 {i + 1}"
            },
            "descripcion": {
                "es": f"Esta obra pertenece al estilo {estilo}. Descubre su significado.",
                "en": f"This artwork belongs to the {estilo} style. Discover its meaning.",
                "fr": f"Cette œuvre appartient au style {estilo}. Découvrez sa signification.",
                "ja": f"この作品は{estilo}様式に属しています。その意味を発見してください。"
            },
            "estilo": estilo
        }
        obras.append(obra)

    # 6. Crear datos finales
    datos = {
        "texto_inicio": TEXTO_INICIO,
        "estilos": ESTILOS,
        "obras": obras
    }

    # 7. Guardar obras.json
    try:
        with open(ARCHIVO_SALIDA, 'w', encoding='utf-8') as f:
            json.dump(datos, f, ensure_ascii=False, indent=4)
        print(f"\n✅ ¡ÉXITO! '{ARCHIVO_SALIDA}' ha sido creado correctamente.")
        print(f"📁 Ruta: {os.path.abspath(ARCHIVO_SALIDA)}")
        print(f"🖼️  {len(obras)} obras agregadas.")
    except Exception as e:
        print(f"❌ ERROR al guardar '{ARCHIVO_SALIDA}': {e}")
        print("💡 Posibles causas: permisos, disco lleno, nombre de archivo inválido.")
        input("Presiona Enter para salir...")
        return

    input(f"\n✨ Todo listo. Presiona Enter para cerrar...")


if __name__ == "__main__":
    generar_obras()