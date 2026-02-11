import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Addemployee() {
  const [emp, setEmp] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category_id: "",
    image: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/category")
      .then((result) => {
        console.log(result.data);
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(emp);

    const formData = new FormData();
    formData.append("name", emp.name);
    formData.append("email", emp.email);
    formData.append("password", emp.password);
    formData.append("salary", emp.salary);
    formData.append("address", emp.address);
    formData.append("image", emp.image);
    formData.append("category_id", emp.category_id);

    axios
      .post("http://localhost:5000/auth/add_employee", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/emp");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container mt-4 w-25">
      <h2 className="mb-4">Add New Employee</h2>
      <form
        className="p-4 border rounded bg-light shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label for="inputName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            placeholder="Enter employee name"
            required
            onChange={(e) => setEmp({ ...emp, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label for="inputemail4" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="inputemail4"
            placeholder="Enter email"
            required
            onChange={(e) => setEmp({ ...emp, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label for="inputPassword4" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            placeholder="Enter password"
            required
            onChange={(e) => setEmp({ ...emp, password: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            type="number"
            className="form-control"
            id="inputSalary"
            placeholder="Enter salary"
            autoComplete="off"
            required
            onChange={(e) => setEmp({ ...emp, salary: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="Enter address"
            autoComplete="off"
            required
            onChange={(e) => setEmp({ ...emp, address: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="form-select"
            required
            onChange={(e) => setEmp({ ...emp, category_id: e.target.value })}
          >
            <option value="">-- Select Category --</option>
            {category.map((c, i) => (
              <option
                key={i}
                value={c.id || c.category_id} 
              >
                {c.name || c.category_name} 
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 mb-3">
          <label className="form-label" for="inputGroupFile01">
            Select Image
          </label>
          <input
            type="file"
            className="form-control rounded-0"
            id="inputGroupFile01"
            name="image"
            required
            onChange={(e) => setEmp({ ...emp, image: e.target.files[0] })}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default Addemployee;