import AddToCart from "./AddToCart";

export default function ProductCard() {
  return (
    <div className="p-5 bg-red-300 my-5 text-xl hover:bg-red-800">
      <AddToCart />
    </div>
  );
}
