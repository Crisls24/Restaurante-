"""Seed script para popular MongoDB con datos de ejemplo."""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://mongoadmin:mongopass@localhost:27017/reservaciones?authSource=admin")
MONGODB_DB = "reservaciones"

MENU_ITEMS = [
    {
        "nombre": "Tacos de Res",
        "descripcion": "3 tacos de res asada con cebolla, cilantro y salsa",
        "categoria": "Platillo principal",
        "precio": 89.00,
        "imagen_url": "https://restaurante.com/img/tacos-res.jpg",
        "disponible": True,
        "ingredientes": ["res", "cebolla", "cilantro", "tortilla"],
        "alergenos": ["gluten"],
        "opciones": [
            {"nombre": "Sin cebolla", "costo_extra": 0},
            {"nombre": "Extra queso", "costo_extra": 15.00},
        ],
        "tiempo_preparacion_min": 15,
        "calorias": 450,
        "tags": ["popular", "picante"],
    },
    {
        "nombre": "Ensalada Caesar",
        "descripcion": "Lechuga romana, crutones, parmesano y aderezo Caesar",
        "categoria": "Entrada",
        "precio": 75.00,
        "imagen_url": "https://restaurante.com/img/ensalada-caesar.jpg",
        "disponible": True,
        "ingredientes": ["lechuga", "crutones", "queso parmesano", "aderezo"],
        "alergenos": ["gluten", "lactosa"],
        "opciones": [
            {"nombre": "Sin crutones", "costo_extra": 0},
            {"nombre": "Con pollo", "costo_extra": 25.00},
        ],
        "tiempo_preparacion_min": 10,
        "calorias": 280,
        "tags": ["ligero", "saludable"],
    },
    {
        "nombre": "Sopa de Tortilla",
        "descripcion": "Sopa de tomate con tiras de tortilla crujiente, aguacate y crema",
        "categoria": "Entrada",
        "precio": 65.00,
        "imagen_url": "https://restaurante.com/img/sopa-tortilla.jpg",
        "disponible": True,
        "ingredientes": ["tomate", "tortilla", "aguacate", "crema", "chile"],
        "alergenos": ["gluten", "lactosa"],
        "opciones": [],
        "tiempo_preparacion_min": 12,
        "calorias": 320,
        "tags": ["clasico", "picante"],
    },
    {
        "nombre": "Pechuga a la Plancha",
        "descripcion": "Pechuga de pollo marinada con arroz verde y ensalada",
        "categoria": "Platillo principal",
        "precio": 120.00,
        "imagen_url": "https://restaurante.com/img/pechuga-plancha.jpg",
        "disponible": True,
        "ingredientes": ["pollo", "arroz", "lechuga", "tomate", "limon"],
        "alergenos": [],
        "opciones": [
            {"nombre": "Cambiar a pasta", "costo_extra": 10.00},
            {"nombre": "Extra arroz", "costo_extra": 15.00},
        ],
        "tiempo_preparacion_min": 20,
        "calorias": 520,
        "tags": ["recomendado"],
    },
    {
        "nombre": "Chile en Nogada",
        "descripcion": "Chile poblano relleno de picadillo, nogada y granada (temporada)",
        "categoria": "Platillo principal",
        "precio": 185.00,
        "imagen_url": "https://restaurante.com/img/chile-nogada.jpg",
        "disponible": True,
        "ingredientes": ["chile poblano", "carne molida", "nogada", "granada", "durazno"],
        "alergenos": ["nueces"],
        "opciones": [],
        "tiempo_preparacion_min": 25,
        "calorias": 580,
        "tags": ["temporada", "especial"],
    },
    {
        "nombre": "Agua de Horchata",
        "descripcion": "Bebida tradicional de arroz con canela (vaso 500ml)",
        "categoria": "Bebida",
        "precio": 35.00,
        "imagen_url": "https://restaurante.com/img/horchata.jpg",
        "disponible": True,
        "ingredientes": ["arroz", "canela", "azucar"],
        "alergenos": [],
        "opciones": [
            {"nombre": "Sin azucar", "costo_extra": 0},
            {"nombre": "Jarra 1L", "costo_extra": 30.00},
        ],
        "tiempo_preparacion_min": 2,
        "calorias": 180,
        "tags": ["tradicional"],
    },
    {
        "nombre": "Flan Napolitano",
        "descripcion": "Flan casero con caramelo y fresas",
        "categoria": "Postre",
        "precio": 55.00,
        "imagen_url": "https://restaurante.com/img/flan.jpg",
        "disponible": True,
        "ingredientes": ["huevo", "leche", "azucar", "fresa"],
        "alergenos": ["lactosa", "huevo"],
        "opciones": [
            {"nombre": "Sin fresas", "costo_extra": 0},
        ],
        "tiempo_preparacion_min": 5,
        "calorias": 350,
        "tags": ["postre", "popular"],
    },
    {
        "nombre": "Michelada Preparada",
        "descripcion": "Cerveza con limon, salsa Valentina, chamoy y chamoyada",
        "categoria": "Bebida",
        "precio": 70.00,
        "imagen_url": "https://restaurante.com/img/michelada.jpg",
        "disponible": True,
        "ingredientes": ["cerveza", "limon", "salsa valentina", "chamoy", "sal"],
        "alergenos": ["gluten"],
        "opciones": [
            {"nombre": "Sin chile", "costo_extra": 0},
            {"nombre": "Con camarones", "costo_extra": 40.00},
        ],
        "tiempo_preparacion_min": 5,
        "calorias": 220,
        "tags": ["popular", "alcohol"],
    },
]

MESAS = [
    {"numero": 1, "capacidad": 2, "ubicacion": "Interior", "disponible": True, "caracteristicas": ["ventana"], "activa": True},
    {"numero": 2, "capacidad": 2, "ubicacion": "Interior", "disponible": True, "caracteristicas": ["ventana"], "activa": True},
    {"numero": 3, "capacidad": 4, "ubicacion": "Interior", "disponible": True, "caracteristicas": [], "activa": True},
    {"numero": 4, "capacidad": 4, "ubicacion": "Interior", "disponible": True, "caracteristicas": [], "activa": True},
    {"numero": 5, "capacidad": 6, "ubicacion": "Terraza", "disponible": True, "caracteristicas": ["vista al jardin", "techada"], "activa": True},
    {"numero": 6, "capacidad": 8, "ubicacion": "Terraza", "disponible": True, "caracteristicas": ["vista al jardin", "techada"], "activa": True},
    {"numero": 7, "capacidad": 10, "ubicacion": "Salon privado", "disponible": True, "caracteristicas": [" privado", "proyector"], "activa": True},
    {"numero": 8, "capacidad": 4, "ubicacion": "Interior", "disponible": True, "caracteristicas": ["bar"], "activa": True},
]


async def seed():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB]

    await db["menu_items"].delete_many({})
    await db["mesas"].delete_many({})

    result_menu = await db["menu_items"].insert_many(MENU_ITEMS)
    print(f"Inserted {len(result_menu.inserted_ids)} menu items")

    result_mesas = await db["mesas"].insert_many(MESAS)
    print(f"Inserted {len(result_mesas.inserted_ids)} mesas")

    client.close()
    print("Seed completed!")


if __name__ == "__main__":
    asyncio.run(seed())
