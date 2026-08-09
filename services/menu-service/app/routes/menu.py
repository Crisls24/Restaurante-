from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from ..database import menu_collection
from ..schemas.menu import MenuItemCreate, MenuItemUpdate, serialize_menu_item
from ..security import require_admin

router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get("/", summary="Listar todos los platillos (HU-02)")
async def list_menu(
    categoria: Optional[str] = None,
    disponible: Optional[bool] = None,
    buscar: Optional[str] = None,
):
    """Obtiene el catalogo completo de platillos con precios."""
    query = {}
    if categoria:
        query["categoria"] = categoria
    if disponible is not None:
        query["disponible"] = disponible
    if buscar:
        query["$or"] = [
            {"nombre": {"$regex": buscar, "$options": "i"}},
            {"descripcion": {"$regex": buscar, "$options": "i"}},
            {"tags": {"$in": [buscar]}},
        ]

    items = await menu_collection.find(query).to_list(100)
    return [serialize_menu_item(item) for item in items]


@router.get("/{item_id}", summary="Obtener platillo por ID")
async def get_menu_item(item_id: str):
    item = await menu_collection.find_one({"_id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Platillo no encontrado")
    return serialize_menu_item(item)


@router.post("/", status_code=201, summary="Crear platillo (Admin)")
async def create_menu_item(dto: MenuItemCreate, _: dict = Depends(require_admin)):
    doc = dto.model_dump()
    result = await menu_collection.insert_one(doc)
    created = await menu_collection.find_one({"_id": result.inserted_id})
    return serialize_menu_item(created)


@router.put("/{item_id}", summary="Actualizar platillo (Admin)")
async def update_menu_item(item_id: str, dto: MenuItemUpdate, _: dict = Depends(require_admin)):
    update_data = {k: v for k, v in dto.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Sin datos para actualizar")

    result = await menu_collection.update_one({"_id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Platillo no encontrado")

    updated = await menu_collection.find_one({"_id": item_id})
    return serialize_menu_item(updated)


@router.delete("/{item_id}", summary="Eliminar platillo (Admin)")
async def delete_menu_item(item_id: str, _: dict = Depends(require_admin)):
    result = await menu_collection.delete_one({"_id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Platillo no encontrado")
    return {"message": "Platillo eliminado exitosamente"}
