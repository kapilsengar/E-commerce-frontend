import React, { useState, useEffect, useCallback } from "react";
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import url from "../backendUrl";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // console.log(url, "asdfghjk");

  // Get all categories
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(url+"/api/v1/category/get-category");
      if (data?.success) {
        // console.log(data.category, "home page 25");
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Get total count
  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get(url+"/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, [getAllCategory, getTotal]);

  // Get all products
  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}/api/v1/product/product-list/${page}`);
      setLoading(false);
      console.log(data,"asdfghj");
      
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [page]);

  // Load more products
  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [page, products]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page, loadMore]);

  // Filter products by category or price
  const filterProduct = useCallback(async () => {
    try {
      const { data } = await axios.post(url+"/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  }, [checked, radio]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length, getAllProducts]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio, filterProduct]);

  return (
    <Layout title={"ALl Products - Best offers "}>
      <div className="container-fluid row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* Price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 offset-1">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> ₹ {p.price}</p>
                  <div className="d-flex">
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-secondary ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Load more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default HomePage;
