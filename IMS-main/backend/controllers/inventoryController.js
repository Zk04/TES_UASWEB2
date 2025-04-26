const item = require("../models/item");
const Seller = require("../models/seller");
const Category = require("../models/category");
const Brand = require("../models/brand");
const Sale = require("../models/sale");
const StockHistory = require("../models/stockHistory");


exports.createItem = async (req, res) => {
  try {
    console.log(req.body);
    const { name, stock, price, category, brand, seller, description } = req.body;

    
    if (!name || !stock || !price || !category || !brand || !seller) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    
    const existingBrand = await Brand.findOne({ name: brand });
    if (!existingBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    
    const existingSeller = await Seller.findOne({ name: seller });
    if (!existingSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    
    const newItem = new item({
      name,
      stock,
      price,
      category: existingCategory._id,
      brand: existingBrand._id,
      seller: existingSeller._id,
      description,
    });

    
    const savedItem = await newItem.save();

    res.status(201).json({ message: "Product added successfully", item: savedItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};


exports.getItem = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand, minPrice, maxPrice, search } = req.query;

    const query = {};

    
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) query.name = { $regex: search, $options: "i" };

    
    const skip = (page - 1) * limit;
    const totalItems = await item.countDocuments(query);
    const items = await item
      .find(query)
      .populate("category brand seller")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.status(200).json({
      items,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};


exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, seller, brand } = req.body;

    
    const existingCategory = await Category.findOne({ name: category });
    const existingSeller = await Seller.findOne({ name: seller });
    const existingBrand = await Brand.findOne({ name: brand });

    if (!existingCategory || !existingSeller || !existingBrand) {
      return res.status(404).json({ 
        message: "One or more references (category, seller, or brand) not found" 
      });
    }

    const updatedItem = await item.findByIdAndUpdate(
      id,
      {
        name,
        price,
        stock,
        category: existingCategory._id,
        seller: existingSeller._id,
        brand: existingBrand._id,
      },
      { new: true }
    ).populate('category brand seller');

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ 
      message: "Item updated successfully", 
      item: updatedItem 
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ 
      message: "Error updating item", 
      error: error.message 
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await item.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ 
      message: "Item deleted successfully",
      item: deletedItem 
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ 
      message: "Error deleting item", 
      error: error.message 
    });
  }
};

exports.sellItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const inventoryItem = await item.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (inventoryItem.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const updatedItem = await item.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true }
    );

    const sale = new Sale({
      item: id,
      itemName: inventoryItem.name,
      price: inventoryItem.price,
      quantity: quantity,
      total: inventoryItem.price * quantity
    });
    await sale.save();

    res.status(200).json({ 
      message: "Item sold successfully", 
      item: updatedItem,
      sale: sale 
    });
  } catch (error) {
    res.status(500).json({ message: "Error selling item", error });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedItem = await item.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    );

    const stockHistory = new StockHistory({ item: id, quantity });
    await stockHistory.save();

    res.status(200).json({ message: "Stock added successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding stock", error });
  }
};

exports.createSeller = async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const seller = new Seller({ name });
    await seller.save();
    res.status(201).json({ message: "Seller created successfully", seller });
  } catch (error) {
    res.status(500).json({ message: "Error creating seller", error });
  }
};

exports.createCategory = async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

exports.createBrand = async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const brand = new Brand({ name });
    await brand.save();
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (error) {
    res.status(500).json({ message: "Error creating brand", error });
  }
};

exports.getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brands", error });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedItem = await item.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    );

    res.status(200).json({ message: "Stock added successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding stock", error });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate({
        path: 'item',
        select: 'name category brand',
        populate: [
          { path: 'category', select: 'name' },
          { path: 'brand', select: 'name' }
        ]
      })
      .sort({ date: -1 });
    
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching sales data", 
      error: error.message 
    });
  }
}; 

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSale = await Sale.findByIdAndDelete(id);
    
    if (!deletedSale) {
      return res.status(404).json({ message: "Sale record not found" });
    }

    res.status(200).json({ 
      message: "Sale record deleted successfully",
      sale: deletedSale 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting sale record", 
      error: error.message 
    });
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    const stockHistory = await StockHistory.find().populate("item", "name");
    res.status(200).json(stockHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock history", error });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalStock = await item.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } }
    ]);
    
    const salesStats = await Sale.aggregate([
      { 
        $group: { 
          _id: null, 
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" }
        } 
      }
    ]);

    res.json({
      totalStock: totalStock[0]?.total || 0,
      totalItemSold: salesStats[0]?.totalSold || 0,
      totalRevenue: salesStats[0]?.totalRevenue || 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

exports.getDailySales = async (req, res) => {
  try {
    const dailySales = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          revenue: { $sum: "$total" },
          quantity: { $sum: "$quantity" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          revenue: 1,
          quantity: 1,
          _id: 0
        }
      }
    ]);

    res.json(dailySales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching daily sales", error });
  }
};