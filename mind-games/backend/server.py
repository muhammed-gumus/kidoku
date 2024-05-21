import json
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import traceback
from typing import List
import uuid
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from fastapi import Depends
from datetime import datetime, timedelta



DATABASE_FILE = "/Users/muhammedgumus/Desktop/freelance-project/kidoku/mind-games/public/db/database.json"

app = FastAPI()

# CORS middleware
origins = ["*"]  # Gerekirse buraya "http://localhost:3000" gibi belirli origin'leri ekleyin
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Bu key'i güvenli bir yerde saklayın ve değiştirin
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/control")


def authenticate_user(username: str, password: str):
    valid_username = "admin"
    valid_password = "adminparola"
    return username == valid_username and password == valid_password


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/control")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    username = form_data.username
    password = form_data.password
    if not authenticate_user(username, password):
        raise HTTPException(
            status_code=401, detail="Invalid username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
    )
    print(f"Request handled for username: {username}")
    print(f"Access token generated: {access_token}")
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials")
        return {"username": username}
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials")


class CategoryInput(BaseModel):
    category: str


UPLOADS_DIR = "../public/images/uploads"

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)


def is_file_exists(file_path: str) -> bool:
    return os.path.exists(file_path)


@app.post("/products")
async def add_product(
    productName: str = Form(...),
    productDescription: str = Form(...),
    usageInstructions: str = Form(...),
    productSummary: str = Form(...),
    # Kategori bilgisini almak için eklenen parametre
    selectedCategory: str = Form(...),
    productImages: List[UploadFile] = File(...)
):
    try:
        image_urls = []
        for image in productImages:
            unique_filename = f"{uuid.uuid4()}_{image.filename}"

            count = 1
            while is_file_exists(os.path.join(UPLOADS_DIR, unique_filename)):
                unique_filename = f"{uuid.uuid4()}_{count}_{image.filename}"
                count += 1

            image_path_mongodb = os.path.join(UPLOADS_DIR, unique_filename)
            with open(image_path_mongodb, "wb") as f:
                f.write(await image.read())
            image_urls.append(image_path_mongodb)

        new_product = {
            "productId": str(uuid.uuid4()),  # Generate a unique productId
            "productName": productName,
            "productImages": image_urls,
            "productDescription": productDescription,
            "usageInstructions": usageInstructions,
            "productSummary": productSummary,
            "selectedCategory": selectedCategory,  # Kategori bilgisini ekleyin
        }
        print(f"productName: {productName}")
        print(f"productDescription: {productDescription}")
        print(f"usageInstructions: {usageInstructions}")
        print(f"productSummary: {productSummary}")
        print(f"selectedCategory: {selectedCategory}")

        # Gelen dosyaların adlarını yazdır
        for image in productImages:
            print(f"Uploaded file: {image.filename}")

        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            data["products"].append(new_product)

        with open(DATABASE_FILE, "w", encoding="utf-8") as db_file:
            json.dump(data, db_file, ensure_ascii=False)

        return JSONResponse(
            content={"success": True, "message": "Product added successfully"},
            status_code=201,
        )

    except Exception as e:
        print("Exception occurred while adding product:")
        print(traceback.format_exc())
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


@app.get("/productsGet", response_model=List[dict])
async def get_products():
    try:
        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            return JSONResponse(
                content={"success": True, "products": data["products"]},
                status_code=200,
            )

    except Exception as e:
        print(str(e))
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


@app.delete("/products/{product_id}")
async def delete_product(product_id: str = Path(..., title="The ID of the product to delete")):
    try:
        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            products = data["products"]
            index = None
            for i, product in enumerate(products):
                if product.get("productId") == product_id:
                    index = i
                    break

            if index is not None:
                del products[index]
                with open(DATABASE_FILE, "w", encoding="utf-8") as db_file:
                    json.dump(data, db_file, ensure_ascii=False)
                return JSONResponse(
                    content={"success": True,
                             "message": "Product deleted successfully"},
                    status_code=200,
                )
            else:
                return JSONResponse(
                    content={"success": False, "error": "Product not found"},
                    status_code=404,
                )

    except Exception as e:
        print(str(e))
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


class ContactForm(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    text: str


@app.post("/contact")
async def send_user_email(user_info: dict):
    try:
        with open(DATABASE_FILE, "r") as file:
            data = json.load(file)  # JSON dosyasını yükle

        # Gelen verileri JSON dosyasındaki "message" objesinin içine ekle
        data["message"].append(user_info)

        # JSON dosyasını güncelle, Unicode karakterleri düzgün yazmak için ensure_ascii=False kullanın
        with open(DATABASE_FILE, "w") as file:
            json.dump(data, file, indent=4, ensure_ascii=False)

        return {"success": True, "message": "User info saved successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/messages")
async def get_messages():
    try:
        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            return {"success": True, "messages": data["message"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    import asyncio

    loop = asyncio.get_event_loop()
    uvicorn.run("main:app", host="127.0.0.1",
                port=8000, reload=True, loop=loop)


@app.post("/categories")
async def add_category(category_input: CategoryInput):
    try:
        category = category_input.category.strip()
        if not category:
            return JSONResponse(
                content={"success": False,
                         "error": "Category cannot be empty"},
                status_code=400,
            )

        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            categories = data.get("categories", [])
            categories.append(category)

        with open(DATABASE_FILE, "w", encoding="utf-8") as db_file:
            data["categories"] = categories
            json.dump(data, db_file, ensure_ascii=False)

        return JSONResponse(
            content={"success": True, "message": "Category added successfully"},
            status_code=201,
        )
    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


@app.get("/categories")
async def get_categories():
    try:
        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            categories = data.get("categories", [])
            return JSONResponse(
                content={"success": True, "categories": categories},
                status_code=200,
            )
    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


@app.delete("/categories/{category}")
async def delete_category(category: str):
    try:
        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            categories = data.get("categories", [])
            if category in categories:
                categories.remove(category)
                with open(DATABASE_FILE, "w", encoding="utf-8") as db_file:
                    data["categories"] = categories
                    json.dump(data, db_file, ensure_ascii=False)
                return JSONResponse(
                    content={"success": True,
                             "message": "Category deleted successfully"},
                    status_code=200,
                )
            else:
                return JSONResponse(
                    content={"success": False, "error": "Category not found"},
                    status_code=404,
                )
    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )
