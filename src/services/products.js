import mongoose from "mongoose";
import Category from "../models/category.js";
import Product from "../models/products.js";
import fs from 'fs';

export async function createProduct(productData, file, basePath) {
  let createdProduct;

  try {
    const { category, code } = productData;

    // Asegúrate de que la carpeta de destino exista
    const uploadPath = "src/public/uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Crea la carpeta si no existe
    }

    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      throw new Error("Product with the given code already exists");
    }

    // Crea el archivo en la ubicación deseada
    fs.writeFileSync(`${uploadPath}${file.name}`, file.data);

    if (!mongoose.isValidObjectId(category)) {
      throw new Error("Invalid category");
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    productData.image = `${basePath}${file.name}`;

    if (!productData.images) {
      productData.images = [];
    }
    productData.images.push(productData.image);
    createdProduct = await Product.create(productData);
    return createdProduct
  } catch (error) {
    console.error("Error creating product:", error);

    // Si ocurrió un error, elimina la ruta de la imagen del array de imágenes
    if (productData.images && productData.images.length > 0) {
      const index = productData.images.indexOf(productData.image);
      if (index !== -1) {
        productData.images.splice(index, 1);
      }
    }

    // Si ocurrió un error, elimina el archivo creado
    const uploadPath = "public/uploads";
    if (createdProduct && fs.existsSync(`${uploadPath}${file.name}`)) {
      fs.unlinkSync(`${uploadPath}${file.name}`);
    }
    console.error("Error products:", error);
    throw error;
  }
}
export async function countProducts() {
  try {
    const count = await Product.countDocuments();
    if (!count) {
      throw new Error("No products found");
    }
    return count;
  }
   catch (error) {
    console.error("Error counting products:", error);
    throw error;
  }
}
export async function findFeatured(count) {
  try {
    const products = await Product.find({isFeatured:true}).limit(count)
    // .populate('category');
    if (!products) {
      throw new Error("No products found");
    }
    return products;
  }
   catch (error) {
    console.error("Error counting products:", error);
    throw error;
  }
}

export async function getProducts(filter) {
  try {
    
    return await Product.find(filter).populate('category');
  } catch (error) {
    console.error("Error getting products:", error);
    throw new Error("Failed to get products. Please try again later.");
  }
}

export async function getProduct(productId) {
  try {
    if(!mongoose.isValidObjectId(productId)){
      throw new Error("Invalid id");
    }
    const product = await Product.findById(productId).populate('category');
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
}


export async function updateProduct(productId, updatedProduct) {
  try {
    const { code } = updatedProduct;
       if(!mongoose.isValidObjectId(productId)){
      throw new Error("Invalid id");
    }
    const existingProductWithCode = await Product.findOne({ code });

    if (existingProductWithCode && existingProductWithCode._id.toString() !== productId) {
      throw new Error("Product with this code already exists");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    product.name = updatedProduct.name || product.name;
    product.code = updatedProduct.code || product.code;
    product.description = updatedProduct.description || product.description;
    product.richDescription = updatedProduct.richDescription || product.richDescription;
    product.image = updatedProduct.image || product.image;
    product.images = updatedProduct.images || product.images;
    product.brand = updatedProduct.brand || product.brand;
    product.price = updatedProduct.price || product.price;
    product.category = updatedProduct.category || product.category;
    product.countInStock = updatedProduct.countInStock || product.countInStock;
    product.rating = updatedProduct.rating || product.rating;
    product.isFeatured = updatedProduct.isFeatured || product.isFeatured;

    const updatedProductResult = await product.save();
    return updatedProductResult;
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw new Error("Failed to update the product. Please try again later.");
  }
}


export async function deleteProduct(productId) {
  try {
    if(!mongoose.isValidObjectId(productId)){
      throw new Error("Invalid id");
    }
    return await Product.deleteOne({ _id: productId }); 
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}