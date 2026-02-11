import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./hm.css";

function Category() {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    axios
      .get("https://employee-management-system-backend-rz80.onrender.com/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []); // here adding array will update the new value or the changes we made
  return (
  <div className="main-content">
    <div className="page-inner">
      <div className="category-container">
        <div className="category-actions">
          <h3>Category list</h3>
          <Link to="/dashboard/add_category" className="btn btn-success">Add category</Link>
        </div>

        <div className="category-card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Name</th></tr>
              </thead>
              <tbody>
                {category.length > 0 ? (
                  category.map((c, i) => (
                    <tr key={i}><td>{c.name || c.Name}</td></tr>
                  ))
                ) : (
                  <tr><td>No data found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
);

}

export default Category;
