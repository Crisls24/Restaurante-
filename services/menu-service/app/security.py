import os

import httpx
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request

load_dotenv()

AUTH_SERVICE_URL = os.getenv(
    "AUTH_SERVICE_URL",
    "https://restaurante-production-36c3.up.railway.app/api",
)


async def get_identity(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    token = auth_header[len("Bearer ") :].strip()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{AUTH_SERVICE_URL.rstrip('/')}/auth/verify",
                headers={"Authorization": f"Bearer {token}"},
            )
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Servicio de autenticacion no disponible")

    if resp.status_code == 401:
        raise HTTPException(status_code=401, detail="Token invalido o expirado")
    if resp.status_code != 200:
        raise HTTPException(status_code=503, detail="Servicio de autenticacion no disponible")

    identity = resp.json()
    if not identity.get("sub"):
        raise HTTPException(status_code=401, detail="Token invalido")

    return identity


async def require_admin(identity: dict = Depends(get_identity)) -> dict:
    if identity.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="Se requiere rol admin")
    return identity
