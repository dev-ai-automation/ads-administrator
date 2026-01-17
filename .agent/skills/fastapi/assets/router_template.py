from typing import Annotated
from fastapi import APIRouter, Depends

# Template for a new API router module


async def get_dependency():
    """Example dependency function."""
    return {"example": "value"}


DepType = Annotated[dict, Depends(get_dependency)]

router = APIRouter(
    prefix="/example",
    tags=["example"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def read_items(dep: DepType):
    """Example GET endpoint."""
    return {"items": [], "dependency": dep}


@router.get("/{item_id}")
async def read_item(item_id: int, dep: DepType):
    """Example GET by ID endpoint."""
    return {"item_id": item_id, "dependency": dep}


@router.post("/")
async def create_item(dep: DepType):
    """Example POST endpoint."""
    return {"created": True}
