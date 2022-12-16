import logo from './logo.svg';
import './App.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import { useEffect, useState } from 'react';

function App() {

  
let baseUrl = `https://bewildered-wasp-necklace.cyclic.app`;
if (window.location.href.split(":")[0] === "http") {
    baseUrl = `http://localhost`;
}

  const [products, setProducts] = useState([])
  const [loadProduct, setLoadProduct] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)


  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products`)
      console.log("response: ", response.data);

      setProducts(response.data.data)

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/product/${id}`)
      console.log("response: ", response.data);

      setLoadProduct(!loadProduct)

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const editMode = (product) => {
    setIsEditMode(!isEditMode)
    setEditingProduct(product)

    editFormik.setFieldValue("productName", product.name)
    editFormik.setFieldValue("productPrice", product.price)
    editFormik.setFieldValue("productDescription", product.description)
   
  }

  useEffect(() => {

    getAllProducts()

  }, [loadProduct])


  const myFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: '',
    },
    validationSchema:
      yup.object({
        productName: yup
          .string('Enter your product name')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(20, "please enter within 20 characters "),

        productPrice: yup
          .number('Enter your product price')
          .positive("enter positive product price")
          .required('product name is required'),

        productDescription: yup
          .string('Enter your product Description')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(500, "please enter within 20 characters "),
      }),
    onSubmit: (values) => {
      console.log("values: ", values);

      axios.post(`${baseUrl}/product`, {
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)

        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });
  const editFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: '',
    },
    validationSchema:
      yup.object({
        productName: yup
          .string('Enter your product name')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(20, "please enter within 20 characters "),

        productPrice: yup
          .number('Enter your product price')
          .positive("enter positive product price")
          .required('product name is required'),

        productDescription: yup
          .string('Enter your product Description')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(500, "please enter within 20 characters "),
      }),
    onSubmit: (values) => {
      console.log("values: ", values);

      axios.put(`${baseUrl}/product/${editingProduct.id}`, {
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)
          setIsEditMode(!isEditMode)
        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });


  return (
    <div>
    <div className="nav">
      <div className='logo'>Ecommers Website</div>
      <div className='Search'>
        <form onSubmit='iop'>
           <input type="text"  className='search' placeholder='You Can Search Here'/>
           <button type='submit'>🔍</button> 
        </form>
      </div>
    </div>
    <div className="from12">

    <form onSubmit={myFormik.handleSubmit}> 
      <div className="inputs">
        <div className="inpt1">
          <span>
        <input
          id="productName"
          placeholder="Product Name"
          value={myFormik.values.productName}
          onChange={myFormik.handleChange}
        />
        </span>
        {
          (myFormik.touched.productName && Boolean(myFormik.errors.productName)) ?
            <span style={{ color: "red" }} className='err'>{myFormik.errors.productName}</span>
            :
            null
        }
</div>

<div className="input2">
<span>
        <input
          id="productPrice"
          placeholder="Product Price"
          value={myFormik.values.productPrice}
          onChange={myFormik.handleChange}
        />
        </span>
        {
          (myFormik.touched.productPrice && Boolean(myFormik.errors.productPrice)) ?
            <span style={{ color: "red" }} className='err'>{myFormik.errors.productPrice}</span>
            :
            null
        }

</div>

<div className="input3">
        <span>
        <input
          id="productDescription"
          placeholder="Product Description"
          value={myFormik.values.productDescription}
          onChange={myFormik.handleChange}
        />
        </span>
        {
          (myFormik.touched.productDescription && Boolean(myFormik.errors.productDescription)) ?
            <span style={{ color: "red" }} className='err'>{myFormik.errors.productDescription}</span>
            :
            null
        }
</div>
<div className='btn'>   <button type="submit"> Submit </button></div>
</div>
        
    
      </form>
    </div>



      <div>
      {products.map((eachProduct, i) => (

          <div className='post' key={eachProduct.id} style={{ border: "1px solid black", padding: 10, margin: 10, borderRadius: 15 }}>
            <div className='name'>{eachProduct.name}</div>
            <div className='id'>{eachProduct.id}</div>
            <div className='price'>{eachProduct.price}</div>
            <div className='desc'>{eachProduct.description}</div>

            <button onClick={() => {
              deleteProduct(eachProduct.id)
            }}>delete</button>

            <button onClick={() => {
              editMode(eachProduct)
            }}>edit</button>

            {(isEditMode && editingProduct.id === eachProduct.id) ?
              <div>

                <form onSubmit={editFormik.handleSubmit}>
                  <input
                    id="productName"
                    placeholder="Product Name"
                    value={editFormik.values.productName}
                    onChange={editFormik.handleChange}
                  />
                  {
                    (editFormik.touched.productName && Boolean(editFormik.errors.productName)) ?
                      <span style={{ color: "red" }}>{editFormik.errors.productName}</span>
                      :
                      null
                  }

                  <br />
                  <input
                    id="productPrice"
                    placeholder="Product Price"
                    value={editFormik.values.productPrice}
                    onChange={editFormik.handleChange}
                  />
                  {
                    (editFormik.touched.productPrice && Boolean(editFormik.errors.productPrice)) ?
                      <span style={{ color: "red" }}>{editFormik.errors.productPrice}</span>
                      :
                      null
                  }

                  <br />
                  <input
                    id="productDescription"
                    placeholder="Product Description"
                    value={editFormik.values.productDescription}
                    onChange={editFormik.handleChange}
                  />
                  {
                    (editFormik.touched.productDescription && Boolean(editFormik.errors.productDescription)) ?
                      <span style={{ color: "red" }}>{editFormik.errors.productDescription}</span>
                      :
                      null
                  }

                  <br />
                  <button type="submit"> Submit </button>
                </form>

              </div> : null}

          </div>
        ))}
      </div>


    </div>





  );
}

export default App;
