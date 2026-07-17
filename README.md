# InstaShop 2027 | Amazon Affiliate Storefront

A premium, high-performance static storefront website optimized for mobile users coming from your Instagram bio (@insta_shop_2027). The site is built with vanilla HTML, CSS, and JS, making it extremely fast, completely free to host, and fully compatible with GitHub Pages with **zero configuration**.

## 🚀 Live Demo & Hosting
To host this site for free on GitHub Pages:
1. Push this directory to a public repository on GitHub.
2. Go to the repository **Settings** > **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** and set the branch to `main` (or `master`) and the folder to `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/` in a few minutes!

---

## 📂 File Structure
* `index.html` - The webpage markup, structured with SEO best practices and Open Graph tags.
* `style.css` - Custom styling featuring premium dark theme, glassmorphic UI, responsive layouts, and animations.
* `script.js` - Dynamic sorting, filtering, searching, date calculations, and sharing triggers.
* `products.json` - The single source of truth for all products. Adding or editing products here updates the website instantly without changing any code.
* `assets/` - Directory for profile pictures, logos, and product lifestyle photos.

---

## 📦 How to Add a New Product
Open `/products.json` and append a new product object inside the array. 

### Product Data Schema:
```json
  {
    "id": "unique-product-id",
    "title": "Clean, Descriptive Title of the Product",
    "image": "assets/your_product_image.png",
    "price": "₹1,299",
    "description": "Short, catchy product description (1-2 lines max).",
    "amazonLink": "https://www.amazon.in/dp/YOUR_AFFILIATE_TAG",
    "category": "Home",
    "dateAdded": "YYYY-MM-DD",
    "pinned": false
  }
```

### Key Properties:
* **`id`**: Must be a unique string (e.g., `magnetic-desk-organizer`).
* **`category`**: The category name (e.g., `"Home"`, `"Tech"`, `"Fashion"`, `"Kitchen"`). The website automatically scans this field and adds new filter buttons at the top of the grid!
* **`dateAdded`**: ISO date format (`YYYY-MM-DD`). Products added within the last **7 days** automatically receive a glowing `🆕 New` badge.
* **`pinned`**: Set to `true` to keep a product at the top of the page (e.g., high-margin or trending products). Pinned items are marked with a `📌 Pinned` badge.

---

## ⚡ Sorting Logic
The website sorts products client-side automatically using this hierarchy:
1. **Pinned** products (`pinned: true`) always appear first.
   * If there are multiple pinned products, they are sorted by `dateAdded` descending (newest pinned first).
2. **Non-pinned** products follow.
   * Sorted by `dateAdded` descending (newest added first).

---

## ⚖️ Legal & FTC Compliance
Amazon Associates program terms and FTC guidelines require you to prominently declare your affiliate relationship. This site has built-in compliance:
1. **Top Banner**: A clear affiliate notice displayed at the top of the viewport on all devices.
2. **Footer Details**: A comprehensive legal disclosure in the footer detailing how links function.

---

## 🛠️ Local Development & Testing
To view the site locally on your computer, you can run a simple local web server. Opening `index.html` directly in a browser may cause issues due to CORS (browser security blocking local file fetches of `products.json`).

### Run via Python (Recommended):
Open your terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Run via Node/npm (Alternative):
If you have Node.js installed, you can use `http-server` or `live-server`:
```bash
npx http-server
```
