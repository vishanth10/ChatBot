import React from 'react';
import Chatbot from './Chatbot';
import DataIngestion from './DataInjection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Chatbot />} />
          <Route path="/datainjection" element={<DataIngestion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;






// import logo from './logo.svg';
// import './App.css';
// import React, { useState } from 'react';

// function App() {

//   const [companyResponse, setCompanyResponse] = useState('');
//   const [gptResponse, setGptResponse] = useState('');
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);

//   const getCompanyResponse = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const response = await fetch('http://localhost:8000/getApi', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ "query": query })
//     });
//     const data = await response.json();
//     setCompanyResponse(data);
//     setLoading(false);
//   }

//   const getGptResponse = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const response = await fetch('http://localhost:8000/getResponse', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ "query": query })
//     });
//     const data = await response.json();
//     setGptResponse(data);
//     setLoading(false);
//   }

//   return (
//     <div>
//       <form>
//         <label>Enter your query:</label><br></br>
//         <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} /><br></br>
//         <button type="submit" onClick={getCompanyResponse} >Get Company Response</button><br></br>
//         <button type="submit" onClick={getGptResponse} >Get GPT Response</button><br></br>
//       </form>
//       {loading ? <p>Loading...</p> : <p>{JSON.stringify(companyResponse)}</p>}
//       {loading ? <p>Loading...</p> : <p>{JSON.stringify(gptResponse)}</p>}
//     </div>
//   );
// }

// export default App;


