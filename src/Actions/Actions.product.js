import toast from "react-hot-toast";

const addToCart = ({slug,cart,setCart}) => {
    setCart([...cart, slug]);
    // console.log(slug);
    
    localStorage.setItem(
      "cart",
        [...cart, slug]
    );
    toast.success("Item Added to cart");
    // console.log(cart,'cart data');
  }

export default addToCart;