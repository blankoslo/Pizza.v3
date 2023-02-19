from app.models.image import Image
from app.models.image_schema import ImageSchema

class ImageService:
    def get(self, filters, order_by, page, per_page):
        _order_by = None
        if order_by:
            _order_by = Image.uploaded_at.asc if order_by == 'ASC' else Image.uploaded_at.desc
        return Image.get(filters = filters, order_by=_order_by, page = page, per_page = per_page)

    def get_by_id(self, image_id):
        return Image.get_by_id(image_id)

    def delete(self, image_id):
        Image.delete(image_id)

    def add(self, data):
        image_schema = ImageSchema()
        image = image_schema.load(data=data, partial=True)
        return Image.upsert(image)
