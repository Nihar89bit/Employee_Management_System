import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


function EditEmployee() {
  const navigate =useNavigate();
    const {id}=useParams();   //useparam hooks help to take id from url that we hv passed
    const [emp,setEmp]= useState({
        name: '',
        email: '',
        salary: '',
        address: '',
        category_id:'',
      });
      const [category, setCategory] = useState([]);
  useEffect(() => {
    axios
      .get("https://employee-management-system-backend-rz80.onrender.comauth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
      axios.get('https://employee-management-system-backend-rz80.onrender.com/auth/employee/'+id)
      .then(result =>{
        setEmp({
          ...emp,
          name:result.data.Result[0].name,
          email:result.data.Result[0].email,
          address:result.data.Result[0].address,
          salary:result.data.Result[0].salary,
          category_id:result.data.Result[0].category_id,
            })
      }).catch(err => console.log(err))
  }, [])

  const handleSubmit = (e) =>{
    e.preventDefault()
    axios.put('https://employee-management-system-backend-rz80.onrender.com/auth/editEmp/'+id, emp)
    .then(result =>{
      if(result.data.Status){
        navigate('/dashboard/emp')
      }
    }).catch(err => console.log(err))
  }


    return (
    <div className="container mt-4 w-25">
      <h2 className="mb-4">Edit Employee</h2>
      <form className="p-4 border rounded bg-light shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label for="inputName" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            placeholder="Enter employee name"
            value={emp.name}
            required
            onChange={(e)=> setEmp({...emp,name:e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label for="inputemail4" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="inputemail4"
            placeholder="Enter email"
            value={emp.email}
            required
             onChange={(e)=> setEmp({...emp,email:e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            type="number"
            className="form-control"
            id="inputSalary"
            placeholder="Enter salary"
            autoComplete='off'
            value={emp.salary}
            required
             onChange={(e)=> setEmp({...emp,salary:e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="Enter address"
            autoComplete='off'
            value={emp.address}
            required
             onChange={(e)=> setEmp({...emp,address:e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label for="category" className="form-label">Category</label>
          <select name="category" id="category" className='form-select'
           onChange={(e)=> setEmp({...emp,category_id:e.target.value})}>
            {category.map((c,i)=>{
              return <option key={i} value={c.id}>{c.name}</option>
            })}
          </select>
        </div> 

        <button type="submit" className="btn btn-primary w-100">
          Edit Employee
        </button>
      </form>
    </div>
  )
}

export default EditEmployee
