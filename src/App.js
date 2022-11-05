import 'regenerator-runtime/runtime'
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Read, Submit, Review, About, Profile, ManuscriptView, PageNotFound } from './pages';
import { Navigator, Footer } from './components';


function App() {
  return (
    <>
      <BrowserRouter>
        <Navigator/>
        <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="read" element={<Read />} />
          <Route path="submit" element={<Submit />} />
          <Route path="review" element={<Review />} />
          <Route path="about" element={<About />} />
          <Route path="profile/:id" element={<Profile/>} />
          <Route path="manuscript/:m_id" element={<ManuscriptView/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </main>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
