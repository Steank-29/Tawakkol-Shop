import Tshirt from "../assets/product/T-shirt-Sport.png"
import Tshirtb from "../assets/product/T-shirt-Black-Sport.png"
import Sleeve from "../assets/product/Sleeveless-Sport.png"
import Sleeveb from "../assets/product/Sleeveless-Sport-Black.png"
import Short from "../assets/product/Short-Sport.png"
import Shortb from "../assets/product/Short-Sport-Black.png"
import Pants from "../assets/product/Pants-Sport.png"
import Pantsb from "../assets/product/Pants-Sport-White.png"
import Long from "../assets/product/Long-Sleeve-Sport.png"
import Longb from "../assets/product/Long-Sleeve-Sport-black.png"
import Hoodie from "../assets/product/Hoodie-Sport.png"
import Hoodieb from "../assets/product/Hoodie-Sport-Black.png"


const products = [
{
  _id: "6987d4f28ff9383b215e949f",
  name: "Hoodie",
  description: "Performance-driven hoodie with a lightweight feel, athletic fit, and clean design—built for training, movement, and everyday sport style.",
  price: 50,
  category: "Sport",
  sizes: ["XS","S","L","M","XL","2XL"],
  colors: [
    {
      name: "Arctic White",
      value: "#ffffff",
      _id: "6987d4f28ff9383b215e94a0"
    },
    {
      name: "Midnight Black",
      value: "#000000",
      _id: "6987d4f28ff9383b215e94a1"
    }
  ],
  mainImage: {
    public_id: "tawakkol/sport/hoodie-1770509548832-166006108",
    url: Hoodie,
    storage: "cloudinary"
  },
  additionalImages: [
    {
      public_id: "tawakkol/sport/hoodie-1770509551271-357491038",
      url: Hoodieb,
      storage: "cloudinary",
      _id: "6987d4f28ff9383b215e94a2"
    }
  ],
  stock: 200,
  isActive: true,
  createdBy: "69853d7aaec693c2c1824889",
  updatedBy: "69853d7aaec693c2c1824889",
  createdAt: "2026-02-08T00:12:34.039Z",
  updatedAt: "2026-02-08T00:12:34.049Z",
  __v: 0
},

{
  _id: "6987d5e18ff9383b215e94a5",
  name: "T-shirt",
  description: "Athletic T-shirt made with lightweight, breathable fabric and a modern fit—designed for performance, comfort, and everyday training style.",
  price: 40,
  category: "Sport",
  sizes: ["S","XS","M","L","XL","2XL"],
  colors: [
    {
      name: "Arctic White",
      value: "#ffffff",
      _id: "6987d5e18ff9383b215e94a6"
    },
    {
      name: "Midnight Black",
      value: "#000000",
      _id: "6987d5e18ff9383b215e94a7"
    }
  ],
  mainImage: {
    public_id: "tawakkol/sport/t-shirt-1770509788580-463741783",
    url: Tshirt,
    storage: "cloudinary"
  },
  additionalImages: [
    {
      public_id: "tawakkol/sport/t-shirt-1770509790851-659810367",
      url: Tshirtb,
      storage: "cloudinary",
      _id: "6987d5e18ff9383b215e94a8"
    }
  ],
  stock: 200,
  isActive: true,
  createdBy: "69853d7aaec693c2c1824889",
  updatedBy: "69853d7aaec693c2c1824889",
  createdAt: "2026-02-08T00:16:33.395Z",
  updatedAt: "2026-02-08T00:16:33.401Z",
  __v: 0
},

{
  _id: "6987d7aa8ff9383b215e94ab",
  name: "Short",
  description: "Sport shorts designed with lightweight, breathable fabric and an athletic fit—built for freedom of movement, comfort, and high-performance training.",
  price: 39.99,
  category: "Sport",
  sizes: ["S","XS","M","L","XL","2XL"],
  colors: [
    {
      name: "Arctic White",
      value: "#ffffff",
      _id: "6987d7aa8ff9383b215e94ac"
    },
    {
      name: "Midnight Black",
      value: "#000000",
      _id: "6987d7aa8ff9383b215e94ad"
    }
  ],
  mainImage: {
    public_id: "tawakkol/sport/short-1770510247234-101700040",
    url: Short,
    storage: "cloudinary"
  },
  additionalImages: [
    {
      public_id: "tawakkol/sport/short-1770510248502-909982723",
      url: Shortb,
      storage: "cloudinary",
      _id: "6987d7aa8ff9383b215e94ae"
    }
  ],
  stock: 200,
  isActive: true,
  createdBy: "69853d7aaec693c2c1824889",
  updatedBy: "69853d7aaec693c2c1824889",
  createdAt: "2026-02-08T00:24:10.652Z",
  updatedAt: "2026-02-08T00:37:07.297Z",
  __v: 0
},

{
  _id: "6987d8958ff9383b215e94b1",
  name: "Sleeveless T-shirt",
  description: "Sleeveless athletic T-shirt made with lightweight, breathable fabric and a performance fit—designed for maximum mobility, airflow, and intense training sessions.",
  price: 40,
  category: "Sport",
  sizes: ["XS","S","M","L","XL","2XL"],
  colors: [
    {
      name: "Midnight Black",
      value: "#000000",
      _id: "6987d8958ff9383b215e94b2"
    },
    {
      name: "Arctic White",
      value: "#ffffff",
      _id: "6987d8958ff9383b215e94b3"
    }
  ],
  mainImage: {
    public_id: "tawakkol/sport/sleeveless-t-shirt-1770510481363-671795767",
    url: Sleeve,
    storage: "cloudinary"
  },
  additionalImages: [
    {
      public_id: "tawakkol/sport/sleeveless-t-shirt-1770510482788-780826988",
      url: Sleeveb,
      storage: "cloudinary",
      _id: "6987d8958ff9383b215e94b4"
    }
  ],
  stock: 200,
  isActive: true,
  createdBy: "69853d7aaec693c2c1824889",
  updatedBy: "69853d7aaec693c2c1824889",
  createdAt: "2026-02-08T00:28:05.453Z",
  updatedAt: "2026-02-08T00:28:05.453Z",
  __v: 0
},

{
  _id: "6987da428ff9383b215e94bd",
  name: "Long Sleeve Shirt",
  description: "Long-sleeve athletic shirt made with lightweight, breathable fabric and a performance fit—designed for warmth, flexibility, and all-day training comfort.",
  price: 50,
  category: "Sport",
  sizes: ["XS","S","M","L","XL","2XL"],
  colors: [
    {
      name: "Midnight Black",
      value: "#000000",
      _id: "6987da428ff9383b215e94be"
    },
    {
      name: "Arctic White",
      value: "#ffffff",
      _id: "6987da428ff9383b215e94bf"
    }
  ],
  mainImage: {
    public_id: "tawakkol/sport/long-sleeve-shirt-1770941573924-408944639",
    url: Longb,
    storage: "cloudinary"
  },
  additionalImages: [
    {
      public_id: "tawakkol/sport/long-sleeve-shirt-1770510911490-610280299",
      url: Long,
      storage: "cloudinary",
      _id: "6987da428ff9383b215e94c0"
    }
  ],
  stock: 200,
  isActive: true,
  createdBy: "69853d7aaec693c2c1824889",
  updatedBy: "69853d7aaec693c2c1824889",
  createdAt: "2026-02-08T00:35:14.935Z",
  updatedAt: "2026-02-13T00:12:55.745Z",
  __v: 0
}
];

export default products;