import { useState } from 'react';

const Form = () => {
  // 1. State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // 2. State for errors and success messages
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error when typing
  };

  // 3. Validation Logic (Step 3 in your plan)
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!emailRegex.test(formData.email)) tempErrors.email = "Valid email is required";
    if (formData.password.length < 6) tempErrors.password = "Password must be 6+ chars";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 4. Submit to Backend (Step 5 in your plan)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (validate()) {
      try {
        const response = await fetch('http://localhost:5000/v1/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (response.ok) {
          setSuccess(result.message);
          setFormData({ name: '', email: '', password: '' }); // Reset
        }
      } catch (err) {
        setErrors({ server: "Make sure your backend server is running!" });
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial' }}>
      <h2>Order Form</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {errors.server && <p style={{ color: 'red' }}>{errors.server}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>}
        </div>

        <div>
          <label>Email:</label><br />
          <input name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>Submit Order</button>
      </form>
    </div>
  );
};

export default Form;