export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Products", href: "#products" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const STATS = [
  { label: "Happy customers", value: "10k+" },
  { label: "Average rating", value: "4.9/5" },
  { label: "Typical delivery", value: "48h" },
  { label: "Brands and makers", value: "120+" },
];

export const FEATURES = [
  { icon: "truck", title: "Fast delivery", text: "Most orders leave our warehouse the same day and arrive within two days." },
  { icon: "shield", title: "Secure checkout", text: "Your payment details are encrypted and never shared with third parties." },
  { icon: "refresh", title: "Easy returns", text: "Changed your mind? Send items back within 30 days for a full refund." },
  { icon: "tag", title: "Fair prices", text: "We work directly with makers so you skip the markup and keep the savings." },
  { icon: "headset", title: "Friendly support", text: "Real people answer your questions seven days a week, usually within minutes." },
  { icon: "star", title: "Curated quality", text: "Every product is tested and reviewed by our team before it reaches the shop." },
];

export const PRODUCTS = [
  { id: "p-headphones", name: "Wireless Headphones", blurb: "40-hour battery, soft ear cushions.", price: 89, tone: "indigo" },
  { id: "p-bottle", name: "Insulated Water Bottle", blurb: "Keeps drinks cold for a full day.", price: 24, tone: "pink" },
  { id: "p-backpack", name: "Everyday Backpack", blurb: "Water-resistant with a padded laptop sleeve.", price: 59.5, tone: "violet" },
  { id: "p-lamp", name: "Desk Lamp", blurb: "Dimmable warm light with USB charging.", price: 39, tone: "amber" },
  { id: "p-mug", name: "Ceramic Coffee Mug", blurb: "Hand-glazed, dishwasher safe, 12 oz.", price: 18, tone: "teal" },
  { id: "p-speaker", name: "Portable Speaker", blurb: "Rich sound that fits in your hand.", price: 49.99, tone: "rose" },
];

export const STEPS = [
  { title: "Browse", text: "Explore hundreds of products sorted by what shoppers love most." },
  { title: "Order", text: "Add items to your cart and check out securely in under a minute." },
  { title: "Enjoy", text: "We pack and ship fast, and you can return anything within 30 days." },
];

export const TESTIMONIALS = [
  { quote: "My order arrived in two days and the quality beat my expectations.", name: "Maria Santos", role: "Designer" },
  { quote: "Returns were painless and support answered within minutes. I am a customer for life.", name: "James Oduya", role: "Teacher" },
  { quote: "Great prices and a checkout that just works. I now buy all my gifts here.", name: "Priya Nair", role: "Engineer" },
];

export const PLANS = [
  { name: "Starter", monthly: 4, yearly: 40, perks: ["Free standard shipping on big orders", "Order tracking", "30-day returns"] },
  { name: "Plus", monthly: 9, yearly: 90, featured: true, perks: ["Free shipping on every order", "Early access to sales", "Priority support"] },
  { name: "Business", monthly: 29, yearly: 290, perks: ["Bulk order discounts", "Dedicated account manager", "Invoice billing"] },
];

export const FAQS = [
  { q: "How long does delivery take?", a: "Most orders arrive within 48 hours. Remote areas may take up to five business days." },
  { q: "What is your return policy?", a: "You can return any unused item within 30 days of delivery for a full refund." },
  { q: "Which payment methods do you accept?", a: "We accept all major credit cards, debit cards and popular digital wallets." },
  { q: "Can I change or cancel my order?", a: "Yes, you can edit or cancel an order any time before it has been shipped." },
  { q: "How do I contact support?", a: "Use the help centre or email us and a real person will reply the same day." },
];

export const FOOTER_COLUMNS = [
  { title: "Product", links: ["Features", "Pricing", "Gift cards"] },
  { title: "Company", links: ["About us", "Careers", "Press"] },
  { title: "Support", links: ["Help centre", "Shipping info", "Contact us"] },
  { title: "Legal", links: ["Privacy policy", "Terms of service", "Cookie settings"] },
];

export function formatUsd(amount) {
  return `$${Number(amount).toFixed(2)}`;
}
