"""
models.py - Modelos Pydantic para validación de datos
"""
from pydantic import BaseModel, Field
from typing import Optional


class SoundModel(BaseModel):
    id: int
    sound_type: str = Field(description="Tipo: bird, water, dog, owl, music, applause")
    position_x: float = Field(ge=0, le=100)
    position_y: float = Field(ge=0, le=100)


class PageModel(BaseModel):
    id: int
    page_number: int
    image_emoji: str
    text: str
    background_color: str
    sounds: list[SoundModel] = []


class StoryListModel(BaseModel):
    id: int
    title: str
    author: str
    cover_color: str
    page_count: int


class StoryDetailModel(BaseModel):
    id: int
    title: str
    author: str
    cover_color: str
    pages: list[PageModel]
